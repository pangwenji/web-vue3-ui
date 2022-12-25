<template>
  <div
    ref="drawerRef"
    class="drawer-box"
    :class="fadeClass"
    v-if="drawer"
  >
    <div class="play-content">
      <div class="cover">
        <img class="cover-img" :src="audioData?.coverUrl" />
      </div>
      <div class="name">{{audioData?.name}}</div>
      
      <div class="control-icon">
        <i class="play-icon icon-refund" @click="handleNext(-1)"></i>
        <i class="play-icon" :class="!isPlay?'icon-play':'icon-pause'" @click="playPause"></i>
        <i class="play-icon icon-forward" @click="handleNext(1)"></i>
      </div>

			<div class="current-time">
				{{secondToDate(currentTime)}} / {{secondToDate(duration)}}
			</div>
      
      <div class="audio-box">
        <audioPlayer
          v-if="showPlayer"
          ref="playerRef"
          :audioData="audioData"
					@onPlayerInit="handlePlayerInit"
          @onPlay="handlePlayPause"
					@onTimeupdate="handleTimeupdate"
        ></audioPlayer>
      </div>
    </div>
    
    <div class="close" @click="close">
      <el-icon><Close /></el-icon>
    </div>
  </div>
</template>
<script setup>
import audioPlayer from './audioPlayer.vue'
import { ElIcon } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import { secondToDate } from "@/utils/tool";

const props = defineProps({
  playList: {
    type: Array,
    default() {
      return [
        // {
				// 	id,
				// 	name,
				// 	coverUrl,
				// 	duration,
				// 	audioWave,
				// 	url
        // },
      ]
    }
  },
})

const drawer = ref(false)
const emit = defineEmits(['onClose', 'onPlayPause'])
const audioData = ref(null)
const showPlayer = ref(false)
const playId = ref(null) // 当前播放id
const current = ref(0) // 当前播放index
const fadeClass = ref('fadeIn')

// 播放
function play(id) {
	current.value = props.playList.findIndex(el => el.id === id)
	if (playId.value === id){
  	playPause()
  } else {
		if (!drawer.value) drawer.value = true
    showPlayer.value = false
    setTimeout(() => {
      playId.value = id
      showPlayer.value = true
      audioData.value = props.playList[current.value]
    }, 0);
	}
}

// 关闭
function close() {
  fadeClass.value = 'fadeOut'
	playId.value = null
	handlePlayPause(null)
  setTimeout(() => {
    drawer.value = false
    fadeClass.value = 'fadeIn'
  }, 400);
	emit('onClose')
}

// 播放器初始化
const duration = ref(0)
function handlePlayerInit() {
	duration.value = playerRef.value.player.duration()
}

// 播放/暂停
const playerRef = ref()
function playPause() {
  playerRef.value.playPause()
}

// 上下一首
function handleNext(step) {
  const next = current.value + step
  if (next < 0 || next > (props.playList.length - 1)) {
    return
  }
  showPlayer.value = false
  setTimeout(() => {
    current.value = next
    showPlayer.value = true
    audioData.value = props.playList[current.value]
		playId.value = audioData.value.id
  }, 0);
}

// 监听播放
const isPlay = ref(false)
function handlePlayPause(val) {
  isPlay.value = val
	const id = val ? playId.value : null
	emit('onPlayPause', id)
}

const currentTime = ref(0)
function handleTimeupdate(time) {
	currentTime.value = time
}

defineExpose({
	play,
  playPause,
})

</script>
<style lang="scss" scoped>
@import './style.scss'
</style>