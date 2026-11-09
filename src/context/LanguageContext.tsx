'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries } from '@/lib/i18n';

type LanguageContextType = {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: typeof dictionaries.pt;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: dictionaries.en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Verificar se o usuário já havia escolhido um idioma manualmente
    const saved = localStorage.getItem('tv_locale') as Locale | null;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLocale(saved);
    }
  }, []);

  const handleSetLocale = (lang: Locale) => {
    setLocale(lang);
    try {
      localStorage.setItem('tv_locale', lang);
    } catch {}
  };

  const t = dictionaries[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
