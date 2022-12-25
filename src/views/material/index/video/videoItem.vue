<template>
  <div  class="file-item-card" @dblclick="toDetails(page,menu)">
    <div class="card-top">
      <div style="display: flex;">
        <div class="top-icon">
          <div class="icon">
            <Star style="width: 20px; height:20px;"/>
          </div>
        </div>
        <div class="top-icon">
          <div class="icon">
            <ShoppingCart style="width: 20px; height: 20px;"/>
          </div>
        </div>
        <div class="top-icon">
          <div class="icon">
            <Download style="width: 20px; height:20px;"/>
          </div>
        </div>
      </div>
      <div class="top-botton">
        <div class="buy">立即购买</div>
      </div>
    </div>
    <div v-if="data.fileCat === 'video'" class="file-item-top file-item-video" @mousemove="handleMouseMoveVideo">
      <div class="sprite"
           :style="{width:`${viewWidth}px`,height:`${viewHeight}px`, 'background-image': 'url(' + data.spriteImage + ')','background-position-y': ('-' + String(offsetY) + 'px')}"></div>
      <div class="cover" :style="{'background-image':`url(${data.cover})`}"></div>
      <div class="time">{{ secondToDate(data.duration) }}</div>
      <!-- <div class="mark">防</div>
      <div class="play"> <el-icon> <VideoPlay /> </el-icon></div> -->
      <div class="progress">
        <div :style="{ width: String(percentage) + '%' }" class="progress-outer"></div>
      </div>
    </div>
    <div class="file-item-info">
      <div class="date">
        <div style="display: flex;">
          <div class="title" @click="toDetails(page,menu)">
            {{ cartList.title.length > 12 ?  cartList.title.slice(0,11) + '...' : cartList.title  }}
          </div>
          <div class="z">正</div>
          <div class="main50 flex-col">
            <span class="txt31">商</span>
          </div>
        </div>
        <div class="price">
          <div style="display: flex;justify-content: space-between;">
            <div style=" display: flex;width: 50%;align-items: center;">
              <div class="section32 flex-col"></div>
              {{ cartList.price }}
              <div class="cost">原价：99</div>
            </div>
            <div class="sales">已售{{ cartList.sales }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {secondToDate, formatSize} from "@/utils/tool.js"
import {ref} from "vue";
const router = useRouter();
//跳转详情页
const page = 'video'
const menu = 'index'
const toDetails = (page,menu) => {
  router.push({
    path:'details',
    query:{
      page:page,
      menu:menu
    }
  })
}

const cartList = ref({
  title: '科技简介企业风板块分类',
  price: '0.1',
  sales: '300+',
})
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
  layoutType: {
    type: String,
    default: 'crad'
  }
})

// 鼠标移动时计算雪碧图
const offsetY = ref(0);
const viewWidth = ref(0);
const viewHeight = ref(0);
const percentage = ref(0);
const handleMouseMoveVideo = (e) => {
  const spriteImageInfo = JSON.parse(props.data.spriteImageInfo || '{}');
  const imageWidth = spriteImageInfo.width || 240;    //雪碧图每一帧的宽度
  const imageHeight = spriteImageInfo.height || 6750; //雪碧图每一帧的高度
  const offsetX = e.offsetX;
  const offsetWidth = e.target.getBoundingClientRect().width.toFixed(2); //展示窗口宽度
  const offsetHeight = e.target.getBoundingClientRect().height.toFixed(2); //展示窗口高度
  const imageScale = imageWidth / imageHeight;
  const offsetScale = offsetWidth / offsetHeight;
  if (imageScale > offsetScale) {
    viewWidth.value = offsetWidth;
    viewHeight.value = viewWidth.value / imageScale;
  } else {
    viewHeight.value = offsetHeight;
    viewWidth.value = imageScale * viewHeight.value;
  }

  const N = 100; //数量
  const NS = offsetWidth / N;
  const steep = offsetWidth / 100;
  offsetY.value = viewHeight.value * Math.round(offsetX / NS);
  percentage.value = offsetX / steep; //得到当前进度
};

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>