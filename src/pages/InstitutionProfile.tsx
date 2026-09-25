import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Users, 
  BookOpen, 
  Globe, 
  ShieldCheck, 
  ExternalLink,
  Award,
  TrendingUp,
  Search
} from 'lucide-react';
import { Institution, User, Publication } from '../types';
import { cn } from '../lib/utils';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function InstitutionProfile() {
  const { id } = useParams();
  const [inst, setInst] = useState<Institution | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'research' | 'impact' | 'transparency'>('research');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes, membersRes, pubsRes] = await Promise.all([
          fetch(`/api/institutions/${id}`),
          fetch(`/api/institutions/${id}/members`),
          fetch('/api/publications')
        ]);
        
        if (instRes.ok) setInst(await instRes.json());
        
        let membersData: User[] = [];
        if (membersRes.ok) {
          membersData = await membersRes.json();
          setMembers(membersData);
        }
        
        if (pubsRes.ok) {
          const allPubs = await pubsRes.json();
          const memberIds = new Set(membersData.map((m: User) => m.id));
          setPubs(allPubs.filter((p: Publication) => memberIds.has(p.userId)));
        }
      } catch (err) {
        console.error('Error fetching institution data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !inst) return <div className="min-h-screen flex items-center justify-center">Accessing Node Data...</div>;

  const sdgData = [
    { subject: 'Environment', A: 120, fullMark: 150 },
    { subject: 'Health', A: 98, fullMark: 150 },
    { subject: 'Energy', A: 86, fullMark: 150 },
    { subject: 'Education', A: 99, fullMark: 150 },
    { subject: 'Tech', A: 85, fullMark: 150 },
    { subject: 'Equality', A: 65, fullMark: 150 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
      {/* Header */}
      <div className="relative">
        <div className="h-[400px] rounded-[4rem] overflow-hidden border border-white/10">
          <img src={inst.banner} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
        </div>

        <div className="absolute -bottom-16 left-12 flex flex-col md:flex-row items-end gap-10">
          <div className="w-48 h-48 rounded-[2.5rem] glass p-6 shadow-2xl border-white/20">
            <img src={inst.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <div className="pb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
                Verified Node
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> {inst.transparencyScore}% Transparency Score
              </div>
            </div>
            <h1 className="text-6xl font-display font-bold tracking-tight">{inst.name}</h1>
            <div className="flex flex-wrap items-center gap-8 text-white/40 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {inst.location}</span>
              <a href={inst.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                <Globe className="w-4 h-4" /> {inst.website.replace('https://', '')} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-32 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="space-y-8">
          <div className="glass p-10 rounded-[3rem] space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold">Impact Dashboard</h3>
              <p className="text-white/50 text-sm leading-relaxed">{inst.description}</p>
            </div>
            
            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <div className="text-3xl font-display font-bold">{members.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Researchers</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-display font-bold">{pubs.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Publications</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">SDG Contribution Radar</h4>
              <div className="h-64 -mx-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sdgData}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar
                      name="Institution"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] space-y-8">
            <h3 className="text-xl font-display font-bold">Top Researchers</h3>
            <div className="space-y-6">
              {members.slice(0, 4).map(member => (
                <Link key={member.id} to={`/pofile`} className="flex items-center gap-4 group">
                  <div className="relative">
                    <img src={member.avatar} alt="" className="w-12 h-12 rounded-2xl border border-white/10" referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-black flex items-center justify-center">
                      <ShieldCheck className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{member.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{member.role}</div>
                  </div>
                  <div className="ml-auto text-[10px] font-mono text-indigo-400/60 font-bold">+{member.impactPoints} IP</div>
                </Link>
              ))}
            </div>
            <button className="w-full py-4 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
              Access Directory
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center gap-10 border-b border-white/5 pb-4">
            {[
              { id: 'research', label: 'Research Engine', icon: BookOpen },
              { id: 'impact', label: 'Impact Analytics', icon: TrendingUp },
              { id: 'transparency', label: 'Transparency Log', icon: ShieldCheck },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 font-bold transition-all pb-4 -mb-[18px] text-sm uppercase tracking-widest",
                  activeTab === tab.id ? "text-indigo-400 border-b-2 border-indigo-400" : "text-white/30 hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'research' && (
              <motion.div 
                key="research"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {pubs.map((pub) => (
                  <motion.div
                    key={pub.id}
                    className="glass p-10 rounded-[3rem] group hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold uppercase tracking-widest text-indigo-400 border border-white/5">
                            DOI: {pub.doi || '10.1038/s41586'}
                          </span>
                          <span className="flex items-center gap-1 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            <Award className="w-3 h-3" /> {pub.citations} Citations
                          </span>
                        </div>
                        <h3 className="text-2xl font-display font-bold group-hover:text-indigo-400 transition-colors leading-tight">{pub.title}</h3>
                        <div className="text-xs text-white/40 font-bold uppercase tracking-widest">By {pub.authorName} • {new Date(pub.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm line-clamp-3 mb-8 leading-relaxed">{pub.abstract}</p>
                    <div className="flex flex-wrap gap-2">
                      {pub.tags?.split(',').map(tag => (
                        <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 border border-white/5">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
                {pubs.length === 0 && (
                  <div className="text-center py-32 glass rounded-[3rem] border-dashed">
                    <TrendingUp className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/30 font-display text-xl">No research output recorded for this node.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'impact' && (
              <motion.div 
                key="impact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass p-10 rounded-[3rem] space-y-6">
                    <h4 className="text-xl font-display font-bold">Funding Analytics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Total Grants Managed</span>
                        <span className="font-bold">$12.4M</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[75%]" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Campaign Success Rate</span>
                        <span className="font-bold text-emerald-400">92%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[92%]" />
                      </div>
                    </div>
                  </div>
                  <div className="glass p-10 rounded-[3rem] space-y-6">
                    <h4 className="text-xl font-display font-bold">Global Reach</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Partner Institutions</span>
                        <span className="font-bold">42</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Active Campaigns</span>
                        <span className="font-bold">18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">SDGs Impacted</span>
                        <span className="font-bold">12 / 17</span>
                      </div>
                    </div>
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
