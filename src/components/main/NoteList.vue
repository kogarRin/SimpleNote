<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Note } from '@/ts/class/noteClass.ts'

const selectedIdList = ref<string[]>([])
const isLoading = ref(false)

const props = defineProps<{
  noteList: Note[]
  isEditorModal: boolean
}>()

const emits = defineEmits<{
  select: [idList: string[]]
}>()

function toEdit(noteId: string) {
  if (props.isEditorModal) {
    const index = selectedIdList.value.indexOf(noteId)
    if (index > -1) {
      selectedIdList.value.splice(index, 1)
    } else {
      selectedIdList.value.push(noteId)
    }
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
  <div class="showContainer">
    <div style="margin: 1em 0 1em 0" v-if="isLoading" class="skeleton">
      <el-skeleton
        v-for="i in Math.ceil(400 / 68)"
        :key="i"
        variant="text"
        :rows="1"
        id="skeLine"
        animated
      />
    </div>
    <div class="emptyContainer" v-if="!props.noteList">
      <img src="/public/assets/nodata.png" alt="No Data" />
      <span>暂无数据</span>
    </div>
    <el-scrollbar>
      <ul style="padding: 0" v-if="props.isEditorModal">
        <li
          style="list-style-type: none"
          v-for="eachNote in props.noteList"
          :key="eachNote.id"
          class="contentsList"
        >
          <div style="display: flex; align-items: center; width: 100%">
            <el-checkbox
              v-if="props.isEditorModal"
              type="checkbox"
              v-model="selectedIdList"
              :value="eachNote.id"
              @click.stop
            />
            <div class="noteContainer" @click="toEdit(eachNote.id)">
              <div class="noteInfoContain">
                <div class="contentTitle">
                  <span>
                    <b>{{ eachNote.title }}</b>
                  </span>
                </div>
                <div class="noteContent">
                  <div>
                    <span>
                      {{
                        eachNote.content
                          ? `${eachNote.content.trim().slice(0, 32)}......`
                          : '暂无内容'
                      }}
                    </span>
                  </div>
                  <div>
                    <!--                  <el-tag-->
                    <!--                    v-for="tag in eachNote.tags.length > 6-->
                    <!--                      ? eachNote.tags.slice(0, 6)-->
                    <!--                      : eachNote.tags"-->
                    <!--                    style="margin: 0 5px"-->
                    <!--                  >-->
                    <!--                    {{ eachNote.tags.length < 6 ? tag : tag + '...' }}-->
                    <!--                  </el-tag>-->
                  </div>
                </div>
                <div class="detailInfo">
                  <div>
                    <span
                      >共<span style="padding: 0 0.2em">{{
                        eachNote.content ? eachNote.content.trim().length : 0
                      }}</span
                      >字</span
                    >
                  </div>
                  <div>
                    <span>创建于</span>
                    <span>{{}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul style="padding: 0" v-else>
        <li
          style="list-style-type: none"
          v-for="eachNote in props.noteList"
          :key="eachNote.id"
          class="contentsList"
        >
          <el-checkbox
            v-if="props.isEditorModal"
            type="checkbox"
            v-model="selectedIdList"
            :value="eachNote.id"
          />
          <div class="noteContainer" @click="toEdit(eachNote.id)">
            <div class="noteInfoContain">
              <div class="contentTitle">
                <span>
                  <b>{{ eachNote.title }}</b>
                </span>
              </div>
              <div class="noteContent">
                <div class="noteContentContain">
                  <span>
                    {{
                      eachNote.content
                        ? `${eachNote.content.trim().slice(0, 32)}......`
                        : '暂无内容'
                    }}
                  </span>
                </div>
                <div class="tagsContain">
                  <!--                  <el-tag-->
                  <!--                    v-for="tag in eachNote.tags.length > 6-->
                  <!--                      ? eachNote.tags.slice(0, 6)-->
                  <!--                      : eachNote.tags"-->
                  <!--                    style="margin: 0 5px"-->
                  <!--                  >-->
                  <!--                    {{ eachNote.tags.length < 6 ? tag : tag + '...' }}-->
                  <!--                  </el-tag>-->
                </div>
              </div>
              <div class="detailInfo">
                <div>
                  <span
                    >共<span style="padding: 0 0.2em">{{
                      eachNote.content ? eachNote.content.trim().length : 0
                    }}</span
                    >字</span
                  >
                </div>
                <div>
                  <span>创建于</span>
                  <span>{{}}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.showContainer {
  position: relative;
  height: 90%;
  border-radius: 0.5em;

  .skeleton {
    padding: 1em 0 0 0.5em;
    position: absolute;
    width: 94%;
    left: 1%;

    #skeLine {
      display: grid;
      grid-template-columns: 1fr;
      margin-bottom: 1em;
    }
  }

  .emptyContainer {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
  }

  .contentsList {
    display: flex;

    &:hover {
      opacity: 0.75;
    }

    .noteContainer {
      width: 100%;

      .noteInfoContain {
        display: flex;
        flex-direction: column;
        text-align: left;
        margin: 0 0.6em 1em 0.6em;
        border: solid rgba(109, 127, 145, 0.45) 2px;
        border-radius: 0.2em;

        &:hover {
          box-shadow: 0 0 10px rgba(149, 183, 209, 0.68);
          cursor: pointer;
        }

        .contentTitle {
          margin: 0.8em 0.8em 0 0.8em;
          user-select: none;
        }

        .noteContent {
          display: flex;
          margin: 0 0.8em 0 0.8em;
          user-select: none;
          flex-direction: row;
          justify-content: space-between;
        }

        .detailInfo {
          display: flex;
          margin: 0.5em 0.8em 0.5em 0.8em;

          div {
            margin: 0 0.5em 0 0;
          }
        }
      }
    }
  }
}
</style>
