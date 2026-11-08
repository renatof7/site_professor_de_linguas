import { createClient } from '@supabase/supabase-js';

// Aceita tanto NEXT_PUBLIC_SUPABASE_ANON_KEY quanto o novo nome NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
// Precisam ser acessadas por nome literal para o Next embutir no bundle do navegador.
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = envUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = envKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// false enquanto o .env.local ainda tem as chaves de exemplo -> o app entra em modo demo
export const isSupabaseConfigured =
  !!envUrl && !envUrl.includes('your-project') && !!envKey && !envKey.includes('your-anon-key');

export type Profile = {
  id: string;
  nome: string;
  email: string;
  whatsapp?: string;
  avatar_url?: string;
  role: 'estudante' | 'admin';
};

export type TeacherAvailability = {
  id: string;
  dia_semana: number; // 0=Domingo, 1=Segunda ... 6=Sábado
  hora_inicio: string; // "14:00:00"
  hora_fim: string; // "14:50:00"
  tipo_aula: 'experimental' | 'normal';
  is_active: boolean;
};

export type Appointment = {
  id: string;
  aluno_id: string;
  data_hora_utc: string;
  tipo_aula: 'experimental' | 'normal';
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  google_calendar_event_id?: string;
  meet_link?: string;
  observacoes?: string;
};

export type Testimonial = {
  id: string;
  nome_aluno: string;
  codigo_pais: string; // ISO 2 letras (US, FR, DE, etc.)
  texto_avaliacao: string;
  nota: number;
  is_public: boolean;
};

export type ContentVideo = {
  id: string;
  titulo: string;
  youtube_id: string;
  descricao?: string;
  ordem: number;
};
