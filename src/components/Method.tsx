'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MessageSquare, Music, Globe2 } from 'lucide-react';

export function Method() {
  const { t } = useLanguage();

  const cards = [
    { icon: MessageSquare, title: t.method.card1Title, desc: t.method.card1Desc, n: '01', accent: 'from-blue-500 to-indigo-500' },
    { icon: Music, title: t.method.card2Title, desc: t.method.card2Desc, n: '02', accent: 'from-cyan-400 to-blue-500' },
    { icon: Globe2, title: t.method.card3Title, desc: t.method.card3Desc, n: '03', accent: 'from-lime-300 to-cyan-400' },
  ];

  return (
    <section id="metodo" className="relative bg-transparent py-28 -mt-px">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-amber-300 font-bold uppercase mb-4">
              — {t.method.tag}
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              {t.method.title}
            </h2>
          </div>
          <p className="text-sky-100/80 text-lg lg:max-w-md lg:ml-auto">{t.method.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.n}
                className="group relative glass rounded-[2rem] p-8 border border-white/10 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-start justify-between mb-14">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.accent} flex items-center justify-center text-white`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="font-display text-6xl italic text-cyan-400/40 group-hover:text-blue-200 transition-colors leading-none">
                    {c.n}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                <p className="text-sky-100/80 text-sm leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
