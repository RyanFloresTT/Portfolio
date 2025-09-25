import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html'
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
    
    if (intensity === 0) return '#374151'; // dark gray
    if (intensity <= 0.2) return '#1e3a8a'; // dark blue
    if (intensity <= 0.4) return '#2563eb'; // blue
    if (intensity <= 0.6) return '#3b82f6'; // lighter blue
    return '#60a5fa'; // light blue
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
