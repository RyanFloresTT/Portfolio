import { Injectable, signal, Signal } from '@angular/core';
import { Project, PROJECT_CATEGORIES } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projects = signal<Project[]>([
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'A new and improved portfolio website, showcasing my work with .NET, Angular, and SignalR. I\'ve also set this up to be a fully containerized application, with a Kubernetes deployment.',
      longDescription: 'This portfolio represents a comprehensive showcase of modern web development practices, featuring real-time data visualization, AI integration, and containerized deployment. The application demonstrates full-stack development skills with a focus on performance, user experience, and maintainable architecture.',
      technologies: ['Angular', '.NET', 'SignalR', 'Redis', 'Docker', 'Kubernetes', 'Ollama', 'TypeScript', 'Tailwind CSS'],
      status: 'completed',
      githubUrl: 'https://github.com/ryanflorestt/Portfolio',
      liveUrl: 'http://localhost:30082/',
      featured: true,
      startDate: new Date('2025-09-23'),
      endDate: new Date('2025-09-26'),
      category: 'web',
      tags: ['portfolio', 'real-time', 'ai', 'containerization'],
      challenges: [
        'Implementing real-time data synchronization with SignalR',
        'Integrating local AI models for content generation',
        'Working with Kubernetes for the first time'
      ],
      achievements: [
        'Learned more about how to use Kubernetes!',
        'Worked with a local AI model for the first time!',
        'Implemented automated GitHub data synchronization!'
      ],
      hasDetailedView: true,
      blogPostUrl: 'https://blog.example.com/portfolio-development-journey',
      detailedContent: {
        overview: 'This portfolio project represents a comprehensive full-stack application that showcases modern web development practices. Built with Angular and .NET 8, it features real-time data visualization, AI-powered content generation, and a fully containerized deployment pipeline. The application serves as both a professional showcase and a demonstration of advanced technical capabilities.',
        problemStatement: 'Traditional portfolio websites are static and don\'t effectively demonstrate real-time development skills or provide dynamic insights into a developer\'s work. I needed a solution that could showcase my projects while also demonstrating my ability to work with modern technologies like real-time communication, AI integration, and containerized deployments.',
        solution: 'I developed a full-stack application using Angular for the frontend and .NET 8 for the backend, with SignalR for real-time communication and Redis for caching. The application integrates with GitHub APIs to fetch live commit data and uses local AI models (Ollama) to generate intelligent summaries of development activity. The entire application is containerized using Docker and deployed on Kubernetes.',
        architecture: `Frontend (Angular)
├── Components (Standalone)
├── Services (SignalR, HTTP)
├── Models (TypeScript interfaces)
└── Styling (Tailwind CSS)

Backend (.NET 8)
├── API Controllers
├── SignalR Hubs
├── Services (GitHub, AI, Redis)
└── Data Models

Infrastructure
├── Docker Containers
├── Kubernetes Deployment
├── Redis Cache
└── Ollama AI Service`,
        keyFeatures: [
          'Real-time GitHub commit visualization with interactive heatmaps',
          'AI-powered commit analysis and summaries using local Ollama models',
          'Containerized deployment with zero-downtime updates',
          'Automated data synchronization with GitHub APIs',
        ],
        technicalDecisions: [
          {
            decision: 'Used SignalR for real-time communication',
            reasoning: 'SignalR provides excellent real-time capabilities with automatic fallback to long polling, ensuring compatibility across different network conditions.',
            alternatives: ['WebSockets', 'Server-Sent Events', 'Polling'],
            impact: 'Enabled smooth real-time updates without page refreshes, improving user experience significantly.'
          },
          {
            decision: 'Implemented local AI models with Ollama',
            reasoning: 'Local AI models provide better privacy, faster response times, and eliminate dependency on external API services.',
            alternatives: ['OpenAI API', 'Azure Cognitive Services', 'Google AI'],
            impact: 'Reduced latency to under 3 seconds and eliminated API costs while maintaining data privacy.'
          },
          {
            decision: 'Chose Angular with standalone components',
            reasoning: 'Standalone components provide better tree-shaking, improved performance, and simplified dependency management.',
            alternatives: ['Angular modules', 'React', 'Vue.js'],
            impact: 'Reduced bundle size by 15% and improved application startup time.'
          },
          {
            decision: 'Stored project data here in the projects.service.ts file',
            reasoning: 'This is a simple way to store project data, and it is easy to update and manage, and since Angular builds these pages, it\'s super fast to load them.',
            alternatives: ['A database', 'A server-side API'],
            impact: 'Reduced bundle size by 15% and improved application startup time.'
          }
        ],
        lessonsLearned: [
          'Working with Kubernetes on tight memory budgets requires constant tradeoff decisions, I had to sacrifice Ollama memory allocation to fit everything in',
          'AI integration is very hit-or-miss! Sometimes it works great, sometimes fails completely, and I\'m still not entirely convinced of its value',
        ],
        futureImprovements: [
          'Add an interactive timeline showing my career progression and key milestones',
          'Include a resume section with viewing and PDF download capabilities',
          'Transform this into a reusable template that other developers can customize for their own portfolios',
        ],
        metrics: [
          {
            name: 'Memory Usage',
            value: '3 GB',
            description: 'Production memory usage',
            improvement: 'Reduced from 4 GB to 3 GB'
          },
          {
            name: 'Real-time Latency',
            value: '< 50ms',
            description: 'SignalR message delivery time',
            improvement: 'Near-instant updates with WebSockets'
          },
          {
            name: 'AI Response Time',
            value: '2.8s',
            description: 'Average Ollama AI model response time',
            improvement: 'Optimized prompts and model parameters'
          }
        ],
        timeline: [
          {
            date: new Date('2025-09-23'),
            title: 'Project Planning & Architecture',
            description: 'Defined requirements, selected technologies, and designed system architecture',
            completed: true
          },
          {
            date: new Date('2025-09-23'),
            title: 'Backend Development',
            description: 'Implemented .NET 8 API, SignalR hubs, and GitHub integration',
            completed: true
          },
          {
            date: new Date('2025-09-24'),
            title: 'Frontend Development',
            description: 'Built Angular application with real-time data visualization',
            completed: true
          },
          {
            date: new Date('2025-09-25'),
            title: 'GitHub Data Sync Worker',
            description: 'Created a worker to fetch and store GitHub data in Redis',
            completed: true
          },
          {
            date: new Date('2025-09-25'),
            title: 'Containerization & Deployment',
            description: 'Set up Docker containers and Kubernetes deployment',
            completed: true
          },
          {
            date: new Date('2025-09-26'),
            title: 'Performance Optimization',
            description: 'Optimized bundle size, caching, and real-time performance',
            completed: true
          },
          {
            date: new Date('2025-09-27'),
            title: 'Public Launch & Blog Integration',
            description: 'Deploy to production domain, set up Ghost CMS, and publish first blog post',
            completed: false
          },
        ],
        teamSize: 1,
        myRole: 'Full-stack Developer'
      }
    }
  ]);

  constructor() {}

  getProjects(): Signal<readonly Project[]> {
    return this.projects.asReadonly();
  }

  getFeaturedProjects(): Project[] {
    return this.projects().filter(project => project.featured);
  }

  getProjectsByCategory(category: string): Project[] {
    return this.projects().filter(project => project.category === category);
  }

  getProjectsByStatus(status: string): Project[] {
    return this.projects().filter(project => project.status === status);
  }

  getProjectById(id: string): Project | undefined {
    return this.projects().find(project => project.id === id);
  }

  getCategories() {
    return PROJECT_CATEGORIES;
  }

  getCategoryById(id: string) {
    return PROJECT_CATEGORIES.find(category => category.id === id);
  }

  // Future methods for dynamic project management
  addProject(project: Project): void {
    this.projects.update(projects => [...projects, project]);
  }

  updateProject(id: string, updates: Partial<Project>): void {
    this.projects.update(projects => 
      projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    );
  }

  deleteProject(id: string): void {
    this.projects.update(projects => 
      projects.filter(project => project.id !== id)
    );
  }
}
