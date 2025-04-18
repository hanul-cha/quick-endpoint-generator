<template>
  <div class="chat-view">
    <h1>실시간 채팅</h1>
    <WebSocketChat />
  </div>
</template>

<script setup>
import WebSocketChat from '../components/WebSocketChat.vue'
</script>

<style scoped>
.chat-view {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}
</style>