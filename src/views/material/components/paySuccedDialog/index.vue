<template>

  <div class="pay-succeed">
    <el-dialog v-model="paySucceed" width="360px">
      <div class="paySucceed-box">
        <img class="pay-succeed-bg" src="@/assets/material/pay-succeed-dialig-bg.png">
        <img src="@/assets/material/icon_close.png" class="close" @click="close">
        <div class="pay-title">购买成功！</div>
        <div class="pay-text">
          您购买的素材<br>
          可在<span class="pay-yel">【已购素材】</span>进行下载备份
        </div>
        <el-button type="primary" color="#3468FE" @click="handleToPurchased">去看看</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";

const paySucceed = ref(false)
const router = useRouter();

function open() {
  paySucceed.value = true
}

const close = () => {
  paySucceed.value = false
}

//跳转到已购素材页面
const handleToPurchased = () => {
  router.push({path: '/material/main/purchased'})
  paySucceed.value = false
}


defineExpose({open})

</script>

<style scoped lang="scss">
.pay-succeed{
  :deep(.el-dialog__header){
    display: none;
  }
  :deep(.el-dialog){
    border-radius: 37px;
  }
  :deep(.el-dialog__body){
    border-radius: 37px;
    height: 212px;
    padding: 0px;
    background-image: url("@/assets/material/pay-succeed-dialig-bg.png");
  }
  :deep(.el-overlay-dialog){
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :deep(.el-dialog__headerbtn){
    display: none;
  }
  .paySucceed-box{
    width: 100%;
    height: 100%;
    background-image: url("@/assets/material/pay-succeed-dialig-bg.png");
    position: relative;
    border-radius: 37px;
    .pay-succeed-bg{
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .close{
      position: absolute;
      width: 24px;
      height: 24px;
      top: 12px;
      right: 12px;
      cursor: pointer;
    }
    .pay-title{
      font-size: 28px;
      font-weight: 500;
      color: #3D3F50;
      line-height: 40px;
      margin-bottom: 12px;
      z-index: 1;
      position: absolute;
      top:30px;
      left: 34px;
    }
    .pay-text{
      font-size: 14px;
      color: #3D3F50;
      z-index: 1;
      position: absolute;
      left: 36px;
      top: 82px;
      .pay-yel{
        color: #F88212;
      }
    }
    .el-button{
      margin-top: 24px;
      border-radius: 8px;
      z-index: 1;
      position: absolute;
      bottom: 30px;
      left: 36px;
    }
  }
}
</style>
