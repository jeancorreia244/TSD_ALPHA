import React, { useState, useEffect } from 'react';
import { useFasting } from '../hooks/useFasting';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { StatCard } from '../components/shared/StatCard';
import { Sunrise, Clock, TrendingUp, Calendar, Award } from 'lucide-react';

export function Fasting() {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    durationHours,
    setDurationHours,
    notes,
    setNotes,
    autoDuration,
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
  } = useFasting();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--tsd-neutral-900)] flex items-center gap-3">
          <Sunrise className="w-7 h-7 text-[var(--tsd-primary)]" />
          Jejum
        </h1>
        <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
          Registre seus jejuns e acompanhe seu progresso espiritual
        </p>
      </div>

      {/* Stats Grid with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[

          { icon: Clock, label: 'Total Horas', value: formatDuration(totalHours), trend: `${totalDays} dias` },
          { icon: Calendar, label: 'Este Mês', value: formatDuration(monthHours), trend: weekHours > 0 ? `${formatDuration(weekHours)} esta semana` : 'Nenhum esta semana' },
          { icon: TrendingUp, label: 'Média', value: formatDuration(averageHours), trend: `${totalSessions} jejuns` },
          { icon: Award, label: 'Mais Longo', value: longestFasting ? formatDuration(longestFasting.duration_hours) : '0h', trend: longestFasting ? getFastingType(longestFasting.duration_hours) : '-' },

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Registration Form */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
            Registrar Jejum
          </h2>

          {feedback && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${
              feedback.includes('sucesso') || feedback.includes('registrado')
                ? 'bg-[var(--tsd-success)]/10 text-[var(--tsd-success)] border border-[var(--tsd-success)]/20'
                : 'bg-[var(--tsd-error)]/10 text-[var(--tsd-error)] border border-[var(--tsd-error)]/20'
            }`}>
              {feedback}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                  Data Início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none"
                  min={startDate}
                />
              </div>
            </div>

            <div className="p-3 bg-[var(--tsd-neutral-50)] rounded-lg border border-[var(--tsd-neutral-200)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--tsd-neutral-700)]">
                  Duração Calculada
                </span>
                <span className="text-lg font-bold text-[var(--tsd-primary)]">
                  {autoDuration > 0 ? formatDuration(autoDuration) : '-'}
                </span>
              </div>
              {autoDuration > 0 && (
                <p className="text-xs text-[var(--tsd-neutral-600)] mt-1">
                  Tipo: {getFastingType(autoDuration)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                Duração Manual (opcional)
              </label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                placeholder="Horas (ex: 24)"
                className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none"
              />
              <p className="text-xs text-[var(--tsd-neutral-500)] mt-1">
                Deixe em branco para calcular automaticamente
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                Notas (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none resize-none"
                placeholder="Propósito, experiências, aprendizados..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={saveFasting}
                variant="primary"
                size="md"
                className="flex-1"
                disabled={isSaving || !startDate || !endDate}
              >
                {isSaving ? 'Salvando...' : 'Registrar Jejum'}
              </Button>
              <Button
                onClick={resetForm}
                variant="ghost"
                size="md"
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Fasting Info */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
            Informações
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-[var(--tsd-primary)]/10 rounded-xl border border-[var(--tsd-primary)]/20">
              <h3 className="font-semibold text-[var(--tsd-neutral-900)] mb-2 flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-[var(--tsd-primary)]" />
                Tipos de Jejum
              </h3>
              <ul className="space-y-1.5 text-sm text-[var(--tsd-neutral-700)]">
                <li>• <strong>Parcial</strong> ({'<'} 12h) - Alimentos restritos</li>
                <li>• <strong>Diário</strong> (12-24h) - Um dia completo</li>
                <li>• <strong>Estendido</strong> (24-72h) - Vários dias</li>
                <li>• <strong>Semanal</strong> (72h-168h) - Uma semana</li>
                <li>• <strong>Prolongado</strong> ({'>'} 168h) - Mais de uma semana</li>
              </ul>
            </div>

            {lastFasting && (
              <div>
                <p className="text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wide mb-2">
                  Último Jejum
                </p>
                <div className="p-3 bg-[var(--tsd-neutral-50)] rounded-lg">
                  <p className="text-sm font-medium text-[var(--tsd-neutral-900)]">
                    {formatDuration(lastFasting.duration_hours)}
                  </p>
                  <p className="text-xs text-[var(--tsd-neutral-600)] mt-1">
                    {new Date(lastFasting.start_date).toLocaleDateString('pt-BR')} até { ' ' }
                    {new Date(lastFasting.end_date).toLocaleDateString('pt-BR')}
                  </p>
                  {lastFasting.notes && (
                    <p className="text-xs text-[var(--tsd-neutral-600)] mt-2 line-clamp-2">
                      {lastFasting.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {upcomingFastings.length > 0 && (
              <div>
                <p className="text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wide mb-2">
                  Próximos Jejum
                </p>
                <div className="space-y-2">
                  {upcomingFastings.slice(0, 3).map((fasting) => (
                    <div key={fasting.id} className="p-2 bg-[var(--tsd-neutral-50)] rounded-lg">
                      <p className="text-xs text-[var(--tsd-neutral-900)]">
                        {new Date(fasting.start_date).toLocaleDateString('pt-BR')} até { ' ' }
                        {new Date(fasting.end_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--tsd-neutral-200)]">
              <h3 className="text-sm font-semibold text-[var(--tsd-neutral-800)] mb-2">Dicas de Jejum</h3>
              <ul className="space-y-2 text-sm text-[var(--tsd-neutral-600)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsd-primary)] mt-0.5">•</span>
                  Beba bastante água durante o jejum
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsd-primary)] mt-0.5">•</span>
                  Descanse adequadamente
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsd-primary)] mt-0.5">•</span>
                  Tenha um propósito claro
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Fastings */}
      <Card>
        <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
          Histórico de Jejum
        </h2>
        {fastings.length === 0 ? (
          <p className="text-sm text-[var(--tsd-neutral-500)] text-center py-8">
            Nenhum jejum registrado ainda. Comece agora!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--tsd-neutral-200)]">
                  <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Período</th>
                  <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Duração</th>
                  <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Tipo</th>
                  <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--tsd-neutral-100)]">
                {fastings.slice(0, 10).map((fasting) => (
                  <tr key={fasting.id} className="hover:bg-[var(--tsd-neutral-50)] transition-colors duration-150">
                    <td className="py-3 text-sm text-[var(--tsd-neutral-900)]">
                      {new Date(fasting.start_date).toLocaleDateString('pt-BR')} - { ' ' }
                      {new Date(fasting.end_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 text-sm text-[var(--tsd-neutral-900)]">
                      {formatDuration(fasting.duration_hours)}
                    </td>
                    <td className="py-3 text-sm text-[var(--tsd-neutral-600)]">
                      {getFastingType(fasting.duration_hours)}
                    </td>
                    <td className="py-3 text-sm text-[var(--tsd-neutral-600)] max-w-xs truncate">
                      {fasting.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Fasting;