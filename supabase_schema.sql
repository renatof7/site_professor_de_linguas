-- ==============================================================================
-- SCHEMA DO SUPABASE: PLATAFORMA TEACHER VITTOR (PORTUGUÊS PARA ESTRANGEIROS)
-- ==============================================================================

-- 1. Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela: profiles
-- Vinculada diretamente a auth.users via foreign key
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    whatsapp TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'estudante' CHECK (role IN ('estudante', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Tabela: teacher_availability
-- Horários padrão de disponibilidade do professor por dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
CREATE TABLE IF NOT EXISTS public.teacher_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
    hora_inicio TIME NOT NULL, -- Exemplo: '14:00:00'
    hora_fim TIME NOT NULL,    -- Exemplo: '14:50:00'
    tipo_aula TEXT NOT NULL DEFAULT 'experimental' CHECK (tipo_aula IN ('experimental', 'normal')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Tabela: appointments
-- Agendamentos reais dos alunos salvos com data e hora exatas em UTC
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aluno_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    data_hora_utc TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo_aula TEXT NOT NULL DEFAULT 'experimental' CHECK (tipo_aula IN ('experimental', 'normal')),
    status TEXT NOT NULL DEFAULT 'confirmado' CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')),
    google_calendar_event_id TEXT,
    meet_link TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Tabela: content_videos
-- Vídeos e pílulas de conteúdo do YouTube para alunos
CREATE TABLE IF NOT EXISTS public.content_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    descricao TEXT,
    ordem INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Tabela: testimonials
-- Depoimentos sociais com país de origem
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_aluno TEXT NOT NULL,
    codigo_pais VARCHAR(2) NOT NULL, -- Ex: 'US', 'FR', 'DE', 'JP', 'ES'
    texto_avaliacao TEXT NOT NULL,
    nota SMALLINT NOT NULL DEFAULT 5 CHECK (nota BETWEEN 1 AND 5),
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ==============================================================================
-- TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE AO LOGAR COM GOOGLE OAUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Aluno'),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    -- Se for o email do professor, pode virar admin automaticamente, caso contrário 'estudante'
    CASE 
      WHEN new.email = 'teacher.vittor@gmail.com' THEN 'admin'
      ELSE 'estudante'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Helper function: verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES ---
-- Qualquer usuário logado pode ler seu próprio perfil; Admin pode ler e editar todos
CREATE POLICY "Profiles are viewable by owner or admin"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin());

-- --- TEACHER AVAILABILITY ---
-- Qualquer visitante ou aluno pode ler horários disponíveis
CREATE POLICY "Availability viewable by all"
ON public.teacher_availability FOR SELECT
USING (true);

-- Apenas admin pode inserir/modificar disponibilidade
CREATE POLICY "Only admin can manage availability"
ON public.teacher_availability FOR ALL
USING (public.is_admin());

-- --- APPOINTMENTS ---
-- Aluno vê apenas seus próprios agendamentos; Admin vê todos
CREATE POLICY "Appointments viewable by owner or admin"
ON public.appointments FOR SELECT
USING (auth.uid() = aluno_id OR public.is_admin());

-- Alunos logados podem criar novos agendamentos vinculados ao seu ID
CREATE POLICY "Students can insert appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid() = aluno_id);

-- Alunos e admin podem atualizar agendamentos
CREATE POLICY "Appointments manageable by owner or admin"
ON public.appointments FOR UPDATE
USING (auth.uid() = aluno_id OR public.is_admin());

-- --- CONTENT VIDEOS ---
-- Qualquer usuário logado ou público pode ver vídeos ativos
CREATE POLICY "Videos viewable by authenticated users"
ON public.content_videos FOR SELECT
USING (auth.role() = 'authenticated' OR public.is_admin());

-- Somente admin pode alterar vídeos
CREATE POLICY "Only admin can manage videos"
ON public.content_videos FOR ALL
USING (public.is_admin());

-- --- TESTIMONIALS ---
-- Público pode ver apenas depoimentos aprovados (is_public = true); Admin vê todos
CREATE POLICY "Public testimonials viewable by everyone"
ON public.testimonials FOR SELECT
USING (is_public = true OR public.is_admin());

-- Apenas admin pode criar/editar/aprovar depoimentos
CREATE POLICY "Only admin can manage testimonials"
ON public.testimonials FOR ALL
USING (public.is_admin());

-- ==============================================================================
-- DADOS INICIAIS (SEED DATA)
-- ==============================================================================
INSERT INTO public.teacher_availability (dia_semana, hora_inicio, hora_fim, tipo_aula) VALUES
(1, '09:00:00', '09:50:00', 'experimental'),
(1, '10:00:00', '10:50:00', 'experimental'),
(1, '14:00:00', '14:50:00', 'normal'),
(1, '15:00:00', '15:50:00', 'normal'),
(2, '09:00:00', '09:50:00', 'experimental'),
(2, '11:00:00', '11:50:00', 'normal'),
(3, '14:00:00', '14:50:00', 'experimental'),
(3, '16:00:00', '16:50:00', 'normal'),
(4, '10:00:00', '10:50:00', 'experimental'),
(4, '15:00:00', '15:50:00', 'normal'),
(5, '09:00:00', '09:50:00', 'experimental'),
(5, '11:00:00', '11:50:00', 'experimental');

INSERT INTO public.testimonials (nome_aluno, codigo_pais, texto_avaliacao, nota, is_public) VALUES
('Michael Smith', 'US', 'Teacher Vittor made Portuguese feel so natural and intuitive. In 3 months I went from zero to traveling in Rio with complete confidence!', 5, true),
('Sophie Dubois', 'FR', 'Une méthode communicative exceptionnelle! La prononciation brésilienne n''a plus de secret pour moi.', 5, true),
('Lukas Weber', 'DE', 'Structured yet very friendly and cultural. The focus on real daily Brazilian life was exactly what I needed for my business trip.', 5, true),
('Elena Rossi', 'IT', 'Imparare il portoghese con Vittor è stata un''esperienza fantastica. Lezioni dinamiche e piene di vita!', 5, true);

INSERT INTO public.content_videos (titulo, youtube_id, descricao, ordem) VALUES
('Como soar como um nativo no Brasil: Gírias essenciais', 'dQw4w9WgXcQ', 'Aprenda os segredos da entonação e expressões que você não encontra nos livros.', 1),
('Diferença entre "Por que", "Por quê", "Porque" e "Porquê"', 'dQw4w9WgXcQ', 'Guia definitivo e prático para nunca mais errar.', 2),
('Pedindo comida e café no Brasil sem passar vergonha', 'dQw4w9WgXcQ', 'Simulação de diálogos reais em cafeterias e botecos.', 3);


-- ==============================================================================
-- 7. TABELA: site_content (CMS DINÂMICO PARA TEXTOS DO SITE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  content_en JSONB NOT NULL,
  content_pt JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site content viewable by everyone" ON public.site_content;
CREATE POLICY "Site content viewable by everyone"
ON public.site_content FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Only admin can manage site content" ON public.site_content;
CREATE POLICY "Only admin can manage site content"
ON public.site_content FOR ALL
USING (public.is_admin());
