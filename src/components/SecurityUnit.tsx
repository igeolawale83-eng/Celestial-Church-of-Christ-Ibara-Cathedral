import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Radio,
  Clock,
  Locate,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  Eye,
  Trash,
  Phone,
  UserCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Users,
  UserPlus,
  Trash2,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { SecurityRoster, PatrolLog, UnitExecutive } from '../types';
import { initialSecurityRoster, initialPatrolLogs, initialSecurityExecutives } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface SecurityUnitProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function SecurityUnit({ onNavigateToSecretariat, onNavigateToMainDashboard }: SecurityUnitProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [guards, setGuards] = useState<SecurityRoster[]>(initialSecurityRoster);
  const [logs, setLogs] = useState<PatrolLog[]>(initialPatrolLogs);
  const [executives, setExecutives] = useState<UnitExecutive[]>(initialSecurityExecutives);
  const [isAddingExec, setIsAddingExec] = useState(false);

  const [newExec, setNewExec] = useState({
    name: '',
    rank: 'Leader',
    office: '',
    contact: '',
    status: 'Active' as UnitExecutive['status']
  });

  // Filters
  const [logFilter, setLogFilter] = useState<string>('all');
  const [isAddingGuard, setIsAddingGuard] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);

  // Form states
  const [newGuard, setNewGuard] = useState({
    name: '',
    guardId: '',
    shift: 'Morning Shift' as SecurityRoster['shift'],
    assignedGear: 'Radio, Keys'
  });

  const [newLog, setNewLog] = useState({
    title: 'Clear',
    location: 'Main Gate',
    status: 'Clear' as PatrolLog['status'],
    severity: 'low' as PatrolLog['severity']
  });

  // Handlers
  const handleAddGuard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuard.name) {
      alert('Please enter guard name.');
      return;
    }
    const created: SecurityRoster = {
      id: `SEC-0${guards.length + 1}`,
      name: newGuard.name,
      initials: newGuard.name.split(' ').map(n => n[0]).join(''),
      guardId: newGuard.guardId || `0${Math.floor(10 + Math.random() * 89)}`,
      shift: newGuard.shift,
      assignedGear: newGuard.assignedGear,
      status: 'Stationed'
    };
    setGuards([...guards, created]);
    setIsAddingGuard(false);
    setNewGuard({ name: '', guardId: '', shift: 'Morning Shift', assignedGear: 'Radio, Keys' });
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PatrolLog = {
      id: `PLG-0${logs.length + 1}`,
      incId: `INC-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 89)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      title: newLog.title,
      location: newLog.location,
      time: `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      status: newLog.status,
      severity: newLog.severity
    };
    setLogs([created, ...logs]);
    setIsAddingLog(false);
    setNewLog({ title: 'Clear', location: 'Main Gate', status: 'Clear', severity: 'low' });
  };

  const handleStatusChange = (id: string, nextStatus: SecurityRoster['status']) => {
    setGuards(guards.map(g => {
      if (g.id === id) {
        return { ...g, status: nextStatus };
      }
      return g;
    }));
  };

  const handleResolveLog = (id: string) => {
    setLogs(logs.map(l => {
      if (l.id === id) {
        return { ...l, status: 'Resolved', severity: 'low' as const };
      }
      return l;
    }));
  };

  const handleAddExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExec.name || !newExec.office || !newExec.contact) {
      alert('Please fill out all fields.');
      return;
    }
    const created: UnitExecutive = {
      id: `SEC-0${executives.length + 1}`,
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
      rank: 'Leader',
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

  // Metrics
  const activeGuardsCount = guards.filter(g => g.status !== 'Off Duty').length;
  const criticalIncidentsCount = logs.filter(l => l.severity === 'high' && l.status !== 'Resolved').length;

  // Filter computations
  const filteredLogs = logs.filter(l => {
    if (logFilter === 'all') return true;
    if (logFilter === 'active') return l.status !== 'Resolved' && l.status !== 'Clear';
    if (logFilter === 'resolved') return l.status === 'Resolved' || l.status === 'Clear';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Security Enforcement Team Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Shield className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Perimeter Defense & Vigilance
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Patrols • Gate Checkpoints • Emergency Protocol
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Security Enforcement Team
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Protecting worshippers, parish assets, parking lots, and cathedral perimeters through disciplined vigilance and incident response.
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

      {/* Top Security Status Bar */}
      <div className="bg-white rounded-xl p-6 border border-celestial-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse inline-block" />
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 leading-none">Security Status: Active Secure</h3>
          </div>
          <p className="font-sans text-xs text-celestial-gray-500">
            All primary sanctuary gates and parish wings are monitored. {activeGuardsCount} guards currently stationed.
          </p>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <button
            onClick={() => alert('Emergency dispatch alert deactivated')}
            className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-sans text-xs px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <AlertOctagon className="w-4 h-4 text-red-700" /> Panic Alert Dispatch
          </button>
          <button
            onClick={() => setIsAddingLog(true)}
            className="flex-1 md:flex-none bg-celestial-blue-900 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold hover:bg-celestial-blue-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Security incident
          </button>
        </div>
      </div>

      {/* Main double column layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guard Patrol Rotation (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-celestial-blue-900">Guard Patrol Rotation</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Active watches, shift timings, and gear allocations.</p>
            </div>
            <button
              onClick={() => setIsAddingGuard(true)}
              className="bg-celestial-gray-800 hover:bg-celestial-gray-800 text-white font-sans text-xs px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Deploy Guard
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {guards.map((guard) => (
              <div
                key={guard.id}
                className="border border-celestial-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow bg-celestial-offwhite/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-celestial-blue-950 text-white flex items-center justify-center text-sm font-bold font-sans">
                    {guard.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans text-xs font-bold text-celestial-gray-800">
                        {guard.name}
                      </h4>
                      <span className="font-sans text-[9px] text-celestial-gray-500 bg-celestial-offwhite border border-celestial-gray-200 px-1.5 rounded font-bold">
                        ID: {guard.guardId}
                      </span>
                    </div>
                    <p className="font-sans text-[10px] text-celestial-gray-500 mt-1">
                      Shift: <span className="font-semibold text-celestial-blue-950">{guard.shift}</span> • Gear: {guard.assignedGear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <select
                    value={guard.status}
                    onChange={(e) => handleStatusChange(guard.id, e.target.value as any)}
                    className={`bg-white border border-celestial-gray-200 rounded-lg px-2.5 py-1 font-sans text-[10px] font-bold ${
                      guard.status === 'On Patrol'
                        ? 'text-celestial-blue-600 border-celestial-blue-200 bg-celestial-blue-50/50'
                        : guard.status === 'Stationed'
                        ? 'text-green-600 border-green-200 bg-green-50'
                        : guard.status === 'Perimeter'
                        ? 'text-celestial-gold-600 border-celestial-gold-100 bg-celestial-gold-50/30'
                        : 'text-celestial-gray-500'
                    }`}
                  >
                    <option value="On Patrol">On Patrol</option>
                    <option value="Stationed">Stationed (Gates)</option>
                    <option value="Perimeter">Perimeter Sweeps</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Logbook (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex flex-col gap-3 shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-celestial-blue-900">Security Patrol Logbook</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Record of incident reports & security checks.</p>
            </div>
            <div className="flex gap-1.5 bg-celestial-offwhite p-1 rounded-lg border border-celestial-gray-200">
              {(['all', 'active', 'resolved'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLogFilter(mode)}
                  className={`flex-1 py-1 text-center rounded-md font-sans text-[10px] font-bold uppercase transition-all ${
                    logFilter === mode
                      ? 'bg-white text-celestial-blue-950 shadow-xs border border-celestial-gray-200'
                      : 'text-celestial-gray-500 hover:text-celestial-gray-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {filteredLogs.map((log) => {
              const cardSideColor =
                log.severity === 'high' && log.status !== 'Resolved'
                  ? 'border-l-red-500 bg-red-50/10'
                  : 'border-l-celestial-blue-500';

              return (
                <div
                  key={log.id}
                  className={`border border-celestial-gray-200 rounded-lg p-3.5 hover:border-celestial-blue-500 transition-colors border-l-4 ${cardSideColor}`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-sans text-[9px] text-celestial-gray-500 font-bold uppercase">
                      {log.incId}
                    </span>
                    <span className="font-sans text-[9px] text-celestial-gray-500">{log.time}</span>
                  </div>

                  <h4 className="font-serif text-sm font-semibold text-celestial-blue-900 mb-1 leading-tight">
                    {log.title}
                  </h4>
                  <p className="font-sans text-[11px] text-celestial-gray-500 mb-3">
                    Zone: <span className="font-bold text-celestial-gray-800">{log.location}</span> • Status: {log.status}
                  </p>

                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        log.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-celestial-blue-100 text-celestial-blue-900'
                      }`}
                    >
                      {log.severity} Threat
                    </span>

                    {log.status !== 'Resolved' && log.status !== 'Clear' && (
                      <button
                        onClick={() => handleResolveLog(log.id)}
                        className="text-celestial-blue-900 font-sans text-[10px] font-bold hover:underline"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Security Unit Executive Committee Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="security-executives-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Security Unit Executive Committee
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official roster of the security coordinators, wardens, and executive council maintaining safety and logistics.</p>
          </div>
          <button
            onClick={() => setIsAddingExec(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-security-exec-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Security Executive
          </button>
        </div>

        {/* Executives Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                <th className="py-3 px-4">Security Office</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {executives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No security executives registered yet. Click "Add Security Executive" to get started.
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

      {/* New Security Executive Dialog Overlay */}
      {isAddingExec && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Security Executive
            </h3>
            <form onSubmit={handleAddExec} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Segun Falola"
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
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Security Office / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Security Warden, Secretary, Patrol Officer"
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

      {/* Deploy Guard Form Overlay */}
      {isAddingGuard && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Deploy Security Guard</h3>
            <form onSubmit={handleAddGuard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Guard Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer James"
                  value={newGuard.name}
                  onChange={(e) => setNewGuard({ ...newGuard, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Guard Badge ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 057"
                    value={newGuard.guardId}
                    onChange={(e) => setNewGuard({ ...newGuard, guardId: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Watch Shift</label>
                  <select
                    value={newGuard.shift}
                    onChange={(e) => setNewGuard({ ...newGuard, shift: e.target.value as any })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Morning Shift">Morning Shift</option>
                    <option value="Evening Shift">Evening Shift</option>
                    <option value="Night Watch">Night Watch</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Assigned Patrol Gear</label>
                <input
                  type="text"
                  required
                  value={newGuard.assignedGear}
                  onChange={(e) => setNewGuard({ ...newGuard, assignedGear: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingGuard(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Deploy Guard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Security Incident Overlay */}
      {isAddingLog && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Log Security Incident</h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Incident Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unlocked North Gate found during sweep"
                  value={newLog.title}
                  onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Location Zone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Parking Lot / Youth Wing"
                  value={newLog.location}
                  onChange={(e) => setNewLog({ ...newLog, location: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Patrol Status</label>
                  <select
                    value={newLog.status}
                    onChange={(e) => setNewLog({ ...newLog, status: e.target.value as any })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Clear">Clear</option>
                    <option value="Suspicious Vehicle">Suspicious Vehicle</option>
                    <option value="Unlocked Gate">Unlocked Gate</option>
                    <option value="Intruder Spotted">Intruder Spotted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Severity / Threat Level</label>
                  <select
                    value={newLog.severity}
                    onChange={(e) => setNewLog({ ...newLog, severity: e.target.value as any })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="low">Low Threat</option>
                    <option value="medium">Medium Threat</option>
                    <option value="high">High Threat / Urgent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingLog(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="security"
        departmentName="Security Enforcement Team"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="security"
        departmentName="Security Enforcement Team"
      />
    </div>
  );
}
