<template>
  <div class="file-top">
    <div class="top-left">
      <div @click="goBack">
        <i class="top-icon icon-back"></i>
      </div>
      <div @click="showFileList">
        <i
          class="top-icon"
          :class="isFileList ? 'icon-show' : 'icon-unshow'"
        ></i>
      </div>
      <div class="file-name">
        <span>{{ fileDetail.name }}</span>
      </div>
    </div>
    <div class="top-right" v-show="clientWidth > 600">
      <div class="btn-box">
        <el-tooltip
          effect="light"
          content="下载"
          placement="bottom"
          :show-after="400"
          :hide-after="300"
        >
          <el-button @click="downClick" :disabled="codingStatus !== 2 || (shareInfo.id && shareInfo.saveTo !== 1)">下载</el-button>
        </el-tooltip>
      </div>
      <div v-if="isWps && im == '1'" class="btn-box">
        <el-tooltip
          effect="light"
          content="发送"
          placement="bottom"
          :show-after="400"
          :hide-after="300"
        >
          <el-button @click="handleSend">发送</el-button>
        </el-tooltip>
      </div>
      <div class="btn-box share-btn" style="min-width: 50px" v-if="!shareInfo">
        <el-tooltip
          effect="light"
          content="分享"
          placement="bottom"
          :show-after="400"
        >
          <el-button @click="shareClick" :disabled="codingStatus !== 2">分享</el-button>
        </el-tooltip>
      </div>
      <!-- <div
        :disabled="fileType !== 'video' ? 'disabled' : ''"
        @click="preventFun(isPrevent)"
      >
        <el-tooltip
          effect="light"
          :content="
            fileType === 'video'
              ? isPrevent
                ? '关闭防录屏'
                : '开启防录屏'
              : '非视频文件无此功能'
          "
          placement="bottom"
          :show-after="600"
        >
          <span>防</span>
        </el-tooltip>
      </div> -->
      <div class="btn-box" v-if="!shareInfo">
        <UserMessage />
      </div>
      <div class="info-box" @click="handleShowInfo">
        <el-tooltip
          effect="light"
          content="文件信息"
          placement="bottom"
          :show-after="400"
        >
          <!-- <i class="show-icon icon-info"></i> -->
          <span>
            <svg-icon iconClass="icon_info2" :size="32"></svg-icon>
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  deleteFileOrFolder,
  renameFileOrFolder
} from "@/api/project/file.js"
import UserMessage from '@/layout/components/UserMessage/index.vue'
import { ElMessageBox, ElMessage } from 'element-plus';
const props = defineProps({
  fileType: {
    type: String,
    default: ''
  },
  isFileList: {
    type: Boolean,
    default: false,
  },
  clientWidth: {
    type: [Number, String],
    default: null
  },
  isPrevent: {
    type: Boolean,
    default: false
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  codingStatus: {
    type: Number,
    default: 2
  },
  shareInfo: {
    type: Object,
    default: {}
  },
  isWps: {
    type: Boolean,
    default: false
  },
})
const store = useStore();
const route = useRoute();
const router = useRouter();
const im = ref('')
const emit = defineEmits(['showFileList', 'onDown', 'handlePrevent', 'onShare', 'onShowInfo', 'goBack']);

onMounted(() => {
  im.value = route.query.im || ''
})

const fileDetail = computed(()=>{
  return store.state.clouddisk.fileDetail
})

function goBack() {
  // history.back()
  emit('goBack')
}

function showFileList() {
  emit('showFileList')
}


function shareClick() {
  emit('onShare');
}

function downClick() {
  emit('onDown')
}

function preventFun(val) {
  emit('handlePrevent', val)
}

function handleShowInfo() {
  emit('onShowInfo')
}

function handleSend() {
  window.webkit.messageHandlers.wpsSend.postMessage({
    fileCat: fileDetail.value.fileCat,
    id: fileDetail.value.id,
    downloadUrl: fileDetail.value.downloadUrl,
    name: fileDetail.value.name
  })
}


</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
