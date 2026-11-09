'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { dictionaries } from '@/lib/i18n';
import {
  Users,
  Calendar,
  MessageSquare,
  Shield,
  Plus,
  Trash2,
  CheckCircle,
  TrendingUp,
  FileText,
  Save,
  Globe,
  Check,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, loading, isDemo, signInWithGoogle } = useAuth();
  const { refreshContent } = useLanguage();

  // Abas do painel: 'overview' (visão geral e agenda) ou 'content' (gerenciador de textos)
  const [activeTab, setActiveTab] = useState<'overview' | 'content'>('overview');

  // Estado da disponibilidade
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

  // Estado do CMS de Textos
  const [contentSection, setContentSection] = useState<'hero' | 'about' | 'method'>('hero');
  const [editLang, setEditLang] = useState<'en' | 'pt'>('en');
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Textos editáveis carregados
  const [cmsContent, setCmsContent] = useState({
    en: {
      hero: { ...dictionaries.en.hero },
      about: { ...dictionaries.en.about },
      method: { ...dictionaries.en.method },
    },
    pt: {
      hero: { ...dictionaries.pt.hero },
      about: { ...dictionaries.pt.about },
      method: { ...dictionaries.pt.method },
    },
  });

  useEffect(() => {
    // Carregar textos do Supabase se existirem
    const loadSiteContent = async () => {
      try {
        const { data } = await supabase.from('site_content').select('*');
        if (data && data.length > 0) {
          setCmsContent((prev) => {
            const updated = { ...prev };
            data.forEach((row: { key: string; content_en: any; content_pt: any }) => {
              if (row.key in updated.en) {
                (updated.en as any)[row.key] = { ...(updated.en as any)[row.key], ...row.content_en };
              }
              if (row.key in updated.pt) {
                (updated.pt as any)[row.key] = { ...(updated.pt as any)[row.key], ...row.content_pt };
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.warn('Could not load site content from database:', err);
      }
    };

    loadSiteContent();
  }, []);

  const handleTextChange = (field: string, value: string) => {
    setCmsContent((prev) => ({
      ...prev,
      [editLang]: {
        ...prev[editLang],
        [contentSection]: {
          ...(prev[editLang] as any)[contentSection],
          [field]: value,
        },
      },
    }));
  };

  const handleSaveSection = async () => {
    setIsSavingContent(true);
    setSaveSuccess(false);

    try {
      const payloadEn = (cmsContent.en as any)[contentSection];
      const payloadPt = (cmsContent.pt as any)[contentSection];

      const { error } = await supabase.from('site_content').upsert(
        {
          key: contentSection,
          content_en: payloadEn,
          content_pt: payloadPt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) {
        console.error(error);
        alert('Erro ao salvar no Supabase: ' + error.message);
      } else {
        setSaveSuccess(true);
        await refreshContent();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      alert('Erro inesperado: ' + err.message);
    } finally {
      setIsSavingContent(false);
    }
  };

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-300">Carregando painel...</div>;
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full text-center">
          <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Área restrita ao professor</h2>
          <p className="text-sm text-slate-300 mb-6">
            {user ? 'Sua conta não tem permissão de administrador.' : 'Entre com a conta do professor.'}
          </p>
          {!user && (
            <button
              onClick={() => signInWithGoogle(isDemo ? 'admin' : undefined)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm cursor-pointer"
            >
              {isDemo ? 'Entrar como professor (demo)' : 'Entrar com Google'}
            </button>
          )}
          <Link href="/" className="block mt-4 text-xs text-sky-200 hover:underline">← Voltar ao site</Link>
        </div>
      </div>
    );
  }

  const currentSectionData = (cmsContent[editLang] as any)[contentSection] || {};

  return (
    <div className="min-h-screen pb-20">
      {/* Topbar Admin */}
      <nav className="glass border-b border-white/10 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-ink text-sm">
              V
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Teacher Vittor <span className="text-amber-300 font-semibold text-xs ml-1">Painel Admin</span>
            </span>
          </div>

          {/* Abas de Navegação */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Agenda & Alunos</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Editar Textos do Site</span>
            </button>

            <Link
              href="/"
              className="ml-3 px-3.5 py-2 rounded-xl glass hover:bg-white/15 text-slate-200 text-xs font-semibold transition-colors hidden sm:inline-flex"
            >
              Ver Site
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ================= ABA 1: VISÃO GERAL & AGENDA ================= */}
        {activeTab === 'overview' && (
          <>
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass p-6 rounded-3xl border border-white/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Aulas na Semana</p>
                  <h3 className="text-3xl font-black text-white mt-1">18</h3>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12% vs semana passada
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-cyan-300 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Novos Leads / Trials</p>
                  <h3 className="text-3xl font-black text-white mt-1">24</h3>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +5 hoje
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Alunos Ativos</p>
                  <h3 className="text-3xl font-black text-white mt-1">42</h3>
                  <p className="text-[11px] text-slate-300 font-medium mt-1">Retenção: 94%</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Depoimentos Aprovados</p>
                  <h3 className="text-3xl font-black text-white mt-1">16</h3>
                  <p className="text-[11px] text-amber-300 font-medium mt-1">2 aguardando moderação</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Gerenciar Agenda */}
              <div className="lg:col-span-7 glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-300" />
                  Gerenciar Blocos de Horários
                </h3>

                <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                  <div>
                    <label className="text-[11px] font-bold text-sky-200 uppercase block mb-1">Dia</label>
                    <select
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-white/15 bg-slate-800 text-white"
                    >
                      <option>Segunda-feira</option>
                      <option>Terça-feira</option>
                      <option>Quarta-feira</option>
                      <option>Quinta-feira</option>
                      <option>Sexta-feira</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-sky-200 uppercase block mb-1">Início</label>
                    <input
                      type="time"
                      value={newInicio}
                      onChange={(e) => setNewInicio(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-white/15 bg-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-sky-200 uppercase block mb-1">Tipo</label>
                    <select
                      value={newTipo}
                      onChange={(e) => setNewTipo(e.target.value as any)}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-white/15 bg-slate-800 text-white"
                    >
                      <option value="experimental">Experimental</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {availabilitySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="font-bold text-xs text-white">{slot.dia}</span>
                        <span className="text-xs text-slate-300">{slot.inicio} - {slot.fim}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                            slot.tipo === 'experimental'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                          }`}
                        >
                          {slot.tipo}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de Alunos */}
              <div className="lg:col-span-5 glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-300" />
                  Alunos Cadastrados
                </h3>

                <div className="space-y-4">
                  {[
                    { name: 'Michael Smith', email: 'michael@gmail.com', country: 'US 🇺🇸', phone: '+1 555-0199' },
                    { name: 'Sophie Dubois', email: 'sophie.d@orange.fr', country: 'FR 🇫🇷', phone: '+33 6 12 34 56' },
                    { name: 'Lukas Weber', email: 'lukas.w@web.de', country: 'DE 🇩🇪', phone: '+49 170 1234567' },
                    { name: 'Elena Rossi', email: 'elena.rossi@libero.it', country: 'IT 🇮🇹', phone: '+39 340 1234567' },
                  ].map((student, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-white">{student.name}</h4>
                        <p className="text-slate-300 text-[11px]">{student.email}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{student.phone}</p>
                      </div>
                      <span className="font-semibold text-white bg-white/10 px-2.5 py-1 rounded-xl border border-white/15">
                        {student.country}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= ABA 2: EDITAR TEXTOS DO SITE (CMS) ================= */}
        {activeTab === 'content' && (
          <div className="glass rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">CMS Dinâmico</span>
                <h2 className="text-2xl font-black text-white mt-1">Gerenciador de Textos da Landing Page</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Altere qualquer frase do site em Inglês ou Português. As mudanças são refletidas instantaneamente.
                </p>
              </div>

              {/* Seletor de Idioma de Edição */}
              <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/15 self-start sm:self-auto">
                <button
                  onClick={() => setEditLang('en')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🇺🇸 Inglês (EN)
                </button>
                <button
                  onClick={() => setEditLang('pt')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editLang === 'pt' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🇧🇷 Português (PT)
                </button>
              </div>
            </div>

            {/* Sub-abas de Seções */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              {[
                { id: 'hero', label: '🏠 Hero Section' },
                { id: 'method', label: '📚 Método (3 Cards)' },
                { id: 'about', label: '👨‍🏫 Sobre o Professor' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setContentSection(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    contentSection === tab.id
                      ? 'bg-white text-ink shadow-lg font-extrabold'
                      : 'glass text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Formulários dinâmicos por seção */}
            <div className="space-y-6">
              {contentSection === 'hero' && (
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Selo Superior (Badge)</label>
                    <input
                      type="text"
                      value={currentSectionData.badge || ''}
                      onChange={(e) => handleTextChange('badge', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Título Principal</label>
                    <textarea
                      rows={2}
                      value={currentSectionData.title || ''}
                      onChange={(e) => handleTextChange('title', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Subtítulo Explicativo</label>
                    <textarea
                      rows={3}
                      value={currentSectionData.subtitle || ''}
                      onChange={(e) => handleTextChange('subtitle', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Texto do Botão CTA</label>
                      <input
                        type="text"
                        value={currentSectionData.cta || ''}
                        onChange={(e) => handleTextChange('cta', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Sub-texto do Botão</label>
                      <input
                        type="text"
                        value={currentSectionData.ctaSub || ''}
                        onChange={(e) => handleTextChange('ctaSub', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Texto de Prova Social (Abaixo das bandeiras)</label>
                    <input
                      type="text"
                      value={currentSectionData.socialProof || ''}
                      onChange={(e) => handleTextChange('socialProof', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {contentSection === 'method' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Tag da Seção</label>
                      <input
                        type="text"
                        value={currentSectionData.tag || ''}
                        onChange={(e) => handleTextChange('tag', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Título da Seção</label>
                      <input
                        type="text"
                        value={currentSectionData.title || ''}
                        onChange={(e) => handleTextChange('title', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Subtítulo</label>
                    <input
                      type="text"
                      value={currentSectionData.subtitle || ''}
                      onChange={(e) => handleTextChange('subtitle', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
                      <span className="text-xs font-extrabold text-cyan-300">Card 01</span>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Título</label>
                        <input
                          type="text"
                          value={currentSectionData.card1Title || ''}
                          onChange={(e) => handleTextChange('card1Title', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Descrição</label>
                        <textarea
                          rows={3}
                          value={currentSectionData.card1Desc || ''}
                          onChange={(e) => handleTextChange('card1Desc', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-white/10"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
                      <span className="text-xs font-extrabold text-cyan-300">Card 02</span>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Título</label>
                        <input
                          type="text"
                          value={currentSectionData.card2Title || ''}
                          onChange={(e) => handleTextChange('card2Title', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Descrição</label>
                        <textarea
                          rows={3}
                          value={currentSectionData.card2Desc || ''}
                          onChange={(e) => handleTextChange('card2Desc', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-white/10"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
                      <span className="text-xs font-extrabold text-cyan-300">Card 03</span>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Título</label>
                        <input
                          type="text"
                          value={currentSectionData.card3Title || ''}
                          onChange={(e) => handleTextChange('card3Title', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Descrição</label>
                        <textarea
                          rows={3}
                          value={currentSectionData.card3Desc || ''}
                          onChange={(e) => handleTextChange('card3Desc', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-800 text-white text-xs border border-white/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentSection === 'about' && (
                <div className="grid grid-cols-1 gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Tag da Seção</label>
                      <input
                        type="text"
                        value={currentSectionData.tag || ''}
                        onChange={(e) => handleTextChange('tag', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Título</label>
                      <input
                        type="text"
                        value={currentSectionData.title || ''}
                        onChange={(e) => handleTextChange('title', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Biografia (Parágrafo 1)</label>
                    <textarea
                      rows={3}
                      value={currentSectionData.bio1 || ''}
                      onChange={(e) => handleTextChange('bio1', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Biografia (Parágrafo 2)</label>
                    <textarea
                      rows={3}
                      value={currentSectionData.bio2 || ''}
                      onChange={(e) => handleTextChange('bio2', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Tópico com Check 01</label>
                      <input
                        type="text"
                        value={currentSectionData.feature1 || ''}
                        onChange={(e) => handleTextChange('feature1', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Tópico com Check 02</label>
                      <input
                        type="text"
                        value={currentSectionData.feature2 || ''}
                        onChange={(e) => handleTextChange('feature2', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sky-200 uppercase block mb-1.5">Tópico com Check 03</label>
                      <input
                        type="text"
                        value={currentSectionData.feature3 || ''}
                        onChange={(e) => handleTextChange('feature3', e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900/60 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botão Salvar Seção */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <Check className="w-4 h-4" /> Textos salvos com sucesso no Supabase!
                    </span>
                  )}
                </div>

                <button
                  disabled={isSavingContent}
                  onClick={handleSaveSection}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingContent ? 'Salvando no banco...' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
