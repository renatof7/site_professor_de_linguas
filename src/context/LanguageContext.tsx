'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, dictionaries } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

type SiteDictionary = typeof dictionaries.en;

type LanguageContextType = {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: SiteDictionary;
  refreshContent: () => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: dictionaries.en,
  refreshContent: async () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [dynamicDict, setDynamicDict] = useState<{ en: SiteDictionary; pt: SiteDictionary }>({
    en: dictionaries.en,
    pt: dictionaries.pt,
  });

  const fetchDynamicContent = async () => {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (data && data.length > 0) {
        const mergedEn = { ...dictionaries.en };
        const mergedPt = { ...dictionaries.pt };

        data.forEach((row: { key: string; content_en: any; content_pt: any }) => {
          if (row.key in mergedEn) {
            (mergedEn as any)[row.key] = {
              ...(mergedEn as any)[row.key],
              ...row.content_en,
            };
          }
          if (row.key in mergedPt) {
            (mergedPt as any)[row.key] = {
              ...(mergedPt as any)[row.key],
              ...row.content_pt,
            };
          }
        });

        setDynamicDict({ en: mergedEn, pt: mergedPt });
      }
    } catch (e) {
      console.warn('Fallback to local dictionaries:', e);
    }
  };

  useEffect(() => {
    // Carregar preferências de idioma salvas
    const saved = localStorage.getItem('tv_locale') as Locale | null;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLocale(saved);
    }
    fetchDynamicContent();
  }, []);

  const handleSetLocale = (lang: Locale) => {
    setLocale(lang);
    try {
      localStorage.setItem('tv_locale', lang);
    } catch {}
  };

  const t = dynamicDict[locale] || dictionaries[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t, refreshContent: fetchDynamicContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
