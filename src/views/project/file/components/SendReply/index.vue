<template>
	<div class="send-reply-box">
		<div @click.stop>
			<!--文本框-->
			<div class="editor-box" :style="{...eBoxStyle}">
				<div
				class="editor"
				:style="{...textStyle}"
				ref="divRef"
				contenteditable
				:draggable="false"
				@keyup="handkeKeyUp"
				@keydown="handleKeyDown"
				@focus="textFocus"
				@blur="textBlur"
				:placeholder="placeholder"
				></div>
			</div>

			<!-- <el-button v-if="!showBottom && !shareToken" class="attachment" :loading="uploadStatus" style="font-size: 12px;color: #0459FF;bottom: -42px;" @click.stop="handleFile"> -->
			<div v-if="!showBottom && !shareToken" class="attachment" :loading="uploadStatus" style="font-size: 12px;color: #0459FF;bottom: -42px;">
				<el-tooltip
					placement="top"
          popper-class="tooltip-attachment-box"
          effect="light"
					:teleported="false"
					:show-arrow="!attachmentList.length>0"
				>
					<template #content>
						<div @click.stop="false" class="attachment-cover" v-if="attachmentList.length > 0">
							<div
								class="cover-item"
								v-for="(item, index) in attachmentList"
								:key="item.id"
								@mouseenter="attaHoverIndex = item.id"
								@mouseleave="attaHoverIndex = 0"
							>
								<img
									@dragstart.prevent
									style="z-index:2;"
									v-if="attaHoverIndex === item.id"
									class="delicon"
									:src="deleteIcon"
									alt=""
									@click.stop="removeAttachment(index)"
								>
								<!-- <img :src="item.cover" alt=""> -->
								<el-image
									@dragstart.prevent
									style="z-index:1;max-width: 50px; max-height: 36px;"
									:src="item.cover"
									:preview-src-list="[item.sourceUrl]"
									:initial-index="0"
									:preview-teleported="true"
									fit="cover"
								/>
							</div>
						</div>
						<div v-else style="padding: 0 6px;display:flex; justify-content: center;">
							添加附件
						</div>
					</template>
					<!-- <template #reference> -->
						<div @click.stop="handleFile" style="width:100%;height:100%;display:flex;justify-content: center;align-items: center;font-size: 12px;color: #0459FF;">
							<img @dragstart.prevent class="attachment-icon" :src="attachmentList.length>0?attachmentIcon2:attachmentIcon" alt="">
							<span v-if="attachmentList.length > 0">{{attachmentList.length}}</span>
						</div>
					<!-- </template> -->
				</el-tooltip>
			</div>
			<!-- </el-button> -->
			<el-button v-if="!showBottom" class="top-at" @click.stop="handleClickAt">
				<svg-icon className="actions-menu-icon" iconClass="at-user" :size="20"></svg-icon>
			</el-button>
			<el-button v-if="!showBottom" :loading="sendReplyStatus" class="top-send" @click.stop="sendReply">发送</el-button>
		</div>

		<div v-if="showBottom" class="reply-cover">
			<div
				class="cover-item"
				v-for="(item, index) in attachmentList"
				:key="item.id"
				@mouseenter="attaHoverIndex = item.id"
				@mouseleave="attaHoverIndex = 0"
				@click.stop=""
			>
				<img
					v-if="attaHoverIndex === item.id"
					class="delicon"
					:src="deleteIcon"
					alt=""
					@dragstart.prevent
					@click.stop="removeAttachment(index)"
				>
				<!-- <img :src="item.cover" alt=""> -->
				<el-image
					style="max-width: 50px; max-height: 36px;width: auto;height: auto;"
					:src="item.cover"
					:preview-src-list="[item.sourceUrl]"
					:initial-index="0"
					@dragstart.prevent
					fit="cover"
				/>
			</div>
		</div>
		<div v-if="showBottom" class="reply-control reply-box">
			<div>
				<span @click.stop="handleClickAt">@成员</span>
			</div>
			<div>
				<span @click.stop="cancelReply">取消</span>
				<span v-if="!shareToken" style="margin-left:6px" @click.stop="handleFile">添加附件</span>
				<span @click.stop="sendReply" style="margin-left:6px">发送</span>
			</div>
		</div>
		<AtDialog
		 v-if="showDialog"
		 :visible="showDialog"
		 :position="position"
		 :queryString="queryString"
		 @onPickUser="handlePickUser"
		 @onHide="handleHide"
    ></AtDialog>

		<input
      type="file"
      ref="uploadFile"
      :webkitdirectory="false"
      accept=".jpg,.jpeg,.png"
      hidden
      @change="handleUploadFile"
			@click.stop=""
    />
	</div>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import AtDialog from '../AtDialog/index.vue'
