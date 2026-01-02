<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Delete, Refresh, Search } from '@element-plus/icons-vue'

onMounted(async () => {
  await initNotes()
  await initGlobalTags()
})

const visibleList = computed(() => (isSearchMode.value ? searchResult.value : notesFromDb.value))
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
                  selectedNoteIdList = []
                }
              "
            >
              <span>{{ isEditorModal ? '取消' : '编辑' }}</span>
            </el-button>
          </div>
          <div class="item">
            <el-button id="refreshIcon" @click="refreshBtuClick()" :disabled="isEditorModal" circle>
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
    <noteList />
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
