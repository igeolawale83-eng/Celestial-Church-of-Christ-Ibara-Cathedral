import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Flame,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Megaphone,
  UserPlus,
  Award,
  BookMarked,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Shield,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import {
  UnitExecutive,
  EvangelistMission,
  SermonRosterItem,
  ConvertRecord,
  OrdainedEvangelist
} from '../types';
import {
  initialEvangelistExecutives,
  initialEvangelistMissions,
  initialSermonRoster,
  initialConverts,
  initialOrdainedEvangelists
} from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface EvangelistUnitProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function EvangelistUnit({ onNavigateToSecretariat, onNavigateToMainDashboard }: EvangelistUnitProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  // State variables
  const [executives, setExecutives] = useState<UnitExecutive[]>(initialEvangelistExecutives);
  const [missions, setMissions] = useState<EvangelistMission[]>(initialEvangelistMissions);
  const [sermons, setSermons] = useState<SermonRosterItem[]>(initialSermonRoster);
  const [converts, setConverts] = useState<ConvertRecord[]>(initialConverts);
  const [ministers] = useState<OrdainedEvangelist[]>(initialOrdainedEvangelists);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'executives' | 'missions' | 'sermons' | 'converts' | 'ministers'>('executives');

  // Modal dialog states
  const [isAddingExec, setIsAddingExec] = useState(false);
  const [isAddingMission, setIsAddingMission] = useState(false);
  const [isAddingSermon, setIsAddingSermon] = useState(false);
  const [isAddingConvert, setIsAddingConvert] = useState(false);

  // Filters & searches
  const [execSearch, setExecSearch] = useState('');
  const [missionFilter, setMissionFilter] = useState<string>('all');
  const [sermonFilter, setSermonFilter] = useState<string>('all');
  const [convertFilter, setConvertFilter] = useState<string>('all');

  // Form states
  const [newExec, setNewExec] = useState({
    name: '',
    rank: 'Evangelist',
    office: 'Chairman',
    contact: '',
    status: 'Active' as UnitExecutive['status']
  });

  const [newMission, setNewMission] = useState({
    title: '',
    theme: '',
    date: new Date().toISOString().split('T')[0],
    time: '17:00 WAT',
    location: '',
    leadSpeaker: '',
    targetSouls: 100
  });

  const [newSermon, setNewSermon] = useState({
    date: new Date().toISOString().split('T')[0],
    service: 'Sunday Devotional Service',
    evangelist: '',
    rank: 'Evangelist',
    topic: '',
    scripture: ''
  });

  const [newConvert, setNewConvert] = useState({
    name: '',
    contact: '',
    outreachEvent: '',
    dateJoined: new Date().toISOString().split('T')[0],
    assignedCounselor: '',
    spiritualStage: 'New Convert' as ConvertRecord['spiritualStage'],
    notes: ''
  });

  // Executive Management Handlers
  const handleAddExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExec.name || !newExec.office || !newExec.contact) {
      alert('Please fill out all required fields for the executive.');
      return;
    }
    const created: UnitExecutive = {
      id: `EVEX-${String(executives.length + 1).padStart(2, '0')}`,
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
      rank: 'Evangelist',
      office: 'Executive Member',
      contact: '',
      status: 'Active'
    });
  };

  const handleDeleteExec = (id: string) => {
    if (confirm('Are you sure you want to remove this executive from the Evangelist Unit council?')) {
      setExecutives(executives.filter(e => e.id !== id));
    }
  };

  // Mission Handlers
  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.title || !newMission.location || !newMission.leadSpeaker) {
      alert('Please enter title, location, and lead speaker.');
      return;
    }
    const created: EvangelistMission = {
      id: `MSN-${String(missions.length + 1).padStart(2, '0')}`,
      title: newMission.title,
      theme: newMission.theme || 'Spiritual Revival',
      date: newMission.date,
      time: newMission.time,
      location: newMission.location,
      leadSpeaker: newMission.leadSpeaker,
      status: 'Upcoming',
      targetSouls: Number(newMission.targetSouls) || 50,
      soulsWon: 0
    };
    setMissions([created, ...missions]);
    setIsAddingMission(false);
    setNewMission({
      title: '',
      theme: '',
      date: new Date().toISOString().split('T')[0],
      time: '17:00 WAT',
      location: '',
      leadSpeaker: '',
      targetSouls: 100
    });
  };

  const handleUpdateMissionStatus = (id: string, status: EvangelistMission['status']) => {
    setMissions(missions.map(m => m.id === id ? { ...m, status } : m));
  };

  // Sermon Handlers
  const handleAddSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSermon.evangelist || !newSermon.topic || !newSermon.scripture) {
      alert('Please fill out evangelist, topic, and scripture reading.');
      return;
    }
    const created: SermonRosterItem = {
      id: `SRM-${String(sermons.length + 1).padStart(2, '0')}`,
      date: newSermon.date,
      service: newSermon.service,
      evangelist: newSermon.evangelist,
      rank: newSermon.rank,
      topic: newSermon.topic,
      scripture: newSermon.scripture,
      status: 'Scheduled'
    };
    setSermons([created, ...sermons]);
    setIsAddingSermon(false);
    setNewSermon({
      date: new Date().toISOString().split('T')[0],
      service: 'Sunday Devotional Service',
      evangelist: '',
      rank: 'Evangelist',
      topic: '',
      scripture: ''
    });
  };

  const handleToggleSermonStatus = (id: string) => {
    setSermons(sermons.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'Scheduled' ? 'Delivered' : 'Scheduled'
        };
      }
      return s;
    }));
  };

  // Convert Handlers
  const handleAddConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConvert.name || !newConvert.contact) {
      alert('Please provide convert name and contact.');
      return;
    }
    const created: ConvertRecord = {
      id: `CVT-${String(converts.length + 1).padStart(2, '0')}`,
      name: newConvert.name,
      contact: newConvert.contact,
      outreachEvent: newConvert.outreachEvent || 'Personal Evangelism',
      dateJoined: newConvert.dateJoined,
      assignedCounselor: newConvert.assignedCounselor || 'Evangelist Unit Counselor',
      spiritualStage: newConvert.spiritualStage,
      notes: newConvert.notes || 'Follow-up underway.'
    };
    setConverts([created, ...converts]);
    setIsAddingConvert(false);
    setNewConvert({
      name: '',
      contact: '',
      outreachEvent: '',
      dateJoined: new Date().toISOString().split('T')[0],
      assignedCounselor: '',
      spiritualStage: 'New Convert',
      notes: ''
    });
  };

  const handleUpdateConvertStage = (id: string, stage: ConvertRecord['spiritualStage']) => {
    setConverts(converts.map(c => c.id === id ? { ...c, spiritualStage: stage } : c));
  };

  // Computed metrics
  const totalExecutives = executives.length;
  const upcomingCrusades = missions.filter(m => m.status === 'Upcoming' || m.status === 'In Progress').length;
  const totalSoulsWon = missions.reduce((acc, m) => acc + m.soulsWon, 0) + converts.length;
  const activePreachersCount = ministers.filter(m => m.status === 'Active').length;

  // Filtered executive list
  const filteredExecs = executives.filter(exec => {
    return (
      exec.name.toLowerCase().includes(execSearch.toLowerCase()) ||
      exec.office.toLowerCase().includes(execSearch.toLowerCase()) ||
      exec.rank.toLowerCase().includes(execSearch.toLowerCase())
    );
  });

  // Filtered missions
  const filteredMissions = missions.filter(m => {
    if (missionFilter === 'all') return true;
    return m.status.toLowerCase() === missionFilter.toLowerCase();
  });

  // Filtered sermons
  const filteredSermons = sermons.filter(s => {
    if (sermonFilter === 'all') return true;
    return s.status.toLowerCase() === sermonFilter.toLowerCase();
  });

  // Filtered converts
  const filteredConverts = converts.filter(c => {
    if (convertFilter === 'all') return true;
    return c.spiritualStage === convertFilter;
  });

  return (
    <div className="space-y-6" id="evangelist-unit-container">
      {/* Top Banner / Unit Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <Flame className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              Celestial Church of Christ Evangelical Council
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Council of Honorary Evangelists
            </h1>
            <p className="font-sans text-xs md:text-sm text-blue-100 leading-relaxed">
              Coordinating pulpit sermon rosters, soul winning missions, revival crusades, and spiritual outreach across Ibara Cathedral Parish. Guided by the Executive Council: Chairman, Vice Chairman, Secretary, PRO, and Officers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
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

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-celestial-gray-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-semibold text-celestial-gray-500">Executive Council</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1E3A8A]">{totalExecutives}</div>
          <p className="font-sans text-[11px] text-celestial-gray-500 mt-1">Officers & coordinators</p>
        </div>

        <div className="bg-white rounded-xl border border-celestial-gray-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-semibold text-celestial-gray-500">Active Crusades / Missions</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1E3A8A]">{upcomingCrusades}</div>
          <p className="font-sans text-[11px] text-celestial-gray-500 mt-1">Scheduled revivals</p>
        </div>

        <div className="bg-white rounded-xl border border-celestial-gray-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-semibold text-celestial-gray-500">Ordained Evangelists</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1E3A8A]">{activePreachersCount}</div>
          <p className="font-sans text-[11px] text-celestial-gray-500 mt-1">Active pulpit ministers</p>
        </div>

        <div className="bg-white rounded-xl border border-celestial-gray-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-semibold text-celestial-gray-500">Souls Won & Discipled</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-700">{totalSoulsWon}</div>
          <p className="font-sans text-[11px] text-celestial-gray-500 mt-1">Registered converts & baptisms</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-celestial-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('executives')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'executives'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white text-celestial-gray-600 hover:bg-celestial-offwhite border border-celestial-gray-200'
          }`}
          id="tab-evangelist-executives"
        >
          <Users className="w-4 h-4" />
          Executive Committee ({executives.length})
        </button>

        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'missions'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white text-celestial-gray-600 hover:bg-celestial-offwhite border border-celestial-gray-200'
          }`}
          id="tab-evangelist-missions"
        >
          <Flame className="w-4 h-4" />
          Crusades & Missions ({missions.length})
        </button>

        <button
          onClick={() => setActiveTab('sermons')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'sermons'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white text-celestial-gray-600 hover:bg-celestial-offwhite border border-celestial-gray-200'
          }`}
          id="tab-evangelist-sermons"
        >
          <BookMarked className="w-4 h-4" />
          Pulpit Sermon Roster ({sermons.length})
        </button>

        <button
          onClick={() => setActiveTab('converts')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'converts'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white text-celestial-gray-600 hover:bg-celestial-offwhite border border-celestial-gray-200'
          }`}
          id="tab-evangelist-converts"
        >
          <HeartHandshake className="w-4 h-4" />
          Soul Winning & Follow-up ({converts.length})
        </button>

        <button
          onClick={() => setActiveTab('ministers')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'ministers'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white text-celestial-gray-600 hover:bg-celestial-offwhite border border-celestial-gray-200'
          }`}
          id="tab-evangelist-ministers"
        >
          <Award className="w-4 h-4" />
          Ordained Ministers Roll ({ministers.length})
        </button>
      </div>

      {/* TAB 1: EXECUTIVE COMMITTEE */}
      {activeTab === 'executives' && (
        <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="evangelist-executives-section">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" /> Evangelist Unit Executive Council
              </h3>
              <p className="font-sans text-xs text-celestial-gray-500">
                Official leadership board directing preaching itineraries, community outreaches, revival missions, and church growth.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-celestial-gray-400" />
                <input
                  type="text"
                  placeholder="Search executive, rank, role..."
                  value={execSearch}
                  onChange={(e) => setExecSearch(e.target.value)}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-celestial-blue-500"
                />
              </div>
              <button
                onClick={() => setIsAddingExec(true)}
                className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm shrink-0 transition-all"
                id="add-evangelist-exec-btn"
              >
                <UserPlus className="w-4 h-4" /> Add Executive
              </button>
            </div>
          </div>

          {/* Key Executive Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {executives.filter(e => ['Chairman', 'Vice Chairman', 'Secretary', 'PRO'].includes(e.office)).map(exec => (
              <div key={exec.id} className="bg-celestial-offwhite border border-amber-200/80 rounded-xl p-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-amber-400/10 rounded-bl-full pointer-events-none" />
                <span className="inline-block bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider mb-1.5">
                  {exec.office}
                </span>
                <h4 className="font-serif text-xs font-bold text-[#1E3A8A] truncate">{exec.name}</h4>
                <p className="text-[11px] text-celestial-gray-500 font-mono mt-0.5">{exec.contact}</p>
              </div>
            ))}
          </div>

          {/* Executives Full Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                  <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                  <th className="py-3 px-4">Evangelist Office / Role</th>
                  <th className="py-3 px-4">Direct Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-celestial-gray-100">
                {filteredExecs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                      No executives matching your search. Click "Add Executive" to register an officer.
                    </td>
                  </tr>
                ) : (
                  filteredExecs.map((exec) => {
                    const isKeyOffice = ['Chairman', 'Vice Chairman', 'Secretary', 'PRO'].includes(exec.office);
                    return (
                      <tr key={exec.id} className="hover:bg-celestial-offwhite/30 transition-colors">
                        <td className="py-4 px-4 font-semibold text-[#1E3A8A]">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-sans text-xs shrink-0 ${
                              isKeyOffice ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-50 text-blue-800'
                            }`}>
                              {exec.name.split(' ').filter(p => !p.includes('.')).map(n => n[0]).join('') || exec.name[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#1E3A8A]">{exec.name}</span>
                              <span className="text-[10px] text-celestial-gray-400 font-normal font-mono">{exec.rank}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-sans font-medium">
                          <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                            isKeyOffice 
                              ? 'bg-amber-50 text-amber-900 border-amber-200' 
                              : 'bg-blue-50 text-blue-900 border-blue-200'
                          }`}>
                            {exec.office}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-celestial-gray-600 font-mono">
                          {exec.contact}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            exec.status === 'Active'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : exec.status === 'On Leave'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-celestial-gray-200 text-celestial-gray-500'
                          }`}>
                            {exec.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteExec(exec.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center"
                            title="Remove Executive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CRUSADES & REVIVAL MISSIONS */}
      {activeTab === 'missions' && (
        <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="evangelist-missions-section">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" /> Crusades & Revival Outreach Missions
              </h3>
              <p className="font-sans text-xs text-celestial-gray-500">
                Evangelism schedules, village outreaches, hospital visitations, and open-air gospel crusades.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={missionFilter}
                onChange={(e) => setMissionFilter(e.target.value)}
                className="bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-celestial-gray-700"
              >
                <option value="all">All Missions</option>
                <option value="upcoming">Upcoming</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => setIsAddingMission(true)}
                className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                id="add-mission-btn"
              >
                <Plus className="w-4 h-4" /> Schedule Mission
              </button>
            </div>
          </div>

          {/* Missions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-celestial-offwhite/50 border border-celestial-gray-200 rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      mission.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : mission.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {mission.status}
                    </span>
                    <span className="font-mono text-[11px] text-celestial-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {mission.date}
                    </span>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-[#1E3A8A] leading-snug mb-1">
                    {mission.title}
                  </h4>
                  <p className="text-xs text-amber-700 font-medium italic mb-3">
                    "{mission.theme}"
                  </p>

                  <div className="space-y-1.5 text-xs text-celestial-gray-600 border-t border-celestial-gray-200/60 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-celestial-gray-400 shrink-0" />
                      <span className="truncate">{mission.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-celestial-gray-400 shrink-0" />
                      <span>{mission.time}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-[#1E3A8A]">
                      <Megaphone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">Lead: {mission.leadSpeaker}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-celestial-gray-200/60">
                  <div className="flex justify-between text-[11px] font-medium text-celestial-gray-500 mb-1">
                    <span>Souls Harvest:</span>
                    <span className="font-bold text-[#1E3A8A]">
                      {mission.soulsWon} / {mission.targetSouls} target
                    </span>
                  </div>
                  <div className="w-full bg-celestial-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((mission.soulsWon / (mission.targetSouls || 1)) * 100))}%`
                      }}
                    />
                  </div>

                  <div className="flex justify-end gap-1.5 mt-3 pt-2">
                    {mission.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateMissionStatus(mission.id, 'Completed')}
                        className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded transition-colors"
                      >
                        Mark Completed
                      </button>
                    )}
                    {mission.status === 'Upcoming' && (
                      <button
                        onClick={() => handleUpdateMissionStatus(mission.id, 'In Progress')}
                        className="text-[10px] font-semibold bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      >
                        Launch Mission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PULPIT SERMON ROSTER */}
      {activeTab === 'sermons' && (
        <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="evangelist-sermons-section">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-500" /> Cathedral Pulpit & Sermon Roster
              </h3>
              <p className="font-sans text-xs text-celestial-gray-500">
                Weekly preaching appointments, anchor scriptures, and doctrinal teachings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sermonFilter}
                onChange={(e) => setSermonFilter(e.target.value)}
                className="bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-celestial-gray-700"
              >
                <option value="all">All Sermons</option>
                <option value="scheduled">Scheduled</option>
                <option value="delivered">Delivered</option>
              </select>
              <button
                onClick={() => setIsAddingSermon(true)}
                className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                id="add-sermon-btn"
              >
                <Plus className="w-4 h-4" /> Assign Preacher
              </button>
            </div>
          </div>

          {/* Sermon Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                  <th className="py-3 px-4 rounded-l-lg">Date & Service</th>
                  <th className="py-3 px-4">Evangelist / Preacher</th>
                  <th className="py-3 px-4">Sermon Topic</th>
                  <th className="py-3 px-4">Scripture Text</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-celestial-gray-100">
                {filteredSermons.map((sermon) => (
                  <tr key={sermon.id} className="hover:bg-celestial-offwhite/30 transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#1E3A8A]">
                      <div className="font-mono text-xs">{sermon.date}</div>
                      <span className="text-[11px] text-celestial-gray-500 font-sans font-normal">
                        {sermon.service}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#1E3A8A]">{sermon.evangelist}</div>
                      <div className="text-[10px] text-celestial-gray-400 font-mono">{sermon.rank}</div>
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-celestial-gray-800">
                      {sermon.topic}
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-600 font-mono text-[11px]">
                      {sermon.scripture}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        sermon.status === 'Delivered'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-50 text-[#1E3A8A] border border-blue-200'
                      }`}>
                        {sermon.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                        {sermon.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggleSermonStatus(sermon.id)}
                        className="text-xs text-[#1E3A8A] hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        {sermon.status === 'Scheduled' ? 'Mark Delivered' : 'Mark Scheduled'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SOUL WINNING & CONVERT FOLLOW-UP */}
      {activeTab === 'converts' && (
        <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="evangelist-converts-section">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-500" /> Soul Winning & Convert Discipleship
              </h3>
              <p className="font-sans text-xs text-celestial-gray-500">
                Spiritual growth tracking from first encounter through Bible doctrine classes, water baptism, and full communion.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={convertFilter}
                onChange={(e) => setConvertFilter(e.target.value)}
                className="bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-celestial-gray-700"
              >
                <option value="all">All Stages</option>
                <option value="New Convert">New Convert</option>
                <option value="In Bible Doctrine Class">In Doctrine Class</option>
                <option value="Baptism Candidate">Baptism Candidate</option>
                <option value="Full Member">Full Member</option>
              </select>
              <button
                onClick={() => setIsAddingConvert(true)}
                className="bg-[#1E3A8A] hover:bg-blue-900 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                id="add-convert-btn"
              >
                <UserPlus className="w-4 h-4" /> Register New Soul
              </button>
            </div>
          </div>

          {/* Converts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                  <th className="py-3 px-4 rounded-l-lg">Convert Name & Contact</th>
                  <th className="py-3 px-4">Outreach Source</th>
                  <th className="py-3 px-4">Assigned Counselor</th>
                  <th className="py-3 px-4">Spiritual Growth Stage</th>
                  <th className="py-3 px-4 rounded-r-lg">Follow-up Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-celestial-gray-100">
                {filteredConverts.map((convert) => (
                  <tr key={convert.id} className="hover:bg-celestial-offwhite/30 transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#1E3A8A]">
                      <div className="text-xs font-bold text-[#1E3A8A]">{convert.name}</div>
                      <div className="text-[11px] text-celestial-gray-500 font-mono">{convert.contact}</div>
                      <div className="text-[10px] text-celestial-gray-400">Joined: {convert.dateJoined}</div>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-700 font-medium">
                      {convert.outreachEvent}
                    </td>
                    <td className="py-4 px-4 font-medium text-[#1E3A8A]">
                      {convert.assignedCounselor}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={convert.spiritualStage}
                        onChange={(e) => handleUpdateConvertStage(convert.id, e.target.value as any)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${
                          convert.spiritualStage === 'Full Member'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : convert.spiritualStage === 'Baptism Candidate'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : convert.spiritualStage === 'In Bible Doctrine Class'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="New Convert">New Convert</option>
                        <option value="In Bible Doctrine Class">In Bible Doctrine Class</option>
                        <option value="Baptism Candidate">Baptism Candidate</option>
                        <option value="Full Member">Full Member</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-600 text-xs italic max-w-xs">
                      {convert.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ORDAINED MINISTERS ROLL */}
      {activeTab === 'ministers' && (
        <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="evangelist-ministers-section">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Ordained Evangelists Directory
              </h3>
              <p className="font-sans text-xs text-celestial-gray-500">
                Official ministerial roster of all anointed Evangelists in Ibara Cathedral Parish.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ministers.map((minister) => (
              <div
                key={minister.id}
                className="bg-celestial-offwhite/40 border border-celestial-gray-200 rounded-xl p-5 hover:border-amber-400 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-bold font-serif text-sm">
                    {minister.name.split(' ').filter(p => !p.includes('.')).map(n => n[0]).join('') || minister.name[0]}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-serif text-xs font-bold text-[#1E3A8A] truncate">{minister.name}</h4>
                    <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                      {minister.rank}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-celestial-gray-600 pt-2 border-t border-celestial-gray-200">
                  <div className="flex justify-between">
                    <span className="text-celestial-gray-400">Assigned Territory:</span>
                    <span className="font-medium text-celestial-gray-800">{minister.assignedZone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-celestial-gray-400">Anointed Year:</span>
                    <span className="font-mono font-medium">{minister.anointingYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-celestial-gray-400">Direct Contact:</span>
                    <span className="font-mono font-medium">{minister.contact}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-celestial-gray-400">Status:</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      minister.status === 'Active'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      {minister.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIALOG 1: ADD EVANGELIST EXECUTIVE MODAL */}
      {isAddingExec && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Evangelist Executive
            </h3>
            <form onSubmit={handleAddExec} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Most Senior Evang. John Dosunmu"
                  value={newExec.name}
                  onChange={(e) => setNewExec({ ...newExec, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-celestial-blue-500"
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
                    <option value="Honorary Evangelist">Honorary Evangelist</option>
                    <option value="Senior Leader">Senior Leader</option>
                    <option value="Leader">Leader</option>
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
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Evangelist Office / Role</label>
                <select
                  value={newExec.office}
                  onChange={(e) => setNewExec({ ...newExec, office: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <option value="Chairman">Chairman</option>
                  <option value="Vice Chairman">Vice Chairman</option>
                  <option value="Secretary">Secretary</option>
                  <option value="PRO">PRO (Public Relations Officer)</option>
                  <option value="Assistant Secretary">Assistant Secretary</option>
                  <option value="Financial Secretary">Financial Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Evangelism Coordinator">Evangelism Coordinator</option>
                  <option value="Welfare Officer">Welfare Officer</option>
                  <option value="Pulpit Warden">Pulpit Warden</option>
                  <option value="Executive Member">Executive Member</option>
                </select>
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

              <div className="flex justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingExec(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Executive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG 2: SCHEDULE MISSION MODAL */}
      {isAddingMission && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" /> Schedule Revival Crusade / Mission
            </h3>
            <form onSubmit={handleAddMission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Mission / Crusade Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harvest of Miracles Open Crusade"
                  value={newMission.title}
                  onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Scriptural Theme</label>
                <input
                  type="text"
                  placeholder="e.g. The Word Made Flesh (John 1:14)"
                  value={newMission.theme}
                  onChange={(e) => setNewMission({ ...newMission, theme: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newMission.date}
                    onChange={(e) => setNewMission({ ...newMission, date: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="17:30 WAT"
                    value={newMission.time}
                    onChange={(e) => setNewMission({ ...newMission, time: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ibara Community Stadium or Outstation Parish"
                  value={newMission.location}
                  onChange={(e) => setNewMission({ ...newMission, location: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Lead Evangelist / Speaker</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Most Senior Evang. Samson Adeleke"
                    value={newMission.leadSpeaker}
                    onChange={(e) => setNewMission({ ...newMission, leadSpeaker: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Target Souls Harvest</label>
                  <input
                    type="number"
                    min="10"
                    value={newMission.targetSouls}
                    onChange={(e) => setNewMission({ ...newMission, targetSouls: parseInt(e.target.value) || 50 })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingMission(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG 3: ASSIGN PULPIT PREACHER MODAL */}
      {isAddingSermon && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-amber-500" /> Assign Pulpit Preaching Roster
            </h3>
            <form onSubmit={handleAddSermon} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Date</label>
                  <input
                    type="date"
                    required
                    value={newSermon.date}
                    onChange={(e) => setNewSermon({ ...newSermon, date: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Type</label>
                  <select
                    value={newSermon.service}
                    onChange={(e) => setNewSermon({ ...newSermon, service: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Sunday Devotional Service">Sunday Devotional</option>
                    <option value="Wednesday Mercy Service">Wednesday Mercy</option>
                    <option value="Friday Power & Healing">Friday Power & Healing</option>
                    <option value="New Moon Service">New Moon Service</option>
                    <option value="Revival & Vigil Service">Revival & Vigil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Assigned Evangelist</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Evang. John Dosunmu"
                    value={newSermon.evangelist}
                    onChange={(e) => setNewSermon({ ...newSermon, evangelist: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Evangelist Rank</label>
                  <select
                    value={newSermon.rank}
                    onChange={(e) => setNewSermon({ ...newSermon, rank: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Superior Evangelist">Superior Evangelist</option>
                    <option value="Most Senior Evangelist">Most Senior Evangelist</option>
                    <option value="Senior Evangelist">Senior Evangelist</option>
                    <option value="Evangelist">Evangelist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Sermon Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holiness in the Sanctuary"
                  value={newSermon.topic}
                  onChange={(e) => setNewSermon({ ...newSermon, topic: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Scripture Reading Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Psalm 24:3-5; 1 Peter 1:15-16"
                  value={newSermon.scripture}
                  onChange={(e) => setNewSermon({ ...newSermon, scripture: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingSermon(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG 4: REGISTER NEW CONVERT */}
      {isAddingConvert && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-500" /> Register Soul for Discipleship
            </h3>
            <form onSubmit={handleAddConvert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Convert Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Daniel Taiwo"
                  value={newConvert.name}
                  onChange={(e) => setNewConvert({ ...newConvert, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Phone Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="+234 802 000 1111"
                    value={newConvert.contact}
                    onChange={(e) => setNewConvert({ ...newConvert, contact: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Date Joined</label>
                  <input
                    type="date"
                    required
                    value={newConvert.dateJoined}
                    onChange={(e) => setNewConvert({ ...newConvert, dateJoined: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Outreach Event</label>
                  <input
                    type="text"
                    placeholder="e.g. City Revival Crusade"
                    value={newConvert.outreachEvent}
                    onChange={(e) => setNewConvert({ ...newConvert, outreachEvent: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Discipleship Stage</label>
                  <select
                    value={newConvert.spiritualStage}
                    onChange={(e) => setNewConvert({ ...newConvert, spiritualStage: e.target.value as any })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="New Convert">New Convert</option>
                    <option value="In Bible Doctrine Class">In Bible Doctrine Class</option>
                    <option value="Baptism Candidate">Baptism Candidate</option>
                    <option value="Full Member">Full Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Assigned Counselor</label>
                <input
                  type="text"
                  placeholder="e.g. Evang. Emmanuel Bamidele"
                  value={newConvert.assignedCounselor}
                  onChange={(e) => setNewConvert({ ...newConvert, assignedCounselor: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Notes / Spiritual Requests</label>
                <textarea
                  rows={2}
                  placeholder="Needs Bible study guidance, prayer for family..."
                  value={newConvert.notes}
                  onChange={(e) => setNewConvert({ ...newConvert, notes: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingConvert(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="evangelist"
        departmentName="Council of Honorary Evangelists"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="evangelist"
        departmentName="Council of Honorary Evangelists"
      />
    </div>
  );
}
