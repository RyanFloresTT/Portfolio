using API.Models;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddHttpClient("GitHub", client =>
{
    client.BaseAddress = new Uri("https://api.github.com/");
    client.DefaultRequestHeaders.UserAgent.ParseAdd("rryanflorres portfolio API");
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", builder.Configuration["GitHub:Token"]);
});

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/", async (IHttpClientFactory factory) => {
    HttpClient client = factory.CreateClient("GitHub");
    HttpResponseMessage res  = await client.GetAsync("users/ryanflorestt/repos");
    res.EnsureSuccessStatusCode();
    var repositories = await res.Content.ReadFromJsonAsync<List<GitHubRepository>>();

    foreach (var repo in repositories) {
        res = await client.GetAsync(repo.CommitsUrl);
        res.EnsureSuccessStatusCode();
        var reposJson = await res.Content.ReadAsStringAsync();
    }
    
    return Results.Ok((repositories ?? []).Select(x => x.Name));
});

app.Run();