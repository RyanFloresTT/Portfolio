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
      description: 'My new and improved portfolio website, showcasing my work with .NET, Angular, SignalR. I\'ve also set this up to be a fully containerized application, with a Kubernetes deployment.',
      longDescription: 'This project began as a way to learn more about Kubernetes. It has been on my todo for a while now, and I have finally got around to it! I also wanted to learn more about Angular, and SignalR. I\'ve been eyeing Ghost CMS to use for blogging, and this project allowed me to do that all of that. I had this cool idea to generate commit summaries using an Ollama container, which I thought would be a fun challenge, but I ended up scrapping the idea because it was too unreliable.',
      technologies: ['Angular', '.NET', 'SignalR', 'Redis', 'Docker', 'Kubernetes', 'TypeScript', 'Tailwind CSS'],
      status: 'completed',
      githubUrl: 'https://github.com/ryanflorestt/Portfolio',
      liveUrl: 'https://www.trustytea.me/',
      featured: true,
      startDate: new Date('2025-09-23'),
      endDate: new Date('2025-09-28'),
      category: 'web',
      tags: ['portfolio', 'real-time', 'data-processing', 'containerization'],
      challenges: [
        'Implementing real-time commit data formatting and filtering',
        'Working with an LLM to generate commit summaries',
        'Working with Kubernetes for the first time'
      ],
      achievements: [
        'Learned more about how to use Kubernetes!',
        'Implemented intelligent commit filtering and formatting!',
        'Implemented automated GitHub data synchronization!'
      ],
      hasDetailedView: true,
      blogPostUrl: 'https://blog.example.com/portfolio-development-journey',
      detailedContent: {
        overview: 'Built with Angular and .NET, this portfolio website features real-time data visualization, and a fully containerized deployment pipeline. The application serves as both a professional showcase and a demonstration of advanced technical capabilities.',
        problemStatement: 'While I have experience with .NET, I haven\'t had the chance to work with several modern tools I wanted to learn, specifically Kubernetes. I\'ve also been interested in Angular, SignalR, and Ghost CMS for blogging but hadn\'t had a chance to work with it. I wanted a project that would let me learn these technologies while building something cool. I also wanted to showcase my recent work in an engaging way by displaying recent commits from my repositories.',
        solution: 'I decided to completely rebuild my portfolio site! I saw it as an opportunity to learn multiple new technologies at once. While this meant starting from scratch rather than iterating on my existing portfolio, it allowed me to build something more extensible and modern. I chose Angular for the frontend to learn its ecosystem, implemented SignalR for real-time features, containerized everything with Docker and Kubernetes for deployment, and integrated with Ghost for blogging! I also built a system to fetch and format recent commits from my GitHub repositories to showcase my ongoing work.',
        keyFeatures: [
          'Real-time GitHub commit visualization with interactive heatmaps',
          'Intelligent commit filtering and formatting from recent GitHub activity',
          'Containerized deployment with zero-downtime updates',
          'Automated data synchronization with GitHub APIs',
          'Blog integration with Ghost CMS',
        ],
        technicalDecisions: [
          {
            decision: 'Removed AI generation due to inconsistencies and reliability issues',
            reasoning: 'The Ollama integration proved unreliable with frequent failures, inconsistent output quality, and unpredictable response times. AI-generated summaries often failed to capture the essence of actual work or produced generic content that didn\'t reflect real development activity.',
            alternatives: ['Continue debugging Ollama integration', 'Switch to external AI APIs', 'Improve AI prompts and parameters'],
            impact: 'Eliminated all AI-related failures and achieved 100% reliability. The system now shows actual recent commits with intelligent filtering, providing more authentic and valuable insights into development activity.'
          },
          {
            decision: 'Implemented simple commit formatting instead of AI generation',
            reasoning: 'A straightforward approach provides reliable results, eliminates external dependencies, and focuses on showcasing actual work rather than generated content.',
            alternatives: ['AI-powered summaries', 'Complex commit analysis', 'External API services'],
            impact: 'Achieved 100% reliability with instant response times, eliminated all external dependencies while maintaining clear visibility into actual development work, and freed up resources for other features.'
          },
          {
            decision: 'Chose Angular with standalone components',
            reasoning: 'I wanted to learn Angular, and standalone components are a great way to do that.',
            alternatives: ['Angular modules', 'React', 'Vue.js'],
            impact: 'I learned a lot about Angular :)'
          },
          {
            decision: 'Used Redis instead of a traditional database',
            reasoning: 'For this application, I realized I only needed the most recent commit data, and Redis provides excellent performance as an in-memory cache with persistence capabilities.',
            alternatives: ['PostgreSQL', 'MongoDB', 'SQLite'],
            impact: 'Achieved quick response times and simplified the architecture by using Redis as both cache and storage, with a background worker handling periodic updates.'
          },
          {
            decision: 'Stored project data here in the projects.service.ts file',
            reasoning: 'This is a simple way to store project data, and since this is a small portfolio site with infrequent updates, having it compiled into the bundle makes sense.',
            alternatives: ['A database', 'A server-side API', 'Static JSON files'],
            impact: 'Eliminated database, hosting costs, and API latency while maintaining good performance for this small dataset. The tradeoff is manual deploys for content updates.'
          }
        ],
        lessonsLearned: [
          'Working with Kubernetes on tight memory budgets requires constant tradeoff decisions, I had to optimize resource allocation to fit everything in.',
          'Simple, reliable solutions often work better than complex AI integrations. Focusing on actual data presentation provides more value than generated content.',
          'There are always tradeoffs to consider when making decisions, and I had to make a lot of them for this project, but I learned a lot from it!',
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
            name: 'Commit Processing',
            value: '< 100ms',
            description: 'Time to filter and format recent commits',
            improvement: 'Optimized filtering algorithms and caching'
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
            title: 'Removed AI generation',
            description: 'Removed AI generation due to inconsistencies and reliability issues',
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
    },
  {
    id: 'wraeclib',
    name: 'Wraeclib',
    description: 'A .NET API wrapper for the Path of Exile API, making it easier for developers to integrate PoE data into their applications.',
    category: 'api',
    tags: ['api', 'wrapper', 'dotnet'],
    status: 'in-progress',
    featured: false,
    githubUrl: 'https://github.com/RyanFloresTT/Wraeclib/',
    technologies: ['C#', '.NET', 'NuGet']
  },
  {
    id: 'devlog',
    name: 'DevLog',
    description: 'A local developer logging platform built with Ruby and Tailwind CSS to track coding progress and learning journey. Containerized with Docker.',
    category: 'web',
    tags: ['web', 'developer-log', 'ruby', 'postgresql'],
    status: 'completed',
    featured: false,
    githubUrl: 'https://github.com/RyanFloresTT/DevLog',
    technologies: ['Ruby', 'Tailwind CSS', 'Docker']
  },
  {
    id: 'gbjam11',
    name: 'Hopscape',
    description: 'A Game Boy-styled game created for the GBJAM11 game jam competition.',
    category: 'game',
    tags: ['game-dev', 'pixel-art', 'unity', 'game-jam', 'team-project'],
    status: 'completed',
    featured: false,
    githubUrl: 'https://github.com/RyanFloresTT/GBJAM11',
    liveUrl: 'https://ryanflorestt.itch.io/hopscape',
    technologies: ['Game Development', 'Pixel Art', 'Unity'],
  },
  {
    id: 'super-hangman',
    name: 'Super Hangman',
    description: 'A modern take on the classic Hangman game, released on Steam with enhanced features and gameplay mechanics.',
    category: 'game',
    tags: ['game-dev', 'pixel-art', 'unity', 'steam'],
    status: 'completed',
    featured: true,
    technologies: ['Unity', 'C#', 'Steam SDK']
  },
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
