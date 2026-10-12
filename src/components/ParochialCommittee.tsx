import React, { useState } from 'react';
import {
  FileText,
  Landmark,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  FolderDot,
  CheckCircle,
  FileDown,
  UploadCloud,
  ChevronRight,
  Sparkles,
  CalendarDays,
  Users,
  UserPlus,
  Trash2,
  Award,
  Shield,
  Send,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { FinancialTransaction, Project, MeetingMinute, WeeklyService, ParishDignitary, HarvestCommitteeMember } from '../types';
import { initialTransactions, initialProjects, initialMeetingMinutes, initialWeeklyServices, initialParochialDignitaries, initialHarvestCommittee } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface ParochialCommitteeProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function ParochialCommittee({ onNavigateToSecretariat, onNavigateToMainDashboard }: ParochialCommitteeProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [minutes, setMinutes] = useState<MeetingMinute[]>(initialMeetingMinutes);
  const [weeklyServices, setWeeklyServices] = useState<WeeklyService[]>(initialWeeklyServices);
  
  const [dignitaries, setDignitaries] = useState<ParishDignitary[]>(initialParochialDignitaries);
  const [harvestMembers, setHarvestMembers] = useState<HarvestCommitteeMember[]>(initialHarvestCommittee);

  const [isAddingDignitary, setIsAddingDignitary] = useState(false);
  const [isAddingHarvest, setIsAddingHarvest] = useState(false);

  const [newDignitary, setNewDignitary] = useState({
    name: '',
    title: 'Church Matron (Baba Ijo)' as ParishDignitary['title'],
    contact: '',
    appointedDate: new Date().toISOString().split('T')[0]
  });

  const [newHarvest, setNewHarvest] = useState({
    name: '',
    role: 'Member',
    contact: '',
    responsibility: ''
  });

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals / Form toggles
  const [isAddingTxn, setIsAddingTxn] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isUploadingMinutes, setIsUploadingMinutes] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);

  // Active minute detail popup
  const [activeMinute, setActiveMinute] = useState<MeetingMinute | null>(null);

  // Form states
  const [newTxn, setNewTxn] = useState({
    category: 'Tithe' as FinancialTransaction['category'],
    amount: '',
    status: 'Cleared' as FinancialTransaction['status'],
    date: new Date().toISOString().split('T')[0]
  });

  const [newProject, setNewProject] = useState({
    title: '',
    budget: '',
    lead: '',
    status: 'In Progress' as Project['status']
  });

  const [newDoc, setNewDoc] = useState({
    title: '',
    format: 'PDF' as 'PDF' | 'DOCX',
    summary: ''
  });

  const [newService, setNewService] = useState({
    date: new Date().toISOString().split('T')[0],
    day: 'Sunday',
    serviceName: '',
    conductor: '',
    firstLesson: '',
    firstLessonReader: '',
    secondLesson: '',
    secondLessonReader: '',
    sermoner: ''
  });

  // Calculation summaries
  const totalInflow = transactions
    .filter(t => t.status === 'Cleared')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingInflow = transactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;

  // Handlers
  const handleAddTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxn.amount || isNaN(Number(newTxn.amount))) {
      alert('Please enter a valid numeric amount.');
      return;
    }
    const created: FinancialTransaction = {
      id: `TXN-00${transactions.length + 1}`,
      date: newTxn.date,
      category: newTxn.category,
      amount: parseFloat(newTxn.amount),
      status: newTxn.status
    };
    setTransactions([created, ...transactions]);
    setIsAddingTxn(false);
    setNewTxn({
      category: 'Tithe',
      amount: '',
      status: 'Cleared',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.budget || !newProject.lead) {
      alert('Please fill out all project fields.');
      return;
    }
    const created: Project = {
      id: `PRJ-${String.fromCharCode(65 + projects.length)}`,
      title: newProject.title,
      budget: parseFloat(newProject.budget),
      completion: 0,
      lead: newProject.lead,
      status: newProject.status
    };
    setProjects([...projects, created]);
    setIsAddingProject(false);
    setNewProject({ title: '', budget: '', lead: '', status: 'In Progress' });
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) {
      alert('Please enter a document title.');
      return;
    }
    const created: MeetingMinute = {
      id: `DOC-00${minutes.length + 1}`,
      title: newDoc.title,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      format: newDoc.format,
      summary: newDoc.summary
    };
    setMinutes([created, ...minutes]);
    setIsUploadingMinutes(false);
    setNewDoc({ title: '', format: 'PDF', summary: '' });
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.serviceName || !newService.conductor || !newService.firstLesson || !newService.firstLessonReader || !newService.secondLesson || !newService.secondLessonReader || !newService.sermoner) {
      alert('Please fill out all service program fields including lesson readers.');
      return;
    }
    const created: WeeklyService = {
      id: `SRV-00${weeklyServices.length + 1}`,
      date: newService.date,
      day: newService.day,
      serviceName: newService.serviceName,
      conductor: newService.conductor,
      firstLesson: newService.firstLesson,
      firstLessonReader: newService.firstLessonReader,
      secondLesson: newService.secondLesson,
      secondLessonReader: newService.secondLessonReader,
      sermoner: newService.sermoner
    };
    setWeeklyServices([...weeklyServices, created]);
    setIsAddingService(false);
    setNewService({
      date: new Date().toISOString().split('T')[0],
      day: 'Sunday',
      serviceName: '',
      conductor: '',
      firstLesson: '',
      firstLessonReader: '',
      secondLesson: '',
      secondLessonReader: '',
      sermoner: ''
    });
  };

  const handleProgressIncrement = (id: string) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        const nextVal = Math.min(p.completion + 10, 100);
        return {
          ...p,
          completion: nextVal,
          status: nextVal === 100 ? 'Completed' : p.status
        };
      }
      return p;
    }));
  };

  const handleAddDignitary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDignitary.name || !newDignitary.contact) {
      alert('Please fill out all fields.');
      return;
    }
    const created: ParishDignitary = {
      id: `DIG-0${dignitaries.length + 1}`,
      title: newDignitary.title,
      name: newDignitary.name,
      contact: newDignitary.contact,
      appointedDate: newDignitary.appointedDate
    };
    setDignitaries([...dignitaries, created]);
    setIsAddingDignitary(false);
    setNewDignitary({
      name: '',
      title: 'Church Matron (Baba Ijo)',
      contact: '',
      appointedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteDignitary = (id: string) => {
    if (confirm('Are you sure you want to delete this dignitary?')) {
      setDignitaries(dignitaries.filter(d => d.id !== id));
    }
  };

  const handleAddHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHarvest.name || !newHarvest.responsibility || !newHarvest.contact) {
      alert('Please fill out all fields.');
      return;
    }
    const created: HarvestCommitteeMember = {
      id: `HVT-0${harvestMembers.length + 1}`,
      name: newHarvest.name,
      role: newHarvest.role,
      responsibility: newHarvest.responsibility,
      contact: newHarvest.contact,
      status: 'Active'
    };
    setHarvestMembers([...harvestMembers, created]);
    setIsAddingHarvest(false);
    setNewHarvest({
      name: '',
      role: 'Member',
      contact: '',
      responsibility: ''
    });
  };

  const handleDeleteHarvest = (id: string) => {
    if (confirm('Are you sure you want to delete this harvest committee member?')) {
      setHarvestMembers(harvestMembers.filter(h => h.id !== id));
    }
  };

  // Filter computations
  const filteredTxns = transactions.filter(t => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesQuery = searchQuery === '' ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const filteredProjects = projects.filter(p => {
    return projectStatusFilter === 'all' || p.status === projectStatusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Parish Council Executive Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Landmark className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Parish Governance Board
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Parochial Trustees & Executive Council
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Parish Council Executive
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Supreme parish administrative body managing ecclesiastical infrastructure, cathedral budgets, statutory registries, and inter-departmental operations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
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

            {onNavigateToSecretariat && (
              <button
                onClick={onNavigateToSecretariat}
                className="bg-blue-600/80 hover:bg-blue-500 text-white px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold transition-all shadow-sm border border-blue-400/40 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Secretariat Desk</span>
              </button>
            )}

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

      {/* Dynamic Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Total Cleared Funds
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              ₦{totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="font-sans text-[11px] text-green-600 font-semibold flex items-center mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +12% from last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-900">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Pending Clearances
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-gray-800 block">
              ₦{pendingInflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="font-sans text-[11px] text-celestial-gray-500 block mt-1">
              Awaiting confirmation
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-celestial-gold-50 flex items-center justify-center text-celestial-gold-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between col-span-1 md:col-span-2">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Active Project Summary
            </span>
            <span className="font-serif text-lg font-bold text-celestial-blue-900 block">
              {activeProjectsCount} Major Developments in Progress
            </span>
            <span className="font-sans text-xs text-celestial-gray-500 block mt-1">
              Facilitated by the Parish Council & Parochial Trustees
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-500">
            <FolderDot className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Ledger & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Financial Ledger Section */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-celestial-blue-900">Financial Ledger</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Record of tithes, thanksgivings, and development seeds.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-2.5 py-1.5 font-sans text-xs text-celestial-gray-800 focus:outline-none focus:border-celestial-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Tithe">Tithe</option>
                <option value="Thanksgiving">Thanksgiving</option>
                <option value="Building Fund">Building Fund</option>
                <option value="Special Seed">Special Seed</option>
              </select>
              <button
                onClick={() => setIsAddingTxn(true)}
                className="bg-celestial-blue-900 text-white px-3 py-1.5 rounded-lg font-sans text-xs font-semibold hover:bg-celestial-blue-800 transition-all flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Record Entry
              </button>
            </div>
          </div>

          {/* Ledger Table Container */}
          <div className="flex-grow overflow-y-auto p-4">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-celestial-gray-200 text-celestial-gray-500 font-semibold pb-2">
                  <th className="pb-3 pr-2">ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-celestial-gray-500">
                      No matching financial ledger records found.
                    </td>
                  </tr>
                ) : (
                  filteredTxns.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-celestial-gray-200/50 hover:bg-celestial-offwhite/50 transition-colors"
                    >
                      <td className="py-3 font-semibold text-celestial-blue-900">{item.id}</td>
                      <td className="py-3 text-celestial-gray-500">{item.date}</td>
                      <td className="py-3 font-medium text-celestial-gray-800">{item.category}</td>
                      <td className="py-3 text-right font-semibold text-celestial-gray-800">
                        ₦{item.amount.toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.status === 'Cleared'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'Pending'
                              ? 'bg-celestial-gold-100 text-celestial-gold-600'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Tracker Section */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-celestial-blue-900">Parish Projects</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Tracking renovations & procurements.</p>
            </div>
            <button
              onClick={() => setIsAddingProject(true)}
              className="text-celestial-blue-900 p-1 rounded hover:bg-celestial-offwhite"
              title="Add Project"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-celestial-gray-200">
            <select
              value={projectStatusFilter}
              onChange={(e) => setProjectStatusFilter(e.target.value)}
              className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-2.5 py-1.5 font-sans text-xs text-celestial-gray-800"
            >
              <option value="all">All Projects</option>
              <option value="In Progress">Active Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Planned</option>
            </select>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {filteredProjects.map((item) => {
              let badgeColor = '';
              if (item.status === 'Completed') badgeColor = 'bg-green-100 text-green-700';
              else if (item.status === 'In Progress') badgeColor = 'bg-celestial-blue-100 text-celestial-blue-900';
              else badgeColor = 'bg-celestial-gray-200 text-celestial-gray-500';

              return (
                <div
                  key={item.id}
                  className="border border-celestial-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-sans text-xs font-bold text-celestial-gray-800 leading-tight">
                      {item.title}
                    </h4>
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${badgeColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-celestial-gray-500 font-sans text-[11px] mb-3">
                    <span>Budget: ₦{item.budget.toLocaleString()}</span>
                    <span>Lead: {item.lead}</span>
                  </div>
                  <div className="w-full bg-celestial-offwhite rounded-full h-1.5 mb-2 relative">
                    <div
                      className="bg-celestial-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.completion}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[10px] font-semibold text-celestial-gray-500">
                      {item.completion}% Done
                    </span>
                    {item.status !== 'Completed' && (
                      <button
                        onClick={() => handleProgressIncrement(item.id)}
                        className="text-[10px] text-celestial-blue-900 font-bold hover:underline"
                      >
                        +10% Progress
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meeting Minutes Repository */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900">Meeting Minutes</h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official transcripts and strategic decisions.</p>
          </div>
          <button
            onClick={() => setIsUploadingMinutes(true)}
            className="bg-celestial-gray-800 hover:bg-celestial-gray-800 text-white font-sans text-xs px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" /> Upload New Minute
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {minutes.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMinute(item)}
              className="border border-celestial-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer flex gap-4 items-start group hover:border-celestial-blue-500"
            >
              <div className="w-10 h-10 rounded bg-celestial-offwhite flex items-center justify-center text-celestial-blue-900 group-hover:bg-celestial-blue-100 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-sans text-xs font-bold text-celestial-gray-800 mb-1 group-hover:text-celestial-blue-900">
                  {item.title}
                </h4>
                <p className="font-sans text-[11px] text-celestial-gray-500">
                  {item.date} • {item.format}
                </p>
                {item.summary && (
                  <p className="font-sans text-[11px] text-celestial-gray-500 line-clamp-1 mt-1 text-slate-400">
                    {item.summary}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-celestial-gray-500 group-hover:text-celestial-blue-900 transition-colors align-self-center self-center" />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Service Program & Timetable Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="weekly-service-program-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-500" /> Weekly Service Program & Timetable
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official liturgy orchestration, Bible lessons, and assigned ministers of the altar.</p>
          </div>
          <button
            onClick={() => setIsAddingService(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="schedule-service-btn"
          >
            <Plus className="w-4 h-4" /> Schedule Weekly Service
          </button>
        </div>

        {/* Liturgical Timeline Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Day & Date</th>
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Service Conductor</th>
                <th className="py-3 px-4">First Lesson</th>
                <th className="py-3 px-4">Second Lesson</th>
                <th className="py-3 px-4 rounded-r-lg">Sermoner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {weeklyServices.map((service) => (
                <tr key={service.id} className="hover:bg-celestial-offwhite/30 transition-colors">
                  <td className="py-4 px-4 font-semibold text-celestial-blue-900">
                    <div className="flex flex-col">
                      <span className="text-xs">{service.day}</span>
                      <span className="text-[10px] text-celestial-gray-400 font-normal font-mono">{service.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-celestial-gray-800">
                    <span className="bg-blue-50 text-celestial-blue-900 px-2 py-1 rounded text-[10px] uppercase tracking-wide">
                      {service.serviceName}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-celestial-gray-600 font-medium">
                    {service.conductor}
                  </td>
                  <td className="py-4 px-4 text-amber-700 font-mono font-semibold">
                    <div>{service.firstLesson}</div>
                    <div className="text-[10px] text-celestial-gray-500 font-sans font-normal mt-1 flex items-center gap-1">
                      <span className="text-amber-600 font-bold uppercase text-[8px] tracking-wider">Reader:</span> {service.firstLessonReader}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-green-700 font-mono font-semibold">
                    <div>{service.secondLesson}</div>
                    <div className="text-[10px] text-celestial-gray-500 font-sans font-normal mt-1 flex items-center gap-1">
                      <span className="text-green-600 font-bold uppercase text-[8px] tracking-wider">Reader:</span> {service.secondLessonReader}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-celestial-gray-800 font-bold">
                    <span className="border-l-2 border-amber-400 pl-2">
                      {service.sermoner}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parish Dignitaries Board (Baba Ijo, Iya Ijo, Baba Eso, Iya Eso) */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="parish-dignitaries-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Parish Dignitaries & Honors Board
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">The highly respected traditional pillars, patrons, and matrons of our parish fellowship.</p>
          </div>
          <button
            onClick={() => setIsAddingDignitary(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-dignitary-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Dignitary
          </button>
        </div>

        {/* Dignitaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dignitaries.map((dig) => (
            <div key={dig.id} className="relative bg-celestial-offwhite/40 border border-celestial-gray-200/80 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group">
              <button
                onClick={() => handleDeleteDignitary(dig.id)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 transition-all"
                title="Remove Dignitary"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div>
                <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mb-3 uppercase tracking-wider">
                  {dig.title}
                </span>
                <h4 className="font-serif text-sm font-bold text-celestial-blue-900 leading-snug mb-1">{dig.name}</h4>
                <p className="font-mono text-[10px] text-celestial-gray-500">{dig.contact}</p>
              </div>

              {dig.appointedDate && (
                <div className="mt-4 pt-3 border-t border-celestial-gray-100 flex items-center justify-between text-[10px] text-celestial-gray-400">
                  <span>Honored Since:</span>
                  <span className="font-semibold font-mono text-celestial-gray-600">{dig.appointedDate}</span>
                </div>
              )}
            </div>
          ))}
          {dignitaries.length === 0 && (
            <div className="col-span-full py-8 text-center text-celestial-gray-400 font-sans border border-dashed border-celestial-gray-200 rounded-xl">
              No dignitaries registered yet. Click "Add Dignitary" to establish honor board positions.
            </div>
          )}
        </div>
      </div>

      {/* Harvest Committee Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="harvest-committee-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Harvest Committee Board
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Steering committee coordinates the planning, budgeting, and execution of the annual harvest thanksgiving festival.</p>
          </div>
          <button
            onClick={() => setIsAddingHarvest(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-harvest-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Harvest Coordinator
          </button>
        </div>

        {/* Harvest Committee Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Representative Name</th>
                <th className="py-3 px-4">Committee Role</th>
                <th className="py-3 px-4">Specific Responsibility</th>
                <th className="py-3 px-4">Direct Contact</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {harvestMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No harvest committee representatives registered yet. Click "Add Harvest Coordinator" to start building the board.
                  </td>
                </tr>
              ) : (
                harvestMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-celestial-offwhite/30 transition-colors">
                    <td className="py-4 px-4 font-semibold text-celestial-blue-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold font-sans text-xs shrink-0">
                          {member.name.split(' ').filter(p => !p.includes('.')).map(n => n[0]).join('') || member.name[0]}
                        </div>
                        <span className="text-xs font-bold text-celestial-blue-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-700 font-semibold">
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded text-[11px] font-semibold">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-600 font-sans font-medium">
                      {member.responsibility}
                    </td>
                    <td className="py-4 px-4 text-celestial-gray-600 font-mono">
                      {member.contact}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteHarvest(member.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center gap-1"
                        title="Delete Member"
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

      {/* Record Financial Transaction Dialog overlay */}
      {isAddingTxn && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Record Financial Transaction</h3>
            <form onSubmit={handleAddTxn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Category</label>
                <select
                  value={newTxn.category}
                  onChange={(e) => setNewTxn({ ...newTxn, category: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Tithe">Tithe</option>
                  <option value="Thanksgiving">Thanksgiving</option>
                  <option value="Building Fund">Building Fund</option>
                  <option value="Special Seed">Special Seed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Amount (₦)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500.00"
                  value={newTxn.amount}
                  onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Status</label>
                <select
                  value={newTxn.status}
                  onChange={(e) => setNewTxn({ ...newTxn, status: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Cleared">Cleared</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newTxn.date}
                  onChange={(e) => setNewTxn({ ...newTxn, date: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingTxn(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Submit entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Dialog overlay */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Establish Parish Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Altar Carpet Installation"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Budget (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4500"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Trustee / Lead</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. David"
                  value={newProject.lead}
                  onChange={(e) => setNewProject({ ...newProject, lead: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Not Started">Planned</option>
                  <option value="In Progress">Active Progress</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Create project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Minutes Dialog overlay */}
      {isUploadingMinutes && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Upload Committee Minutes</h3>
            <form onSubmit={handleAddDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Session / Meeting Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Parish Council General"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Format</label>
                <select
                  value={newDoc.format}
                  onChange={(e) => setNewDoc({ ...newDoc, format: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="DOCX">Microsoft Word (DOCX)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Executive Summary</label>
                <textarea
                  placeholder="Provide a brief summary of discussions & resolutions..."
                  value={newDoc.summary}
                  onChange={(e) => setNewDoc({ ...newDoc, summary: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsUploadingMinutes(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Upload & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Document Reader Dialog overlay */}
      {activeMinute && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-celestial-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded bg-celestial-blue-100 flex items-center justify-center text-celestial-blue-900 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-celestial-blue-900">{activeMinute.title}</h3>
                <p className="font-sans text-xs text-celestial-gray-500">Indexed on {activeMinute.date} • Format: {activeMinute.format}</p>
              </div>
            </div>
            <div className="bg-celestial-offwhite rounded-lg p-4 font-sans text-xs text-celestial-gray-800 mb-4 leading-relaxed">
              <h4 className="font-bold mb-2 text-celestial-blue-900 uppercase tracking-wider text-[10px]">Executive Digest</h4>
              {activeMinute.summary || 'No summary has been written for this meeting minute yet. Download the original document below to review full transcripts and committee resolution logs.'}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-celestial-gray-200">
              <button
                onClick={() => alert('Downloading official file...')}
                className="text-celestial-blue-900 hover:underline font-sans text-xs font-bold flex items-center gap-1"
              >
                <FileDown className="w-4 h-4" /> Download Original {activeMinute.format}
              </button>
              <button
                onClick={() => setActiveMinute(null)}
                className="bg-celestial-gray-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Weekly Service Dialog overlay */}
      {isAddingService && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-500" /> Schedule Liturgical Service
            </h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newService.date}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const dayName = days[selectedDate.getDay()] || 'Sunday';
                      setNewService({ ...newService, date: e.target.value, day: dayName });
                    }}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Day of Week</label>
                  <select
                    value={newService.day}
                    onChange={(e) => setNewService({ ...newService, day: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Program Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunday Devotional Service, Mercy Hour"
                  value={newService.serviceName}
                  onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Conductor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sup. Evang. J. Olamide"
                  value={newService.conductor}
                  onChange={(e) => setNewService({ ...newService, conductor: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">First Bible Lesson</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Genesis 1:1-15"
                    value={newService.firstLesson}
                    onChange={(e) => setNewService({ ...newService, firstLesson: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">First Lesson Reader</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bro. Samuel Adebiyi"
                    value={newService.firstLessonReader}
                    onChange={(e) => setNewService({ ...newService, firstLessonReader: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Second Bible Lesson</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John 1:1-14"
                    value={newService.secondLesson}
                    onChange={(e) => setNewService({ ...newService, secondLesson: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Second Lesson Reader</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sis. Deborah Olatunji"
                    value={newService.secondLessonReader}
                    onChange={(e) => setNewService({ ...newService, secondLessonReader: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Sermoner (Preacher)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shepherd-in-Charge"
                  value={newService.sermoner}
                  onChange={(e) => setNewService({ ...newService, sermoner: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dignitary Dialog overlay */}
      {isAddingDignitary && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-500" /> Add Parish Dignitary Position
            </h3>
            <form onSubmit={handleAddDignitary} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Dignitary Title</label>
                <select
                  value={newDignitary.title}
                  onChange={(e) => setNewDignitary({ ...newDignitary, title: e.target.value as any })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <option value="Church Matron (Baba Ijo)">Church Matron (Baba Ijo)</option>
                  <option value="Church Patron (Iya Ijo)">Church Patron (Iya Ijo)</option>
                  <option value="Father for the Children (Baba Eso)">Father for the Children (Baba Eso)</option>
                  <option value="Mother for the Children (Iya Eso)">Mother for the Children (Iya Eso)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elder Chief Dr. J. O. Alao"
                  value={newDignitary.name}
                  onChange={(e) => setNewDignitary({ ...newDignitary, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Contact Detail</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +234 803 444 5555"
                  value={newDignitary.contact}
                  onChange={(e) => setNewDignitary({ ...newDignitary, contact: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Date of Appointment</label>
                <input
                  type="date"
                  required
                  value={newDignitary.appointedDate}
                  onChange={(e) => setNewDignitary({ ...newDignitary, appointedDate: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingDignitary(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Set Dignitary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Harvest Member Dialog overlay */}
      {isAddingHarvest && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-amber-500" /> Add Harvest Committee Representative
            </h3>
            <form onSubmit={handleAddHarvest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sis. Grace Adeniran"
                  value={newHarvest.name}
                  onChange={(e) => setNewHarvest({ ...newHarvest, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Committee Role</label>
                  <select
                    value={newHarvest.role}
                    onChange={(e) => setNewHarvest({ ...newHarvest, role: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Harvest Chairman">Harvest Chairman</option>
                    <option value="Harvest Chairperson">Harvest Chairperson</option>
                    <option value="Harvest Vice Chairman">Harvest Vice Chairman</option>
                    <option value="Harvest Secretary">Harvest Secretary</option>
                    <option value="Harvest Treasurer">Harvest Treasurer</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Member">Committee Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Direct Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +234 803 987 6543"
                    value={newHarvest.contact}
                    onChange={(e) => setNewHarvest({ ...newHarvest, contact: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Specific Responsibility</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Financial budgeting, Bazaar coordination, Publicity"
                  value={newHarvest.responsibility}
                  onChange={(e) => setNewHarvest({ ...newHarvest, responsibility: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingHarvest(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Coordinator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="parochial"
        departmentName="Parish Council Executive"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="parochial"
        departmentName="Parish Council Executive"
      />
    </div>
  );
}
