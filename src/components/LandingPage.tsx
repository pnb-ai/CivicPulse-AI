/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Shield, Zap, Brain, Sparkles, 
  MapPin, AlertCircle, BarChart3, Users, 
  CheckCircle, Flame, Gift, MessageSquare, Play, 
  Cpu, Award, Building2, Globe, HeartHandshake, Eye
} from 'lucide-react';
import IsometricCity from './IsometricCity';
import { CivicIssue } from '../types';

interface LandingPageProps {
  onEnterApp: (role: 'citizen' | 'government') => void;
  mockIssues: CivicIssue[];
}

export default function LandingPage({ onEnterApp, mockIssues }: LandingPageProps) {
  const [stats, setStats] = useState({
    citizens: 12450,
    resolved: 1842,
    responseMinutes: 8.4,
    cognitiveScore: 99.2
  });

  // Simulated live ticket playground state
  const [playgroundText, setPlaygroundText] = useState(
    "There's a massive water pipe burst on 4th Avenue near the library! Water is flooding the whole street, blocking traffic, and seems like it's getting close to the building basements. It's really dangerous!"
  );
  const [playgroundAnalysis, setPlaygroundAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Stats ticking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        citizens: prev.citizens + Math.floor(Math.random() * 2),
        resolved: prev.resolved + (Math.random() > 0.8 ? 1 : 0),
        responseMinutes: Math.max(5.0, Number((prev.responseMinutes - 0.01 + (Math.random() > 0.5 ? 0.02 : -0.02)).toFixed(1))),
        cognitiveScore: Number(Math.min(100, prev.cognitiveScore + (Math.random() > 0.9 ? 0.1 : -0.1)).toFixed(1))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Demo AI Analyzer playground
  const handleDemoAnalyze = () => {
    setIsAnalyzing(true);
    setPlaygroundAnalysis(null);

    setTimeout(() => {
      setPlaygroundAnalysis({
        category: "Water Outage & Flooding",
        department: "Department of Environmental Protection",
        severity: "high",
        urgency: "critical",
        priorityScore: 92,
        assignedOfficer: "Officer J. Vance (Unit 12)",
        aiSummary: "Severe water main rupture on 4th Avenue leading to active street inundation. Impending risk of commercial property water damage and active vehicular obstruction.",
        complaintText: "PETITION REF #W-9281\nTO: Department of Environmental Protection\nSUBJECT: Emergency Water Main Rupture Intervention\n\nDear Director,\nWe officially request emergency response dispatch to the public easement on 4th Ave. Current reports indicate high-volume water loss with significant civic flooding, representing a Level 1 hazard."
      });
      setIsAnalyzing(false);
    }, 1800);
  };

  // Particles array
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F5F5F7] overflow-x-hidden font-sans selection:bg-blue-500/30 selection:text-blue-300">
      {/* Absolute Ambient Background & Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Elegant grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Pulsing elegant glow top-left */}
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
        {/* Warm purple glow bottom-right */}
        <div className="absolute bottom-[-100px] right-[-50px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[12s]" />

        {/* Floating background dust particles */}
        {particles.map((p) => {
          const delay = p * 0.4;
          const left = (p * 7) % 100;
          const top = (p * 11) % 100;
          return (
            <div 
              key={p}
              className="absolute w-1 h-1 rounded-full bg-blue-400/20"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animation: `float-slow 20s infinite ease-in-out`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      {/* Top Header / Navigation Panel */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-white/[0.03] border border-white/10 shadow-lg">
              <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-1">
                CIVICPULSE <span className="text-blue-400">AI</span>
              </h1>
              <span className="text-[8px] font-mono tracking-widest text-white/40 block uppercase -mt-1">STABLE BUILD</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onEnterApp('citizen')}
              className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
            >
              Citizen Login
            </button>
            <button 
              onClick={() => onEnterApp('government')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Government Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Messaging Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-blue-400 font-mono mb-6 w-fit shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-400" style={{ animationDuration: '6s' }} />
              <span>Next-Gen Smart City Platform</span>
            </div>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Where AI Meets <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Civic Engagement
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed max-w-lg">
              Empower citizens and city councils with automated issue reporting, real-time 3D twin telemetry, predictive prioritization scoring, and multi-department smart routing driven by Advanced Cognitive AI.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onEnterApp('citizen')}
                className="group flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-xl shadow-blue-500/10 transition-all cursor-pointer"
              >
                <span>Report an Issue Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onEnterApp('government')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all text-sm font-semibold text-white/80 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Access Council Terminal</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Citizen Resolves</div>
                <div className="text-xl font-semibold font-mono text-white/95">{stats.resolved}+</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">AI Latency</div>
                <div className="text-xl font-semibold font-mono text-blue-400">14.2 seconds</div>
              </div>
            </div>
          </div>

          {/* 3D Smart City Digital Twin Interactive Area */}
          <div className="lg:col-span-7 h-[400px] sm:h-[450px] md:h-[500px] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />
            <IsometricCity activeIssues={mockIssues} />
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-white/60 font-mono">
              <Eye className="w-3.5 h-3.5 text-blue-400" /> Hover and click buildings to probe telemetry feeds.
            </div>
          </div>

        </div>
      </section>

      {/* Real-time Interactive AI Playground (AI Showcase) */}
      <section className="py-16 border-t border-white/10 bg-white/[0.01] relative z-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase block mb-2">Cognitive Hub Playground</span>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Experience the Civic AI Engine</h3>
            <p className="text-xs sm:text-sm text-white/60 mt-2">
              See how the platform digests messy conversational complaints into fully processed, geocoded, and priority-scored petitions in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Input Side */}
            <div className="lg:col-span-5 flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono text-white/60">CITIZEN INPUT (CONVERSATIONAL REPORT)</span>
              </div>
              <textarea 
                value={playgroundText}
                onChange={(e) => setPlaygroundText(e.target.value)}
                className="flex-1 min-h-[150px] w-full p-3.5 bg-black/40 rounded-xl border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-sans resize-none placeholder-white/30"
                placeholder="Describe a civic issue in plain English..."
              />
              <button 
                onClick={handleDemoAnalyze}
                disabled={isAnalyzing}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all text-xs text-white font-mono font-black flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/5 disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-white" />
                    <span>RUNNING COGNITIVE ANALYZER...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>RUN COGNITIVE ANALYZER</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Output Side */}
            <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md min-h-[300px] flex flex-col justify-center">
              {!playgroundAnalysis && !isAnalyzing && (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <Cpu className="w-10 h-10 text-white/20 mb-3 animate-pulse" />
                  <p className="text-xs font-mono text-white/40">
                    Input a problem on the left and click "Run Cognitive Analyzer" to watch Civic AI process the report.
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-4 py-8">
                  <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
                  <div className="h-8 bg-white/5 rounded animate-pulse w-full" />
                  <div className="h-12 bg-white/5 rounded animate-pulse w-5/6" />
                  <div className="h-6 bg-white/5 rounded animate-pulse w-2/3" />
                </div>
              )}

              {playgroundAnalysis && (
                <div className="space-y-4 animate-fade-in font-mono text-xs">
                  <div className="flex flex-wrap gap-2 justify-between border-b border-white/5 pb-3">
                    <span className="text-white/60 font-bold flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" /> ANALYZER TELEMETRY
                    </span>
                    <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                      COGNITIVE COMPLETED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/40 uppercase">CATEGORY</div>
                      <div className="font-bold text-white truncate mt-1">{playgroundAnalysis.category}</div>
                    </div>
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/40 uppercase">DEPARTMENT</div>
                      <div className="font-bold text-white/80 truncate mt-1">{playgroundAnalysis.department}</div>
                    </div>
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/40 uppercase">URGENCY</div>
                      <div className="font-bold text-rose-400 uppercase truncate mt-1">{playgroundAnalysis.urgency}</div>
                    </div>
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/40 uppercase">PRIORITY SCORE</div>
                      <div className="font-bold text-blue-400 mt-1">{playgroundAnalysis.priorityScore}/100</div>
                    </div>
                  </div>

                  <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] text-white/40 mb-1">AI DETECTED SYNOPSIS</div>
                    <p className="text-white/70 font-sans leading-relaxed text-xs">
                      {playgroundAnalysis.aiSummary}
                    </p>
                  </div>

                  <div className="bg-black/50 p-3 rounded-xl border border-white/5 max-h-[140px] overflow-y-auto font-mono text-[11px] leading-relaxed text-white/50">
                    <div className="text-[10px] text-white/40 mb-1 border-b border-white/5 pb-1">OFFICIAL DISPATCH COMPLAINT</div>
                    <pre className="whitespace-pre-wrap">{playgroundAnalysis.complaintText}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Bento Style */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase block mb-1">Architecture Outline</span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Engineered for Public Welfare</h3>
          <p className="text-xs sm:text-sm text-white/60 mt-1.5">
            A secure full-stack ecosystem bridging active citizens, municipal departments, and autonomous AI dispatch responders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: AI Analysis */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-2xl group">
            <div className="p-3 bg-blue-500/10 rounded-xl w-fit text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Cognitive Issue Ingestion</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Messy input formats (photos, speech memos, raw text) are auto-classified. Detects duplicate records, departments, severity indexes, and urgency scores instantly.
            </p>
          </div>

          {/* Card 2: 3D Visualization */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-2xl group">
            <div className="p-3 bg-indigo-500/10 rounded-xl w-fit text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Digital Twin Telemetry</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Interactive 3D isometric mappings of district assets. Track reported power failures, floods, and transit status in real time through our unified vector control boards.
            </p>
          </div>

          {/* Card 3: Gamification */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-2xl group">
            <div className="p-3 bg-amber-500/10 rounded-xl w-fit text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Gamified Citizen Ecosystem</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Earn Civic Scores, unlock regional badges, top the leaderboards, and take on Weekly Civic Challenges to reinforce real-world, verified peer community action.
            </p>
          </div>

          {/* Card 4: Priority Queues */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-2xl group">
            <div className="p-3 bg-rose-500/10 rounded-xl w-fit text-rose-400 mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Intelligent Priorities</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Smart priority indexing filters fake claims. Re-ranks complaints based on combined severity, citizen support, temporal urgency, and location densities.
            </p>
          </div>

          {/* Card 5: Role-based Portal */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-2xl group">
            <div className="p-3 bg-purple-500/10 rounded-xl w-fit text-purple-400 mb-5 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Cryptographic Gateways</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Separates public interfaces from council dispatch commands. Role-based firewalls prevent illegal adjustments of priority records or department dispatches.
            </p>
          </div>

          {/* Card 6: Maps and Routing */}
          <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-2xl group">
            <div className="p-3 bg-pink-500/10 rounded-xl w-fit text-pink-400 mb-5 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Precision Spatial Mapping</h4>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Maps precise geographical locations of events. Generates optimal routing indices for city officers and displays neighborhood-wide issue clustering and heatmaps.
            </p>
          </div>

        </div>
      </section>

      {/* Futuristic Promotion CTA */}
      <section className="relative py-20 px-4 sm:px-6 z-10 max-w-5xl mx-auto border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-3xl overflow-hidden mb-20 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px]" />
        
        <div className="relative text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 mb-6 font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <Award className="w-4 h-4 animate-bounce" /> CIVIC SOLUTION PLATFORM
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Unify Citizens &amp; City Councils with Modern AI
          </h3>
          <p className="text-xs sm:text-sm text-white/60 mt-4 leading-relaxed">
            Take public welfare into your own hands or inspect council operations. Access the Citizen Gateway to file issues or log into the Council Board to dispatch officers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onEnterApp('citizen')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/10 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Log in as Citizen
            </button>
            <button 
              onClick={() => onEnterApp('government')}
              className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white/80 font-semibold text-sm transition-all cursor-pointer"
            >
              Council Authority Entrance
            </button>
          </div>
        </div>
      </section>

      {/* Aesthetic Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-10 px-4 sm:px-6 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-blue-400" />
            <div>
              <span className="font-semibold tracking-tight text-white">CIVICPULSE <span className="text-blue-400">AI</span></span>
              <span className="text-[10px] text-white/40 block font-mono">Empowering Cities, One Pulse At A Time.</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/40 font-mono">
            <span>CivicPulse Platform</span>
            <span>•</span>
            <span>React 19 + Tailwind v4 + Civic AI</span>
            <span>•</span>
            <span className="text-blue-400">Stable Build</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
