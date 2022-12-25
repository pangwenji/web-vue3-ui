<template>
    <el-dialog v-model="isShow" :show-close="false" title="报名" width="700px" custom-class="dialog-center" v-bind="$attrs">
        <div class="line"></div>
        <div class="title">{{info.customizeTitle}}</div>
        <div class="info-row">
            <div class="tag">{{info.categoryTitle}}</div>
            <div class="cash-coin">
                <span class="cash-label">预算：</span>
                <span class="cash-num">{{info.budgetPrice}}</span><i class="icon_coin"></i>
            </div>
        </div>
        <div>报名留言：</div>
        <el-input type="textarea" resize="none" maxlength="200" show-word-limit v-model="remark" class="remark" style="margin:8px 0 12px">
        </el-input>
        <div class="upload" @click.stop="handleUpload">
            <svg-icon className="title-icon" iconClass="icon_enclosure" :size="24"></svg-icon>
            <div>上传附件</div>
        </div>
        <input ref="UploadFileRef" type="file" @change="handleUploadFiles" multiple hidden />
        <div class="exf-list" v-for="(item, i) in uploadFileList" :key="i">
            <div class="exf-row">
                <FileType :size="34" :type="item.FileType"></FileType>
                <div class="file-name">{{item.FileName}}</div>
            </div>
            <div class="exf-list">
                <div class="exf-status" v-if="item.state !== 'success'">
                    <span v-if="item.state == 'awaiting'">等待上传</span>
                    <span v-if="item.state == 'checking'">读取文件</span>
                    <span v-if="item.state == 'uploading'">正在上传( {{item.percent}} %)</span>
                    <span v-if="item.state == 'error'">上传失败</span>
                </div>
                <div class="exf-del" @click.stop="handleDeleteUpload(item, i)">删除</div>
            </div>
        </div>
        <div class="file-limit">上传数量：{{uploadFileList.length}}/2</div>
        <template #footer>
            <el-button type="default" size="large" style="width: 120px; border-radius:10px;" @click="isShow = false">取消</el-button>
            <el-button type="primary" size="large" style="width: 120px; border-radius:10px;" color="#3468FE" @click="confirm">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import FileType from '../FileType'
import UploadFile from '@/utils/uploadFile.js'
import { createUploadSign, createUploadFile } from '@/api/personnel/file'
import { recruitSignUp } from "@/api/personnel/recruitmentWall";

const props = defineProps({
    // 选择的报名信息
    info: Object,
    // 招募id
    recruitId: Number
})

const emit = defineEmits(['signUpSucc'])

const isShow = ref(false)
const remark = ref('')
const {proxy} = getCurrentInstance()

// 关闭清空信息
watch(isShow, (val)=>{
    if (!val) {
        remark.value = ''
        uploadFileList.value = []
    }
})

// 点击 - 确认报名
const confirm = ()=> {
    const data = {
        recruitId: props.recruitId,
        categoryRecruitRelationId: props.info.categoryRecruitRelationId,
        leaveMessage: remark.value,
        sourceId: uploadFileList.value.map(item => item.encryptedId).join()
    }
    recruitSignUp(data).then(res => {
        if (res && +res.code == 200) {
            // 关闭弹窗，重置数据
            isShow.value = false
            remark.value = ''
            uploadFileList.value = []
    
            emit('signUpSucc')
        }
    })
}

// 点击 - 上传附件
const uploadFileList = ref([])
const UploadFileRef = ref()

const handleUpload = () => {
    if (uploadFileList.value.length < 2) {
        UploadFileRef.value.click()
    } else {
        proxy.$modal.msgWarning('最多只允许上传两个附件')
    }
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
    }
    createUploadFile(params).then(res => {
        callback(res.data)
        handleStartUpload();
    }).catch(err => {
        errorback(err)
    })
}

// 上传文件
const handleUploadFiles = (e) => {
    const files = e.target.files

    // 数量限制
    if (files.length + uploadFileList.value.length > 2) {
        return proxy.$modal.msgWarning('最多只允许上传两个附件，请重新选择')
    }

    for (const File of files) {
        const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun })
        uploadData.on('success', handleStartUpload)
        uploadFileList.value.push(uploadData)
    }

    handleStartUpload()
    UploadFileRef.value.value = ''
}

// 开始上传
const handleStartUpload = () => {
    let isUploading = -1 // 是否有正在上传的文件
    let isAwaiting = -1  // 是否有等待上传的文件
    for (const key in uploadFileList.value) {
        const item = uploadFileList.value[key]
        if (item.state == 'uploading' || item.state == 'checking') {
            isUploading = key
            break
        } else if (item.state == 'awaiting') {
            isAwaiting = key
            break
        }
    }
    if (isUploading >= 0) {
        return
    }
    if (isAwaiting >= 0) {
        uploadFileList.value[isAwaiting].uploadFile();
        return
    }
}
// 删除上传的文件
const handleDeleteUpload = (item, index) => {
    uploadFileList.value[index]?.handleCancel()
    uploadFileList.value.splice(index, 1)
    handleStartUpload()
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
    }
    createUploadSign(params).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

defineExpose({
    isShow
})
</script>

<style lang="scss" scoped>
// 引入icon
@mixin importIcon ($url, $width, $height, $margin:0 5px 0 0) {
    background-image: url($url);
    background-repeat: no-repeat;
    width: $width;
    height: $height;
    margin: $margin;
    background-size: 100%;
}
@mixin cashAmount ($size: 22px) {
    font-size: $size;
    font-weight: 500;
    color: #FFC800;
}
.cash-coin {
    display: flex;
    align-items: center;
    @include cashAmount();
    .icon_coin {
        @include importIcon("@/assets/icons/icon_money.png", 20px, 20px);
    }
    .cash-label {
        font-size: 16px;
        color:#D96A00
    }
    .cash-num {
        font-size: 24px;
        font-weight: 500;
        color: #F88212;
    }
}
.title {
    font-size: 18px;
    font-weight: 500;
    color: #30323B;
}
.info-row {
    display: flex;
    align-items: center;
    margin: 32px 0 24px;
    .tag {
        padding: 6px 22px;
        color: #3468FE;
        margin-right: 30px;
        font-size: 14px;
        border-radius: 6px;
        background: #D6E1FF;
    }
}
.remark {
    &:deep(.el-textarea__inner) {
        height: 84px;
        --el-input-border-radius: 6px;
        --el-input-border-color: none;
        --el-input-bg-color: #EEEEEE;
    }
}
.upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 28px;
    border-radius: 16px;
    border: 1px solid #3468FE;
    font-size: 14px;
    font-weight: 400;
    color: #3468FE;
    cursor: pointer;
}
.exf-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px 10px;
    margin-top: 8px;
    background: #F1F7FD;
    border-radius: 6px;
    .exf-row {
        display: flex;
        align-items: center;
    }
    .exf-status {
        font-size: 12px;
        margin-right: 10px;
        color: #676c7f;
        user-select: none;
    }
    .exf-del {
        font-size: 12px;;
        font-weight: 400;
        color: #E91E19;
        cursor: pointer;
    }
}
.file-limit {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
    color: #999;
}
</style>