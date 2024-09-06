import axios from 'axios'
import { API_TOKEN, BOARD_ID, MONDAY_API_URL } from '../config'
import { Item } from '../interfaces'

// Function to fetch items with "SLA Type: Business hours"
export const fetchBusinessHoursRows = async (): Promise<Item[]> => {
  const query = `
      query {
        boards (ids: [${BOARD_ID}]) {
          items_page {
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
          Authorization: API_TOKEN,
          'Content-Type': 'application/json',
        },
      },
    )

    // Filter rows with SLA Type: Business hours
    const items = data.data.boards[0].items_page.items
    const businessHoursRows = items.filter((item: Item) => {
      return item.column_values.some(
        (column: any) =>
          column.id === 'status_1__1' && column.text === 'Horas Comerciais',
      ) // Adjust column ID accordingly
    })

    return businessHoursRows
  } catch (error) {
    console.error('[ERROR] Error fetching business hours rows:', error)
    return []
  }
}
