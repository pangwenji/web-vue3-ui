<template>
	<div v-loading="imgloading" element-loading-background="#0a0b0d" element-loading-text="图片加载中..." class="image-content">
		<div
			class="image-box"
			ref='previewImgDiv'
			@mousewheel.stop="handleMousewheel"
			@mousedown="handleMouseDown"
		>
			<div id="jieTu" :style="{width:imgBoxWidth+'px', height:imgBoxHeight+'px',left:imgBoxLeft+'px',top:imgBoxTop+'px'}" style="position:absolute;transform:none;" ref="jieTu">
				<img style="width:100%;height:100%;" :src="fileDetail.sourceUrl" alt="">
				<slot></slot>
			</div>
		</div>
		<div style="width:100%;height:25px;background-color: #20222B;" @mouseover="handleMouseover"></div>
		<div class="img-control" :style="{position:!isFullScreen?'fixed':'',bottom:!isFullScreen?'0':'','background-color': !isFullScreen?'#20222B':''}" @mouseover="handleMouseover">
			<div class="control-item control-left">
				<el-tooltip
					:show-after="400"
					content="自适应宽高"
					placement="top"
				>
					<span @click="fillUp">
						<el-icon class="control-icon icon-fill"></el-icon>
					</span>
				</el-tooltip>
			</div>
			<div class="control-item control-right">
				<div class="zoom-group">
					<el-tooltip
						:show-after="400"
						content="缩小"
						placement="top"
					>
						<span @click="imgZoom(-10)">
							<el-icon class="control-icon icon-reduce"></el-icon>
						</span>
					</el-tooltip>
					<el-tooltip
						:show-after="400"
						content="缩放大小"
						placement="top"
					>
						<span class="img-percent" @click.stop="fillUp">{{multiple}}%</span>
					</el-tooltip>
					<el-tooltip
						:show-after="400"
						content="放大"
						placement="top"
					>
						<span @click="imgZoom(10)">
							<el-icon class="control-icon icon-add"></el-icon>
						</span>
					</el-tooltip>
				</div>
				<el-tooltip
					:show-after="400"
					content="画面小地图"
					placement="top"
				>
					<span @click="isPreview = !isPreview" :class="{'preview-active':isPreview}">
						<el-icon class="control-icon icon-preview"></el-icon>
					</span>
				</el-tooltip>
				<el-tooltip
					:show-after="400"
					content="全屏"
					placement="top"
				>
					<span @click="fullScreen">
						<el-icon class="control-icon icon-full"></el-icon>
					</span>
				</el-tooltip>
			</div>
		</div>
    <div
			v-if="isPreview"
			class="preview-map-img"
			:style="previewStyle"
			ref='previewMapDiv'
			@mousedown.stop="handleMouseDownPreview"
		>
			<div class="preview-map-square" :style="{width:preSquareWidth+'px',height:preSquareHeight+'px', left: preSquareLeft+'px', top: preSquareTop+'px'}" ></div>
		</div>
	</div>
</template>

<script setup>
import html2canvas from 'html2canvas';
import { getRatio } from "@/utils/tool";
import { ElMessage } from 'element-plus';

const store = useStore();
const emit = defineEmits();
const previewImgUrl = ref('https://cdn-pub.yueliu.cloud/coverImg/preview_c77852b69d9b8afae05c85f5225bd08d-af88637491fb00ace529e0f8a2282850.jpg')
const imgWidth = ref(0)
const imgHeight = ref(0)
const imgContentWidth = ref(0)
const imgContentHeight = ref(0)
const previewImgDiv = ref('');
const multiple = ref(0) // 缩放倍数百分比
const imgBoxWidth = ref(0) // 图片视窗宽
const imgBoxHeight = ref(0) // 图片视窗高
const imgBoxLeft = ref(0) // img偏移
const imgBoxTop = ref(0) // img偏移
const oldImgBoxWidth = ref(0) // 满屏前img宽
const oldImgBoxHeight = ref(0) // 满屏前img高
const oldImgBoxLeft = ref(0) // 满屏前img偏移
const oldImgBoxTop = ref(0) // 满屏前img偏移
const isPreview = ref(false) // 是否展示预览小地图
const previewStyle = ref({})
const previewMapDiv = ref('');
const preWidth = ref(0) // 预览外框宽
const preHeight = ref(0) // 预览外框高
const preSquareWidth = ref(0) // 预览内框宽
const preSquareHeight = ref(0) // 预览内框高
const preSquareTop = ref(0) // 预览内框宽偏移
const preSquareLeft = ref(0) // 预览内框宽偏移
const imgloading = ref(false)

