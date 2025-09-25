namespace Portfolio.Shared.Models;

public class CommitData
{
    public int Id { get; set; }
    public string RepositoryName { get; set; } = string.Empty;
    public string RepositoryUrl { get; set; } = string.Empty;
    public int CommitCount { get; set; }
    public DateTime LastUpdated { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
}
