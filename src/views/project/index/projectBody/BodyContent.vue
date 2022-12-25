<template>
    <div class="project-container">
        <div v-show="!showCheck">
            <header-action ref="HeaderActionRef" @onUploadFile="onUploadFile" @onUploadFiles="onUploadFiles" @onOpenShare="handleOpenCollection" @clickBreadcrumb="handleOpenFolder">
            </header-action>
        </div>
        <div v-show="showCheck">
            <header-handle ref="headerHandleRef" :selectFiles="selectFiles" @check-all="handleCheckAll" @share="handleShares" @onDownload="handleDownload" @onMove="handleMoveFiles" @onCopy="handleCopyFiles"
                @cancel="handeCancel"></header-handle>
        </div>
        <el-scrollbar class="main-content" @click.stop="handleClickContent" :view-style="{height:emptyProject ?'100%':'auto'}" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)"
            v-contextmenu:contextmenuRef>
            <template v-if="!loadingStatus&&!emptyProject">
                <div style="padding: 20px; position: relative">
                    <div class="files-title" v-if="fileData&&folderData.length > 0">
                        <span @click.stop="handleSwichList('folder')">
                            文件夹({{folderData.length}})
                            <el-icon>
                                <CaretBottom v-if="listSwitch.folder" />
                                <CaretRight v-else />
                            </el-icon>
                        </span>
                    </div>
                    <el-row :gutter="20" style="font-size: 14px; margin: 0px;" v-show="fileData&&folderData.length > 0 && listSwitch.folder">
                        <el-col :span="24" class="file-table-header" v-if="layoutType == 'list'">
                            <div class="file-table-th" style="width: 51%">文件名</div>
                            <div class="file-table-th" style="width: 10%">文件类型</div>
                            <div class="file-table-th" style="width: 10%">文件大小</div>
                            <div class="file-table-th" style="width: 10%">添加者</div>
                            <div class="file-table-th" style="width: 14%">添加日期</div>
                            <div class="file-table-th" style="width: 5%">操作</div>
                        </el-col>
                        <template v-for="(item, index) in folderData" :key="index">
                            <file-item type="folder" :data="item" :layoutType="layoutType" @onShare="handleShare" @onChangeRadio="handleFileRadio" @onOpenFolder="handleOpenFolder"
                                @onCollection="handleOpenCollection" @onCopyFiles="handleCopyFiles" @onChange="handleChangeCheck" @onMoveFiles="handleMoveFiles" :width="String(100/column) + '%'"
                                :show-check="showCheck" 
                                :selectLength="selectFiles.length">
                            </file-item>
                        </template>
                    </el-row>
                    <div class="files-title" v-if="fileData&&fileData.length > 0">
                        <span @click.stop="handleSwichList('file')">
                            文件({{fileData.length}})
                            <el-icon>
                                <CaretBottom v-if="listSwitch.file" />
                                <CaretRight v-else />
                            </el-icon>
                        </span>
                    </div>
                    <el-row :gutter="20" style="font-size: 14px; margin: 0px;" v-show="fileData.length > 0 && listSwitch.file">
                        <el-col :span="24" class="file-table-header" v-if="layoutType == 'list'">
                            <div class="file-table-th" style="width: 41%">文件名</div>
                            <div class="file-table-th" style="width: 10%">审核状态</div>
                            <div class="file-table-th" style="width: 10%">文件类型</div>
                            <div class="file-table-th" style="width: 10%">文件大小</div>
                            <div class="file-table-th" style="width: 10%">添加者</div>
                            <div class="file-table-th" style="width: 14%">添加日期</div>
                            <div class="file-table-th" style="width: 5%; text-align:center;">操作</div>
                        </el-col>
                        <template v-for="(item, index) in fileData" :key="index">
                            <file-item 
                                :data="item" 
                                @onShare="handleShare" 
                                @onChangeRadio="handleFileRadio" 
                                @onManagerDialog="handleOpenManagerVersion" 
                                @onUploadVersion="handleUploadVersion"
                                @onCopyFiles="handleCopyFiles" 
                                @onMoveFiles="handleMoveFiles" 
                                @onChange="handleChangeCheck" 
                                :layoutType="layoutType" 
                                :type="item.fileCat"
                                :selectLength="selectFiles.length"
                                :width="String(100/column) + '%'" :show-check="showCheck">
                            </file-item>
                        </template>
                    </el-row>
                </div>
            </template>
            <template v-else-if="!loadingStatus">
                <Empty style="height: 100%;">
                    <template #description>
                        <div style="font-size: 14px;">将文件拖拽到这里</div>
                        <div style="font-size: 14px; margin-top:16px;">支持图片、视频、音频、文档等多类型文件</div>
                    </template>
                    <template #default>
                        <el-button bg round type="primary" style="background: #2A2C36; border:none; width: 112px;" @click="handleUploadFiles">上传文件</el-button>
                        <el-button bg round type="primary" style="background: #2A2C36; border:none; width: 112px;" @click="handleUploadFolder">上传文件夹</el-button>
                    </template>
                </Empty>
            </template>
        </el-scrollbar>
    </div>
    <DragUpload @onDrop="handleDropFiles" :onShowBefor="handleDragFilesOver"></DragUpload>
    <CreateShareDialog ref="CreateShareDialogRef" @onSubmitSuccess="handleOpenShare"></CreateShareDialog>
    <ProjectShareDialog ref="ProjectShareDialogRef"></ProjectShareDialog>
    <ProjectSelectFolder ref="ProjectSelectFolderRef"></ProjectSelectFolder>
    <ProjectManagerDialog ref="ProjectManagerDialogRef"></ProjectManagerDialog>
    <ProjectCollectionDialog ref="ProjectCollectionDialogRef"></ProjectCollectionDialog>

    <v-contextmenu :width="140" ref="contextmenuRef">
        <div v-if="selectFiles.length > 1">
            <v-contextmenu-item :disabled="!authRule('share')" @click="handleShares">
                <svg-icon iconClass="icon_sharing" :size="20" ></svg-icon>
                <span>分享</span>
            </v-contextmenu-item>
            <v-contextmenu-item :disabled="!authRule('copy')" @click="handleCopyFiles(selectFiles)">
                <svg-icon iconClass="icon_copy" :size="20" ></svg-icon>
                <span>复制到</span>
            </v-contextmenu-item>
            <v-contextmenu-item :disabled="!authRule('copy')" @click="handleMoveFiles(selectFiles)">
                <svg-icon iconClass="icon_move-to" :size="20" ></svg-icon>
                <span>移动到</span>
            </v-contextmenu-item>
            <v-contextmenu-item :disabled="!authRule('download') || isCheckFolder" @click="handleDownload(selectFiles)">
                <svg-icon iconClass="icon_download" :size="20" ></svg-icon>
                <span>批量下载</span>
            </v-contextmenu-item>
            <v-contextmenu-item :disabled="!authRule('delete')" @click="handleBatchDelete">
                <svg-icon iconClass="icon_delete" :size="20" ></svg-icon>
                <span>批量删除</span>
            </v-contextmenu-item>
        </div>
        <div v-else>
            <v-contextmenu-item @click="handleOpenDialog('Folder')">
                <svg-icon className="actions-menu-icon" iconClass="icon_document2-c" :size="20"></svg-icon>
                <span>新建文件夹</span>
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleOpenDialog('file','新建文档','.docx')">
                <svg-icon className="actions-menu-icon" iconClass="icon_doc-c" :size="20"></svg-icon>
                新建文档
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleOpenDialog('file','新建表格','.xlsx')">
                <svg-icon className="actions-menu-icon" iconClass="icon_excel-c" :size="20"></svg-icon>
                新建表格
            </v-contextmenu-item>
            <v-contextmenu-item @click="handleOpenDialog('file','新建演示','.pptx')">
                <svg-icon className="actions-menu-icon" iconClass="icon_ppt-c" :size="20"></svg-icon>
                新建演示
            </v-contextmenu-item>
        </div>
    </v-contextmenu>

