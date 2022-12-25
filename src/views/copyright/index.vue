<template>
  <el-container style="height: 100%">
    <LeftSider></LeftSider>
    <div class="right-content">
      <router-view v-slot="{ route, Component }">
        <component :is="Component" :key="route.path"></component>
      </router-view>
    </div>
  </el-container>
</template>
<script setup>
import LeftSider from './LeftSidebar';

</script>

<style lang="scss">
.right-content {
  width: calc(100% - 200px);
}
</style>
