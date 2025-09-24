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
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'devops' | 'ai' | 'other';
  tags: string[];
  screenshots?: string[];
  challenges?: string[];
  achievements?: string[];
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
    id: 'other',
    name: 'Other',
    description: 'Miscellaneous projects and experiments',
    icon: '🔧',
    color: 'gray'
  }
];
