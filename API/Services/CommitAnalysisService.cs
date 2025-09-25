using System.Text.Json;
using API.Hubs;
using API.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

namespace API.Services;

public class CommitAnalysisService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly RedisService _redisService;
    private readonly ILogger<CommitAnalysisService> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHubContext<PortfolioHub> _hubContext;
    private readonly IServiceProvider _serviceProvider;

    public CommitAnalysisService(
        IHttpClientFactory httpClientFactory,
        RedisService redisService,
        ILogger<CommitAnalysisService> logger,
        IConfiguration configuration,
        IHubContext<PortfolioHub> hubContext,
        IServiceProvider serviceProvider)
    {
        _httpClientFactory = httpClientFactory;
        _redisService = redisService;
        _logger = logger;
        _configuration = configuration;
        _hubContext = hubContext;
        _serviceProvider = serviceProvider;
    }

    public async Task<string> GetPersonalSummaryAsync()
    {
        // Check if we have a cached summary
        var cachedSummary = await _redisService.GetAsync<string>("ai:summary");
        if (!string.IsNullOrEmpty(cachedSummary))
        {
            return cachedSummary;
        }

        // Generate new summary
        var summary = await GeneratePersonalSummaryAsync();
        
        // Cache for 24 hours
        await _redisService.SetAsync("ai:summary", summary, TimeSpan.FromHours(24));
        
        return summary;
    }

    private async Task<string> GeneratePersonalSummaryAsync()
    {
        try
        {
            // Get recent commit data from Redis
            var commitData = await _redisService.GetAsync<List<CommitData>>("github:commits");
            if (commitData == null || !commitData.Any())
            {
                return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";
            }

            // Check if Ollama is available
            var ollamaUrl = _configuration["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434";
            var healthClient = _httpClientFactory.CreateClient();
            healthClient.Timeout = TimeSpan.FromSeconds(5);
            
            try
            {
                var healthResponse = await healthClient.GetAsync($"{ollamaUrl}/api/tags");
                if (!healthResponse.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Ollama health check failed, using fallback summary");
                    return $"Hi, I'm Ryan! I've been actively working on {string.Join(", ", commitData.Take(3).Select(c => c.RepositoryName))} and other exciting projects. Check out my repositories to see what I've been building!";
                }
            }
            catch (Exception healthEx)
            {
                _logger.LogWarning(healthEx, "Ollama is not available, using fallback summary");
                return $"Hi, I'm Ryan! I've been actively working on {string.Join(", ", commitData.Take(3).Select(c => c.RepositoryName))} and other exciting projects. Check out my repositories to see what I've been building!";
            }

            // Get detailed commit information for analysis
            var recentRepos = commitData
                .OrderByDescending(c => c.LastUpdated)
                .Take(3)
                .ToList();

            var commitDetails = new List<string>();
            
            // Fetch actual commit messages for each repository
            foreach (var repo in recentRepos)
            {
                try
                {
                    var commits = await FetchRecentCommits(repo.RepositoryName);
                    if (commits?.Any() == true)
                    {
                        commitDetails.Add($"{repo.RepositoryName}: {string.Join(", ", commits.Take(3))}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to fetch commits for {RepoName}", repo.RepositoryName);
                }
            }

            var prompt = $@"Write a casual first-person summary of recent work. Start directly with what I've been working on. No introductions, no Here's or I've been - just the work itself.

Recent commits:
{string.Join("\n", commitDetails)}

Based on these commits, describe what I've been building and fixing. Be specific about the work done.";

            var model = _configuration["Ollama:Model"] ?? "latest";

                    var client = _httpClientFactory.CreateClient();
                    client.Timeout = TimeSpan.FromMinutes(2);

                    var requestBody = new
                    {
                        model = model,
                        prompt = prompt,
                        stream = false,
                        options = new
                        {
                            temperature = 0.3, // Lower temperature for more focused responses
                            num_predict = 200 // Allow for more detailed responses
                        }
                    };

            _logger.LogInformation("Calling Ollama API at {OllamaUrl} with model {Model}", ollamaUrl, model);
            
            var response = await client.PostAsJsonAsync($"{ollamaUrl}/api/generate", requestBody);
            
            _logger.LogInformation("Ollama API response status: {StatusCode}", response.StatusCode);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                var summary = result?.response?.Trim();
                
                if (!string.IsNullOrEmpty(summary))
                {
                    // Clean up the response
                    summary = CleanUpResponse(summary);
                    _logger.LogInformation("Successfully generated AI summary: {Summary}", summary);
                    return summary;
                }
                else
                {
                    _logger.LogWarning("Ollama returned empty response");
                }
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Ollama API error {StatusCode}: {Error}", response.StatusCode, errorContent);
            }

            // Fallback if API fails
            return $"Hi, I'm Ryan! I've been actively working on {string.Join(", ", recentRepos.Take(3))} and other exciting projects. Check out my repositories to see what I've been building!";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating personal summary");
            return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";
        }
    }

    public async Task InvalidateCacheAsync()
    {
        await _redisService.DeleteAsync("ai:summary");
        
        // Generate new summary and notify clients
        var newSummary = await GeneratePersonalSummaryAsync();
        await _redisService.SetAsync("ai:summary", newSummary, TimeSpan.FromHours(24));
        
        // Send SignalR update
        await _hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", newSummary);
        
        _logger.LogInformation("Personal summary updated and broadcasted to clients");
    }

    private string CleanUpResponse(string response)
    {
        response = response.Trim();
        
        if (response.StartsWith("\"") && response.EndsWith("\""))
        {
            response = response.Substring(1, response.Length - 2);
        }
        
        // Remove common AI prefixes
        var prefixes = new[]
        {
            "Here's a friendly, personal summary of your recent repository activities:",
            "Here's a brief, casual first-person summary:",
            "Here's what I've been working on:",
            "Here's a summary:",
            "Here's what I've been up to:",
            "Here's my recent work:",
            "Here's a brief summary:",
            "Here's what I've been doing:",
            "Here's my recent activity:",
            "Here's what I've been building:"
        };
        
        foreach (var prefix in prefixes)
        {
            if (response.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            {
                response = response.Substring(prefix.Length).Trim();
                // Remove leading quote if present
                if (response.StartsWith("\""))
                {
                    response = response.Substring(1);
                }
                break;
            }
        }
        
        // Remove trailing quotes and periods if they seem excessive
        if (response.EndsWith("\""))
        {
            response = response.Substring(0, response.Length - 1);
        }
        
        // Ensure it ends with a period
        if (!response.EndsWith(".") && !response.EndsWith("!") && !response.EndsWith("?"))
        {
            response += ".";
        }
        
        return response.Trim();
    }

    private async Task<List<string>?> FetchRecentCommits(string repositoryName)
    {
        try
        {
            var httpClientFactory = _serviceProvider.GetRequiredService<IHttpClientFactory>();
            var client = httpClientFactory.CreateClient("GitHub");
            
            var periodStart = DateTime.UtcNow.AddDays(-90);
            var since = periodStart.ToString("o");
            
            // Get all commits for the specific repository within the time period
            var allCommits = await FetchAllCommitsForRepository(client, repositoryName, since);
            
            if (allCommits?.Any() == true)
            {
                return allCommits
                    .Where(c => c.Commit?.Message != null)
                    .Select(c => c.Commit?.Message?.Split('\n')[0] ?? string.Empty) // Get first line of commit message
                    .Where(msg => !string.IsNullOrWhiteSpace(msg))
                    .Take(5) // Limit to 5 most recent for summary
                    .ToList();
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to fetch commits for repository {RepositoryName}", repositoryName);
        }
        
        return null;
    }

    private async Task<List<GitHubCommit>?> FetchAllCommitsForRepository(HttpClient client, string repositoryName, string since)
    {
        var allCommits = new List<GitHubCommit>();
        var page = 1;
        const int perPage = 100; // Maximum allowed by GitHub API
        
        while (true)
        {
            try
            {
                var commitsUrl = $"https://api.github.com/repos/ryanflorestt/{repositoryName}/commits?since={since}&per_page={perPage}&page={page}";
                var response = await client.GetAsync(commitsUrl);
                
                if (!response.IsSuccessStatusCode)
                {
                    if (page == 1)
                    {
                        _logger.LogWarning("Failed to fetch commits for repository {RepositoryName}: {StatusCode}", repositoryName, response.StatusCode);
                    }
                    break;
                }
                
                var commits = await response.Content.ReadFromJsonAsync<List<GitHubCommit>>();

                if (commits == null || commits.Count == 0)
                {
                    // No more commits on this page, we're done
                    break;
                }

                allCommits.AddRange(commits);
                
                // If we got fewer commits than requested, we've reached the end
                if (commits.Count < perPage)
                {
                    break;
                }
                
                page++;
                
                // Safety check to prevent infinite loops
                if (page > 100)
                {
                    _logger.LogWarning("Reached maximum page limit for repository {RepositoryName}", repositoryName);
                    break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to fetch commits for repository {RepositoryName} on page {Page}", repositoryName, page);
                break;
            }
        }
        
        return allCommits.Any() ? allCommits : null;
    }
}

public class OllamaResponse
{
    public string? response { get; set; }
    public bool done { get; set; }
}
