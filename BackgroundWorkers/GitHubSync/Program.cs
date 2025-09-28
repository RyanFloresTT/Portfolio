using GitHubSync.Workers;
using Portfolio.Shared.HttpClients;
using Portfolio.Shared.Services;

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

builder.Services.AddHttpClient<GitHubHttpClient>("GitHub", client => {
    client.BaseAddress = new Uri("https://api.github.com/");
    client.DefaultRequestHeaders.Add("User-Agent", "Portfolio-GitHubSync/1.0");
    client.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");

    string? token = builder.Configuration["GitHub:Token"];
    if (!string.IsNullOrEmpty(token)) client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
});

builder.Services.AddHttpClient<PortfolioHttpClient>("PortfolioAPI", client => {
    string? apiBaseUri = builder.Configuration["PortfolioAPI:BaseUri"];
    if (!string.IsNullOrEmpty(apiBaseUri)) client.BaseAddress = new Uri(apiBaseUri);
    client.DefaultRequestHeaders.Add("User-Agent", "Portfolio-GitHubSync/1.0");
    client.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");

    string? token = builder.Configuration["GitHub:Token"];
    if (!string.IsNullOrEmpty(token)) client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
});

builder.Services.AddSingleton<RedisService>();
builder.Services.AddSingleton<GitHubDataWorker>();
builder.Services.AddHostedService<GitHubSyncWorker>();

IHost host = builder.Build();

await host.RunAsync();