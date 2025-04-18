<template>
  <nav class="nav-bar">
    <div class="nav-content">
      <router-link to="/" class="nav-logo">홈</router-link>
      <div class="nav-links">
        <router-link to="/chat" class="nav-link">채팅</router-link>
        <router-link to="/logout" class="nav-link">로그아웃</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.nav-bar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1976d2;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #1976d2;
}
</style>