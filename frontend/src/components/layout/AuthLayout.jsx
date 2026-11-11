import React from 'react';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--tsd-bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--tsd-primary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">TSD</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--tsd-neutral-900)]">
            Tempo a Sós com Deus
          </h1>
          <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
            Acompanhe sua jornada espiritual
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--tsd-neutral-200)] p-6">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--tsd-neutral-500)] mt-6">
          © 2026 TSD - Tempo a Sós com Deus
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
