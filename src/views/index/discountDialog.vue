<template>
  <div class="discount-dialog" v-show="adShow">
    <div class="discount-main">
      <div class="discount-close" @click="adClose"></div>
      <img src="@/assets/home/discount-content.png" @click="toMember">
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted} from "vue";
import moment from "moment";
import {computed} from "@vue/runtime-core";
import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps({
  userId: {
    type: Number,
    default: 0
  },
  memberState: {
    type: Number,
    default: 0
  },
})


onMounted(() => {
  if (props.memberState !== 1) {
    handleOpenAd()
  }
})

//广告弹窗
const adShow = ref(false)

function handleOpenAd() {
  const adActivityDate = localStorage.getItem('adActivityDate' + props.userId)
  const data = moment().format('YYYY-MM-DD')
  if (!adActivityDate || data != adActivityDate) {
    adShow.value = true
  }
}

//关闭广告弹窗-保存时间
const adClose = () => {
  adShow.value = false
  // 保存当天时间
  localStorage.setItem('adActivityDate' + props.userId, moment().format('YYYY-MM-DD'))
}

//前往开通会员并保存时间
const toMember = () => {
  router.push({path: '/user/center/member'})
  const adActivityDate = localStorage.getItem('adActivityDate' + props.userId)
  if (!adActivityDate) {
    localStorage.setItem('adActivityDate' + props.userId, moment().format('YYYY-MM-DD'))
  }
}
</script>

<style scoped lang="scss">
.discount-dialog {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background: rgba($color: #000000, $alpha: .5);

  .discount-main {
    position: relative;
    width: 360px;
    height: 542px;

    .discount-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }

    img {
      height: 100%;
      cursor: pointer;
    }
  }

}
</style>
