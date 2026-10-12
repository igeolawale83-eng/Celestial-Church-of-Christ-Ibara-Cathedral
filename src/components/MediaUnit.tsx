import React, { useState } from 'react';
import {
  Video,
  Radio,
  Tv,
  Mic,
  Volume2,
  Plus,
  Trash,
  Eye,
  Users,
  Cpu,
  FileText,
  Share2,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Play,
  Check,
  Signal,
  Laptop,
  Lightbulb,
  PlusCircle,
  Clock,
  ExternalLink,
  Square,
  UserPlus,
  Trash2,
  Shield,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { LiveStreamSession, MediaEquipment, MediaPublication, MediaCrew, UnitExecutive } from '../types';
import { initialStreams, initialMediaEquipment, initialMediaPublications, initialMediaCrew, initialMediaExecutives } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface MediaUnitProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function MediaUnit({ onNavigateToSecretariat, onNavigateToMainDashboard }: MediaUnitProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [streams, setStreams] = useState<LiveStreamSession[]>(initialStreams);
  const [equipment, setEquipment] = useState<MediaEquipment[]>(initialMediaEquipment);
  const [publications, setPublications] = useState<MediaPublication[]>(initialMediaPublications);
  const [crew, setCrew] = useState<MediaCrew[]>(initialMediaCrew);
  const [executives, setExecutives] = useState<UnitExecutive[]>(initialMediaExecutives);
  const [isAddingExec, setIsAddingExec] = useState(false);

  const [newExec, setNewExec] = useState({
    name: '',
    rank: 'Brother',
    office: '',
    contact: '',
    status: 'Active' as UnitExecutive['status']
  });

  // Filter states
  const [eqCategoryFilter, setEqCategoryFilter] = useState<string>('All');
  const [pubSearchQuery, setPubSearchQuery] = useState<string>('');

  // Dialog overlays state
  const [isAddingStream, setIsAddingStream] = useState(false);
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [isAddingPublication, setIsAddingPublication] = useState(false);
  const [isAddingCrew, setIsAddingCrew] = useState(false);

  // Form states
  const [newStream, setNewStream] = useState({
    title: '',
    platform: 'YouTube' as LiveStreamSession['platform'],
    status: 'Scheduled' as LiveStreamSession['status'],
    time: '10:00 AM',
    date: 'Next Sunday'
  });

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    category: 'Video' as MediaEquipment['category'],
    status: 'Operational' as MediaEquipment['status'],
    assignedCrew: 'None'
  });

  const [newPublication, setNewPublication] = useState({
    title: '',
    type: 'Video Sermon' as MediaPublication['type'],
    platform: 'YouTube',
    status: 'Draft' as MediaPublication['status'],
    downloadsOrViews: 0
  });

  const [newCrewMember, setNewCrewMember] = useState({
    name: '',
    role: 'Camera Operator' as MediaCrew['role'],
    status: 'Active' as MediaCrew['status'],
    contact: ''
  });

  // Handlers
  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStream.title.trim()) {
      alert('Please enter stream title.');
      return;
    }
    const created: LiveStreamSession = {
      id: `STR-0${streams.length + 1}`,
      title: newStream.title,
      platform: newStream.platform,
      status: newStream.status,
      viewers: newStream.status === 'Live' ? Math.floor(50 + Math.random() * 400) : 0,
      date: newStream.date,
      time: newStream.time
    };
    setStreams([created, ...streams]);
    setIsAddingStream(false);
    setNewStream({ title: '', platform: 'YouTube', status: 'Scheduled', time: '10:00 AM', date: 'Next Sunday' });
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquipment.name.trim()) {
      alert('Please enter equipment name.');
      return;
    }
    const created: MediaEquipment = {
      id: `EQP-0${equipment.length + 1}`,
      name: newEquipment.name,
      category: newEquipment.category,
      status: newEquipment.status,
      assignedCrew: newEquipment.assignedCrew
    };
    setEquipment([...equipment, created]);
    setIsAddingEquipment(false);
    setNewEquipment({ name: '', category: 'Video', status: 'Operational', assignedCrew: 'None' });
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPublication.title.trim()) {
      alert('Please enter publication title.');
      return;
    }
    const created: MediaPublication = {
      id: `PUB-0${publications.length + 1}`,
      title: newPublication.title,
      date: 'Today',
      type: newPublication.type,
      platform: newPublication.platform,
      status: newPublication.status,
      downloadsOrViews: newPublication.downloadsOrViews
    };
    setPublications([created, ...publications]);
    setIsAddingPublication(false);
    setNewPublication({ title: '', type: 'Video Sermon', platform: 'YouTube', status: 'Draft', downloadsOrViews: 0 });
  };

  const handleAddCrew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrewMember.name.trim()) {
      alert('Please enter crew member name.');
      return;
    }
    const created: MediaCrew = {
      id: `CRW-0${crew.length + 1}`,
      name: newCrewMember.name,
      initials: newCrewMember.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      role: newCrewMember.role,
      status: newCrewMember.status,
      contact: newCrewMember.contact || '+1 (555) 000-0000'
    };
    setCrew([...crew, created]);
    setIsAddingCrew(false);
    setNewCrewMember({ name: '', role: 'Camera Operator', status: 'Active', contact: '' });
  };

  const handleToggleStreamState = (id: string) => {
    setStreams(streams.map(s => {
      if (s.id === id) {
        if (s.status === 'Live') {
          return { ...s, status: 'Ended', viewers: 0 };
        } else if (s.status === 'Scheduled') {
          return { ...s, status: 'Live', viewers: Math.floor(100 + Math.random() * 300) };
        } else {
          return { ...s, status: 'Scheduled', viewers: 0 };
        }
      }
      return s;
    }));
  };

  const handleEquipmentStatusChange = (id: string, status: MediaEquipment['status']) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, status } : e));
  };

  const handleCrewStatusChange = (id: string, status: MediaCrew['status']) => {
    setCrew(crew.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleAddExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExec.name || !newExec.office || !newExec.contact) {
      alert('Please fill out all fields.');
      return;
    }
    const created: UnitExecutive = {
      id: `MEX-0${executives.length + 1}`,
      name: newExec.name,
      rank: newExec.rank,
      office: newExec.office,
      contact: newExec.contact,
      status: newExec.status
    };
    setExecutives([...executives, created]);
    setIsAddingExec(false);
    setNewExec({
      name: '',
      rank: 'Brother',
      office: '',
      contact: '',
      status: 'Active'
    });
  };

  const handleDeleteExec = (id: string) => {
    if (confirm('Are you sure you want to delete this executive?')) {
      setExecutives(executives.filter(e => e.id !== id));
    }
  };

  const handleDeletePublication = (id: string) => {
    setPublications(publications.filter(p => p.id !== id));
  };

  // Metrics
  const activeStreamsCount = streams.filter(s => s.status === 'Live').length;
  const currentTotalViewers = streams.reduce((sum, s) => sum + s.viewers, 0);
  const operationalEquipmentCount = equipment.filter(e => e.status === 'Operational' || e.status === 'In Use').length;
  const equipmentOperationalRate = Math.round((operationalEquipmentCount / equipment.length) * 100) || 100;
  const activeCrewCount = crew.filter(c => c.status === 'Active').length;

  const filteredEquipment = equipment.filter(e => {
    if (eqCategoryFilter === 'All') return true;
    return e.category === eqCategoryFilter;
  });

  const filteredPublications = publications.filter(p => {
    return p.title.toLowerCase().includes(pubSearchQuery.toLowerCase()) || p.type.toLowerCase().includes(pubSearchQuery.toLowerCase());
  });

  const getEquipmentIcon = (category: MediaEquipment['category']) => {
    switch (category) {
      case 'Video': return <Video className="w-4 h-4 text-[#3B82F6]" />;
      case 'Audio': return <Mic className="w-4 h-4 text-emerald-600" />;
      case 'Lighting': return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case 'Computing': return <Laptop className="w-4 h-4 text-purple-600" />;
      default: return <Cpu className="w-4 h-4 text-[#64748B]" />;
    }
  };

  return (
    <div className="space-y-6" id="media-unit-container">
      {/* Media Team Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Video className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Broadcast & Communications Board
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Live Streaming • Audiovisuals • Digital Publications
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Media Team
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Broadcasting Celestial Church of Christ Ibara Cathedral globally via multi-channel streaming, audio production, recording, and multimedia evangelism.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToMainDashboard && (
              <button
                onClick={onNavigateToMainDashboard}
                className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all border border-white/30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Main Dashboard</span>
              </button>
            )}

            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-[#1E3A8A] px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback to Church Sec</span>
            </button>

            <button
              onClick={() => setIsExecutiveModalOpen(true)}
              className="bg-white hover:bg-blue-50 text-[#1E3A8A] px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all shadow-md flex items-center gap-2 border border-blue-200"
            >
              <Shield className="w-4 h-4 text-blue-700" />
              <span>3-Key Executive Portal</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">
                Chair • Sec • Treas
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="media-unit-metrics">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[#64748B] text-xs uppercase tracking-wider font-bold block mb-1">Live Broadcasts</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1E293B]">
                {activeStreamsCount > 0 ? `${activeStreamsCount} Active` : 'Offline'}
              </span>
              {activeStreamsCount > 0 && (
                <span className="text-emerald-500 text-xs font-bold font-mono flex items-center gap-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#64748B] mt-1 block">
              {currentTotalViewers > 0 ? `${currentTotalViewers} total viewers` : 'No viewers online'}
            </span>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[#64748B] text-xs uppercase tracking-wider font-bold block mb-1">Equipment Health</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1E293B]">{equipmentOperationalRate}%</span>
              <span className="text-emerald-500 text-xs font-bold font-mono">Stable</span>
            </div>
            <span className="text-[10px] text-[#64748B] mt-1 block">
              {operationalEquipmentCount} of {equipment.length} assets operational
            </span>
          </div>
          <div className="p-3 bg-[#EFF6FF] text-[#3B82F6] rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[#64748B] text-xs uppercase tracking-wider font-bold block mb-1">Total Reach</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1E293B]">
                {publications.reduce((sum, p) => sum + p.downloadsOrViews, 0).toLocaleString()}
              </span>
              <span className="text-emerald-500 text-xs font-bold font-mono">+12.4%</span>
            </div>
            <span className="text-[10px] text-[#64748B] mt-1 block">
              Across sermon archives & newsletters
            </span>
          </div>
          <div className="p-3 bg-[#FEFCE8] text-[#CA8A04] rounded-xl">
            <Share2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[#64748B] text-xs uppercase tracking-wider font-bold block mb-1">Media Crew</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1E293B]">{activeCrewCount} On Duty</span>
              <span className="text-indigo-500 text-xs font-bold font-mono">Staffed</span>
            </div>
            <span className="text-[10px] text-[#64748B] mt-1 block">
              {crew.filter(c => c.status === 'On Call').length} standby operators
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Stream Scheduler & Broadcast Status */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden" id="streams-broadcast-status">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A]">Parish Streams & Live Broadcasts</h3>
            <p className="font-sans text-xs text-[#64748B]">Schedule and control live streams for services and vigils.</p>
          </div>
          <button
            onClick={() => setIsAddingStream(true)}
            id="add-stream-btn"
            className="bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-sans text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Schedule Stream
          </button>
        </div>

        <div className="p-6 divide-y divide-[#E2E8F0]">
          {streams.map((stream) => {
            const isLive = stream.status === 'Live';
            return (
              <div key={stream.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${isLive ? 'bg-red-50 text-red-600 animate-pulse' : stream.status === 'Scheduled' ? 'bg-[#FEFCE8] text-[#CA8A04]' : 'bg-slate-100 text-slate-500'}`}>
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-sans text-sm font-bold text-[#1E293B]">{stream.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${isLive ? 'bg-red-100 text-red-700 animate-pulse' : stream.status === 'Scheduled' ? 'bg-amber-100 text-[#CA8A04]' : 'bg-slate-200 text-slate-700'}`}>
                        {stream.status.toUpperCase()}
                      </span>
                      <span className="bg-[#EFF6FF] text-[#3B82F6] text-[10px] px-2 py-0.5 rounded font-semibold">
                        {stream.platform}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 font-sans">
                      Scheduled: <span className="font-semibold text-[#1E293B]">{stream.date}</span> at <span className="font-semibold text-[#1E293B]">{stream.time}</span>
                      {isLive && stream.viewers > 0 && (
                        <span className="ml-3 font-semibold text-red-600">
                          • {stream.viewers.toLocaleString()} active live viewers
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <button
                    onClick={() => handleToggleStreamState(stream.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                      isLive 
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' 
                        : 'bg-white text-[#1E3A8A] hover:bg-[#F8FAFC] border-[#E2E8F0]'
                    }`}
                  >
                    {isLive ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-red-700 text-red-700" /> Stop Broadcast
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-[#1E3A8A] text-[#1E3A8A]" /> Go Live Now
                      </>
                    )}
                  </button>
                  {isLive && (
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#3B82F6] hover:text-white rounded-lg transition-colors"
                      title="View Public Stream Feed"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipment and Crew Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="media-unit-split-view">
        {/* Equipment Ledger (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-[520px]" id="equipment-ledger-sec">
          <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1E3A8A]">Equipment Inventory Registry</h3>
              <p className="font-sans text-xs text-[#64748B]">Monitor health, assignment, and repairs of media physical assets.</p>
            </div>
            <button
              onClick={() => setIsAddingEquipment(true)}
              id="add-equipment-btn"
              className="bg-[#1E293B] hover:bg-black text-white font-sans text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Asset
            </button>
          </div>

          {/* Categories Tab selector */}
          <div className="px-5 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex gap-1.5 overflow-x-auto shrink-0">
            {['All', 'Video', 'Audio', 'Lighting', 'Computing'].map((cat) => (
              <button
                key={cat}
                onClick={() => setEqCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  eqCategoryFilter === cat
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {filteredEquipment.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 text-[#64748B]">
                <Cpu className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No equipment registered under this category.</p>
              </div>
            ) : (
              filteredEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="border border-[#E2E8F0] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                      {getEquipmentIcon(eq.category)}
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                        {eq.name}
                        <span className="font-mono text-[9px] text-[#64748B] bg-slate-100 px-1.5 py-0.5 rounded">
                          {eq.id}
                        </span>
                      </h4>
                      <p className="text-[10px] text-[#64748B] mt-1">
                        Category: <span className="font-semibold">{eq.category}</span> • Assigned operator: <span className="font-semibold text-[#1E3A8A]">{eq.assignedCrew}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <select
                      value={eq.status}
                      onChange={(e) => handleEquipmentStatusChange(eq.id, e.target.value as any)}
                      className={`bg-white border rounded-lg px-2 py-1 font-sans text-[10px] font-bold ${
                        eq.status === 'Operational'
                          ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
                          : eq.status === 'In Use'
                          ? 'text-[#2563EB] border-[#DBEAFE] bg-[#EFF6FF]'
                          : eq.status === 'Needs Service'
                          ? 'text-[#CA8A04] border-amber-200 bg-[#FEFCE8]'
                          : 'text-red-700 border-red-200 bg-red-50'
                      }`}
                    >
                      <option value="Operational">Operational</option>
                      <option value="In Use">In Use</option>
                      <option value="Needs Service">Needs Service</option>
                      <option value="Damaged">Damaged / Offline</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Media Crew Roster (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-[520px]" id="crew-roster-sec">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1E3A8A]">Volunteer Crew Roster</h3>
              <p className="font-sans text-xs text-[#64748B]">Assigned duties, call-times and duty statuses.</p>
            </div>
            <button
              onClick={() => setIsAddingCrew(true)}
              id="add-crew-btn"
              className="bg-[#EFF6FF] hover:bg-[#3B82F6] hover:text-white text-[#2563EB] font-sans text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Enlist
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {crew.map((member) => (
              <div key={member.id} className="border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#DBEAFE] border border-[#3B82F6] text-[#1E3A8A] flex items-center justify-center font-bold text-xs font-sans">
                    {member.initials}
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-[#1E293B]">{member.name}</h4>
                    <p className="text-[10px] text-[#64748B]">
                      {member.role} • <span className="font-mono text-[9px]">{member.contact}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <select
                    value={member.status}
                    onChange={(e) => handleCrewStatusChange(member.id, e.target.value as any)}
                    className={`bg-white border rounded-lg px-1.5 py-0.5 text-[9px] font-bold ${
                      member.status === 'Active'
                        ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
                        : member.status === 'On Call'
                        ? 'text-amber-700 border-amber-200 bg-amber-50'
                        : 'text-slate-500 border-slate-200 bg-slate-50'
                    }`}
                  >
                    <option value="Active">Active Duty</option>
                    <option value="On Call">On Call</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Publications Ledger */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden" id="publications-ledger-sec">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A]">Sermon Archives & Media Publications</h3>
            <p className="font-sans text-xs text-[#64748B]">Logs of published newsletters, podcast series, and social media sermon clips.</p>
          </div>
          <div className="flex gap-2.5 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search publications..."
              value={pubSearchQuery}
              onChange={(e) => setPubSearchQuery(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs w-full sm:w-48 focus:outline-none focus:border-[#3B82F6]"
            />
            <button
              onClick={() => setIsAddingPublication(true)}
              id="publish-media-btn"
              className="bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-sans text-xs px-3.5 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> Publish New
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Title / Sermon Name</th>
                <th className="p-4">Media Type</th>
                <th className="p-4">Platform Channel</th>
                <th className="p-4">Publication Status</th>
                <th className="p-4 text-right pr-6">Reach / Views</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredPublications.map((pub) => (
                <tr key={pub.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-4 pl-6 font-mono text-[#64748B]">{pub.id}</td>
                  <td className="p-4 font-bold text-[#1E293B]">{pub.title}</td>
                  <td className="p-4 text-[#64748B]">{pub.type}</td>
                  <td className="p-4 text-[#1E293B] font-semibold">{pub.platform}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                      pub.status === 'Published'
                        ? 'bg-[#DBEAFE] text-[#2563EB]'
                        : pub.status === 'Scheduled'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {pub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6 font-semibold font-mono text-[#1E293B]">
                    {pub.downloadsOrViews.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeletePublication(pub.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete publication record"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPublications.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#64748B] font-sans">
                    No matching publications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Media Unit Executive Committee Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="media-executives-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Media Unit Executive Committee
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official roster of leadership overseeing live streams, broadcasting, audio quality, and content distribution.</p>
          </div>
          <button
            onClick={() => setIsAddingExec(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-media-exec-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Media Executive
          </button>
        </div>

        {/* Executives Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                <th className="py-3 px-4">Media Office</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {executives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No media executives registered yet. Click "Add Media Executive" to get started.
                  </td>
                </tr>
              ) : (
                executives.map((exec) => (
                  <tr key={exec.id} className="hover:bg-celestial-offwhite/30 transition-colors">
                    <td className="py-4 px-4 font-semibold text-celestial-blue-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold font-sans text-xs shrink-0">
                          {exec.name.split(' ').filter(p => !p.includes('.')).map(n => n[0]).join('') || exec.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-celestial-blue-900">{exec.name}</span>
                          <span className="text-[10px] text-celestial-gray-400 font-normal font-mono">{exec.rank}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-700 font-medium font-sans">
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded text-[11px] font-semibold">
                        {exec.office}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-600 font-mono">
                      {exec.contact}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        exec.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : exec.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-celestial-gray-200 text-celestial-gray-500 font-medium'
                      }`}>
                        {exec.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteExec(exec.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center gap-1"
                        title="Delete Executive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Media Executive Dialog Overlay */}
      {isAddingExec && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Media Executive
            </h3>
            <form onSubmit={handleAddExec} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. David Fagbemi"
                  value={newExec.name}
                  onChange={(e) => setNewExec({ ...newExec, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Rank / Title</label>
                  <select
                    value={newExec.rank}
                    onChange={(e) => setNewExec({ ...newExec, rank: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Superior Evangelist">Superior Evangelist</option>
                    <option value="Most Senior Evangelist">Most Senior Evangelist</option>
                    <option value="Senior Evangelist">Senior Evangelist</option>
                    <option value="Evangelist">Evangelist</option>
                    <option value="Leader">Leader</option>
                    <option value="Senior Leader">Senior Leader</option>
                    <option value="Wolader">Wolader</option>
                    <option value="Senior Elder Brother">Senior Elder Brother</option>
                    <option value="Elder Brother">Elder Brother</option>
                    <option value="Elder Sister">Elder Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Status</label>
                  <select
                    value={newExec.status}
                    onChange={(e) => setNewExec({ ...newExec, status: e.target.value as any })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Media Office / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Media Director, Chief Audio Engineer, Social Media Manager"
                  value={newExec.office}
                  onChange={(e) => setNewExec({ ...newExec, office: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +234 803 111 2222"
                  value={newExec.contact}
                  onChange={(e) => setNewExec({ ...newExec, contact: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingExec(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Executive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay modal structures with form validation & Professional Polish styling */}

      {/* Stream Form Modal */}
      {isAddingStream && (
        <div className="fixed inset-0 bg-[#1E293B]/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-[#E2E8F0]">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4">Schedule Live Stream</h3>
            <form onSubmit={handleAddStream} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Service Title / Theme</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wednesday Mercy Service - Seek Thy Face"
                  value={newStream.title}
                  onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Target Platform</label>
                  <select
                    value={newStream.platform}
                    onChange={(e) => setNewStream({ ...newStream, platform: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook Live">Facebook Live</option>
                    <option value="Instagram Live">Instagram Live</option>
                    <option value="Mixed Stream">Mixed Stream (Multi)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Starting Status</label>
                  <select
                    value={newStream.status}
                    onChange={(e) => setNewStream({ ...newStream, status: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Live">Start Live Instantly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Scheduled Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next Sunday"
                    value={newStream.date}
                    onChange={(e) => setNewStream({ ...newStream, date: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM"
                    value={newStream.time}
                    onChange={(e) => setNewStream({ ...newStream, time: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddingStream(false)}
                  className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#1E3A8A]"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Form Modal */}
      {isAddingEquipment && (
        <div className="fixed inset-0 bg-[#1E293B]/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-[#E2E8F0]">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4">Register Media Equipment Asset</h3>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Asset Name / Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony FX3 Cinema Camera"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Equipment Category</label>
                  <select
                    value={newEquipment.category}
                    onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Video">Video / Camera</option>
                    <option value="Audio">Audio / Mixer</option>
                    <option value="Lighting">Lighting Studio</option>
                    <option value="Computing">Computing / Encoding</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Initial Status</label>
                  <select
                    value={newEquipment.status}
                    onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Operational">Operational</option>
                    <option value="In Use">In Use</option>
                    <option value="Needs Service">Needs Service</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Assigned Operator (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Bro. Elijah or None"
                  value={newEquipment.assignedCrew}
                  onChange={(e) => setNewEquipment({ ...newEquipment, assignedCrew: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddingEquipment(false)}
                  className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E293B] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-black"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publication Form Modal */}
      {isAddingPublication && (
        <div className="fixed inset-0 bg-[#1E293B]/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-[#E2E8F0]">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4">Add Media Publication Record</h3>
            <form onSubmit={handleAddPublication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Publication Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Power Clinic: Overcoming Spiritual Hindrances"
                  value={newPublication.title}
                  onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Media Format Type</label>
                  <select
                    value={newPublication.type}
                    onChange={(e) => setNewPublication({ ...newPublication, type: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Video Sermon">Video Sermon</option>
                    <option value="Audio Sermon">Audio Sermon</option>
                    <option value="Audio Podcast">Audio Podcast</option>
                    <option value="Newsletter">Newsletter / Digest</option>
                    <option value="Social Clip">Social Clip (Shorts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Distribution Channels</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spotify / YouTube"
                    value={newPublication.platform}
                    onChange={(e) => setNewPublication({ ...newPublication, platform: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Initial Status</label>
                  <select
                    value={newPublication.status}
                    onChange={(e) => setNewPublication({ ...newPublication, status: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Views / Downloads Count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 150"
                    value={newPublication.downloadsOrViews}
                    onChange={(e) => setNewPublication({ ...newPublication, downloadsOrViews: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddingPublication(false)}
                  className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#2563EB]"
                >
                  Publish Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crew Enlistment Modal */}
      {isAddingCrew && (
        <div className="fixed inset-0 bg-[#1E293B]/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-[#E2E8F0]">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4">Enlist Volunteer Media Crew</h3>
            <form onSubmit={handleAddCrew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Stephen Lawson"
                  value={newCrewMember.name}
                  onChange={(e) => setNewCrewMember({ ...newCrewMember, name: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Assigned Crew Role</label>
                  <select
                    value={newCrewMember.role}
                    onChange={(e) => setNewCrewMember({ ...newCrewMember, role: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Camera Operator">Camera Operator</option>
                    <option value="Sound Engineer">Sound Engineer</option>
                    <option value="Stream Director">Stream Director</option>
                    <option value="Presenter">Presenter / Compere</option>
                    <option value="Projectionist">Projectionist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1">Duty Status</label>
                  <select
                    value={newCrewMember.status}
                    onChange={(e) => setNewCrewMember({ ...newCrewMember, status: e.target.value as any })}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="On Call">On Call</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Contact Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +1 (555) 987-6543"
                  value={newCrewMember.contact}
                  onChange={(e) => setNewCrewMember({ ...newCrewMember, contact: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddingCrew(false)}
                  className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#1E3A8A]"
                >
                  Enlist Crew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="media"
        departmentName="Media Team"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="media"
        departmentName="Media Team"
      />
    </div>
  );
}
