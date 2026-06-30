/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, AlertCircle, Send, Upload, Music, Video, MapPin, 
  ThumbsUp, MessageSquare, Award, Flame, User, Trophy, 
  Loader2, BadgeAlert, CheckCircle, Search, Clock, Zap, BookOpen 
} from 'lucide-react';
import { CivicIssue, CitizenProfile, LeaderboardEntry } from '../types';

interface CitizenDashboardProps {
  profile: CitizenProfile;
  activeIssues: CivicIssue[];
  onReportIssue: (newIssue: Omit<CivicIssue, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy' | 'comments' | 'history'>) => void;
  onUpvoteIssue: (issueId: string) => void;
  onAddComment: (issueId: string, commentText: string) => void;
  onLogout: () => void;
}

export default function CitizenDashboard({
  profile,
  activeIssues,
  onReportIssue,
  onUpvoteIssue,
  onAddComment,
  onLogout
}: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'feed' | 'rewards'>('report');
  
  // Reporting Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<string | null>(null);
  const [attachedVideo, setAttachedVideo] = useState<string | null>(null);
  const [clickCoordinates, setClickCoordinates] = useState<{ lat: number; lng: number; address: string }>({
    lat: 2.5,
    lng: 2.5,
    address: 'District 3 - Sector Delta Center'
  });

  // AI Cognitive pre-analysis states
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comment inputs
  const [commentInputs, setCommentInputs] = useState<{ [issueId: string]: string }>({});

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Sector coordinates translation helper
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale to our 5x5 grid
    const lat = Number(((x / rect.width) * 5).toFixed(2));
    const lng = Number(((y / rect.height) * 5).toFixed(2));
    
    let address = 'Residential East - Sector Gamma';
    if (lat < 2 && lng < 2) address = 'Nexus Fusion Substation';
    else if (lat > 3 && lng < 2) address = 'BioPulse Medical East';
    else if (lat < 2 && lng > 3) address = 'Quantum Incubator Park';
    else if (lat > 3 && lng > 3) address = 'HyperLoop Transit Center';
    else if (lat >= 2 && lat <= 3.5 && lng >= 2 && lng <= 3.5) address = 'Civic HQ Plaza, Sector Delta';

    setClickCoordinates({ lat, lng, address });
  };

