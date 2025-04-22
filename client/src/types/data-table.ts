export interface DataColumn {
  id: string
  name: string
  type: string
}

export interface DataTable {
  id: string
  name: string
  columns: DataColumn[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'json'