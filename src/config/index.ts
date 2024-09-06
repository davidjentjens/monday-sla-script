import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

export const MONDAY_API_URL = 'https://api.monday.com/v2'
export const API_KEY = process.env.MONDAY_API_KEY as string
export const BOARD_ID = '7288534741' // Adjust board ID accordingly
