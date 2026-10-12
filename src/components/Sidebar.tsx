import React, { useState } from 'react';
import {
  Church,
  Shield,
  Users,
  Music,
  Sparkles,
  Landmark,
  HelpCircle,
  LogOut,
  X,
  Video,
  Flame,
  HeartPulse,
  BookOpen,
  Send,
  LayoutDashboard,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { Department, DepartmentAuthSession } from '../types';

interface SidebarProps {
  currentTab: Department;
  onTabChange: (tab: Department) => void;
  isOpen: boolean;
  onClose: () => void;
  onSignOut?: () => void;
  session?: DepartmentAuthSession | null;
}

export default function Sidebar({ currentTab, onTabChange, isOpen, onClose, onSignOut, session }: SidebarProps) {
  const [restrictionNotice, setRestrictionNotice] = useState<string | null>(null);

  const isChurchSecretary = session?.department === 'main_dashboard';
  const userDept = session?.department;

  const allDepartmentItems = [
    { id: 'parochial' as Department, label: 'Parish Council Executive', icon: Landmark },
    { id: 'shepherd' as Department, label: 'Shepherd & Church Workers', icon: Church },
    { id: 'evangelist' as Department, label: 'Council of Honorary Evangelists', icon: Flame },
    { id: 'prophets' as Department, label: 'Council of Prophet & Prophetess', icon: Sparkles },
    { id: 'side_men_women' as Department, label: 'Council of Sidesmen & Sideswomen', icon: Users },
    { id: 'choir' as Department, label: 'The Model Choir', icon: Music },
    { id: 'youth' as Department, label: 'Youth Council', icon: Users },
    { id: 'security' as Department, label: 'Security Enforcement Team', icon: Shield },
    { id: 'media' as Department, label: 'Media Team', icon: Video },
    { id: 'medical' as Department, label: 'Medical Team', icon: HeartPulse },
    { id: 'bible_fellowship' as Department, label: 'MC & Women Bible Fellowship', icon: BookOpen }
  ];

  const handleDepartmentClick = (deptId: Department) => {
    if (isChurchSecretary) {
      onTabChange(deptId);
      onClose();
      return;
    }

    // If logged in as a specific department, they can ONLY access their own department!
    if (deptId === userDept) {
      onTabChange(deptId);
      onClose();
    } else {
      setRestrictionNotice(
        `Access Restricted: Only Cathedral Church Secretary is authorized to monitor other departments. Your access is restricted to ${session?.shortName || 'your department'}.`
      );
      setTimeout(() => setRestrictionNotice(null), 4500);
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-celestial-gray-800/40 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-[#1E3A8A] text-[#DBEAFE] border-r border-[#3B82F6]/30 w-64 p-5 flex flex-col gap-2 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6 px-1 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-amber-400 shadow-md p-0.5">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background blue sky circle */}
                <circle cx="50" cy="50" r="45" fill="#2563EB" />
                {/* Rainbow/Arc representation */}
                <path d="M15,50 A35,35 0 0,1 85,50" fill="none" stroke="#EF4444" strokeWidth="4" />
                <path d="M20,50 A30,30 0 0,1 80,50" fill="none" stroke="#FBBF24" strokeWidth="3" />
                <path d="M25,50 A25,25 0 0,1 75,50" fill="none" stroke="#10B981" strokeWidth="2" />
                {/* Eye of God at the top center */}
                <path d="M40,32 Q50,22 60,32 Q50,42 40,32 Z" fill="white" />
                <circle cx="50" cy="32" r="3" fill="#1E3A8A" />
                {/* The Golden Cross */}
                <rect x="47" y="42" width="6" height="38" rx="1" fill="#FDE047" />
                <rect x="37" y="50" width="26" height="6" rx="1" fill="#FDE047" />
                {/* Seven Stars representing the church */}
                <circle cx="22" cy="40" r="2.5" fill="white" />
                <circle cx="31" cy="29" r="2.5" fill="white" />
                <circle cx="42" cy="22" r="2.5" fill="white" />
                <circle cx="50" cy="18" r="2.5" fill="white" />
                <circle cx="58" cy="22" r="2.5" fill="white" />
                <circle cx="69" cy="29" r="2.5" fill="white" />
                <circle cx="78" cy="40" r="2.5" fill="white" />
                {/* Crescent Moon */}
                <path d="M72,68 A10,10 0 1,1 62,56 A12,12 0 1,0 72,68 Z" fill="#FEF08A" />
                {/* Open Holy Bible at the bottom */}
                <path d="M35,76 C40,73 48,73 50,76 C52,73 60,73 65,76 L65,82 C60,79 52,79 50,82 C48,79 40,79 35,82 Z" fill="white" stroke="#1E3A8A" strokeWidth="1" />
                <line x1="50" y1="76" x2="50" y2="82" stroke="#1E3A8A" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-sans text-[10px] font-black text-white tracking-tight uppercase leading-tight break-words">
                CELESTIAL CHURCH OF CHRIST,<br />IBARA CATHEDRAL,<br />ABEOKUTA OGUN STATE
              </h1>
              <p className="font-sans text-[8px] text-amber-300 font-bold uppercase tracking-wider leading-tight mt-1">
                PARISH MANAGEMENT
              </p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-[#DBEAFE]/80 hover:bg-[#3B82F6] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Restriction Alert Toast inside sidebar */}
        {restrictionNotice && (
          <div className="bg-amber-400 text-[#1E3A8A] p-2.5 rounded-xl text-[11px] font-bold mb-2 flex items-start gap-1.5 shadow-md animate-shake">
            <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
            <span className="leading-snug">{restrictionNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
          {isChurchSecretary ? (
            /* CHURCH SECRETARY FULL MONITORING VIEW */
            <>
              <div className="text-[#DBEAFE] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 opacity-70 flex items-center justify-between">
                <span>Supreme Monitoring Hub</span>
                <span className="text-[9px] bg-emerald-400 text-[#1E3A8A] px-1.5 py-0.2 rounded font-bold">Monitor</span>
              </div>

              {/* Main Dashboard Button */}
              <button
                onClick={() => {
                  onTabChange('main_dashboard');
                  onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-sans text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 text-left cursor-pointer ${
                  currentTab === 'main_dashboard'
                    ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                    : 'text-[#DBEAFE]/80 hover:bg-[#3B82F6] hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-300" />
                <span className="truncate">Parish Central Dashboard</span>
                <span className="ml-auto text-[9px] bg-amber-400 text-[#1E3A8A] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  11 Units
                </span>
              </button>

              {/* Secretariat Dispatch Desk */}
              <button
                onClick={() => {
                  onTabChange('secretariat_dispatch');
                  onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-sans text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 text-left cursor-pointer ${
                  currentTab === 'secretariat_dispatch'
                    ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                    : 'bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 font-semibold border border-amber-400/30'
                }`}
              >
                <Send className="w-4 h-4 shrink-0 text-amber-300" />
                <span className="truncate">Secretariat Dispatch Desk</span>
                <span className="ml-auto text-[9px] bg-amber-400 text-[#1E3A8A] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Dispatch
                </span>
              </button>

              <div className="text-[#DBEAFE] text-[10px] font-bold uppercase tracking-widest px-3 pt-3 pb-1 opacity-70">
                All 11 Departmental Boards
              </div>

              {allDepartmentItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleDepartmentClick(item.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-sans text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#2563EB] text-white font-semibold shadow-sm'
                        : 'text-[#DBEAFE]/80 hover:bg-[#3B82F6] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#DBEAFE]/60'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </>
          ) : (
            /* DEPARTMENT SCOPED VIEW - STRICT ISOLATION */
            <>
              <div className="text-[#DBEAFE] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 opacity-70 flex items-center justify-between">
                <span>Authorized Department</span>
                <span className="text-[9px] bg-emerald-400 text-[#1E3A8A] px-1.5 py-0.2 rounded font-bold">Active</span>
              </div>

              {/* Only their own department is clickable and active */}
              {(() => {
                const myDeptItem = allDepartmentItems.find((d) => d.id === userDept) || allDepartmentItems[0];
                const MyIcon = myDeptItem.icon;
                return (
                  <button
                    onClick={() => handleDepartmentClick(myDeptItem.id)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-bold bg-[#2563EB] text-white shadow-md text-left cursor-pointer border border-blue-400/50"
                  >
                    <MyIcon className="w-4 h-4 shrink-0 text-amber-300" />
                    <span className="truncate">{myDeptItem.label}</span>
                    <span className="ml-auto text-[9px] bg-amber-400 text-[#1E3A8A] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      My Unit
                    </span>
                  </button>
                );
              })()}

              {/* Secretariat Directives receiving line */}
              <button
                onClick={() => {
                  onTabChange('secretariat_dispatch');
                  onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg font-sans text-xs font-medium transition-all mt-1 cursor-pointer ${
                  currentTab === 'secretariat_dispatch'
                    ? 'bg-amber-400/30 text-amber-100 font-bold border border-amber-300/40'
                    : 'text-[#DBEAFE]/70 hover:bg-[#3B82F6]/50 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                <span className="truncate">Secretariat Directives</span>
              </button>

              {/* Locked Other 10 Departments Section */}
              <div className="pt-3 border-t border-[#3B82F6]/30 mt-2">
                <div className="text-[#DBEAFE]/60 text-[10px] font-bold uppercase tracking-wider px-3 pb-1.5 flex items-center justify-between">
                  <span>Other 10 Departments</span>
                  <span className="text-[9px] bg-white/10 text-slate-300 px-1 rounded">Locked</span>
                </div>
                <div className="text-[9px] text-amber-300/80 px-3 pb-2 leading-relaxed">
                  Monitored exclusively by Church Secretary
                </div>

                <div className="space-y-0.5 opacity-60">
                  {allDepartmentItems
                    .filter((item) => item.id !== userDept)
                    .map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleDepartmentClick(item.id)}
                          className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-left text-xs text-[#DBEAFE]/50 hover:text-white hover:bg-white/5 transition-colors cursor-not-allowed group"
                          title="Restricted: Monitored exclusively by Church Secretary"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon className="w-3.5 h-3.5 shrink-0 text-[#DBEAFE]/40" />
                            <span className="truncate text-[11px]">{item.label}</span>
                          </div>
                          <Lock className="w-3 h-3 text-amber-300/70 shrink-0 group-hover:scale-110" />
                        </button>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto border-t border-[#3B82F6]/30 pt-3 flex flex-col gap-1.5">
          {/* Active Logged-in Department Banner */}
          <div className="bg-[#3B82F6]/25 p-3 rounded-xl border border-[#3B82F6]/40">
            <div className="flex items-center justify-between text-[#DBEAFE] text-[9px] font-bold uppercase tracking-wider mb-1 opacity-90">
              <span>Active Department</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-white text-xs font-bold truncate">
              {session?.departmentName || 'Cathedral Central Portal'}
            </div>
            <div className="text-[#DBEAFE]/80 text-[10px] truncate mt-0.5">
              {session?.officerRole ? `${session.officerRole}` : 'Administrative Officer'}
            </div>
            {session?.officerName && (
              <div className="text-amber-300 text-[10px] font-semibold truncate">
                {session.officerName}
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              if (onSignOut) {
                onSignOut();
              }
            }}
            className="flex items-center justify-between px-3 py-2 text-rose-200 hover:bg-rose-900/30 hover:text-white rounded-lg text-xs font-bold transition-all border border-rose-500/20 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-300" />
              <span>Log Out {session?.shortName ? `(${session.shortName})` : ''}</span>
            </div>
            <span className="text-[9px] bg-rose-500/30 text-rose-100 px-1.5 py-0.5 rounded font-mono">
              Exit
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
