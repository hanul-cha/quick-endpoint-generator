<template>
  <div class="container px-4 py-8 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Endpoints</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Create Endpoint
      </button>
    </div>

    <!-- 기존 엔드포인트 목록 -->
    <div class="p-6 bg-white border border-gray-200 rounded-lg">
      <div v-if="endpointStore.isLoading && !endpointStore.isInitialized" class="space-y-6">
        <div v-for="n in 3" :key="n" class="p-4 border rounded-lg animate-pulse bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex flex-col w-full space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-1/4 h-6 bg-gray-200 rounded"></div>
                <div class="w-12 h-5 bg-gray-200 rounded"></div>
              </div>
              <div class="flex items-center mt-2">
                <div class="w-2/3 h-4 bg-gray-200 rounded"></div>
                <div class="w-6 h-4 ml-2 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div class="flex ml-4 space-x-2">
              <div class="w-20 h-8 bg-gray-200 rounded"></div>
              <div class="w-12 h-8 bg-gray-200 rounded"></div>
              <div class="w-12 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="endpointStore.items.items.length === 0" class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No endpoints</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new endpoint.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Endpoint
          </button>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div v-for="endpoint in endpointStore.items.items" :key="endpoint.id" class="p-4 border rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex flex-col space-y-2">
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-medium">{{ endpoint.name }}</h3>
                <span class="px-2 py-0.5 text-xs font-medium bg-gray-100 border rounded-full" :class="{
                  'text-green-700 border-green-300': endpoint.method === 'GET',
                  'text-blue-700 border-blue-300': endpoint.method === 'POST',
                  'text-yellow-700 border-yellow-300': endpoint.method === 'PUT',
                  'text-red-700 border-red-300': endpoint.method === 'DELETE'
                }">{{ endpoint.method }}</span>
              </div>
              <div class="flex items-center">
                <div class="flex items-center px-3 py-1 mr-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md">
                  {{ getEndpointUrl(endpoint.id) }}
                </div>
                <button
                  @click="copyEndpointUrl(endpoint.id)"
                  class="text-xs text-gray-500 hover:text-indigo-600 focus:outline-none"
                  title="Copy Endpoint URL"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="space-x-2 text-sm">
              <button
                @click="runEndpoint(endpoint)"
                class="px-3 py-1 text-green-600 transition rounded-md hover:bg-green-50"
              >
                Run Endpoint
              </button>
              <button
                @click="editEndpoint(endpoint)"
                class="px-3 py-1 text-indigo-600 transition rounded-md hover:bg-indigo-50"
              >
                Edit
              </button>
              <button
                @click="deleteEndpoint(endpoint.id)"
                class="px-3 py-1 text-red-600 transition rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="endpointStore.items.totalPages > 0" class="flex items-center justify-between mt-4">
          <button
            @click="loadEndpoints(endpointStore.items.page - 1)"
            :disabled="!endpointStore.items.hasPreviousPage"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-gray-700">
            Page {{ endpointStore.items.page }} of {{ endpointStore.items.totalPages }}
          </span>
          <button
            @click="loadEndpoints(endpointStore.items.page + 1)"
            :disabled="!endpointStore.items.hasNextPage"
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
      <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg" style="max-height:98vh; overflow-y:auto;">
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
            <div class="editor-container">
              <CodeEditor
                v-model="editingEndpoint.script"
                :height="150"
                :parameter="editingEndpoint.parameter"
              />
            </div>
            <p v-if="errors.script" class="mt-1 text-sm text-red-600">
              {{ errors.script }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Parameter</label>
            <div class="mt-4 space-y-4 overflow-y-auto max-h-72">
              <div v-for="(field, index) in parameterFields" :key="index" class="space-y-2">
                <div class="flex">
                  <div class="w-1/2 pr-2 pl-0.5">
                    <label class="block text-sm font-medium text-gray-700">Key</label>
                    <input
                      v-model="field.key"
                      type="text"
                      class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:border-transparent focus:outline-none"
                      @input="updateParameter"
                    />
                  </div>
                  <div class="w-1/2 pl-2 pr-0.5">
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      v-model="field.type"
                      class="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:border-transparent focus:outline-none"
                      @change="updateParameter"
                    >
                      <option value="String">String</option>
                      <option value="Number">Number</option>
                      <option value="Boolean">Boolean</option>
                      <option value="Object">Object</option>
                      <option value="Array">Array</option>
                    </select>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      :id="`required-${index}`"
                      v-model="field.required"
                      class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      @change="updateParameter"
                    />
                    <label :for="`required-${index}`" class="ml-2 text-sm text-gray-700">Required</label>
                  </div>
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
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 rounded-md hover:bg-indigo-50"
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
          <h2 class="text-xl font-semibold">Run Endpoint</h2>
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
                  <JsonEditor
                    v-else-if="param.type === 'Object' || param.type === 'Array'"
                    v-model="testParameters[key].value"
                    class="block w-full mt-1"
                  />
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
              :disabled="endpointStore.isLoading"
            >
              <span v-if="endpointStore.isLoading" class="flex items-center">
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

    <!-- Toast 알림 -->
    <transition name="fade">
      <div v-if="showToast" class="fixed z-50 px-6 py-3 text-white transform -translate-x-1/2 bg-green-500 rounded shadow-lg bottom-8 left-1/2">
        {{ toastMessage }}
      </div>
    </transition>

    <!-- 삭제 확인 모달 -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Confirm Deletion"
      message="Are you sure you want to delete this endpoint?"
      confirm-text="Delete"
      confirm-button-color="bg-red-600"
      confirm-button-hover-color="bg-red-700"
      @confirm="confirmDeleteEndpoint"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Endpoint, Parameter, ParameterFieldWithKey, ParameterType } from '@/types/endpoint'
