<template>
  <el-container style="height: 100%">
    <tool-left></tool-left>
<!--    <toolbox></toolbox>-->
    <router-view></router-view>
  </el-container>
</template>
<script setup>
import toolbox from "../toolbox";
import toolLeft from "../components/toolLeft";

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
