'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Destino do redirect do Google OAuth: o supabase-js troca o código pela sessão automaticamente.
export default function AuthCallback() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      const isTeacher = user.email?.toLowerCase().trim() === 'teacher.vittor@gmail.com';
      const isAdmin = profile?.role === 'admin' || isTeacher;
      router.replace(isAdmin ? '/admin' : '/dashboard');
    } else {
      const t = setTimeout(() => router.replace('/'), 4000);
      return () => clearTimeout(t);
    }
  }, [user, profile, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink text-slate-300">
      Entrando...
    </div>
  );
}
