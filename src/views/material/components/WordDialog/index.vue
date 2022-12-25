<template>
  <div class="dialog">
    <el-dialog  v-model="showDialog" :show-close="false" :width="width"  @open="open" >
      <div>
        <div class="dialog-title">
          <div >{{ title }}
            <span style="margin-left: 10px;font-size: 12px;color: #F67D7D;font-weight: 400;" v-if="openType === 0 || openType === 3">确认后不能修改</span>
          </div>
          <div @click="close"><el-icon><CloseBold style="color: #ABABAB;cursor: pointer"/></el-icon></div>
        </div>
        <div class="line"></div>
        <slot> </slot>
        <div class="dialog-bt" v-if="showButton">
          <el-button @click="close">取消</el-button>
          <el-button class="confirm" @click="confirm" v-if="openType !== 2">确认提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type:Boolean,
    default: false,
  },
  width:{
    default:'530px',
    type:String,
  },
  //是否显示弹窗按钮
  showButton:{
    type:Boolean,
    default: true,
  },
  //openType=2不显示确定按钮
  openType:{
    default:1,
    type:Number,
  },
  title:String,
})
const emit = defineEmits(['confirm','update:show','onOpen'])

const showDialog = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const close = () => {
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
.line{
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  width: 100%;
  margin-bottom: 24px;
}
</style>
