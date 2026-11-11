import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useBible } from '../hooks/useBible';
import { usePrayer } from '../hooks/usePrayer';
import { useFasting } from '../hooks/useFasting';
import { useDevotional } from '../hooks/useDevotional';
import { useJourney } from '../hooks/useJourney';
import { StatCard } from '../components/shared/StatCard';
import { Card } from '../components/shared/Card';
import { DailyVerse } from '../components/shared/DailyVerse';
import { BookOpen, Heart, Sunrise, PenTool, Target, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { session } = useAuth();
  const { bibles, prayers, fastings, devotionals, loading } = useData();
  const [isVisible, setIsVisible] = useState(false);

  const bibleStats = useBible();
  const prayerStats = usePrayer();
  const fastingStats = useFasting();
  const devotionalStats = useDevotional();
  const journeyStats = useJourney();

  useEffect(() => {
    // Animação de entrada em cascata
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading.bibles || loading.prayers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tsd-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--tsd-neutral-600)]">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: BookOpen,
      label: 'Leituras da Bíblia',
      value: bibleStats.uniqueReadings || 0,
      trend: '+5 esta semana',
      trendUp: true
    },
    {
      icon: Heart,
      label: 'Minutos em Oração (semana)',
      value: prayerStats.weekMinutes || 0,
      trend: '+12%',
      trendUp: true
    },
    {
      icon: Sunrise,
      label: 'Horas de Jejum',
      value: fastingStats.totalHours || 0,
      trend: '2 jejuns este mês',
      trendUp: true
    },
    {
      icon: PenTool,
      label: 'Devocionais',
      value: devotionalStats.totalCount || 0,
      trend: '+3 esta semana',
      trendUp: true
    },
  ];

  const progressMetrics = [
    {
      icon: BookOpen,
      label: 'Progresso Bíblico',
      value: bibleStats.progressPercent || 0,
      color: 'var(--tsd-primary)'
    },
    {
      icon: Heart,
      label: 'Oração Semanal',
      value: Math.min((prayerStats.weekMinutes / 70) * 100, 100) || 0,
      color: 'var(--tsd-secondary)'
    },
    {
      icon: Target,
      label: 'Consistência',
      value: journeyStats.stats.consistencyPercent || 0,
      color: 'var(--tsd-info)'
    },
  ];

  return (
    <div className="space-y-6">
      {/* NOVO: Versículo do Dia */}
      <DailyVerse />

      {/* Welcome Header com Animação */}
      <div
        className={`flex items-center justify-between transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold text-[var(--tsd-neutral-900)] flex items-center gap-3 flex-wrap">
            Olá, {session?.user?.name?.split(' ')[0]}! 👋
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--tsd-secondary-light), var(--tsd-secondary))',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <span>🔥</span>
              <span>{journeyStats.stats.consistencyPercent || 0}% de consistência</span>
            </span>
          </h1>
          <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
            Continue sua jornada espiritual de hoje
          </p>
        </div>
      </div>

      {/* Stats Grid com Animação em Cascata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${200 + i * 100}ms` }}
          >
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendUp={stat.trendUp}
            />
          </div>
        ))}
      </div>

      {/* Progress Metrics com Animação */}
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '600ms' }}
      >
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">PROGRESSO ESPIRITUAL</h2>
          <div className="space-y-4">
            {progressMetrics.map((metric, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--tsd-bg-primary)] rounded-lg" style={{ color: metric.color }}>
                      <metric.icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="font-medium text-[var(--tsd-neutral-700)]">{metric.label}</span>
                  </div>
                  <span className="font-bold text-[var(--tsd-neutral-900)]">{Math.round(metric.value)}%</span>
                </div>
                <div className="h-2 bg-[var(--tsd-neutral-100)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${Math.min(metric.value, 100)}%` : '0%',
                      backgroundColor: metric.color,
                      transitionDelay: `${800 + i * 200}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activities - REMOVIDO "Ações Rápidas" */}
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '1000ms' }}
      >
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">Atividades Recentes</h2>
          <div className="space-y-3">
            {bibles.slice(0, 3).map((bible, idx) => (
              <div
                key={bible.id}
                className={`flex items-center gap-3 p-3 bg-[var(--tsd-neutral-50)] rounded-lg transition-all duration-300 hover:bg-[var(--tsd-neutral-100)] hover:scale-[1.02] ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${1200 + idx * 100}ms` }}
              >
                <div
                  className="p-2 rounded-lg text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--tsd-primary-light), var(--tsd-primary))'
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--tsd-neutral-900)] truncate">
                    {bible.book} {bible.chapter}
                  </p>
                  <p className="text-xs text-[var(--tsd-neutral-500)]">
                    {new Date(bible.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
            {bibles.length === 0 && (
              <p className="text-sm text-[var(--tsd-neutral-500)] text-center py-4">
                Nenhuma atividade recente
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;