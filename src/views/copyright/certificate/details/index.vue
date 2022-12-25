<template>
  <el-container class="details-cer-box">
    <el-scrollbar ref="scroll" style="width: 100%;height: 100%;">
      <div class="header">
        <span style="color:#9094A6;cursor: pointer" @click="router.go(-1)">版权存证</span>
        <el-icon :size="10" class="icon-righ"><ArrowRight /></el-icon>
        <span>版权存证详情</span>
      </div>

      <div class="info-box">
        <div class="info-top">
          <span class="title">{{details?.worksName}}</span>
          <el-button class="detele-btn" color="#FA5151" plain round @click="deleteWorks">删除作品</el-button>
          <el-button class="edit-btn" color="#3468FE" plain round @click="editIntro">修改简介</el-button>
        </div>
        <div class="intro1">
          <span>{{formatCategory(details?.worksCategory)}}</span>
          <el-divider direction="vertical" />
          <span>{{details?.createTime}} 创建</span>
          <el-divider direction="vertical" />
          <span :style="{'color' : formatState(details?.state).color}">{{formatState(details?.state).state}}</span>
        </div>
        <div class="intro2">
          <div class="left1" v-show="!openIntro">
            {{details?.intro}}
          </div>
          <div class="left2" v-show="openIntro">
            {{details?.intro}}
          </div>
<!--          <div class="right" @click="openIntro = !openIntro">-->
<!--            {{openIntro ? '收起' : '展开'}}-->
<!--            <el-icon :style="{transform: openIntro?'rotate(180deg)':''}"><ArrowDown /></el-icon>-->
<!--          </div>-->
        </div>
        <el-divider class="ldivider" />

        <div>
          <el-input
            v-model="fileName"
            class="w-50-search"
            placeholder="搜索文件名"
            :suffix-icon="Search"
            @change="getFileList"
          />
        </div>

        <div v-if="fileList.length > 0" class="file-box">
          <div class="file-item" v-for="(item, index) in fileList" :key="index">
            <div class="top">
              <div class="left">
                <span class="show-off" @click="item.fold = !item.fold">
                  {{item.fold ? '展开' : '收起'}}
                  <el-icon v-if="item.fold"><ArrowDown /></el-icon>
                  <el-icon v-else><ArrowUp /></el-icon>
                </span>
                <el-divider direction="vertical" />
                <span>{{item.fileName}}</span>
              </div>
              <div class="right">
                <el-link type="info" :underline="false" :disabled="item.state !== 'success'" @click="handleDownload(item.id, 'package')">下载证件包</el-link>
                <el-tooltip
                  class="box-item"
                  effect="light"
                  :content="item.state == 'pending' ? '存证中不可下载' :'存证失败不可下载'"
                  placement="top"
                  v-if="item.state !== 'success'"
                >
                  <svg-icon iconClass="question" size="12px" color="#444652"></svg-icon>
                </el-tooltip>
                <el-divider direction="vertical" />
                <el-link type="info" :underline="false" :disabled="item.state !== 'success'" @click="handleDownload(item.certificateFileId, 'certificate')">下载证书</el-link>
                <el-divider direction="vertical" />
                <el-icon :size="16" class="more-icon" @click="(handleItem = item)" v-contextmenu:contextmenuRef="{ trigger: 'click' }"><MoreFilled /></el-icon>
              </div>
            </div>
            <div class="info1">
              <el-image style="width: 40px;" :src="item.infoDto.cover" v-if="item.infoDto.cover"/>
              <div style="width: 40px;" v-else><FileType :type="item.infoDto.fileInfo.fileCat"></FileType></div>
              <div class="main-info">
                <div>
                  <p>文件ID：{{item.copyrightFileId}}</p>
                  <p class="size">文件大小：{{formatSize(item.fileSize)}}</p>
                </div>
                <div class="to-view" @click="viewCertificate(item)" v-if="item.state === 'success'">查看证书 <el-icon :size="12"><DArrowRight /></el-icon></div>
                <div class="to-view" v-else-if="item.state === 'error'">存证失败</div>
                <div class="to-view" v-else>存证中</div>
              </div>
            </div>
            <div v-show="!item.fold" class="info2">
              <el-divider />
              <p class="p1">存证信息</p>
              <div class="info-item">
                <div class="item-w">上链时间：{{item.certTime}}</div>
                <div class="item-w">区块高度：{{(item.blockHeight || 0)}}</div>
              </div>
              <div class="info-item">
                <div class="item-w">存证主体名称：{{item.copyrightOwner}}</div>
                <div class="item-w">存证主体证件号码：{{item.cardNo}}</div>
                <div class="item-w">公证处：{{item.orgName}}</div>
              </div>
              <div class="info-item">
                <div class="item-w">著作权人：{{item.copyrightOwner}}</div>
                <div class="item-w">著作权人证件号码：{{item.cardNo}}</div>
              </div>
              <div class="snumber">统一证据编号：{{item.certificateStorageNo}}</div>
              <div class="hash">文件哈希值：{{item.hash}}</div>
            </div>
          </div>

        </div>
        <div v-else class="empty-list">
          未搜索到文件
        </div>
      </div>
    </el-scrollbar>
  </el-container>

  <ViewCertificate
    ref="viewRef"
    :certificateInfo="certificateInfo"
    :certificateUrl="certificateUrl"
  ></ViewCertificate>

  <ModifyIntro
    ref="modifyRef"
    :details="details"
    @onModifyIntro="handleModifyIntro"
  ></ModifyIntro>

  <v-contextmenu :width="160" ref="contextmenuRef">
    <v-contextmenu-item :disabled="handleItem.state !== 'success'" @click="handleDelete">
      <span>删除文件</span>
    </v-contextmenu-item>
    <v-contextmenu-item disabled>
      <span>发起监测（规划中）</span>
    </v-contextmenu-item>
  </v-contextmenu>
