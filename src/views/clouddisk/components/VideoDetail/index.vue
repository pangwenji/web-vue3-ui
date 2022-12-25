<template>
  <div class="video-detail-box" id="player-box" v-loading="videoLoading" element-loading-background="#0a0b0d" element-loading-text="视频加载中...">
    <div class="container-box">
      <div class="video-box" @click.stop="playPause" :style="{width:playerWidth?playerWidth+'px':'',height:playerHeight?playerHeight+'px':''}">
        <video :muted="isMuted" :id="'player-container-video'+fileDetail.id" preload="auto" playsinline webkit-playsinline></video>
        <canvas id="canvas"></canvas>
      </div>
    </div>
    <div v-show="clarityCurrentTime > 0" class="clarity-box">正在切换{{clarity}}播放，请稍后...</div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, watch } from "vue-demi"

const props = defineProps({
	fileDetail: {
		type: Object,
		default: {}
	},
  clarity: {
    type: String,
    default: ''
  },
  clarityCurrentTime: {
    type: Number,
    default: 0
	},
  playerWidth: {
    type: Number,
    default: 0
  },
  playerHeight: {
    type: Number,
    default: 0
  }
})

const store = useStore()
const player = ref(null)
const playerDuration = ref(0)
const videoWidth = ref(0)
const videoHeight = ref(0)
const isPlay = ref(false)
const videoLoading = ref(false)
const isMuted = ref(true) // 是否静音

const emit = defineEmits(['onPlayerInit','onPlay', 'onTimeupdate', 'onEnded', 'progressSuccess'])

onMounted(() => {
  tcPlayerInit()
})

onUnmounted(() => {
  if (player&&player.value !== null) {
    player.value.dispose();
    player.value = null;
  }
  store?.commit('clouddisk/SET_FILE_TYPE', '')
})

function tcPlayerInit() {
  videoLoading.value = true
  const playOptions = {
    controls: false,
    hlsConfig: {}
  }
  
  if (props.fileDetail.sign?.dataFormat === 'kodo') {
    const url = props.fileDetail.sign.list[0].key
    player.value = TCPlayer('player-container-video'+props.fileDetail.id, playOptions); // player-container-id 为播放器容器 ID，必须与 html 中一致
    player.value.src(url); // url 播放地址
  } else {
    playOptions.fileID =  props.fileDetail.sign?.fileId;
    playOptions.appID =  props.fileDetail.sign?.appId;
    playOptions.psign =  props.fileDetail.sign?.sign;
    player.value = TCPlayer('player-container-video'+props.fileDetail.id, playOptions);
  }

  player.value.one('canplay',()=>{
    console.log('canplay');
    videoLoading.value = false
    // 初始化首帧
    player.value.play();
    setTimeout(() => {
      player.value.pause();
      isMuted.value = false
    }, 10);

    playerDuration.value = player.value.duration();
    videoWidth.value = player.value.videoWidth();
    videoHeight.value = player.value.videoHeight();
    emit('onPlayerInit', player.value);
  });
  player.value.on('play',function(){
    isPlay.value = true;
    emit('onPlay', isPlay.value);
  });
  player.value.on('pause',function(){
    isPlay.value = false;
    emit('onPlay', isPlay.value);
  });
  player.value.on('timeupdate', () => {
    emit('onTimeupdate')
  });
  player.value.on('progress', () => {
    if (props.clarityCurrentTime > 0) {
      player.value.currentTime(props.clarityCurrentTime);
      setTimeout(() => {
        if (isPlay.value) {
          player.value.play()
        }
        emit('progressSuccess')
      }, 0);
    }
  });
	// 播放结束
	player.value.on('ended', () => {
		emit('onEnded')
	});
  player.value.on('error', function(e) {
    console.log('---error---', e);
    videoLoading.value = false
  });
}

// 播放暂停
function playPause() {
  if (props.clarityCurrentTime > 0) return
  if (player.value === null) {
    tcPlayerInit()
  } else {
		if (!isPlay.value) {
			player.value.play()
		} else {
			player.value.pause()
		}
  }
}

// 快进快退
function currentTimeChange(legth) {
	player.value.currentTime(player.value.currentTime() + (legth * 1))
}

// 进度条改变
function playPerChange(per) {
	player.value.currentTime((playerDuration.value * per) / 100)
}

defineExpose({
	player,
	playPause,
	currentTimeChange,
	playPerChange,
})

</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>