<template>

  <div  class="succeed-dialog-box">
    <el-dialog v-model="spaceNotEnough" title="扩容成功" width="312px" :show-close="false" @open="openSucceed">
      <div class="succeed-space-box">
        <img class="close-img" src="@/assets/user/space/close.png" @click="spaceNotEnough = false">
        <img src="@/assets/user/space/notEnough.png" style="margin-left: 19px;">
        <div class="tip">无法上传，存储空间不足！</div>
        <div class="time">
          <span v-if="memberState === 1">512G低至49，速来抢购！</span>
          <span v-else>升级为个人版可获得增额空间！</span>
        </div>
        <el-button type="primary" class="succeed-btn"  @click="toPacking" v-if="memberState === 1">购买容量包</el-button>
        <el-button type="primary" class="succeed-btn"  @click="openMember" v-else>升级为个人版</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script setup>

import {ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {openOpenMember, openRecharge} from "../pay";
import pay from '@/plugins/pay' //支付、充值
const store = useStore();
const router = useRouter();


const props = defineProps({
  info: {
    type: Object,
    default: {}
  },
})

const memberState = computed(() => {
  return store.state.user.member.state
})

function open() {
  spaceNotEnough.value = true
}

const spaceNotEnough = ref(false)
//弹窗打开
const openSucceed = ()=>{

}

const toPacking = () =>{
  router.push({path: '/user/center/packing'})
  spaceNotEnough.value = false
}

const openMember = () =>{
  pay.openOpenMember({onSubmitSuccess, payShow: true},1);

}
const onSubmitSuccess = () => {
  spaceNotEnough.value = false
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
