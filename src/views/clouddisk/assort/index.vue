<template>
  <el-container style="height:100%;">
    <!-- <LeftSider></LeftSider> -->
    <div class="right-box">
      <CloudHeader
        v-show="!showCheck"
        ref="cloudHeaderRef"
        :layoutType="layoutType"
        :count="total"
        :uploadFolder="false"
        :createFolder="false"
        :createWps="assortId == 4 || assortId == 6"
        @onShowInfo="handleShowInfo"
        @onSearchChange="handleSearchChange"
        @onSortChange="handleSortChange"
        @onUploadSuccess="handleUploadSuccess"
        @onCreateWpsSuccess="handleCreateWpsSuccess"
      ></CloudHeader>
      <CloudHeaderHandle
        v-show="showCheck"
        ref="cloudHeaderHandleRef"
        :selectFiles="selectFiles"
        :isCheckAll="isCheckAll"
        @checkAll="handleCheckAll"
        @cancelCheck="handeCancel"
        @onBatchDelete="handleBatchDelete"
        @onCopy="handleBatchCopy"
        @onMove="handleBatchMove"
        @onDownloadFiles="handleDownloadFiles"
        @onShare="handleShare"
      ></CloudHeaderHandle>

      <div class="container-box">
        <ListEmpty
          v-if="assortFileList.length === 0"
          v-loading="loadingStatus"
          element-loading-background="rgba(0, 0, 0, 0)"
          :keyWord="keyword"
          :showUpFloder="false"
          @onUploadFiles="handleUploadFiles"
          @onUploadFolder="handleUploadFolder"
        ></ListEmpty>
        <div v-else class="file-list-box" ref="filelistRef">
          <el-scrollbar
            ref="scrollbarRef"
            style="width:100%;"
            v-loading="loadingStatus"
            view-class="file-list-scrollbar"
            :style="{height: listBoxHeight+'px'}"
            element-loading-background="rgba(0, 0, 0, 0)"
            @scroll="handleScroll"
            @click.stop="handeCancel"
            v-contextmenu:contextmenuRef
          >
            <div v-if="layoutType === 'list'" class="list-header">
              <div class="fname">文件名</div>
              <div class="ftype">文件类型</div>
              <div class="fsize">大小</div>
              <div class="faddby">添加者</div>
              <div class="faddtime">添加时间</div>
              <div class="fhandle">操作</div>
            </div>
            <div class="f-list">
              <el-row :gutter="10">
                <template v-for="(item, index) in assortFileList" :key="index">
                  <FileItem
                    :type="item.fileCat"
                    :data="item"
                    :layoutType="layoutType"
                    :showCheck="showCheck"
                    :checkLength="selectFiles.length"
                    :width="String(100/column) + '%'"
                    @share="handleShare"
                    @download="handleDownloadFiles"
                    @prevent="handlePrevent"
                    @copy="handleCopy"
                    @move="handleMove"
                    @delete="handleDelete"
                    @onChangeRadio="handleFileRadio"
                    @onRename="handleRename"
                    @onCheck="handleCheck"
                  >
                  </FileItem>
                </template>
              </el-row>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="right-box2">
      <transition name="fileinfo">
          <div v-show="showInfo">
            <CloudInfo :fileList="assortFileList" :lastCheckData="lastCheckData"></CloudInfo>
          </div>
        </transition>
    </div>

    <shareDialog
      v-if="shareShow"
      :shareShow="shareShow"
      :shareData="shareData"
      :fileType="shareFileType"
      @shareClose="shareClose"
      @shareSuccess="shareSuccess"
    ></shareDialog>

    <ShareInfoDialog
      v-if="shareInfoShow"
      :shareInfoShow="shareInfoShow"
      :shareInfo="shareInfo"
      @shareInfoClose="shareInfoClose"
    ></ShareInfoDialog>

    <MoveCopyDialog
      v-if="moveCopyShow"
      :moveCopyShow="moveCopyShow"
      :type="moveCopytype"
      :fileIds="fileIds"
      @moveCopyClose="handleMoveCopyClose"
      @onMoveSuccess="handleMoveSuccess"
    ></MoveCopyDialog>

    <v-contextmenu :disabled="selectFiles.length < 2" :width="140" ref="contextmenuRef">
      <v-contextmenu-item @click="handleShare(selectFiles)">
        <svg-icon iconClass="icon_sharing" :size="20" ></svg-icon>
        <span>分享</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleBatchCopy(selectFiles)">
        <svg-icon iconClass="icon_copy" :size="20" ></svg-icon>
        <span>复制到</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleBatchMove(selectFiles)">
        <svg-icon iconClass="icon_move-to" :size="20" ></svg-icon>
        <span>移动到</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleDownloadFiles(selectFiles)">
        <svg-icon iconClass="icon_download" :size="20" ></svg-icon>
        <span>批量下载</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="handleBatchDelete2">
        <svg-icon iconClass="icon_delete" :size="20" ></svg-icon>
        <span>批量删除</span>
      </v-contextmenu-item>
    </v-contextmenu>
    
  </el-container>
