import React, { useEffect } from 'react';
import { useDevotional } from '../hooks/useDevotional';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { StatCard } from '../components/shared/StatCard';
import { PenTool, Calendar, TrendingUp, BookOpen, Search, Flame } from 'lucide-react';

export function Devotional() {
  const {
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
    devotionalsByMonth,
    recentDevotionals,
    searchDevotionals,
    devotionals
  } = useDevotional();

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDevotionals = searchDevotionals(searchQuery);

  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--tsd-neutral-900)] flex items-center gap-3">
          <PenTool className="w-7 h-7 text-[var(--tsd-info)]" />
          Devocional
        </h1>
        <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
          Escreva suas reflexões e meditações diárias na Palavra
        </p>
      </div>

      {/* Stats Grid with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[

          { icon: BookOpen, label: 'Total Devocionais', value: totalCount, trend: `${yearDevotionals} este ano` },
          { icon: Calendar, label: 'Esta Semana', value: weekDevotionals, trend: `${todayDevotionals} hoje` },
          { icon: TrendingUp, label: 'Média Palavras', value: formatWords(averageWords), trend: totalWords > 0 ? `Total: ${formatWords(totalWords)}` : '' },
          { icon: Flame, label: 'Sequência', value: `${devotionalsByMonth ? Object.keys(devotionalsByMonth).length : 0} meses`, trend: 'Consistência' },

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
            Novo Devocional
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
            <Input
              label="Referência Bíblica (opcional)"
              id="dev-reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: Filipenses 4:6-7"
            />

            <Input
              label="Título (opcional)"
              id="dev-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da reflexão"
            />

            <div>
              <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                Conteúdo
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none resize-y min-h-[120px]"
                placeholder="Escreva sua reflexão, o que Deus falou ao seu coração..."
              />
              <p className="text-xs text-[var(--tsd-neutral-500)] mt-1 text-right">
                {content.trim().split(/\w+/).filter(Boolean).length} palavras • ~{getReadingTime(content)} min leitura
              </p>
            </div>

            <Input
              label="Data"
              type="date"
              id="dev-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="flex gap-3 pt-2">
              <Button
                onClick={saveDevotional}
                variant="primary"
                size="md"
                className="flex-1"
                disabled={isSaving || !content.trim()}
              >
                {isSaving ? 'Salvando...' : 'Salvar Devocional'}
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

        {/* Tips & Info */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
            Dicas para Devocional
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-[var(--tsd-info)]/10 rounded-xl border border-[var(--tsd-info)]/20">
              <h3 className="font-semibold text-[var(--tsd-neutral-900)] mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--tsd-info)]" />
                Método SOAP
              </h3>
              <ul className="space-y-1.5 text-sm text-[var(--tsd-neutral-700)]">
                <li>• <strong>S - Scripture:</strong> Escreva o versículo</li>
                <li>• <strong>O - Observation:</strong> O que você observa?</li>
                <li>• <strong>A - Application:</strong> Como aplicar na vida?</li>
                <li>• <strong>P - Prayer:</strong> Ore sobre isso</li>
              </ul>
            </div>

            {lastDevotional && (
              <div>
                <p className="text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wide mb-2">
                  Último Devocional
                </p>
                <div className="p-3 bg-[var(--tsd-neutral-50)] rounded-lg">
                  <p className="text-sm font-medium text-[var(--tsd-neutral-900)]">
                    {lastDevotional.title || lastDevotional.reference || 'Devocional'}
                  </p>
                  <p className="text-xs text-[var(--tsd-neutral-600)] mt-1">
                    {formatWords(lastDevotional.content?.trim().split(/\w+/).filter(Boolean).length || 0)} palavras • {new Date(lastDevotional.date || lastDevotional.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--tsd-neutral-200)]">
              <h3 className="text-sm font-semibold text-[var(--tsd-neutral-800)] mb-2">Dicas</h3>
              <ul className="space-y-2 text-sm text-[var(--tsd-neutral-600)]">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsd-info)] mt-0.5">•</span>
                  Escreva com o coração aberto
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsd-info)] mt-0.5">•</span>
                  Seja honesto com Deus
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsd-info)] mt-0.5">•</span>
                  Revise devocionais passados mensalmente
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Devotionals */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)]">
            Histórico
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tsd-neutral-400)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar devocionais..."
              className="pl-10 pr-8 py-2 px-3 text-sm text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none w-64"
            />
          </div>
        </div>

        {filteredDevotionals.length === 0 ? (
          <p className="text-sm text-[var(--tsd-neutral-500)] text-center py-8">
            {devotionals.length === 0
              ? 'Nenhum devocional registrado ainda. Escreva o primeiro!'
              : 'Nenhum devocional encontrado com esta busca.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredDevotionals.slice(0, 10).map((devotional) => (
              <div
                key={devotional.id}
                className="p-4 bg-[var(--tsd-neutral-50)] rounded-lg hover:bg-[var(--tsd-neutral-100)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-[var(--tsd-neutral-900)]">
                        {devotional.title || devotional.reference || 'Devocional'}
                      </span>
                      {devotional.reference && (
                        <span className="text-xs px-2 py-1 bg-[var(--tsd-info)]/10 text-[var(--tsd-info)] rounded-full">
                          {devotional.reference}
                        </span>
                      )}
                      <span className="text-xs text-[var(--tsd-neutral-500)]">
                        {new Date(devotional.date || devotional.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--tsd-neutral-600)] line-clamp-2">
                      {devotional.content}
                    </p>
                    <p className="text-xs text-[var(--tsd-neutral-400)] mt-1">
                      {devotional.content.trim().split(/\w+/).filter(Boolean).length} palavras
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Devotional;