using GitHubSync.Services;
using Portfolio.Shared.Models;
using Portfolio.Shared.Services;
using System.Net.Http.Json;

namespace GitHubSync.Workers;

public class GitHubDataWorker
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GitHubDataWorker> _logger;
    private readonly RedisService _redisService;
    private readonly SignalRService _signalRService;
    private readonly GitHubCommitService _gitHubCommitService;

    public GitHubDataWorker(
        IHttpClientFactory httpClientFactory,
        ILogger<GitHubDataWorker> logger,
        RedisService redisService,
        SignalRService signalRService,
        GitHubCommitService gitHubCommitService)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _redisService = redisService;
        _signalRService = signalRService;
        _gitHubCommitService = gitHubCommitService;
    }

    public async Task FetchAndStoreGitHubData()
    {
        var client = _httpClientFactory.CreateClient("GitHub");
        var response = await client.GetAsync("https://api.github.com/users/ryanflorestt/repos");
        response.EnsureSuccessStatusCode();
        
        var repositories = await response.Content.ReadFromJsonAsync<List<GitHubRepository>>();
        if (repositories == null) return;

        var periodStart = DateTime.UtcNow.AddDays(-90);
        var periodEnd = DateTime.UtcNow;
        var commitDataList = new List<CommitData>();

        foreach (var repo in repositories)
        {
            try
            {
                var since = periodStart.ToString("o");
                var allCommits = await _gitHubCommitService.FetchAllCommitsForRepositoryAsync(client, repo.Name ?? string.Empty, since);
                
                if (allCommits?.Count > 0)
                {
                    commitDataList.Add(new CommitData
                    {
                        Id = repo.Name?.GetHashCode() ?? 0,
                        RepositoryName = repo.Name ?? string.Empty,
                        RepositoryUrl = repo.HtmlUrl ?? string.Empty,
                        CommitCount = allCommits.Count,
                        LastUpdated = allCommits.Max(c => c.Commit?.Author?.Date ?? DateTime.MinValue),
                        PeriodStart = periodStart,
                        PeriodEnd = periodEnd
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to fetch commits for repository {RepositoryName}", repo.Name);
            }
        }

        commitDataList.Sort((a, b) => b.LastUpdated.CompareTo(a.LastUpdated));

        // Store in Redis
        if (commitDataList.Any())
        {
            // Store commit data in Redis
            await _redisService.SetAsync("github:commits", commitDataList, TimeSpan.FromHours(2));
            
            // Invalidate AI summary cache to trigger new analysis
            await _redisService.DeleteAsync("ai:summary");

            // Notify clients via SignalR
            await _signalRService.NotifyCommitDataUpdated(commitDataList);
            
            _logger.LogInformation("Updated commit data for {Count} repositories", commitDataList.Count);
        }
    }
}
