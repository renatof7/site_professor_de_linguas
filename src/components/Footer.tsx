'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight } from 'lucide-react';

export function Footer({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { locale } = useLanguage();
  const pt = locale === 'pt';

  return (
    <footer className="bg-transparent px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto relative rounded-[2.5rem] glass overflow-hidden shadow-xl border border-white/10">

        <div className="relative px-8 sm:px-16 pt-20 pb-10 text-center">
          <h3 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05] max-w-3xl mx-auto">
            {pt ? (
              <>Pronto para falar <span className="font-display italic font-medium text-gradient">de verdade?</span></>
            ) : (
              <>Ready to speak <span className="font-display italic font-medium text-gradient">for real?</span></>
            )}
          </h3>
          <p className="mt-6 text-cyan-400/40 text-lg max-w-xl mx-auto">
            {pt
              ? 'Agende sua aula experimental gratuita e receba um plano de estudos personalizado.'
              : 'Book your free trial class and get a personalized study plan.'}
          </p>
          <button
            onClick={onOpenBooking}
            className="group mt-10 inline-flex items-center gap-3 pl-8 pr-3 py-3 rounded-full glass text-white font-bold text-lg hover:bg-slate-900/80 hover:border-white/20 transition-colors cursor-pointer"
          >
            {pt ? 'Agendar aula grátis' : 'Book free class'}
            <span className="w-11 h-11 rounded-full glass/10 border border-white/10 text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </span>
          </button>

          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-100/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-black text-xs">V</div>
              <span className="font-semibold text-cyan-400/40">Teacher Vittor</span>
            </div>
            <span>© {new Date().getFullYear()} · {pt ? 'Feito no Brasil para o mundo' : 'Made in Brazil for the world'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
