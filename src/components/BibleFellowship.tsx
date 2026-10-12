import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  Users,
  Shield,
  Plus,
  Calendar,
  Sparkles,
  Award,
  DollarSign,
  Gift,
  CheckCircle,
  Phone,
  BookmarkCheck,
  GraduationCap,
  Layers,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { FellowshipLeader, BibleStudySyllabus, WelfareBeneficiaryCase, FellowshipEvent } from '../types';
import {
  initialFellowshipLeaders,
  initialBibleStudySyllabus,
  initialWelfareCases,
  initialFellowshipEvents
} from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface BibleFellowshipProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function BibleFellowship({ onNavigateToSecretariat, onNavigateToMainDashboard }: BibleFellowshipProps) {
  const [leaders, setLeaders] = useState<FellowshipLeader[]>(() => {
    const saved = localStorage.getItem('ccc_fellowship_leaders');
    return saved ? JSON.parse(saved) : initialFellowshipLeaders;
  });

  const [syllabus, setSyllabus] = useState<BibleStudySyllabus[]>(() => {
    const saved = localStorage.getItem('ccc_bible_syllabus');
    return saved ? JSON.parse(saved) : initialBibleStudySyllabus;
  });

  const [welfareCases, setWelfareCases] = useState<WelfareBeneficiaryCase[]>(() => {
    const saved = localStorage.getItem('ccc_welfare_cases');
    return saved ? JSON.parse(saved) : initialWelfareCases;
  });

  const [events, setEvents] = useState<FellowshipEvent[]>(() => {
    const saved = localStorage.getItem('ccc_fellowship_events');
    return saved ? JSON.parse(saved) : initialFellowshipEvents;
  });

  const [activeTab, setActiveTab] = useState<'syllabus' | 'welfare' | 'leaders' | 'retreats'>('syllabus');
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Modals
  const [isAddingSyllabus, setIsAddingSyllabus] = useState(false);
  const [isAddingWelfare, setIsAddingWelfare] = useState(false);

  // New Syllabus Form
  const [newSyllabus, setNewSyllabus] = useState({
    topic: '',
    biblePassage: '',
    memoryVerse: '',
    facilitator: 'Elder Gabriel Ojo',
    wing: 'Joint Fellowship' as BibleStudySyllabus['wing']
  });

  // New Welfare Form
  const [newWelfare, setNewWelfare] = useState({
    title: '',
    recipientCategory: 'Widow Welfare' as WelfareBeneficiaryCase['recipientCategory'],
    amountOrSupplies: '',
    coordinator: 'Mother in Celestial Funke Sowande'
  });

  const handleAddSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSyllabus.topic || !newSyllabus.biblePassage) {
      alert('Please fill out topic and Bible passage.');
      return;
    }

    const created: BibleStudySyllabus = {
      id: `SYL-0${syllabus.length + 1}`,
      weekNumber: syllabus.length + 42,
      topic: newSyllabus.topic,
      biblePassage: newSyllabus.biblePassage,
      memoryVerse: newSyllabus.memoryVerse,
      dateScheduled: new Date().toISOString().split('T')[0],
      facilitator: newSyllabus.facilitator,
      wing: newSyllabus.wing
    };

    const updated = [...syllabus, created];
    setSyllabus(updated);
    localStorage.setItem('ccc_bible_syllabus', JSON.stringify(updated));
    setIsAddingSyllabus(false);
    setNewSyllabus({
      topic: '',
      biblePassage: '',
      memoryVerse: '',
      facilitator: 'Elder Gabriel Ojo',
      wing: 'Joint Fellowship'
    });
  };

  const handleAddWelfare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWelfare.title || !newWelfare.amountOrSupplies) {
      alert('Please fill out the title and disbursement amount/supplies.');
      return;
    }

    const created: WelfareBeneficiaryCase = {
      id: `WEL-0${welfareCases.length + 1}`,
      caseId: `WLF-2026-${welfareCases.length + 12}`,
      title: newWelfare.title,
      recipientCategory: newWelfare.recipientCategory,
      dateAssisted: new Date().toISOString().split('T')[0],
      amountOrSupplies: newWelfare.amountOrSupplies,
      coordinator: newWelfare.coordinator,
      status: 'Approved'
    };

    const updated = [created, ...welfareCases];
    setWelfareCases(updated);
    localStorage.setItem('ccc_welfare_cases', JSON.stringify(updated));
    setIsAddingWelfare(false);
    setNewWelfare({
      title: '',
      recipientCategory: 'Widow Welfare',
      amountOrSupplies: '',
      coordinator: 'Mother in Celestial Funke Sowande'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-green-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-amber-400/20 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <BookOpen className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 bg-emerald-400/20 px-2.5 py-0.5 rounded-full border border-emerald-300/30">
                  Family & Discipleship Fellowship
                </span>
                <span className="text-xs text-emerald-200 font-mono">
                  Men's Christian Fellowship & Women Bible Fellowship
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                MC & Women Bible Fellowship
              </h1>
              <p className="text-xs text-emerald-100 max-w-xl mt-1 leading-relaxed font-sans">
                Fostering godly Christian marriage, Biblical exposition, pastoral benevolence for widows and the elderly, and home discipleship in CCC Ibara Cathedral.
              </p>
            </div>
          </div>

          {/* 3-Key Executive Portal Access Trigger */}
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
              className="bg-white hover:bg-emerald-50 text-emerald-900 px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all shadow-md flex items-center gap-2 border border-emerald-200"
            >
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>3-Key Executive Portal</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                Chair • Sec • Treas
              </span>
            </button>
          </div>
        </div>

        {/* Vital Unit Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-400/30">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-emerald-200">Registered Families</div>
            <div className="text-xl font-bold font-serif text-white">420 Couples</div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Men & Women Wings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-emerald-200">Bible Syllabus</div>
            <div className="text-xl font-bold font-serif text-white">{syllabus.length} Active Weeks</div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Doctrinal Curriculum</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-emerald-200">Benevolence Cases</div>
            <div className="text-xl font-bold font-serif text-white">{welfareCases.length} Disbursed</div>
            <div className="text-[10px] text-amber-300 font-semibold mt-0.5">Widows & Elderly Relieved</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-emerald-200">Upcoming Retreat</div>
            <div className="text-xl font-bold font-serif text-white">Couples Seminar</div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Nov 21, 2026</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'syllabus' ? 'border-emerald-700 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Bible Study Syllabus & Exegesis ({syllabus.length})
        </button>
        <button
          onClick={() => setActiveTab('welfare')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'welfare' ? 'border-emerald-700 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4 text-emerald-600" />
          Family Welfare & Benevolence Fund ({welfareCases.length})
        </button>
        <button
          onClick={() => setActiveTab('leaders')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'leaders' ? 'border-emerald-700 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          Fellowship Leadership Council ({leaders.length})
        </button>
        <button
          onClick={() => setActiveTab('retreats')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'retreats' ? 'border-emerald-700 text-emerald-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          Seminars & Retreats ({events.length})
        </button>
      </div>

      {/* TAB 1: Bible Study Syllabus */}
      {activeTab === 'syllabus' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Weekly Bible Study Curriculum & Scripture Passages
              </h3>
              <p className="text-xs text-slate-500">
                Doctrinal outlines and memory verses prepared for Tuesday evening family fellowship.
              </p>
            </div>
            <button
              onClick={() => setIsAddingSyllabus(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Add Syllabus Week
            </button>
          </div>

          <div className="space-y-3">
            {syllabus.map((syl) => (
              <div key={syl.id} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Week {syl.weekNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {syl.wing}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{syl.dateScheduled}</span>
                </div>

                <h4 className="font-serif text-sm font-bold text-slate-900">{syl.topic}</h4>
                <div className="text-xs text-emerald-800 font-medium">Passage: {syl.biblePassage}</div>

                <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-100 text-xs text-emerald-900 italic">
                  {syl.memoryVerse}
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>Facilitator: <strong>{syl.facilitator}</strong></span>
                  <span className="text-emerald-700 font-semibold">Tuesdays 6:00 PM</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Family Welfare & Benevolence */}
      {activeTab === 'welfare' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Fellowship Benevolence & Family Aid Register
              </h3>
              <p className="text-xs text-slate-500">
                Direct humanitarian disbursements for cathedral widows, elderly parishioners, and newborn celebrations.
              </p>
            </div>
            <button
              onClick={() => setIsAddingWelfare(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Record Welfare Disbursement
            </button>
          </div>

          <div className="space-y-3">
            {welfareCases.map((wlf) => (
              <div key={wlf.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{wlf.caseId}</span>
                    <span className="font-serif text-sm font-bold text-slate-900">{wlf.title}</span>
                  </div>
                  <div className="text-xs text-emerald-800 font-bold">{wlf.amountOrSupplies}</div>
                  <div className="text-[11px] text-slate-500">
                    Category: <strong>{wlf.recipientCategory}</strong> • Coordinated by: <strong>{wlf.coordinator}</strong> • {wlf.dateAssisted}
                  </div>
                </div>

                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                  {wlf.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Fellowship Leadership Council */}
      {activeTab === 'leaders' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Executive Leadership & Council Elders
              </h3>
              <p className="text-xs text-slate-500">
                Executive officers of the Men's Christian Fellowship and Women Bible Fellowship.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {leaders.map((lead) => (
              <div key={lead.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {lead.wing}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{lead.status}</span>
                </div>
                <div className="font-serif text-sm font-bold text-slate-900">{lead.name}</div>
                <div className="text-xs text-slate-500">{lead.rank}</div>
                <div className="text-xs font-semibold text-emerald-800">{lead.office}</div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" /> {lead.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Seminars & Retreats */}
      {activeTab === 'retreats' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Annual Retreats, Couples Seminars & Banquets
              </h3>
              <p className="text-xs text-slate-500">
                Spiritual summits designed for marital enrichment and family empowerment.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-slate-900">{evt.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {evt.status}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 italic">Theme: {evt.theme}</p>
                  <div className="text-[11px] text-slate-500">
                    Date: <strong>{evt.date}</strong> • Venue: <strong>{evt.venue}</strong> • Budget: <strong>₦{evt.budget.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD SYLLABUS MODAL */}
      {isAddingSyllabus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b pb-2">
              Add Weekly Bible Study Syllabus
            </h3>
            <form onSubmit={handleAddSyllabus} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Study Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building an Unshakeable Covenant Marriage"
                  value={newSyllabus.topic}
                  onChange={(e) => setNewSyllabus({ ...newSyllabus, topic: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Bible Passage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Peter 3:1-7; Ephesians 5"
                    value={newSyllabus.biblePassage}
                    onChange={(e) => setNewSyllabus({ ...newSyllabus, biblePassage: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Wing</label>
                  <select
                    value={newSyllabus.wing}
                    onChange={(e) => setNewSyllabus({ ...newSyllabus, wing: e.target.value as BibleStudySyllabus['wing'] })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Joint Fellowship">Joint Fellowship</option>
                    <option value="Men Fellowship">Men Fellowship</option>
                    <option value="Women Fellowship">Women Fellowship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Memory Verse</label>
                <textarea
                  rows={2}
                  placeholder="“...as for me and my house, we will serve the Lord.” — Joshua 24:15"
                  value={newSyllabus.memoryVerse}
                  onChange={(e) => setNewSyllabus({ ...newSyllabus, memoryVerse: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Facilitator</label>
                <input
                  type="text"
                  value={newSyllabus.facilitator}
                  onChange={(e) => setNewSyllabus({ ...newSyllabus, facilitator: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingSyllabus(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900"
                >
                  Publish Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD WELFARE MODAL */}
      {isAddingWelfare && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b pb-2">
              Record Welfare / Benevolence Disbursement
            </h3>
            <form onSubmit={handleAddWelfare} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Disbursement Purpose / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Provisions for Cathedral Widows"
                  value={newWelfare.title}
                  onChange={(e) => setNewWelfare({ ...newWelfare, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={newWelfare.recipientCategory}
                    onChange={(e) => setNewWelfare({ ...newWelfare, recipientCategory: e.target.value as WelfareBeneficiaryCase['recipientCategory'] })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Widow Welfare">Widow Welfare</option>
                    <option value="Elderly Member Support">Elderly Member Support</option>
                    <option value="Newborn / Naming Gift">Newborn / Naming Gift</option>
                    <option value="Bereavement Relief">Bereavement Relief</option>
                    <option value="Educational Support">Educational Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Disbursed Amount / Supplies</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₦150,000 + Food Bag"
                    value={newWelfare.amountOrSupplies}
                    onChange={(e) => setNewWelfare({ ...newWelfare, amountOrSupplies: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Welfare Coordinator</label>
                <input
                  type="text"
                  value={newWelfare.coordinator}
                  onChange={(e) => setNewWelfare({ ...newWelfare, coordinator: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingWelfare(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900"
                >
                  Confirm Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="bible_fellowship"
        departmentName="MC & Women Bible Fellowship"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="bible_fellowship"
        departmentName="MC & Women Bible Fellowship"
      />
    </div>
  );
}
