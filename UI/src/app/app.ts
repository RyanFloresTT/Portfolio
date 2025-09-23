import { Component, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, CommitData } from './services/portfolio.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Portfolio Dashboard');
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
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
