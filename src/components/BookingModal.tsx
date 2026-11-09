'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  CheckCircle,
  LogIn,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  Video,
} from 'lucide-react';
import { TeacherAvailability, supabase } from '@/lib/supabase';
import { format, addDays, isSameDay } from 'date-fns';

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tipoAula?: 'experimental' | 'normal';
};

const defaultAvailability: TeacherAvailability[] = [
  { id: '1', dia_semana: 1, hora_inicio: '13:00', hora_fim: '13:50', tipo_aula: 'experimental', is_active: true },
  { id: '2', dia_semana: 1, hora_inicio: '15:00', hora_fim: '15:50', tipo_aula: 'experimental', is_active: true },
  { id: '3', dia_semana: 2, hora_inicio: '10:00', hora_fim: '10:50', tipo_aula: 'experimental', is_active: true },
  { id: '4', dia_semana: 2, hora_inicio: '14:00', hora_fim: '14:50', tipo_aula: 'experimental', is_active: true },
  { id: '5', dia_semana: 3, hora_inicio: '11:00', hora_fim: '11:50', tipo_aula: 'experimental', is_active: true },
  { id: '6', dia_semana: 3, hora_inicio: '16:00', hora_fim: '16:50', tipo_aula: 'experimental', is_active: true },
  { id: '7', dia_semana: 4, hora_inicio: '09:00', hora_fim: '09:50', tipo_aula: 'experimental', is_active: true },
  { id: '8', dia_semana: 4, hora_inicio: '15:00', hora_fim: '15:50', tipo_aula: 'experimental', is_active: true },
  { id: '9', dia_semana: 5, hora_inicio: '10:00', hora_fim: '10:50', tipo_aula: 'experimental', is_active: true },
  { id: '10', dia_semana: 5, hora_inicio: '14:00', hora_fim: '14:50', tipo_aula: 'experimental', is_active: true },
];

