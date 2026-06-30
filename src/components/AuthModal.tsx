/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Mail, Lock, Sparkles, Brain, 
  ArrowRight, Key, Globe, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  onLogin: (email: string, displayName: string, role: UserRole) => void;
  onClose: () => void;
  initialRole?: UserRole;
}

export default function AuthModal({ onLogin, onClose, initialRole = 'citizen' }: AuthModalProps) {
  const [role, setRole] = useState<UserRole>(initialRole === 'guest' ? 'citizen' : initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePreseed = (selectedRole: UserRole) => {
    if (selectedRole === 'citizen') {
      setEmail('citizen@civicpulse.ai');
      setPassword('citizen123');
      setDisplayName('Alex Mercer');
    } else {
      setEmail('governor@civicpulse.ai');
      setPassword('gov123');
      setDisplayName('Director J. Sterling');
    }
    setRole(selectedRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide all mandatory credentials.');
      return;
    }
    if (isSignUp && !displayName) {
      setError('A display name is required for registration.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const name = displayName || (role === 'citizen' ? 'Alex Mercer' : 'Director J. Sterling');
      onLogin(email, name, role);
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const name = role === 'citizen' ? 'Alex Mercer' : 'Director J. Sterling';
      onLogin(`${role}@civicpulse.ai`, name, role);
    }, 1000);
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono tracking-widest text-white/50 font-semibold uppercase">CIVICPULSE SECURE GATEWAY</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white font-mono text-xs cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>

        {/* Portal Role Selector */}
        <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl mb-6 border border-white/10">
          <button
            onClick={() => { setRole('citizen'); setError(''); }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'citizen' 
                ? 'bg-white/[0.04] text-blue-400 border border-white/10 shadow-sm' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Citizen Hub
          </button>
          <button
            onClick={() => { setRole('government'); setError(''); }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'government' 
                ? 'bg-white/[0.04] text-indigo-400 border border-white/10 shadow-sm' 
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> City Council
          </button>
        </div>

        {/* Preseed test account helper */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 mb-6 flex flex-col justify-between gap-1.5">
          <div className="flex items-center gap-1 text-[10px] text-blue-400 font-mono uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> PRE-SEEDED DEMO ACCOUNTS
          </div>
          <p className="text-[10px] text-white/60 leading-normal font-sans">
            For ease of testing, click below to prefill authenticated developer credentials for the selected portal.
          </p>
          <button
            type="button"
            onClick={() => handlePreseed(role)}
            className="w-fit text-[10px] font-mono font-bold text-blue-300 hover:text-blue-200 flex items-center gap-1 transition-all cursor-pointer"
          >
            USE TEST {role.toUpperCase()} PROFILE <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-3 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-white/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Administrative Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. administrator@civicpulse.ai"
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-white/40 font-mono uppercase tracking-widest mb-1.5">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-white/30 hover:text-white/60 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all text-xs font-semibold text-white flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-500/10"
          >
            {loading ? (
              <>
                <Key className="w-3.5 h-3.5 animate-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                <span>Access Dashboard</span> <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
          <span className="relative px-3 bg-[#0c0c0e] text-[9px] font-mono text-white/40">OR SECURE FEDERATION</span>
        </div>

        {/* Google sign in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 text-xs text-white/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.92 1 12 1 7.35 1 3.39 3.66 1.39 7.56l3.78 2.93c.89-2.67 3.39-4.45 6.83-4.45z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.98 3.73-4.9 3.73-8.6z"
            />
            <path
              fill="#FBBC05"
              d="M5.17 14.89c-.23-.69-.36-1.42-.36-2.19s.13-1.5.36-2.19L1.39 7.56C.5 9.35 0 11.12 0 12.7s.5 3.35 1.39 5.14l3.78-2.95z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.1.74-2.52 1.18-4.26 1.18-3.44 0-5.94-1.78-6.83-4.45L1.39 16.9C3.39 20.34 7.35 23 12 23z"
            />
          </svg>
          <span>Sign In with Google Cloud SSO</span>
        </button>

        {/* Toggle Sign Up */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-mono text-white/40 hover:text-blue-400 transition-all cursor-pointer"
          >
            {isSignUp ? 'ALREADY REGISTERED? GO TO SIGN IN' : 'NEW REGISTRATION? REGISTER NEW CITIZEN PROFILE'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
