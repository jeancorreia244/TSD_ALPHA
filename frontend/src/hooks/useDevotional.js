import { useState, useCallback, useMemo } from 'react';
import { graphql, mutations } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function useDevotional() {
  const { session } = useAuth();
  const { addDevotional, devotionals } = useData();
  const [reference, setReference] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = useCallback(() => {
    setReference('');
    setTitle('');
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    setFeedback('');
  }, []);

  const saveDevotional = useCallback(async () => {
    if (!content.trim()) {
      setFeedback('Conteúdo é obrigatório');
      return;
    }

    if (content.trim().length < 10) {
      setFeedback('Conteúdo deve ter pelo menos 10 caracteres');
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
        reference: reference.trim() || null,
        title: title.trim() || null,
        content: content.trim(),
        date
      };

      const response = await graphql(mutations.createDevotional, { devotional: input }, session.token);
      const savedDevotional = response.createDevotional;

      addDevotional(savedDevotional);
      setFeedback('Devocional registrado com sucesso!');

      setTimeout(() => resetForm(), 1500);
    } catch (err) {
      console.error('Erro ao salvar devocional:', err);
      setFeedback('Erro ao salvar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }, [reference, title, content, date, session?.token, addDevotional, resetForm]);

  // Estatísticas
  const totalCount = devotionals.length;

  const todayDevotionals = devotionals.filter(d => {
    const devotionalDate = new Date(d.date);
    const today = new Date();
    return devotionalDate.toDateString() === today.toDateString();
  }).length;

  const weekDevotionals = devotionals.filter(d => {
    const devotionalDate = new Date(d.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return devotionalDate >= weekAgo;
  }).length;

  const monthDevotionals = devotionals.filter(d => {
    const devotionalDate = new Date(d.date);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return devotionalDate >= monthAgo;
  }).length;

  const yearDevotionals = devotionals.filter(d => {
    const devotionalDate = new Date(d.date);
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    return devotionalDate >= yearAgo;
  }).length;

  const averageWords = useMemo(() => {
    if (devotionals.length === 0) return 0;
    const totalWords = devotionals.reduce((sum, d) => {
      const words = d.content ? d.content.trim().split(/\s+/).length : 0;
      return sum + words;
    }, 0);
    return Math.round(totalWords / devotionals.length);
  }, [devotionals]);

  const totalWords = useMemo(() => {
    return devotionals.reduce((sum, d) => {
      const words = d.content ? d.content.trim().split(/\s+/).length : 0;
      return sum + words;
    }, 0);
  }, [devotionals]);

  const longestDevotional = useMemo(() => {
    if (devotionals.length === 0) return null;
    return devotionals.reduce((max, d) => {
      const words = d.content ? d.content.trim().split(/\s+/).length : 0;
      const maxWords = max.content ? max.content.trim().split(/\s+/).length : 0;
      return words > maxWords ? d : max;
    }, devotionals[0]);
  }, [devotionals]);

  const lastDevotional = devotionals[0];

  const devotionalStreak = useMemo(() => {
    if (devotionals.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      const hasDevotional = devotionals.some(d => {
        const devotionalDate = new Date(d.date);
        devotionalDate.setHours(0, 0, 0, 0);
        return devotionalDate.getTime() === checkDate.getTime();
      });

      if (hasDevotional) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  }, [devotionals]);

  const devotionalsByMonth = useMemo(() => {
    const months = {};
    devotionals.forEach(d => {
      const date = new Date(d.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return months;
  }, [devotionals]);

  const formatWords = useCallback((count) => {
    if (count < 1000) return `${count} palavras`;
    return `${(count / 1000).toFixed(1)}k palavras`;
  }, []);

  const getReadingTime = useCallback((content) => {
    if (!content) return 0;
    const words = content.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.max(1, Math.round(words / wordsPerMinute));
  }, []);

  const recentDevotionals = useMemo(() => {
    return [...devotionals]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);
  }, [devotionals]);

  const searchDevotionals = useCallback((query) => {
    if (!query) return devotionals;

    const lowerQuery = query.toLowerCase();
    return devotionals.filter(d =>
      d.title?.toLowerCase().includes(lowerQuery) ||
      d.content?.toLowerCase().includes(lowerQuery) ||
      d.reference?.toLowerCase().includes(lowerQuery)
    );
  }, [devotionals]);

  return {
    reference,
    setReference,
    title,
    setTitle,
    content,
    setContent,
    date,
    setDate,
    feedback,
    isSaving,
    saveDevotional,
    resetForm,
    totalCount,
    todayDevotionals,
    weekDevotionals,
    monthDevotionals,
    yearDevotionals,
    averageWords,
    totalWords,
    formatWords,
    getReadingTime,
    longestDevotional,
    lastDevotional,
    devotionalStreak,
    devotionalsByMonth,
    recentDevotionals,
    searchDevotionals,
    devotionals
  };
}

export default useDevotional;
