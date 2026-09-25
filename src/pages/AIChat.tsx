import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Send, Sparkles, Bot, User as UserIcon, Zap, Globe, MessageSquare, BookOpen, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Welcome to the Glacier AI Oracle. I am your neural interface for global impact. I can help you analyze research nodes, predict campaign outcomes, or brainstorm collaborative solutions for planetary challenges. What mission are we tracking today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const model = "gemini-3-flash-preview";
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ text: input }]
          }
        ],
        config: {
          systemInstruction: "You are the Glacier AI Oracle, a highly advanced command network assistant. You help institutions, researchers, and community members by providing deep insights into global impact missions, predicting research feasibility, and suggesting collaborative solutions for planetary problems (climate, energy, health). You are part of the Glacier ecosystem. Be professional, futuristic, and highly analytical. Use markdown for formatting."
        }
      });

      const aiMessage: Message = {
        role: 'ai',
        content: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I encountered an error while connecting to my neural network. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 h-[calc(100vh-10rem)] flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">AI <span className="text-indigo-400">Oracle</span></h1>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Neural Network Active
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-white/60">
            <BrainCircuit className="w-4 h-4 text-purple-400" /> Research Mode
          </div>
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-white/60">
            <Zap className="w-4 h-4 text-yellow-400" /> High Performance
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow glass rounded-[3rem] flex flex-col overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-4xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg",
                msg.role === 'ai' ? "bg-indigo-600" : "bg-white/10"
              )}>
                {msg.role === 'ai' ? <Bot className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-6 rounded-3xl space-y-2",
                msg.role === 'ai' ? "glass-dark border-white/10" : "bg-indigo-600 text-white"
              )}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <div className={cn(
                  "text-[10px] font-mono opacity-40",
                  msg.role === 'user' ? "text-right" : ""
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div className="glass-dark p-6 rounded-3xl flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-black/40 backdrop-blur-md border-t border-white/10 relative z-10">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Ask the Oracle about research, global problems, or collaboration..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:border-indigo-500 transition-all text-lg"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Brainstorm Solutions</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Analyze Papers</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global Impact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
