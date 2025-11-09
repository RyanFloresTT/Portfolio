# Portfolio Makeover

Portfolio Makeover is a full-stack project that pulls my GitHub activity and stores it in Redis, ready for the API to alert the UI about it via SignalR for real time updates.

## Features
- **Live GitHub feed**: background worker collects repository and commit data on a schedule.
- **Personal summary**: API analyzes recent work and serves a short narrative for the landing page.
- **Realtime updates**: SignalR hub and Angular Signals keep the UI fresh without manual refreshes.
- **Deployable anywhere**: Docker and Kubernetes manifests included for local or cloud environments.

## Tech Stack
- **Backend**: ASP.NET Core minimal API, Redis cache, SignalR.
- **Data worker**: .NET background service that fetches/pushes commit data.
- **Frontend**: Angular 17 with standalone components and Tailwind styling.
- **Infrastructure**: Docker Compose for local dev, Kubernetes manifests for production.

## Project Structure
- `API/` – minimal API endpoints, SignalR hub, summary generation logic.
- `BackgroundWorkers/GitHubSync/` – worker that hits the GitHub API and stores results in Redis.
- `Shared/` – shared models, typed HTTP clients, Redis service wrapper.
- `UI/` – Angular application that renders the portfolio and listens for live updates.
- `k8s/` & `docker-compose*.yml` – deployment manifests.

![Project Architecture](Assets/Portfolio%20Architecture.png)

## Getting Started

### Requirements
- Docker Desktop (or any container runtime)
- .NET 8 SDK if running the API/worker directly
- Node.js 20+ if running the Angular app directly

### Run with Docker
```bash
docker compose -f docker-compose.dev.yml up --build
```

Services will be available at:
- API: `http://localhost:8080`
- UI: `http://localhost:4200`
- Redis: `localhost:6379`

### Run Locally (manual)
- Start Redis: `docker run --name portfolio-redis -p 6379:6379 redis:7`
- API: `dotnet run --project API/API.csproj`
- Worker: `dotnet run --project BackgroundWorkers/GitHubSync/GitHubSync.csproj`
- UI: `cd UI && npm install && npm run start`

Set environment variables or edit `appsettings.Development.json` for GitHub tokens and connection strings.

## What to Review First
- `API/Services/CommitAnalysisService.cs` – summary generation and SignalR notifications.
- `BackgroundWorkers/GitHubSync/Workers/GitHubDataWorker.cs` – GitHub ingestion pipeline.
- `UI/src/app/pages/home/home.component.ts` – landing page with live summary and activity display.

## Roadmap
- Add telemetry/metrics using OpenTelemetry.
- Enrich summaries with AI-generated commit insights.
- Surface project KPIs like issue throughput and release cadence.