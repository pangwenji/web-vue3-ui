<template>
  <div class="schedule-container" >
    <div style="display: flex;position: relative;margin-right: 10px;"  @click="tuo($event)">
      <ul class="li" ref="big">
        <template v-for="(j ,indexj) in 18" :key="indexj">
          <template  v-for="(i ,index) in 5">
            <li :class="index===0||index===4? 'hi-10' : index===1||index===3? 'hi-15':'hi-20'"></li>
          </template>
        </template>
      </ul>
      <div class="over" ref="tuodong">
        <ul class="li2">
          <template v-for="(j ,indexj) in 18" :key="indexj">
            <template  v-for="(i ,index) in 5">
              <li :class="index===0||index===4? 'hi-10' : index===1||index===3? 'hi-15':'hi-20'"></li>
            </template>
          </template>
        </ul>
      </div>
      <span class="word53">{{nowTime}}/{{lenthg}}</span>
    </div>
    <audio :src="mp3" ref="audio" @canplay="canplay" @timeupdate="timeupdate"  @ended="ended"></audio>
  </div>
</template>

<script setup>
import mp3 from './music.mp3'
import { defineExpose,ref, defineProps} from 'vue'
const audio = ref('')
const isPlay = ref(true)
const tuodong = ref('')
const big = ref('')
const lenthg = ref('')
const nowTime = ref('00:00')
const props = defineProps({
  indexx: {
    type: Number,
    default: null
  }
})
// 在音乐加载完成后触发;获取音乐长度
const canplay = () => {
  lenthg.value = getStringTime(audio.value.duration)
}

// 转换时间格式
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
//当前播放时间
const timeupdate = (e) => {
  // nowTime当前播放时间
  nowTime.value = getStringTime(audio.value.currentTime)
  // 变化长度 = 当前播放进度 / 音乐总长度 * div总长度
  const w = audio.value.currentTime / audio.value.duration * big.value.offsetWidth
  // 修改tuodong宽度
  tuodong.value.style.width = (w) + 'px'
}
//播放完成
const ended = () => {
  isPlay.value = true
  emit('playIcon',true)
}
const emit = defineEmits(['playIcon'])
// 开始音乐事件
const play = () => {
  console.log("play")
  audio.value.play()// 开始
  isPlay.value = false
  console.log("props.value.index",props.indexx)
  emit('playIcon',false,props.indexx)
}

// 暂停音乐事件
const pause = () => {
  audio.value.pause()// 暂停
  isPlay.value = true
  console.log("props.value.pause",props.indexx)
  emit('playIcon',true,props.indexx)
}

const tuo = (e) => {
  // 获取当前前进位置（鼠标点击位置）x
  const x = e.clientX
  // div离屏幕左边距离(长度)
  const dl = tuodong.value.getBoundingClientRect().left
  // 修改进度条前进位置tuodong.value，修改style中的宽度
  tuodong.value.style.width = (x - dl) + 'px'
  // 然后根据音乐总长度 ，计算出拖动后播放百分百
  // 计算音乐播放当前的事件 = (x - dl)鼠标在div中的位置 / div的总长度 * 音乐总长度
  const w = (x - dl) / big.value.offsetWidth * audio.value.duration
  // 设置音乐的当前进度为w
  audio.value.currentTime = w
}

defineExpose({
  play,
  pause
})
</script>

<style>
.hi-10{
  height: 3px;
}

.hi-15{
  height: 7px;
}

.hi-20{
  height: 12px;
}

.li, .li2{
  display: flex;
  list-style: none;
  height: 30px;
  padding: 0;
  margin: 0;

}

.li2 li{
  background-color: #2C57D3;
  width: 1px;
  margin: auto 1px;
  min-width:1px;
}

.li li{
  background-color: #424344;
  width: 1px;
  margin: auto 1px;
  min-width: 1px;
}
.over{
  width: 95px;
  overflow: hidden;
  position: absolute;

}
.word53 {
  margin-left: 10px;
  width: 68px;
  height: 14px;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  text-align: left;
  margin: auto auto auto 8px;
  white-space: nowrap;
  line-height: 14px;
}

</style>