  // Live trigger server-side Cognitive AI analysis
  const triggerCognitiveAnalysis = async () => {
    if (!description) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${title} ${description}` })
      });
      const data = await response.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error('Error analyzing issue:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Package details. Fallback values if Cognitive AI analyzer was not run or has no network
      onReportIssue({
        title,
        description,
        status: 'pending',
        category: aiAnalysis?.category || 'General Infrastructure',
        department: aiAnalysis?.department || 'City Works Dept',
        severity: aiAnalysis?.severity || 'medium',
        urgency: aiAnalysis?.urgency || 'medium',
        location: clickCoordinates,
        imageUrl: attachedImage || undefined,
        audioUrl: attachedAudio || undefined,
        videoUrl: attachedVideo || undefined,
        priorityScore: aiAnalysis?.priorityScore || 50,
        aiSummary: aiAnalysis?.aiSummary || 'Issue received. AI routing pending.',
        complaintText: aiAnalysis?.complaintText || 'Initial notification filed.'
      });

      // Reset form fields
      setTitle('');
      setDescription('');
      setAttachedImage(null);
      setAttachedAudio(null);
      setAttachedVideo(null);
      setAiAnalysis(null);
      setIsSubmitting(false);
      setActiveTab('feed');
    }, 1000);
  };

  const handleCommentSubmit = (issueId: string) => {
    const txt = commentInputs[issueId];
    if (!txt) return;
    onAddComment(issueId, txt);
    setCommentInputs(prev => ({ ...prev, [issueId]: '' }));
  };

  const mockLeaderboard: LeaderboardEntry[] = [
    { email: 'governor@civicpulse.ai', displayName: 'City Inspector Sterling', score: 1250, completedReports: 42, rank: 1 },
    { email: profile.email, displayName: `${profile.displayName} (You)`, score: profile.score, completedReports: profile.completedReports, rank: 2 },
    { email: 'sarah.k@civicpulse.ai', displayName: 'Sarah Jenkins', score: 450, completedReports: 14, rank: 3 },
    { email: 'dan.m@civicpulse.ai', displayName: 'Daniel Miller', score: 380, completedReports: 9, rank: 4 },
  ];

  const filteredIssues = activeIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] flex flex-col font-sans relative">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-150px] right-[-50px] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Mini top banner */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border-b border-white/10 px-4 py-2 text-center text-[10px] text-blue-300 font-mono flex items-center justify-center gap-1.5 uppercase tracking-wider">
        <Award className="w-3.5 h-3.5 animate-bounce text-blue-400" /> Your current citizen score: <span className="font-bold text-white">{profile.score} Points</span> • Active Rank: #2
      </div>

      {/* Header bar */}
      <header className="relative z-10 bg-black/40 border-b border-white/10 backdrop-blur-md px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 shadow-lg">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">CITIZEN COLLABORATOR HUB</h2>
              <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Active User: {profile.displayName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-mono text-white/60 hover:text-white transition-all cursor-pointer"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-3 gap-2 bg-white/[0.02] border border-white/10 rounded-2xl p-1.5 max-w-md backdrop-blur-md">
          <button
            onClick={() => setActiveTab('report')}
            className={`py-2 text-[11px] font-semibold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'report' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> REPORT ISSUE
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-2 text-[11px] font-semibold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'feed' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> CITY FEED
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-2 text-[11px] font-semibold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'rewards' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> ECOSYSTEM REWARDS
          </button>
        </div>
      </div>

      {/* Primary Panels */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ISSUE REPORTING FORM */}
          {activeTab === 'report' && (
            <motion.div 
              key="report-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form Input Columns */}
              <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-5 bg-white/[0.03] border border-white/10 p-5 sm:p-6 rounded-2xl shadow-xl backdrop-blur-md">
                <div>
                  <label className="block text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Issue Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Ruptured water main flooding Sector Alpha"
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Conversational Problem Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe the issue in your own words. Our AI analyzer parses conversational reports automatically..."
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-white/30"
                  />
                </div>

                {/* AI analyzer preseed trigger */}
                {description.length > 15 && (
                  <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                      <div className="text-[11px] text-white/60 font-sans">
                        Let <span className="font-bold text-blue-400">Cognitive AI</span> review and categorize your complaint before submission.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={triggerCognitiveAnalysis}
                      disabled={isAnalyzing}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white font-mono text-[10px] font-black tracking-wider transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                    >
                      {isAnalyzing ? 'RUNNING COGNITION...' : 'TRIGGER PRE-ANALYSIS'}
                    </button>
                  </div>
                )}

                {/* Simulated Geolocation Coordinate Picker */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] text-white/40 font-mono uppercase tracking-widest">DIGITAL MAP GEO-LOCATOR</label>
                    <span className="text-[9px] font-mono text-blue-400">{clickCoordinates.address}</span>
                  </div>
                  
                  <div className="relative rounded-xl border border-white/10 bg-black/40 overflow-hidden h-[150px] cursor-crosshair" onClick={handleMapClick}>
                    {/* Retro Grid Map Graphics */}
                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/5" />

                    {/* Simple vector landmark icons on map */}
                    <div className="absolute top-4 left-6 text-[8px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" /> NEXUS FUSION
                    </div>
                    <div className="absolute bottom-4 right-6 text-[8px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-blue-400" /> HYPERLOOP PORT
                    </div>

                    {/* Glowing coordinate pin */}
                    <div 
                      className="absolute w-4 h-4 -ml-2 -mt-2 pointer-events-none transition-all duration-300"
                      style={{
                        left: `${(clickCoordinates.lat / 5) * 100}%`,
                        top: `${(clickCoordinates.lng / 5) * 100}%`
                      }}
                    >
                      <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping"></span>
                      <MapPin className="relative w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 font-mono">Click anywhere on the smart district grid above to alter geo-anchors.</p>
                </div>

                {/* Media attachments */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Image input handler */}
                  <input
                    type="file"
                    id="citizen-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAttachedImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('citizen-image-upload')?.click()}
                    className={`p-3 rounded-xl border border-white/10 hover:border-white/25 flex flex-col items-center justify-center gap-1 bg-white/[0.02] transition-all text-white/60 hover:text-blue-400 cursor-pointer ${attachedImage ? 'border-blue-500 text-blue-400 bg-blue-500/5' : ''}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] font-mono">{attachedImage ? 'IMG ADDED' : 'ATTACH IMG'}</span>
                  </button>

                  {/* Audio input handler */}
                  <input
                    type="file"
                    id="citizen-audio-upload"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAttachedAudio(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('citizen-audio-upload')?.click()}
                    className={`p-3 rounded-xl border border-white/10 hover:border-white/25 flex flex-col items-center justify-center gap-1 bg-white/[0.02] transition-all text-white/60 hover:text-purple-400 cursor-pointer ${attachedAudio ? 'border-purple-500 text-purple-400 bg-purple-500/5' : ''}`}
                  >
                    <Music className="w-4 h-4" />
                    <span className="text-[9px] font-mono">{attachedAudio ? 'AUDIO ADDED' : 'AUDIO REC'}</span>
                  </button>

                  {/* Video input handler */}
                  <input
                    type="file"
                    id="citizen-video-upload"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAttachedVideo(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('citizen-video-upload')?.click()}
                    className={`p-3 rounded-xl border border-white/10 hover:border-white/25 flex flex-col items-center justify-center gap-1 bg-white/[0.02] transition-all text-white/60 hover:text-pink-400 cursor-pointer ${attachedVideo ? 'border-pink-500 text-pink-400 bg-pink-500/5' : ''}`}
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-[9px] font-mono">{attachedVideo ? 'VIDEO ADDED' : 'DASH VIDEO'}</span>
                  </button>
                </div>

                {/* Selected File Previews & Removers */}
                {(attachedImage || attachedAudio || attachedVideo) && (
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2.5">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Selected Attachments:</span>
                    
                    {attachedImage && (
                      <div className="flex items-center justify-between gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img src={attachedImage} className="w-10 h-10 object-cover rounded-lg border border-white/10" alt="thumbnail" />
                          <span className="text-[10px] font-mono text-white/60 truncate">Image file attached</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedImage(null)}
                          className="text-white/40 hover:text-red-400 font-mono text-[9px] px-1.5 py-0.5 rounded-lg border border-white/10 hover:border-red-500/20 bg-white/[0.01] hover:bg-red-500/5 cursor-pointer"
                        >
                          REMOVE
                        </button>
                      </div>
                    )}

                    {attachedAudio && (
                      <div className="flex flex-col gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
                            <Music className="w-3.5 h-3.5" /> Audio memorandum
                          </span>
                          <button
                            type="button"
                            onClick={() => setAttachedAudio(null)}
                            className="text-white/40 hover:text-red-400 font-mono text-[9px] px-1.5 py-0.5 rounded-lg border border-white/10 hover:border-red-500/20 bg-white/[0.01] hover:bg-red-500/5 cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                        <audio src={attachedAudio} controls className="w-full h-8 outline-none rounded-lg bg-black/50 text-[10px]" />
                      </div>
                    )}

                    {attachedVideo && (
                      <div className="flex flex-col gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-mono text-pink-400 flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" /> Transmission clip
                          </span>
                          <button
                            type="button"
                            onClick={() => setAttachedVideo(null)}
                            className="text-white/40 hover:text-red-400 font-mono text-[9px] px-1.5 py-0.5 rounded-lg border border-white/10 hover:border-red-500/20 bg-white/[0.01] hover:bg-red-500/5 cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                        <video src={attachedVideo} controls className="w-full max-h-32 object-contain bg-black rounded" />
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider transition-all shadow-lg shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> SUBMITTING COMPLAINT...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> TRANSMIT ISSUE DISPATCH
                    </>
                  )}
                </button>
              </form>

              {/* AI Real-time Preview Side */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* AI Review Details */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-mono font-semibold text-white uppercase tracking-tight">COGNITIVE COMPLAINT AUDIT</h3>
                  </div>

                  {aiAnalysis ? (
                    <div className="space-y-4 font-mono text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <div className="text-[9px] text-white/40">CATEGORY</div>
                          <div className="font-bold text-white mt-1">{aiAnalysis.category}</div>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <div className="text-[9px] text-white/40">DEPT ALLOCATION</div>
                          <div className="font-bold text-indigo-300 mt-1 truncate">{aiAnalysis.department}</div>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <div className="text-[9px] text-white/40">URGENCY INDEX</div>
                          <div className="font-bold text-rose-400 uppercase mt-1">{aiAnalysis.urgency}</div>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <div className="text-[9px] text-white/40">PRIORITY SCORE</div>
                          <div className="font-bold text-blue-400 mt-1">{aiAnalysis.priorityScore}/100</div>
                        </div>
                      </div>

                      <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                        <div className="text-[9px] text-white/40 mb-1">AI DETECTED SYNOPSIS</div>
                        <p className="text-white/70 font-sans leading-relaxed text-xs">
                          {aiAnalysis.aiSummary}
                        </p>
                      </div>

                      <div className="bg-black/50 p-3 rounded-xl border border-white/5 max-h-[140px] overflow-y-auto leading-normal text-white/50 text-[10px]">
                        <div className="text-[9px] text-white/40 mb-1 border-b border-white/5 pb-1">FORMAL PETITION WRITTEN</div>
                        <pre className="whitespace-pre-wrap">{aiAnalysis.complaintText}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <AlertCircle className="w-8 h-8 text-white/20 mx-auto mb-2.5 animate-pulse" />
                      <p className="text-xs text-white/40">
                        Input details on the left and click "Trigger Pre-analysis" to allow Cognitive AI to parse categories and draft formal dispatches.
                      </p>
                    </div>
                  )}
                </div>

                {/* Rewards mini indicator */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Weekly Challenge In Progress</h4>
                      <p className="text-[10px] text-white/60">File a report in District 3 to secure +50 XP</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-amber-400 font-mono">1/2 Filed</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: FEED GRID (TRACK CONSTRUCTS) */}
          {activeTab === 'feed' && (
            <motion.div 
              key="feed-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filter / Search HUD */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white/[0.03] p-4 border border-white/10 rounded-2xl justify-between items-center backdrop-blur-md">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search regional feed..."
                    className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-white/30"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
                  {['All', 'Water Outage', 'Power Blackout', 'Road Damage', 'Public Safety'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
                        categoryFilter === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'bg-white/[0.02] text-white/40 border border-white/10 hover:text-white/70 hover:bg-white/[0.04]'
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIssues.map((issue) => {
                  const hasUpvoted = issue.upvotedBy.includes(profile.email);
                  return (
                    <div key={issue.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300">
                      <div>
                        {/* Title & Badge Status */}
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div>
                            <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/15 p-1 px-2.5 rounded-full uppercase tracking-wider font-bold">
                              {issue.category}
                            </span>
                            <h3 className="text-sm font-semibold text-white mt-1.5 leading-snug tracking-tight">{issue.title}</h3>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            issue.status === 'resolved' 
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                              : issue.status === 'assigned' 
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                              : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                          }`}>
                            {issue.status}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-white/60 line-clamp-3 mb-4 leading-relaxed font-sans">
                          {issue.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono mb-4">
                          <MapPin className="w-3.5 h-3.5 text-white/40" />
                          <span>{issue.location.address} (Grid: {issue.location.lat}, {issue.location.lng})</span>
                        </div>

                        {issue.imageUrl && (
                          <div className="rounded-xl overflow-hidden border border-white/10 h-48 mb-4 bg-black/40">
                            <img src={issue.imageUrl} className="w-full h-full object-cover" alt="Issue snap" referrerPolicy="no-referrer" />
                          </div>
                        )}

                        {issue.audioUrl && (
                          <div className="rounded-xl border border-white/10 p-3 mb-4 bg-white/[0.02] flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                              <Music className="w-4 h-4" />
                              <span>AUDIO EVIDENCE DISPATCH</span>
                            </div>
                            <audio src={issue.audioUrl} controls className="w-full h-8 outline-none rounded-lg bg-black/40 text-xs text-white" />
                          </div>
                        )}

                        {issue.videoUrl && (
                          <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/40 flex flex-col">
                            <div className="p-2.5 border-b border-white/5 flex items-center gap-2 text-xs font-mono text-pink-400 bg-white/[0.01]">
                              <Video className="w-4 h-4" />
                              <span>VIDEO TRANSMISSION FEED</span>
                            </div>
                            <video src={issue.videoUrl} controls className="w-full max-h-64 object-contain bg-black" />
                          </div>
                        )}

                        {/* Progress Tracker */}
                        <div className="border-t border-white/5 pt-3 mb-4">
                          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">Action Timeline</span>
                          <div className="flex justify-between items-center relative">
                            {/* Connector line */}
                            <div className="absolute left-1/10 right-1/10 top-2 h-0.5 bg-white/10 z-0" />
                            
                            <div className="flex flex-col items-center z-10">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-mono ${
                                issue.status !== 'pending' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black border-white/10 text-white/40'
                              }`}>
                                P
                              </div>
                              <span className="text-[8px] font-mono mt-1 text-white/40">PENDING</span>
                            </div>

                            <div className="flex flex-col items-center z-10">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-mono ${
                                issue.status === 'assigned' || issue.status === 'resolved' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black border-white/10 text-white/40'
                              }`}>
                                A
                              </div>
                              <span className="text-[8px] font-mono mt-1 text-white/40 font-semibold">ASSIGNED</span>
                            </div>

                            <div className="flex flex-col items-center z-10">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-mono ${
                                issue.status === 'resolved' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-black border-white/10 text-white/40'
                              }`}>
                                R
                              </div>
                              <span className="text-[8px] font-mono mt-1 text-white/40">RESOLVED</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => onUpvoteIssue(issue.id)}
                            className={`flex items-center gap-1 text-[10px] font-mono transition-colors cursor-pointer ${
                              hasUpvoted ? 'text-blue-400 font-bold' : 'text-white/40 hover:text-blue-400'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{issue.upvotes} UPVOTES</span>
                          </button>

                          <div className="flex items-center gap-1 text-[10px] font-mono text-white/40">
                            <Clock className="w-3.5 h-3.5" />
                            <span>PRIORITY: {issue.priorityScore}/100</span>
                          </div>
                        </div>

                        {/* Interactive comments section */}
                        <div className="space-y-1.5 max-h-[100px] overflow-y-auto bg-black/50 p-2.5 rounded-xl border border-white/5">
                          {issue.comments.length === 0 ? (
                            <span className="text-[9px] font-mono text-white/30 italic block">No comments on this dispatch.</span>
                          ) : (
                            issue.comments.map(c => (
                              <div key={c.id} className="text-[10px] leading-normal font-sans border-b border-white/5 pb-1 last:border-0">
                                <span className={`font-bold ${c.role === 'government' ? 'text-indigo-400' : 'text-blue-400'}`}>{c.author}:</span>{' '}
                                <span className="text-white/70">{c.text}</span>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add comment form */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[issue.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [issue.id]: e.target.value }))}
                            placeholder="Add commentary..."
                            className="flex-1 p-1.5 bg-black/40 border border-white/10 rounded-xl text-[10px] text-white focus:outline-none focus:border-blue-500 placeholder-white/30"
                          />
                          <button
                            onClick={() => handleCommentSubmit(issue.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-mono cursor-pointer"
                          >
                            SEND
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredIssues.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white/[0.01] rounded-2xl border border-white/10">
                    <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-2" />
                    <p className="text-xs font-mono text-white/40">No active dispatches found matching criteria.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: GAMIFIED ENGAGEMENT */}
          {activeTab === 'rewards' && (
            <motion.div 
              key="rewards-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Badges and streaks on left */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Profile Stats Overview */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-blue-400 shadow-md">
                      <User className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white tracking-tight">{profile.displayName}</h3>
                      <p className="text-xs text-white/60">Tier: Elite Civic Inspector</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-blue-400">{profile.score} XP</div>
                    <span className="text-[10px] text-white/40 font-mono">GLOBAL TICKET LEADERS</span>
                  </div>
                </div>

                {/* Unlocked Badges */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
                  <h4 className="text-xs font-mono font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-400" /> EARNED CIVIC BADGES
                  </h4>

                  <div className="grid grid-cols-3 gap-4">
                    {profile.badges.map(badge => (
                      <div key={badge.id} className="bg-black/40 p-3.5 border border-white/10 rounded-xl text-center hover:border-blue-500 transition-all group duration-300">
                        <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">{badge.icon}</div>
                        <h5 className="text-[10px] font-bold text-white uppercase truncate">{badge.name}</h5>
                        <p className="text-[8px] text-white/40 mt-0.5 leading-snug">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges list */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
                  <h4 className="text-xs font-mono font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> ACTIVE WEEKLY CHALLENGES
                  </h4>

                  <div className="space-y-4">
                    {profile.challenges.map(c => (
                      <div key={c.id} className="bg-black/40 p-3.5 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start mb-1.5">
                          <div>
                            <h5 className="text-[10px] font-semibold text-white uppercase tracking-tight">{c.name}</h5>
                            <p className="text-[9px] text-white/50">{c.description}</p>
                          </div>
                          <span className="text-[10px] text-amber-400 font-mono">+{c.points} XP</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${(c.progress / c.target) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[8px] text-white/40 font-mono">PROGRESSION</span>
                          <span className="text-[9px] text-white/60 font-mono">{c.progress} / {c.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Leaderboard on right */}
              <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
                <h4 className="text-xs font-mono font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> REGIONAL LEADERBOARD
                </h4>

                <div className="space-y-3 font-mono">
                  {mockLeaderboard.map((user, index) => {
                    const isCurrentUser = user.email === profile.email;
                    return (
                      <div 
                        key={user.email} 
                        className={`p-3 rounded-xl flex items-center justify-between border transition-all duration-300 ${
                          isCurrentUser 
                            ? 'bg-blue-600/10 border-blue-500 shadow-md' 
                            : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-blue-400' : 'text-white/20'}`}>
                            #{user.rank}
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-white truncate max-w-[150px]">{user.displayName}</div>
                            <span className="text-[8px] text-white/40">{user.completedReports} REPORTS</span>
                          </div>
                        </div>

                        <div className="text-right text-xs font-bold text-white/80">
                          {user.score} XP
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
