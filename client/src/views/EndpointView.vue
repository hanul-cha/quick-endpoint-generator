<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Endpoints</h1>
      <button
        @click="showModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Create Endpoint
      </button>
    </div>

    <!-- 기존 엔드포인트 목록 -->
    <div class="bg-white rounded-lg p-6 border border-gray-200">
      <div v-if="endpoints.items.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No endpoints</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new endpoint.</p>
        <div class="mt-6">
          <button
            @click="showModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Endpoint
          </button>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div v-for="endpoint in endpoints.items" :key="endpoint.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="text-lg font-medium">{{ endpoint.name }}</h3>
              <p class="text-sm text-gray-500">{{ endpoint.method }} | Schema: {{ endpoint.schema?.name }}</p>
            </div>
            <div class="space-x-2">
              <button
                @click="editEndpoint(endpoint)"
                class="text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </button>
              <button
                @click="deleteEndpoint(endpoint.id)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="endpoints.totalPages > 0" class="flex justify-between items-center mt-4">
          <button
            @click="loadEndpoints(endpoints.page - 1)"
            :disabled="!endpoints.hasPreviousPage"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-gray-700">
            Page {{ endpoints.page }} of {{ endpoints.totalPages }}
          </span>
          <button
            @click="loadEndpoints(endpoints.page + 1)"
            :disabled="!endpoints.hasNextPage"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Endpoint Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ isEditing ? 'Edit' : 'Create New' }} Endpoint</h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Endpoint Name</label>
            <input
              v-model="editingEndpoint.name"
              type="text"
              :class="[
                'mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none',
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">HTTP Method</label>
            <select
              v-model="editingEndpoint.method"
              :class="[
                'mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none',
                errors.method
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <p v-if="errors.method" class="mt-1 text-sm text-red-600">
              {{ errors.method }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Schema</label>
            <select
              v-model="editingEndpoint.schemaId"
              :class="[
                'mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none',
                errors.schemaId
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            >
              <option v-for="schema in schemas" :key="schema.id" :value="schema.id">
                {{ schema.name }}
              </option>
            </select>
            <p v-if="errors.schemaId" class="mt-1 text-sm text-red-600">
              {{ errors.schemaId }}
            </p>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="saveEndpoint"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {{ isEditing ? 'Save Changes' : 'Create Endpoint' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Endpoint } from '@/types/endpoint'
import type { DataTable } from '@/types/data-table'
import { endpointApi } from '@/api/endpoint'
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
const showModal = ref(false)
const schemas = ref<DataTable[]>([])
const isEditing = ref(false)
const editingEndpoint = ref<Partial<Endpoint>>({
  name: '',
  method: 'GET',
  schemaId: ''
})

const errors = ref({
  name: '',
  method: '',
  schemaId: ''
})

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingEndpoint.value = {
    name: '',
    method: 'GET',
    schemaId: ''
  }
  errors.value = {
    name: '',
    method: '',
    schemaId: ''
  }
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
  loadEndpoints()
  loadSchemas()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

const loadSchemas = async () => {
  try {
    const response = await tableApi.getMyTables({ page: 1, limit: 100 })
    schemas.value = response.items
  } catch (error) {
    console.error('Failed to load schemas:', error)
    alert('스키마 목록을 불러오는 중 오류가 발생했습니다.')
  }
}

const loadEndpoints = async (page?: number) => {
  try {
    const response = await endpointApi.getMyEndpoints({ page: page || 1 })
    endpoints.value = response
  } catch (error) {
    console.error('Failed to load endpoints:', error)
    alert('엔드포인트 목록을 불러오는 중 오류가 발생했습니다.')
    // 에러 발생 시 빈 상태로 초기화
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
}

const editEndpoint = (endpoint: Endpoint) => {
  isEditing.value = true
  editingEndpoint.value = {
    id: endpoint.id,
    name: endpoint.name,
    method: endpoint.method,
    schemaId: endpoint.schemaId
  }
  showModal.value = true
}

const deleteEndpoint = async (endpointId: string) => {
  if (!confirm('정말로 이 엔드포인트를 삭제하시겠습니까?')) {
    return
  }

  try {
    await endpointApi.deleteEndpoint(endpointId)
    endpoints.value.items = endpoints.value.items.filter(endpoint => endpoint.id !== endpointId)
  } catch (error) {
    console.error('Failed to delete endpoint:', error)
    alert('엔드포인트 삭제 중 오류가 발생했습니다.')
  }
}

const validateForm = () => {
  errors.value = {
    name: '',
    method: '',
    schemaId: ''
  }

  let isValid = true

  if (!editingEndpoint.value.name?.trim()) {
    errors.value.name = '엔드포인트 이름은 필수입니다.'
    isValid = false
  }

  if (!editingEndpoint.value.method) {
    errors.value.method = 'HTTP 메소드는 필수입니다.'
    isValid = false
  }

  if (!editingEndpoint.value.schemaId) {
    errors.value.schemaId = '스키마 선택은 필수입니다.'
    isValid = false
  }

  return isValid
}

const saveEndpoint = async () => {
  if (!validateForm()) {
    return
  }

  try {
    if (isEditing.value && editingEndpoint.value.id) {
      const updatedEndpoint = await endpointApi.updateEndpoint(
        editingEndpoint.value.id,
        editingEndpoint.value
      )
      const index = endpoints.value.items.findIndex(e => e.id === updatedEndpoint.id)
      if (index !== -1) {
        endpoints.value.items[index] = updatedEndpoint
      }
    } else {
      const endpoint = await endpointApi.createEndpoint(editingEndpoint.value)
      endpoints.value.items.push(endpoint)
    }
    closeModal()
  } catch (error) {
    console.error(`Failed to ${isEditing.value ? 'update' : 'create'} endpoint:`, error)
    alert(`엔드포인트 ${isEditing.value ? '수정' : '생성'} 중 오류가 발생했습니다.`)
  }
}

// 초기 데이터 로드
loadEndpoints()
loadSchemas()
</script>

<style scoped>
.table-container {
  @apply overflow-x-auto;
}

input:focus, select:focus {
  @apply ring-2 ring-opacity-50;
}

input.border-red-500:focus, select.border-red-500:focus {
  @apply ring-red-500;
}

input.border-gray-300:focus, select.border-gray-300:focus {
  @apply ring-indigo-500;
}
</style>