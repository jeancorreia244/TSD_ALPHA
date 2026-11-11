import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-[var(--tsd-neutral-100)] text-[var(--tsd-neutral-700)]',
    primary: 'bg-[var(--tsd-primary)]/10 text-[var(--tsd-primary)]',
    secondary: 'bg-[var(--tsd-secondary)]/10 text-[var(--tsd-secondary)]',
    success: 'bg-[var(--tsd-success)]/10 text-[var(--tsd-success)]',
    warning: 'bg-[var(--tsd-warning)]/10 text-[var(--tsd-warning)]',
    error: 'bg-[var(--tsd-error)]/10 text-[var(--tsd-error)]',
    info: 'bg-[var(--tsd-info)]/10 text-[var(--tsd-info)]'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const classes = `${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

export default Badge;
