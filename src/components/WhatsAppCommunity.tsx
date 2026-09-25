import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Users,
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  MoreVertical,
  Check,
  CheckCheck,
  Play,
  Pause,
  FileText,
  Vote,
  Share2,
  ChevronDown,
  Info,
  Phone,
  Video,
  Hash,
  Bell,
  Sparkles,
  ArrowLeft,
  X,
  ShieldCheck,
  Globe2,
  Lock,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

export interface WhatsAppMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  avatar: string;
  text?: string;
  timestamp: string;
  isSelf: boolean;
  status: 'sent' | 'delivered' | 'read';
  reactions?: { emoji: string; count: number; users: string[] }[];
  replyTo?: { id: string; senderName: string; text: string };
  audio?: {
    duration: string;
    waveform: number[];
  };
  file?: {
    name: string;
    size: string;
    type: 'pdf' | 'csv' | 'image';
  };
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
}

export interface SubGroup {
  id: string;
  name: string;
  isAnnouncement?: boolean;
  unreadCount?: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  memberCount: number;
  messages: WhatsAppMessage[];
}

export interface Community {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  coverImage: string;
  verified: boolean;
  totalMembers: number;
  groups: SubGroup[];
}

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-climate',
    name: 'Glacier Climate & Carbon Collective',
    tagline: 'Global consortium of academic and grassroots researchers tracking carbon reduction',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    verified: true,
    totalMembers: 1842,
    groups: [
      {
        id: 'grp-announcements',
        name: 'Announcements 📢',
        isAnnouncement: true,
        unreadCount: 1,
        lastMessageSnippet: 'UNEP grant phase 2 proposals open until Friday',
        lastMessageTime: '10:45 AM',
        memberCount: 1842,
        messages: [
          {
            id: 'm1',
            senderId: 'admin1',
            senderName: 'Glacier Core Office',
            senderRole: 'Community Admin',
            avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=GlacierAdmin',
            text: '🚨 *OFFICIAL BROADCAST*: UNEP Grant Phase 2 proposals are officially open for verified researchers and university teams. Please ensure your mission impact dashboard is synchronized before submission!',
            timestamp: '09:15 AM',
            isSelf: false,
            status: 'read',
            reactions: [{ emoji: '🙌', count: 48, users: ['u1', 'u2'] }, { emoji: '❤️', count: 32, users: [] }]
          },
          {
            id: 'm2',
            senderId: 'admin2',
            senderName: 'Dr. Marcus Vance',
            senderRole: 'Policy Chair',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
            text: 'We have uploaded the synthesized Carbon Sequestration Framework document for community review below. Please leave feedback in the #carbon-negative-tech sub-group.',
            timestamp: '10:45 AM',
            isSelf: false,
            status: 'read',
            file: {
              name: 'Global_Carbon_Framework_v2.4.pdf',
              size: '4.8 MB',
              type: 'pdf'
            },
            reactions: [{ emoji: '🚀', count: 19, users: [] }]
          }
        ]
      },
      {
        id: 'grp-carbon-tech',
        name: 'Carbon Negative Tech 🧪',
        unreadCount: 2,
        lastMessageSnippet: 'Check the new sensor telemetry from Iceland geothermal plant',
        lastMessageTime: '11:20 AM',
        memberCount: 524,
        messages: [
          {
            id: 'm-tech-1',
            senderId: 'user-sarah',
            senderName: 'Dr. Sarah Chen',
            senderRole: 'Bio-engineer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            text: 'Good morning everyone! The basalt mineralization telemetry from Hellisheiði Iceland arrived. Micro-crystallization efficiency is up 14% compared to baseline estimates.',
            timestamp: '11:02 AM',
            isSelf: false,
            status: 'read',
            reactions: [{ emoji: '🎉', count: 12, users: [] }, { emoji: '🔬', count: 8, users: [] }]
          },
          {
            id: 'm-tech-2',
            senderId: 'user-sarah',
            senderName: 'Dr. Sarah Chen',
            senderRole: 'Bio-engineer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            timestamp: '11:05 AM',
            isSelf: false,
            status: 'read',
            audio: {
              duration: '0:34',
              waveform: [35, 45, 75, 60, 90, 100, 80, 50, 65, 85, 95, 70, 40, 60, 80, 75, 55, 30]
            }
          },
          {
            id: 'm-tech-3',
            senderId: 'user-alex',
            senderName: 'Alex Rivera',
            senderRole: 'Data Architect',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            text: 'I just ingested the raw CSV into our collaborative pipeline. Check the poll below so we can decide which benchmark to submit for the COP31 draft.',
            timestamp: '11:15 AM',
            isSelf: false,
            status: 'read',
            poll: {
              question: 'Which carbon sequestration metric should lead the COP31 benchmark paper?',
              options: [
                { id: 'opt-1', text: 'Net Negative Lifecycle (CO₂e / MWh)', votes: 84 },
                { id: 'opt-2', text: 'Per-Ton Mineral Permanence (>1000 yrs)', votes: 112 },
                { id: 'opt-3', text: 'Levelized Cost of Carbon Capture ($/t)', votes: 68 },
                { id: 'opt-4', text: 'Freshwater Consumption Index', votes: 19 }
              ],
              totalVotes: 283,
              userVotedOptionId: 'opt-2'
            }
          },
          {
            id: 'm-tech-4',
            senderId: 'user-alex',
            senderName: 'Alex Rivera',
            senderRole: 'Data Architect',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            text: 'Check the new sensor telemetry from Iceland geothermal plant! Dataset link attached.',
            timestamp: '11:20 AM',
            isSelf: false,
            status: 'read',
            file: {
              name: 'Iceland_Station4_Telemetry_Feb2026.csv',
              size: '1.2 MB',
              type: 'csv'
            }
          }
        ]
      },
      {
        id: 'grp-datasets',
        name: 'Open Datasets & Sensors 🛰️',
        lastMessageSnippet: 'Sentinel-5P methane plumes uploaded for Permian basin',
        lastMessageTime: 'Yesterday',
        memberCount: 310,
        messages: [
          {
            id: 'm-ds-1',
            senderId: 'u-sat',
            senderName: 'Liam O’Connor',
            senderRole: 'Remote Sensing',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
            text: 'Fresh satellite passes from ESA Sentinel-5P are processed. We detected a 24% reduction in recurring flaring events over the tracked coordinates.',
            timestamp: 'Yesterday at 4:30 PM',
            isSelf: false,
            status: 'read',
            file: {
              name: 'Sentinel5P_Methane_Grid_Q1.geojson',
              size: '8.4 MB',
              type: 'pdf'
            }
          }
        ]
      },
      {
        id: 'grp-mentorship',
        name: 'Student & Early Career Mentorship 🎓',
        lastMessageSnippet: 'Welcome to all 45 new graduate fellows joining this week!',
        lastMessageTime: 'Feb 26',
        memberCount: 780,
        messages: [
          {
            id: 'm-ment-1',
            senderId: 'user-elena',
            senderName: 'Dr. Elena Vance',
            senderRole: 'Lead Professor',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
            text: 'Welcome everyone! For all student members looking for thesis co-advisors or open mission tasks, please check out the pinned guides or tag @DrElena in the chat.',
            timestamp: 'Feb 26, 2:15 PM',
            isSelf: true,
            status: 'read',
            reactions: [{ emoji: '🎓', count: 35, users: [] }, { emoji: '❤️', count: 28, users: [] }]
          }
        ]
      }
    ]
  },
  {
    id: 'comm-ai-ethics',
    name: 'AI Ethics & Autonomous Governance',
    tagline: 'Evaluating alignment, algorithmic fairness, and synthetic biology safeguards',
    avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&auto=format&fit=crop&q=60',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    verified: true,
    totalMembers: 935,
    groups: [
      {
        id: 'grp-ai-announcements',
        name: 'Announcements 📢',
        isAnnouncement: true,
        lastMessageSnippet: 'Symposium dates confirmed for Geneva conference',
        lastMessageTime: 'Yesterday',
        memberCount: 935,
        messages: [
          {
            id: 'm-ai-1',
            senderId: 'admin-ai',
            senderName: 'AI Safety Council',
            senderRole: 'Council Lead',
            avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=SafetyCouncil',
            text: 'The 2026 Symposium on Generative Science & Autonomous Research Ethics has published its preliminary agenda. Keynotes include multi-modal alignment and open-weights transparency.',
            timestamp: 'Yesterday at 1:10 PM',
            isSelf: false,
            status: 'read'
          }
        ]
      },
      {
        id: 'grp-alignment-lab',
        name: 'Alignment & Watermarking 🔐',
        lastMessageSnippet: 'Cryptographic provenance verification test running now',
        lastMessageTime: '08:45 AM',
        memberCount: 412,
        messages: [
          {
            id: 'm-ai-2',
            senderId: 'user-kai',
            senderName: 'Kai Takahashi',
            senderRole: 'Cryptographer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai',
            text: 'We are deploying the C2PA tamper-evident watermark standard across all synthetic dataset exports on the Glacier Engine. Testing live in staging.',
            timestamp: '08:45 AM',
            isSelf: false,
            status: 'read'
          }
        ]
      }
    ]
  }
];

