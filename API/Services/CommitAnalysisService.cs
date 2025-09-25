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
    private readonly GitHubCommitService _gitHubCommitService;

    public CommitAnalysisService(
        IHttpClientFactory httpClientFactory,
        RedisService redisService,
        ILogger<CommitAnalysisService> logger,
        IConfiguration configuration,
        IHubContext<PortfolioHub> hubContext,
        IServiceProvider serviceProvider,
        GitHubCommitService gitHubCommitService)
    {
        _httpClientFactory = httpClientFactory;
        _redisService = redisService;
        _logger = logger;
        _configuration = configuration;
        _hubContext = hubContext;
        _serviceProvider = serviceProvider;
        _gitHubCommitService = gitHubCommitService;
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
        
        // Send SignalR update for new summary
        await _hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", summary);
        
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
                    return CreateFallbackSummary(commitData);
                }
            }
            catch (Exception healthEx)
            {
                _logger.LogWarning(healthEx, "Ollama is not available, using fallback summary");
                return CreateFallbackSummary(commitData);
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

            // Format commit details with proper line breaks for better readability
            var formattedCommitDetails = string.Join("\n\n", commitDetails.Select(c => 
            {
                var parts = c.Split(':', 2);
                if (parts.Length == 2)
                {
                    return $"{parts[0]}: {parts[1]}";
                }
                return c;
            }));
            
            // Log the commit details for debugging
            _logger.LogInformation("Commit details for AI prompt: {CommitDetails}", string.Join(" | ", commitDetails));
            
            // If no commit details, use repository names as fallback
            if (!commitDetails.Any())
            {
                commitDetails = recentRepos.Select(r => $"{r.RepositoryName}: Recent updates").ToList();
                _logger.LogWarning("No commit details found, using repository names as fallback");
            }
            
            // Try AI first, with robust fallback
            try
            {
                var aiSummary = await GenerateAISummary(ollamaUrl, commitDetails);
                if (!string.IsNullOrEmpty(aiSummary) && aiSummary.Length > 20)
                {
                    _logger.LogInformation("Successfully generated AI summary: {Summary}", aiSummary);
                    return aiSummary;
                }
            }
            catch (Exception aiEx)
            {
                _logger.LogWarning(aiEx, "AI generation failed, using fallback");
            }
            
            // Fallback to formatted template-based response
            return CreateFormattedFallbackSummary(commitDetails);
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
            "As a recent addition to my team, I'm proud to share that I've been working on",
            "As a recent addition to my portfolio, I'm proud to present my latest work:",
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

    private async Task<string> GenerateAISummary(string ollamaUrl, List<string> commitDetails)
    {
        var model = _configuration["Ollama:Model"] ?? "tinyllama";
        
        // Much simpler, more direct prompt that should work better
        var prompt = $"Write one sentence starting with 'I've been working on' using these projects: {string.Join(", ", commitDetails.Take(3).Select(c => c.Split(':')[0]))}";

        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(30); // Shorter timeout

        var requestBody = new
        {
            model = model,
            prompt = prompt,
            stream = false,
            options = new
            {
                temperature = 0.2, // Very low temperature for consistency
                num_predict = 50,  // Very short response
                top_p = 0.8,
                top_k = 20
            }
        };

        var response = await client.PostAsJsonAsync($"{ollamaUrl}/api/generate", requestBody);
        
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
            var summary = result?.response?.Trim();
            
            if (!string.IsNullOrEmpty(summary))
            {
                // Simple cleanup - just remove quotes and trim
                summary = summary.Trim('"', '\'', '`').Trim();
                
                // Basic validation - must start with "I've been working on"
                if (summary.StartsWith("I've been working on", StringComparison.OrdinalIgnoreCase))
                {
                    return summary;
                }
            }
        }
        
        return string.Empty; // Will trigger fallback
    }

    private string CreateFallbackSummary(List<CommitData> commitData)
    {
        var recentRepos = commitData
            .OrderByDescending(c => c.LastUpdated)
            .Take(3)
            .Select(r => r.RepositoryName)
            .ToList();
            
        return $"I've been working on {string.Join(", ", recentRepos)} and other exciting projects.";
    }

    private string CreateFormattedFallbackSummary(List<string> commitDetails)
    {
        var projectNames = commitDetails.Take(3).Select(c => c.Split(':')[0]).Distinct().ToList();
        var summary = $"What I've been working on:\n\n";
        
        foreach (var detail in commitDetails.Take(3))
        {
            var parts = detail.Split(':', 2);
            if (parts.Length == 2)
            {
                summary += $"{parts[0]}: {parts[1]}\n\n";
            }
        }
        
        return summary.TrimEnd();
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
            var allCommits = await _gitHubCommitService.FetchAllCommitsForRepositoryAsync(client, repositoryName, since);
            
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

}

public class OllamaResponse
{
    public string? response { get; set; }
    public bool done { get; set; }
}
