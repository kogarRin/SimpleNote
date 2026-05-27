<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { ElectronAPI } from '@/windowApi.ts'
import type { Note } from '@/ts/class/noteClass.ts'
import { onMounted, type Ref, ref } from 'vue'
import Tag from '@/components/basicView/Tag.vue'
import { ElMessage } from 'element-plus'
import { ElmessageConfig } from '../../../oth/ui.ts'
import { RESCODE } from '../../../oth/res.ts'

declare const window: Window & {
  electronApi: ElectronAPI
}

const route = useRoute()
const data = ref({
  note: {} as Note,
})

const showTagView = ref(false)

async function getNote(id: string) {
  const res = await window.electronApi.getNotes()
  try {
    data.value.note = res.data.noteList.find((note) => note.id === id) ?? ({} as Note)
  } catch (e) {
    console.log(e)
  }
}

async function updateNote(noteRef: Note) {
  // const note = noteRef.value;
  // console.log(note)
  const res = await window.electronApi.updateNote(noteRef)
  console.log(res)
  if (res.code === RESCODE.SUCCESS) {
    ElMessage(ElmessageConfig(`保存成功`, 'success', 1000, true))
  } else {
    ElMessage(ElmessageConfig(`保存失败`, 'error', 1000, true))
  }
}

onMounted(async () => {
  getNote(route.params.id as string)
})
</script>

<template>
  <div class="container">
    <el-card class="card-container">
      <div>
        <div style="display: flex; justify-content: space-between">
          <span>标题</span>
          <el-button type="primary" size="small" @click="()=>{updateNote(data.note)}">保存</el-button>
        </div>
        <el-input v-model="data.note.title" style="margin-top: 0.5em" />
      </div>
      <el-divider style="margin: 0.5em 0" />
      <div>
        <div>
          <span>内容</span>
          <el-button
            style="margin-left: 2em"
            size="small"
            @click="
              () => {
                showTagView = true
              }
            "
            >查看标签</el-button
          >
        </div>
        <el-input
          v-model="data.note.content"
          class="commonTextarea"
          type="textarea"
          rows="18"
          resize="none"
          placeholder="开始写下你的想法..."
          maxlength="50000"
          show-word-limit
        />
      </div>
    </el-card>
    <Tag v-model="showTagView" />
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - 70px);
  padding: 10px;
}

.el-card__body {
  padding: 5px;
}

.commonTextarea {
  height: 90%;
  margin: 1em 0 1em 0;
  overflow: auto;
}
</style>
