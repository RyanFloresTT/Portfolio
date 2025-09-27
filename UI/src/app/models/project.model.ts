export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  startDate?: Date;
  endDate?: Date;
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'devops' | 'ai' | 'game' | 'other';
  tags: string[];
  screenshots?: string[];
  challenges?: string[];
  achievements?: string[];
  // New detailed section properties
  hasDetailedView?: boolean;
  blogPostUrl?: string;
  detailedContent?: ProjectDetailedContent;
}

export interface ProjectDetailedContent {
  overview: string;
  problemStatement?: string;
  solution?: string;
  architecture?: string;
  keyFeatures?: string[];
  technicalDecisions?: TechnicalDecision[];
  lessonsLearned?: string[];
  futureImprovements?: string[];
  metrics?: ProjectMetric[];
  timeline?: ProjectMilestone[];
  teamSize?: number;
  myRole?: string;
  codeSnippets?: CodeSnippet[];
  additionalScreenshots?: string[];
  relatedProjects?: string[];
}

export interface TechnicalDecision {
  decision: string;
  reasoning: string;
  alternatives?: string[];
  impact?: string;
}

export interface ProjectMetric {
  name: string;
  value: string;
  description?: string;
  improvement?: string;
}

export interface ProjectMilestone {
  date: Date;
  title: string;
  description: string;
  completed: boolean;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: 'web',
    name: 'Web Applications',
    description: 'Full-stack web applications and websites',
    icon: '🌐',
    color: 'blue'
  },
  {
    id: 'mobile',
    name: 'Mobile Apps',
    description: 'iOS and Android applications',
    icon: '📱',
    color: 'green'
  },
  {
    id: 'desktop',
    name: 'Desktop Applications',
    description: 'Cross-platform desktop software',
    icon: '💻',
    color: 'purple'
  },
  {
    id: 'api',
    name: 'APIs & Services',
    description: 'Backend services and REST APIs',
    icon: '⚡',
    color: 'orange'
  },
  {
    id: 'devops',
    name: 'DevOps & Infrastructure',
    description: 'Deployment, CI/CD, and infrastructure',
    icon: '🚀',
    color: 'indigo'
  },
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    description: 'Artificial intelligence and ML projects',
    icon: '🤖',
    color: 'pink'
  },
  {
    id: 'game',
    name: 'Game Development',
    description: 'Game development projects',
    icon: '🎮',
    color: 'red'
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Miscellaneous projects and experiments',
    icon: '🔧',
    color: 'gray'
  }
];
