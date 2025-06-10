import { defineStore } from 'pinia'
import { ref } from 'vue';

interface ConfirmModalProps {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonColor?: string
  confirmButtonHoverColor?: string
}

export const useConfirmModalStore = defineStore('confirmModal', () => {
  const propsRef = ref<ConfirmModalProps | null>(null)

  const onConfirm = ref<((result: boolean) => void) | null>(null)

  return {
    props: propsRef,
    open: (props: ConfirmModalProps) => propsRef.value = props,
    onConfirm,
  }
})

export async function openConfirmModal(props: ConfirmModalProps): Promise<boolean> {
  const confirmModalStore = useConfirmModalStore()
  confirmModalStore.open(props)
  return new Promise((resolve) => {
    confirmModalStore.onConfirm = (result: boolean) => {
      confirmModalStore.onConfirm = null
      confirmModalStore.props = null
      resolve(result)
    }
  })
}
