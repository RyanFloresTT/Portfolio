using GitHubSync.Services;
using GitHubSync.Workers;
using Portfolio.Shared.Services;

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

builder.Services.AddHttpClient("GitHub", client => {
    client.DefaultRequestHeaders.Add("User-Agent", "Portfolio-GitHubSync/1.0");
    client.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");

    string? token = builder.Configuration["GitHub:Token"];
    if (!string.IsNullOrEmpty(token)) client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
});

builder.Services.AddHttpClient();

builder.Services.AddSingleton<RedisService>();

builder.Services.AddSingleton<NotifyApiService>();

builder.Services.AddSingleton<GitHubCommitService>();
builder.Services.AddSingleton<GitHubDataWorker>();

builder.Services.AddHostedService<GitHubSyncWorker>();

IHost host = builder.Build();

await host.RunAsync();