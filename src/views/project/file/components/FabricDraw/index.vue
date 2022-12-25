<template>
	<div class="fabric-box">
		<canvas id="canvas"></canvas>
	</div>
</template>

<script setup>
import { watch } from '@vue/runtime-core';
import {fabric} from 'fabric';

const route = useRoute()
const selectColor = ref('#f13e49')
const canvas = ref(null)
const x = ref('')
const y = ref('')
const mouseFrom = ref({})
const mouseTo = ref({})
const drawType = ref(null) //当前绘制图像的种类
const canvasObjectIndex = ref(0)
const textbox = ref(null)
const rectangleLabel = ref('warning')
const drawWidth = ref(3) //笔触宽度
const color = ref('#E34F51') //画笔颜色
const drawingObject = ref(null) //当前绘制对象
const moveCount = ref(1) //绘制移动计数器
const doDrawing = ref(false) // 绘制状态
const canvasWidth = ref(0)
const canvasHeight = ref(0)

//polygon 相关参数
const polygonMode = ref(false)
const pointArray = ref([])
const lineArray = ref([])
const activeShape = ref(false)
const activeLine = ref('')
const line = ref({})

// 记录操作内容
const historyList = ref([]) //历史列表
const historyFallback = ref([]) //历史撤销

const props = defineProps({
	// fabColor: {
	// 	type: String,
	// 	default: '#f13e49'
	// }
	cwidth: {
		type: Number,
		default: 0
	},
	cheight: {
		type: Number,
		default: 0
	},
	dwidth: {
		type: Number,
		default: 0
	}
})

const canwidth = ref(0)
const canheight = ref(0)
const CANVAS_WIDTH = ref(0)
const CANVAS_HEIGHT = ref(0)
const fileCat = ref(null)
onMounted(() => {
	fileCat.value = route.query.fileCat
	// if (fileCat.value === 'audio') {
	// 	const p = props.cwidth / props.cheight
	// 	if (p < 1) {
	// 		canwidth.value = 400
	// 		canheight.value = 400/p
	// 	} else {
	// 		canwidth.value = 800
	// 		canheight.value = 800/p
	// 	}
	// } else {
		canwidth.value = props.cwidth
		canheight.value = props.cheight
		CANVAS_WIDTH.value = canwidth.value
		CANVAS_HEIGHT.value = canheight.value
	// }
	canvas.value = new fabric.Canvas("canvas", {
		// skipTargetFind: false, //当为真时，跳过目标检测。目标检测将返回始终未定义。点击选择将无效
		selectable: false,  //为false时，不能选择对象进行修改
		selection: false,   // 是否可以多个对象为一组
		width: canwidth.value, // 宽 100px
    height: canheight.value, // 高 60px
		// interactive: false, // 禁止超出画布
	});
	canvas.value.selectionColor = "rgba(0,0,0,0.05)";
	canvas.value.on("mouse:down", mousedown);
	canvas.value.on("mouse:move", mousemove);
	canvas.value.on("mouse:up", mouseup);
	canvas.value.on('object:moving', canvasmoving);
})

const wp = ref(1)
watch(() => props.cwidth, newVal => {
	if (newVal < 500) {
		return
	}
	setCanvasWHZ(newVal)
})

function setCanvasWHZ(newVal) {
	if (props.dwidth > 0) {
		wp.value = newVal / props.dwidth
	} else {
		wp.value = newVal / CANVAS_WIDTH.value
	}
	canvas.value.setZoom(wp.value)
	canvas.value.setWidth(newVal)
	canvas.value.setHeight(props.cheight)
}

// 画布拖动禁止超出边界
function canvasmoving(e) {
	const obj = e.target;
		// if object is too big ignore
	if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
		return;
	}
	obj.setCoords();        
	// top-left  corner
	if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
		obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
		obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
	}
	// bot-right corner
	if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
		obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
		obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
	}
}

function colorSelect(e) {
	selectColor.value = e;
	canvas.value.freeDrawingBrush.color = e;
}

