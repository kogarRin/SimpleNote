<script setup lang="ts">
import type { DbRes } from '@/ts/class/noteClass.ts'
import type { ElectronAPI } from '@/windowApi.ts'
import { RESCODE } from '../../../oth/res.ts'
import { ElmessageConfig } from '../../../oth/ui.ts'
import { ElMessage } from 'element-plus'

declare const window: Window & {
  electronApi: ElectronAPI
}

const props = defineProps<{
  descView: boolean
  browseView: boolean
  editView: boolean
  onClose: (type: 'desc' | 'browse' | 'edit') => void
  data: DbRes
}>()

function getList(data: DbRes) {
  return data.noteList.map((note) => {
    return {
      title: note.title,
      content: note.content,
      createAt: note.createAt.split('-').join('.'),
    }
  })
}

async function outputContent(title: string = '无标题', content: string) {
  try {
    const res = await window.electronApi.outputNotes(title, content)
    if (res.code === RESCODE.SUCCESS) {
      ElMessage(ElmessageConfig(`已保存至${res.data}`, 'success', 1500, true))
      return res
    } else if (res.code === RESCODE.CANCEL) {
      ElMessage(ElmessageConfig(`取消导出`, 'info', 1500, true))
      return res
    }
  } catch (e) {
    ElMessage(ElmessageConfig(`导出失败${e}`, 'error', 1500, true))
  }
}
</script>

<template>
  <el-dialog
    :open-delay="100"
    :model-value="props.descView"
    @update:model-value="(val: boolean) => !val && props.onClose('desc')"
    :show-close="false"
    center
  >
    <div>
      <h1 class="instructionTitle">说明</h1>
    </div>
    <div class="divideLine"></div>
    <div class="instructionContent">
      <p>点击<button>浏览</button>可选择内容复制或导出为txt文件</p>
      <br />
      <p>点击<button>复制</button>可将文件数据复制到剪贴板</p>
    </div>
    <div class="buttonContain">
      <el-button
        type="primary"
        @click="
          () => {
            onClose('desc')
          }
        "
        >确定</el-button
      >
    </div>
  </el-dialog>

  <el-dialog
    :open-delay="100"
    :modelValue="props.editView"
    :show-close="false"
    @update:model-value="(val: boolean) => !val && props.onClose('edit')"
    center
  >
    <div>
      <h1 class="instructionTitle"><span>编辑说明</span></h1>
    </div>
    <div class="divideLine"></div>
    <div class="instructionContent">
      <p>
        当前支持普通文本编辑，适用情景如：随记、笔记等（甚至创作短篇小说，如果不嫌弃体验较差的编辑页面（doge））
      </p>
      <p>同时，在编辑文本时，段落前无需缩进，段落之间回车换行即可，在预览模式时会自动缩进和分段</p>
    </div>
    <div class="buttonContain">
      <el-button type="primary" @click="onClose('edit')">确定</el-button>
    </div>
  </el-dialog>

  <el-dialog
    :model-value="props.browseView"
    @update:model-value="(val: boolean) => !val && props.onClose('browse')"
    width="700"
  >
    <div class="instructionTitle">
      <h1>全部内容</h1>
    </div>
    <div class="divideLine"></div>
    <div class="noteTable">
      <el-table :data="getList(props.data)" height="400" :show-overflow-tooltip="true">
        <el-table-column fixed="left" label="标题" prop="title" width="100" />
        <el-table-column label="创建时间" prop="createAt" width="150" />
        <el-table-column label="内容" prop="content" width="450" />
        <el-table-column fixed="right" width="150">
          <template #header>
            <el-input placeholder="搜索标题" v-model="searchTitle" />
          </template>
          <template #default="scope">
            <div class="tableBtn" style="display: flex; justify-content: flex-end">
              <el-button
                type="default"
                size="default"
                @click="outputContent(scope.row.title, scope.row.content)"
              >
                导出
              </el-button>
              <el-button type="primary" size="default" @click="getAndCopyContent(scope.$index)">
                复制
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
:root {
  user-select: none;
}

.divideLine {
  margin: 0.5em 0.5em 1em 0.5em;
  width: 100%;
  translate: -7px;
  border: solid 1px #d3cfcf;
}

.instructionTitle {
  margin: 0;

  & p {
    margin: 0.5em;
    color: #1e1d1d;
    font-size: 1.5em;

    & strong {
      background-color: #837f7f;
    }
  }

  .tableBtn {
    display: flex;
    justify-content: flex-end;
  }
}

.instructionContent {
  margin: 1.5em 0.5em 0.5em 0.5em;

  & button {
    margin: 0 0.5em;
  }
  & span {
    color: #1e1d1d;
    font-size: 1.4em;

    & strong {
      margin: 0 0.5em;
    }
  }
  & p {
    font-size: 1.2em;
  }
}

.buttonContain {
  margin: 2em 0 0 0;
  display: flex;
  flex-direction: column-reverse;
}

.contentToCopy {
  height: fit-content;

  .noteItem {
    display: flex;
  }
}
</style>
