<template>
  <div class="dialog">
    <!-- 发布成功 -->
    <el-dialog  v-model="show" :show-close="false" width="420px" @close="close">
      <div class="dialog-title-success" >
        <el-image :src="success"></el-image>
        <div style="line-height: 2.3;margin-left: 3px">{{title}}</div>
      </div>
      <div class="success-text">
        <slot name="content"></slot>
      </div>
      <div class="dialog-success-bt" style="text-align: right">
        <slot name="button">
          <el-button style="color: #9094A6;width: 80px;" @click="close">取消</el-button>
          <el-button style="color:#3468FE;width: 80px;" @click="close">关闭</el-button>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import success from '@/assets/images/success.png'
const props = defineProps({
  show: Boolean,
  width:{
    default:'530px',
    type:String,
  },
  title:{
    default: '发布成功',
    type:String,
  },
})

const emit = defineEmits(['update:show'])
const close = () => {
  emit('update:show',false);
}
</script>

<style scoped lang="scss">
@import "./style.scss";
</style>