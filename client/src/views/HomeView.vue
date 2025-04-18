<template>
  <div class="home">
    <h1>홈페이지</h1>
    <nav>
      <router-link to="/chat" class="chat-link">채팅방으로 이동</router-link>
    </nav>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.chat-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.chat-link:hover {
  background-color: #45a049;
}
</style>