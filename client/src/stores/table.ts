import { ColumnType, type DataTable } from '@/types/data-table'
import { createStore } from '.'
import { tableApi } from '@/api/table'

export const useTableStore = createStore<DataTable>('table', tableApi, [
  {
    id: 'Default_table',
    name: 'Default table',
    userId: 'Default_user',
    columns: [
      {
        id: '1',
        name: 'Title',
        type: ColumnType.String,
      },
      {
        id: '2',
        name: 'Count',
        type: ColumnType.Number,
      },
      {
        id: '3',
        name: 'IsActive',
        type: ColumnType.Boolean,
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])