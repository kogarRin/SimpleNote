<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'
import type { ElectronAPI } from '@/windowApi.ts'
import type { Note } from '@/ts/class/noteClass.ts'
import { onMounted, ref } from 'vue'

declare const window: Window & {
  electronApi: ElectronAPI
}

const route = useRoute()
const router = useRouter()
const note = ref<Note>()
const spanList = ref<string[]>()

async function getNote(id: string): Promise<string[] | undefined> {
  const res = await window.electronApi.getNotes()
  const item = res.data.noteList?.find((note: Note) => note.id === id)
  note.value = item
  return item?.content.split('\n')
}

onMounted(async () => {
  spanList.value = await getNote(route.params.id as string)
})
</script>

<template>
  <div class="container">
    <el-card class="card-container">
      <template #header>
        <div class="card-title" v-if="note">
          <div>
            <h4 style="margin: 0">{{ note.title }}</h4>
          </div>
          <div>
            <el-button
              @click="
                () => {
                  router.push('/home')
                }
              "
            >
              <el-icon><Back /></el-icon>
            </el-button>
            <el-button type="primary"> 编辑 </el-button>
          </div>
        </div>
      </template>
      <div class="card-content">
        <el-scrollbar>
          <p v-for="(item, index) in spanList" :key="index" style="text-indent: 2em; margin: 10px">
            {{ item }}
          </p>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - 90px);
  padding: 20px;
}

.card-container {
  height: 100%;

  .card-title {
    display: flex;
    justify-content: space-between;
  }

  .card-content {
  }
}
</style>
