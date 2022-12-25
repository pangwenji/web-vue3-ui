<template>
  <div class="main-card-broad">
    <div>
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
              <div class="text">{{ oneLabel }}</div>
              <volume-progress-bar @volume="vocalVolume" ref="renVolume"/>
            </div>
            <div class="audio-ren" ref="audioChart1" @click="renClick">
              <div class="progressBar" ref="progressBar">
                <div class="text-time">{{ getStringTime(currentPlaybackProgress) }}</div>
              </div>
            </div>
          </div>
          <div
              v-if="showDown"
              style="display:flex; align-items: center;margin: 0 20px"
          >
            <div class="down-text" style="cursor: not-allowed;color: gray">
              <el-tooltip content="开发中" placement="bottom" effect="light">
                储存至云盘
              </el-tooltip>
            </div>
            <div class="down-text"
                 style="margin-left: 20px"
                 @click="downloadFile(file.sourceFileVOList[0].downloadUrl,file.sourceFileVOList[0].filename)">
              下载
            </div>
          </div>
        </div>

        <div class="sound-reserved" style="margin-top: 20px">
          <div class="sound-m2">
            <div class="sound-text">
              <div class="text">{{ twoLabel }}</div>
              <volume-progress-bar @volume="accompanimentVolume"/>
            </div>
            <div class="audio-ren" style="background-color: #213B41"
                 @click="accompanClick"
                 ref="audioChart2"></div>
          </div>
          <div
              v-if="showDown"
              style="display:flex; align-items: center;margin: 0 20px">
            <div class="down-text" style="cursor: not-allowed;color: gray">
              <el-tooltip content="开发中" placement="bottom" effect="light">
                储存至云盘
              </el-tooltip>
            </div>
            <div class="down-text"
                 style="margin-left: 20px"
                 @click="downloadFile(file.sourceFileVOList[1].downloadUrl,file.sourceFileVOList[1].filename)">
              下载
            </div>
          </div>
        </div>
      </div>
      <slot>
        <div style="text-align: center" class="btn-close">
          <!--          <div class="button-text">已转换完整版</div>-->
          <!--          <div class="button-operating">-->
          <!--            <el-button class="next-bt" @click="nextOther">转换下一首</el-button>-->
          <!--            <el-button class="other-bt" @click="completeOrder">处理完的订单</el-button>-->
          <!--          </div>-->
        </div>
      </slot>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref, defineExpose, computed} from 'vue'
import {scale} from '../../dragUtils'

const value = ref('')
import WaveSurfer from 'wavesurfer.js'
import {download} from "@/utils/request"; //导入wavesurfer.js
import down from '@/assets/tool/down.png'
import downDp from '@/assets/tool/downClick.png'
import pause from '@/assets/tool/pause.png'
import playImg from '@/assets/tool/playImg.png'
import VolumeProgressBar from '../VolumeProgressBar'
import {requestBlob} from "../../utils/audioVideoUtils";

const downDep = ref(false)
const downDep1 = ref(false)
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
  },
  oneLabel: {
    type: String,
    default: "人声"
  },
  twoLabel: {
    type: String,
    default: "伴奏"
  },
  isMap: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['close', 'play', 'nextOther'])
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
    minPxPerSec: 1,
  });
  requestBlob(file.sourceFileVOList[0]?.downloadUrl).then(res=>{
    wavesurfer1.load(res);
  })
  // wavesurfer1.load(file.sourceFileVOList[0]?.downloadUrl);
  wavesurfer2 = WaveSurfer.create({
    container: audioChart2.value,//容器
    waveColor: '#c8eaef',//波形图颜色
    progressColor: '#d9f2f6',//进度条颜色
    backend: 'MediaElement',
    mediaControls: false,
    audioRate: '1',//播放音频的速度
    height: 52,
    minPxPerSec: 1,
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
      initDrag()
    });
  }
})

const initDrag = () => {
  let start = 0;
  if (props.isMap) {
    renVolume.value.muteX();
  }
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

const initData = (newValue) => {
  isPlay.value = false;
  wavesurfer1.pause();
  wavesurfer2.pause();
  wavesurfer1.load(newValue.sourceFileVOList[0]?.downloadUrl);
  wavesurfer2.load(newValue.sourceFileVOList[1]?.downloadUrl);
  audioName.value = newValue.sourceFileVO.filename
  wavesurfer1.on("ready", function () {
    audioLength.value = wavesurfer1.getDuration()
    initDrag()
  });
  wavesurfer1.on('audioprocess', function (e) {
    if (!progressBar.value){
      return;
    }
    let width1 = audioChart1.value.offsetWidth
    progressBar.value.style.left = (e / audioLength.value * width1) + 'px';
    currentPlaybackProgress.value = Math.round(e)
  });

}

defineExpose({
  initData
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

const downloadFile = (url, name) => {
  download(url, {}, name)
}

const renClick = (e) => {
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
const nextOther = () => {
  emit("nextOther")
}
const router = useRouter();
/**
 * 完成订单
 */
const completeOrder = () => {
  router.push({
    path: '/tool/index/record',
  })
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
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px
    }

    .progressBar {
      position: absolute;
      width: 2px;
      height: 150px;
      background: #3468FE;
      border-radius: 100px;
      z-index: 10;
      transform: translateY(-8px);

      .text-time {
        position: absolute;
        bottom: -18px;
        left: -20px;
      }

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
    width: 243px;
    height: 52px;
    background-image: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
    border-radius: 10px;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    border: none;
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

:deep(wave) {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none;
  }
}

.down-text {
  cursor: pointer;
  margin-left: 10px;
  line-height: 50px;
  color: #3468FE
}
</style>
