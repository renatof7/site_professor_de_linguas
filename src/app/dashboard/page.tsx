'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  Video,
  Clock,
  ArrowRight,
  BookOpen,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';

export default function StudentDashboard() {
  const { user, profile, signOut, signInWithGoogle, loading, isDemo } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-sky-50 text-slate-500">Carregando...</div>;
  }

  if (user && profile && profile.role !== 'estudante') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-xl max-w-md">
          <p className="text-slate-700 mb-4">Esta área é exclusiva para alunos.</p>
          <Link href="/admin" className="text-blue-600 font-bold">Ir para o painel do professor →</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-blue-950 mb-2">Área do Aluno</h2>
          <p className="text-slate-600 text-sm mb-6">
            Por favor, faça login com a sua conta Google cadastrada para acessar suas aulas e materiais.
          </p>
          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
          >
            Entrar com Google
          </button>
          {isDemo && (
            <p className="mt-4 text-xs text-amber-600">
              Modo demo: o Supabase ainda não está configurado, o login é simulado.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50/60 pb-16">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-sky-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              V
            </div>
            <span className="font-extrabold text-blue-950 text-base">
              Teacher Vittor <span className="font-normal text-xs text-blue-600">| Portal do Aluno</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Boas-vindas */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Dashboard
            </span>
            <h1 className="text-3xl font-black text-blue-950">
              Olá, {profile?.nome || 'Estudante'}! 👋
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Gerencie seus agendamentos de aulas e acesse materiais de apoio de português brasileiro.
            </p>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer self-start md:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Nova Aula Regular</span>
          </button>
        </div>

        {/* Grade de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda: Próximas Aulas (7 colunas) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-blue-900/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Próxima Aula Confirmada
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  Confirmado
                </span>
              </div>

              {/* Card da Aula */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg shadow-blue-600/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs text-sky-200 uppercase tracking-wider font-semibold block mb-1">
                      Aula Individual 1:1
                    </span>
                    <h3 className="text-xl font-extrabold">Conversação Prática & Pronúncia</h3>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 self-start text-xs font-semibold">
                    50 minutos
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-sky-100 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-300" />
                    <span>Amanhã às 14:00 (Seu Horário)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <a
                    href="https://meet.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs shadow hover:bg-sky-50 transition-all"
                  >
                    <Video className="w-4 h-4 text-green-600" />
                    <span>Entrar no Google Meet</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>

                  <span className="text-xs text-sky-200">Link enviado também para seu e-mail</span>
                </div>
              </div>
            </div>

            {/* Dica da semana */}
            <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-blue-950 text-sm mb-1">Meta para esta semana:</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Assista ao vídeo curto sobre as contrações informais (&ldquo;tá&rdquo;, &ldquo;pra&rdquo;, &ldquo;cê&rdquo;) e tente usá-las pelo menos 3 vezes durante nossa próxima aula de conversação!
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Biblioteca de Vídeos & Materiais (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-blue-900/5">
              <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Biblioteca de Dicas Exclusivas
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: 'Como soar como um nativo no Brasil',
                    desc: 'Expressões do dia a dia e entonação.',
                    id: 'dQw4w9WgXcQ',
                  },
                  {
                    title: 'Diferença prática de "Por que" e "Porque"',
                    desc: 'Dicas práticas para mensagens de texto.',
                    id: 'dQw4w9WgXcQ',
                  },
                  {
                    title: 'Pedindo comida e café sem sotaque gringo',
                    desc: 'Vocabulário essencial de cardápio.',
                    id: 'dQw4w9WgXcQ',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 hover:bg-sky-50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-blue-950 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Agendamento configurado para aula normal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tipoAula="normal"
      />
    </div>
  );
}
