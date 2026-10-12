import React, { useState } from 'react';
import {
  Send,
  Mail,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Search,
  Plus,
  MessageSquare,
  CornerDownRight,
  Filter,
  Printer,
  Sparkles,
  ChevronRight,
  Landmark,
  BadgeAlert,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Department, SecretariatDispatch } from '../types';
import { initialSecretariatDispatches, departmentKeyExecutives } from '../data';

const ALL_11_DEPARTMENTS: { id: Department; label: string; secretaryName: string; rank: string }[] = [
  { id: 'parochial', label: 'Parish Council Executive', secretaryName: 'Evang. Olusegun Faleti', rank: 'Evangelist' },
  { id: 'shepherd', label: 'Shepherd & Church Workers', secretaryName: 'Bro. Emmanuel Adeleke', rank: 'Senior Leader' },
  { id: 'evangelist', label: 'Council of Honorary Evangelists', secretaryName: 'Senior Evang. John Dosunmu', rank: 'Senior Evangelist' },
  { id: 'prophets', label: 'Council of Prophet & Prophetess', secretaryName: 'Prophetess Mary Olatunji', rank: 'Senior Prophetess' },
  { id: 'side_men_women', label: 'Council of Sidesmen & Sideswomen', secretaryName: 'Sis. Dorcas Oladele', rank: 'Lace Superior Elder Sister' },
  { id: 'choir', label: 'The Model Choir', secretaryName: 'Sis. Grace Awolowo', rank: 'Choir General Secretary' },
  { id: 'youth', label: 'Youth Council', secretaryName: 'Sis. Temitope Sowunmi', rank: 'Youth General Secretary' },
  { id: 'security', label: 'Security Enforcement Team', secretaryName: 'Bro. Sunday Adeyemi', rank: 'Security Operations Secretary' },
  { id: 'media', label: 'Media Team', secretaryName: 'Sis. Folashade Adeyemi', rank: 'Media Secretariat Lead' },
  { id: 'medical', label: 'Medical Team', secretaryName: 'Nurse Olubunmi Sowande (RN, RM)', rank: 'Nurse Lead / General Secretary' },
  { id: 'bible_fellowship', label: 'MC & Women Bible Fellowship', secretaryName: 'Sis. Deborah Alabi', rank: 'Lace Senior Elder Sister' },
];

interface SecretariatDispatchPlatformProps {
  onNavigateToMainDashboard?: () => void;
}

