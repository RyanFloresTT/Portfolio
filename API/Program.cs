using API.Hubs;
using API.Services;
using Microsoft.AspNetCore.SignalR;
using Portfolio.Shared.Models;
using Portfolio.Shared.Services;
using StackExchange.Redis;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddOpenApi();

builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
});

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379"));

builder.Services.AddHttpClient();

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
    var commitData = await redisService.GetAsync<List<RepoData>>("github:repos");
    return Results.Ok(commitData ?? new List<RepoData>());
});

app.MapGet("/personal-summary", async (CommitAnalysisService commitAnalysisService) => {
    string summary = await commitAnalysisService.GetPersonalSummaryAsync();
    return Results.Ok(new { summary });
});

app.MapPost("/notify/commit-data-updated",
    async (List<RepoData> commitData, IHubContext<PortfolioHub> hubContext) => {
        await hubContext.Clients.All.SendAsync("CommitDataUpdated", commitData);
        return Results.Ok();
    });

app.MapPost("/notify/personal-summary-updated", async (string summary, IHubContext<PortfolioHub> hubContext) => {
    await hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", summary);
    return Results.Ok();
});

app.MapPost("/regenerate-summary", async (CommitAnalysisService commitAnalysisService) => {
    try {
        await commitAnalysisService.InvalidateSummaryCacheAsync();
        return Results.Ok(new { message = "Recent commits summary regenerated successfully" });
    }
    catch (Exception ex) {
        return Results.Problem($"Error regenerating summary: {ex.Message}");
    }
});

app.Run();