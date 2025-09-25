FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files first for better caching
COPY ["Shared/Portfolio.Shared.csproj", "Shared/"]
COPY ["BackgroundWorkers/GitHubSync/GitHubSync.csproj", "BackgroundWorkers/GitHubSync/"]

# Restore dependencies
RUN dotnet restore "BackgroundWorkers/GitHubSync/GitHubSync.csproj"

# Copy source code
COPY ["Shared/", "Shared/"]
COPY ["BackgroundWorkers/GitHubSync/", "BackgroundWorkers/GitHubSync/"]

# Build
WORKDIR "/src/BackgroundWorkers/GitHubSync"
RUN dotnet build "GitHubSync.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GitHubSync.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GitHubSync.dll"]