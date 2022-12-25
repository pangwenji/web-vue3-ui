<template>
  <div class="main-card-broad">
    <div>
      <div class="try-text button-text">
        当前仅提供30s试听片段，如您觉得满意，可解锁下载完整版
      </div>
      <div class="play-button">
        <div style="z-index: 99;height: 38px;cursor: pointer" @click="play">
          <el-image style="width: 38px" :src="isPlay?playImg:pause"></el-image>
        </div>
        <div class="play-rl">
          <div class="play-name">{{ audioName }}</div>
          <div class="play-time">{{ getStringTime(currentPlaybackProgress) }} / {{ getStringTime(audioLength) }}</div>
        </div>
      </div>
      <div class="audio-play">
        <div class="sound-reserved">
          <div class="sound-m2">
            <div class="sound-text">
              <div class="text">人声</div>
              <volume-progress-bar @volume="vocalVolume" ref="renVolume"/>
            </div>
            <div style="flex: 1; position: relative">
              <div :style="{backgroundImage:`url('${audioBg}')`}" class="audio-bg"
                   style="background-color: #24294F"></div>
              <div class="audio-ren" ref="audioChart1" @click="renClick" style="width: 20%;margin-left: 100px;">
                <div class="progressBar" ref="progressBar"></div>
              </div>
            </div>
          </div>
<!--          <div style="cursor: pointer;margin-left: 10px"-->
<!--               @click="thisDownloadFile(file.sourceFileVOList[0].downloadUrl,file.sourceFileVOList[0].filename)">-->
<!--            <el-image style="width: 52px;height: 52px;" :src="downDep1? downDp:down" @mouseenter="downDep1=true" @mouseleave="downDep1=false"></el-image>-->
<!--          </div>-->
        </div>

        <div class="sound-reserved" style="margin-top: 20px">
          <div class="sound-m2">
            <div class="sound-text">
              <div class="text">伴奏</div>
              <volume-progress-bar @volume="accompanimentVolume"/>
            </div>
            <div style="flex: 1; position: relative">
              <div :style="{backgroundImage:`url('${audioBg}')`}" class="audio-bg bg-color"></div>
              <div class="audio-ren" style="background-color: #213B41;width: 20%;margin-left: 100px"
                   @click="accompanClick"
                   ref="audioChart2"></div>
            </div>
          </div>
<!--          <div style="cursor: pointer;margin-left: 10px"-->
<!--               @click="thisDownloadFile(file.sourceFileVOList[1].downloadUrl,file.sourceFileVOList[1].filename)">-->
<!--            <el-image style="width: 52px;height: 52px;" :src="downDep? downDp:down" @mouseenter="downDep=true" @mouseleave="downDep=false"></el-image>-->
<!--          </div>-->
        </div>
      </div>
      <div style="text-align: center;margin-bottom: 30px">
        <div class="button-operating">
          <el-button class="next-bt" @click="fullVersion">
            <el-image :src="unlock" style="margin-right: 8px;"></el-image>
            解锁完整版
          </el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>


import {onMounted, ref, defineExpose, computed} from 'vue'
import {scale} from '../../dragUtils'
import WaveSurfer from 'wavesurfer.js'
import {download} from "@/utils/request"; //导入wavesurfer.js
import down from '@/assets/tool/down.png'
import downDp from '@/assets/tool/downClick.png'
import unlock from '@/assets/tool/unlock.png'

import pause from '@/assets/tool/pause.png'
import playImg from '@/assets/tool/playImg.png'
import audioBg from '@/assets/tool/autiobg.png'
import transform from '@/assets/tool/transform.png'
import VolumeProgressBar from '../VolumeProgressBar'
import {downloadFile} from "@/utils/tool";
import {requestBlob} from "../../utils/audioVideoUtils";
const value = ref('')
const downDep=ref(false)
const downDep1=ref(false)

