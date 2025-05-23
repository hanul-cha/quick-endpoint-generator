import type { DataTable } from '@/types/data-table'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tableApi } from '@/api/table'

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  offset: number
}

export const useSchemaStore = defineStore('schema', () => {
  const tables = ref<PaginatedResponse<DataTable>>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    offset: 0
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadTables = async (page?: number) => {
    isLoading.value = true
    error.value = null
    try {
      tables.value = await tableApi.getMyTables({ page: page || 1 })
    } catch (err) {
      error.value = '테이블 목록을 불러오는 중 오류가 발생했습니다.'
      console.error('Failed to load tables:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createTable = async (table: Partial<DataTable>) => {
    isLoading.value = true
    error.value = null
    try {
      const newTable = await tableApi.createTable(table)
      tables.value.items.unshift(newTable)
      return newTable
    } catch (err) {
      error.value = '테이블 생성 중 오류가 발생했습니다.'
      console.error('Failed to create table:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateTable = async (id: string, table: Partial<DataTable>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedTable = await tableApi.updateTable(id, table)
      const index = tables.value.items.findIndex(t => t.id === updatedTable.id)
      if (index !== -1) {
        tables.value.items[index] = updatedTable
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

  const deleteTable = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await tableApi.deleteTable(id)
      tables.value.items = tables.value.items.filter(table => table.id !== id)
    } catch (err) {
      error.value = '테이블 삭제 중 오류가 발생했습니다.'
      console.error('Failed to delete table:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    tables,
    isLoading,
    error,
    loadTables,
    createTable,
    updateTable,
    deleteTable
  }
})