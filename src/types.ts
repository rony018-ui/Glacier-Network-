export type UserRole = 'professor' | 'researcher' | 'student' | 'independent' | 'institution';

export interface Institution {
  id: string;
  name: string;
  type: 'university' | 'organization';
  location: string;
  description: string;
  logo: string;
  banner: string;
  website: string;
  transparencyScore: number;
  memberCount?: number;
  publicationCount?: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  institutionId?: string;
  institutionName?: string;
  institution?: string;
  bio?: string;
  avatar?: string;
  impactPoints: number;
}

export interface Campaign {
  id: string;
  userId: string;
  institutionId?: string;
  authorName: string;
  institutionName?: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'active' | 'completed';
  category: string;
  sdg: string;
  createdAt: string;
  solutionCount?: number;
  milestones?: Milestone[];
  solutions?: Solution[];
  targetRoles?: UserRole[];
  tasks?: Task[];
  resources?: Resource[];
  impactMetrics?: ImpactMetric[];
  backgroundContext?: string;
  badges?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  isCompleted: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'paper' | 'dataset' | 'tool' | 'ai';
  url: string;
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: string;
  target: string;
}

export interface NetworkGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  image: string;
  isPrivate: boolean;
}

export interface NetworkProfile extends User {
  expertise: string[];
  location: string;
  collaborationCount: number;
  paperCount: number;
  sdgContributions: string[];
  isVerified: boolean;
  recentActivity?: string;
  missionHistory?: string[];
  publications?: string[];
}

export interface Milestone {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  isCompleted: boolean;
  orderIndex: number;
}

export interface Solution {
  id: string;
  campaignId: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string;
  votes: number;
  feasibilityScore: number;
  createdAt: string;
}

export interface Publication {
  id: string;
  userId: string;
  campaignId?: string;
  authorName: string;
  authorRole: string;
  title: string;
  abstract: string;
  content: string;
  tags?: string;
  doi?: string;
  citations: number;
  sdg?: string;
  createdAt: string;
}

export interface Discussion {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  description: string;
  category: string;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  discussionId: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}
