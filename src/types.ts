/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'citizen' | 'government' | 'guest';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export interface Comment {
  id: string;
  author: string;
  authorEmail: string;
  role: UserRole;
  text: string;
  createdAt: string;
}

export interface IssueHistory {
  status: 'pending' | 'assigned' | 'resolved';
  notes: string;
  updatedAt: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'resolved';
  category: string;
  department: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high';
  location: LocationData;
  createdAt: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  upvotes: number;
  upvotedBy: string[]; // List of user emails who upvoted
  comments: Comment[];
  aiSummary?: string;
  complaintText?: string;
  priorityScore: number; // 0 - 100 calculated by severity, urgency, and upvotes
  assignedOfficer?: string;
  history: IssueHistory[];
  isFraudulent?: boolean;
  fraudAnalysis?: string;
  aiClassified?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface CitizenProfile {
  email: string;
  displayName: string;
  score: number;
  badges: Badge[];
  challenges: WeeklyChallenge[];
  completedReports: number;
  verifiedReports: number;
}

export interface LeaderboardEntry {
  email: string;
  displayName: string;
  score: number;
  completedReports: number;
  rank: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  createdAt: string;
}
