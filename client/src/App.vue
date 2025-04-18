<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import WebSocketChat from './components/WebSocketChat.vue'

const route = useRoute();
const showNavigation = computed(() => {
  return !['login', 'logout', 'register'].includes(route.name);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavigationBar v-if="showNavigation" />
    <main :class="{ 'pt-16': showNavigation }" class="container mx-auto px-4">
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply text-gray-800;
}
</style>
