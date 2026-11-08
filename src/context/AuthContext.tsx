'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, Profile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemo: boolean;
  signInWithGoogle: (demoRole?: 'estudante' | 'admin') => Promise<void>;
  signOut: () => Promise<void>;
  updateWhatsapp: (phone: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isDemo: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateWhatsapp: async () => {},
});

const DEMO_KEY = 'tv_demo_profile';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isSupabaseConfigured;

  const applyDemo = (p: Profile) => {
    setUser({ id: p.id, email: p.email, user_metadata: { full_name: p.nome } } as unknown as User);
    setProfile(p);
  };

  const fetchProfile = async (u: User) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', u.id).single();
      if (data) {
        setProfile(data as Profile);
        return;
      }
    } catch (e) {
      console.error('Erro ao buscar profile:', e);
    }

    // Se ainda não existir a linha na tabela ou se for o e-mail master do professor:
    const isTeacherEmail = u.email?.toLowerCase() === 'teacher.vittor@gmail.com';
    const fallbackProfile: Profile = {
      id: u.id,
      email: u.email || '',
      nome: u.user_metadata?.full_name || u.user_metadata?.name || (isTeacherEmail ? 'Teacher Vittor' : 'Aluno'),
      role: isTeacherEmail ? 'admin' : 'estudante',
    };

    setProfile(fallbackProfile);

    // Se for o professor e a linha ainda não estava como admin no banco, tenta garantir o upsert:
    if (isTeacherEmail) {
      try {
        await supabase.from('profiles').upsert({
          id: u.id,
          email: u.email,
          nome: fallbackProfile.nome,
          role: 'admin',
        });
      } catch (err) {
        console.warn('Upsert de admin silencioso:', err);
      }
    }
  };

  useEffect(() => {
    if (isDemo) {
      try {
        const saved = localStorage.getItem(DEMO_KEY);
        if (saved) applyDemo(JSON.parse(saved));
      } catch {}
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async (demoRole?: 'estudante' | 'admin') => {
    if (isDemo) {
      // Modo demo: sem chaves do Supabase, simula o login para testar o fluxo
      const role = demoRole === 'admin' ? 'admin' : 'estudante';
      const p: Profile = {
        id: `demo-${role}`,
        email: role === 'admin' ? 'professor.demo@gmail.com' : 'aluno.demo@gmail.com',
        nome: role === 'admin' ? 'Teacher Vittor (demo)' : 'John Miller (demo)',
        whatsapp: role === 'admin' ? undefined : '+1 555 234 5678',
        role,
      };
      localStorage.setItem(DEMO_KEY, JSON.stringify(p));
      applyDemo(p);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert('Erro ao conectar ao Google: ' + error.message);
  };

  const signOut = async () => {
    if (isDemo) localStorage.removeItem(DEMO_KEY);
    else await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateWhatsapp = async (phone: string) => {
    if (!user) return;
    if (!isDemo) await supabase.from('profiles').update({ whatsapp: phone }).eq('id', user.id);
    setProfile((prev) => {
      if (!prev) return prev;
      const next = { ...prev, whatsapp: phone };
      if (isDemo) localStorage.setItem(DEMO_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isDemo, signInWithGoogle, signOut, updateWhatsapp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
