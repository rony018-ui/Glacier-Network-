import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Globe, 
  Shield, 
  Zap, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  ArrowUpRight,
  Target,
  Cpu,
  Award,
  Link as LinkIcon,
  MessageSquare,
  Sparkles,
  Database,
  CheckCircle2,
  Coins,
  History,
  ChevronRight,
  FileText,
  Share2,
  ExternalLink,
  Radar as RadarIcon,
  Layers,
  FlaskConical,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import GlacierAtlasMap from '../components/GlacierAtlasMap';
import { cn } from '../lib/utils';
import { UserRole } from '../types';

const GROWTH_DATA = [
  { name: 'Jan', funding: 4000, research: 2400, impact: 2400 },
  { name: 'Feb', funding: 3000, research: 1398, impact: 2210 },
  { name: 'Mar', funding: 2000, research: 9800, impact: 2290 },
  { name: 'Apr', funding: 2780, research: 3908, impact: 2000 },
  { name: 'May', funding: 1890, research: 4800, impact: 2181 },
  { name: 'Jun', funding: 2390, research: 3800, impact: 2500 },
  { name: 'Jul', funding: 3490, research: 4300, impact: 2100 },
];

const SDG_IMPACT = [
  { name: 'Climate', value: 85, color: '#6366f1' },
  { name: 'Health', value: 65, color: '#10b981' },
  { name: 'Energy', value: 45, color: '#f59e0b' },
  { name: 'Water', value: 35, color: '#3b82f6' },
  { name: 'Education', value: 95, color: '#ec4899' },
];

const RADAR_DATA = [
  { subject: 'Policy', A: 120, B: 110, fullMark: 150 },
  { subject: 'Industry', A: 98, B: 130, fullMark: 150 },
  { subject: 'Research', A: 86, B: 130, fullMark: 150 },
  { subject: 'Community', A: 99, B: 100, fullMark: 150 },
  { subject: 'Education', A: 85, B: 90, fullMark: 150 },
];

const MISSIONS = [
  { id: 1, title: 'Ocean Plastic Recovery', goals: '95%', status: 'Verified', summary: 'Successfully deployed 12 autonomous nodes in the North Pacific.' },
  { id: 2, title: 'Reforestation AI', goals: '82%', status: 'Active', summary: 'Monitoring 50,000 hectares of newly planted mangroves.' },
  { id: 3, title: 'Clean Energy Grid', goals: '100%', status: 'Verified', summary: 'Implemented decentralized solar sharing in 3 sub-Saharan villages.' },
];

