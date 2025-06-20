<template>
  <div class="container px-4 py-8 mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">Tables</h1>
      <button
        @click="openCreateModal"
        class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Create Table
      </button>
    </div>

    <!-- 기존 테이블 목록 -->
    <div class="p-6 bg-white border border-gray-200 rounded-lg">
      <div v-if="!tableStore.isInitialized" class="space-y-6">
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
      <div v-else-if="tableStore.pagination.items.length === 0" class="py-12 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tables</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new table.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Table
          </button>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="table in tableStore.pagination.items"
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
        <div v-if="tableStore.pagination.totalPages > 0" class="flex items-center justify-between mt-4">
          <button
            @click="loadTables(tableStore.pagination.page - 1)"
            :disabled="!tableStore.pagination.hasPreviousPage"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-sm text-gray-700">
            Page {{ tableStore.pagination.page }} of {{ tableStore.pagination.totalPages }}
          </span>
          <button
            @click="loadTables(tableStore.pagination.page + 1)"
            :disabled="!tableStore.pagination.hasNextPage"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { DataTable } from '../types/data-table'
import TableEditModal from '@/components/TableEditModal.vue'
import { useRouter } from 'vue-router'
import { useTableStore } from '@/stores/table'
import { openConfirmModal } from '@/stores/modal'
import { showToast } from '@/stores/toast'

const tableStore = useTableStore()
const showModal = ref(false)
const isEditing = ref(false)
const editingTable = ref<Partial<DataTable>>({
  name: '',
  columns: []
})
const router = useRouter()

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showModal.value) {
    showModal.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
  loadTables()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

const handleTableSave = async (table: Partial<DataTable>) => {
  try {
    if (isEditing.value && table.id) {
      await tableStore.updateItem(table.id, table)
      showToast({ message: 'Table updated successfully.' })
    } else {
      await tableStore.createItem(table)
      showToast({ message: 'Table created successfully.' })
    }
    closeModal()
  } catch (error) {
    console.error(`Failed to ${isEditing.value ? 'update' : 'create'} table:`, error)
    showToast({ message: `Failed to ${isEditing.value ? 'update' : 'create'} table.`, type: 'error' })
  }
}

const editTable = (table: DataTable) => {
  isEditing.value = true
  editingTable.value = { ...table }
  showModal.value = true
}

const deleteTable = async (tableId: string) => {
  const result = await openConfirmModal({
    title: 'Delete Table',
    message: 'Are you sure you want to delete this table?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmButtonColor: 'bg-red-600',
  })

  if (result) {
    try {
      await tableStore.deleteItem(tableId)
      showToast({ message: 'Table deleted successfully.' })
    } catch (error) {
      console.error('Failed to delete table:', error)
      showToast({ message: 'Failed to delete table.', type: 'error' })
    }
  }
}

const copyId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id)
    showToast({ message: 'ID copied to clipboard.' })
  } catch (e) {
    showToast({ message: 'Failed to copy to clipboard.', type: 'error' })
  }
}

const navigateToTable = (tableId: string) => {
  router.push(`/table/${tableId}`)
}

const loadTables = async (page?: number) => {
  try {
    await tableStore.loadItems({ page, limit: 10 })
  } catch (error) {
    console.error('Failed to load tables:', error)
    showToast({ message: 'Failed to load tables.', type: 'error' })
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingTable.value = {
    name: '',
    columns: []
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingTable.value = {
    name: '',
    columns: []
  }
}
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