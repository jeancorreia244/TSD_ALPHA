import { useState, useCallback, useRef, useEffect } from 'react';
import { graphql, mutations } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function usePrayer() {
  const { session } = useAuth();
  const { addPrayer, prayers } = useData();
  const [sessionState, setSessionState] = useState({
    focus: '',
    note: '',
    elapsedSeconds: 0,
    isRunning: false
  });
  const timerRef = useRef(null);
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Timer com useRef - EVITA RACE CONDITION
  useEffect(() => {
    if (sessionState.isRunning) {
      timerRef.current = setInterval(() => {
        setSessionState(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionState.isRunning]);

  const start = useCallback(() => {
    setSessionState(prev => ({ ...prev, isRunning: true }));
    setFeedback('');
  }, []);

  const pause = useCallback(() => {
    setSessionState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setSessionState({ focus: '', note: '', elapsedSeconds: 0, isRunning: false });
    setFeedback('');
  }, []);

  const finish = useCallback(async () => {
    if (sessionState.elapsedSeconds === 0) {
      setFeedback('Oração deve ter pelo menos 1 segundo');
      return;
    }

    if (!session?.token) {
      setFeedback('Você precisa estar logado para salvar');
      return;
    }

    setIsSaving(true);
    setFeedback('Salvando...');

    try {
      const input = {
        focus: sessionState.focus.trim() || 'Oração',
        note: sessionState.note.trim(),
        duration: sessionState.elapsedSeconds
      };

      const response = await graphql(mutations.createPrayer, { prayer: input }, session.token);
      const savedPrayer = response.createPrayer;

      addPrayer(savedPrayer);
      setFeedback('Oração registrada com sucesso!');

      // Reset após sucesso
      setTimeout(() => reset(), 1500);
    } catch (err) {
      console.error('Erro ao salvar oração:', err);
      setFeedback('Erro ao salvar oração: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }, [sessionState, session?.token, addPrayer, reset]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, []);

  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  }, []);

  // Estatísticas
  const todayMinutes = prayers
    .filter(p => {
      const prayerDate = new Date(p.created_at);
      const today = new Date();
      return prayerDate.toDateString() === today.toDateString();
    })
    .reduce((sum, p) => sum + Math.round(p.duration / 60), 0);

  const weekMinutes = prayers
    .filter(p => {
      const prayerDate = new Date(p.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return prayerDate >= weekAgo;
    })
    .reduce((sum, p) => sum + Math.round(p.duration / 60), 0);

  const monthMinutes = prayers
    .filter(p => {
      const prayerDate = new Date(p.created_at);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return prayerDate >= monthAgo;
    })
    .reduce((sum, p) => sum + Math.round(p.duration / 60), 0);

  const totalSessions = prayers.length;

  const averageSessionMinutes = totalSessions > 0
    ? Math.round(prayers.reduce((sum, p) => sum + p.duration, 0) / totalSessions / 60)
    : 0;

  const lastPrayer = prayers[0];

  return {
    session: sessionState,
    setSession: setSessionState,
    feedback,
    isSaving,
    prayers,
    start,
    pause,
    reset,
    finish,
    formatTime,
    formatDuration,
    todayMinutes,
    weekMinutes,
    monthMinutes,
    totalSessions,
    averageSessionMinutes,
    lastPrayer,
    isRunning: sessionState.isRunning,
    elapsedSeconds: sessionState.elapsedSeconds,
    formattedTime: formatTime(sessionState.elapsedSeconds)
  };
}

export default usePrayer;
