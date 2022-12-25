<template>
    <!--  sound-->
    <div class="card" v-if="detail.typeId == 1 || detail.typeId == 2 ">
      <div class="card-main" style=" padding-top: 55px; padding-bottom:40px;">
        <div class="main-top" @click.stop="toPlay">
          <div style="border-radius: 50%;">
            <div class="cdBox">
              <img :src="CD" class="cd" ref="cd">
              <img :src="CD1" class="cd1" ref="cd1">
              <img :src="CD2" class="cd2">
              <img :src="detail.coverUrl" class="cdCover" ref="cd3">
            </div>
          </div>
        </div>
        <div class="main-bottom">
          <div style="width:50px" @click.stop="toPlay">
            <img :src="isPlay?bluePlay2:bluePlay">
          </div>
          <template v-if="detail.fileAttachedInfoDto">
            <WaveForm
                :audioWave="detail.fileAttachedInfoDto.audioWave || []"
                :canvasHeight="60"
                :shapeHeight="60"
                :waveStep="4"
                :progressColor="'#79a5fc'"
                :duration="detail.metaData?.Duration || 0"
                :playPercent="playPercent"
                :waveWidth="2"
                @onPlayPercent="handlePlayPercent"
            ></WaveForm>
          </template>

          <div class="time-text">
            {{ secondToDate(currentTime) }} / {{ secondToDate(detail.metaData?.Duration || 0) }}
          </div>
        </div>
      </div>
      <div
          class="play-box"
          style="display: none">
        <video
            :id="'player-container-id' + detail.id"
            preload="auto"
            playsinline
            webkit-playsinline
        ></video>
      </div>
    </div>

    <!--  工程、资源包、图片（最多5张图片可切换）-->
    <div class="card image-box" v-else-if="detail.typeId === 3 || detail.typeId === 4">
      <img style="width:150px;height:150px;" :src="detail.coverUrl" v-if="!detail.coverFileAttachedInfoDtos && (detail.typeId === 3|| detail.typeId === 4)">

      <div class="flex" style="height: 100%" v-else>
        <template v-if="detail.coverFileAttachedInfoDtos.length > 1">
          <div class="pjCover">
            <el-image :src="thisImages ? thisImages : detail.coverFileAttachedInfoDtos[0]?.previewUrl" fit="contain" ></el-image>
          </div>
          <div class="image-list">
            <div :class="[thisImagesId===i?'is-image-activate':'']"
                 v-for="(img,i) in detail.coverFileAttachedInfoDtos" :key="i"
                 class="sImg flex"
                 @click="changeImage(img,i)">
              <el-image :src="img.cover" style="height: 72px;width: 128px"></el-image>
            </div>
          </div>
        </template>
        <!--          只有一张封面时-->
        <template v-else>
          <el-image :src="detail.coverFileAttachedInfoDtos[0].previewUrl" :preview-src-list="[detail.coverFileAttachedInfoDtos[0].previewUrl]" fit="contain"> </el-image>
        </template>
      </div>
    </div>

    <!--  video-->
    <div class="card video-box" v-else-if="detail.typeId === 5">
      <div class="video-main">
        <video
            :src="videoUrl"
            class="video"
            controls
            autoplay>
        </video>
      </div>
    </div>

    <div class="card image-box" v-else-if="detail.typeId === 6">
      <div style="display: contents;">
        <el-image style="max-width: 90%;background: white;width: auto;" fit="scale-down" :src="detail.queryPixAbayMaterialVO.largeImageUrl" :preview-src-list="[detail.queryPixAbayMaterialVO.largeImageUrl]"></el-image>
      </div>
    </div>

    <div class="bottom" v-if="detail.details">
      <div class="btm">
        <div v-html="detail.details" class="html" id="html"></div>
      </div>
    </div>
</template>

