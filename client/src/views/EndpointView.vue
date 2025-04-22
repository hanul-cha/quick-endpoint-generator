<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Endpoint Management</h1>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">Create New Endpoint</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Endpoint Name</label>
            <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">HTTP Method</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Schema</label>
            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <!-- Schema 목록이 여기에 표시됩니다 -->
            </select>
          </div>
          <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Create Endpoint
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Existing Endpoints</h2>
        <div class="space-y-4">
          <!-- Endpoint 목록이 여기에 표시됩니다 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Endpoint 관련 로직을 여기에 추가할 수 있습니다
</script>