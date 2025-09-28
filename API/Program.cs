using API.Services;
using Microsoft.AspNetCore.SignalR;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddOpenApi();

builder.Services.AddHttpClient();

builder.Services.AddProjectDependencies(builder.Configuration);

builder.Services.AddSignalR(options => {
    options.EnableDetailedErrors = true;
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
});

builder.Services.AddCorsPolicies();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment()) {
    app.UseCors("dev-policy");
} else {
    app.UseCors("prod-policy");
}

app.UseRouting();

app.MapEndpoints();

app.Run();