<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Data Management</h1>
    <div class="bg-white shadow-md rounded-lg p-6">
      <nav class="flex space-x-4 mb-6">
        <router-link
          to="/data/schema"
          class="px-4 py-2 rounded-md"
          :class="{ 'bg-indigo-600 text-white': $route.path === '/data/schema', 'text-gray-600 hover:bg-gray-100': $route.path !== '/data/schema' }"
        >
          Schema Management
        </router-link>
        <router-link
          to="/data/endpoint"
          class="px-4 py-2 rounded-md"
          :class="{ 'bg-indigo-600 text-white': $route.path === '/data/endpoint', 'text-gray-600 hover:bg-gray-100': $route.path !== '/data/endpoint' }"
        >
          Endpoint Management
        </router-link>
      </nav>

      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
// 컴포넌트 로직을 여기에 추가할 수 있습니다
</script>