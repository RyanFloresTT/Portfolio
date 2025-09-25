FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["BackgroundWorkers/GitHubSync/GitHubSync.csproj", "BackgroundWorkers/GitHubSync/"]
COPY ["Shared/Portfolio.Shared.csproj", "Shared/"]
RUN dotnet restore "BackgroundWorkers/GitHubSync/GitHubSync.csproj"
COPY . .
WORKDIR "/src/BackgroundWorkers/GitHubSync"
RUN dotnet build "GitHubSync.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GitHubSync.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GitHubSync.dll"]
