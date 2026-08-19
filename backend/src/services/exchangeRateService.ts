import { prisma } from '../lib/prisma';
import https from 'https';

const CURRENCIES = ['USD', 'GBP', 'EUR', 'INR'];

function fetchExchangeRatesFromApi(): Promise<Record<string, number>> {
  return new Promise((resolve, reject) => {
    const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
    
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch exchange rates, status: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const usdRates = parsed.usd;
          if (!usdRates) {
            reject(new Error('Invalid response structure from exchange rate API'));
            return;
          }
          
          const rates: Record<string, number> = { USD: 1.0 };
          for (const currency of CURRENCIES) {
            if (currency === 'USD') continue;
            const key = currency.toLowerCase();
            if (usdRates[key]) {
              rates[currency] = parseFloat((1 / usdRates[key]).toFixed(6));
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
  console.log('[ExchangeRateService] Fetching latest live exchange rates...');
  const rates = await fetchExchangeRatesFromApi();
  console.log('[ExchangeRateService] Successfully fetched live rates:', rates);

  // Update rates in database
  console.log('[ExchangeRateService] Syncing rates in database...');
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
