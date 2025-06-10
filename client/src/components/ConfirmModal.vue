<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">{{ title }}</h2>
        <button
          @click="confirmModalStore.onConfirm?.(false)"
          class="text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <p>{{ message }}</p>
        <div class="flex justify-end mt-6 space-x-3">
          <button
            @click="confirmModalStore.onConfirm?.(false)"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirmModalStore.onConfirm?.(true)"
            :class="`px-4 py-2 text-white ${confirmButtonColor} rounded-md hover:${confirmButtonHoverColor}`"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfirmModalStore } from '@/stores/modal'
import { computed } from 'vue'

const confirmModalStore = useConfirmModalStore()

const isOpen = computed(() => !!confirmModalStore.props)
const title = computed(() => confirmModalStore.props?.title ?? 'Confirm')
const message = computed(() => confirmModalStore.props?.message)
const confirmText = computed(() => confirmModalStore.props?.confirmText ?? 'Confirm')
const cancelText = computed(() => confirmModalStore.props?.cancelText ?? 'Cancel')
const confirmButtonColor = computed(() => confirmModalStore.props?.confirmButtonColor ?? 'bg-indigo-600')
const confirmButtonHoverColor = computed(() => confirmModalStore.props?.confirmButtonHoverColor ?? 'bg-indigo-700')
</script>