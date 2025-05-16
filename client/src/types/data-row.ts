import { ColumnId } from "./data-table"

export interface DataRow {
  id: string
  dataTableId: string
  values: Record<ColumnId, any>
  createdAt: Date
  updatedAt: Date
}