</template>
<script setup>
import LeftSider from '../components/LeftSider'
import CloudHeader from '../components/CloudHeader'
import { watch } from 'vue-demi'
import { getTypeList, getFileDownloadUrl } from "@/api/clouddisk/file.js"
import CloudHeaderHandle from '../components/CloudHeaderHandle'
import FileItem from "../components/FileItem";
import shareDialog from '../components/ShareDialog/index'
import ShareInfoDialog from '../components/ShareInfoDialog/index'
import MoveCopyDialog from '../components/MoveCopyDialog/index.vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import CloudInfo from "../components/CloudInfo";
import { deleteFile, rename } from '@/api/clouddisk/file.js';
import { useWindowSize } from "@vueuse/core"
import ListEmpty from '../components/ListEmpty'
import { downloadMulti } from '@/utils/request.js';
import cache from '@/plugins/cache'

const store = useStore()
const route = useRoute()
const assortId = ref(0)
// const showInfo = ref(false)
const listBoxHeight = ref(0)
const loadingStatus = ref(true)
const shareShow = ref(false)
const moveCopyShow = ref(false)
const moveCopytype = ref('')
const fileIds = ref([])
const moveCat = ref(null) // 移动类型
const shareInfo = ref({})
const shareFileType = ref('')
const sortCheck = ref([0, -1])
const shareInfoShow = ref(false)
const contextmenuRef = ref('')

onMounted(() => {
  listBoxHeight.value = document.documentElement.clientHeight - 120;
  assortId.value = route.params.assortId * 1 || 6
	store.commit('clouddisk/SET_FILE_LIST_CAT', assortId.value)
  getFileTypeList()
  loadingStatus.value = false
  watchEffect(() => {
    onresize(width.value)
  })
})

const showCheck = computed(() => {
  for (var key in assortFileList.value) {
    if (assortFileList.value[key]?.check) {
      return true;
    }
  }
  return false;
})

const assortFileList = computed(()=>{
  const list = store.state.clouddisk.fileList
  cache.session.setJSON('FIList', list)
  cache.session.remove('FOList')
  return list
})

const layoutType = computed(() => {
  return store.state.clouddisk.layoutType
})

const count = computed(()=>{
  return assortFileList.value.length || 0
})

const showInfo = computed(() => {
  return store.state.clouddisk.showInfo
})

watch(() => route, newVal => {
  // if (route.path.includes('/media/assort') || route.path.includes('/media/index')) {
  //   assortId.value = newVal.params.assortId * 1 || 6
  //   keyword.value = ''
  //   pageNum.value = 1
  //   pageSize.value = 50
  //   store.commit('clouddisk/SET_FILE_LIST_CAT', assortId.value)
  //   getFileTypeList()
  // }
  // lastCheckData.value = {}
})

const { width } = useWindowSize();
const column = ref(4)
const onresize = (clientWidth) => {
  if (clientWidth < 768) {
    column.value = 1;
  } else if (clientWidth < 1080) {
    column.value = 2;
  } else if (clientWidth < 1280) {
    column.value = 3;
  } else if (clientWidth < 1480) {
    column.value = 4;
  } else if (clientWidth < 1680) {
    column.value = 5;
  } else if (clientWidth < 1880) {
    column.value = 6;
  } else if (clientWidth < 2080) {
    column.value = 7;
  } else if (clientWidth < 2280) {
    column.value = 8;
  }else{
    column.value = 9;
  }
  if (column.value > 1) {
    column.value = column.value - Number(showInfo.value)
  }
}

