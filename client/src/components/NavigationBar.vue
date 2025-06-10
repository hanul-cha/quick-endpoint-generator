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
        <template v-if="isValidateAuthToken">
          <a href="#" @click.prevent="showLogoutConfirm()" class="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            Logout
          </a>
        </template>
        <template v-else>
          <a href="#" @click.prevent="toLogin()" class="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
            Login
          </a>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { validateAuthToken } from '@/stores';
import { openConfirmModal } from '@/stores/modal';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const showLogoutConfirm = async () => {
  const result = await openConfirmModal({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    confirmText: 'Logout',
    cancelText: 'Cancel',
    confirmButtonColor: 'bg-red-600',
  });

  if (result) {
    logout();
  }
}

const isValidateAuthToken = validateAuthToken();

const toLogin = () => {
  router.push('/login');
};

const logout = () => {
  localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
  router.push('/logout');
};
</script>