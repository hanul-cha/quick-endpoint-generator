export type ColumnId = string

export interface DataColumn {
  id: ColumnId
  name: string
  type: string
  required?: boolean
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