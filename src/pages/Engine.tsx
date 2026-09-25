import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter, 
  Tag, 
  Calendar, 
  User as UserIcon, 
  X, 
  FileText, 
  Send, 
  Award, 
  ArrowRight,
  Sparkles,
  Globe,
  BarChart3,
  Database,
  Zap,
  Download,
  Bell,
  Cpu,
  Target,
  TrendingUp,
  PieChart as PieChartIcon,
  Layers,
  BrainCircuit,
  Terminal,
  History,
  CheckCircle2,
  ChevronRight,
  Shield,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Publication, UserRole } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

type EngineTab = 'oracle' | 'analytics' | 'repository' | 'automation';

const RADAR_DATA = [
  { subject: 'Innovation', A: 120, B: 110, fullMark: 150 },
  { subject: 'Collaboration', A: 98, B: 130, fullMark: 150 },
  { subject: 'Impact', A: 86, B: 130, fullMark: 150 },
  { subject: 'Publication', A: 99, B: 100, fullMark: 150 },
  { subject: 'SDG Alignment', A: 85, B: 90, fullMark: 150 },
  { subject: 'Community', A: 65, B: 85, fullMark: 150 },
];

const IMPACT_TIMELINE = [
  { month: 'Jan', citations: 45, impact: 2400 },
  { month: 'Feb', citations: 52, impact: 2210 },
  { month: 'Mar', citations: 48, impact: 2290 },
  { month: 'Apr', citations: 61, impact: 2000 },
  { month: 'May', citations: 55, impact: 2181 },
  { month: 'Jun', citations: 67, impact: 2500 },
];

