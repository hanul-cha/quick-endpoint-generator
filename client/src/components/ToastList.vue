<template>
  <div class="fixed z-50 flex flex-col items-end top-4 right-4">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.message"
        class="p-4 mb-2 rounded-lg shadow-lg max-w-[400px] text-right"
        :class="{
          'bg-green-500 text-white': toast.type === 'success' || !toast.type,
          'bg-red-500 text-white': toast.type === 'error'
        }"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const { toasts } = toastStore
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
