/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import CitizenDashboard from './components/CitizenDashboard';
import GovernmentDashboard from './components/GovernmentDashboard';
import AuthModal from './components/AuthModal';
import AIChatbot from './components/AIChatbot';
import { CivicIssue, CitizenProfile, UserRole } from './types';

// Pre-seeded municipal issues for rich UX on load
const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: 'iss-101',
    title: 'Nexus Fusion Conduit Interruption',
    description: 'A sudden telemetry drop in the phase-conduits of Grid Sector 0. Local automated power redistributors diverted load, but we observe an active spark hazard near Block Alpha.',
    status: 'assigned',
    category: 'Power Blackout',
    department: 'Bureau of Power & Light',
    severity: 'critical',
    urgency: 'high',
    location: {
      lat: 0.8,
      lng: 1.2,
      address: 'Grid Sector 1 - Substations Alpha Line'
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=80',
    upvotes: 24,
    upvotedBy: ['governor@civicpulse.ai'],
    comments: [
      { id: 'c-1', author: 'Alex Mercer', authorEmail: 'citizen@civicpulse.ai', role: 'citizen', text: 'Power has been flickering in the residential east block too, please dispatch inspectors!', createdAt: new Date().toISOString() }
    ],
    priorityScore: 84,
    assignedOfficer: 'Officer K. Thorne (Unit 8)',
    aiSummary: 'Critical power transmission drop in sector substation. Active spark threat detected.',
    complaintText: 'PETITION REF #E-8411\nTO: Bureau of Power & Light\nSUBJECT: Substation Phase-Conduit Emergency Action\n\nTo the Director,\nThis dispatch requests immediate physical repair of substation Grid 1. Visual evidence of active spark hazards represents an immediate public safety threat.',
    history: [
      { status: 'pending', notes: 'Cognitive dispatch ingested.', updatedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
      { status: 'assigned', notes: 'Officer K. Thorne dispatched to phase terminal.', updatedAt: new Date(Date.now() - 3600000 * 1.5).toISOString() }
    ]
  },
  {
    id: 'iss-102',
    title: 'High-Volume Main Water Pipe Rupture',
    description: 'Water pressure dropped below 1.5 Bar on the line feeding Sector Gamma. Active flooding is observed on the central road easement, spreading toward the research center park.',
    status: 'pending',
    category: 'Water Outage',
    department: 'Department of Environmental Protection',
    severity: 'high',
    urgency: 'high',
    location: {
      lat: 4.2,
      lng: 2.1,
      address: 'Sector Gamma - 4th Avenue Easement'
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    upvotes: 18,
    upvotedBy: [],
    comments: [],
    priorityScore: 78,
    aiSummary: 'Emergency waterline break on 4th Avenue. Imminent risk of local property inundation.',
    complaintText: 'PETITION REF #W-7812\nTO: Department of Environmental Protection\nSUBJECT: Emergency Water Line Intervention Request\n\nDear Director,\nWe officially request immediate dispatch of valve-closure responders to 4th Ave to prevent further commercial property structural damage.',
    history: [
      { status: 'pending', notes: 'Cognitive dispatch ingested.', updatedAt: new Date(Date.now() - 3600000 * 4).toISOString() }
    ]
  },
  {
    id: 'iss-103',
    title: 'HyperLoop Track Fracturing',
    description: 'A structural micro-fissure was caught by drone surveillance on track 4 near Sector Delta. Cars are running on a 25% deceleration protocol to ensure commuter safety.',
    status: 'pending',
    category: 'Road Damage',
    department: 'Department of Transportation',
    severity: 'medium',
    urgency: 'medium',
    location: {
      lat: 3.4,
      lng: 4.0,
      address: 'Route 4 Elevated Corridor Sector'
    },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    upvotes: 8,
    upvotedBy: [],
    comments: [],
    priorityScore: 52,
    aiSummary: 'Track micro-fissure observed. Automated commute deceleration protocol active.',
    complaintText: 'PETITION REF #T-5211\nTO: Department of Transportation\nSUBJECT: Elevated Track Micro-Fissure Resurfacing\n\nTo the Board,\nRequesting track grinding and seal resurfacing of corridor Sector 4. Transit performance impaired.',
    history: [
      { status: 'pending', notes: 'Cognitive dispatch ingested.', updatedAt: new Date(Date.now() - 3600000 * 8).toISOString() }
    ]
  }
];

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'citizen' | 'government'>('landing');
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>('citizen');
  const [issues, setIssues] = useState<CivicIssue[]>(INITIAL_ISSUES);

  // User Profile
  const [userProfile, setUserProfile] = useState<CitizenProfile>({
    email: 'citizen@civicpulse.ai',
    displayName: 'Alex Mercer',
    score: 180,
    badges: [
      { id: 'b-1', name: 'First Responder', description: 'Filed first validated district report', icon: '⚡', earnedAt: new Date().toISOString() },
      { id: 'b-2', name: 'Water Warden', description: 'Helped resolve local water line break', icon: '💧', earnedAt: new Date().toISOString() }
    ],
    challenges: [
      { id: 'ch-1', name: 'Transit Sentry', description: 'Upvote or report transit/road hazards', points: 50, progress: 1, target: 2, completed: false },
      { id: 'ch-2', name: 'Peer Evaluator', description: 'Add feedback to 2 active complaints', points: 30, progress: 0, target: 2, completed: false }
    ],
    completedReports: 3,
    verifiedReports: 2
  });

  // Authentication trigger
  const handleEnterApp = (role: 'citizen' | 'government') => {
    setAuthRole(role);
    setShowAuth(true);
  };

  const handleLoginSuccess = (email: string, name: string, role: UserRole) => {
    setUserProfile(prev => ({
      ...prev,
      email,
      displayName: name
    }));
    setShowAuth(false);
    setActiveView(role === 'government' ? 'government' : 'citizen');
  };

  // Dispatch Action Event Handlers
  const handleReportIssue = (newIssueData: Omit<CivicIssue, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy' | 'comments' | 'history'>) => {
    const freshIssue: CivicIssue = {
      ...newIssueData,
      id: `iss-${Math.floor(Math.random() * 900) + 100}`,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      upvotedBy: [userProfile.email],
      comments: [],
      history: [{ status: 'pending', notes: 'Cognitive dispatch ingested.', updatedAt: new Date().toISOString() }]
    };

    setIssues(prev => [freshIssue, ...prev]);

    // Reward XP and update weekly challenges
    setUserProfile(prev => {
      const updatedChallenges = prev.challenges.map(c => {
        if (c.id === 'ch-1' && freshIssue.category === 'Road Damage') {
          const nextProg = Math.min(c.target, c.progress + 1);
          return { ...c, progress: nextProg, completed: nextProg === c.target };
        }
        return c;
      });

      const solvedChallengePoints = updatedChallenges.reduce((acc, curr, idx) => {
        if (curr.completed && !prev.challenges[idx].completed) {
          return acc + curr.points;
        }
        return acc;
      }, 0);

      return {
        ...prev,
        score: prev.score + 50 + solvedChallengePoints, // 50 base report XP + challenge XP
        completedReports: prev.completedReports + 1,
        challenges: updatedChallenges
      };
    });
  };

  const handleUpvoteIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const isUpvoted = issue.upvotedBy.includes(userProfile.email);
        const upvotedBy = isUpvoted 
          ? issue.upvotedBy.filter(e => e !== userProfile.email)
          : [...issue.upvotedBy, userProfile.email];
        
        const upvotes = isUpvoted ? issue.upvotes - 1 : issue.upvotes + 1;
        
        // Recalculate priority score dynamically based on upvotes
        const priorityScore = Math.min(100, Math.max(0, issue.priorityScore + (isUpvoted ? -2 : 2)));

        return { ...issue, upvotes, upvotedBy, priorityScore };
      }
      return issue;
    }));
  };

  const handleAddComment = (issueId: string, text: string) => {
    const commentObj = {
      id: Math.random().toString(),
      author: userProfile.displayName,
      authorEmail: userProfile.email,
      role: 'citizen' as UserRole,
      text,
      createdAt: new Date().toISOString()
    };

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, comments: [...issue.comments, commentObj] };
      }
      return issue;
    }));

    // Increment Peer Evaluator challenge progress
    setUserProfile(prev => {
      const updatedChallenges = prev.challenges.map(c => {
        if (c.id === 'ch-2') {
          const nextProg = Math.min(c.target, c.progress + 1);
          return { ...c, progress: nextProg, completed: nextProg === c.target };
        }
        return c;
      });

      const solvedChallengePoints = updatedChallenges.reduce((acc, curr, idx) => {
        if (curr.completed && !prev.challenges[idx].completed) {
          return acc + curr.points;
        }
        return acc;
      }, 0);

      return {
        ...prev,
        score: prev.score + 10 + solvedChallengePoints, // 10 base comment XP + challenge XP
        challenges: updatedChallenges
      };
    });
  };

  const handleAssignOfficer = (issueId: string, officerName: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { 
          ...issue, 
          status: 'assigned', 
          assignedOfficer: officerName,
          history: [...issue.history, { status: 'assigned', notes: `Officer assigned: ${officerName}`, updatedAt: new Date().toISOString() }]
        };
      }
      return issue;
    }));
  };

  const handleResolveIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { 
          ...issue, 
          status: 'resolved',
          history: [...issue.history, { status: 'resolved', notes: 'Issue resolved by field responders.', updatedAt: new Date().toISOString() }]
        };
      }
      return issue;
    }));
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: LANDING PAGE */}
        {activeView === 'landing' && (
          <motion.div 
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <LandingPage onEnterApp={handleEnterApp} mockIssues={issues} />
          </motion.div>
        )}

        {/* VIEW 2: CITIZEN HUB */}
        {activeView === 'citizen' && (
          <motion.div 
            key="citizen-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <CitizenDashboard 
              profile={userProfile}
              activeIssues={issues}
              onReportIssue={handleReportIssue}
              onUpvoteIssue={handleUpvoteIssue}
              onAddComment={handleAddComment}
              onLogout={() => setActiveView('landing')}
            />
          </motion.div>
        )}

        {/* VIEW 3: GOVERNMENT COMMAND PORTAL */}
        {activeView === 'government' && (
          <motion.div 
            key="government-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <GovernmentDashboard 
              activeIssues={issues}
              onAssignOfficer={handleAssignOfficer}
              onResolveIssue={handleResolveIssue}
              onLogout={() => setActiveView('landing')}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Auth Gate overlay */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal 
            initialRole={authRole}
            onClose={() => setShowAuth(false)}
            onLogin={handleLoginSuccess}
          />
        )}
      </AnimatePresence>

      {/* Floating Global Smart City Assistant bot */}
      <AIChatbot />
    </div>
  );
}
