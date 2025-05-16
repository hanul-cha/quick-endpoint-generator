<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="$emit('update:modelValue', false)"
  >
    <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">{{ isEditing ? 'Edit' : 'Create New' }} Table</h2>
        <button
          @click="$emit('update:modelValue', false)"
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
            v-model="localTable.name"
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
          <div class="pr-2 space-y-6 overflow-y-auto max-h-72">
            <div v-for="(column, index) in localTable.columns" :key="index" class="space-y-2">
              <div class="flex">
                <div class="w-1/2 pr-2">
                  <div class="text-sm font-medium text-gray-700">Column Name</div>
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
                </div>
                <div class="w-1/2 pl-2">
                  <div class="text-sm font-medium text-gray-700">Type</div>
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
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :id="`required-${index}`"
                    v-model="column.required"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label :for="`required-${index}`" class="ml-2 text-sm text-gray-700">Required</label>
                </div>
                <button
                  @click="removeColumn(index)"
                  class="text-red-600 hover:text-red-800 whitespace-nowrap"
                >
                  Remove
                </button>
              </div>

              <!-- Error message -->
              <p v-if="errors.columns[index]" class="mt-1 text-sm text-red-600">
                {{ errors.columns[index] }}
              </p>
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
            @click="$emit('update:modelValue', false)"
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DataTable } from '@/types/data-table'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  table: {
    type: Object as () => Partial<DataTable>,
    default: () => ({ name: '', columns: [] })
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

// 로컬 상태로 테이블 복사
const localTable = ref<Partial<DataTable>>({
  name: '',
  columns: []
})

// 유효성 검사 에러
const errors = ref({
  tableName: '',
  columns: [] as string[]
})

// props의 table이 변경될 때 로컬 테이블 업데이트
watch(() => props.table, (newTable) => {
  localTable.value = JSON.parse(JSON.stringify(newTable))
}, { immediate: true, deep: true })

// 컬럼 추가
const addColumn = () => {
  if (!localTable.value.columns) {
    localTable.value.columns = []
  }
  localTable.value.columns.push({
    id: crypto.randomUUID(),
    name: '',
    type: 'string',
    required: false
  })
}

// 컬럼 제거
const removeColumn = (index: number) => {
  localTable.value.columns?.splice(index, 1)
}

// 폼 유효성 검사
const validateForm = () => {
  errors.value = {
    tableName: '',
    columns: []
  }

  let isValid = true

  // 테이블 이름 검사
  if (!localTable.value.name?.trim()) {
    errors.value.tableName = 'Table name is required.'
    isValid = false
  }

  // 컬럼 이름 검사
  localTable.value.columns?.forEach((column, index) => {
    if (!column.name?.trim()) {
      errors.value.columns[index] = 'Column name is required.'
      isValid = false
    } else {
      errors.value.columns[index] = ''
    }
  })

  return isValid
}

// 테이블 저장
const saveTable = () => {
  if (!validateForm()) {
    return
  }

  emit('save', localTable.value)
  emit('update:modelValue', false)
}
</script>