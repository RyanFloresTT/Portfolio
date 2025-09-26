using GitHubSync.Services;
using Portfolio.Shared.Models;
using Portfolio.Shared.Services;
using System.Net.Http.Json;

namespace GitHubSync.Workers;

public class GitHubDataWorker(
    IHttpClientFactory httpClientFactory,
    ILogger<GitHubDataWorker> logger,
    RedisService redisService,
    NotifyApiService signalRService,
    GitHubCommitService gitHubCommitService) {
    public async Task FetchAndStoreGitHubData() {
        HttpClient client = httpClientFactory.CreateClient("GitHub");
        HttpResponseMessage response = await client.GetAsync("https://api.github.com/users/ryanflorestt/repos");
        response.EnsureSuccessStatusCode();

        var repositories = await response.Content.ReadFromJsonAsync<List<GitHubRepository>>();
        if (repositories == null) return;

        DateTime periodStart = DateTime.UtcNow.AddDays(-90);
        DateTime periodEnd = DateTime.UtcNow;
        var commitDataList = new List<CommitData>();

        foreach (GitHubRepository repo in repositories)
            try {
                string since = periodStart.ToString("o");
                var allCommits =
                    await gitHubCommitService.FetchAllCommitsForRepositoryAsync(client, repo.Name ?? string.Empty,
                        since);

                if (allCommits?.Count > 0)
                    commitDataList.Add(new CommitData {
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

        commitDataList.Sort((a, b) => b.LastUpdated.CompareTo(a.LastUpdated));

        if (commitDataList.Count != 0) {
            await redisService.SetAsync("github:commits", commitDataList, TimeSpan.FromHours(2));

            await redisService.DeleteAsync("ai:summary");

            await signalRService.NotifyCommitDataUpdated(commitDataList);

            logger.LogInformation("Updated commit data for {Count} repositories", commitDataList.Count);
        }
    }
}