import CodeEditor from '@/components/CodeEditor.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import JsonEditor from '@/components/JsonEditor.vue'
import { useEndpointStore } from '@/stores/endpoint'

const endpointStore = useEndpointStore()
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
  // 파라미터 필드 추가 후 즉시 업데이트
  updateParameter()
}

const removeField = (index: number) => {
  parameterFields.value.splice(index, 1)
  // 파라미터 필드 제거 후 즉시 업데이트
  updateParameter()
}

// parameterFields 배열의 요소가 변경될 때마다 parameter 업데이트
const updateParameterFields = () => {
  // 엔드포인트 파라미터 업데이트
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

const updateParameter = () => {
  updateParameterFields()
}

const closeModal = () => {
  showModal.value = false
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
    await endpointStore.loadItems({ page, limit: 10 })
  } catch (error) {
    console.error('Failed to load endpoints:', error)
    alert('엔드포인트 목록을 불러오는 중 오류가 발생했습니다.')
  }
}

const editEndpoint = (endpoint: Endpoint) => {
  isEditing.value = true
  prepareEditingEndpoint(endpoint)
  showModal.value = true
}

// 상태 변수 추가
const showDeleteModal = ref(false)
const deletingEndpointId = ref<string | null>(null)

// 기존 deleteEndpoint 함수 수정
const deleteEndpoint = async (endpointId: string) => {
  deletingEndpointId.value = endpointId
  showDeleteModal.value = true
}

