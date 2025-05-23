import type { DataRow } from '@/types/data-row'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { rowApi } from '@/api/row'

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

export const useRowStore = defineStore('row', () => {
  const rows = ref<PaginatedResponse<DataRow>>({
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

  const loadRows = async (tableId: string, page?: number) => {
    isLoading.value = true
    error.value = null
    try {
      rows.value = await rowApi.getRows(tableId, { page: page || 1, limit: 10 })
    } catch (err) {
      error.value = '데이터를 불러오는 중 오류가 발생했습니다.'
      console.error('Failed to load rows:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createRow = async (tableId: string, values: Record<string, any>) => {
    isLoading.value = true
    error.value = null
    try {
      const newRow = await rowApi.createRow(tableId, values)
      rows.value.items.unshift(newRow)
      return newRow
    } catch (err) {
      error.value = '데이터 생성 중 오류가 발생했습니다.'
      console.error('Failed to create row:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateRow = async (rowId: string, values: Record<string, any>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedRow = await rowApi.updateRow(rowId, { values })
      const index = rows.value.items.findIndex(r => r.id === updatedRow.id)
      if (index !== -1) {
        rows.value.items[index] = updatedRow
      }
      return updatedRow
    } catch (err) {
      error.value = '데이터 수정 중 오류가 발생했습니다.'
      console.error('Failed to update row:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteRow = async (rowId: string) => {
    isLoading.value = true
    error.value = null
    try {
      await rowApi.deleteRow(rowId)
      rows.value.items = rows.value.items.filter(row => row.id !== rowId)
    } catch (err) {
      error.value = '데이터 삭제 중 오류가 발생했습니다.'
      console.error('Failed to delete row:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearRows = () => {
    rows.value = {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      offset: 0
    }
    error.value = null
  }

  return {
    rows,
    isLoading,
    error,
    loadRows,
    createRow,
    updateRow,
    deleteRow,
    clearRows
  }
})