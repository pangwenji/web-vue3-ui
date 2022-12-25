<template>
  <div>
    <el-container class="share-container">
      <el-header class="share-header">
        <div class="share-header-left">
          <el-image
            :src="logo"
            style="height: 50px; width: 50px; cursor: pointer;"
            :draggable="false"
            @click="goPath('/')"
          >
            <template #error>
              <el-icon :size="50"><User /></el-icon>
            </template>
          </el-image>
        </div>

        <div class="share-header-right">
          <div class="avatar-container">
            <div class="avatar-wrapper" @click="goPath('/user/')">
              <span v-if="getters.avatar"><img :src="getters.avatar" :draggable="false" class="user-avatar" /></span>
              <span v-else><img :src="userHead" :draggable="false" class="user-avatar" /></span>
            </div>
          </div>
        </div>
      </el-header>
      <el-main
        v-loading="initializeLoading"
        element-loading-background="rgba(0, 0, 0, 0)"
      >
        <template
          v-if="
            shareInfo.passwordLock === 1 &&
            !shareInfo.sessionToken &&
            !initializeLoading
          "
        >
          <div class="share-verification">
            <el-image :src="shareInfo.user?.avatar || ''" :draggable="false">
              <template #error>
                <el-icon :size="70"><User /></el-icon>
              </template>
            </el-image>
            <div class="title">{{ shareInfo.user?.nickName }}</div>
            <div class="desc">分享者</div>
            <div class="title">{{ shareInfo.name }}</div>
            <div class="form-item">
              <input v-model="passwordVali" @keyup="trimLR" placeholder="输入4位验证密码" />
              <el-button
                size="large"
                @click="handleSubmit"
                :loading="loadingState"
                color="#3468FE"
                type="primary"
                round
                >确定</el-button
              >
            </div>
            <div class="desc" v-if="shareInfo.timeLeft > 0">
              该分享将在{{ shareInfo.timeLeft }}天后无效
            </div>
            <div class="desc" v-else-if="shareInfo.timeLeft < 0">
              该链接已过期
            </div>
            <div class="desc" v-else>该分享永久有效</div>
          </div>
        </template>
        <template v-else-if="!initializeLoading">
          <div class="share-content-box">
            <div class="share-title">{{ shareInfo.name }}</div>
            <div class="share-content">
              <div class="share-info">
                <template v-if="selectFileList.length === 0">
                  <el-image :src="shareInfo.user?.avatar || ''">
                    <template #error>
                      <el-icon :size="36"><User /></el-icon>
                    </template>
                  </el-image>
                  <div class="share-nickName">
                    {{ shareInfo.user?.nickName || '分享者' }}
                  </div>
                  <div class="share-validity">
                    <span v-if="shareInfo.timeLeft > 0"
                      >该分享将在{{ shareInfo.timeLeft }}天后无效</span
                    >
                    <span v-else-if="shareInfo.timeLeft < 0">该链接已过期</span>
                    <span v-else>该分享永久有效</span>
                  </div>
                  <div class="report" @click="handleReport">举报</div>
                </template>
                <template v-else>
                  <el-button
                    type="primary"
                    round
                    color="#3D4352"
                    @click="handleSelectAll(true)"
                    >全选</el-button
                  >
                  <!-- <el-button type="primary" round color="#3D4352" @click="handleSelectAll(false)">取消全选</el-button> -->
                  <el-button
                    type="primary"
                    round
                    color="#3D4352"
                    @click="handleSelectAll(false)"
                    >取消</el-button
                  >
                </template>
              </div>
              <div>
                <!-- <el-button
                  type="primary"
                  round
                  color="#3D4352"
                  @click="handleShare"
                  >转发</el-button
                > -->
                <el-button
                  type="primary"
                  round
                  color="#3D4352"
                  :disabled="shareInfo.saveTo !== 1"
                  @click="handleDownload(selectFileList)"
                  >下载原件</el-button
                >
                <el-button
                  type="primary"
                  round
                  color="#3468FE"
                  :disabled="shareInfo.saveTo !== 1"
                  @click="handleRedeposit(false)"
                  >转存</el-button
                >
              </div>
            </div>
            <!-- <a v-color="'white'" @click="handleDownloadFile">下载图片</a> -->
            <div class="share-file-info">
              <template v-if="breadcrumbList.length > 1">
                <el-breadcrumb separator-icon="ArrowRight">
                  <template
                    v-for="(item, index) in breadcrumbList"
                    :key="index"
                  >
                    <el-breadcrumb-item
                      @click="handleBreadcrumb(item, index)"
                      >{{ item.name }}</el-breadcrumb-item
                    >
                  </template>
                </el-breadcrumb>
              </template>
              <template v-else>
                <span
                  >共 {{ shareInfo.fileQuantity }} 个文件（{{formatSize(fileListSize)}}）</span
                >
              </template>
            </div>
            <div class="share-file-scrollbar">
              <el-scrollbar
                height="100%"
                v-loading="loadingStatus"
                element-loading-background="rgba(0, 0, 0, 0)"
                @click="handleSelectAll(false)"
              >
                <template v-if="fileList.length > 0 && !loadingStatus">
                  <el-row :gutter="20" style="font-size: 14px; margin: 0 10px">
                    <template v-for="(item, index) in fileList" :key="index">
                      <FileItem
                        :data="item"
                        :col-style="{
                          maxWidth: String(100 / layoutSpan) + '%',
                          flex: '0 0 ' + String(100 / layoutSpan) + '%',
                        }"
                        :type="item.type == 1 ? 'folder' : item.fileCat"
                        :onRedeposit="
                          shareInfo.saveTo !== 1 ? null : handleRedeposit
                        "
                        :onDownload="
                          shareInfo.saveTo !== 1 ? null : handleDownload
                        "
                        :showCheck="showCheck"
                        @onOpenFolder="handleOpenFolder"
                        @goDetail="goDetail"
                      ></FileItem>
                    </template>
                  </el-row>
                </template>
                <template v-else-if="!loadingStatus">
                  <Empty description="文件夹空空如也"> </Empty>
                </template>
              </el-scrollbar>
            </div>
          </div>
        </template>
      </el-main>
    </el-container>
  </div>

  <MoveCopyDialog
    v-if="saveToShow"
    :moveCopyShow="saveToShow"
    type="saveTo"
    @moveCopyClose="handleSaveToClose"
    @onSubmit="saveToSubmit"
  ></MoveCopyDialog>

  <informDialog
    ref="informRef"
    :info="reportInfo"
    :type="2"
    :close-on-click-modal="false"
  ></informDialog>

