import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Plus, 
  Send, 
  Award,
  BarChart3,
  PieChart,
  Activity,
  User as UserIcon,
  Cpu
} from 'lucide-react';
import { Campaign, Solution, Milestone } from '../types';
import { cn } from '../lib/utils';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GoogleWorkspaceHub from '../components/GoogleWorkspaceHub';

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'transparency' | 'workspace'>('overview');
  const [newSolution, setNewSolution] = useState({ title: '', description: '' });

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch campaign'))
      .then(setCampaign)
      .catch(err => console.error('Campaign detail fetch error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !campaign) return <div className="min-h-screen flex items-center justify-center">Loading Mission Dashboard...</div>;

  const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
  
  const transparencyData = [
    { name: 'Research', value: 40, color: '#6366f1' },
    { name: 'Equipment', value: 30, color: '#a855f7' },
    { name: 'Operations', value: 20, color: '#ec4899' },
    { name: 'Community', value: 10, color: '#10b981' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
      {/* Header / Mission Control Header */}
      <div className="glass p-10 rounded-[3rem] border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full -mr-64 -mt-64 blur-[100px]" />
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="flex-grow space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
                Mission Dashboard
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 border border-white/5">
                {campaign.sdg}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-white/30">
                <Shield className="w-3 h-3" /> Verified by {campaign.institutionName || 'Independent Nodes'}
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight leading-tight">{campaign.title}</h1>
            <p className="text-xl text-white/50 leading-relaxed max-w-3xl">{campaign.description}</p>
            
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-white/30 font-bold">Principal Lead</div>
                <div className="flex items-center gap-2 font-bold">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${campaign.authorName}`} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  {campaign.authorName}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-white/30 font-bold">Launch Date</div>
                <div className="font-bold">{new Date(campaign.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest text-white/30 font-bold">Status</div>
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Mission
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-80 flex-shrink-0 space-y-8">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-white/5 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                <motion.circle 
                  className="text-indigo-500 stroke-current" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  fill="transparent" 
                  r="40" cx="50" cy="50" 
                  style={{
                    strokeDasharray: 251.2,
                    strokeDashoffset: 251.2 - (251.2 * progress) / 100
                  }}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-bold">{progress.toFixed(0)}%</span>
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Funded</span>
              </div>
            </div>
            
            <div className="space-y-2 text-center">
              <div className="text-2xl font-display font-bold">${campaign.currentAmount.toLocaleString()}</div>
              <div className="text-xs text-white/40">of ${campaign.goalAmount.toLocaleString()} goal</div>
              <button className="w-full mt-4 py-4 bg-white text-black font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl">
                Contribute to Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-white/5 pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'workspace', label: 'Workspace Lab & Tools', icon: Rocket },
          { id: 'solutions', label: 'Community Solutions', icon: Zap },
          { id: 'transparency', label: 'Transparency Log', icon: Shield },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 font-bold transition-all pb-4 -mb-[18px]",
              activeTab === tab.id ? "text-indigo-400 border-b-2 border-indigo-400" : "text-white/40 hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Milestone Tracker */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                    <TrendingUp className="text-indigo-400" /> Milestone Tracker
                  </h3>
                  <div className="space-y-6">
                    {campaign.milestones?.map((m, i) => (
                      <div key={m.id} className="flex gap-6 relative">
                        {i < (campaign.milestones?.length || 0) - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-white/5" />
                        )}
                        <div className={cn(
                          "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center relative z-10",
                          m.isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/20"
                        )}>
                          {m.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="glass p-6 rounded-2xl flex-grow space-y-2">
                          <h4 className="font-bold">{m.title}</h4>
                          <p className="text-sm text-white/50">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                <div className="glass p-8 rounded-[2.5rem] border-indigo-500/10 bg-indigo-500/5 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Cpu className="w-4 h-4" /> AI Mission Analysis
                  </div>
                  <p className="text-white/70 italic leading-relaxed">
                    "This mission addresses critical gaps in {campaign.category} by leveraging decentralized research nodes. Feasibility scoring indicates a high probability of success (88%) if Phase 2 milestones are met within the projected timeline."
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'workspace' && (
              <motion.div 
                key="workspace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <GoogleWorkspaceHub />
              </motion.div>
            )}

            {activeTab === 'solutions' && (
              <motion.div 
                key="solutions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-display font-bold">Community Solutions</h3>
                  <button className="px-6 py-3 bg-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Propose Solution
                  </button>
                </div>

                <div className="space-y-6">
                  {campaign.solutions?.map(sol => (
                    <div key={sol.id} className="glass p-8 rounded-[2.5rem] space-y-6 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={sol.authorAvatar} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                          <div>
                            <div className="text-sm font-bold">{sol.authorName}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Contributor</div>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 border border-emerald-500/10">
                          Feasibility: {sol.feasibilityScore}%
                        </div>
                      </div>
                      <h4 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{sol.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{sol.description}</p>
                      <div className="pt-4 flex items-center justify-between border-t border-white/5">
                        <button className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors">
                          <Award className="w-4 h-4" /> 12 Recognition Points
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                          <TrendingUp className="w-4 h-4" /> Vote ({sol.votes})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'transparency' && (
              <motion.div 
                key="transparency"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[2.5rem] space-y-6">
                    <h4 className="text-xl font-display font-bold">Funding Breakdown</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={transparencyData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {transparencyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {transparencyData.map(item => (
                        <div key={item.name} className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-white/40">{item.name}</span>
                          <span className="font-bold ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[2.5rem] space-y-6">
                    <h4 className="text-xl font-display font-bold">Audit Log</h4>
                    <div className="space-y-4">
                      {[
                        { event: 'Transaction Verified', date: '2h ago', desc: 'Node #442 confirmed $12k transfer.' },
                        { event: 'Report Published', date: '1d ago', desc: 'Q1 Transparency Report is live.' },
                        { event: 'Milestone Confirmed', date: '3d ago', desc: 'Phase 1 verified by BMU.' },
                      ].map((log, i) => (
                        <div key={i} className="flex gap-4 text-sm">
                          <div className="w-1 h-full bg-white/5 rounded-full" />
                          <div className="space-y-1">
                            <div className="font-bold flex items-center gap-2">
                              {log.event} <span className="text-[10px] text-white/20 font-mono">{log.date}</span>
                            </div>
                            <div className="text-white/40 text-xs">{log.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-display font-bold">Mission Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Contributors</span>
                <span className="font-bold">1,242</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Solution Feasibility</span>
                <span className="font-bold text-indigo-400">88%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Transparency Score</span>
                <span className="font-bold text-emerald-400">96/100</span>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-display font-bold">Linked Research</h3>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl space-y-2 group cursor-pointer hover:bg-white/10 transition-all">
                  <div className="text-xs font-bold text-indigo-400">DOI: 10.1038/s41586</div>
                  <h4 className="text-sm font-bold leading-tight group-hover:text-white transition-colors">Autonomous Filtration Systems in Dynamic Marine Environments</h4>
                </div>
              ))}
            </div>
            <button className="w-full py-3 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
              View All Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
