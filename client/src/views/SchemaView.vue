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
      <div v-if="isLoading" class="space-y-6">
        <div v-for="n in 3" :key="n" class="flex items-center justify-between p-4 border rounded-lg animate-pulse bg-gray-50">
          <div class="flex items-center space-x-2">
            <div class="w-32 h-6 bg-gray-200 rounded"></div>
            <div class="w-40 h-5 bg-gray-200 rounded"></div>
          </div>
          <div class="flex space-x-2">
            <div class="w-12 h-8 bg-gray-200 rounded"></div>
            <div class="w-12 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div v-else-if="tables.items.length === 0" class="py-12 text-center">
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
        <div
          v-for="table in tables.items"
          :key="table.id"
          class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          @click="navigateToTable(table.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <h3 class="text-lg font-medium">
                {{ table.name }}
              </h3>
              <span class="text-xs text-gray-400">({{ table.id }})</span>
              <button
                @click.stop="copyId(table.id)"
                class="ml-1 text-xs text-gray-500 hover:text-indigo-600 focus:outline-none"
                title="ID 복사"
              >
                <svg class="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                </svg>
              </button>
            </div>
            <div class="space-x-2 text-sm">
              <button
                @click.stop="editTable(table)"
                class="px-3 py-1 text-indigo-600 transition rounded-md hover:bg-indigo-50"
              >
                Edit
              </button>
              <button
                @click.stop="deleteTable(table.id)"
                class="px-3 py-1 text-red-600 transition rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </div>
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
    <TableEditModal
      v-model="showModal"
      :table="editingTable"
      :is-editing="isEditing"
      @save="handleTableSave"
    />

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
      message="Are you sure you want to delete this table?"
      confirm-text="Delete"
      confirm-button-color="bg-red-600"
      confirm-button-hover-color="bg-red-700"
      @confirm="confirmDeleteTable"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { DataTable } from '../types/data-table'
import { tableApi } from '../api/table'
import ConfirmModal from '@/components/ConfirmModal.vue'
import TableEditModal from '@/components/TableEditModal.vue'
import { useRouter } from 'vue-router'

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
const router = useRouter()
const showToast = ref(false)
const toastMessage = ref('')

const showDeleteModal = ref(false)
const deletingTableId = ref<string | null>(null)
const isLoading = ref(true)

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showModal.value) {
    showModal.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

const handleTableSave = async (table: Partial<DataTable>) => {
  try {
    if (isEditing.value && table.id) {
      const updatedTable = await tableApi.updateTable(table.id, table)
      const index = tables.value.items.findIndex(t => t.id === updatedTable.id)
      if (index !== -1) {
        tables.value.items[index] = updatedTable
      }
    } else {
      const newTable = await tableApi.createTable(table)
      tables.value.items.unshift(newTable)
    }
  } catch (error) {
    console.error(`Failed to ${isEditing.value ? 'update' : 'create'} table:`, error)
    alert(`An error occurred while ${isEditing.value ? 'updating' : 'creating'} the table.`)
  }
}

const editTable = (table: DataTable) => {
  isEditing.value = true
  editingTable.value = { ...table, id: table.id }
  showModal.value = true
}

const deleteTable = async (tableId: string) => {
  deletingTableId.value = tableId
  showDeleteModal.value = true
}

const confirmDeleteTable = async () => {
  if (!deletingTableId.value) return

  try {
    await tableApi.deleteTable(deletingTableId.value)
    tables.value.items = tables.value.items.filter(table => table.id !== deletingTableId.value)
    showDeleteModal.value = false
    deletingTableId.value = null
  } catch (error) {
    console.error('Failed to delete table:', error)
    alert('An error occurred while deleting the table.')
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
    showCopyToast('Copied')
  } catch (e) {
    alert('Failed to copy to clipboard.')
  }
}

const navigateToTable = (tableId: string) => {
  router.push(`/table/${tableId}`)
}

// 컴포넌트 마운트 시 테이블 목록 로드
const loadTables = async (page?: number) => {
  isLoading.value = true
  try {
    tables.value = await tableApi.getMyTables({ page: page || 1 })
  } catch (error) {
    console.error('Failed to load tables:', error)
    alert('An error occurred while loading the table list.')
  } finally {
    isLoading.value = false
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