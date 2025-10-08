// Performance-optimized formatters with caching

// Cached formatter instances for better performance
const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  currency: 'EUR'
});

/**
 * Formats a date string to German DD.MM.YYYY format
 * Uses cached Intl.DateTimeFormat instance for performance
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }
    return dateFormatter.format(date);
  } catch {
    return dateString; // Return original string on error
  }
};

/**
 * Formats a number as German currency (EUR)
 * Uses cached Intl.NumberFormat instance for performance
 */
export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount);
};

/**
 * Formats a number as German currency without the currency symbol
 * For cases where we want just the formatted number with € symbol added separately
 */
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
