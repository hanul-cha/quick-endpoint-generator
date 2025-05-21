<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';
import WebSocketChat from './components/WebSocketChat.vue'

const route = useRoute();
const showNavigation = computed(() => {
  return !['login', 'logout', 'register'].includes(route.name);
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <NavigationBar v-if="showNavigation" />
    <main :class="{ 'pt-16': showNavigation }" class="container px-4 mx-auto">
      <router-view />
    </main>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: rgb(249, 250, 251); /* bg-gray-50의 색상 */
}

#app {
  font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply text-gray-800;
  min-height: 100vh;
}
</style>
