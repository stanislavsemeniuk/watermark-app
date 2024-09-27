'use client';

import React, { createContext, useState, useContext } from 'react';

type Language = 'en' | 'ru' 

type ChangeLanguage = (language: Language) => void;

const LanguageContext = createContext<{ changeLanguage: ChangeLanguage, language:Language }>({changeLanguage:()=>{},language:'en'});

export default function LanguageContextProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangauge] = useState<Language>('en');

  function changeLanguage(language: Language) {
    setLangauge(language)
  }

  return (
    <LanguageContext.Provider value={{ changeLanguage,language }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('LanguageContext should be used within a LanguageContextProvider');
  }
  return context;
}