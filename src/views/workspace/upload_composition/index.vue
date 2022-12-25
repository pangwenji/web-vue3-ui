<template>
    <div class="composition_container">
        <div class="composition_main" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
            <div class="composition_main-header">
                <div class="left-container">
                    <div class="title">添加素材</div>
                    <el-dropdown trigger="click" @command="handleChangeType">
                        <el-button type="primary" color="#24262F">
                            {{compositionType?.name}}
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <template v-for="(item,index) in compositionTypes">
                                    <el-dropdown-item :class="{active: item.type == compositionType.type}" :command="item">{{item.name}}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="right-container">
                    <el-dropdown trigger="click" @command="handleUploadFile">
                        <el-button type="primary" round color="#3468FE">
                            添加文件
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="upload">上传文件</el-dropdown-item>
                                <el-dropdown-item command="select">云盘选择</el-dropdown-item>
                                <el-dropdown-item command="other" disabled>其他平台</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <div style="margin-left: 20px">{{params.total}}个文件</div>
                    <el-button type="primary" style="margin-left:20px;" @click.stop="handleToDetail" round color="#3468FE">
                        完成
                    </el-button>
                </div>
            </div>
            <el-scrollbar class="composition_main-scrollbar" view-class="composition_main-view">
                <div v-if="params.total > 0" class="file-container">
                    <template v-if="fileList.length > 0">
                        <template v-for="(item,index) in fileList" :key="index">
                            <div class="file-item" @click.stop="handleChangeCheck(item)">
                                <el-checkbox :model-value="checkFile&&checkFile.id == item.id" @click.stop="false" @change="handleChangeCheck(item)" />
                                <div class="cover-box">
                                    <el-avatar v-if="(item.customizeCover || item.cover || item.downloadUrl) && item.fileClassification == 'image'" :size="80" shape="square" :src="item.customizeCover || item.cover || item.downloadUrl" />
                                    <el-avatar v-else-if="item.customizeCover || item.cover" :size="80" shape="square" :src="item.customizeCover || item.cover" />
                                    <div style="height: 100%; width: 100%; padding: 10px;" v-else>
                                        <FileType  :type="item.fileCat"></FileType>
                                    </div>
                                </div>
                                <div class="info-box">
                                    <div class="title">{{item.filename}}</div>
                                    <div class="desc">格式：{{item.suffix}}</div>
                                </div>
                                <div class="tag-box">
                                    <div class="tag-item" v-for="(tag,code) in getTags(item.tagIds)" :key="code">{{tag.title}}</div>
                                </div>
                                <el-icon color="#d81e1a" @click.stop="handleDeleteFile(item,index)">
                                    <Delete />
                                </el-icon>
                            </div>
                        </template>
                    </template>
                    <template v-else-if="!loadingState">
                        <Empty></Empty>
                    </template>
                </div>
                <div class="composition_empty" v-else-if="!loadingState">
                    <div class="upload-type">
                        <div class="upload-type-item" @click.stop="handleUploadFile('upload')" v-if="compositionType.iconClass1">
                            <div class="icon" :class="compositionType.iconClass1"></div>
                            <div class="text">
                                点击直接上传
                                <br />
                                或拖拽作品进行上传
                            </div>
                        </div>
                        <div class="upload-type-item" @click.stop="handleUploadFile('select')" v-if="compositionType.iconClass2">
                            <div class="icon" :class="compositionType.iconClass2"></div>
                            <div class="text">
                                从云盘选择
                            </div>
                        </div>
                        <div class="upload-type-item disabled" v-if="compositionType.iconClass3">
                            <div class="icon" :class="compositionType.iconClass3"></div>
                            <div class="text" style="padding: 0 20px;">
                                {{compositionType.text3}}
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">仅支持{{compositionType.format}}格式</div>
                </div>
                <Pagination :total="params.total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
            </el-scrollbar>
        </div>
        <input type="file" ref="UoloadFileRef" @change="handleClickFiles" multiple hidden :maxlength="4" :accept="compositionType.accept" />
        <SideForm ref="SideFormRef" v-model:tagData="tagData" @updateSuccess="handleUpdateWorkFile" :type="compositionType.type"></SideForm>
    </div>
    <DragUpload @onDrop="handleDropFiles" :onShowBefor="handleDragFilesOver"></DragUpload>
</template>
<script setup>
import { createUploadSign, createUploadFile, deleteWorkFile, cloudDiskSaveWork, getWorkList, getFileTagList, saveWorkFile } from '@/api/personnel/file'
import UploadFile from '@/utils/uploadFile.js'
import FileType from '@/components/FileType'
import SideForm from './SideForm.vue'
import { useStore } from 'vuex'
import { computed, getCurrentInstance, reactive } from '@vue/runtime-core'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

