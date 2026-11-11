import React from 'react';

export function Topbar({
  user,
  onLogout,
  onMenuClick,
  showMenu = false,
  title = 'TSD'
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--tsd-neutral-200)] h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-[var(--tsd-neutral-100)] rounded-lg transition-colors"
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--tsd-primary)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TSD</span>
            </div>
            <h1 className="text-lg font-semibold text-[var(--tsd-neutral-900)] hidden sm:block">
              {title}
            </h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-[var(--tsd-neutral-900)]">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--tsd-neutral-500)]">
                  {user.email}
                </p>
              </div>

              <div className="w-9 h-9 bg-[var(--tsd-primary)]/10 rounded-full flex items-center justify-center">
                <span className="text-[var(--tsd-primary)] font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 hover:bg-[var(--tsd-neutral-100)] rounded-lg transition-colors"
                aria-label="Sair"
                title="Sair"
              >
                <svg className="w-5 h-5 text-[var(--tsd-neutral-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
