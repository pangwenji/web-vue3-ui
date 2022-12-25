<template>
  <div class="cover-item">
    <div style="width: 30px;height: 30px" class="cover-item-info" @click="playAudio">
      <el-image style="width: 30px" :src="isPlay?decryptPause:decryptPlay"></el-image>
    </div>
    <div class="cover-item-info" style="margin-left: 10px">
      <el-image :src="file.picture" style="width: 48px; height: 48px;border-radius: 5px">
        <!--        <div slot="error" class="image-slot el-image__error">暂无封面</div>-->
        <template #error>
          <div class="image-slot">
            暂无 封面
          </div>
        </template>
      </el-image>
    </div>
    <div style="flex: 1;padding:0 40px 0 20px">
      <div ref="waveRef"></div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import WaveSurfer from "wavesurfer.js";
import decryptPause from '@/assets/tool/decryptPause.png'
import decryptPlay from '@/assets/tool/decryptPlay.png'
import noImage from '@/assets/tool/noImage.png'

const props = defineProps({
  file: {
    type: Object,
    default: {}
  }
})
const emit=defineEmits(['play'])
const isPlay = ref(false);
const waveRef = ref(null);
let wavesurfer = null;
let audioLength = ref(0);
let progress = ref(0);
onMounted(() => {
  wavesurfer = WaveSurfer.create({
    container: waveRef.value,//容器
    waveColor: '#9094A6',//波形图颜色
    progressColor: '#376CFA',//进度条颜色
    backend: 'MediaElement',
    mediaControls: false,
    audioRate: '1',//播放音频的速度
    height: 40,
    //插件
    plugins: [],
    scrollParent: false,
    hideScrollbar: true,
    responsive: true,
  });
  wavesurfer.load(props.file.file)
  isPlay.value = false;
  progress.value = 0;
  wavesurfer.on('finish', function (e) {
    isPlay.value = false;
  });
  wavesurfer.on("ready", function () {
  });
})

const playAudio = () => {
  isPlay.value = !isPlay.value;
  if (isPlay.value){
    emit('play',isPlay.value)
    wavesurfer.play();
    isPlay.value=true;
  }else{
    wavesurfer.pause();
  }
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

const formatTooltip = (value) => {
  // 宽 100 ，当前长度 100 ，实际场地 200 200/100 *
  return getStringTime(audioLength.value / 100 * value)
}

const changeAudioProgress = () => {
  let start = audioLength.value / 100 * progress.value;
  wavesurfer.play(start);
  isPlay.value = true;
}

const startProgress = () => {
  wavesurfer.pause();
  isPlay.value = false;
}
const pauseAudio = () => {
  wavesurfer.pause();
  isPlay.value=false;
}
const pausePlay = () => {
  wavesurfer.play();
  isPlay.value=true;
}
defineExpose({
  pauseAudio,
  pausePlay,
  isPlay
})
</script>

<style scoped lang="scss">
.cover-item {
  display: flex;
  align-items: center;
}

.cover-item-info {
  padding: 0 20px;
}
.image-slot{
  padding: 9px 12px;
  font-size: 12px;
  color: #C2C7CE;
  background-color: #E5E7F0;
}
</style>
