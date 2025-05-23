import type { DataTable } from '@/types/data-table'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tableApi } from '@/api/table'

export const useTableStore = defineStore('table', () => {
  const table = ref<DataTable | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadTable = async (tableId: string) => {
    isLoading.value = true
    error.value = null
    try {
      table.value = await tableApi.getTable(tableId)
    } catch (err) {
      error.value = '테이블 정보를 불러오는 중 오류가 발생했습니다.'
      console.error('Failed to load table:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateTable = async (id: string, tableData: Partial<DataTable>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedTable = await tableApi.updateTable(id, tableData)
      if (table.value?.id === updatedTable.id) {
        table.value = updatedTable
      }
      return updatedTable
    } catch (err) {
      error.value = '테이블 수정 중 오류가 발생했습니다.'
      console.error('Failed to update table:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearTable = () => {
    table.value = null
    error.value = null
  }

  return {
    table,
    isLoading,
    error,
    loadTable,
    updateTable,
    clearTable
  }
})