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
          <p class="text-sm text-gray-500">
            ID: {{ tableId }}
            <button
              @click="copyId(tableId)"
              class="ml-1 text-xs text-gray-500 align-middle hover:text-indigo-600 focus:outline-none"
              title="Copy ID"
            >
              <svg class="inline w-4 h-4 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
              </svg>
            </button>
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="refreshData"
            class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Refresh
          </button>
          <button
            @click="goToSchemaManagement"
            class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Schema Management
          </button>
        </div>
      </div>

      <!-- Column information -->
      <div class="p-4 mb-6 bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Table Structure</h2>
          <button
            @click="editTableStructure"
            class="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
          >
            Edit
          </button>
        </div>
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
            class="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
                  <td v-for="column in table?.columns" :key="column.id"
                    :class="[
                      'px-6 py-4 text-sm whitespace-nowrap relative',
                      shouldHighlightValue(column, row.values[column.id])
                        ? 'bg-red-50 text-red-900 font-medium cursor-help'
                        : 'text-gray-900'
                    ]"
                    @mouseenter="showTooltip($event, column, row.values[column.id])"
                    @mouseleave="hideTooltip()">
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
                        class="px-4 py-1 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteRowConfirm(row.id)"
                        class="px-4 py-1 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
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
      v-if="showRowModal"
      class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">{{ isEditMode ? 'Edit Data' : 'Add Data' }}</h2>
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
              v-if="column.type === ColumnType.String"
              v-model="editingRow.values[column.id]"
              type="text"
              :class="[
                'block w-full px-3 py-2 border rounded-md focus:outline-none',
                formErrors[column.id]
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            />

            <!-- Number input field -->
            <input
              v-else-if="column.type === ColumnType.Number"
              v-model.number="editingRow.values[column.id]"
              type="number"
              :class="[
                'block w-full px-3 py-2 border rounded-md focus:outline-none',
                formErrors[column.id]
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            />

            <!-- Boolean input field -->
            <div v-else-if="column.type === ColumnType.Boolean" class="flex items-center space-x-2">
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
              v-else-if="column.type === ColumnType.Date"
              v-model="editingRow.values[column.id]"
              type="date"
              :class="[
                'block w-full px-3 py-2 border rounded-md focus:outline-none',
                formErrors[column.id]
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              ]"
            />

            <!-- JSON input field -->
            <div
              v-else-if="column.type === ColumnType.Json"
              style="height:200px;"
            >
              <JsonEditor
                v-model="editingRow.values[column.id]"
                :class="[
                  'mt-1',
                  formErrors[column.id] ? 'border-red-500' : ''
                ]"
              />
            </div>

            <!-- Error message -->
            <p v-if="formErrors[column.id]" class="mt-1 text-sm text-red-600">
              {{ formErrors[column.id] }}
            </p>
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
            {{ isEditMode ? 'Save Changes' : 'Add Data' }}
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
            class="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
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

    <!-- Custom tooltip -->
    <div
      v-if="tooltipVisible"
      class="absolute z-50 max-w-xs p-2 text-sm text-white bg-gray-800 rounded shadow-lg"
      :style="tooltipStyle">
      {{ tooltipContent }}
    </div>

    <!-- Table Edit Modal -->
    <TableEditModal
      v-if="showTableModal"
      v-model="showTableModal"
      :table="editingTable"
      :is-editing="true"
      @save="handleTableSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tableApi } from '../api/table'
import { rowApi } from '../api/row'
import { ColumnType, DataColumn, type DataTable } from '../types/data-table'
import type { DataRow } from '@/types/data-row'
import JsonEditor from '@/components/JsonEditor.vue'
import TableEditModal from '@/components/TableEditModal.vue'

// Get route and table ID
const route = useRoute()
const router = useRouter()
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
const showRowModal = ref(false)
const isEditMode = ref(false)
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

// Table edit modal
const showTableModal = ref(false)
const editingTable = ref<Partial<DataTable>>({
  name: '',
  columns: []
})

// 현재 편집 중인 행의 유효성 검사 오류
const formErrors = ref<Record<string, string>>({})

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

