import app from './app';
import { initCronJobs } from './services/cronService';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  Server running in ${process.env.NODE_ENV} mode`);
  console.log(`  Listening on port: ${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);

  // Start cron jobs
  initCronJobs();
});
