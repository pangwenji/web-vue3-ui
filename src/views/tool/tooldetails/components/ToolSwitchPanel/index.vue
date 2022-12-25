<template>
  <div class="main-card-switch" >
    <el-tabs
        v-model="activeName"
        class="demo-tabs"
        @tab-click="handleClick"
        type="card"
        :class="{'header-no':hideHeader}"
    >
      <el-tab-pane label="立即使用" name="useImmediately">
        <slot name="useImmediately"></slot>
      </el-tab-pane>
      <el-tab-pane label="参考示例" name="giveTry" v-if="showTry">
        <slot name="giveTry"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const emit = defineEmits(['tab'])
const value = ref('')
const activeName = ref('useImmediately')
const handleClick = (tab, event) => {
  emit('tab',tab.props.label)
}
const props = defineProps({
  showTry:{
    type:Boolean,
    default:true,
  },
  hideHeader:{
    type:Boolean,
    default: false,
  }
})
</script>
<style scoped lang="scss">
.main-card-switch {
  width: 95%;
  height: 80%;
  margin: auto;
  border-radius: 10px;
  .el-tabs {
    height:100%;
    :deep(.el-tabs__nav){
      border: none;
    }
    :deep(.el-tabs__content){
      background-color: #1C1D24;
      height: 100%;
      border-radius: 0px 10px 10px 10px;
    }
    :deep(.el-tabs__header){
      border: none;
      margin: 0;
    }
    :deep(.el-tabs__item) {
      padding: 0 120px !important;
      border: none;
      border-radius: 10px 10px 0px 0px;
      font-size: 16px;
      height: 60px;
      color: #676C7F;
      line-height: 4;
      background-color: #24262F;
    }
    :deep(.is-active){
      background-color: #43465B;
      color: #FFFFFF;
    }
    :deep(.el-tab-pane){
      height: 100%;
    }
  }

  .header-no{
    :deep(.el-tabs__header){
      display: none;
    }
  }
}
</style>
