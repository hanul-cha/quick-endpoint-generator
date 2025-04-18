import { Socket, io } from 'socket.io-client'
import { onMounted, onUnmounted, ref } from 'vue'

const socket = ref<Socket | null>(null)
const isConnected = ref(false)

export function useSocket() {
  const connect = () => {
    if (!socket.value) {
      socket.value = io(import.meta.env.VITE_WS_URL)

      socket.value.on('connect', () => {
        console.log('Socket connected')
        isConnected.value = true
      })

      socket.value.on('disconnect', () => {
        console.log('Socket disconnected')
        isConnected.value = false
      })
    }
    return socket.value
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const emit = (event: string, data: any) => {
    if (socket.value) {
      socket.value.emit(event, data)
    }
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (socket.value) {
      if (callback) {
        socket.value.off(event, callback)
      } else {
        socket.value.off(event)
      }
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off
  }
}