<template>
    <el-dialog :model-value="visibled" width="500px" :modal="false" :before-close="onBeforeClose" :show-close="false" custom-class="dialog-center collect-diaog-body">
        <template #title>
            <div class="header-info">
                <el-image :draggable="false" :src="user.avatar"></el-image>
                <div class="collect-info">
                    <div class="title">{{user.nickName}}-{{collect.name}}</div>
                    <div class="desc">{{collect.remark || '暂无备注'}}</div>
                </div>
                <span class="close-icon">
                    <!-- <el-icon><Close /></el-icon> -->
                </span>
            </div>
            <div class="upload-box">
                <div class="upload-remark" v-if="uploadState == 'awaiting' || uploadState == 'complete'">点击或拖拽上传文件夹/文件</div>
                <div class="upload-remark" v-else>正在发送...</div>
                <div class="upload-file" @click="handleClickUpload(false)" v-if="uploadState == 'awaiting' || uploadState == 'complete'">上传文件</div>
                <div class="upload-folder" @click="handleClickUpload(true)" v-if="uploadState == 'awaiting' || uploadState == 'complete'">上传文件夹</div>
                <input type="file" ref="uploadFiles" :webkitdirectory="isWebkitdirectory" multiple hidden @change="handleUploadFiles" />
            </div>
            <div class="header-desc" >
                <span v-if="collect.timeLeft > 0">链接{{collect.timeLeft}}天后失效</span>
                <span v-else>链接永久有效</span>
                ，
                <span v-if="collect.uploadLimit">可上传大小限制{{formatSize(collect.uploadLimit)}}</span>
                <span v-else>可上传大小不限制</span>
            </div>
        </template>
        <el-scrollbar height="300px" style="margin: 20px 0 0;" wrap-class="upload-view-list" v-if="uploadList.length > 0">
            <div class="upload-item" v-for="(item,index) in uploadList" :key="index">
                <el-image :draggable="false" >
                    <template #error>
                        <el-icon :size="50"><Document /></el-icon>
                    </template>
                </el-image>
                <div class="upload-info">
                    <div style="overflow:hidden;text-overflow: ellipsis;">{{item.FileName}}</div>
                    <div class="size">{{formatSize(item.FileSize)}} &nbsp;&nbsp; <span v-if="item.state == 'uploading'">{{formatSize(item.speed)}}/s</span> </div>
                    <el-progress v-if="item.state == 'uploading' || item.state == 'paused'" :stroke-width="4" :color="'#3B73FF'" :show-text="false" :percentage="item.percent" />
                </div>
                <div class="state">
                    <span v-if="item.state == 'success'" v-color="'#00BB6C'">成功发送</span>
                    <span v-else-if="item.state == 'paused'">已暂停</span>
                    <span v-else-if="item.state == 'awaiting'">等待发送</span>
                    <span v-else-if="item.state == 'checking'">读取中...</span>
                    <span v-else-if="item.state == 'uploading'">正在发送</span>
                    <span v-else-if="item.state == 'canceled'">已取消</span>
                    <span v-else-if="item.state == 'error'" v-color="'#F03860'">发送失败</span>
                </div>
                <div class="actions" v-if="item.state !== 'success'">
                    <span class="icon-btn" @click="handlePause(item)" v-if="item.state == 'uploading'">
                        <svg-icon iconClass="icon_pause" size="24px"  color="#2545F2" ></svg-icon>
                    </span>
                    <span class="icon-btn" @click="handlePlay(item)" v-else-if="item.state == 'paused'">
                        <svg-icon iconClass="icon_play" size="24px" color="#2545F2" ></svg-icon>
                    </span>
                    <span class="icon-btn" @click="handleCancel(item,index)">
                        <svg-icon iconClass="icon_close" size="16px" color="#ABABAB"></svg-icon>
                    </span>
                </div>
            </div>
        </el-scrollbar>
        <template #footer v-if="uploadList.length > 0">
            <template v-if="uploadState == 'uploading' || uploadState == 'paused'">
                <span v-color="'#6B6B6B'">正在发送{{uploadingFiles.length}}/{{uploadList.length}}</span>
                <span v-color="'#3468FE'" style="cursor:pointer;" @click="handleAllCancel">全部取消</span>
            </template>
            <template v-else-if="uploadState == 'awaiting'">
                <span v-color="'#6B6B6B'">已有{{uploadList.length}}个项目</span>
                <el-button type="primary" @click="handleConfirmUpload" style="background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%); border: none;">确定上传</el-button>
            </template>
            <template v-else-if="uploadState == 'complete'">
                <span v-color="'#6B6B6B'">成功发送{{uploadList.length}}个文件</span>
                <span></span>
            </template>
        </template>
    </el-dialog>
