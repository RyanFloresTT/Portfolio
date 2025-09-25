using System.Net;
using API.Models;
using API.Data;
using API.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

namespace API.Services;

public class GitHubDataService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<GitHubDataService> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHubContext<PortfolioHub> _hubContext;
    private readonly RedisService _redisService;
    private readonly CommitAnalysisService _commitAnalysisService;

    public GitHubDataService(
        IServiceProvider serviceProvider,
        ILogger<GitHubDataService> logger,
        IConfiguration configuration,
        IHubContext<PortfolioHub> hubContext,
        RedisService redisService,
        CommitAnalysisService commitAnalysisService)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _configuration = configuration;
        _hubContext = hubContext;
        _redisService = redisService;
        _commitAnalysisService = commitAnalysisService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await FetchAndStoreGitHubData();
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Run every hour
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching GitHub data");
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // Retry in 5 minutes on error
            }
        }
    }

    public async Task FetchAndStoreGitHubData()
    {
        using var scope = _serviceProvider.CreateScope();
        var httpClientFactory = scope.ServiceProvider.GetRequiredService<IHttpClientFactory>();

        var client = httpClientFactory.CreateClient("GitHub");
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
                var commitsUrl = repo.CommitsUrl?.Replace("{/sha}", $"?since={since}");

                if (string.IsNullOrEmpty(commitsUrl))
                    continue;
                    
                var commitsResponse = await client.GetAsync(commitsUrl);

                switch (commitsResponse.StatusCode)
                {
                    case HttpStatusCode.Conflict:
                    case HttpStatusCode.UnavailableForLegalReasons:
                        continue;
                }

                commitsResponse.EnsureSuccessStatusCode();
                var commits = await commitsResponse.Content.ReadFromJsonAsync<List<GitHubCommit>>();

                if (commits?.Count > 0)
                {
                    commitDataList.Add(new CommitData
                    {
                        Id = repo.Name?.GetHashCode() ?? 0, // Generate stable unique ID based on repo name
                        RepositoryName = repo.Name ?? string.Empty,
                        RepositoryUrl = repo.HtmlUrl ?? string.Empty,
                        CommitCount = commits.Count,
                        LastUpdated = commits.Max(c => c.Commit?.Author?.Date ?? DateTime.MinValue),
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
            await _commitAnalysisService.InvalidateCacheAsync();

            // Notify clients via SignalR
            await _hubContext.Clients.All.SendAsync("CommitDataUpdated", commitDataList);
            
            _logger.LogInformation("Updated commit data for {Count} repositories", commitDataList.Count);
        }
    }
}
