// Import axios using ES Module syntax
import axios from 'axios'
import { fetchBusinessHoursRows } from './fetchBusinessHoursRows'
import { API_KEY, BOARD_ID, MONDAY_API_URL } from '../config'

// Function to start timers
export const startTimers = async (): Promise<void> => {
  console.log(
    '[INFO] Business hours started. Starting SLA timers for tickets which have a type of "Business Hours"',
  )
  const rows = await fetchBusinessHoursRows()
  for (const row of rows) {
    try {
      const { data } = await axios.post(
        MONDAY_API_URL,
        {
          query: `mutation {
              change_column_value(board_id:${BOARD_ID}, item_id:${row.id}, column_id: "status_10__1", value:"{\\"index\\": 1}") {
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

      console.log(`Started timer for row ${row.name}`)
    } catch (error) {
      console.error(`[ERROR] Failed to start timer for row ${row.name}`, error)
    }
  }
}

// Function to stop timers
export const stopTimers = async (): Promise<void> => {
  console.log(
    '[INFO] Business hours ended. Stopping SLA timers for tickets which have a type of "Business Hours"',
  )
  const rows = await fetchBusinessHoursRows()
  for (const row of rows) {
    try {
      const { data } = await axios.post(
        MONDAY_API_URL,
        {
          query: `mutation {
            change_column_value(board_id:${BOARD_ID}, item_id:${row.id}, column_id: "status_10__1", value:"{\\"index\\": 2}") {
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

      console.log(`Stopped timer for row ${row.name}`)
    } catch (error) {
      console.error(`[ERROR] Failed to stop timer for row ${row.name}`, error)
    }
  }
}
