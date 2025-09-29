import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export const useTranslation = (namespace: string = 'common') => {
  const { t, i18n } = useI18nTranslation(namespace);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const changeLanguage = (lng: string) => {
    if (isClient) {
      i18n.changeLanguage(lng);
    }
  };

  // Usar 'en' como fallback durante la hidratación
  const currentLanguage = isClient ? i18n.language : 'en';

  return {
    t,
    changeLanguage,
    currentLanguage,
    i18n,
  };
};

export default useTranslation;
