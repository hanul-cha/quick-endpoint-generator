import type { Endpoint } from '@/types/endpoint'
import { defineStore } from 'pinia'
import { endpointApi } from '@/api/endpoint'
import { ref } from 'vue'

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

  const loadEndpoints = async (page?: number) => {
    isLoading.value = true
    error.value = null
    try {
      endpoints.value = await endpointApi.getMyEndpoints({ page: page || 1 })
    } catch (err) {
      error.value = '엔드포인트 목록을 불러오는 중 오류가 발생했습니다.'
      console.error('Failed to load endpoints:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createEndpoint = async (endpoint: Partial<Endpoint>) => {
    isLoading.value = true
    error.value = null
    try {
      const newEndpoint = await endpointApi.createEndpoint(endpoint)
      endpoints.value.items.unshift(newEndpoint)
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
      const index = endpoints.value.items.findIndex(e => e.id === updatedEndpoint.id)
      if (index !== -1) {
        endpoints.value.items[index] = updatedEndpoint
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
      endpoints.value.items = endpoints.value.items.filter(endpoint => endpoint.id !== id)
    } catch (err) {
      error.value = '엔드포인트 삭제 중 오류가 발생했습니다.'
      console.error('Failed to delete endpoint:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    endpoints,
    isLoading,
    error,
    loadEndpoints,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint
  }
})