<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeWelcomeModal">
    <div class="w-full max-w-2xl p-8 bg-white border border-gray-200 shadow-2xl rounded-xl">
      <div class="mb-6 text-center">
        <h1 class="mb-4 text-3xl font-bold text-gray-800">Welcome to Quick Endpoint Generator! 🎉</h1>
        <div class="space-y-4 text-left">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-600">You are currently not logged in. Log in to access all features immediately.</p>
          </div>

          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p class="text-gray-600">Currently, only dummy data is available. Login is required to work with real data.</p>
          </div>

          <div class="flex space-x-3">
            <div>
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-600">
              Once <router-link to="/login" class="font-bold text-blue-600 underline hover:text-blue-800" @click="closeWelcomeModal">logged in</router-link>, you can immediately use all features including API endpoint generation and data management.
            </p>
          </div>

          <div class="mt-6">
            <a
              href="https://quick-endpoint-generator-docs.vercel.app/index.html"
              target="_blank"
              class="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>View Documentation</span>
            </a>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-8 space-x-4">
        <button
          @click="blockWelcomeModal"
          class="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Don't show again
        </button>
        <button
          @click="closeWelcomeModal"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
const emit = defineEmits(['close', 'block'])

const closeWelcomeModal = () => {
  emit('close')
}

const blockWelcomeModal = () => {
  emit('block')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeWelcomeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>