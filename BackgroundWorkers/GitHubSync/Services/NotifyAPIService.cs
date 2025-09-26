using System.Net.Http.Json;
using Portfolio.Shared.Models;

namespace GitHubSync.Services;

public class NotifyAPIService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<NotifyAPIService> _logger;
    private readonly string _apiBaseUrl;

    public NotifyAPIService(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<NotifyAPIService> logger)
    {
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient();
        _apiBaseUrl = configuration["API:BaseUrl"] ?? "https://api.trustytea.me";
    }


    public async Task NotifyCommitDataUpdated(List<CommitData> commitData)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync($"{_apiBaseUrl}/api/notify/commit-data-updated", commitData);
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Notified API of commit data update");
            }
            else
            {
                _logger.LogWarning("Failed to notify API of commit data update: {StatusCode}", response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying API of commit data update");
        }
    }

    public async Task NotifyPersonalSummaryUpdated(string summary)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync($"{_apiBaseUrl}/api/notify/personal-summary-updated", new { summary });
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Notified API of personal summary update");
            }
            else
            {
                _logger.LogWarning("Failed to notify API of personal summary update: {StatusCode}", response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying API of personal summary update");
        }
    }

    public void DisposeAsync()
    {
        _httpClient?.Dispose();
    }
}
