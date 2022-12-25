<template>
  <div style="display: flex;align-items: center;margin-top:5px">
    <audio ref="audio"
           @canplay="canplay"
           @timeupdate="timeupdate"
           :src="music?.downloadUrl" ></audio>
    <div class="play" @click="play">
      <el-image style="width: 72px" :src="isPlay?playImg:pause"></el-image>
    </div>
    <div class="progress"   ref="progress"  @click="changProgress">
      <div class="progress-name">{{ name }}</div>
      <el-progress
          style="width: 100%;height: 25px"
          :text-inside="true"
          :show-text="false"
          color="rgba(52, 104, 254, 0.44)"
          :stroke-width="26"
          :percentage="schedule" />
    </div>
  </div>
</template>

<script setup>
import pause from '@/assets/tool/pause.png'
import playImg from '@/assets/tool/playImg.png'
import {ref} from "vue";
const emit = defineEmits(['playBack'])
const progress=ref(null)
const isPlay = ref(false)
const schedule=ref(0)
const audio=ref(null)
const play = () => {
  isPlay.value=!isPlay.value
  if (isPlay.value){
    audio.value.play();
    emit("playBack",props.name)
  }else {
    audio.value.pause();
  }
}
const props = defineProps({
  name : String,
  music:Object,
})

const changProgress = (e) => {
  // 进度条长度 100
  // 当前点击长度 50
  // 进度条值为100
  const x = e.clientX
  const dl = progress.value.getBoundingClientRect().left
  let thisX = x - dl;
  let w=progress.value.offsetWidth
  schedule.value=thisX/w*100;
  // 设置音乐的当前进度为w
  audio.value.currentTime = thisX / w * audio.value.duration
}

const timeupdate = (e) => {
  // 变化长度 = 当前播放进度 / 音乐总长度 * div总长度
  // 修改tuodong宽度
  schedule.value=audio.value.currentTime / audio.value.duration * 100
}
const canplay = () => {
  audio.value.addEventListener('ended',()=>{
    isPlay.value=false
  })
}

const audioPause=()=>{
  audio.value.pause();
  isPlay.value=false
}
defineExpose({
  audioPause,
  name:props.name
})

</script>
<style lang="scss" scoped>
.play {
  z-index: 99;
  height: 72px;
  cursor: pointer
}
.progress{
  width: 100%;
  position: relative;
  margin-top: 3px;
  .progress-name{
    position: absolute;
    right: 30px;
    font-size: 14px;
    font-weight: 500;
    color: #9094A6;
    line-height: 20px;
    top: -25px;
  }
}


</style>