const pageNum = ref(1)
const pageSize = ref(50)
const keyword = ref('')
const orderByColumn = ref('')
const isAsc = ref('')
const total = ref(0)
function getFileTypeList() {
  const catArr = ['video', 'audio', 'image', 'dom', 'other']
  const fileCat = catArr[route.params.assortId * 1 - 1]
  const params = {
    type: fileCat,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    keyword: keyword.value,
    orderByColumn: orderByColumn.value,
    isAsc: isAsc.value,
  }
  loadingStatus.value = true
  getTypeList(params).then(res => {
    const data = res.rows
    total.value = res.total
    if (pageNum.value*1 === 1) {
      store.commit('clouddisk/SET_FILE_LIST', []);
    }
    const newArr = assortFileList.value
    data.forEach(el => {
      const obj = el
      obj.metaData = JSON.parse(el.metaData)
      newArr.push(obj)
    });
    // assortFileList.value = newArr
    loadingStatus.value = false
    store.commit('clouddisk/SET_FILE_LIST', newArr);
  })
}

const breadcrumbs = computed(()=>{
  return store.state.clouddisk.breadcrumbs;
})

const lastBreadcrumbs = computed(()=>{
  const length = breadcrumbs.value?.length
  return length > 0 ? breadcrumbs.value[length - 1] : {}
})

// 已选的文件/文件夹
const selectFiles = computed(()=>{
  const data = [];
  for (var key in assortFileList.value) {
    if(assortFileList.value[key].check){
      data.push(assortFileList.value[key])
    }
  }
  return data;
})

const isCheckAll = computed(() => {
  return selectFiles.value.length === assortFileList.value.length
})

// 创建分享
const shareData = ref([])
function handleShare(data) {
  if(!Array.isArray(data)){
    data = [data]
  }
  shareData.value = []
  shareFileType.value = ''
  data.forEach(el => {
    shareData.value.push({
      id: el.id,
      name: el.name
    })
    if (el.fileCat === 'video') {
      shareFileType.value = 'video'
    }
  });
  shareShow.value = true
}

function shareClose() {
  shareShow.value = false
}

async function handleDownloadFiles(data) {
  let list = data
  if (!Array.isArray(list)) {
    list = [list]
  }
  const params = list.map(el => {
    return {
      id: el.id,
      filename: el.name
    }
  })
  const result = await getFileDownloadUrl(params)
  const requestData = result.data.map(el => {
      return {
          url: el.downloadUrl,
          params: {},
          fileName: ''
      }
  })
  downloadMulti(requestData).then(res => {
    console.log(res);
  }).catch(err => {
    console.error(err);
  })
}

function handlePrevent() {
  console.log('yl')
}

function handleShowCheck(val) {
  showCheck.value = val
}

function handleCopy(data) {
  fileIds.value = [data.id]
  moveCopytype.value = 'copy'
  moveCopyShow.value = true
}

function handleMove(data) {
  fileIds.value = [data.id]
  moveCat.value = data.type
  moveCopytype.value = 'move'
  moveCopyShow.value = true
}

// 批量复制
const handleBatchCopy = (e) => {
  if(!Array.isArray(e)){
    e = [e]
  }
  const ids = e.map(item=>item.id);
  fileIds.value = ids
  moveCopytype.value = 'copy'
  moveCopyShow.value = true
}

// 批量移动
const handleBatchMove = (e) => {
  if(!Array.isArray(e)){
    e = [e]
  }
  const ids = e.map(item=>item.id);
  fileIds.value = ids
  moveCopytype.value = 'move'
  moveCopyShow.value = true
}

function handleMoveCopyClose() {
  moveCopyShow.value = false
}

