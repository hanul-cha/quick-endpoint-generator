<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <nav class="flex items-center justify-between p-4 mx-auto max-w-7xl lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a
          href="https://quick-endpoint-generator-docs.vercel.app/index.html"
          target="_blank"
          class="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
        >
          Docs
        </a>
      </div>
      <div class="flex gap-x-8">
        <a href="#" @click.prevent="showLogoutConfirm = true" class="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
          Logout
        </a>
      </div>
    </nav>
  </header>

  <ConfirmModal
    v-model="showLogoutConfirm"
    title="Logout"
    message="Are you sure you want to logout?"
    confirm-text="Logout"
    cancel-text="Cancel"
    confirm-button-color="bg-red-600"
    confirm-button-hover-color="bg-red-700"
    @confirm="logout"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmModal from './ConfirmModal.vue';

const router = useRouter();
const showLogoutConfirm = ref(false);

const logout = () => {
  showLogoutConfirm.value = false;
  localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
  router.push('/logout');
};
</script>