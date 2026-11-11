import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type, duration };

    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    loading: (message, duration) => addToast(message, 'loading', duration)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  const container = (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );

  return createPortal(container, document.body);
}

function Toast({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    loading: '⟳'
  };

  const styles = {
    success: 'bg-[var(--tsd-success)] text-white',
    error: 'bg-[var(--tsd-error)] text-white',
    warning: 'bg-[var(--tsd-warning)] text-white',
    info: 'bg-[var(--tsd-info)] text-white',
    loading: 'bg-[var(--tsd-neutral-700)] text-white'
  };

  return (
    <div
      className={`min-w-[300px] max-w-md px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${styles[type] || styles.info}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-lg font-bold flex-shrink-0">
        {icons[type] || icons.info}
      </span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return context;
}

export default ToastProvider;
