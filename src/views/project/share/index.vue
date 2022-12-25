<template>
    <div>
        <el-container class="share-container">
            <el-header class="share-header">
                <div class="share-header-left">
                    <el-image :src="logo" style="height: 50px; width:50px; cursor: pointer;" :draggable="false" @click="goPath('/')" >
                        <template #error>
                            <el-icon :size="50"><User /></el-icon>
                        </template>
                    </el-image>
                </div>
                
                <div class="share-header-right">
                    <div class="avatar-container">
                        <div class="avatar-wrapper" @click="handleLogin">
                            <span v-if="getters.avatar"><img :src="getters.avatar" :draggable="false" class="user-avatar" /></span>
                            <span v-else><img :src="userHead" :draggable="false" class="user-avatar" /></span>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main v-loading="initializeLoading" element-loading-background="rgba(0, 0, 0, 0)">
                <template v-if="resultData.passwordLock === 1 && !resultData.sessionToken && !initializeLoading">
                    <div class="share-verification" >
                        <el-image :src="resultData.user?.avatar || ''" :draggable="false">
                            <template #error>
                                <el-icon :size="70"><User /></el-icon>
                            </template>
                        </el-image>
                        <div class="title">{{resultData.user?.nickName}}</div>
                        <div class="desc">分享者</div>
                        <div class="title">{{resultData.name}}</div>
                        <div class="form-item">
                            <input v-model="passwordVali" @keyup="trimLR" placeholder="输入4位验证密码" />
                            <el-button size="large" @click="handleSubmit" :loading="loadingState" color="#3468FE" type="primary" round>确定</el-button>
                        </div>
                        <div class="desc" v-if="resultData.timeLeft > 0">该分享将在{{resultData.timeLeft}}天后无效</div>
                        <div class="desc" v-else-if="resultData.timeLeft < 0">该链接已过期</div>
                        <div class="desc" v-else>该分享永久有效</div>
                    </div>
                </template>
                <template v-else-if="!initializeLoading">
                    <div class="share-content-box">
                        <div class="share-title">{{resultData.name}}</div>
                        <div class="share-content">
                            <div class="share-info"> 
                                <template v-if="selectFileList.length === 0">
                                    <el-image :src="resultData.user?.avatar || ''">
                                        <template #error>
                                            <el-icon :size="36"><User /></el-icon>
                                        </template>
                                    </el-image>
                                    <div class="share-nickName"> {{resultData.user?.nickName || '分享者'}} </div>
                                    <div class="share-validity">
                                        <span v-if="resultData.timeLeft > 0">该分享将在{{resultData.timeLeft}}天后无效</span>
                                        <span v-else-if="resultData.timeLeft < 0">该链接已过期</span>
                                        <span v-else>该分享永久有效</span>
                                    </div>
                                    <div class="report" @click="handleReport">举报</div>
                                </template>
                                <template v-else>
                                    <el-button type="primary" round color="#3D4352" @click="handleSelectAll(true)">全选</el-button>
                                    <!-- <el-button type="primary" round color="#3D4352" @click="handleSelectAll(false)">取消全选</el-button> -->
                                    <el-button type="primary" round color="#3D4352" @click="handleSelectAll(false)">取消</el-button>
                                </template>
                            </div>
                            <div>
                                <el-button type="primary" round color="#3D4352" @click="handleShare">转发</el-button>
                                <!-- <el-button type="primary" round color="#3D4352" @click="handleAddShareCollect">收藏</el-button>
                                <el-button type="primary" round color="#3D4352" @click="handleDelShareCollect">取消收藏</el-button> -->
                                <el-button type="primary" round color="#3D4352" :disabled="resultData.saveTo !== 1 || hasFolder" @click="handleDownload(selectFileList)">下载原件</el-button>
                                <el-button type="primary" round color="#3468FE" :disabled="resultData.saveTo !== 1" @click="handleRedeposit(false)" >转存</el-button>
                            </div>
                        </div>
                        <!-- <a v-color="'white'" @click="handleDownloadFile">下载图片</a> -->
                        <div class="share-file-info">
                            <template v-if="breadcrumbList.length > 1">
                                <el-breadcrumb separator-icon="ArrowRight">
                                    <template v-for="(item,index) in breadcrumbList" :key="index">
                                        <el-breadcrumb-item @click="handleBreadcrumb(item,index)">{{item.name}}</el-breadcrumb-item>
                                    </template>
                                </el-breadcrumb>
                            </template>
                            <template v-else>
                                <span >共{{resultData.fileQuantity}}个文件（{{formatSize(resultData.size)}}）</span>
                            </template>
                        </div>
                        <div class="share-file-scrollbar">
                            <el-scrollbar height="100%" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)" @click="handleSelectAll(false)">
                                <template v-if="fileList.length > 0 && !loadingStatus">
                                    <el-row :gutter="20" style="font-size: 14px; margin: 0 10px;">
                                        <template v-for="(item,index) in fileList" :key="index">
                                            <FileItem 
                                                :data="item" 
                                                :col-style="{maxWidth: String(100/layoutSpan) + '%',flex:'0 0 ' + String(100/layoutSpan) + '%'}"
                                                :type="item.type == 1?'folder': item.fileCat" 
                                                :onRedeposit="resultData.saveTo !== 1?null:handleRedeposit"
                                                :onDownload="resultData.saveTo !== 1?null:handleDownload"
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
        <ProjectShareDialog ref="ProjectShareDialogRef" ></ProjectShareDialog>
        <ProjectSelectFolder ref="ProjectSelectFolderRef" @onSubmit="handleSelectAll(false)"></ProjectSelectFolder>
        <informDialog
            ref="informRef"
            :info="reportInfo"
            :type="3"
            :close-on-click-modal="false"
        ></informDialog>

    </div>
