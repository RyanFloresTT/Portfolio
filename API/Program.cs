using API.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddOpenApi();

builder.Services.AddHttpClient();

builder.Services.AddProjectDependencies(builder.Configuration);

builder.Services.AddSignalR();

builder.Services.AddCorsPolicies();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    app.UseCors("dev-policy");
}
else
    app.UseCors("prod-policy");

app.UseHttpsRedirection();

app.UseCors();

app.MapEndpoints();

app.Run();