// 开始绘制时，指定绘画种类
function drawTypeChange(e) {
	setCanvasWHZ(props.cwidth)
	if (drawType.value === e && drawType.value == 'text') {
		drawing();
	}
	drawType.value = e;
	canvas.value.skipTargetFind = !!e;
	if (textbox.value) {
		textbox.value.exitEditing();
		textbox.value.set("backgroundColor", "rgba(0,0,0,0)");
		if (textbox.value.text == "") {
			canvas.value.remove(textbox.value);
		}
		canvas.value.renderAll();
		textbox.value = null;
	}
	if (e == 'pen') {
		// isDrawingMode为true 才可以自由绘画
		canvas.value.isDrawingMode = true;
		canvas.value.freeDrawingBrush.color = selectColor.value;
		canvas.value.freeDrawingBrush.width = drawWidth.value;
		canvas.value.freeDrawingBrush.limitedToCanvasSize = true; // 禁止超出画布
	} else if (e == 'fallback' || e == 'forward' || e == 'clear') {
		handleAction(drawType.value);
		canvas.value.isDrawingMode = false;
	} else {
		canvas.value.isDrawingMode = false;
	}
}

// 鼠标按下时触发
function mousedown(e) {
	canvasWidth.value = document.getElementById('canvas').offsetWidth
	canvasHeight.value = document.getElementById('canvas').offsetHeight
	// 记录鼠标按下时的坐标
	const xy = e.pointer || transformMouse(e.e.offsetX, e.e.offsetY);
	xy.x = xy.x/wp.value
	xy.y = xy.y/wp.value
	mouseFrom.value.x = xy.x;
	mouseFrom.value.y = xy.y;
	doDrawing.value = true;
	if (drawType.value == 'text') {
		drawing();
	}

	if (drawType.value === '') {
		const activeObjects = canvas.value.getActiveObjects();
		// if (activeObjects.length > 0) {
		// 	selectColor.value = activeObjects[0].fill;
		// }
	}
	if (textbox.value) {
		textbox.value.enterEditing();
		textbox.value.hiddenTextarea.focus();
	}
}

// 鼠标松开执行
function mouseup(e) {
	const xy = e.pointer || transformMouse(e.e.offsetX, e.e.offsetY);
	mouseTo.value.x = xy.x;
	mouseTo.value.y = xy.y;
	moveCount.value = 1;
	if (drawType.value == 'pen') {
		const obj = canvas.value._objects[canvas.value._objects.length - 1];
		historyList.value.push({
			type: drawType.value,
			data: [obj],
		});
		historyFallback.value = [];
	}
	if (drawingObject.value) {
		historyList.value.push({
			type: drawType.value,
			data: [drawingObject.value],
		});
		drawingObject.value = null;
		historyFallback.value = [];
	}
	doDrawing.value = false;
}

//鼠标移动过程中已经完成了绘制
function mousemove(e) {
	if (!doDrawing.value) {
		//减少绘制频率
		return;
	}
	moveCount.value++;
	const xy = e.pointer || transformMouse(e.e.offsetX, e.e.offsetY);
	xy.x = xy.x/wp.value
	xy.y = xy.y/wp.value
	// 禁止超出画布
	if (xy.x < 4) {
		xy.x = 4
	}
	if (xy.y < 4) {
		xy.y = 4
	}
	if (xy.x > canvas.value.width/wp.value-4) {
		xy.x = canvas.value.width/wp.value - 4
	}
	if (xy.y > canvas.value.height/wp.value-4) {
		xy.y = canvas.value.height/wp.value - 4
	}
	mouseTo.value.x = xy.x;
	mouseTo.value.y = xy.y;
	// 多边形与文字框特殊处理
	if (drawType.value != 'text') {
		drawing(e);
	}
}

function deleteObj() {
	historyList.value.push({
		type: 'deleteObjs',
		data: canvas.value.getActiveObjects(),
	});
	canvas.value.getActiveObjects().map((item) => {
		canvas.value.remove(item);
	});
}

function transformMouse(mouseX, mouseY) {
	return { x: mouseX / 1, y: mouseY / 1 };
}

