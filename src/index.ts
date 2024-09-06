import cron from 'node-cron'

import { startTimers, stopTimers } from './helpers/timers'

console.log('Starting timer cron jobs...\n')

// Schedule the tasks to run at 9 AM and 5 PM on weekdays
cron.schedule('0 9 * * 1-5', startTimers, {
  timezone: 'America/Sao_Paulo',
})

cron.schedule('0 17 * * 1-5', stopTimers, {
  timezone: 'America/Sao_Paulo',
})