</template>
<script setup>
import logo from '@/assets/logo/logo.png';
import FileItem from './FileItem.vue'
import ProjectSelectFolder from '../components/ProjectSelectFolder'
import ProjectShareDialog from '../index/components/ProjectShareDialog'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { downloadMulti } from '@/utils/request.js'
import { formatSize } from '@/utils/tool.js'
import { ElMessageBox , ElMessage} from 'element-plus';
import { reactive, onMounted, computed, getCurrentInstance } from 'vue-demi';
import { getFileShareInfo , getShareFileList, verifyFileSharePassword, addShareCollect , delShareCollect} from '@/api/project/files.js';
import { getFileShareSourceInfo, getShareFileDownloadUrl, getFileShareBySessionToken } from '@/api/project/share.js';
import { getToken } from '@/utils/auth'
import cache from '@/plugins/cache'
import userHead from '@/assets/icons/comment/icon_user-head.png'
import informDialog from '@/components/informDialog'

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const resultData = ref({});
const loadingState = ref(false);
const loadingStatus = ref(false);
const initializeLoading = ref(false);
const ProjectShareDialogRef = ref();
const ProjectSelectFolderRef = ref();
const passwordVali = ref("");
const getters = computed(() => store.getters);
const fileList = ref([]);
const breadcrumbList = ref([]);
const selectFileList = computed(()=>{
    const list = fileList.value.filter(item=>item.check)
    return list
})
const informRef = ref()
const reportInfo = ref({})

const hasFolder = computed(()=>{
    let flag = false
    for (let item of selectFileList.value) {
        if (item.type == 1) {
        flag = true
        break
        }
    }
    return flag
})

onMounted(()=>{
    const token = route.query.token;
    resultData.value = cache.session.getJSON('FILE_SHARE_INFO') || {}
    if (resultData.value && resultData.value.token === token) {
        getFileData();
    } else {
        shareInit()
    }
})

const showCheck = computed(() => {
  for (var key in fileList.value) {
    if (fileList.value[key]?.check) {
      return true;
    }
  }
  return false;
})


// 每行个数
const layoutSpan = ref(4)
const onresize = (clientWidth)=>{
    if(clientWidth < 768){
        layoutSpan.value = 2;
    }else if(clientWidth < 900){
        layoutSpan.value = 3;
    }else if(clientWidth < 1100){
        layoutSpan.value = 4;
    }else if(clientWidth < 1300){
        layoutSpan.value = 5;
    }else if(clientWidth < 1500){
        layoutSpan.value = 6;
    }else if(clientWidth < 1700){
        layoutSpan.value = 7;
    }else if(clientWidth < 1900){
        layoutSpan.value = 8;
    }else if(clientWidth < 2100){
        layoutSpan.value = 9;
    }else{
        layoutSpan.value = 10;
    }

}
onresize(document.body.clientWidth);
document.body.onresize = (e)=>{
    onresize(e.currentTarget.innerWidth)
}

