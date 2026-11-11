import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../shared/Sidebar';
import { Topbar } from '../shared/Topbar';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, BookOpen, Heart, Sunrise, PenTool, TrendingUp, Users } from 'lucide-react';

const navigation = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/bible', label: 'Bíblia', icon: BookOpen },
  { path: '/prayer', label: 'Oração', icon: Heart },
  { path: '/fasting', label: 'Jejum', icon: Sunrise },
  { path: '/devotional', label: 'Devocional', icon: PenTool },
  { path: '/journey', label: 'Jornada', icon: TrendingUp },
  { path: '/groups', label: 'Grupos', icon: Users },
];

export function Layout() {
  const location = useLocation();
  const { session, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[var(--tsd-bg-primary)]">
      {/* Topbar */}
      <Topbar
        user={session?.user}
        onLogout={logout}
        onMenuClick={() => setSidebarOpen(true)}
        showMenu={isMobile}
        title="TSD"
      />

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block fixed inset-y-0 left-0 z-40">
          <Sidebar
            navigation={navigation}
            currentPath={location.pathname}
            user={session?.user}
          />
        </aside>

        {/* Sidebar Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Mobile */}
        {isMobile && (
          <Sidebar
            navigation={navigation}
            currentPath={location.pathname}
            user={session?.user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-64px)] pt-0 lg:pt-0">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
