import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Church,
  Flame,
  Sparkles,
  Users,
  Music,
  Shield,
  Video,
  HeartPulse,
  BookOpen,
  Send,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Plus,
  CornerDownRight,
  Activity,
  CheckCheck,
  Award,
  Eye,
  FileText,
  KeyRound,
  LogOut,
  X
} from 'lucide-react';
import { Department, DepartmentFeedback, DepartmentAuthSession } from '../types';
import {
  elevenDepartmentsList,
  initialDepartmentFeedbacks,
  departmentKeyExecutives,
  departmentAuthAccounts
} from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface MainDashboardProps {
  onOpenDepartment: (department: Department) => void;
  onNavigateToSecretariat: () => void;
  session?: DepartmentAuthSession | null;
  onSignOut?: () => void;
}

export default function MainDashboard({
  onOpenDepartment,
  onNavigateToSecretariat,
  session,
  onSignOut
}: MainDashboardProps) {
  // Feedbacks state backed by localStorage
  const [feedbacks, setFeedbacks] = useState<DepartmentFeedback[]>(() => {
    const saved = localStorage.getItem('ccc_department_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialDepartmentFeedbacks;
      }
    }
    return initialDepartmentFeedbacks;
  });

  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credentialsModalTab, setCredentialsModalTab] = useState<'web_logins' | 'executive_keys'>('executive_keys');

  // Modal controls
  const [selectedExecutiveDept, setSelectedExecutiveDept] = useState<Department | null>(null);
  const [selectedFeedbackDept, setSelectedFeedbackDept] = useState<{ id: Department; name: string } | null>(null);

  // Secretary Response Modal
  const [activeFeedbackForReply, setActiveFeedbackForReply] = useState<DepartmentFeedback | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<DepartmentFeedback['status']>('Acknowledged');

  // Filters for Monitoring Center
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Department Icon Mapper
  const getDeptIcon = (id: string) => {
    switch (id) {
      case 'parochial':
        return Landmark;
      case 'shepherd':
        return Church;
      case 'evangelist':
        return Flame;
      case 'prophets':
        return Sparkles;
      case 'side_men_women':
        return Users;
      case 'choir':
        return Music;
      case 'youth':
        return Users;
      case 'security':
        return Shield;
      case 'media':
        return Video;
      case 'medical':
        return HeartPulse;
      case 'bible_fellowship':
        return BookOpen;
      default:
        return Landmark;
    }
  };

  // Sync feedbacks to localStorage
  const saveFeedbacks = (updated: DepartmentFeedback[]) => {
    setFeedbacks(updated);
    localStorage.setItem('ccc_department_feedbacks', JSON.stringify(updated));
  };

  // Handle Church Secretary Response
  const handleSaveSecretaryReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackForReply) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = feedbacks.map((fb) => {
      if (fb.id === activeFeedbackForReply.id) {
        return {
          ...fb,
          status: replyStatus,
          secretaryRemarks: replyText.trim() || fb.secretaryRemarks,
          reviewedBy: 'Evang. Olusegun Faleti (Church Secretary)',
          reviewedAt: formattedDate
        };
      }
      return fb;
    });

    saveFeedbacks(updated);
    setActiveFeedbackForReply(null);
    setReplyText('');
  };

  // Metrics summary
  const totalFeedbacks = feedbacks.length;
  const pendingSecretaryAction = feedbacks.filter((f) => f.status === 'Pending Review').length;
  const acknowledgedFeedbacks = feedbacks.filter((f) => f.status === 'Acknowledged' || f.status === 'Action Taken' || f.status === 'Resolved').length;
  const urgentAlerts = feedbacks.filter((f) => f.priority === 'Urgent' || f.priority === 'Emergency').length;

  // Filtered Feedbacks list for Monitoring Center
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesDept = selectedDepartmentFilter === 'all' || fb.department === selectedDepartmentFilter;
    const matchesStatus = statusFilter === 'all' || fb.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || fb.priority === priorityFilter;
    const matchesQuery =
      fb.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.senderName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesStatus && matchesPriority && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ============================================================== */}
      {/* 1. TOP CATHEDRAL GENERAL SECRETARIAT COMMAND BANNER */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-0 bottom-0 opacity-10 flex items-center pointer-events-none hidden lg:flex">
          <svg viewBox="0 0 100 100" className="w-48 h-48">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M47,20 h6 v60 h-6 z" fill="currentColor" />
            <path d="M30,38 h40 v6 h-40 z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Landmark className="w-9 h-9 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-300/30">
                  Parochial Secretariat Central Monitoring Desk
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  {session ? `Logged In: ${session.shortName} • ${session.officerName}` : 'Session: Church Secretary Desk'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Operational Monitoring
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
                CCC Ibara Cathedral Central Parish Dashboard
              </h1>
              <p className="text-xs md:text-sm text-blue-100 max-w-2xl mt-1 leading-relaxed font-sans">
                Inter-departmental monitoring console uniting all <strong>11 cathedral departments</strong>. Inspect unit operations, review department feedbacks, dispatch pastoral directives, and monitor executive councils.
              </p>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCredentialsModalOpen(true)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-3 rounded-xl font-sans text-xs md:text-sm font-bold transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-sm"
              title="View all 11 department login credentials & passwords"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>11 Dept Login Keys</span>
            </button>

            <button
              onClick={onNavigateToSecretariat}
              className="bg-amber-400 hover:bg-amber-300 text-[#1E3A8A] px-4 py-3 rounded-xl font-sans text-xs md:text-sm font-bold transition-all shadow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Secretariat Dispatch Desk</span>
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('secretary-monitoring-console');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-3 rounded-xl font-sans text-xs md:text-sm font-semibold transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-amber-300" />
              <span>Feedbacks ({feedbacks.length})</span>
            </button>
          </div>
        </div>

        {/* Central Key Stat Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Total Departments</div>
            <div className="text-xl md:text-2xl font-bold font-serif text-white mt-0.5">11 Units</div>
            <div className="text-[11px] text-amber-300 mt-0.5">All monitored 24/7</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Total Feedbacks Received</div>
            <div className="text-xl md:text-2xl font-bold font-serif text-white mt-0.5">{totalFeedbacks} Transmissions</div>
            <div className="text-[11px] text-blue-200 mt-0.5">From all 11 departments</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-200">Pending Secretary Action</div>
            <div className="text-xl md:text-2xl font-bold font-serif text-amber-300 mt-0.5">{pendingSecretaryAction} Reports</div>
            <div className="text-[11px] text-amber-200 mt-0.5">Requires Church Sec review</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">High / Urgent Alerts</div>
            <div className="text-xl md:text-2xl font-bold font-serif text-rose-300 mt-0.5">{urgentAlerts} Critical</div>
            <div className="text-[11px] text-rose-200 mt-0.5">Prioritized in feed</div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. THE 11 DEPARTMENTS CENTRAL MONITORING GRID */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-celestial-gray-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl md:text-2xl font-black text-celestial-blue-900 tracking-tight">
                All 11 Cathedral Departmental Dashboards
              </h2>
              <span className="text-xs bg-[#1E3A8A] text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
                11 OF 11 ACTIVE
              </span>
            </div>
            <p className="text-xs text-celestial-gray-500 font-sans mt-0.5">
              Click any department below to open its dedicated dashboard page. Each unit feeds live operational feedback directly into this central secretariat console.
            </p>
          </div>
        </div>

        {/* 11 Department Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {elevenDepartmentsList.map((dept, index) => {
            const Icon = getDeptIcon(dept.id);
            const deptFeedbacks = feedbacks.filter((f) => f.department === dept.id);
            const latestFeedback = deptFeedbacks[0];
            const hasPendingFeedback = deptFeedbacks.some((f) => f.status === 'Pending Review');
            const creds = departmentKeyExecutives[dept.id] || [];
            const authAccount = departmentAuthAccounts.find((a) => a.department === dept.id);

            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-celestial-gray-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden hover:border-blue-400 group"
              >
                {/* Department Card Header */}
                <div className={`p-5 bg-gradient-to-r ${dept.color} text-white relative overflow-hidden`}>
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
                      <Icon className="w-6 h-6 text-amber-300" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-black/25 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/10">
                        Dept #{index + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        dept.status === 'High Activity'
                          ? 'bg-amber-400 text-[#1E3A8A]'
                          : dept.status === 'Active Duty'
                          ? 'bg-emerald-400 text-emerald-950'
                          : 'bg-white/20 text-white'
                      }`}>
                        {dept.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 relative z-10">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 opacity-90">
                      {dept.category}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white leading-tight mt-0.5">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                {/* Department Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-celestial-gray-600 line-clamp-2 leading-relaxed">
                      {dept.description}
                    </p>

                    {/* Key Metrics row */}
                    <div className="grid grid-cols-2 gap-2 mt-3.5 bg-celestial-offwhite p-2.5 rounded-xl border border-celestial-gray-200/60">
                      <div>
                        <span className="text-[10px] font-semibold text-celestial-gray-400 uppercase tracking-wider block">
                          {dept.statMetric.label}
                        </span>
                        <span className="text-xs font-bold text-celestial-blue-900 block mt-0.5">
                          {dept.statMetric.value}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-celestial-gray-400 uppercase tracking-wider block">
                          {dept.secondaryMetric.label}
                        </span>
                        <span className="text-xs font-bold text-celestial-blue-900 block mt-0.5">
                          {dept.secondaryMetric.value}
                        </span>
                      </div>
                    </div>

                    {/* 3 Key Executive Directory */}
                    <div className="mt-3 pt-3 border-t border-celestial-gray-100">
                      <div className="text-[10px] font-bold text-celestial-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>3 Key Executive Officers</span>
                        <span className="text-blue-600 font-mono text-[9px]">Credentials Ready</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-celestial-gray-700">
                        <div className="flex items-center justify-between truncate">
                          <span className="text-celestial-gray-500 font-medium">Chairman:</span>
                          <span className="font-semibold text-celestial-blue-900 truncate max-w-[170px]" title={dept.chairmanName}>
                            {dept.chairmanName.split(' ')[0]} {dept.chairmanName.split(' ').slice(1, 3).join(' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between truncate">
                          <span className="text-celestial-gray-500 font-medium">Secretary:</span>
                          <span className="font-semibold text-celestial-blue-900 truncate max-w-[170px]" title={dept.secretaryName}>
                            {dept.secretaryName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between truncate">
                          <span className="text-celestial-gray-500 font-medium">Treasurer:</span>
                          <span className="font-semibold text-celestial-blue-900 truncate max-w-[170px]" title={dept.treasurerName}>
                            {dept.treasurerName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Latest Feedback Snippet */}
                    <div className="mt-3 pt-3 border-t border-celestial-gray-100">
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span className="text-celestial-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-blue-600" />
                          Feedback to Secretariat
                        </span>
                        {hasPendingFeedback && (
                          <span className="text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold text-[9px] animate-pulse">
                            Action Pending
                          </span>
                        )}
                      </div>

                      {latestFeedback ? (
                        <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-100 text-[11px]">
                          <div className="font-semibold text-celestial-blue-900 truncate">
                            {latestFeedback.subject}
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-celestial-gray-500">
                            <span>Status: <strong className="text-celestial-gray-800">{latestFeedback.status}</strong></span>
                            <span className="font-mono">{latestFeedback.dateSubmitted.split(' ')[0]}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-celestial-gray-400 italic">
                          No feedback logged yet this week.
                        </div>
                      )}
                    </div>

                    {/* Department Official Login Credentials Box */}
                    {authAccount && (
                      <div className="mt-3 bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-[11px]">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                          <span className="uppercase tracking-wider flex items-center gap-1 text-slate-600">
                            <KeyRound className="w-3 h-3 text-amber-600" />
                            Official Login Keys
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-mono text-[9px]">
                            Verified
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-blue-900 font-bold truncate text-[11px]" title={authAccount.email}>
                            {authAccount.email}
                          </span>
                          <span className="font-mono text-amber-800 font-bold bg-amber-100/70 border border-amber-300 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                            {authAccount.password}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 border-t border-celestial-gray-100 space-y-2">
                    <button
                      onClick={() => onOpenDepartment(dept.id as Department)}
                      className="w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <span>Open {dept.shortName} Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedExecutiveDept(dept.id as Department)}
                        className="bg-white hover:bg-celestial-offwhite text-celestial-gray-700 border border-celestial-gray-200 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Shield className="w-3 h-3 text-blue-700" />
                        <span>3-Key Portal</span>
                      </button>

                      <button
                        onClick={() => setSelectedFeedbackDept({ id: dept.id as Department, name: dept.name })}
                        className="bg-white hover:bg-celestial-offwhite text-blue-900 border border-blue-200 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3 h-3 text-amber-600" />
                        <span>Send Feedback</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CHURCH SECRETARY MONITORING & LIVE FEEDBACK CONTROL CENTER */}
      {/* ============================================================== */}
      <div id="secretary-monitoring-console" className="bg-white rounded-2xl border border-celestial-gray-200 shadow-sm overflow-hidden scroll-mt-6">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-[#1E3A8A] text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                    Cathedral Monitoring Authority
                  </span>
                  <span className="text-xs text-blue-200 font-mono">
                    Evang. Olusegun Faleti Desk
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-black text-white mt-0.5">
                  Church Secretary Live Monitoring & Feedback Console
                </h3>
                <p className="text-xs text-blue-200 max-w-xl font-sans">
                  Real-time incoming feedback, operational logs, and logistical requisitions transmitted from all 11 departments. Respond with official directives and update review statuses.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onNavigateToSecretariat}
                className="bg-amber-400 hover:bg-amber-300 text-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Issue Parochial Directive</span>
              </button>
            </div>
          </div>

          {/* Monitoring Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
            {/* Department Filter */}
            <div>
              <label className="block text-[11px] font-bold text-blue-200 mb-1">
                Filter by Department
              </label>
              <select
                value={selectedDepartmentFilter}
                onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 font-medium focus:outline-none focus:bg-[#1E3A8A]"
              >
                <option value="all" className="bg-[#1E3A8A] text-white">All 11 Departments</option>
                {elevenDepartmentsList.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#1E3A8A] text-white">
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-blue-200 mb-1">
                Review Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 font-medium focus:outline-none focus:bg-[#1E3A8A]"
              >
                <option value="all" className="bg-[#1E3A8A] text-white">All Statuses ({feedbacks.length})</option>
                <option value="Pending Review" className="bg-[#1E3A8A] text-white">Pending Review ({pendingSecretaryAction})</option>
                <option value="Acknowledged" className="bg-[#1E3A8A] text-white">Acknowledged</option>
                <option value="Action Taken" className="bg-[#1E3A8A] text-white">Action Taken</option>
                <option value="Resolved" className="bg-[#1E3A8A] text-white">Resolved</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-[11px] font-bold text-blue-200 mb-1">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 font-medium focus:outline-none focus:bg-[#1E3A8A]"
              >
                <option value="all" className="bg-[#1E3A8A] text-white">All Priorities</option>
                <option value="Emergency" className="bg-[#1E3A8A] text-white">Emergency</option>
                <option value="Urgent" className="bg-[#1E3A8A] text-white">Urgent</option>
                <option value="Important" className="bg-[#1E3A8A] text-white">Important</option>
                <option value="Routine" className="bg-[#1E3A8A] text-white">Routine</option>
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-bold text-blue-200 mb-1">
                Search Feedback Text
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-blue-300 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Subject, details, officer..."
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg pl-8 p-2 font-medium focus:outline-none focus:bg-[#1E3A8A] placeholder-blue-300/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Feedback Feed Listing */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-celestial-gray-500 font-medium">
            <span>Showing <strong>{filteredFeedbacks.length}</strong> matching department reports</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Monitoring feed synchronized with cathedral database</span>
            </div>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12 text-celestial-gray-500 bg-celestial-offwhite rounded-xl border border-dashed border-celestial-gray-300">
              <FileText className="w-8 h-8 mx-auto text-celestial-gray-400 mb-2" />
              <p className="text-sm font-semibold">No feedback records matching current filters.</p>
              <p className="text-xs text-celestial-gray-400 mt-1">Try resetting the department or status filter above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className={`border rounded-2xl p-5 transition-all shadow-sm ${
                    fb.status === 'Pending Review'
                      ? 'border-amber-300 bg-amber-50/30'
                      : 'border-celestial-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#1E3A8A] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {fb.departmentName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        fb.priority === 'Emergency'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : fb.priority === 'Urgent'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : fb.priority === 'Important'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {fb.priority}
                      </span>
                      <span className="text-[10px] text-celestial-gray-600 bg-celestial-offwhite px-2 py-0.5 rounded border border-celestial-gray-200">
                        {fb.category}
                      </span>
                      <span className="text-xs text-celestial-gray-400 font-mono">
                        {fb.dateSubmitted}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        fb.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : fb.status === 'Action Taken'
                          ? 'bg-blue-100 text-blue-800'
                          : fb.status === 'Acknowledged'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {fb.status === 'Action Taken' || fb.status === 'Resolved' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{fb.status}</span>
                      </span>

                      {/* Church Secretary Response Trigger */}
                      <button
                        onClick={() => {
                          setActiveFeedbackForReply(fb);
                          setReplyText(fb.secretaryRemarks || '');
                          setReplyStatus(fb.status === 'Pending Review' ? 'Acknowledged' : fb.status);
                        }}
                        className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>{fb.secretaryRemarks ? 'Update Directive' : 'Respond & Directive'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Heading and details */}
                  <div className="mt-3">
                    <h4 className="font-serif text-base font-bold text-celestial-blue-900">
                      {fb.subject}
                    </h4>
                    <p className="text-xs md:text-sm text-celestial-gray-700 mt-1.5 leading-relaxed font-sans">
                      {fb.details}
                    </p>
                  </div>

                  {/* Operational KPI summary if present */}
                  {fb.kpiMetricsSummary && (
                    <div className="mt-3 bg-celestial-offwhite p-2.5 rounded-xl text-xs text-celestial-gray-700 border border-celestial-gray-200/80 font-mono flex items-center gap-2">
                      <span className="font-bold text-blue-900">📊 Unit Key Metric:</span>
                      <span>{fb.kpiMetricsSummary}</span>
                    </div>
                  )}

                  {/* Submission metadata */}
                  <div className="mt-3 pt-3 border-t border-celestial-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-celestial-gray-500">
                    <div className="flex items-center gap-2">
                      <span>Reporting Officer:</span>
                      <strong className="text-celestial-gray-800">{fb.senderName}</strong>
                      <span className="bg-celestial-gray-100 text-celestial-gray-700 px-1.5 py-0.2 rounded text-[10px]">
                        {fb.senderRole}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenDepartment(fb.department)}
                      className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px] hover:underline"
                    >
                      <span>Jump to {fb.departmentName} Dashboard</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Church Secretary Response Box */}
                  {fb.secretaryRemarks && (
                    <div className="mt-3.5 bg-amber-50 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-950">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <CheckCheck className="w-4 h-4 text-emerald-600" />
                          <span>Church Secretary Official Directive & Action</span>
                        </div>
                        {fb.reviewedAt && (
                          <span className="text-[10px] text-amber-700/80 font-mono font-medium">
                            {fb.reviewedAt}
                          </span>
                        )}
                      </div>
                      <p className="text-amber-900 leading-relaxed font-medium">
                        {fb.secretaryRemarks}
                      </p>
                      {fb.reviewedBy && (
                        <p className="text-[10px] text-amber-800 font-bold mt-1">
                          — Issued by: {fb.reviewedBy}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. DEPARTMENT REPORTING & COMPLIANCE SCOREBOARD */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-celestial-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-celestial-gray-200 pb-3 mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900">
              11 Departments Compliance & Monitoring Matrix
            </h3>
            <p className="text-xs text-celestial-gray-500 font-sans">
              Summary tracking showing which departments have submitted their required operational returns and feedbacks this period.
            </p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Cathedral Coverage</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-celestial-gray-200 text-celestial-gray-500 font-semibold pb-2">
                <th className="pb-3 pr-2">#</th>
                <th className="pb-3">Department Name</th>
                <th className="pb-3">Department Secretary</th>
                <th className="pb-3 text-center">Feedbacks Sent</th>
                <th className="pb-3 text-center">Latest Status</th>
                <th className="pb-3 text-right">Monitoring Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {elevenDepartmentsList.map((d, i) => {
                const count = feedbacks.filter((f) => f.department === d.id).length;
                const latest = feedbacks.filter((f) => f.department === d.id)[0];
                return (
                  <tr key={d.id} className="hover:bg-celestial-offwhite/50 transition-colors">
                    <td className="py-3 font-mono text-celestial-gray-400 font-bold">{i + 1}</td>
                    <td className="py-3">
                      <div className="font-bold text-celestial-blue-900">{d.name}</div>
                      <div className="text-[10px] text-celestial-gray-500">{d.category}</div>
                    </td>
                    <td className="py-3 font-medium text-celestial-gray-700">{d.secretaryName}</td>
                    <td className="py-3 text-center font-bold font-mono text-celestial-blue-900">
                      {count}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        latest
                          ? latest.status === 'Pending Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                          : 'bg-celestial-gray-100 text-celestial-gray-600'
                      }`}>
                        {latest ? latest.status : 'Compliant'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onOpenDepartment(d.id as Department)}
                        className="bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Open Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. CHURCH SECRETARY REPLY & DIRECTIVE MODAL */}
      {/* ============================================================== */}
      {activeFeedbackForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-celestial-gray-200 max-w-xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  Church Secretary Response Console
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                  Direct Response to {activeFeedbackForReply.departmentName}
                </h3>
              </div>
              <button
                onClick={() => setActiveFeedbackForReply(null)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSecretaryReply} className="p-5 space-y-4">
              <div className="bg-celestial-offwhite p-3 rounded-xl border border-celestial-gray-200 text-xs">
                <div className="font-bold text-celestial-blue-900">
                  Subject: {activeFeedbackForReply.subject}
                </div>
                <div className="text-celestial-gray-600 mt-1 line-clamp-3">
                  "{activeFeedbackForReply.details}"
                </div>
                <div className="text-[10px] text-celestial-gray-400 mt-2">
                  Submitted by {activeFeedbackForReply.senderName} ({activeFeedbackForReply.senderRole}) on {activeFeedbackForReply.dateSubmitted}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                  Update Monitoring Status
                </label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value as any)}
                  className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                >
                  <option value="Acknowledged">Acknowledged (Noted by Secretariat)</option>
                  <option value="Action Taken">Action Taken (Directives / Resources Dispatched)</option>
                  <option value="Resolved">Resolved (Matter Concluded)</option>
                  <option value="Pending Review">Keep as Pending Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-celestial-gray-700 mb-1">
                  Church Secretary Directive / Response Remarks
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Enter official instructions, voucher approvals, liturgical directives, or acknowledgment remarks for this department..."
                  className="w-full text-xs bg-white border border-celestial-gray-200 rounded-lg p-2.5 font-medium text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveFeedbackForReply(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-celestial-gray-600 hover:bg-celestial-offwhite border border-celestial-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3A8A] hover:bg-blue-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Save Directive & Transmit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MODALS FOR 3-KEY EXECUTIVE PORTAL AND FEEDBACK */}
      {/* ============================================================== */}
      {selectedExecutiveDept && (
        <ExecutivePortalModal
          isOpen={true}
          onClose={() => setSelectedExecutiveDept(null)}
          department={selectedExecutiveDept}
          departmentName={elevenDepartmentsList.find(d => d.id === selectedExecutiveDept)?.name || 'Department Executive'}
          onNavigateToSecretariat={onNavigateToSecretariat}
        />
      )}

      {selectedFeedbackDept && (
        <DepartmentFeedbackModal
          isOpen={true}
          onClose={() => setSelectedFeedbackDept(null)}
          department={selectedFeedbackDept.id}
          departmentName={selectedFeedbackDept.name}
          onFeedbackSubmitted={(newFb) => {
            setFeedbacks([newFb, ...feedbacks]);
          }}
        />
      )}

      {/* ============================================================== */}
      {/* 7. ALL 11 DEPARTMENTS LOGIN CREDENTIALS ROSTER MODAL */}
      {/* ============================================================== */}
      {isCredentialsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-celestial-gray-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Church Administration Security
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold">
                      11 of 11 Units Ready
                    </span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-black text-white leading-tight">
                    Cathedral 11 Department Login & Logout Directory
                  </h2>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Official access roster for departmental leaders, executive portals, and parish secretary monitoring.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCredentialsModalOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Header */}
            <div className="bg-slate-100 px-6 pt-3 flex border-b border-slate-200 gap-2">
              <button
                type="button"
                onClick={() => setCredentialsModalTab('executive_keys')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  credentialsModalTab === 'executive_keys'
                    ? 'bg-white text-[#1E3A8A] border-t-2 border-amber-500 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>3-Key Executive Chambers (Chairman • Secretary • Treasurer)</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentialsModalTab('web_logins')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  credentialsModalTab === 'web_logins'
                    ? 'bg-white text-[#1E3A8A] border-t-2 border-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>11 Department Web Portal Logins</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {credentialsModalTab === 'executive_keys' ? (
                <>
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed flex items-start gap-3">
                    <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-900 font-bold mb-0.5">
                        Statutory Chairman Authority & Page Isolation Rules:
                      </strong>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 mt-1">
                        <li><strong>Chairman Mandate:</strong> Only the Chairman of each department has the authority to create, update, or change credentials & passwords for the Chairman, Secretary, and Treasurer.</li>
                        <li><strong>Strict Page Isolation:</strong> The Secretary logs into the Secretary Page (cannot switch to Treasurer or Chairman). The Treasurer logs into the Treasurer Page (cannot switch to Secretary or Chairman).</li>
                        <li><strong>Chairman Oversight Mode:</strong> The Chairman logs into the Chairman Page, and can inspect what is happening inside the Secretary Page and Treasurer Page in <strong>Tamper-Protected Read-Only mode</strong> (cannot alter minutes or vouchers).</li>
                      </ul>
                    </div>
                  </div>

                  {/* 11 Department 3-Key Executives Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {elevenDepartmentsList.map((dept) => {
                      const execs = departmentKeyExecutives[dept.id] || [];
                      const chair = execs.find(e => e.role === 'Chairman');
                      const sec = execs.find(e => e.role === 'Secretary');
                      const treas = execs.find(e => e.role === 'Treasurer');

                      // Load any saved custom passwords
                      const savedPass = (() => {
                        const s = localStorage.getItem(`ccc_passwords_${dept.id}`);
                        if (s) {
                          try { return JSON.parse(s); } catch {}
                        }
                        return null;
                      })();

                      return (
                        <div key={dept.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3 hover:border-blue-300 transition-colors">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div>
                              <h4 className="font-serif text-sm font-bold text-slate-900">{dept.name}</h4>
                              <span className="text-[10px] text-slate-500">{dept.category}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedExecutiveDept(dept.id as Department);
                                setIsCredentialsModalOpen(false);
                              }}
                              className="text-[11px] font-bold bg-[#1E3A8A] hover:bg-blue-800 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                            >
                              <Shield className="w-3.5 h-3.5 text-amber-300" />
                              <span>Open 3-Key Portal</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-[10px]">
                            {/* Chairman Card */}
                            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200 space-y-1">
                              <span className="font-bold text-amber-900 block uppercase">Chairman</span>
                              <div className="font-semibold text-slate-800 truncate" title={chair?.name}>{chair?.name || 'Chairman'}</div>
                              <div className="font-mono text-amber-900 font-bold bg-white px-1.5 py-0.5 rounded border border-amber-300">
                                Pass: {savedPass?.Chairman || 'Chairman@Ibara'}
                              </div>
                            </div>

                            {/* Secretary Card */}
                            <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-200 space-y-1">
                              <span className="font-bold text-blue-900 block uppercase">Secretary</span>
                              <div className="font-semibold text-slate-800 truncate" title={sec?.name}>{sec?.name || 'Secretary'}</div>
                              <div className="font-mono text-blue-900 font-bold bg-white px-1.5 py-0.5 rounded border border-blue-300">
                                Pass: {savedPass?.Secretary || 'Secretary@Ibara'}
                              </div>
                            </div>

                            {/* Treasurer Card */}
                            <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-200 space-y-1">
                              <span className="font-bold text-emerald-900 block uppercase">Treasurer</span>
                              <div className="font-semibold text-slate-800 truncate" title={treas?.name}>{treas?.name || 'Treasurer'}</div>
                              <div className="font-mono text-emerald-900 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                                Pass: {savedPass?.Treasurer || 'Treasurer@Ibara'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-blue-950 font-bold mb-0.5">
                        Multi-Portal Department Authentication System:
                      </strong>
                      Each department head or secretary can sign in with their assigned cathedral email and password on the login portal. When they log in, the system directly opens their dedicated department dashboard page, displays their officer role, and enables instant transmission of feedback to the Church Secretary.
                    </div>
                  </div>

                  {/* Accounts Directory Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4">Department Unit</th>
                          <th className="py-3 px-4">Executive Officer</th>
                          <th className="py-3 px-4">Login Email</th>
                          <th className="py-3 px-4">Access Key</th>
                          <th className="py-3 px-4 text-right">Portal Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {departmentAuthAccounts.map((acc, i) => {
                          const isSec = acc.department === 'main_dashboard';
                          return (
                            <tr
                              key={acc.id}
                              className={`hover:bg-slate-50/80 transition-colors ${
                                isSec ? 'bg-amber-50/50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900">{acc.departmentName}</div>
                                <span className="text-[10px] text-slate-500">{acc.badgeCategory}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-800">{acc.officerName}</div>
                                <div className="text-[10px] text-blue-700 font-medium">{acc.officerRole}</div>
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-blue-900">
                                {acc.email}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-mono text-amber-800 font-bold bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded text-[11px]">
                                  {acc.password}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => {
                                    onOpenDepartment(acc.department);
                                    setIsCredentialsModalOpen(false);
                                  }}
                                  className="bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Open Dashboard</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                CCC Ibara Cathedral • Parochial Secretariat Portal Registry
              </span>
              <div className="flex items-center gap-2">
                {onSignOut && (
                  <button
                    onClick={() => {
                      setIsCredentialsModalOpen(false);
                      onSignOut();
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors border border-rose-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out to Department Login Portal</span>
                  </button>
                )}
                <button
                  onClick={() => setIsCredentialsModalOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
