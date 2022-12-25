<template>
  <div class="play-box">
    <WaveForm
      v-if="audioData.audioWave"
      ref="waveRef"
      :audioWave="audioData.audioWave"
      :canvasHeight="46"
      :shapeHeight="46"
      :duration="audioData.duration * 1 || 0"
      :playPercent="playPercent"
      waveBgColor="#292c35"
      @onPlayPercent="handlePlayPercent"
    ></WaveForm>
    <div
      class="play-box"
      style="display: none"
    >
      <video
        :id="'player-container-id' + audioData.id"
        preload="auto"
        playsinline
        webkit-playsinline
      ></video>
    </div>
  </div>
</template>
<script setup>
import WaveForm from '@/components/WaveForm'
import { secondToDate } from "@/utils/tool";

const emit = defineEmits([
	'onPlayerInit',
	'onTimeupdate',
	'onPlay',
	'onEnded'
]);
const player = ref(null)
const isPlay = ref(false)
const playPercent = ref(0) // 播放百分比
const playerDuration = ref(0) // 长度
const playerVolume = ref(100) // 音量
const audioLoading = ref(false)

const props = defineProps({
  audioData: {
    type: Object,
    default: {}
  }
})

onMounted(() => {
	// wavesurferInit(props.audioData.downloadUrl)
	playerInit()
	window.onresize = () => {
		setTimeout(() => {
			onresizeDrawWave()
		}, 50);
  }
})

onUnmounted(() => {
  if (player.value !== null) {
    player.value.dispose();
    player.value = null;
  }
})

// 初始化
function playerInit(percent = 0) {
	audioLoading.value = true
	playerDuration.value = 0
	playPercent.value = 0
  
  if (props.audioData) {
    const url = props.audioData.url
    player.value = TCPlayer('player-container-id'+props.audioData.id, {}); // player-container-id 为播放器容器 ID，必须与 html 中一致
    player.value.src(url); // url 播放地址
  }
	
  player.value.one('canplay', () => {
    console.log('canplay');
		audioLoading.value = false
    playerDuration.value = player.value.duration();
		player.value.currentTime((playerDuration.value * percent) / 100);
		player.value.volume(playerVolume.value / 100)
		playPause();
		emit('onPlayerInit');
  });
  player.value.on('play', function () {
    isPlay.value = true;
		emit('onPlay', isPlay.value);
  });
  player.value.on('pause', function () {
    isPlay.value = false;
		emit('onPlay', isPlay.value);
  });
  player.value.on('timeupdate', () => {
		emit('onTimeupdate', player.value.currentTime())
    onTimeChange();
  });
	// 播放结束
	player.value.on('ended', () => {
    console.log('---ended---');
		emit('onEnded')
	});
  player.value.on('error', function (e) {
    console.log('---error---', e);
		audioLoading.value = false
  });
}

// 播放暂停
function playPause() {
  if (player.value === null) {
    playerInit();
  } else {
		if (!isPlay.value) {
			player.value.play();
		} else {
			player.value.pause();
		}
  }
}

// 波形图点击
function handlePlayPercent(per) {
  playPercent.value = per;
  if (player.value === null) {
    playerInit(per);
  } else {
    player.value.currentTime((playerDuration.value * per) / 100);
    player.value.play();
  }
}

function onTimeChange() {
  const currentTime = player.value.currentTime();
  let percent = currentTime / playerDuration.value;
  playPercent.value = percent * 100;
}

// 快进快退
function currentTimeChange(legth) {
	player.value.currentTime(player.value.currentTime() + (legth * 1))
}

//倍速播放
function doubleSpeed(rate) {
	player.value.setPlaybackRate(rate);
}

// 进度条改变
function playPerChange(per) {
	player.value.currentTime((playerDuration.value * per) / 100)
}

// 重新画图
const waveRef = ref()
function onresizeDrawWave() {
	waveRef.value.drawWave()
}

function playDispose() {
  player.value.dispose();
  player.value = null;
}


defineExpose({
	player,
	playPause,
	currentTimeChange,
	playPerChange,
	onresizeDrawWave,
  playDispose
})
</script>
<style lang="scss" scoped>
.play-box{
	width: 100%;
	height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>