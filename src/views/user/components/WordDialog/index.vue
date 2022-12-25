<template>
  <div class="dialog">
    <el-dialog  v-model="showDialog" :show-close="false" :close-on-click-modal="closeOnClickModal" :width="width" @open="open" @close="close">
      <div>
        <div class="dialog-title" >
          <div style="display:flex; align-items:center">
              <span>{{ title }}</span>
              <span v-if="desc" style="color: #9094A6; font-size:12px; margin-left:10px;font-weight:400">{{ desc }}</span>
          </div>
          <div @click="showDialog = false" style="width:16px;height:16px;cursor:pointer;"><el-icon><CloseBold style="color: #ABABAB" /></el-icon></div>
        </div>
        <slot> </slot>
        <div class="dialog-bt" v-if="showButton">
          <el-button @click="showDialog = false">
            <span v-if="props.openType === 0">返回</span>
            <span v-else>取消</span>
          </el-button>
          <el-button class="confirm" @click="confirm" :loading="loadingSubmit" v-show="props.openType !== 0">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import {watch} from "vue";

const props = defineProps({
  show: {
    type:Boolean,
    default: false,
  },
  loadingSubmit: {
    type:Boolean,
    default: false,
  },
  showButton:{
    type:Boolean,
    default: true,
  },
  width:{
    default:'530px',
    type:String,
  },
  openType:{
    default:1,
    type:Number,
  },
  title:String,
  desc:String,
  closeOnClickModal: {
    type:Boolean,
    default: true,
  }
})
const emit = defineEmits(['confirm','confirm2','update:show','onOpen', 'onClose'])

const showDialog = computed({
  get(){
    return props.show
  },
  set:(val)=> {emit('update:show',val);},
})

const open = () => {
  emit('onOpen');
}

const close = () => {
  emit('onClose');
}

const confirm = () => {
  if (props.openType === 1){
    emit('confirm')
  } else if(props.openType === 2){
    emit('confirm2')
  }else {
    showDialog.value = false
  }
}
</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