// 全选/取消全选
const handleSelectAll = (e)=>{
    for(var item of fileList.value){
        item.check = e;
    }
}


const shareInit = () => {
    initializeLoading.value = true;
    const token = route.query.token;
    getFileShareInfo({token}).then(res=>{
        resultData.value = res.data;
        cache.session.setJSON('FILE_SHARE_INFO', res.data)
        if(resultData.value.passwordLock === 1 && !resultData.value.sessionToken){
            initializeLoading.value = false;
        }else{
            initializeLoading.value = false;
            getFileData();
        }
    }).catch(err=>{
        initializeLoading.value = false;
    })
}


// 获取文件内容
const getFileData = (parent_id)=>{
    loadingStatus.value = true;
    fileList.value = [];
    const token = resultData.value.sessionToken;
    getShareFileList({token,parent_id}).then(res=>{
        fileList.value = res.data?.list || [];
        loadingStatus.value = false;
        if(breadcrumbList.value.length == 0){
            breadcrumbList.value.push({
                name: '分享的文件',
                parentId: 0
            })
        }
    }).catch(err=>{
        loadingStatus.value = false;
    })
}

const handleShare = ()=>{
    if (!getToken()) {
        proxy.$loginDialog.open({});
        return;
    }
    const token = route.query.token;
    getFileShareBySessionToken({token: resultData.value.sessionToken}).then(res=>{
        const qrcode = res.data.qrcode;
        const url = res.data.url; 
        const info = res.data.info;
        ProjectShareDialogRef.value.open({qrcode,url,info})
    })
}

// 添加收藏
const handleAddShareCollect = ()=>{
    const token = resultData.value.sessionToken;
    addShareCollect({token}).then(res=>{
        ElMessage.success('已添加收藏')
    })
}
// 取消收藏
const handleDelShareCollect = ()=>{
    const token = resultData.value.sessionToken;
    delShareCollect({token}).then(res=>{
        ElMessage.success('已取消收藏')
    })
}
// 转存
const handleRedeposit = (e)=>{
    if (!getToken()) {
        proxy.$loginDialog.open({});
        return;
    }
    if(selectFileList.value.length == 0 && !e){
        ElMessage.info('请先选择需要转存的文件')
        return
    }
    const fileIds = e ? [e.id] : selectFileList.value.map(item=>item.id);
    const fromProjectId = resultData.value.sessionToken;
    ProjectSelectFolderRef.value.open('redeposit','转存到',{fileIds,fromProjectId})
}
// 下载
const handleDownload = (e)=>{
    if (!getToken()) {
        proxy.$loginDialog.open({});
        return;
    }
    if(selectFileList.value.length == 0 && !e){
        ElMessage.info('请先选择需要下载的文件')
        return
    }
    if(!Array.isArray(e)){
        e = [e]
    }
    let list = []
    for(var item of e){
        if(item.type == 1){
            ElMessage.info('文件夹无法下载')
            return
        }
        list.push({
            id: item.id,
            filename: item.name
        })
    }

    const params = {
        token: resultData.value.sessionToken,
        list
    }
    if(list.length==0){
        ElMessage.info('请先选择需要下载的文件');
        return false;
    }
    getShareFileDownloadUrl(params).then(res => {
        const requestData = res.data.data.map(item=>{
            return {
                url: item.downloadUrl
            }
        })
        downloadMulti(requestData)
    })
}

// 点击面包屑
const handleBreadcrumb = (item,index)=>{
    if(index  === (breadcrumbList.value.length - 1)){
        return
    }else{
        breadcrumbList.value.splice(index + 1, breadcrumbList.value.length - index - 1);
        getFileData(item.parentId)
    }
}

// 打开文件夹
const handleOpenFolder = (data)=>{
    breadcrumbList.value.push({
        name: data.name,
        parentId: data.id,
    })
    getFileData(data.id)
}