<script setup>
import CD from '@/assets/material/newCD.png'
import CD1 from '@/assets/material/newCD-.png'
import CD2 from '@/assets/material/newCDo.png'
import logo from '@/assets/logo/logo.png'
import bluePlay from '@/assets/material/bluePlay.png'
import bluePlay2 from '@/assets/material/icon_suspend2.png'
import frequency from '@/assets/material/frequency.png'
import WaveForm from '@/components/WaveForm'
import {onMounted, ref, watch} from "vue";
import {secondToDate} from '@/utils/tool.js';
import {addRecord, getTypeOption} from "../../../api/material";

const props = defineProps({
  detail: {
    type: Object,
    default: {}
  }
})

const playPercent = ref(0) // 播放百分比
const player = ref(null)
const playerDuration = ref(0) // 长度
const isPlay = ref(false);

onMounted(() => {
  if (props.detail.typeId === 5) {
    // playerInit()
  }
})

onUnmounted(() => {
  if (player.value !== null) {
    player.value.dispose();
    player.value = null;
  }
})


const videoUrl = ref('')
const imageUrlList = ref([])
watch(() => props.detail, val => {
  if (props.detail && props.detail.typeId === 5) {
    let videoInfo = JSON.parse(props.detail.queryPixAbayMaterialVO.videos)
    videoUrl.value = videoInfo.large.url
  }
}, {deep: true, immediate: true})

const typeTabData = ref([])
const typeName = ref('')

function getTabList() {
  getTypeOption().then((res) => {
    typeTabData.value = res.data
    const d = res.data.find((item) => {
      return item.typeId === props.detail.typeId
    })
    typeName.value = d.typeName
  })
}

getTabList()

//切换图片
const thisImagesId = ref(0);
const thisImages = ref('');

function changeImage(item, index) {
  thisImagesId.value = index;
  thisImages.value = item.previewUrl;
}

// 播放音乐
const toPlay = () => {
  if (player.value === null) {
    playerInit();
  } else {
    playPause();
  }
};

const cd = ref()
const cd1 = ref()
const cd3 = ref(null)

function playerInit(percent) {
  if (props.detail.fileAttachedInfoDto.sign?.dataFormat === 'kodo') {
    const url = props.detail.fileAttachedInfoDto.sign.list[0].key
    player.value = TCPlayer('player-container-id' + props.detail.id, {}); // player-container-id 为播放器容器 ID，必须与 html 中一致
    player.value.src(url); // url 播放地址
  } else {
    const playOptions = {
      fileID: props.detail.fileAttachedInfoDto.sign?.fileId,
      appID: props.detail.fileAttachedInfoDto.sign?.appId,
      psign: props.detail.fileAttachedInfoDto.sign?.sign,
    };
    player.value = TCPlayer('player-container-id' + props.detail.id, playOptions);
  }
  player.value.one('canplay', () => {
    console.log('canplay');
    playerDuration.value = player.value.duration();
    if (props.detail.typeId === 5) {
      // 初始化首帧
      player.value.play();
      setTimeout(() => {
        player.value.pause();
      }, 0);
    } else {
      player.value.currentTime((playerDuration.value * percent) / 100);
      playPause();
    }
  });
  player.value.on('play', function () {
    isPlay.value = true;
    if (props.detail.typeId === 1 || props.detail.typeId === 2) {
      cd.value.style.animation = 'rotate 2.5s linear infinite'
      if (cd3.value) {
        cd3.value.style.animation = 'rotate 2.5s linear infinite'
      }
      cd1.value.style.transition = 'all 1s linear'
      cd1.value.style.transform = 'rotate(-3deg)'
      cd1.value.style.top = '12px'
      cd1.value.style.right = '-37px'
    }
    addPlayRecord()
    console.log('play');
  });
  player.value.on('pause', function () {
    isPlay.value = false;
    if (props.detail.typeId === 1 || props.detail.typeId === 2) {
      cd.value.style.animationPlayState = 'paused'
      if (cd3.value) {
        cd3.value.style.animationPlayState = 'paused'
      }
      cd1.value.style.transform = 'rotate(-30deg)'
      cd1.value.style.top = '11px'
      cd1.value.style.right = '-32px'
    }
    console.log('pause');
  });
  player.value.on('timeupdate', () => {
    onTimeChange();
  });
  player.value.on('error', function (e) {
    console.log('---error---', e);
  });
}

