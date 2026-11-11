import React from 'react';

export function Input({
  label,
  error,
  helper,
  id,
  className = '',
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-opacity-20 focus:outline-none';

  const errorClasses = error
    ? 'border-[var(--tsd-error)] focus:border-[var(--tsd-error)] focus:ring-[var(--tsd-error)]'
    : 'border-[var(--tsd-neutral-300)] focus:border-[var(--tsd-primary)] focus:ring-[var(--tsd-primary)]';

  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={classes}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helper
              ? `${inputId}-helper`
              : undefined
        }
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-[var(--tsd-error)]"
          role="alert"
        >
          {error}
        </p>
      )}

      {helper && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-1.5 text-sm text-[var(--tsd-neutral-500)]"
        >
          {helper}
        </p>
      )}
    </div>
  );
}

export default Input;
