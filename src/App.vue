<script setup lang="ts">
import AsideMenu from '@/components/basicView/AsideMenu.vue'
import Header from '@/components/basicView/Header.vue'
import { useThemeStore } from '@/stores/setting.ts'
import { onMounted } from 'vue'

const settingStore = useThemeStore();

onMounted(()=>{
  settingStore.initTheme();
})
</script>
<template>
  <el-container>
    <el-header class="header">
      <Header />
    </el-header>
    <el-container class="el-mainContainer">
      <AsideMenu />
      <router-view />
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.header {
  padding: 0;
  height: 50px;
}

.el-mainContainer {
  width: 100vw;
}
</style>
