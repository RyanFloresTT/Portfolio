using API.Models;
using API.Services;
using API.Hubs;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Add Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
});

builder.Services.AddSingleton<IConnectionMultiplexer>(provider =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379"));

// Add custom services
builder.Services.AddSingleton<RedisService>();
builder.Services.AddSingleton<CommitAnalysisService>();

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200", "http://localhost:30082")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()));

builder.Services.AddHostedService<GitHubDataService>();
builder.Services.AddSingleton<GitHubDataService>();

builder.Services.AddHttpClient("GitHub", client => {
    client.DefaultRequestHeaders.UserAgent.ParseAdd("rryanflorres portfolio API");
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", builder.Configuration["GitHub:Token"]);
});

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.UseHttpsRedirection();

app.UseCors();

app.MapHub<PortfolioHub>("/portfolioHub");

app.MapGet("/", async (RedisService redisService) => {
    var commitData = await redisService.GetAsync<List<CommitData>>("github:commits");
    return Results.Ok(commitData ?? new List<CommitData>());
});

app.MapGet("/personal-summary", async (CommitAnalysisService commitAnalysisService) => {
    var summary = await commitAnalysisService.GetPersonalSummaryAsync();
    return Results.Ok(new { summary });
});


app.MapGet("/health/ollama", async (IHttpClientFactory httpClientFactory, IConfiguration config) => {
    try
    {
        var ollamaUrl = config["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434";
        var client = httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(5);
        
        var response = await client.GetAsync($"{ollamaUrl}/api/tags");
        return Results.Ok(new { 
            status = response.IsSuccessStatusCode ? "healthy" : "unhealthy",
            statusCode = response.StatusCode,
            ollamaUrl = ollamaUrl
        });
    }
    catch (Exception ex)
    {
        return Results.Ok(new { 
            status = "unhealthy", 
            error = ex.Message,
            ollamaUrl = config["Ollama:BaseUrl"] ?? "http://127.0.0.1:11434"
        });
    }
});

app.MapPost("/trigger-github-sync", async (GitHubDataService githubService) => {
    try
    {
        await githubService.FetchAndStoreGitHubData();
        return Results.Ok(new { message = "GitHub sync triggered successfully" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error triggering sync: {ex.Message}");
    }
});

app.Run();