const handleDelete = (data) => {
  const text = `确定删除${data.type===1?'文件夹':'文件'} <span style="color:red;">"${data.name}"</span>？删除后${data.type===1?'文件夹':'文件'}将被移至回收站。`;
  const title = `删除`;
  ElMessageBox.confirm(text, title, {
    customClass: 'messageBox-custom-warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: true,
    center: true,
    dangerouslyUseHTMLString: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        })
        deleteFile({id: data.id}).then(res => {
          const newArr = assortFileList.value.filter(el => el.id !== data.id)
          store.commit('clouddisk/SET_FILE_LIST', newArr);
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
		      loading.close()
          done();
        }).catch((err) => {
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

// 全选
const handleCheckAll = (e) => {
  for (var key in assortFileList.value) {
    assortFileList.value[key].check = true;
  }
}

// 全不选
const handeCancel = () => {
  for (var key in assortFileList.value) {
    if (assortFileList.value[key].check) {
      assortFileList.value[key].check = false;
    }
  }
}

const handleFileRadio = (e) => {
  handeCancel()
  e.check = true;
}

// 移动成功
function handleMoveSuccess() {
  keyword.value = ''
  pageNum.value = 1
  pageSize.value = 50
  store.commit('clouddisk/SET_FILE_LIST_CAT', assortId.value)
  getFileTypeList()
}

const handleBatchDelete = () => {
  pageNum.value = 1
  pageSize.value = 50
  getFileTypeList()
}

const cloudHeaderHandleRef = ref()
function handleBatchDelete2() {
  cloudHeaderHandleRef.value.handleDelete()
}

function handleShowInfo() {
	store.commit('clouddisk/SET_SHOW_INFO', !showInfo.value)
}

// 搜索
const handleSearchChange = (word) => {
  keyword.value = word
  pageNum.value = 1
  pageSize.value = 50
  getFileTypeList()
}

// 排序
const handleSortChange = (sort) => {
  sortCheck.value = sort
  orderByColumn.value = sort[0]
  isAsc.value = sort[1]
  pageNum.value = 1
  pageSize.value = 50
  getFileTypeList()
}

const handleUploadSuccess = () => {
  pageNum.value = 1
  pageSize.value = 50
  getFileTypeList()
}

// 创建分享成功
const shareSuccess = (data) => {
  shareInfo.value = data
  shareShow.value = false
  shareInfoShow.value = true
}

// 分享信息关闭
const shareInfoClose = () => {
  shareInfoShow.value = false
}

// 重命名提交
const handleRename = (data) => {
  loadingStatus.value = true
  rename({id: data.id, name: data.name}).then(res => {
    ElMessage.success('重命名成功')
    const list = assortFileList.value
    const newlist = list.map(el => {
      const obj = el
      if (obj.id === data.id) {
        obj.name = data.name
      }
      return obj
    })
    store.commit('clouddisk/SET_FILE_LIST', newlist);
    loadingStatus.value = false
  })
}

// 滚动条加载更多
const filelistRef = ref('')
const scrollbarRef = ref('')
function handleScroll(e) {
  const scrollHeight = scrollbarRef.value.wrap$.scrollHeight // 滚动条高度
  const viewHeight = filelistRef.value.clientHeight // 列表视窗高度
  if (e.scrollTop > (scrollHeight-viewHeight-100) && !loadingStatus.value && assortFileList.value?.length < total.value) {
    pageNum.value += 1
    getFileTypeList()
  }
}

const cloudHeaderRef = ref('')
function handleUploadFiles() {
  cloudHeaderRef.value.handleFiles('File')
}
function handleUploadFolder() {
  cloudHeaderRef.value.handleFiles('Files')
}

function handleCreateWpsSuccess() {
  pageNum.value = 1
  pageSize.value = 50
  getFileTypeList()
}

const lastCheckData = ref({})
function handleCheck(item) {
  lastCheckData.value = item

  if (item.check) {
    lastCheckData.value = item
  } else {
    console.log(selectFiles.value);
    if (selectFiles.value.length > 0) {
      lastCheckData.value = selectFiles.value[selectFiles.value.length - 1]
    } else {
      lastCheckData.value = {}
    }
  }
}

</script>
<style scoped lang="scss">
  @import "./style.scss";
</style>