</template>

<script setup>
import logo from '@/assets/logo/logo.png';
import {
  getFileShareInfo,
  getShareFileList,
  verifyFileSharePassword,
  shareSaveTo,
  getShareFileDownloadUrl
} from '@/api/clouddisk/share.js';
import { getToken } from '@/utils/auth';
import { formatSize } from '@/utils/tool.js';
import FileItem from './FileItem.vue';
import { ElMessage } from 'element-plus';
import { downloadMulti } from '@/utils/request.js';
import MoveCopyDialog from '../components/MoveCopyDialog/index.vue'
import cache from '@/plugins/cache'
import { getCurrentInstance, nextTick } from '@vue/runtime-core';
import userHead from '@/assets/icons/comment/icon_user-head.png'
import informDialog from '@/components/informDialog'

const { proxy } = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const store = useStore();
const shareInfo = ref({});
const fileList = ref([]);
const loadingState = ref(false);
const loadingStatus = ref(false);
const initializeLoading = ref(false);
const breadcrumbList = ref([]);
const passwordVali = ref('');
const saveToShow = ref(false)
const saveToIds = ref([])
const informRef = ref()
const reportInfo = ref({})

const getters = computed(() => store.getters);
const selectFileList = computed(() => {
  const list = fileList.value.filter((item) => item.check);
  return list;
});
const fileListSize = computed(() => {
  let size = 0;
  fileList.value.forEach(el => {
    size += el.size
  });
  return size;
});

onMounted(() => {
  shareInit()
});

const showCheck = computed(() => {
  for (var key in fileList.value) {
    if (fileList.value[key]?.check) {
      return true;
    }
  }
  return false;
})

// 每行个数
const layoutSpan = ref(4);
const onresize = (clientWidth) => {
  if (clientWidth < 768) {
    layoutSpan.value = 2;
  } else if (clientWidth < 900) {
    layoutSpan.value = 3;
  } else if (clientWidth < 1100) {
    layoutSpan.value = 4;
  } else if (clientWidth < 1300) {
    layoutSpan.value = 5;
  } else if (clientWidth < 1500) {
    layoutSpan.value = 6;
  } else if (clientWidth < 1700) {
    layoutSpan.value = 7;
  } else if (clientWidth < 1900) {
    layoutSpan.value = 8;
  } else if (clientWidth < 2100) {
    layoutSpan.value = 9;
  }
};
onresize(document.body.clientWidth);
document.body.onresize = (e) => {
  onresize(e.currentTarget.innerWidth);
};

// 全选/取消全选
const handleSelectAll = (e)=>{
  for(var item of fileList.value){
    item.check = e;
  }
}

// 分享初始化
function shareInit() {
  initializeLoading.value = true;
  const token = route.query.token;
  shareInfo.value = cache.session.getJSON('CLOUD_SHARE_INFO') || {}
  if (shareInfo.value && shareInfo.value.token === token) {
    initializeLoading.value = false;
    // 详情返回读取面包屑
    if (store.state.clouddisk.shareBreadcrumbs?.length > 1) {
      breadcrumbList.value = store.state.clouddisk.shareBreadcrumbs
      getFileList(breadcrumbList.value.slice(-1)[0].parentId);
    } else {
      breadcrumbList.value.push({
        name: '分享的文件',
        parentId: 0,
      });
      getFileList();
    }
  } else {
    getFileShareInfo({ token })
      .then((res) => {
        shareInfo.value = res.data;
        cache.session.setJSON('CLOUD_SHARE_INFO', res.data)
        if (shareInfo.value.passwordLock === 1 && !shareInfo.value.sessionToken) {
          initializeLoading.value = false;
        } else {
          initializeLoading.value = false;
          // 详情返回读取面包屑
          if (store.state.clouddisk.shareBreadcrumbs?.length > 1) {
            breadcrumbList.value = store.state.clouddisk.shareBreadcrumbs
            getFileList(breadcrumbList.value.slice(-1)[0].parentId);
          } else {
            breadcrumbList.value.push({
              name: '分享的文件',
              parentId: 0,
            });
            getFileList();
          }
        }
      })
      .catch((err) => {
        initializeLoading.value = false;
      });
  }
}

