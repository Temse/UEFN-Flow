import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  showLanguageSelector: boolean;
  setShowLanguageSelector: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('uefn-lang');
    if (saved) return saved as Language;
    
    // Auto-detect browser language if not set
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja'];
    return supportedLangs.includes(browserLang) ? (browserLang as Language) : 'en';
  });

  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    return !localStorage.getItem('uefn-lang-set');
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('uefn-lang', newLang);
    localStorage.setItem('uefn-lang-set', 'true');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, showLanguageSelector, setShowLanguageSelector }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
