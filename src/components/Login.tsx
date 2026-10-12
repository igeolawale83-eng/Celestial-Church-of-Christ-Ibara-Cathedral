import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Landmark,
  Church,
  Flame,
  Users,
  Music,
  Video,
  HeartPulse,
  BookOpen,
  CheckCircle2,
  Search,
  KeyRound,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Department, DepartmentAuthAccount, DepartmentAuthSession } from '../types';
import { departmentAuthAccounts, getActiveDepartmentAuthAccounts } from '../data';

interface LoginProps {
  onLoginSuccess: (session: DepartmentAuthSession) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const currentAccounts = getActiveDepartmentAuthAccounts();
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ACC-SEC');
  const defaultAccount = currentAccounts.find(a => a.id === 'ACC-SEC') || currentAccounts[0];
  
  const [email, setEmail] = useState(defaultAccount.email);
  const [password, setPassword] = useState(defaultAccount.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'quick' | 'manual'>('quick');
  const [searchFilter, setSearchFilter] = useState('');
  const [showCredentialsRoster, setShowCredentialsRoster] = useState(false);

  // Department Icon Mapper
  const getDeptIcon = (dept: Department) => {
    switch (dept) {
      case 'main_dashboard':
        return Church;
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

  // Select account helper
  const handleSelectAccount = (account: DepartmentAuthAccount, autoLogin = false) => {
    setSelectedDeptId(account.id);
    setEmail(account.email);
    setPassword(account.password);
    setError(null);

    if (autoLogin) {
      performLogin(account);
    }
  };

  const performLogin = (account: DepartmentAuthAccount) => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const session: DepartmentAuthSession = {
        department: account.department,
        departmentName: account.departmentName,
        shortName: account.shortName,
        email: account.email,
        officerName: account.officerName,
        officerRole: account.officerRole,
        badgeCategory: account.badgeCategory,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onLoginSuccess(session);
    }, 550);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and access password.');
      return;
    }

    const matchedAccount = currentAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedAccount) {
      setError('Email not registered as a cathedral department. Please select from the verified 11 department credentials below.');
      return;
    }

    if (matchedAccount.password !== password) {
      setError(`Incorrect access key for ${matchedAccount.departmentName}. The official password set by the Chairman is: "${matchedAccount.password}".`);
      return;
    }

