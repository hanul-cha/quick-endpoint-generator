import type { DataTable } from '@/types/data-table'
import { createStore } from '.'
import { tableApi } from '@/api/table'

export const useTableStore = createStore<DataTable>('table', tableApi)