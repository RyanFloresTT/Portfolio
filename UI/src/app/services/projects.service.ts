import { Injectable, signal } from '@angular/core';
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
      githubUrl: 'https://github.com/ryanflorestt/PortfolioMakeover',
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
      ]
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

  getProjects() {
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
