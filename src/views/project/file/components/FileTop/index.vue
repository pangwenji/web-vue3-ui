<template>
  <div>
    <div class="file-top">
      <div class="top-left">
        <div v-show="!clientToken" @click="goBack">
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
        <div class="version">
          <div v-if="dialogVisible" class="mask"></div>
          <el-tooltip
            popper-class="tooltip-version-box"
            placement="bottom-start"
            effect="light"
            :width="480"
            trigger="click"
            v-model:visible="dialogVisible"
            @hide="versionManage = false"
            @after-leave="renameId = null"
          >
            <!-- <template #reference> -->
              <el-button @click="dialogVisible = !dialogVisible" round>
                V{{fileVersion}}&nbsp
                <el-icon><ArrowDownBold /></el-icon>
              </el-button>
            <!-- </template> -->
            <template #content>
            <div class="version-box">
              <div v-if="!versionManage" class="version-header">
                <span>全部版本</span>
                <div v-if="!isShare" class="header-r">
                  <span v-if="versionList.length > 1" class="manager-icon" @click.stop="versionManage = true"
                    ><el-icon><Files /></el-icon>管理</span
                  >
                  <span class="add-icon" @click.stop="handleFiles">
                      <el-icon><CirclePlus /></el-icon>添加
                  </span> 
                  <input type="file" ref="uploadFile" multiple :webkitdirectory="false" hidden @change="handleUploadFile" />
                </div>
              </div>
              <div v-else class="manager-header">
                <span class="back-icon" @click.stop="versionManage = false"
                  ><el-icon><ArrowLeft /></el-icon
                ></span>
                <span>管理版本</span>
              </div>
              <div>
                <el-scrollbar  :height="versionList.length<8?versionList.length*60:440">
                  <div
                    class="version-info"
                    :class="{'move-item': dragIndex === index}"
                    v-for="(item, index) in versionList"
                    :key="index"
                    :draggable="isDraggable"
                    @dragenter="handleDragEnter($event, index)"
                    @dragover="handleDragOver($event, index)"
                    @dragstart="handleDragStart(index)"
                    @dragend="handleDragEnd(index)"
                    @click="handleVersionClick(item)"
                  >
                    <div class="info-left">
                      <div
                        style="width:41px;margin:auto;display:flex;justify-content: center;text-overflow:ellipsis;padding:2px 8px;border-radius: 4px;"
                        :class="{checkVersion:(item.id === fileDetail.id && !versionManage)}"
                      >V{{ item.version }}</div>
                      <div
                        class="info-img"
                        style="background-size: cover;"
                      >
                        <FileType v-if="item.fileCat == 'video' || item.fileCat == 'image'" type="url" :url="item.cover"></FileType>
                        <FileType :type="item.fileCat" v-else></FileType>
                      
                      </div>
                      
                      <div v-if="renameId === item.id && versionManage">
                        <el-input
                          :id="'renameRef'+item.id"
                          v-model="rename"
                          maxlength="100"
                          @blur="() =>{renameId = null}"
                          @change="handleRenameChange(index)"
                          placeholder="请输入文件名"
                        />
                      </div>
                      <div
                        v-else
                        class="info-name"
                        :style="{color:(item.id === fileDetail.id && !versionManage)?'#3468FE':''}"
                      >
                        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" @click="renameClick(item)">{{ item.name }}</span>
                        <span>{{ item.createTime }}</span>
                      </div>
                    </div>
                    <div v-if="!versionManage">
                      <span v-if="item.id === fileDetail.id">
                        <el-icon color="#3468FE"><Check /></el-icon>
                      </span>
                    </div>
                    <div v-else class="info-r">
                      <span class="delete-icon" @click="handleFileId = item.id" v-contextmenu:contextmenuItemRef="{trigger:'click'}"
                        ><el-icon><Close /></el-icon
                      ></span>
                      <span
                        class="move-icon"
                        @mouseover="isDraggable = true"
                        @mouseout="isDraggable = false"
                      ><el-icon><DCaret /></el-icon
                      ></span>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
            </template>
          </el-tooltip>
        </div>
      </div>
      <div class="top-right" v-show="clientWidth > 600">
        <!-- <el-button type="primary" round>Primary</el-button> -->
        <div class="status-box" style="min-width: 94px;padding: 0 12px;background-color: #15161C;border-radius: 16px;border: 1px solid #15161C;">
          <el-dropdown
            :disabled="isShare"
            trigger="click"
            @command="handleCommentStatus"
          >
            <div class="el-dropdown-link cm-dropdown-link">
              <span
                class="cm-dot"
                :class="'cm-dot' + fileDetail.reviewStatus"
                v-if="fileDetail.reviewStatus > 0"
              ></span>
              <span v-if="fileDetail.reviewStatus > 0" style="font-size:14px;">{{commentStatusText}}</span>
              <span v-else>设置批注状态</span>

              <el-icon class="el-icon--right" color="#D0D4DE">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  class="comment-st-item"
                  v-for="item in commentStatus"
                  :command="item.key"
                  :key="item.key"
                  :divided="item.key === 0"
                >
                  <span
                    class="cm-dot"
                    :class="[
                      'cm-dot' + item.key,
                      item.key > 0 && item.key === fileDetail.reviewStatus
                        ? 'cm-dot-active'
                        : '',
                    ]"
                  ></span>
                  {{ item.value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-tooltip
            effect="light"
            :content="shareDetail?.saveTo===0?'无操作权限':(isShare || isWps)?'下载原件':'下载交付'"
            placement="bottom"
            :show-after="400"
            :hide-after="300"
          >
          <div style="min-width: 74px">
            <el-button :loading="downLoading" @click="downClick" :disabled="!downPermissions || shareDetail.saveTo === 0 || codingStatus !== 2">{{(isShare || isWps)?'下载原件':'下载交付'}}</el-button>
          </div>
        </el-tooltip>
        <div v-if="!isShare" class="share-btn" style="min-width: 50px">
          <el-tooltip
            effect="light"
            content="分享"
            placement="bottom"
            :show-after="300"
          >
            <el-button @click="handleShare" :disabled="codingStatus !== 2 || !sharePermissions">分享</el-button>
          </el-tooltip>
        </div>
        <div
          v-if="!isShare"
          class="flping"
          @click="preventFun(!fileAnti)"
        >
          <el-tooltip
            effect="light"
            :content="
              fileType === 'video'? (projectAnti? '项目设置中已开启防录屏' : (fileAnti ? '关闭防录屏': '开启防录屏')) : '非视频文件无此功能'
            "
            placement="bottom"
            :show-after="400"
          >
            <span>
              <svg-icon iconClass="icon_fangluping" :size="32"></svg-icon>
            </span>
          </el-tooltip>
        </div>
        <div v-if="!isShare">
          <transfer />
        </div>
        <div v-if="!isShare">
          <UserMessage />
        </div>
        <!-- <el-tooltip v-if="isShare"
          effect="light"
          :content="shareDetail?.saveTo===0?'无操作权限':'转存'"
          placement="bottom"
          :show-after="300"
        >
          <div>
            <el-button :disabled="shareDetail.saveTo === 0">转存</el-button>
          </div>
        </el-tooltip> -->
      </div>
    </div>
    <v-contextmenu :width="130" :beforeClose="contextmenuBeforeClose" ref="contextmenuItemRef">
      <v-contextmenu-item @click="handleRemoveVersion">
        解除单个版本
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleDeleteFile">
        删除该文件
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleRename">
        重命名
      </v-contextmenu-item>
    </v-contextmenu>
    <CreateShareDialog ref="CreateShareDialogRef" @onSubmitSuccess="handleOpenShare"></CreateShareDialog>
    <ProjectShareDialog ref="ProjectShareDialogRef"></ProjectShareDialog>
  </div>
</template>
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import {
  getFileVersionList,
  updateFileVersionOrder,
  removeVersion,
  renameFileOrFolder
} from "@/api/project/file.js"
import { createUploadSign , createUploadFile, getFileDownloadUrl, deleteFileVersion } from '@/api/project/files.js' 
import { getShareVersionList, getShareFileDownloadUrl } from '@/api/project/share.js' 
import Transfer from '@/layout/components/Transfer/index.vue'
import UserMessage from '@/layout/components/UserMessage/index.vue'
import shareDialog from '@/layout/components/shareDialog/index.vue'
import UploadFile from '@/utils/uploadFile'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus';
import { download } from "@/utils/request.js"
import { getToken } from '@/utils/auth'
import FileType from '@/components/FileType';
import CreateShareDialog from "../../../index/components/CreateShareDialog"
import ProjectShareDialog from "../../../index/components/ProjectShareDialog"

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
  fileAnti: {
    type: Boolean,
    default: false
  },
  isWps: {
    type: Boolean,
    default: false
  },
  fileId: {
    type: Number,
    default: null
  },
  projectAnti: { // 项目是否开启防录屏
    type: Boolean,
    default: false
  },
  isShare: {
    type: Boolean,
    default: false
  },
  shareDetail: {
    type: Object,
    default: {}
  },
  codingStatus: {
    type: Number,
    default: 2
  },
})
const store = useStore();
const route = useRoute()
const router = useRouter();
const emit = defineEmits([
  'goBack',
  'showFileList',
  'onPrevent',
  'onVersionChange',
  'needLogin'
]);
const versionManage = ref(false)
const versionList =  ref([]) // 文件版本列表
const commentStatus = reactive([
  {
    key: 1,
    value: '待审阅'
  },
  {
    key: 2,
    value: '审阅中'
  },
  {
    key: 6,
    value: '修改中'
  },
  {
    key: 4,
    value: '意见汇总完毕'
  },
  {
    key: 3,
    value: '通过'
  },
  {
    key: 5,
    value: '未通过'
  },
  {
    key: 0,
    value: '移除状态'
  }
])
const isDraggable = ref(false) // 是否可拖动
const dragIndex = ref(null)
const handleFileId = ref(null) // 右键操作文件id
const contextmenuItemRef = ref();
const renameId = ref(null) // 重命名文件id
const rename = ref('')
const dialogVisible = ref(false)
const uploadFile = ref();
const CreateShareDialogRef = ref();
const ProjectShareDialogRef = ref();
const clientToken = ref('');

