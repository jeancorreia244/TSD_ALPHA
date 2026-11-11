import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';

export function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, phone);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[var(--tsd-neutral-900)] text-center mb-2">
        Criar nova conta
      </h2>

      <p className="text-sm text-[var(--tsd-neutral-600)] text-center mb-6">
        Comece sua jornada de crescimento espiritual hoje.
      </p>

      {error && (
        <div className="p-3 bg-[var(--tsd-error)]/10 border border-[var(--tsd-error)]/20 rounded-lg text-[var(--tsd-error)] text-sm" role="alert">
          {error}
        </div>
      )}

      <Input
        label="Nome completo"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Seu nome"
      />

      <Input
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="seu@email.com"
      />

      <Input
        label="Senha"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        helper="Deve conter maiúscula, minúscula e número"
      />

      <Input
        label="Telefone (opcional)"
        type="tel"
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+5511999999999"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-6"
        disabled={loading}
      >
        {loading ? 'Criando conta...' : 'Criar conta'}
      </Button>

      <p className="text-center text-sm text-[var(--tsd-neutral-600)] mt-4">
        Já tem conta?{' '}
        <Link to="/login" className="text-[var(--tsd-primary)] font-medium hover:underline">
          Entrar
        </Link>
      </p>

      <div className="mt-6 pt-6 border-t border-[var(--tsd-neutral-200)]">
        <p className="text-xs text-[var(--tsd-neutral-500)] text-center">
          Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </form>
  );
}

export default Signup;