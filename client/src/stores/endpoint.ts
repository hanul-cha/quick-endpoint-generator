import type { Endpoint } from '@/types/endpoint'
import { PaginatedResponse } from '@/api/pagination'
import { defineStore } from 'pinia'
import { endpointApi } from '@/api/endpoint'
import { ref } from 'vue'

export const useEndpointStore = defineStore('endpoint', () => {
  const endpoints = ref<PaginatedResponse<Endpoint>>({
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

  const loadEndpoints = async (page?: number) => {
    if (isInitialized.value && !page) {
      return endpoints.value
    }

    isLoading.value = true
    error.value = null
    try {
      endpoints.value = await endpointApi.getMyEndpoints({ page: page || 1 })
      isInitialized.value = true
      return endpoints.value
    } catch (err) {
      error.value = '엔드포인트 목록을 불러오는 중 오류가 발생했습니다.'
      console.error('Failed to load endpoints:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createEndpoint = async (endpoint: Partial<Endpoint>) => {
    isLoading.value = true
    error.value = null
    try {
      const newEndpoint = await endpointApi.createEndpoint(endpoint)
      if (isInitialized.value) {
        endpoints.value.items.unshift(newEndpoint)
        endpoints.value.total += 1
      }
      return newEndpoint
    } catch (err) {
      error.value = '엔드포인트 생성 중 오류가 발생했습니다.'
      console.error('Failed to create endpoint:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateEndpoint = async (id: string, endpoint: Partial<Endpoint>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedEndpoint = await endpointApi.updateEndpoint(id, endpoint)
      if (isInitialized.value) {
        const index = endpoints.value.items.findIndex(e => e.id === updatedEndpoint.id)
        if (index !== -1) {
          endpoints.value.items[index] = updatedEndpoint
        }
      }
      return updatedEndpoint
    } catch (err) {
      error.value = '엔드포인트 수정 중 오류가 발생했습니다.'
      console.error('Failed to update endpoint:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteEndpoint = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await endpointApi.deleteEndpoint(id)
      if (isInitialized.value) {
        endpoints.value.items = endpoints.value.items.filter(endpoint => endpoint.id !== id)
        endpoints.value.total -= 1
      }
    } catch (err) {
      error.value = '엔드포인트 삭제 중 오류가 발생했습니다.'
      console.error('Failed to delete endpoint:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    isInitialized.value = false
    endpoints.value = {
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
    endpoints,
    isLoading,
    error,
    isInitialized,
    loadEndpoints,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    reset
  }
})