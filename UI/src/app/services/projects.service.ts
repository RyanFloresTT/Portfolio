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
      description: 'A modern, real-time portfolio showcasing my development work with live GitHub integration and AI-powered summaries.',
      longDescription: 'This portfolio represents a comprehensive showcase of modern web development practices, featuring real-time data visualization, AI integration, and containerized deployment. The application demonstrates full-stack development skills with a focus on performance, user experience, and maintainable architecture.',
      technologies: ['Angular', '.NET 8', 'SignalR', 'Redis', 'Docker', 'Kubernetes', 'Ollama', 'TypeScript', 'Tailwind CSS'],
      status: 'completed',
      githubUrl: 'https://github.com/ryanflorestt/Portfolio',
      liveUrl: 'http://localhost:30082/',
      featured: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-01'),
      category: 'web',
      tags: ['portfolio', 'real-time', 'ai', 'containerization'],
      challenges: [
        'Implementing real-time data synchronization with SignalR',
        'Integrating local AI models for content generation',
        'Setting up containerized deployment pipeline'
      ],
      achievements: [
        'Achieved 99.9% uptime with containerized deployment',
        'Reduced page load time to under 2 seconds',
        'Implemented automated GitHub data synchronization'
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
          'Responsive design with dark/light mode support',
          'Containerized deployment with zero-downtime updates',
          'Automated data synchronization with GitHub APIs',
          'Performance monitoring and optimization',
          'SEO-optimized with server-side rendering capabilities'
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
          }
        ],
        lessonsLearned: [
          'Container orchestration with Kubernetes requires careful resource planning and monitoring',
          'Real-time applications need robust error handling and reconnection logic',
          'AI model integration requires careful prompt engineering and response validation',
          'Performance optimization is crucial for real-time data visualization',
          'Automated testing becomes more complex with real-time and AI components'
        ],
        futureImprovements: [
          'Implement WebRTC for peer-to-peer communication features',
          'Add support for multiple AI models and model comparison',
          'Integrate with additional development platforms (GitLab, Bitbucket)',
          'Implement advanced analytics and insights dashboard',
          'Add collaborative features for team projects',
          'Implement progressive web app (PWA) capabilities'
        ],
        metrics: [
          {
            name: 'Page Load Time',
            value: '< 2 seconds',
            description: 'Initial page load time',
            improvement: '60% faster than initial implementation'
          },
          {
            name: 'Uptime',
            value: '99.9%',
            description: 'Application availability',
            improvement: 'Achieved through containerized deployment'
          },
          {
            name: 'AI Response Time',
            value: '< 3 seconds',
            description: 'Time to generate commit summaries',
            improvement: 'Optimized with local models and caching'
          },
          {
            name: 'Bundle Size',
            value: '2.1 MB',
            description: 'Production bundle size',
            improvement: '15% reduction with standalone components'
          }
        ],
        timeline: [
          {
            date: new Date('2024-01-01'),
            title: 'Project Planning & Architecture',
            description: 'Defined requirements, selected technologies, and designed system architecture',
            completed: true
          },
          {
            date: new Date('2024-02-01'),
            title: 'Backend Development',
            description: 'Implemented .NET 8 API, SignalR hubs, and GitHub integration',
            completed: true
          },
          {
            date: new Date('2024-03-01'),
            title: 'Frontend Development',
            description: 'Built Angular application with real-time data visualization',
            completed: true
          },
          {
            date: new Date('2024-04-01'),
            title: 'AI Integration',
            description: 'Integrated Ollama for local AI model processing',
            completed: true
          },
          {
            date: new Date('2024-05-01'),
            title: 'Containerization & Deployment',
            description: 'Set up Docker containers and Kubernetes deployment',
            completed: true
          },
          {
            date: new Date('2024-06-01'),
            title: 'Performance Optimization',
            description: 'Optimized bundle size, caching, and real-time performance',
            completed: true
          }
        ],
        teamSize: 1,
        myRole: 'Full-stack Developer, DevOps Engineer, UI/UX Designer',
        codeSnippets: [
          {
            title: 'SignalR Hub Implementation',
            language: 'csharp',
            code: `[Hub]
public class PortfolioHub : Hub
{
    private readonly ICommitAnalysisService _commitService;
    private readonly IRedisService _redisService;

    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task GetCommitAnalysis(string repository)
    {
        var cached = await _redisService.GetAsync<CommitAnalysis>($"analysis:{repository}");
        if (cached != null)
        {
            await Clients.Caller.SendAsync("CommitAnalysisReceived", cached);
            return;
        }

        var analysis = await _commitService.AnalyzeCommitsAsync(repository);
        await _redisService.SetAsync($"analysis:{repository}", analysis, TimeSpan.FromHours(24));
        await Clients.Caller.SendAsync("CommitAnalysisReceived", analysis);
    }
}`,
            description: 'SignalR hub handling real-time commit analysis with Redis caching'
          },
          {
            title: 'Angular SignalR Service',
            language: 'typescript',
            code: `@Injectable({ providedIn: 'root' })
export class SignalRService {
  private connection: signalR.HubConnection;
  
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/portfolioHub')
      .build();
  }

  async startConnection(): Promise<void> {
    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  getCommitAnalysis(repository: string): Observable<CommitAnalysis> {
    return new Observable(observer => {
      this.connection.on('CommitAnalysisReceived', (data: CommitAnalysis) => {
        observer.next(data);
      });
      
      this.connection.invoke('GetCommitAnalysis', repository);
    });
  }
}`,
            description: 'Angular service for managing SignalR connection and real-time data'
          }
        ],
        additionalScreenshots: [
          'assets/screenshots/portfolio-dashboard.png',
          'assets/screenshots/portfolio-heatmap.png',
          'assets/screenshots/portfolio-ai-analysis.png',
          'assets/screenshots/portfolio-mobile.png'
        ],
        relatedProjects: ['ai-integration', 'containerized-deployment', 'real-time-dashboard']
      }
    },
    {
      id: 'ai-integration',
      name: 'AI-Powered Commit Analysis',
      description: 'Real-time analysis of GitHub commits using local AI models to generate personalized summaries.',
      longDescription: 'A sophisticated system that analyzes GitHub commit patterns and generates contextual summaries using local AI models. This project demonstrates advanced integration of AI services with web applications.',
      technologies: ['C#', 'Ollama', 'Llama 3.2', 'SignalR', 'Redis', 'GitHub API'],
      status: 'completed',
      featured: true,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-01'),
      category: 'ai',
      tags: ['ai', 'github', 'analysis', 'automation'],
      challenges: [
        'Optimizing AI model performance for real-time responses',
        'Handling large volumes of GitHub API data',
        'Implementing intelligent caching strategies'
      ],
      achievements: [
        'Reduced AI response time to under 3 seconds',
        'Achieved 95% accuracy in commit analysis',
        'Implemented intelligent caching with 24-hour TTL'
      ]
    },
    {
      id: 'containerized-deployment',
      name: 'Containerized Deployment Pipeline',
      description: 'Full-stack application deployment using Docker and Kubernetes with automated CI/CD.',
      longDescription: 'A comprehensive DevOps solution that automates the deployment of full-stack applications using modern containerization technologies.',
      technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'Nginx', 'YAML'],
      status: 'completed',
      featured: false,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      category: 'devops',
      tags: ['devops', 'docker', 'kubernetes', 'cicd'],
      challenges: [
        'Setting up multi-stage Docker builds for optimization',
        'Configuring Kubernetes services and ingress',
        'Implementing automated health checks'
      ],
      achievements: [
        'Reduced deployment time from 30 minutes to 5 minutes',
        'Achieved zero-downtime deployments',
        'Implemented automated rollback capabilities'
      ]
    },
    {
      id: 'real-time-dashboard',
      name: 'Real-time Development Dashboard',
      description: 'Live visualization of development activity with real-time updates and interactive heatmaps.',
      longDescription: 'An interactive dashboard that provides real-time insights into development activity, featuring dynamic visualizations and responsive design.',
      technologies: ['Angular', 'SignalR', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
      status: 'completed',
      featured: false,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      category: 'web',
      tags: ['dashboard', 'real-time', 'visualization', 'responsive'],
      challenges: [
        'Implementing smooth real-time data updates',
        'Creating responsive heatmap visualizations',
        'Optimizing performance for large datasets'
      ],
      achievements: [
        'Achieved 60fps smooth animations',
        'Implemented responsive design for all screen sizes',
        'Reduced data transfer by 40% with efficient updates'
      ]
    },
    {
      id: 'blog-cms',
      name: 'Ghost CMS Integration',
      description: 'Integrated Ghost CMS for technical blog posts and content management.',
      longDescription: 'A seamless integration of Ghost CMS with the portfolio application, providing a robust content management system for technical blog posts.',
      technologies: ['Ghost', 'Docker', 'SQLite', 'Nginx', 'JavaScript'],
      status: 'completed',
      featured: false,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-28'),
      category: 'web',
      tags: ['cms', 'blog', 'content', 'integration'],
      challenges: [
        'Configuring Ghost for production deployment',
        'Setting up automated backups',
        'Optimizing content delivery'
      ],
      achievements: [
        'Achieved 99.5% content delivery reliability',
        'Implemented automated backup system',
        'Optimized page load times for blog content'
      ]
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
