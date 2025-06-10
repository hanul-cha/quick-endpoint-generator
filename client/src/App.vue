<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from './components/NavigationBar.vue';
import WebSocketChat from './components/WebSocketChat.vue'
import ConfirmModal from './components/ConfirmModal.vue';
import ToastList from './components/ToastList.vue';
import { validateAuthToken } from './stores';
import WelcomePage from './components/WelcomePage.vue';

const route = useRoute();
const showNavigation = computed(() => {
  return !['login', 'logout', 'register'].includes(route.name);
});
const enableWelcomeModalStatus = ref(true)

const disableWelcomeToken = localStorage.getItem('disable_welcome')
const isValidAuthToken = validateAuthToken()

const closeWelcomeModal = () => {
  enableWelcomeModalStatus.value = false
}

const blockWelcomeModal = () => {
  localStorage.setItem('disable_welcome', 'true')
  closeWelcomeModal()
}

const enableWelcomeModal = computed(() => {
  return enableWelcomeModalStatus.value && !isValidAuthToken && !disableWelcomeToken
})


</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <WelcomePage v-if="enableWelcomeModal" @close="closeWelcomeModal" @block="blockWelcomeModal" />
    <NavigationBar v-if="showNavigation" />
    <main :class="{ 'pt-16': showNavigation }" class="container px-4 mx-auto">
      <router-view />
    </main>
  </div>
  <ConfirmModal />
  <ToastList />
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
