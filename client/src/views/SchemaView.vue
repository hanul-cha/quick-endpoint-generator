<template>
  <div class="container px-4 py-8 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Tables</h1>
      <button
        @click="showModal = true"
        class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Create Table
      </button>
    </div>

    <!-- 기존 테이블 목록 -->
    <div class="p-6 bg-white border border-gray-200 rounded-lg">
      <div v-if="tables.items.length === 0" class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tables</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new table.</p>
        <div class="mt-6">
          <button
            @click="showModal = true"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Table
          </button>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div v-for="table in tables.items" :key="table.id" class="p-4 border rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-medium">{{ table.name }}</h3>
              <span class="text-xs text-gray-400">({{ table.id }})</span>
              <button
                @click="copyId(table.id)"
                class="ml-1 text-xs text-gray-500 hover:text-indigo-600 focus:outline-none"
                title="ID 복사"
              >
                <svg class="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                </svg>
              </button>
            </div>
            <div class="space-x-2">
              <button
                @click="editTable(table)"
                class="text-indigo-600 hover:text-indigo-800"
              >
                Edit
              </button>
              <button
                @click="deleteTable(table.id)"
                class="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="column in table.columns" :key="column.id">
                  <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{{ column.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ column.type }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="tables.totalPages > 0" class="flex items-center justify-between mt-4">
          <button
            @click="loadTables(tables.page - 1)"
            :disabled="!tables.hasPreviousPage"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-gray-700">
            Page {{ tables.page }} of {{ tables.totalPages }}
          </span>
          <button
            @click="loadTables(tables.page + 1)"
            :disabled="!tables.hasNextPage"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Table Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">{{ isEditing ? 'Edit' : 'Create New' }} Table</h2>
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
            <label class="block text-sm font-medium text-gray-700">Table Name</label>
            <input
              v-model="editingTable.name"
              type="text"
              :class="[
                'mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none',
                errors.tableName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            />
            <p v-if="errors.tableName" class="mt-1 text-sm text-red-600">
              {{ errors.tableName }}
            </p>
          </div>

          <!-- 컬럼 추가 섹션 -->
          <div class="pt-4 border-t">
            <h3 class="mb-4 text-lg font-medium">Columns</h3>
            <div class="space-y-4">
              <div v-for="(column, index) in editingTable.columns" :key="index" class="grid grid-cols-[1fr,1fr,auto] gap-4 items-start">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Column Name</label>
                  <input
                    v-model="column.name"
                    type="text"
                    :class="[
                      'mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none',
                      errors.columns[index]
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-indigo-500'
                    ]"
                  />
                  <p v-if="errors.columns[index]" class="mt-1 text-sm text-red-600">
                    {{ errors.columns[index] }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    v-model="column.type"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <div class="flex items-center h-full pt-2">
                  <button
                    @click="removeColumn(index)"
                    class="text-red-600 hover:text-red-800 whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <button
                @click="addColumn"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
              >
                Add Column
              </button>
            </div>
          </div>

          <div class="flex justify-end mt-6 space-x-3">
            <button
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="saveTable"
              class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {{ isEditing ? 'Save Changes' : 'Create Table' }}
            </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { DataTable } from '../types/data-table'
import { tableApi } from '../api/table'

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
const showModal = ref(false)
const isEditing = ref(false)
const editingTable = ref<Partial<DataTable>>({
  name: '',
  columns: []
})

const errors = ref({
  tableName: '',
  columns: [] as string[]
})

const copiedId = ref<string | null>(null)
const showToast = ref(false)
const toastMessage = ref('')

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  // 폼 초기화
  editingTable.value = {
    name: '',
    columns: []
  }
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

const addColumn = () => {
  if (!editingTable.value.columns) {
    editingTable.value.columns = []
  }
  editingTable.value.columns.push({
    id: crypto.randomUUID(),
    name: '',
    type: 'string'
  })
}

const removeColumn = (index: number) => {
  editingTable.value.columns?.splice(index, 1)
}

const validateForm = () => {
  errors.value = {
    tableName: '',
    columns: []
  }

  let isValid = true

  // 테이블 이름 검사
  if (!editingTable.value.name?.trim()) {
    errors.value.tableName = '테이블 이름은 필수입니다.'
    isValid = false
  }

  // 컬럼 이름 검사
  editingTable.value.columns?.forEach((column, index) => {
    if (!column.name?.trim()) {
      errors.value.columns[index] = '컬럼 이름은 필수입니다.'
      isValid = false
    } else {
      errors.value.columns[index] = ''
    }
  })

  return isValid
}

const saveTable = async () => {
  if (!validateForm()) {
    return
  }

  try {
    if (isEditing.value && editingTable.value.id) {
      const updatedTable = await tableApi.updateTable(editingTable.value.id, editingTable.value)
      const index = tables.value.items.findIndex(t => t.id === updatedTable.id)
      if (index !== -1) {
        tables.value.items[index] = updatedTable
      }
    } else {
      const table = await tableApi.createTable(editingTable.value)
      tables.value.items.unshift(table)
    }
    closeModal()
  } catch (error) {
    console.error(`Failed to ${isEditing.value ? 'update' : 'create'} table:`, error)
    alert(`테이블 ${isEditing.value ? '수정' : '생성'} 중 오류가 발생했습니다.`)
  }
}

const editTable = (table: DataTable) => {
  isEditing.value = true
  editingTable.value = { ...table, id: table.id }
  showModal.value = true
}

const deleteTable = async (tableId: string) => {
  try {
    await tableApi.deleteTable(tableId)
    tables.value.items = tables.value.items.filter(table => table.id !== tableId)
  } catch (error) {
    console.error('Failed to delete table:', error)
    alert('테이블 삭제 중 오류가 발생했습니다.')
  }
}

const showCopyToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 1500)
}

const copyId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id)
    showCopyToast('복사되었습니다')
  } catch (e) {
    alert('클립보드 복사에 실패했습니다.')
  }
}

// 컴포넌트 마운트 시 테이블 목록 로드
const loadTables = async (page?: number) => {
  try {
    tables.value = await tableApi.getMyTables({ page: page || 1 })
  } catch (error) {
    console.error('Failed to load tables:', error)
    alert('테이블 목록을 불러오는 중 오류가 발생했습니다.')
  }
}

loadTables()
</script>

<style scoped>
.table-container {
  @apply overflow-x-auto;
}

table {
  @apply min-w-full divide-y divide-gray-200;
}

th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50;
}

td {
  @apply px-6 py-4 whitespace-nowrap text-sm;
}

input:focus, select:focus {
  @apply ring-2 ring-opacity-50;
}

input.border-red-500:focus {
  @apply ring-red-500;
}

input.border-gray-300:focus {
  @apply ring-indigo-500;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>