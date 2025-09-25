namespace Portfolio.Shared.Models;

public class GitHubRepository
{
    public string? Name { get; set; }
    public string? HtmlUrl { get; set; }
    public string? Description { get; set; }
    public string? Language { get; set; }
    public int StargazersCount { get; set; }
    public int ForksCount { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GitHubCommit
{
    public string? Sha { get; set; }
    public Commit? Commit { get; set; }
    public string? HtmlUrl { get; set; }
}

public class Commit
{
    public string? Message { get; set; }
    public Author? Author { get; set; }
    public Committer? Committer { get; set; }
}

public class Author
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public DateTime Date { get; set; }
}

public class Committer
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public DateTime Date { get; set; }
}
