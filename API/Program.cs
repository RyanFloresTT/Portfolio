using System.Net;
using API.Models;
using API.Data;
using API.Services;
using API.Hubs;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=portfolio.db"));

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200")
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

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
    context.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.UseHttpsRedirection();

app.UseCors();

app.MapHub<PortfolioHub>("/portfolioHub");

app.MapGet("/", async (PortfolioDbContext dbContext) => {
    var commitData = await dbContext.CommitData
        .OrderByDescending(c => c.LastUpdated)
        .ToListAsync();
    
    return Results.Ok(commitData);
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