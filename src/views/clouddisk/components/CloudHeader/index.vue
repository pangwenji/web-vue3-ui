<template>
    <div class="cloud-header">
        <div>
            <div v-if="assortId === ''" class="breadcrumbs-box">
                <el-breadcrumb separator-icon="ArrowRight" v-bind="breadcrumbs&&breadcrumbs.length">
                    <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="index" @click.stop="handleTo(item)">
                        <span v-if="index < breadcrumbs?.length-1" class="breadcrumb-text">{{item.name}}</span>
                        <span v-else>{{item.name}}</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <span v-else-if="assortId === 1">视频</span>
            <span v-else-if="assortId === 2">音频</span>
            <span v-else-if="assortId === 3">图片</span>
            <span v-else-if="assortId === 4">文档</span>
            <span v-else-if="assortId === 5">其他</span>
            <span v-else-if="assortId === 6">全部资源</span>
            <span v-if="assortId !== '' && count > 0">({{count}})</span>
        </div>
        <div class="header-r">
            <div class="r-item">
                <el-input :input-style="inputStyle" v-model="searchValue" placeholder="搜索" @change="searchChange" :prefix-icon="Search" />
            </div>
            <div class="r-item">
                <el-popover placement="bottom-end" popper-class="custom-popper-box" :width="132" trigger="click" :teleported="true">
                    <template #reference>
                        <div>
                            <el-tooltip effect="light" content="文件排序" placement="bottom" :show-after="400">
                                <div class="sort-check">
                                    <span class="sort-icon" :class="sortCheck[1]==='asc'?'asc':'desc'">{{sortText}}</span>
                                </div>
                            </el-tooltip>
                        </div>
                    </template>
                    <div class="sort-box">
                        <div class="sort">
                            <div class="sort-title">文件排序</div>
                            <div v-for="item in sortList" :key="item.key" class="sort-item" @click="handleSort(0, item.value)">
                                <span>{{item.title}}</span>
                                <span v-if="sortCheck[0] === item.value">
                                    <i class="icon-check"></i>
                                </span>
                            </div>
                        </div>
                        <div class="rule">
                            <div class="sort-title">规则</div>
                            <div class="sort-item" @click="handleSort(1, 'asc')">
                                <span v-if="sortCheck[0] === 'create_time'">由旧到新</span>
                                <span v-if="sortCheck[0] === 'name'">正序</span>
                                <span v-if="sortCheck[0] === 'size'">由小到大</span>
                                <span v-if="sortCheck[1] === 'asc'">
                                    <i class="icon-check"></i>
                                </span>
                            </div>
                            <div class="sort-item" @click="handleSort(1, 'desc')">
                                <span v-if="sortCheck[0] === 'create_time'">由新到旧</span>
                                <span v-if="sortCheck[0] === 'name'">倒序</span>
                                <span v-if="sortCheck[0] === 'size'">由大到小</span>
                                <span v-if="sortCheck[1] === 'desc'">
                                    <i class="icon-check"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </el-popover>
            </div>
            <div class="r-item">
                <el-tooltip effect="light" content="布局" placement="bottom" :show-after="400">
                    <span v-if="layoutType === 'card'" @click="handleLayoutType('list')">
                        <svg-icon iconClass="icon_list2" :size="32"></svg-icon>
                    </span>
                    <span v-else @click="handleLayoutType('card')">
                        <svg-icon iconClass="icon_card2" :size="32"></svg-icon>
                    </span>
                </el-tooltip>
            </div>
            <div class="r-item upload-box">
                <el-popover placement="bottom-end" popper-class="custom-popper-box" :width="132" trigger="click" :teleported="true">
                    <template #reference>
                        <div class="s-title">
                            <span>{{(createWps || createFolder)?'上传/新建':'上传'}}</span>
                            <!-- <i class="down-icon"></i> -->
                        </div>
                    </template>
                    <div class="upload-create">
                        <div class="up-item-title">上传</div>
                        <div class="up-item" @click.stop="handleFiles('File')">
                            <svg-icon className="actions-menu-icon" iconClass="icon_file-c" :size="20"></svg-icon>
                            <span>文件</span>
                        </div>
                        <div v-if="uploadFolder" class="up-item" @click.stop="handleFiles('Files')">
                            <svg-icon className="actions-menu-icon" iconClass="icon_document2-c" :size="20"></svg-icon>
                            <span>文件夹</span>
                        </div>
                        <div v-if="createWps" class="up-item-title">新建</div>
                        <div v-if="createFolder" class="up-item" @click.stop="handleOpenDialog('Folder','新建文件夹')">
                            <svg-icon className="actions-menu-icon" iconClass="icon_document2-c" :size="20"></svg-icon>
                            <span>文件夹</span>
                        </div>
                        <div v-if="createWps" class="up-item" @click.stop="handleOpenDialog('file','新建文档','.docx')">
                            <svg-icon className="actions-menu-icon" iconClass="icon_doc-c" :size="20"></svg-icon>
                            <span>文档</span>
                        </div>
                        <div v-if="createWps" class="up-item" @click.stop="handleOpenDialog('file','新建表格','.xlsx')">
                            <svg-icon className="actions-menu-icon" iconClass="icon_excel-c" :size="20"></svg-icon>
                            <span>表格</span>
                        </div>
                        <div v-if="createWps" class="up-item" @click.stop="handleOpenDialog('file','新建演示','.pptx')">
                            <svg-icon className="actions-menu-icon" iconClass="icon_ppt-c" :size="20"></svg-icon>
                            <span>演示</span>
                        </div>
                    </div>
                </el-popover>
            </div>
            <div>
                <el-tooltip effect="light" content="文件信息" placement="bottom" :show-after="400">
                    <span class="info-box" @click="handleShowInfo">
                        <svg-icon iconClass="icon_info2" :size="32"></svg-icon>
                    </span>
                </el-tooltip>
            </div>
        </div>

    <input
      type="file"
      ref="uploadFile"
      multiple
      :webkitdirectory="false"
      :accept="upAccept"
      hidden
      @change="handleUploadFile"
    />
    <input
      type="file"
      ref="uploadFiles"
      multiple
      :webkitdirectory="true"
      hidden
      @change="handleUploadFiles"
    />
    
    <el-dialog
      v-model="dialogVisible"
      :title="increateTitle"
      width="30%"
      custom-class="dialog-center2"
    >
      <el-form :model="increateFolder" :rules="increateRules" ref="increateRef">
        <el-form-item prop="name">
          <el-input input-style="border-radius: 10px;height: 46px;" v-model="increateFolder.name" ref="increateInput" @keyup.enter.native="handleSubmit" placeholder="请输入文件夹名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="btnLoading"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>