const audioChart1 = ref(null)
const audioChart2 = ref(null)
const progressBar = ref(null)
const renVolume = ref(null)
let wavesurfer1 = ref('')
let wavesurfer2 = ref('')
let audioLength = ref(0);
let audioName = ref('')
const currentPlaybackProgress = ref(0)
let volume = ref(100)
const isPlay = ref(false)
const props = defineProps({
  file: {
    type: Object,
    default: {
      name: "孤勇者.mp4",
      size: 4097047,
      fileUrl: ''
    },
  },
  showDown: {
    type: Boolean,
    default: false,
  }
})
let width = 1;
const emit = defineEmits(['close', 'play', 'fullVersion'])
const drawPlay = (file) => {
  audioName.value = file.sourceFileVO.filename
  // audioSize.value = file.size
  wavesurfer1 = WaveSurfer.create({
    container: audioChart1.value,//容器
    waveColor: '#c8eaef',//波形图颜色
    progressColor: '#d9f2f6',//进度条颜色
    backend: 'MediaElement',
    mediaControls: false,
    audioRate: '1',//播放音频的速度
    height: 52,
    //插件
    plugins: [],
    scrollParent: false,
    hideScrollbar: true,
    responsive: true,
  });
  requestBlob(file.sourceFileVOList[0]?.downloadUrl).then(res=>{
    wavesurfer1.load(res);
  })

  wavesurfer2 = WaveSurfer.create({
    container: audioChart2.value,//容器
    waveColor: '#c8eaef',//波形图颜色
    progressColor: '#d9f2f6',//进度条颜色
    backend: 'MediaElement',
    mediaControls: false,
    audioRate: '1',//播放音频的速度
    height: 52,
    //插件
    plugins: [],
    scrollParent: false,
    hideScrollbar: true,
    responsive: true,
  });

  requestBlob(file.sourceFileVOList[1]?.downloadUrl).then(res=>{
    wavesurfer2.load(res);
  })

  wavesurfer1.on('audioprocess', function (e) {
    if (!audioChart1.value){
      return;
    }
    let width1 = audioChart1.value?.offsetWidth
    if (!progressBar.value){
      return;
    }
    progressBar.value.style.left = (e / audioLength.value * width1) + 'px';
    currentPlaybackProgress.value = Math.round(e)
  });

  wavesurfer1.on('finish', function (e) {
    isPlay.value = false;
  });
}


const getStringTime = (time) => {
  let minute = parseInt(time / 60)
  if (minute < 10) {
    minute = '0' + minute
  }
  let second = parseInt(time % 60)
  if (second < 10) {
    second = '0' + second
  }
  return minute + ':' + second
}

onMounted(() => {
  if (props.file.sourceFileVO) {
    drawPlay(props.file)
    wavesurfer1.on("ready", function () {
      audioLength.value = wavesurfer1.getDuration();
      if (audioChart1.value){
        width = audioChart1.value.offsetWidth;
      }
      initDrag()
    });
  }
})

const initDrag = () => {
  let start = 0;
  renVolume.value.muteX();
  scale("yp", progressBar.value, audioChart1.value, audioChart1.value, (pos, x, step, mw, name) => {
    if (name === "yp") {
      if (!progressBar.value){
        return;
      }
      wavesurfer1.pause(); //切换播放，应用播放或暂停
      wavesurfer2.pause(); //切换播放，应用播放或暂停
      isPlay.value = false;
      progressBar.value.style.left = x + "px";
      start = x / mw * audioLength.value;
    }
  }, (name) => {
    if (name === "yp") {
      wavesurfer1.play(start); //切换播放，应用播放或暂停
      wavesurfer2.play(start); //切换播放，应用播放或暂停
      isPlay.value = true;
    }
  })
}
const getFile = computed(() => {
  return props.file
})

watch(getFile, (newValue) => {
  if (!wavesurfer1) {
    if (newValue.sourceFileVO) {
      drawPlay(newValue)
      wavesurfer1.on("ready", function () {
        audioLength.value = wavesurfer1.getDuration()
        initDrag()
      });
    }
  }
})
const vocalVolume = (v) => {
  if (wavesurfer1) {
    wavesurfer1.setVolume(v)
  }
}

const accompanimentVolume = (v) => {
  if (wavesurfer2) {
    wavesurfer2.setVolume(v)
  }
}
const play = () => {
  wavesurfer1.playPause(); //切换播放，应用播放或暂停
  wavesurfer2.playPause(); //切换播放，应用播放或暂停
  // emit('play')
  isPlay.value = !isPlay.value
}

