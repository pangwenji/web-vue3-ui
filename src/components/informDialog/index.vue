<template>
    <el-dialog v-model="isShow" width="448px" :title="type === 4 ? '意见反馈' : (isInform ? '举报成功':'举报')" :show-close="false" custom-class="dialog-center" v-bind="$attrs">
        <div class="content">
            <el-form v-if="!isInform" :model="formData" ref="ruleForm" label-width="120px" label-position="top">
                <el-form-item v-if="type === 4" label="反馈的问题类型" prop="questionType" :rules="[{required: true, trigger: 'blur', message: '请选择反馈的问题类型'}]">
                    <el-select v-model="formData.questionType" placeholder="请选择类型" style="width:100%">
                        <el-option v-for="(item, i) in adviceList" :key="i" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item v-else label="举报原因:" prop="questionType" :rules="[{required: true, trigger: 'blur', message: '请选择举报原因'}]">
                    <el-select v-model="formData.questionType" placeholder="请选择举报原因" style="width:100%">
                        <el-option v-for="(item, i) in reasonList" :key="i" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="type === 4 ? '详细描述' : '具体描述:'">
                    <el-input
                        v-model="formData.questionContent"
                        :rows="4"
                        type="textarea"
                        resize="none"
                        maxlength="100"
                        :placeholder="type === 4 ? '有什么想说的，尽管给我留言吧' : '请具体描述举报原因'"
                        show-word-limit
                    />
                </el-form-item>
                <el-row v-if="type !== 4" :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="您的称呼">
                            <el-input v-model="formData.name" maxlength="10" show-word-limit/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone" :rules="[{validator: validatePhone, trigger: 'blur'}]">
                            <el-input v-model="formData.phone" maxlength="11"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="`上传图片(${uploadFileList.length}/5)`">
                    <input ref="UploadFileRef" type="file" accept=".jpeg,.png,.jpg" @change="handleUploadFiles" multiple hidden />
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
            <div v-else class="feedback">
                <div class="line">感谢您监督，我们将会重点关注</div>
                <div class="line">举报编号：<span class="tips">{{informOrder}}</span></div>
                <div class="line">我们已经收到您提交的反馈，一旦核实立即处理</div>
                <div class="code">
                    <el-image class="img" :src="qrcodeImg"></el-image>
                    <div class="line">扫码客服二维码，提交<span class="tips">举报编号</span>查询进度</div>
                </div>
            </div>
        </div>
        <template #footer>
            <el-button size="large" class="btn" @click="close">{{isInform ? '确定' : '取消'}}</el-button>
            <el-button v-if="!isInform && type === 4" type="primary" color="#3468FE" size="large" class="btn" @click="confirm">提交</el-button>
            <el-button v-else-if="!isInform" type="danger" size="large" class="btn" @click="confirm">举报</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import UploadFile from '@/utils/uploadFile.js'
import qrcodeImg from '@/assets/login/invite-code.png'
import { useRoute } from 'vue-router'
import { informRecruit } from '@/api/personnel/recruitmentWall'
import { createUploadSignPublic, createUploadFilePublic } from '@/api/personnel/file'
import { ElMessage } from 'element-plus'

const props = defineProps({
    // 举报详情
    info: {
        type:Object,
        default: ()=>({})
    },
    // 举报类型 0：招募 1：工种 2：网盘 3：项目 4: 用户反馈 5: IM用户
    type: {
        type: Number,
        default: 0
    }
})
const reasonList = ref(['政治反动内容', '违法犯罪内容', '低俗色情内容', '盗版或侵权', '消极反馈或延稿件进度', '垃圾广告信息', '引导站外交易', '昵称头像简介违规', '收取费用', '人身谩骂'])
const adviceList = ref(['功能问题', '操作体验', '界面审美', '信息提醒', '账号问题', '吐槽', '其他反馈'])
const validatePhone = (rule, value, callback) => {
  let reg = /^1[3-9]\d{9}/;
  if (!value || reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}
const route = useRoute()
const isShow = ref(false)
const isInform = ref(false)
const informUrl = computed(()=> {
    const host = import.meta.env.VITE_APP_API_PROXY || location.host
    return `${host}/workbench/#${route.fullPath}`
})
const formData = reactive({
    name: '',
    phone: '',
    fileIds: '',
    questionType: '',
    questionContent: '',
    modelType: props.type,
    sourceTitle: '', // 招募标题
    sourceId: '', // 招募id
    address: informUrl.value // 举报地址
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

// 确认举报
const ruleForm = ref()
const informOrder = ref('')
const confirm = async ()=> {
    formData.sourceId = props.info.id
    formData.sourceTitle = props.info.title
    let fileList = []
    uploadFileList.value.forEach(item => {
        fileList.push(item.encryptedId)
    })
    const params = {
        ...formData,
        fileIds: fileList.join(',')
    }
    // 校验
    await ruleForm.value.validate((valid) => {
        if (valid) {
            informRecruit(params).then(res => {
                if (props.type === 4) {
                    ElMessage.success('意见提交成功，感谢您的反馈！')
                    close()
                } else {
                    informOrder.value = res.data.orderNo
                    isInform.value = true
                    ElMessage.success(res.msg)
                }
            }).catch(() => {
                close()
            })
        }
    })
}

const close = ()=> {
    formData.questionType = ''
    formData.questionContent = ''
    formData.sourceId = ''
    formData.name = ''
    formData.phone = ''
    formData.fileIds = ''
    uploadFileList.value = []
    isShow.value = false
    isInform.value = false
}

defineExpose({
    isShow
})
</script>

<style lang="scss" scoped>
.content {
    .btn {
        width: 120px;
        border-radius:10px;
    }
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
    .feedback {
        width: 404px;
        height: 390px;
        padding: 40px 50px;
        background: #F5F6F9;
        border-radius: 4px;
        .tips {
            font-size: 14px;
            font-weight: 400;
            color: #3468FE;
        }
        .line {
            margin-bottom: 10px;
        }
        .code {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .img {
            width: 148px;
            height: 148px;
            margin: 30px;
        }
    }
}
</style>
