import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle,
  Plus,
  Compass,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
  Printer,
  ChevronDown,
  UserPlus,
  Trash2,
  Shield,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { ServiceAttendanceLog, SideRoster, UnitExecutive } from '../types';
import { initialAttendanceLogs, initialSideRosters, initialSideMenWomenExecutives } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface SideMenWomenProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function SideMenWomen({ onNavigateToSecretariat, onNavigateToMainDashboard }: SideMenWomenProps) {
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [logs, setLogs] = useState<ServiceAttendanceLog[]>(initialAttendanceLogs);
  const [rosters, setRosters] = useState<SideRoster[]>(initialSideRosters);
  const [executives, setExecutives] = useState<UnitExecutive[]>(initialSideMenWomenExecutives);
  const [isAddingExec, setIsAddingExec] = useState(false);

  const [newExec, setNewExec] = useState({
    name: '',
    rank: 'Leader',
    office: '',
    contact: '',
    status: 'Active' as UnitExecutive['status']
  });

  // Seating grid layout (interactive seating manager!)
  const [selectedZone, setSelectedZone] = useState<'A' | 'B' | 'C' | 'Gallery'>('A');
  
  // A simple representation of seats in the selected zone
  // A dictionary where key is row-seat and value is 'free' | 'reserved' | 'occupied'
  const [seatsState, setSeatsState] = useState<Record<string, 'free' | 'reserved' | 'occupied'>>({
    'Row 1 - Seat 1': 'occupied',
    'Row 1 - Seat 2': 'occupied',
    'Row 1 - Seat 3': 'reserved',
    'Row 1 - Seat 4': 'free',
    'Row 2 - Seat 1': 'occupied',
    'Row 2 - Seat 2': 'free',
    'Row 2 - Seat 3': 'free',
    'Row 2 - Seat 4': 'free',
    'Row 3 - Seat 1': 'reserved',
    'Row 3 - Seat 2': 'free',
    'Row 3 - Seat 3': 'occupied',
    'Row 3 - Seat 4': 'free',
    'Row 4 - Seat 1': 'free',
    'Row 4 - Seat 2': 'free',
    'Row 4 - Seat 3': 'free',
    'Row 4 - Seat 4': 'free',
  });

  // Toggles and Modals
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [isAddingRoster, setIsAddingRoster] = useState(false);

  // Form States
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    serviceType: 'Sunday Devotional',
    men: '',
    women: '',
    children: '',
    offertoryBoxes: '6'
  });

  const [newRoster, setNewRoster] = useState({
    name: '',
    initials: '',
    aisle: 'Center Main',
    arrivalTime: '08:30 AM'
  });

  // Handlers
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const menCount = parseInt(newLog.men) || 0;
    const womenCount = parseInt(newLog.women) || 0;
    const childrenCount = parseInt(newLog.children) || 0;
    const boxesCount = parseInt(newLog.offertoryBoxes) || 0;

    const created: ServiceAttendanceLog = {
      id: `ATT-0${logs.length + 1}`,
      date: newLog.date,
      serviceType: newLog.serviceType,
      men: menCount,
      women: womenCount,
      children: childrenCount,
      total: menCount + womenCount + childrenCount,
      offertoryBoxes: boxesCount
    };

    setLogs([created, ...logs]);
    setIsAddingLog(false);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      serviceType: 'Sunday Devotional',
      men: '',
      women: '',
      children: '',
      offertoryBoxes: '6'
    });
  };

  const handleAddRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoster.name) {
      alert('Please enter member name.');
      return;
    }
    const created: SideRoster = {
      id: `SDR-0${rosters.length + 1}`,
      name: newRoster.name,
      initials: newRoster.initials || newRoster.name.split(' ').map(n => n[0]).join(''),
      aisle: newRoster.aisle,
      arrivalTime: newRoster.arrivalTime,
      status: 'On Duty'
    };
    setRosters([...rosters, created]);
    setIsAddingRoster(false);
    setNewRoster({ name: '', initials: '', aisle: 'Center Main', arrivalTime: '08:30 AM' });
  };

  const handleStatusChange = (id: string, nextStatus: SideRoster['status']) => {
    setRosters(rosters.map(r => {
      if (r.id === id) {
        return { ...r, status: nextStatus };
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
      id: `SEX-0${executives.length + 1}`,
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

  const handleToggleSeat = (seatKey: string) => {
    const currentState = seatsState[seatKey] || 'free';
    const nextState =
      currentState === 'free'
        ? 'reserved'
        : currentState === 'reserved'
        ? 'occupied'
        : 'free';

    setSeatsState({
      ...seatsState,
      [seatKey]: nextState
    });
  };

  // Metrics
  const lastSundayAttendance = logs[0]?.total || 0;
  const activeUshers = rosters.filter(r => r.status === 'On Duty').length;
  const totalReservations = Object.values(seatsState).filter(s => s === 'reserved').length;

  return (
    <div className="space-y-6">
      {/* Council of Sidesmen & Sideswomen Directorate Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Users className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Sanctuary Protocol & Ushering Board
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  Congregation Order • Pew Allocation • Offertory Security
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Council of Sidesmen & Sideswomen
              </h1>
              <p className="text-xs text-blue-100 max-w-xl mt-1 leading-relaxed font-sans">
                Overseeing cathedral orderliness, worshiper seating management, aisle supervision, and secure handling of church offertory boxes.
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

      {/* Top Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Active Ushers
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {activeUshers} On Duty
            </span>
            <span className="font-sans text-[11px] text-celestial-gray-500 block mt-1">
              Serving current service aisles
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-900">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Last Service Attendance
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {lastSundayAttendance.toLocaleString()} Souls
            </span>
            <span className="font-sans text-[11px] text-green-600 font-semibold block mt-1">
              Indexed with Offertory Boxes
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-blue-50 flex items-center justify-center text-celestial-blue-900">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-celestial-gray-500 font-semibold uppercase tracking-wider block mb-1">
              Reserved Pews (Zone {selectedZone})
            </span>
            <span className="font-serif text-2xl font-bold text-celestial-blue-900 block">
              {totalReservations} Seats
            </span>
            <span className="font-sans text-[11px] text-celestial-gray-500 block mt-1">
              Clergy, Guests & Elder seats
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-celestial-gold-50 flex items-center justify-center text-celestial-gold-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Log Table (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-serif text-base font-bold text-celestial-blue-900">Service Attendance Records</h3>
              <p className="font-sans text-xs text-celestial-gray-500">Official logbook of parish attendance demographics.</p>
            </div>
            <button
              onClick={() => setIsAddingLog(true)}
              className="bg-celestial-blue-900 text-white font-sans text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-celestial-blue-800 flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Log Attendance
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-celestial-gray-200 text-celestial-gray-500 font-semibold">
                  <th className="pb-3 pr-2">Date / Service</th>
                  <th className="pb-3 text-right">Men / Women</th>
                  <th className="pb-3 text-right">Children</th>
                  <th className="pb-3 text-right">Total Souls</th>
                  <th className="pb-3 text-right">Offertory Boxes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-celestial-gray-200/50 hover:bg-celestial-offwhite/50 transition-colors"
                  >
                    <td className="py-3">
                      <div className="font-bold text-celestial-gray-800">{item.date}</div>
                      <div className="text-celestial-blue-900 font-semibold text-[10px]">{item.serviceType}</div>
                    </td>
                    <td className="py-3 text-right text-celestial-gray-500">
                      {item.men} M / {item.women} W
                    </td>
                    <td className="py-3 text-right text-celestial-gray-500">{item.children}</td>
                    <td className="py-3 text-right font-bold text-celestial-blue-900">{item.total}</td>
                    <td className="py-3 text-right font-medium text-celestial-gray-800">
                      {item.offertoryBoxes} Boxes
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Seating Designer Chart (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-xl border border-celestial-gray-200 shadow-sm flex flex-col h-[520px]">
          <div className="p-5 border-b border-celestial-gray-200 shrink-0">
            <h3 className="font-serif text-base font-bold text-celestial-blue-900 mb-1">Interactive Sanctuary Seating</h3>
            <p className="font-sans text-xs text-celestial-gray-500 mb-4">Click pews to toggle reserves & general allocation.</p>

            <div className="flex gap-1 bg-celestial-offwhite p-1 rounded-lg border border-celestial-gray-200">
              {(['A', 'B', 'C', 'Gallery'] as const).map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`flex-1 py-1 text-center rounded-md font-sans text-xs font-semibold transition-all ${
                    selectedZone === zone
                      ? 'bg-white text-celestial-blue-900 shadow-xs border border-celestial-gray-200'
                      : 'text-celestial-gray-500 hover:text-celestial-gray-800'
                  }`}
                >
                  Zone {zone}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-between">
            {/* Legend */}
            <div className="flex justify-around items-center bg-celestial-offwhite/50 p-2.5 rounded-lg border border-celestial-gray-200 mb-4">
              <span className="flex items-center gap-1 font-sans text-[10px] text-celestial-gray-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-celestial-blue-500 inline-block"></span> Occupied
              </span>
              <span className="flex items-center gap-1 font-sans text-[10px] text-celestial-gray-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-celestial-gold-500 inline-block"></span> Reserved
              </span>
              <span className="flex items-center gap-1 font-sans text-[10px] text-celestial-gray-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-celestial-gray-200 border border-celestial-gray-200 inline-block"></span> Free
              </span>
            </div>

            {/* Grid Map */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 flex-grow flex items-center justify-center">
              {['Row 1', 'Row 2', 'Row 3', 'Row 4'].map((row) =>
                ['Seat 1', 'Seat 2', 'Seat 3', 'Seat 4'].map((seat) => {
                  const seatKey = `${row} - ${seat}`;
                  const state = seatsState[seatKey] || 'free';

                  let colorClass = '';
                  if (state === 'occupied') colorClass = 'bg-celestial-blue-500 text-white';
                  else if (state === 'reserved') colorClass = 'bg-celestial-gold-500 text-white';
                  else colorClass = 'bg-white text-celestial-gray-500 hover:bg-celestial-blue-50';

                  return (
                    <button
                      key={seatKey}
                      onClick={() => handleToggleSeat(seatKey)}
                      title={seatKey}
                      className={`h-11 rounded-lg border border-celestial-gray-200 font-sans text-[9px] font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${colorClass}`}
                    >
                      <span>R{row.split(' ')[1]}</span>
                      <span>S{seat.split(' ')[1]}</span>
                    </button>
                  );
                })
              )}
            </div>

            <p className="text-center font-sans text-[10px] text-celestial-gray-500 mt-4 leading-none font-semibold uppercase tracking-wider">
              --- Sanctuary Pulpit Altar Side ---
            </p>
          </div>
        </section>
      </div>

      {/* Active Ushers Roster Bar (12 cols) */}
      <section className="bg-white rounded-xl p-5 border border-celestial-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-base font-bold text-celestial-blue-900">Active Duty Usher Roster</h3>
            <p className="font-sans text-xs text-celestial-gray-500">Assigned stations and aisles for orderliness.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => alert('Printing active service rosters...')}
              className="bg-transparent border border-celestial-gray-200 hover:bg-celestial-offwhite p-1.5 rounded-lg text-celestial-gray-500"
              title="Print Roster"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAddingRoster(true)}
              className="bg-celestial-gray-800 hover:bg-celestial-gray-800 text-white font-sans text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Append Member
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rosters.map((item) => (
            <div
              key={item.id}
              className="border border-celestial-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow bg-celestial-offwhite/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-celestial-blue-100 flex items-center justify-center text-celestial-blue-900 font-sans font-bold text-xs">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-celestial-gray-800 leading-tight">
                    {item.name}
                  </h4>
                  <p className="font-sans text-[10px] text-celestial-gray-500 mt-0.5">
                    Aisle: <span className="font-semibold text-celestial-blue-900">{item.aisle}</span> • Arrived: {item.arrivalTime}
                  </p>
                </div>
              </div>

              <div>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                  className={`bg-white border border-celestial-gray-200 rounded-lg px-2 py-1 font-sans text-[10px] font-bold ${
                    item.status === 'On Duty'
                      ? 'text-green-600 border-green-200 bg-green-50'
                      : item.status === 'Standby'
                      ? 'text-celestial-gold-600 border-celestial-gold-100 bg-celestial-gold-50/50'
                      : 'text-celestial-gray-500'
                  }`}
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Standby">Standby</option>
                  <option value="Break">Break</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Side Men/Women Executive Committee Section */}
      <div className="bg-white rounded-xl border border-celestial-gray-200 shadow-sm p-6" id="sidemenwomen-executives-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> Side Men & Women Executive Committee
            </h3>
            <p className="font-sans text-xs text-celestial-gray-500">Official roster of leadership overseeing orderliness, seating, and ushering in the sanctuary.</p>
          </div>
          <button
            onClick={() => setIsAddingExec(true)}
            className="bg-celestial-blue-900 hover:bg-celestial-blue-800 text-white font-sans text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            id="add-sidemen-exec-btn"
          >
            <UserPlus className="w-4 h-4" /> Add Committee Executive
          </button>
        </div>

        {/* Executives Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-celestial-gray-200 text-celestial-gray-500 font-bold bg-celestial-offwhite/50">
                <th className="py-3 px-4 rounded-l-lg">Name & Rank</th>
                <th className="py-3 px-4">Committee Office</th>
                <th className="py-3 px-4">Contact Detail</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-celestial-gray-100">
              {executives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-celestial-gray-400 font-sans">
                    No committee executives registered yet. Click "Add Committee Executive" to get started.
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

      {/* New Committee Executive Dialog Overlay */}
      {isAddingExec && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" /> Add Committee Executive
            </h3>
            <form onSubmit={handleAddExec} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Samuel Adebiyi"
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
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Committee Office / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chairman, Vice Chairperson, Secretary"
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

      {/* Record Attendance Log overlay */}
      {isAddingLog && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Log Service Attendance</h3>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Type</label>
                <select
                  value={newLog.serviceType}
                  onChange={(e) => setNewLog({ ...newLog, serviceType: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Sunday Devotional">Sunday Devotional</option>
                  <option value="Wednesday Seeking">Wednesday Seeking</option>
                  <option value="Friday Night Vigil">Friday Night Vigil</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Men</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150"
                    value={newLog.men}
                    onChange={(e) => setNewLog({ ...newLog, men: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Women</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 180"
                    value={newLog.women}
                    onChange={(e) => setNewLog({ ...newLog, women: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Children</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 90"
                    value={newLog.children}
                    onChange={(e) => setNewLog({ ...newLog, children: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Offertory Boxes</label>
                  <input
                    type="number"
                    required
                    value={newLog.offertoryBoxes}
                    onChange={(e) => setNewLog({ ...newLog, offertoryBoxes: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Service Date</label>
                  <input
                    type="date"
                    required
                    value={newLog.date}
                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
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
                  Log Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Append Usher Roster overlay */}
      {isAddingRoster && (
        <div className="fixed inset-0 bg-celestial-gray-800/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-celestial-gray-200">
            <h3 className="font-serif text-lg font-bold text-celestial-blue-900 mb-4">Append Side Roster</h3>
            <form onSubmit={handleAddRoster} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sister Comfort"
                  value={newRoster.name}
                  onChange={(e) => setNewRoster({ ...newRoster, name: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Aisle / Station Assignment</label>
                <select
                  value={newRoster.aisle}
                  onChange={(e) => setNewRoster({ ...newRoster, aisle: e.target.value })}
                  className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Center Main">Center Main Aisle</option>
                  <option value="Left Wing">Left Wing Aisle</option>
                  <option value="Right Wing">Right Wing Aisle</option>
                  <option value="Gallery">Gallery Seating</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Initials</label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="e.g. SC"
                    value={newRoster.initials}
                    onChange={(e) => setNewRoster({ ...newRoster, initials: e.target.value.toUpperCase() })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-celestial-gray-500 mb-1">Arrival Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:30 AM"
                    value={newRoster.arrivalTime}
                    onChange={(e) => setNewRoster({ ...newRoster, arrivalTime: e.target.value })}
                    className="w-full bg-celestial-offwhite border border-celestial-gray-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-celestial-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddingRoster(false)}
                  className="bg-celestial-offwhite text-celestial-gray-500 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-celestial-blue-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-celestial-blue-800"
                >
                  Append Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="side_men_women"
        departmentName="Council of Sidesmen & Sideswomen"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="side_men_women"
        departmentName="Council of Sidesmen & Sideswomen"
      />
    </div>
  );
}