</template>

<script setup>
import CreateShareDialog from "../components/CreateShareDialog"
import ProjectShareDialog from "../components/ProjectShareDialog"
import ProjectManagerDialog from "../components/ProjectManagerDialog"
import ProjectCollectionDialog from "../components/ProjectCollectionDialog"
import ProjectSelectFolder from "../../components/ProjectSelectFolder"
import HeaderHandle from "./HeaderHandle.vue";
import HeaderAction from "./HeaderAction.vue";
import FileItem from "./FileItem.vue";
import UploadFile from "@/utils/uploadFile.js";
import { downloadMulti } from "@/utils/request.js"
import { createUploadSign, createUploadFile, createDirectory, batchCreateDirectory, getFileDownloadUrl, getDetails } from '@/api/project/files.js'
import { computed, ref, reactive, watch, onMounted , onUnmounted} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router"
import { useWindowSize } from "@vueuse/core"
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const handleTranscodSuccess = (attach)=>{
    if(attach.noticeType == 10){
        for(const item of fileData.value){
            if(attach.sourceData.file_key === item.fileKey){
                item.codingStatus = attach.sourceData.coding_status;
                break;
            }
        }
    }
}

IM_EVENT_LISTERNER.addEventListenerIM('SYSTEM', handleTranscodSuccess);
onUnmounted(()=>{
    IM_EVENT_LISTERNER.removeEventListenerIM('SYSTEM', handleTranscodSuccess);
    store.commit('project/SET_SEARCH_KEY', '');
})


