import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <!-- Page Header -->
        <div class="mb-10 pb-8 border-b-2 border-gray-200">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p class="text-xl text-gray-600 font-light">
            A showcase of my recent work and ongoing projects
          </p>
        </div>

        <!-- Featured Projects -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Featured Projects</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            @for (project of projects(); track project.id) {
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-xl font-semibold text-gray-800">{{ project.name }}</h3>
                  <span class="px-3 py-1 text-xs font-medium rounded-full" [class]="getStatusClass(project.status)">
                    {{ project.status | titlecase }}
                  </span>
                </div>
                
                <p class="text-gray-600 mb-4">{{ project.description }}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                  @for (tech of project.technologies; track tech) {
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {{ tech }}
                    </span>
                  }
                </div>
                
                <div class="flex gap-3">
                  @if (project.githubUrl) {
                    <a [href]="project.githubUrl" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors duration-200">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  }
                  @if (project.liveUrl) {
                    <a [href]="project.liveUrl" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      Live Demo
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- All Projects -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">All Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of projects(); track project.id) {
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-lg font-semibold text-gray-800">{{ project.name }}</h3>
                  <span class="px-2 py-1 text-xs font-medium rounded-full" [class]="getStatusClass(project.status)">
                    {{ project.status | titlecase }}
                  </span>
                </div>
                
                <p class="text-gray-600 text-sm mb-3">{{ project.description }}</p>
                
                <div class="flex flex-wrap gap-1 mb-3">
                  @for (tech of project.technologies.slice(0, 3); track tech) {
                    <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {{ tech }}
                    </span>
                  }
                  @if (project.technologies.length > 3) {
                    <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      +{{ project.technologies.length - 3 }}
                    </span>
                  }
                </div>
                
                <div class="flex gap-2">
                  @if (project.githubUrl) {
                    <a [href]="project.githubUrl" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-700 transition-colors duration-200">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Code
                    </a>
                  }
                  @if (project.liveUrl) {
                    <a [href]="project.liveUrl" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors duration-200">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      Demo
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- GitHub Activity Summary -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Recent GitHub Activity</h2>
          @if (portfolioService.commitData().length === 0) {
            <div class="text-center py-8">
              <p class="text-gray-500 italic">Loading GitHub activity...</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              @for (repo of getTopRepositories(); track repo.id) {
                <div class="border border-gray-200 rounded-lg p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                     [style.background-color]="getHeatmapColor(repo.commitCount)"
                     [title]="repo.repositoryName + ': ' + repo.commitCount + ' commits'"
                     (click)="openRepository(repo.repositoryUrl)">
                  <div class="text-sm font-semibold text-gray-800 mb-1 break-words">{{ repo.repositoryName }}</div>
                  <div class="text-lg font-bold text-gray-800">{{ repo.commitCount }}</div>
                  <div class="text-xs text-gray-600">commits</div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  projects: any;
  constructor(
    public portfolioService: PortfolioService,
    private projectsService: ProjectsService
  ) {this.projects = this.projectsService.getProjects();}

  
  
  ngOnInit() {
    this.portfolioService.loadCommitData();
  }

  getFeaturedProjects(): Project[] {
    return this.projectsService.getFeaturedProjects();
  }

  getTopRepositories() {
    return [...this.portfolioService.commitData()]
      .sort((a, b) => b.commitCount - a.commitCount)
      .slice(0, 8);
  }

  getHeatmapColor(commitCount: number): string {
    const maxCommits = Math.max(...this.portfolioService.commitData().map(r => r.commitCount));
    const intensity = commitCount / maxCommits;
    
    if (intensity === 0) return '#f8f9fa';
    if (intensity <= 0.2) return '#e3f2fd';
    if (intensity <= 0.4) return '#bbdefb';
    if (intensity <= 0.6) return '#90caf9';
    return '#64b5f6';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  openRepository(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
