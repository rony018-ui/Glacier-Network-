import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Radar as RadarIcon,
  Send,
  Bot,
  User as UserIcon,
  RefreshCw,
  Download,
  Share2,
  TrendingUp,
  Maximize2,
  Sliders,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Table,
  Zap,
  HelpCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { User } from '../types';

export interface ChartDataset {
  id: string;
  title: string;
  subtitle: string;
  defaultType: 'bar' | 'area' | 'radar' | 'pie';
  data: any[];
  keys: { key: string; name: string; color: string }[];
  radarKeys?: { key: string; name: string; color: string }[];
  analysisNote: string;
  confidenceScore: number;
}

export interface GroupChatMessage {
  id: string;
  senderType: 'ai' | 'user' | 'collaborator';
  senderName: string;
  senderRole: string;
  avatar?: string;
  content: string;
  timestamp: string;
  chartData?: ChartDataset;
  tags?: string[];
}

const PRESET_CHARTS: Record<string, ChartDataset> = {
  sdg_alignment: {
    id: 'chart-sdg',
    title: 'Mission Impact by SDG Goal (2024-2026)',
    subtitle: 'Comparative analysis of community contributions vs global benchmark',
    defaultType: 'bar',
    data: [
      { name: 'SDG 13 Climate', achieved: 85, target: 100, peerAverage: 62 },
      { name: 'SDG 7 Clean Energy', achieved: 74, target: 80, peerAverage: 55 },
      { name: 'SDG 3 Health', achieved: 68, target: 75, peerAverage: 50 },
      { name: 'SDG 4 Education', achieved: 92, target: 90, peerAverage: 65 },
      { name: 'SDG 9 Industry', achieved: 58, target: 70, peerAverage: 45 },
      { name: 'SDG 14 Oceans', achieved: 81, target: 85, peerAverage: 58 }
    ],
    keys: [
      { key: 'achieved', name: 'Community Realized', color: '#10b981' },
      { key: 'target', name: 'Mission Target', color: '#6366f1' },
      { key: 'peerAverage', name: 'Global Academic Avg', color: '#64748b' }
    ],
    analysisNote: 'SDG 4 (Education) and SDG 13 (Climate Action) exceed international benchmarks by +27%. SDG 9 (Industry Innovation) shows a 12-point shortfall requiring open-hardware tooling.',
    confidenceScore: 96
  },
  carbon_trajectory: {
    id: 'chart-trajectory',
    title: '5-Year Direct Air & Basalt Sequestration Trajectory',
    subtitle: 'Mt CO₂e cumulative permanence projection with accelerated pilot',
    defaultType: 'area',
    data: [
      { year: '2022', baseline: 12, accelerated: 14, verified: 12 },
      { year: '2023', baseline: 28, accelerated: 38, verified: 35 },
      { year: '2024', baseline: 45, accelerated: 72, verified: 68 },
      { year: '2025', baseline: 70, accelerated: 120, verified: 110 },
      { year: '2026', baseline: 105, accelerated: 195, verified: 175 },
      { year: '2027 (Est)', baseline: 150, accelerated: 290, verified: 260 }
    ],
    keys: [
      { key: 'verified', name: 'Audited Permanent Removal', color: '#10b981' },
      { key: 'accelerated', name: 'Accelerated Pod Model', color: '#8b5cf6' },
      { key: 'baseline', name: 'Legacy Institutional Track', color: '#475569' }
    ],
    analysisNote: 'Accelerated pod deployment demonstrates 2.1x scaling velocity compared to legacy university-only initiatives due to independent researcher micro-grants.',
    confidenceScore: 94
  },
  skill_radar: {
    id: 'chart-radar',
    title: 'Cross-Disciplinary Team Competency Distribution',
    subtitle: 'Evaluation across our collaborative research pods',
    defaultType: 'radar',
    data: [
      { subject: 'AI Modeling', podScore: 94, benchmark: 75 },
      { subject: 'Field Sensors', podScore: 88, benchmark: 70 },
      { subject: 'Policy & Law', podScore: 72, benchmark: 80 },
      { subject: 'Data Ethics', podScore: 90, benchmark: 65 },
      { subject: 'Open Hardware', podScore: 68, benchmark: 60 },
      { subject: 'Peer Review', podScore: 86, benchmark: 78 }
    ],
    keys: [],
    radarKeys: [
      { key: 'podScore', name: 'Current Active Pod', color: '#06b6d4' },
      { key: 'benchmark', name: 'Institutional Ideal', color: '#ec4899' }
    ],
    analysisNote: 'Exceptional strength in AI modeling and field telemetry. Recommendation: Invite 2 legal/policy fellows to fortify multilateral compliance.',
    confidenceScore: 92
  },
  funding_breakdown: {
    id: 'chart-funding',
    title: 'Consortium Resource & Grant Allocation',
    subtitle: 'Live disbursement across research domains (Total: $4.2M)',
    defaultType: 'pie',
    data: [
      { name: 'Carbon Tech & Minerals', value: 38, color: '#10b981' },
      { name: 'AI Verification Models', value: 24, color: '#6366f1' },
      { name: 'Field Telemetry & IoT', value: 16, color: '#06b6d4' },
      { name: 'Open Datasets & Storage', value: 12, color: '#f59e0b' },
      { name: 'Fellowships & Mentorship', value: 10, color: '#ec4899' }
    ],
    keys: [{ key: 'value', name: 'Allocation %', color: '#6366f1' }],
    analysisNote: '62% of all capital directly supports open reproducibility and carbon permanence trials, exceeding the 50% threshold for top-tier NGO certification.',
    confidenceScore: 98
  }
};