import attachmentIcon from '@/assets/icons/attachment.png'
import attachmentIcon2 from '@/assets/icons/attachment2.png'
import deleteIcon from '@/assets/icons/clouddisk/icon_delete@2x.png'
import UploadFile from "@/utils/uploadFile"
import {
  publicCreateUploadSign,
  publicCreateUploadFile,
} from '@/api/project/files.js'
import { nextTick, onUnmounted, watch } from '@vue/runtime-core';
import { bottom } from '@popperjs/core';

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
	showBottom: {
    type: Boolean,
    default: false
	},
	textStyle: {
		type: Object,
		default: {
			width: '100%',
			height: '60px',
			background: '#0A0B0D',
		}
	},
	eBoxStyle: {
		type: Object,
		default: {
			border: '1px solid #3468FE'
		}
	},
	location: {
    type: String,
    default: 'bottom' // top bottom
	},
  shareDetail: {
    type: Object,
    default: {}
  },
	fileDetail: {
    type: Object,
    default: {}
  },
	sendReplyStatus: {
    type: Boolean,
    default: false
	},
	scrollTop: {
		type: Number,
		default: 0
	}
})

const route = useRoute()
const store = useStore();
const emit = defineEmits();
const node = ref(''); // 获取到节点
const user = ref(''); // 选中项的内容
const endIndex = ref(''); // 光标最后停留位置
const queryString = ref(''); // 搜索值
const showDialog = ref(false); // 是否显示弹窗
const position = ref({x: 0, y: 0}); // 弹窗显示位置
const uploadFile = ref()
const attachmentList = reactive([])
const attaHoverIndex = ref(0)

const memberList = computed(()=>{
  return store.state.file.memberList;
})
// const atList = ref([]) // @列表
// const isAtAll = ref(false) // 是否@所有人
const shareToken = ref('')
const storeScrollTop = ref(0)

onMounted(() => {
	shareToken.value = route.query.shareToken || ''
	window.uploadSuccess = uploadSuccess
	divRef.value.addEventListener('paste', handlePaste)
	storeScrollTop.value = props.scrollTop
})

onUnmounted(() => {
	document.removeEventListener('paste', handlePaste)
})

// 粘贴处理
function handlePaste(e) {
	e.stopPropagation();
	e.preventDefault();
	let text = '', event = (e.originalEvent || e);
	if (event.clipboardData && event.clipboardData.getData) {
		text = event.clipboardData.getData('text/plain');
	} else if (window.clipboardData && window.clipboardData.getData) {
		text = window.clipboardData.getData('Text');
	}
	if (document.queryCommandSupported('insertText')) {
		document.execCommand('insertText', false, text);
	} else {
		document.execCommand('paste', false, text);
	}
}

watch(()=>props.scrollTop, newVal => {
	position.value.y = storeY.value + (storeScrollTop.value - newVal)
})

watch(attachmentList, newVal => {
	if (props.showBottom) {
		if (attachmentList.length > 4) {
			props.eBoxStyle.height = '164px'
		} else if (attachmentList.length > 0) {
			props.eBoxStyle.height = '114px'
		} else {
			props.eBoxStyle.height = '62px'
			props.textStyle.height = '60px'
		}
	}
})

// 客户端上传成功返回
function uploadSuccess(data = null) {
	ElMessage.success('上传成功')
	if (data) {
		attachmentList.push(data)
		uploadStatus.value = false
	}
	return {msg: 'success'}
}

// 取消回复
function cancelReply() {
  emit('cancelReply');
}

const divRef = ref('');
// 发送回复
function sendReply() {
	const content = divRef.value.innerText || '';
	if (content === ''){
		ElMessage({
			message: '回复内容不能为空',
			type: 'warning',
			center: true,
			'show-close': true
		});
		return;
	};
	if (props.shareDetail?.allowComments === 0) {
		ElMessage.error('没有评论权限')
		return;
	}

	let isAtAll = false
	if (content.indexOf('@所有人') !== -1) {
		isAtAll = true
	}
	
	let remindArr = []
	let atTexts = document.getElementsByClassName('at-button');
	for(let i=0; i<atTexts.length; i++){
		const user = JSON.parse(atTexts[i].dataset.user)
		if (!remindArr.includes(user.id)) {
			remindArr.push(user.id)
		}
	}
	if (remindArr.includes(0)) {
		remindArr = []
		memberList.value.forEach(el => {
			remindArr.push(el.user.userId)
		})
	}
	const remind = remindArr.join(',')

	let attachmentId = []
	let attachmentArr = []
	if (attachmentList.length > 0) {
		attachmentList.forEach(el => {
			attachmentId.push(el.encryptedId)
			attachmentArr.push(el)
		});
	}
	divRef.value.innerText = '';
	attachmentList.length = 0
	emit('sendReply', {content, remind, attachmentId, attachmentArr});
}

