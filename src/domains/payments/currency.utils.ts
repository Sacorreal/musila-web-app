import type { CurrencyInfo } from './currency.actions';

export function convertPrice(copAmount: number, currencyInfo: CurrencyInfo): string {
  if (currencyInfo.isCOP) {
    return `${currencyInfo.symbol}${copAmount.toLocaleString('es-CO')}`;
  }
  const converted = Math.round(copAmount * currencyInfo.rate);
  return `${currencyInfo.symbol}${converted.toLocaleString('en', { minimumFractionDigits: 0 })}`;
}
