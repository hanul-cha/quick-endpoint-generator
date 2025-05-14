<template>
  <div class="monaco-container" :style="`height: ${typeof height === 'number' ? height + 'px' : height}; width: 100%;`">
    <MonacoEditor
      v-model:value="modelValueProxy"
      :language="language"
      :theme="theme"
      :height="height"
      :defaultOptions="editorOptions"
      @editorDidMount="onEditorMount"
      style="width: 100%; height: 100%;"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MonacoEditor from '@guolao/vue-monaco-editor'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  theme: {
    type: String,
    default: 'vs'
  },
  height: {
    type: [String, Number],
    default: 300
  }
})
const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const editorOptions = {
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  wordBasedSuggestions: false,
}


function onEditorMount(editor: any, monaco: any) {
  // 기존 언어 서비스를 완전히 대체하는 방식으로 접근

  // 1. 기본 제안 제공자 비활성화를 더 강력하게 설정
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    noLib: true,
    allowNonTsExtensions: true,
    checkJs: false,
    noResolve: true
  });

  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: true  // 추가
  });

  // 2. 기존 자동완성 제공자를 모두 제거 (중요!)
  const existingProviders = monaco.languages.CompletionItemProvider['javascript'];
  if (existingProviders) {
    existingProviders.length = 0;
  }

  // 3. 에디터 인스턴스 옵션 직접 설정
  editor.updateOptions({
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: false,
    snippetSuggestions: 'none',  // 스니펫 제안 비활성화
    suggest: {
      showMethods: false,        // 메소드 제안 비활성화
      showFunctions: false,      // 함수 제안 비활성화
      showConstructors: false,   // 생성자 제안 비활성화
      showFields: false,         // 필드 제안 비활성화
      showVariables: false,      // 변수 제안 비활성화
      showClasses: false,        // 클래스 제안 비활성화
      showStructs: false,        // 구조체 제안 비활성화
      showInterfaces: false,     // 인터페이스 제안 비활성화
      showModules: false,        // 모듈 제안 비활성화
      showProperties: false,     // 속성 제안 비활성화
      showEvents: false,         // 이벤트 제안 비활성화
      showOperators: false,      // 연산자 제안 비활성화
      showUnits: false,          // 단위 제안 비활성화
      showValues: false,         // 값 제안 비활성화
      showConstants: false,      // 상수 제안 비활성화
      showEnums: false,          // 열거형 제안 비활성화
      showEnumMembers: false,    // 열거형 멤버 제안 비활성화
      showKeywords: false,       // 키워드 제안 비활성화
      showWords: false,          // 단어 제안 비활성화
      showColors: false,         // 색상 제안 비활성화
      showFiles: false,          // 파일 제안 비활성화
      showReferences: false,     // 참조 제안 비활성화
      showFolders: false,        // 폴더 제안 비활성화
      showTypeParameters: false, // 타입 파라미터 제안 비활성화
      showSnippets: false        // 스니펫 제안 비활성화
    }
  });

  // 4. 완전히 커스텀한 자동완성 제공자 등록 (트리거 문자 명시)
  monaco.languages.registerCompletionItemProvider('javascript', {
    triggerCharacters: ['.', '"', "'", '`', '/'],  // 필요한 트리거 문자만 지정
    provideCompletionItems: () => ({
      suggestions: [
        {
          label: 'repo',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: 'repo',
          detail: 'Repository 객체',
          documentation: 'DB 작업을 위한 repo 객체'
        },
        {
          label: 'repo.table.update',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'repo.table.update(${1:id}, ${2:data})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: '테이블 업데이트',
          documentation: 'repo.table.update(id, data)로 테이블을 업데이트합니다.'
        },
        {
          label: 'params',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: 'params',
          detail: '파라미터 객체',
          documentation: '엔드포인트 호출 시 전달되는 파라미터'
        },
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'console.log($1)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'console.log',
          documentation: '콘솔에 로그를 출력합니다.'
        }
      ]
    })
  });
}
</script>

<style scoped>
.monaco-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  min-height: 100px;
}

:deep(.monaco-editor) {
  width: 100% !important;
  height: 100% !important;
}
</style>
