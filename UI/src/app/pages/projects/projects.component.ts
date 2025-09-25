import { Component, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  projects: Signal<readonly Project[]>;
  expandedProject: string | null = null;

  constructor(
    public portfolioService: PortfolioService,
    private projectsService: ProjectsService,
    private router: Router
  ) {
    this.projects = this.projectsService.getProjects();
  }

  ngOnInit() {
    this.portfolioService.loadCommitData();
  }

  toggleExpanded(projectId: string): void {
    this.expandedProject = this.expandedProject === projectId ? null : projectId;
  }

  getFeaturedProjects(): Project[] {
    return this.projectsService.getFeaturedProjects();
  }

  getTopRepositories(): any[] {
    return [...this.portfolioService.commitData()]
      .sort((a, b) => b.commitCount - a.commitCount)
      .slice(0, 8);
  }

  getHeatmapColor(commitCount: number): string {
    const maxCommits = Math.max(...this.portfolioService.commitData().map(r => r.commitCount));
    const intensity = commitCount / maxCommits;
    
    if (intensity === 0) return '#374151'; // gray-700 (dark mode)
    if (intensity <= 0.2) return '#1e3a8a'; // blue-900 (dark mode)
    if (intensity <= 0.4) return '#1e40af'; // blue-800 (dark mode)
    if (intensity <= 0.6) return '#1d4ed8'; // blue-700 (dark mode)
    return '#2563eb'; // blue-600 (dark mode)
  }

  getStatusClass(status: Project['status']): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'in-progress':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'planned':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'archived':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  openRepository(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  viewProjectDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
