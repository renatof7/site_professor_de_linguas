'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries } from '@/lib/i18n';

type LanguageContextType = {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: typeof dictionaries.pt;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'pt',
  setLocale: () => {},
  t: dictionaries.pt,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('pt');

  useEffect(() => {
    // Detectar idioma do navegador se preferir inglês
    const browserLang = navigator.language?.toLowerCase();
    if (browserLang && !browserLang.startsWith('pt')) {
      setLocale('en');
    }
  }, []);

  const t = dictionaries[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
