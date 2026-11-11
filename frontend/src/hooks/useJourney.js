import { useMemo } from 'react';
import { useData } from '../contexts/DataContext';

export function useJourney() {
  const { bibles, prayers, fastings, devotionals, groups } = useData();

  // Timeline unificada de todas as práticas
  const timeline = useMemo(() => {
    const items = [];

    // Adicionar Bíblias
    bibles.forEach(b => {
      items.push({
        id: `bible-${b.id}`,
        type: 'bible',
        title: `${b.book} ${b.chapter}`,
        description: b.verse ? `Versículo ${b.verse}` : 'Leitura bíblica',
        notes: b.notes,
        date: new Date(b.created_at),
        icon: 'BookOpen',
        color: 'var(--tsd-primary)',
        book: b.book,
        chapter: b.chapter
      });
    });

    // Adicionar Orações
    prayers.forEach(p => {
      items.push({
        id: `prayer-${p.id}`,
        type: 'prayer',
        title: p.focus || 'Oração',
        description: `${Math.round(p.duration / 60)} minutos de oração`,
        notes: p.note,
        date: new Date(p.created_at),
        icon: 'Heart',
        color: 'var(--tsd-secondary)',
        duration: p.duration,
        focus: p.focus
      });
    });

    // Adicionar Jejum
    fastings.forEach(f => {
      items.push({
        id: `fasting-${f.id}`,
        type: 'fasting',
        title: 'Jejum',
        description: `${f.start_date} até ${f.end_date}`,
        notes: f.notes,
        date: new Date(f.created_at),
        icon: 'Sunrise',
        color: 'var(--tsd-warning)',
        startDate: f.start_date,
        endDate: f.end_date,
        durationHours: f.duration_hours
      });
    });

    // Adicionar Devocionais
    devotionals.forEach(d => {
      items.push({
        id: `devotional-${d.id}`,
        type: 'devotional',
        title: d.title || d.reference || 'Devocional',
        description: d.content ? `${d.content.substring(0, 100)}...` : 'Reflexão devocional',
        notes: d.content,
        date: new Date(d.created_at || d.date),
        icon: 'PenTool',
        color: 'var(--tsd-info)',
        reference: d.reference,
        content: d.content,
        devotionalDate: d.date
      });
    });

    // Ordenar por data decrescente (mais recente primeiro)
    return items.sort((a, b) => b.date - a.date);
  }, [bibles, prayers, fastings, devotionals]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalActivities = bibles.length + prayers.length + fastings.length + devotionals.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const activitiesToday = timeline.filter(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === today.getTime();
    }).length;

    const activitiesWeek = timeline.filter(item => item.date >= weekAgo).length;
    const activitiesMonth = timeline.filter(item => item.date >= monthAgo).length;

    // Dias ativos
    const activeDays = new Set();
    timeline.forEach(item => {
      const date = new Date(item.date);
      date.setHours(0, 0, 0, 0);
      activeDays.add(date.getTime());
    });

    // Consistência semanal (% de dias ativos nos últimos 7 dias)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    const activeDaysLastWeek = last7Days.filter(day => activeDays.has(day)).length;
    const consistencyPercent = Math.round((activeDaysLastWeek / 7) * 100);

    // Streak atual
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);

      if (activeDays.has(checkDate.getTime())) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalActivities,
      activitiesToday,
      activitiesWeek,
      activitiesMonth,
      activeDays: activeDays.size,
      consistencyPercent,
      currentStreak,
      biblesCount: bibles.length,
      prayersCount: prayers.length,
      fastingsCount: fastings.length,
      devotionalsCount: devotionals.length,
      groupsCount: groups.length
    };
  }, [timeline, bibles.length, prayers.length, fastings.length, devotionals.length, groups.length]);

  // Filtros por tipo
  const filterByType = useMemo(() => {
    return {
      all: timeline,
      bible: timeline.filter(item => item.type === 'bible'),
      prayer: timeline.filter(item => item.type === 'prayer'),
      fasting: timeline.filter(item => item.type === 'fasting'),
      devotional: timeline.filter(item => item.type === 'devotional')
    };
  }, [timeline]);

  // Agrupar por dia
  const groupedByDay = useMemo(() => {
    const groups = {};

    timeline.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    return Object.entries(groups)
      .map(([date, items]) => ({
        date,
        dateObj: new Date(date),
        items,
        count: items.length
      }))
      .sort((a, b) => b.dateObj - a.dateObj);
  }, [timeline]);

  // Agrupar por mês
  const groupedByMonth = useMemo(() => {
    const groups = {};

    timeline.forEach(item => {
      const date = item.date;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return Object.entries(groups)
      .map(([month, items]) => ({
        month,
        items,
        count: items.length
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [timeline]);

  // Últimas atividades por tipo
  const recentByType = useMemo(() => {
    return {
      bible: bibles[0] || null,
      prayer: prayers[0] || null,
      fasting: fastings[0] || null,
      devotional: devotionals[0] || null
    };
  }, [bibles, prayers, fastings, devotionals]);

  // Progresso geral (score ponderado)
  const overallProgress = useMemo(() => {
    const maxActivities = 28; // 4 por semana
    const weekActivities = timeline.filter(item => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return item.date >= weekAgo;
    }).length;

    return Math.min(Math.round((weekActivities / maxActivities) * 100), 100);
  }, [timeline]);

  // Busca na timeline
  const searchTimeline = useMemo(() => {
    return (query) => {
      if (!query) return timeline;

      const lowerQuery = query.toLowerCase();
      return timeline.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.notes?.toLowerCase().includes(lowerQuery)
      );
    };
  }, [timeline]);

  return {
    timeline,
    stats,
    filterByType,
    groupedByDay,
    groupedByMonth,
    recentByType,
    overallProgress,
    searchTimeline
  };
}

export default useJourney;
