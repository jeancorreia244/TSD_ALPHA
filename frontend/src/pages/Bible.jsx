import React, { useState, useEffect } from 'react';
import { useBible } from '../hooks/useBible';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { StatCard } from '../components/shared/StatCard';
import { BookOpen, Target, TrendingUp, Calendar } from 'lucide-react';

export function Bible() {
  const {
    bibleBooks,
    selectedBook,
    setSelectedBook,
    selectedChapter,
    setSelectedChapter,
    verse,
    setVerse,
    notes,
    setNotes,
    chaptersForSelectedBook,
    feedback,
    isSaving,
    saveReading,
    resetForm,
    progressPercent,
    uniqueReadings,
    totalChapters,
    todayReadings,
    monthReadings,
    booksRead,
    readingStreak,
    lastReading,
    bibles
  } = useBible();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fix: Restore weekReadings from useBible()
  const { weekReadings } = useBible();

  return (
    <div className="space-y-6">
      {/* NOVO: Versículo do Dia com animação */}
      <div className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
        style={{
          background: 'linear-gradient(135deg, var(--tsd-primary) 0%, var(--tsd-primary-dark) 100%)',
          padding: '2rem 1.5rem',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className={`verse-text transition-all duration-1000 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            "Aquietai-vos e sabei que eu sou Deus; serei exaltado entre as nações, serei exaltado sobre a terra."
          </p>
          <p className={`verse-reference transition-all duration-1000 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}>
            Salmos 46:10
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--tsd-neutral-900)] flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-[var(--tsd-primary)]" />
          Leitura da Bíblia
        </h1>
        <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
          Registre sua leitura diária e acompanhe seu progresso
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Progresso Geral', value: `${progressPercent}%`, trend: `${uniqueReadings}/${totalChapters} capítulos` },
          { icon: BookOpen, label: 'Livros Lidos', value: booksRead, trend: '66 total' },
          { icon: TrendingUp, label: 'Sequência', value: `${readingStreak} dias`, trend: 'Continue!' },
          { icon: Calendar, label: 'Esta Semana', value: todayReadings, trend: `${monthReadings} este mês` },
        ].map((stat, i) => (
          <div key={i} className={`transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: `${150 + i * 80}ms` }}>
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendUp={stat.trend.includes('Continue!') ? true : false}
            />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Form */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
            Registrar Leitura
          </h2>

          {feedback && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${
              feedback.includes('sucesso') || feedback.includes('registrada')
                ? 'bg-[var(--tsd-success)]/10 text-[var(--tsd-success)] border border-[var(--tsd-success)]/20'
                : 'bg-[var(--tsd-error)]/10 text-[var(--tsd-error)] border border-[var(--tsd-error)]/20'
            }`}>
              {feedback}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                Livro
              </label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none"
              >
                <option value="">Selecione um livro</option>
                {bibleBooks.map((book) => (
                  <option key={book.name} value={book.name}>
                    {book.name} ({book.chapters} capítulos)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                Capítulo
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none"
              >
                <option value="">Selecione um capítulo</option>
                {chaptersForSelectedBook.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    Capítulo {chapter}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Versículo (opcional)"
              id="verse"
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              placeholder="Ex: 1-6"
            />

            <Input
              label="Notas (opcional)"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              helper="Reflexões sobre a leitura"
            />

            <div className="flex gap-3 pt-2">
              <Button
                onClick={saveReading}
                variant="primary"
                size="md"
                className="flex-1"
                disabled={isSaving || !selectedBook || !selectedChapter}
              >
                {isSaving ? 'Salvando...' : 'Registrar Leitura'}
              </Button>
              <Button
                onClick={resetForm}
                variant="ghost"
                size="md"
                className="flex-1"
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Progress Visualization */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
            Seu Progresso
          </h2>

          <div className="space-y-6">
            {/* Circular Progress */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="var(--tsd-neutral-200)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="var(--tsd-primary)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDashoffset="${2 * Math.PI * 88 * (1 - progressPercent / 100)}"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[var(--tsd-neutral-900)]">
                    {progressPercent}%
                  </span>
                  <span className="text-sm text-[var(--tsd-neutral-500)]">
                    Concluído
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--tsd-neutral-200)]">
              <div>
                <p className="text-xs text-[var(--tsd-neutral-500)]">Capítulos lidos</p>
                <p className="text-lg font-semibold text-[var(--tsd-neutral-900)]">
                  {uniqueReadings}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--tsd-neutral-500)]">Total disponível</p>
                <p className="text-lg font-semibold text-[var(--tsd-neutral-900)]">
                  {totalChapters}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--tsd-neutral-500)]">Este mês</p>
                <p className="text-lg font-semibold text-[var(--tsd-neutral-900)]">
                  {monthReadings}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--tsd-neutral-500)]">Livros</p>
                <p className="text-lg font-semibold text-[var(--tsd-neutral-900)]">
                  {booksRead}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Readings */}
      <div>
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
            Leituras Recentes
          </h2>
          {bibles.length === 0 ? (
            <p className="text-sm text-[var(--tsd-neutral-500)] text-center py-8">
              Nenhuma leitura registrada ainda. Comece agora!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--tsd-neutral-200)]">
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Livro</th>
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Capítulo</th>
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Versículo</th>
                    <th className="text-left text-xs font-medium text-[var(--tsd-neutral-500)] uppercase tracking-wider py-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--tsd-neutral-100)]">
                  {bibles.slice(0, 10).map((bible) => (
                    <tr key={bible.id} className="hover:bg-[var(--tsd-neutral-50)] transition-colors duration-150">
                      <td className="py-3 text-sm text-[var(--tsd-neutral-900)]">{bible.book}</td>
                      <td className="py-3 text-sm text-[var(--tsd-neutral-900)]">{bible.chapter}</td>
                      <td className="py-3 text-sm text-[var(--tsd-neutral-600)]">{bible.verse || '-'}</td>
                      <td className="py-3 text-sm text-[var(--tsd-neutral-600)]">
                        {new Date(bible.created_at).toLocaleDateString('pt-BR')}
                      </td>
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

export default Bible;