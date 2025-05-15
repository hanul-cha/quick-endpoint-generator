<template>
  <div class="logout-container">
    <h1>Logging out...</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 로컬 스토리지에서 토큰 제거
  localStorage.removeItem('token');

  // 로그인 페이지로 리다이렉트
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