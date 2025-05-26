import { Ref, computed, ref } from 'vue'

import { ApiType } from '@/api'
import { PaginatedResponse } from '@/api/pagination'
import { defineStore } from 'pinia'

type StorePaginatedResponse = Omit<PaginatedResponse<any>, 'items'> & {
  itemIds: string[]
}

export function createStore<T extends (Record<string, any> & { id: string }), Api extends ApiType<T> = ApiType<T>>(
  storeId: string,
  api: Api
) {
  return defineStore(storeId, () => {
    const entities: Ref<T[]> = ref([])
    const initItems: Ref<StorePaginatedResponse> = ref({
      itemIds: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      offset: 0
    })
    const initArgs: Ref<Parameters<Api['pagination']> | null> = ref(null)

    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const isInitialized = ref(false)
    const pagination = ref<any>(null)

    const loadItems = async (...args: Parameters<Api['pagination']>) => {
      if (isInitialized.value) {
        return items.value
      }

      initArgs.value = args

      const option = args[0] ?? {
        page: 1,
        limit: 10
      }

      const restArgs = args.slice(1)

      isLoading.value = true
      error.value = null

      try {
        const response = await api.pagination(option, ...restArgs)
        entities.value = response.items
        initItems.value = {
          itemIds: response.items.map(item => item.id),
          ...response
        }
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
          reset()
          if (initArgs.value) {
            loadItems(...initArgs.value)
          }
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
          const idx = entities.value.findIndex(i => i.id === updated.id)
          if (idx !== -1) entities.value[idx] = updated
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
          reset()
          if (initArgs.value) {
            loadItems(...initArgs.value)
          }
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
      entities.value = []
      initItems.value = {
        itemIds: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        offset: 0
      }
    }

    const items = computed(() => {
      return {
        items: initItems.value.itemIds.map(id => entities.value.find(entity => entity.id === id)).filter((entity): entity is T => !!entity),
        ...initItems.value
      }
    })

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
