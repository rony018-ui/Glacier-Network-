import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Plus, 
  Search, 
  Target, 
  Shield, 
  Zap, 
  ArrowRight, 
  TrendingUp,
  Filter,
  X,
  BookOpen,
  Users,
  Sparkles,
  CheckCircle2,
  Clock,
  BarChart3,
  Award,
  ChevronDown,
  BrainCircuit,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Campaign, UserRole } from '../types';
import { cn } from '../lib/utils';

const THEMES = ['All', 'Environment', 'Health', 'Technology', 'Education'];
const ROLES: { value: UserRole | 'all', label: string }[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'student', label: 'Students' },
  { value: 'researcher', label: 'Researchers' },
  { value: 'independent', label: 'Independent' },
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiAnalysisId, setAiAnalysisId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch campaigns'))
      .then(data => {
        // Enhance mock data with new fields if they don't exist
        const enhancedData = data.map((c: any) => ({
          ...c,
          backgroundContext: c.backgroundContext || "This mission addresses critical global challenges by leveraging decentralized research nodes to accelerate innovation and impact verification.",
          targetRoles: c.targetRoles || ['student', 'researcher', 'independent'],
          tasks: c.tasks || [
            { id: 't1', title: 'Data Collection', description: 'Gather initial datasets from local nodes.', isCompleted: true },
            { id: 't2', title: 'Analysis Phase', description: 'Run simulations on the Glacier Engine.', isCompleted: false },
            { id: 't3', title: 'Peer Review', description: 'Submit findings for institutional verification.', isCompleted: false },
          ],
          resources: c.resources || [
            { id: 'r1', title: 'Core Research Paper', type: 'paper', url: '#' },
            { id: 'r2', title: 'Impact Dataset v1.0', type: 'dataset', url: '#' },
            { id: 'r3', title: 'Oracle Analysis Tool', type: 'ai', url: '#' },
          ],
          impactMetrics: c.impactMetrics || [
            { id: 'm1', label: 'Citations', value: '450', target: '1000' },
            { id: 'm2', label: 'Prototypes', value: '3', target: '5' },
          ],
          badges: c.badges || ['Pioneer', 'Verified']
        }));
        setCampaigns(enhancedData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.sdg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = selectedTheme === 'All' || c.category === selectedTheme;
    const matchesRole = selectedRole === 'all' || c.targetRoles?.includes(selectedRole as UserRole);
    return matchesSearch && matchesTheme && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/10">
            <Rocket className="w-3 h-3" /> Mission Control
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">Active <span className="text-indigo-400">Missions</span></h1>
          <p className="text-white/50 max-w-xl">High-impact scientific campaigns solving the world's most critical challenges through decentralized collaboration.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold transition-all shadow-xl shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" /> Launch Mission
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search missions by title, category, or SDG..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-indigo-50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative group">
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="appearance-none bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-12 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer font-medium"
              >
                {ROLES.map(role => (
                  <option key={role.value} value={role.value} className="bg-zinc-900">{role.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {THEMES.map(theme => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
                selectedTheme === theme 
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
              )}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-96 glass rounded-[3rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {filtered.map((camp, i) => {
            const progress = (camp.currentAmount / camp.goalAmount) * 100;
            return (
              <motion.div
                key={camp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group glass p-10 md:p-12 rounded-[3.5rem] border-white/5 hover:border-white/20 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-indigo-500/10 transition-all" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                  {/* Left Column: Info & Context */}
                  <div className="lg:col-span-7 space-y-8">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-base font-bold">{camp.institutionName || 'Independent Node'}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Verified Authority</div>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/10 hidden md:block" />
                      <div className="flex gap-2">
                        {camp.badges?.map(badge => (
                          <div key={badge} className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-[10px] font-bold text-amber-400 uppercase border border-amber-500/10">
                            <Award className="w-3 h-3" /> {badge}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
                          {camp.category}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/20">
                          SDG {camp.sdg}
                        </span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-display font-bold leading-tight group-hover:text-indigo-400 transition-colors">{camp.title}</h3>
                      <p className="text-white/40 text-lg font-light leading-relaxed">
                        {camp.description}
                      </p>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-widest text-white/30">Background Context</div>
                        <p className="text-sm text-white/60 leading-relaxed italic">"{camp.backgroundContext}"</p>
                      </div>
                    </div>

                    {/* Tasks & Deliverables */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold flex items-center gap-2">
                          <Target className="w-5 h-5 text-indigo-400" /> Tasks & Deliverables
                        </h4>
                        <span className="text-xs font-mono text-white/30">3 STAGES</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {camp.tasks?.map((task) => (
                          <div key={task.id} className={cn(
                            "p-4 rounded-xl border transition-all",
                            task.isCompleted 
                              ? "bg-emerald-500/5 border-emerald-500/20" 
                              : "bg-white/5 border-white/10"
                          )}>
                            <div className="flex items-center justify-between mb-2">
                              {task.isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-white/20" />}
                              {task.deadline && <span className="text-[10px] font-mono text-white/30">{task.deadline}</span>}
                            </div>
                            <div className="font-bold text-sm mb-1">{task.title}</div>
                            <div className="text-[10px] text-white/40 line-clamp-1">{task.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Progress, Resources, Metrics */}
                  <div className="lg:col-span-5 space-y-10">
                    {/* Progress Dashboard */}
                    <div className="glass p-8 rounded-3xl border-white/10 space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="text-xs font-bold uppercase tracking-widest text-white/30">Funding Progress</div>
                          <div className="text-3xl font-display font-bold text-indigo-400">{progress.toFixed(0)}%</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-xs font-bold uppercase tracking-widest text-white/30">Raised</div>
                          <div className="text-xl font-bold">${camp.currentAmount.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] animate-shimmer rounded-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        {camp.impactMetrics?.map(metric => (
                          <div key={metric.id} className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{metric.label}</div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold">{metric.value}</span>
                              <span className="text-[10px] text-white/20">/ {metric.target}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-400" /> Knowledge Resources
                      </h4>
                      <div className="space-y-2">
                        {camp.resources?.map(resource => (
                          <a 
                            key={resource.id} 
                            href={resource.url}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group/res"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                {resource.type === 'paper' && <FileText className="w-4 h-4 text-blue-400" />}
                                {resource.type === 'dataset' && <BarChart3 className="w-4 h-4 text-emerald-400" />}
                                {resource.type === 'ai' && <BrainCircuit className="w-4 h-4 text-purple-400" />}
                                {resource.type === 'tool' && <Zap className="w-4 h-4 text-amber-400" />}
                              </div>
                              <span className="text-sm font-medium text-white/70 group-hover/res:text-white transition-colors">{resource.title}</span>
                            </div>
                            <LinkIcon className="w-4 h-4 text-white/20 group-hover/res:text-white/50 transition-all" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        to={`/campaigns/${camp.id}`} 
                        className="flex-grow px-8 py-5 bg-white text-black rounded-2xl font-bold hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-95 text-center shadow-xl shadow-white/5"
                      >
                        Enter Mission Dashboard
                      </Link>
                      <button 
                        onClick={() => setAiAnalysisId(camp.id)}
                        className="px-8 py-5 glass rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/ai"
                      >
                        <Sparkles className="w-5 h-5 text-indigo-400 group-hover/ai:animate-pulse" /> Oracle Summary
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Indicators */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">Open For:</div>
                    <div className="flex gap-2">
                      {camp.targetRoles?.map(role => (
                        <div key={role} className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/40 border border-white/5 capitalize">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Users className="w-4 h-4" /> {camp.solutionCount || 0} Contributors
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <TrendingUp className="w-4 h-4" /> High Impact Potential
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* AI Oracle Modal */}
      <AnimatePresence>
        {aiAnalysisId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiAnalysisId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass p-10 rounded-[3rem] border-white/10 shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">Oracle Analysis</h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Neural Mission Summary</p>
                  </div>
                </div>
                <button onClick={() => setAiAnalysisId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> Strategic Summary
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    This mission presents a high feasibility score (8.4/10) due to existing institutional support from the Glacier Network. The primary bottleneck is data verification speed, which can be mitigated by engaging more student researchers for initial validation tasks.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Impact Prediction
                    </div>
                    <ul className="text-xs text-white/50 space-y-2">
                      <li className="flex items-center gap-2">• 45% reduction in local waste</li>
                      <li className="flex items-center gap-2">• 12 new peer-reviewed papers</li>
                      <li className="flex items-center gap-2">• Global scalability: High</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-purple-400 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Collaboration Tips
                    </div>
                    <ul className="text-xs text-white/50 space-y-2">
                      <li className="flex items-center gap-2">• Connect with MIT Node</li>
                      <li className="flex items-center gap-2">• Use Dataset v2.1</li>
                      <li className="flex items-center gap-2">• Target SDG 14.2</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button className="flex-grow px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all">
                  Generate Full Report
                </button>
                <button className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-all">
                  Brainstorm Ideas
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
