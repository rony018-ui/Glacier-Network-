import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  X, 
  Send, 
  User as UserIcon, 
  Globe, 
  Zap, 
  Heart, 
  MessageCircle, 
  Monitor, 
  Cpu, 
  Code, 
  Mic, 
  Layers, 
  Share2, 
  Sparkles, 
  Activity, 
  ArrowUpRight,
  Terminal,
  Volume2,
  Video,
  Scissors,
  Box,
  BarChart3,
  TrendingUp,
  Hash,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Discussion, Comment, User } from '../types';
import WhatsAppCommunity from '../components/WhatsAppCommunity';
import ChatGPTGroupChart from '../components/ChatGPTGroupChart';

interface NexusProps {
  user?: User | null;
}

export default function Nexus({ user }: NexusProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'whatsapp' | 'chatgpt'>('feed');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', description: '', category: 'Environment' });
  const [newComment, setNewComment] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showSnipTool, setShowSnipTool] = useState(false);
  const [activeNodeModal, setActiveNodeModal] = useState<string | null>(null);

  const currentUser: User = user || {
    id: 'u1',
    name: 'Dr. Elena Vance',
    role: 'professor',
    institution: 'Black Mesa University',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    impactPoints: 1250
  };

  const ACTIVE_APPS = [
    { name: 'WhatsApp', status: '3 Active Sub-groups', icon: MessageCircle, color: 'text-green-400', tabKey: 'whatsapp' as const, badge: 'COMMUNITY' },
    { name: 'ChatGPT', status: 'Group Chart Ready', icon: Sparkles, color: 'text-emerald-400', tabKey: 'chatgpt' as const, badge: 'GPT-4o' },
    { name: 'Edge', status: '3 Tabs Active', icon: Globe, color: 'text-blue-400', action: 'browse' },
    { name: 'VS Code', status: 'Nexus.tsx', icon: Code, color: 'text-indigo-400', action: 'code' },
    { name: 'Slack', status: '2 Notifications', icon: MessageSquare, color: 'text-pink-400', action: 'slack' },
  ];

  const RESEARCH_PODS = [
    { id: 1, title: 'Climate Modeling Lab', members: 12, active: true, type: 'Spatial Audio' },
    { id: 2, title: 'AI Ethics Review', members: 5, active: true, type: 'Co-Authoring' },
    { id: 3, title: 'Quantum Computing', members: 8, active: false, type: 'Mixed Reality' },
  ];

  const FEED_ITEMS = [
    { 
      id: 'f-whatsapp-preview',
      type: 'whatsapp_card',
      title: 'WhatsApp Community Broadcast: UNEP Grant Phase 2 & Mineralization Benchmarks',
      author: 'Glacier Climate & Carbon Collective',
      time: '12m ago',
      tags: ['WhatsApp Community', 'Verified Broadcast', 'Carbon Tech'],
      snippet: '4 active sub-groups discussing basalt mineralization telemetry and Sentinel-5P methane plumes. 1,842 members engaged.'
    },
    { 
      id: 'f-gpt-preview',
      type: 'chatgpt_card',
      title: 'ChatGPT Group Chart: 5-Year Carbon Trajectory & Team Skill Radar',
      author: 'ChatGPT-4o Scientific Co-Pilot',
      time: '24m ago',
      tags: ['Group Chart', 'Interactive Telemetry', 'Predictive Model'],
      snippet: 'AI synthesized real-time telemetry from Hellisheiði Iceland into an interactive Group Chart. Accelerated pod model projects 290 Mt CO₂e by 2027.'
    },
    { 
      id: 'f1', 
      type: 'thread', 
      title: 'New approach to carbon capture verified with accelerated mineralization', 
      author: 'Dr. Sarah Chen', 
      time: '35m ago', 
      tags: ['Climate', 'Innovation'] 
    },
    { 
      id: 'f2', 
      type: 'snip', 
      title: 'Annotated diagram of ocean alkalinity neural pathways', 
      author: 'Alex Rivera', 
      time: '1h ago', 
      tags: ['Neuroscience', 'Visual'] 
    },
    { 
      id: 'f3', 
      type: 'code', 
      title: 'Python script for SDG impact telemetry analysis', 
      author: 'CodeBot', 
      time: '2h ago', 
      tags: ['Data', 'Automation'] 
    },
  ];

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const res = await fetch('/api/discussions');
      if (res.ok) {
        const data = await res.json();
        setDiscussions(data);
      }
    } catch (err) {
      console.error('Error fetching discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (id: string) => {
    try {
      const res = await fetch(`/api/discussions/${id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    try {
      await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          userId: currentUser.id,
          ...newDiscussion
        })
      });
      setIsModalOpen(false);
      setNewDiscussion({ title: '', description: '', category: 'Environment' });
      fetchDiscussions();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscussion || !newComment.trim()) return;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          discussionId: selectedDiscussion.id,
          userId: currentUser.id,
          content: newComment
        })
      });
      setNewComment('');
      fetchComments(selectedDiscussion.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 lg:px-8 pb-24 space-y-8">
      
      {/* Top Nexus Command Header & Primary Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-6 md:p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest border border-indigo-500/30">
              Desktop-Aware Nexus System
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
            Glacier <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Nexus</span>
          </h1>
          <p className="text-sm text-white/50 max-w-2xl">
            A unified hyper-intelligent ecosystem linking your desktop apps, WhatsApp research communities, and ChatGPT collaborative group chart rooms.
          </p>
        </div>

        {/* Navigation Mode Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-black/60 p-2 rounded-3xl border border-white/10 relative z-10">
          <button
            onClick={() => setActiveTab('feed')}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all",
              activeTab === 'feed'
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <Globe className="w-4 h-4" />
            <span>Glacier Feed & Pods</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all relative",
              activeTab === 'whatsapp'
                ? "bg-[#00a884] text-black shadow-lg shadow-[#00a884]/30"
                : "text-[#25d366] hover:bg-[#00a884]/15"
            )}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Communities</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold",
              activeTab === 'whatsapp' ? "bg-black text-white" : "bg-[#00a884]/20 text-[#00a884]"
            )}>
              3 Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chatgpt')}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold transition-all",
              activeTab === 'chatgpt'
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-purple-300 hover:bg-purple-500/15"
            )}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>ChatGPT Group Chart</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* VIEW CONDITIONAL RENDERING */}
      {activeTab === 'whatsapp' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <WhatsAppCommunity currentUser={currentUser} />
        </motion.div>
      )}

      {activeTab === 'chatgpt' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChatGPTGroupChart currentUser={currentUser} />
        </motion.div>
      )}

      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Desktop Integration & Active Nodes (3 cols) */}
          <div className="xl:col-span-3 space-y-8">
            <div className="glass p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-white">Desktop Nodes</h3>
                  <p className="text-[11px] text-white/40">Synced live with desktop apps</p>
                </div>
                <Monitor className="w-4 h-4 text-white/30" />
              </div>

              <div className="space-y-3">
                {ACTIVE_APPS.map((app) => (
                  <motion.div 
                    key={app.name}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      if (app.tabKey) {
                        setActiveTab(app.tabKey);
                      } else {
                        setActiveNodeModal(app.name);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-4 p-3.5 rounded-2xl border transition-all cursor-pointer group",
                      app.tabKey === 'whatsapp'
                        ? "bg-[#00a884]/10 border-[#00a884]/30 hover:bg-[#00a884]/20"
                        : app.tabKey === 'chatgpt'
                        ? "bg-indigo-600/10 border-indigo-500/30 hover:bg-indigo-600/20"
                        : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0", app.color)}>
                      <app.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{app.name}</span>
                        {app.badge && (
                          <span className={cn(
                            "px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase",
                            app.tabKey === 'whatsapp' ? "bg-[#00a884]/30 text-[#25d366]" : "bg-indigo-500/30 text-indigo-300"
                          )}>
                            {app.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono truncate">{app.status}</div>
                    </div>
                    <div className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Launch Buttons for WhatsApp & ChatGPT */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00a884]/20 hover:bg-[#00a884]/30 border border-[#00a884]/40 text-[#25d366] text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Launch WhatsApp Communities</span>
                </button>
                <button
                  onClick={() => setActiveTab('chatgpt')}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Launch ChatGPT Group Chart</span>
                </button>
              </div>
            </div>

            {/* Insight Graph */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold">Insight Graph</h3>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="h-44 relative flex items-center justify-center">
                <svg className="w-full h-full opacity-50">
                  <circle cx="50%" cy="50%" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-500/30" />
                  <circle cx="20%" cy="30%" r="4" fill="currentColor" className="text-indigo-400" />
                  <circle cx="80%" cy="40%" r="6" fill="currentColor" className="text-purple-400" />
                  <circle cx="40%" cy="80%" r="5" fill="currentColor" className="text-emerald-400" />
                  <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-white/10" />
                  <line x1="80%" y1="40%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-white/10" />
                  <line x1="40%" y1="80%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-white/10" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="text-2xl font-display font-bold text-white">1.2K</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Influence Radius</div>
                </div>
              </div>
              <p className="text-[10px] text-white/40 text-center leading-relaxed">
                Your thoughts have rippled across 12 research pods and 3 WhatsApp sub-groups this week.
              </p>
            </div>
          </div>

          {/* Middle Column: Main Feed & Pods (6 cols) */}
          <div className="xl:col-span-6 space-y-8">
            
            {/* Live Research Pods */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">
                  Live Research <span className="text-indigo-400">Pods</span>
                </h2>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 24 Active Now
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {RESEARCH_PODS.map((pod) => (
                  <motion.div 
                    key={pod.id}
                    whileHover={{ y: -4 }}
                    className="min-w-[280px] glass p-6 rounded-[2rem] space-y-4 relative overflow-hidden group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold text-white/40 border border-white/5 uppercase tracking-widest">
                        {pod.type}
                      </div>
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-white/10" />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold group-hover:text-indigo-400 transition-colors text-white">{pod.title}</h4>
                      <p className="text-[10px] text-white/30">{pod.members} collaborators active</p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        onClick={() => setActiveTab('chatgpt')}
                        className="flex-grow py-2 bg-indigo-600 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all text-white"
                      >
                        Join Pod & Chart
                      </button>
                      <button className="p-2 glass rounded-xl hover:bg-white/10 transition-all text-white">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {pod.active && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -mr-8 -mt-8 blur-xl" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Adaptive Feed */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-display font-bold">Adaptive <span className="text-indigo-400">Stream</span></h2>
                  <p className="text-xs text-white/40">Aggregated from WhatsApp channels, ChatGPT data modeling, and peer pods.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowSnipTool(true)}
                    className="p-3 glass rounded-2xl hover:bg-white/10 transition-all text-indigo-400"
                    title="Snip tool"
                  >
                    <Scissors className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 text-xs text-white"
                  >
                    <Plus className="w-4 h-4" /> Post
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {FEED_ITEMS.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "glass p-7 rounded-[2.5rem] space-y-5 transition-all group cursor-pointer border",
                      item.type === 'whatsapp_card'
                        ? "border-[#00a884]/30 hover:border-[#00a884]/60 bg-[#00a884]/5"
                        : item.type === 'chatgpt_card'
                        ? "border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-600/5"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center font-bold",
                          item.type === 'whatsapp_card'
                            ? "bg-[#00a884] text-black"
                            : item.type === 'chatgpt_card'
                            ? "bg-indigo-600 text-white"
                            : "bg-white/5 text-white/40"
                        )}>
                          {item.type === 'whatsapp_card' ? (
                            <MessageCircle className="w-5 h-5 fill-current" />
                          ) : item.type === 'chatgpt_card' ? (
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <UserIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{item.author}</span>
                            {item.type === 'whatsapp_card' && (
                              <ShieldCheck className="w-4 h-4 text-[#00a884]" />
                            )}
                          </div>
                          <div className="text-[10px] text-white/40">{item.time}</div>
                        </div>
                      </div>

                      <div className="flex gap-1.5 flex-wrap">
                        {item.tags.map(tag => (
                          <span 
                            key={tag} 
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                              tag.includes('WhatsApp') 
                                ? "bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30"
                                : tag.includes('Chart')
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "bg-white/5 text-white/40 border border-white/5"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-display font-bold group-hover:text-indigo-400 transition-colors text-white">
                        {item.title}
                      </h3>

                      {item.snippet && (
                        <p className="text-xs text-white/70 leading-relaxed">
                          {item.snippet}
                        </p>
                      )}

                      {/* WhatsApp Special Card Action */}
                      {item.type === 'whatsapp_card' && (
                        <div className="p-4 rounded-2xl bg-black/40 border border-[#00a884]/30 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#00a884] animate-ping" />
                            <div className="text-xs text-[#25d366] font-semibold">
                              New vote poll open in #carbon-negative-tech
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('whatsapp');
                            }}
                            className="px-4 py-2 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-black font-bold text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95"
                          >
                            <span>Open WhatsApp Community</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* ChatGPT Special Card Action */}
                      {item.type === 'chatgpt_card' && (
                        <div className="p-4 rounded-2xl bg-black/40 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                            <div className="text-xs text-indigo-300 font-semibold">
                              Interactive Group Chart with Bar, Area & Radar toggles
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('chatgpt');
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95"
                          >
                            <span>Open Group Chart & Co-Pilot</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {item.type === 'snip' && (
                        <div className="aspect-video bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative">
                          <img src="https://picsum.photos/seed/diagram/800/450" alt="Snip" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="px-4 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                              <Scissors className="w-3 h-3 text-indigo-400" /> Snipped from Edge
                            </div>
                          </div>
                        </div>
                      )}

                      {item.type === 'code' && (
                        <div className="bg-black/40 rounded-2xl p-6 border border-white/5 font-mono text-xs text-emerald-400/80 space-y-2 overflow-hidden relative">
                          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                            <div className="flex items-center gap-2">
                              <Terminal className="w-3 h-3" /> impact_analysis.py
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-white/20">Collaborative Sandbox</div>
                          </div>
                          <pre><code>{`def calculate_sdg_impact(data):
  # AI-optimized telemetry weighting
  weights = nexus.get_active_weights()
  return data * weights`}</code></pre>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                      <button className="flex items-center gap-2 text-xs text-white/40 hover:text-pink-400 transition-colors">
                        <Heart className="w-4 h-4" /> 24
                      </button>
                      <button className="flex items-center gap-2 text-xs text-white/40 hover:text-indigo-400 transition-colors">
                        <MessageCircle className="w-4 h-4" /> 8
                      </button>
                      <button className="flex items-center gap-2 text-xs text-white/40 hover:text-emerald-400 transition-colors">
                        <Share2 className="w-4 h-4" /> Share
                      </button>
                      <div className="ml-auto flex items-center gap-2 text-[10px] font-mono text-indigo-400">
                        <Zap className="w-3 h-3" /> +15 IP
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Mixed Reality & Global Tracker (3 cols) */}
          <div className="xl:col-span-3 space-y-8">
            <div className="glass p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold">MR Forums</h3>
                <Box className="w-4 h-4 text-white/30" />
              </div>
              <div className="aspect-square bg-white/5 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center p-6 space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full border-[1px] border-white/10 rounded-full animate-ping" />
                </div>
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center relative z-10">
                  <Video className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="space-y-1 relative z-10">
                  <div className="text-sm font-bold text-white">Mixed Reality Debate</div>
                  <p className="text-[10px] text-white/40">Visualizing "The Ethics of AGI & Minerals" in 3D spatial zones.</p>
                </div>
                <button 
                  onClick={() => alert('Launching WebXR Spatial Forum session...')}
                  className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all relative z-10"
                >
                  Enter Spatial Forum
                </button>
              </div>
            </div>

            <div className="glass p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold">Global Tracker</h3>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Policy Changes', value: '12', color: 'bg-indigo-500' },
                  { label: 'Research Outcomes', value: '84', color: 'bg-emerald-500' },
                  { label: 'Community Actions', value: '1.2K', color: 'bg-yellow-500' },
                ].map(stat => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/40">{stat.label}</span>
                      <span className="text-white font-mono">{stat.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", stat.color)} style={{ width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-white/30 leading-relaxed italic">
                  "Nexus discussions and WhatsApp communities have influenced 3 legislative drafts in the EU this month."
                </p>
              </div>
            </div>

            {/* Voice Driven Actions Floating UI */}
            <div className="fixed bottom-8 right-8 z-[100]">
              <motion.div 
                animate={{ scale: isVoiceActive ? 1.1 : 1 }}
                className="relative"
              >
                <button 
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all",
                    isVoiceActive ? "bg-red-500 animate-pulse" : "bg-indigo-600 hover:bg-indigo-500"
                  )}
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
                <AnimatePresence>
                  {isVoiceActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.8 }}
                      className="absolute bottom-20 right-0 w-72 glass p-6 rounded-[2rem] border-indigo-500/30 space-y-4"
                    >
                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Listening Voice Agent...</div>
                      <div className="text-sm text-white/80 italic">"Switch to WhatsApp Communities or plot SDG Group Chart..."</div>
                      <div className="flex gap-2">
                        <div className="w-1 h-4 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1 h-6 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-white/10">
                        <button 
                          onClick={() => {
                            setActiveTab('whatsapp');
                            setIsVoiceActive(false);
                          }}
                          className="px-3 py-1 bg-[#00a884] text-black text-[10px] font-bold rounded-lg"
                        >
                          Go to WhatsApp
                        </button>
                        <button 
                          onClick={() => {
                            setActiveTab('chatgpt');
                            setIsVoiceActive(false);
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg"
                        >
                          Go to Charts
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Snip Tool Modal */}
      <AnimatePresence>
        {showSnipTool && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSnipTool(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video glass rounded-[3rem] border-indigo-500/30 overflow-hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Scissors className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-2xl font-display font-bold text-white">Snip-to-Post</h2>
                </div>
                <button onClick={() => setShowSnipTool(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X />
                </button>
              </div>
              <div className="flex-grow flex items-center justify-center bg-black/40 relative group">
                <div className="absolute inset-0 border-2 border-dashed border-indigo-500/30 m-12 rounded-2xl" />
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto">
                    <Plus className="w-10 h-10 text-indigo-400" />
                  </div>
                  <p className="text-sm text-white/40">Drag a screenshot or use <span className="text-indigo-400 font-mono">Win + Shift + S</span></p>
                </div>
              </div>
              <div className="p-8 bg-white/5 flex items-center justify-between">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  AI Auto-Tagging Enabled
                </div>
                <button 
                  onClick={() => {
                    setShowSnipTool(false);
                    alert('Screenshot analyzed and tagged with #Climate #Telemetry. Added to Nexus Stream.');
                  }}
                  className="px-8 py-3 bg-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all text-white"
                >
                  Analyze & Broadcast
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Node Info Modal for Edge, VS Code, Slack */}
      <AnimatePresence>
        {activeNodeModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNodeModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-base">{activeNodeModal} Node Synchronizer</h3>
                </div>
                <button onClick={() => setActiveNodeModal(null)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Active context from {activeNodeModal} is automatically ingested by Glacier Nexus. Open papers, code diffs, or chat mentions are vectorized into research insight nodes.
              </p>
              <div className="p-3 bg-white/5 rounded-xl text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>3 active context buffers currently streaming</span>
              </div>
              <button
                onClick={() => setActiveNodeModal(null)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass p-8 rounded-[2rem] shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold text-white">Nexus <span className="text-indigo-400">Post</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                  <X />
                </button>
              </div>

              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Insight Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="What's on your mind?"
                    value={newDiscussion.title}
                    onChange={e => setNewDiscussion({...newDiscussion, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Category</label>
                  <select 
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                    value={newDiscussion.category}
                    onChange={e => setNewDiscussion({...newDiscussion, category: e.target.value})}
                  >
                    <option value="Environment">Environment</option>
                    <option value="Health">Health</option>
                    <option value="Energy">Energy</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Content</label>
                  <textarea 
                    required
                    rows={4} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Share your research, data, or questions..."
                    value={newDiscussion.description}
                    onChange={e => setNewDiscussion({...newDiscussion, description: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-white"
                >
                  <Send className="w-5 h-5" /> Broadcast to Nexus
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
