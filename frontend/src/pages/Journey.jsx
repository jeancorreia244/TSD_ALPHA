import React, { useState, useEffect } from 'react';
import { useJourney } from '../hooks/useJourney';
import { Card } from '../components/shared/Card';
import { StatCard } from '../components/shared/StatCard';
import { BookOpen, Heart, Sunrise, PenTool, Calendar, TrendingUp, Filter, Target } from 'lucide-react';

export function Journey() {
  const { timeline, stats, filterByType, groupedByDay, overallProgress, searchTimeline } = useJourney();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = filter === 'all'
    ? timeline
    : timeline.filter(item => item.type === filter);

  const searchedItems = searchQuery
    ? searchTimeline()(searchQuery)
    : filteredItems;

  const getIcon = (type) => {
    const icons = {
      bible: BookOpen,
      prayer: Heart,
      fasting: Sunrise,
      devotional: PenTool
    };
    return icons[type] || BookOpen;
  };

  const getColor = (type) => {
    const colors = {
      bible: 'var(--tsd-primary)',
      prayer: 'var(--tsd-secondary)',
      fasting: 'var(--tsd-warning)',
      devotional: 'var(--tsd-info)'
    };
    return colors[type] || 'var(--tsd-neutral-500)';
  };

  const filters = [
    { id: 'all', label: 'Todos', icon: Calendar },
    { id: 'bible', label: 'Bíblia', icon: BookOpen },
    { id: 'prayer', label: 'Oração', icon: Heart },
    { id: 'fasting', label: 'Jejum', icon: Sunrise },
    { id: 'devotional', label: 'Devocional', icon: PenTool }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--tsd-neutral-900)] flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-[var(--tsd-primary)]" />
          Jornada Espiritual
        </h1>
        <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
          Acompanhe sua timeline completa de práticas espirituais
        </p>
      </div>

      {/* Stats Overview with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Total Atividades', value: stats.totalActivities, trend: `${stats.activitiesWeek} esta semana` },
          { icon: TrendingUp, label: 'Consistência', value: `${stats.consistencyPercent}%`, trend: `${stats.currentStreak} dias seguidos` },
          { icon: BookOpen, label: 'Dias Ativos', value: stats.activeDays, trend: 'Total histórico' },
          { icon: Target, label: 'Progresso Geral', value: `${overallProgress}%`, trend: 'Esta semana' },
        ].map((stat, i) => (
          <div key={i} className={`transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: `${150 + i * 80}ms` }}>
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
            />
          </div>
        ))}
      </div>

      {/* Filters and Search - Card com animação */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f, idx) => {
              const Icon = f.icon;
              const isActive = filter === f.id;
              return (
                <div key={f.id} className={`transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`} style={{ transitionDelay: `${idx * 50}ms` }}>
                  <button
                    onClick={() => setFilter(f.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[var(--tsd-primary)] text-white shadow-sm scale-105'
                        : 'bg-[var(--tsd-neutral-100)] text-[var(--tsd-neutral-700)] hover:bg-[var(--tsd-neutral-200)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {f.label}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="relative w-full lg:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tsd-neutral-400)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar na timeline..."
              className="pl-10 pr-4 py-2 text-sm text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none w-full"
            />
          </div>
        </div>
      </Card>

      {/* Timeline - Card com animação */}
      <div className="space-y-4">
        {searchedItems.length === 0 ? (
          <Card>
            <p className="text-center text-[var(--tsd-neutral-500)] py-12">
              {searchQuery
                ? 'Nenhum resultado encontrado para sua busca.'
                : 'Nenhuma atividade registrada ainda.'}
            </p>
          </Card>
        ) : (
          groupedByDay.map((day, dIdx) => (
            <div key={day.date} className={`transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: `${300 + dIdx * 100}ms` }}>
              <Card>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--tsd-neutral-200)]">
                  <h3 className="font-semibold text-[var(--tsd-neutral-900)]">
                    {new Date(day.dateObj).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </h3>
                  <span className="text-sm text-[var(--tsd-neutral-500)]">
                    {day.count} atividade{day.count > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  {day.items.map((item, itemIdx) => {
                    const Icon = getIcon(item.type);
                    const color = getColor(item.type);

                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-4 p-4 bg-[var(--tsd-neutral-50)] rounded-xl transition-all duration-300 hover:bg-[var(--tsd-neutral-100)] hover:scale-[1.01] ${
                          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ transitionDelay: `${400 + itemIdx * 50}ms` }}
                      >
                        <div
                          className="p-2.5 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${color}15`, color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[var(--tsd-neutral-900)] capitalize">
                                {item.title}
                              </h4>
                              <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
                                {item.description}
                              </p>
                              {item.notes && (
                                <p className="text-xs text-[var(--tsd-neutral-500)] mt-2 line-clamp-2">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-[var(--tsd-neutral-500)] flex-shrink-0">
                              {new Date(item.date).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats - Card com animação */}
      <div className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} style={{ transitionDelay: '500ms' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--tsd-neutral-200)]">
          <div className="text-center p-4 bg-[var(--tsd-neutral-50)] rounded-xl">
            <p className="text-xs text-[var(--tsd-neutral-500)] uppercase tracking-wide">Bíblia</p>
            <p className="text-2xl font-bold text-[var(--tsd-primary)] mt-1">
              {stats.biblesCount}
            </p>
          </div>
          <div className="text-center p-4 bg-[var(--tsd-neutral-50)] rounded-xl">
            <p className="text-xs text-[var(--tsd-neutral-500)] uppercase tracking-wide">Oração</p>
            <p className="text-2xl font-bold text-[var(--tsd-secondary)] mt-1">
              {stats.prayersCount}
            </p>
          </div>
          <div className="text-center p-4 bg-[var(--tsd-neutral-50)] rounded-xl">
            <p className="text-xs text-[var(--tsd-neutral-500)] uppercase tracking-wide">Jejum</p>
            <p className="text-2xl font-bold text-[var(--tsd-warning)] mt-1">
              {stats.fastingsCount}
            </p>
          </div>
          <div className="text-center p-4 bg-[var(--tsd-neutral-50)] rounded-xl">
            <p className="text-xs text-[var(--tsd-neutral-500)] uppercase tracking-wide">Devocional</p>
            <p className="text-2xl font-bold text-[var(--tsd-info)] mt-1">
              {stats.devotionalsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Journey;