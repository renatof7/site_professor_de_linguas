'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight, Sparkles, Star, Video, Globe2, Check } from 'lucide-react';

const countries = ['🇺🇸 USA', '🇫🇷 France', '🇩🇪 Germany', '🇯🇵 Japan', '🇮🇹 Italy', '🇬🇧 UK', '🇪🇸 Spain', '🇨🇦 Canada', '🇳🇱 Netherlands', '🇰🇷 Korea', '🇸🇪 Sweden', '🇦🇺 Australia'];

export function Hero({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { t, locale } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-transparent pt-36 md:pt-44">
      {/* Background */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7">
            <div className="animate-rise inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-sky-300">
              <Sparkles className="w-3.5 h-3.5" />
              {t.hero.badge}
            </div>

            <h1 className="animate-rise mt-7 text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15]" style={{ animationDelay: '0.1s' }}>
              {locale === 'pt' ? (
                <>
                  Fale português{' '}
                  <span className="font-display italic font-medium text-gradient pr-1">
                    como se
                  </span>{' '}
                  <span className="font-display italic font-medium text-gradient pr-1">
                    vive
                  </span>{' '}
                  no Brasil.
                </>
              ) : (
                <>
                  Speak Portuguese{' '}
                  <span className="font-display italic font-medium text-gradient pr-1">
                    the way Brazil lives it.
                  </span>
                </>
              )}
            </h1>

            <p className="animate-rise mt-7 max-w-xl text-lg text-slate-100/95 font-normal leading-relaxed drop-shadow-sm" style={{ animationDelay: '0.2s' }}>
              {t.hero.subtitle}
            </p>

            <div className="animate-rise mt-10 flex flex-col sm:flex-row sm:items-center gap-5" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={onOpenBooking}
                className="group inline-flex items-center justify-center gap-3 pl-8 pr-3 py-3 rounded-full glass text-white font-bold text-lg hover:bg-slate-900/80 hover:border-white/20 transition-colors cursor-pointer"
              >
                {t.hero.cta}
                <span className="w-11 h-11 rounded-full glass/10 border border-white/15 text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </button>
              <p className="text-sm text-sky-100/80 max-w-[220px] leading-snug">{t.hero.ctaSub}</p>
            </div>

            <div className="animate-rise mt-12 flex items-center gap-4" style={{ animationDelay: '0.4s' }}>
              <div className="flex -space-x-2">
                {['🇺🇸', '🇫🇷', '🇩🇪', '🇯🇵'].map((f) => (
                  <span key={f} className="w-10 h-10 rounded-full glass ring-2 ring-ink flex items-center justify-center text-lg border border-white/10">
                    {f}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-cyan-400/40 mt-0.5">{t.hero.socialProof}</p>
              </div>
            </div>
          </div>

          {/* Visual: conversation mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative glass rounded-[2rem] p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black">V</div>
                    <div>
                      <p className="text-sm font-bold text-white">Teacher Vittor</p>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ao vivo · Google Meet
                      </p>
                    </div>
                  </div>
                  <Video className="w-5 h-5 text-sky-100/80" />
                </div>

                <div className="space-y-3 text-sm">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm glass/10 px-4 py-3 text-cyan-400/40">
                    Oi! Tudo bem? 👋
                  </div>
                  <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-sm bg-gradient-to-br from-blue-600 to-blue-500 px-4 py-3 text-white">
                    Tudo ótimo! Hoje eu quero pedir um café.
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm glass/10 px-4 py-3 text-cyan-400/40">
                    Perfeito! Diga: <span className="text-sky-300 font-semibold">“Me vê um cafezinho, por favor?”</span> ☕
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 pl-1">
                    <Check className="w-3.5 h-3.5" /> Pronúncia 94% natural
                  </div>
                </div>
              </div>

              <div className="animate-float absolute -top-6 -right-4 glass rounded-2xl px-4 py-3 bg-slate-900/70">
                <p className="text-2xl font-extrabold text-white leading-none">7+</p>
                <p className="text-[10px] text-sky-100/80 mt-1">anos de experiência</p>
              </div>
              <div className="animate-float-slow absolute -bottom-6 -left-6 glass rounded-2xl px-4 py-3 bg-slate-900/70 flex items-center gap-3">
                <Globe2 className="w-6 h-6 text-sky-300" />
                <div>
                  <p className="text-xs font-bold text-white">Seu fuso, automático</p>
                  <p className="text-[10px] text-sky-100/80">Qualquer lugar do mundo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Countries marquee */}
      <div className="relative mt-24 border-y border-white/10 glass/50 py-5 overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 text-sm font-semibold text-sky-100/80">
          {[...countries, ...countries].map((c, i) => (
            <span key={i} className="whitespace-nowrap">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
