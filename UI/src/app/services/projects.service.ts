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
      endDate: undefined,
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
    description: 'I\'m building a .NET client library for the Path of Exile API because I got tired of dealing with raw HTTP requests every time I wanted to mess around with PoE data.',
    longDescription: 'As someone who\'s spent way too much time playing Path of Exile, I kept finding myself wanting to build tools that interact with GGG\'s API. Every time I started a new project, I\'d end up writing the same HTTP client code over and over again. So I decided to just build a proper library that handles all the boring stuff like authentication, rate limiting, and data parsing. I was inspired to build this from a similar libary for interacting with the World of Warcraft API.',
    category: 'api',
    tags: ['api', 'gaming', 'dotnet', 'open-source'],
    status: 'in-progress',
    featured: true,
    githubUrl: 'https://github.com/RyanFloresTT/Wraeclib/',
    technologies: ['C#', '.NET 9', 'NuGet', 'Path of Exile API'],
    startDate: new Date('2025-09-24'),
    endDate: undefined,
    challenges: [
      'Getting OAuth approval from GGG',
      'Designing a clean, intuitive API that doesn\'t feel clunky to use',
      'Planning for Path of Exile 2 support when the API eventually drops'
    ],
    achievements: [
      'Got the basic league and ladder endpoints working smoothly!',
      'Implemented a builder pattern that actually feels nice to use',
    ],
    hasDetailedView: false
  },
  {
    id: 'devlog',
    name: 'DevLog',
    description: 'I built this because I wanted to actually track my coding sessions properly instead of just vaguely remembering what I worked on. It lets you create projects, log work sessions with opening/closing notes, and export everything as markdown for blogging.',
    longDescription: 'I was getting frustrated with not having a good way to track my development work. I wanted something simple where I could create a project, start a session when I sit down to code, add notes about what I\'m working on and any blockers I hit, then close it out with closing thoughts. Plus I wanted to be able to export everything as markdown to kickstart blog posts about my projects.',
    category: 'web',
    tags: ['web', 'productivity', 'ruby', 'rails'],
    status: 'completed',
    featured: true,
    githubUrl: 'https://github.com/RyanFloresTT/DevLog',
    technologies: ['Ruby on Rails', 'Tailwind CSS', 'Docker', 'PostgreSQL'],
    startDate: new Date('2024-04-12'),
    endDate: new Date('2024-04-15'),
    challenges: [
      'Learning Rails',
      'Getting the session flow to feel natural and not intrusive',
      'Making the export functionality actually useful for blogging'
    ],
    achievements: [
      'Actually shipped something with Rails for the first time!',
      'The session logging flow feels really smooth to use',
      'Export to markdown works perfectly for turning sessions into blog posts'
    ],
    hasDetailedView: false
  },
  {
    id: 'gbjam11',
    name: 'Hopscape',
    description: 'My first game jam collaboration with my friend Robby! We built this Game Boy-styled game for GBJAM11 and learned a ton about working together on game development. It was a really fun experience that actually led to us working on Super Hangman together with Robby later.',
    longDescription: 'This was my first time working with Robby on a game project, and it was honestly a blast. We decided to enter GBJAM11 (a game jam focused on Game Boy aesthetics) and built this little game called Hopscape. The whole experience taught me a lot about collaborative game development and how different our approaches to coding can be.',
    category: 'game',
    tags: ['game-dev', 'pixel-art', 'unity', 'game-jam', 'team-project'],
    status: 'completed',
    featured: false,
    githubUrl: 'https://github.com/RyanFloresTT/GBJAM11',
    liveUrl: 'https://ryanflorestt.itch.io/hopscape',
    technologies: ['Unity', 'C#', 'Pixel Art', 'Game Boy Style'],
    startDate: new Date('2023-09-14'),
    endDate: new Date('2023-09-24'),
    challenges: [
      'Learning to collaborate effectively on game development',
      'Working within the Game Boy aesthetic constraints',
      'Managing time during a game jam with team coordination'
    ],
    achievements: [
      'Successfully shipped our first collaborative game!',
      'Learned how to work with someone else\'s coding style',
      'Created something that actually felt like a real Game Boy game'
    ],
    hasDetailedView: false
  },
  {
    id: 'super-hangman',
    name: 'Super Hangman',
    description: 'This was such a cool project! My friend Robby and I took a hangman game he was working on and turned it into something we could actually release on Steam. We learned a ton about Steam integration, especially dealing with Steamworks.NET and getting achievements working properly.',
    longDescription: 'Robby was originally building this as a side project to learn, but we realized there might be potential to actually release something on Steam together. It was our second collaboration after GBJAM11, and this time we went all the way to a commercial release. The whole Steam integration process was way more complicated than I expected, especially dealing with cross-platform compatibility issues.',
    category: 'game',
    tags: ['game-dev', 'steam', 'unity', 'team-project', 'commercial-release'],
    status: 'completed',
    featured: true,
    technologies: ['Unity', 'C#', 'Steamworks.NET', 'Steam SDK'],
    startDate: new Date('2024-01-17'),
    endDate: new Date('2024-06-05'),
    liveUrl: 'https://store.steampowered.com/app/superhangman',
    challenges: [
      'Getting Steam integration working properly across different operating systems',
      'Switching from Facepunch Steamworks to Steamworks.NET due to compatibility issues',
      'Implementing achievements and leaderboards with the more verbose Steamworks.NET API',
    ],
    achievements: [
      'Successfully released our first commercial game on Steam!',
      'Figured out Steamworks integration despite the documentation challenges',
      'Got achievements and leaderboards working properly',
      'Learned a ton about the Steam publishing process'
    ],
    hasDetailedView: true,
    detailedContent: {
      overview: 'Super Hangman started as Robby\'s solo learning project but became our second collaboration and first commercial Steam release. We took the classic hangman concept and added Steam features like achievements, leaderboards, and stat tracking.',
      problemStatement: 'Robby had a working hangman game but wanted to see if we could take it to the next level and actually release it commercially. We had to figure out Steam integration, which turned out to be way more complex than we initially thought.',
      solution: 'We decided to integrate Steamworks to add achievements, leaderboards, and stat tracking. The game features AI-generated images after each guess, competitive scoring, and Steam integration for a modern take on the classic game.',
      keyFeatures: [
        'Classic hangman gameplay with modern polish',
        'AI-generated images that appear after each guess',
        'Steam achievements for reaching score milestones',
        'Global leaderboards for competitive players',
        'Stat tracking to create meaningful achievements',
        'Cross-platform Steam integration'
      ],
      technicalDecisions: [
        {
          decision: 'Switched from Facepunch Steamworks to Steamworks.NET',
          reasoning: 'We started with Facepunch because it was super easy to understand and get working quickly. But we ran into major issues when trying to run the game on non-Windows systems. Steamworks.NET is much more verbose but actually works everywhere.',
          alternatives: ['Keep fighting with Facepunch', 'Abandon Steam integration', 'Use a different approach'],
          impact: 'Took longer to implement but gave us reliable cross-platform Steam functionality. The API is much more verbose and feels like writing C++, but it works consistently.'
        },
        {
          decision: 'Added AI-generated images to make the game more interesting',
          reasoning: 'We wanted something to make the game feel fresh and modern. The AI-generated images that appear after each guess add a unique twist to the classic hangman format.',
          alternatives: ['Use static images', 'No images at all', 'Hand-drawn art'],
          impact: 'Made the game stand out from other hangman games and gave it a modern feel that people seemed to really enjoy.'
        }
      ],
      lessonsLearned: [
        'Steam integration is way more complex than it initially appears',
        'Cross-platform compatibility issues can force you to completely rewrite integration code',
        'Steamworks.NET documentation is basically the C++ docs - you have to read those',
        'Achievements and leaderboards add a lot of replay value to simple games',
        'Working with a friend on commercial projects is really rewarding'
      ],
      futureImprovements: [
        'Maybe add more word categories or difficulty levels',
        'Could implement multiplayer features',
        'Might add more AI-generated content or customization options'
      ]
    },
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
