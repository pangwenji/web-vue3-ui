<template>
  <div>
    <div id="waterfall" ref="waterfall" class="waterfall">
      <div class="image-item" :style="list.style" v-for="list in dataList" :key="list.id">
        <div class="video-time">
          <div>{{ list.dpi }} {{ secondToDate(list.material.queryPixAbayMaterialVO?.duration) || '00:00' }}</div>
        </div>
        <div class="image-cell" :style="list.parentStyle">
          <div class="image-collect" @click.stop="collectMaterial(list)">
            <img :src=" !list.material.collection?onShou:toShou" alt="素材图片">
          </div>
          <div class="image-content" @click="toDetails(list.material.id)">
            <img :src="list.material.queryPixAbayMaterialVO?.webformatUrl" @load="list.load = true"
                 :class="{'cover-img': list.material.queryPixAbayMaterialVO.spriteImageUrl}">
            <div class="file-item-cover file-item-video" @mousemove="handleMouseMoveVideo($event,list)">
              <div class="sprite" :style="{ width: `${list.viewWidth}px`, height: `${list.viewHeight}px`,
                          'background-image': 'url(' + list.material.queryPixAbayMaterialVO.spriteImageUrl + ')',
                          'background-position-y': '-' + String(list.offsetY) + 'px', }"></div>
            </div>
            <div class="progress" v-if="list.material.queryPixAbayMaterialVO.spriteImageUrl">
              <div :style="{ width: String(list.percentage) + '%' }" class="progress-outer"></div>
            </div>
            <div class="card-btm-tag"><span v-for="tag in list.material.queryPixAbayMaterialVO?.tags.split(',')">{{tag}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {watch} from "vue";
import {onMounted} from "vue";
import {ref} from "vue";
import toShou from '@/assets/material/materialMain/icon_shoucang_to.png'
import onShou from '@/assets/material/materialMain/icon_shoucang_no.png'
import {addCollection, deleteCollection} from "@/api/material/collection";
import noInterest from '@/assets/material/icon_interest.png';
import shoucang from '@/assets/material/materialMain/icon_shoucang_to.png';
import noShoucang from '@/assets/material/materialMain/icon_shoucang_no.png';
import {secondToDate} from '@/utils/tool';

const router = useRouter();
const props = defineProps({
  materialList: {
    type: Array,
    default: [],
  },
})
const emits = defineEmits(['onCandelCollect'])
const dataList = ref([]);
onMounted(() => {
  watch(() => props.materialList, newVal => {
    if (props.materialList) {
      dataList.value = []
      addImage()
    }
  })
  dataList.value = []
  addImage()
})

const addImage = () => {
  props.materialList?.forEach(res => {
    appendImage(res)
  })
}


const waterfall = ref();
const imageHeight = 180;

/**
 * 收藏
 * @param row
 */
function collectMaterial(row) {
  deleteCollection({id: row.material.id}).then(res => {
    emits('onCandelCollect', row)
  })
}

/**
 * 获取瀑布流参数
 * @param row
 */
let maxWidth = 400;
let maxHeight = 300;
const videoMaxWidth = 500
const videoMaxHeight = 400
function appendImage(row) {
  if (row.material.typeId !== 5) {
    return;
  }
  row.style = {}
  row.parentStyle = {}
  let width = row.material.queryPixAbayMaterialVO.webformatWidth;
  let height = row.material.queryPixAbayMaterialVO.webformatHeight;
  if (height <= 300) { //设置阈值小于这个值将宽高放大 300px
    height = height + 300;
    width = (width / row.material.queryPixAbayMaterialVO.webformatHeight) * height;

  }else if(width > videoMaxWidth){
    height = ( videoMaxWidth / width) * height;
    width = videoMaxWidth
  }else if(height > videoMaxHeight){
    width = (videoMaxHeight / height) * width;
    height = videoMaxHeight
  }
  const scaleWidth = (width / height) * imageHeight; //获取外边框高度为200的宽度
  row.style.flexBasis = scaleWidth + 'px';
  row.style.maxWidth = width + 'px';
  // row.style.maxWidth =  '500px';
  row.parentStyle.paddingTop = ((height / width) * 100) + '%';
  // console.log('height / width',height,width)
  row.style.flexGrow = width / height;
  row.style.flexShrink = width / height;
//分辨率HK/4D计算
  const videosInfo = JSON.parse(row.material.queryPixAbayMaterialVO.videos || '{}')
  let wd = parseInt(videosInfo.large.height) * parseInt(videosInfo.large.width)
  if (wd === 2160 * 3840 || wd > 2160 * 3840) {
    row.dpi = '4K'
  } else {
    row.dpi = 'HD'
  }

  dataList.value.push(row);
}

//跳转详情页
const toDetails = (id) => {
  router.push({
    path: `details/` + id,
  });
};

// 鼠标移动时计算雪碧图
// const offsetY = ref(0);
// const viewWidth = ref(0);
// const viewHeight = ref(0);
// const percentage = ref(0);
const handleMouseMoveVideo = (e, row) => {
  const imageWidth = row.material.queryPixAbayMaterialVO.spriteImageWidth || 240; //雪碧图每一帧的宽度
  const imageHeight = row.material.queryPixAbayMaterialVO.spriteImageHeight || 6750; //雪碧图每一帧的高度
  const offsetX = e.offsetX;
  const offsetWidth = e.target.getBoundingClientRect().width.toFixed(2); //展示窗口宽度
  const offsetHeight = e.target.getBoundingClientRect().height.toFixed(2); //展示窗口高度
  const imageScale = imageWidth / imageHeight;
  const offsetScale = offsetWidth / offsetHeight;
  if (imageScale > offsetScale) {
    row.viewWidth = offsetWidth;
    row.viewHeight = row.viewWidth / imageScale;
  } else {
    row.viewHeight = offsetHeight;
    row.viewWidth = imageScale * row.viewHeight;
  }

  const N = 100; //数量
  const NS = offsetWidth / N;
  const steep = offsetWidth / 100;
  row.offsetY = row.viewHeight * Math.round(offsetX / NS);
  row.percentage = offsetX / steep; //得到当前进度
}

</script>

<style lang="scss" scoped>


.waterfall {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  //align-items: center;
  align-items: flex-start;
  position: relative;
  //height: 100%;
  padding-bottom: 10px;
  &::after {
    content: "";
    flex-grow: 99999; /* 属性值可以给大点 */
  }
  .image-collect {
    position: absolute;
    right: 10px;
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    z-index: 2;
    background-size: cover;
    cursor: pointer;
    display: flex;
    top: -30px;
    transition: top .3s ease;
  }
  .card-btm-tag{
    color: rgba(255, 255, 255, 0.77);
    bottom: -25px;
    background: linear-gradient(0deg,rgba(0,0,0,.6) 0,transparent);
    //bottom: 15px;
    left: 0px;
    position: absolute;
    z-index: 3;
    transition: bottom .3s ease;
    height: 30px;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    width: 100%;
    padding-left: 10px;
    span{
      padding: 3px;
    }
  }

  .video-time {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 2;
    color: #FFFFFF;
    font-size: 14px;
    background-size: cover;
  }


  :deep(.image-item) {
    flex: auto;
    margin: 2px;
    /* flex-basis: 100px; */
    max-width: 380px;
    overflow: hidden;
    /* background: red; */
    position: relative;
    // height: 200px;

    .image-cell {
      width: 100%;
      line-height: 0;
      position: relative;

      &:hover {
        .image-collect {
          top: 10px;
        }
        .card-btm-tag{
          bottom: 0px;
          left: 0px;
          padding-bottom: 5px;
        }
      }
    }

    .image-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      align-items: center;
      // height: 200px;
      * {
        pointer-events: none;
      }

      .file-item-cover {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        pointer-events: auto;
        user-select: auto;
        cursor: pointer;
        position: absolute;
        * {
          pointer-events: none;
          user-select: none;
        }

        .sprite {
          background-repeat: no-repeat;
          background-size: 100% auto;
          width: 100%;
          height: 100%;
        }

      }

      .progress {
        position: absolute;
        bottom: 6px;
        height: 2px;
        width: 95%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba($color: #ffffff, $alpha: 0.2);
        pointer-events: none;
        display: none;

        .progress-outer {
          width: 100%;
          height: 100%;
          background: rgba($color: #ffffff, $alpha: 0.6);
        }
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
        padding: 3px;

      }

      &:hover {
        //transform:scale(1.03);
        //transition:all .3s linear;
        cursor: pointer;

        .cover-img {
          display: none;
        }

        .progress {
          display: block;
        }
      }
    }
  }
}


.file-item-card {
  width: 100%;
  height: 100%;
  position: relative;

  .file-item-content {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    overflow: hidden;
    cursor: pointer;
    color: #ffffff;
    background-color: #111216;;

    .check-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      top: 0;
      left: 0;
    }

    .file-item-cover {
      width: 100%;
      height: 67%;
      position: relative;
      background: #1c1d24;
      pointer-events: none;
      user-select: none;
      border-radius: 10px 10px 0px 0px;
      overflow: hidden;
      // background: #000;
      &.file-item-video {
        position: relative;
        font-size: 12px;
        color: white;
        background: black;
        cursor: pointer;
        pointer-events: auto;
        user-select: auto;
        display: flex;
        align-items: center;
        background-repeat: no-repeat;
        justify-content: center;
        // background-position: 0px 4% ;
        height: 200px;

        * {
          pointer-events: none;
          user-select: none;
        }

        .sprite {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 100% auto;
        }

        &:hover {
          & .cover {
            display: none;
          }

          & .time {
            display: none;
          }

          & .play {
            display: none;
          }

          & .progress {
            display: block;
          }
        }

        .cover {
          width: 100%;
          height: 100%;
          position: absolute;
          bottom: 0px;
          left: 0px;
          top: 0;
          background-repeat: no-repeat;
          background-size: 100% auto;
        }

        .progress {
          position: absolute;
          bottom: 6px;
          height: 2px;
          width: 95%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba($color: #ffffff, $alpha: 0.2);
          pointer-events: none;
          display: none;

          .progress-outer {
            width: 100%;
            height: 100%;
            background: rgba($color: #ffffff, $alpha: 0.6);
          }
        }

        .play {
          font-size: 30px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          user-select: none;
          pointer-events: none;
        }
      }
    }
  }
}
</style>
