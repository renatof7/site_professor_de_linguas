'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Star } from 'lucide-react';
import { Testimonial } from '@/lib/supabase';

function getFlagEmoji(countryCode: string) {
  const points = countryCode.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...points);
}

// TODO: substituir por SELECT na tabela `testimonials` (is_public = true)
const items: Testimonial[] = [
  { id: '1', nome_aluno: 'Michael Smith', codigo_pais: 'US', texto_avaliacao: 'Teacher Vittor made Portuguese feel so natural. In 3 months I went from zero to traveling in Rio with complete confidence!', nota: 5, is_public: true },
  { id: '2', nome_aluno: 'Sophie Dubois', codigo_pais: 'FR', texto_avaliacao: "Une méthode communicative exceptionnelle ! La prononciation brésilienne n'a plus de secret pour moi.", nota: 5, is_public: true },
  { id: '3', nome_aluno: 'Lukas Weber', codigo_pais: 'DE', texto_avaliacao: 'Structured yet friendly. The focus on real daily Brazilian life was exactly what I needed for my business trip to São Paulo.', nota: 5, is_public: true },
  { id: '4', nome_aluno: 'Elena Rossi', codigo_pais: 'IT', texto_avaliacao: "Imparare il portoghese con Vittor è stata un'esperienza fantastica. Lezioni dinamiche e piene di vita!", nota: 5, is_public: true },
];

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section id="depoimentos" className="relative bg-transparent py-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-sky-300 uppercase">— {t.testimonials.tag}</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            {t.testimonials.title}
          </h2>
          <p className="mt-5 text-sky-100/80 text-lg">{t.testimonials.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <figure
              key={it.id}
              className={`glass rounded-[1.75rem] p-6 flex flex-col justify-between hover:bg-slate-900/80 hover:-translate-y-1 transition-all ${
                i % 2 ? 'lg:mt-8' : ''
              }`}
            >
              <div>
                <div className="flex gap-0.5 text-amber-400 mb-5">
                  {[...Array(it.nota)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="font-display text-lg leading-snug text-cyan-400/40">
                  “{it.texto_avaliacao}”
                </blockquote>
              </div>
              <figcaption className="mt-8 pt-5 border-t border-white/10 flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl glass/10 flex items-center justify-center text-2xl">
                  {getFlagEmoji(it.codigo_pais)}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{it.nome_aluno}</p>
                  <p className="text-[11px] text-sky-100/80">{it.codigo_pais}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