// Edit row
const editRow = (row: DataRow) => {
  // JSON 값 처리를 위한 복사본 생성
  const valuesCopy = { ...row.values };

  // JSON 타입 값을 문자열로 변환
  if (table.value) {
    table.value.columns.forEach(column => {
      if (column.type === ColumnType.Json && valuesCopy[column.id] !== null && valuesCopy[column.id] !== undefined) {
        // 이미 문자열이 아니라면 JSON.stringify 처리
        if (typeof valuesCopy[column.id] !== 'string') {
          valuesCopy[column.id] = JSON.stringify(valuesCopy[column.id], null, 2);
        }
      }
    });
  }

  editingRow.value = {
    id: row.id,
    values: valuesCopy
  }
  isEditMode.value = true
  showRowModal.value = true
}

// Initialize create row modal
const initCreateRow = () => {
  const values: Record<string, any> = {}

  // Set default values based on table columns
  if (table.value) {
    table.value.columns.forEach(column => {
      // Set default values based on data type
      switch (column.type) {
        case ColumnType.String:
          values[column.id] = ''
          break
        case ColumnType.Number:
          values[column.id] = 0
          break
        case ColumnType.Boolean:
          values[column.id] = false
          break
        case ColumnType.Date:
          values[column.id] = new Date().toISOString().split('T')[0]
          break
        case ColumnType.Json:
          values[column.id] = '{}'
          break
        default:
          values[column.id] = null
      }
    })
  }

  editingRow.value = { values }
  isEditMode.value = false
  showRowModal.value = true
}

// Save row (create or update)
const saveRow = async () => {
  // 유효성 검사 수행
  if (!validateRowData()) {
    return;
  }

  try {
    // JSON 문자열 값을 객체로 변환
    const values = { ...editingRow.value.values };

    if (table.value) {
      table.value.columns.forEach(column => {
        if (column.type === ColumnType.Json && values[column.id]) {
          try {
            // 문자열을 JSON 객체로 파싱
            values[column.id] = JSON.parse(values[column.id]);
          } catch (e) {
            console.error(`Failed to parse JSON for ${column.name}:`, e);
            // 파싱 실패 시 원래 문자열 유지
          }
        }
      });
    }

    if (isEditMode.value && editingRow.value.id) {
      // Update row
      await rowApi.updateRow(editingRow.value.id, {
        values: values
      })
      showToastMessage('Data updated successfully.')
    } else {
      // Create new row
      await rowApi.createRow(tableId.value, values)
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

// 행 데이터의 유효성 검사
const validateRowData = () => {
  // 오류 초기화
  formErrors.value = {};
  let isValid = true;

  if (!table.value) return false;

  // 각 컬럼별 유효성 검사
  table.value.columns.forEach(column => {
    const value = editingRow.value.values[column.id];

    // 필수값 검사
    if (column.required && isEmpty(value)) {
      formErrors.value[column.id] = `${column.name} is required`;
      isValid = false;
      return;
    }

    // 비어있지 않은 경우 타입 검사
    if (!isEmpty(value) && !isCorrectType(column, value)) {
      formErrors.value[column.id] = `Invalid type. Expected ${column.type}`;
      isValid = false;
      return;
    }

    // JSON 형식 검사
    if (column.type === ColumnType.Json && !isEmpty(value)) {
      try {
        JSON.parse(value);
      } catch (e) {
        formErrors.value[column.id] = 'Invalid JSON format';
        isValid = false;
      }
    }
  });

  return isValid;
}

// Close modal
const closeModal = () => {
  showRowModal.value = false;
  editingRow.value = { values: {} };
  formErrors.value = {}; // 폼 오류 초기화
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
        // 이미 문자열인 경우 한번 파싱했다가 다시 문자열화
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

// 키보드 이벤트 핸들러 추가
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (showRowModal.value) {
      closeModal()
    } else if (showDeleteModal.value) {
      showDeleteModal.value = false
    } else if (showTableModal.value) {
      showTableModal.value = false
    }
  }
}

// 마운트 시 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
  loadData()
})

// 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

