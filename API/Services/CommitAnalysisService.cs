using API.Hubs;
using Portfolio.Shared.Models;
using Microsoft.AspNetCore.SignalR;
using Portfolio.Shared.Services;

namespace API.Services;

public class CommitAnalysisService(
    IHttpClientFactory httpClientFactory,
    RedisService redisService,
    ILogger<CommitAnalysisService> logger,
    IConfiguration configuration,
    IHubContext<PortfolioHub> hubContext) {
    public async Task<string> GetPersonalSummaryAsync() {
        string? cachedSummary = await redisService.GetAsync<string>("ai:summary");
        if (!string.IsNullOrEmpty(cachedSummary)) return cachedSummary;

        string summary = await GeneratePersonalSummaryAsync();

        await redisService.SetAsync("ai:summary", summary, TimeSpan.FromHours(24));

        await hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", summary);

        return summary;
    }

    async Task<string> GeneratePersonalSummaryAsync() {
        try {
            var commitData = await redisService.GetAsync<List<CommitData>>("github:commits");
            if (commitData == null || commitData.Count == 0)
                return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";

            string ollamaUrl = configuration["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434";
            HttpClient healthClient = httpClientFactory.CreateClient();
            healthClient.Timeout = TimeSpan.FromSeconds(5);

            try {
                HttpResponseMessage healthResponse = await healthClient.GetAsync($"{ollamaUrl}/api/tags");
                if (!healthResponse.IsSuccessStatusCode) {
                    logger.LogWarning("Ollama health check failed, using fallback summary");
                    return CreateFallbackSummary(commitData);
                }
            }
            catch (Exception healthEx) {
                logger.LogWarning(healthEx, "Ollama is not available, using fallback summary");
                return CreateFallbackSummary(commitData);
            }

            // Get detailed commit information for analysis
            var recentRepos = commitData
                .OrderByDescending(c => c.LastUpdated)
                .Take(3)
                .ToList();

            var commitDetails = new List<string>();

            // Fetch actual commit messages for each repository
            foreach (CommitData repo in recentRepos)
                try {
                    var commits = await redisService.GetAsync<List<CommitData>>("github:commits");
                    commitDetails.Add($"{repo.RepositoryName}: {string.Join(", ", (commits ?? []).Take(3))}");
                }
                catch (Exception ex) {
                    logger.LogWarning(ex, "Failed to fetch commits for {RepoName}", repo.RepositoryName);
                }

            // Log the commit details for debugging
            logger.LogInformation("Commit details for AI prompt: {CommitDetails}", string.Join(" | ", commitDetails));

            // If no commit details, use repository names as fallback
            if (commitDetails.Count == 0) {
                commitDetails = recentRepos.Select(r => $"{r.RepositoryName}: Recent updates").ToList();
                logger.LogWarning("No commit details found, using repository names as fallback");
            }

            // Try AI first, with robust fallback
            try {
                string aiSummary = await GenerateAISummary();
                if (!string.IsNullOrEmpty(aiSummary) && aiSummary.Length > 20) {
                    logger.LogInformation("Successfully generated AI summary: {Summary}", aiSummary);
                    return aiSummary;
                }
            }
            catch (Exception aiEx) {
                logger.LogWarning(aiEx, "AI generation failed, using fallback");
            }

            // Fallback to formatted template-based response
            return CreateFormattedFallbackSummary(commitDetails);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error generating personal summary");
            return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";
        }
    }

    public async Task InvalidateCacheAsync() {
        await redisService.DeleteAsync("ai:summary");

        // Generate new summary and notify clients
        string newSummary = await GeneratePersonalSummaryAsync();
        await redisService.SetAsync("ai:summary", newSummary, TimeSpan.FromHours(24));

        // Send SignalR update
        await hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", newSummary);

        logger.LogInformation("Personal summary updated and broadcasted to clients");
    }

    async Task<string> GenerateAISummary() {
        string ollamaUrl = configuration["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434";

        HttpClient client = httpClientFactory.CreateClient();
        var requestBody = new {
            stream = false,
            options = new {
                temperature = 0.2, // Very low temperature for consistency
                num_predict = 50, // Very short response
                top_p = 0.8,
                top_k = 20
            }
        };

        HttpResponseMessage response = await client.PostAsJsonAsync($"{ollamaUrl}/api/generate", requestBody);

        if (response.IsSuccessStatusCode) {
            OllamaResponse? result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
            string? summary = result?.response?.Trim();

            if (!string.IsNullOrEmpty(summary)) {
                // Simple cleanup - just remove quotes and trim
                summary = summary.Trim('"', '\'', '`').Trim();

                // Basic validation - must start with "I've been working on"
                if (summary.StartsWith("I've been working on", StringComparison.OrdinalIgnoreCase)) return summary;
            }
        }

        return string.Empty; // Will trigger fallback
    }

    string CreateFallbackSummary(List<CommitData> commitData) {
        var recentRepos = commitData
            .OrderByDescending(c => c.LastUpdated)
            .Take(3)
            .Select(r => r.RepositoryName)
            .ToList();

        return $"I've been working on {string.Join(", ", recentRepos)} and other exciting projects.";
    }

    string CreateFormattedFallbackSummary(List<string> commitDetails) {
        string summary = $"What I've been working on:\n\n";

        foreach (string detail in commitDetails.Take(3)) {
            string[] parts = detail.Split(':', 2);
            if (parts.Length == 2) summary += $"{parts[0]}: {parts[1]}\n\n";
        }

        return summary.TrimEnd();
    }
}

public class OllamaResponse {
    public string? response { get; set; }
    public bool done { get; set; }
}