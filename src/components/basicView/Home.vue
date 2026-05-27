<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Delete, Plus, Search } from '@element-plus/icons-vue'
import type { Note } from '@/ts/class/noteClass.ts'
import { ElMessage } from 'element-plus'
import { ElmessageConfig } from '../../../oth/ui.ts'
import type { ElectronAPI } from '@/windowApi.ts'
import NoteList from '@/components/main/NoteList.vue'
import { RESCODE } from '../../../oth/res.ts'

declare const window: Window & {
  electronApi: ElectronAPI
}

const baseData = ref<Note[]>([])
const noticeListenerDelete = ref(false)
const isEditorModal = ref(false)
const selectedIdList = ref<string[]>([])
const checkAll = ref(false)
const searchInputContent = ref('')
const searchKeyword = ref('')
const childNoteList = ref<InstanceType<typeof NoteList> | null>(null)
const loading = ref(false)

const displayedNotes = computed<Note[]>(() => {
  if (!searchKeyword.value.trim()) {
    return baseData.value
  }
  const keyword = searchKeyword.value.trim().toLowerCase()
  return baseData.value.filter(
    (note) =>
      note.title.toLowerCase().includes(keyword) ||
      note.content.toLowerCase().includes(keyword),
  )
})

const totalCount = computed(() => baseData.value.length)
const displayCount = computed(() => displayedNotes.value.length)
const isSearching = computed(() => searchKeyword.value.trim().length > 0)

async function initNotes(model: number) {
  try {
    loading.value = true
    const res = await window.electronApi.getNotes()
    baseData.value = res.data.noteList
    if (res.code === RESCODE.SUCCESS) {
      const msg = model === 1 ? '加载成功' : '刷新成功'
      ElMessage(ElmessageConfig(msg, 'success', 1000, true))
      return baseData.value
    }
    ElMessage(ElmessageConfig('加载失败', 'error', 1000, true))
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}


async function addOneNote() {
  await window.electronApi.addNotes()
  const res = await window.electronApi.getNotes()
  baseData.value = res.data.noteList
  ElMessage(ElmessageConfig('添加成功', 'success', 1000, true))
}

function handleSelect(idList: string[]) {
  selectedIdList.value = idList
}

function showDeleteConfirm() {
  if (selectedIdList.value.length < 1) {
    ElMessage(ElmessageConfig('请选择要删除的记录', 'warning', 1000, true))
    return
  }
  noticeListenerDelete.value = true
}

async function deleteConfirm() {
  const idList = [...selectedIdList.value]
  await window.electronApi.deleteNotes(idList)
  baseData.value = baseData.value.filter((item) => !idList.includes(item.id))
  selectedIdList.value = []
  noticeListenerDelete.value = false
  ElMessage(ElmessageConfig('删除成功', 'success', 1000, true))
}

function searchedNotes(keyword: string) {
  searchKeyword.value = keyword
}

function clearSearch() {
  searchInputContent.value = ''
  searchKeyword.value = ''
}

function toggleEditorMode() {
  isEditorModal.value = !isEditorModal.value
  selectedIdList.value = []
  checkAll.value = false
}

watch(checkAll, (val) => {
  if (!childNoteList.value) return
  if (val) {
    childNoteList.value.selectAll()
  } else {
    childNoteList.value.clearSelection()
  }
})

watch(selectedIdList, (val) => {
  checkAll.value = val.length > 0 && val.length === displayedNotes.value.length
})

onMounted(async () => {
  await initNotes(1)
})
</script>

<template>
  <!-- 删除确认对话框 -->
  <el-dialog v-model="noticeListenerDelete" :show-close="false" width="380" align-center>
    <template #header>
      <div class="dialog-header">
        <span class="dialog-icon">!</span>
        <span class="dialog-title">确认删除</span>
      </div>
    </template>
    <div class="dialog-body">
      <p>确定要删除选中的 <strong>{{ selectedIdList.length }}</strong> 条笔记吗？</p>
      <p class="dialog-hint">删除后将无法恢复</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="noticeListenerDelete = false">取消</el-button>
        <el-button type="danger" @click="deleteConfirm">确认删除</el-button>
      </div>
    </template>
  </el-dialog>

  <div class="home">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="stats">
          <span v-if="isSearching" class="stat-item search-stat">
            搜索到 <strong>{{ displayCount }}</strong> / {{ totalCount }} 条笔记
          </span>
          <span v-else class="stat-item">
            共 <strong>{{ totalCount }}</strong> 条笔记
          </span>
        </div>
      </div>
      <div class="toolbar-right">
        <el-button
          v-if="isEditorModal"
          type="danger"
          :icon="Delete"
          @click="showDeleteConfirm"
          :disabled="selectedIdList.length === 0"
          plain
        >
          删除 ({{ selectedIdList.length }})
        </el-button>
        <el-button
          type="primary"
          :icon="Plus"
          @click="addOneNote"
          :disabled="isEditorModal"
        >
          新建笔记
        </el-button>
        <el-button
          @click="toggleEditorMode"
          :type="isEditorModal ? 'warning' : 'default'"
        >
          {{ isEditorModal ? '完成' : '编辑' }}
        </el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchInputContent"
        :prefix-icon="Search"
        :disabled="isEditorModal"
        size="large"
        class="search-input"
        placeholder="搜索笔记标题或内容..."
        @keyup.enter="searchedNotes(searchInputContent)"
        clearable
        @clear="clearSearch"
      >
        <template #append>
          <el-button @click="searchedNotes(searchInputContent)" :icon="Search">
            搜索
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 编辑模式下的全选栏 -->
    <div v-if="isEditorModal" class="select-bar">
      <el-checkbox v-model="checkAll" :indeterminate="selectedIdList.length > 0 && !checkAll">
        全选
      </el-checkbox>
      <span class="selected-hint">已选择 {{ selectedIdList.length }} 项</span>
    </div>

    <!-- 笔记列表 -->
    <div class="list-area">
      <NoteList
        ref="childNoteList"
        :noteList="displayedNotes"
        :isEditorModal="isEditorModal"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  padding: 0 16px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  min-width: 0;
}