// 获得焦点
function textFocus() {
	emit('focus')
}

// 失去焦点
function textBlur() {
	emit('blur')
}

// 获取光标位置
function getCursorIndex() {
	const selection = window.getSelection()
	return selection.focusOffset // 选择开始处 focusNode 的偏移量
}
// 获取节点
function getRangeNode() {
	const selection = window.getSelection()
	return selection.focusNode // 选择的结束节点
}
// 弹窗出现的位置
function getRangeRect() {
	const selection = window.getSelection()
	const range = selection.getRangeAt(0) // 是用于管理选择范围的通用对象
	const rect = range.getClientRects()[0] // 择一些文本并将获得所选文本的范围
	if (!rect) {
		return false
	}
	const documentHeight = document.documentElement.clientHeight;
	const documentWidth = document.documentElement.clientWidth;
	let LINE_HEIGHT = 20

	const atHeight = memberList.value.length * 34 + 56
	if (props.location === 'top' || (documentHeight - rect.y) < atHeight ) {
		if (memberList.value.length < 10) {
			LINE_HEIGHT = -atHeight
    } else {
      LINE_HEIGHT = -362
    }
	}
	if ((documentWidth - rect.x) < 160) {
		rect.x = documentWidth - 160
	}
	return {
		x: rect.x,
		y: rect.y + LINE_HEIGHT
	}
}
// 是否展示 @
function showAt() {
	const node = getRangeNode()
	if (!node || (node.nodeType > 1 && node.nodeType !== Node.TEXT_NODE)) return false
	const content = node.textContent || ''
	const regx = /@([^@\s]*)$/
	const match = regx.exec(content.slice(0, content.length))
	return match && match.length === 2
}
// 获取 @ 用户
function getAtUser() {
	const content = getRangeNode().textContent || ''
	const regx = /@([^@\s]*)$/
	const match = regx.exec(content.slice(0, getCursorIndex()))
	if (match && match.length === 2) {
		return match[1]
	}
	return undefined
}
// 创建标签
function createAtButton(user) {
	const btn = document.createElement('span')
	btn.style.display = 'inline-block'
	btn.dataset.user = JSON.stringify(user)
	btn.className = 'at-button'
	btn.contentEditable = 'false'
	btn.textContent = `@${user.name}`
	const wrapper = document.createElement('span')
	wrapper.style.display = 'inline-block'
	wrapper.contentEditable = 'false'
	const spaceElem = document.createElement('span')
	spaceElem.style.whiteSpace = 'pre'
	spaceElem.textContent = '\u200b'
	spaceElem.contentEditable = 'false'
	const clonedSpaceElem = spaceElem.cloneNode(true)
	wrapper.appendChild(spaceElem)
	wrapper.appendChild(btn)
	wrapper.appendChild(clonedSpaceElem)
	return wrapper
}
function replaceString(raw, replacer) {
	return raw.replace(/@([^@\s]*)$/, replacer)
}
// 插入@标签
function replaceAtUser(user) {
	if (node.value && user) {
		// return
		let content = node.value.textContent || ''
		let parentNode = node.value.parentNode
		if (atFlag.value) {
			content = ''
			parentNode = node.value
		}
		const preSlice = replaceString(content.slice(0, endIndex.value), '')
		const restSlice = content.slice(endIndex.value)
		const nextNode = node.value.nextSibling
		const previousTextNode = new Text(preSlice)
		const nextTextNode = new Text('\u200b' + restSlice) // 添加 0 宽字符
		const atButton = createAtButton(user)
		if (!atFlag.value) {
			parentNode.removeChild(node.value)
		} else {
			const tspan = document.getElementById('keydsd')
			parentNode.removeChild(tspan)
		}
		// 插在文本框中
		if (nextNode) {
			parentNode.insertBefore(previousTextNode, nextNode)
			parentNode.insertBefore(atButton, nextNode)
			parentNode.insertBefore(nextTextNode, nextNode)
		} else {
			parentNode.appendChild(previousTextNode)
			parentNode.appendChild(atButton)
			parentNode.appendChild(nextTextNode)
		}
		// 重置光标的位置
		const range = new Range()
		const selection = window.getSelection()
		range.setStart(nextTextNode, 0)
		range.setEnd(nextTextNode, 0)
		selection.removeAllRanges()
		selection.addRange(range)
		//遍历插入的@人节点，设置颜色、不可编辑
		let atTexts = document.getElementsByClassName('at-button');
		for(let i=0; i<atTexts.length; i++){
			atTexts[i].style.color = '#0459FF';
			atTexts[i].style.margin = '0 4px';
		}
		atFlag.value = false
	}
}

