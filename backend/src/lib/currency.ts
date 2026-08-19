import { prisma } from './prisma';

/**
 * Converts a salary amount in local currency to USD equivalent
 * using the stored exchange rate in the database.
 */
export async function convertToUsd(amount: number, currency: string): Promise<number> {
  if (currency === 'USD') return amount;

  const rateRecord = await prisma.exchangeRate.findUnique({
    where: { currency: currency.toUpperCase() },
  });

  if (!rateRecord) {
    throw new Error(`Exchange rate not found for currency: ${currency}`);
  }

  return parseFloat((amount * rateRecord.rateToUsd).toFixed(2));
}

/**
 * Gets a map of currency -> rateToUsd for bulk calculations in analytics
 */
export async function getExchangeRatesMap(): Promise<Record<string, number>> {
  const rates = await prisma.exchangeRate.findMany();
  const map: Record<string, number> = {};
  for (const r of rates) {
    map[r.currency] = r.rateToUsd;
  }
  return map;
}
