import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <!-- Page Header -->
        <div class="mb-10 pb-8 border-b-2 border-gray-200 dark:border-gray-700">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            About This Site
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 font-light">
            A deep dive into the architecture and technologies powering this portfolio
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Architecture Overview -->
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Architecture & Tech Stack
              </h3>
              <div class="space-y-4 text-gray-700 dark:text-gray-300">
                <p>This portfolio is built with a modern, real-time architecture that showcases both my development skills and the technologies I work with.</p>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                    <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-1">Frontend</h4>
                    <p class="text-sm text-blue-700 dark:text-blue-300">Angular, Tailwind CSS, TypeScript</p>
                  </div>
                  <div class="bg-green-50 dark:bg-green-900 p-3 rounded-lg">
                    <h4 class="font-semibold text-green-800 dark:text-green-200 mb-1">Backend</h4>
                    <p class="text-sm text-green-700 dark:text-green-300">.NET, SignalR, Background Workers</p>
                  </div>
                  <div class="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
                    <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-1">Infrastructure</h4>
                    <p class="text-sm text-purple-700 dark:text-purple-300">Docker, Kubernetes, Redis</p>
                  </div>
                  <div class="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg">
                    <h4 class="font-semibold text-orange-800 dark:text-orange-200 mb-1">Data Processing</h4>
                    <p class="text-sm text-orange-700 dark:text-orange-300">GitHub API, Commit Analysis</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Live System Status -->
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Live System Status
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-gray-700 dark:text-gray-300">API Connection</span>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" [class]="{
                      'bg-red-500': portfolioService.connectionStatus() === 'Disconnected',
                      'bg-red-800': portfolioService.connectionStatus() === 'Error',
                      'bg-green-500': portfolioService.connectionStatus() === 'Connected',
                      'bg-yellow-500': portfolioService.connectionStatus() === 'Reconnecting'
                    }"></div>
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ portfolioService.connectionStatus() }}</span>
                  </div>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-gray-700 dark:text-gray-300">Data Sources</span>
                  <span class="text-sm font-medium text-green-600 dark:text-green-400">GitHub API</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span class="text-gray-700 dark:text-gray-300">Real-time Updates</span>
                  <span class="text-sm font-medium text-green-600 dark:text-green-400">SignalR Active</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Development Process -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Development Process
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Real-time Data</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">GitHub commits sync automatically every hour, with live updates via SignalR</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Recent Activity</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Live updates showing recent commits from top repositories with intelligent filtering</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Containerized</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Full Docker setup with Kubernetes deployment for scalability and reliability</p>
              </div>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              Technical Implementation
            </h3>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Backend Services</h4>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• GitHub Data Service - Automated commit fetching</li>
                    <li>• Commit Analysis Service - Recent commits formatting</li>
                    <li>• Redis Service - Caching and session management</li>
                    <li>• SignalR Hub - Real-time communication</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Frontend Features</h4>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Responsive design with Tailwind CSS</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Standalone Angular components</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <!-- <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <p class="text-gray-600 dark:text-gray-400 mb-4">Want to learn more about the technical implementation?</p>
            <a href="http://localhost:30080" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-700 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              Read the detailed technical blog post
            </a>
          </div> -->
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {
  constructor(public portfolioService: PortfolioService) {}
}
