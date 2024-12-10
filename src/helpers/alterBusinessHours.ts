import axios from 'axios'
import { API_KEY, BOARD_ID, MONDAY_API_URL } from '../config'

const BATCH_SIZE = 10
const CONCURRENCY_LIMIT = 10
const BASE_DELAY = 2000
const MAX_RETRIES = 10

export const alterBusinessHours = async (
  rows: any,
  status: number,
): Promise<void> => {
  // Exponential backoff function
  const sleep = async (attemptNumber: number) => {
    const delay = Math.min(BASE_DELAY * Math.pow(2, attemptNumber), 30000) // Max 30 second delay
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  // Split rows into batches
  const batches: any[][] = []
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batches.push(rows.slice(i, i + BATCH_SIZE))
  }

  // Process a single batch with retries
  const processBatch = async (
    batch: any[],
    batchIndex: number,
  ): Promise<void> => {
    let attempts = 0

    while (attempts < MAX_RETRIES) {
      try {
        const mutations = batch
          .map(
            (row: any, index) => `
            mutation${index}: change_column_value(
              board_id: ${BOARD_ID},
              item_id: ${row.id},
              column_id: "status_10__1",
              value: "{\\"index\\": ${status}}"
            ) {
              id
            }
          `,
          )
          .join('\n')

        const query = `mutation { ${mutations} }`

        const { data } = await axios.post(
          MONDAY_API_URL,
          { query },
          {
            headers: {
              Authorization: API_KEY,
              'Content-Type': 'application/json',
            },
          },
        )

        if (data.errors) {
          throw new Error(
            Array.isArray(data.errors)
              ? data.errors.map((e: any) => e.message).join(', ')
              : 'Unknown error occurred',
          )
        }

        console.log(
          `Successfully updated batch ${batchIndex + 1}/${batches.length} (${batch.length} rows)`,
        )
        return // Success, exit the retry loop
      } catch (error: any) {
        attempts++

        if (error?.response?.status === 429 || attempts < MAX_RETRIES) {
          console.log(
            `Rate limit hit or error for batch ${batchIndex + 1}, attempt ${attempts}/${MAX_RETRIES}. Waiting before retry...`,
          )
          await sleep(attempts)
        } else {
          console.error(
            `[ERROR] Failed to process batch ${batchIndex + 1}/${batches.length}:`,
            error.message,
          )
          await processIndividually(batch, batchIndex)
          return
        }
      }
    }
  }

  // Process individual rows with retries
  const processIndividually = async (
    batch: any[],
    batchIndex: number,
  ): Promise<void> => {
    console.log(`Processing batch ${batchIndex + 1} rows individually...`)

    for (const row of batch) {
      let attempts = 0

      while (attempts < MAX_RETRIES) {
        try {
          const singleMutation = `mutation {
              change_column_value(
                board_id: ${BOARD_ID},
                item_id: ${row.id},
                column_id: "status_10__1",
                value: "{\\"index\\": ${status}}"
              ) {
                id
              }
            }`

          await axios.post(
            MONDAY_API_URL,
            { query: singleMutation },
            {
              headers: {
                Authorization: API_KEY,
                'Content-Type': 'application/json',
              },
            },
          )

          console.log(`Successfully updated single row ${row.id}`)
          await sleep(0) // Base delay even on success
          break // Success, move to next row
        } catch (error: any) {
          attempts++

          if (error?.response?.status === 429 || attempts < MAX_RETRIES) {
            console.log(
              `Rate limit hit for row ${row.id}, attempt ${attempts}/${MAX_RETRIES}. Waiting before retry...`,
            )
            await sleep(attempts)
          } else {
            console.error(
              `[ERROR] Failed to update row ${row.id}:`,
              error.message,
            )
            break // Move to next row after max retries
          }
        }
      }
    }
  }

  // Process batches with controlled concurrency
  const batchPromises = batches.map((batch, index) => async () => {
    await processBatch(batch, index)
    await sleep(0) // Base delay between batches
  })

  // Process in smaller concurrent chunks
  for (let i = 0; i < batchPromises.length; i += CONCURRENCY_LIMIT) {
    const chunk = batchPromises.slice(i, i + CONCURRENCY_LIMIT)
    await Promise.all(chunk.map((fn) => fn()))
  }

  console.log('Completed processing all rows')
}
