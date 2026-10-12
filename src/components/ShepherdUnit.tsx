import React, { useState } from 'react';
import {
  Calendar,
  Search,
  MessageSquare,
  Baby,
  Droplet,
  CheckCircle,
  HelpCircle,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  History,
  Timer,
  Users,
  UserPlus,
  Trash2,
  Shield,
  Church,
  ArrowLeft
} from 'lucide-react';
import { CounselingSession, SacramentalRegistry, SpiritualLogistic, ChurchWorker } from '../types';
import { initialCounselingSessions, initialSacramentalRegistries, initialSpiritualLogistics, initialChurchWorkers } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface ShepherdUnitProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function ShepherdUnit({ onNavigateToSecretariat, onNavigateToMainDashboard }: ShepherdUnitProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [sessions, setSessions] = useState<CounselingSession[]>(initialCounselingSessions);
  const [registries, setRegistries] = useState<SacramentalRegistry[]>(initialSacramentalRegistries);
  const [logistics, setLogistics] = useState<SpiritualLogistic[]>(initialSpiritualLogistics);
  const [workers, setWorkers] = useState<ChurchWorker[]>(initialChurchWorkers);

  // Filters & Searches
  const [sessionStatus, setSessionStatus] = useState<string>('all');
  const [candidateSearch, setCandidateSearch] = useState<string>('');

  // Dialog overlays
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [isAddingRegistry, setIsAddingRegistry] = useState(false);
  const [isAddingWorker, setIsAddingWorker] = useState(false);

  // Form states
  const [newSession, setNewSession] = useState({
    memberName: '',
    time: '10:00 AM',
    date: 'Today',
    topic: 'Spiritual' as CounselingSession['topic']
  });

  const [newRegistry, setNewRegistry] = useState({
    candidateName: '',
    type: 'Baptism' as SacramentalRegistry['type'],
    date: new Date().toISOString().split('T')[0]
  });

  const [newWorker, setNewWorker] = useState({
    name: '',
    rank: 'Brother',
    role: '',
    contact: '',
    status: 'Active' as ChurchWorker['status']
  });

  // Handlers
  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.memberName) {
      alert('Please specify the member name.');
      return;
    }
    const created: CounselingSession = {
      id: `CNS-00${sessions.length + 1}`,
      time: newSession.time,
      date: newSession.date,
      memberName: newSession.memberName,
      topic: newSession.topic,
      status: 'Scheduled'
    };
    setSessions([created, ...sessions]);
    setIsAddingSession(false);
    setNewSession({ memberName: '', time: '10:00 AM', date: 'Today', topic: 'Spiritual' });
  };

  const handleAddRegistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegistry.candidateName) {
      alert('Please specify the candidate name.');
      return;
    }
    const created: SacramentalRegistry = {
      id: `${newRegistry.type === 'Baptism' ? 'BPT' : 'NAM'}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newRegistry.type,
      candidateName: newRegistry.candidateName,
      date: newRegistry.date,
      status: 'Pending'
    };
    setRegistries([created, ...registries]);
    setIsAddingRegistry(false);
    setNewRegistry({ candidateName: '', type: 'Baptism', date: new Date().toISOString().split('T')[0] });
  };

  const handlePerformRegistry = (id: string) => {
    setRegistries(registries.map(r => {
      if (r.id === id) {
        return { ...r, status: 'Performed' as const };
      }
      return r;
    }));
  };

  const handleToggleLogistic = (id: string) => {
    setLogistics(logistics.map(l => {
      if (l.id === id) {
        const nextStatus = l.status === 'Prepared' ? 'Pending' : 'Prepared';
        return {
          ...l,
          status: nextStatus as any,
          detail: nextStatus === 'Prepared' ? 'Prepared for Sunday Service' : 'Needs attention / Printing'
        };
      }
      return l;
    }));
  };

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.role || !newWorker.contact) {
      alert('Please fill out all worker fields.');
      return;
    }
    const created: ChurchWorker = {
      id: `WRK-00${workers.length + 1}`,
      name: newWorker.name,
      rank: newWorker.rank,
      role: newWorker.role,
      contact: newWorker.contact,
      status: newWorker.status
    };
    setWorkers([...workers, created]);
    setIsAddingWorker(false);
    setNewWorker({
      name: '',
      rank: 'Brother',
      role: '',
      contact: '',
      status: 'Active'
    });
  };

  const handleDeleteWorker = (id: string) => {
    if (confirm('Are you sure you want to delete this church worker?')) {
      setWorkers(workers.filter(w => w.id !== id));
    }
  };

  // Metric summaries
  const todaySessionsCount = sessions.filter(s => s.date === 'Today' && s.status === 'Scheduled').length;
  const pendingBaptisms = registries.filter(r => r.type === 'Baptism' && r.status === 'Pending').length;
  const pendingNamings = registries.filter(r => r.type === 'Naming' && r.status === 'Pending').length;
  const pendingCounseling = sessions.filter(s => s.status === 'Scheduled').length;

  // Compute filters
  const filteredSessions = sessions.filter(s => {
    return sessionStatus === 'all' || s.status.toLowerCase() === sessionStatus.toLowerCase();
  });

  const filteredRegistries = registries.filter(r => {
    return candidateSearch === '' || r.candidateName.toLowerCase().includes(candidateSearch.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Shepherd & Church Workers Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Church className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Pastoral Oversight & Altar Ministry
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Sacraments • Counseling • Altar Workers
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Shepherd & Church Workers
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Pastoral spiritual authority over Holy Sacraments, pastoral counseling, church workers roster, and altar sanctification.
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

      {/* Shepherd Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* today sessions */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Calendar className="w-5 h-5 text-celestial-blue-900 mb-1" />
            <span className="font-sans text-[11px] text-celestial-gray-500 font-semibold uppercase tracking-wider">
              Today's Sessions
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 leading-none">{todaySessionsCount}</span>
          </div>
        </div>

        {/* pending baptisms */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Droplet className="w-5 h-5 text-celestial-blue-500 mb-1" />
            <span className="font-sans text-[11px] text-celestial-gray-500 font-semibold uppercase tracking-wider">
              Upcoming Baptisms
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 leading-none">{pendingBaptisms}</span>
          </div>
        </div>

        {/* pending namings */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Baby className="w-5 h-5 text-celestial-gold-500 mb-1" />
            <span className="font-sans text-[11px] text-celestial-gray-500 font-semibold uppercase tracking-wider">
              Pending Namings
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 leading-none">{pendingNamings}</span>
          </div>
        </div>

        {/* counseling request */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <MessageSquare className="w-5 h-5 text-celestial-blue-900 mb-1" />
            <span className="font-sans text-[11px] text-celestial-gray-500 font-semibold uppercase tracking-wider">
              Counseling Queue
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 leading-none">{pendingCounseling}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Counseling & Registries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pastoral Counseling Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[500px]">
          <div className="p-5 border-b border-celestial-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-celestial-blue-900">Pastoral Counseling</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Scheduled sessions, family guidance, and prayer requests.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={sessionStatus}
                onChange={(e) => setSessionStatus(e.target.value)}
                className="bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-2.5 py-1.5 font-sans text-xs text-celestial-gray-800"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => setIsAddingSession(true)}
                className="bg-celestial-blue-900 text-white px-3.5 py-1.5 rounded-lg font-sans text-xs font-semibold hover:bg-celestial-blue-800 transition-all shrink-0 flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> New Session
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-celestial-gray-200 text-celestial-gray-500 font-semibold pb-2">
                  <th className="pb-3">Time & Date</th>
                  <th className="pb-3">Member</th>
                  <th className="pb-3 hidden sm:table-cell">Topic</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-celestial-gray-200/50 hover:bg-celestial-offwhite/50 transition-colors"
                  >
                    <td className="py-3">
                      <div className="font-bold text-celestial-gray-800">{session.time}</div>
                      <div className="text-celestial-gray-500 text-[10px]">{session.date}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-celestial-blue-100 flex items-center justify-center text-celestial-blue-900 font-sans font-bold text-[10px]">
                          {session.memberName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-celestial-gray-800">{session.memberName}</span>
                      </div>
                    </td>
                    <td className="py-3 hidden sm:table-cell">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-celestial-offwhite text-celestial-blue-900 border border-celestial-blue-100">
                        {session.topic}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {session.status === 'Scheduled' ? (
                        <button
                          onClick={() => {
                            setSessions(sessions.map(s => s.id === session.id ? { ...s, status: 'Completed' } : s));
                          }}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-celestial-gray-200 text-celestial-gray-500">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sacramental Registries Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[500px]">
          <div className="p-5 border-b border-celestial-gray-200 flex flex-col gap-3 shrink-0">
            <div>
              <h3 className="font-serif text-lg font-bold text-celestial-blue-900">Sacramental Registries</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Baptisms & baby namings index.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-celestial-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidate name..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-celestial-offwhite border border-celestial-gray-200 rounded-lg font-sans text-xs focus:outline-none focus:border-celestial-blue-500"
              />
            </div>
          </div>

          {/* Registries List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {filteredRegistries.map((reg) => (
              <div
                key={reg.id}
                className="border border-celestial-gray-200 rounded-lg p-3.5 hover:border-celestial-blue-500 transition-all shadow-xs bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5">
                    {reg.type === 'Baptism' ? (
                      <Droplet className="w-3.5 h-3.5 text-celestial-blue-500" />
                    ) : (
                      <Baby className="w-3.5 h-3.5 text-celestial-gold-500" />
                    )}
                    <span className="font-sans text-xs font-bold text-celestial-gray-800">{reg.type}</span>
                  </div>
                  <span className="font-sans text-[10px] text-celestial-gray-500">{reg.id}</span>
                </div>
                <h4 className="font-serif text-base font-semibold text-celestial-blue-900 mb-1">
                  {reg.candidateName}
                </h4>
                <div className="flex justify-between items-center text-[10px] text-celestial-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {reg.date}
                  </span>
                  {reg.status === 'Pending' ? (
                    <button
                      onClick={() => handlePerformRegistry(reg.id)}
                      className="text-celestial-blue-900 font-bold hover:underline"
                    >
                      Perform Service
                    </button>
                  ) : (
                    <span className="text-green-600 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-celestial-gray-200 text-center shrink-0">
            <button
              onClick={() => setIsAddingRegistry(true)}
              className="text-celestial-blue-900 font-bold hover:underline font-sans text-xs flex items-center justify-center gap-1 w-full"
            >
              <Plus className="w-4 h-4" /> Register New Sacramental
            </button>
          </div>
        </div>
      </div>

      {/* Spiritual Logistics Tracker (12 cols) */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900">Spiritual Logistics</h3>
            <p className="font-sans text-xs text-celestial-gray-500">Resource allocation & sanctuary settings for upcoming liturgies.</p>
          </div>
          <button
            onClick={() => alert('Logistics inventory update portal loaded')}
            className="border border-celestial-gray-200 bg-transparent text-celestial-gray-800 hover:bg-celestial-offwhite px-4 py-2 rounded-lg font-sans text-xs font-semibold transition-colors"
          >
            Manage Inventory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {logistics.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleLogistic(item.id)}
              className="flex items-center gap-4 p-4 rounded-xl bg-celestial-offwhite border border-celestial-gray-200 cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-celestial-blue-900 shrink-0">
                <BookOpen className="w-5 h-5 text-celestial-blue-900" />
              </div>
              <div className="flex-1">
                <h4 className="font-sans text-xs font-bold text-celestial-gray-800 group-hover:text-celestial-blue-900">
                  {item.name}
                </h4>
                <p className="font-sans text-[11px] text-celestial-gray-500">{item.detail}</p>
              </div>
              <div className="shrink-0">
                {item.status === 'Prepared' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-celestial-gold-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Church Workers Management Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="church-workers-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Parish Church Workers
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official roster of assigned clergy, assistants, wardens, and altar workers under the Shepherd's Unit.</p>
          </div>
          <button
            onClick={() => setIsAddingWorker(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-worker-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Church Worker
          </button>
        </div>

        {/* Church Workers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {workers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No church workers registered yet. Click "Add Church Worker" to get started.
                  </td>
                </tr>
              ) : (
                workers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-celestial-offwhite/30 transition-colors">
                    <td className="py-4 px-4 font-semibold text-celestial-blue-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold font-sans text-xs shrink-0">
                          {worker.name.split(' ').filter(p => !p.includes('.')).map(n => n[0]).join('') || worker.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-celestial-blue-900">{worker.name}</span>
                          <span className="text-[10px] text-celestial-gray-400 font-normal font-mono">{worker.rank}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-700 font-medium font-sans">
                      <span className="bg-celestial-offwhite text-celestial-blue-900 border border-celestial-blue-100 px-2.5 py-1 rounded text-[11px]">
                        {worker.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-600 font-mono">
                      {worker.contact}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        worker.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : worker.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-celestial-gray-200 text-celestial-gray-500 font-medium'
                      }`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteWorker(worker.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center gap-1"
                        title="Delete Church Worker"
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

      {/* New Church Worker Dialog Overlay */}
      {isAddingWorker && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Parish Church Worker
            </h3>
            <form onSubmit={handleAddWorker} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Solomon Alao"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Rank / Title</label>
                  <select
                    value={newWorker.rank}
                    onChange={(e) => setNewWorker({ ...newWorker, rank: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Superior Evangelist">Superior Evangelist</option>
                    <option value="Most Senior Evangelist">Most Senior Evangelist</option>
                    <option value="Senior Evangelist">Senior Evangelist</option>
                    <option value="Evangelist">Evangelist</option>
                    <option value="Leader">Leader</option>
                    <option value="Wolader">Wolader</option>
                    <option value="Senior Elder Brother">Senior Elder Brother</option>
                    <option value="Elder Brother">Elder Brother</option>
                    <option value="Elder Sister">Elder Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Prophet">Prophet</option>
                    <option value="Prophetess">Prophetess</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Status</label>
                  <select
                    value={newWorker.status}
                    onChange={(e) => setNewWorker({ ...newWorker, status: e.target.value as any })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Assigned Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Choir Coordinator, Assistant Warden"
                  value={newWorker.role}
                  onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +234 803 111 2222"
                  value={newWorker.contact}
                  onChange={(e) => setNewWorker({ ...newWorker, contact: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingWorker(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Counseling Session Form Overlay */}
      {isAddingSession && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Schedule Counseling Session</h3>
            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Member Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Solomon"
                  value={newSession.memberName}
                  onChange={(e) => setNewSession({ ...newSession, memberName: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Topic</label>
                <select
                  value={newSession.topic}
                  onChange={(e) => setNewSession({ ...newSession, topic: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Spiritual">Spiritual / Devotional</option>
                  <option value="Family">Family / Marital Counseling</option>
                  <option value="Guidance">General Life Guidance</option>
                  <option value="Grief">Bereavement & Grief Support</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today / Oct 28"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingSession(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Sacramental Registry Form Overlay */}
      {isAddingRegistry && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Register Sacramental Rite</h3>
            <form onSubmit={handleAddRegistry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Benjamin Cole"
                  value={newRegistry.candidateName}
                  onChange={(e) => setNewRegistry({ ...newRegistry, candidateName: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Rite Category</label>
                <select
                  value={newRegistry.type}
                  onChange={(e) => setNewRegistry({ ...newRegistry, type: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Baptism">Baptism Ceremony</option>
                  <option value="Naming">Baby Naming Ceremony</option>
                  <option value="Confirmation">Sacrament of Confirmation</option>
                  <option value="Matrimony">Holy Matrimony Seal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Intended Date</label>
                <input
                  type="date"
                  required
                  value={newRegistry.date}
                  onChange={(e) => setNewRegistry({ ...newRegistry, date: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingRegistry(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Log Sacrament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="shepherd"
        departmentName="Shepherd & Church Workers"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="shepherd"
        departmentName="Shepherd & Church Workers"
      />
    </div>
  );
}
