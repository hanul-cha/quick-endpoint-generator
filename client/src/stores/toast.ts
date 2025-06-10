import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
}

export const useToastStore = defineStore('toast', () => {
  const propsRef = ref<ToastProps[]>([])

  const addToast = (props: ToastProps) => {
    propsRef.value.push(props)
    setTimeout(() => {
      propsRef.value.shift()
    }, 3000)
  }

  return {
    toasts: propsRef,
    addToast,
  }
})

export function showToast(props: ToastProps) {
  const toastStore = useToastStore()
  toastStore.addToast(props)
}