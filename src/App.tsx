import React, { useState } from 'react';
import { Department, DepartmentAuthSession } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import MainDashboard from './components/MainDashboard';

// Department Views
import ParochialCommittee from './components/ParochialCommittee';
import ShepherdUnit from './components/ShepherdUnit';
import EvangelistUnit from './components/EvangelistUnit';
import ProphetsProphetesses from './components/ProphetsProphetesses';
import SideMenWomen from './components/SideMenWomen';
import ChoirUnit from './components/ChoirUnit';
import YouthWing from './components/YouthWing';
import SecurityUnit from './components/SecurityUnit';
import MediaUnit from './components/MediaUnit';
import MedicalTeam from './components/MedicalTeam';
import BibleFellowship from './components/BibleFellowship';
import SecretariatDispatchPlatform from './components/SecretariatDispatchPlatform';

export default function App() {
  const [session, setSession] = useState<DepartmentAuthSession | null>(() => {
    const saved = localStorage.getItem('ccc_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    if (localStorage.getItem('ccc_auth') === 'true') {
      return {
        department: 'main_dashboard',
        departmentName: 'General Secretariat & Monitoring Hub',
        shortName: 'Church Secretariat',
        email: 'secretary@ibaracathedral.org',
        officerName: 'Evang. Olusegun Faleti',
        officerRole: 'Cathedral Parochial Secretary',
        badgeCategory: 'Parish Administration & Monitoring',
        loginTime: 'Active Session'
      };
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState<Department>(() => {
    return session?.department || 'main_dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isChurchSecretary = session?.department === 'main_dashboard';

  const navigateToSecretariat = () => {
    setCurrentTab('secretariat_dispatch');
  };

  const navigateToMainDashboard = isChurchSecretary
    ? () => {
        setCurrentTab('main_dashboard');
      }
    : undefined;

  const handleTabChange = (targetTab: Department) => {
    if (isChurchSecretary) {
      setCurrentTab(targetTab);
      return;
    }

    // For Department user: STRICT ISOLATION!
    if (targetTab === session?.department || targetTab === 'secretariat_dispatch') {
      setCurrentTab(targetTab);
    } else {
      // Keep on their own department
      setCurrentTab(session?.department || 'main_dashboard');
    }
  };

  const handleLoginSuccess = (newSession: DepartmentAuthSession) => {
    setSession(newSession);
    localStorage.setItem('ccc_auth', 'true');
    localStorage.setItem('ccc_auth_session', JSON.stringify(newSession));
    
    // Automatically navigate to that department's dashboard!
    setCurrentTab(newSession.department);
  };

  const handleSignOut = () => {
    localStorage.removeItem('ccc_auth');
    localStorage.removeItem('ccc_auth_session');
    setSession(null);
    setCurrentTab('main_dashboard');
  };

  // Render the selected department dashboard
  const renderTabContent = () => {
    // Security check: if not Church Secretary and trying to view another department or main monitoring dashboard
    const activeViewTab = (!isChurchSecretary && currentTab !== session?.department && currentTab !== 'secretariat_dispatch')
      ? (session?.department || 'main_dashboard')
      : currentTab;

    switch (activeViewTab) {
      case 'main_dashboard':
        return (
          <MainDashboard
            onOpenDepartment={(dept) => handleTabChange(dept)}
            onNavigateToSecretariat={navigateToSecretariat}
            session={session}
            onSignOut={handleSignOut}
          />
        );
      case 'parochial':
        return (
          <ParochialCommittee
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'secretariat_dispatch':
        return <SecretariatDispatchPlatform onNavigateToMainDashboard={navigateToMainDashboard} />;
      case 'shepherd':
        return (
          <ShepherdUnit
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'evangelist':
        return (
          <EvangelistUnit
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'prophets':
        return (
          <ProphetsProphetesses
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'side_men_women':
        return (
          <SideMenWomen
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'choir':
        return (
          <ChoirUnit
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'youth':
        return (
          <YouthWing
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'security':
        return (
          <SecurityUnit
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'media':
        return (
          <MediaUnit
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'medical':
        return (
          <MedicalTeam
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      case 'bible_fellowship':
        return (
          <BibleFellowship
            onNavigateToSecretariat={navigateToSecretariat}
            onNavigateToMainDashboard={navigateToMainDashboard}
          />
        );
      default:
        return (
          <MainDashboard
            onOpenDepartment={(dept) => handleTabChange(dept)}
            onNavigateToSecretariat={navigateToSecretariat}
            session={session}
            onSignOut={handleSignOut}
          />
        );
    }
  };

  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-celestial-offwhite text-celestial-gray-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={handleSignOut}
        session={session}
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onMenuToggle={() => setSidebarOpen(true)}
          searchPlaceholder={`Search ${currentTab.replace('_', ' ')} records...`}
          session={session}
          onSignOut={handleSignOut}
          onSearchChange={(q) => {
            console.log(`Global query searching active in tab ${currentTab}:`, q);
          }}
        />

        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Active Unit Layout Panel with entry fade-in transition effect */}
          <div className="animate-fade-in transition-all duration-300">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
