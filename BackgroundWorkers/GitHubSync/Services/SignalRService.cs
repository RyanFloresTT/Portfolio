using Microsoft.AspNetCore.SignalR.Client;
using Portfolio.Shared.Models;

namespace GitHubSync.Services;

public class SignalRService
{
    private readonly HubConnection _connection;
    private readonly ILogger<SignalRService> _logger;

    public SignalRService(IConfiguration configuration, ILogger<SignalRService> logger)
    {
        _logger = logger;
        var hubUrl = configuration["SignalR:HubUrl"] ?? "http://localhost:5220/portfolioHub";
        
        _connection = new HubConnectionBuilder()
            .WithUrl(hubUrl)
            .Build();

        _connection.Closed += async (error) =>
        {
            _logger.LogWarning("SignalR connection closed: {Error}", error?.Message);
            await Task.Delay(new Random().Next(0, 5) * 1000);
            await StartConnection();
        };
    }

    public async Task StartConnection()
    {
        try
        {
            await _connection.StartAsync();
            _logger.LogInformation("SignalR connection started");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting SignalR connection");
        }
    }

    public async Task NotifyCommitDataUpdated(List<CommitData> commitData)
    {
        try
        {
            if (_connection.State == HubConnectionState.Connected)
            {
                await _connection.InvokeAsync("CommitDataUpdated", commitData);
                _logger.LogInformation("Notified clients of commit data update");
            }
            else
            {
                _logger.LogWarning("SignalR connection not connected, cannot notify clients");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying clients of commit data update");
        }
    }

    public async Task NotifyPersonalSummaryUpdated(string summary)
    {
        try
        {
            if (_connection.State == HubConnectionState.Connected)
            {
                await _connection.InvokeAsync("PersonalSummaryUpdated", summary);
                _logger.LogInformation("Notified clients of personal summary update");
            }
            else
            {
                _logger.LogWarning("SignalR connection not connected, cannot notify clients");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying clients of personal summary update");
        }
    }

    public async Task DisposeAsync()
    {
        await _connection.DisposeAsync();
    }
}