export default function Impact() {
  const [stats, setStats] = useState<any>(null);
  const [aiStory, setAiStory] = useState<string>('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'individual' | 'institutional'>('individual');
  const [userRole, setUserRole] = useState<UserRole>('professor');
  const [scenarioValue, setScenarioValue] = useState(50);

  useEffect(() => {
    fetch('/api/impact/stats')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch stats'))
      .then(setStats)
      .catch(err => console.error('Impact stats fetch error:', err));
    
    generateImpactStory();
  }, []);

  const generateImpactStory = async () => {
    setIsGeneratingStory(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a short, inspiring narrative summary of global scientific impact based on these metrics: 12M funding, 45 active missions, 85% climate goal progress. Focus on human stories and coastal communities. The current viewer is a ${userRole}.`,
        config: {
          systemInstruction: "You are an AI storyteller for a scientific impact platform. Create relatable, inspiring narratives.",
        }
      });
      setAiStory(response.text || 'Impact is being quantified across the globe...');
    } catch (error) {
      console.error('AI Storytelling Error:', error);
      setAiStory('Our global network has successfully reduced plastic waste in 3 coastal communities by 20% this year, fostering a new era of marine biodiversity.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/10">
            <Activity className="w-3 h-3" /> Real-time Impact Feed
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">Global <span className="text-emerald-400">Impact</span> Dashboard</h1>
          <p className="text-white/50 max-w-xl">Quantifying the intersection of scientific research, community action, and institutional funding through blockchain-verified metrics.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
            {(['student', 'researcher', 'independent', 'professor'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
                  userRole === role ? "bg-indigo-600 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Export Data
            </button>
            <button className="px-6 py-3 bg-emerald-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2">
              <Zap className="w-4 h-4" /> Live Feed
            </button>
          </div>
        </div>
      </div>

      {/* Personal Impact Section for Students/Independent */}
      {(userRole === 'student' || userRole === 'independent') && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-[3rem] bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border-indigo-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Award className="w-32 h-32" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">Your Personal <span className="text-indigo-400">Impact</span></h2>
                <p className="text-white/50">See how your contributions ripple through the global network.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-display font-bold text-indigo-400">420</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Impact Points</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-display font-bold text-emerald-400">12</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Missions Joined</div>
                </div>
              </div>
              <button className="px-8 py-4 bg-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-all">
                View My Impact Timeline
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-sm font-bold uppercase tracking-widest text-white/30">Global Contribution Rank</div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[75%] rounded-full relative">
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Top 25% Globally</span>
                <span>Next Milestone: 500 Points</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-xs text-white/60">Your last contribution to <span className="text-white font-bold">Ocean Plastic Recovery</span> was verified by 12 nodes.</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Aggregated Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Publications', value: stats?.totalPublications || 1240, icon: FileText, color: 'text-indigo-400', desc: 'Peer-reviewed output' },
          { label: 'Prototypes', value: '86', icon: FlaskConical, color: 'text-emerald-400', desc: 'Functional solutions' },
          { label: 'Campaigns', value: '342', icon: MessageSquare, color: 'text-yellow-400', desc: 'Awareness reach' },
          { label: 'Policy Influence', value: '18', icon: Shield, color: 'text-pink-400', desc: 'Legislative impacts' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group"
          >
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-display font-bold tracking-tight">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</div>
              <div className="text-[9px] text-white/20 mt-1">{stat.desc}</div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/10 transition-all" />
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Velocity */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold">Growth Velocity</h3>
              <p className="text-xs text-white/30">Predictive modeling for next quarter impact</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Funding
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Research
              </div>
            </div>
          </div>
          <div className="h-[400px] -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResearch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff20', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="funding" stroke="#6366f1" fillOpacity={1} fill="url(#colorFunding)" strokeWidth={3} />
                <Area type="monotone" dataKey="research" stroke="#10b981" fillOpacity={1} fill="url(#colorResearch)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SDG Impact */}
        <div className="glass p-10 rounded-[3rem] space-y-8">
          <h3 className="text-xl font-display font-bold">SDG Contribution</h3>
          <div className="space-y-6">
            {SDG_IMPACT.map((sdg) => (
              <div key={sdg.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-white/40">{sdg.name}</span>
                  <span>{sdg.value}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sdg.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: sdg.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/5 space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Predictive Insight</div>
              <p className="text-[11px] text-white/50 leading-relaxed">Climate impact is projected to increase by 15% in the next 10 years based on current mission velocity.</p>
            </div>
            <button className="w-full py-4 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              Full SDG Report <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Modeling & Future Impact Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scenario Modeling */}
        <div className="glass p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold">Scenario Modeling</h3>
              <p className="text-xs text-white/30">Simulate outcomes under different conditions</p>
            </div>
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Investment Level</span>
                <span>{scenarioValue}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={scenarioValue}
                onChange={(e) => setScenarioValue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Projected Emissions Red.</div>
                <div className="text-2xl font-display font-bold text-emerald-400">{(scenarioValue * 0.3).toFixed(1)}%</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Community Adoption</div>
                <div className="text-2xl font-display font-bold text-indigo-400">{(scenarioValue * 1.2).toFixed(0)}K</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-white/50 leading-relaxed italic">
              "Increasing investment to {scenarioValue}% could trigger a tipping point in decentralized energy adoption across sub-Saharan nodes."
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold">Future Impact Radar</h3>
              <p className="text-xs text-white/30">Ripple effects across industry and policy</p>
            </div>
            <RadarIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Current" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Radar name="Projected" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Storytelling */}
      <div className="glass p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <Sparkles className="w-8 h-8 text-indigo-400/20 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display font-bold">Impact Narrative</h3>
          <p className="text-xs text-white/30">AI-generated storytelling from verified data</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 min-h-[250px] flex flex-col justify-center">
          {isGeneratingStory ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <Markdown>{aiStory}</Markdown>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 pt-4">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/30 font-medium">Verified by 1,240 community members</p>
        </div>
      </div>

      {/* Mission Impact Reports */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-bold">Mission Impact <span className="text-indigo-400">Reports</span></h3>
            <p className="text-sm text-white/40">Transparent outcomes and blockchain-verified results</p>
          </div>
          <button className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
            View All Reports <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MISSIONS.map((mission) => (
            <motion.div
              key={mission.id}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] space-y-6 group"
            >
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-[9px] font-bold text-indigo-400 border border-indigo-500/10">
                  {mission.status}
                </div>
                <div className="text-lg font-display font-bold text-emerald-400">{mission.goals}</div>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-display font-bold group-hover:text-indigo-400 transition-colors">{mission.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{mission.summary}</p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                </div>
                <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <ExternalLink className="w-4 h-4 text-white/20" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Individual & Institutional Impact */}
      <div className="glass p-10 rounded-[3rem] space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-bold">Impact <span className="text-indigo-400">Profiles</span></h3>
            <p className="text-sm text-white/40">Personalized tracking of scientific and social contributions</p>
          </div>
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveProfileTab('individual')}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                activeProfileTab === 'individual' ? "bg-indigo-600 text-white" : "text-white/40 hover:text-white"
              )}
            >
              Individual
            </button>
            <button 
              onClick={() => setActiveProfileTab('institutional')}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                activeProfileTab === 'institutional' ? "bg-indigo-600 text-white" : "text-white/40 hover:text-white"
              )}
            >
              Institutional
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Dr. Sarah Chen', role: 'Lead Researcher', impact: '9.8', citations: '1.2K', collab: '42', icon: Award },
            { name: 'MIT Ocean Lab', role: 'Research Node', impact: '12.4', citations: '5.4K', collab: '128', icon: Shield },
            { name: 'Global Green', role: 'NGO Partner', impact: '7.2', citations: '240', collab: '86', icon: Globe },
            { name: 'Alex Rivera', role: 'Independent', impact: '4.5', citations: '12', collab: '15', icon: Target },
          ].map((pofile, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-6 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                  <pofile.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{pofile.name}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{pofile.role}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <div className="text-xs font-bold">{pofile.impact}</div>
                  <div className="text-[8px] text-white/20 uppercase font-bold">Score</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <div className="text-xs font-bold">{pofile.citations}</div>
                  <div className="text-[8px] text-white/20 uppercase font-bold">Cites</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <div className="text-xs font-bold">{pofile.collab}</div>
                  <div className="text-[8px] text-white/20 uppercase font-bold">Collab</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1">
                  {[1,2,3].map(j => <div key={j} className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />)}
                </div>
                <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">View Pofile</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Geospatial Field Stations on Google Maps */}
      <div className="space-y-4">
        <GlacierAtlasMap />
      </div>

      {/* Blockchain & Tokens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold">Blockchain Verification</h3>
              <p className="text-xs text-white/30">Immutable ledger of scientific contributions</p>
            </div>
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-4">
            {[
              { event: 'Research Paper Verified', hash: '0x7f...3a21', time: '2m ago' },
              { event: 'Mission Outcome Timestamped', hash: '0x42...e9b0', time: '15m ago' },
              { event: 'Impact Tokens Distributed', hash: '0x9a...f12c', time: '1h ago' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-[10px]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-white/60">{log.event}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/20">{log.hash}</span>
                  <span className="text-white/40">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] space-y-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold">Impact Tokens</h3>
            <p className="text-xs text-white/30">Earn rewards for verified impact</p>
          </div>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40">
              <Coins className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold">2,450</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Your Balance</div>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
              Redeem Rewards
            </button>
            <button className="w-full py-4 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              Token History
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Platform Integration */}
      <div className="glass p-10 rounded-[3rem] space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold">Network Integration</h3>
            <p className="text-sm text-white/40">Sync with global research and academic platforms</p>
          </div>
          <LinkIcon className="w-6 h-6 text-white/20" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Google Scholar', status: 'Connected', icon: Globe },
            { name: 'ORCID', status: 'Connected', icon: Shield },
            { name: 'ResearchGate', status: 'Pending', icon: MessageSquare },
            { name: 'GitHub', status: 'Connected', icon: Cpu },
          ].map((platform, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center space-y-3 group hover:bg-white/10 transition-all cursor-pointer">
              <platform.icon className="w-8 h-8 text-white/20 group-hover:text-indigo-400 transition-colors" />
              <div className="text-center">
                <div className="text-xs font-bold">{platform.name}</div>
                <div className={cn(
                  "text-[8px] font-bold uppercase tracking-widest",
                  platform.status === 'Connected' ? "text-emerald-400" : "text-white/20"
                )}>{platform.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Impact */}
      <div className="glass p-10 rounded-[3rem] space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold">Geographic Distribution</h3>
          <div className="px-4 py-1.5 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-white/40">
            Global Network Active
          </div>
        </div>
        <div className="h-[400px] flex items-center justify-center relative bg-white/5 rounded-[2rem] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Globe className="w-full h-full text-white animate-pulse" />
          </div>
          <div className="relative z-10 text-center space-y-4">
            <div className="text-4xl font-display font-bold">128 Nodes</div>
            <p className="text-sm text-white/40 max-w-xs mx-auto">Active research nodes across 42 countries contributing to real-time mission data.</p>
            <button className="px-8 py-3 glass rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
              Explore Global Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