// Edit table structure
const editTableStructure = () => {
  if (table.value) {
    editingTable.value = { ...table.value }
    showTableModal.value = true
  }
}

// Handle table structure save
const handleTableSave = async (updatedTable: Partial<DataTable>) => {
  try {
    if (updatedTable.id) {
      const result = await tableApi.updateTable(updatedTable.id, updatedTable)
      table.value = result
      showToastMessage('Table structure updated successfully.')
    }
  } catch (error) {
    console.error('Failed to update table structure:', error)
    showToastMessage('Failed to update table structure.')
  } finally {
    showTableModal.value = false
  }
}

// 현재 값의 실제 타입을 반환하는 함수
const getActualType = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const type = typeof value;

  if (type === 'object') {
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    return 'object';
  }

  return type;
}

// 툴팁 관련 상태
const tooltipVisible = ref(false);
const tooltipContent = ref('');
const tooltipStyle = ref({
  top: '0px',
  left: '0px'
});

// 툴팁 표시
const showTooltip = (event: MouseEvent, column: any, value: any) => {
  // 하이라이트 조건에 맞지 않으면 툴팁 표시하지 않음
  if (!shouldHighlightValue(column, value)) return;

  let message = '';

  // 필수값 누락 메시지
  if (column.required && isEmpty(value)) {
    message = `Required Field: This field cannot be empty`;
  }
  // 타입 불일치 메시지
  else if (!isCorrectType(column, value)) {
    message = `Type Mismatch: Expected '${column.type}', but got '${getActualType(value)}'`;
  }

  tooltipContent.value = message;

  // 마우스 위치 기준으로 툴팁 위치 조정
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();

  tooltipStyle.value = {
    top: `${rect.bottom + window.scrollY + 10}px`, // 요소 아래 10px
    left: `${rect.left + window.scrollX}px`
  };

  tooltipVisible.value = true;
};

// 행의 특정 컬럼 값이 타입이 변경되었는지 또는 필수값이 누락되었는지 확인하는 함수
const shouldHighlightValue = (column: DataColumn, value: any): boolean => {
  // 필수값인데 비어있는 경우
  if (column.required && isEmpty(value)) {
    return true;
  }

  // 비어있지 않고 타입이 맞지 않는 경우
  if (!isEmpty(value) && !isCorrectType(column, value)) {
    return true;
  }

  return false;
}

// 값이 비어있는지 확인 (null, undefined, 빈 문자열)
const isEmpty = (value: any): boolean => {
  return value === null || value === undefined || value === '';
}

// 값의 타입이 컬럼 타입과 일치하는지 확인
const isCorrectType = (column: DataColumn, value: any): boolean => {
  if (isEmpty(value)) return true; // 비어있는 경우는 타입 체크 불필요

  const valueType = typeof value;

  // 문자열 타입 체크
  if (column.type === ColumnType.String && valueType !== 'string') return false;

  // 숫자 타입 체크
  if (column.type === ColumnType.Number && valueType !== 'number') return false;

  // 불리언 타입 체크
  if (column.type === ColumnType.Boolean && valueType !== 'boolean') return false;

  // 날짜 타입 체크 (문자열이지만 날짜 형식인지 확인)
  if (column.type === ColumnType.Date && !isValidDate(value)) return false;

  // JSON 타입 체크 (객체이거나 JSON 문자열인지 확인)
  if (column.type === ColumnType.Json && !isValidJson(value)) return false;

  return true;
}

// 유효한 날짜인지 체크
const isValidDate = (value: any): boolean => {
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  return value instanceof Date;
}

// 유효한 JSON인지 체크
const isValidJson = (value: any): boolean => {
  if (typeof value === 'object') return true;

  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  return false;
}

// 툴팁 숨기기
const hideTooltip = () => {
  tooltipVisible.value = false;
};

// Navigate to schema management
const goToSchemaManagement = () => {
  router.push('/data/schema')
}

// Copy ID
const copyId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id)
    showToastMessage('ID copied to clipboard.')
  } catch (e) {
    showToastMessage('Failed to copy to clipboard.')
  }
}
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