// 下载权限
const downPermissions = computed(() => {
  const projectData = store.state.project.projectData
  let flag = false
  if (projectData?.currRoleId === 1) {
    flag = true
  } else if (projectData?.currRoleId === 2) {
    flag = projectData.permissions.adminPermissions.includes('download')
  } else if (projectData?.currRoleId === 3) {
    flag = projectData.permissions.memberPermissions.includes('download')
  }
  return flag
});

// 分享权限
const sharePermissions = computed(() => {
  const projectData = store.state.project.projectData
  let flag = false
  if (projectData?.currRoleId === 1) {
    flag = true
  } else if (projectData?.currRoleId === 2) {
    flag = projectData.permissions.adminPermissions.includes('share')
  } else if (projectData?.currRoleId === 3) {
    flag = projectData.permissions.memberPermissions.includes('share')
  }
  return flag
});

onMounted(() => {
  clientToken.value = route.query.token || ''
	window.uploadFileVersionSuccess = uploadFileVersionSuccess
  window.addEventListener('mousedown', handleMousedown)
  if (!props.isShare) {
    getVersionList(props.fileId)
  }
})
onUnmounted(() => {
  window.removeEventListener('mousedown', handleMousedown)
})

const fileDetail = computed(()=>{
  return store.state.file.fileDetail
})

