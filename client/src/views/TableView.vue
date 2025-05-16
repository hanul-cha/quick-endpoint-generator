<template>
  <div class="container px-4 py-8 mx-auto">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="w-8 h-8 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
    </div>

    <div v-else>
      <!-- Header section -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold">{{ table?.name }}</h1>
          <p class="text-sm text-gray-500">ID: {{ tableId }}</p>
        </div>
        <button
          @click="refreshData"
          class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <!-- Column information -->
      <div class="p-4 mb-6 bg-white border border-gray-200 rounded-lg">
        <h2 class="mb-4 text-xl font-semibold">Table Structure</h2>
        <div class="overflow-x-auto border rounded-md">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Column Name</th>
                <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Required</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="column in table?.columns" :key="column.id">
                <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{{ column.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ column.type }}</td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <span v-if="column.required" class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Required
                  </span>
                  <span v-else class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Optional
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Data table -->
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Data</h2>
          <button
            @click="initCreateRow()"
            class="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add Data
          </button>
        </div>

        <!-- When no data is available -->
        <div v-if="rows.items.length === 0" class="py-12 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p class="mt-1 text-sm text-gray-500">Click the 'Add Data' button to add new data.</p>
        </div>

        <!-- Data table -->
        <div v-else>
          <div class="overflow-x-auto border rounded-md">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">#</th>
                  <th v-for="column in table?.columns" :key="column.id" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    {{ column.name }}
                  </th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Created</th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Updated</th>
                  <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in rows.items" :key="row.id">
                  <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ index + 1 + (rows.page - 1) * rows.limit }}</td>
                  <td v-for="column in table?.columns" :key="column.id" class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {{ formatValue(row.values[column.id], column.type) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {{ formatDate(row.createdAt) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {{ formatDate(row.updatedAt) }}
                  </td>
                  <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button
                        @click="editRow(row)"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteRowConfirm(row.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="rows.totalPages > 0" class="flex items-center justify-between mt-4">
            <button
              @click="loadRows(rows.page - 1)"
              :disabled="!rows.hasPreviousPage"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ rows.page }} / {{ rows.totalPages }}
            </span>
            <button
              @click="loadRows(rows.page + 1)"
              :disabled="!rows.hasNextPage"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Row Modal -->
    <div
      v-if="showEditModal || showCreateModal"
      class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">{{ showEditModal ? 'Edit Data' : 'Add Data' }}</h2>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="pr-2 space-y-4 overflow-y-auto max-h-96">
          <div v-for="column in table?.columns" :key="column.id" class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              {{ column.name }}
              <span v-if="column.required" class="text-red-500">*</span>
            </label>

            <!-- String input field -->
            <input
              v-if="column.type === 'string'"
              v-model="editingRow.values[column.id]"
              type="text"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
            />

            <!-- Number input field -->
            <input
              v-else-if="column.type === 'number'"
              v-model.number="editingRow.values[column.id]"
              type="number"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
            />

            <!-- Boolean input field -->
            <div v-else-if="column.type === 'boolean'" class="flex items-center space-x-2">
              <input
                :id="`boolean-${column.id}`"
                v-model="editingRow.values[column.id]"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label :for="`boolean-${column.id}`" class="text-gray-700">{{ editingRow.values[column.id] ? 'Yes' : 'No' }}</label>
            </div>

            <!-- Date input field -->
            <input
              v-else-if="column.type === 'date'"
              v-model="editingRow.values[column.id]"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
            />

            <!-- JSON input field -->
            <textarea
              v-else-if="column.type === 'json'"
              v-model="editingRow.values[column.id]"
              rows="4"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
            ></textarea>
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
            @click="saveRow"
            class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {{ showEditModal ? 'Save Changes' : 'Add Data' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg">
        <h2 class="mb-4 text-xl font-semibold">Confirm Delete</h2>
        <p class="mb-6 text-gray-700">Are you sure you want to delete this data?</p>

        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="deleteRow"
            class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <transition name="fade">
      <div v-if="showToast" class="fixed z-50 px-6 py-3 text-white transform -translate-x-1/2 bg-green-500 rounded shadow-lg bottom-8 left-1/2">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tableApi } from '../api/table'
import { rowApi } from '../api/row'
import type { DataTable } from '../types/data-table'
import type { DataRow } from '@/types/data-row'

// Get route and table ID
const route = useRoute()
const tableId = ref(route.params.tableId as string)

// State management
const loading = ref(true)
const table = ref<DataTable | null>(null)
const rows = ref<{
  items: DataRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  offset: number;
}>({
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  offset: 0
})

// Modal states
const showEditModal = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const deletingRowId = ref<string | null>(null)
const showToast = ref(false)
const toastMessage = ref('')

// Currently editing row
const editingRow = ref<{
  id?: string;
  values: Record<string, any>;
}>({
  values: {}
})

// Load table data
const loadTable = async () => {
  try {
    table.value = await tableApi.getTable(tableId.value)
  } catch (error) {
    console.error('Failed to load table data:', error)
    showToastMessage('Failed to load table data.')
  }
}

// Load row data
const loadRows = async (page = 1) => {
  try {
    rows.value = await rowApi.getRows(tableId.value, { page, limit: 10 })
  } catch (error) {
    console.error('Failed to load row data:', error)
    showToastMessage('Failed to load row data.')
  } finally {
    loading.value = false
  }
}

// Load all data
const loadData = async () => {
  loading.value = true
  await loadTable()
  await loadRows()
  loading.value = false
}

// Refresh data
const refreshData = () => {
  loadData()
  showToastMessage('Data refreshed successfully.')
}

// Close modal
const closeModal = () => {
  showEditModal.value = false
  showCreateModal.value = false
  editingRow.value = { values: {} }
}

// Edit row
const editRow = (row: DataRow) => {
  editingRow.value = {
    id: row.id,
    values: { ...row.values }
  }
  showEditModal.value = true
}

// Initialize create row modal
const initCreateRow = () => {
  const values: Record<string, any> = {}

  // Set default values based on table columns
  if (table.value) {
    table.value.columns.forEach(column => {
      // Set default values based on data type
      switch (column.type) {
        case 'string':
          values[column.id] = ''
          break
        case 'number':
          values[column.id] = 0
          break
        case 'boolean':
          values[column.id] = false
          break
        case 'date':
          values[column.id] = new Date().toISOString().split('T')[0]
          break
        case 'json':
          values[column.id] = '{}'
          break
        default:
          values[column.id] = null
      }
    })
  }

  editingRow.value = { values }
  showCreateModal.value = true
}

// Save row (create or update)
const saveRow = async () => {
  try {
    if (showEditModal.value && editingRow.value.id) {
      // Update row
      await rowApi.updateRow(editingRow.value.id, {
        values: editingRow.value.values
      })
      showToastMessage('Data updated successfully.')
    } else {
      // Create new row
      await rowApi.createRow(tableId.value, editingRow.value.values)
      showToastMessage('New data added successfully.')
    }

    // Reload row data
    loadRows(rows.value.page)
    closeModal()
  } catch (error) {
    console.error('Failed to save data:', error)
    showToastMessage('Failed to save data.')
  }
}

// Confirm row deletion
const deleteRowConfirm = (rowId: string) => {
  deletingRowId.value = rowId
  showDeleteModal.value = true
}

// Delete row
const deleteRow = async () => {
  if (!deletingRowId.value) return

  try {
    await rowApi.deleteRow(deletingRowId.value)

    // Reload row data
    loadRows(rows.value.page)
    showToastMessage('Data deleted successfully.')
  } catch (error) {
    console.error('Failed to delete data:', error)
    showToastMessage('Failed to delete data.')
  } finally {
    showDeleteModal.value = false
    deletingRowId.value = null
  }
}

// Show toast message
const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Format value
const formatValue = (value: any, type: string) => {
  if (value === null || value === undefined) return '-'

  switch (type) {
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'date':
      return new Date(value).toLocaleDateString('en-US')
    case 'json':
      try {
        return typeof value === 'string'
          ? JSON.stringify(JSON.parse(value), null, 2)
          : JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    default:
      return String(value)
  }
}

// Format date
const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString('en-US')
}

// Reload data when table ID changes
watch(() => route.params.tableId, (newId) => {
  tableId.value = newId as string
  loadData()
})

// Load data when component mounts
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>