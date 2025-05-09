<template>
  <div class="container px-4 py-8 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Endpoints</h1>
      <button
        @click="showModal = true"
        class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Create Endpoint
      </button>
    </div>

    <!-- 기존 엔드포인트 목록 -->
    <div class="p-6 bg-white border border-gray-200 rounded-lg">
      <div v-if="endpoints.items.length === 0" class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No endpoints</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new endpoint.</p>
        <div class="mt-6">
          <button
            @click="showModal = true"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Endpoint
          </button>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div v-for="endpoint in endpoints.items" :key="endpoint.id" class="p-4 border rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium">{{ endpoint.name }}</h3>
              <p class="text-sm text-gray-500">{{ endpoint.method }}</p>
            </div>
            <div class="space-x-2">
              <button
                @click="testEndpoint(endpoint)"
                class="text-green-600 hover:text-green-800"
              >
                Test
              </button>
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
        <div v-if="endpoints.totalPages > 0" class="flex items-center justify-between mt-4">
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-4">
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
            <label class="block text-sm font-medium text-gray-700">Script</label>
            <textarea
              v-model="editingEndpoint.script"
              rows="4"
              :class="[
                'mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none',
                errors.script
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            ></textarea>
            <p v-if="errors.script" class="mt-1 text-sm text-red-600">
              {{ errors.script }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Parameter</label>
            <div class="mt-4 space-y-4">
              <div v-for="(field, index) in parameterFields" :key="index" class="grid grid-cols-[1fr,1fr,auto,auto] gap-4 items-start">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Key</label>
                  <input
                    v-model="field.key"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    v-model="field.type"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Object">Object</option>
                    <option value="Array">Array</option>
                  </select>
                </div>
                <div class="flex items-center h-full pt-2">
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="field.required"
                      class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span class="text-sm text-gray-700">Required</span>
                  </label>
                </div>
                <div class="flex items-center h-full pt-2">
                  <button
                    @click="removeField(index)"
                    class="text-red-600 hover:text-red-800 whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <button
                @click="addField"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
              >
                Add Field
              </button>
            </div>
            <p v-if="errors.parameter" class="mt-1 text-sm text-red-600">
              {{ errors.parameter }}
            </p>
          </div>

          <div class="flex justify-end mt-6 space-x-3">
            <button
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="saveEndpoint"
              class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {{ isEditing ? 'Save Changes' : 'Create Endpoint' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Endpoint Modal -->
    <div
      v-if="showTestModal && currentEndpoint"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeTestModal"
    >
      <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Test Endpoint</h2>
          <button
            @click="closeTestModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Endpoint URL</label>
            <div class="flex items-center mt-1">
              <span class="px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                {{ currentEndpoint.method }}
              </span>
              <input
                v-model="testUrl"
                type="text"
                class="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:border-indigo-500"
                readonly
              />
            </div>
          </div>

          <!-- Parameters Section -->
          <div v-if="currentEndpoint.parameter && Object.keys(currentEndpoint.parameter).length > 0">
            <label class="block text-sm font-medium text-gray-700">Parameters</label>
            <div class="mt-4 space-y-4">
              <div v-for="(param, key) in currentEndpoint.parameter" :key="key" class="grid grid-cols-[1fr,1fr] gap-4 items-start">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Key</label>
                  <input
                    :value="key"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Value</label>
                  <input
                    v-if="param.type === 'String'"
                    v-model="testParameters[key].value"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                    :placeholder="`Enter ${param.type} value`"
                  />
                  <input
                    v-else-if="param.type === 'Number'"
                    v-model.number="testParameters[key].value"
                    type="number"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                    :placeholder="`Enter ${param.type} value`"
                  />
                  <select
                    v-else-if="param.type === 'Boolean'"
                    v-model="testParameters[key].value"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                  >
                    <option :value="true">true</option>
                    <option :value="false">false</option>
                  </select>
                  <textarea
                    v-else-if="param.type === 'Object' || param.type === 'Array'"
                    v-model="testParameters[key].value"
                    rows="2"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                    :placeholder="`Enter ${param.type} value (JSON format)`"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6 space-x-3">
            <button
              @click="closeTestModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="sendTestRequest"
              class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
              <span v-else>Send Request</span>
            </button>
          </div>

          <!-- Response Section -->
          <div v-if="testResponse || errorMessage" class="mt-6">
            <h3 class="mb-2 text-lg font-medium">Response</h3>
            <div class="p-4 rounded-md" :class="errorMessage ? 'bg-red-50' : 'bg-gray-50'">
              <pre v-if="errorMessage" class="overflow-auto text-sm text-red-600 max-h-64">{{ errorMessage }}</pre>
              <pre v-else class="overflow-auto text-sm max-h-64">{{ JSON.stringify(testResponse, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Endpoint, Parameter, ParameterFieldWithKey, ParameterType } from '@/types/endpoint'
import { endpointApi } from '@/api/endpoint'

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
const isEditing = ref(false)
const editingEndpoint = ref<Partial<Endpoint>>({
  name: '',
  method: 'GET',
  script: '',
  parameter: {}
})

const parameterFields = ref<ParameterFieldWithKey[]>([])

const errors = ref({
  name: '',
  method: '',
  parameterType: '',
  script: '',
  parameter: ''
})

const addField = () => {
  parameterFields.value.push({
    key: '',
    type: 'String',
    required: false
  })
}

const removeField = (index: number) => {
  parameterFields.value.splice(index, 1)
}

const updateParameter = () => {
  const parameterObj: Parameter = {}
  for (const field of parameterFields.value) {
    if (field.key.trim()) {
      parameterObj[field.key] = {
        type: field.type,
        required: field.required || false
      }
    }
  }
  editingEndpoint.value.parameter = parameterObj
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingEndpoint.value = {
    name: '',
    method: 'GET',
    script: '',
    parameter: {}
  }
  parameterFields.value = []
  errors.value = {
    name: '',
    method: '',
    parameterType: '',
    script: '',
    parameter: ''
  }
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (showModal.value) {
      closeModal()
    } else if (showTestModal.value) {
      closeTestModal()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
  loadEndpoints()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

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
    script: endpoint.script,
    parameter: endpoint.parameter
  }
  // parameter 객체를 fields 배열로 변환
  parameterFields.value = Object.entries(endpoint.parameter || {}).map(([key, param]) => ({
    key,
    type: param.type,
    required: param.required
  }))
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
    parameterType: '',
    script: '',
    parameter: ''
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

  // 파라미터 필드 유효성 검사
  for (const field of parameterFields.value) {
    if (!field.key.trim()) {
      errors.value.parameter = '모든 파라미터는 키 값이 있어야 합니다.'
      isValid = false
      break
    }
  }

  return isValid
}

const saveEndpoint = async () => {
  if (!validateForm()) {
    return
  }

  // 파라미터 업데이트
  updateParameter()

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
      endpoints.value.items.unshift(endpoint)
    }
    closeModal()
  } catch (error) {
    console.error(`Failed to ${isEditing.value ? 'update' : 'create'} endpoint:`, error)
    alert(`엔드포인트 ${isEditing.value ? '수정' : '생성'} 중 오류가 발생했습니다.`)
  }
}

// 테스트 관련 상태
const showTestModal = ref(false)
const currentEndpoint = ref<Endpoint | null>(null)
const testUrl = ref('')
const testParameters = ref<Record<string, { key: string; value: any }>>({})
const testResponse = ref<any>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

// 테스트 모달 열기
const testEndpoint = (endpoint: Endpoint) => {
  currentEndpoint.value = endpoint
  testUrl.value = `${import.meta.env.VITE_API_URL}/${endpoint.id}`

  // 파라미터 초기화
  testParameters.value = {}
  if (endpoint.parameter) {
    Object.entries(endpoint.parameter).forEach(([key, param]) => {
      testParameters.value[key] = {
        key,
        value: getDefaultValue(param.type)
      }
    })
  }

  testResponse.value = null
  showTestModal.value = true
}

// 타입에 따른 기본값 설정
const getDefaultValue = (type: ParameterType): any => {
  switch (type) {
    case 'String':
      return ''
    case 'Number':
      return 0
    case 'Boolean':
      return false
    case 'Object':
      return '{}'
    case 'Array':
      return '[]'
    default:
      return ''
  }
}

// 테스트 모달 닫기
const closeTestModal = () => {
  showTestModal.value = false
  currentEndpoint.value = null
  testUrl.value = ''
  testParameters.value = {}
  testResponse.value = null
  errorMessage.value = null
  isLoading.value = false
}

// 테스트 요청 보내기
const sendTestRequest = async () => {
  if (!currentEndpoint.value) return

  isLoading.value = true
  errorMessage.value = null
  testResponse.value = null

  try {
    // 파라미터 값 변환
    const params: Record<string, any> = {}
    Object.entries(testParameters.value).forEach(([key, param]) => {
      const paramType = currentEndpoint.value?.parameter?.[key]?.type
      if (paramType === 'Object' || paramType === 'Array') {
        try {
          params[key] = JSON.parse(param.value)
        } catch (error) {
          console.error(`Invalid JSON for ${key}:`, error)
          throw new Error(`Invalid JSON format for ${key}`)
        }
      } else {
        params[key] = param.value
      }
    })

    // URL 생성
    let url = testUrl.value
    const method = currentEndpoint.value.method

    // GET, DELETE 메소드의 경우 query parameter로 전송
    if (method === 'GET' || method === 'DELETE') {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value))
      })
      url += `?${queryParams.toString()}`
    }

    // 요청 옵션 설정
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }

    // POST, PUT 메소드의 경우 body에 파라미터 전송
    if (method === 'POST' || method === 'PUT') {
      requestOptions.body = JSON.stringify(params)
    }

    const response = await fetch(url, requestOptions)
    const data = await response.json()
    testResponse.value = data
  } catch (error) {
    console.error('Test request failed:', error)
    errorMessage.value = error instanceof Error ? error.message : '요청을 보내는 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 초기 데이터 로드
loadEndpoints()
</script>

<style scoped>
.table-container {
  @apply overflow-x-auto;
}

input:focus, select:focus, textarea:focus {
  @apply ring-2 ring-opacity-50;
}

input.border-red-500:focus, select.border-red-500:focus, textarea.border-red-500:focus {
  @apply ring-red-500;
}

input.border-gray-300:focus, select.border-gray-300:focus, textarea.border-gray-300:focus {
  @apply ring-indigo-500;
}
</style>