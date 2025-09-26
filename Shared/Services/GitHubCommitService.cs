using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using Portfolio.Shared.Models;

namespace Portfolio.Shared.Services;

public class GitHubCommitService(ILogger<GitHubCommitService> logger) {
    /// <summary>
    /// Fetches all commits for a repository using pagination
    /// </summary>
    /// <param name="client">HTTP client configured for GitHub API</param>
    /// <param name="repositoryName">Name of the repository (e.g., "PortfolioMakeover")</param>
    /// <param name="since">ISO date string for filtering commits since this date</param>
    /// <returns>List of all commits within the time period, or null if none found</returns>
    public async Task<List<GitHubCommit>?> FetchAllCommitsForRepositoryAsync(HttpClient client, string repositoryName,
        string since) {
        var allCommits = new List<GitHubCommit>();
        int page = 1;
        const int perPage = 100; // Maximum allowed by GitHub API

        while (true)
            try {
                string commitsUrl =
                    $"https://api.github.com/repos/ryanflorestt/{repositoryName}/commits?since={since}&per_page={perPage}&page={page}";
                HttpResponseMessage response = await client.GetAsync(commitsUrl);

                if (!response.IsSuccessStatusCode) {
                    if (page == 1)
                        logger.LogWarning("Failed to fetch commits for repository {RepositoryName}: {StatusCode}",
                            repositoryName, response.StatusCode);
                    break;
                }

                var commits = await response.Content.ReadFromJsonAsync<List<GitHubCommit>>();

                if (commits == null || commits.Count == 0)
                    // No more commits on this page, we're done
                    break;

                allCommits.AddRange(commits);

                // If we got fewer commits than perPage, we've reached the end
                if (commits.Count < perPage) break;

                page++;
            }
            catch (Exception ex) {
                logger.LogError(ex, "Error fetching commits for repository {RepositoryName} on page {Page}",
                    repositoryName, page);
                break;
            }

        return allCommits.Count > 0 ? allCommits : null;
    }
}