<template>
  <div class="codemirror-container" :style="`height: ${typeof height === 'number' ? height + 'px' : height}`">
    <Codemirror
      v-model="modelValueProxy"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="onEditorReady"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion, CompletionContext, startCompletion } from '@codemirror/autocomplete'
import { basicSetup } from 'codemirror'
import type { Parameter } from '@/types/endpoint'

// 에디터 뷰 레퍼런스를 먼저 선언
const editorView = shallowRef<EditorView>()

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
    default: 'light'
  },
  height: {
    type: [String, Number],
    default: 300
  },
  parameter: {
    type: Object as () => Parameter | undefined,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
  get: () => props.modelValue || `function main(params, repo) {

}
  `,
  set: v => emit('update:modelValue', v)
})

// params 자동완성을 위한 옵션
const paramOptions = ref<Array<{ label: string, type: string, info: string }>>([])

// parameter가 변경될 때마다 옵션 업데이트
watch(() => props.parameter, (newParams) => {
  updateParamOptions(newParams)
}, { immediate: true, deep: true })

function updateParamOptions(params?: Parameter) {
  if (!params) {
    paramOptions.value = []
    return
  }

  paramOptions.value = Object.entries(params).map(([key, param]) => {
    return {
      label: key,
      type: param.type.toLowerCase(),
      info: `${param.type}${param.required ? ' (required)' : ''}`
    }
  })
}

// repo 객체의 자동완성 함수
function repoCompletions(context: CompletionContext) {
  const line = context.state.doc.lineAt(context.pos)
  const lineText = line.text.slice(0, context.pos - line.from)

  // params. 다음 자동완성 (parameter 속성)
  if (/params\.\s*$/.test(lineText)) {
    return {
      from: context.pos,
      options: paramOptions.value.map(param => ({
        label: param.label,
        type: param.type,
        info: param.info,
      }))
    }
  }

  // repo. 다음 자동완성 (테이블 프로퍼티)
  if (/repo\.\s*$/.test(lineText)) {
    return {
      from: context.pos,
      options: [
        { label: 'table', type: 'property', info: 'Object for table operations' },
        { label: 'row', type: 'property', info: 'Object for row operations' }
      ]
    }
  }

  // repo.table. 다음 자동완성 (메서드)
  if (/repo\.table\.\s*$/.test(lineText)) {
    return {
      from: context.pos,
      options: [
        { label: 'findOne', type: 'method', info: 'Find a table by ID', apply: 'findOne(id)' },
        { label: 'findAll', type: 'method', info: 'Find all tables', apply: 'findAll(where)' },
        { label: 'find', type: 'method', info: 'Find tables by conditions', apply: 'find(where, options)' },
        { label: 'create', type: 'method', info: 'Create a new table', apply: 'create({\n    name: "tableName",\n    columns: []\n  })', },
        { label: 'update', type: 'method', info: 'Update a table', apply: 'update(id, data)' },
        { label: 'delete', type: 'method', info: 'Delete a table', apply: 'delete(id)' }
      ]
    }
  }

  // repo.row. 다음 자동완성 (메서드)
  if (/repo\.row\.\s*$/.test(lineText)) {
    return {
      from: context.pos,
      options: [
        { label: 'findOne', type: 'method', info: 'Find a row by ID', apply: 'findOne(id)' },
        { label: 'findAll', type: 'method', info: 'Find all rows', apply: 'findAll(where)' },
        { label: 'find', type: 'method', info: 'Find rows by conditions', apply: 'find(where, options)' },
        { label: 'create', type: 'method', info: 'Create a new row', apply: 'create({\n    dataTableId: "tableId",\n    values: {}\n  })', },
        { label: 'update', type: 'method', info: 'Update a row', apply: 'update(id, data)' },
        { label: 'updateByWhere', type: 'method', info: 'Update rows by conditions', apply: 'updateByWhere(where, data)' },
        { label: 'updateByEntities', type: 'method', info: 'Update rows by entities', apply: 'updateByEntities([{ id: "rowId", ...properties }])' },
        { label: 'delete', type: 'method', info: 'Delete a row', apply: 'delete(where)' }
      ]
    }
  }

  // repo, params 단어 자동완성
  if (/\b(r|re|rep|repo|p|pa|par|para|param|params)$/.test(lineText)) {
    const match = /\b(r|re|rep|repo|p|pa|par|para|param|params)$/.exec(lineText)!
    const options = []

    if (/\b(r|re|rep|repo)$/.test(match[0])) {
      options.push({
        label: 'repo',
        type: 'variable',
        info: 'Repository object for DB operations'
      })
    }

    if (/\b(p|pa|par|para|param|params)$/.test(match[0])) {
      options.push({
        label: 'params',
        type: 'variable',
        info: 'Function parameters containing request data'
      })
    }

    return {
      from: context.pos - match[0].length,
      options
    }
  }

  return null
}

// 다크모드 테마
const darkTheme = props.theme === 'dark' ? [oneDark] : []

// 언어 설정
const languageExt = props.language === 'javascript' ? [javascript()] : []

// 에디터 확장 기능
const extensions = [
  basicSetup,
  ...languageExt,
  autocompletion({
    override: [repoCompletions],
    activateOnTyping: true
  }),
  EditorView.updateListener.of(update => {
    if (update.docChanged) {
      modelValueProxy.value = update.state.doc.toString()
    }
  }),
  EditorView.domEventHandlers({
    keydown: (event, view) => {
      // "." 키를 입력하면 자동완성 메뉴 표시
      if (event.key === '.') {
        setTimeout(() => {
          startCompletion(view)
        }, 100)
      }
    }
  }),
  ...darkTheme
]

interface EditorReadyPayload {
  view: EditorView;
  state: EditorState;
  container: HTMLDivElement;
}

function onEditorReady(payload: EditorReadyPayload) {
  editorView.value = payload.view
}
</script>

<style scoped>
.codemirror-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  min-height: 100px;
}

:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-scroller) {
  overflow: auto;
  font-family: 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
  line-height: 1.5;
}
</style>
