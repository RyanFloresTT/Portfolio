import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Ryan's Portfolio
            </a>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600" 
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Home
            </a>
            <a routerLink="/projects" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600" 
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Projects
            </a>
            <a routerLink="/about" 
               routerLinkActive="text-blue-600 border-b-2 border-blue-600" 
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200">
              About This Site
            </a>
            <a href="https://blog.ryanflores.dev" rel="noopener noreferrer"
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Blog
            </a>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button (click)="toggleMobileMenu()" 
                    class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div *ngIf="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            <a routerLink="/" 
               routerLinkActive="text-blue-600 bg-blue-50 dark:bg-blue-900" 
               [routerLinkActiveOptions]="{exact: true}"
               (click)="closeMobileMenu()"
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium">
              Home
            </a>
            <a routerLink="/projects" 
               routerLinkActive="text-blue-600 bg-blue-50 dark:bg-blue-900" 
               (click)="closeMobileMenu()"
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium">
              Projects
            </a>
            <a routerLink="/about" 
               routerLinkActive="text-blue-600 bg-blue-50 dark:bg-blue-900" 
               (click)="closeMobileMenu()"
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium">
              About This Site
            </a>
            <a href="/blog" target="_blank" rel="noopener noreferrer"
               (click)="closeMobileMenu()"
               class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium">
              Blog
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavigationComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