const commentStatusText = computed(()=>{
  const ojb = commentStatus.find(el => el.key === fileDetail.value.reviewStatus)
  return ojb.value
})

const fileVersion = computed(()=>{
  const ojb = versionList.value.find(el => el.id === fileDetail.value.id)
  return ojb?.version || fileDetail.value.version
})

watch(()=>props.shareDetail, value => {
  if (props.isShare) {
    getShareVersion(props.fileId)
  }
})

function statusFormat(e) {
  console.log('ojb--', e);
  const ojb = commentStatus.find(el => el.key === e)
  return ojb.value

}

// 监听页面点击是否需要关闭版本管理
function handleMousedown(e) {
  const divbcr = document.getElementsByClassName('tooltip-version-box')[0]?.getBoundingClientRect()
  if (dialogVisible.value && handleFileId.value === null && (e.x < divbcr.x || e.x> divbcr.right || e.y < divbcr.y || e.y > divbcr.bottom)) {
    dialogVisible.value = false
  }
}

function goBack() {
  history.back()
  // emit('goBack')
}

function showFileList() {
  emit('showFileList')
}

function getVersionList(id) {
  getFileVersionList({id}).then(res => {
    versionList.value = res.data;
  })
}

// 分享获取版本列表
function getShareVersion(id) {
  const params = {
    id,
    token: props.shareDetail.sessionToken
  }
  getShareVersionList(params).then(res => {
    versionList.value = res.data;
  })
}

