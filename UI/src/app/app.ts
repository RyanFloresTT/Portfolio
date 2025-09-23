import { Component, signal, OnInit } from '@angular/core';
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

  constructor(public portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.loadCommitData();
  }

  getTotalCommits(): number {
    return this.portfolioService.commitData().reduce((total, repo) => total + repo.commitCount, 0);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