// 自适应预览
const preSquareWidthInit = ref(0)
const preSquareHeightInit = ref(0)
const preSquareLeftInit = ref(0)
const preSquareTopInit = ref(0)
const preSquareWidthOld = ref(0)
const preSquareHeightOld = ref(0)
const preSquareLeftOld = ref(0)
const preSquareTopOld = ref(0)

const props = defineProps({
	isFullScreen: {
		type: Boolean,
		default: true
	},
	fileDetail: {
		type: Object,
		default: {}
	}
})

onMounted(() => {
	datadragEnd(props.fileDetail.sourceUrl)
	// 视窗变化
	// window.onresize = () => {
	// 	return (() => {
	// 		setTimeout(() => {
	// 			setImgWhAndMap()
	// 		},80);
	// 	})()
	// }
})
onUnmounted(() => {
	// window.onresize = null;
  store.commit('clouddisk/SET_FILE_TYPE', '')
})

// watch(imgBoxWidth, newVal => {
	// emit('onWHChange', {cwidth: newVal, cheight: imgBoxHeight.value})
// });

// const fileDetail = computed(()=>{
//     return store.state.file.fileDetail
// })


function datadragEnd(imgUrl) {
	if (!imgUrl) {
		ElMessage.error('资源加载失败！')
		return
	}
	imgloading.value = true
	const img = new Image();
	// 图片地址
	img.src = imgUrl;
	img.onload = function () {
 		imgWidth.value = img.width
 		imgHeight.value = img.height
		setImgWhAndMap()
	}
}

// 设置图片宽高及预览地图
function setImgWhAndMap() {
	const p = imgWidth.value / imgHeight.value // 图片原始比例
	const cbox = document.getElementsByClassName('image-content')[0]
	imgContentWidth.value = cbox.clientWidth
	imgContentHeight.value = cbox.clientHeight
	const p2 = imgContentWidth.value / imgContentHeight.value // 图片视窗比例
	// 宽高
	if (p > p2) {
		imgBoxWidth.value = imgContentWidth.value
		imgBoxHeight.value = imgContentWidth.value / p
		imgBoxLeft.value = 0
		imgBoxTop.value = (imgContentHeight.value - imgBoxHeight.value) / 2
	} else {
		imgBoxWidth.value = imgContentHeight.value * p
		imgBoxHeight.value = imgContentHeight.value
		imgBoxLeft.value = (imgContentWidth.value - imgBoxWidth.value) / 2
		imgBoxTop.value = 0
	}
	multiple.value = parseInt(imgBoxWidth.value / imgWidth.value * 100)

	// 预览地图
	let [pw,ph] = [200,200]
	if (imgWidth.value > imgHeight.value) {
		ph = 200 / p
	} else if (imgWidth.value < imgHeight.value) {
		pw = 200 * p
	}
	preWidth.value = pw // 预览外框宽
	preHeight.value = ph

	previewStyle.value = {
		'width': pw + 'px',
		'height': ph + 'px',
		'background-image': 'url(' + props.fileDetail.sourceUrl + ')',
	}
	preSquareWidth.value =  pw / (imgBoxWidth.value / imgContentWidth.value)
	preSquareHeight.value =  ph / (imgBoxHeight.value / imgContentHeight.value)
	preSquareLeft.value = (preWidth.value.toFixed(5) - preSquareWidth.value.toFixed(5)) / 2
	preSquareTop.value = (preHeight.value.toFixed(5)  - preSquareHeight.value.toFixed(5)) /2
	imgloading.value = false
	
	preSquareWidthInit.value = preSquareWidth.value
	preSquareHeightInit.value = preSquareHeight.value
	preSquareLeftInit.value = preSquareLeft.value
	preSquareTopInit.value = preSquareTop.value
	preSquareWidthOld.value = preSquareWidth.value
	preSquareHeightOld.value = preSquareHeight.value
	preSquareLeftOld.value = preSquareLeft.value
	preSquareTopOld.value = preSquareTop.value
	emit('onWHChange', {cwidth: imgBoxWidth.value, cheight: imgBoxHeight.value})
	
}