const mpId = ref()

//添加播放记录
function addPlayRecord() {
  if (mpId.value !== props.detail.id) {
    addRecord({materialId: props.detail.id}).then(res => {
    })
    mpId.value = props.detail.id
  }
}

// 播放暂停
function playPause() {
  if (!isPlay.value) {
    player.value.play();
  } else {
    player.value.pause();
  }
}

function handlePlayPercent(per) {
  playPercent.value = per;
  if (player.value === null) {
    playerInit(per);
  } else {
    player.value.currentTime((playerDuration.value * per) / 100);
    player.value.play();
  }
}

const currentTime = ref("00.00")

function onTimeChange() {
  currentTime.value = player.value?.currentTime();
  let percent = currentTime.value / playerDuration.value;
  playPercent.value = percent * 100;
}

</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  //min-width: 680px;
  min-height: 460px;
  //height: 560px;
  //max-height: 480px;
  background: #111216;
  border-radius: 10px;
  //backdrop-filter: blur(0px);
  display: flex;
  justify-content: center;
  align-items: center;

  .card-main {
    width: 100%;
    height: 100%;

    .main-top {
      display: flex;
      justify-content: center;
      align-items: center;

      .cdBox {
        width: 200px;
        height: 200px;
        background: rgba(16, 17, 20, 0.72);
        //border: 2px solid rgba(45, 46, 56, 1);
        border-radius: 50%;
        //border-image: linear-gradient(150deg, rgba(47, 49, 61, 1), rgba(45, 46, 56, 1)) 2 2;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .cd {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;

        }

        .cd1 {
          position: absolute;
          width: 85px;
          height: 135px;
          position: absolute;
          z-index: 99;
          transform-origin: right top;
          transform: rotate(-30deg);
          top: 11px;
          right: -32px;
        }

        .cd2 {
          width: 40px;
          height: 40px;
          position: absolute;
          top: 0;
          right: -50px;
        }
      }

    }

    .main-bottom {
      padding: 0 20px;
      margin-top: 48px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .time-text {
        min-width: 155px;
        padding: 0 10px;
        margin-left: 13px;
        font-size: 18px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 22px;
      }

    }

  }
}

.video-box {
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100% !important;
  // height: 90%!important;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  .tcplayer {
    width: 100% !important;
    max-height: 480px;
    //height: 100% !important;
    background-color: #111216;
  }

  .video-main {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    height: -webkit-fill-available;

    .video {
      width: 100%;
      height: 100%;
      object-fit: fill
    }
  }
}

.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  height: 60%;
  max-height: 80%;
}

.el-image {
  width: 100%;
  height: 100%;
  //max-height: 480px;

  :deep(.el-image__preview) {
    //max-height: 480px !important;
  }

  :deep(.el-image__inner) {
    //max-height: 315px;
  }
}

.bottom {
  margin-top: 20px;
  padding: 32px;
  //height: 330px;
  background: #111216;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 21px;

  .btm {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.48);
    line-height: 20px;

    .html {
      :deep(img) {
        width: 100%;
      }
    }
  }
}

.cdCover {
  z-index: 9;
  width: 50px;
  height: 50px;
  border-radius: 25px;
}

.flex {

  display: flex;
  flex-direction: column;
  align-items: center;

}

.pjCover {
  max-width: 560px;
  max-height: 315px;
  //min-width: 560px;
  min-height: 315px;
  display: flex;
  align-items: center;
}

.image-list {
  margin: 20px auto 0px;
  padding: 6px;
  background-color: #24262f;
  border-radius: 5px;
  display: flex;
  justify-content: space-around;

}

.sImg {
  margin: 0px 8px;
  border: 1px solid;
}

.is-image-activate {
  border: #20a0ff 1px solid;
}

:deep(h1) {
  font-size: 25px !important;
}

:deep(p) {
  word-wrap: break-word
}
</style>
