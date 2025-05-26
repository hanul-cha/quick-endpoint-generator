import { Ref, ref } from 'vue'

import { ApiType } from '@/api'
import { PaginatedResponse } from '@/api/pagination'
import { defineStore } from 'pinia'

export function createStore<T extends (Record<string, any> & { id: string }), Api extends ApiType<T> = ApiType<T>>(
  storeId: string,
  api: Api
) {
  return defineStore(storeId, () => {
    const items: Ref<PaginatedResponse<T>> = ref({
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
    const isInitialized = ref(false)
    const pagination = ref<any>(null)

    const loadItems = async (...args: Parameters<Api['pagination']>) => {
      if (isInitialized.value) {
        return items.value
      }
      isLoading.value = true
      error.value = null

      try {
        const response = await api.pagination(...args)
        items.value = response
        isInitialized.value = true
        return items.value
      } catch (err) {
        error.value = 'Error loading items'
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const createItem = async (...args: Parameters<Api['create']>) => {
      isLoading.value = true
      error.value = null
      try {
        const newItem = await api.create(args[0], ...args.slice(1))
        if (isInitialized.value) {
          items.value.items.unshift(newItem)
          items.value.total += 1
        }
        return newItem
      } catch (err) {
        error.value = '생성 중 오류가 발생했습니다.'
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const updateItem = async (...args: Parameters<Api['update']>) => {
      isLoading.value = true
      error.value = null
      try {
        const updated = await api.update(args[0], args[1], ...args.slice(2))
        if (isInitialized.value) {
          const idx = items.value.items.findIndex(i => i.id === updated.id)
          if (idx !== -1) items.value.items[idx] = updated
        }
        return updated
      } catch (err) {
        error.value = 'Error updating item'
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const deleteItem = async (id: string) => {
      isLoading.value = true
      error.value = null
      try {
        await api.delete(id)
        if (isInitialized.value) {
          items.value.items = items.value.items.filter(i => i.id !== id)
        }
      } catch (err) {
        error.value = '삭제 중 오류가 발생했습니다.'
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const reset = () => {
      isInitialized.value = false
      items.value = {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        offset: 0
      }
    }

    return {
      items,
      isLoading,
      error,
      isInitialized,
      pagination,
      loadItems,
      createItem,
      updateItem,
      deleteItem,
      reset
    }
  })
}
