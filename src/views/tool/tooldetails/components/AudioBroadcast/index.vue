<template>
  <div class="main-card-broad">
    <div>
      <div style="display:flex;justify-content: space-between">
        <div style="display: flex; align-items: flex-end;">
          <div @click="play">
            <el-icon>
              <PictureRounded/>
            </el-icon>
          </div>
          <div style="margin-left: 10px">{{ audioName }}</div>
          <div style="margin: 0 20px">{{ formatSize(audioSize) }}</div>
          <div>{{ getStringTime(audioLength) }}</div>
          <div style="display: flex;margin: 0 20px;width: 200px;transform: translateY(10px)">
            <div style="flex: 1 0 auto;margin-right: 20px">音量</div>
            <div style="width: 140px;transform: translateY(-2px)">
              <el-slider v-model="volume" @change="changeVolume"/>
            </div>
          </div>
        </div>
        <div style="cursor: pointer" v-if="!showDown" @click="close">
          <el-icon>
            <CloseBold/>
          </el-icon>
        </div>
        <div style="cursor: pointer" v-else @click="downloadFile">
          <el-icon>
            <Download />
          </el-icon>
        </div>
      </div>
      <div ref="audioChart"></div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, defineExpose, computed} from 'vue'
const value = ref('')
import WaveSurfer from 'wavesurfer.js'
import {formatSize} from "@/utils/tool";
import {download} from "@/utils/request"; //导入wavesurfer.js
const audioChart=ref(null)
let wavesurfer = ref('')
let audioLength = ref(0);
let audioName = ref('')
let audioSize = ref(10)
let volume = ref(100)
const props = defineProps({
  file: {
    type: Object,
    default: {
      name: "孤勇者.mp4",
      size: 4097047,
      fileUrl: ''
    },
  },
  showDown:{
    type:Boolean,
    default:false,
  }
})
const emit = defineEmits(['close','play'])
const drawPlay = (file) => {
  audioName.value = file.name
  audioSize.value = file.size
  wavesurfer = WaveSurfer.create({
    container: audioChart.value,//容器
    waveColor: '#c8eaef',//波形图颜色
    progressColor: '#d9f2f6',//进度条颜色
    backend: 'MediaElement',
    mediaControls: false,
    audioRate: '1',//播放音频的速度
    height: 60,
    //插件
    plugins: []
  });
  // 特别提醒：此处需要使用require(相对路径)，否则会报错
  wavesurfer.load(file.fileUrl);
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
  if (props.file.fileUrl){
    drawPlay(props.file)
    wavesurfer.on("ready", function () {
      audioLength.value = wavesurfer.getDuration()
    });
  }
})

const getFile=computed(()=>{
  return props.file
})
watch(getFile,(newValue,oldValue)=>{
  if (newValue.fileUrl){
    drawPlay(newValue)
    wavesurfer.on("ready", function () {
      audioLength.value = wavesurfer.getDuration()
    });
  }
})
const changeVolume = (v) => {
  wavesurfer.setVolume(v / 100);
}
const play = () => {
  wavesurfer.playPause(); //切换播放，应用播放或暂停
  emit('play')
}

const close = () => {
  emit('close')
}

const downloadFile=()=>{
  download(props.file.fileUrl,{},props.file.name)
}
const outPay=()=>{
  wavesurfer.playPause(); //切换播放，应用播放或暂停
}
defineExpose({
  outPay
})
</script>
<style scoped lang="scss">
.main-card-broad{
  color: #FFFFFF;
}
</style>