const contextmenuRef = ref('');
const CreateShareDialogRef = ref();
const ProjectShareDialogRef = ref();
const ProjectSelectFolderRef = ref();
const ProjectManagerDialogRef = ref();
const ProjectCollectionDialogRef = ref();
const loadingStatus = ref(false);
const HeaderActionRef = ref();
const route = useRoute();
const store = useStore();
const router = useRouter();
const openInfo = computed(() => {
    return store.state.project.openInfo;
})
const layoutType = computed(() => {
    return store.state.project.layoutType;
});

const searchKey = computed(() => {
    return store.state.project.searchKey;
});
const projectData = computed(() => {
    return store.state.project.projectData;
});

const fileData = computed(() => {
    if (!searchKey.value) { return store.state.project.fileList || [] }
    const listData = store.state.project.fileList.filter(item => {
        return item.name.indexOf(searchKey.value) > -1;
    });
    return listData || [];
});
const folderData = computed(() => {
    if (!searchKey.value) { return store.state.project.folderList || [] }
    const listData = store.state.project.folderList.filter(item => {
        return item.name.indexOf(searchKey.value) > -1;
    });
    return listData || [];
});
const breadcrumbs = computed(() => {
    return store.state.project.breadcrumbs;
})
// 已选的文件/文件夹
const isCheckFolder = ref(false)
const selectFiles = computed(() => {
    const data = [];
    isCheckFolder.value = false
    for (var key in folderData.value) {
        if (folderData.value[key].check) {
            isCheckFolder.value = true
            data.push(folderData.value[key])
        }
    }
    for (var key in fileData.value) {
        if (fileData.value[key].check) {
            data.push(fileData.value[key])
        }
    }
    return data;
})

// 是否是空文件
const emptyProject = computed(() => {
    if (fileData.value.length || folderData.value.length) {
        return false;
    } else {
        return true;
    }
})
const showCheck = computed(() => {
    for (var key in fileData.value) {
        if (fileData.value[key].check) {
            return true;
        }
    }
    for (var key in folderData.value) {
        if (folderData.value[key].check) {
            return true;
        }
    }
    return false;
});


const column = ref(4)
const onresize = (clientWidth) => {
    const span = Number(openInfo.value)
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
    } else {
        column.value = 9;
    }
    if (column.value > 1) {
        column.value = column.value - span
    }
}
const { width } = useWindowSize();

// 文件列表开关
const listSwitch = reactive({
    file: true,
    folder: true
})

// 文件列表开关
const handleSwichList = (name) => {
    listSwitch[name] = !listSwitch[name]
}

// 发起收集
const handleOpenCollection = ({ id, qrcode, url, info }) => {
    ProjectCollectionDialogRef.value.open(id, qrcode, url, info)
}

/* 全选 */
const handleCheckAll = (e) => {
    for (var key in folderData.value) {
        folderData.value[key].check = true;
    }
    for (var key in fileData.value) {
        fileData.value[key].check = true;
    }
};
// 全不选
const handeCancel = () => {
    for (var key in folderData.value) {
        if (folderData.value[key].check) {
            folderData.value[key].check = false;
        }
    }
    for (var key in fileData.value) {
        if (fileData.value[key].check) {
            fileData.value[key].check = false;
        }
    }
    store.commit('project/SET_RIGHT_DATA', {
        type: 1,
        data: projectData.value,
    })
    seletedList.value = []
};

const handleClickContent = () => {
    handeCancel();
}
const seletedList = ref([])
const handleChangeCheck = (e) => {
    e["check"] = !e["check"];
    if (e["check"]) {
        seletedList.value.push(e)
    } else {
        const fArr = seletedList.value.filter(el => el.id !== e.id)
        seletedList.value = fArr
    }
    const rdata = seletedList.value[seletedList.value.length - 1]
    if (rdata) {
        if (rdata.type == 1) {
            getDetails({ id: rdata.id }).then(res => {
                store.commit('project/SET_RIGHT_DATA', {
                    type: 2,
                    data: res.data,
                })
            })
        }else{
            store.commit('project/SET_RIGHT_DATA', {
                type: 2,
                data: rdata,
            })
        }
    } else {
        store.commit('project/SET_RIGHT_DATA', {
            type: 1,
            data: projectData.value,
        })
    }
}

