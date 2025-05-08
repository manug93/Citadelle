import { createContext, useState, useContext, ReactNode } from 'react';
import i18n from '@/lib/i18n';

type LanguageType = 'fr' | 'en' | 'zh';

interface LanguageContextType {
  language: LanguageType;
  changeLanguage: (lang: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('fr');

  const changeLanguage = (lang: LanguageType) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
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
