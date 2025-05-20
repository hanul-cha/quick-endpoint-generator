<template>
  <div class="json-editor">
    <div ref="jsonEditor" class="json-editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import JSONEditor, { JSONEditorOptions, ParseError, SchemaValidationError } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: '{}'
  }
});

const emit = defineEmits(['update:modelValue']);
const jsonEditor = ref<HTMLElement | null>(null);
let editor: JSONEditor | null = null;

// 에디터 초기화
onMounted(() => {
  if (!jsonEditor.value) return;

  // 에디터 옵션 설정
  const options: JSONEditorOptions = {
    mode: 'code',
    modes: ['code', 'tree', 'form', 'view'],
    onChangeText: (jsonText: string) => {
      emit('update:modelValue', jsonText);
    },
    onValidationError: (errors: readonly (SchemaValidationError | ParseError)[]) => {
      console.log('JSON validation error', errors);
    }
  };

  // 에디터 인스턴스 생성
  editor = new JSONEditor(jsonEditor.value, options);

  // 초기값 설정
  try {
    const json = props.modelValue ? JSON.parse(props.modelValue) : {};
    editor.set(json);
  } catch (e) {
    // 유효하지 않은 JSON인 경우 빈 객체로 설정
    editor.setText(props.modelValue || '{}');
  }
});

// props.modelValue가 변경될 때 에디터 내용 업데이트
watch(() => props.modelValue, (newValue) => {
  if (!editor) return;

  try {
    // JSON 형식이면 객체로 파싱하여 설정
    const currentText = editor.getText();
    if (currentText !== newValue) {
      const json = newValue ? JSON.parse(newValue) : {};
      editor.set(json);
    }
  } catch (e) {
    // 유효하지 않은 JSON인 경우 텍스트로 설정
    const currentText = editor.getText();
    if (currentText !== newValue) {
      editor.setText(newValue || '{}');
    }
  }
});

// 컴포넌트 언마운트 시 에디터 인스턴스 정리
onBeforeUnmount(() => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
});
</script>

<style scoped>
.json-editor {
  width: 100%;
}

.json-editor-container {
  height: 100%;
  min-height: 120px;
  max-height: 250px;
  width: 100%;
  border-radius: 0.375rem;
  overflow: hidden;
}

/* jsoneditor 기본 스타일 커스터마이징 */
:deep(.jsoneditor) {
  border-color: #e5e7eb; /* Tailwind border-gray-300 */
  border-radius: 0.375rem;
}

:deep(.jsoneditor-menu) {
  display: none;
}

:deep(.jsoneditor-statusbar) {
  background-color: #f9fafb; /* Tailwind bg-gray-50 */
  border-top: 1px solid #e5e7eb; /* Tailwind border-gray-300 */
}

:deep(.jsoneditor-poweredBy) {
  display: none;
}
</style>