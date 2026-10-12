import React, { useState } from 'react';
import { Menu, Bell, Settings, Search, LogOut, CheckCircle, Shield, ChevronDown } from 'lucide-react';
import { Department, DepartmentAuthSession } from '../types';

interface HeaderProps {
  currentTab: Department;
  onMenuToggle: () => void;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  session?: DepartmentAuthSession | null;
  onSignOut?: () => void;
}

export default function Header({
  currentTab,
  onMenuToggle,
  searchPlaceholder = "Search records...",
  onSearchChange,
  session,
  onSignOut
}: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Map current tab key to label & title
  const getTabDetails = (tab: Department) => {
    switch (tab) {
      case 'main_dashboard':
        return { crumb: 'Parish Central Dashboard', title: '11 Departments Monitoring Hub' };
      case 'parochial':
        return { crumb: 'Parish Council Executive', title: 'Governance & Parochial Trustees' };
      case 'secretariat_dispatch':
        return { crumb: 'Secretariat Dispatch Desk', title: 'Information Dissemination Platform' };
      case 'shepherd':
        return { crumb: 'Shepherd & Church Workers', title: 'Pastoral & Sacramental Oversight' };
      case 'evangelist':
        return { crumb: 'Council of Honorary Evangelists', title: 'Evangelism & Missions Board' };
      case 'prophets':
        return { crumb: 'Council of Prophet & Prophetess', title: 'Spiritual Duty & Prophetic Chamber' };
      case 'side_men_women':
        return { crumb: 'Council of Sidesmen & Sideswomen', title: 'Sanctuary Protocol & Ushering' };
      case 'choir':
        return { crumb: 'The Model Choir', title: 'Liturgical Choral Ministry' };
      case 'youth':
        return { crumb: 'Youth Council', title: 'Next-Gen Leadership & Ministry' };
      case 'security':
        return { crumb: 'Security Enforcement Team', title: 'Perimeter Defense & Vigilance' };
      case 'media':
        return { crumb: 'Media Team', title: 'Broadcast & Communications' };
      case 'medical':
        return { crumb: 'Medical Team', title: 'First Aid Post & Clinic Response' };
      case 'bible_fellowship':
        return { crumb: 'MC & Women Bible Fellowship', title: 'Family & Discipleship Fellowship' };
      default:
        return { crumb: 'Home', title: 'Ibara Cathedral Parish' };
    }
  };

  const { crumb, title } = getTabDetails(currentTab);

  // Compute initials
  const getInitials = (name?: string, deptName?: string) => {
    if (name) {
      const parts = name.split(' ').filter(p => !p.startsWith('(') && !p.startsWith('Bro') && !p.startsWith('Sis') && !p.startsWith('Dr.') && !p.startsWith('Ven.') && !p.startsWith('Most') && !p.startsWith('Superior'));
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    }
    if (deptName) {
      return deptName.slice(0, 2).toUpperCase();
    }
    return 'CS';
  };

  const initials = getInitials(session?.officerName, session?.shortName);

  return (
    <header className="bg-white sticky top-0 z-30 px-4 sm:px-6 py-3 w-full flex justify-between items-center border-b border-[#E2E8F0] shadow-xs">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger menu toggle */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-[#1E3A8A] p-2 -ml-2 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center text-[#64748B] font-sans text-[11px] mb-0.5 font-medium truncate">
            <ol className="inline-flex items-center space-x-1.5 truncate">
              <li className="inline-flex items-center">
                <span className="text-[#64748B]">CCC Ibara</span>
              </li>
              <li className="text-[10px] text-[#CBD5E1]">/</li>
              <li className="truncate">
                <span className="text-[#1E3A8A] font-bold truncate">{crumb}</span>
              </li>
            </ol>
          </nav>

          {/* Page Headline */}
          <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#1E3A8A] leading-tight truncate">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Bar - Hidden on small mobile devices */}
        {onSearchChange && (
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] w-3.5 h-3.5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full font-sans text-xs focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] w-52 transition-all text-[#1E293B] placeholder-[#64748B]"
            />
          </div>
        )}

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setSettingsOpen(false);
            }}
            className="p-2 text-[#64748B] hover:text-[#1E3A8A] hover:bg-[#F8FAFC] rounded-xl transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Cathedral Live Notices</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">Live</span>
              </div>
              <div className="py-2.5 space-y-2 text-slate-600">
                <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-100">
                  <div className="font-bold text-blue-900 text-[11px]">11 Departments Connected</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">All departmental dashboards are feeding live reports to the Church Secretary console.</div>
                </div>
                <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-100">
                  <div className="font-bold text-amber-900 text-[11px]">2026 Harvest Preparations</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Please ensure weekly feedback is submitted ahead of Friday executive meeting.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logged-In Department & Officer Profile Badge */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-[#3B82F6]/40 bg-[#DBEAFE] shrink-0 flex items-center justify-center font-bold text-[#1E3A8A] font-sans text-xs shadow-xs">
            {initials}
          </div>

          <div className="hidden sm:flex flex-col text-left max-w-[150px] md:max-w-[190px]">
            <span className="font-sans text-xs font-bold text-[#1E293B] truncate" title={session?.shortName || 'Church Secretary'}>
              {session?.shortName || 'Church Secretary'}
            </span>
            <span className="font-sans text-[10px] text-[#64748B] truncate leading-tight" title={session?.officerName || 'Parish Secretariat'}>
              {session?.officerName || 'Evang. Olusegun Faleti'}
            </span>
          </div>

          {/* Quick Logout Button */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="ml-1 sm:ml-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all border border-rose-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Log Out of this Department session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Log Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
