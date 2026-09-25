/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Cpu, 
  Plus, 
  Search, 
  User as UserIcon,
  TrendingUp,
  Globe,
  ArrowRight,
  Menu,
  X,
  Building2,
  Rocket,
  Activity,
  Shield,
  Target,
  Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Home from './pages/Home';
import Engine from './pages/Engine';
import Nexus from './pages/Nexus';
import Pofile from './pages/Pofile';
import AIChat from './pages/AIChat';
import Network from './pages/Network';
import InstitutionProfile from './pages/InstitutionProfile';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Impact from './pages/Impact';
import Auth from './pages/Auth';
import GlacierAtlasMap from './components/GlacierAtlasMap';
import GoogleWorkspaceHub from './components/GoogleWorkspaceHub';
import { User } from './types';

import { cn } from './lib/utils';

// Mock Auth State
const MOCK_USER: User = {
  id: 'u1',
  name: 'Dr. Elena Vance',
  role: 'professor',
  institution: 'Black Mesa University',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  impactPoints: 1250
};

function Navbar({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Gateway', icon: Globe },
    { path: '/campaigns', label: 'Missions', icon: Target },
    { path: '/institutions', label: 'Network', icon: Shield },
    { path: '/atlas', label: 'Atlas (Maps)', icon: Globe },
    { path: '/workspace', label: 'Workspace', icon: BookOpen },
    { path: '/engine', label: 'Engine', icon: Cpu },
    { path: '/impact', label: 'Impact', icon: Activity },
    { path: '/discussions', label: 'Nexus', icon: MessageSquare },
    { path: '/ai-board', label: 'Oracle', icon: Sparkles },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Glacier</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-400 whitespace-nowrap",
                location.pathname === item.path ? "text-indigo-400" : "text-white/70"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/pofile" className="flex items-center gap-3 glass px-4 py-2 rounded-full hover:bg-white/10 transition-colors shrink-0">
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full shrink-0" referrerPolicy="no-referrer" />
                <span className="text-sm font-medium whitespace-nowrap">Pofile</span>
              </Link>
              <button onClick={onLogout} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-medium"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link
                to="/pofile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 pt-4 border-t border-white/10"
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                <span>Pofile</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 pt-4 border-t border-white/10 text-indigo-400"
              >
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="/engine" element={<Engine />} />
            <Route path="/atlas" element={<div className="max-w-7xl mx-auto px-6 pb-24 pt-4"><GlacierAtlasMap /></div>} />
            <Route path="/workspace" element={<div className="max-w-7xl mx-auto px-6 pb-24 pt-4"><GoogleWorkspaceHub currentUser={user} /></div>} />
            <Route path="/discussions" element={<Nexus user={user} />} />
            <Route path="/pofile" element={user ? <Pofile user={user} /> : <Auth onLogin={handleLogin} />} />
            <Route path="/ai-board" element={<AIChat />} />
            <Route path="/institutions" element={<Network />} />
            <Route path="/institutions/:id" element={<InstitutionProfile />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/impact" element={<Impact />} />
          </Routes>
        </main>
        
        <footer className="bg-black border-t border-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-indigo-500 w-6 h-6" />
                <span className="font-display font-bold text-xl">Glacier</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                The global impact ecosystem for scientific research, institutional authority, and community-driven solutions.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/engine">Research Library</Link></li>
                <li><Link to="/discussions">Glacier Nexus</Link></li>
                <li><Link to="/ai-board">AI Insights</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>Professors</li>
                <li>Independent Researchers</li>
                <li>Students</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-white/30 text-xs">
            © 2026 Glacier. Built for the future of global impact.
          </div>
        </footer>
      </div>
    </Router>
  );
}
