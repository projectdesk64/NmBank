import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  variant?: "default" | "ghost";
  className?: string;
}

export const LanguageToggle = ({ variant = "default", className }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'ru') => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  const isWhite = className?.includes("text-white");
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => handleLanguageChange('ru')}
        className={cn(
          "px-2 py-1 text-sm font-medium transition-colors",
          isWhite
            ? language === 'ru' 
              ? "text-white font-bold" 
              : "text-white/70 hover:text-white"
            : language === 'ru' 
              ? "text-nmb-orange font-bold" 
              : "text-gray-500 hover:text-gray-700"
        )}
      >
        Rus
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={cn(
          "px-2 py-1 text-sm font-medium transition-colors",
          isWhite
            ? language === 'en' 
              ? "text-white font-bold" 
              : "text-white/70 hover:text-white"
            : language === 'en' 
              ? "text-black font-bold" 
              : "text-gray-500 hover:text-gray-700"
        )}
      >
        Eng
      </button>
    </div>
  );
};
