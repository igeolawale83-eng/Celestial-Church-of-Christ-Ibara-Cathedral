import React, { useState } from 'react';
import {
  Users,
  Calendar,
  BookOpen,
  Plus,
  Book,
  Activity,
  CheckCircle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronRight,
  UserPlus,
  Trash2,
  Shield,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { YouthEvent, SkillProgram, UnitExecutive } from '../types';
import { initialYouthEvents, initialSkillPrograms, initialYouthExecutives } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface YouthWingProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

interface SyllabusWeek {
  week: number;
  topic: string;
  speaker: string;
  status: 'Completed' | 'Current' | 'Upcoming';
}

const initialSyllabus: SyllabusWeek[] = [
  { week: 1, topic: 'The Full Armor of God', speaker: 'Eld. Thomas', status: 'Completed' },
  { week: 2, topic: 'Faith in Action: Facing Giants', speaker: 'Sis. Sarah', status: 'Current' },
  { week: 3, topic: 'The Fruit of the Spirit', speaker: 'Evang. Jude', status: 'Upcoming' },
  { week: 4, topic: 'Financial Integrity for Youth', speaker: 'Deac. Rowe', status: 'Upcoming' }
];

export default function YouthWing({ onNavigateToSecretariat, onNavigateToMainDashboard }: YouthWingProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [events, setEvents] = useState<YouthEvent[]>(initialYouthEvents);
  const [skills, setSkills] = useState<SkillProgram[]>(initialSkillPrograms);
  const [syllabus, setSyllabus] = useState<SyllabusWeek[]>(initialSyllabus);

  // Overlays
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingExec, setIsAddingExec] = useState(false);
  const [executives, setExecutives] = useState<UnitExecutive[]>(initialYouthExecutives);

  // Form states
  const [newExec, setNewExec] = useState({
    name: '',
    rank: 'Brother',
    office: '',
    contact: '',
    status: 'Active' as UnitExecutive['status']
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    location: 'Parish Hall',
    dateStr: 'Oct 28',
    capacity: '150'
  });

  const [newSkill, setNewSkill] = useState({
    title: '',
    duration: '8 Weeks',
    enrolled: '15'
  });

  // Handlers
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) {
      alert('Please specify the event title.');
      return;
    }
    const parts = newEvent.dateStr.split(' ');
    const month = parts[0] || 'Oct';
    const day = parts[1] || '28';

    const created: YouthEvent = {
      id: `YEV-0${events.length + 1}`,
      month,
      day,
      date: newEvent.dateStr,
      title: newEvent.title,
      location: newEvent.location,
      eventId: `YW-${Math.floor(1000 + Math.random() * 9000)}`,
      registered: 1,
      capacity: parseInt(newEvent.capacity) || 100
    };

    setEvents([...events, created]);
    setIsAddingEvent(false);
    setNewEvent({ title: '', location: 'Parish Hall', dateStr: 'Oct 28', capacity: '150' });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.title) {
      alert('Please enter program title.');
      return;
    }
    const created: SkillProgram = {
      id: `SKP-0${skills.length + 1}`,
      title: newSkill.title,
      duration: newSkill.duration,
      enrolled: parseInt(newSkill.enrolled) || 10,
      status: 'Active',
      progress: 0,
      progressLabel: 'Not started'
    };
    setSkills([...skills, created]);
    setIsAddingSkill(false);
    setNewSkill({ title: '', duration: '8 Weeks', enrolled: '15' });
  };

  const handleRegisterEvent = (id: string) => {
    setEvents(events.map(ev => {
      if (ev.id === id) {
        if (ev.registered >= ev.capacity) {
          alert('This youth event is already fully booked.');
          return ev;
        }
        return {
          ...ev,
          registered: ev.registered + 1
        };
      }
      return ev;
    }));
  };

  const handleIncrementSkill = (id: string) => {
    setSkills(skills.map(sk => {
      if (sk.id === id) {
        const nextProgress = Math.min(sk.progress + 12.5, 100);
        const currentWeekNum = Math.min(Math.ceil((nextProgress / 100) * 8), 8);
        const isFinished = nextProgress === 100;

        return {
          ...sk,
          progress: nextProgress,
          status: isFinished ? 'Completed' : 'Active',
          progressLabel: isFinished ? 'Graduated' : `Week ${currentWeekNum || 1} of 8`
        };
      }
      return sk;
    }));
  };

  const handleToggleSyllabusStatus = (weekNum: number) => {
    setSyllabus(syllabus.map(s => {
      if (s.week === weekNum) {
        const nextStatus =
          s.status === 'Upcoming'
            ? 'Current'
            : s.status === 'Current'
            ? 'Completed'
            : 'Upcoming';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleAddExec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExec.name || !newExec.office || !newExec.contact) {
      alert('Please fill out all fields.');
      return;
    }
    const created: UnitExecutive = {
      id: `YEX-0${executives.length + 1}`,
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

  // Metrics
  const activeEventsCount = events.length;
  const totalEnrolledYths = skills.reduce((sum, s) => sum + s.enrolled, 0);

  return (
    <div className="space-y-6">
      {/* Youth Council Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Users className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Next-Gen Leadership & Ministry
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Fellowship • Skills Acquisition • Spiritual Retreats
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Youth Council
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Empowering the youth body of CCC Ibara Cathedral through leadership development, professional skill workshops, Bible symposiums, and evangelical mobilization.
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

      {/* Top Banner Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Scheduled Youth Convocations
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {activeEventsCount} Registered Events
            </span>
            <span className="font-sans text-[11px] text-celestial-gray-500 block mt-1">
              Retreats, praise nights, & general panels
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-900">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Skill Acquisition Enrollment
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {totalEnrolledYths} Students
            </span>
            <span className="font-sans text-[11px] text-green-600 font-semibold block mt-1">
              Empowerment program attendees
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-900">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Active Syllabus Chapter
            </span>
            <span className="font-serif text-xl font-bold text-celestial-blue-900 block line-clamp-1">
              {syllabus.find(s => s.status === 'Current')?.topic || 'Faith Study'}
            </span>
            <span className="font-sans text-[11px] text-celestial-gray-500 block mt-1">
              Week {syllabus.find(s => s.status === 'Current')?.week || 1} • Sis. Sarah
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-gold-50 flex items-center justify-center text-celestial-gold-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main double column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Events Coordinator (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-celestial-blue-900">Youth Events Board</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Upcoming gatherings & corporate youth functions.</p>
            </div>
            <button
              onClick={() => setIsAddingEvent(true)}
              className="bg-celestial-blue-900 text-white font-sans text-xs px-3.5 py-1.5 rounded-lg font-semibold hover:bg-celestial-blue-800 transition-all flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Post Event
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {events.map((ev) => {
              const completionPercent = Math.round((ev.registered / ev.capacity) * 100);
              return (
                <div
                  key={ev.id}
                  className="border border-celestial-gray-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow bg-celestial-offwhite/10"
                >
                  <div className="w-14 h-14 rounded-lg bg-celestial-blue-100 flex flex-col items-center justify-center font-sans shrink-0 border border-celestial-blue-200">
                    <span className="text-[10px] text-celestial-blue-900 font-bold uppercase">{ev.month}</span>
                    <span className="text-lg text-celestial-blue-900 font-bold leading-none">{ev.day}</span>
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-bold text-celestial-blue-900 leading-tight">
                        {ev.title}
                      </h4>
                      <span className="font-sans text-[10px] text-celestial-gray-500 font-semibold uppercase">
                        {ev.eventId}
                      </span>
                    </div>

                    <p className="font-sans text-[11px] text-celestial-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-celestial-gray-500" /> {ev.location}
                    </p>

                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-sans text-celestial-gray-500 mb-1 font-semibold">
                        <span>Registrations ({ev.registered} / {ev.capacity})</span>
                        <span>{completionPercent}% Reserved</span>
                      </div>
                      <div className="w-full bg-celestial-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-celestial-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleRegisterEvent(ev.id)}
                        className="bg-white border border-celestial-gray-200 hover:bg-celestial-blue-50 text-celestial-blue-900 px-3 py-1 rounded-md font-sans text-[10px] font-bold shadow-sm flex items-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" /> RSVP Registration
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Skill Programs & Empowerment (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-celestial-blue-900">Empowerment Registry</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Youth physical development, vocational programs.</p>
            </div>
            <button
              onClick={() => setIsAddingSkill(true)}
              className="text-celestial-blue-900 hover:bg-celestial-offwhite p-1 rounded"
              title="Add Empowerment Program"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {skills.map((item) => (
              <div
                key={item.id}
                className="border border-celestial-gray-200 rounded-lg p-4 bg-white hover:border-celestial-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-sans text-xs font-bold text-celestial-gray-800 leading-tight">
                    {item.title}
                  </h4>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-celestial-blue-100 text-celestial-blue-900'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="font-sans text-[10px] text-celestial-gray-500 mb-3">
                  Duration: {item.duration} • Enrolled: <span className="font-bold text-celestial-blue-950">{item.enrolled} youth</span>
                </p>

                <div className="w-full bg-celestial-gray-100 h-2 rounded-full overflow-hidden mb-2 relative">
                  <div
                    className="bg-celestial-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-sans text-[10px] text-celestial-gray-500 font-bold">
                    {item.progressLabel} ({Math.round(item.progress)}%)
                  </span>
                  {item.status !== 'Completed' && (
                    <button
                      onClick={() => handleIncrementSkill(item.id)}
                      className="text-celestial-blue-900 hover:underline font-sans text-[10px] font-bold"
                    >
                      Increment Week &gt;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bible Study Syllabus section (12 cols) */}
      <section className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-serif text-base font-bold text-celestial-blue-900">Weekly Devotional Syllabus Planner</h3>
            <p className="font-sans text-xs text-celestial-gray-500">Active scripture studies and chapter leaders.</p>
          </div>
          <span className="font-sans text-xs font-bold text-celestial-gray-500 uppercase">
            Syllabus: Fall Quarter
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {syllabus.map((study) => (
            <div
              key={study.week}
              onClick={() => handleToggleSyllabusStatus(study.week)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                study.status === 'Completed'
                  ? 'bg-green-50/50 border-green-200'
                  : study.status === 'Current'
                  ? 'bg-celestial-blue-50/40 border-celestial-blue-200 border-l-4 border-l-celestial-blue-900'
                  : 'bg-celestial-offwhite border-celestial-gray-200 hover:border-celestial-gray-400'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-sans text-[10px] text-celestial-gray-500 font-bold uppercase tracking-wider">
                  Week {study.week}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    study.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : study.status === 'Current'
                      ? 'bg-celestial-blue-900 text-white'
                      : 'bg-celestial-gray-200 text-celestial-gray-500'
                  }`}
                >
                  {study.status}
                </span>
              </div>
              <h4 className="font-serif text-sm font-semibold text-celestial-blue-900 mb-2 leading-tight">
                {study.topic}
              </h4>
              <p className="font-sans text-[11px] text-celestial-gray-500 mt-1">
                Moderator: <span className="font-bold text-celestial-gray-800">{study.speaker}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Youth Wing Executive Committee Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="youth-executives-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Youth Wing Executive Committee
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official leadership body managing programs, spiritual empowerment, and skill acquisitions for the youths.</p>
          </div>
          <button
            onClick={() => setIsAddingExec(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-youth-exec-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Youth Executive
          </button>
        </div>

        {/* Executives Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                <th className="py-3 px-4">Youth Office</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {executives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No youth executives registered yet. Click "Add Youth Executive" to get started.
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

      {/* New Youth Executive Dialog Overlay */}
      {isAddingExec && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Youth Executive
            </h3>
            <form onSubmit={handleAddExec} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. David Alao"
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
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Youth Office / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youth Leader, Asst. Youth Leader, Coordinator"
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

      {/* Post Event Overlay */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Post Youth Gathering</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campfire worship night"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Date String</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oct 28"
                    value={newEvent.dateStr}
                    onChange={(e) => setNewEvent({ ...newEvent, dateStr: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Max Attendee Capacity</label>
                <input
                  type="number"
                  required
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Program Overlay */}
      {isAddingSkill && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Establish Empowerment Track</h3>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Empowerment Track Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Photography Masterclass"
                  value={newSkill.title}
                  onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={newSkill.duration}
                    onChange={(e) => setNewSkill({ ...newSkill, duration: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Enrolled Count</label>
                  <input
                    type="number"
                    required
                    value={newSkill.enrolled}
                    onChange={(e) => setNewSkill({ ...newSkill, enrolled: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Establish Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="youth"
        departmentName="Youth Council"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="youth"
        departmentName="Youth Council"
      />
    </div>
  );
}
