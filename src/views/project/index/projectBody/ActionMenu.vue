<template>
  <span class="card-list" style="font-size:18px" @click="handleChangeType(layoutType == 'card'?'list':'card')" :title="layoutType == 'list'?'卡片风格':'列表风格'">
    <!-- <el-icon v-if="layoutType == 'list'"><Menu /></el-icon> -->
    <!-- <el-icon v-if="layoutType == 'card'"><Expand /></el-icon> -->
    <span v-if="layoutType == 'card'"><svg-icon iconClass="icon_list2" :size="32"></svg-icon></span>
    <span v-if="layoutType == 'list'"><svg-icon iconClass="icon_card2" :size="32"></svg-icon></span>
  </span>
</template>
<script setup>
import {useStore} from "vuex";
import { computed, ref } from "vue-demi";
const store = useStore();
const layoutType = computed(()=>{
  return store.state.project.layoutType
}); 
const handleChangeType = (type)=>{
  store.commit('project/SET_LAYOUT_TYPE',type)
}
</script>
<style scoped lang="scss">
.card-list{
 margin-right: 12px;
 height: 32px;
 span{
  display: inline-block;
  line-height: 32px;
 }
}
</style>