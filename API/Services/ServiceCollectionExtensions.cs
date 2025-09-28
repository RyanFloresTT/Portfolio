using Portfolio.Shared.Services;
using StackExchange.Redis;

namespace API.Services;

public static class ServiceCollectionExtensions {
    public static void AddCorsPolicies(this IServiceCollection services) {
        services.AddCors(options => {
            options.AddPolicy("dev-policy", policy =>
                policy.WithOrigins("http://localhost:4200", "http://localhost:30082", "http://localhost:3000", "http://localhost:8080")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });

        services.AddCors(options => {
            options.AddPolicy("prod-policy", policy =>
                policy.WithOrigins("https://ryanflores.dev", "https://www.ryanflores.dev")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });
    }

    public static void AddProjectDependencies(this IServiceCollection services,
        ConfigurationManager configuration) {
        services.AddStackExchangeRedisCache(options => {
            options.Configuration = configuration.GetConnectionString("Redis") ?? "localhost:6379";
        });

        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(configuration.GetConnectionString("Redis") ?? "localhost:6379"));


        services.AddSingleton<RedisService>();
        services.AddSingleton<CommitAnalysisService>();
    }
}