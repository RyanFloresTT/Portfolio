using API.Hubs;
using Microsoft.AspNetCore.SignalR;
using Portfolio.Shared.Models;
using Portfolio.Shared.Services;

namespace API.Services;

public static class AppEndpoints {
    public static void MapEndpoints(this WebApplication app) {
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

        app.MapPost("/notify/personal-summary-updated",
            async (string summary, IHubContext<PortfolioHub> hubContext) => {
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
    }
}