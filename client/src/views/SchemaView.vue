<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Tables</h1>
      <button
        @click="showModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Create Table
      </button>
    </div>

    <!-- 기존 테이블 목록 -->
    <div class="bg-white rounded-lg p-6 border border-gray-200">
      <div v-if="tables.items.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tables</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new table.</p>
        <div class="mt-6">
          <button
            @click="showModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Table
          </button>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div v-for="table in tables.items" :key="table.id" class="border rounded-lg p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">{{ table.name }}</h3>
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="column in table.columns" :key="column.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ column.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ column.type }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="tables.totalPages > 0" class="flex justify-between items-center mt-4">
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl border border-gray-200">
        <div class="flex justify-between items-center mb-4">
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
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium mb-4">Columns</h3>
            <div class="space-y-4">
              <div v-for="(column, index) in editingTable.columns" :key="index" class="flex gap-4 items-start">
                <div class="flex-1">
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
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    v-model="column.type"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <button
                  @click="removeColumn(index)"
                  class="px-3 py-2 text-red-600 hover:text-red-800 mt-7"
                >
                  Remove
                </button>
              </div>
              <button
                @click="addColumn"
                class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Add Column
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="saveTable"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {{ isEditing ? 'Save Changes' : 'Create Table' }}
            </button>
          </div>
        </div>
      </div>
    </div>
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
      tables.value.items.push(table)
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
</style>