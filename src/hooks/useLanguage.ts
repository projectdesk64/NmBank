import { useLanguageContext } from '@/contexts/LanguageContext';

// Re-export for backward compatibility
export const useLanguage = () => {
  return useLanguageContext();
};