// 点击at用户
const atFlag = ref(false)
function handleClickAt() {

	divRef.value.focus()
	const node = window.getSelection();
	node.selectAllChildren(divRef.value);
	node.collapseToEnd();

	const range = node.getRangeAt(0);
	range.deleteContents();
	let span = window.document.createElement("span");
	span.textContent = '@'
	span.id = 'keydsd'
	range.insertNode(span)
	atFlag.value = true

	handkeKeyUp()
	node.selectAllChildren(divRef.value);
	node.collapseToEnd();
}

// 键盘抬起事件
const storeY = ref(0)
function handkeKeyUp() {
	if (showAt()) {
		node.value = getRangeNode()
		endIndex.value = getCursorIndex()
		position.value = getRangeRect()
		storeY.value = position.value?.y
		if (!storeY.value) return
		queryString.value = getAtUser() || ''
		showDialog.value = true
	} else {
		showDialog.value = false
	}
}
// 键盘按下事件
function handleKeyDown (e) {
	if (showDialog.value) {
		if (e.code === 'ArrowUp' ||
			e.code === 'ArrowDown' ||
			e.code === 'Enter') {
			e.preventDefault()
		}
	}
}
// 插入标签后隐藏选择框
function handlePickUser (user) {
	replaceAtUser(user)
	user.value = user
	showDialog.value = false

	// if (user.id === 0) {
	// 	isAtAll.value = true
	// }
	// if (!isAtAll.value) {
	// 	let ishas = false
	// 	for (let i = 0; i < atList.value.length; i++) {
	// 		if (atList.value[i].id === user.id) {
	// 			ishas = true
	// 			break
	// 		}
	// 	}
	// 	if (!ishas) {
	// 		atList.value.push({id: user.id, name: user.name})
	// 	}
	// }
}
// 隐藏选择框
function handleHide () {
	showDialog.value = false
}
// 显示选择框
function handleShow () {
	showDialog.value = true
}

// 使失去焦点
function handleBlur() {
	divRef.value.blur()
}

// 上传文件夹/文件夹
let fileId = null;
const handleFile = (e,id) => {
	if (attachmentList.length > 5) {
		ElMessage.warning('附件最多可上传6张图片')
		return;
	}
	if (route.query.platform === 'mac') {
  	window.webkit.messageHandlers.upload.postMessage({'msg':'hello'})
		return
	}
	fileId = id
	uploadFile.value.click()
}


// 上传文件
const uploadStatus = ref(false)
const handleUploadFile = (e) => {
	const files = e.target.files;
	const fType = files[0].type
	if (!['image/jpeg','image/png'].includes(fType)) {
		ElMessage.error('附件只支持 jpg/jpeg/png 格式文件')
		return;
	}
	uploadStatus.value = true
	for(var File of files){
		const uploadData = new UploadFile({File, getUploadSign:getUploadSignFun, createUploadFile:CreateUploadFileFun});
		uploadData.uploadFile();
	}
  uploadFile.value.value = ''
}

// 获取签名
const getUploadSignFun = (obj,callback,errorback)=>{
  const projectId = props.fileDetail.projectId;
  const filename = obj.FileName;
  const size = obj.FileSize;
  const md5 = obj.FileMD5;

  publicCreateUploadSign({projectId,filename,size, md5}).then(res=>{
    callback(res.data)
  }).catch(err=>{
    errorback(err)
  })
}

// 创建文件
const CreateUploadFileFun = ({resultData,options},callback,errorback)=>{
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
  }
  publicCreateUploadFile(params).then(res=>{
		// store.dispatch("clouddisk/getCloudFileList",{parent_id: 0})
		attachmentList.push(res.data)
		uploadStatus.value = false
    callback(res.data)
  }).catch(err=>{
		uploadStatus.value = false
    errorback(err)
  })
}

// 移除附件
function removeAttachment(index) {
	attachmentList.splice(index, 1)
}



defineExpose({
	handleBlur
})
</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
<style  lang="scss">
.tooltip-attachment-box {
	white-space: nowrap;
	color: #000;
}
</style>
