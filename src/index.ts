import cron from 'node-cron'

import { startBusinessHours, stopBusinessHours } from './helpers/timers'

console.log('[SETUP] Initializing cron jobs...\n')

// Schedule the tasks to run at 8 AM and 6 PM on weekdays
cron.schedule('0 8 * * 1-5', startBusinessHours, {
  timezone: 'America/Sao_Paulo',
})

cron.schedule('0 18 * * 1-5', stopBusinessHours, {
  timezone: 'America/Sao_Paulo',
})

console.log(
  '[SETUP] Cron jobs initialized. Waiting for activation timestamps\n',
)
