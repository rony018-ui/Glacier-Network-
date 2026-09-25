import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ArrowRight, 
  Mail, 
  Lock, 
  User as UserIcon, 
  GraduationCap, 
  Microscope, 
  Building, 
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

interface AuthProps {
  onLogin: (user: any) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const roles: { id: UserRole; label: string; icon: any; desc: string }[] = [
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Learning & Mentorship' },
    { id: 'independent', label: 'Individual', icon: UserIcon, desc: 'Independent Research' },
    { id: 'researcher', label: 'Researcher', icon: Microscope, desc: 'Institutional Research' },
    { id: 'professor', label: 'Professor', icon: ShieldCheck, desc: 'Teaching & Moderation' },
    { id: 'institution', label: 'University/Org', icon: Building, desc: 'Campaigns & Compliance' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: 'u' + Math.random().toString(36).substr(2, 9),
        name: isLogin ? 'Dr. Elena Vance' : 'New User',
        role: isLogin ? 'professor' : selectedRole,
        institution: 'Glacier Global Network',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        impactPoints: 0
      };
      onLogin(mockUser);
      setIsLoading(false);
      navigate('/pofile');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050505] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 glass rounded-[3rem] overflow-hidden relative z-10"
      >
        {/* Left Side: Visual/Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <TrendingUp className="w-8 h-8" />
              <span className="font-display font-bold text-2xl tracking-tight">Glacier</span>
            </div>
            
            <h2 className="text-4xl font-display font-bold leading-tight mb-6">
              The Future of <br />
              <span className="text-indigo-200">Global Impact</span> <br />
              Starts Here.
            </h2>
            
            <div className="space-y-6">
              {[
                "AI-Powered Research Insights",
                "Global Collaboration Network",
                "Verified Institutional Credentials",
                "Decentralized Governance"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-indigo-100">
                  <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10">
            <p className="text-xs text-indigo-200/60 leading-relaxed">
              Join 12,000+ researchers and institutions shaping the next era of scientific discovery and social impact.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-12 space-y-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-display font-bold">
              {isLogin ? 'Welcome Back' : 'Create Pofile'}
            </h3>
            <p className="text-white/40 text-sm">
              {isLogin ? 'Enter your credentials to access the Nexus.' : 'Join the global impact ecosystem today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30">Select Your Role</label>
                  <div className="grid grid-cols-1 gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                          selectedRole === role.id 
                            ? "bg-indigo-600/10 border-indigo-500 text-white" 
                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          selectedRole === role.id ? "bg-indigo-500 text-white" : "bg-white/5"
                        )}>
                          <role.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{role.label}</div>
                          <div className="text-[10px] opacity-60">{role.desc}</div>
                        </div>
                        {selectedRole === role.id && (
                          <CheckCircle2 className="w-4 h-4 ml-auto text-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Pofile'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#111] px-3 text-[10px] uppercase tracking-widest text-white/40 font-mono absolute">
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const { googleSignIn } = await import('../lib/firebase');
                  const result = await googleSignIn();
                  if (result?.user) {
                    const fbUser = {
                      id: result.user.uid,
                      name: result.user.displayName || 'Dr. Elena Vance',
                      email: result.user.email || undefined,
                      role: selectedRole || 'professor',
                      institution: 'Glacier Global Network',
                      avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.uid}`,
                      impactPoints: 1250
                    };
                    onLogin(fbUser);
                    navigate('/pofile');
                  }
                } catch (err) {
                  console.error('Firebase Google Auth error:', err);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-3 shadow-md group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.19 3.645-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.21v3.13C3.25 21.46 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.21C.44 8.13 0 9.99 0 12s.44 3.87 1.21 5.41l4.11-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.54 1.21 6.59l4.11 3.13c.94-2.82 3.58-4.97 6.68-4.97z"/>
              </svg>
              <span>Sign in with Google Workspace</span>
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
