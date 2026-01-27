import { defineStore } from 'pinia';
import { ref, watch } from 'vue'
import type { ElectronAPI } from '@/windowApi.ts'

declare const window: Window & {
  electronApi: ElectronAPI
}

export const useSettingStore = defineStore('setting', ()=>{
  const isDark = ref<boolean>(false);

  watch(isDark, (val)=>{
    const base = document.getElementById('base');
    if (!base) return;
    console.log(isDark.value)
    if (val) {
      document.getElementById('base')?.classList.add('dark')
    } else {
      base.classList.remove('dark')
    }
  });

  async function initTheme() {
    const theme = await window.electronApi.getTheme();
    isDark.value = theme === 'dark';
  }

  async function shiftTheme(isDarkMode: boolean) {
    isDark.value = isDarkMode;
    await window.electronApi.setTheme(isDarkMode ? 'dark' : 'light');
  }


  return {
    isDark,
    initTheme,
    shiftTheme
  }
})
