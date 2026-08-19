import cron from 'node-cron';
import { syncExchangeRates } from './exchangeRateService';

export function initCronJobs() {
  console.log('[CronService] Initializing scheduled background tasks...');

  // Schedule daily exchange rate sync at midnight (00:00)
  // Format: second minute hour day-of-month month day-of-week (seconds is optional, default 5 fields is minute hour ...)
  // Standard cron syntax: '0 0 * * *' = every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[CronService] Triggered daily exchange rate sync at:', new Date().toISOString());
    try {
      await syncExchangeRates();
      console.log('[CronService] Daily exchange rate sync completed successfully.');
    } catch (error: any) {
      console.error('[CronService] Daily exchange rate sync failed:', error.message);
    }
  });

  console.log('[CronService] Daily exchange rate sync scheduled at: 00:00 (midnight)');
}
