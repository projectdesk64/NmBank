import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Language } from "./translations"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency based on language
 * @param amount - The amount to format
 * @param language - The current language ('en' or 'ru')
 * @param options - Optional Intl.NumberFormat options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number, 
  language: Language = 'en',
  options?: Intl.NumberFormatOptions
): string {
  const currencyConfig = {
    en: {
      locale: 'en-US',
      currency: 'USD',
      symbol: '$',
      defaultOptions: {
        style: 'currency' as const,
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    },
    ru: {
      locale: 'ru-RU',
      currency: 'RUB',
      symbol: '₽',
      defaultOptions: {
        style: 'currency' as const,
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    },
  };

  const config = currencyConfig[language];
  const formatOptions = { ...config.defaultOptions, ...options };

  // Use Intl.NumberFormat to format the number
  const formatted = new Intl.NumberFormat(config.locale, {
    ...formatOptions,
    // Ensure currency symbol is always included
    currencyDisplay: 'symbol',
  }).format(amount);

  // Double-check: if the formatted string doesn't contain the correct symbol, replace it
  // This handles edge cases where Intl might not format correctly
  if (language === 'ru' && !formatted.includes('₽') && !formatted.includes('RUB')) {
    // Format number with Russian locale (space as thousand separator)
    const numberFormatter = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: formatOptions.minimumFractionDigits,
      maximumFractionDigits: formatOptions.maximumFractionDigits,
    });
    return `${numberFormatter.format(amount)} ₽`;
  }

  if (language === 'en' && !formatted.includes('$') && !formatted.includes('USD')) {
    // Format number with US locale (comma as thousand separator)
    const numberFormatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: formatOptions.minimumFractionDigits,
      maximumFractionDigits: formatOptions.maximumFractionDigits,
    });
    return `$${numberFormatter.format(amount)}`;
  }

  return formatted;
}
