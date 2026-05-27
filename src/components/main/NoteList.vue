<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Note } from '@/ts/class/noteClass.ts'
import { useRouter } from 'vue-router'

const selectedIdList = ref<string[]>([])
const isLoading = ref(false)
const router = useRouter()

const props = defineProps<{
  noteList: Note[]
  isEditorModal: boolean
}>()

const emits = defineEmits<{
  select: [idList: string[]]
}>()

function selectAll() {
  selectedIdList.value = props.noteList.map((n) => n.id)
}

function clearSelection() {
  selectedIdList.value = []
}

defineExpose({ selectAll, clearSelection, selectedIdList })

function toggleSelect(noteId: string) {
  const index = selectedIdList.value.indexOf(noteId)
  if (index > -1) {
    selectedIdList.value.splice(index, 1)
  } else {
    selectedIdList.value.push(noteId)
  }
}

function openNote(noteId: string) {
  router.push({ name: 'showNote', params: { id: noteId } })
}

function onCardClick(noteId: string) {
  if (props.isEditorModal) {
    toggleSelect(noteId)
  } else {
    openNote(noteId)
  }
}

watch(
  selectedIdList,
  (newVal) => {
    emits('select', newVal)
  },
  { deep: true },
)
</script>

<template>
  <div class="note-list">
    <!-- 空状态 -->
    <div v-if="noteList.length === 0 && !isLoading" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="10" width="52" height="60" rx="4" stroke="currentColor" stroke-width="2.5" />
          <line x1="22" y1="24" x2="50" y2="24" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <line x1="22" y1="34" x2="58" y2="34" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <line x1="22" y1="44" x2="44" y2="44" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      <p class="empty-text">还没有笔记</p>
      <p class="empty-desc">点击"新建笔记"开始记录</p>
    </div>

    <!-- 骨架屏 -->
    <div v-if="isLoading" class="skeleton-list">
      <div v-for="i in 5" :key="i" class="skeleton-card">
        <el-skeleton animated>
          <template #template>
            <div class="sk-header">
              <el-skeleton-item variant="text" style="width: 60%; height: 20px" />
            </div>
            <div class="sk-body">
              <el-skeleton-item variant="text" style="width: 100%; height: 14px" />
              <el-skeleton-item variant="text" style="width: 75%; height: 14px" />
            </div>
            <div class="sk-footer">
              <el-skeleton-item variant="text" style="width: 30%; height: 12px" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <!-- 笔记列表 -->
    <el-scrollbar v-if="noteList.length > 0" class="scroll-area">
      <ul class="card-list">
        <li
          v-for="note in props.noteList"
          :key="note.id"
          class="card-item"
          :class="{ selected: selectedIdList.includes(note.id) }"
        >
          <div class="card-wrapper">
            <el-checkbox
              v-if="props.isEditorModal"
              :model-value="selectedIdList.includes(note.id)"
              class="card-check"
              @click.stop
              @change="toggleSelect(note.id)"
            />
            <div class="card" @click="onCardClick(note.id)">
              <div class="card-header">
                <h3 class="card-title">{{ note.title }}</h3>
                <span class="card-date">{{ note.createAt.split('-').join('.') }}</span>
              </div>
              <p class="card-preview">
                {{ note.content ? note.content.trim().slice(0, 80) : '暂无内容' }}
              </p>
              <div class="card-footer">
                <span class="card-count">
                  {{ note.content ? note.content.trim().length : 0 }} 字
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.note-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// ========== 空状态 ==========
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--el-text-color-disabled);
  user-select: none;

  .empty-icon {
    width: 80px;
    height: 80px;
    opacity: 0.4;
    margin-bottom: 8px;
  }

  .empty-text {
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-secondary);
    margin: 0;
  }

  .empty-desc {
    font-size: 13px;
    margin: 0;
  }
}

// ========== 骨架屏 ==========
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  padding: 16px 20px;
  border-radius: 10px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);

  .sk-header {
    margin-bottom: 12px;
  }

  .sk-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  .sk-footer {
    width: 100%;
  }
}

// ========== 滚动区域 ==========
.scroll-area {
  flex: 1;
  height: 100%;
}

// ========== 卡片列表 ==========
.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-item {
  border-radius: 10px;
  transition: background 0.2s;

  &.selected {
    background: var(--el-color-primary-light-9);
  }

  .card-wrapper {
    display: flex;
    align-items: stretch;
  }
}

.card-check {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 12px 0 4px;
}

.card {
  flex: 1;
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
  min-width: 0;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;

  .card-title {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }

  .card-date {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    white-space: nowrap;
    flex-shrink: 0;
  }
}

.card-preview {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  display: flex;
  align-items: center;

  .card-count {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
