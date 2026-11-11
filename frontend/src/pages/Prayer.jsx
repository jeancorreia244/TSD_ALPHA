import React, { useState, useEffect } from 'react';
import { usePrayer } from '../hooks/usePrayer';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { StatCard } from '../components/shared/StatCard';
import { TimerDisplay } from '../components/shared/TimerDisplay';
import { Heart, Timer, TrendingUp, Calendar, Play, Pause, Check } from 'lucide-react';

export function Prayer() {
  const {
    session: prayerSession,
    setSession,
    feedback,
    isSaving,
    prayers,
    start,
    pause,
    finish,
    todayMinutes,
    weekMinutes,
    monthMinutes,
    totalSessions,
    averageSessionMinutes,
    lastPrayer,
    isRunning,
    elapsedSeconds,
    formattedTime
  } = usePrayer();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-2xl font-bold text-[var(--tsd-neutral-900)] flex items-center gap-3">
          <span className="p-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, var(--tsd-secondary-light), var(--tsd-secondary))' }}>
            <Heart className="w-6 h-6" />
          </span>
          Oração
        </h1>
        <p className="text-sm text-[var(--tsd-neutral-600)] mt-2">
          Dedique tempo a Deus em oração e acompanhe seu progresso
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Timer, label: 'Hoje', value: `${todayMinutes}m`, trend: 'Minutos de oração' },
          { icon: TrendingUp, label: 'Esta Semana', value: `${weekMinutes}m`, trend: `${totalSessions} sessões` },
          { icon: Calendar, label: 'Este Mês', value: `${monthMinutes}m`, trend: `Média ${averageSessionMinutes}m` },
          { icon: Heart, label: 'Total Sessões', value: totalSessions, trend: 'Todas as vezes' },
        ].map((stat, i) => (
          <div key={i} className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${150 + i * 80}ms` }}>
            <StatCard icon={stat.icon} label={stat.label} value={stat.value} trend={stat.trend} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Section */}
        <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-[var(--tsd-primary)]" />
              Sessão de Oração
            </h2>

            <div className="text-center py-8 bg-gradient-to-b from-[var(--tsd-neutral-50)] to-white rounded-xl mb-6 border border-[var(--tsd-neutral-100)]">
              <div className={`transition-transform duration-500 ${isRunning ? 'scale-105' : 'scale-100'}`}>
                <TimerDisplay value={elapsedSeconds} size="lg" className="mb-4" />
              </div>

              <div className="flex items-center justify-center gap-3">
                {!isRunning ? (
                  <Button onClick={start} variant="primary" size="lg" className="flex items-center gap-2 transition-transform hover:scale-105">
                    <Play className="w-5 h-5" />
                    Iniciar
                  </Button>
                ) : (
                  <Button onClick={pause} variant="secondary" size="lg" className="flex items-center gap-2 transition-transform hover:scale-105">
                    <Pause className="w-5 h-5" />
                    Pausar
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Foco da Oração"
                id="prayer-focus"
                value={prayerSession.focus}
                onChange={(e) => setSession(prev => ({ ...prev, focus: e.target.value }))}
                placeholder="Ex: Gratidão, Intercessão, Família..."
              />

              <div>
                <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">Notas</label>
                <textarea
                  value={prayerSession.note}
                  onChange={(e) => setSession(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none resize-none transition-all"
                  placeholder="O que você quer lembrar ou agradecer?"
                />
              </div>

              {feedback && (
                <div className={`p-3 rounded-lg text-sm transition-all duration-300 ${
                  feedback.includes('sucesso') || feedback.includes('registrada')
                    ? 'bg-[var(--tsd-success)]/10 text-[var(--tsd-success)] border border-[var(--tsd-success)]/20'
                    : feedback.includes('Erro')
                    ? 'bg-[var(--tsd-error)]/10 text-[var(--tsd-error)] border border-[var(--tsd-error)]/20'
                    : 'bg-[var(--tsd-info)]/10 text-[var(--tsd-info)] border border-[var(--tsd-info)]/20'
                }`}>
                  {feedback}
                </div>
              )}

              <Button
                onClick={finish}
                variant="success"
                size="lg"
                className="w-full flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                disabled={elapsedSeconds === 0 || isSaving}
              >
                <Check className="w-5 h-5" />
                {isSaving ? 'Salvando...' : 'Finalizar Oração'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Session Info */}
        <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '650ms' }}>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">Informações da Sessão</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[var(--tsd-secondary)]/10 rounded-xl border border-[var(--tsd-secondary)]/20">
                <p className="text-xs font-medium text-[var(--tsd-secondary-dark)] uppercase tracking-wide mb-2">Status Atual</p>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-[var(--tsd-success)] animate-pulse' : 'bg-[var(--tsd-neutral-400)]'}`} />
                  <p className="font-medium text-[var(--tsd-neutral-900)]">{isRunning ? 'Em andamento' : 'Pausada'}</p>
                </div>
                <p className="text-sm text-[var(--tsd-neutral-600)] mt-2">Tempo atual: {formattedTime}</p>
              </div>

              {lastPrayer && (
                <div>
                  <p className="text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wide mb-2">Última Oração</p>
                  <div className="p-3 bg-[var(--tsd-neutral-50)] rounded-lg">
                    <p className="text-sm font-medium text-[var(--tsd-neutral-900)]">{lastPrayer.focus || 'Oração'}</p>
                    <p className="text-xs text-[var(--tsd-neutral-600)] mt-1">
                      {Math.round(lastPrayer.duration / 60)} minutos • {new Date(lastPrayer.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    {lastPrayer.note && <p className="text-xs text-[var(--tsd-neutral-600)] mt-2 line-clamp-2">{lastPrayer.note}</p>}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[var(--tsd-neutral-200)]">
                <h3 className="text-sm font-semibold text-[var(--tsd-neutral-800)] mb-3">Dicas para sua oração</h3>
                <ul className="space-y-2 text-sm text-[var(--tsd-neutral-600)]">
                  <li className="flex items-start gap-2"><span className="text-[var(--tsd-secondary)] mt-0.5">•</span>Comece com gratidão antes dos pedidos</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tsd-secondary)] mt-0.5">•</span>Ore por outros antes de si mesmo</li>
                  <li className="flex items-start gap-2"><span className="text-[var(--tsd-secondary)] mt-0.5">•</span>Anote as respostas às suas orações</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Prayers */}
      <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '800ms' }}>
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">Histórico Recente</h2>
          {prayers.length === 0 ? (
            <p className="text-sm text-[var(--tsd-neutral-500)] text-center py-8">Nenhuma oração registrada ainda. Comece sua primeira sessão!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--tsd-neutral-200)]">
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Foco</th>
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Duração</th>
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Data</th>
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--tsd-neutral-100)]">
                  {prayers.slice(0, 10).map((prayer) => (
                    <tr key={prayer.id} className="hover:bg-[var(--tsd-neutral-50)] transition-colors duration-150">
                      <td className="py-3 text-sm font-medium text-[var(--tsd-neutral-900)]">{prayer.focus || 'Oração'}</td>
                      <td className="py-3 text-sm text-[var(--tsd-neutral-900)]">{Math.round(prayer.duration / 60)}m</td>
                      <td className="py-3 text-sm text-[var(--tsd-neutral-600)]">{new Date(prayer.created_at).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 text-sm text-[var(--tsd-neutral-600)] max-w-xs truncate">{prayer.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Prayer;
