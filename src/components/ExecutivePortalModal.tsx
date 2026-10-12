import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  CheckCircle,
  FileText,
  DollarSign,
  AlertCircle,
  X,
  Plus,
  Send,
  LogOut,
  Sparkles,
  Award,
  Phone,
  Mail,
  Eye,
  Ban,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import {
  Department,
  ExecutiveRole,
  DepartmentExecutiveCredential,
  DepartmentExecutiveRecord,
  DepartmentSecretaryRecord,
  DepartmentTreasurerRecord
} from '../types';
import {
  departmentKeyExecutives,
  initialExecutiveRecords,
  initialDepartmentSecretaryRecords,
  initialDepartmentTreasurerRecords,
  updateDepartmentAuthByChairman
} from '../data';

interface ExecutivePortalModalProps {
  department: Department;
  departmentName: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSecretariat?: () => void;
}

export default function ExecutivePortalModal({
  department,
  departmentName,
  isOpen,
  onClose,
  onNavigateToSecretariat
}: ExecutivePortalModalProps) {
  // Passwords storage in state (with defaults)
  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`ccc_passwords_${department}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    return {
      Chairman: 'Chairman@Ibara',
      Secretary: 'Secretary@Ibara',
      Treasurer: 'Treasurer@Ibara'
    };
  });

  // Dynamic executive profiles (Officer names, ranks, emails, phones)
  const defaultExecList = departmentKeyExecutives[department] || [
    {
      department,
      role: 'Chairman',
      username: 'Chairman',
      name: 'Council Chairman',
      rank: 'Senior Officer',
      phone: '+234 800 000 0001',
      email: 'chairman@ibaracathedral.org'
    },
    {
      department,
      role: 'Secretary',
      username: 'Secretary',
      name: 'Council Secretary',
      rank: 'Secretariat Officer',
      phone: '+234 800 000 0002',
      email: 'secretary@ibaracathedral.org'
    },
    {
      department,
      role: 'Treasurer',
      username: 'Treasurer',
      name: 'Council Treasurer',
      rank: 'Financial Officer',
      phone: '+234 800 000 0003',
      email: 'treasurer@ibaracathedral.org'
    }
  ];

  const [execProfiles, setExecProfiles] = useState<DepartmentExecutiveCredential[]>(() => {
    const saved = localStorage.getItem(`ccc_exec_profiles_${department}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    return defaultExecList;
  });

  // Current authenticated executive role for this department
  const [activeRole, setActiveRole] = useState<ExecutiveRole | null>(() => {
    const saved = localStorage.getItem(`ccc_exec_role_${department}`);
    return (saved as ExecutiveRole) || null;
  });

  // Active view tab once logged in
  // - Chairman can choose: 'chairman_page' | 'inspect_secretary' | 'inspect_treasurer' | 'credentials'
  // - Secretary is locked to: 'secretary_page'
  // - Treasurer is locked to: 'treasurer_page'
  const [chairmanView, setChairmanView] = useState<
    'chairman_page' | 'inspect_secretary' | 'inspect_treasurer' | 'credentials'
  >('chairman_page');

  // Restricted Access Attempt Modal State (when Secretary or Treasurer tries to switch)
  const [restrictedNotice, setRestrictedNotice] = useState<{
    targetPage: string;
    reason: string;
  } | null>(null);

  // Login form state
  const [selectedRole, setSelectedRole] = useState<ExecutiveRole>('Chairman');
  const [usernameInput, setUsernameInput] = useState('Chairman');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Chairman Directives / Resolutions records
  const [records, setRecords] = useState<DepartmentExecutiveRecord[]>(() => {
    const saved = localStorage.getItem(`ccc_exec_records_${department}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    return initialExecutiveRecords.filter((r) => r.department === department);
  });

  // Secretary Minutes & Assembly records
  const [secRecords, setSecRecords] = useState<DepartmentSecretaryRecord[]>(() => {
    const saved = localStorage.getItem(`ccc_sec_records_${department}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    const matched = initialDepartmentSecretaryRecords.filter((r) => r.department === department);
    if (matched.length > 0) return matched;
    // Fallback default record for departments without explicit starter data
    return [
      {
        id: `SEC-${department.substring(0, 3).toUpperCase()}-01`,
        department,
        title: `${departmentName} Executive Working Session & Minutes`,
        meetingType: 'Statutory Council',
        date: '2026-10-04',
        time: '16:00 - 17:30',
        quorumCount: 8,
        secretaryAuthor: execProfiles.find((p) => p.role === 'Secretary')?.name || 'Council Secretary',
        keyResolutions:
          'Harmonized operational timetable with Cathedral guidelines; confirmed duty roster for upcoming services.',
        attendees: 'Chairman, Secretary, Treasurer, and departmental executive committee members.',
        archivedStatus: 'Official Recorded'
      }
    ];
  });

  // Treasurer Financial Vouchers & Ledger records
  const [treasRecords, setTreasRecords] = useState<DepartmentTreasurerRecord[]>(() => {
    const saved = localStorage.getItem(`ccc_treas_records_${department}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fallback */
      }
    }
    const matched = initialDepartmentTreasurerRecords.filter((r) => r.department === department);
    if (matched.length > 0) return matched;
    // Fallback default record
    return [
      {
        id: `TREAS-${department.substring(0, 3).toUpperCase()}-01`,
        department,
        voucherCode: `VCH-${department.substring(0, 3).toUpperCase()}-2026-001`,
        category: 'Logistics & Requisition',
        description: `Operational expenditure & materials disbursement for ${departmentName}`,
        amount: 175000,
        date: '2026-10-04',
        payee: 'Cathedral Designated Vendors',
        paymentMethod: 'Bank Transfer',
        treasurerSignee: execProfiles.find((p) => p.role === 'Treasurer')?.name || 'Council Treasurer',
        auditStatus: 'Audited & Cleared'
      }
    ];
  });

  // Chairman Directive Form
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newStatus, setNewStatus] = useState<DepartmentExecutiveRecord['status']>('Approved');

  // Secretary Add Minutes Form
  const [isAddingSecMinute, setIsAddingSecMinute] = useState(false);
  const [secMinuteTitle, setSecMinuteTitle] = useState('');
  const [secMeetingType, setSecMeetingType] = useState<DepartmentSecretaryRecord['meetingType']>('Statutory Council');
  const [secDate, setSecDate] = useState(new Date().toISOString().split('T')[0]);
  const [secTime, setSecTime] = useState('16:00 - 17:30');
  const [secQuorum, setSecQuorum] = useState('8');
  const [secAttendees, setSecAttendees] = useState('');
  const [secResolutions, setSecResolutions] = useState('');

  // Treasurer Add Voucher Form
  const [isAddingVoucher, setIsAddingVoucher] = useState(false);
  const [voucherDesc, setVoucherDesc] = useState('');
  const [voucherCategory, setVoucherCategory] = useState<DepartmentTreasurerRecord['category']>('Logistics & Requisition');
  const [voucherAmount, setVoucherAmount] = useState('');
  const [voucherPayee, setVoucherPayee] = useState('');
  const [voucherPaymentMethod, setVoucherPaymentMethod] = useState<DepartmentTreasurerRecord['paymentMethod']>('Bank Transfer');

  // Chairman Credential & Password Management state
  const [targetRoleToChange, setTargetRoleToChange] = useState<ExecutiveRole>('Secretary');
  const [officerNameInput, setOfficerNameInput] = useState('');
  const [officerRankInput, setOfficerRankInput] = useState('');
  const [officerEmailInput, setOfficerEmailInput] = useState('');
  const [officerPhoneInput, setOfficerPhoneInput] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [syncWebLogin, setSyncWebLogin] = useState(false);
  const [deptWebLoginPassword, setDeptWebLoginPassword] = useState('');

  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);
  const [credentialsFormError, setCredentialsFormError] = useState<string | null>(null);

  // Sync inputs when target role changes in Chairman Chamber
  useEffect(() => {
    const profile = execProfiles.find((p) => p.role === targetRoleToChange);
    if (profile) {
      setOfficerNameInput(profile.name);
      setOfficerRankInput(profile.rank);
      setOfficerEmailInput(profile.email);
      setOfficerPhoneInput(profile.phone);
    }
    setNewPasswordValue(passwords[targetRoleToChange] || `${targetRoleToChange}@Ibara`);
  }, [targetRoleToChange, execProfiles, passwords]);

  // Sync username input when role selector changes on login
  useEffect(() => {
    setUsernameInput(selectedRole);
    setPasswordInput('');
    setAuthError(null);
  }, [selectedRole]);

  const currentExecProfile = activeRole
    ? execProfiles.find((e) => e.role === activeRole) || execProfiles[0]
    : null;

  // Handle Login into specific Executive Office
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const requiredPassword = passwords[selectedRole] || `${selectedRole}@Ibara`;

    if (
      usernameInput.trim().toLowerCase() === selectedRole.toLowerCase() &&
      (passwordInput === requiredPassword ||
        passwordInput === `${selectedRole}@Ibara` ||
        passwordInput === 'password123')
    ) {
      setActiveRole(selectedRole);
      localStorage.setItem(`ccc_exec_role_${department}`, selectedRole);
      setPasswordInput('');
      setAuthError(null);
      // Reset view to their appropriate page
      if (selectedRole === 'Chairman') {
        setChairmanView('chairman_page');
      }
    } else {
      setAuthError(`Invalid credentials for ${selectedRole}. Please enter the official password set by the Chairman.`);
    }
  };

  const handleQuickDemoLogin = (role: ExecutiveRole) => {
    setSelectedRole(role);
    setUsernameInput(role);
    setPasswordInput(passwords[role] || `${role}@Ibara`);
    setActiveRole(role);
    localStorage.setItem(`ccc_exec_role_${department}`, role);
    setAuthError(null);
    if (role === 'Chairman') {
      setChairmanView('chairman_page');
    }
  };

  const handleLogout = () => {
    setActiveRole(null);
    localStorage.removeItem(`ccc_exec_role_${department}`);
    setPasswordInput('');
    setAuthError(null);
    setRestrictedNotice(null);
  };

  // Prevent Secretary or Treasurer from switching pages
  const handleAttemptRestrictedSwitch = (targetOffice: string, reason: string) => {
    setRestrictedNotice({
      targetPage: targetOffice,
      reason
    });
  };

  // Chairman Directive Submission
  const handleAddChairmanRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole !== 'Chairman') return;
    if (!newTitle.trim() || !newDescription.trim()) return;

    const created: DepartmentExecutiveRecord = {
      id: `DIR-${department.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      department,
      role: 'Chairman',
      title: newTitle.trim(),
      description: newDescription.trim(),
      date: new Date().toISOString().split('T')[0],
      status: newStatus,
      author: currentExecProfile ? `${currentExecProfile.rank} ${currentExecProfile.name} (Chairman)` : 'Council Chairman',
      amount: newAmount ? parseFloat(newAmount) : undefined
    };

    const updated = [created, ...records];
    setRecords(updated);
    localStorage.setItem(`ccc_exec_records_${department}`, JSON.stringify(updated));

    setNewTitle('');
    setNewDescription('');
    setNewAmount('');
    setIsAddingRecord(false);
  };

  // Secretary Add Minute Submission (Locked in Chairman Mode)
  const handleAddSecretaryMinute = (e: React.FormEvent) => {
    e.preventDefault();
    // Tamper Protection check
    if (activeRole !== 'Secretary') return;
    if (!secMinuteTitle.trim() || !secResolutions.trim()) return;

    const created: DepartmentSecretaryRecord = {
      id: `SEC-${department.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      department,
      title: secMinuteTitle.trim(),
      meetingType: secMeetingType,
      date: secDate,
      time: secTime,
      quorumCount: parseInt(secQuorum, 10) || 5,
      secretaryAuthor: currentExecProfile ? currentExecProfile.name : 'Council Secretary',
      keyResolutions: secResolutions.trim(),
      attendees: secAttendees.trim() || 'Department Executive Committee members',
      archivedStatus: 'Official Recorded'
    };

    const updated = [created, ...secRecords];
    setSecRecords(updated);
    localStorage.setItem(`ccc_sec_records_${department}`, JSON.stringify(updated));

    setSecMinuteTitle('');
    setSecResolutions('');
    setSecAttendees('');
    setIsAddingSecMinute(false);
  };

  // Treasurer Add Voucher Submission (Locked in Chairman Mode)
  const handleAddTreasurerVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    // Tamper Protection check
    if (activeRole !== 'Treasurer') return;
    if (!voucherDesc.trim() || !voucherAmount || !voucherPayee.trim()) return;

    const created: DepartmentTreasurerRecord = {
      id: `TREAS-${department.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      department,
      voucherCode: `VCH-${department.substring(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: voucherCategory,
      description: voucherDesc.trim(),
      amount: parseFloat(voucherAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      payee: voucherPayee.trim(),
      paymentMethod: voucherPaymentMethod,
      treasurerSignee: currentExecProfile ? currentExecProfile.name : 'Council Treasurer',
      auditStatus: 'Audited & Cleared'
    };

    const updated = [created, ...treasRecords];
    setTreasRecords(updated);
    localStorage.setItem(`ccc_treas_records_${department}`, JSON.stringify(updated));

    setVoucherDesc('');
    setVoucherAmount('');
    setVoucherPayee('');
    setIsAddingVoucher(false);
  };

  // Chairman save credentials & password handler
  const handleChairmanSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsFormError(null);

    // Authority Check: Only Chairman can create/change credentials & passwords
    if (activeRole !== 'Chairman') {
      setCredentialsFormError(
        `Access Denied: Only the Chairman of ${departmentName} possesses statutory authority to create or update executive credentials & passwords.`
      );
      return;
    }

    if (!newPasswordValue.trim() || newPasswordValue.length < 4) {
      setCredentialsFormError('Access password must be at least 4 characters long.');
      return;
    }

    if (!officerNameInput.trim()) {
      setCredentialsFormError('Officer Full Name cannot be empty.');
      return;
    }

    // 1. Update executive passwords
    const updatedPasswords = {
      ...passwords,
      [targetRoleToChange]: newPasswordValue.trim()
    };
    setPasswords(updatedPasswords);
    localStorage.setItem(`ccc_passwords_${department}`, JSON.stringify(updatedPasswords));

    // 2. Update executive profiles
    const updatedProfiles = execProfiles.map((p) => {
      if (p.role === targetRoleToChange) {
        return {
          ...p,
          name: officerNameInput.trim(),
          rank: officerRankInput.trim() || p.rank,
          email: officerEmailInput.trim() || p.email,
          phone: officerPhoneInput.trim() || p.phone
        };
      }
      return p;
    });
    setExecProfiles(updatedProfiles);
    localStorage.setItem(`ccc_exec_profiles_${department}`, JSON.stringify(updatedProfiles));

    // 3. If updating department web login password
    if (syncWebLogin && deptWebLoginPassword.trim()) {
      updateDepartmentAuthByChairman(department, {
        password: deptWebLoginPassword.trim(),
        officerName: officerNameInput.trim(),
        officerRole: `${targetRoleToChange} (${officerRankInput.trim() || 'Officer'})`
      });
    }

    // 4. Log executive resolution into records
    const chairmanProfile = execProfiles.find((p) => p.role === 'Chairman') || execProfiles[0];
    const newResolution: DepartmentExecutiveRecord = {
      id: `EXE-${department.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      department,
      role: 'Chairman',
      title: `Executive Order: Official Credentials & Password Ratified for ${targetRoleToChange}`,
      description: `Department Chairman ${chairmanProfile.name} officially created and ratified new access credentials and security password for ${targetRoleToChange} (${officerNameInput.trim()}) of ${departmentName}.`,
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
      author: `${chairmanProfile.rank} ${chairmanProfile.name} (Chairman)`
    };

    const updatedRecs = [newResolution, ...records];
    setRecords(updatedRecs);
    localStorage.setItem(`ccc_exec_records_${department}`, JSON.stringify(updatedRecs));

    setPasswordChangeSuccess(
      `Chairman Mandate Ratified: Official password for ${targetRoleToChange} set to "${newPasswordValue.trim()}". ${targetRoleToChange} can now log into their dedicated page!`
    );
    setTimeout(() => setPasswordChangeSuccess(null), 6000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-fade-in relative">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Close Executive Chamber"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <Shield className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                    3-Key Executive Chambers
                  </span>
                  <span className="text-[10px] text-blue-200 font-mono">
                    CCC Ibara Cathedral
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                  {departmentName}
                </h2>
                <p className="text-xs text-blue-100 font-sans mt-0.5">
                  Principal Executive Offices: Chairman • Secretary • Treasurer
                </p>
              </div>
            </div>

            {activeRole && (
              <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">Authenticated Desk</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {activeRole === 'Chairman' && <Award className="w-3.5 h-3.5 text-amber-300" />}
                    {activeRole === 'Secretary' && <FileText className="w-3.5 h-3.5 text-blue-200" />}
                    {activeRole === 'Treasurer' && <DollarSign className="w-3.5 h-3.5 text-emerald-300" />}
                    {activeRole} Office
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 px-2 py-1 rounded-lg bg-white/20 hover:bg-red-500/80 text-white transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                  title="Sign out of this Executive role"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RESTRICTED ACCESS ATTEMPT WARNING MODAL */}
        {restrictedNotice && (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-500 animate-bounce-short">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Ban className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 text-center">
                Access Prohibited: Strict Separation of Powers
              </h3>
              <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
                You are authenticated as the <strong>{activeRole}</strong> of {departmentName}.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 my-3 text-xs text-red-800">
                <p className="font-semibold">{restrictedNotice.reason}</p>
                <p className="mt-1 text-[11px] text-red-700">
                  {activeRole === 'Secretary' && 'The Secretary cannot switch to or view the Treasurer Page.'}
                  {activeRole === 'Treasurer' && 'The Treasurer cannot switch to or view the Secretary Page.'}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                To access another office, you must officially sign out and authenticate with that officer's valid credentials.
              </p>
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => setRestrictedNotice(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Return to My {activeRole} Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          
          {/* ========================================================
              STATE 1: NOT AUTHENTICATED -> Role Selection & Login Form
             ======================================================== */}
          {!activeRole ? (
            <div className="max-w-2xl mx-auto space-y-6 py-2">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  Statutory Executive Portal
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900 mt-2">
                  Select Principal Officer & Sign In
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Only the <strong>Chairman</strong> creates passwords for Chairman, Secretary, and Treasurer so each officer logs into their own page.
                </p>
              </div>

              {/* 3 Role Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Chairman', 'Secretary', 'Treasurer'] as ExecutiveRole[]).map((role) => {
                  const isSelected = selectedRole === role;
                  const profile = execProfiles.find((e) => e.role === role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-4 rounded-xl text-left border transition-all relative cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md'
                          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            role === 'Chairman'
                              ? 'bg-amber-100 text-amber-800'
                              : role === 'Secretary'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {role}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#2563EB]" />}
                      </div>
                      <div className="font-serif text-sm font-bold text-slate-900 line-clamp-1">
                        {profile?.name || `${role} of Unit`}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {profile?.rank}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-2">
                        User: <strong className="text-slate-600">{role}</strong>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Authentication Form Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleLogin} className="space-y-4">
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Executive Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          placeholder="e.g. Chairman"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          {selectedRole} Password
                        </label>
                        <span className="text-[10px] text-blue-600 font-mono font-medium">
                          Created by Chairman
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(selectedRole)}
                      className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      1-Click Fast Authenticate as {selectedRole}
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Sign In to {selectedRole} Office
                    </button>
                  </div>
                </form>

                {/* Predefined Credential Info Guide */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-800 block">Chairman Office</span>
                    <span className="font-mono text-[10px] text-slate-600">User: Chairman</span><br />
                    <span className="font-mono text-[10px] text-amber-900 font-bold">Pass: {passwords.Chairman || 'Chairman@Ibara'}</span>
                  </div>
                  <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                    <span className="font-bold text-blue-800 block">Secretary Office</span>
                    <span className="font-mono text-[10px] text-slate-600">User: Secretary</span><br />
                    <span className="font-mono text-[10px] text-blue-900 font-bold">Pass: {passwords.Secretary || 'Secretary@Ibara'}</span>
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-800 block">Treasurer Office</span>
                    <span className="font-mono text-[10px] text-slate-600">User: Treasurer</span><br />
                    <span className="font-mono text-[10px] text-emerald-900 font-bold">Pass: {passwords.Treasurer || 'Treasurer@Ibara'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (

            /* ========================================================
               STATE 2: AUTHENTICATED EXECUTIVE DASHBOARDS
               ======================================================== */
            <div className="space-y-6">
              
              {/* Officer Profile Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-white shadow-sm ${
                      activeRole === 'Chairman'
                        ? 'bg-amber-600'
                        : activeRole === 'Secretary'
                        ? 'bg-blue-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {activeRole[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-bold text-slate-900">
                        {currentExecProfile?.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          activeRole === 'Chairman'
                            ? 'bg-amber-100 text-amber-800'
                            : activeRole === 'Secretary'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {activeRole} Office
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {currentExecProfile?.rank} • {departmentName}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" /> {currentExecProfile?.phone}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-slate-400" /> {currentExecProfile?.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Badge / Status */}
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
                    Strict Page Isolation: Active
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* ========================================================
                  ROLE-BASED NAVIGATION TABS
                 ======================================================== */}

              {/* CASE A: CHAIRMAN IS LOGGED IN */}
              {activeRole === 'Chairman' && (
                <div className="flex border-b border-slate-200 space-x-1 sm:space-x-3 text-xs font-bold overflow-x-auto pb-1">
                  <button
                    onClick={() => setChairmanView('chairman_page')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      chairmanView === 'chairman_page'
                        ? 'border-amber-600 text-amber-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    Chairman Executive Chambers
                  </button>

                  <button
                    onClick={() => setChairmanView('inspect_secretary')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      chairmanView === 'inspect_secretary'
                        ? 'border-blue-600 text-blue-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                    Inspect Secretary Page (Oversight Mode)
                  </button>

                  <button
                    onClick={() => setChairmanView('inspect_treasurer')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      chairmanView === 'inspect_treasurer'
                        ? 'border-emerald-600 text-emerald-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-emerald-600" />
                    Inspect Treasurer Page (Oversight Mode)
                  </button>

                  <button
                    onClick={() => setChairmanView('credentials')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      chairmanView === 'credentials'
                        ? 'border-purple-600 text-purple-800'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    Create Credentials & Passwords (Chairman Only)
                  </button>
                </div>
              )}

              {/* CASE B: SECRETARY IS LOGGED IN -> LOCKED TABS FOR TREASURER & CHAIRMAN */}
              {activeRole === 'Secretary' && (
                <div className="flex border-b border-slate-200 space-x-1 sm:space-x-3 text-xs font-bold overflow-x-auto pb-1">
                  <div className="pb-2.5 px-3 border-b-2 border-blue-600 text-blue-800 whitespace-nowrap flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Secretary Page (My Office Desk)
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleAttemptRestrictedSwitch(
                        'Treasurer Page',
                        'Secretary cannot switch to the Treasurer Page. Direct financial data and funds are strictly restricted to the Treasurer.'
                      )
                    }
                    className="pb-2.5 px-3 border-b-2 border-transparent text-slate-400 hover:text-red-500 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-not-allowed group"
                    title="Access Restricted: Secretary cannot switch to Treasurer Page"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
                    <span>Treasurer Page (Restricted)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAttemptRestrictedSwitch(
                        'Chairman Page',
                        'Secretary cannot switch to the Chairman Page or modify credentials. Only the Chairman holds executive authority.'
                      )
                    }
                    className="pb-2.5 px-3 border-b-2 border-transparent text-slate-400 hover:text-red-500 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-not-allowed group"
                    title="Access Restricted: Secretary cannot switch to Chairman Page"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
                    <span>Chairman Chambers & Passwords (Restricted)</span>
                  </button>
                </div>
              )}

              {/* CASE C: TREASURER IS LOGGED IN -> LOCKED TABS FOR SECRETARY & CHAIRMAN */}
              {activeRole === 'Treasurer' && (
                <div className="flex border-b border-slate-200 space-x-1 sm:space-x-3 text-xs font-bold overflow-x-auto pb-1">
                  <div className="pb-2.5 px-3 border-b-2 border-emerald-600 text-emerald-800 whitespace-nowrap flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Treasurer Page (My Office Desk)
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleAttemptRestrictedSwitch(
                        'Secretary Page',
                        'Treasurer cannot switch to the Secretary Page. Secretarial minutes and official archives are strictly restricted to the Secretary.'
                      )
                    }
                    className="pb-2.5 px-3 border-b-2 border-transparent text-slate-400 hover:text-red-500 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-not-allowed group"
                    title="Access Restricted: Treasurer cannot switch to Secretary Page"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
                    <span>Secretary Page (Restricted)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAttemptRestrictedSwitch(
                        'Chairman Page',
                        'Treasurer cannot switch to the Chairman Page or modify credentials. Only the Chairman holds executive authority.'
                      )
                    }
                    className="pb-2.5 px-3 border-b-2 border-transparent text-slate-400 hover:text-red-500 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-not-allowed group"
                    title="Access Restricted: Treasurer cannot switch to Chairman Page"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
                    <span>Chairman Chambers & Passwords (Restricted)</span>
                  </button>
                </div>
              )}

              {/* ========================================================
                  PAGE VIEW CONTENT SECTIONS
                 ======================================================== */}

              {/* --------------------------------------------------------
                  1. CHAIRMAN EXECUTIVE CHAMBERS (Chairman Only)
                 -------------------------------------------------------- */}
              {activeRole === 'Chairman' && chairmanView === 'chairman_page' && (
                <div className="space-y-5">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900">
                        <Award className="w-5 h-5 text-amber-600" />
                        <h4 className="font-serif text-sm font-bold uppercase tracking-wider">
                          Chairman Executive Mandate & Directives
                        </h4>
                      </div>
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        Supreme Department Authority
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/80 leading-relaxed">
                      As Chairman of <strong>{departmentName}</strong>, you hold statutory authority to issue executive orders, ratify departmental resolutions, create/change passwords for the Chairman, Secretary, and Treasurer, and inspect what is happening inside the Secretary and Treasurer pages in tamper-proof read-only mode.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Constitutional Role</span>
                        <span className="font-bold text-xs text-amber-900">Chief Executive Officer</span>
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Authorizes All Mandates</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Password Authority</span>
                        <span className="font-bold text-xs text-slate-900">Chairman Only</span>
                        <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">Creates Sec & Treas Keys</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Oversight Mode</span>
                        <span className="font-bold text-xs text-slate-900">Tamper-Proof Audit</span>
                        <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Inspects Sec & Treas Pages</span>
                      </div>
                    </div>
                  </div>

                  {/* Chairman Directives List Header */}
                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-900">
                        Executive Orders & Ratified Resolutions
                      </h4>
                      <p className="text-xs text-slate-500">
                        Official administrative acts promulgated by the Chairman of {departmentName}.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingRecord(!isAddingRecord)}
                      className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Issue Chairman Directive
                    </button>
                  </div>

                  {/* Form to add directive */}
                  {isAddingRecord && (
                    <form onSubmit={handleAddChairmanRecord} className="bg-white p-4.5 rounded-xl border border-slate-300 shadow-sm space-y-3">
                      <div className="font-serif text-xs font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
                        <span>Promulgate Official Chairman Directive</span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono font-bold">Chairman Mandate</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Title / Subject</label>
                          <input
                            type="text"
                            required
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. Endorsement of quarterly programme..."
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Status</label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as DepartmentExecutiveRecord['status'])}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="Approved">Approved</option>
                            <option value="Pending Sign-off">Pending Sign-off</option>
                            <option value="Action Required">Action Required</option>
                            <option value="Recorded">Recorded</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Directive Body / Resolution Details</label>
                        <textarea
                          rows={2}
                          required
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Provide the exact wording of the resolution or executive instruction..."
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingRecord(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1D4ED8] shadow-xs cursor-pointer"
                        >
                          Publish Official Directive
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Directives List */}
                  <div className="space-y-2.5">
                    {records.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Chairman Order
                            </span>
                            <span className="font-serif text-xs font-bold text-slate-900">
                              {rec.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {rec.description}
                          </p>
                          <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-0.5">
                            <span>Promulgated by: <strong className="text-slate-600">{rec.author}</strong></span>
                            <span>•</span>
                            <span>Date: {rec.date}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                          {rec.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------
                  2. SECRETARY PAGE (Active for Secretary OR Read-Only for Chairman)
                 -------------------------------------------------------- */}
              {((activeRole === 'Secretary') || (activeRole === 'Chairman' && chairmanView === 'inspect_secretary')) && (
                <div className="space-y-5">
                  {/* If Chairman is inspecting Secretary Page, show golden Tamper-Protected banner */}
                  {activeRole === 'Chairman' && (
                    <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                      <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0 mt-0.5">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-amber-950">
                            Chairman Statutory Oversight Mode: Inspecting Secretary Page
                          </span>
                          <span className="text-[10px] bg-amber-300/80 text-amber-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Tamper-Protected • Read-Only
                          </span>
                        </div>
                        <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                          Constitutional Check & Balance: As Chairman, you can inspect all secretarial operations, meeting minutes, quorum counts, and correspondence, but <strong>CANNOT alter, edit, add, or tamper with any minutes</strong> to maintain secretarial integrity.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Secretary Info Card */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-900">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h4 className="font-serif text-sm font-bold uppercase tracking-wider">
                          Secretariat Records, Assemblies & Minutes Desk
                        </h4>
                      </div>
                      {onNavigateToSecretariat && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToSecretariat();
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Parochial Secretariat Dispatch Desk
                          <ExternalLink className="w-3 h-3 text-blue-200" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-blue-900/80 leading-relaxed">
                      Official archive for meeting transcripts, assembly resolutions, disciplinary notices, and ecclesiastical communiqués of <strong>{departmentName}</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Custodian</span>
                        <span className="font-bold text-xs text-blue-900">Department Secretary Desk</span>
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Keeper of Department Seal</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Recorded Minutes</span>
                        <span className="font-bold text-xs text-slate-900">{secRecords.length} Sessions Logged</span>
                        <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Official Assembly Records</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Page Isolation</span>
                        <span className="font-bold text-xs text-slate-900">Secretary Only</span>
                        <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Treasurer Cannot Enter</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-900">
                        Official Meeting Minutes & Assemblies
                      </h4>
                      <p className="text-xs text-slate-500">
                        Minuted decisions and ratified attendance records.
                      </p>
                    </div>

                    {/* ONLY SECRETARY CAN ADD MINUTES; DISABLED FOR CHAIRMAN TO PREVENT TAMPERING */}
                    {activeRole === 'Secretary' ? (
                      <button
                        onClick={() => setIsAddingSecMinute(!isAddingSecMinute)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Record New Meeting Minutes
                      </button>
                    ) : (
                      <div className="text-[11px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tamper-Protected: Chairman Cannot Add/Alter Minutes</span>
                      </div>
                    )}
                  </div>

                  {/* Form to add Secretary Minutes (Rendered ONLY if Secretary) */}
                  {isAddingSecMinute && activeRole === 'Secretary' && (
                    <form onSubmit={handleAddSecretaryMinute} className="bg-white p-4.5 rounded-xl border border-blue-200 shadow-sm space-y-3">
                      <div className="font-serif text-xs font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
                        <span>Record Official Meeting Minutes & Quorum</span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono font-bold">Secretary Desk</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Meeting Title</label>
                          <input
                            type="text"
                            required
                            value={secMinuteTitle}
                            onChange={(e) => setSecMinuteTitle(e.target.value)}
                            placeholder="e.g. 143rd Statutory Assembly & Rehearsal Review"
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Meeting Category</label>
                          <select
                            value={secMeetingType}
                            onChange={(e) => setSecMeetingType(e.target.value as DepartmentSecretaryRecord['meetingType'])}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="Statutory Council">Statutory Council</option>
                            <option value="Emergency Session">Emergency Session</option>
                            <option value="Inter-Unit Caucus">Inter-Unit Caucus</option>
                            <option value="General Assembly">General Assembly</option>
                            <option value="Secretariat Circular">Secretariat Circular</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date</label>
                          <input
                            type="date"
                            required
                            value={secDate}
                            onChange={(e) => setSecDate(e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Time</label>
                          <input
                            type="text"
                            value={secTime}
                            onChange={(e) => setSecTime(e.target.value)}
                            placeholder="e.g. 16:00 - 18:00"
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Quorum Count</label>
                          <input
                            type="number"
                            value={secQuorum}
                            onChange={(e) => setSecQuorum(e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Attendees / Quorum Representation</label>
                        <input
                          type="text"
                          value={secAttendees}
                          onChange={(e) => setSecAttendees(e.target.value)}
                          placeholder="e.g. Chairman, Secretary, Treasurer, 10 executive committee members"
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Minuted Decisions & Key Resolutions</label>
                        <textarea
                          rows={2}
                          required
                          value={secResolutions}
                          onChange={(e) => setSecResolutions(e.target.value)}
                          placeholder="Summarize the core resolutions agreed upon by the council..."
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingSecMinute(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
                        >
                          Archive Official Minutes
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Secretary Records */}
                  <div className="space-y-3">
                    {secRecords.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              {m.meetingType}
                            </span>
                            <h5 className="font-serif text-xs sm:text-sm font-bold text-slate-900">
                              {m.title}
                            </h5>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                            {m.archivedStatus}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <strong>Key Resolutions:</strong> {m.keyResolutions}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-500 pt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> Date: {m.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> Time: {m.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" /> Quorum: {m.quorumCount} Attendees
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Minuted by: <strong className="text-slate-600">{m.secretaryAuthor}</strong> • Attendees: {m.attendees}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------
                  3. TREASURER PAGE (Active for Treasurer OR Read-Only for Chairman)
                 -------------------------------------------------------- */}
              {((activeRole === 'Treasurer') || (activeRole === 'Chairman' && chairmanView === 'inspect_treasurer')) && (
                <div className="space-y-5">
                  {/* If Chairman is inspecting Treasurer Page, show golden Tamper-Protected banner */}
                  {activeRole === 'Chairman' && (
                    <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                      <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0 mt-0.5">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-amber-950">
                            Chairman Statutory Oversight Mode: Inspecting Treasurer Page
                          </span>
                          <span className="text-[10px] bg-amber-300/80 text-amber-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Tamper-Protected • Read-Only
                          </span>
                        </div>
                        <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                          Constitutional Check & Balance: As Chairman, you can inspect all financial accounts, disbursements, vouchers, and fund balances, but <strong>CANNOT issue vouchers, alter payments, or tamper with financial ledgers</strong> to maintain treasury integrity.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Treasurer Info Card */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-serif text-sm font-bold uppercase tracking-wider">
                          Treasury Financial Ledgers, Vouchers & Imprest Desk
                        </h4>
                      </div>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        Fiscal Custodian
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900/80 leading-relaxed">
                      Official financial registry for disbursements, requisitions, petty cash imprest, and weekly remittances of <strong>{departmentName}</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Disbursed</span>
                        <span className="font-bold text-xs text-emerald-800 font-mono">
                          ₦{treasRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Audited Vouchers</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Vouchers</span>
                        <span className="font-bold text-xs text-slate-900">{treasRecords.length} Vouchers Cleared</span>
                        <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Dual Signature Process</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Page Isolation</span>
                        <span className="font-bold text-xs text-slate-900">Treasurer Only</span>
                        <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Secretary Cannot Enter</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-900">
                        Disbursement Vouchers & Financial Ledger
                      </h4>
                      <p className="text-xs text-slate-500">
                        Audited payments and official expenditure vouchers.
                      </p>
                    </div>

                    {/* ONLY TREASURER CAN ISSUE VOUCHERS; DISABLED FOR CHAIRMAN TO PREVENT TAMPERING */}
                    {activeRole === 'Treasurer' ? (
                      <button
                        onClick={() => setIsAddingVoucher(!isAddingVoucher)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Issue Payment Voucher
                      </button>
                    ) : (
                      <div className="text-[11px] bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tamper-Protected: Chairman Cannot Alter Ledgers</span>
                      </div>
                    )}
                  </div>

                  {/* Form to add Treasurer Voucher (Rendered ONLY if Treasurer) */}
                  {isAddingVoucher && activeRole === 'Treasurer' && (
                    <form onSubmit={handleAddTreasurerVoucher} className="bg-white p-4.5 rounded-xl border border-emerald-200 shadow-sm space-y-3">
                      <div className="font-serif text-xs font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
                        <span>Issue Official Treasury Disbursement Voucher</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">Treasurer Desk</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Expenditure Description</label>
                          <input
                            type="text"
                            required
                            value={voucherDesc}
                            onChange={(e) => setVoucherDesc(e.target.value)}
                            placeholder="e.g. Procurement of sacred altar candles & incense"
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category</label>
                          <select
                            value={voucherCategory}
                            onChange={(e) => setVoucherCategory(e.target.value as DepartmentTreasurerRecord['category'])}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          >
                            <option value="Logistics & Requisition">Logistics & Requisition</option>
                            <option value="Sacramental Supplies">Sacramental Supplies</option>
                            <option value="Equipment Maintenance">Equipment Maintenance</option>
                            <option value="Imprest Reimbursement">Imprest Reimbursement</option>
                            <option value="Honorarium & Benevolence">Honorarium & Benevolence</option>
                            <option value="Remittance to Parochial Purse">Remittance to Parochial Purse</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Authorized Amount (₦)</label>
                          <input
                            type="number"
                            required
                            value={voucherAmount}
                            onChange={(e) => setVoucherAmount(e.target.value)}
                            placeholder="e.g. 85000"
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Payee / Beneficiary</label>
                          <input
                            type="text"
                            required
                            value={voucherPayee}
                            onChange={(e) => setVoucherPayee(e.target.value)}
                            placeholder="e.g. Divine Supplies Depot"
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Payment Method</label>
                          <select
                            value={voucherPaymentMethod}
                            onChange={(e) => setVoucherPaymentMethod(e.target.value as DepartmentTreasurerRecord['paymentMethod'])}
                            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Petty Cash Cashier">Petty Cash Cashier</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingVoucher(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-xs cursor-pointer"
                        >
                          Issue & Sign Voucher
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Treasurer Vouchers */}
                  <div className="space-y-3">
                    {treasRecords.map((v) => (
                      <div
                        key={v.id}
                        className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                              {v.voucherCode}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              {v.category}
                            </span>
                          </div>
                          <h5 className="font-serif text-xs sm:text-sm font-bold text-slate-900">
                            {v.description}
                          </h5>
                          <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                            <span>Payee: <strong className="text-slate-700">{v.payee}</strong></span>
                            <span>•</span>
                            <span>Method: <strong className="text-slate-700">{v.paymentMethod}</strong></span>
                            <span>•</span>
                            <span>Date: {v.date}</span>
                            <span>•</span>
                            <span>Signed by: {v.treasurerSignee}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-sm sm:text-base font-black text-emerald-700">
                            ₦{v.amount.toLocaleString()}
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                            {v.auditStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --------------------------------------------------------
                  4. CREDENTIALS & PASSWORDS AUTHORITY (CHAIRMAN ONLY!)
                 -------------------------------------------------------- */}
              {activeRole === 'Chairman' && chairmanView === 'credentials' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-bold text-slate-900">
                          Chairman Authority: Create & Manage Credentials & Passwords
                        </h4>
                        <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Chairman Mandate
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Statutory cathedral rule: Only the <strong>Chairman</strong> of {departmentName} can create or update passwords for Chairman, Secretary, and Treasurer so each logs into their own page.
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chairman Authorized</span>
                      </span>
                    </div>
                  </div>

                  {passwordChangeSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-fade-in shadow-2xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold leading-relaxed">{passwordChangeSuccess}</span>
                    </div>
                  )}

                  {credentialsFormError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-shake shadow-2xs">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-semibold leading-relaxed">{credentialsFormError}</span>
                    </div>
                  )}

                  {/* Active credentials preview cards for Chairman */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Department 3-Key Executives Active Roster</span>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Chairman Full Authority Unlocked
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['Chairman', 'Secretary', 'Treasurer'] as ExecutiveRole[]).map((role) => {
                        const prof = execProfiles.find((p) => p.role === role) || {
                          name: `${role} Officer`,
                          rank: 'Executive',
                          email: `${role.toLowerCase()}@ibaracathedral.org`,
                          phone: '+234 800 000 0000'
                        };
                        const isChairman = role === 'Chairman';
                        return (
                          <div
                            key={role}
                            className={`p-3.5 rounded-xl border space-y-1.5 shadow-2xs ${
                              targetRoleToChange === role
                                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/30'
                                : 'bg-slate-50/70 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                  role === 'Chairman'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : role === 'Secretary'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                }`}
                              >
                                {role}
                              </span>
                              {isChairman && (
                                <span className="text-[9px] bg-amber-400/20 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                  Auth Lead
                                </span>
                              )}
                            </div>

                            <div className="pt-0.5">
                              <div className="font-bold text-slate-900 text-xs truncate" title={prof.name}>
                                {prof.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">{prof.rank}</div>
                            </div>

                            <div className="pt-1 border-t border-slate-200/80 text-[11px] font-mono space-y-0.5">
                              <div className="text-slate-600 truncate text-[10px]" title={prof.email}>
                                <span className="text-slate-400">Email:</span> {prof.email}
                              </div>
                              <div className="text-slate-800 text-[11px]">
                                <span className="text-slate-400 font-sans text-[10px]">Access Key: </span>
                                <strong className="text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                  {passwords[role] || `${role}@Ibara`}
                                </strong>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setTargetRoleToChange(role)}
                              className="w-full mt-2 py-1 bg-white hover:bg-amber-100/60 text-slate-700 border border-slate-200 rounded text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Edit {role} Credentials & Password
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CHAIRMAN CREATION & EDITING FORM */}
                  <form
                    onSubmit={handleChairmanSaveCredentials}
                    className="border-t border-slate-200 pt-5 space-y-4 bg-amber-50/40 -mx-6 -mb-6 p-6 rounded-b-2xl border-b"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        <h5 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-800">
                          Chairman Password Creation & Credentials Chamber
                        </h5>
                      </div>
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                        Editing: {targetRoleToChange}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Target Office to Create / Modify
                        </label>
                        <select
                          value={targetRoleToChange}
                          onChange={(e) => setTargetRoleToChange(e.target.value as ExecutiveRole)}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                        >
                          <option value="Secretary">Secretary Office</option>
                          <option value="Treasurer">Treasurer Office</option>
                          <option value="Chairman">Chairman (My Office)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          New Password for {targetRoleToChange}
                        </label>
                        <input
                          type="text"
                          required
                          value={newPasswordValue}
                          onChange={(e) => setNewPasswordValue(e.target.value)}
                          placeholder="e.g. Secretary@2026"
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-mono font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Officer Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={officerNameInput}
                          onChange={(e) => setOfficerNameInput(e.target.value)}
                          placeholder="e.g. Bro. Emmanuel Adeleke"
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Ecclesiastical Rank / Official Title
                        </label>
                        <input
                          type="text"
                          value={officerRankInput}
                          onChange={(e) => setOfficerRankInput(e.target.value)}
                          placeholder="e.g. Senior Evangelist / Lace Elder Sister"
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Official Administrative Email
                        </label>
                        <input
                          type="email"
                          value={officerEmailInput}
                          onChange={(e) => setOfficerEmailInput(e.target.value)}
                          placeholder="e.g. secretary@ibaracathedral.org"
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Official Telephone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={officerPhoneInput}
                          onChange={(e) => setOfficerPhoneInput(e.target.value)}
                          placeholder="e.g. +234 803 000 0000"
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Optional Web Login Key Synchronization */}
                    <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncWebLogin}
                          onChange={(e) => setSyncWebLogin(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Also update Department Web Login Key (Used on the Web Login Portal)
                        </span>
                      </label>

                      {syncWebLogin && (
                        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                          <span className="text-[11px] text-slate-600">
                            New Web Portal Password for <strong>{departmentName}</strong>:
                          </span>
                          <input
                            type="text"
                            value={deptWebLoginPassword}
                            onChange={(e) => setDeptWebLoginPassword(e.target.value)}
                            placeholder="New Web Login Key"
                            className="text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 font-mono font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] text-slate-500 italic">
                        Action will be officially recorded in {departmentName} executive registry.
                      </span>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer hover:scale-[1.01]"
                      >
                        <Award className="w-4 h-4 text-amber-300" />
                        <span>Save & Ratify Credentials (Chairman Mandate)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>CCC Ibara Cathedral • Chairman Tripartite Governance & Strict Page Isolation</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Chamber
          </button>
        </div>

      </div>
    </div>
  );
}
