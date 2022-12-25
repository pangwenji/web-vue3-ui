<template>
    <el-dialog v-model="visibled" title="申请平台介入" width="500px" :before-close="onBeforeClose" :close-on-press-escape="false" :close-on-click-modal="false" custom-class="dialog-center">
        <el-form ref="FormDataRef" :model="formData" :rules="formRule" label-position="top">
            <el-form-item label="申请原因" prop="applyReason">
                <el-input type="textarea" :rows="6" resize="none" v-model="formData.applyReason" placeholder="不少于10个字符" :maxlength="600" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="`上传图片(${uploadFileList.length}/5)`">
                    <input ref="UploadFileRef" type="file" @change="handleUploadFiles" multiple hidden />
                    <div class="img-box">
                        <div class="add-pic" @click.stop="handleUpload"><el-icon :size="30"><Plus /></el-icon></div>
                        <template v-for="(item, i) in uploadFileList" :key="i">
                            <div class="pre-list" v-if="uploadFileList.length > 0 && item.state == 'success'">
                                <div class="del" @click.stop="handleDeleteUpload(i)"><el-icon class="svg"><Close /></el-icon></div>
                                <el-image style="width:60px;height:60px" :src="item.successData?.sourceUrl" :key="item.id"/>
                            </div>
                            <div v-else class="add-pic load">{{item.percent}}%</div>
                        </template>
                    </div>
                </el-form-item>
        </el-form>
        <template #footer>
            <div style="width:100%; text-align:center;">
                <el-button type="primary" :loading="loadingStatus" @click="handleSubmit">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import UploadFile from '@/utils/uploadFile.js'
import { defineComponent, reactive } from 'vue'
import { platformIntervention } from '@/api/personnel/personnelManage.js'
import { createUploadSignPublic, createUploadFilePublic } from '@/api/personnel/file'
import { ElMessage } from 'element-plus';
const emits = ['onSubmit']
const props = {
    // 申请人： 0 - 甲方，1 - 乙方
    proposer: {
        type: Number,
        // required: true
    }
};

const setup = (prop,{ emit })=>{
    const visibled = ref(false);
    const formData = reactive({
        orderNo:'',
        fileIds: '',
        proposer: prop.proposer,
        applyReason:''
    });
    const formRule = reactive({
        applyReason:[
            {required:true,message:'申请原因必填',trigger:'blur'},
            {min:10,max:600,message:'不能少于10个字符',trigger:'blur'},
        ]
    })

    // 点击 - 上传附件
    const uploadFileList = ref([])
    const UploadFileRef = ref()

    const handleUpload = () => {
        if (uploadFileList.value.length < 5) {
            UploadFileRef.value.click()
        } else {
            ElMessage.warning('最多只允许上传5张图片')
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
        createUploadFilePublic(params).then(res => {
            callback(res.data)
            handleStartUpload();
        }).catch(err => {
            errorback(err)
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
        }
        createUploadSignPublic(params).then(res => {
            callback(res.data)
        }).catch(err => {
            errorback(err)
        })
    }

    // 上传文件
    const imageTypes = /.(jpg|png|jpeg)$/;
    const handleUploadFiles = (e) => {
        const files = e.target.files
        // 数量限制
        if (files.length + uploadFileList.value.length > 5) {
            return ElMessage.warning('最多只允许上传5张图片，请重新选择')
        }
        // 格式校验
        if (!imageTypes.test(files[0].type)) {
            return ElMessage.error('仅支持上传jpg、png、jpeg的图片格式')
        }

        for (const File of files) {
            const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun })
            uploadData.on('success', handleStartUpload)
            uploadData.on('error', handleStartUpload)
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
    const handleDeleteUpload = (index) => {
        uploadFileList.value[index]?.handleCancel()
        uploadFileList.value.splice(index, 1)
        handleStartUpload()
    }

    const loadingStatus = ref(false);
    const FormDataRef = ref();
    const handleSubmit = ()=>{
        FormDataRef.value.validate().then(res=>{
            loadingStatus.value = true;
            let fileList = [] // 上传的图片
            uploadFileList.value.forEach(item => {
                fileList.push(item.encryptedId)
            })
            const params = {
                ...formData,
                fileIds: fileList.join(',')
            }

            platformIntervention(params).then(res=>{
                loadingStatus.value = false;
                emit('onSubmit', res.data)
                ElMessage.success('提交成功，请等待客服联系您！')
                onBeforeClose();
            }).catch(err=>{
                loadingStatus.value = false;
            })
        })
    }
    // 弹窗关闭之前的回调
    const onBeforeClose = (deno)=>{
        if(loadingStatus.value){return}
        if(typeof deno == 'function'){
            resetForm()
            deno()
        }else{
            resetForm()
            visibled.value = false;
        }
    }

    // 重置弹窗内容
    const resetForm = ()=> {
        formData.orderNo = ''
        formData.fileIds= ''
        formData.applyReason= ''
        uploadFileList.value = []
    }

    // 打开
    const open = ({orderNo})=>{
        formData.orderNo = orderNo
        visibled.value = true;
    }
    return {
        open,
        formRule,
        formData,
        visibled,
        FormDataRef,
        UploadFileRef,
        uploadFileList,
        handleUpload,
        handleSubmit,
        onBeforeClose,
        loadingStatus,
        handleUploadFiles,
        handleDeleteUpload
    }
}
export default defineComponent({
    setup,
    props,
    emits
})
</script>

<style lang="scss" scoped>
.img-box {
        display: flex;
        :deep(.el-image__inner) {
            border-radius: 6px;
        }
        .add-pic {
            width: 60px;
            height: 60px;
            border-radius: 6px;
            padding-top: 13px;
            text-align: center;
            background-color: #F4F5F6;
            border: 1px solid #ECECEC;
            cursor: pointer;
        }
        .load {
            margin-left: 8px;
        }
        .pre-list {
            position: relative;
            display: flex;
            margin-left: 8px;
            border-radius: 10px;
            .del {
                position: absolute;
                right: 0px;
                top: 0px;
                z-index: 99;
                color: #fff;
                .svg {
                    position: absolute;
                    right: 0px;
                    background-color: rgba(240, 128, 128, .6);
                    cursor: pointer;
                }
            }
        }
    }
</style>
