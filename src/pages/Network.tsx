import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Users, 
  BookOpen, 
  Globe, 
  ArrowRight, 
  Search, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  UserPlus, 
  MessageSquare, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Award, 
  Filter,
  ChevronRight,
  Zap,
  CheckCircle2,
  MoreVertical,
  Share2,
  Heart,
  History,
  FileText,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Institution, NetworkProfile, NetworkGroup, UserRole } from '../types';
import { cn } from '../lib/utils';

type NetworkTab = 'nodes' | 'people' | 'communities';

export default function Network() {
  const [activeTab, setActiveTab] = useState<NetworkTab>('nodes');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [people, setPeople] = useState<NetworkProfile[]>([]);
  const [groups, setGroups] = useState<NetworkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiMatchOpen, setAiMatchOpen] = useState(false);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instRes] = await Promise.all([
          fetch('/api/institutions'),
        ]);

        if (instRes.ok) {
          const instData = await instRes.json();
          setInstitutions(instData);
        }

        // Mock people data with mission history and publications
        setPeople([
          {
            id: 'p1', name: 'Dr. Sarah Chen', role: 'researcher', institution: 'MIT Node', 
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', impactPoints: 2450,
            expertise: ['Quantum Computing', 'AI Ethics'], location: 'Cambridge, MA',
            collaborationCount: 12, paperCount: 45, sdgContributions: ['SDG 9', 'SDG 4'], isVerified: true,
            recentActivity: 'Published "Neural Ethics in Decentralized Systems"',
            missionHistory: ['Quantum Leap 2025', 'Ethical AI Initiative'],
            publications: ['Neural Ethics v1', 'Quantum Decryption Methods']
          },
          {
            id: 'p2', name: 'Marcus Thorne', role: 'independent', 
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', impactPoints: 1800,
            expertise: ['Marine Biology', 'Ocean Cleanup'], location: 'Lisbon, Portugal',
            collaborationCount: 8, paperCount: 12, sdgContributions: ['SDG 14'], isVerified: true,
            recentActivity: 'Joined Mission "Great Barrier Reef Restoration"',
            missionHistory: ['Ocean Clean 2024', 'Reef Recovery'],
            publications: ['Plastic Migration Patterns', 'Coral Resilience']
          },
          {
            id: 'p3', name: 'Aisha Patel', role: 'student', institution: 'Stanford University',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha', impactPoints: 650,
            expertise: ['Public Health', 'Data Science'], location: 'Palo Alto, CA',
            collaborationCount: 4, paperCount: 2, sdgContributions: ['SDG 3'], isVerified: false,
            recentActivity: 'Completed "Epidemiology 101" milestone',
            missionHistory: ['Health Equity Drive'],
            publications: ['COVID-19 Data Analysis']
          }
        ]);

        // Mock groups data
        setGroups([
          { id: 'g1', name: 'Climate Research Alliance', description: 'Global network of scientists working on carbon sequestration technologies.', memberCount: 1250, category: 'Environment', image: 'https://picsum.photos/seed/climate/800/400', isPrivate: false },
          { id: 'g2', name: 'Decentralized AI Ethics', description: 'Exploring the moral implications of autonomous decentralized agents.', memberCount: 840, category: 'Technology', image: 'https://picsum.photos/seed/ai/800/400', isPrivate: false },
          { id: 'g3', name: 'Public Health Data Node', description: 'Real-time epidemiological data sharing for pandemic prevention.', memberCount: 2100, category: 'Health', image: 'https://picsum.photos/seed/health/800/400', isPrivate: true },
        ]);

      } catch (error) {
        console.error('Error fetching network data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFollow = (id: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredNodes = institutions.filter(i => 
    (i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'All' || i.type.toLowerCase() === selectedCategory.toLowerCase())
  );

  const filteredPeople = people.filter(p => 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'All' || p.role.toLowerCase() === selectedCategory.toLowerCase())
  );

  const filteredGroups = groups.filter(g => 
    (g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === 'All' || g.category.toLowerCase() === selectedCategory.toLowerCase())
  );

  const categories = activeTab === 'nodes' ? ['All', 'University', 'Organization'] :
                     activeTab === 'people' ? ['All', 'Researcher', 'Student', 'Independent'] :
                     ['All', 'Environment', 'Technology', 'Health'];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/10">
            <Shield className="w-3 h-3" /> Global Network
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">Connect & <span className="text-indigo-400">Collaborate</span></h1>
          <p className="text-white/50 max-w-xl">The decentralized backbone of scientific authority, connecting institutions, researchers, and students worldwide.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setAiMatchOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold transition-all shadow-xl shadow-indigo-600/20 group"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" /> AI Matchmaking
          </button>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20" 
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex border-b border-white/5">
          {(['nodes', 'people', 'communities'] as NetworkTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedCategory('All');
              }}
              className={cn(
                "px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative",
                activeTab === tab ? "text-indigo-400" : "text-white/40 hover:text-white"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-96 glass rounded-[3rem] animate-pulse" />)}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'nodes' && (
            <motion.div 
              key="nodes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredNodes.map((inst, idx) => (
                <motion.div
                  key={inst.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group glass rounded-[3rem] overflow-hidden hover:border-white/20 transition-all flex flex-col relative"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img src={inst.banner} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleFollow(inst.id); }}
                        className={cn(
                          "glass p-2 rounded-full transition-all",
                          followedIds.has(inst.id) ? "bg-indigo-600 text-white" : "hover:bg-white/10"
                        )}
                      >
                        <Heart className={cn("w-4 h-4", followedIds.has(inst.id) && "fill-current")} />
                      </button>
                      <div className="glass px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border-white/10 flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-emerald-400" /> {inst.transparencyScore}% Trust
                      </div>
                    </div>
                  </div>

                  <div className="p-8 flex-grow space-y-6 relative -mt-12">
                    <div className="flex items-end gap-4">
                      <div className="w-20 h-20 rounded-2xl glass p-3 border-white/10 shadow-2xl">
                        <img src={inst.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="pb-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">{inst.type}</div>
                        <h3 className="text-2xl font-display font-bold group-hover:text-white transition-colors">{inst.name}</h3>
                      </div>
                    </div>

                    <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">{inst.description}</p>
                    
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {inst.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="text-xl font-display font-bold">{inst.memberCount}</div>
                        <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Researchers</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-display font-bold">{inst.publicationCount}</div>
                        <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Papers</div>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/institutions/${inst.id}`}
                    className="p-6 bg-white/5 hover:bg-white/10 transition-colors text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Access Node <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'people' && (
            <motion.div 
              key="people"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPeople.map((person, idx) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group glass p-8 rounded-[3rem] space-y-6 hover:border-white/20 transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <img src={person.avatar} alt={person.name} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                      {person.isVerified && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 border-4 border-[#050505] flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40 border border-white/5">
                        {person.role}
                      </div>
                      <div className="flex items-center gap-1 text-indigo-400">
                        <Zap className="w-3 h-3" />
                        <span className="text-xs font-bold">{person.impactPoints}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-display font-bold">{person.name}</h3>
                      <button 
                        onClick={() => toggleFollow(person.id)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          followedIds.has(person.id) ? "bg-indigo-600 text-white" : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        {followedIds.has(person.id) ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Building2 className="w-3 h-3" /> {person.institution || 'Independent Researcher'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <MapPin className="w-3 h-3" /> {person.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {person.expertise.map(exp => (
                      <span key={exp} className="px-2 py-1 rounded-md bg-white/5 text-[9px] font-bold text-white/60 border border-white/5">
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
                    <div className="text-center">
                      <div className="text-lg font-bold">{person.collaborationCount}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Collabs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{person.paperCount}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Papers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{person.sdgContributions.length}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">SDGs</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {person.missionHistory && person.missionHistory.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                          <History className="w-3 h-3" /> Mission History
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {person.missionHistory.map(m => (
                            <span key={m} className="text-[9px] text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {person.publications && person.publications.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[8px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                          <FileText className="w-3 h-3" /> Top Publications
                        </div>
                        <div className="space-y-1">
                          {person.publications.map(p => (
                            <div key={p} className="text-[9px] text-indigo-400/70 truncate hover:text-indigo-400 cursor-pointer">
                              • {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="flex-grow py-3 bg-white text-black rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" /> Collaborate
                    </button>
                    <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'communities' && (
            <motion.div 
              key="communities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredGroups.map((group, idx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group glass rounded-[3rem] overflow-hidden hover:border-white/20 transition-all flex flex-col md:flex-row"
                >
                  <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                    <img src={group.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-t" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-600 text-[9px] font-bold uppercase tracking-widest text-white">
                        {group.category}
                      </span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-display font-bold">{group.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                          <Users className="w-4 h-4" /> {group.memberCount.toLocaleString()} Members
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleFollow(group.id)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            followedIds.has(group.id) ? "bg-indigo-600 text-white" : "bg-white/5 hover:bg-white/10"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", followedIds.has(group.id) && "fill-current")} />
                        </button>
                        {group.isPrivate && (
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            <Shield className="w-4 h-4 text-white/30" />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                          <img 
                            key={i}
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} 
                            className="w-8 h-8 rounded-full border-2 border-[#050505]" 
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#050505] flex items-center justify-center text-[10px] font-bold text-white/40">
                          +12
                        </div>
                      </div>
                      <button className="px-6 py-2.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-indigo-600/20">
                        Join Community
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* AI Matchmaking Modal */}
      <AnimatePresence>
        {aiMatchOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiMatchOpen(false)}
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
                    <h3 className="text-2xl font-display font-bold">AI Matchmaking</h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Neural Network Recommendations</p>
                  </div>
                </div>
                <button onClick={() => setAiMatchOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MoreVertical className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-400">
                    <Target className="w-4 h-4" /> Recommended for You
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Dr. Sarah Chen', reason: 'Shared interest in AI Ethics & SDG 9', role: 'Researcher' },
                      { name: 'Climate Research Alliance', reason: 'Matches your recent publications on Carbon Capture', role: 'Community' }
                    ].map((match, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                            {match.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{match.name}</div>
                            <div className="text-[10px] text-white/40">{match.reason}</div>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Network Reach</div>
                    <div className="text-2xl font-display font-bold">12,450</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12% this month
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Potential Collabs</div>
                    <div className="text-2xl font-display font-bold">42</div>
                    <div className="text-[10px] text-indigo-400">Based on your expertise</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button className="flex-grow px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all">
                  Optimize My Profile
                </button>
                <button className="px-8 py-4 glass rounded-2xl font-bold hover:bg-white/10 transition-all">
                  View Analytics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