</template>
<script>
import { computed, defineComponent, nextTick, ref } from "vue";
import { formatSize } from "@/utils/tool.js"
import UploadFile from "@/utils/uploadFile.js";
import { getCollectUploadSign,getCollectUploadFile} from '@/api/project/files.js'
import { ElMessage, ElMessageBox } from "element-plus";
const props = {
    visibled:{
        type:Boolean,
        default:false,
    },
    user:{
        type:Object,
        default(){
            return {}
        }
    },
    collect:{
        type:Object,
        default(){
            return {}
        }
    },
    uploadList:{
        type:Array,
        default(){
            return [];
        }
    }
}

const emits = ['update:uploadList'];

const setup = (prop,{emit})=>{
    const uploadFiles = ref();
    const uploadState = ref('awaiting');
    const isWebkitdirectory = ref(false);
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const getters = computed(() => store.getters);

    const handleClickUpload = (e)=>{
        if (!getters.value.userId) {
            proxy.$loginDialog.open({});
            return;
        }
        isWebkitdirectory.value = e;
        nextTick(()=>{
            uploadFiles.value.click();
            uploadFiles.value.value = null;
        })
    }
    const uploadingFiles = computed(()=>{
        return prop.uploadList.filter(item=> item.state == 'success')
    })
    // 点击上传
    const handleUploadFiles = (e)=>{
        if(uploadState.value == 'complete'){
            uploadState.value = 'awaiting'
            prop.uploadList.splice(0,prop.uploadList.length);
            emit('update:uploadList',[]);
        }
        const files = e.target.files;
        const uploadList = [].concat(prop.uploadList);
        for(var File of files){
            File.path = File.webkitRelativePath;
            if(File.webkitRelativePath){
                const paths = File.webkitRelativePath.split('/');
                paths.splice(-1,1);
                File.path = paths.join('/')
            }
            uploadList.push(new UploadFile({File}));
        }
        emit('update:uploadList',uploadList);
        uploadFiles.value.value = ""
    }


    let uploadItem = null;

    // 确定上传
    const handleConfirmUpload = ()=>{
        handleStartUpload();
    }
    // 开始上传
    const handleStartUpload = (item)=>{
        if(uploadState.value == 'paused'){
            return
        }
        uploadState.value = 'uploading';
        if(!item){
            for(const key in prop.uploadList){
                if(prop.uploadList[key].state == 'awaiting'){
                    item = prop.uploadList[key];
                    break;
                }
            }
        }
        uploadItem = item;
        if(!item){
            uploadState.value = 'complete';
            return
        };
        const filename = item.FileName;
        const size = item.FileSize
        const sessionToken = prop.collect.sessionToken;
        item.getUploadSign = (obj,callback)=>{
            getCollectUploadSign({filename,size,sessionToken}).then(res=>{
                callback(res.data)
            })
        }
        item.createUploadFile = ({resultData, options},callback,errorCallback)=>{
            const params = {
                fileId: resultData.fileId,
                verifyContent: resultData.video?.verify_content || '',
                sourceContext: options.sourceContext,
                sessionToken:sessionToken,
            }
            getCollectUploadFile(params).then(res=>{
                callback(res.data)
            }).catch(err=>{
                errorCallback(err);
            })
        }
        item.uploadFile();
        item.on('success',(data)=>{
            console.log('成功')
            handleStartUpload();
        })
        item.on('error',(err)=>{
            console.log('失败')
            handleStartUpload();
        })
    }

    // 取消上传
    const handleCancel = (item,index)=>{
        console.log('取消上传');
        if(item.state == 'uploading' || item.state == 'paused'){
            item.handleCancel();
            handleStartUpload();
        }
        nextTick(()=>{
            prop.uploadList.splice(index,1);
        })
    }
    // 全部取消
    const handleAllCancel = ()=>{
        if(uploadItem && uploadState.state == 'uploading'){
            uploadItem.handlePause();
        }
        uploadState.value = 'paused'
        const title = '提示';
        const text = '列表中有未上传的文件，你要放弃上传吗？'
        ElMessageBox.confirm(text, title, {
            customClass: 'messageBox-custom-warning',
            confirmButtonText: '放弃上传',
            cancelButtonText: '继续上传',
            type: 'warning',
            showClose:true,
            center: true,
        }).then(()=>{
            const list = prop.uploadList;
            const completeList = list.filter((item,index) => {
                if(item.state == 'uploading' || item.state == 'paused'){
                    item.handleCancel();
                }
                return item.state == 'success'
            });
            emit('update:uploadList',completeList);
            uploadState.value = 'complete';
        }).catch(err=>{
            uploadState.value = 'uploading'
            if(uploadItem.state == 'paused'){
                uploadItem.handlePlay();
            }else{
                handleStartUpload();
            }
        })
    }
    // 暂停上传
    const handlePause = (item,index)=>{
        console.log('暂停上传');
        item.handlePause();
        handleStartUpload();
    }
    // 开始上传
    const handlePlay = (item)=>{
        console.log('开始上传');
        item.handlePlay();
    }
    const onBeforeClose = (deno)=>{

    }
    return {
        formatSize,
        uploadFiles,
        uploadState,
        uploadingFiles,
        isWebkitdirectory,
        handleConfirmUpload,
        handlePlay,
        handlePause,
        handleCancel,
        onBeforeClose,
        handleAllCancel,
        handleClickUpload,
        handleUploadFiles,
        handleStartUpload,

    }
}
export default defineComponent({
    setup,
    props,
    emits
})
</script>
<style lang="scss">
    .el-dialog.collect-diaog-body{
        border-radius: 16px;
        overflow: hidden;
        background: #EAECEE;
        .el-dialog__header{
            margin-right: 0;
            border-radius: 16px;
            background: white;
            .header-info{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .el-image{
                    width: 50px;
                    height: 50px;
                    border-radius: 50px;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .collect-info{
                    flex-grow: 1;
                    align-self: stretch;
                    display: flex;
                    // justify-content: space-between;
                    padding: 2px 0;
                    margin: 0 10px;
                    user-select: none;
                    flex-direction: column;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .title{
                        font-size: 16px;
                        font-weight: bold;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-bottom: 6px;
                    }
                    .desc{
                        overflow: hidden;
                        font-size: 12px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #121212;
                        opacity: 50%;
                    }
                }
                .close-icon{
                    opacity: .5;
                    cursor: pointer;
                }
            }
            .upload-box{
                height: 90px;
                border-radius: 10px;
                background: #EEEEEE;
                border: 1px dashed #DCDCDC;
                color: rgba($color: #121212, $alpha: .5);
                font-size: 14px;
                text-align: center;
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                overflow: hidden;
                position: relative;
                margin: 10px 0;
                .upload-remark{
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
                .upload-file{
                    width: 100%;
                    // display: none;
                    line-height: 44px;
                    flex-grow: 1;
                    opacity: 0;
                    transition: all .1s ease;
                    transform: translateY(-30px);
                    &:hover{
                        background: rgba($color: #2545F2, $alpha: .3);
                    }
                }
                .upload-folder{
                    width: 100%;
                    flex-grow: 1;
                    line-height: 44px;
                    // display: none;
                    border-top: 1px dashed #DCDCDC;
                    opacity: 0;
                    transition: all .1s ease;
                    transform: translateY(30px);
                    &:hover{
                        background: rgba($color: #2545F2, $alpha: .3);
                    }
                }
                &:hover{
                    color: #2545F2;
                    background: rgba($color: #2545F2, $alpha: .1);
                    border-color: #2545F2;
                    .upload-remark{
                        display: none;
                    }
                    .upload-folder{
                        opacity: 1;
                        // display: block;
                        border-color: #2545F2;
                        transform: translateY(0px);
                    }
                    .upload-file{
                        opacity: 1;
                        // display: block;
                        transform: translateY(0px);
                    }
                }
            }
            .header-desc{
                text-align: center;
                font-size: 12px;
                user-select: none;
            }
        }
        .el-dialog__body{
            padding: 0;
        }
        .upload-view-list{
            padding: 0 20px;
            .upload-item{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                background: white;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 10px;
                user-select: none;
                .el-image{
                    border-radius: 4px;
                    width: 46px;
                    height: 46px;
                    flex-shrink: 0;
                    margin-right: 8px;
                }
                .upload-info{
                    font-size: 14px;
                    flex-grow: 1;
                    align-self: stretch;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    user-select: none;
                    .size{
                        color: rgba($color: #121212, $alpha: .5);
                        margin: 2px 0;
                    }
                }
                .state{
                    width: 60px;
                    text-align: right;
                    font-size: 14px;
                    color: #2545F2;
                    flex-shrink: 0;
                    margin-right: 8px;
                    user-select: none;
                }
                .actions{
                    width: 60px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex-direction: row;
                    color: #2545F2;
                    .icon-btn{
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                        border-radius: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        &:hover{
                            background: rgba($color: #888888, $alpha: .1);
                        }
                    }
                }
            }
        }
        .el-dialog__footer{
            user-select: none;
            display: flex;
            font-size: 14px;
            justify-content: space-between;
            align-items: center;
            .el-button{
                background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
                border: none;
                border-radius: 10px;
            }
        }
    }
</style>