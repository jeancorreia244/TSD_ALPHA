import React from 'react';
import { Card } from './Card';

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendUp = true,
  className = ''
}) {
  return (
    <Card className={`group transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-[var(--tsd-primary)]/30 cursor-default ${className}`} elevation="sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--tsd-neutral-500)] font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-[var(--tsd-neutral-900)] mt-1 transition-colors duration-200 group-hover:text-[var(--tsd-primary)]">
            {value}
          </p>
          {trend && (
            <p className={`text-xs font-medium mt-1 flex items-center gap-1 transition-all duration-200 ${trendUp ? 'text-[var(--tsd-success)]' : 'text-[var(--tsd-error)]'}`}>
              <span>{trendUp ? '↑' : '↓'}</span>
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="p-3 rounded-xl text-white transition-transform duration-300 ease-out group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, var(--tsd-primary-light), var(--tsd-primary))'
            }}
          >
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatCard;