</template>
<script setup>
import { file } from '@babel/types';
import { Search, MoreFilled } from '@element-plus/icons-vue'
import { copyrightDetails, copyrightFileList, copyrightDelete, updateIntro, getCertificateFile, copyrightFileDelete, getCopyrightFile } from '@/api/copyright/index.js'
import { onMounted } from '@vue/runtime-core';
import { formatSize } from '@/utils/tool.js';
import ViewCertificate from './components/ViewCertificate.vue'
import ModifyIntro from './components/ModifyIntro.vue'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus';
import { downloadMulti } from '@/utils/request.js';
import FileType from '@/components/FileType'
const route = useRoute()
const router = useRouter()
const fileName = ref('')
const contextmenuRef = ref()
const fileList = ref([])
const copyrightId = ref(null)
const details = ref({})
const openIntro = ref(false)
const viewRef = ref()
const modifyRef = ref()
const certificateInfo = ref({})
const worksCategoryList = [
  {
    code: 'MODEL',
    description: '模型作品'
  },
  {
    code: 'ARCHITECTURE',
    description: '建筑作品'
  },
  {
    code: 'SOFTWARE',
    description: '计算机软件'
  },
  {
    code: 'OTHER',
    description: '其他作品'
  },
  {
    code: 'QUYI',
    description: '曲艺作品'
  },
  {
    code: 'DRAMA',
    description: '戏剧作品'
  },
  {
    code: 'DANCE',
    description: '舞蹈作品'
  },
  {
    code: 'GRAPH',
    description: '图形作品'
  },
  {
    code: 'PAINT',
    description: '美术作品'
  },
  {
    code: 'MUSIC',
    description: '音乐作品'
  },
  {
    code: 'DICTATION',
    description: '口述作品'
  },
  {
    code: 'PHOTO',
    description: '摄影作品'
  },
  {
    code: 'TEXT',
    description: '文字作品'
  },
  {
    code: 'MOVIE',
    description: '影视作品'
  }
]
const handleItem = ref({})

function formatCategory(cat) {
  const data = worksCategoryList.find(el => el.code == cat)
  return data?.description || ''
}

