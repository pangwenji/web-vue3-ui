<template>
	<div
		v-loading="loadingStatus"
		element-loading-background="#0a0b0d"
		element-loading-text="音频加载中..."
		class="audio-content"
		id="audio-content"
		@click="handlePlayerClick"
	>
		<div id="xgplayer" class="player-box" style="display:none;">
			<video :muted="isMuted" :id="'player-container-id'+fileDetail.id" preload="auto" playsinline webkit-playsinline></video>
		</div>
		<div
			ref="jieTu"
			class="content-box"
			id="ontent-box"
			:style="{width:contentBoxWidth+'px',height:contentBoxHeight+'px'}"
		>
			<div class="wave-box">
				<div class="lr" :style="{fontSize:setFontSize(contentBoxWidth)}">L</div>
				<WaveForm
					v-if="wfHeight"
					ref="waveRef1"
					:audioWave="JSON.parse(fileDetail.audioWave)"
					:duration="playerDuration"
					:playPercent="playPercent"
					:showDbLine="true"
					:canvasHeight="wfHeight"
					:shapeHeight="wfHeight"
					@onPlayPercent="handlePlayPercent"
				></WaveForm>
			</div>
			<div class="wave-box">
				<div class="lr" :style="{fontSize:setFontSize(contentBoxWidth)}">R</div>
				<WaveForm
					v-if="wfHeight"
					ref="waveRef2"
					:audioWave="JSON.parse(fileDetail.audioWave)"
					:duration="playerDuration"
					:playPercent="playPercent"
					:showDbLine="true"
					:canvasHeight="wfHeight"
					:shapeHeight="wfHeight"
					@onPlayPercent="handlePlayPercent"
				></WaveForm>
			</div>

			<div class="timeline">
				<div v-for="(item,index) in timeLineArr" :key="index" class="line-item">
					<span class="time">{{secondToDate(item)}}</span>
					<span class="shu"></span>
				</div>
			</div>

			<slot></slot>
		</div>
	</div>
</template>
<script setup>
import WaveForm from '@/components/WaveForm'
import { onMounted, onUnmounted } from 'vue-demi';
import { secondToDate, getRatio } from "@/utils/tool";
import html2canvas from 'html2canvas';

const store = useStore();
const emit = defineEmits();
const wavesurfer = ref('');
const speed =  ref(1);
const isPlay = ref(false);
const player = ref(null) // 播放对象
const playerDuration = ref(0) // 长度
const workTime = ref([])
const chooseTime = ref([])
const onPlayTime = ref(0) // 当前播放时间
const playPercent = ref(0) // 播放百分比
const waveRef1 = ref('')
const waveRef2 = ref('')
const timeLineArr = ref([])
const wfHeight = ref(0)
const loadingStatus = ref(false)
const isMuted = ref(true) // 是否静音

onMounted(() => {
	setContentBox()
	tcPlayerInit()
  // window.onresize = () => {
	// 	setTimeout(() => {
	// 		setContentBox()
	// 	}, 80);
  // }
})

onUnmounted(() => {
  // emit('onPlay', false);
	if (player.value) {
		player.value.dispose();
		player.value = null;
	}
})

const fileDetail = computed(()=>{
	return store.state.file.fileDetail
})

const contentBoxWidth = ref(0)
const contentBoxHeight = ref(0)
function setContentBox() {
	const audioBox = document.getElementById('audio-content')
	const boxW = audioBox.clientWidth
	const boxH = audioBox.clientHeight
	if (boxW > boxH * 2) {
		contentBoxHeight.value = boxH - 40
		contentBoxWidth.value = contentBoxHeight.value * 2
	} else {
		contentBoxWidth.value = boxW
		contentBoxHeight.value = contentBoxWidth.value / 2
	}
	if (boxH - 40 < contentBoxHeight.value) {
		contentBoxHeight.value = boxH - 40
		contentBoxWidth.value = contentBoxHeight.value * 2
	}
	wfHeight.value = contentBoxHeight.value / 2

	setTimeout(() => {
		onresizeDrawWave()
	}, 0);
	emit('onWHChange', {cwidth: contentBoxWidth.value, cheight: contentBoxHeight.value})
}

// 重新画图
function onresizeDrawWave() {
	waveRef1.value.drawWave()
	waveRef2.value.drawWave()
}

function setFontSize(bw) {
	let fs = 60
	if (bw > 1100) {
		fs = 60
	} else if (bw > 1040) {
		fs = 56
	} else if (bw > 980) {
		fs = 52
	} else if (bw > 920) {
		fs = 48
	} else if (bw > 860) {
		fs = 44
	} else if (bw > 800) {
		fs = 40
	} else if (bw > 720) {
		fs = 36
	} else if (bw > 660) {
		fs = 32
	} else if (bw > 600) {
		fs = 28
	} else if (bw > 540) {
		fs = 24
	} else {
		fs = 22
	}
	return fs + 'px'
}

