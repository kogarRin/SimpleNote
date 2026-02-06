<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { PRE_FONTS, useThemeStore } from '@/stores/setting.ts'
import { onMounted, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import SettingDialog from '@/components/main/SettingDialog.vue'
import type { ElectronAPI } from '@/windowApi.ts'
import type { DbRes } from '@/ts/class/noteClass.ts'
import { Res, RESCODE } from '../../../oth/res.ts'
import { ElmessageConfig } from '../../../oth/ui.ts'
import { ElMessage } from 'element-plus'

declare const window: Window & {
  electronApi: ElectronAPI
}

const { isDark, appliedFont } = storeToRefs(useThemeStore())
const settingStore = useThemeStore()
const showDesc = ref<boolean>(false)
const showBrowse = ref<boolean>(false)
const showEdit = ref<boolean>(false)
const resData = ref<DbRes>({ noteList: [] })

const handleClose = (type: 'desc' | 'browse' | 'edit') => {
  if (type === 'desc') showDesc.value = false
  if (type === 'browse') showBrowse.value = false
  if (type === 'edit') showEdit.value = false
}

const handleOpen = (type: 'desc' | 'browse' | 'edit') => {
  if (type === 'desc') showDesc.value = true
  if (type === 'browse') showBrowse.value = true
  if (type === 'edit') showEdit.value = true
}

async function getData() {
  const res = await window.electronApi.getNotes()
  if (res.code === RESCODE.SUCCESS) {
    resData.value.noteList = res.data.noteList
    return res
  } else {
    ElMessage(ElmessageConfig(`数据加载失败`, 'error', 1000, true))
    return new Res('数据加载失败', { noteList: [] }, RESCODE.ERROR)
  }
}

onMounted(async ()=>{
  await getData()
})
</script>

<template>
  <SettingDialog
    :descView="showDesc"
    :browseView="showBrowse"
    :editView="showEdit"
    :onClose="handleClose"
    :data="resData"
  />
  <div class="settingsContainer">
    <el-space style="width: 100%" direction="vertical" fill>
      <el-card>
        <template #header>
          <div class="title">
            <b>设置与说明</b>
          </div>
        </template>

        <div class="theme">
          <div class="item">
            <div>
              <span>主题</span>
            </div>
          </div>
          <el-divider />

          <div class="item">
            <div>
              <span>深色模式</span>
            </div>
            <div class="modeButton">
              <el-switch
                active-text="开启"
                inactive-text="关闭"
                v-model="isDark"
                @change="
                  () => {
                    settingStore.shiftTheme(isDark)
                  }
                "
              />
            </div>
          </div>

          <div class="item">
            <div>
              <span>选择字体</span>
            </div>
            <div>
              <el-select
                style="width: 160px"
                v-model="appliedFont"
                value-key="en"
                @change="settingStore.selectFont"
              >
                <el-option
                  v-for="font in PRE_FONTS"
                  :value="font"
                  :label="font.name"
                  :key="font.family"
                  :style="{ fontFamily: font.family }"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <el-divider class="partsDivider" />

        <div class="options">
          <div class="item">
            <div>
              <span>选项</span>
            </div>
          </div>

          <el-divider />

          <div class="item">
            <div>
              <span>复制选项</span>
              <el-tooltip placement="top" effect="dark" content="查看说明">
                <el-icon id="infoFile" @click="handleOpen('desc')"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
            <div class="copyButton">
              <el-tooltip placement="top" effect="dark" content="选择复制或导出的内容">
                <el-button type="default" id="copyChooserButton" @click="handleOpen('browse')">
                  浏览
                </el-button>
              </el-tooltip>
              <el-tooltip placement="top" effect="dark" content="点击复制 json">
                <el-button type="primary" id="copyButton" @click="copyJson"> 复制全部 </el-button>
              </el-tooltip>
            </div>
          </div>

          <el-divider class="partsDivider" />

          <div class="about">
            <div class="item">
              <div>
                <span>关于</span>
              </div>
            </div>

            <el-divider />

            <div class="item">
              <div>
                <span>编辑</span>
              </div>
              <div>
                <el-button type="default" @click="handleOpen('edit')">查看说明</el-button>
              </div>
            </div>
            <div class="item">
              <div>
                <span>仓库</span>
              </div>
              <div class="repo" @click="copyUrl">
                <el-tooltip placement="top" effect="dark" content="点击复制仓库地址">
                  <u style="font-size: 14px">Github仓库</u>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<style scoped lang="scss">
.settingsContainer {
  flex-grow: 1;
  padding: 0.5em;

  .title {
    display: flex;
    justify-content: flex-start;
  }

  .item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5em;

    #infoFile {
      margin: 0.3em 0 0 0.5em;

      &:hover {
        cursor: pointer;
      }
    }

    .copyButton {
      right: 0;
      display: flex;

      .inputDefaultPath {
        width: 250px;
      }
    }
  }

  .el-divider--horizontal {
    width: 100%;
    margin: 12px 0;
  }

  .partsDivider {
    margin-bottom: 24px;
  }

  .repo {
    :hover {
      cursor: pointer;
    }
  }
}
</style>
