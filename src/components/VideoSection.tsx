'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Play, Lock, X } from 'lucide-react';
import { ContentVideo } from '@/lib/supabase';

// TODO: substituir por SELECT na tabela `content_videos` e trocar os youtube_id reais
const videos: ContentVideo[] = [
  { id: '1', titulo: 'Como soar como um nativo: gírias e entonação', youtube_id: 'dQw4w9WgXcQ', descricao: 'As contrações do dia a dia (pra, cê, né) que fazem você soar fluente.', ordem: 1 },
  { id: '2', titulo: 'Por que, por quê, porque ou porquê?', youtube_id: 'dQw4w9WgXcQ', descricao: 'Explicação prática com exemplos reais de conversas no WhatsApp.', ordem: 2 },
  { id: '3', titulo: 'Pedindo comida e café sem passar vergonha', youtube_id: 'dQw4w9WgXcQ', descricao: 'Vocabulário de padaria, boteco e restaurante com frases prontas.', ordem: 3 },
];

const gradients = [
  'from-blue-600 to-cyan-400',
  'from-indigo-600 to-blue-400',
  'from-cyan-500 to-lime-300',
];

export function VideoSection() {
  const { t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();
  const [selected, setSelected] = useState<ContentVideo | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <section id="videos" className="bg-transparent py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-200 font-bold uppercase">— {t.videos.tag}</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              {t.videos.title}
            </h2>
          </div>
          <p className="text-sky-100 text-lg lg:max-w-md lg:ml-auto">{t.videos.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => (user ? setSelected(v) : setShowLogin(true))}
              className="group text-left glass rounded-[2rem] overflow-hidden border border-white/10 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className={`relative aspect-video bg-gradient-to-br ${gradients[i % 3]} flex items-center justify-center overflow-hidden`}>
                <span className="font-display italic absolute -bottom-8 -right-2 text-[9rem] leading-none text-white/10 select-none">
                  {i + 1}
                </span>
                <span className="relative w-16 h-16 rounded-full glass/95 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  {user ? <Play className="w-6 h-6 fill-ink ml-0.5" /> : <Lock className="w-6 h-6" />}
                </span>
                {!user && (
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 text-[11px] font-semibold text-white backdrop-blur">
                    <Lock className="w-3 h-3 text-cyan-100" /> Login
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-white group-hover:text-cyan-200 font-bold transition-colors leading-snug">{v.titulo}</h3>
                <p className="mt-2 text-sm text-sky-100 line-clamp-2">{v.descricao}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in">
          <div className="relative glass border border-white/10 rounded-[2rem] max-w-md w-full p-8 text-center shadow-2xl">
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 p-2 text-sky-100 hover:text-white rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white mx-auto flex items-center justify-center mb-6">
              <Lock className="w-7 h-7" />
            </div>
            <p className="text-slate-100 mb-8 leading-relaxed">{t.videos.watchPrompt}</p>
            <button
              onClick={() => { setShowLogin(false); signInWithGoogle(); }}
              className="w-full py-3.5 rounded-full glass text-white font-bold hover:bg-sky-400/20 transition-colors cursor-pointer"
            >
              {t.videos.loginToUnlock}
            </button>
          </div>
        </div>
      )}

      {selected && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent/80 backdrop-blur-md">
          <div className="bg-black rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-10 text-white bg-black/60 p-2 rounded-full hover:bg-black">
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selected.youtube_id}?autoplay=1`}
                title={selected.titulo}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
