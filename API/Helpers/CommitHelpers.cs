namespace API.Helpers;

public class CommitHelpers {
    public static IEnumerable<string> FilterOutPRCommits(List<string> commits) {
        return commits.Where(commit =>
                !commit.Contains("Merge pull request") &&
                !commit.Contains("Merge branch") &&
                !commit.StartsWith("Merge ") &&
                !commit.Contains("Pull request") &&
                !commit.Contains("PR #") &&
                commit.Trim().Length > 5 // Filter out very short commits
        );
    }
}