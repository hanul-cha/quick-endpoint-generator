import { PaginatedResponse, PaginationOptions } from '@/api/pagination'
import { Ref, computed, ref } from 'vue'

import { ApiType } from '@/api'
import { defineStore } from 'pinia'

export function createStore<T extends (Record<string, any> & { id: string }), Api extends ApiType<T> = ApiType<T>>(
  storeId: string,
  api: Api
) {
  return defineStore(storeId, () => {
    const entities: Ref<T[]> = ref([])

    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const isInitialized = ref(false)
    const paginationMap = ref<Map<number, string[]>>(new Map())
    const internalPaginationInfo = ref<Required<PaginationOptions>>({
      page: 1,
      limit: 10,
    })
    const total = ref(0)

    const loadItems = async (...args: Parameters<Api['pagination']>) => {
      const option = args[0]

      if (option?.page) {
        internalPaginationInfo.value = {
          page: option.page,
          limit: option.limit ?? internalPaginationInfo.value.limit
        }
      }

      const hasThisPage = paginationMap.value.has(internalPaginationInfo.value.page)

      if (isInitialized.value && hasThisPage) {
        return pagination.value
      }

      if (!hasThisPage) {
        isInitialized.value = false
      }

      const restArgs = args.slice(1)

      isLoading.value = true
      error.value = null

      try {
        const response = await api.pagination(internalPaginationInfo.value, ...restArgs)
        entities.value.push(...response.items)
        paginationMap.value.set(internalPaginationInfo.value.page, response.items.map(item => item.id))
        total.value = response.total
        isInitialized.value = true
        return pagination.value
      } catch (err) {
        error.value = 'Error loading items'
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const getItem = async (id: string) => {
      const findIdx = entities.value.findIndex(i => i.id === id)
      if (findIdx !== -1) {
        return entities.value[findIdx]
      }

      isLoading.value = true
      error.value = null
      try {
        const item = await api.getItem(id)
        if (item) {
          entities.value.push(item)
        }
        return item
      } finally {
        isLoading.value = false
      }
    }

    const createItem = async (...args: Parameters<Api['create']>) => {
      isLoading.value = true
      error.value = null
      try {
        const newItem = await api.create(args[0], ...args.slice(1))
        entities.value.push(newItem)
        paginationMap.value.set(internalPaginationInfo.value.page, [newItem.id, ...paginationMap.value.get(internalPaginationInfo.value.page) ?? []])
        total.value++
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
        const idx = entities.value.findIndex(i => i.id === updated.id)
        if (idx !== -1) entities.value[idx] = updated
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
        entities.value = entities.value.filter(entity => entity.id !== id)
        paginationMap.value.forEach((ids, page) => {
          if (!ids.includes(id)) return
          paginationMap.value.set(page, ids.filter((paginationId) => paginationId !== id))
        })
        total.value--
      } catch (err) {
        error.value = '삭제 중 오류가 발생했습니다.'
        throw err
      } finally {
        isLoading.value = false
      }
    }

    // const reset = () => {
    //   isInitialized.value = false
    //   entities.value = []
    //   paginationResponseCache.value = {
    //     total: 0,
    //     hasNextPage: false,
    //     hasPreviousPage: false,
    //     offset: 0
    //   }
    //   paginationMap.value.clear()
    // }

    const pagination = computed((): PaginatedResponse<T> => {
      const itemIds = paginationMap.value.get(internalPaginationInfo.value.page) ?? []

      const page = internalPaginationInfo.value.page
      const limit = internalPaginationInfo.value.limit

      const skip = (page - 1) * limit

      return {
        items: itemIds.map(id => entities.value.find(entity => entity.id === id)).filter((entity): entity is T => !!entity),
        total: total.value,
        hasNextPage: skip + itemIds.length < total.value,
        hasPreviousPage: page > 1,
        offset: skip,
        totalPages: Math.ceil(total.value / limit),
        page: internalPaginationInfo.value.page,
        limit: internalPaginationInfo.value.limit,
      }
    })

    return {
      isLoading,
      error,
      isInitialized,
      pagination,
      loadItems,
      getItem,
      createItem,
      updateItem,
      deleteItem,
    }
  })
}
