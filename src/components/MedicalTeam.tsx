import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  UserPlus,
  Stethoscope,
  Shield,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Trash2,
  Calendar,
  Package,
  Layers,
  Thermometer,
  Award,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { MedicalPersonnel, ClinicLog, MedicalSupply, HealthOutreachProgram } from '../types';
import { initialMedicalPersonnel, initialClinicLogs, initialMedicalSupplies, initialHealthOutreaches } from '../data';
import ExecutivePortalModal from './ExecutivePortalModal';
import DepartmentFeedbackModal from './DepartmentFeedbackModal';

interface MedicalTeamProps {
  onNavigateToSecretariat?: () => void;
  onNavigateToMainDashboard?: () => void;
}

export default function MedicalTeam({ onNavigateToSecretariat, onNavigateToMainDashboard }: MedicalTeamProps) {
  const [personnel, setPersonnel] = useState<MedicalPersonnel[]>(() => {
    const saved = localStorage.getItem('ccc_medical_personnel');
    return saved ? JSON.parse(saved) : initialMedicalPersonnel;
  });

  const [clinicLogs, setClinicLogs] = useState<ClinicLog[]>(() => {
    const saved = localStorage.getItem('ccc_clinic_logs');
    return saved ? JSON.parse(saved) : initialClinicLogs;
  });

  const [supplies, setSupplies] = useState<MedicalSupply[]>(() => {
    const saved = localStorage.getItem('ccc_medical_supplies');
    return saved ? JSON.parse(saved) : initialMedicalSupplies;
  });

  const [outreaches, setOutreaches] = useState<HealthOutreachProgram[]>(() => {
    const saved = localStorage.getItem('ccc_health_outreaches');
    return saved ? JSON.parse(saved) : initialHealthOutreaches;
  });

  const [activeTab, setActiveTab] = useState<'clinic' | 'roster' | 'inventory' | 'outreach'>('clinic');
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Modal / Add toggles
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isAddingMedic, setIsAddingMedic] = useState(false);
  const [isAddingSupply, setIsAddingSupply] = useState(false);

  // New Patient Form
  const [newPatient, setNewPatient] = useState({
    patientName: '',
    service: 'Sunday Devotional Service',
    gender: 'Female' as ClinicLog['gender'],
    symptoms: '',
    bp: '120/80 mmHg',
    pulse: '76 bpm',
    temp: '36.6 °C',
    bloodSugar: '',
    treatment: '',
    outcome: 'Discharged & Stabilized' as ClinicLog['outcome'],
    attendingMedic: 'Dr. Emmanuel Adeyemi'
  });

  // New Medic Form
  const [newMedic, setNewMedic] = useState({
    name: '',
    profession: 'Registered Nurse' as MedicalPersonnel['profession'],
    rank: 'Lace Elder Sister',
    role: 'Triage Responder' as MedicalPersonnel['role'],
    contact: '',
    dutyStatus: 'On Duty' as MedicalPersonnel['dutyStatus']
  });

  // Add Patient Handler
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.patientName || !newPatient.symptoms) {
      alert('Please fill out patient name and symptoms.');
      return;
    }

    const created: ClinicLog = {
      id: `CLN-2026-0${clinicLogs.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      service: newPatient.service,
      patientName: newPatient.patientName,
      gender: newPatient.gender,
      symptoms: newPatient.symptoms,
      vitals: {
        bp: newPatient.bp,
        pulse: newPatient.pulse,
        temp: newPatient.temp,
        bloodSugar: newPatient.bloodSugar || undefined
      },
      treatmentAdministered: newPatient.treatment || 'Observation & vitals monitoring',
      outcome: newPatient.outcome,
      attendingMedic: newPatient.attendingMedic
    };

    const updated = [created, ...clinicLogs];
    setClinicLogs(updated);
    localStorage.setItem('ccc_clinic_logs', JSON.stringify(updated));
    setIsAddingPatient(false);
    setNewPatient({
      patientName: '',
      service: 'Sunday Devotional Service',
      gender: 'Female',
      symptoms: '',
      bp: '120/80 mmHg',
      pulse: '76 bpm',
      temp: '36.6 °C',
      bloodSugar: '',
      treatment: '',
      outcome: 'Discharged & Stabilized',
      attendingMedic: 'Dr. Emmanuel Adeyemi'
    });
  };

  // Add Medic Handler
  const handleAddMedic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedic.name || !newMedic.contact) {
      alert('Please enter name and contact.');
      return;
    }

    const created: MedicalPersonnel = {
      id: `MED-0${personnel.length + 1}`,
      name: newMedic.name,
      profession: newMedic.profession,
      rank: newMedic.rank,
      role: newMedic.role,
      contact: newMedic.contact,
      dutyStatus: newMedic.dutyStatus
    };

    const updated = [...personnel, created];
    setPersonnel(updated);
    localStorage.setItem('ccc_medical_personnel', JSON.stringify(updated));
    setIsAddingMedic(false);
    setNewMedic({
      name: '',
      profession: 'Registered Nurse',
      rank: 'Lace Elder Sister',
      role: 'Triage Responder',
      contact: '',
      dutyStatus: 'On Duty'
    });
  };

  const onDutyCount = personnel.filter(p => p.dutyStatus === 'On Duty').length;
  const criticalSuppliesCount = supplies.filter(s => s.status === 'Low Stock' || s.status === 'Critical').length;

  return (
    <div className="space-y-6">
      
      {/* Executive Unit Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-amber-400/20 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <HeartPulse className="w-8 h-8 text-rose-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-200 bg-rose-400/20 px-2.5 py-0.5 rounded-full border border-rose-300/30">
                  Cathedral Health Directorate
                </span>
                <span className="text-xs text-rose-200 font-mono">
                  First Aid Post & Emergency Medical Response
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight">
                Medical Team
              </h1>
              <p className="text-xs text-rose-100 max-w-xl mt-1 leading-relaxed font-sans">
                Provides rapid clinical triage, emergency resuscitation, Sunday service healthcare cover, pharmaceutical first aid, and community wellness programs for CCC Ibara Cathedral.
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
              className="bg-white hover:bg-rose-50 text-red-900 px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all shadow-md flex items-center gap-2 border border-rose-200"
            >
              <Shield className="w-4 h-4 text-red-700" />
              <span>3-Key Executive Portal</span>
              <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-mono font-bold">
                Chair • Sec • Treas
              </span>
            </button>
          </div>
        </div>

        {/* Vital Unit Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-rose-400/30">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-rose-200">On-Duty Medics</div>
            <div className="text-xl font-bold font-serif text-white">{onDutyCount} Active</div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Triage Post Ready</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-rose-200">Clinic Consultations</div>
            <div className="text-xl font-bold font-serif text-white">{clinicLogs.length} Cases</div>
            <div className="text-[10px] text-rose-200 font-semibold mt-0.5">100% Stabilized</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-rose-200">Emergency Pharmacy</div>
            <div className="text-xl font-bold font-serif text-white">{supplies.length} Line Items</div>
            <div className="text-[10px] text-amber-300 font-semibold mt-0.5">{criticalSuppliesCount} Low Stock Alert</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-rose-200">Community Outreaches</div>
            <div className="text-xl font-bold font-serif text-white">{outreaches.length} Programs</div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">Hypertension Week</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('clinic')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'clinic' ? 'border-red-700 text-red-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-red-600" />
          Sunday Clinic & Triage Logs ({clinicLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'roster' ? 'border-red-700 text-red-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-red-600" />
          Medical Roster & Volunteers ({personnel.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'inventory' ? 'border-red-700 text-red-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-red-600" />
          First Aid Kits & Pharmacy Stock ({supplies.length})
        </button>
        <button
          onClick={() => setActiveTab('outreach')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'outreach' ? 'border-red-700 text-red-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-red-600" />
          Parish Health Outreaches ({outreaches.length})
        </button>
      </div>

      {/* TAB 1: Clinic & Triage Logs */}
      {activeTab === 'clinic' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Sunday Clinic & Emergency Triage Register
              </h3>
              <p className="text-xs text-slate-500">
                Official records of worshipers, visitors, and church workers treated during parish assemblies.
              </p>
            </div>
            <button
              onClick={() => setIsAddingPatient(true)}
              className="bg-red-800 hover:bg-red-900 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Log Patient Encounter
            </button>
          </div>

          {/* List of Consultations */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-3 px-3">Date & Service</th>
                  <th className="py-3 px-3">Patient Name</th>
                  <th className="py-3 px-3">Recorded Vitals</th>
                  <th className="py-3 px-3">Clinical Presentation</th>
                  <th className="py-3 px-3">Treatment Given</th>
                  <th className="py-3 px-3">Outcome</th>
                  <th className="py-3 px-3">Attending Medic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clinicLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{log.date}</div>
                      <div className="text-[10px] text-slate-500">{log.service}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {log.patientName}
                      <span className="block text-[10px] text-slate-400 font-normal">{log.gender}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                      <div>BP: <strong>{log.vitals.bp}</strong></div>
                      <div>Pulse: {log.vitals.pulse} | Temp: {log.vitals.temp}</div>
                      {log.vitals.bloodSugar && <div>Sugar: {log.vitals.bloodSugar}</div>}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs">{log.symptoms}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium max-w-xs">{log.treatmentAdministered}</td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-semibold">{log.attendingMedic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Medical Roster & Volunteers */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Cathedral Medical Corps & First Responders Roster
              </h3>
              <p className="text-xs text-slate-500">
                Credentialed doctors, nurses, pharmacists, and trained first aiders serving the sanctuary.
              </p>
            </div>
            <button
              onClick={() => setIsAddingMedic(true)}
              className="bg-red-800 hover:bg-red-900 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" /> Add Medical Officer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personnel.map((med) => (
              <div key={med.id} className="p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-xs transition-all space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {med.profession}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    med.dutyStatus === 'On Duty' ? 'bg-emerald-100 text-emerald-800' :
                    med.dutyStatus === 'Standby' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {med.dutyStatus}
                  </span>
                </div>

                <div className="font-serif text-sm font-bold text-slate-900">{med.name}</div>
                <div className="text-xs text-slate-500">{med.rank} • {med.role}</div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" /> {med.contact}
                  </span>
                  <button
                    onClick={() => {
                      const updated = personnel.map(p => p.id === med.id ? {
                        ...p,
                        dutyStatus: p.dutyStatus === 'On Duty' ? 'Off Duty' as const : 'On Duty' as const
                      } : p);
                      setPersonnel(updated);
                      localStorage.setItem('ccc_medical_personnel', JSON.stringify(updated));
                    }}
                    className="text-[10px] font-bold text-blue-700 hover:underline"
                  >
                    Toggle Duty
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Inventory & Supplies */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                First Aid Posts & Emergency Pharmacy Safe
              </h3>
              <p className="text-xs text-slate-500">
                Diagnostic devices, resuscitation equipment, sterile consumables, and emergency analgesics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {supplies.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{item.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Sufficient' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="font-serif text-sm font-bold text-slate-900">{item.itemName}</div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Available Stock: <strong className="font-mono text-slate-900">{item.quantity} {item.unit}</strong></span>
                  <span className="text-[10px] text-slate-400">Exp: {item.expiryDate}</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  Location: <strong>{item.location}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Health Outreaches */}
      {activeTab === 'outreach' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Community Health Drives & Screening Campaigns
              </h3>
              <p className="text-xs text-slate-500">
                Cathedral-sponsored public health initiatives, elderly care screenings, and medical missions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {outreaches.map((out) => (
              <div key={out.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-slate-900">{out.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      out.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      out.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {out.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Target Beneficiaries: {out.targetAudience}</p>
                  <div className="text-[11px] text-slate-600">
                    Lead: <strong>{out.leadCoordinator}</strong> • Date: <strong>{out.date}</strong> • Target: <strong>{out.beneficiariesTarget} Parishioners</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PATIENT MODAL */}
      {isAddingPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b pb-2">
              Log Sunday Clinic Patient Encounter
            </h3>
            <form onSubmit={handleAddPatient} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Patient Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Olawale Adeyemi"
                  value={newPatient.patientName}
                  onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Service</label>
                  <input
                    type="text"
                    value={newPatient.service}
                    onChange={(e) => setNewPatient({ ...newPatient, service: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Gender / Age Category</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as ClinicLog['gender'] })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Child">Child</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    placeholder="120/80 mmHg"
                    value={newPatient.bp}
                    onChange={(e) => setNewPatient({ ...newPatient, bp: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Pulse Rate</label>
                  <input
                    type="text"
                    placeholder="78 bpm"
                    value={newPatient.pulse}
                    onChange={(e) => setNewPatient({ ...newPatient, pulse: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Blood Sugar</label>
                  <input
                    type="text"
                    placeholder="105 mg/dL"
                    value={newPatient.bloodSugar}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodSugar: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Symptoms / Chief Complaint</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute dizziness, elevated heat, fatigue"
                  value={newPatient.symptoms}
                  onChange={(e) => setNewPatient({ ...newPatient, symptoms: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Treatment / First Aid Rendered</label>
                <input
                  type="text"
                  placeholder="e.g. Oral rehydration, paracetamol 1g, rested 30 mins"
                  value={newPatient.treatment}
                  onChange={(e) => setNewPatient({ ...newPatient, treatment: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingPatient(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-800 text-white font-bold rounded-lg hover:bg-red-900"
                >
                  Save Clinic Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEDIC MODAL */}
      {isAddingMedic && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b pb-2">
              Add Medical Officer / Volunteer
            </h3>
            <form onSubmit={handleAddMedic} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name & Qualifications</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Kehinde Oladipo (MBBS)"
                  value={newMedic.name}
                  onChange={(e) => setNewMedic({ ...newMedic, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Profession</label>
                <select
                  value={newMedic.profession}
                  onChange={(e) => setNewMedic({ ...newMedic, profession: e.target.value as MedicalPersonnel['profession'] })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Medical Doctor">Medical Doctor</option>
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Paramedic">Paramedic</option>
                  <option value="First Aider">First Aider</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+234 800 000 0000"
                  value={newMedic.contact}
                  onChange={(e) => setNewMedic({ ...newMedic, contact: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingMedic(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-800 text-white font-bold rounded-lg hover:bg-red-900"
                >
                  Register Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Key Executive Portal Modal */}
      <ExecutivePortalModal
        department="medical"
        departmentName="Medical Team"
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onNavigateToSecretariat={onNavigateToSecretariat}
      />

      {/* Department Feedback Modal */}
      <DepartmentFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        department="medical"
        departmentName="Medical Team"
      />
    </div>
  );
}
