<template>
  <el-container style="height:100%;">
    <MaterialLeft></MaterialLeft>
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="keepList">
        <component :is="Component" :key="route.name"/>
      </keep-alive>
    </router-view>

  </el-container>
</template>
<script setup>
import { useStore } from "vuex";
import MaterialLeft from "../components/MaterialLeft";
const store = useStore();
store.dispatch('material/getUserAuthorize');
const keepList = ref(['material-IndexPage','material-myCollection','material-purchased','material-orders'])
</script>
<style scoped lang="scss">
@import "./style.scss";

</style>