export function BookingModal({ isOpen, onClose, tipoAula = 'experimental' }: BookingModalProps) {
  const { t } = useLanguage();
  const { user, profile, signInWithGoogle, updateWhatsapp } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userTimezone, setUserTimezone] = useState<string>('UTC');
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [whatsappInput, setWhatsappInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [meetLinkCreated, setMeetLinkCreated] = useState<string>('');

  // 1. Detectar fuso horário do navegador automaticamente
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setUserTimezone(tz);
    } catch {
      setUserTimezone('America/Sao_Paulo');
    }
  }, []);

  // Sincronizar WhatsApp do perfil
  useEffect(() => {
    if (profile?.whatsapp) {
      setWhatsappInput(profile.whatsapp);
    }
  }, [profile]);

  if (!isOpen) return null;

  // Gerar os próximos 7 dias úteis para seleção
  const upcomingDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  // Filtrar horários disponíveis para o dia da semana selecionado
  const selectedDayOfWeek = selectedDate.getDay();
  const availableSlots = defaultAvailability.filter(
    (slot) => slot.dia_semana === selectedDayOfWeek && slot.tipo_aula === tipoAula
  );

  const handleNextToStep2 = () => {
    if (!selectedSlot) return;
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    try {
      // Atualizar whatsapp se fornecido
      if (whatsappInput && updateWhatsapp) {
        await updateWhatsapp(whatsappInput);
      }

      // Simulação da chamada de API para Google Calendar + Inserção no Supabase
      const generatedMeetLink = `https://meet.google.com/abc-${Math.random().toString(36).substring(2, 6)}-xyz`;
      setMeetLinkCreated(generatedMeetLink);

      // Salvar no Supabase se logado
      if (user) {
        const [hours, minutes] = (selectedSlot || '14:00').split(':');
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

        await supabase.from('appointments').insert({
          aluno_id: user.id,
          data_hora_utc: appointmentDate.toISOString(),
          tipo_aula: tipoAula,
          status: 'confirmado',
          google_calendar_event_id: `gcal_${Date.now()}`,
          meet_link: generatedMeetLink,
        });
      }

      // Avançar para a tela de sucesso
      setStep(3);
    } catch (err) {
      console.error(err);
      setStep(3); // Garante a conclusão da demo
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass rounded-3xl max-w-2xl w-full shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-sky-50 border-b border-white/15 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 font-bold block">
              Passo {step} de 3
            </span>
            <h2 className="text-xl font-bold text-white font-extrabold">
              {step === 1 && t.modal.step1Title}
              {step === 2 && t.modal.step2Title}
              {step === 3 && t.modal.step3Title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-sky-100 hover:text-white hover:glass rounded-2xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress bar */}
        <div className="w-full bg-sky-100 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Corpo do Wizard */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* ================= PASSO 1: CALENDÁRIO & TIMEZONE ================= */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Aviso do Fuso Horário Local */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80/80 border border-blue-100 text-cyan-100 font-bold text-xs sm:text-sm">
                <Globe className="w-5 h-5 text-cyan-200 font-bold shrink-0" />
                <div>
                  <span className="text-slate-100 block sm:inline">
                    {t.modal.timezoneNotice}{' '}
                  </span>
                  <strong className="text-cyan-100 font-bold underline font-bold">
                    {userTimezone}
                  </strong>
                </div>
              </div>

              {/* Seletor de Dias */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-3">
                  Selecione o Dia:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {upcomingDays.map((day, idx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedSlot(null);
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-bold'
                            : 'glass border-white/15 hover:border-blue-300 text-white font-medium'
                        }`}
                      >
                        <span className="text-[10px] uppercase block opacity-80">
                          {format(day, 'EEE')}
                        </span>
                        <span className="text-lg font-bold block">
                          {format(day, 'dd')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor de Horários */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-3">
                  Horários Disponíveis (no seu horário local):
                </label>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.hora_inicio;
                      return (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.hora_inicio)}
                          className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-[1.02]'
                              : 'glass border-white/15 hover:border-blue-300 text-white'
                          }`}
                        >
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-cyan-200 font-bold'}`} />
                          <span>{slot.hora_inicio.substring(0, 5)}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-slate-900/80 border border-dashed border-white/15 text-white text-xs sm:text-sm">
                    {t.modal.noSlots}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= PASSO 2: IDENTIFICAÇÃO (GOOGLE & WHATSAPP) ================= */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Resumo da data selecionada */}
              <div className="p-4 rounded-2xl bg-slate-800/80/70 border border-blue-100 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white font-extrabold block">
                      {format(selectedDate, 'dd/MM/yyyy')} às {selectedSlot}
                    </span>
                    <span className="text-xs text-white">
                      Fuso horário: {userTimezone}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-cyan-200 font-bold font-bold hover:underline"
                >
                  Alterar
                </button>
              </div>

              {!user ? (
                /* Se NÃO está logado: Botão Login com Google obrigatório */
                <div className="text-center py-6 px-4 bg-slate-800/80/50 rounded-2xl border border-white/15">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-cyan-200 font-bold mx-auto flex items-center justify-center mb-4">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">
                    Faça login para continuar
                  </h3>
                  <p className="text-slate-100 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                    {t.modal.loginRequired}
                  </p>

                  <button
                    onClick={() => signInWithGoogle()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl glass border border-white/20 shadow-md hover:shadow-lg text-white font-bold text-sm transition-all hover:bg-slate-900/80 cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Entrar com Google e Prosseguir</span>
                  </button>
                </div>
              ) : (
                /* Se JÁ está logado: Exibir dados do usuário + Input de WhatsApp */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl glass border border-white/15 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {profile?.nome || user.user_metadata?.full_name || 'Aluno'}
                      </p>
                      <p className="text-xs text-white">{user.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                      {t.modal.whatsappLabel}
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-sky-100 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={whatsappInput}
                        onChange={(e) => setWhatsappInput(e.target.value)}
                        placeholder={t.modal.whatsappPlaceholder}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                      />
                    </div>
                    <span className="text-[11px] text-white mt-1 block">
                      Usamos apenas para enviar lembretes e materiais da aula.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= PASSO 3: SUCESSO ================= */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              {/* Ícone Animado */}
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white font-extrabold mb-2">
                  {t.modal.successTitle}
                </h3>
                <p className="text-slate-100 text-sm max-w-md mx-auto leading-relaxed">
                  {t.modal.successDesc}
                </p>
              </div>

              {/* Box com Link Google Meet */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/15 max-w-md mx-auto text-left flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-green-600 text-white">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-100">
                      Sala Google Meet Gerada
                    </span>
                    <p className="text-xs font-bold text-cyan-100 font-bold truncate max-w-[200px] sm:max-w-xs">
                      {meetLinkCreated || 'https://meet.google.com/abc-demo-xyz'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão Ir para o Painel */}
              <div>
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all"
                >
                  <span>{t.modal.goToDashboard}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer com botões de navegação */}
        {step !== 3 && (
          <div className="px-6 py-4 bg-slate-900/80 border-t border-white/10 flex items-center justify-between">
            {step === 2 ? (
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-xs font-bold text-slate-100 hover:text-white px-3 py-2 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                disabled={!selectedSlot}
                onClick={handleNextToStep2}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all ml-auto"
              >
                <span>Avançar para Identificação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && user && (
              <button
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 disabled:opacity-60 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all ml-auto"
              >
                <span>{isSubmitting ? t.modal.confirming : t.modal.confirmBtn}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