// 选中文件或文件夹
const handleFileRadio = (e) => {
    handeCancel();
    e.check = true;
    store.commit('project/SET_RIGHT_DATA', {
        type: 2,
        data: e,
    })
};

// 打开版本管理
const handleOpenManagerVersion = ({ id }) => {
    ProjectManagerDialogRef.value.open(id);
}
// 创建分享多选文件
const handleShares = () => {
    CreateShareDialogRef.value.open(selectFiles.value);
}
//创建分享
const handleShare = (data) => {
    CreateShareDialogRef.value.open(data);
}
// 打开分享
const handleOpenShare = (data) => {
    const id = null;
    const qrcode = data.qrcode, url = data.url, info = data.info;
    ProjectShareDialogRef.value.open({ id, qrcode, url, info })
}
// 下载
const handleDownload = async (e) => {
    if (!Array.isArray(e)) { e = [e] }
    const list = e.map(item => {
        return {
            id: item.id,
            filename: item.name
        }
    })

    const params = {
        projectId: projectData.value.id,
        list
    }
    const result = await getFileDownloadUrl(params)

    const requestData = result.data.map(el => {
        return {
            url: el.downloadUrl,
            params: {},
            fileName: ''
        }
    })
    downloadMulti(requestData).then(res => {
        handeCancel()
    }).catch(err => {
        console.error(err);
    })
}

// 打开文件夹
const handleOpenFolder = (data) => {
    store.commit('project/SET_FOLDER_INFO', data);
    const parent = data.id;
    const path = route.path;
    router.push({ path, query: { parent } });
}


let versionFileId = null;
// 上传版本
const handleUploadVersion = ({ id }) => {
    versionFileId = id;
    HeaderActionRef.value.handleFiles('File')
}

// 上传文件
const handleUploadFiles = () => {
    versionFileId = null;
    HeaderActionRef.value.handleFiles('File')
}
// 上传文件夹
const handleUploadFolder = () => {
    versionFileId = null;
    HeaderActionRef.value.handleFiles('Files')
}
// 复制到
const handleCopyFiles = (e) => {
    if (!Array.isArray(e)) {
        e = [e]
    }
    const fromProjectId = projectData.value.id;
    const fileIds = e.map(item => item.id);
    ProjectSelectFolderRef.value.open('copy', '复制到', { fromProjectId, fileIds })
}
// 移动到
const handleMoveFiles = (e) => {
    console.log(e)
    if (!Array.isArray(e)) {
        e = [e]
    }
    const fromProjectId = projectData.value.id;
    const fileIds = e.map(item => item.id);
    ProjectSelectFolderRef.value.open('move', '移动到', { fromProjectId, fileIds })
}