export default function WhatsAppCommunity({ currentUser }: { currentUser?: User | null }) {
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('comm-climate');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp-carbon-tech');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommunityInfo, setShowCommunityInfo] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupIsAnnouncement, setNewGroupIsAnnouncement] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);

  const activeCommunity = communities.find(c => c.id === selectedCommunityId) || communities[0];
  const activeGroup = activeCommunity.groups.find(g => g.id === selectedGroupId) || activeCommunity.groups[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeGroup.messages]);

  // Voice recording simulation
  useEffect(() => {
    if (isRecordingVoice) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecordingVoice]);

  // Audio simulation
  useEffect(() => {
    let interval: any;
    if (playingAudioId) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setPlayingAudioId(null);
            return 0;
          }
          return prev + 5 * audioPlaybackSpeed;
        });
      }, 300);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [playingAudioId, audioPlaybackSpeed]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && !isRecordingVoice) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: WhatsAppMessage = {
      id: 'm-' + Date.now(),
      senderId: currentUser?.id || 'u1',
      senderName: currentUser?.name || 'Dr. Elena Vance',
      senderRole: currentUser?.role || 'Professor',
      avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      text: messageInput.trim(),
      timestamp: timeStr,
      isSelf: true,
      status: 'delivered',
      reactions: []
    };

    const updatedGroups = activeCommunity.groups.map(g => {
      if (g.id === activeGroup.id) {
        return {
          ...g,
          lastMessageSnippet: messageInput.trim() || 'Voice note',
          lastMessageTime: timeStr,
          messages: [...g.messages, newMsg]
        };
      }
      return g;
    });

    const updatedComm = communities.map(c => {
      if (c.id === activeCommunity.id) {
        return { ...c, groups: updatedGroups };
      }
      return c;
    });

    setCommunities(updatedComm);
    setMessageInput('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);

    // Realistic auto-reply simulation from collaborator
    setTimeout(() => {
      simulateCollaboratorReply(activeGroup.id);
    }, 2800);
  };

  const simulateCollaboratorReply = (groupId: string) => {
    const replies = [
      {
        senderName: 'Dr. Sarah Chen',
        senderRole: 'Bio-engineer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        text: 'Great point! I just cross-referenced this against the open satellite sensor logs in the Engine repository. The confidence interval is within 95%.'
      },
      {
        senderName: 'Alex Rivera',
        senderRole: 'Data Architect',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        text: 'Noted! I’ve added this action item to our next sprint milestone. You can track live updates in the ChatGPT Group Chart view.'
      }
    ];
    const chosen = replies[Math.floor(Math.random() * replies.length)];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCommunities(prevComm => {
      return prevComm.map(c => {
        if (c.id === activeCommunity.id) {
          const newGroups = c.groups.map(g => {
            if (g.id === groupId) {
              const replyMsg: WhatsAppMessage = {
                id: 'm-reply-' + Date.now(),
                senderId: 'sarah-' + Date.now(),
                senderName: chosen.senderName,
                senderRole: chosen.senderRole,
                avatar: chosen.avatar,
                text: chosen.text,
                timestamp: timeStr,
                isSelf: false,
                status: 'read',
                reactions: [{ emoji: '👍', count: 2, users: [] }]
              };
              return {
                ...g,
                lastMessageSnippet: chosen.text.slice(0, 45) + '...',
                lastMessageTime: timeStr,
                messages: [...g.messages, replyMsg]
              };
            }
            return g;
          });
          return { ...c, groups: newGroups };
        }
        return c;
      });
    });
  };

  const handleVotePoll = (messageId: string, optionId: string) => {
    setCommunities(prevComm => {
      return prevComm.map(c => {
        if (c.id === activeCommunity.id) {
          const newGroups = c.groups.map(g => {
            if (g.id === activeGroup.id) {
              const updatedMessages = g.messages.map(m => {
                if (m.id === messageId && m.poll) {
                  const alreadyVoted = m.poll.userVotedOptionId === optionId;
                  const updatedOptions = m.poll.options.map(opt => {
                    if (opt.id === optionId) {
                      return { ...opt, votes: alreadyVoted ? opt.votes - 1 : opt.votes + 1 };
                    }
                    if (m.poll?.userVotedOptionId === opt.id && !alreadyVoted) {
                      return { ...opt, votes: opt.votes - 1 };
                    }
                    return opt;
                  });
                  return {
                    ...m,
                    poll: {
                      ...m.poll,
                      options: updatedOptions,
                      totalVotes: alreadyVoted ? m.poll.totalVotes - 1 : m.poll.userVotedOptionId ? m.poll.totalVotes : m.poll.totalVotes + 1,
                      userVotedOptionId: alreadyVoted ? undefined : optionId
                    }
                  };
                }
                return m;
              });
              return { ...g, messages: updatedMessages };
            }
            return g;
          });
          return { ...c, groups: newGroups };
        }
        return c;
      });
    });
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setCommunities(prevComm => {
      return prevComm.map(c => {
        if (c.id === activeCommunity.id) {
          const newGroups = c.groups.map(g => {
            if (g.id === activeGroup.id) {
              const updatedMessages = g.messages.map(m => {
                if (m.id === messageId) {
                  const currentReactions = m.reactions || [];
                  const existing = currentReactions.find(r => r.emoji === emoji);
                  let nextReactions;
                  if (existing) {
                    nextReactions = currentReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r);
                  } else {
                    nextReactions = [...currentReactions, { emoji, count: 1, users: ['self'] }];
                  }
                  return { ...m, reactions: nextReactions };
                }
                return m;
              });
              return { ...g, messages: updatedMessages };
            }
            return g;
          });
          return { ...c, groups: newGroups };
        }
        return c;
      });
    });
  };

  const handleSendVoiceNote = () => {
    setIsRecordingVoice(false);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: WhatsAppMessage = {
      id: 'm-voice-' + Date.now(),
      senderId: currentUser?.id || 'u1',
      senderName: currentUser?.name || 'Dr. Elena Vance',
      senderRole: currentUser?.role || 'Professor',
      avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      timestamp: timeStr,
      isSelf: true,
      status: 'delivered',
      audio: {
        duration: `0:${recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds}`,
        waveform: [40, 60, 80, 50, 90, 70, 40, 95, 60, 45, 80, 70]
      }
    };

    setCommunities(prevComm => {
      return prevComm.map(c => {
        if (c.id === activeCommunity.id) {
          const newGroups = c.groups.map(g => {
            if (g.id === activeGroup.id) {
              return {
                ...g,
                lastMessageSnippet: '🎤 Voice message',
                lastMessageTime: timeStr,
                messages: [...g.messages, newMsg]
              };
            }
            return g;
          });
          return { ...c, groups: newGroups };
        }
        return c;
      });
    });
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGrp: SubGroup = {
      id: 'grp-' + Date.now(),
      name: newGroupName.trim() + (newGroupIsAnnouncement ? ' 📢' : ''),
      isAnnouncement: newGroupIsAnnouncement,
      unreadCount: 0,
      lastMessageSnippet: 'Group created by ' + (currentUser?.name || 'Dr. Elena Vance'),
      lastMessageTime: 'Just now',
      memberCount: 1,
      messages: [
        {
          id: 'm-init-' + Date.now(),
          senderId: currentUser?.id || 'u1',
          senderName: currentUser?.name || 'Dr. Elena Vance',
          senderRole: 'Creator',
          avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
          text: `Welcome to ${newGroupName.trim()}! This sub-group is dedicated to specialized collaboration.`,
          timestamp: 'Just now',
          isSelf: true,
          status: 'sent'
        }
      ]
    };

    setCommunities(prevComm => {
      return prevComm.map(c => {
        if (c.id === activeCommunity.id) {
          return { ...c, groups: [...c.groups, newGrp] };
        }
        return c;
      });
    });

    setSelectedGroupId(newGrp.id);
    setNewGroupName('');
    setNewGroupIsAnnouncement(false);
    setShowNewGroupModal(false);
  };

  const filteredGroups = activeCommunity.groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#0d1418] text-[#e9edef] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[820px]">
      
      {/* Top WhatsApp Community Header */}
      <div className="bg-[#202c33] px-6 py-4 border-b border-[#2a3942] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00a884] to-[#25d366] flex items-center justify-center text-white shadow-lg shadow-[#00a884]/20">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-wide">
                WhatsApp Communities
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] text-[10px] font-bold uppercase tracking-wider border border-[#00a884]/30">
                Live Sync
              </span>
            </div>
            <p className="text-xs text-[#8696a0]">
              Unified desktop integration • Real-time research subgroup network
            </p>
          </div>
        </div>

        {/* Community Selector Tabs */}
        <div className="flex items-center gap-2 bg-[#111b21] p-1.5 rounded-2xl border border-[#2a3942]">
          {communities.map(comm => (
            <button
              key={comm.id}
              onClick={() => {
                setSelectedCommunityId(comm.id);
                setSelectedGroupId(comm.groups[0].id);
              }}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all",
                selectedCommunityId === comm.id
                  ? "bg-[#00a884] text-white shadow-md font-bold"
                  : "text-[#aebac1] hover:bg-[#202c33] hover:text-white"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="max-w-[140px] truncate">{comm.name.split(' ')[0]}</span>
              {comm.verified && <ShieldCheck className="w-3 h-3 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main WhatsApp Work Area (Sidebar + Active Chat + Info Panel) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sub-groups & Channels Sidebar */}
        <div className="w-80 md:w-96 bg-[#111b21] border-r border-[#222e35] flex flex-col flex-shrink-0">
          
          {/* Active Community Banner Card */}
          <div 
            onClick={() => setShowCommunityInfo(!showCommunityInfo)}
            className="p-4 bg-[#202c33]/70 hover:bg-[#202c33] cursor-pointer transition-colors border-b border-[#222e35] flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#2a3942] relative flex-shrink-0">
                <img src={activeCommunity.avatar} alt={activeCommunity.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-[#111b21] rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white truncate">{activeCommunity.name}</h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00a884] flex-shrink-0" />
                </div>
                <div className="text-[11px] text-[#8696a0] flex items-center gap-2">
                  <span>{activeCommunity.totalMembers.toLocaleString()} members</span>
                  <span>•</span>
                  <span>{activeCommunity.groups.length} groups</span>
                </div>
              </div>
            </div>
            <Info className="w-4 h-4 text-[#8696a0] group-hover:text-white transition-colors" />
          </div>

          {/* Search bar & Add Group */}
          <div className="p-3 bg-[#111b21] flex items-center gap-2 border-b border-[#222e35]">
            <div className="flex-1 bg-[#202c33] rounded-xl px-3 py-2 flex items-center gap-2 text-[#8696a0]">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-[#8696a0] focus:outline-none w-full"
              />
            </div>
            <button
              onClick={() => setShowNewGroupModal(true)}
              title="Add Sub-group"
              className="p-2 rounded-xl bg-[#202c33] hover:bg-[#00a884] hover:text-white text-[#aebac1] transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Groups list */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222e35]/50">
            {filteredGroups.map(group => {
              const isSelected = group.id === selectedGroupId;
              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={cn(
                    "p-3.5 flex items-center gap-3 cursor-pointer transition-all relative group",
                    isSelected ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-transform group-hover:scale-105",
                    group.isAnnouncement 
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                      : "bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30"
                  )}>
                    {group.isAnnouncement ? '📢' : <Hash className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "font-semibold text-sm truncate",
                        isSelected ? "text-white" : "text-[#e9edef]"
                      )}>
                        {group.name}
                      </span>
                      <span className="text-[10px] text-[#8696a0] font-mono flex-shrink-0">
                        {group.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#8696a0] truncate max-w-[190px]">
                        {group.lastMessageSnippet}
                      </p>
                      {group.unreadCount ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#00a884] text-black text-[10px] font-bold min-w-4 text-center">
                          {group.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00a884] rounded-r" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Synced Status Footer */}
          <div className="p-3 bg-[#202c33]/40 border-t border-[#222e35] flex items-center justify-between text-[11px] text-[#8696a0]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00a884] animate-pulse" />
              <span>Desktop Session Active</span>
            </div>
            <span className="font-mono text-[10px] text-[#00a884]">End-to-End Encrypted</span>
          </div>
        </div>

        {/* Right Chat Conversation View */}
        <div className="flex-1 bg-[#0b141a] flex flex-col relative overflow-hidden">
          
          {/* WhatsApp Chat Background Wallpaper Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#25d366 1px, transparent 1px), radial-gradient(#25d366 1px, #0b141a 1px)`,
              backgroundSize: '32px 32px',
              backgroundPosition: '0 0, 16px 16px'
            }}
          />

          {/* Channel Header Bar */}
          <div className="h-16 bg-[#202c33] px-6 border-b border-[#2a3942] flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                activeGroup.isAnnouncement 
                  ? "bg-amber-500/20 text-amber-400" 
                  : "bg-[#00a884]/20 text-[#00a884]"
              )}>
                {activeGroup.isAnnouncement ? '📢' : <Hash className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{activeGroup.name}</h3>
                  {activeGroup.isAnnouncement && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                      Admin Broadcast
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#8696a0] flex items-center gap-2">
                  <span>{activeGroup.memberCount} participants</span>
                  <span>•</span>
                  <span className="text-[#00a884]">Dr. Sarah, Alex, Liam online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[#aebac1]">
              <button 
                onClick={() => setShowCommunityInfo(!showCommunityInfo)}
                className="p-2 hover:bg-[#374248] rounded-xl transition-colors text-xs flex items-center gap-1.5 text-[#00a884] font-medium"
              >
                <Users className="w-4 h-4" />
                <span>Participants ({activeGroup.memberCount})</span>
              </button>
              <button 
                onClick={() => setShowCommunityInfo(!showCommunityInfo)}
                className="p-2 hover:bg-[#374248] rounded-xl transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
            
            {/* Encryption Notice */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#182229] text-[#ffd279] text-[11px] px-4 py-1.5 rounded-xl border border-[#ffd279]/20 flex items-center gap-2 shadow-sm max-w-md text-center">
                <Lock className="w-3 h-3 flex-shrink-0" />
                <span>Messages in this community channel are secured with end-to-end institutional protocols.</span>
              </div>
            </div>

            {activeGroup.messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col group relative max-w-[80%]",
                  msg.isSelf ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                {/* Bubble Container */}
                <div className={cn(
                  "p-3 rounded-2xl relative shadow-md transition-shadow hover:shadow-lg",
                  msg.isSelf 
                    ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none" 
                    : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                )}>
                  {/* Sender Name if not self */}
                  {!msg.isSelf && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#53bdeb]">{msg.senderName}</span>
                      {msg.senderRole && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/30 text-[#8696a0] font-mono">
                          {msg.senderRole}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Standard Text */}
                  {msg.text && (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">
                      {msg.text}
                    </p>
                  )}

                  {/* Audio Voice Note Bubble */}
                  {msg.audio && (
                    <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl mt-1 min-w-[240px]">
                      <button
                        onClick={() => {
                          if (playingAudioId === msg.id) {
                            setPlayingAudioId(null);
                          } else {
                            setPlayingAudioId(msg.id);
                          }
                        }}
                        className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white flex items-center justify-center shadow flex-shrink-0 transition-transform active:scale-95"
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Waveform Visualization */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-0.5 h-6">
                          {msg.audio.waveform.map((height, i) => {
                            const isPassed = playingAudioId === msg.id && (i / msg.audio!.waveform.length) * 100 <= audioProgress;
                            return (
                              <div
                                key={i}
                                className={cn(
                                  "w-1 rounded-full transition-all duration-150",
                                  isPassed ? "bg-[#00a884]" : "bg-white/30"
                                )}
                                style={{ height: `${height}%` }}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[10px] text-[#8696a0] font-mono">
                          <span>{playingAudioId === msg.id ? `${Math.floor((audioProgress / 100) * 34)}s` : msg.audio.duration}</span>
                          <button 
                            onClick={() => setAudioPlaybackSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
                            className="hover:text-white px-1 rounded bg-black/40"
                          >
                            {audioPlaybackSpeed}x
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Attachment Card */}
                  {msg.file && (
                    <div className="mt-2 p-3 bg-black/30 rounded-xl border border-white/10 flex items-center justify-between gap-3 min-w-[260px]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{msg.file.name}</div>
                          <div className="text-[10px] text-[#8696a0]">{msg.file.size} • {msg.file.type.toUpperCase()}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`Downloading verified attachment: ${msg.file?.name}`)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* WhatsApp Poll Component */}
                  {msg.poll && (
                    <div className="mt-2 p-3.5 bg-black/30 rounded-xl border border-white/10 space-y-3 min-w-[280px]">
                      <div className="flex items-center gap-2 text-[#00a884]">
                        <Vote className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Community Poll</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{msg.poll.question}</h4>
                      <div className="space-y-2">
                        {msg.poll.options.map(opt => {
                          const percent = msg.poll!.totalVotes > 0 
                            ? Math.round((opt.votes / msg.poll!.totalVotes) * 100) 
                            : 0;
                          const isVoted = msg.poll?.userVotedOptionId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleVotePoll(msg.id, opt.id)}
                              className={cn(
                                "w-full text-left p-2.5 rounded-lg border text-xs relative overflow-hidden transition-all flex items-center justify-between",
                                isVoted 
                                  ? "border-[#00a884] bg-[#00a884]/15" 
                                  : "border-white/10 hover:border-white/20 bg-white/5"
                              )}
                            >
                              <div 
                                className="absolute left-0 top-0 bottom-0 bg-[#00a884]/20 transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                              <div className="relative z-10 flex items-center gap-2">
                                <div className={cn(
                                  "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                                  isVoted ? "border-[#00a884] bg-[#00a884]" : "border-white/40"
                                )}>
                                  {isVoted && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                                </div>
                                <span className={isVoted ? "font-bold text-white" : "text-[#e9edef]"}>{opt.text}</span>
                              </div>
                              <span className="relative z-10 text-[11px] font-mono text-[#8696a0]">
                                {percent}% ({opt.votes})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-[10px] text-[#8696a0] flex justify-between pt-1 border-t border-white/5 font-mono">
                        <span>{msg.poll.totalVotes} total votes</span>
                        <span>Tap option to vote or change</span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Double Checkmarks */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#8696a0] font-mono select-none">
                    <span>{msg.timestamp}</span>
                    {msg.isSelf && (
                      <CheckCheck className={cn(
                        "w-3.5 h-3.5",
                        msg.status === 'read' ? "text-[#53bdeb]" : "text-[#8696a0]"
                      )} />
                    )}
                  </div>
                </div>

                {/* Reactions Display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1 -mt-2 z-10 px-1">
                    {msg.reactions.map((r, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 rounded-full bg-[#1f2c34] text-[11px] border border-[#2a3942] shadow-sm flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] text-white/70 font-bold">{r.count}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick Reaction Hover Bar */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4 right-2 bg-[#202c33] border border-[#2a3942] rounded-full px-2 py-0.5 flex items-center gap-1 shadow-xl z-20">
                  {['👍', '❤️', '🔬', '💡', '🚀'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReactToMessage(msg.id, emoji)}
                      className="hover:scale-125 transition-transform text-xs p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Overlay */}
          <AnimatePresence>
            {isRecordingVoice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-[#202c33] p-4 border-t border-[#2a3942] flex items-center justify-between relative z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-red-400 font-bold text-xs uppercase tracking-wider">
                    Recording Audio Memo...
                  </span>
                  <span className="font-mono text-xs text-white">0:{recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsRecordingVoice(false)}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="px-5 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Audio</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input Bar */}
          {!isRecordingVoice && (
            <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-3 relative z-20">
              
              {/* Emoji Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-[#374248] rounded-xl text-[#8696a0] hover:text-white transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-14 left-0 bg-[#202c33] border border-[#2a3942] p-2 rounded-2xl shadow-2xl flex gap-1 z-50">
                    {['👍', '❤️', '👏', '🔬', '🌱', '🚀', '📊', '💡'].map(em => (
                      <button
                        key={em}
                        onClick={() => {
                          setMessageInput(prev => prev + em);
                          setShowEmojiPicker(false);
                        }}
                        className="text-lg p-1.5 hover:bg-white/10 rounded-lg hover:scale-125 transition-transform"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Attachment Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 hover:bg-[#374248] rounded-xl text-[#8696a0] hover:text-white transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                {showAttachMenu && (
                  <div className="absolute bottom-14 left-0 bg-[#202c33] border border-[#2a3942] p-2 rounded-2xl shadow-2xl flex flex-col gap-1 w-44 z-50">
                    <button
                      onClick={() => {
                        setMessageInput(prev => prev + ' [Document attached: Research_Report.pdf]');
                        setShowAttachMenu(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded-xl"
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>Document / Paper</span>
                    </button>
                    <button
                      onClick={() => {
                        setMessageInput(prev => prev + ' [Sensor Telemetry Dataset Attached]');
                        setShowAttachMenu(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded-xl"
                    >
                      <Share2 className="w-4 h-4 text-emerald-400" />
                      <span>Dataset Link</span>
                    </button>
                    <button
                      onClick={() => {
                        setMessageInput(prev => prev + ' [Poll: What should our team focus on next?]');
                        setShowAttachMenu(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/10 rounded-xl"
                    >
                      <Vote className="w-4 h-4 text-amber-400" />
                      <span>Create Poll</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <form onSubmit={handleSendMessage} className="flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Type a message or paste research link..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  className="w-full bg-[#2a3942] text-white placeholder-[#8696a0] px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </form>

              {/* Mic / Send Button */}
              {messageInput.trim() ? (
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  title="Record voice note"
                  className="w-10 h-10 rounded-xl bg-[#2a3942] hover:bg-[#00a884] text-[#8696a0] hover:text-white flex items-center justify-center transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Drawer: Community & Group Information */}
        <AnimatePresence>
          {showCommunityInfo && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#111b21] border-l border-[#222e35] flex flex-col overflow-y-auto flex-shrink-0"
            >
              <div className="p-4 border-b border-[#222e35] flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">Community Info</h4>
                <button onClick={() => setShowCommunityInfo(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4 text-[#8696a0]" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div className="text-center space-y-2">
                  <img
                    src={activeCommunity.avatar}
                    alt={activeCommunity.name}
                    className="w-20 h-20 rounded-3xl mx-auto object-cover border-2 border-[#00a884]"
                  />
                  <h3 className="font-bold text-base text-white">{activeCommunity.name}</h3>
                  <p className="text-xs text-[#8696a0]">{activeCommunity.tagline}</p>
                </div>

                <div className="bg-[#202c33] p-4 rounded-2xl space-y-2 border border-[#2a3942]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#00a884]">
                    Verification Status
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <ShieldCheck className="w-4 h-4 text-[#00a884]" />
                    <span>Verified Academic Collective</span>
                  </div>
                  <p className="text-[11px] text-[#8696a0]">
                    Managed under Glacier Network Protocol with 8 verified participating universities.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Sub-Groups in Community</span>
                    <span className="text-[#00a884]">{activeCommunity.groups.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {activeCommunity.groups.map(g => (
                      <div
                        key={g.id}
                        onClick={() => setSelectedGroupId(g.id)}
                        className={cn(
                          "p-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between transition-colors",
                          g.id === selectedGroupId ? "bg-[#2a3942] text-[#00a884] font-bold" : "hover:bg-[#202c33] text-[#e9edef]"
                        )}
                      >
                        <span className="truncate">{g.name}</span>
                        <span className="text-[10px] text-[#8696a0] font-mono">{g.memberCount} members</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowNewGroupModal(true)}
                    className="w-full py-2.5 rounded-xl border border-[#00a884]/40 text-[#00a884] hover:bg-[#00a884]/10 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Sub-Group</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Group Modal */}
      <AnimatePresence>
        {showNewGroupModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewGroupModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#202c33] p-6 rounded-3xl border border-[#2a3942] shadow-2xl space-y-5 text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#00a884]" />
                  <h3 className="font-bold text-base">Create Sub-Group</h3>
                </div>
                <button onClick={() => setShowNewGroupModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#8696a0]">Sub-Group Subject / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ocean Alkalinity Testing"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    className="w-full bg-[#111b21] border border-[#2a3942] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00a884]"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#111b21] rounded-xl border border-[#2a3942]">
                  <input
                    type="checkbox"
                    id="announcementCheck"
                    checked={newGroupIsAnnouncement}
                    onChange={e => setNewGroupIsAnnouncement(e.target.checked)}
                    className="w-4 h-4 accent-[#00a884] rounded"
                  />
                  <label htmlFor="announcementCheck" className="text-xs text-[#e9edef] cursor-pointer">
                    <span className="font-bold block">Announcement Channel</span>
                    <span className="text-[11px] text-[#8696a0]">Only community admins can send messages.</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewGroupModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00a884] hover:bg-[#00a884]/90 text-black font-bold text-xs shadow-lg transition-transform active:scale-95"
                  >
                    Create Sub-Group
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