const store = useStore();
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const SideFormRef = ref();
const params = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
});
const compositionTypes = [
    {
        name: '图片',
        type: 'image',
        maxSize: 1024 * 1024 * 1024,
        iconClass1: 'image1',
        iconClass2: 'image2',
        format: 'jpg、jpeg、png、tiff、swf',
        accept: '.jpg,.jpeg,.png,.tiff,.swf'
    },
    {
        name: '视频',
        type: 'video',
        maxSize: 1024 * 1024 * 1024,
        iconClass1: 'video1',
        iconClass2: 'video2',
        iconClass3: 'video3',
        text3: '引用其他平台视频，支持腾讯、土豆、优酷、B站。功能正在开发中...',
        format: 'mp4、avi、mpeg、rmvb、mvb、flv',
        accept: '.mp4,.avi,.mpeg,.rmvb,.mvb,.flv'
    },
    {
        name: '音乐',
        type: 'audio',
        maxSize: 1024 * 1024 * 1024,
        iconClass1: 'audio1',
        iconClass2: 'audio2',
        iconClass3: 'audio3',
        text3: '引用其他平台音频，支持网易云音乐、QQ音乐。功能正在开发中...',
        format: 'mp3、wav、m4a、ac3',
        accept: '.mp3,.wav,.m4a,.ac3'
    },
    {
        name: '文档',
        type: 'other',
        maxSize: 1024 * 1024 * 1024,
        iconClass1: 'other1',
        iconClass2: 'other2',
        format: 'pdfs、pdf',
        accept: '.pdf,.pdfs'
        // format: 'doc、docx、xls、xlsx、ppt、pptx、pdf、pdfs',
        // accept: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.pdfs'
    },
]
const compositionType = ref();
const compositionTypeList = compositionTypes.filter(item => item.type == route.query.type);
compositionType.value = compositionTypeList.length > 0 ? compositionTypeList[0] : compositionTypes[0];
let queryFileId = route.query.fileId;
// 改变类型
const handleChangeType = (e) => {
    if(compositionType.value == e){
        return;
    }
    if(clearTime){
        clearTimeout(clearTime);
        clearTime = null;
    }
    compositionType.value = e;
    SideFormRef.value.close();
    fileList.value = [];
    params.pageNum = 1;
    params.total = 0;
    getData()
}

// 前往详情
const handleToDetail = () => {
    const id = route.params.id;
    store.dispatch('workspace/getUserAuthInfo',id).then(res=>{
        if(res.data.status == -1){
            router.push({ path: `/workspace/admin/apply`, query:{noRead: true} });
        }else if(res.data.status == 2){
            router.push({ path: `/workspace/admin/apply`, query:{id, noRead: true} });
        }else{
            router.push({ path: `/workspace/admin/skill_form/${id}` });
        }
    }).catch(err=>{

    })
}

/**
 * **********************************************************************************
 * 文件上传相关
 * **********************************************************************************
 * 
*/
const tagData = ref([]);
const fileList = ref([]);
const checkFile = ref(null);
const UoloadFileRef = ref();
const fileSizeTotal = computed(() => {
    const size = fileList.value.reduce((sum, item) => {
        return item.size + sum
    }, 0)
    return size;
})
const formatFileSize = computed(() => UploadFile.formatSize(fileSizeTotal.value))
// 获取文件数据
const loadingState = ref(false);
const getData = () => {
    loadingState.value = true;
    const fileClassification = compositionType.value.type;
    const userAuthenticateId = route.params.id;
    Promise.all([getFileList(fileClassification), getFileTagList({ fileClassification, userAuthenticateId })]).then(res => {
        loadingState.value = false;
        tagData.value = res[1].data;
    }).catch(err => {
        loadingState.value = false;
    })
}

// 获取文件数据
const getFileList = async (e) => {
    try {
        if (!e) { loadingState.value = true }
        fileList.value = [];
        const fileClassification = e || compositionType.value.type;
        const userAuthenticateId = route.params.id;
        const result = await getWorkList({ ...params, fileClassification, userAuthenticateId });
        if (!e) { loadingState.value = false }
        fileList.value = result.rows;
        params.total = result.total;
        autoSelcet()
        return Promise.resolve(result);
    } catch (err) {
        if (!e) { loadingState.value = false }
        return Promise.reject();
    }
}

getData();

// 自动勾选
const autoSelcet = ()=> {
    let target = {}
    target = fileList.value.find(item => item.fileId == route.query.fileId)
    handleChangeCheck(target)
}

// 切换分页
const handlePagination = ({ page, limit }) => {
    if(clearTime){
        clearTimeout(clearTime);
        clearTime = null;
    }else if(loadingState.value){ return }
    params.pageNum = page;
    params.pageSize = limit;
    getFileList();
}

// 获取tags
const getTags = (e) => {
    if (e) {
        const data = e.split(',');
        for (const item of tagData.value) {
            const index = data.indexOf(String(item.id))
            if (index > -1) {
                data[index] = item;
            }
        }
        return data.filter(item => item?.id)
    } else {
        return []
    }
}