function drawing(e) {
	const color = selectColor.value;
	if (drawingObject.value) {
		canvas.value.remove(drawingObject.value);
	}
	let canvasObject = null;
	const [left, top, mouseFromVal, mouseToVal] = [mouseFrom.value.x, mouseFrom.value.y, mouseFrom.value, mouseTo.value];
	let [x1, x2, y1, y2] = [mouseFromVal.x, mouseToVal.x, mouseFromVal.y, mouseToVal.y];
	let w, h, vh, path;

	switch (drawType.value) {
		case 'arrow': //箭头
			w = x2 - x1
			h = y2 - y1
			vh = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
			const sh = Math.cos((30 * Math.PI) / 180) * (vh / 6)
			const sin = h / vh
			const cos = w / vh
			const wh = ((vh * 5) / 6) * Math.tan((2 * Math.PI) / 180)
			const w1 = wh * sin
			const h1 = wh * cos
			const centerx = sh * cos
			const centery = sh * sin
			/**
			 * centerx,centery 表示起始点，终点连线与箭头尖端等边三角形交点相对x，y
			 * w1 ，h1用于确定四个点
			 */

			path = ' M ' + x1 + ' ' + y1;
			path += ' L ' + (x2 - centerx + w1) + ' ' + (y2 - centery - h1);
			path +=
				' L ' + (x2 - centerx + w1 * 2) + ' ' + (y2 - centery - h1 * 2);
			path += ' L ' + x2 + ' ' + y2;
			path +=
				' L ' + (x2 - centerx - w1 * 2) + ' ' + (y2 - centery + h1 * 2);
			path += ' L ' + (x2 - centerx - w1) + ' ' + (y2 - centery + h1);
			path += ' Z';
			canvasObject = new fabric.Path(path, {
				stroke: color,
				fill: color,
				strokeWidth: 2,
				hasControls: false,
			});
			break;
		case 'ellipse': //椭圆
			// 按shift时画正圆，只有在鼠标移动时才执行这个，所以按了shift但是没有拖动鼠标将不会画圆
			if (e.e.shiftKey) {
				x2 - left > y2 - top
					? (y2 = top + x2 - left)
					: (x2 = left + y2 - top);
			}
			canvasObject = new fabric.Ellipse({
				left: (x2 - left) / 2 + left,
				top: (y2 - top) / 2 + top,
				stroke: color,
				fill: 'rgba(255, 255, 255, 0)',
				originX: 'center',
				originY: 'center',
				rx: Math.abs(left - x2) / 2,
				ry: Math.abs(top - y2) / 2,
				strokeWidth: drawWidth.value,
				hasControls: false,
			});
			break;
		case 'rectangle': //长方形
			// 按shift时画正方型
			if (e.e.shiftKey) {
				x2 - left > y2 - top
					? (y2 = top + x2 - left)
					: (x2 = left + y2 - top);
			}
			// var centerX = x1 - x2;
			// var centerY = y1 - y2;
			path =
				'M ' +
				x1 +
				' ' +
				y1 +
				' L ' +
				x2 +
				' ' +
				y1 +
				' L ' +
				x2 +
				' ' +
				y2 +
				' L ' +
				x1 +
				' ' +
				y2 +
				' L ' +
				x1 +
				' ' +
				y1 +
				' Z';
			canvasObject = new fabric.Path(path, {
				// left: left,
				// top: top,
				stroke: color,
				strokeWidth: drawWidth.value,
				fill: 'rgba(255, 255, 255, 0)',
				hasControls: false,
			});
			//也可以使用fabric.Rect
			break;
		case 'text': //文本框
			if (!textbox.value) {
				textbox.value = new fabric.Textbox('', {
					left: x1,
					top: y1 - 10,
					width: 280,
        	fontFamily: "SimHei", //字体
					fontSize: 22,
					borderColor: color,
					fill: color,
					border: color,
					splitByGrapheme: true, //是否自动换行
					backgroundColor: '#ffffff', //背景颜色
					// hasControls: false,
				});
				textbox.value.set({
					// borderColor: 'red', // 边框颜色
					// cornerColor: 'green', // 控制角颜色
					cornerSize: 8, // 控制角大小
					transparentCorners: false // 控制角填充色不透明
				})
				canvas.value.add(textbox.value);
				textbox.value.enterEditing();
				textbox.value.setControlVisible('mt', false)
				textbox.value.setControlVisible('mb', false)
				textbox.value.hiddenTextarea.focus();
				historyList.value.push({
					type: drawType.value,
					data: [textbox.value],
				});
				historyFallback.value = [];
			} else {
				textbox.value.exitEditing();
				textbox.value.set("backgroundColor", "rgba(0,0,0,0)");
        if (textbox.value.text == "") {
          canvas.value.remove(textbox.value);
        }
        canvas.value.renderAll();
        textbox.value = null;
			}
			break;

		default:
			break;
	}
	if (canvasObject) {
		canvasObject.set({
			// borderColor: 'red', // 边框颜色
			// cornerColor: 'green', // 控制角颜色
			cornerSize: 0, // 控制角大小
			// transparentCorners: false // 控制角填充色不透明
		})
		// canvasObject.index = getCanvasObjectIndex();\
		canvas.value.add(canvasObject); //.setActiveObject(canvasObject)
		drawingObject.value = canvasObject;
	}
}

