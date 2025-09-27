using GitHubSync.Services;
using Portfolio.Shared.Models;
using Portfolio.Shared.Services;
using System.Net.Http.Json;

namespace GitHubSync.Workers;

public class GitHubDataWorker(
    IHttpClientFactory httpClientFactory,
    ILogger<GitHubDataWorker> logger,
    RedisService redisService,
    NotifyApiService notifyApiService,
    GitHubCommitService gitHubCommitService,
    IConfiguration configuration) {
    public async Task FetchAndStoreGitHubData() {
        HttpClient client = httpClientFactory.CreateClient("GitHub");
        HttpResponseMessage response = await client.GetAsync("https://api.github.com/users/ryanflorestt/repos");
        response.EnsureSuccessStatusCode();

        var repositories = await response.Content.ReadFromJsonAsync<List<GitHubRepository>>();
        if (repositories == null) return;

        DateTime periodStart = DateTime.UtcNow.AddDays(-90);
        DateTime periodEnd = DateTime.UtcNow;
        List<RepoData> repoDataList = [];

        foreach (GitHubRepository repo in repositories)
            try {
                string since = periodStart.ToString("o");
                var allCommits =
                    await gitHubCommitService.FetchAllCommitsForRepositoryAsync(client, repo.Name ?? string.Empty,
                        since);

                if (allCommits?.Count > 0)
                    repoDataList.Add(new RepoData {
                        Id = repo.Name?.GetHashCode() ?? 0,
                        RepositoryName = repo.Name ?? string.Empty,
                        RepositoryUrl = repo.HtmlUrl ?? string.Empty,
                        CommitCount = allCommits.Count,
                        LastUpdated = allCommits.Max(c => c.Commit?.Author?.Date ?? DateTime.MinValue),
                        PeriodStart = periodStart,
                        PeriodEnd = periodEnd
                    });
            }
            catch (Exception ex) {
                logger.LogWarning(ex, "Failed to fetch commits for repository {RepositoryName}", repo.Name);
            }

        repoDataList.Sort((a, b) => b.LastUpdated.CompareTo(a.LastUpdated));

        if (repoDataList.Count != 0) {
            await redisService.SetAsync("github:repos", repoDataList, TimeSpan.FromHours(2));

            foreach (RepoData? repo in repoDataList.Take(3))
                try {
                    string since = periodStart.ToString("o");
                    var commits =
                        await gitHubCommitService.FetchAllCommitsForRepositoryAsync(client, repo.RepositoryName, since);

                    if (commits?.Count > 0) {
                        var commitMessages = commits
                            .Where(c => !string.IsNullOrEmpty(c.Commit?.Message))
                            .Select(c => c.Commit!.Message!.Trim())
                            .Take(10)
                            .ToList();

                        await redisService.SetAsync($"github:commits:{repo.RepositoryName}", commitMessages,
                            TimeSpan.FromHours(2));
                        logger.LogInformation("Stored {Count} commit messages for {RepoName}", commitMessages.Count,
                            repo.RepositoryName);
                    }
                }
                catch (Exception ex) {
                    logger.LogWarning(ex, "Failed to store commit messages for {RepoName}", repo.RepositoryName);
                }

            await redisService.DeleteAsync("recent-commits-summary");

            await notifyApiService.NotifyCommitDataUpdated(repoDataList);

            await TriggerSummaryGeneration();

            logger.LogInformation("Updated commit data for {Count} repositories", repoDataList.Count);
        }
    }

    async Task TriggerSummaryGeneration() {
        try {
            string apiBaseUrl = configuration["API:BaseUrl"] ?? "http://portfolio-api-service";
            HttpClient client = httpClientFactory.CreateClient();

            // Trigger the commit summary regeneration
            HttpResponseMessage response = await client.PostAsync($"{apiBaseUrl}/regenerate-summary", null);

            if (response.IsSuccessStatusCode)
                logger.LogInformation("Successfully triggered recent commits summary generation");
            else
                logger.LogWarning("Failed to trigger summary generation: {StatusCode}", response.StatusCode);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error triggering summary generation");
        }
    }
}