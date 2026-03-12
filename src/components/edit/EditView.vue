<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { ElectronAPI } from '@/windowApi.ts'
import type { Note } from '@/ts/class/noteClass.ts'
import { onMounted, ref } from 'vue'

declare const window: Window & {
  electronApi: ElectronAPI
}

const route = useRoute()
const data = ref({
  note: {} as Note,
})

async function getNote(id: string) {
  const res = await window.electronApi.getNotes()
  try {
    data.value.note = res.data.noteList.find((note) => note.id === id) ?? ({} as Note)
  } catch (e) {
    console.log(e)
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
        <span>标题</span>
        <el-input v-model="data.note.title" style="margin-top: 0.5em" />
      </div>
      <el-divider style="margin: 0.5em 0" />
      <div>
        <span>内容</span>
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
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - 70px);
  padding: 10px;
}

.card-container {
  height: 100%;
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
