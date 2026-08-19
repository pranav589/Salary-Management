import { prisma } from '../lib/prisma';
import https from 'https';

async function fetchExchangeRatesFromApi(): Promise<Record<string, number>> {
  const countries = await prisma.country.findMany({ select: { currency: true } });
  const currenciesList = Array.from(new Set(['USD', ...countries.map((c) => c.currency)]));

  return new Promise((resolve, reject) => {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      reject(new Error('EXCHANGE_RATE_API_KEY environment variable is not configured.'));
      return;
    }

    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
    
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch exchange rates from v6 API, status: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.result !== 'success' || !parsed.conversion_rates) {
            reject(new Error('Invalid response structure or API key error from v6 exchange rate API'));
            return;
          }
          
          const conversionRates = parsed.conversion_rates;
          const rates: Record<string, number> = { USD: 1.0 };
          for (const currency of currenciesList) {
            if (currency === 'USD') continue;
            const val = conversionRates[currency];
            if (val) {
              rates[currency] = parseFloat((1 / val).toFixed(6));
            } else {
              reject(new Error(`Currency ${currency} not found in exchange rate API response`));
              return;
            }
          }
          resolve(rates);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

export async function syncExchangeRates(): Promise<Record<string, number>> {
  const rates = await fetchExchangeRatesFromApi();

  // Update rates in database
  for (const [currency, rate] of Object.entries(rates)) {
    await prisma.exchangeRate.upsert({
      where: { currency },
      update: {
        rateToUsd: rate,
        effectiveDate: new Date(),
      },
      create: {
        currency,
        rateToUsd: rate,
        effectiveDate: new Date(),
      },
    });
  }

  return rates;
}