// 获取签名
const getUploadSignFun = (obj, callback, errorback) => {
    const projectId = obj.projectId;
    const directoryId = obj.parentId;
    const filename = obj.FileName;
    const size = obj.FileSize;
    const md5 = obj.FileMD5
    const configId = obj.configId
    createUploadSign({ projectId, directoryId, md5, filename, size }).then(res => {
        obj.FileType = res.data.fileCat
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}


// 拖拽文件进入
const handleDragFilesOver = (e, show) => {
    if (loadingStatus.value) {
        return
    }
    for (var item of e.dataTransfer.types) {
        if (item == 'Files') {
            e.preventDefault();
            show()
            return
        }
    }
}

// 创建文件
const CreateUploadFileFun = ({ resultData, options }, callback, errorback) => {
    const params = {
        fileId: resultData.fileId,
        verifyContent: resultData.video?.verify_content || '',
        versionFileId: options.versionFileId,
        sourceContext: options.sourceContext,
    }
    createUploadFile(params).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

// 上传文件
const onUploadFile = (e) => {
    const files = e.target.files;
    const projectId = breadcrumbs.value[breadcrumbs.value.length - 1].projectId;
    const parentId = breadcrumbs.value[breadcrumbs.value.length - 1].parentId;
    for (var File of files) {
        const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
        uploadData.projectId = projectId;
        uploadData.parentId = parentId;
        uploadData.versionFileId = versionFileId;
        store.commit('upload/addFileList', uploadData)
    }
}

// 上传文件夹
const onUploadFiles = (e) => {
    const parentId = breadcrumbs.value[breadcrumbs.value.length - 1].parentId;
    const projectId = breadcrumbs.value[breadcrumbs.value.length - 1].projectId;
    const files = e.target.files;
    const paths = [];
    const filesList = [];
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
    batchCreateDirectory({ paths, parentId, projectId }).then(res => {
        const resultData = res.data;
        for (const File of filesList) {
            const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
            uploadData.parentId = uploadData.FilePath ? resultData[uploadData.FilePath] : parentId;
            uploadData.projectId = projectId;
            store.commit('upload/addFileList', uploadData)
        }
    })
}



// 拖拽文件放下
const handleDropFiles = async (files, pid) => {
    const projectId = projectData.value.id;
    if (!pid) {
        pid = breadcrumbs.value[breadcrumbs.value.length - 1].parentId;
    }
    for (const entry of files) {
        const webkitGetAsEntry = entry.webkitGetAsEntry ? entry.webkitGetAsEntry() : entry;
        if (webkitGetAsEntry.isFile) {
            webkitGetAsEntry.file(async File => {
                const path = webkitGetAsEntry.fullPath.substring(1);
                File.path = path;
                const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
                uploadData.parentId = pid;
                uploadData.projectId = projectId;
                store.commit('upload/addFileList', uploadData)
            }, err => { console.log('文件错误', err) })
        } else {
            const names = webkitGetAsEntry.fullPath.split('/');
            const name = names.splice(-1, 1)[0];
            const result = await createDirectory({ projectId, parentId: pid, name });
            const reader = webkitGetAsEntry.createReader();
            reader.readEntries(entries => {
                if (entries.length > 0) {
                    handleDropFiles(entries, result.data.id);
                }
            }, err => { console.log('目录错误', err) })
        }
    }
}

// 获取数据
const getData = async ({ project_id, parent_id = 0 }) => {
    try {
        loadingStatus.value = true;
        store.commit('project/SET_FILE_LIST', []);
        store.commit('project/SET_FOLDER_LIST', []);
        const data = await store.dispatch('project/handleGetDetails', { id: parent_id });
        const files = await store.dispatch('project/handleGetFiles', { project_id, parent_id });
        const folders = await store.dispatch('project/handleGetFolders', { project_id, parent_id });
        loadingStatus.value = false;
        return Promise.resolve({ files, folders })
    } catch (err) {
        loadingStatus.value = false;
        return Promise.reject()
    }
}

/* 打开弹框 */
const handleOpenDialog = (e, title, suffix) => {
    HeaderActionRef.value.handleOpenDialog(e, title, suffix)
};

const projectList = computed(()=>{
    return [].concat(store.state.project.SeProjects,store.state.project.InProjects,store.state.project.MyProjects)
})

const authRule = (e) => {
    if(!projectData.value.permissions){
        return
    }
    if (projectData.value.currRoleId == 1) { // 所有者
        return true;
    } else if (projectData.value.currRoleId == 2) { // 管理员
        return projectData.value.permissions.adminPermissions.indexOf(e) > -1;
    } else { // 成员
        return projectData.value.permissions.memberPermissions.indexOf(e) > -1;
    }
}

const headerHandleRef = ref()
function handleBatchDelete() {
    headerHandleRef.value.handleDelete()
}

onMounted(async () => {
    if(projectData.value.id != route.params.id){
        for(const item of projectList.value){
            if(item.id == route.params.id){
                await store.dispatch('project/changeProject', item);
                break;
            }
        }
    }
    const directoryId = projectData.value.directoryId;
    const parent_id = route.query.parent || directoryId;
    getData({ project_id: route.params.id, parent_id });
    watchEffect(() => {
        onresize(width.value)
    })
})



</script>
<style scoped lang="scss">
.project-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    flex-direction: column;
    height: 100%;

    .main-content {
        width: 100%;
        height: 100%;
        user-select: none;
        // background: white;
        color: rgba($color: #ffffff, $alpha: 0.4);
        background: #0a0b0d;
        &:deep(.el-empty__image) {
            opacity: 0.6;
        }
        .files-title {
            margin-bottom: 20px;
            span {
                cursor: pointer;
            }
        }
        .file-table-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #bec0cd;
            opacity: 0.4;
            margin-bottom: 5px;
            margin-top: 5px;
            .file-table-th {
                flex-shrink: 0;
            }
        }
    }
}
</style>
