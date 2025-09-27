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
            var repoData = await redisService.GetAsync<List<RepoData>>("github:repos");
            if (repoData == null || repoData.Count == 0)
                return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";

            string ollamaUrl = configuration["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434";
            HttpClient healthClient = httpClientFactory.CreateClient();
            healthClient.Timeout = TimeSpan.FromSeconds(5);

            try {
                HttpResponseMessage healthResponse = await healthClient.GetAsync($"{ollamaUrl}/api/tags");
                if (!healthResponse.IsSuccessStatusCode) {
                    logger.LogWarning("Ollama health check failed, using fallback summary");
                    return CreateFallbackSummary(repoData);
                }
            }
            catch (Exception healthEx) {
                logger.LogWarning(healthEx, "Ollama is not available, using fallback summary");
                return CreateFallbackSummary(repoData);
            }

            var recentRepos = repoData
                .OrderByDescending(c => c.LastUpdated)
                .Take(3)
                .ToList();

            var commitDetails = new List<string>();

            foreach (RepoData repo in recentRepos)
                try {
                    var commitMessages =
                        await redisService.GetAsync<List<string>>($"github:commits:{repo.RepositoryName}");
                    if (commitMessages?.Count > 0) {
                        var recentCommits = commitMessages.Take(3).ToList();
                        commitDetails.Add($"{repo.RepositoryName}: {string.Join(", ", recentCommits)}");
                    }
                }
                catch (Exception ex) {
                    logger.LogWarning(ex, "Failed to fetch commit messages for {RepoName}", repo.RepositoryName);
                }

            logger.LogInformation("Commit details for AI prompt: {CommitDetails}", string.Join(" | ", commitDetails));

            if (commitDetails.Count == 0) {
                commitDetails = recentRepos.Select(r => $"{r.RepositoryName}: Recent updates").ToList();
                logger.LogWarning("No commit details found, using repository names as fallback");
            }

            try {
                string aiSummary = await GenerateAISummary(commitDetails);
                if (!string.IsNullOrEmpty(aiSummary) && aiSummary.Length > 20) {
                    logger.LogInformation("Successfully generated AI summary: {Summary}", aiSummary);
                    return aiSummary;
                }
            }
            catch (Exception aiEx) {
                logger.LogWarning(aiEx, "AI generation failed, using fallback");
            }

            return CreateFormattedFallbackSummary(commitDetails);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error generating personal summary");
            return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";
        }
    }

    public async Task InvalidateSummaryCacheAsync() {
        await redisService.DeleteAsync("ai:summary");

        string newSummary = await GeneratePersonalSummaryAsync();
        await redisService.SetAsync("ai:summary", newSummary, TimeSpan.FromHours(24));

        await hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", newSummary);

        logger.LogInformation("Personal summary updated and broadcasted to clients");
    }

    async Task<string> GenerateAISummary(List<string> commitDetails) {
        string ollamaUrl = configuration["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434";
        string model = configuration["Ollama:Model"] ?? "tinyllama";
        HttpClient client = httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(120); // Increased timeout

        string context = string.Join(" | ", commitDetails);
        string prompt = $"Based on my recent work: {context}. I've been working on";

        var requestBody = new {
            model = model,
            prompt = prompt,
            stream = false,
            options = new {
                temperature = 0.7, // Slightly higher for better responses
                num_predict = 30, // Shorter response to reduce processing time
                top_p = 0.9,
                top_k = 40
            }
        };

        try {
            logger.LogInformation("Sending request to Ollama: {Url} with model: {Model}", $"{ollamaUrl}/api/generate", model);
            logger.LogInformation("Prompt: {Prompt}", prompt);
            
            HttpResponseMessage response = await client.PostAsJsonAsync($"{ollamaUrl}/api/generate", requestBody);
            
            logger.LogInformation("Ollama response status: {StatusCode}", response.StatusCode);

            if (response.IsSuccessStatusCode) {
                OllamaResponse? result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
                string? summary = result?.response?.Trim();

                if (string.IsNullOrEmpty(summary)) {
                    logger.LogWarning("Empty response from Ollama");
                    return string.Empty;
                }
                
                summary = summary.Trim('"', '\'', '`').Trim();
                logger.LogInformation("Ollama generated summary: {Summary}", summary);

                if (summary.StartsWith("I've been working on", StringComparison.OrdinalIgnoreCase)) {
                    return summary;
                } else {
                    logger.LogWarning("Summary doesn't start with expected prefix: {Summary}", summary);
                    return string.Empty;
                }
            } else {
                string errorContent = await response.Content.ReadAsStringAsync();
                logger.LogError("Ollama request failed with status {StatusCode}: {Error}", response.StatusCode, errorContent);
                return string.Empty;
            }
        }
        catch (TaskCanceledException ex) {
            logger.LogError(ex, "Ollama request timed out after {Timeout} seconds", client.Timeout.TotalSeconds);
            return string.Empty;
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error calling Ollama API");
            return string.Empty;
        }
    }

    string CreateFallbackSummary(List<RepoData> commitData) {
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