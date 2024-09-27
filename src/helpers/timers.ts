import axios from 'axios'
import { fetchTicketRows } from './fetchTicketRows'
import { API_KEY, BOARD_ID, MONDAY_API_URL } from '../config'
import async from 'async'

const CONCURRENCY_LIMIT = 10

const alterBusinessHours = async (status: number): Promise<void> => {
  const rows = await fetchTicketRows()
  // Create a queue with a concurrency of CONCURRENCY_LIMIT
  const queue = async.queue(async (row, callback) => {
    const item = row as any

    try {
      const { data } = await axios.post(
        MONDAY_API_URL,
        {
          query: `mutation {
            change_column_value(board_id:${BOARD_ID}, item_id:${item.id}, column_id: "status_10__1", value:"{\\"index\\": ${status}}") {
              id
            }
          }`,
        },
        {
          headers: {
            Authorization: API_KEY,
            'Content-Type': 'application/json',
          },
        },
      )
      if (data.errors) {
        throw new Error(data.errors[0].message)
      }
      console.log(`Changed business hour cell for row ${item.name}`)
    } catch (error) {
      console.error(
        `[ERROR] Failed to change business hour cell for row ${item.name}`,
        error,
      )
    }
    callback()
  }, CONCURRENCY_LIMIT)

  // Push rows to the queue
  rows.forEach((row) => queue.push(row))

  // Wait for all tasks to complete
  await queue.drain()
}

// Function to activate business hours
export const startBusinessHours = async (): Promise<void> => {
  console.log('[INFO] Business hours started. Activating Business Hour Values')

  const startTime = new Date() // Start timer

  await alterBusinessHours(1)

  const endTime = new Date() // End timer
  const duration = endTime.getTime() - startTime.getTime() // Calculate duration

  console.log(`[INFO] Business hours activated. Duration: ${duration} ms`)
}

// Function to deactivate business hours
export const stopBusinessHours = async (): Promise<void> => {
  console.log('[INFO] Business hours ended. Deactivating business hour values"')

  const startTime = new Date() // Start timer

  await alterBusinessHours(5)

  const endTime = new Date() // End timer
  const duration = endTime.getTime() - startTime.getTime() // Calculate duration

  console.log(`[INFO] Business hours deactivated. Duration: ${duration} ms`)
}
