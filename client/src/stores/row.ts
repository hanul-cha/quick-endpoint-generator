import type { DataRow } from '@/types/data-row'
import { createStore } from '.'
import { rowApi } from '@/api/row'

export const useRowStore = createStore<DataRow>('row', rowApi, [
  {
    id: 'Default_row',
    dataTableId: 'Default_table',
    values: {
      '1': 'Default title',
      '2': 0,
      '3': true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
])