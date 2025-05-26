import type { DataRow } from '@/types/data-row'
import { createStore } from '.'
import { rowApi } from '@/api/row'

export const useRowStore = createStore<DataRow>('row', rowApi)