    performLogin(matchedAccount);
  };

  const activeAccount = currentAccounts.find((a) => a.id === selectedDeptId) || defaultAccount;
  const ActiveIcon = getDeptIcon(activeAccount.department);

  const filteredAccounts = currentAccounts.filter(acc => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      acc.departmentName.toLowerCase().includes(query) ||
      acc.officerName.toLowerCase().includes(query) ||
      acc.officerRole.toLowerCase().includes(query) ||
      acc.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-white to-[#FEFCE8] flex flex-col justify-center py-10 sm:px-6 lg:px-8 px-4 font-sans relative overflow-x-hidden" id="login-portal-container">
      {/* Decorative celestial background effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-blue-300/25 rounded-full blur-3xl pointer-events-none" />

      {/* Cathedral Seal & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center z-10">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-amber-400 shadow-lg p-1.5 mx-auto mb-4 transition-transform hover:scale-105 duration-300">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#2563EB" />
            <path d="M15,50 A35,35 0 0,1 85,50" fill="none" stroke="#EF4444" strokeWidth="4" />
            <path d="M20,50 A30,30 0 0,1 80,50" fill="none" stroke="#FBBF24" strokeWidth="3" />
            <path d="M25,50 A25,25 0 0,1 75,50" fill="none" stroke="#10B981" strokeWidth="2" />
            <path d="M40,32 Q50,22 60,32 Q50,42 40,32 Z" fill="white" />
            <circle cx="50" cy="32" r="3" fill="#1E3A8A" />
            <rect x="47" y="42" width="6" height="38" rx="1" fill="#FDE047" />
            <rect x="37" y="50" width="26" height="6" rx="1" fill="#FDE047" />
            <circle cx="22" cy="40" r="2.5" fill="white" />
            <circle cx="31" cy="29" r="2.5" fill="white" />
            <circle cx="42" cy="22" r="2.5" fill="white" />
            <circle cx="50" cy="18" r="2.5" fill="white" />
            <circle cx="58" cy="22" r="2.5" fill="white" />
            <circle cx="69" cy="29" r="2.5" fill="white" />
            <circle cx="78" cy="40" r="2.5" fill="white" />
            <path d="M72,68 A10,10 0 1,1 62,56 A12,12 0 1,0 72,68 Z" fill="#FEF08A" />
            <path d="M35,76 C40,73 48,73 50,76 C52,73 60,73 65,76 L65,82 C60,79 52,79 50,82 C48,79 40,79 35,82 Z" fill="white" stroke="#1E3A8A" strokeWidth="1" />
            <line x1="50" y1="76" x2="50" y2="82" stroke="#1E3A8A" strokeWidth="1" />
          </svg>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1E3A8A] tracking-tight uppercase leading-tight px-2">
          Celestial Church of Christ
        </h1>
        <p className="font-sans text-xs sm:text-sm text-amber-600 font-bold uppercase tracking-wider mt-1 px-2">
          Ibara Cathedral, Abeokuta, Ogun State
        </p>
        <p className="font-sans text-xs text-[#64748B] mt-1 font-semibold flex items-center justify-center gap-2">
          <span>11 Departments Multi-Portal Gateway</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-700">All 11 Unit Accounts Active</span>
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl z-10" id="login-form-card">
        <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-xl overflow-hidden">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setLoginMode('quick')}
              className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                loginMode === 'quick'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Select Department (1-Click)</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('manual')}
              className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                loginMode === 'manual'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Enter Credentials Manually</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-start gap-2.5 text-xs mb-5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            {loginMode === 'quick' ? (
              /* QUICK DEPARTMENT LAUNCHER VIEW */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-800">
                      Choose Your Department Portal
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select your unit to immediately launch your departmental dashboard with pre-assigned executive keys.
                    </p>
                  </div>
                  
                  {/* Search filter */}
                  <div className="relative shrink-0 sm:w-56">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Find department..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Currently Highlighted Selection Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-800/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                      <ActiveIcon className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          {activeAccount.badgeCategory}
                        </span>
                        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold">
                          {activeAccount.department === 'main_dashboard' ? 'HQ SECRETARIAT' : 'DEPT ACCOUNT'}
                        </span>
                      </div>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-white">
                        {activeAccount.departmentName}
                      </h4>
                      <p className="text-xs text-blue-200">
                        {activeAccount.officerRole}: <strong className="text-white">{activeAccount.officerName}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => performLogin(activeAccount)}
                    className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-[#1E3A8A] font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Opening Portal...</span>
                    ) : (
                      <>
                        <span>Launch {activeAccount.shortName}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* 11 Department Quick Buttons Roster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {filteredAccounts.map((account) => {
                    const Icon = getDeptIcon(account.department);
                    const isSelected = account.id === selectedDeptId;
                    const isSec = account.department === 'main_dashboard';

                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleSelectAccount(account, false)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30'
                            : isSec
                            ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400'
                            : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-xs text-slate-800 truncate">
                              {account.shortName}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>

                        <div className="text-[10px] text-slate-500 leading-tight">
                          <span className="block truncate font-medium text-slate-700">{account.officerName}</span>
                          <span className="block font-mono text-[9px] text-slate-400 mt-0.5 truncate">{account.email}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* MANUAL INPUT LOGIN FORM */
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Department Sign-In Form
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                    Target: {activeAccount.shortName}
                  </span>
                </div>

                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Department Administrative Email
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 h-4 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // live match department
                        const match = departmentAuthAccounts.find(a => a.email.toLowerCase() === e.target.value.toLowerCase());
                        if (match) {
                          setSelectedDeptId(match.id);
                        }
                      }}
                      className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                      placeholder="e.g. choir@ibaracathedral.org"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="password" className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      Department Access Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide' : 'Reveal'} Key</span>
                    </button>
                  </div>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 h-4 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 text-[11px]">
                    Expected Password: <strong className="font-mono text-blue-700">{activeAccount.password}</strong>
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SSL Secured
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating Authority...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to {activeAccount.shortName} Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Toggleable Credentials Directory Modal or Accordion */}
            <div className="mt-5 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setShowCredentialsRoster(!showCredentialsRoster)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 text-[#1E3A8A]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>View All 11 Department Login Keys & Details</span>
                </span>
                <span className="text-[10px] text-blue-600 underline">
                  {showCredentialsRoster ? 'Collapse' : 'Show All Credentials'}
                </span>
              </button>

              {showCredentialsRoster && (
                <div className="mt-3 bg-slate-50 rounded-2xl p-3 border border-slate-200 max-h-72 overflow-y-auto space-y-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-950 flex items-start gap-2 mb-2 shadow-2xs">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-950 font-bold block">
                        3-Key Executive Governance Framework:
                      </strong>
                      <p className="text-[10px] text-amber-900/90 mt-0.5 leading-relaxed">
                        Within each department dashboard, only the <strong>Chairman</strong> possesses statutory authority to create passwords for Chairman, Secretary, and Treasurer. Secretary logs into Secretary Page (cannot switch to Treasurer or Chairman). Treasurer logs into Treasurer Page (cannot switch to Secretary or Chairman). Chairman can inspect Secretary and Treasurer pages in Tamper-Proof Read-Only mode.
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-500 pb-1 border-b border-slate-200 flex items-center justify-between">
                    <span>Department Account</span>
                    <span>Email & Passcode</span>
                  </div>
                  {departmentAuthAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs hover:border-blue-300 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 truncate">{acc.departmentName}</div>
                        <div className="text-[10px] text-slate-500 truncate">{acc.officerRole} • {acc.officerName}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-[10px] text-blue-800 font-semibold">{acc.email}</div>
                        <div className="font-mono text-[10px] text-amber-700 font-bold">Key: {acc.password}</div>
                        <button
                          type="button"
                          onClick={() => {
                            handleSelectAccount(acc, true);
                          }}
                          className="mt-1 text-[9px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
                        >
                          Launch Now →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center sm:mx-auto sm:w-full sm:max-w-md z-10">
        <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest leading-relaxed">
          &copy; {new Date().getFullYear()} CCC Ibara Cathedral, Abeokuta.
          <br />
          11 Cathedral Departments Administration System • All Rights Reserved
        </p>
      </div>
    </div>
  );
}
