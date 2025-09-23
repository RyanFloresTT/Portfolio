using System.Text.Json;
using API.Models;

namespace API.Services;

public class CommitAnalysisService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly RedisService _redisService;
    private readonly ILogger<CommitAnalysisService> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHubContext<PortfolioHub> _hubContext;

    public CommitAnalysisService(
        IHttpClientFactory httpClientFactory,
        RedisService redisService,
        ILogger<CommitAnalysisService> logger,
        IConfiguration configuration,
        IHubContext<PortfolioHub> hubContext)
    {
        _httpClientFactory = httpClientFactory;
        _redisService = redisService;
        _logger = logger;
        _configuration = configuration;
        _hubContext = hubContext;
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

            // Extract commit messages from the data (we'll need to modify the data structure)
            var recentRepos = commitData
                .OrderByDescending(c => c.LastUpdated)
                .Take(5)
                .Select(c => c.RepositoryName)
                .ToList();

            var prompt = $@"Analyze these recent repository activities and create a friendly, personal summary of what I've been working on.

Recent repositories with activity: {string.Join(", ", recentRepos)}

Create a natural, first-person summary like: 'Hi, I'm Ryan, I've been working on...' 
Keep it conversational and highlight the most interesting projects. 
Make it sound personal and engaging, around 2-3 sentences.";

            var ollamaUrl = _configuration["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434";
            var model = _configuration["Ollama:Model"] ?? "llama3.2";

            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(30); // Ollama can be slower

            var requestBody = new
            {
                model = model,
                prompt = prompt,
                stream = false,
                options = new
                {
                    temperature = 0.7,
                    max_tokens = 150
                }
            };

            var response = await client.PostAsJsonAsync($"{ollamaUrl}/api/generate", requestBody);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                var summary = result?.response?.Trim();
                
                if (!string.IsNullOrEmpty(summary))
                {
                    return summary;
                }
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
}

public class OllamaResponse
{
    public string? response { get; set; }
    public bool done { get; set; }
}
