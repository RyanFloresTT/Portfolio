FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files first for better caching
COPY ["Shared/Portfolio.Shared.csproj", "Shared/"]
COPY ["API/API.csproj", "API/"]

# Restore dependencies
RUN dotnet restore "API/API.csproj"

# Copy source code
COPY ["Shared/", "Shared/"]
COPY ["API/", "API/"]

# Build
WORKDIR /src/API
RUN dotnet build "API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]