// 滚轮缩放
function handleMousewheel(event) {
	if (event.wheelDelta > 0) {
		imgZoom(1)
	} else {
		imgZoom(-1)
	}
	return false
}

// 图片移动
function handleMouseDown(event) {
	event.preventDefault()
	if (event.target.tagName !== 'IMG') {
		return false
	}
	const div = previewImgDiv.value
	const originX = event.screenX
	const originY = event.screenY
	const imgBoxLeft1 = imgBoxLeft.value
	const imgBoxTop1 = imgBoxTop.value
	const preSquareLeft1 = preSquareLeft.value
	const preSquareTop1 = preSquareTop.value

	const move = (e) => {
		const afterX = e.screenX
		const afterY = e.screenY
		imgBoxLeft.value = imgBoxLeft1 + (afterX - originX)
		imgBoxTop.value = imgBoxTop1 + (afterY - originY)

		// 计算小地图偏移
		preSquareLeft.value = preSquareLeft1 - (afterX - originX) / (imgContentWidth.value / preSquareWidth.value)
		preSquareTop.value = preSquareTop1 - (afterY - originY) / (imgContentHeight.value / preSquareHeight.value)
	}
	div.addEventListener('mousemove', move)
	div.addEventListener('mouseup', () => {
		div.removeEventListener('mousemove', move)
	})
}

/**
 * 撑满
 * @type 0横向 1纵向
 */
function fillUp(){
	let type = 0;
	const p = imgWidth.value / imgHeight.value
	const p2 = imgContentWidth.value / imgContentHeight.value
	if (p < p2) {
		type = 1
	}

	const pqw = preSquareWidth.value
	const pqh = preSquareHeight.value
	const pql = preSquareLeft.value
	const pqt = preSquareTop.value

	if (oldImgBoxWidth.value === 0) {
		oldImgBoxWidth.value = imgBoxWidth.value
		oldImgBoxHeight.value = imgBoxHeight.value
		oldImgBoxLeft.value = imgBoxLeft.value
		oldImgBoxTop.value = imgBoxTop.value

		if (type === 1) {
			imgBoxWidth.value = imgContentHeight.value * p
			imgBoxHeight.value = imgContentHeight.value
		} else {
			imgBoxWidth.value = imgContentWidth.value
			imgBoxHeight.value = imgContentWidth.value / p
		}
		imgBoxLeft.value = (imgContentWidth.value - imgBoxWidth.value) /2
		imgBoxTop.value = (imgContentHeight.value - imgBoxHeight.value) /2
		
		preSquareWidth.value = preSquareWidthInit.value
		preSquareHeight.value = preSquareHeightInit.value
		preSquareLeft.value = preSquareLeftInit.value
		preSquareTop.value = preSquareTopInit.value
		preSquareWidthOld.value = pqw
		preSquareHeightOld.value = pqh
		preSquareLeftOld.value = pql
		preSquareTopOld.value = pqt
	} else {
		imgBoxWidth.value = oldImgBoxWidth.value
		imgBoxHeight.value = oldImgBoxHeight.value
		imgBoxLeft.value = oldImgBoxLeft.value
		imgBoxTop.value = oldImgBoxTop.value
		
		oldImgBoxWidth.value = 0
		oldImgBoxHeight.value = 0
		oldImgBoxLeft.value = 0
		oldImgBoxTop.value = 0

		preSquareWidth.value = preSquareWidthOld.value
		preSquareHeight.value = preSquareHeightOld.value
		preSquareLeft.value = preSquareLeftOld.value
		preSquareTop.value = preSquareTopOld.value
		preSquareWidthOld.value = pqw
		preSquareHeightOld.value = pqh
		preSquareLeftOld.value = pql
		preSquareTopOld.value = pqt
	}
}