export default function SecretariatDispatchPlatform({ onNavigateToMainDashboard }: SecretariatDispatchPlatformProps = {}) {
  const [dispatches, setDispatches] = useState<SecretariatDispatch[]>(() => {
    const saved = localStorage.getItem('ccc_secretariat_dispatches');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialSecretariatDispatches;
  });

  const [activeDispatchId, setActiveDispatchId] = useState<string>(dispatches[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  // Compose Modal / Form state
  const [isComposing, setIsComposing] = useState(false);
  const [memoTitle, setMemoTitle] = useState('');
  const [category, setCategory] = useState<SecretariatDispatch['category']>('Parish Council Resolution');
  const [priority, setPriority] = useState<SecretariatDispatch['priority']>('High Priority');
  const [deadline, setDeadline] = useState('');
  const [targetType, setTargetType] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [selectedDepts, setSelectedDepts] = useState<Department[]>([]);
  const [summary, setSummary] = useState('');
  const [fullBody, setFullBody] = useState('');

  // Department Secretary Simulator Mode
  const [simulatedSecretaryDept, setSimulatedSecretaryDept] = useState<Department>('choir');
  const [ackRemarksInput, setAckRemarksInput] = useState('');
  const [replyMessageInput, setReplyMessageInput] = useState('');

  // Selected Active Dispatch
  const activeDispatch = dispatches.find(d => d.id === activeDispatchId) || dispatches[0];

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoTitle.trim() || !fullBody.trim()) {
      alert('Please fill in both the memo title and content body.');
      return;
    }

    const memoNumber = `CCCI/SEC/2026/0${dispatches.length + 50}`;
    const targetDepartments = targetType === 'ALL' ? 'ALL' : (selectedDepts.length > 0 ? selectedDepts : 'ALL');

    // Build acknowledgment items
    const acknowledgmentList = ALL_11_DEPARTMENTS
      .filter(dept => targetDepartments === 'ALL' || (Array.isArray(targetDepartments) && targetDepartments.includes(dept.id)))
      .map(dept => ({
        department: dept.id,
        departmentLabel: dept.label,
        secretaryName: dept.secretaryName,
        acknowledged: dept.id === 'parochial', // Parochial Secretary is author
        acknowledgedAt: dept.id === 'parochial' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
        remarks: dept.id === 'parochial' ? 'Authorizing General Secretariat stamp.' : undefined
      }));

    const newDispatch: SecretariatDispatch = {
      id: `DSP-2026-${Date.now().toString().slice(-4)}`,
      memoNumber,
      title: memoTitle.trim(),
      category,
      priority,
      dateDispatched: new Date().toISOString().split('T')[0],
      deadline: deadline || undefined,
      author: 'Evang. Olusegun Faleti (Parochial Secretary)',
      summary: summary.trim() || memoTitle.trim(),
      fullBody: fullBody.trim(),
      targetDepartments,
      acknowledgments: acknowledgmentList,
      replies: []
    };

    const updated = [newDispatch, ...dispatches];
    setDispatches(updated);
    localStorage.setItem('ccc_secretariat_dispatches', JSON.stringify(updated));
    setActiveDispatchId(newDispatch.id);

    // Reset form
    setMemoTitle('');
    setSummary('');
    setFullBody('');
    setDeadline('');
    setTargetType('ALL');
    setSelectedDepts([]);
    setIsComposing(false);
  };

  // Handle Secretary Acknowledging Receipt
  const handleAcknowledge = (dispatchId: string, departmentToAck: Department) => {
    const updated = dispatches.map(item => {
      if (item.id === dispatchId) {
        const acks = item.acknowledgments.map(ack => {
          if (ack.department === departmentToAck) {
            return {
              ...ack,
              acknowledged: true,
              acknowledgedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              remarks: ackRemarksInput.trim() || 'Formally received and endorsed by Department Secretary.'
            };
          }
          return ack;
        });
        return { ...item, acknowledgments: acks };
      }
      return item;
    });

    setDispatches(updated);
    localStorage.setItem('ccc_secretariat_dispatches', JSON.stringify(updated));
    setAckRemarksInput('');
  };

  // Handle Department Secretary Replying
  const handleSendReply = (dispatchId: string) => {
    if (!replyMessageInput.trim()) return;

    const deptInfo = ALL_11_DEPARTMENTS.find(d => d.id === simulatedSecretaryDept);
    const newReply = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      department: simulatedSecretaryDept,
      secretaryName: `${deptInfo?.secretaryName} (${deptInfo?.label} Secretary)`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      message: replyMessageInput.trim()
    };

    const updated = dispatches.map(item => {
      if (item.id === dispatchId) {
        return {
          ...item,
          replies: [...item.replies, newReply]
        };
      }
      return item;
    });

    setDispatches(updated);
    localStorage.setItem('ccc_secretariat_dispatches', JSON.stringify(updated));
    setReplyMessageInput('');
  };

  const filteredDispatches = dispatches.filter(d => {
    const matchesPriority = filterPriority === 'all' || d.priority === filterPriority;
    const matchesQuery = searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.memoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: General Secretariat Authority */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-amber-400/20 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30 flex items-center gap-1.5">
                <Landmark className="w-3 h-3" /> Parish General Secretariat
              </span>
              <span className="text-xs text-blue-200 font-mono">
                Official Information Dissemination Platform
              </span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-black text-white tracking-tight">
              Parochial Secretary Inter-Departmental Dispatch Center
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl mt-1.5 leading-relaxed font-sans">
              Centralized administrative clearinghouse for <strong>Evang. Olusegun Faleti (Parochial Secretary)</strong> to broadcast binding directives, statutory assembly notices, and council resolutions to the Secretaries of all 11 Parish Departments with certified receipt tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onNavigateToMainDashboard && (
              <button
                onClick={onNavigateToMainDashboard}
                className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all border border-white/30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Central Dashboard</span>
              </button>
            )}
            <button
              onClick={() => setIsComposing(true)}
              className="bg-amber-400 hover:bg-amber-300 text-[#1E3A8A] px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Issue New Directive to Secretaries
            </button>
          </div>
        </div>

        {/* 11 Department Secretary Quick Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-blue-400/30">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-blue-200">Departmental Secretaries</div>
            <div className="text-xl font-bold font-serif text-white">11 Registered</div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">100% Units Connected</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-blue-200">Total Communiqués</div>
            <div className="text-xl font-bold font-serif text-white">{dispatches.length} Active</div>
            <div className="text-[10px] text-blue-200 font-semibold mt-0.5">Dispatched to Desks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-blue-200">Active Directives</div>
            <div className="text-xl font-bold font-serif text-white">
              {dispatches.filter(d => d.priority === 'Emergency' || d.priority === 'High Priority').length} Priority
            </div>
            <div className="text-[10px] text-amber-300 font-semibold mt-0.5">Requires Stamped Ack</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-blue-200">Secretariat Authority</div>
            <div className="text-xs font-bold text-white truncate mt-1">Evang. Olusegun Faleti</div>
            <div className="text-[10px] text-blue-200 font-semibold">Parochial Secretary</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List of Dispatches, Right Active Dispatch with 11-Secretary Matrix & Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Dispatches Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-slate-800">
                Dispatched Communiqués Archive
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                {filteredDispatches.length} Entries
              </span>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search memos, ref no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="Emergency">Emergency</option>
                <option value="High Priority">High Priority</option>
                <option value="Routine">Routine</option>
                <option value="Statutory">Statutory</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredDispatches.map((item) => {
                const isSelected = item.id === activeDispatch?.id;
                const totalAcks = item.acknowledgments.length;
                const completedAcks = item.acknowledgments.filter(a => a.acknowledged).length;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveDispatchId(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]/20'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                        {item.memoNumber}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                        item.priority === 'High Priority' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                      <span>{item.dateDispatched}</span>
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {completedAcks} of {totalAcks} Secretaries Acknowledged
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Dispatch Dossier & 11-Secretary Acknowledgment Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {activeDispatch ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* Official CCC Letterhead Format */}
              <div className="border-b-2 border-[#1E3A8A] pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-800 tracking-wider uppercase block">
                      OFFICIAL DISSEMINATION MEMORANDUM
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                      {activeDispatch.title}
                    </h2>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-800 block">
                      Ref: {activeDispatch.memoNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Date: {activeDispatch.dateDispatched}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Category</span>
                    <span className="font-semibold text-slate-800">{activeDispatch.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Authorizing Officer</span>
                    <span className="font-semibold text-slate-800">{activeDispatch.author}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Acknowledgment Deadline</span>
                    <span className="font-semibold text-red-700">
                      {activeDispatch.deadline ? activeDispatch.deadline : 'Immediate Circulation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Memo Body */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                  Official Directive Text
                </div>
                <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                  {activeDispatch.fullBody}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Signatory: <strong>Evang. Olusegun Faleti</strong> (Parochial Secretary)</span>
                  <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono font-bold">
                    OFFICIAL SECRETARIAT SEAL AFFIXED
                  </span>
                </div>
              </div>

              {/* 11-Department Secretary Acknowledgment Status Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Departmental Secretaries Acknowledgment Status
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Track verified receipt and departmental endorsement across all units.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {activeDispatch.acknowledgments.filter(a => a.acknowledged).length} / {activeDispatch.acknowledgments.length} Acknowledged
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeDispatch.acknowledgments.map((ack) => (
                    <div
                      key={ack.department}
                      className={`p-3 rounded-xl border transition-all ${
                        ack.acknowledged
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-xs font-bold text-slate-800 line-clamp-1">
                          {ack.departmentLabel}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          ack.acknowledged
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ack.acknowledged ? 'Acknowledged' : 'Pending'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 line-clamp-1">
                        Secretary: <strong>{ack.secretaryName}</strong>
                      </div>

                      {ack.acknowledged ? (
                        <div className="text-[10px] text-emerald-700 font-mono mt-1">
                          ✓ Signed at {ack.acknowledgedAt}
                          {ack.remarks && <p className="text-[10px] italic text-slate-500 mt-0.5">"{ack.remarks}"</p>}
                        </div>
                      ) : (
                        <div className="text-[10px] text-amber-700 font-mono mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Awaiting Secretary Stamp
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Department Secretary Action Box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-serif text-xs font-bold text-blue-900">
                      Department Secretary Interactive Receiving Desk
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Acting as:</span>
                    <select
                      value={simulatedSecretaryDept}
                      onChange={(e) => setSimulatedSecretaryDept(e.target.value as Department)}
                      className="text-xs py-1 px-2 rounded-lg bg-white border border-blue-200 font-semibold text-blue-900 focus:outline-none"
                    >
                      {ALL_11_DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.label} ({d.secretaryName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Acknowledgment action */}
                {(() => {
                  const currAck = activeDispatch.acknowledgments.find(a => a.department === simulatedSecretaryDept);
                  const isAlreadyAck = currAck?.acknowledged;

                  return (
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add acknowledgment remarks or compliance note..."
                        value={ackRemarksInput}
                        onChange={(e) => setAckRemarksInput(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAcknowledge(activeDispatch.id, simulatedSecretaryDept)}
                        className={`w-full sm:w-auto shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          isAlreadyAck
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-[#1E3A8A] text-white hover:bg-blue-900 shadow-sm'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {isAlreadyAck ? 'Re-affix Secretary Stamp' : 'Acknowledge Receipt'}
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Department Secretary Feedback & Correspondence Replies */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    Inter-Secretariat Correspondence & Feedback Thread ({activeDispatch.replies.length})
                  </h4>
                </div>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {activeDispatch.replies.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-lg">
                      No departmental feedback logged yet for this memo.
                    </div>
                  ) : (
                    activeDispatch.replies.map((rep) => (
                      <div key={rep.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-900">{rep.secretaryName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{rep.date}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{rep.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit reply */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder={`Submit response as ${ALL_11_DEPARTMENTS.find(d => d.id === simulatedSecretaryDept)?.label} Secretary...`}
                    value={replyMessageInput}
                    onChange={(e) => setReplyMessageInput(e.target.value)}
                    className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply(activeDispatch.id);
                    }}
                  />
                  <button
                    onClick={() => handleSendReply(activeDispatch.id)}
                    className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-lg hover:bg-blue-800 flex items-center gap-1 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Reply
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a communique from the left panel to review details.
            </div>
          )}
        </div>

      </div>

      {/* MODAL: Parochial Secretary Compose New Memo */}
      {isComposing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-fade-in space-y-4">
            
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Parochial Secretary Desk</span>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Compose Inter-Departmental Dissemination Memo
                </h3>
              </div>
              <button onClick={() => setIsComposing(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Memorandum Title / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Compliance with 2026 Parish Assembly Guidelines"
                  value={memoTitle}
                  onChange={(e) => setMemoTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SecretariatDispatch['category'])}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="Parish Council Resolution">Parish Council Resolution</option>
                    <option value="Urgent Executive Directive">Urgent Executive Directive</option>
                    <option value="Statutory Assembly Notice">Statutory Assembly Notice</option>
                    <option value="Financial & Audit Call">Financial & Audit Call</option>
                    <option value="Liturgical & Event Order">Liturgical & Event Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as SecretariatDispatch['priority'])}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="High Priority">High Priority</option>
                    <option value="Routine">Routine</option>
                    <option value="Statutory">Statutory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Target Department Secretaries</label>
                <div className="flex gap-4 mb-2 text-xs font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={targetType === 'ALL'}
                      onChange={() => setTargetType('ALL')}
                    />
                    Broadcast to All 11 Department Secretaries
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={targetType === 'CUSTOM'}
                      onChange={() => setTargetType('CUSTOM')}
                    />
                    Select Specific Department Secretaries
                  </label>
                </div>

                {targetType === 'CUSTOM' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-lg border max-h-36 overflow-y-auto text-xs">
                    {ALL_11_DEPARTMENTS.map(dept => (
                      <label key={dept.id} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDepts.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedDepts([...selectedDepts, dept.id]);
                            else setSelectedDepts(selectedDepts.filter(d => d !== dept.id));
                          }}
                        />
                        <span className="truncate">{dept.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Summary Abstract</label>
                <input
                  type="text"
                  placeholder="Short 1-line brief for notifications"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Memorandum Text</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide the complete directives, instructions, requirements, and compliance timelines..."
                  value={fullBody}
                  onChange={(e) => setFullBody(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Disseminate to Secretaries
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
