import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  BookOpen, 
  MessageSquare, 
  Cpu, 
  Users, 
  Globe, 
  Zap, 
  Shield, 
  Sparkles, 
  Search, 
  TrendingUp,
  Target,
  BarChart3,
  Rocket,
  Activity,
  Layers,
  Fingerprint,
  Network
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const MOCK_SPARKLINE_DATA = [
  { v: 10 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 }
];

function Sparkline({ color }: { color: string }) {
  return (
    <div className="h-8 w-16 opacity-50 group-hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MOCK_SPARKLINE_DATA}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState({
    totalFunding: 0,
    activeCampaigns: 0,
    verifiedInstitutions: 0,
    publishedResearch: 0
  });

  useEffect(() => {
    fetch('/api/impact/stats')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch stats'))
      .then(setStats)
      .catch(err => console.error('Home stats fetch error:', err));
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 max-w-7xl w-full text-center space-y-16 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-indigo-500/20 text-[11px] font-bold tracking-[0.3em] uppercase text-indigo-400 mb-4 shadow-2xl shadow-indigo-500/10">
              <Globe className="w-4 h-4 animate-spin-slow" /> Global Impact Gateway
            </div>
            <h1 className="text-7xl md:text-[11rem] font-display font-bold tracking-tighter leading-[0.75] mb-8">
              GLACIER<br />
              <span className="text-gradient">NETWORK</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/40 max-w-4xl mx-auto font-light leading-relaxed tracking-tight">
              The world's first <span className="text-white">decentralized command network</span> for global research, institutional authority, and real-time impact tracking.
            </p>
          </motion.div>

          {/* AI Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-3xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center glass rounded-3xl p-3 border-white/10 shadow-2xl">
              <Search className="ml-6 text-white/30 w-6 h-6" />
              <input 
                type="text" 
                placeholder="Ask Oracle to find research, missions, or nodes..."
                className="w-full bg-transparent border-none py-5 px-6 focus:outline-none text-xl placeholder:text-white/20 font-light"
              />
              <button className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-base hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-95">
                Execute
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-10 pt-4"
          >
            <Link to="/campaigns" className="group flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all hover:scale-105 shadow-2xl shadow-indigo-600/30">
              Launch Mission <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link to="/publications" className="px-10 py-5 glass rounded-2xl font-bold hover:bg-white/10 transition-all border-white/5">
              Access Engine
            </Link>
          </motion.div>
        </div>

        {/* Live Metrics Overlay - Now in flow */}
        <div className="relative z-10 w-full max-w-6xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Funding', value: `$${(stats.totalFunding / 1000000).toFixed(1)}M`, icon: TrendingUp, color: '#10b981', tailwindColor: 'text-emerald-400' },
              { label: 'Active Missions', value: stats.activeCampaigns, icon: Target, color: '#6366f1', tailwindColor: 'text-indigo-400' },
              { label: 'Verified Nodes', value: stats.verifiedInstitutions, icon: Shield, color: '#a855f7', tailwindColor: 'text-purple-400' },
              { label: 'Research Output', value: stats.publishedResearch, icon: BookOpen, color: '#f59e0b', tailwindColor: 'text-amber-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="glass p-8 rounded-3xl border-white/5 flex flex-col items-center text-center space-y-2 group hover:bg-white/5 transition-colors cursor-default"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <stat.icon className={cn("w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity", stat.tailwindColor)} />
                  <Sparkline color={stat.color} />
                </div>
                <div className="text-3xl font-display font-bold tracking-tight">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Institutional Ticker */}
      <section className="border-y border-white/5 py-10 overflow-hidden bg-black/20">
        <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
          {[
            'Black Mesa University', 'Aperture Science Institute', 'Weyland-Yutani Research', 
            'Cyberdyne Systems', 'Tyrell Corp Academy', 'Stark Industries Lab',
            'Black Mesa University', 'Aperture Science Institute', 'Weyland-Yutani Research', 
            'Cyberdyne Systems', 'Tyrell Corp Academy', 'Stark Industries Lab'
          ].map((name, i) => (
            <div key={i} className="flex items-center gap-3 text-white/20 font-display font-bold text-sm tracking-widest uppercase">
              <Shield className="w-4 h-4 text-indigo-500/30" />
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Flow Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
          
          {[
            { 
              step: '01', 
              title: 'Research Engine', 
              desc: 'Institutional nodes publish verified scientific data and breakthroughs.',
              icon: Cpu,
              color: 'text-amber-400',
              bg: 'bg-amber-400/10'
            },
            { 
              step: '02', 
              title: 'Mission Launch', 
              desc: 'Research is translated into actionable global impact campaigns.',
              icon: Rocket,
              color: 'text-indigo-400',
              bg: 'bg-indigo-400/10'
            },
            { 
              step: '03', 
              title: 'Impact Verification', 
              desc: 'Real-time tracking and verification of results via decentralized nodes.',
              icon: Activity,
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10'
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 glass p-10 rounded-[3rem] border-white/5 space-y-6 group hover:bg-white/5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", item.bg)}>
                  <item.icon className={cn("w-8 h-8", item.color)} />
                </div>
                <div className="text-4xl font-display font-bold text-white/5">{item.step}</div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-display font-bold">{item.title}</h3>
                <p className="text-white/40 font-light leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Control Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/10">
              Operational Status: Active
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight">MISSION <span className="text-indigo-400">CONTROL</span></h2>
            <p className="text-white/40 max-w-2xl text-lg font-light leading-relaxed">
              Real-time monitoring of global impact campaigns. Track funding velocity, milestone completion, and community-proposed solutions.
            </p>
          </div>
          <Link to="/campaigns" className="group text-indigo-400 font-bold flex items-center gap-3 hover:gap-5 transition-all text-lg">
            View All Missions <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Mission */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="lg:col-span-2 glass p-12 rounded-[3.5rem] border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-indigo-500/10 transition-all" />
            <div className="space-y-10 relative z-10">
              <div className="flex items-center justify-between">
                <div className="px-5 py-2 rounded-full bg-indigo-500/20 text-[11px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
                  Environment • SDG 14
                </div>
                <div className="text-xs font-mono text-white/20 tracking-widest">NODE_ID: GL-772</div>
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-display font-bold">Ocean Plastic Filtration</h3>
                <p className="text-white/50 text-xl font-light leading-relaxed max-w-2xl">
                  Deploying autonomous drone swarms to filter microplastics from the Great Pacific Garbage Patch using bio-inspired filtration systems.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between text-base font-bold">
                  <span className="text-white/60">Funding Progress</span>
                  <span className="text-indigo-400">65% Completed</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] animate-shimmer rounded-full"
                  />
                </div>
                <div className="flex justify-between text-sm font-mono text-white/30">
                  <span>RAISED: $325,000</span>
                  <span>TARGET: $500,000</span>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {[1,2,3,4,5].map(i => (
                      <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} className="w-12 h-12 rounded-full border-4 border-black" referrerPolicy="no-referrer" />
                    ))}
                  </div>
                  <div className="text-sm font-bold text-white/40">+1.2k contributors</div>
                </div>
                <Link to="/campaigns/c1" className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Enter Mission Dashboard
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Side Cards */}
          <div className="space-y-8">
            <div className="glass p-10 rounded-[3rem] space-y-8 border-white/5 group hover:bg-white/5 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="text-purple-400 w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-display font-bold">Impact Analytics</h4>
                <p className="text-white/40 font-light leading-relaxed">
                  Real-time visualization of SDG contributions and institutional funding transparency.
                </p>
              </div>
              <Link to="/impact" className="inline-flex items-center gap-2 text-purple-400 font-bold text-sm hover:gap-4 transition-all">
                Explore Data <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="glass p-10 rounded-[3rem] space-y-8 border-white/5 group hover:bg-white/5 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="text-emerald-400 w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-display font-bold">Verified Trust</h4>
                <p className="text-white/40 font-light leading-relaxed">
                  Every transaction and research paper is verified by a network of 140+ institutional nodes.
                </p>
              </div>
              <Link to="/institutions" className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm hover:gap-4 transition-all">
                View Network <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Engine Section */}
      <section className="bg-white/5 py-32 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-[10px] font-bold uppercase tracking-widest text-amber-400 border border-amber-500/10">
              Knowledge Engine
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight">
              SCIENTIFIC<br />
              <span className="text-amber-400">AUTHORITY</span>
            </h2>
            <p className="text-xl text-white/50 font-light leading-relaxed">
              Access the world's most rigorous research library. Peer-reviewed by verified institutional nodes and linked directly to global impact missions.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="text-3xl font-display font-bold">12k+</div>
                <div className="text-xs uppercase tracking-widest text-white/30 font-bold">Publications</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-display font-bold">450k</div>
                <div className="text-xs uppercase tracking-widest text-white/30 font-bold">Citations</div>
              </div>
            </div>
            <Link to="/publications" className="inline-flex items-center gap-4 px-10 py-5 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all hover:scale-105">
              Enter Research Engine <BookOpen className="w-6 h-6" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-amber-500/10 blur-[100px] rounded-full" />
            <div className="relative glass p-8 rounded-[3rem] border-white/10 space-y-6">
              {[
                { title: 'Quantum Carbon Sequestration', author: 'Dr. Sarah Chen', node: 'MIT Node', impact: 'High' },
                { title: 'Bio-Synthetic Coral Growth', author: 'Prof. James Wilson', node: 'Oxford Node', impact: 'Critical' },
                { title: 'Decentralized Water Purification', author: 'Elena Vance', node: 'Black Mesa', impact: 'Medium' },
              ].map((paper, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg group-hover:text-amber-400 transition-colors">{paper.title}</h4>
                    <div className="px-3 py-1 rounded-md bg-amber-500/20 text-[10px] font-bold text-amber-400 uppercase">{paper.impact}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/30 font-medium">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {paper.author}</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {paper.node}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SDG Focus Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">IMPACT <span className="text-indigo-400">VECTORS</span></h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">The platform is optimized for 12 of the 17 United Nations Sustainable Development Goals.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { id: 1, label: 'No Poverty', color: 'bg-red-500' },
            { id: 2, label: 'Zero Hunger', color: 'bg-amber-600' },
            { id: 3, label: 'Good Health', color: 'bg-emerald-500' },
            { id: 4, label: 'Quality Education', color: 'bg-red-700' },
            { id: 6, label: 'Clean Water', color: 'bg-sky-400' },
            { id: 7, label: 'Clean Energy', color: 'bg-yellow-400' },
            { id: 9, label: 'Innovation', color: 'bg-orange-600' },
            { id: 11, label: 'Sustainable Cities', color: 'bg-orange-500' },
            { id: 13, label: 'Climate Action', color: 'bg-emerald-700' },
            { id: 14, label: 'Life Below Water', color: 'bg-blue-600' },
            { id: 15, label: 'Life on Land', color: 'bg-lime-600' },
            { id: 17, label: 'Partnerships', color: 'bg-indigo-900' },
          ].map((sdg) => (
            <motion.div 
              key={sdg.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg", sdg.color)}>
                {sdg.id}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold text-center group-hover:text-white transition-colors">
                {sdg.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Oracle & Community Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-indigo-600 to-purple-700 p-16 text-white space-y-10 group"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10 space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-5xl font-display font-bold tracking-tight">GLACIER <span className="text-indigo-200">ORACLE</span></h2>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                Our neural interface for research analysis. Ask complex questions, predict mission outcomes, and discover cross-disciplinary solutions.
              </p>
              <Link to="/ai-board" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all hover:scale-105 shadow-2xl">
                Consult the Oracle <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            
            {/* Abstract AI Visual */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
          </motion.div>

          <div className="glass rounded-[4rem] p-16 border-white/10 space-y-10 flex flex-col justify-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-5xl font-display font-bold tracking-tight">GLOBAL <span className="text-indigo-400">FORUM</span></h2>
            <p className="text-xl text-white/40 font-light leading-relaxed">
              Join the conversation. Propose solutions to global missions, earn Impact Points (IP), and collaborate with world-class researchers.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/discussions" className="inline-flex items-center gap-4 px-10 py-5 glass border-indigo-500/20 text-indigo-400 font-bold rounded-2xl hover:bg-indigo-500/10 transition-all">
                Join Community <Users className="w-6 h-6" />
              </Link>
              <div className="text-sm font-bold text-white/20">
                <span className="text-white">4.2k</span> active researchers online
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Network CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[5rem] bg-black border border-white/10 p-16 md:p-32 text-center space-y-12">
          {/* Animated Map Background */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat bg-contain" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 border border-white/10">
              Network Infrastructure
            </div>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight">THE <span className="text-indigo-400">COMMAND</span> NETWORK</h2>
            <p className="text-2xl text-white/40 max-w-3xl mx-auto font-light leading-relaxed">
              Connect with 140+ verified universities and NGOs across 6 continents. The infrastructure for global impact.
            </p>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-8">
            <Link to="/institutions" className="px-12 py-6 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-2xl text-lg">
              Explore Institutional Map
            </Link>
            <div className="flex items-center gap-4 text-white/30 font-mono text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM_STATUS: OPTIMAL
            </div>
          </div>
          
          <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
        </div>
      </section>
    </div>
  );
}