</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import UploadFile from "@/utils/uploadFile"
import { ElMessage } from 'element-plus'
import {
    createUploadSign,
    createUploadFile,
    createDirectory,
    createWpsFile,
    batchCreateDirectory
} from '@/api/clouddisk/file.js'
import cache from '@/plugins/cache'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter();
const props = defineProps({
    layoutType: {
        type: String,
        default: 'crad'
    },
    count: {
        type: Number,
        default: 0
    },
    createWps: {
        type: Boolean,
        default: false
    },
    createFolder: {
        type: Boolean,
        default: true
    },
    uploadFolder: {
        type: Boolean,
        default: true
    },
})

const emits = defineEmits([
    'onShowInfo',
    'onSearchChange',
    'onSortChange',
    'onUploadSuccess',
    'onCreateFolderSuccess',
    'onCreateWpsSuccess'
])
const inputStyle = ref({
    width: '170px',
    height: '32px',
    background: '#0C0D11',
    'border-radius': '20px',
    color: '#ffffff'
})
const searchValue = ref('')
const sortList = ref([
    {
        key: 0,
        title: '创建时间',
        value: 'create_time'
    },
    {
        key: 1,
        title: '文件名称',
        value: 'name'
    },
    {
        key: 2,
        title: '文件大小',
        value: 'size'
    }
])
const sortCheck = ref(['create_time', 'asc'])
const uploadFile = ref()
const uploadFiles = ref()
const dialogVisible = ref(false)
const increateInput = ref('')
const increateFolder = reactive({
    name: "新建文件夹",
    suffix: ''
})
const increateRules = reactive({
    name: [{ required: true, message: "请填写文件名称", trigger: "blur" }]
})
const increateTitle = ref('新建文件夹')
const btnLoading = ref(false)

