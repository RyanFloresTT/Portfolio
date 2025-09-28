using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using Portfolio.Shared.Models;

namespace Portfolio.Shared.HttpClients;

public class PortfolioHttpClient(HttpClient httpClient, ILogger<GitHubHttpClient> logger) {
    public async Task NotifyCommitDataUpdated(List<RepoData> commitData) {
        try {
            HttpResponseMessage response =
                await httpClient.PostAsJsonAsync($"/notify/commit-data-updated", commitData);
            if (response.IsSuccessStatusCode)
                logger.LogInformation("Notified API of commit data update");
            else
                logger.LogWarning("Failed to notify API of commit data update: {StatusCode}", response.StatusCode);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error notifying API of commit data update");
        }
    }
}