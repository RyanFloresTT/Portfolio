using GitHubSync.Services;
using GitHubSync.Workers;
using Portfolio.Shared.Models;
using Portfolio.Shared.Services;

var builder = Host.CreateApplicationBuilder(args);

// Add services
builder.Services.AddHttpClient("GitHub", client =>
{
    client.DefaultRequestHeaders.Add("User-Agent", "Portfolio-GitHubSync/1.0");
    client.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");
    
    var token = builder.Configuration["GitHub:Token"];
    if (!string.IsNullOrEmpty(token))
    {
        client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
    }
});

// Add Redis
builder.Services.AddSingleton<RedisService>();

// Add SignalR client
builder.Services.AddSingleton<SignalRService>();

// Add GitHub services
builder.Services.AddSingleton<GitHubCommitService>();
builder.Services.AddSingleton<GitHubDataWorker>();

// Add the background worker
builder.Services.AddHostedService<GitHubSyncWorker>();

var host = builder.Build();

await host.RunAsync();
