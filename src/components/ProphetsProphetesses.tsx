import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Eye,
  Plus,
  Compass,
  ArrowRight,
  MoreHorizontal,
  ChevronDown,
  Filter,
  CheckCircle,
  Clock,
  BookOpen,
  Users,
  UserPlus,
  Trash2,
  Shield,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { ServiceRoster, FastingSchedule, ObservationLog, UnitExecutive } from '../types';
import { initialServiceRosters, initialFastingSchedules, initialObservationLogs, initialProphetExecutives } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface ProphetsProphetessesProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function ProphetsProphetesses({ onNavigateToSecretariat, onNavigateToMainDashboard }: ProphetsProphetessesProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [rosters, setRosters] = useState<ServiceRoster[]>(initialServiceRosters);
  const [fastings, setFastings] = useState<FastingSchedule[]>(initialFastingSchedules);
  const [logs, setLogs] = useState<ObservationLog[]>(initialObservationLogs);
  const [executives, setExecutives] = useState<UnitExecutive[]>(initialProphetExecutives);

  // Filters
  const [rosterFilter, setRosterFilter] = useState<string>('All Services');
  const [isAddingObservation, setIsAddingObservation] = useState(false);
  const [isAssigningDuty, setIsAssigningDuty] = useState(false);
  const [isAddingExec, setIsAddingExec] = useState(false);

  // Form states
  const [newExec, setNewExec] = useState({
    name: '',
    rank: 'Prophet',
    office: '',
    contact: '',
    status: 'Active' as UnitExecutive['status']
  });
  const [newObs, setNewObs] = useState({
    title: '',
    category: 'Parish Preservation' as ObservationLog['category'],
    content: '',
    author: 'Prophetess Mary',
    authorInitials: 'PM',
    severity: 'medium' as ObservationLog['severity']
  });

  const [newDuty, setNewDuty] = useState({
    date: 'Oct 31, 2023',
    serviceType: 'Wednesday Mercy Service',
    primaryProphet: 'Prophet John',
    initials: 'PJ',
    status: 'Pending' as ServiceRoster['status']
  });

  // Handlers
  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObs.title || !newObs.content) {
      alert('Please fill out all observation details.');
      return;
    }
    const created: ObservationLog = {
      id: `OBS-0${logs.length + 1}`,
      category: newObs.category,
      date: 'Today',
      title: newObs.title,
      content: newObs.content,
      author: newObs.author,
      authorInitials: newObs.authorInitials,
      severity: newObs.severity
    };
    setLogs([created, ...logs]);
    setIsAddingObservation(false);
    setNewObs({
      title: '',
      category: 'Parish Preservation',
      content: '',
      author: 'Prophetess Mary',
      authorInitials: 'PM',
      severity: 'medium'
    });
  };

  const handleAssignDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ServiceRoster = {
      id: `RST-00${rosters.length + 1}`,
      date: newDuty.date,
      serviceType: newDuty.serviceType,
      assignedProphets: [
        { name: newDuty.primaryProphet, initials: newDuty.initials, isPrimary: true }
      ],
      status: newDuty.status
    };
    setRosters([...rosters, created]);
    setIsAssigningDuty(false);
  };

  const handleToggleFasting = (id: string) => {
    setFastings(fastings.map(f => {
      if (f.id === id) {
        return { ...f, isActive: !f.isActive };
      }
      return f;
    }));
  };

  const handleConfirmRoster = (id: string) => {
    setRosters(rosters.map(r => {
      if (r.id === id) {
        return { ...r, status: 'Confirmed' };
      }
      return r;
    }));
  };

  const handleAddExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExec.name || !newExec.office || !newExec.contact) {
      alert('Please fill out all fields.');
      return;
    }
    const created: UnitExecutive = {
      id: `PEX-0${executives.length + 1}`,
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
      rank: 'Prophet',
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

  // Compute roster options
  const uniqueServiceTypes = ['All Services', ...Array.from(new Set(rosters.map(r => r.serviceType)))];

  const filteredRosters = rosters.filter(r => {
    return rosterFilter === 'All Services' || r.serviceType === rosterFilter;
  });

  return (
    <div className="space-y-6">
      {/* Council of Prophet & Prophetess Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Prophetic & Spiritual Chamber
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Visionary Revelations • Altar Vigil • Fasting Intercessions
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Council of Prophet & Prophetess
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Administering prophetic service rosters, sacred white fasting intercessions, and spiritual defense observation logs.
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

      {/* Page Header Area with Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-celestial-blue-900">Spiritual Duty Overview</h3>
          <p className="font-sans text-xs text-celestial-gray-500">Service schedules, fasting calendars, and spiritual observation transcripts.</p>
        </div>
        <button
          onClick={() => setIsAssigningDuty(true)}
          className="bg-celestial-blue-900 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Assign Spiritual Duty
        </button>
      </div>

      {/* Main Grid: Roster & Fasting */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Duty Roster Table (8 cols) */}
        <section className="md:col-span-8 bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h4 className="font-serif text-base font-bold text-celestial-blue-900">Upcoming Service Roster</h4>
            <div className="relative">
              <select
                value={rosterFilter}
                onChange={(e) => setRosterFilter(e.target.value)}
                className="appearance-none bg-celestial-offwhite border border-celestial-gray-200 rounded-lg pl-3 pr-8 py-1.5 font-sans text-xs text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
              >
                {uniqueServiceTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-3 h-3 text-celestial-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-celestial-gray-200 text-celestial-gray-500 font-semibold">
                  <th className="py-3">Date</th>
                  <th className="py-3">Service Type</th>
                  <th className="py-3">Assigned Prophets</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRosters.map((roster) => (
                  <tr
                    key={roster.id}
                    className="border-b border-celestial-gray-200/50 hover:bg-celestial-offwhite/50 transition-colors"
                  >
                    <td className="py-4 font-semibold text-celestial-gray-800">{roster.date}</td>
                    <td className="py-4 font-bold text-celestial-blue-900">{roster.serviceType}</td>
                    <td className="py-4">
                      <div className="flex -space-x-2">
                        {roster.assignedProphets.map((p, idx) => (
                          <div
                            key={idx}
                            title={p.name}
                            className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold shadow-sm ${
                              p.isPrimary
                                ? 'bg-celestial-blue-500 text-white'
                                : 'bg-celestial-gold-100 text-celestial-gold-600'
                            }`}
                          >
                            {p.initials}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      {roster.status === 'Confirmed' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-bold text-[9px] tracking-wide border border-green-200">
                          Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirmRoster(roster.id)}
                          className="bg-celestial-gold-50 hover:bg-celestial-gold-100 text-celestial-gold-600 border border-celestial-gold-100 px-2 py-0.5 rounded-full text-[9px] font-bold"
                        >
                          Confirm Assignment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Fasting Calendar Panel (4 cols) */}
        <section className="md:col-span-4 bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-serif text-base font-bold text-celestial-blue-900">Liturgical Fasting</h4>
            <button
              onClick={() => alert('Fasting configuration system online')}
              className="text-celestial-gray-500 hover:text-celestial-blue-900"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {fastings.map((fast) => (
              <div
                key={fast.id}
                onClick={() => handleToggleFasting(fast.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  fast.isActive
                    ? 'bg-celestial-gold-50/50 border-celestial-gold-100 border-l-4 border-l-celestial-gold-500'
                    : 'bg-celestial-offwhite border-celestial-gray-200 hover:border-celestial-gray-500'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-sans text-[10px] text-celestial-gray-500 font-bold uppercase tracking-wider">
                    {fast.type}
                  </span>
                  <span
                    className={`font-sans text-[9px] font-semibold ${
                      fast.isActive ? 'text-celestial-gold-600 font-bold' : 'text-celestial-gray-500'
                    }`}
                  >
                    {fast.isActive ? 'Active Schedule' : 'Inactive'}
                  </span>
                </div>
                <h5 className="font-serif text-xs font-semibold text-celestial-blue-900 mb-2">
                  {fast.title}
                </h5>
                <div className="flex items-center gap-1.5 text-celestial-gray-500 font-sans text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{fast.dateRange}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('Loading complete prayer calendar index...')}
            className="mt-4 w-full py-2 border border-celestial-gray-200 hover:bg-celestial-offwhite text-celestial-gray-800 font-sans text-xs font-semibold rounded-lg transition-colors"
          >
            View Spiritual Calendar
          </button>
        </section>
      </div>

      {/* Observation Logs Section (12 cols) */}
      <section className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-celestial-gray-200 pb-4">
          <div>
            <h4 className="font-serif text-base font-bold text-celestial-blue-900">Spiritual Observation Logs</h4>
            <p className="font-sans text-xs text-celestial-gray-500">Transcripts recorded during prophetic watch hours.</p>
          </div>
          <button
            onClick={() => setIsAddingObservation(true)}
            className="text-celestial-blue-900 font-sans text-xs font-semibold hover:underline flex items-center gap-0.5"
          >
            <Plus className="w-4 h-4" /> New Observation Entry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {logs.map((log) => {
            const sideColor =
              log.severity === 'high'
                ? 'border-l-red-500'
                : log.severity === 'medium'
                ? 'border-l-celestial-gold-500'
                : 'border-l-celestial-blue-500';

            return (
              <div
                key={log.id}
                className={`border border-celestial-gray-200 rounded-lg p-5 hover:border-celestial-blue-500 transition-colors cursor-pointer bg-celestial-offwhite/30 shadow-xs relative overflow-hidden border-l-4 ${sideColor}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-celestial-blue-100 text-celestial-blue-900 font-sans">
                    {log.category}
                  </span>
                  <span className="font-sans text-[10px] text-celestial-gray-500">{log.date}</span>
                </div>
                <h5 className="font-serif text-sm font-semibold text-celestial-blue-900 mb-2 line-clamp-1">
                  {log.title}
                </h5>
                <p className="font-sans text-[11px] text-celestial-gray-500 line-clamp-3 mb-4 leading-relaxed">
                  {log.content}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-celestial-blue-100 flex items-center justify-center text-[8px] font-bold text-celestial-blue-900">
                      {log.authorInitials}
                    </div>
                    <span className="font-sans text-[10px] font-medium text-celestial-gray-800">
                      {log.author}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-celestial-gray-500 group-hover:text-celestial-blue-900" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prophet & Prophetess Council Executive Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="prophets-executives-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Prophet & Prophetess Council Executives
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official roster of the executive leadership managing the Prophets & Prophetesses unit.</p>
          </div>
          <button
            onClick={() => setIsAddingExec(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-prophet-exec-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Council Executive
          </button>
        </div>

        {/* Executives Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                <th className="py-3 px-4">Council Office</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {executives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No council executives registered yet. Click "Add Council Executive" to get started.
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

      {/* New Council Executive Dialog Overlay */}
      {isAddingExec && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Council Executive
            </h3>
            <form onSubmit={handleAddExec} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prophetess Mary Sodipo"
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
                    <option value="Most Senior Apostle">Most Senior Apostle</option>
                    <option value="Senior Apostle">Senior Apostle</option>
                    <option value="Apostle">Apostle</option>
                    <option value="Leader">Leader</option>
                    <option value="Wolader">Wolader</option>
                    <option value="Senior Elder Brother">Senior Elder Brother</option>
                    <option value="Elder Brother">Elder Brother</option>
                    <option value="Elder Sister">Elder Sister</option>
                    <option value="Prophet">Prophet</option>
                    <option value="Prophetess">Prophetess</option>
                    <option value="Senior Prophet">Senior Prophet</option>
                    <option value="Senior Prophetess">Senior Prophetess</option>
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
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Council Office / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chairman, Secretary, Patron"
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
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Executive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Observation Entry Form Overlay */}
      {isAddingObservation && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Record Prophetic Observation</h3>
            <form onSubmit={handleAddObservation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Log Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vigilance regarding parish welfare"
                  value={newObs.title}
                  onChange={(e) => setNewObs({ ...newObs, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Category</label>
                <select
                  value={newObs.category}
                  onChange={(e) => setNewObs({ ...newObs, category: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Parish Preservation">Parish Preservation</option>
                  <option value="Youth Guidance">Youth Guidance</option>
                  <option value="General Welfare">General Welfare</option>
                  <option value="Spiritual Alert">Spiritual Alert</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Executive Summary / Transcript</label>
                <textarea
                  required
                  placeholder="Record spiritual promptings or warnings received during service sessions..."
                  value={newObs.content}
                  onChange={(e) => setNewObs({ ...newObs, content: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Recorder Name</label>
                  <input
                    type="text"
                    required
                    value={newObs.author}
                    onChange={(e) => setNewObs({ ...newObs, author: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Initials</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={newObs.authorInitials}
                    onChange={(e) => setNewObs({ ...newObs, authorInitials: e.target.value.toUpperCase() })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingObservation(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Record Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Duty Form Overlay */}
      {isAssigningDuty && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Assign Spiritual Duty</h3>
            <form onSubmit={handleAssignDuty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Type</label>
                <select
                  value={newDuty.serviceType}
                  onChange={(e) => setNewDuty({ ...newDuty, serviceType: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Wednesday Mercy Service">Wednesday Mercy Service</option>
                  <option value="Friday Power Clinic">Friday Power Clinic</option>
                  <option value="Sunday Glorious Service">Sunday Glorious Service</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Assigned Prophet Name</label>
                <input
                  type="text"
                  required
                  value={newDuty.primaryProphet}
                  onChange={(e) => setNewDuty({ ...newDuty, primaryProphet: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Initials</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={newDuty.initials}
                    onChange={(e) => setNewDuty({ ...newDuty, initials: e.target.value.toUpperCase() })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Date</label>
                  <input
                    type="text"
                    required
                    value={newDuty.date}
                    onChange={(e) => setNewDuty({ ...newDuty, date: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAssigningDuty(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="prophets"
        departmentName="Council of Prophet & Prophetess"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="prophets"
        departmentName="Council of Prophet & Prophetess"
      />
    </div>
  );
}
