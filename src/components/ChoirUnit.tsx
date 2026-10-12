import React, { useState } from 'react';
import {
  Music,
  Search,
  Plus,
  Shirt,
  CheckCircle,
  HelpCircle,
  ListFilter,
  Volume2,
  Bookmark,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  UserPlus,
  Trash2,
  Shield,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { Hymn, RobeInventory, ChoirMemberAttendance, UnitExecutive } from '../types';
import { initialHymns, initialRobeInventory, initialChoirAttendance, initialChoirExecutives } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface ChoirUnitProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function ChoirUnit({ onNavigateToSecretariat, onNavigateToMainDashboard }: ChoirUnitProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [hymns, setHymns] = useState<Hymn[]>(initialHymns);
  const [robes, setRobes] = useState<RobeInventory>(initialRobeInventory);
  const [attendance, setAttendance] = useState<ChoirMemberAttendance[]>(initialChoirAttendance);
  const [executives, setExecutives] = useState<UnitExecutive[]>(initialChoirExecutives);
  const [isAddingExec, setIsAddingExec] = useState(false);

  const [newExec, setNewExec] = useState({
    name: '',
    rank: 'Leader',
    office: '',
    contact: '',
    status: 'Active' as UnitExecutive['status']
  });

  // Filters
  const [hymnSearch, setHymnSearch] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  // Overlays
  const [isAddingHymn, setIsAddingHymn] = useState(false);

  // Form states
  const [newHymn, setNewHymn] = useState({
    hymnNo: '',
    title: '',
    language: 'Yoruba' as Hymn['language'],
    theme: 'Praise' as Hymn['theme']
  });

  // Handlers
  const handleAddHymn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHymn.hymnNo || !newHymn.title) {
      alert('Please fill out Hymn details.');
      return;
    }
    const created: Hymn = {
      id: `HYM-0${hymns.length + 1}`,
      hymnNo: newHymn.hymnNo,
      title: newHymn.title,
      language: newHymn.language,
      theme: newHymn.theme,
      servicesUsed: 1
    };
    setHymns([created, ...hymns]);
    setIsAddingHymn(false);
    setNewHymn({ hymnNo: '', title: '', language: 'Yoruba', theme: 'Praise' });
  };

  const handleIncrementUsed = (id: string) => {
    setHymns(hymns.map(h => {
      if (h.id === id) {
        return { ...h, servicesUsed: h.servicesUsed + 1 };
      }
      return h;
    }));
  };

  const handleAdjustRobe = (key: keyof RobeInventory, delta: number) => {
    setRobes(prev => {
      const currentValue = prev[key] as number;
      const nextVal = currentValue + delta;
      if (nextVal < 0) return prev;

      // Ensure that assigned + inWash + repairsNeeded do not exceed total
      if (key !== 'total') {
        const otherSum = Object.entries(prev)
          .filter(([k]) => k !== 'total' && k !== key)
          .reduce((sum, [_, v]) => sum + (v as number), 0);

        if (otherSum + nextVal > prev.total) {
          alert('Allocations cannot exceed the total robe inventory.');
          return prev;
        }
      }

      return {
        ...prev,
        [key]: nextVal
      };
    });
  };

  const handleAttendanceChange = (id: string, nextStatus: ChoirMemberAttendance['status']) => {
    setAttendance(attendance.map(member => {
      if (member.id === id) {
        return { ...member, status: nextStatus };
      }
      return member;
    }));
  };

  const handleAddExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExec.name || !newExec.office || !newExec.contact) {
      alert('Please fill out all fields.');
      return;
    }
    const created: UnitExecutive = {
      id: `CEX-0${executives.length + 1}`,
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
  const presentCount = attendance.filter(m => m.status === 'Present').length;
  const attendanceRate = Math.round((presentCount / attendance.length) * 100) || 0;

  // Filter computations
  const filteredHymns = hymns.filter(h => {
    const matchesSearch =
      h.hymnNo.includes(hymnSearch) ||
      h.title.toLowerCase().includes(hymnSearch.toLowerCase()) ||
      h.theme.toLowerCase().includes(hymnSearch.toLowerCase());
    const matchesLang = languageFilter === 'all' || h.language === languageFilter;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="space-y-6">
      {/* The Model Choir Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Music className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Liturgical Choral Ministry
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Hymnals • Organists • Cassock Robe Inventory
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                The Model Choir
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Leading the sanctuary in angelic praise, sacred anthems, traditional hymns, choral cantatas, and vocal rehearsal discipline.
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

      {/* Dynamic Choir Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Active Hymnal Catalog
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {hymns.length} Traditional Hymns
            </span>
            <span className="font-sans text-[11px] text-celestial-gray-500 block mt-1">
              Indexed for English & Yoruba liturgy
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-900">
            <Music className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Robe Wardrobe Registry
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {robes.assigned} / {robes.total} Allocated
            </span>
            <span className="font-sans text-[11px] text-celestial-gold-600 font-semibold block mt-1">
              {robes.inWash} in laundry • {robes.repairsNeeded} needing repair
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-gold-50 flex items-center justify-center text-celestial-gold-600">
            <Shirt className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Vocal Roster Attendance
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {attendanceRate}% Present
            </span>
            <span className="font-sans text-[11px] text-green-600 font-semibold block mt-1">
              {presentCount} soprano/tenor/bass active today
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-900">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Directory & Laundry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hymn Directory (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-celestial-blue-900">Hymnal Directory</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Traditional hymn selection database & liturgy log.</p>
            </div>
            <button
              onClick={() => setIsAddingHymn(true)}
              className="bg-celestial-blue-900 text-white font-sans text-xs px-3.5 py-1.5 rounded-lg font-semibold hover:bg-celestial-blue-800 transition-all flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Hymn
            </button>
          </div>

          <div className="p-4 border-b border-celestial-gray-200 flex gap-2 shrink-0">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-celestial-gray-500 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search hymn number, title or theme..."
                value={hymnSearch}
                onChange={(e) => setHymnSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-celestial-offwhite border border-celestial-gray-200 rounded-lg font-sans text-xs focus:outline-none focus:border-celestial-blue-500"
              />
            </div>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-2.5 py-1.5 font-sans text-xs text-celestial-gray-800"
            >
              <option value="all">All Languages</option>
              <option value="Yoruba">Yoruba</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="flex-grow overflow-y-auto p-4">
            <div className="space-y-2.5">
              {filteredHymns.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-celestial-gray-200 rounded-lg hover:border-celestial-blue-500 transition-all bg-celestial-offwhite/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-celestial-blue-50 rounded-lg flex flex-col items-center justify-center font-sans">
                      <span className="text-[10px] text-celestial-blue-900 font-bold uppercase tracking-wide">No</span>
                      <span className="text-xs text-celestial-blue-900 font-bold leading-none">{item.hymnNo}</span>
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-celestial-gray-800 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="font-sans text-[10px] text-celestial-gray-500 mt-0.5">
                        Theme: <span className="font-semibold text-celestial-blue-900">{item.theme}</span> • Lang:{' '}
                        {item.language}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[10px] text-celestial-gray-500 font-semibold uppercase">
                      Used: {item.servicesUsed}x
                    </span>
                    <button
                      onClick={() => handleIncrementUsed(item.id)}
                      className="bg-white border border-celestial-gray-200 hover:bg-celestial-offwhite text-celestial-blue-900 font-sans text-[10px] font-bold px-2 py-1 rounded shadow-xs"
                    >
                      Log Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Robe Wardrobe Management (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 shrink-0">
            <h3 className="font-serif text-base font-bold text-celestial-blue-900">Robe Inventory Controls</h3>
            <p className="font-sans text-xs text-celestial-gray-500">Adjust laundering cycles & damage repair allocations.</p>
          </div>

          <div className="flex-grow p-6 flex flex-col justify-between">
            {/* Control cards */}
            <div className="space-y-5">
              {/* Total Row */}
              <div className="flex items-center justify-between p-4 bg-celestial-offwhite rounded-xl border border-celestial-gray-200">
                <div>
                  <span className="font-sans text-xs font-bold text-celestial-gray-800 block">Total Robe Registry</span>
                  <span className="font-sans text-[11px] text-celestial-gray-500">Active inventory pool size</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdjustRobe('total', -1)}
                    className="w-7 h-7 rounded-full bg-white border border-celestial-gray-200 hover:bg-celestial-gray-100 flex items-center justify-center font-bold text-celestial-gray-800 text-sm"
                  >
                    -
                  </button>
                  <span className="font-serif text-lg font-bold text-celestial-blue-900 w-8 text-center">{robes.total}</span>
                  <button
                    onClick={() => handleAdjustRobe('total', 1)}
                    className="w-7 h-7 rounded-full bg-white border border-celestial-gray-200 hover:bg-celestial-gray-100 flex items-center justify-center font-bold text-celestial-gray-800 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Laundering Row */}
              <div className="flex items-center justify-between p-4 bg-celestial-offwhite rounded-xl border border-celestial-gray-200">
                <div>
                  <span className="font-sans text-xs font-bold text-celestial-gray-800 block">Laundry Cycle (In Wash)</span>
                  <span className="font-sans text-[11px] text-celestial-gray-500">Sent to dry cleaning team</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdjustRobe('inWash', -1)}
                    className="w-7 h-7 rounded-full bg-white border border-celestial-gray-200 hover:bg-celestial-gray-100 flex items-center justify-center font-bold text-celestial-gray-800 text-sm"
                  >
                    -
                  </button>
                  <span className="font-serif text-lg font-bold text-celestial-blue-900 w-8 text-center">{robes.inWash}</span>
                  <button
                    onClick={() => handleAdjustRobe('inWash', 1)}
                    className="w-7 h-7 rounded-full bg-white border border-celestial-gray-200 hover:bg-celestial-gray-100 flex items-center justify-center font-bold text-celestial-gray-800 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Repair Row */}
              <div className="flex items-center justify-between p-4 bg-celestial-offwhite rounded-xl border border-celestial-gray-200">
                <div>
                  <span className="font-sans text-xs font-bold text-celestial-gray-800 block">Needs Repair</span>
                  <span className="font-sans text-[11px] text-celestial-gray-500">Torn hems, stains, or missing tassels</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAdjustRobe('repairsNeeded', -1)}
                    className="w-7 h-7 rounded-full bg-white border border-celestial-gray-200 hover:bg-celestial-gray-100 flex items-center justify-center font-bold text-celestial-gray-800 text-sm"
                  >
                    -
                  </button>
                  <span className="font-serif text-lg font-bold text-celestial-blue-900 w-8 text-center">{robes.repairsNeeded}</span>
                  <button
                    onClick={() => handleAdjustRobe('repairsNeeded', 1)}
                    className="w-7 h-7 rounded-full bg-white border border-celestial-gray-200 hover:bg-celestial-gray-100 flex items-center justify-center font-bold text-celestial-gray-800 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Quick action button */}
            <button
              onClick={() => alert('Dry cleaners notification dispatched')}
              className="w-full bg-celestial-gray-800 hover:bg-celestial-gray-800 text-white font-sans text-xs font-semibold py-2.5 rounded-lg shadow-sm transition-all text-center"
            >
              Dispatch Dry Cleaning Service Alert
            </button>
          </div>
        </section>
      </div>

      {/* Choir Attendance Registry (12 cols) */}
      <section className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-base font-bold text-celestial-blue-900">Choir Vocal Attendance</h3>
            <p className="font-sans text-xs text-celestial-gray-500">Verify present vocalists for Sunday high praise rehearsal.</p>
          </div>
          <button
            onClick={() => alert('Rehearsal attendance roster completed & indexed')}
            className="border border-celestial-gray-200 hover:bg-celestial-offwhite text-celestial-gray-800 font-sans text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Submit Today's Roster
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {attendance.map((member) => (
            <div
              key={member.id}
              className="border border-celestial-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-celestial-offwhite/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full border border-celestial-gray-200 overflow-hidden bg-celestial-blue-100 flex items-center justify-center text-xs font-bold text-celestial-blue-900">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span>{member.initials}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-celestial-gray-800 leading-tight">
                    {member.name}
                  </h4>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-celestial-blue-50 text-celestial-blue-900 rounded font-sans text-[9px] font-bold">
                    {member.voicePart}
                  </span>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-1 bg-celestial-offwhite p-1 rounded-lg border border-celestial-gray-200">
                  {(['Present', 'Excused', 'Absent'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleAttendanceChange(member.id, status)}
                      className={`py-1 text-center font-sans text-[9px] font-semibold rounded ${
                        member.status === status
                          ? status === 'Present'
                            ? 'bg-green-100 text-green-700 font-bold'
                            : status === 'Excused'
                            ? 'bg-celestial-gold-100 text-celestial-gold-600 font-bold'
                            : 'bg-red-100 text-red-700 font-bold'
                          : 'text-celestial-gray-500 hover:text-celestial-gray-800'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Choir Unit Executive Committee Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="choir-executives-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Choir Unit Executive Committee
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official roster of leadership directing, coordinating, and managing the choir robes, rehearsals, and liturgy.</p>
          </div>
          <button
            onClick={() => setIsAddingExec(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-choir-exec-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Choir Executive
          </button>
        </div>

        {/* Executives Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                <th className="py-3 px-4">Choir Office</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {executives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No choir executives registered yet. Click "Add Choir Executive" to get started.
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

      {/* New Choir Executive Dialog Overlay */}
      {isAddingExec && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Choir Executive
            </h3>
            <form onSubmit={handleAddExec} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Ebenezer Fabiyi"
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
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Choir Office / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Choirmaster, Organist, Secretary"
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

      {/* Record Hymn Entry Form Overlay */}
      {isAddingHymn && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Add Liturgical Hymn</h3>
            <form onSubmit={handleAddHymn} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Hymn No.</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 042"
                    value={newHymn.hymnNo}
                    onChange={(e) => setNewHymn({ ...newHymn, hymnNo: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Hymn Language</label>
                  <select
                    value={newHymn.language}
                    onChange={(e) => setNewHymn({ ...newHymn, language: e.target.value as any })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="Yoruba">Yoruba Dialect</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Hymn Title (First Line)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eyin Eniyan Mimo, E Ho Ayo"
                  value={newHymn.title}
                  onChange={(e) => setNewHymn({ ...newHymn, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Thematic Category</label>
                <select
                  value={newHymn.theme}
                  onChange={(e) => setNewHymn({ ...newHymn, theme: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Praise">Praise & Worship</option>
                  <option value="Adoration">Adoration & Purity</option>
                  <option value="Thanksgiving">Thanksgiving Offerings</option>
                  <option value="Passion">Passion & Supplication</option>
                  <option value="Supplication">Prayer & Supplications</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingHymn(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Index Hymn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="choir"
        departmentName="The Model Choir"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="choir"
        departmentName="The Model Choir"
      />
    </div>
  );
}
