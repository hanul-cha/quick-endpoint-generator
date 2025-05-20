export type ColumnId = string

export interface DataColumn {
  id: ColumnId
  name: string
  type: ColumnType
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

export enum ColumnType {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
  Json = 'Json',
}
