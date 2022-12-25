<template>
  <div class="main-card-broad">
    <div>
      <div class="audio-play">
        <div v-if="status===2" class="success"> ✔</div>
        <div v-if="status===3" class="error">×</div>
        <div class="sound-reserved">
          <div style="flex: 4; text-align: left;display: flex;align-items: center">
            <div style="margin-right: 10px;">
              <div>
                <el-button style="z-index: 99;width: 40px;height:40px"
                           :disabled="status===1"
                           type="text"
                           @click="play">
                  <el-image style="height: 30px" :src="isPlay?playImg:pause"></el-image>
                </el-button>
              </div>
            </div>
            <div>{{file.filename}}</div>
          </div>
          <div class="sound-m2">
            <div class="audio-ren"
                 @click="accompanClick"
                 ref="audioChart1">
              <div class="progressBar" ref="progressBar">
              </div>
            </div>
            <div style="padding: 20px">
             {{getStringTime(currentPlaybackProgress)}}/{{getStringTime(audioLength)}}
            </div>
          </div>

          <div style="width: 230px;display: flex;align-items: center;justify-content: end">
            <div style="margin: 0 10px;">
              <div v-if="status===0" class="item-flex">
                <div>
                  <span v-if="file.upload.state == 'awaiting'">等待上传</span>
                  <span v-else-if="file.upload.state == 'checking'">读取文件</span>
                  <span v-else-if="file.upload.state == 'uploading'">正在上传( {{file.upload.percent}} %)</span>
                  <span v-else-if="file.upload.state == 'error'">上传失败</span>
                  <span v-else>可试听</span>
                </div>
                <div>
                  <el-tooltip class="box-item" effect="dark"
                              content="试听采用即时模拟播放技术进行播放，文件并未进行处理，不是最终的效果，仅做参考" placement="top">
                    <QuestionFilled style="width: 18px; height: 18px; margin: 0 8px;color: rgba(255,255,255,0.67);"/>
                  </el-tooltip>
                </div>
              </div>
              <div v-else  class="item-flex"></div>
              <div v-if="status===1" >
                <el-image :src="toolLoading"></el-image>
              </div>
              <div v-if="status===3" style="display: flex">
                <div style="color: red"> 处理失败</div>
                <div>
                  <el-tooltip class="box-item" effect="dark"
                              content="该音频文件处理失败，建议重新上传可播放的音频文件；上传mp3格式的文件可提高处理成功率，如有疑问请联系客服；金额已自动退到您的账户中。" placement="top">
                    <QuestionFilled style="width: 18px; height: 18px; margin: 0 8px;color: rgba(255,255,255,0.67);"/>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <el-button
                v-if="status===2"
                type="text"
                :disabled="status!==2"
                @click="downloadFile(file.downloadUrl,file.filename)">
              下载
            </el-button>
            <div style="padding: 10px;cursor: pointer">
              <slot></slot>
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue'

const value = ref('')
import WaveSurfer from 'wavesurfer.js'
import {download} from "@/utils/request"; //导入wavesurfer.js
import down from '@/assets/tool/down.png'
import pause from '@/assets/tool/wate-pause.png'
import playImg from '@/assets/tool/ware-play.png'
import toolLoading from '@/assets/tool/toolLoading.gif'
import success from '@/assets/images/success.png'
import {requestBlob} from "../../../utils/audioVideoUtils";
import {scale} from "../../../dragUtils";
const audioChart1 = ref(null)
let wavesurfer1 = ref('')
let audioLength = ref(0);
let audioName = ref('')
const currentPlaybackProgress = ref(0)
let volume = ref(100)
const isPlay = ref(false)
const progressBar=ref(null);

const props = defineProps({
  file: {
    type: Object,
    default: {},
  },
  showDown: {
    type: Boolean,
    default: false,
  },
  fileIndex:{
    type:Number,
    default:0,
  },
  uuid:String,
  status:{
    type:Number,
    default:0,
  }
})
const emit = defineEmits(['close', 'play', 'nextOther',"deleteFile",'endPlay'])
const drawPlay = (file) => {
  audioName.value = file.filename
  wavesurfer1 = WaveSurfer.create({
    container: audioChart1.value,//容器
    waveColor: '#9094A6',//波形图颜色
    progressColor: '#376CFA',//进度条颜色
    backend: 'MediaElement',
    mediaControls: false,
    audioRate: '1',//播放音频的速度
    height: 40,
    scrollParent: false,
    hideScrollbar: true,
    responsive: true,
  });
  if (file?.status!==2){
    wavesurfer1.load(file?.downloadUrl);
  }else {
    requestBlob(file?.downloadUrl).then(res=>{
      wavesurfer1.load(res);
    })
  }
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
    emit('endPlay')
  });
}

