import axios from 'axios'
import { API_KEY, BOARD_ID, MONDAY_API_URL } from '../config'
import { Item } from '../interfaces'

// Function to fetch ticket rows
export const fetchTicketRows = async (): Promise<Item[]> => {
  const query = `
      query {
        boards (ids: [${BOARD_ID}], limit: 1000) {
          items_page (limit: 500) {
            items {
              id
              name
              column_values {
                id
                value
                text
              }
            }
          }
        }
      }
    `

  try {
    const { data } = await axios.post(
      MONDAY_API_URL,
      {
        query,
      },
      {
        headers: {
          Authorization: API_KEY,
          'Content-Type': 'application/json',
        },
      },
    )

    // Extract ticket rows from the response
    const businessHoursRows = data.data.boards[0].items_page.items

    return businessHoursRows
  } catch (error) {
    console.error('[ERROR] Error fetching tickets for rows:', error)
    return []
  }
}
