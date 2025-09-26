using API.Hubs;
using API.Services;
using Microsoft.AspNetCore.SignalR;
using Portfolio.Shared.Models;
using Portfolio.Shared.Services;
using StackExchange.Redis;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add environment variable support
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddOpenApi();

// Add Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
});

builder.Services.AddSingleton<IConnectionMultiplexer>(provider =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379"));

// Add HTTP clients
builder.Services.AddHttpClient();

// Add custom services
builder.Services.AddSingleton<RedisService>();
builder.Services.AddSingleton<GitHubCommitService>();
builder.Services.AddSingleton<CommitAnalysisService>();

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200", "http://localhost:30082")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()));

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

app.MapPost("/api/notify/commit-data-updated", async (List<CommitData> commitData, IHubContext<PortfolioHub> hubContext) => {
    await hubContext.Clients.All.SendAsync("CommitDataUpdated", commitData);
    return Results.Ok();
});

app.MapPost("/api/notify/personal-summary-updated", async (string summary, IHubContext<PortfolioHub> hubContext) => {
    await hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", summary);
    return Results.Ok();
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


app.MapPost("/regenerate-summary", async (CommitAnalysisService commitAnalysisService) => {
    try
    {
        await commitAnalysisService.InvalidateCacheAsync();
        return Results.Ok(new { message = "Personal summary regenerated successfully" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error regenerating summary: {ex.Message}");
    }
});

app.Run();