// ========== 对话框 ==========
.dialog-header {
  display: flex;
  align-items: center;
  gap: 10px;

  .dialog-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--el-color-danger);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
  }

  .dialog-title {
    font-size: 16px;
    font-weight: 600;
  }
}

.dialog-body {
  padding: 8px 0;

  p {
    margin: 0 0 8px;
    font-size: 14px;
  }

  .dialog-hint {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

// ========== 工具栏 ==========
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 0 12px;
  flex-shrink: 0;
}

.toolbar-left {
  flex-shrink: 0;

  .stats {
    .stat-item {
      font-size: 13px;
      color: var(--el-text-color-secondary);

      strong {
        color: var(--el-text-color-primary);
        font-weight: 600;
      }
    }

    .search-stat {
      color: var(--el-color-primary);
    }
  }
}

.toolbar-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}

// ========== 搜索栏 ==========
.search-bar {
  flex-shrink: 0;
  padding-bottom: 14px;

  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 10px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      transition: box-shadow 0.25s;

      &:hover,
      &.is-focus {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
    }

    :deep(.el-input-group__append) {
      border-radius: 0 10px 10px 0;
      background: var(--el-color-primary);
      border-color: var(--el-color-primary);

      .el-button {
        color: #fff;
        background: transparent;
        border: none;
      }
    }
  }
}

// ========== 全选栏 ==========
.select-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px 10px;
  flex-shrink: 0;

  .selected-hint {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

// ========== 列表区域 ==========
.list-area {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-bottom: 12px;
}

// ========== 窄屏适配 ==========
@media (max-width: 520px) {
  .home {
    padding: 0 10px;
  }

  .toolbar {
    padding: 10px 0 8px;
    gap: 6px;
  }

  .toolbar-left .stats .stat-item {
    font-size: 12px;
  }

  .toolbar-right :deep(.el-button) {
    padding: 6px 10px;
    font-size: 12px;
  }

  .search-bar {
    padding-bottom: 10px;
  }

  .select-bar {
    padding-bottom: 8px;
  }
}

@media (max-width: 380px) {
  .toolbar-right {
    gap: 4px;

    :deep(.el-button) {
      padding: 5px 8px;
      font-size: 12px;
    }
  }

  .toolbar-left .stats .stat-item {
    font-size: 11px;
  }

  .dialog-header .dialog-title {
    font-size: 14px;
  }
}
</style>