const SDG_DISTRIBUTION = [
  { name: 'SDG 4', value: 400 },
  { name: 'SDG 9', value: 300 },
  { name: 'SDG 13', value: 300 },
  { name: 'SDG 14', value: 200 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981'];

export default function Engine() {
  const [activeTab, setActiveTab] = useState<EngineTab>('analytics');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('professor');
  
  // AI Oracle State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/publications')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch publications'))
      .then(setPublications)
      .catch(err => console.error('Publications fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are the Glacier AI Oracle. You assist users in a decentralized scientific impact platform. 
          The current user is a ${userRole}. Adapt your tone and depth accordingly. 
          If student: focus on learning and simple explanations. 
          If researcher/professor: focus on advanced analytics and literature reviews. 
          If independent: focus on visibility and peer recognition.`,
        }
      });
      
      setAiMessages(prev => [...prev, { role: 'ai', content: response.text || 'I am processing your request...' }]);
    } catch (error) {
      console.error('AI Oracle Error:', error);
      setAiMessages(prev => [...prev, { role: 'ai', content: 'The Oracle is temporarily disconnected. Please try again later.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredPubs = publications.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/10">
            <Cpu className="w-3 h-3" /> Glacier Core Engine
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">Intelligence <span className="text-indigo-400">& Impact</span></h1>
          <p className="text-white/50 max-w-xl">The centralized processing unit for global research, AI-driven insights, and mission automation.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2">View as:</span>
          {(['student', 'researcher', 'independent', 'professor'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                userRole === role ? "bg-indigo-600 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {[
          { id: 'analytics', label: 'Analytics Hub', icon: BarChart3 },
          { id: 'oracle', label: 'AI Oracle', icon: Sparkles },
          { id: 'repository', label: 'Knowledge Repo', icon: Database },
          { id: 'automation', label: 'Automation', icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as EngineTab)}
            className={cn(
              "flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative",
              activeTab === tab.id ? "text-indigo-400" : "text-white/40 hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="engine-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Radar Chart */}
              <div className="lg:col-span-2 glass p-8 rounded-[3rem] space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-bold">Research Performance</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    <Target className="w-3 h-3" /> Target: Global Impact
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="Current" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                      <Radar name="Benchmark" dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="space-y-8">
                <div className="glass p-8 rounded-[3rem] space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total Impact Points</div>
                  <div className="text-4xl font-display font-bold">12,840</div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <TrendingUp className="w-4 h-4" /> +15.4% this quarter
                  </div>
                </div>
                <div className="glass p-8 rounded-[3rem] space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">SDG Contribution</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SDG_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {SDG_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {SDG_DISTRIBUTION.map((sdg, i) => (
                      <div key={sdg.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-[10px] font-bold text-white/40">{sdg.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="glass p-8 rounded-[3rem] space-y-6">
              <h3 className="text-xl font-display font-bold">Impact Growth Timeline</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={IMPACT_TIMELINE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="impact" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="citations" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'oracle' && (
          <motion.div 
            key="oracle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[700px]"
          >
            {/* AI Assistant Sidebar */}
            <div className="lg:col-span-1 glass p-8 rounded-[3rem] space-y-8 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">Oracle Modes</h3>
                <div className="space-y-2">
                  {[
                    { id: 'summary', label: 'Research Summary', icon: FileText },
                    { id: 'brainstorm', label: 'Brainstorming', icon: BrainCircuit },
                    { id: 'review', label: 'Literature Review', icon: BookOpen },
                    { id: 'code', label: 'Technical Insights', icon: Terminal },
                  ].map(mode => (
                    <button key={mode.id} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group">
                      <mode.icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">Contextual Data</h3>
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                  <div className="text-[10px] font-bold text-indigo-400">Current Mission</div>
                  <div className="text-xs font-medium">Ocean Cleanup 2025</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-2">
                  <div className="text-[10px] font-bold text-purple-400">Active Papers</div>
                  <div className="text-xs font-medium">12 Documents Linked</div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col glass rounded-[3rem] overflow-hidden">
              <div className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-hide">
                {aiMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold">How can I assist your research today?</h3>
                      <p className="text-sm max-w-sm">Summarize papers, brainstorm mission strategies, or generate impact reports.</p>
                    </div>
                  </div>
                )}
                {aiMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-4 max-w-[80%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-white/10" : "bg-indigo-600 shadow-lg shadow-indigo-600/20"
                    )}>
                      {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className={cn(
                      "p-6 rounded-3xl text-sm leading-relaxed",
                      msg.role === 'user' ? "bg-white/5 border border-white/10" : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-100"
                    )}>
                      <div className="markdown-body">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isAiLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleAiSubmit} className="p-8 bg-white/5 border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask the Oracle anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:border-indigo-500 transition-colors"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={isAiLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'repository' && (
          <motion.div 
            key="repository"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="AI-assisted search across datasets, tools, and papers..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-8 py-5 glass rounded-2xl font-medium hover:bg-white/10 transition-all">
                <Filter className="w-5 h-5" /> Advanced Filters
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPubs.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group glass p-8 rounded-[3rem] space-y-6 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">{pub.authorName}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{pub.authorRole}</div>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-indigo-500/10 text-[8px] font-bold text-indigo-400 border border-indigo-500/10">
                      {pub.sdg || 'SDG 9'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-display font-bold leading-tight group-hover:text-white transition-colors">{pub.title}</h3>
                    <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">
                      {pub.abstract}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-white/30">
                      <span className="flex items-center gap-1.5"><Award className="w-3 h-3" /> {pub.citations} Citations</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(pub.createdAt).getFullYear()}</span>
                    </div>
                    <button className="text-[10px] font-bold text-indigo-400 flex items-center gap-2 uppercase tracking-widest">
                      View Repository <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'automation' && (
          <motion.div 
            key="automation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Workflow Automation */}
            <div className="glass p-8 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-display font-bold">Workflows</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Export Impact Report', desc: 'Generate PDF of mission contributions', icon: Download },
                  { label: 'Auto-Sync Citations', desc: 'Update bibliography from global nodes', icon: History },
                  { label: 'Dataset Packaging', desc: 'Bundle research data for sharing', icon: Database },
                ].map((tool, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <tool.icon className="w-4 h-4 text-white/40 group-hover:text-indigo-400" />
                      <div className="text-left">
                        <div className="text-xs font-bold">{tool.label}</div>
                        <div className="text-[10px] text-white/30">{tool.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Notifications */}
            <div className="glass p-8 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-display font-bold">Smart Alerts</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'New Mission Match', time: '2h ago', type: 'Match' },
                  { label: 'Citation Alert', time: '5h ago', type: 'Impact' },
                  { label: 'Node Verification', time: '1d ago', type: 'Trust' },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div>
                        <div className="text-xs font-bold">{alert.label}</div>
                        <div className="text-[10px] text-white/30">{alert.time} • {alert.type}</div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <X className="w-3 h-3 text-white/20" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gamification / Badges */}
            <div className="glass p-8 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-display font-bold">Achievements</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Top Innovator', icon: Sparkles, color: 'text-indigo-400' },
                  { label: 'Global Collab', icon: Globe, color: 'text-emerald-400' },
                  { label: 'SDG Hero', icon: Target, color: 'text-purple-400' },
                  { label: 'Trust Node', icon: Shield, color: 'text-amber-400' },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3 text-center group hover:bg-white/10 transition-all">
                    <badge.icon className={cn("w-8 h-8", badge.color, "group-hover:scale-110 transition-transform")} />
                    <div className="text-[10px] font-bold uppercase tracking-widest">{badge.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Modal (Legacy from Publications) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
              className="relative w-full max-w-2xl glass p-10 rounded-[3rem] shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold">Submit <span className="text-indigo-400">Research</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X />
                </button>
              </div>
              {/* Form content omitted for brevity, similar to previous Publications.tsx */}
              <p className="text-white/50">Submission form is active. Please ensure all DOI and SDG metadata is correct before pushing to the Command Network.</p>
              <button className="w-full py-5 bg-indigo-600 rounded-2xl font-bold">Confirm Submission</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
