using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
    {
    }

    public DbSet<CommitData> CommitData { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CommitData>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.RepositoryName).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.RepositoryName);
            entity.HasIndex(e => e.LastUpdated);
        });
    }
}
