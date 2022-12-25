<template>
  <div class="recommend-box" v-if="recommendBrowser" :class="recommendBrowser ? 'box-show':''">
    <div class="recommend-box-main">
      <img class="close-img" src="@/assets/user/space/close.png" @click="closeRecommend">
      <div class="rec-title">当前浏览器非最佳兼容版本</div>
      <div class="rec-text">推荐使用以下浏览器的最新版本，体验更稳定</div>
      <div class="browser-box">
        <div v-for="item in browser" :key="item" class="b-item">
          <div class="b-img" @click="goUrl(item.url)"><img :src="item.img"></div>
          <div class="b-name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import Chrome from '@/assets/home/browser/Chrome.png';
import browser360 from '@/assets/home/browser/360.png';
import Safari from '@/assets/home/browser/Safari.png';
import Edge from '@/assets/home/browser/Edge.png';
import moment from "moment";

const props = defineProps({
  userId: {
    type: Number,
    default: 0
  }
})


onMounted(() => {
  const userAgent = navigator.userAgent.toLowerCase()
  let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  let isSafari = userAgent.indexOf("safari") > -1
  let isChrome = userAgent.indexOf("chrome") > -1
  let isEdg = userAgent.indexOf("edg") > -1
  let isLBBROWSER = userAgent.indexOf("lbbrowser") > -1
  let isMetaSr = userAgent.indexOf("metasr") > -1
  let isQQBrowser = userAgent.indexOf("qqbrowse") > -1
  let isTHEWORLD = userAgent.indexOf("theworld") > -1
  let isWX = userAgent.indexOf("micromessenger") > -1

  const closeRecommend = localStorage.getItem('closeRecommend' + props.userId)
  const oldData = new Date(closeRecommend).getTime()
  const nowData = new Date().getTime()
  let data = nowData - oldData
  if (data > 3600 * 1000 * 24 * 5) {
    if (isWX) {//微信
      recommendBrowser.value = true
    } else if (isLBBROWSER) {//猎豹
      recommendBrowser.value = true
    } else if (isMetaSr) {//搜狗
      recommendBrowser.value = true
    } else if (isQQBrowser) {//QQ
      recommendBrowser.value = true
    } else if (isTHEWORLD) {//世界之窗
      recommendBrowser.value = true
    } else if (isSafari && !isChrome) {//Safari弹出
      recommendBrowser.value = true
    } else if (!isChrome && !isSafari) {//非谷歌非Safari
      recommendBrowser.value = true
    }
  }

})

//推荐浏览器弹窗
const recommendBrowser = ref(false)
const closeRecommend = () => {
  recommendBrowser.value = false
  //存入关闭状态'close'
  localStorage.setItem('closeRecommend' + props.userId, moment().format('YYYY-MM-DD'))
}
const browser = ref([
  {
    img: Chrome,
    url: 'https://www.google.cn/intl/zh-CN/chrome/',
    name: '谷歌'
  },
  {
    img: browser360,
    url: 'https://browser.360.cn/se/',
    name: '360'
  },
  {
    img: Edge,
    url: 'https://www.microsoft.com/zh-cn/edge/home?icid=SSM_AS_Promo_Other_Edge&form=MA13FJ',
    name: 'Edge'
  },
])

const goUrl = (url) => {
  window.open(url, "_blank")
}

</script>

<style scoped lang="scss">
.recommend-box {
  border-radius: 16px;
  background: #FFFFFF;
  padding: 36px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  width: 370px;
  transition: right .3s ease;
  right: -400px;
  bottom: -400px;

  animation-name: shutter-in-right;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;

  .recommend-box-main {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: #9094A6;
    line-height: 20px;

    .close-img {
      width: 24px;
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }

    .rec-title {
      font-size: 16px;
      font-weight: 500;
      color: #181920;
      line-height: 22px;
      text-align: center;
    }

    .rec-text {
      margin-top: 10px;
      text-align: center
    }

    .browser-box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30px;

      .b-item {
        margin: 0 20px;

        .b-img {
          img {
            width: 48px;
            height: 48px;
            cursor: pointer;
          }
        }

        .b-name {
          text-align: center;
        }
      }
    }
  }
}

.box-show {
  right: 15px;
  bottom: 15px;
}

@keyframes shutter-in-right {
  0% {
    transform: rotateY(-100deg);
    transform-origin: right;
    opacity: 0;
  }
  100% {
    transform: rotateY(0);
    transform-origin: right;
    opacity: 1;
  }
}

</style>
