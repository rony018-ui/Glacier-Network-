import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Edit3, 
  Award, 
  MapPin, 
  Building, 
  ShieldCheck, 
  Zap, 
  Target, 
  Cpu, 
  Code, 
  GraduationCap, 
  Microscope, 
  Briefcase, 
  Globe, 
  BarChart3, 
  FileText, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { User, Publication, UserRole } from '../types';
import { cn } from '../lib/utils';

export default function Pofile({ user: initialUser }: { user: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [userPubs, setUserPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(!initialUser);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setLoading(false);
    }
    
    const fetchProfile = async () => {
      try {
        const userId = initialUser?.id || 'u1';
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const userData = await res.json();
          if (!initialUser) setUser(userData);
        }

        const pubsRes = await fetch('/api/publications');
        if (pubsRes.ok) {
          const allPubs = await pubsRes.json();
          setUserPubs(allPubs.filter((p: Publication) => p.userId === userId));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [initialUser]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const renderDashboard = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard user={user} />;
      case 'independent':
      case 'researcher':
        return <ResearcherDashboard user={user} pubs={userPubs} />;
      case 'professor':
        return <ProfessorDashboard user={user} />;
      case 'institution':
        return <InstitutionDashboard user={user} />;
      default:
        return <ResearcherDashboard user={user} pubs={userPubs} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-64 rounded-[3rem] bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
        
        <div className="absolute -bottom-16 left-12 flex flex-col md:flex-row items-end gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="relative w-40 h-40 rounded-full border-4 border-[#050505] shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-full border-2 border-[#050505] hover:scale-110 transition-transform">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="pb-4 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-display font-bold">{user.name}</h1>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified {user.role}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-white/50 text-sm">
              <span className="flex items-center gap-2"><Building className="w-4 h-4" /> {user.institution}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Global Citizen</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4" /> {user.impactPoints} IP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <div className="space-y-4">
          <div className="glass p-4 rounded-3xl space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Zap },
              { id: 'publications', label: 'Publications', icon: BookOpen },
              { id: 'network', label: 'Network', icon: Users },
              { id: 'governance', label: 'Governance', icon: ShieldCheck },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  activeTab === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-white/40 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="glass p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">Oracle Insights</h4>
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold">Role Detected</span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed">
                Oracle has verified your {user.role} status via institutional credentials. Your feed is now optimized for collaboration.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {renderDashboard()}
              </motion.div>
            )}

            {activeTab === 'publications' && (
              <motion.div
                key="publications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold">Research <span className="text-indigo-400">Portfolio</span></h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all">
                    <Plus className="w-4 h-4" /> New Paper
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userPubs.map((pub) => (
                    <div key={pub.id} className="glass p-6 rounded-3xl space-y-4 group hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start">
                        <h3 className="font-display font-bold group-hover:text-indigo-400 transition-colors">{pub.title}</h3>
                        <span className="text-[10px] font-mono text-white/30">{new Date(pub.createdAt).getFullYear()}</span>
                      </div>
                      <p className="text-white/50 text-xs line-clamp-2">{pub.abstract}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex gap-2">
                          {pub.tags?.split(',').map(tag => (
                            <span key={tag} className="text-[9px] font-bold uppercase text-indigo-400/60">#{tag.trim()}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-white/30">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> 452</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 12</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'governance' && (
              <motion.div
                key="governance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="glass p-8 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold">Polife <span className="text-indigo-400">Governance</span></h2>
                    <div className="px-4 py-2 bg-indigo-500/10 rounded-xl text-xs font-bold text-indigo-400 border border-indigo-500/20">
                      Voting Power: {user.role === 'professor' || user.role === 'institution' ? 'High' : 'Standard'}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    Participate in the democratic evolution of the Glacier network. Your role as a {user.role} grants you specific voting rights on platform policies and research ethics.
                  </p>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">Active Proposals</h4>
                    {[
                      { title: 'Standardizing AI Ethics in Climate Research', status: 'Voting', support: '84%' },
                      { title: 'Open Access Mandate for SDG Missions', status: 'Discussion', support: '92%' },
                    ].map(prop => (
                      <div key={prop.title} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                        <div className="space-y-1">
                          <div className="text-sm font-bold">{prop.title}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-widest">{prop.status} • {prop.support} Support</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Zap} label="Reputation" value="450" color="text-yellow-400" />
        <StatCard icon={GraduationCap} label="Study Hours" value="128h" color="text-indigo-400" />
        <StatCard icon={Award} label="Badges" value="12" color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">AI Learning Feed</h3>
          <div className="space-y-4">
            {[
              { title: 'Quantum Mechanics for Beginners', type: 'Article', time: '2h ago' },
              { title: 'Sustainable Energy Flashcards', type: 'Quiz', time: '5h ago' },
              { title: 'Introduction to AI Ethics', type: 'Discussion', time: '1d ago' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">{item.title}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">{item.type} • {item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">Mentorship</h3>
          <p className="text-sm text-white/50">Connect with professors and researchers to guide your journey.</p>
          <div className="space-y-4">
            <button className="w-full py-4 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Find a Mentor
            </button>
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400">Mentorship Active</div>
                <div className="text-[10px] text-white/60">Dr. Elena Vance is your current mentor.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResearcherDashboard({ user, pubs }: { user: User, pubs: Publication[] }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Microscope} label="Papers" value={pubs.length.toString()} color="text-indigo-400" />
        <StatCard icon={Code} label="Sandbox Runs" value="24" color="text-emerald-400" />
        <StatCard icon={Users} label="Collaborations" value="8" color="text-pink-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">Nexus Sandbox</h3>
          <div className="aspect-video bg-black/40 rounded-3xl border border-white/5 p-6 font-mono text-xs text-emerald-400/80 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3" /> research_model.py
              </div>
              <div className="text-[9px] uppercase tracking-widest text-white/20">Live Environment</div>
            </div>
            <pre><code>{`import glacier_nexus as nexus

def run_simulation():
    data = nexus.fetch_sdg_data('climate')
    results = nexus.analyze(data)
    return results.visualize()`}</code></pre>
            <div className="absolute bottom-6 right-6">
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all">
                Launch Sandbox
              </button>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">Peer Review Hub</h3>
          <div className="space-y-4">
            {[
              { title: 'Oceanic Microplastics Analysis', status: 'In Review', feedback: '3 Comments' },
              { title: 'AI Governance Framework', status: 'Submitted', feedback: 'Awaiting Review' },
            ].map(item => (
              <div key={item.title} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                <div className="space-y-1">
                  <div className="text-sm font-bold">{item.title}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">{item.status} • {item.feedback}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 transition-colors" />
              </div>
            ))}
            <button className="w-full py-4 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all">
              Discover Grants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessorDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={GraduationCap} label="Students" value="42" color="text-indigo-400" />
        <StatCard icon={FileText} label="Courses" value="4" color="text-emerald-400" />
        <StatCard icon={ShieldCheck} label="Moderation" value="Active" color="text-pink-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">Course Management</h3>
          <div className="space-y-4">
            {[
              { title: 'Advanced Particle Physics', students: 12, progress: '65%' },
              { title: 'Ethics in Modern Science', students: 30, progress: '40%' },
            ].map(course => (
              <div key={course.title} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold">{course.title}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">{course.students} Students</div>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: course.progress }} />
                </div>
              </div>
            ))}
            <button className="w-full py-4 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create New Course
            </button>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">Student Analytics</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-4">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-grow bg-indigo-500/20 rounded-t-lg relative group">
                <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }} />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          <p className="text-[10px] text-white/40 text-center">Overall student engagement is up 12% this week.</p>
        </div>
      </div>
    </div>
  );
}

function InstitutionDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Building} label="Members" value="1.2K" color="text-indigo-400" />
        <StatCard icon={Target} label="Campaigns" value="12" color="text-emerald-400" />
        <StatCard icon={ShieldCheck} label="Compliance" value="98%" color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">Campaign Dashboard</h3>
          <div className="space-y-4">
            {[
              { title: 'Global Reforestation Initiative', goal: '$1M', current: '$840K', status: 'Active' },
              { title: 'Clean Water for All', goal: '$500K', current: '$490K', status: 'Closing' },
            ].map(camp => (
              <div key={camp.title} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold">{camp.title}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">{camp.status}</div>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-indigo-400">{camp.current}</span>
                  <span className="text-white/30">Goal: {camp.goal}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
            ))}
            <button className="w-full py-4 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all">
              Launch New Campaign
            </button>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-display font-bold">Compliance & Ethics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400">Ethical Alignment: High</div>
                <div className="text-[10px] text-white/60">Your institution meets all Glacier network standards.</div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Member Activity</span>
                <span className="text-emerald-400">Normal</span>
              </div>
              <div className="text-[10px] text-white/40">No flagged content or ethical violations detected.</div>
            </div>
            <button className="w-full py-4 glass rounded-2xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> Manage Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="glass p-6 rounded-3xl space-y-2 group hover:border-white/20 transition-all">
      <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-white/30">{label}</div>
        <div className="text-2xl font-display font-bold">{value}</div>
      </div>
    </div>
  );
}