// 上传文件
const handleFiles = () => {
	if (route.query.platform === 'mac') {
  	window.webkit.messageHandlers.upload.postMessage({versionFileId: fileDetail.value.versionFileId})
	} else {
    uploadFile.value.click();
  }
}

/* 上传文件 */
const handleUploadFile = (e) => {
  const  files = e.target.files;
  for(var File of files){
    const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
    uploadData.projectId = fileDetail.value.projectId;
    uploadData.parentId = fileDetail.value.parentId;
    store.commit('upload/addFileList',uploadData)
  }
  uploadFile.value.value = ''
}

// 获取签名
const getUploadSignFun = (obj, callback, errorback)=>{
  const projectId = obj.projectId;
  const directoryId = obj.parentId;
  const filename = obj.FileName;
  const size = obj.FileSize;
  const md5 = obj.FileMD5;
  createUploadSign({projectId,directoryId,filename,size,md5}).then(res=>{
      callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

// 创建文件
const CreateUploadFileFun = ({resultData,options},callback,errorback)=>{
  const params = {
    versionFileId: fileDetail.value.id,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
  }
  createUploadFile(params).then(res=>{
    getVersionList(fileDetail.value.id)
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

// 客户端上传成功返回
function uploadFileVersionSuccess(data = null) {
  if (data) {
    ElMessage.success('上传成功')
    getVersionList(fileDetail.value.id)
  } else {
    ElMessage.error('客户端返回文件版本错误')
  }
}

function handleCommentStatus(val) {
  store.dispatch("file/handleFileStatus", {id: fileDetail.value.id, reviewStatus: val}).then(res=>{
  }).catch(err=>{
    console.log('设置状态-err-', err);
  })
}

//创建分享
const handleShare = () => {
    CreateShareDialogRef.value.open(fileDetail.value);
}
// 打开分享
const handleOpenShare = (data) => {
  const id = null;
  const qrcode = data.qrcode, url = data.url, info = data.info;
  ProjectShareDialogRef.value.open({ id, qrcode, url, info })
}
function handleDragStart(index) {
  dragIndex.value = index;
}

function handleDragEnter(e, index) {
  e.preventDefault(); // 避免源对象触发自身的dragenter事件
  if (dragIndex.value !== index) {
    const source = versionList.value[dragIndex.value];
    versionList.value.splice(dragIndex.value, 1);
    versionList.value.splice(index, 0, source);

    const v1 = versionList.value[dragIndex.value].version
    const v2 = versionList.value[index].version
    versionList.value[dragIndex.value].version = v2
    versionList.value[index].version = v1

    dragIndex.value = index;
  }
}

function handleDragOver(e, index) {
  e.preventDefault();
}

function handleDragEnd() {
  const idList = versionList.value.map(el => {
    return el.id
  })
  
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  updateFileVersionOrder(idList).then(res => {
    dragIndex.value = null;
    loading.close()
  }).catch(err => {
    loading.close()
  })
}

const downLoading = ref(false)
async function downClick() {
  if (!getToken()) {
    emit('needLogin')
    return;
  }
  const params = {
    list: [
      {
        id: fileDetail.value.id,
        filename: fileDetail.value.name
      }
    ]
  }
  downLoading.value = true
  if (props.isShare) {
    try {
      params.token = props.shareDetail.sessionToken
      const res = await getShareFileDownloadUrl(params)
      await download(res.data.data[0]?.downloadUrl)
      downLoading.value = false
    } catch (error) {
      downLoading.value = false
    }
  } else {
    try {
      params.projectId = fileDetail.value.projectId
      const res = await getFileDownloadUrl(params)
      if (route.query.platform === 'mac') {
        const params = {
          name: res.data[0]?.filename,
          size: res.data[0]?.size,
          url: res.data[0]?.downloadUrl
        }
        window.webkit.messageHandlers.downLoad.postMessage(params)
        downLoading.value = false
    } else {
      download(res.data[0]?.downloadUrl)
      downLoading.value = false
    }
    } catch (error) {
      downLoading.value = false
    }
  }
}

function preventFun(val) {
  if ((props.fileType !== 'video' || props.projectAnti)) return;
  emit('onPrevent', val)
}

// 解除版本
function handleRemoveVersion() {
  const id = handleFileId.value
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  removeVersion({id}).then(res => {
    handleFileId.value = null
    versionList.value = versionList.value.filter(el => {
      return el.id !== id
    })
    loading.close()
  }).catch(err => {
    loading.close()
  })
}

// 删除文件
function handleDeleteFile() {
  const id = handleFileId.value
  const findex = versionList.value.findIndex(el => el.id === id)
  ElMessageBox.confirm(
    `确认删除文件"${versionList.value[findex].name}"？删除后，文件将被移至回收站。`,
    {
      customClass: 'messageBox-custom-warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)',
      })
      deleteFileVersion({id}).then(res => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        handleFileId.value = null;
        versionList.value = versionList.value.filter(el => {
          return el.id !== id
        })
        loading.close()
        if (findex === 0) {
          versionManage.value = false
          emit('onVersionChange', versionList.value[0])
        }
      }).catch(err => {
        loading.close()
      })
    })
    .catch((err) => {
      handleFileId.value = null;
    })
}

// 右键点击重命名
function handleRename() {
  renameId.value = handleFileId.value
  let fitem = {}
  versionList.value.forEach(el => {
    if (el.id === renameId.value) {
      fitem = el
    }
  })
  rename.value = fitem.name.substr(0, fitem.name.length - fitem.suffix.length)
  nextTick(() => {
    document.getElementById('renameRef' + renameId.value).focus()
    handleFileId.value = null;
  })
}

// 文件名点击重命名
function renameClick(item) {
  if (!versionManage.value)  return;
  renameId.value = item.id
  rename.value = item.name.substr(0, item.name.length - item.suffix.length)
  nextTick(() => {
    document.getElementById('renameRef' + item.id).focus()
  })
}

// 重命名提交
function handleRenameChange(index) {
  if (!rename.value) {
    ElMessage.error('文件名不能为空')
    return;
  }
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const params = {
    id: versionList.value[index].id,
    name: rename.value + versionList.value[index].suffix
  }
  renameFileOrFolder(params).then(res => {
    ElMessage({
      type: 'success',
      message: '编辑文件名成功',
    })
    versionList.value[index].name = rename.value + versionList.value[index].suffix
    renameId.value = null
    loading.close()
  }).catch(err => {
    loading.close()
  })
}

const contextmenuBeforeClose = (deno)=>{
  deno()
}

function handleVersionClick(item) {
  if (versionManage.value) return;
  dialogVisible.value = false;
  if (fileDetail.value.id === item.id) return;
  emit('onVersionChange', item)
}

defineExpose({
  getVersionList,
  getShareVersion
})

</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
<style>
.tooltip-version-box {
  min-width: 480px;
  font-size: 14px;
  color: #606266;
}
</style>