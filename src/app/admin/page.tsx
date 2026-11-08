'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Calendar,
  Video,
  MessageSquare,
  Shield,
  Plus,
  Trash2,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, loading, isDemo, signInWithGoogle } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando...</div>;
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center">
          <Shield className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Área restrita ao professor</h2>
          <p className="text-sm text-slate-600 mb-6">
            {user ? 'Sua conta não tem permissão de administrador.' : 'Entre com a conta do professor.'}
          </p>
          {!user && (
            <button
              onClick={() => signInWithGoogle(isDemo ? 'admin' : undefined)}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm cursor-pointer"
            >
              {isDemo ? 'Entrar como professor (demo)' : 'Entrar com Google'}
            </button>
          )}
          <Link href="/" className="block mt-4 text-xs text-slate-500 hover:text-blue-600">← Voltar ao site</Link>
        </div>
      </div>
    );
  }

  const [availabilitySlots, setAvailabilitySlots] = useState([
    { id: '1', dia: 'Segunda-feira', inicio: '09:00', fim: '09:50', tipo: 'experimental' },
    { id: '2', dia: 'Segunda-feira', inicio: '14:00', fim: '14:50', tipo: 'normal' },
    { id: '3', dia: 'Terça-feira', inicio: '10:00', fim: '10:50', tipo: 'experimental' },
    { id: '4', dia: 'Quarta-feira', inicio: '15:00', fim: '15:50', tipo: 'normal' },
  ]);

  const [newDay, setNewDay] = useState('Segunda-feira');
  const [newInicio, setNewInicio] = useState('11:00');
  const [newFim, setNewFim] = useState('11:50');
  const [newTipo, setNewTipo] = useState<'experimental' | 'normal'>('experimental');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setAvailabilitySlots([
      ...availabilitySlots,
      {
        id: Date.now().toString(),
        dia: newDay,
        inicio: newInicio,
        fim: newFim,
        tipo: newTipo,
      },
    ]);
  };

  const handleRemoveSlot = (id: string) => {
    setAvailabilitySlots(availabilitySlots.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Topbar Admin */}
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
              V
            </div>
            <span className="font-extrabold text-base tracking-tight">
              Teacher Vittor <span className="text-amber-400 font-semibold text-xs ml-1">Painel Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">admin@teachervittor.com</span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Ver Landing Page
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Métricas Principais (Visão Geral) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Aulas na Semana
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">18</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% vs semana passada
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Novos Leads / Trials
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">24</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +5 hoje
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Alunos Ativos
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">42</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Taxa de retenção: 94%
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Depoimentos Aprovados
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">16</h3>
              <p className="text-[11px] text-amber-600 font-medium mt-1">
                2 aguardando aprovação
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gerenciar Agenda (tabela teacher_availability) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Gerenciar Blocos de Disponibilidade
            </h3>

            {/* Formulário de novo bloco */}
            <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Dia</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option>Segunda-feira</option>
                  <option>Terça-feira</option>
                  <option>Quarta-feira</option>
                  <option>Quinta-feira</option>
                  <option>Sexta-feira</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Início</label>
                <input
                  type="time"
                  value={newInicio}
                  onChange={(e) => setNewInicio(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Tipo</label>
                <select
                  value={newTipo}
                  onChange={(e) => setNewTipo(e.target.value as any)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="experimental">Experimental</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
            </form>

            {/* Lista de Blocos */}
            <div className="space-y-2">
              {availabilitySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-xs text-slate-800">{slot.dia}</span>
                    <span className="text-xs text-slate-500">
                      {slot.inicio} - {slot.fim}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                        slot.tipo === 'experimental'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {slot.tipo}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveSlot(slot.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Alunos e Leads Recentes */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Alunos e Leads Cadastrados
            </h3>

            <div className="space-y-4">
              {[
                { name: 'Michael Smith', email: 'michael@gmail.com', country: 'US 🇺🇸', role: 'estudante', phone: '+1 555-0199' },
                { name: 'Sophie Dubois', email: 'sophie.d@orange.fr', country: 'FR 🇫🇷', role: 'estudante', phone: '+33 6 12 34 56' },
                { name: 'Lukas Weber', email: 'lukas.w@web.de', country: 'DE 🇩🇪', role: 'estudante', phone: '+49 170 1234567' },
                { name: 'Elena Rossi', email: 'elena.rossi@libero.it', country: 'IT 🇮🇹', role: 'estudante', phone: '+39 340 1234567' },
              ].map((student, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{student.name}</h4>
                    <p className="text-slate-500 text-[11px]">{student.email}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{student.phone}</p>
                  </div>
                  <span className="font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    {student.country}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
