export const formatCurrency = (amount) => {
  // HARDCODED: Always use 'ru-RU' locale.
  // Never use 'en-US' or i18n.language here.
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

