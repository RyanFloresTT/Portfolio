using System.Net.Http.Json;
using Portfolio.Shared.Models;

namespace GitHubSync.Services;

public class NotifyApiService(
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    ILogger<NotifyApiService> logger) {
    readonly HttpClient httpClient = httpClientFactory.CreateClient();
    readonly string apiBaseUrl = configuration["API:BaseUrl"] ?? "http://portfolio-api-service";


    public async Task NotifyCommitDataUpdated(List<RepoData> commitData) {
        try {
            HttpResponseMessage response =
                await httpClient.PostAsJsonAsync($"{apiBaseUrl}/notify/commit-data-updated", commitData);
            if (response.IsSuccessStatusCode)
                logger.LogInformation("Notified API of commit data update");
            else
                logger.LogWarning("Failed to notify API of commit data update: {StatusCode}", response.StatusCode);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error notifying API of commit data update");
        }
    }

    public ValueTask DisposeAsync() {
        httpClient.Dispose();
        return ValueTask.CompletedTask;
    }
}