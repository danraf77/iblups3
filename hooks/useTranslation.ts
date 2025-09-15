import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace: string = 'common') => {
  const { t, i18n } = useI18nTranslation(namespace);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return {
    t,
    changeLanguage,
    currentLanguage,
    i18n,
  };
};

export default useTranslation;
