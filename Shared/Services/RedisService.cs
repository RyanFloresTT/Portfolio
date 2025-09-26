using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System.Text.Json;

namespace Portfolio.Shared.Services;

public class RedisService {
    readonly IDatabase database;
    readonly ILogger<RedisService> logger;

    public RedisService(IConfiguration configuration, ILogger<RedisService> logger) {
        this.logger = logger;
        string connectionString = configuration.GetConnectionString("Redis") ?? "localhost:6379";
        ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(connectionString);
        database = redis.GetDatabase();
    }

    public async Task<T?> GetAsync<T>(string key) {
        try {
            RedisValue value = await database.StringGetAsync(key);
            return !value.HasValue ? default : JsonSerializer.Deserialize<T>(value!);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error getting value from Redis for key: {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) {
        try {
            string serializedValue = JsonSerializer.Serialize(value);
            await database.StringSetAsync(key, serializedValue, expiry);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error setting value in Redis for key: {Key}", key);
        }
    }

    public async Task DeleteAsync(string key) {
        try {
            await database.KeyDeleteAsync(key);
        }
        catch (Exception ex) {
            logger.LogError(ex, "Error deleting key from Redis: {Key}", key);
        }
    }
}