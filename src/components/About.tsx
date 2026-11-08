'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Check, ArrowUpRight } from 'lucide-react';

export function About({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { t, locale } = useLanguage();
  const stats = [
    ['3.500+', locale === 'pt' ? 'horas de aula' : 'hours taught'],
    ['500+', locale === 'pt' ? 'alunos' : 'students'],
    ['25+', locale === 'pt' ? 'países' : 'countries'],
  ];

  return (
    <section id="sobre" className="bg-transparent pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] glass overflow-hidden p-8 sm:p-14 lg:p-20 shadow-xl border border-white/10">

          <div className="relative grid lg:grid-cols-12 gap-14 items-center">
            {/* Portrait placeholder — substituir por foto real do professor em /public/professor.jpg */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-end">
                <span className="font-display italic absolute -top-6 -left-2 text-[14rem] leading-none text-white/10 select-none">V</span>
                <div className="relative m-4 w-full glass rounded-2xl bg-slate-900/60 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-300">
                    {locale === 'pt' ? 'Nativo do Brasil' : 'Native Brazilian'}
                  </span>
                  <p className="text-lg font-bold text-white mt-1">Teacher Vittor</p>
                  <p className="text-xs text-cyan-400/40">{locale === 'pt' ? 'Professor de PLE e mentor cultural' : 'Portuguese teacher & cultural mentor'}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-xs font-bold tracking-[0.2em] text-sky-300 uppercase">— {t.about.tag}</span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                {t.about.title}
              </h2>
              <p className="mt-6 text-cyan-400/40 text-lg leading-relaxed">{t.about.bio1}</p>
              <p className="mt-4 text-sky-100/80 leading-relaxed">{t.about.bio2}</p>

              <ul className="mt-8 space-y-3">
                {[t.about.feature1, t.about.feature2, t.about.feature3].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-cyan-400/40 text-sm font-medium">
                    <span className="w-6 h-6 rounded-full bg-slate-800/800/20 text-sky-300 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                {stats.map(([n, l]) => (
                  <div key={l}>
                    <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{n}</p>
                    <p className="text-xs text-sky-100/80 mt-1">{l}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenBooking}
                className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass text-white font-bold text-sm hover:bg-slate-800/800/20 transition-colors cursor-pointer"
              >
                {t.about.cta} <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
