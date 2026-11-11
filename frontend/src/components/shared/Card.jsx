import React from 'react';

export function Card({
  children,
  elevation = 'sm',
  padding = 'md',
  className = '',
  ...props
}) {
  const baseClasses = 'bg-white rounded-xl border border-[var(--tsd-neutral-200)]';

  const elevations = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md hover:shadow-lg transition-shadow duration-200',
    lg: 'shadow-lg hover:shadow-xl transition-shadow duration-200'
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8'
  };

  const classes = `${baseClasses} ${elevations[elevation] || elevations.sm} ${paddings[padding] || paddings.md} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card;