// check文件改变时触发
const handleChangeCheck = (item) => {
    const check = checkFile.value?.id == item.id;
    if (!check) {
        checkFile.value = item;
        SideFormRef.value.open(item, getTags(item.tagIds));
    } else {
        SideFormRef.value.close();
        checkFile.value = false;
    }
}
// 文件更新的回调
const handleUpdateWorkFile = (e) => {
    for (const item of fileList.value) {
        if (item.id == e.id) {
            item.filename = e.name;
            item.customizeCover = e.cover;
            item.watermark = e.watermark;
            item.tagIds = e.tagIds;
        }
    }
}
// 删除已上传文件
const handleDeleteFile = (item, index) => {
    proxy.$modal.confirm({
        title: '删除文件',
        content: `确定要删除文件“${item.filename}”吗？`,
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                deleteWorkFile({ id: item.id }).then(res => {
                    if (checkFile.value && checkFile.value.id == item.id) {
                        SideFormRef.value.close();
                        checkFile.value = null;
                    }
                    getFileList();
                    done();
                    ElMessage.success('文件删除成功');
                }).catch(err => {
                    done();
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    })
}
/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const getUploadSignFun = (obj, callback, errorback) => {
    const params = {
        filename: obj.FileName,
        size: obj.FileSize,
        md5: obj.FileMD5,
        check: false,
    }
    createUploadSign(params).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

/**
 * 创建上传文件
 * @param resultData
 * @param options
 * @param callback
 * @param errorback
 * @constructor
 */
const CreateUploadFileFun = ({ resultData, options }, callback, errorback) => {
    const params = {
        fileId: resultData.fileId,
        verifyContent: resultData.video?.verify_content || '',
        sourceContext: options.sourceContext,
        userAuthenticateId: route.params.id,
    }
    saveWorkFile(params).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

// 获取拖拽上传的文件
const handleDropFiles = (files) => {
    const format = compositionType.value.format
    for (const entry of files) {
        const webkitGetAsEntry = entry.webkitGetAsEntry ? entry.webkitGetAsEntry() : entry;
        if (webkitGetAsEntry.isFile) {
            webkitGetAsEntry.file(async File => {
                if(params.total >= 100){
                    ElMessage.warning('每个类型作品只能上传100个')
                    return;
                }
                const suffix = File.name.split('.').pop();
                if (format.indexOf(suffix.toLowerCase()) > -1) {
                    const path = webkitGetAsEntry.fullPath.substring(1);
                    File.path = path;
                    const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
                    uploadData.on('success', uploadSuccess)
                    store.commit('upload/addFileList', uploadData)
                } else {
                    ElMessage.warning(`文件“${File.name}”类型不正确，无法上传`)
                }
            }, err => { console.log('文件错误', err) })
        } else {
            const reader = webkitGetAsEntry.createReader();
            reader.readEntries(entries => {
                if (entries.length > 0) {
                    handleDropFiles(entries);
                }
            }, err => { console.log('目录错误', err) })
        }
    }
}
// 点击选择文件的回调
const handleClickFiles = (e) => {
    const files = e.target.files;
    if((params.total + files.length) > 100){
        UoloadFileRef.value.value = '';
        ElMessage.warning('每个类型作品只能上传100个')
        return;
    }  
    const format = compositionType.value.format
    for (const File of files) {
        const suffix = File.name.split('.').pop();
        if (format.indexOf(suffix.toLowerCase()) > -1) {
            const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
            uploadData.on('success', uploadSuccess)
            store.commit('upload/addFileList', uploadData)
        } else {
            ElMessage.warning(`文件“${File.name}”类型不正确，无法上传`)
        }
    }
    UoloadFileRef.value.value = '';
}

// 文件上传成功的回调
let clearTime;
const uploadSuccess = (e) => {
    if (clearTime) {
        clearTimeout(clearTime);
        clearTime = null;
    }
    if (params.pageNum == 1) {
        clearTime = setTimeout(() => {
            getFileList();
        }, 1500)
    }
}
// 点击上传
const handleUploadFile = (e) => {
    if(params.total >= 100){
        ElMessage.warning('每个类型作品只能上传100个')
        return;
    }  
    switch (e) {
        case 'upload':  
            UoloadFileRef.value.click();
            break;
        case 'select':
            proxy.$CloudFile.open({
                fileCat: compositionType.value.type,
                onAfterConfirm(loadingConfirm, files, deno) {
                    if((params.total + files.length) > 100){
                        ElMessage.warning('每个类型作品只能上传100个')
                        return;
                    } 
                    loadingConfirm.value = true;
                    const fileIds = files.map(item => item.encryptedId).join(',');
                    const userAuthenticateId = route.params.id;
                    cloudDiskSaveWork({ fileIds, userAuthenticateId }).then(res => {
                        uploadSuccess();
                        ElMessage.success('添加成功')
                        deno()
                    }).catch(err => {
                        loadingConfirm.value = false;
                    })
                }
            })
            break;
    }
}
// 拖拽上传打开之前的回调
const handleDragFilesOver = (e, show) => {
    for (var item of e.dataTransfer.types) {
        if (item == 'Files') {
            e.preventDefault();
            show()
            return
        }
    }
}

/**
 * **********************************************************************************
 *
*/
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>