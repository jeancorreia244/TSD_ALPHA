import { useState, useCallback, useMemo } from 'react';
import { graphql, mutations } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function useFasting() {
  const { session } = useAuth();
  const { addFasting, fastings } = useData();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setDurationHours('');
    setNotes('');
    setFeedback('');
  }, []);

  const calculateDuration = useCallback(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return 0;

    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    return diffHours;
  }, [startDate, endDate]);

  const autoDuration = useMemo(() => {
    if (durationHours) return parseInt(durationHours);
    return calculateDuration();
  }, [durationHours, calculateDuration]);

  const saveFasting = useCallback(async () => {
    if (!startDate || !endDate) {
      setFeedback('Selecione data de início e fim');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setFeedback('Data de fim deve ser posterior à data de início');
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
        start_date: startDate,
        end_date: endDate,
        duration_hours: autoDuration || calculateDuration() || null,
        notes: notes.trim() || null
      };

      const response = await graphql(mutations.createFasting, { fasting: input }, session.token);
      const savedFasting = response.createFasting;

      addFasting(savedFasting);
      setFeedback('Jejum registrado com sucesso!');

      setTimeout(() => resetForm(), 1500);
    } catch (err) {
      console.error('Erro ao salvar jejum:', err);
      setFeedback('Erro ao salvar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }, [startDate, endDate, autoDuration, notes, session?.token, addFasting, calculateDuration, resetForm]);

  // Estatísticas
  const totalHours = useMemo(() => {
    return fastings.reduce((sum, f) => sum + (f.duration_hours || 0), 0);
  }, [fastings]);

  const totalDays = useMemo(() => {
    return Math.round(totalHours / 24);
  }, [totalHours]);

  const totalSessions = fastings.length;

  const averageHours = useMemo(() => {
    if (totalSessions === 0) return 0;
    return Math.round(totalHours / totalSessions);
  }, [totalHours, totalSessions]);

  const todayFastings = fastings.filter(f => {
    const fastingDate = new Date(f.created_at);
    const today = new Date();
    return fastingDate.toDateString() === today.toDateString();
  }).length;

  const weekFastings = fastings.filter(f => {
    const fastingDate = new Date(f.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return fastingDate >= weekAgo;
  });

  const weekHours = useMemo(() => {
    return weekFastings.reduce((sum, f) => sum + (f.duration_hours || 0), 0);
  }, [weekFastings]);

  const monthFastings = fastings.filter(f => {
    const fastingDate = new Date(f.created_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return fastingDate >= monthAgo;
  });

  const monthHours = useMemo(() => {
    return monthFastings.reduce((sum, f) => sum + (f.duration_hours || 0), 0);
  }, [monthFastings]);

  const longestFasting = useMemo(() => {
    if (fastings.length === 0) return null;
    return fastings.reduce((max, f) => {
      const hours = f.duration_hours || 0;
      const maxHours = max?.duration_hours || 0;
      return hours > maxHours ? f : max;
    }, fastings[0]);
  }, [fastings]);

  const lastFasting = fastings[0];

  const formatDuration = useCallback((hours) => {
    if (!hours || hours === 0) return '0h';

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days === 0) return `${hours}h`;
    if (remainingHours === 0) return `${days}d`;
    return `${days}d ${remainingHours}h`;
  }, []);

  const getFastingType = useCallback((hours) => {
    if (!hours) return 'Desconhecido';
    if (hours < 12) return 'Parcial';
    if (hours < 24) return 'Jejum Diário';
    if (hours < 72) return 'Jejum Estendido';
    if (hours < 168) return 'Jejum Semanal';
    return 'Jejum Prolongado';
  }, []);

  const upcomingFastings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return fastings.filter(f => {
      const fastingStart = new Date(f.start_date);
      return fastingStart >= today;
    }).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  }, [fastings]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    durationHours,
    setDurationHours,
    notes,
    setNotes,
    autoDuration,
    calculateDuration,
    formatDuration,
    getFastingType,
    feedback,
    isSaving,
    saveFasting,
    resetForm,
    totalHours,
    totalDays,
    totalSessions,
    averageHours,
    todayFastings,
    weekHours,
    monthHours,
    longestFasting,
    lastFasting,
    upcomingFastings,
    fastings
  };
}

export default useFasting;
