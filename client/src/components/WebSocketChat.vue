<template>
  <div class="chat-container">
    <div class="connection-status" :class="{ connected: isConnected }">
      {{ isConnected ? '연결됨' : '연결 끊김' }}
    </div>
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>
    <div class="input-container">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="메시지를 입력하세요..."
        :disabled="!isConnected"
      />
      <button @click="sendMessage" :disabled="!isConnected">전송</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSocket } from '../composables/useSocket'

const { isConnected, emit, on } = useSocket()
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)

const sendMessage = () => {
  if (newMessage.value.trim() && isConnected.value) {
    emit('message', newMessage.value)
    newMessage.value = ''
  }
}

onMounted(() => {
  on('message', (message) => {
    messages.value.push(message)
    // 스크롤을 항상 최신 메시지로 이동
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }, 0)
  })
})
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.connection-status {
  text-align: center;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #ff4444;
  color: white;
}

.connection-status.connected {
  background-color: #4CAF50;
}

.messages {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.input-container {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #45a049;
}
</style>