function canvasLoadFromJSON(data) {
  canvas.value.loadFromJSON(data);
}

// 回退、前进、清除操作
function handleAction(type) {
	let item = [];
	switch (type) {
		case 'fallback': //回退
			if (historyList.value.length == 0) {
				return;
			}
			item = historyList.value.pop();
			if (item.type == 'deleteObjs') {
				//若是删除
				item.data.forEach((data) => {
					canvas.value.add(data);
				});
			} else {
				item.data.forEach((data) => {
					canvas.value.remove(data);
				});
				// var obj =  canvas.value._objects[canvas.value._objects.length - 1];
				// canvas.value.remove(obj);
			}
			historyFallback.value.push(item);
			break;
		case 'forward': //前进
			if (historyFallback.value.length == 0) {
				return;
			}
			item = historyFallback.value.pop();
			if (item.type == 'deleteObjs') {
				item.data.forEach((data) => {
					canvas.value.remove(data);
				});
			} else {
				item.data.forEach((data) => {
					canvas.value.add(data);
				});
			}
			historyList.value.push(item);
			break;
		case 'clear': //清除
			canvas.value.clear();
			historyList.value = [];
			historyFallback.value = [];
			break;
		default:
			break;
	}
}

function loadCanvas(data, dwidth) {
	if (!dwidth) return;
	canvas.value.setZoom(props.cwidth / dwidth)
	canvas.value.setWidth(props.cwidth)
	canvas.value.setHeight(props.cheight)
	canvasLoadFromJSON(data)
}

// 视图截图合成
async function videoScreenshots(url, callback) {
	const storeWidth = canvas.value.width
	const storeHeight = canvas.value.height
	const storeZoom = canvas.value.getZoom()
	const img = document.createElement("img");
	img.crossOrigin = 'Anonymous';
	img.src = url
	img.onload = function () {
		const options =  {
			top: 0,
			left: 0,
			scaleX: (canvas.value.width / img.width) / storeZoom,
			scaleY: (canvas.value.height / img.height) / storeZoom,
		}
		const canvasImage = new fabric.Image(img, options)
		canvas.value.add(canvasImage)
		historyList.value.forEach(el => {
			el.data.forEach(el2 => {
				canvas.value.add(el2)
			})
		})
		let scWidth = 460
		let scHeight = 460
		let p = scWidth / storeWidth //截图缩放比例
		if (img.width > img.height) {
			scHeight = storeHeight * p
		} else {
			p = scHeight / storeHeight
			scWidth = storeWidth * p
		}
		canvas.value.width = scWidth
		canvas.value.height = scHeight
		canvas.value.setZoom(storeZoom * p)
		const imgBase64 = canvas.value.toDataURL('image/png')

		canvas.value.width = storeWidth
		canvas.value.height = storeHeight
		canvas.value.setZoom(storeZoom)
		canvas.value.clear()
		historyList.value.forEach(el => {
			el.data.forEach(el2 => {
				canvas.value.add(el2)
			})
		})
		callback(imgBase64)
	}
}

defineExpose({
	canvas,
	colorSelect,
	drawTypeChange,
	canvasLoadFromJSON,
	handleAction,
	deleteObj,
	loadCanvas,
	videoScreenshots
})

</script>

<style scoped lang="scss">
  @import "./style.scss";
</style>