function formatState(sta) {
  let state = ''
  let color = '#8D91A3'
  switch (sta) {
    case 'draft':
      state = '草稿'
      break;
    case 'beingProcessed':
      state = '存证中'
      color = '#3468FE'
      break;
    case 'finish':
      state = '存证成功'
      color = '#0DA411'
      break;
    case 'error':
      state = '存证失败'
      color = '#FA5151'
      break;
    default:
      break;
  }
  return {state,color};
}

function getDetails() {
  copyrightDetails(copyrightId.value).then(res => {
    details.value = res.data
    const name = formatCategory(details.value.worksCategory)
    details.value.worksCategoryName = name
  })
}

function getFileList() {
  const params = {
    copyrightId: copyrightId.value,
    fileName: fileName.value,
  }
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  copyrightFileList(params).then(res => {
    fileList.value = res.rows
    loading.close()
  }).catch(err => {
    loading.close()
  })
}

function editIntro() {
  modifyRef.value.open()
}

function deleteWorks() {
  const text = `删除后，作品以及包含的文件将无法恢复，您确定要删除吗？`;
  const title = `你确定删除该作品吗？`;
  ElMessageBox.confirm(text, title, {
    customClass: 'messageBox-custom-warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: true,
    center: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        })
        copyrightDelete(copyrightId.value)
          .then((res) => {
		        loading.close()
            ElMessage.success('删除成功！')
            router.push('/copyright/certificate/index')
            done();
          })
          .catch((err) => {
		        loading.close()
            done();
          });
      } else {
        if (instance.confirmButtonLoading) {
          return;
        }
        done();
      }
    },
  })
  .then(() => {})
  .catch((err) => {});
}

// 修改简介
function handleModifyIntro(intro) {
  const params = {
    id: copyrightId.value,
    intro
  }
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  updateIntro(params).then(res => {
    ElMessage.success('更新成功！')
    details.value.intro = intro
    modifyRef.value.close()
    loading.close()
  }).catch(err => {
    loading.close()
  })
}

/**
 * 获取文件下载
 * @param {*} fileId
 * @param {*} type certificate：证书下载/预览，package：证件包下载
 */
const certificateUrl = ref('')
function getFile(fileId, type) {
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  getCertificateFile(fileId, type).then(res => {
    certificateUrl.value = res.data.downloadUrl
    loading.close()
  }).catch(err => {
    loading.close()
  })
}
function handleDownload(fileId, type) {
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })

  if (type === 'certificate') {
    getCopyrightFile(fileId).then(res => {
      loading.close()
      if (res.data.downloadUrl) {
        downloadMulti([{
          url: res.data.downloadUrl,
          params: {},
          fileName: "",
        }])
      }
    }).catch(err => {
      loading.close()
    })
  } else {
    getCertificateFile(fileId, type).then(res => {
      loading.close()
      if (res.data.downloadUrl) {
        downloadMulti([{
          url: res.data.downloadUrl,
          params: {},
          fileName: "",
        }])
      }
    }).catch(err => {
      loading.close()
    })
  }
}

function handleDelete() {
  const text = `删除后文件无法恢复，你确定要删除吗？`;
  const title = `你确定删除该文件吗？`;
  ElMessageBox.confirm(text, title, {
    customClass: 'messageBox-custom-warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: true,
    center: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        })
        copyrightFileDelete(handleItem.value.id)
          .then((res) => {
		        loading.close()
            ElMessage.success('删除成功！')
            getFileList()
            done();
          })
          .catch((err) => {
		        loading.close()
            done();
          });
      } else {
        if (instance.confirmButtonLoading) {
          return;
        }
        done();
      }
    },
  })
  .then(() => {})
  .catch((err) => {});
}

function viewCertificate(item) {
  certificateInfo.value = item
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  getCopyrightFile(item.certificateFileId).then(res => {
    certificateUrl.value = res.data.downloadUrl
    viewRef.value.open()
    loading.close()
  }).catch(err => {
    loading.close()
  })
}

onMounted(() => {
  copyrightId.value = route.params.id
  getDetails()
  getFileList()
})

</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