function tcPlayerInit(){
	loadingStatus.value = true
  if (fileDetail.value.sign?.dataFormat === 'kodo') {
    const url = fileDetail.value.sign.list[0].key
    player.value = TCPlayer('player-container-id' + fileDetail.value.id);
    player.value.src(url); // url 播放地址
  } else {
		const playOptions = {
			fileID: fileDetail.value.sign?.fileId,
			appID: fileDetail.value.sign?.appId,
			psign: fileDetail.value.sign?.sign,
		}
		player.value = TCPlayer('player-container-id'+fileDetail.value.id, playOptions);
  }
	player.value.one('canplay',()=>{
		// 初始化首帧
		player.value.play();
		setTimeout(() => {
			player.value.pause();
			isMuted.value = false;
		}, 0);

		loadingStatus.value = false
		playerDuration.value = player.value.duration();
		getTimeLine()
		emit('audioInit', player.value);
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
		onTimeChange();
	});
	// 播放结束
	player.value.on('ended', () => {
		emit('onEnded')
	});
	player.value.on('error', function(e) {
		console.log('---error---', e);
	});
}

// 播放暂停
function playPause() {
	if (!isPlay.value) {
		player.value.play();
	} else {
		player.value.pause();
	}
}


function onTimeChange() {
	if (workTime.value.length > 0 && (workTime.value[1] - workTime.value[0] > 1) && (player.value.currentTime() >= workTime.value[1] || player.value.currentTime() <= workTime.value[0])) {
		player.value.currentTime(workTime.value[0]);
	}
	if (chooseTime.value.length === 0 || (chooseTime.value[1] - chooseTime.value[0]) <= 1) {
		const currentTime = player.value.currentTime();
		chooseTime.value = [currentTime, currentTime];
	}
	onPlayTime.value = player.value.currentTime();
	let percent = onPlayTime.value / playerDuration.value;
	playPercent.value = percent * 100;
}

// 当前播放时间点
function currentTimeChange(legth) {
	player.value.currentTime(player.value.currentTime() + (legth * 1));
}

// // 快进快退
// function currentTimeChange(legth) {
// 	wavesurfer.value.skip(legth)
// }

//倍速播放
// function doubleSpeed(rate) {
// 	wavesurfer.value.setPlaybackRate(rate);
// 	// console.log(rate);
// }

// 进度条改变
function playPerChange(per) {
	player.value.currentTime(per / 100 * playerDuration.value)
}

function clickItem(item) {
	if (item.endTime === '') {
		player.value.pause();
	}
	chooseTime.value = [];
	workTime.value = [];
	player.value.currentTime(item.startTime);
}

function handlePlayPercent(per) {
	playPercent.value = per
	player.value.currentTime(playerDuration.value * per / 100)
	emit('onPlayPercent', per)
}

const getTimeLine = () => {
	const step = playerDuration.value / 6
	let time = 0
	for (let index = 0; index < 5; index++) {
		timeLineArr.value.push(time+=step)
	}
}

// 截图
const jieTu = ref('')
async function screenshot() {
	const canvas = document.createElement("canvas")
	let canvasBox = jieTu.value

	let width = 1000
	let height = 500
	let p = width / canvasBox.clientWidth
	if (canvasBox.clientWidth >= canvasBox.clientHeight) {
		height = canvasBox.clientHeight * p
	} else {
		p = height / canvasBox.clientHeight
		width = canvasBox.clientWidth * p
	}

	canvas.width = width
	canvas.height = height
	canvas.style.width = width + 'px'
	canvas.style.height = height + 'px'
	const context = canvas.getContext("2d");
	context.scale(p/getRatio(), p/getRatio());
	const options = {
			backgroundColor: null,
			canvas: canvas,
			width: width,
			height: height,
			useCORS: true,
			logging: true,
			allowTaint: true
	}
	let dataURL = ''
	await html2canvas(canvasBox, options).then((canvas) => {
		dataURL = canvas.toDataURL("image/png")
	})
	return dataURL
}

function handlePlayerClick() {
	emit('onPlayerClick')
}

defineExpose({
	player,
	isPlay,
	playPause,
	currentTimeChange,
	playPerChange,
	clickItem,
	screenshot,
	setContentBox,
	onresizeDrawWave,
})
</script>

<style scoped lang="scss">
  @import "./style.scss";
</style>