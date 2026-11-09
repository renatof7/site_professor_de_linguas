'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut, User as UserIcon, Shield, ArrowUpRight } from 'lucide-react';

export function Header({ onOpenBooking }: { onOpenBooking: () => void }) {
  const { locale, setLocale, t } = useLanguage();
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['#metodo', t.nav.method],
    ['#sobre', t.nav.about],
    ['#depoimentos', t.nav.testimonials],
    ['#videos', t.nav.videos],
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-5'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300 ${
          scrolled ? 'max-w-5xl' : ''
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 h-14 transition-all duration-300 ${
            scrolled ? 'glass bg-slate-900/70 shadow-2xl shadow-black/30' : ''
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black">
              V
            </div>
            <span className="font-bold text-white tracking-tight">
              Teacher <span className="text-cyan-100">Vittor</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-100">
            {links.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-white/10 p-0.5 text-[11px] font-bold">
              {(['pt', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2.5 py-1 rounded-full transition-all uppercase ${
                    locale === l ? 'glass text-white' : 'text-sky-100 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {user ? (
              <>
                <Link
                  href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full glass/10 hover:glass/20 text-white text-xs font-semibold transition-colors"
                >
                  {profile?.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5" />
                  )}
                  {profile?.role === 'admin' ? t.nav.admin : t.nav.dashboard}
                </Link>
                <button
                  onClick={signOut}
                  title={t.nav.logout}
                  className="p-2 text-sky-100 hover:text-red-400 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full text-slate-100 hover:text-white text-xs font-semibold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t.nav.loginGoogle}
              </button>
            )}

            <button
              onClick={onOpenBooking}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">{locale === 'pt' ? 'Aula grátis' : 'Free class'}</span>
              <span className="sm:hidden">{locale === 'pt' ? 'Grátis' : 'Free'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
