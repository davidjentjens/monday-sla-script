import axios from 'axios'
import { fetchTicketRows } from './fetchTicketRows'
import { API_KEY, BOARD_ID, MONDAY_API_URL } from '../config'

// Function to activate business hours
export const startBusinessHours = async (): Promise<void> => {
  console.log('[INFO] Business hours started. Activating Business Hour Values')
  const rows = await fetchTicketRows()
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

      console.log(`Activated business hour cell for row ${row.name}`)
    } catch (error) {
      console.error(
        `[ERROR] Failed to activate business hour cell for row ${row.name}`,
        error,
      )
    }
  }
  console.log('[INFO] Business hours activated')
}

// Function to deactivate business hours
export const stopBusinessHours = async (): Promise<void> => {
  console.log('[INFO] Business hours ended. Deactivating business hour values"')
  const rows = await fetchTicketRows()
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

      console.log(`Deactivated business hour cell for row ${row.name}`)
    } catch (error) {
      console.error(
        `[ERROR] Failed to deactivate business hour cell for row ${row.name}`,
        error,
      )
    }
  }
  console.log('[INFO] Business hours deactivated')
}
