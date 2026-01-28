import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ElectronAPI } from '@/windowApi.ts'
import { ElMessage } from 'element-plus'
import { ElmessageConfig } from '../../oth/ui.ts'

declare const window: Window & {
  electronApi: ElectronAPI
}

type FontDesc = {
  name: string
  en: string
  family: string
}

export const PRE_FONTS: FontDesc[] = [
  { name: '宋体', en: 'SimSun', family: 'SimSun, serif' },
  { name: '黑体', en: 'SimHei', family: 'SimHei, sans-serif' },
  { name: '微软雅黑（默认）', en: 'Microsoft Yahei', family: '"Microsoft Yahei", sans-serif' },
  { name: '微软正黑体', en: 'Microsoft JhengHei', family: '"Microsoft JhengHei", sans-serif' },
  { name: '楷体', en: 'KaiTi', family: 'KaiTi, serif' },
  { name: '新宋体', en: 'NSimSun', family: 'NSimSun, serif' },
  { name: '仿宋', en: 'FangSong', family: 'FangSong, serif' },
]

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(false)
  const fontList = ref<FontDesc[]>(PRE_FONTS)
  const appliedFont = ref<FontDesc>({
    name: '微软雅黑（默认）',
    en: 'Microsoft Yahei',
    family: '"Microsoft Yahei", sans-serif',
  })

  watch(isDark, (val) => {
    const base = document.getElementById('base')
    if (!base) return

    if (val) {
      document.getElementById('base')?.classList.add('dark')
    } else {
      base.classList.remove('dark')
    }
  })

  async function initTheme() {
    const theme = await window.electronApi.getTheme()
    isDark.value = theme === 'dark';
    appliedFont.value = await window.electronApi.getFont();
    setFontStyle(appliedFont.value);
  }

  async function shiftTheme(isDarkMode: boolean) {
    isDark.value = isDarkMode
    await window.electronApi.setTheme(isDarkMode ? 'dark' : 'light')
  }

  function setFontStyle(value: FontDesc) {
    const font = PRE_FONTS.find(item => item.name === value.name);
    if (font) {
      appliedFont.value = font;
      document.getElementById('base')?.style.setProperty('--font-family', font.family);
    } else {
      appliedFont.value = { name: '微软雅黑（默认）', en: 'Microsoft Yahei', family: '"Microsoft Yahei", sans-serif'};
      document.getElementById('base')?.style.setProperty('--font-family', '"Microsoft Yahei", sans-serif');
    }
  }

  async function selectFont(value: FontDesc) {
    if (value) {
      appliedFont.value = value
      setFontStyle(appliedFont.value)
      const payload = {
        name: value.name,
        en: value.en,
        family: value.family,
      }
      await window.electronApi.setFont(payload);
      ElMessage(ElmessageConfig(`已切换为${appliedFont.value.name}`, 'success', 500, true))
    } else {
      setFontStyle({
        name: '微软雅黑（默认）',
        en: 'Microsoft Yahei',
        family: '"Microsoft Yahei", sans-serif"',
      });
      await window.electronApi.setFont({
        name: '微软雅黑（默认）',
        en: 'Microsoft Yahei',
        family: '"Microsoft Yahei", sans-serif"',
      });
    }

  }

  return {
    isDark,
    appliedFont,
    selectFont,
    initTheme,
    shiftTheme,
  }
})
