using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using Portfolio.Shared.Models;

namespace Portfolio.Shared.HttpClients;

public class GitHubHttpClient(HttpClient httpClient, ILogger<GitHubHttpClient> logger) {
    public async Task<List<GitHubRepository>> GetRepositoriesAsync() {
        HttpResponseMessage response = await httpClient.GetAsync("users/ryanflorestt/repos");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<List<GitHubRepository>>() ?? [];
    }

    public async Task<List<GitHubCommit>?> GetCommitsAsync(string repositoryName, string since) {
        var allCommits = new List<GitHubCommit>();
        int page = 1;
        const int perPage = 100; // Maximum allowed by GitHub API

        while (true)
            try {
                string commitsUrl =
                    $"repos/ryanflorestt/{repositoryName}/commits?since={since}&per_page={perPage}&page={page}";
                HttpResponseMessage response = await httpClient.GetAsync(commitsUrl);

                if (!response.IsSuccessStatusCode) {
                    if (page == 1)
                        logger.LogWarning("Failed to fetch commits for repository {RepositoryName}: {StatusCode}",
                            repositoryName, response.StatusCode);
                    break;
                }

                var commits = await response.Content.ReadFromJsonAsync<List<GitHubCommit>>();

                if (commits == null || commits.Count == 0)
                    break;

                allCommits.AddRange(commits);

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