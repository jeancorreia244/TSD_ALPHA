import React from 'react';

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[var(--tsd-primary)] text-white hover:bg-[var(--tsd-primary-light)] focus:ring-[var(--tsd-primary)] focus:ring-opacity-50',
    secondary: 'bg-[var(--tsd-secondary)] text-white hover:bg-[var(--tsd-secondary-light)] focus:ring-[var(--tsd-secondary)] focus:ring-opacity-50',
    ghost: 'bg-transparent text-[var(--tsd-primary)] hover:bg-[var(--tsd-primary)]/10 focus:ring-[var(--tsd-primary)] focus:ring-opacity-50',
    danger: 'bg-[var(--tsd-error)] text-white hover:bg-[var(--tsd-error)]/90 focus:ring-[var(--tsd-error)] focus:ring-opacity-50',
    success: 'bg-[var(--tsd-success)] text-white hover:bg-[var(--tsd-success)]/90 focus:ring-[var(--tsd-success)] focus:ring-opacity-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  };

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