onMounted(() => {
    if (breadcrumbs.value?.length === 0) {
        store.commit('clouddisk/SET_BREAD_CRUMBS', cache.session.getJSON('sessionCloudCRUMBS'))
    }
})

const breadcrumbs = computed(() => {
    return store.state.clouddisk.breadcrumbs;
})
const assortId = computed(() => {
    return store.state.clouddisk.fileListCat || ''
})

const lastBreadcrumbs = computed(() => {
    const length = breadcrumbs.value?.length
    return length > 0 ? breadcrumbs.value[length - 1] : {}
})

// 上传文件类型限制
const upAccept = computed(() => {
    const acceptArr = ['video/*,.flv', 'audio/*', 'image/*', '.doc,.docx,.xls,.xlsx,.ppt,.pptx', '*']
    return acceptArr[assortId.value - 1]
})


const sortText = computed(() => {
    const obj = sortList.value.find(el => el.value === sortCheck.value[0])
    return obj?.title || ''
})

watch(() => route.path, () => {
    searchValue.value = ''
})



function handleSort(type, val) {
    sortCheck.value[type] = val
    emits('onSortChange', sortCheck.value)
}

function handleLayoutType(type) {
    store.commit('clouddisk/SET_LAYOUT_TYPE', type)
}

// 上传文件夹/文件夹
let fileId = null;
const isUpFiles = ref(false)
const handleFiles = (e, id) => {
    switch (e) {
        case 'File':
            fileId = id
            isUpFiles.value = false
            uploadFile.value.click()
            break
        case 'Files':
            isUpFiles.value = true
            uploadFiles.value.click()
            break
    }
}

// 上传文件
const rpath = ref('')
const lastPid = ref(0)
const handleUploadFile = (e) => {
    const files = e.target.files;
    rpath.value = route.path
    lastPid.value = lastBreadcrumbs.value?.parentId || 0
    for (var File of files) {
        const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
        uploadData.parentId = lastBreadcrumbs.value?.parentId || 0;
        store.commit('upload/addFileList', uploadData)
    }
    uploadFile.value.value = ''
}
// 上传文件夹
const handleUploadFiles = (e) => {
    const files = e.target.files;
    if (files.length === 0)  return;
    const paths = [];
    const filesList = [];
    rpath.value = route.path
    lastPid.value = lastBreadcrumbs.value?.parentId || 0
    for (const File of files) {
        let path = null;
        if (File.webkitRelativePath) {
            const p = File.webkitRelativePath.split('/');
            p.splice(-1, 1);
            path = p.join('/')
            paths.push(path);
        }
        File.path = path;
        filesList.push(File);
    }
    const parentId = lastBreadcrumbs.value?.parentId || 0;
    batchCreateDirectory({ paths, parentId }).then(res => {
        const resultData = res.data;
        for (const File of filesList) {
            const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
            uploadData.parentId = uploadData.FilePath ? resultData[uploadData.FilePath] : parentId;
            store.commit('upload/addFileList', uploadData)
        }
    })
}

