<template>

  <div  class="succeed-dialog-box">
    <el-dialog v-model="succeedDialog" title="扩容成功" width="312px" :show-close="false" @open="openSucceed">
      <div class="succeed-space-box">
        <img class="close-img" src="@/assets/user/space/close.png" @click="succeedDialog = false">
        <img src="@/assets/user/space/succeed.png" v-if="info.type === 1">
        <img src="@/assets/user/space/Suc-renew.png" v-else>
        <div class="tip">{{ info.tip }} <span>{{info.type === 1 ? '扩容' : '续费'}}成功！</span></div>
        <div class="time">有效期至：{{info.endTime}}</div>
        <el-button type="primary" class="succeed-btn"  @click="succeedDialog = false">知道了（{{countDown}}）</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script setup>

import {ref} from "vue";


const props = defineProps({
  info: {
    type: Object,
    default: {}
  },
})


function open() {
  succeedDialog.value = true
}

// 倒计时
const countDown = ref(0);
const succeedDialog = ref(false)
//扩容成功弹窗打开
const openSucceed = ()=>{
  countDown.value = 5;
  const inter = setInterval(() => {
    countDown.value -= 1;
    if (countDown.value <= 0) {
      succeedDialog.value = false
      clearInterval(inter)
    }
  }, 1000)
}

defineExpose({open})

</script>

<style scoped lang="scss">

.succeed-dialog-box{
  :deep(.el-dialog__header){
    display: none;
  }
  :deep(.el-dialog){
    border-radius: 10px;
  }
  :deep(.el-dialog__body){
    border-radius: 10px;
    height: 328px;
    padding: 0px;
  }
  :deep(.el-overlay-dialog){
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .succeed-space-box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    .close-img{
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    img{
      width: 111px;
      height: 98px;
    }
    .tip{
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 500;
      color: #181920;
      line-height: 22px;
    }
    .time{

    }
    .succeed-btn{
      width: 187px;
      height: 42px;
      background: #3468FE;
      border-radius: 8px;
      margin-top: 30px;
    }
  }
}
</style>
