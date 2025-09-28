using Portfolio.Shared.Models;
using Portfolio.Shared.Services;
using Portfolio.Shared.HttpClients;

namespace GitHubSync.Workers;

public class GitHubDataWorker(
    GitHubHttpClient gitHubClient,
    PortfolioHttpClient portfolioClient,
    ILogger<GitHubDataWorker> logger,
    RedisService redisService,
    IConfiguration configuration) {
    public async Task FetchAndStoreGitHubData() {
        int daysBack = configuration.GetValue("GitHubSync:DaysBack", 30);
        DateTime periodStart = DateTime.UtcNow.AddDays(-daysBack);
        DateTime periodEnd = DateTime.UtcNow;

        var repositories = await gitHubClient.GetRepositoriesAsync();

        List<RepoData> repoDataList = [];
        List<(string repoName, List<string> commitMessages)> topReposCommits = [];

        foreach (GitHubRepository repo in repositories)
            try {
                string since = periodStart.ToString("o");
                var allCommits =
                    await gitHubClient.GetCommitsAsync(repo.Name ?? string.Empty, since);

                if (!(allCommits?.Count > 0)) continue;

                RepoData repoData = new() {
                    Id = repo.Name?.GetHashCode() ?? 0,
                    RepositoryName = repo.Name ?? string.Empty,
                    RepositoryUrl = repo.HtmlUrl ?? string.Empty,
                    CommitCount = allCommits.Count,
                    LastUpdated = allCommits.Max(c => c.Commit?.Author?.Date ?? DateTime.MinValue),
                    PeriodStart = periodStart,
                    PeriodEnd = periodEnd
                };

                repoDataList.Add(repoData);

                var commitMessages = allCommits
                    .Where(c => !string.IsNullOrEmpty(c.Commit?.Message))
                    .Select(c => c.Commit!.Message!.Trim())
                    .Take(10)
                    .ToList();

                if (commitMessages.Count != 0) topReposCommits.Add((repo.Name ?? string.Empty, commitMessages));
            }
            catch (Exception ex) {
                logger.LogWarning(ex, "Failed to fetch commits for repository {RepositoryName}", repo.Name);
            }

        repoDataList.Sort((a, b) => b.LastUpdated.CompareTo(a.LastUpdated));

        if (repoDataList.Count != 0) {
            await redisService.SetAsync("github:repos", repoDataList, TimeSpan.FromHours(2));

            var topRepos = repoDataList.Take(3).ToList();
            foreach (RepoData repo in topRepos) {
                var repoCommits = topReposCommits.FirstOrDefault(x => x.repoName == repo.RepositoryName);

                if (repoCommits.commitMessages.Count == 0) continue;

                await redisService.SetAsync($"github:commits:{repo.RepositoryName}", repoCommits.commitMessages,
                    TimeSpan.FromHours(2));
                logger.LogInformation("Stored {Count} commit messages for {RepoName}",
                    repoCommits.commitMessages.Count, repo.RepositoryName);
            }

            await redisService.DeleteAsync("recent-commits-summary");

            await portfolioClient.NotifyCommitDataUpdated(repoDataList);

            logger.LogInformation("Updated commit data for {Count} repositories", repoDataList.Count);
        }
    }
}