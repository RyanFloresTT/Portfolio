import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <!-- Header -->
        <header class="mb-10 pb-8 border-b-2 border-gray-200">
          <!-- Hero Section -->
          <div class="text-center mb-8">
            <h1 class="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Hi, I'm Ryan
            </h1>
            <p class="text-xl text-gray-600 font-light tracking-wide">
              Full-Stack Developer & Tech Enthusiast
            </p>
          </div>
          
          <!-- Intro Section -->
          <div class="space-y-6">
            <!-- Personal Summary -->
            <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-l-4 border-blue-600 shadow-lg overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full transform translate-x-8 -translate-y-8"></div>
              <p class="relative z-10 text-lg text-gray-700 leading-relaxed">
                {{ displaySummary() }}<span class="animate-pulse text-blue-600 font-bold">|</span>
              </p>
            </div>
            
            <!-- Action Bar -->
            <div class="flex justify-between items-center flex-wrap gap-4">
              <a href="http://localhost:30080" target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                Read my blog
              </a>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <div class="w-3 h-3 rounded-full" [class]="{
                  'bg-red-500': portfolioService.connectionStatus() === 'Disconnected',
                  'bg-green-500': portfolioService.connectionStatus() === 'Connected',
                  'bg-yellow-500': portfolioService.connectionStatus() === 'Reconnecting'
                }"></div>
                {{ portfolioService.connectionStatus() }}
              </div>
            </div>
          </div>
        </header>

        <main>
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-blue-600">
              <h3 class="text-gray-700 font-medium mb-2">Total Repositories</h3>
              <p class="text-4xl font-bold text-blue-600">{{ portfolioService.commitData().length }}</p>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border-l-4 border-green-600">
              <h3 class="text-gray-700 font-medium mb-2">Total Commits (30 days)</h3>
              <p class="text-4xl font-bold text-green-600">{{ getTotalCommits() }}</p>
            </div>
          </div>

          <!-- What I've Been Working On Section -->
          <div class="mb-10">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">What I've Been Working On</h2>

            @if (portfolioService.commitData().length === 0) {
              <div class="text-center py-12">
                <p class="text-gray-500 italic text-lg">Loading commit data...</p>
              </div>
            } @else {
              <!-- Repository Heatmap -->
              <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  @for (repo of getSortedRepositories(); track repo.id) {
                    <div class="border border-gray-200 rounded-lg p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer min-h-20 flex flex-col justify-center"
                         [style.background-color]="getHeatmapColor(repo.commitCount)"
                         [title]="repo.repositoryName + ': ' + repo.commitCount + ' commits'"
                         (click)="openRepository(repo.repositoryUrl)">
                      <div class="text-sm font-semibold text-gray-800 mb-1 break-words">{{ repo.repositoryName }}</div>
                      <div class="text-lg font-bold text-gray-800">{{ repo.commitCount }}</div>
                    </div>
                  }
                </div>
                <!-- Legend -->
                <div class="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>Less Active</span>
                  <div class="flex gap-1">
                    <div class="w-4 h-4 rounded border border-gray-200 bg-gray-100"></div>
                    <div class="w-4 h-4 rounded border border-gray-200 bg-blue-100"></div>
                    <div class="w-4 h-4 rounded border border-gray-200 bg-blue-200"></div>
                    <div class="w-4 h-4 rounded border border-gray-200 bg-blue-300"></div>
                    <div class="w-4 h-4 rounded border border-gray-200 bg-blue-400"></div>
                  </div>
                  <span>More Active</span>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  public displaySummary = signal('');

  constructor(public portfolioService: PortfolioService) {
    // Watch for summary changes and trigger typewriter effect
    effect(() => {
      const summary = this.portfolioService.personalSummary();
      if (summary) {
        this.typewriterEffect(summary);
      }
    });
  }

  ngOnInit() {
    this.portfolioService.loadCommitData();
    this.portfolioService.loadPersonalSummary();
  }

  getTotalCommits(): number {
    return this.portfolioService.commitData().reduce((total, repo) => total + repo.commitCount, 0);
  }

  getSortedRepositories() {
    return [...this.portfolioService.commitData()].sort((a, b) => b.commitCount - a.commitCount);
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

  openRepository(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private typewriterEffect(text: string) {
    this.displaySummary.set('');
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        this.displaySummary.set(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30); // 30ms delay between characters
  }
}
