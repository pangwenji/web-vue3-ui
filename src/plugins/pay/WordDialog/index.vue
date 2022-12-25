<template>
  <div class="dialog">
    <el-dialog  v-model="showDialog" :show-close="false" :width="width" @open="open">
      <div>
        <div class="dialog-title" >
          <div >{{ title }}</div>
          <div @click="handleClose"><el-icon><CloseBold style="color: #ABABAB" /></el-icon></div>
        </div>
        <slot> </slot>
        <div class="dialog-bt">
          <el-button @click="handleClose">取消</el-button>
          <el-button class="confirm" @click="confirm">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElDialog, ElButton, ElIcon ,} from "element-plus";
import { CloseBold } from '@element-plus/icons-vue'
import { computed , defineProps , defineEmits} from 'vue'
const props = defineProps({
  show: {
    type:Boolean,
    default: false,
  },
  width:{
    default:'530px',
    type:String,
  },
  title:String,
})

const emit = defineEmits(['confirm','update:show','onOpen']);

const showDialog = computed({
  get:()=>props.show,
  set:(val)=> emit('update:show',val),
})

const handleClose = ()=>{
  showDialog.value = false
}

const open = () => {
  emit('onOpen');
}

const confirm = () => {
  emit('confirm')
}
</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
