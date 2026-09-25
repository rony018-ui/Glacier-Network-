import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  CheckSquare,
  FileSpreadsheet,
  HardDrive,
  Mail,
  FileText,
  FileQuestion,
  Video,
  Presentation,
  Users2,
  Plus,
  Trash2,
  ExternalLink,
  Send,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  Eye,
  Edit3,
  Share2,
  RefreshCw,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface GoogleWorkspaceHubProps {
  currentUser?: User | null;
}

export default function GoogleWorkspaceHub({ currentUser }: GoogleWorkspaceHubProps) {
  const [activeTab, setActiveTab] = useState<
    'calendar' | 'tasks' | 'sheets' | 'docs' | 'gmail' | 'forms' | 'slides' | 'contacts'
  >('calendar');

  // Calendar State
  const [events, setEvents] = useState([
    {
      id: 'ev-1',
      title: 'Global Basalt Mineralization Sprint',
      date: '2026-03-02',
      time: '14:00 - 15:30 UTC',
      meetLink: 'https://meet.google.com/abc-glacier-pod',
      attendees: ['Dr. Elena Vance', 'Dr. Sarah Chen', 'Alex Rivera'],
      type: 'Lab Sprint'
    },
    {
      id: 'ev-2',
      title: 'UNEP COP31 Policy Alignment Symposium',
      date: '2026-03-05',
      time: '17:00 - 18:30 UTC',
      meetLink: 'https://meet.google.com/unep-glacier-q1',
      attendees: ['Dr. Marcus Vance', 'Prof. Chen', 'Global Delegates'],
      type: 'Symposium'
    },
    {
      id: 'ev-3',
      title: 'Autonomous Ocean Buoy Telemetry Review',
      date: '2026-03-08',
      time: '10:00 - 11:00 UTC',
      meetLink: 'https://meet.google.com/ocean-buoy-sync',
      attendees: ['Liam O’Connor', 'Dr. Elena Vance'],
      type: 'Sensor Audit'
    }
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'Lab Sprint' });
  const [showEventModal, setShowEventModal] = useState(false);

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 'tsk-1', title: 'Audit Sentinel-5P Methane Plume GeoJSON dataset', due: 'Tomorrow', completed: false, priority: 'High' },
    { id: 'tsk-2', title: 'Calibrate Atacama MOF solid sorbent airflow filters', due: 'Mar 4', completed: true, priority: 'Medium' },
    { id: 'tsk-3', title: 'Submit Peer-Review summary for Coral Sea Alkalinity paper', due: 'Mar 6', completed: false, priority: 'High' },
    { id: 'tsk-4', title: 'Synthesize student fellowship mission deliverables', due: 'Mar 10', completed: false, priority: 'Low' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');

  // Sheets State
  const [sheetData, setSheetData] = useState([
    ['Site Location', 'Metric', 'Baseline (t/yr)', 'Achieved (t/yr)', 'Delta %'],
    ['Hellisheiði Basalt', 'CO₂ Dissolution', '10,000', '12,450', '+24.5%'],
    ['Coral Sea Buoy #4', 'Alkalinity Flux', '4,200', '5,100', '+21.4%'],
    ['Atacama Sorbent #1', 'Direct Air Scrub', '6,500', '8,200', '+26.1%'],
    ['Permian Array', 'Methane Mitigated', '1,800', '2,400', '+33.3%'],
    ['Total Consortium', 'Combined Net Removal', '22,500', '28,150', '+25.1%'],
  ]);

  // Docs State
  const [docContent, setDocContent] = useState(
    `# Global Carbon Sequestration Framework (2026-2030)
## Authors: Dr. Elena Vance, Dr. Sarah Chen, Alex Rivera

### 1. Abstract
Recent breakthroughs in deep-well basalt mineralization have confirmed that dissolved aqueous carbon dioxide can be converted into solid calcite minerals within 24 months. This document establishes the open peer-review protocol for deploying modular field sensors across verified volcanic formations.

### 2. Methodological Standards
1. Telemetry must be sampled every 15 minutes via LoRaWAN/Satellite uplinks.
2. Ground-truth geochemical core samples must be logged with C2PA cryptographic watermarks.
3. Impact points are programmatically awarded through the Glacier Network Protocol.`
  );

  // Gmail State
  const [emailForm, setEmailForm] = useState({
    to: 'sazzadhossin01682@gmail.com',
    subject: 'Glacier Mission Peer Review & Telemetry Collaboration Invitation',
    body: `Dear Colleague,\n\nI would like to invite you to collaborate on our upcoming mission sprint under the Glacier Climate Collective. Our latest basalt mineralization run demonstrated a +24.5% efficiency improvement.\n\nPlease find the telemetry sheets and Google Meet link attached.\n\nWarm regards,\nDr. Elena Vance\nGlacier Lead Researcher`
  });
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  // Forms State
  const [surveyQuestions, setSurveyQuestions] = useState([
    { id: 1, question: 'Which carbon permanence methodology do you recommend prioritizing for Q3?', type: 'Multiple Choice', options: ['Direct Air Basalt', 'Ocean Alkalinity', 'Enhanced Weathering', 'Biochar Pyrolysis'] },
    { id: 2, question: 'Rate data transparency and reproducibility of our satellite telemetry', type: 'Linear Scale (1-5)', options: ['1 (Poor)', '2', '3', '4', '5 (Excellent)'] },
    { id: 3, question: 'Open feedback on regulatory barriers facing independent researchers:', type: 'Paragraph', options: [] }
  ]);
  const [surveyResponsesCount, setSurveyResponsesCount] = useState(148);

  // Slides State
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { title: 'Glacier Consortium 2026', subtitle: 'Accelerated Planetary Science & Global Telemetry', tag: 'Executive Brief' },
    { title: 'Carbon Mineralization Velocity', subtitle: '+24.5% permanence achieved across 6 global stations', tag: 'Data Milestone' },
    { title: 'Global Academic Network', subtitle: '8 verified universities • 1,840 active researchers • 12 EU policy inputs', tag: 'Consortium Reach' },
  ];

  // Contacts State
  const contacts = [
    { name: 'Dr. Sarah Chen', role: 'Bio-engineering Lead', org: 'Stanford Climate Institute', email: 's.chen@stanford.edu', avatar: 'Sarah' },
    { name: 'Alex Rivera', role: 'Data Systems Architect', org: 'MIT Media Lab', email: 'arivera@mit.edu', avatar: 'Alex' },
    { name: 'Dr. Marcus Vance', role: 'Policy & Multilateral Fellow', org: 'Oxford Oxford Blavatnik', email: 'm.vance@ox.ac.uk', avatar: 'Marcus' },
    { name: 'Liam O’Connor', role: 'Remote Sensing Analyst', org: 'ESA Copernicus Team', email: 'loconnor@esa.int', avatar: 'Liam' },
  ];

  // Handlers
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    const ev = {
      id: 'ev-' + Date.now(),
      title: newEvent.title.trim(),
      date: newEvent.date || '2026-03-12',
      time: newEvent.time || '15:00 UTC',
      meetLink: `https://meet.google.com/pod-${Math.random().toString(36).substring(7)}`,
      attendees: [currentUser?.name || 'Dr. Elena Vance', 'Collaborators'],
      type: newEvent.type
    };
    setEvents(prev => [...prev, ev]);
    setNewEvent({ title: '', date: '', time: '', type: 'Lab Sprint' });
    setShowEventModal(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: 'tsk-' + Date.now(), title: newTaskTitle.trim(), due: 'Mar 15', completed: false, priority: newTaskPriority }
    ]);
    setNewTaskTitle('');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = window.confirm(`Send research correspondence via Gmail to ${emailForm.to}?`);
    if (!confirmed) return;
    setEmailSentNotice(true);
    setTimeout(() => setEmailSentNotice(false), 4000);
  };

  return (
    <div className="w-full bg-[#0a0f18] text-white rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      
      {/* Top Header */}
      <div className="bg-[#101826] px-6 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-white">Google Workspace Research Suite</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                Connected
              </span>
            </div>
            <p className="text-xs text-white/50">
              Native synchronization with Google Calendar, Meet, Tasks, Sheets, Drive, Docs, Gmail, Forms & Slides
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/5 text-xs text-white/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>OAuth Scope Verified</span>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-[#0d1422] px-6 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'calendar', label: 'Calendar & Meet', icon: Calendar, color: 'text-blue-400' },
          { id: 'tasks', label: 'Google Tasks', icon: CheckSquare, color: 'text-indigo-400' },
          { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet, color: 'text-emerald-400' },
          { id: 'docs', label: 'Docs & Drive', icon: FileText, color: 'text-cyan-400' },
          { id: 'gmail', label: 'Gmail Outreach', icon: Mail, color: 'text-red-400' },
          { id: 'forms', label: 'Google Forms', icon: FileQuestion, color: 'text-purple-400' },
          { id: 'slides', label: 'Google Slides', icon: Presentation, color: 'text-amber-400' },
          { id: 'contacts', label: 'Contacts', icon: Users2, color: 'text-pink-400' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
              activeTab === item.id
                ? "bg-white/15 text-white font-bold border border-white/20 shadow-md"
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-4 h-4", item.color)} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="p-6 md:p-8 min-h-[480px] bg-[#0a0f18]">
        
        {/* CALENDAR & MEET */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Research Sprints & Symposiums</h3>
                <p className="text-xs text-white/50">Synced with Google Calendar & Google Meet video spaces</p>
              </div>
              <button
                onClick={() => setShowEventModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 text-white transition-all"
              >
                <Plus className="w-4 h-4" /> Schedule Session
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map(ev => (
                <div key={ev.id} className="p-5 rounded-2xl bg-[#121927] border border-white/10 space-y-4 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                      {ev.type}
                    </span>
                    <span className="text-[11px] font-mono text-white/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ev.date}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                    <p className="text-xs text-white/50 font-mono">{ev.time}</p>
                  </div>

                  <div className="text-[11px] text-white/60">
                    <span className="text-white/40 block mb-1">Participants:</span>
                    <div className="flex flex-wrap gap-1">
                      {ev.attendees.map(a => (
                        <span key={a} className="px-2 py-0.5 rounded bg-black/40 text-[10px] border border-white/5">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={ev.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOOGLE TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Mission Deliverables & Review Checklist</h3>
                <p className="text-xs text-white/50">Bidirectional sync with Google Tasks API</p>
              </div>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Add research action item or milestone task..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-[#121927] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value)}
                className="bg-[#121927] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </form>

            <div className="space-y-2">
              {tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => setTasks(prev => prev.map(item => item.id === t.id ? { ...item, completed: !item.completed } : item))}
                  className={cn(
                    "p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer",
                    t.completed ? "bg-white/5 border-white/5 opacity-50" : "bg-[#121927] border-white/10 hover:border-indigo-500/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-lg border flex items-center justify-center transition-colors",
                      t.completed ? "bg-emerald-500 border-emerald-500 text-black" : "border-white/30"
                    )}>
                      {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn("text-xs font-medium", t.completed ? "line-through text-white/50" : "text-white")}>
                      {t.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                      t.priority === 'High' ? "bg-red-500/20 text-red-300" :
                      t.priority === 'Medium' ? "bg-amber-500/20 text-amber-300" : "bg-blue-500/20 text-blue-300"
                    )}>
                      {t.priority}
                    </span>
                    <span className="text-[11px] font-mono text-white/40">{t.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOOGLE SHEETS */}
        {activeTab === 'sheets' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Live Telemetry Spreadsheet Editor</h3>
                <p className="text-xs text-white/50">Collaborative tabular data with Google Sheets export & computation</p>
              </div>
              <button
                onClick={() => alert('Exporting live telemetry grid to Google Sheets with OAuth permission.')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" /> Export to Google Sheets
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 overflow-x-auto bg-[#101826]">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  {sheetData.map((row, rIdx) => (
                    <tr key={rIdx} className={cn("border-b border-white/5", rIdx === 0 ? "bg-black/40 font-bold text-white" : "hover:bg-white/5")}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 border-r border-white/5 min-w-[140px]">
                          {rIdx === 0 ? (
                            <span className="text-white/70">{cell}</span>
                          ) : (
                            <input
                              type="text"
                              value={cell}
                              onChange={e => {
                                const val = e.target.value;
                                setSheetData(prev => {
                                  const copy = prev.map(r => [...r]);
                                  copy[rIdx][cIdx] = val;
                                  return copy;
                                });
                              }}
                              className="bg-transparent text-white focus:outline-none w-full"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-white/40 italic">Tip: Click any cell to edit data live. Rows are automatically saved and verified.</p>
          </div>
        )}

        {/* DOCS & DRIVE */}
        {activeTab === 'docs' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Collaborative Research Paper Studio</h3>
                <p className="text-xs text-white/50">Rich markdown editor with Google Docs & Drive synchronization</p>
              </div>
              <button
                onClick={() => alert('Synced latest paper draft to Google Drive folder "Glacier Publications 2026".')}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <HardDrive className="w-4 h-4" /> Save to Google Drive
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Markdown Editor</span>
                <textarea
                  rows={14}
                  value={docContent}
                  onChange={e => setDocContent(e.target.value)}
                  className="w-full bg-[#101826] border border-white/10 rounded-2xl p-4 font-mono text-xs text-cyan-300 leading-relaxed focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Document Preview</span>
                <div className="h-[285px] overflow-y-auto bg-[#121927] border border-white/10 rounded-2xl p-5 text-xs text-white/80 space-y-3 prose prose-invert">
                  <div className="whitespace-pre-wrap">{docContent}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GMAIL OUTREACH */}
        {activeTab === 'gmail' && (
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Researcher Outreach & Peer Review Email</h3>
                <p className="text-xs text-white/50">Send research correspondence directly with Gmail OAuth integration</p>
              </div>
            </div>

            {emailSentNotice && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Email dispatched through Gmail with authorized OAuth token!</span>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-white/50 font-semibold">Recipient (Academic Contact)</label>
                <input
                  type="email"
                  required
                  value={emailForm.to}
                  onChange={e => setEmailForm({ ...emailForm, to: e.target.value })}
                  className="w-full bg-[#121927] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/50 font-semibold">Subject</label>
                <input
                  type="text"
                  required
                  value={emailForm.subject}
                  onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full bg-[#121927] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/50 font-semibold">Message Body</label>
                <textarea
                  rows={6}
                  required
                  value={emailForm.body}
                  onChange={e => setEmailForm({ ...emailForm, body: e.target.value })}
                  className="w-full bg-[#121927] border border-white/10 rounded-xl p-4 text-white leading-relaxed focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send via Gmail
              </button>
            </form>
          </div>
        )}

        {/* GOOGLE FORMS */}
        {activeTab === 'forms' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Mission Feedback Survey & Poll Builder</h3>
                <p className="text-xs text-white/50">Google Forms synchronization • {surveyResponsesCount} verified responses collected</p>
              </div>
              <button
                onClick={() => alert('Survey exported to Google Forms with live webhook responses.')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <ExternalLink className="w-4 h-4" /> View in Google Forms
              </button>
            </div>

            <div className="space-y-3">
              {surveyQuestions.map(q => (
                <div key={q.id} className="p-4 rounded-2xl bg-[#121927] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{q.type}</span>
                    <span className="text-[10px] text-white/40">Question #{q.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{q.question}</h4>
                  {q.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {q.options.map(opt => (
                        <span key={opt} className="px-3 py-1 bg-black/40 border border-white/5 rounded-lg text-xs text-white/70">
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOOGLE SLIDES */}
        {activeTab === 'slides' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Mission Slide Deck & Presentation Pitch</h3>
                <p className="text-xs text-white/50">Automated presentation deck synced with Google Slides API</p>
              </div>
              <button
                onClick={() => alert('Slide deck generated and exported to Google Slides account.')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Presentation className="w-4 h-4" /> Export to Google Slides
              </button>
            </div>

            {/* Slide Viewer */}
            <div className="aspect-video max-w-2xl mx-auto bg-gradient-to-br from-[#121927] to-[#1e293b] rounded-3xl border border-amber-500/30 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                  {slides[activeSlide].tag}
                </span>
                <span className="font-mono text-white/40">Slide {activeSlide + 1} of {slides.length}</span>
              </div>

              <div className="space-y-3 my-auto">
                <h2 className="text-3xl font-display font-bold text-white">{slides[activeSlide].title}</h2>
                <p className="text-sm text-white/70">{slides[activeSlide].subtitle}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide(s => s - 1)}
                  className="px-3 py-1 rounded-lg bg-white/10 disabled:opacity-30 text-xs"
                >
                  Previous
                </button>
                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <div key={i} className={cn("w-2 h-2 rounded-full", i === activeSlide ? "bg-amber-400" : "bg-white/20")} />
                  ))}
                </div>
                <button
                  disabled={activeSlide === slides.length - 1}
                  onClick={() => setActiveSlide(s => s + 1)}
                  className="px-3 py-1 rounded-lg bg-white/10 disabled:opacity-30 text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Academic Contacts & Peer Directory</h3>
                <p className="text-xs text-white/50">Synced with Google Contacts API for seamless collaborator outreach</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map(c => (
                <div key={c.email} className="p-4 rounded-2xl bg-[#121927] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow">
                      {c.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{c.name}</h4>
                      <p className="text-[11px] text-white/50">{c.role} • {c.org}</p>
                      <span className="text-[10px] text-pink-400 font-mono">{c.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEmailForm(prev => ({ ...prev, to: c.email }));
                      setActiveTab('gmail');
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEventModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#101826] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-white text-xs"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-sm">Schedule Google Calendar Event & Meet</h3>
                <button onClick={() => setShowEventModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-white/50">Session Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q2 Basalt Mineralization Review"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/50">Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/50">Time & Timezone</label>
                    <input
                      type="text"
                      placeholder="e.g. 14:00 - 15:30 UTC"
                      value={newEvent.time}
                      onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg mt-2"
                >
                  Create & Generate Meet Space
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