// 提交
const handleSubmit = ()=>{
    if(!passwordVali.value){
        ElMessage.error('请填写验证密码')
        return
    }
    if(passwordVali.value.length !== 4){
        ElMessage.error('请填写4位验证密码')
        return
    }
    loadingState.value = true;
    const token = resultData.value.token;
    const password = passwordVali.value;
    verifyFileSharePassword({token,password}).then(res=>{
        loadingState.value = false;
        resultData.value = res.data;
        cache.session.setJSON('FILE_SHARE_INFO', res.data)
        breadcrumbList.value.push({
            name: '',
            parentId: 0
        })
        getFileData();
    }).catch(err=>{
        loadingState.value = false;
    })
}

function handleLogin (){
    if(getters.value.avatar){
        
    }else{
        proxy.$loginDialog.open({});
    }
}

function goPath(path) {
    router.push(path)
}

function goDetail(data) {
    const token = route.query.token;
    const invite_user = route.query.invite_user;
    router.push({ path: "/file", query: { id: data.id, projectId: data.projectId,fileCat: data.fileCat,shareToken: token,invite_user } });
}

function trimLR() {
    passwordVali.value = passwordVali.value.replace(/\s+/g, '');
}

// 举报
function handleReport() {
    reportInfo.value.id = resultData.value.id
    reportInfo.value.title = resultData.value.name
    informRef.value.isShow = true
}

</script>
<style scoped lang="scss">
.share-container{
    width: 100%;
    height: 100vh;
    background: #0A0B0D;
    .share-header{
        background: #1E1F26;
        .share-header-left{
            height: 100%;
            float: left;
            display: flex;
            align-items: center;
        }
        .share-header-right{
            height: 100%;
            float: right;
            display: flex;
            align-items: center;
            .avatar-wrapper{
                display: flex;
                align-items: center;
                cursor: pointer;
                .user-avatar{
                    width: 42px;
                    height: 42px;
                    border-radius: 50px;
                    overflow: hidden;
                    cursor: pointer;
                    // margin-right: 10px;
                }
            }

        }
    }
    .share-content-box{
        height: 100%;
        display: flex;
        flex-direction: column;
        .share-title{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
            flex-shrink: 0;
        }
        .share-content{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            user-select: none;
            margin-bottom: 20px;
            flex-shrink: 0;
            height: 40px;
            .share-info{
                display: flex;
                flex-direction: row;
                align-items: center;
                font-size: 14px;
                color:#BEC0CD;
                &:deep(.el-image){
                    flex-shrink: 0;
                    width: 36px;
                    border-radius: 100px;
                    height: 36px;
                    pointer-events: none;
                }
                .share-nickName{
                    margin-left: 12px;
                }
                .share-validity{
                    border-left: 1px solid #2A2A47;
                    margin-left: 12px;
                    padding-left: 12px;
                    color: #3468FE;
                }

                .report {
                    border-left: 1px solid #2a2a47;
                    margin-left: 12px;
                    padding-left: 12px;
                    color: #3468fe;
                    cursor:pointer;
                }
                .report:hover {
                    color: red;
                }
            }
        }
        .share-file-info{
            color:  #BEC0CD;
            font-size: 14px;
            margin-bottom: 20px;
            flex-shrink: 0;
            user-select: none;
            &:deep(.el-breadcrumb){
                .el-breadcrumb__item{
                    cursor: pointer;
                }
            }
        }
        .share-file-scrollbar{
            flex-grow: 1;
            margin-left: -20px;
            margin-right: -20px;
            overflow: hidden;
        }
    }


    .share-verification{
        width: 30%;
        margin: 20px auto 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .el-image{
            width: 70px;
            height: 70px;
            border-radius: 70px;
            color: #ffffff68;
            background: #ffffff16;
            // opacity: .5;
        }
        .title{
            width: 100%;
            color: white;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            margin: 20px 0;
        }
        .desc{
            font-size: 14px;
            color: white;
            opacity: .5;
        }
        .form-item{
            width: 70%;
            border: 3px solid #20222B;
            background: #20222B;
            border-radius: 100px;
            display: flex;
            margin-bottom: 20px;
            input{
                width: 100%;
                font-size: 16px;
                flex-grow: 1;
                outline: none;
                background: none;
                border: none;
                padding:0 20px;
                color: white;
                box-sizing: border-box;
            }
            .el-button{
                flex-shrink: 0;
                font-size: 18px;
                padding: 20px;
            }
        }
    }
}
</style>