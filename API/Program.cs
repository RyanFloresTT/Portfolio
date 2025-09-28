using API.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddOpenApi();

builder.Services.AddHttpClient();

builder.Services.AddProjectDependencies(builder.Configuration);

builder.Services.AddSignalR().AddStackExchangeRedis(builder.Configuration["ConnectionStrings:Redis"] ?? string.Empty);

builder.Services.AddCorsPolicies();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.UseHttpsRedirection();

app.UseCors(app.Environment.IsDevelopment() ? "dev-policy" : "prod-policy");

app.UseRouting();

app.MapEndpoints();

app.Run();