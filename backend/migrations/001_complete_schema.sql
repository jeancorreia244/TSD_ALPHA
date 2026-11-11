// 001_complete_schema.sql - Migração completa do banco de dados
-- Executar no Supabase SQL Editor ANTES de continuar

-- ============================================
-- TABELA: Users (JÁ EXISTE - VERIFICAR)
-- ============================================
CREATE TABLE IF NOT EXISTS public."Users" (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  phone varchar(50),
  password_hash varchar(255) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABELA: Events (JÁ EXISTE - VERIFICAR)
-- ============================================
CREATE TYPE IF NOT EXISTS event_status AS ENUM ('pendente', 'confirmed', 'cancelled');

CREATE TABLE IF NOT EXISTS public."Events" (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  location varchar(255),
  status event_status NOT NULL DEFAULT 'pendente',
  user_id integer NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON public."Events" (user_id);

-- ============================================
-- TABELA: bibles (NOVA)
-- ============================================
CREATE TABLE IF NOT EXISTS public.bibles (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
  book varchar(100) NOT NULL,
  chapter integer NOT NULL,
  verse varchar(50),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bibles_user_id ON public.bibles (user_id);
CREATE INDEX IF NOT EXISTS idx_bibles_book_chapter ON public.bibles (book, chapter);
CREATE INDEX IF NOT EXISTS idx_bibles_created_at ON public.bibles (created_at DESC);

-- ============================================
-- TABELA: prayers (NOVA)
-- ============================================
CREATE TABLE IF NOT EXISTS public.prayers (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
  focus varchar(255),
  note text,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prayers_user_id ON public.prayers (user_id);
CREATE INDEX IF NOT EXISTS idx_prayers_created_at ON public.prayers (created_at DESC);

-- ============================================
-- TABELA: fastings (NOVA)
-- ============================================
CREATE TABLE IF NOT EXISTS public.fastings (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  duration_hours integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fastings_user_id ON public.fastings (user_id);
CREATE INDEX IF NOT EXISTS idx_fastings_created_at ON public.fastings (created_at DESC);

-- ============================================
-- TABELA: devotionals (NOVA)
-- ============================================
CREATE TABLE IF NOT EXISTS public.devotionals (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
  reference varchar(255),
  title varchar(255),
  content text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_devotionals_user_id ON public.devotionals (user_id);
CREATE INDEX IF NOT EXISTS idx_devotionals_date ON public.devotionals (date DESC);
CREATE INDEX IF NOT EXISTS idx_devotionals_created_at ON public.devotionals (created_at DESC);

-- ============================================
-- TABELA: groups (NOVA)
-- ============================================
CREATE TABLE IF NOT EXISTS public.groups (
  id serial PRIMARY KEY,
  created_by integer NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  description text,
  focus varchar(255),
  invite_code varchar(20) NOT NULL UNIQUE,
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_groups_invite_code ON public.groups (invite_code);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups (created_by);

-- ============================================
-- TABELA: group_members (NOVA)
-- ============================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id serial PRIMARY KEY,
  group_id integer NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id integer NOT NULL REFERENCES public."Users"(id) ON DELETE CASCADE,
  role varchar(50) NOT NULL DEFAULT 'Participante',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members (user_id);

-- NOTA: Habilitar RLS após testes iniciais
-- ALTER TABLE public.bibles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can only access own bibles" ON public.bibles
--   FOR ALL USING (auth.uid() = user_id);