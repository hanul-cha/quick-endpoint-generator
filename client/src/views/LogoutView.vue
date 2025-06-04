<template>
  <div class="logout-container">
    <h1>Logging out...</h1>
  </div>
</template>

<script setup>
import { authApi } from '@/api/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  authApi.logout();
  router.push('/login');
});
</script>

<style scoped>
.logout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h1 {
  color: #2c3e50;
}
</style>