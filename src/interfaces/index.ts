// Types for the response data
export interface ColumnValue {
  id: string
  text: string
}

export interface Item {
  id: string
  name: string
  column_values: ColumnValue[]
}

export interface BoardData {
  boards: {
    items: Item[]
  }[]
}
