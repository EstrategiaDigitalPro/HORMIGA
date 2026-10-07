export interface CurrencySetting {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  locale: string;
}

export const CURRENCIES: Record<string, CurrencySetting> = {
  CLP: {
    code: 'CLP',
    name: 'Peso Chileno (CLP)',
    symbol: '$',
    decimals: 0,
    locale: 'es-CL',
  },
  COP: {
    code: 'COP',
    name: 'Peso Colombiano (COP)',
    symbol: '$',
    decimals: 0,
    locale: 'es-CO',
  },
  MXN: {
    code: 'MXN',
    name: 'Peso Mexicano (MXN)',
    symbol: '$',
    decimals: 2,
    locale: 'es-MX',
  },
  USD: {
    code: 'USD',
    name: 'Dólar Estadounidense (USD)',
    symbol: '$',
    decimals: 2,
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro (EUR)',
    symbol: '€',
    decimals: 2,
    locale: 'es-ES',
  },
  ARS: {
    code: 'ARS',
    name: 'Peso Argentino (ARS)',
    symbol: '$',
    decimals: 0,
    locale: 'es-AR',
  },
  PEN: {
    code: 'PEN',
    name: 'Sol Peruano (PEN)',
    symbol: 'S/',
    decimals: 2,
    locale: 'es-PE',
  },
};

export function formatCurrency(
  amount: number,
  currencyCode: string = 'CLP',
  includeSymbol: boolean = true
): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  const config = CURRENCIES[currencyCode] || CURRENCIES.CLP;

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(Math.abs(safeAmount));

    const sign = safeAmount < 0 ? '-' : '';

    if (!includeSymbol) {
      return `${sign}${formatted}`;
    }

    if (config.code === 'EUR') {
      return `${sign}${formatted} €`;
    }

    return `${sign}${config.symbol}${formatted}`;
  } catch {
    return `${includeSymbol ? '$' : ''}${safeAmount.toLocaleString()}`;
  }
}

export function parseAmount(input: string | number): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  // Strip everything except numbers, minus, and decimal separators
  const clean = input.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatDateSpanish(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString;
  }
}

export function formatMonthName(monthKey: string): string {
  try {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const monthName = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  } catch {
    return monthKey;
  }
}

export function formatExactDateSpanish(date: Date = new Date()): string {
  try {
    const formatted = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return date.toLocaleDateString('es-ES');
  }
}

