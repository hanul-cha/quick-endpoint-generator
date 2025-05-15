<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-3xl font-bold">Quick Endpoint Generator</h1>
    <div class="p-6 bg-white rounded-lg shadow-md">
      <nav class="flex mb-6 space-x-4">
        <router-link
          to="/data/endpoint"
          class="px-4 py-2 rounded-md"
          :class="{ 'bg-indigo-600 text-white': $route.path === '/data/endpoint', 'text-gray-600 hover:bg-gray-100': $route.path !== '/data/endpoint' }"
        >
          Endpoint Management
        </router-link>
        <router-link
          to="/data/schema"
          class="px-4 py-2 rounded-md"
          :class="{ 'bg-indigo-600 text-white': $route.path === '/data/schema', 'text-gray-600 hover:bg-gray-100': $route.path !== '/data/schema' }"
        >
          Schema Management
        </router-link>
      </nav>

      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
// 컴포넌트 로직을 여기에 추가할 수 있습니다
</script>