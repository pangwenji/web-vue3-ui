<template>
  <div class="audio-detail-box" id="player-box" v-loading="audioLoading" element-loading-background="#0a0b0d" element-loading-text="音频加载中...">
		<div class="play-box">
			<WaveForm
				v-if="fileDetail.audioWave"
				ref="waveRef"
				:audioWave="JSON.parse(fileDetail.audioWave)"
				:canvasHeight="500"
				:shapeHeight="500"
				:duration="fileDetail.metaData?.Duration || 0"
				:playPercent="playPercent"
				:showDbLine="true"
				@onPlayPercent="handlePlayPercent"
			></WaveForm>
			<WaveForm
				v-else
				ref="waveRef"
				:canvasHeight="500"
				:shapeHeight="500"
				:duration="fileDetail.metaData?.Duration || 0"
				:playPercent="playPercent"
				:showDbLine="true"
				@onPlayPercent="handlePlayPercent"
			></WaveForm>
			<div
				class="play-box"
				style="display: none"
			>
				<video
					:id="'player-container-id' + fileDetail.id"
					preload="auto"
					playsinline
					webkit-playsinline
				></video>
			</div>
		</div>
  </div>
</template>
<script setup>
import WaveForm from '@/components/WaveForm'
import { secondToDate } from "@/utils/tool";

const store = useStore();
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
  fileDetail: {
    type: Object,
    default: {}
  }
})

onMounted(() => {
	// wavesurferInit(props.fileDetail.downloadUrl)
	playerInit()
	window.onresize = () => {
		setTimeout(() => {
			onresizeDrawWave()
		}, 50);
  }
})

onUnmounted(() => {
  if (player&&player.value !== null) {
    player.value.dispose();
    player.value = null;
  }
})

const timelineRef = ref('');
const waveformRef = ref('');
const playtime = ref(0);

// 初始化
function playerInit(percent = 0) {
	audioLoading.value = true
  
  if (props.fileDetail.sign?.dataFormat === 'kodo') {
    const url = props.fileDetail.sign.list[0].key
    player.value = TCPlayer('player-container-id'+props.fileDetail.id, {}); // player-container-id 为播放器容器 ID，必须与 html 中一致
    player.value.src(url); // url 播放地址
  } else {
		const playOptions = {
			fileID: props.fileDetail.sign?.fileId,
			appID: props.fileDetail.sign?.appId,
			psign: props.fileDetail.sign?.sign,
		};
    player.value = TCPlayer('player-container-id'+props.fileDetail.id, playOptions);
  }
	
  player.value.one('canplay', () => {
    console.log('canplay');
		audioLoading.value = false
    playerDuration.value = player.value.duration();
		player.value.currentTime((playerDuration.value * percent) / 100);
		player.value.volume(playerVolume.value / 100)
		// playPause();
		emit('onPlayerInit', player.value);
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
		emit('onTimeupdate')
    onTimeChange();
  });
	// 播放结束
	player.value.on('ended', () => {
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


defineExpose({
	player,
	playPause,
	currentTimeChange,
	playPerChange,
	onresizeDrawWave
})
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>