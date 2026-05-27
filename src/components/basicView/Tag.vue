<script setup lang="ts">

</script>

<template>
  <!--标签框-->
  <el-dialog
    :show-close="false"
    title="管理标签"
    style="min-width: 60%; user-select: none"
    center
  >
    <div class="tagsStoreContainer">
      <div class="itemTitle">
        <div style="user-select: none">
          <h4>说明</h4>
          <div class="down">
            <p>此处用于存储标签，可以添加常用标签</p>
            <div>
              <el-button
                size="small"
                type="default"
                style="color: rgb(216, 41, 41)"

              >
                Delete All
              </el-button>
              <el-button type="primary" size="small">
                add
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="itemContent">
        <div class="tagsContainer">

        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
