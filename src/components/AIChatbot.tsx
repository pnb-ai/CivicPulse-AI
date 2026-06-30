/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am the CivicPulse AI Assistant. How can I help you collaborate with the city council today? You can ask me how priority scores work, query district power status, or learn how to earn citizen XP!",
      createdAt: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputValue,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, history: messages })
      });
      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.text,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat bot error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Floating Toggle Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl shadow-blue-500/15 cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        >
          <MessageSquare className="w-5.5 h-5.5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-mono text-xs font-semibold uppercase text-white/90 tracking-wider">
            &nbsp;Speak to AI
          </span>
        </button>
      )}

      {/* Chat window panel */}
      {isOpen && (
        <div className="w-[320px] sm:w-[350px] h-[450px] bg-[#0a0a0c]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-black/60 p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
              <div>
                <span className="text-xs font-semibold text-white block tracking-tight">CIVICPULSE ASSIST BOT</span>
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block -mt-0.5">Powered by Civic AI</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(m => (
              <div 
                key={m.id} 
                className={`flex gap-2 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`p-3 rounded-2xl text-xs leading-normal ${
                  m.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' 
                    : 'bg-white/[0.03] text-white/80 rounded-tl-none border border-white/5 font-sans'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-[10px] text-white/40 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>AI processing pulse...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about city operations..."
              className="flex-1 px-3 py-1.5 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer flex items-center justify-center transition-colors shadow-lg shadow-blue-500/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
