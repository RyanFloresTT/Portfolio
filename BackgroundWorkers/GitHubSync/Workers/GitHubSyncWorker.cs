using GitHubSync.Services;
using API.Models;
using API.Services;

namespace GitHubSync.Workers;

public class GitHubSyncWorker : BackgroundService
{
    private readonly ILogger<GitHubSyncWorker> _logger;
    private readonly GitHubDataWorker _gitHubDataWorker;
    private readonly SignalRService _signalRService;

    public GitHubSyncWorker(
        ILogger<GitHubSyncWorker> logger,
        GitHubDataWorker gitHubDataWorker,
        SignalRService signalRService)
    {
        _logger = logger;
        _gitHubDataWorker = gitHubDataWorker;
        _signalRService = signalRService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Start SignalR connection
        await _signalRService.StartConnection();

        // Run once and exit (CronJob handles scheduling)
        await DoWork();
    }

    private async Task DoWork()
    {
        try
        {
            _logger.LogInformation("Starting GitHub data sync at: {Time}", DateTimeOffset.Now);
            
            await _gitHubDataWorker.FetchAndStoreGitHubData();
            
            _logger.LogInformation("GitHub data sync completed at: {Time}", DateTimeOffset.Now);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during GitHub data sync");
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("GitHub sync worker is stopping");
        await _signalRService.DisposeAsync();
        await base.StopAsync(cancellationToken);
    }
}
