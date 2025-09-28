using API.Helpers;
using API.Hubs;
using Portfolio.Shared.Models;
using Microsoft.AspNetCore.SignalR;
using Portfolio.Shared.Services;

namespace API.Services;

public class CommitAnalysisService(
    RedisService redisService,
    ILogger<CommitAnalysisService> logger,
    IHubContext<PortfolioHub> hubContext) {
    public async Task<string> GetPersonalSummaryAsync() {
        string? cachedSummary = await redisService.GetAsync<string>("recent-commits-summary");
        if (!string.IsNullOrEmpty(cachedSummary)) return cachedSummary;

        string summary = await GenerateRecentCommitsSummaryAsync();

        await redisService.SetAsync("recent-commits-summary", summary, TimeSpan.FromHours(6));

        await hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", summary);

        return summary;
    }

    async Task<string> GenerateRecentCommitsSummaryAsync() {
        try {
            var repoData = await redisService.GetAsync<List<RepoData>>("github:repos");
            if (repoData == null || repoData.Count == 0)
                return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";

            var recentRepos = repoData
                .OrderByDescending(c => c.LastUpdated)
                .Take(3)
                .ToList();

            var formattedCommits = new List<string>();

            foreach (RepoData? repo in recentRepos)
                try {
                    var commitMessages =
                        await redisService.GetAsync<List<string>>($"github:commits:{repo.RepositoryName}");

                    if (!(commitMessages?.Count > 0)) continue;

                    var recentCommits = CommitHelpers.FilterOutPRCommits(commitMessages).Take(3).ToList();

                    if (recentCommits.Count == 0) continue;

                    formattedCommits.Add($"{repo.RepositoryName}:");
                    formattedCommits.AddRange(recentCommits.Select(commit => $"• {commit}"));
                    formattedCommits.Add("");
                }
                catch (Exception ex) {
                    logger.LogWarning(ex, "Failed to fetch commit messages for {RepoName}", repo.RepositoryName);
                }

            if (formattedCommits.Count == 0)
                return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";

            string summary = "Here's what I've been working on recently:\n\n" +
                             string.Join("\n", formattedCommits).TrimEnd();

            logger.LogInformation("Generated recent commits summary for {RepoCount} repositories", recentRepos.Count);
            return summary;
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error generating recent commits summary");
            return "Hi, I'm Ryan! I'm currently working on some exciting projects. Check back soon for updates!";
        }
    }

    public async Task InvalidateSummaryCacheAsync() {
        await redisService.DeleteAsync("recent-commits-summary");

        string newSummary = await GenerateRecentCommitsSummaryAsync();
        await redisService.SetAsync("recent-commits-summary", newSummary, TimeSpan.FromHours(6));

        await hubContext.Clients.All.SendAsync("PersonalSummaryUpdated", newSummary);

        logger.LogInformation("Recent commits summary updated and broadcast to clients");
    }
}