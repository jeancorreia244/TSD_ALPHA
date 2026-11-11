import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Sidebar({
  navigation = [],
  currentPath,
  user,
  onClose,
  isOpen = true
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath?.startsWith(path);
  };

  return (
    <aside className={`${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[var(--tsd-neutral-200)] transform transition-transform duration-300 ease-out lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center gap-3 p-6 border-b border-[var(--tsd-neutral-200)]">
          <div className="w-10 h-10 bg-[var(--tsd-primary)] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">TSD</span>
          </div>
          <div>
            <h2 className="font-semibold text-[var(--tsd-neutral-900)]">Tempo a Sós</h2>
            <p className="text-xs text-[var(--tsd-neutral-500)]">com Deus</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-[var(--tsd-primary)]/10 text-[var(--tsd-primary)] font-medium'
                        : 'text-[var(--tsd-neutral-700)] hover:bg-[var(--tsd-neutral-100)]'
                    }`}
                  >
                    {Icon && (
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                    )}
                    <span className="text-sm">{item.label}</span>
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 bg-[var(--tsd-primary)] rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-[var(--tsd-neutral-200)]">
            <div className="flex items-center gap-3 p-3 bg-[var(--tsd-neutral-50)] rounded-xl">
              <div className="w-10 h-10 bg-[var(--tsd-primary)] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--tsd-neutral-900)] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--tsd-neutral-500)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
