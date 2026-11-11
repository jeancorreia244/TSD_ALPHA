import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-[var(--tsd-neutral-900)] text-center mb-2">
        Entrar na sua conta
      </h2>

      <p className="text-sm text-[var(--tsd-neutral-600)] text-center mb-6">
        Bem-vindo de volta! Continue sua jornada espiritual.
      </p>

      {error && (
        <div className="p-3 bg-[var(--tsd-error)]/10 border border-[var(--tsd-error)]/20 rounded-lg text-[var(--tsd-error)] text-sm" role="alert">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="seu@email.com"
        error={error?.includes('Email') ? error : undefined}
      />

      <Input
        label="Senha"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        placeholder="••••••••"
        error={error?.includes('senha') || error?.includes('Senha') ? error : undefined}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-[var(--tsd-neutral-300)] text-[var(--tsd-primary)] focus:ring-[var(--tsd-primary)]" />
          <span className="text-sm text-[var(--tsd-neutral-600)]">Lembrar-me</span>
        </label>
        <Link to="/signup" className="text-sm text-[var(--tsd-primary)] hover:underline">
          Criar conta
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-[var(--tsd-neutral-600)]">
        Não tem conta?{' '}
        <Link to="/signup" className="text-[var(--tsd-primary)] font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

export default Login;