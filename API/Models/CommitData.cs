using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class CommitData
{
    [Key]
    public int Id { get; set; }
    
    public string RepositoryName { get; set; } = string.Empty;
    
    public int CommitCount { get; set; }
    
    public DateTime LastUpdated { get; set; }
    
    public DateTime PeriodStart { get; set; }
    
    public DateTime PeriodEnd { get; set; }
}