// 获取签名
const getUploadSignFun = (obj, callback, errorback) => {
    const directoryId = obj.parentId;
    const filename = obj.FileName;
    const size = obj.FileSize;
    const md5 = obj.FileMD5;
    createUploadSign({ directoryId, filename, size, md5 }).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

// 创建文件
let clearTime;
const CreateUploadFileFun = ({ resultData, options }, callback, errorback) => {
    const params = {
        fileId: resultData.fileId,
        verifyContent: resultData.video?.verify_content || '',
        sourceContext: options.sourceContext,
    }
    createUploadFile(params).then(res => {
        if (rpath.value === route.path) {
            if (clearTime) {
                clearTimeout(clearTime);
                clearTime = null;
            }
            clearTime = setTimeout(() => {
                if (rpath.value !== route.path) {
                    return
                }
                if (assortId.value > 0) {
                    emits('onUploadSuccess')
                } else if (isUpFiles.value) {
                    store.dispatch("clouddisk/getCloudFolderList", { parent_id: lastPid.value })
                } else {
                    store.dispatch("clouddisk/getCloudFileList", { parent_id: lastPid.value })
                }
            }, 1500)
        }
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

function handleShowInfo() {
    emits('onShowInfo')
}

// function handleAll() {
//   store.commit('clouddisk/SET_BREAD_CRUMBS', [])
//   store.dispatch("clouddisk/handleOpenFolder",{id: 0, name: '全部文件'}).then(res=>{
//     // loadingStatus.value = false;
//   }).catch(err=>{
//     // loadingStatus.value = false;
//   })
// }

// 打开弹框
const handleOpenDialog = (e, title, suffix) => {
    increateTitle.value = title;
    increateFolder.name = title;
    increateFolder.suffix = e === 'file' ? suffix : '';
    dialogVisible.value = true;
    nextTick(() => {
        increateInput.value.select()
    })
};

// 提交新建文件夹
function handleSubmit() {
  if (btnLoading.value) return
  const name = increateFolder.name
  const suffix = increateFolder.suffix
  const parentId = lastBreadcrumbs.value?.parentId || 0
  if(!increateFolder.suffix){
    btnLoading.value = true
    createDirectory({name,parentId}).then(res => {
      ElMessage({
        type: 'success',
        message: '创建成功',
      })
      dialogVisible.value = false
      btnLoading.value = false
      emits('onCreateFolderSuccess', res.data)
    }).catch(err => {
      btnLoading.value = false
    })
  }else{
    btnLoading.value = true
    createWpsFile({fileName:name+suffix, directoryId:parentId}).then(res => {
      ElMessage({
        type: 'success',
        message: '创建成功',
      })
      dialogVisible.value = false
      btnLoading.value = false
      emits('onCreateWpsSuccess')
    }).catch(err => {
      btnLoading.value = false
    })
  }


}

// 跳转
const handleTo = (item) => {
    if (lastBreadcrumbs.value?.id === item.id) {
        return
    }
    router.push({ path: `/clouddisk/media/folder/${item.id}` })
}

const searchChange = () => {
    emits('onSearchChange', searchValue.value)
}

defineExpose({
    handleFiles,
    handleOpenDialog
})

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
<style lang="scss">
  .custom-popper-box.el-popper{
    min-width: 100px;
    padding: 12px 0;
    .sort-box{
      user-select: none;
      .sort, .rule{
        font-size: 12px;display: flex;flex-direction: column;
        .sort-item,.sort-title{
          width: 100%;
          height: 30px;
          padding: 0 12px;
          margin-top: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .icon-check{
          display: inline-block;
          width: 24px;
          height: 24px;
          background-size: 100%;
          background-image: url("@/assets/icons/clouddisk/icon_gouxuan@2x.png");
        }
      }
      .sort-title{
        color: #9B9EAE;
        cursor: auto;
      }
      .sort-item{
        cursor: pointer;
      }
      .sort-item:hover{
        background-color: #9B9EAE;
      }
    }
    .upload-create{
      font-size: 12px;
      display: flex;
      flex-direction: column;
      .up-item, .up-item-title{
        width: 100%;
        height: 30px;
        padding: 0 12px;
        margin-top: 4px;
        display: flex;
        align-items: center;
      }
      .up-item:hover{
        cursor: pointer;
        background-color: #9B9EAE;
      }
      .up-item-title{
        opacity: .6;
      }
      .actions-menu-icon{
        margin-right: 6px;
      }
    }
  }
</style>