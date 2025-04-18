<template>
  <header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <router-link to="/" class="-m-1.5 p-1.5">
          <span class="text-xl font-semibold text-blue-600">홈</span>
        </router-link>
      </div>
      <div class="flex gap-x-8">
        <router-link to="/chat" class="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
          채팅
        </router-link>
        <router-link to="/logout" class="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
          로그아웃
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
</script>