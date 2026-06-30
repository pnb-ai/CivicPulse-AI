/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, Filter, 
  User, BarChart3, TrendingUp, Sparkles, Brain, Cpu, 
  MapPin, Sliders, ChevronRight, Activity, Zap, Loader2, ArrowRight,
  Music, Video
} from 'lucide-react';
import { CivicIssue, UserRole } from '../types';

interface GovernmentDashboardProps {
  activeIssues: CivicIssue[];
  onAssignOfficer: (issueId: string, officerName: string) => void;
  onResolveIssue: (issueId: string) => void;
  onLogout: () => void;
}

export default function GovernmentDashboard({
  activeIssues,
  onAssignOfficer,
  onResolveIssue,
  onLogout
}: GovernmentDashboardProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(activeIssues[0]?.id || null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [officerNameInput, setOfficerNameInput] = useState<string>('');

  // AI Recommendation systems
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  const selectedIssue = activeIssues.find(i => i.id === selectedIssueId);

  // Trigger server-side recommendations based on active issues list
  const triggerAiRecommendations = async () => {
    setLoadingRecommendations(true);
    setAiRecommendations(null);
    try {
      const activeUnresolved = activeIssues.filter(i => i.status !== 'resolved');
      const issuesSummary = activeUnresolved.map(i => `${i.title} (${i.category})`).join(', ');
      
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issuesSummary })
      });
      const data = await response.json();
      setAiRecommendations(data.recommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Filter lists
  const filteredIssues = activeIssues.filter(issue => {
    const matchesDept = departmentFilter === 'All' || issue.department === departmentFilter;
    const matchesSev = severityFilter === 'All' || issue.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesDept && matchesSev && matchesStatus;
  });

  // Calculate high-level analytical counters
  const totalTickets = activeIssues.length;
  const criticalTickets = activeIssues.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  const resolvedCount = activeIssues.filter(i => i.status === 'resolved').length;
  const averagePriority = Math.round(activeIssues.reduce((acc, curr) => acc + curr.priorityScore, 0) / (totalTickets || 1));

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] flex flex-col font-sans relative">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-150px] right-[-50px] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Top micro status bar */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border-b border-white/10 px-4 py-2 text-[10px] text-white/50 font-mono flex items-center justify-between">
        <div className="flex items-center gap-1.5 uppercase">
          <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Unified Municipal Ingestion Stream • Live Network Nominal
        </div>
        <div>REGION: NORTH-EAST METROPOLITAN SECTOR</div>
      </div>

      {/* Header bar */}
      <header className="relative z-10 bg-black/40 border-b border-white/10 backdrop-blur-md px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 shadow-lg">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">CITY COUNCIL RESPONSE GATEWAY</h2>
              <p className="text-[10px] text-white/40 font-mono">ROLE: COMMISSIONER TERMINAL</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] font-mono text-xs text-white/60 hover:text-white transition-all cursor-pointer"
          >
            DISCONNECT LOCK
          </button>
        </div>
      </header>

      {/* Analytics Dashboard Cards */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <span className="text-[9px] font-mono text-white/40 uppercase block mb-1">TOTAL INGESTED</span>
            <div className="text-2xl font-black font-mono text-white">{totalTickets} Reports</div>
            <p className="text-[9px] text-white/30 font-mono mt-1">100% PARSED BY COGNITIVE AI</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <span className="text-[9px] font-mono text-rose-400 uppercase block mb-1">CRITICAL INCIDENTS</span>
            <div className="text-2xl font-black font-mono text-rose-400">{criticalTickets} Active</div>
            <p className="text-[9px] text-rose-500/60 font-mono mt-1">RESPONSE TEAMS IN RETRIEVAL</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <span className="text-[9px] font-mono text-emerald-400 uppercase block mb-1">MUNICIPAL RESOLVED</span>
            <div className="text-2xl font-black font-mono text-emerald-400">{resolvedCount} Tickets</div>
            <p className="text-[9px] text-white/30 font-mono mt-1">RESOLUTION RATE: {Math.round((resolvedCount / (totalTickets || 1)) * 100)}%</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <span className="text-[9px] font-mono text-blue-400 uppercase block mb-1">AVG SECTOR PRIORITY</span>
            <div className="text-2xl font-black font-mono text-blue-400">{averagePriority} / 100</div>
            <p className="text-[9px] text-white/30 font-mono mt-1">VOTES, SEVERITY &amp; TIMINGS SCALED</p>
          </div>
        </div>
      </div>

      {/* Main Console Layout */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Ticket lists and queues (7 columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Quick Filter Control HUD */}
          <div className="bg-white/[0.03] p-3 border border-white/10 rounded-2xl flex flex-wrap gap-3 items-center justify-between backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
              <Filter className="w-3.5 h-3.5 text-blue-400" /> FILTERS:
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {/* Dept selection */}
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-black/40 border border-white/10 p-1.5 px-2.5 rounded-xl font-mono text-[9px] text-white/80 focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="Department of Environmental Protection">Water &amp; Sewers</option>
                <option value="Bureau of Power &amp; Light">Power Grid</option>
                <option value="Department of Transportation">Transportation</option>
                <option value="General Infrastructure">General Infrastructure</option>
              </select>

              {/* Severity selection */}
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-black/40 border border-white/10 p-1.5 px-2.5 rounded-xl font-mono text-[9px] text-white/80 focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Status selection */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/40 border border-white/10 p-1.5 px-2.5 rounded-xl font-mono text-[9px] text-white/80 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Queue Stream */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {filteredIssues.map((issue) => {
              const isSelected = selectedIssueId === issue.id;
              
              let sevColor = 'text-blue-400';
              if (issue.severity === 'critical' || issue.severity === 'high') sevColor = 'text-rose-400';
              if (issue.severity === 'medium') sevColor = 'text-amber-400';

              return (
                <div 
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelected 
                      ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/5' 
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.5 rounded-full uppercase font-bold">
                        {issue.category}
                      </span>
                      <span className={`text-[8px] font-mono uppercase font-bold ${sevColor}`}>
                        SEV: {issue.severity}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate mt-1.5 tracking-tight">{issue.title}</h4>
                    <p className="text-[10px] text-white/40 font-mono mt-1 truncate">{issue.department}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs">
                    <div className="text-right">
                      <div className="text-[10px] text-blue-400 font-bold">PRIORITY: {issue.priorityScore}</div>
                      <span className={`text-[9px] uppercase font-bold ${
                        issue.status === 'resolved' 
                          ? 'text-emerald-400' 
                          : issue.status === 'assigned' 
                          ? 'text-amber-400' 
                          : 'text-blue-400'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </div>
                </div>
              );
            })}

            {filteredIssues.length === 0 && (
              <div className="text-center py-12 bg-white/[0.01] border border-white/10 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-white/20 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-mono text-white/40">No regional dispatches found matching the filters.</p>
              </div>
            )}
          </div>

          {/* AI Municipal Advisor trigger */}
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
                <h5 className="text-[11px] font-mono font-bold text-blue-300">CIVIC POLICY ADVISOR</h5>
              </div>
              <button
                onClick={triggerAiRecommendations}
                disabled={loadingRecommendations}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-[10px] font-mono text-white flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-500/10"
              >
                {loadingRecommendations ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> RUNNING PREDICTION...
                  </>
                ) : (
                  <>
                    <Brain className="w-3.5 h-3.5" /> GENERATE POLICIES
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-white/50 leading-normal mb-3 font-sans">
              Generate 3 actionable administrative recommendations based on unresolved regional issues.
            </p>

            {aiRecommendations && (
              <div className="bg-black/50 p-3 rounded-xl border border-white/5 font-sans text-xs text-white/70 leading-relaxed space-y-2 animate-fade-in">
                <pre className="whitespace-pre-wrap text-[10px] font-mono text-blue-300">{aiRecommendations}</pre>
              </div>
            )}
          </div>

        </div>

        {/* Right column: Single Issue Inspect Panel & Officers Dispatch (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {selectedIssue ? (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl space-y-5 backdrop-blur-md">
              <div className="border-b border-white/5 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono text-white/40">INGESTION PREVIEW</span>
                  <h3 className="text-sm font-semibold text-white leading-snug mt-0.5 tracking-tight">{selectedIssue.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                  selectedIssue.status === 'resolved' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                    : selectedIssue.status === 'assigned' 
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                }`}>
                  {selectedIssue.status}
                </span>
              </div>

              {/* Geolocation Coordinate HUD */}
              <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>LOCATION: {selectedIssue.location.address} (Sector: {selectedIssue.location.lat}, {selectedIssue.location.lng})</span>
              </div>

              {/* Descriptions & Summaries */}
              <div className="space-y-3">
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <div className="text-[9px] text-white/40 mb-1">CITIZEN DESCRIPTION</div>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">{selectedIssue.description}</p>
                </div>

                {selectedIssue.aiSummary && (
                  <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] text-blue-400 flex items-center gap-1 mb-1 font-mono">
                      <Cpu className="w-3.5 h-3.5 animate-pulse" /> CIVIC AI SYNOPSIS
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-sans">{selectedIssue.aiSummary}</p>
                  </div>
                )}
              </div>

              {/* Dispatch Action Panel */}
              {selectedIssue.status === 'pending' && (
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest block">Dispatch Officer Unit</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={officerNameInput}
                      onChange={(e) => setOfficerNameInput(e.target.value)}
                      placeholder="e.g. Unit 12 - Officer J. Vance"
                      className="flex-1 p-2 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 placeholder-white/20"
                    />
                    <button
                      onClick={() => {
                        if (!officerNameInput) return;
                        onAssignOfficer(selectedIssue.id, officerNameInput);
                        setOfficerNameInput('');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                    >
                      DISPATCH
                    </button>
                  </div>
                </div>
              )}

              {/* Complete Action Panel */}
              {selectedIssue.status === 'assigned' && (
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <div className="flex justify-between text-[10px] text-white/50 font-mono uppercase">
                    <span>Assigned Dispatch:</span>
                    <span className="text-blue-400 font-bold">{selectedIssue.assignedOfficer}</span>
                  </div>
                  <button
                    onClick={() => onResolveIssue(selectedIssue.id)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15"
                  >
                    <CheckCircle className="w-4 h-4" /> TRANSMIT RESOLUTION TO CITIZEN
                  </button>
                </div>
              )}

              {selectedIssue.status === 'resolved' && (
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400">MUNICIPAL RESOLUTION NOTIFIED AND PERSISTED SUCCESSFULLY.</span>
                </div>
              )}

              {/* Multimedia Evidence */}
              {(selectedIssue.imageUrl || selectedIssue.audioUrl || selectedIssue.videoUrl) && (
                <div className="space-y-3 border-t border-white/5 pt-4">
                  <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest block">Multimedia Evidence</span>
                  
                  {selectedIssue.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 max-h-48 bg-black/40">
                      <img src={selectedIssue.imageUrl} className="w-full h-full object-cover" alt="Evidence snap" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  {selectedIssue.audioUrl && (
                    <div className="rounded-xl border border-white/10 p-2.5 bg-white/[0.02] flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400">
                        <Music className="w-3.5 h-3.5" />
                        <span>AUDIO DISPATCH MEMO</span>
                      </div>
                      <audio src={selectedIssue.audioUrl} controls className="w-full h-8 outline-none rounded-lg bg-black/40 text-xs text-white" />
                    </div>
                  )}

                  {selectedIssue.videoUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 flex flex-col">
                      <div className="p-2 border-b border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-pink-400 bg-white/[0.01]">
                        <Video className="w-3.5 h-3.5" />
                        <span>VIDEO DISPATCH TRANSMISSION</span>
                      </div>
                      <video src={selectedIssue.videoUrl} controls className="w-full max-h-48 object-contain bg-black" />
                    </div>
                  )}
                </div>
              )}

              {/* Ingested Formal letter preview */}
              {selectedIssue.complaintText && (
                <div className="bg-black/50 p-3 rounded-xl border border-white/5 max-h-[140px] overflow-y-auto font-mono text-[10px] leading-relaxed text-white/50">
                  <span className="text-[9px] text-white/40 block mb-1 border-b border-white/5 pb-1 uppercase">INGESTED MUNICIPAL PETITION</span>
                  <pre className="whitespace-pre-wrap">{selectedIssue.complaintText}</pre>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-20 bg-white/[0.01] border border-white/10 rounded-2xl">
              <Shield className="w-8 h-8 text-white/20 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-white/40">Select an ingested complaint ticket to initiate officer assignment controls.</p>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