// 获取分享文件列表
function getFileList(parent_id) {
  loadingStatus.value = true;
  fileList.value = [];
  const token = shareInfo.value.sessionToken;
  getShareFileList({ token, parent_id })
    .then((res) => {
      fileList.value = res.data?.list || [];
      loadingStatus.value = false;
      store.commit("clouddisk/SET_SHARE_BREADCRUMBS", breadcrumbList.value);
      // store.commit("clouddisk/SET_FILE_LIST", fileList.value);
      cache.session.setJSON('FIList', fileList.value)
    })
    .catch((err) => {
      loadingStatus.value = false;
    });
}

const handleShare = () => {
  console.log(111);
  if (!getToken()) {
    proxy.$loginDialog.open({})
    return;
  }
  const token = route.query.token;
  getFileShareSourceInfo({ token }).then((res) => {
    const qrcode = res.data.qrcode;
    const url = res.data.url;
    const info = res.data.info;
    ProjectShareDialogRef.value.open({ qrcode, url, info });
  });
};

// 转存弹窗
const handleRedeposit = (e) => {
  if (!getToken()) {
    proxy.$loginDialog.open({})
    return;
  }
  if (selectFileList.value.length == 0 && !e) {
    ElMessage.info('请先选择需要转存的文件');
    return;
  }
  saveToIds.value = e ? [e.id] : selectFileList.value.map((item) => item.id);
  saveToShow.value = true
};

// 转存关闭
function handleSaveToClose() {
  saveToShow.value = false
}

// 转存提交
const saveToSubmit = (e) => {
  console.log('转存提交', e);
  const params = {
    token: shareInfo.value.sessionToken,
    fileIds: saveToIds.value,
    directoryId: e.directoryId,
    projectId: e.projectId,
  }
  shareSaveTo(params).then(res => {
    ElMessage.success('转存成功');
    handleSaveToClose()
  })
}


// 下载
const handleDownload = async (e) => {
  if (!getToken()) {
    proxy.$loginDialog.open({})
    return;
  }
  if (e.length === 0 || !e) {
    ElMessage.info('请先选择需要下载的文件');
    return;
  }
  if (!Array.isArray(e)) {
    e = [e];
  }
  for (var item of e) {
    if (item.type == 1) {
      ElMessage.error('文件夹无法下载');
      return;
    }
  }
  const list = e.map((item) => {
    return {
      id: item.id,
      filename: item.name,
    };
  });
  const params = {
    token: shareInfo.value.sessionToken,
    list
  }
  const res = await getShareFileDownloadUrl(params)
  const requestData = res.data.map(el => {
    return {
      url: el.downloadUrl,
      params: {},
      fileName: ''
    }
  })
  downloadMulti(requestData);
};

// 点击面包屑
const handleBreadcrumb = (item, index) => {
  if (index === breadcrumbList.value?.length - 1) {
    return;
  } else {
    breadcrumbList.value.splice(
      index + 1,
      breadcrumbList.value?.length - index - 1
    );
    getFileList(item.parentId);
  }
};

// 打开文件夹
const handleOpenFolder = (data) => {
  breadcrumbList.value.push({
    name: data.name,
    parentId: data.id,
  });
  getFileList(data.id);
};

// 提交
const handleSubmit = () => {
  console.log(passwordVali.value);
  if (!passwordVali.value) {
    ElMessage.error('请填写验证密码');
    return;
  }
  if(passwordVali.value.length !== 4){
    ElMessage.error('请填写4位验证密码')
    return
  }
  loadingState.value = true;
  const token = shareInfo.value.token;
  const password = passwordVali.value;
  verifyFileSharePassword({ token, password })
    .then((res) => {
      loadingState.value = false;
      shareInfo.value = res.data;
      cache.session.setJSON('CLOUD_SHARE_INFO', res.data)
      breadcrumbList.value.push({
        name: '',
        parentId: 0,
      });
      getFileList();
    })
    .catch((err) => {
      loadingState.value = false;
    });
};

function goPath(path) {
  router.push(path)
}

function goDetail(data) {
  // if (!getToken()) {
  //   showLogin.value = true;
  //   return;
  // }
  const token = route.query.token;
  router.push({ path: "/clouddisk/detail/"+data.id, query: { fileCat: data.fileCat, shareToken: token } });
}

function trimLR() {
  passwordVali.value = passwordVali.value.replace(/\s+/g, '');
}

// 举报
function handleReport() {
  reportInfo.value.id = shareInfo.value.id
  reportInfo.value.title = shareInfo.value.name
  informRef.value.isShow = true
}

</script>

<style scoped lang="scss">
@import './style.scss';
</style>