// 缩放
function imgZoom(num) {
	const mv = multiple.value + num
	if (mv > 400) {
		multiple.value = 400
	} else if(mv >= 1) {
		multiple.value = mv
	} else{
		multiple.value = 1
	}

	const oldwidth = imgBoxWidth.value
	const oldheight = imgBoxHeight.value
	imgBoxWidth.value = (multiple.value / 100 * imgWidth.value).toFixed(6)
	imgBoxHeight.value = (multiple.value / 100 * imgHeight.value).toFixed(6)
	imgBoxLeft.value = imgBoxLeft.value + (oldwidth - imgBoxWidth.value) / 2
	imgBoxTop.value = imgBoxTop.value + (oldheight - imgBoxHeight.value) / 2
	
	preSquareWidth.value =  preWidth.value / (imgBoxWidth.value / imgContentWidth.value)
	preSquareHeight.value = preHeight.value / (imgBoxHeight.value / imgContentHeight.value)
	preSquareLeft.value = -imgBoxLeft.value / (imgContentWidth.value / preSquareWidth.value)
	preSquareTop.value = -imgBoxTop.value / (imgContentHeight.value / preSquareHeight.value)
	emit('onWHChange', {cwidth: imgBoxWidth.value, cheight: imgBoxHeight.value})
}

function fullScreen() {
	emit('fullScreen')
}

// 预览框移动
function handleMouseDownPreview(event) {
	event.preventDefault()
	const div = previewMapDiv.value
	const originX = event.screenX
	const originY = event.screenY
	const preSquareLeft1 = preSquareLeft.value
	const preSquareTop1 = preSquareTop.value
	const imgBoxLeft1 = imgBoxLeft.value
	const imgBoxTop1 = imgBoxTop.value
	const move = (e) => {
		const afterX = e.screenX
		const afterY = e.screenY
		preSquareLeft.value = preSquareLeft1 + (afterX - originX)
		preSquareTop.value = preSquareTop1 + (afterY - originY)
		
		// 计算图片偏移
		imgBoxLeft.value = imgBoxLeft1 - (afterX - originX) * (imgContentWidth.value / preSquareWidth.value)
		imgBoxTop.value = imgBoxTop1 - (afterY - originY) * (imgContentHeight.value / preSquareHeight.value)
	}
	div.addEventListener('mousemove', move)
	div.addEventListener('mouseup', () => {
		div.removeEventListener('mousemove', move)
	})
}

// 截图
const jieTu = ref('')
async function screenshot() {
	const canvas = document.createElement("canvas")
	// let canvasBox = jieTu.value
	let canvasBox = document.getElementById("jieTu")
	
	let width = 460
	let height = 460
	if (imgWidth.value < 200 ) {
		width = 200
	} else if (imgWidth.value < 400) {
		width = imgWidth.value
	}
	if (imgHeight.value < 200 ) {
		height = 200
	} else if (imgHeight.value < 400) {
		height = imgHeight.value
	}

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
	context.scale(p / getRatio(), p / getRatio());
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

function handleMouseover() {
	emit('onMouseover')
}

defineExpose({
	screenshot,
	setImgWhAndMap,
})

</script>

<style scoped lang="scss">
  @import "./style.scss";
</style>
