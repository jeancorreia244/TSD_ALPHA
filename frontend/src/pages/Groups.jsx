import React, { useState, useEffect } from 'react';
import { useGroups } from '../hooks/useGroups';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { StatCard } from '../components/shared/StatCard';
import { Users, UserPlus, UserCheck, TrendingUp, Search, Copy, CheckCircle } from 'lucide-react';

export function Groups() {
  const {
    name,
    setName,
    description,
    setDescription,
    focus,
    setFocus,
    inviteCode,
    setInviteCode,
    joinCode,
    setJoinCode,
    createGroup,
    joinGroup,
    resetForm,
    resetJoinForm,
    feedback,
    isSaving,
    groups,
    myGroups,
    createdGroups,
    joinedGroups,
    groupStats,
    getGroupRole,
    getMemberCount,
    getGroupProgress,
    searchGroups,
    formatInviteCode,
    validateInviteCode,
    recentGroups,
    groupsByProgress,
    totalMembers,
    averageProgress
  } = useGroups();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedCode, setCopiedCode] = React.useState(null);

  const filteredGroups = searchGroups(searchQuery);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
          <Users className="w-7 h-7 text-[var(--tsd-primary)]" />
          Grupos de Oração
        </h1>
        <p className="text-sm text-[var(--tsd-neutral-600)] mt-1">
          Conecte-se com outros cristãos e cresça juntos em comunidade
        </p>
      </div>

      {/* Stats Grid with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Meus Grupos', value: groupStats.myGroups, trend: `${createdGroups.length} criados` },
          { icon: UserCheck, label: 'Total Membros', value: totalMembers, trend: 'Em todos grupos' },
          { icon: TrendingUp, label: 'Progresso Médio', value: `${averageProgress}%`, trend: 'Consistência' },
          { icon: UserPlus, label: 'Grupos Criados', value: createdGroups.length, trend: `${joinedGroups.length} participando` },
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

        {/* Create Group */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Criar Grupo
          </h2>

          {feedback && feedback.includes('grupo') && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${
              feedback.includes('sucesso') || feedback.includes('criado')
                ? 'bg-[var(--tsd-success)]/10 text-[var(--tsd-success)] border border-[var(--tsd-success)]/20'
                : 'bg-[var(--tsd-error)]/10 text-[var(--tsd-error)] border border-[var(--tsd-error)]/20'
            }`}>
              {feedback}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Nome do Grupo"
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Grupo de Oração Manhã"
            />

            <Input
              label="Foco/Objetivo"
              id="group-focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="Ex: Crescimento espiritual, Missões"
              helper="O que o grupo busca alcançar?"
            />

            <div>
              <label className="block text-sm font-medium text-[var(--tsd-neutral-700)] mb-1.5">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none resize-none"
                placeholder="Descreva o propósito e expectativas do grupo..."
              />
            </div>

            <Input
              label="Código de Convite (opcional)"
              id="group-invite"
              value={inviteCode}
              onChange={(e) => setInviteCode(formatInviteCode(e.target.value))}
              placeholder="G-XXXXXX"
              helper="Deixe em branco para gerar automaticamente"
            />

            <div className="flex gap-3 pt-2">
              <Button
                onClick={createGroup}
                variant="primary"
                size="md"
                className="flex-1"
                disabled={isSaving || !name.trim()}
              >
                {isSaving ? 'Criando...' : 'Criar Grupo'}
              </Button>
              <Button
                onClick={resetForm}
                variant="ghost"
                size="md"
                className="flex-1"
              >
                Limpar Formulário
              </Button>
            </div>
          </div>
        </Card>

        {/* Join Group */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Entrar em Grupo
          </h2>

          {feedback && feedback.includes('entrou') && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${
              feedback.includes('sucesso') || feedback.includes('entrou')
                ? 'bg-[var(--tsd-success)]/10 text-[var(--tsd-success)] border border-[var(--tsd-success)]/20'
                : 'bg-[var(--tsd-error)]/10 text-[var(--tsd-error)] border border-[var(--tsd-error)]/20'
            }`}>
              {feedback}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Código de Convite"
              id="join-code"
              value={joinCode}
              onChange={(e) => {
                const formatted = formatInviteCode(e.target.value);
                setJoinCode(formatted);
              }}
              placeholder="G-XXXXXX"
              helper="Digite o código fornecido pelo líder do grupo"
              error={joinCode && !validateInviteCode(joinCode) ? 'Formato inválido. Use: G-XXXXXX' : undefined}
            />

            <Button
              onClick={joinGroup}
              variant="secondary"
              size="md"
              className="w-full"
              disabled={isSaving || !joinCode.trim() || !validateInviteCode(joinCode)}
            >
              {isSaving ? 'Entrando...' : 'Entrar no Grupo'}
            </Button>

            <Button
              onClick={resetJoinForm}
              variant="ghost"
              size="md"
              className="w-full"
            >
              Limpar
            </Button>

            <div className="pt-4 border-t border-[var(--tsd-neutral-200)]">
              <p className="text-xs text-[var(--tsd-neutral-600)]">
                <strong>Dica:</strong> Os códigos de convite são únicos e gerados automaticamente ao criar um grupo.
                Peça ao líder do grupo o código para participar.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* My Groups */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)]">
            Meus Grupos ({myGroups.length})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tsd-neutral-400)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar grupos..."
              className="pl-10 pr-4 py-2 text-sm text-[var(--tsd-neutral-900)] bg-white border border-[var(--tsd-neutral-300)] rounded-lg focus:border-[var(--tsd-primary)] focus:ring-2 focus:ring-[var(--tsd-primary)] focus:ring-opacity-20 focus:outline-none w-64"
            />
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[var(--tsd-neutral-300)] mx-auto mb-3" />
            <p className="text-[var(--tsd-neutral-500)]">
              {searchQuery
                ? 'Nenhum grupo encontrado com esta busca.'
                : 'Você ainda não participa de nenhum grupo. Crie um ou entre em um existente!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.slice(0, 9).map((group) => {
              const role = getGroupRole(group);
              const memberCount = getMemberCount(group);
              const progress = getGroupProgress(group);

              return (
                <div key={group.id} className="p-4 bg-[var(--tsd-neutral-50)] rounded-xl border border-[var(--tsd-neutral-200)] hover:border-[var(--tsd-primary)] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[var(--tsd-neutral-900)]">
                      {group.name}
                    </h3>
                    {role && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        role === 'Líder'
                          ? 'bg-[var(--tsd-primary)]/10 text-[var(--tsd-primary)]'
                          : 'bg-[var(--tsd-neutral-200)] text-[var(--tsd-neutral-700)]'
                      }`}>
                        {role}
                      </span>
                    )}
                  </div>

                  {group.focus && (
                    <p className="text-xs text-[var(--tsd-neutral-600)] mb-2">
                      🎯 {group.focus}
                    </p>
                  )}

                  {group.description && (
                    <p className="text-sm text-[var(--tsd-neutral-700)] mb-3 line-clamp-2">
                      {group.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-[var(--tsd-neutral-500)] mb-3">
                    <span>{memberCount} membros</span>
                    <span>{progress}% progresso</span>
                  </div>

                  {group.invite_code && (
                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--tsd-neutral-200)]">
                      <code className="text-xs font-mono bg-[var(--tsd-neutral-100)] px-2 py-1 rounded flex-1">
                        {group.invite_code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(group.invite_code)}
                        className="p-1.5 hover:bg-[var(--tsd-neutral-200)] rounded transition-colors"
                        title="Copiar código"
                      >
                        {copiedCode === group.invite_code ? (
                          <CheckCircle className="w-4 h-4 text-[var(--tsd-success)]" />
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--tsd-neutral-400)]" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Recent Groups */}
      {recentGroups.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-[var(--tsd-neutral-800)] mb-4">
            Grupos Recentes
          </h2>
          <div className="space-y-2">
            {recentGroups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-3 bg-[var(--tsd-neutral-50)] rounded-lg">
                <div>
                  <p className="font-medium text-[var(--tsd-neutral-900)]">
                    {group.name}
                  </p>
                  <p className="text-xs text-[var(--tsd-neutral-500)]">
                    {getMemberCount(group)} membros • Criado em {new Date(group.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  getGroupRole(group) === 'Líder'
                    ? 'bg-[var(--tsd-primary)]/10 text-[var(--tsd-primary)]'
                    : 'bg-[var(--tsd-neutral-200)] text-[var(--tsd-neutral-700)]'
                }`}>
                  {getGroupRole(group) || 'Membro'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default Groups;