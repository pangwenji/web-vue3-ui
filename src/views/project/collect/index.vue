<template>
    <div>
        <el-container class="collect-container">
            <el-header class="collect-header">
                <div class="collect-header-left">
                    <el-image :src="logo" style="height: 50px; width:50px;" :draggable="false"  @click="goPath('/')" ></el-image>
                </div>
                <div class="collect-header-right">
                    <div class="avatar-container">
                        <div class="avatar-wrapper" @click="handleLogin">
                            <!-- <img :src="getters.avatar" :draggable="false" class="user-avatar" /> -->
                            <!-- <span>{{getters.name}}</span> -->
                            <!-- <el-icon><caret-bottom /></el-icon> -->
                            <span v-if="getters.avatar"><img :src="getters.avatar" :draggable="false" class="user-avatar" /></span>
                            <span v-else><img :src="userHead" :draggable="false" class="user-avatar" /></span>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main>
                <div class="collect-verification" v-if="resultData.passwordLock === 1 && !resultData.sessionToken">
                    <el-image :draggable="false" :src="resultData.user.avatar">
                        <template #error>
                            <el-icon :size="70"><User /></el-icon>
                        </template>
                    </el-image>
                    <div class="title">{{resultData.user.nickName}}</div>
                    <div class="desc">收集者</div>
                    <div class="title">{{resultData.name}}</div>
                    <div class="form-item">
                        <input v-model="passwordVali" placeholder="输入4位验证密码" />
                        <el-button size="large" @click="handleSubmit" :loading="loadingState" color="#3468FE" type="primary" round>确定</el-button>
                    </div>
                    <div class="desc" v-if="resultData.timeLeft > 0">该收集将在{{resultData.timeLeft}}天后无效</div>
                    <div class="desc" v-else-if="resultData.timeLeft < 0">该链接已过期</div>
                    <div class="desc" v-else>该收集永久有效</div>
                </div>
            </el-main>
        </el-container>
        <CollectDialog 
            ref="CollectDialogRef"
            v-model:visibled="visibleDialog" 
            :user="resultData.user || {}"
            :collect="resultData"
            v-model:uploadList="uploadList"
        ></CollectDialog>
        <DragUpload :onShowBefor="handleDragOver" @onDrop="handleDrop"></DragUpload>
    </div>
</template>
<script setup>
import logo from '@/assets/logo/logo.png';
import CollectDialog from './components/CollectDialog';
import DragUpload from '@/components/DragUpload';
import UploadFile from "@/utils/uploadFile.js";
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessageBox , ElMessage} from 'element-plus';
import { reactive, onMounted } from 'vue-demi';
import { createDirectory , getFileCollectInfo, verifyFileCollectPassword} from '@/api/project/files.js';
import { getToken } from '@/utils/auth'
import userHead from '@/assets/icons/comment/icon_user-head.png'
const route = useRoute();
const store = useStore();
const getters = computed(() => store.getters);
const CollectDialogRef = ref();
const router = useRouter();
const { proxy } = getCurrentInstance();

const visibleDialog = ref(false);
const resultData = ref({});
const uploadList = ref([]);
const loadingState = ref(false);
const passwordVali = ref("");

onMounted(()=>{
    getData()
})


const getData = ()=>{
    const token = route.query.token;
    getFileCollectInfo({token}).then(res=>{
        resultData.value = res.data;
        if(resultData.value.sessionToken){
            visibleDialog.value = true;
        }
    }).catch(err=>{
        
    })
}


// 文件移入
const handleDragOver = (e,show)=>{
    if(CollectDialogRef.value.uploadState == 'uploading'){
        return;
    }
    for(var item of e.dataTransfer.types){
        if(item == 'Files'){
            e.preventDefault();
            show()
            return
        }
    }
}

// 提交
const handleSubmit = ()=>{
    if(!passwordVali.value){
        ElMessage.error('请填写验证密码')
        return
    }
    loadingState.value = true;
    const token = resultData.value.token;
    const password = passwordVali.value;
    verifyFileCollectPassword({token,password}).then(res=>{
        loadingState.value = false;
        visibleDialog.value = true;
        resultData.value = res.data;
    }).catch(err=>{
        loadingState.value = false;
    })
}



// 文件放入
const handleDrop = (files)=>{
    if (!getters.value.userId) {
        proxy.$loginDialog.open({});
        return;
    }
    if(CollectDialogRef.value.uploadState == 'complete'){
        uploadList.value = [];
    }
    CollectDialogRef.value.uploadState = 'awaiting'
    for(const entry of files){
        const webkitGetAsEntry = entry.webkitGetAsEntry ? entry.webkitGetAsEntry() : entry;
        if(webkitGetAsEntry.isFile){
            webkitGetAsEntry.file(async File=>{
                const path = webkitGetAsEntry.fullPath.substring(1);
                File.path = path;
                const uploadData = new UploadFile({File});
                uploadList.value.push(uploadData);
            },err=>{console.log('文件错误',err)})
        }else{
            const reader = webkitGetAsEntry.createReader();
            reader.readEntries(entries=>{
                if(entries.length > 0){
                    handleDrop(entries);
                }
            },err=>{console.log('目录错误',err)})
        }
    }
}

function goPath(path) {
    router.push(path)
}

function handleLogin(){
    if(getters.value.avatar){
        
    }else{
        proxy.$loginDialog.open({});
    }
}


</script>
<style scoped lang="scss">
.collect-container{
    width: 100%;
    height: 100vh;
    background: #0A0B0D;
    .collect-header{
        background: #1E1F26;
        .collect-header-left{
            height: 100%;
            float: left;
            display: flex;
            align-items: center;
        }
        .collect-header-right{
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
                    // margin-right: 10px;
                }
            }

        }
    }
    .collect-verification{
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