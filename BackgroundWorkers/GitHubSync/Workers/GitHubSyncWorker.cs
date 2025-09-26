using GitHubSync.Services;

namespace GitHubSync.Workers;

public class GitHubSyncWorker(
    ILogger<GitHubSyncWorker> logger,
    GitHubDataWorker gitHubDataWorker,
    NotifyApiService notifyApiService)
    : BackgroundService {
    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        try {
            logger.LogInformation("Starting GitHub data sync at: {Time}", DateTimeOffset.Now);

            await gitHubDataWorker.FetchAndStoreGitHubData();

            logger.LogInformation("GitHub data sync completed at: {Time}", DateTimeOffset.Now);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error occurred during GitHub data sync");
        }
        finally {
            logger.LogInformation("GitHub sync worker completed");
            Environment.Exit(0);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken) {
        logger.LogInformation("GitHub sync worker is stopping");
        await notifyApiService.DisposeAsync();
        await base.StopAsync(cancellationToken);
    }
}