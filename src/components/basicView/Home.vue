<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Delete, Refresh, Search } from '@element-plus/icons-vue'
import type { Note } from '@/ts/class/noteClass.ts'
import { ElMessage } from 'element-plus'
import { ElmessageConfig } from '../../../oth/ui.ts'
import type { ElectronAPI } from '@/windowApi.ts'
import NoteList from '@/components/main/NoteList.vue'

declare const window: Window & {
  electronApi: ElectronAPI
}
const baseData = ref<Note[]>([])
const noticeListenerDelete = ref(false)
const isEditorModal = ref(false)
const selectedIdList = ref<string[]>([])
const checkAll = ref(false)
const searchInputContent = ref('')

async function initNotes(model: number) {
  try {
    if (model === 1) {
      const res = await window.electronApi.getNotes()
      baseData.value = res.data.noteList
      if (res.code === 200) {
        ElMessage(ElmessageConfig(`加载成功`, 'success', 1000, true))
        return baseData.value
      }
      ElMessage(ElmessageConfig(`加载失败`, 'error', 1000, true))
    }
    if (model === 2) {
      const res = await window.electronApi.getNotes()
      baseData.value = res.data.noteList
      if (res.code === 200) {
        ElMessage(ElmessageConfig(`刷新成功`, 'success', 1000, true))
        return baseData.value
      }
    }
  } catch (e) {
    console.log(e)
  }
}

async function refreshNoteList() {
  await initNotes(2);
}

async function addOneNote() {
  await window.electronApi.addNotes()
  const res = await window.electronApi.getNotes()
  baseData.value = res.data.noteList
  ElMessage(ElmessageConfig(`添加成功`, 'success', 1000, true))
  return null
}

function handleSelect(idList: string[]) {
  selectedIdList.value = idList
}



async function deleteNote() {
  const idList = [...selectedIdList.value]
  if (idList.length < 1) {
    ElMessage(ElmessageConfig(`请选择要删除的记录`, 'warning', 1000, true))
  }
  await window.electronApi.deleteNotes(idList);
  ElMessage(ElmessageConfig(`删除成功`, 'success', 1000, true))
}

onMounted(async () => {
  await initNotes(1)
})
</script>

<template>
  <!-- 内容-->
  <el-dialog v-model="noticeListenerDelete" :show-close="false">
    <div class="noticesTitle">
      <h2>提示</h2>
    </div>
    <div class="divideLine"></div>
    <div class="createNotices">
      <span>确定删除选择的{{ selectedNoteIdList.length }}条记录？</span>
    </div>
    <div class="createNoticesButton">
      <el-button
        type="default"
        @click="
          () => {
            noticeListenerDelete = !noticeListenerDelete
          }
        "
        >取消</el-button
      >
      <el-button type="primary" @click="deleteConfirm">确定</el-button>
    </div>
  </el-dialog>
  <div class="mainContentContain">
    <div class="headerContain">
      <div class="header">
        <div class="headerTitle">
          <span
            ><b>{{
              new Date().getHours() > 11
                ? new Date().getHours() < 18
                  ? '下午好，一起摸鱼?'
                  : '没睡，帮带个蜜雪?'
                : '起这么早，帮打个早八'
            }}</b></span
          >
        </div>
        <div class="searchDiv">
          <div>
            <el-input
              v-model="searchInputContent"
              :prefix-icon="Search"
              :disabled="isEditorModal"
              size="large"
              class="searchInput"
              placeholder="输入标题或内容"
              @keyup.enter="() => searchedNotes(searchInputContent)"
              style="width: 100%"
            >
              <template #append>
                <el-button @click="() => searchedNotes(searchInputContent)" size="small">
                  搜索
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
        <div class="headerButton">
          <div class="item">
            <el-button v-if="isEditorModal" type="danger" :icon="Delete" @click="deleteNote" circle>
            </el-button>
          </div>
          <div class="item">
            <el-button type="primary" @click="addOneNote" :disabled="isEditorModal">
              + 新建
            </el-button>
          </div>
          <div class="item">
            <el-button
              id="editorButton"
              @click="
                () => {
                  isEditorModal = !isEditorModal
                  selectedIdList = []
                }
              "
            >
              <span>{{ isEditorModal ? '取消' : '编辑' }}</span>
            </el-button>
          </div>
          <div class="item">
            <el-button
              id="refreshIcon"
              @click="
                async () => {
                  await refreshNoteList()
                }
              "
              :disabled="isEditorModal"
              circle
            >
              <el-icon>
                <Refresh />
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="selectedAll" v-if="isEditorModal">
      <el-checkbox v-if="isEditorModal" v-model="checkAll" />
      <el-divider direction="horizontal" style="margin: 0" />
    </div>
    <NoteList
      ref="childNoteList"
      :noteList="baseData"
      :isEditorModal="isEditorModal"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped lang="scss">
.noticesTitle {
  display: flex;
  margin: 0 0 0 0.5em;

  & h2 {
    margin: 0;
  }
}

.divideLine {
  margin: 0.5em;
  border: solid 1px #d3cfcf;
}

.createNotices {
  display: flex;
  margin: 0 0 1em 0.5em;
}

.createNoticesButton {
  display: flex;
  flex-direction: row-reverse;
  margin: 0 1em 0.5em 0;

  & button {
    margin-right: 0.5em;
  }
}

.mainContentContain {
  padding: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);

  .headerContain {
    margin: 0 0 1em 0;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .headerTitle {
        margin-left: 0.6em;
      }

      .headerButton {
        display: flex;
        align-items: center;
        gap: 0.5em;
        margin-right: 0.6em;

        .item {
          #refreshIcon {
            font-size: 1.5em;
          }
        }
      }
    }

    .insideContent {
      display: flex;
    }
  }

  .selectedAll {
    display: flex;
    align-items: center;
    gap: 0.6em;
  }
}
</style>