const close = () => {
  emit('close')
}

const thisDownloadFile = (url, name) => {
  downloadFile(url, name);
}

const renClick = (e) => {
  if (!audioChart1.value){
    return;
  }
  if (!progressBar.value){
    return;
  }
  // 获取当前前进位置
  const x = e.clientX
  const dl = audioChart1.value.getBoundingClientRect().left
  let thisX = x - dl;
  // 进度条长度 100
  // 音频长度20
  // 当前点击长度 50
  // 求音乐进度
  progressBar.value.style.left = thisX + 'px';
  let start = thisX / audioChart1.value.offsetWidth * audioLength.value;
  wavesurfer1.play(start); //切换播放，应用播放或暂停
  wavesurfer2.play(start); //切换播放，应用播放或暂停
  isPlay.value = true;
}

const accompanClick = (e) => {
  if (!audioChart1.value){
    return;
  }
  if (!progressBar.value){
    return;
  }
  // 获取当前前进位置
  const x = e.clientX
  const dl = audioChart2.value.getBoundingClientRect().left
  let thisX = x - dl;
  progressBar.value.style.left = thisX + 'px';
  let start = thisX / audioChart1.value.offsetWidth * audioLength.value;
  wavesurfer1.play(start); //切换播放，应用播放或暂停
  wavesurfer2.play(start); //切换播放，应用播放或暂停
  isPlay.value = true;
}

/**
 * 转换下一首
 */
const fullVersion = () => {
  emit("fullVersion")
}

</script>
<style scoped lang="scss">
.main-card-broad {
  color: #FFFFFF;
}

.sound-reserved {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 10px;

  .sound-m2 {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sound-text {
      background-color: #30323B;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 1px 20px;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
    }

    .audio-ren {
      position: relative;
      flex: 1;
      background: #24294F;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }

    .audio-ren::-webkit-scrollbar {
      display: none;
    }

    wave::-webkit-scrollbar {
      display: none;
    }

    .progressBar {
      position: absolute;
      width: 2px;
      height: 150px;
      background: #3468FE;
      border-radius: 100px;
      z-index: 10;
      transform: translateY(-8px);

      &:after {
        content: '●';
        width: 15px;
        height: 15px;
        background: linear-gradient(180deg, rgba(117, 235, 255, 0.9100) 0%, rgba(124, 181, 236, 0.9100) 100%);
        border-radius: 8px;
        border: 1px solid #3468FE;
        position: absolute;
        top: -12px;
        left: -6px;
        color: #3468FE;
        text-align: center;
        line-height: 12px;
      }
    }
  }
}

.play-button {
  margin-bottom: 46px;
  display: flex;
  align-items: center;

  .play-rl {
    border-radius: 23px;
    padding: 5px 40px 5px 49px;
    transform: translateX(-42px) translateY(0px);
    background: #30323B;
  }

  .play-time {
    font-size: 13px;
    font-weight: 400;
    color: #8D91A3;
    margin-top: 2px;
  }

  .play-name {
    font-size: 14px;
    font-weight: 400;
    color: #E1E1E1;
  }
}

.button-text {
  margin-top: 46px;
  font-size: 14px;
  font-weight: 400;
  color: #4E5262;
  line-height: 20px;
}

.button-operating {
  margin-top: 38px;

  .next-bt {
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    border: none;
    width: 200px;
    height: 50px;
    background: #3468FE;
    border-radius: 25px;
  }

  .other-bt {
    width: 243px;
    height: 52px;
    background: rgba(52, 104, 254, 0.1300);
    border-radius: 10px;
    font-size: 16px;
    font-weight: 400;
    color: #6B8FF8;
    line-height: 22px;
    border: none;
  }
}

.audio-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-repeat-y: no-repeat;
  background-position: 1px center;
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
}

.bg-color {
  background-color: #213B41;
}

:deep(wave) {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none;
  }
}
.try-text{
  margin-top: 50px;
  margin-bottom: 10px;
  margin-left: 15px;
}
</style>