const INITIAL_MESSAGES: GroupChatMessage[] = [
  {
    id: 'msg-1',
    senderType: 'collaborator',
    senderName: 'Dr. Sarah Chen',
    senderRole: 'Bio-engineering Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'Team, we need a unified chart comparing our Q1 mission impact to global SDG goals before the Friday executive symposium.',
    timestamp: '11:10 AM'
  },
  {
    id: 'msg-2',
    senderType: 'collaborator',
    senderName: 'Alex Rivera',
    senderRole: 'Data Architect',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: 'I pulled the updated metrics from our Engine repository. @ChatGPT, can you generate the Group Chart for our SDG alignment and carbon trajectory?',
    timestamp: '11:12 AM'
  },
  {
    id: 'msg-3',
    senderType: 'ai',
    senderName: 'ChatGPT-4o Research Oracle',
    senderRole: 'AI Scientific Co-Pilot',
    content: 'Certainly! I have synthesized our latest telemetry logs with UNEP benchmarking data. Here is the interactive Group Chart displaying community progress across 6 key SDG indicators.',
    timestamp: '11:13 AM',
    chartData: PRESET_CHARTS.sdg_alignment,
    tags: ['SDG Alignment', 'High Confidence', 'Automated Synthesis']
  }
];

export default function ChatGPTGroupChart({ currentUser }: { currentUser?: User | null }) {
  const [messages, setMessages] = useState<GroupChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState('');
  const [activeChartTypeOverrides, setActiveChartTypeOverrides] = useState<Record<string, 'bar' | 'area' | 'radar' | 'pie'>>({});
  const [isThinking, setIsThinking] = useState(false);
  const [showDataModal, setShowDataModal] = useState<ChartDataset | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText || inputPrompt).trim();
    if (!query) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: GroupChatMessage = {
      id: 'usr-' + Date.now(),
      senderType: 'user',
      senderName: currentUser?.name || 'Dr. Elena Vance',
      senderRole: currentUser?.role || 'Lead Professor',
      avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      content: query,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    // AI synthesis logic with dynamic chart generation
    setTimeout(() => {
      let chosenChart: ChartDataset | undefined;
      let replyContent = '';
      const lower = query.toLowerCase();

      if (lower.includes('trajectory') || lower.includes('carbon') || lower.includes('5-year') || lower.includes('forecast')) {
        chosenChart = PRESET_CHARTS.carbon_trajectory;
        replyContent = 'I have plotted the 5-Year Carbon Removal Trajectory based on our basalt mineralization runs in Hellisheiði and direct-air scrubbers. The accelerated curve projects 290 Mt CO₂e by 2027.';
      } else if (lower.includes('radar') || lower.includes('skill') || lower.includes('team') || lower.includes('competency')) {
        chosenChart = PRESET_CHARTS.skill_radar;
        replyContent = 'Here is the Group Skill Radar Chart. Our cross-disciplinary pods show exceptional strengths in computational AI and sensor deployment, with expansion opportunity in international regulatory affairs.';
      } else if (lower.includes('funding') || lower.includes('grant') || lower.includes('budget') || lower.includes('allocation') || lower.includes('pie')) {
        chosenChart = PRESET_CHARTS.funding_breakdown;
        replyContent = 'Here is the resource allocation breakdown across our $4.2M consortium fund. Carbon tech and mineral permanence lead with 38% allocation.';
      } else if (lower.includes('chart') || lower.includes('graph') || lower.includes('sdg') || lower.includes('metric')) {
        chosenChart = PRESET_CHARTS.sdg_alignment;
        replyContent = 'Generated the updated Group Chart comparing our missions to global academic baselines. You can toggle between Bar, Area, and Radar views below.';
      } else {
        replyContent = `Analysis complete: Based on the parameters "${query}", our research telemetry confirms strong positive divergence. I’ve updated our insight models and logged this to the group knowledge repository.`;
      }

      const aiMsg: GroupChatMessage = {
        id: 'ai-' + Date.now(),
        senderType: 'ai',
        senderName: 'ChatGPT-4o Research Oracle',
        senderRole: 'AI Scientific Co-Pilot',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chartData: chosenChart,
        tags: chosenChart ? ['Interactive Group Chart', 'Peer-Verified', 'Real-time Telemetry'] : ['Scientific Synthesis']
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1800);
  };

  const setChartOverride = (chartId: string, type: 'bar' | 'area' | 'radar' | 'pie') => {
    setActiveChartTypeOverrides(prev => ({ ...prev, [chartId]: type }));
  };

  const renderGroupChart = (chart: ChartDataset) => {
    const currentType = activeChartTypeOverrides[chart.id] || chart.defaultType;

    return (
      <div className="mt-4 bg-[#141b22] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        {/* Chart Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-display font-bold text-sm text-white tracking-wide">{chart.title}</h4>
            </div>
            <p className="text-[11px] text-white/50">{chart.subtitle}</p>
          </div>

          {/* Chart Type Selector Buttons */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setChartOverride(chart.id, 'bar')}
              title="Bar Chart"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors",
                currentType === 'bar' ? "bg-indigo-600 text-white shadow" : "text-white/40 hover:text-white"
              )}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartOverride(chart.id, 'area')}
              title="Area / Line Chart"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors",
                currentType === 'area' ? "bg-indigo-600 text-white shadow" : "text-white/40 hover:text-white"
              )}
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartOverride(chart.id, 'radar')}
              title="Radar Chart"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors",
                currentType === 'radar' ? "bg-indigo-600 text-white shadow" : "text-white/40 hover:text-white"
              )}
            >
              <RadarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartOverride(chart.id, 'pie')}
              title="Pie / Donut Chart"
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors",
                currentType === 'pie' ? "bg-indigo-600 text-white shadow" : "text-white/40 hover:text-white"
              )}
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Recharts Rendering Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {currentType === 'bar' ? (
              <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                {chart.keys.map(k => (
                  <Bar key={k.key} dataKey={k.key} name={k.name} fill={k.color} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            ) : currentType === 'area' ? (
              <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  {chart.keys.map(k => (
                    <linearGradient key={k.key} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={k.color} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={k.color} stopOpacity={0.0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.5} />
                <XAxis dataKey={chart.data[0].year ? 'year' : 'name'} stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                {chart.keys.map(k => (
                  <Area
                    key={k.key}
                    type="monotone"
                    dataKey={k.key}
                    name={k.name}
                    stroke={k.color}
                    fillOpacity={1}
                    fill={`url(#grad-${k.key})`}
                  />
                ))}
              </AreaChart>
            ) : currentType === 'radar' ? (
              <RadarChart data={chart.data} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey={chart.data[0].subject ? 'subject' : 'name'} stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="#64748b" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                {(chart.radarKeys || []).map(rk => (
                  <Radar
                    key={rk.key}
                    name={rk.name}
                    dataKey={rk.key}
                    stroke={rk.color}
                    fill={rk.color}
                    fillOpacity={0.4}
                  />
                ))}
              </RadarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey={chart.data[0].value !== undefined ? 'value' : chart.keys[0]?.key || 'achieved'}
                  nameKey="name"
                >
                  {chart.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || chart.keys[index % chart.keys.length]?.color || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* AI Scientific Note & Action Bar */}
        <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-white/40">
            <span className="flex items-center gap-1 font-bold text-indigo-400 uppercase tracking-widest">
              <Zap className="w-3 h-3" /> GPT Oracle Analysis
            </span>
            <span className="font-mono text-emerald-400">Confidence: {chart.confidenceScore}%</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            {chart.analysisNote}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <button
              onClick={() => setShowDataModal(chart)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <Table className="w-3 h-3" /> View Raw Telemetry Data
            </button>
            <button
              onClick={() => alert(`Exported ${chart.title} as high-res CSV & SVG vector package.`)}
              className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" /> Export Graph
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0b0f17] text-white rounded-[2.5rem] border border-indigo-500/20 shadow-2xl overflow-hidden flex flex-col h-[820px]">
      
      {/* Top Header Bar */}
      <div className="bg-[#101726] px-6 py-4 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-white">ChatGPT Group Chart & Co-Pilot</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">
                GPT-4o Engine
              </span>
            </div>
            <p className="text-xs text-white/40">
              Autonomous multi-agent research room with live data charting & trajectory modeling
            </p>
          </div>
        </div>

        {/* Active Collaborators In Room */}
        <div className="flex items-center gap-3 bg-black/40 px-3.5 py-1.5 rounded-2xl border border-white/5">
          <span className="text-[11px] text-white/40 font-mono">In Room:</span>
          <div className="flex -space-x-2">
            {[
              { name: 'ChatGPT', role: 'AI', bg: 'bg-emerald-500' },
              { name: 'Dr. Elena Vance', role: 'You', bg: 'bg-indigo-500' },
              { name: 'Dr. Sarah Chen', role: 'Bio', bg: 'bg-purple-500' },
              { name: 'Alex Rivera', role: 'Data', bg: 'bg-cyan-500' }
            ].map((collab, i) => (
              <div
                key={i}
                title={`${collab.name} (${collab.role})`}
                className={cn(
                  "w-7 h-7 rounded-full border-2 border-[#101726] flex items-center justify-center text-[10px] font-bold text-white shadow-sm cursor-help",
                  collab.bg
                )}
              >
                {collab.name[0]}
              </div>
            ))}
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>
      </div>

      {/* Main Conversation & Chart Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 max-w-4xl",
              msg.senderType === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
              msg.senderType === 'ai' 
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                : msg.senderType === 'user'
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                : "bg-white/10 text-white/80"
            )}>
              {msg.senderType === 'ai' ? (
                <Bot className="w-5 h-5" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>

            {/* Bubble Content */}
            <div className={cn(
              "space-y-1.5 flex-1 min-w-0",
              msg.senderType === 'user' ? "items-end" : "items-start"
            )}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">{msg.senderName}</span>
                <span className="text-[10px] text-white/40 font-mono">({msg.senderRole})</span>
                <span className="text-[10px] text-white/30 font-mono ml-auto">{msg.timestamp}</span>
              </div>

              <div className={cn(
                "p-4 rounded-3xl text-xs leading-relaxed shadow-lg",
                msg.senderType === 'ai'
                  ? "bg-[#131c2e] border border-indigo-500/30 text-white/90 rounded-tl-none"
                  : msg.senderType === 'user'
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
              )}>
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Embedded Dynamic Group Chart */}
                {msg.chartData && renderGroupChart(msg.chartData)}

                {/* Tags if any */}
                {msg.tags && msg.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-white/5">
                    {msg.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-mono font-bold text-indigo-300 uppercase tracking-wider">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* AI Typing Indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl w-72 border border-white/10"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-white">ChatGPT is compiling data...</div>
              <div className="text-[10px] text-white/40">Calculating predictive vectors & chart bounds</div>
            </div>
          </motion.div>
        )}
        <div ref={chatContainerRef} />
      </div>

      {/* Suggested Quick Chart Action Chips */}
      <div className="px-6 py-2.5 bg-[#0f1624] border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex-shrink-0">
          Suggested Prompts:
        </span>
        {[
          { label: '📊 Plot SDG Alignment', query: 'Generate an interactive Group Chart comparing our team SDG alignment against global benchmarks' },
          { label: '📈 5-Year Carbon Trajectory', query: 'Show me the 5-Year Carbon Sequestration trajectory model with accelerated pod adoption' },
          { label: '🕸️ Team Competency Radar', query: 'Create a cross-disciplinary team skill radar chart for our active pods' },
          { label: '🥧 Funding Breakdown', query: 'Chart our consortium grant and resource allocation by scientific category' }
        ].map(chip => (
          <button
            key={chip.label}
            onClick={() => handleSendMessage(undefined, chip.query)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-white/10 text-white/80 hover:text-white text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
          >
            <span>{chip.label}</span>
            <ChevronRight className="w-3 h-3 opacity-40" />
          </button>
        ))}
      </div>

      {/* Bottom Message Input Box */}
      <div className="p-4 bg-[#101726] border-t border-indigo-500/20">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 bg-black/40 rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3 focus-within:border-indigo-500 transition-colors">
            <Bot className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Ask ChatGPT in the group room (e.g. 'Plot microplastic reduction by ocean zone' or 'Compare Q3 milestones')..."
              value={inputPrompt}
              onChange={e => setInputPrompt(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-white/40 focus:outline-none w-full"
            />
          </div>
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isThinking}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <span>Send to Group</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Raw Data Modal */}
      <AnimatePresence>
        {showDataModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDataModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#131c2e] p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-base">{showDataModal.title} — Raw JSON Telemetry</h3>
                </div>
                <button onClick={() => setShowDataModal(null)} className="p-1 hover:bg-white/10 rounded-lg">
                  ✕
                </button>
              </div>

              <div className="bg-black/60 rounded-2xl p-4 overflow-auto max-h-96 font-mono text-xs text-emerald-400 border border-white/5">
                <pre>{JSON.stringify(showDataModal.data, null, 2)}</pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-white/40">
                  Data points cryptographically timestamped on Glacier Engine.
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(showDataModal.data, null, 2));
                    alert('Data copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
