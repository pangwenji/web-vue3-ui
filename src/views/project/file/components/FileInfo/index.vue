<template>
  <div class="file-info-content">
    <div class="name">
      <div v-show="isReName">
        <el-input
          ref="renameRef"
          class="rename-input"
          maxlength="30"
          v-model="rename"
          @blur="isReName = false"
          @change="handleRenameChange(index)"
          placeholder="请输入文件名"
        />
      </div>
      <div v-show="!isReName" class="info-name" @click="renameClick">
        <span>{{ fileDetail.name }}</span>
      </div>
    </div>
    <div>
      <div class="info-title info-title0">基础信息</div>
      <ul>
        <li>
          <span class="info-l">格式类型</span>
          <span>{{ fileDetail.suffix?.substr(1) }}</span>
        </li>
        <li>
          <span class="info-l">上传者</span>
          <span>{{ fileDetail.user?.nickName }}</span>
        </li>
        <li>
          <span class="info-l">上传日期</span>
          <span>{{ fileDetail.createTime?.slice(0, -3) }}</span>
        </li>
        <li>
          <span class="info-l">文件大小</span>
          <span>{{ formatFileSize(fileDetail.size) }}</span>
        </li>
      </ul>
    </div>
    <div v-if="fileDetail.fileCat === 'video'">
      <div class="info-title">视频信息</div>
      <ul>
        <li>
          <span class="info-l">分辨率</span>
          <span>
            {{ fileDetail.metaData?.VideoStreamSet[0]?.Width }} x
            {{ fileDetail.metaData?.VideoStreamSet[0]?.Height }}
          </span>
        </li>
        <li>
          <span class="info-l">帧率</span>
          <span>{{ fileDetail.metaData?.VideoStreamSet[0]?.Fps }} fps</span>
        </li>
        <li>
          <span class="info-l">时长</span>
          <span>{{ formatDuration(fileDetail.metaData?.Duration) }}</span>
        </li>
        <li>
          <span class="info-l">比特率</span>
          <span>{{ bitrateFormat(fileDetail.metaData?.VideoStreamSet[0]?.Bitrate) }}</span>
        </li>
        <li>
          <span class="info-l">视频编码</span>
          <span>{{ fileDetail.metaData?.VideoStreamSet[0]?.Codec.toUpperCase() }}</span>
        </li>
      </ul>
    </div>
    <div
      v-if="fileDetail.fileCat === 'audio' || fileDetail.fileCat === 'video'"
    >
      <div class="info-title">音频信息</div>
      <ul>
        <li>
          <span class="info-l">声道</span>
          <span>2</span>
        </li>
        <li>
          <span class="info-l">采样率</span>
          <span
            >{{(fileDetail?.metaData?.AudioStreamSet?.[0]?.SamplingRate / 1000).toFixed(2)}}KHz</span
          >
        </li>
        <li>
          <span class="info-l">比特率</span>
          <span
            >{{ bitrateFormat(fileDetail.metaData?.AudioStreamSet?.[0]?.Bitrate) }}</span
          >
        </li>
        <li>
          <span class="info-l">音频编码</span>
          <span>{{fileDetail.metaData?.AudioStreamSet?.[0]?.Codec}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import {
  renameFileOrFolder
} from "@/api/project/file.js"
import { ElMessage, ElLoading } from 'element-plus';

const props = defineProps({
  isShare: {
    type: Boolean,
    default: false
  },
})

const store = useStore();
const fileDetail = computed(() => {
  return store.state.file.fileDetail
});
const isReName = ref(false)
const rename = ref('')
const renameRef = ref('')

// 文件大小格式化
function formatFileSize(fileSize) {
  let temp = 0
  let unit = ""
  if (fileSize < 1024) {
    unit = "B"
  } else if (fileSize < 1024 * 1024) {
    temp = fileSize / 1024
    unit = "KB"
  } else if (fileSize < 1024 * 1024 * 1024) {
    temp = fileSize / (1024 * 1024)
    unit = "MB"
  } else {
    temp = fileSize / (1024 * 1024 * 1024)
    unit = "GB"
  }
  temp = temp.toFixed(2)
  return temp + unit
}

// 视频时长计算
function formatDuration(time) {
	time = Math.floor(time)
	let [h, m, s] = [0, 0, 0]
	if (time < 60) {
		s = time
	} else if (time < 60 * 60) {
		s = time % 60
		m = (time - s) / 60
	} else {
		m = time / 60 * 60
		h = (time - m) / (60 * 60)
		s = time % 60
		m = (m - s) / 60
	}
	if (s < 10) s = '0'+s
	if (m < 10) m = '0'+m
	if (h < 10) h = '0'+h
	return `${h}:${m}:${s}`
}

function bitrateFormat(bi) {
  let temp = 0
  let unit = ""
  if (bi < 1000) {
    unit = "bps"
  } else if (bi < 1000 * 1024) {
    temp = bi / 1000
    unit = "Kbps"
  } else if (bi < 1000 * 1024 * 1024) {
    temp = bi / (1000 * 1024)
    unit = "Mbps"
  } else {
    temp = bi / (1000 * 1024 * 1024)
    unit = "Gbps"
  }
  temp = temp.toFixed(2)
  return temp + unit
}

function renameClick() {
  if (props.isShare) return;
  isReName.value = true;
  rename.value = fileDetail.value.name.substr(0, fileDetail.value.name.length - fileDetail.value.suffix.length)
  nextTick(() => {
    renameRef.value.focus()
  })
}

function handleRenameChange() {
  if (!rename.value) {
    ElMessage.error('文件名不能为空')
    return;
  }
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const params = {
    id: fileDetail.value.id,
    name: rename.value + fileDetail.value.suffix
  }
  renameFileOrFolder(params).then(res => {
    fileDetail.value.name = rename.value + fileDetail.value.suffix
    // store.dispatch("file/getProjectFileDetail",{id: fileDetail.value.id});
    ElMessage({
      type: 'success',
      message: '编辑文件名成功',
    })
    renameRef.value.blur()
    loading.close()
  }).catch(err => {
    loading.close()
  })

}
</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