// 실제 삭제 함수 추가
const confirmDeleteEndpoint = async () => {
  if (!deletingEndpointId.value) return

  try {
    await endpointStore.deleteItem(deletingEndpointId.value)
    endpointStore.items.items = endpointStore.items.items.filter(endpoint => endpoint.id !== deletingEndpointId.value)
    showDeleteModal.value = false
    deletingEndpointId.value = null
  } catch (error) {
    console.error('Failed to delete endpoint:', error)
    alert('An error occurred while deleting the endpoint.')
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
    errors.value.name = 'Endpoint name is required.'
    isValid = false
  }

  if (!editingEndpoint.value.method) {
    errors.value.method = 'HTTP method is required.'
    isValid = false
  }

  // 파라미터 필드 유효성 검사
  for (const field of parameterFields.value) {
    if (!field.key.trim()) {
      errors.value.parameter = 'All parameters must have a key value.'
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
      const updatedEndpoint = await endpointStore.updateItem(
        editingEndpoint.value.id,
        editingEndpoint.value
      )
      const index = endpointStore.items.items.findIndex(e => e.id === updatedEndpoint.id)
      if (index !== -1) {
        endpointStore.items.items[index] = updatedEndpoint
      }
    } else {
      await endpointStore.createItem(editingEndpoint.value)
    }
    closeModal()
  } catch (error) {
    console.error(`Failed to ${isEditing.value ? 'update' : 'create'} endpoint:`, error)
    alert(`Endpoint ${isEditing.value ? 'update' : 'create'} failed.`)
  }
}

// 테스트 관련 상태
const showTestModal = ref(false)
const currentEndpoint = ref<Endpoint | null>(null)
const testUrl = ref('')
const testParameters = ref<Record<string, { key: string; value: any }>>({})
const testResponse = ref<any>(null)
const errorMessage = ref<string | null>(null)

// 테스트 모달 열기
const runEndpoint = (endpoint: Endpoint) => {
  currentEndpoint.value = endpoint
  testUrl.value = getEndpointUrl(endpoint.id)

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
}

// 테스트 요청 보내기
const sendTestRequest = async () => {
  if (!currentEndpoint.value) return

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
  }
}

// 모달이 열릴 때 parameter 변환 로직
const prepareEditingEndpoint = (endpoint?: Endpoint) => {
  if (endpoint) {
    // 기존 엔드포인트 수정
    editingEndpoint.value = {
      id: endpoint.id,
      name: endpoint.name,
      method: endpoint.method,
      script: endpoint.script || '',
      parameter: endpoint.parameter || {}
    }
    // parameter 객체를 fields 배열로 변환
    parameterFields.value = Object.entries(endpoint.parameter || {}).map(([key, param]) => ({
      key,
      type: param.type,
      required: param.required
    }))
  } else {
    // 새 엔드포인트 생성
    editingEndpoint.value = {
      name: '',
      method: 'GET',
      script: '',
      parameter: {}
    }
    parameterFields.value = []
  }

  // parameter 초기 설정
  updateParameter()
}

// 모달 창 열기/닫기 시 로직 처리
watch(showModal, (isOpen) => {
  if (isOpen) {
    // 모달이 열릴 때는 아무 작업 없음 (이미 prepareEditingEndpoint에서 처리)
  } else {
    // 모달이 닫힐 때는 상태 초기화
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
})

// "Create Endpoint" 버튼 클릭 시
const openCreateModal = () => {
  isEditing.value = false
  prepareEditingEndpoint() // 새 엔드포인트 준비
  showModal.value = true
}

const showToast = ref(false)
const toastMessage = ref('')

const showCopyToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 1500)
}

// 엔드포인트 URL 가져오기
const getEndpointUrl = (endpointId: string): string => {
  return `${import.meta.env.VITE_API_URL}/run/${endpointId}`
}

// 엔드포인트 URL 복사
const copyEndpointUrl = async (endpointId: string) => {
  try {
    const url = getEndpointUrl(endpointId)
    await navigator.clipboard.writeText(url)
    showCopyToast('URL Copied')
  } catch (e) {
    alert('Failed to copy URL to clipboard.')
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
  @apply ring-2 ring-indigo-500 ring-opacity-50 border-transparent;
}

input.border-red-500:focus, select.border-red-500:focus, textarea.border-red-500:focus {
  @apply ring-red-500;
}

input.border-gray-300:focus, select.border-gray-300:focus, textarea.border-gray-300:focus {
  @apply ring-indigo-500;
}

.editor-container {
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>