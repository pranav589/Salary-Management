/**
 * Formats a numeric value into a USD currency string.
 * E.g., 100000 -> $100,000.00
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a numeric value into its local currency representation.
 */
export function formatLocalCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/**
 * Formats an ISO Date string into a human-readable date.
 * E.g., "2024-02-15T00:00:00.000Z" -> "Feb 15, 2024"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Resolves a full country name from an ISO country code using a dynamic countries list.
 */
export function getCountryName(code: string, countriesList?: { code: string; name: string }[]): string {
  if (!code) return '-';
  if (!countriesList) return code;
  const match = countriesList.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return match ? match.name : code;
}
