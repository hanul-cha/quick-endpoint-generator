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
  <NavigationBar v-if="showNavigation" />
  <main :class="{ 'with-nav': showNavigation }">
    <router-view />
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

main {
  padding: 20px;
}

main.with-nav {
  padding-top: 80px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