const initDrag = () => {
  let start = 0;
  scale("yp", progressBar.value, audioChart1.value, audioChart1.value, (pos, x, step, mw, name) => {
    if (name === "yp") {
      wavesurfer1.pause(); //切换播放，应用播放或暂停
      isPlay.value = false;
      progressBar.value.style.left = x + "px";
      start = x / mw * audioLength.value;
    }
  }, (name) => {
    if (name === "yp") {
      wavesurfer1.play(start); //切换播放，应用播放或暂停
      isPlay.value = true;
      emit('play',props.uuid)
    }
  })
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
    drawPlay(props.file)
    wavesurfer1.on("ready", function () {
      audioLength.value = wavesurfer1.getDuration();
      initDrag()
    });
})

const getFile = computed(() => {
  return props.file
})

watch(getFile, (newValue) => {
  if (!wavesurfer1) {
      drawPlay(newValue)
      wavesurfer1.on("ready", function () {
        audioLength.value = wavesurfer1.getDuration()
      });
  }
})

const play = () => {
  wavesurfer1.playPause(); //切换播放，应用播放或暂停
  isPlay.value = !isPlay.value
  emit('play',props.uuid)
}

const pauseAudio = () => {
  wavesurfer1.pause();
  isPlay.value=false;
}
const pausePlay = () => {
  wavesurfer1.play();
  isPlay.value=true;
}

const close = () => {
  emit('close')
}

const downloadFile = (url, name) => {
  download(url, {}, name)
}


/**
 * 转换下一首
 */
const nextOther = () => {
  emit("nextOther")
}

const deleteFile=()=>{
  emit("deleteFile",props.fileIndex)
}
const getUuid = () => {
  return props.uuid;
}

const getFilex=()=>{
  return props.file;
}

const accompanClick = (e) => {
  // 获取当前前进位置
  const x = e.clientX
  const dl = audioChart1.value.getBoundingClientRect().left
  let thisX = x - dl;
  progressBar.value.style.left = thisX + 'px';
  let start = thisX / audioChart1.value.offsetWidth * audioLength.value;
  wavesurfer1.play(start); //切换播放，应用播放或暂停
  isPlay.value = true;
}

defineExpose({
  pauseAudio,
  pausePlay,
  getUuid,
  getFilex,
  isPlay,
});
</script>
<style scoped lang="scss">
.main-card-broad {
  color: #FFFFFF;
}

.item-flex{
  display: flex;
}
.sound-reserved {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 10px;
  align-items: center;

  .sound-m2 {
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: start;

    .sound-text {
      background-color: #30323B;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 1px 20px;
      border-radius: 10px;
    }

    .audio-ren {
      position: relative;
      flex: 2;
      border-radius: 10px;
      cursor: pointer;
    }

    .progressBar {
      position: absolute;
      width: 3px;
      height: 40px;
      background: #9094A6;
      border-radius: 100px;
      z-index: 10;
      cursor: e-resize;
      .text-time{
        position: absolute;
        bottom:-18px;
        left: -20px;
      }
    }
  }
}

.play-button {
  margin-bottom: 46px;
  display: flex;
  align-items: center;

  .play-rl {
    border-radius: 9px;
    padding: 4px 40px 4px 49px;
    transform: translateX(-38px) translateY(-2px);
    background-image: radial-gradient(circle at left, #1c1d24 32px, #24262F 32px);
  }

  .play-time {
    font-size: 13px;
    font-weight: 400;
    color: #7CB5EC;
    margin-top: 2px;
  }

  .play-name {
    font-size: 14px;
    font-weight: 400;
    color: #9094A6;
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

.whirling{
  animation: rotate 1.3s linear infinite;
}

.audio-play{
  position: relative;
  .success,.error{
    position: absolute;
    left: -18px;
    background: #0DA411;
    top: -5px;
    width: 21px;
    height: 23px;
    line-height: 22px;
    text-indent: 5px;
    border-bottom-right-radius: 9px;
    border-top-left-radius: 7px;

  }
  .error{
    background: red;
  }
}
</style>
