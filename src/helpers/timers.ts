import { fetchTicketRows } from './fetchTicketRows'
import { alterBusinessHours } from './alterBusinessHours'

// Function to activate business hours
export const startBusinessHours = async (): Promise<void> => {
  console.log('[INFO] Business hours started. Activating Business Hour Values')

  const startTime = new Date() // Start timer

  const rows = await fetchTicketRows()
  await alterBusinessHours(rows, 1)

  const endTime = new Date() // End timer
  const duration = endTime.getTime() - startTime.getTime() // Calculate duration

  console.log(`[INFO] Business hours activated. Duration: ${duration} ms`)
}

// Function to deactivate business hours
export const stopBusinessHours = async (): Promise<void> => {
  console.log('[INFO] Business hours ended. Deactivating business hour values"')

  const startTime = new Date() // Start timer

  const rows = await fetchTicketRows()
  await alterBusinessHours(rows, 0)

  const endTime = new Date() // End timer
  const duration = endTime.getTime() - startTime.getTime() // Calculate duration

  console.log(`[INFO] Business hours deactivated. Duration: ${duration} ms`)
}
