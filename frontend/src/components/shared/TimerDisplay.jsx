import React from 'react';

export function TimerDisplay({
  value = 0,
  format = 'MM:SS',
  size = 'xl',
  className = ''
}) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  const formatTime = (seconds) => {
    if (format === 'MM:SS') {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }

    if (format === 'HH:MM:SS') {
      const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${hours}:${mins}:${secs}`;
    }

    return seconds.toString();
  };

  const display = formatTime(value);

  const classes = `font-mono tabular-nums ${sizes[size] || sizes.xl} font-medium text-[var(--tsd-neutral-900)] ${className}`;

  return (
    <div className={classes}>
      {display}
    </div>
  );
}

export default TimerDisplay;
