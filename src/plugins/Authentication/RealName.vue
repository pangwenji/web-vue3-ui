<template>
    <el-dialog v-model="visibled" :show-close="true" width="500px" @closed="removeNode&&removeNode()" :before-close="onBeforeClose" :close-on-press-escape="false" :close-on-click-modal="false"
        custom-class="dialog-center">
        <template #title>
            <div style="display:flex; align-items:center;">
                <el-image style="width: 40px; height:26px; margin-right: 10px;" :src="AuthenticationIcon"></el-image>
                <span>实名认证</span>
            </div>
        </template>
        <div class="authentication-box">
            <el-form :model="formData" :rules="formRule" ref="FormDataRef" label-position="top">
                <el-form-item label="上传身份证" prop="idCard1" :rules="[{required: true, validator:validatorIdCard, trigger:'blur'}]">
                    <div class="id_card-box">
                        <div  style="width:200px;"  >
                            <div class="id_card-item id_card1" @click="handleClickUpload('idCard1')">
                                <img style="width:100%; height:100%; line-height:1; object-fit:cover; position:relative; z-index:1"  v-if="formData.idCard1" :src="formData.idCard1" />
                                <div class="loading-mask" @click.stop="false" v-if="loadingUpload.idCard1">
                                    <el-icon class="is-loading" :size="20"><Loading /></el-icon>
                                    <div>正在上传识别</div>
                                </div>
                                <!-- <div class="action-btn"></div> -->
                            </div>
                            <div class="desc">正面</div>
                        </div>
                        <div style="width:200px;" >
                            <div class="id_card-item id_card2" @click="handleClickUpload('idCard2')">
                                <img style="width:100%; height:100%; line-height:1; object-fit:cover; position:relative; z-index:1" v-if="formData.idCard2" :src="formData.idCard2" />
                                <div class="loading-mask" @click.stop="false" v-if="loadingUpload.idCard2">
                                    <el-icon class="is-loading" :size="20"><Loading /></el-icon>
                                    <div>正在上传识别</div>
                                </div>
                            </div>
                            <div class="desc">背面</div>
                        </div>
                    </div>
                    <input type="file" accept="image/*" hidden ref="UploadFileRef" @change="handleUploadImage" />
                </el-form-item>

                <el-form-item label="真实姓名" prop="name">
                    <el-input placeholder="上传身份证后自动识别" disabled v-model="formData.name" size="large"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="idcard">
                    <el-input placeholder="上传身份证后自动识别" disabled v-model="formData.idcard" size="large"></el-input>
                </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input placeholder="请输入手机号" style="margin-bottom: 10px;" v-model="formData.phone" size="large"></el-input>
              </el-form-item>
                <el-form-item label="手机验证码" prop="code">
<!--                  手机号取消禁填-->
<!--                    <div class="formData-phone">-->
<!--                        {{phone}}-->
<!--                    </div>-->
                    <div class="phone-code">
                        <el-input placeholder="请输入手机验证码" v-model="formData.code" size="large"></el-input>
                        <el-button type="default" style=" flex:none; border-radius: 8px; " :disabled="countDown !== 0" @click="handleSendCode" size="large">
                            <span v-if="countDown == 0">获取验证码</span>
                            <span v-else-if="countDown > 0">重新获取（{{countDown}}）</span>
                            <span v-else>正在发送</span>
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="footer-box">
                <!-- <div>*手机验证码将发送至{{phone}}手机上，请注意查收。</div> -->
                <el-button type="primary" color="#3468FE" :loading="loadingSubmit" style="width: 120px;border-radius: 8px;" size="large" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import { ElMessage } from 'element-plus';
import { sendSmsVerificationCode , createUploadIdCard, createUploadSignAuth} from "@/api/login";
import { computed, defineComponent, reactive, ref } from 'vue'
import UploadFile from '@/utils/uploadFile.js'

import image from '@/assets/images/FileType/image.png'
import AuthenticationIcon from '@/assets/images/Authentication.png'
const props = {
    removeNode: {
        type: Function,
        default: null
    },
    onSubmitSuccess: {
        type: Function,
        default: null
    }
}
const setup = (prop) => {
    const store = useStore();
    const phone = computed(() => store.state.user.name);
    const UploadFileRef = ref();
    const loadingUpload = reactive({
        idCard1: false,
        idCard2: false,
    });
    const formData = reactive({
        idCard1: '',
        idCard2: '',
        frontFileId:'',
        backFileId:'',
        name: '',
        code: '',
        phone: '',
        idcard: '',
    });
    let uploadName;
    const formRule = {
        name: [{ required: true, message: '真实姓名必填', trigger: ['change', 'blur'] }],
        code: [{ required: true, message: '短信验证码必填', trigger: ['change', 'blur'] }, { pattern: /\d{6}$/, message: "请输入正确的短信验证码", trigger: "blur" }],
        phone: [{ required: true, message: '手机号必填', trigger: ['change', 'blur'] },{ pattern: /^1[0-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }],
        idcard: [{ required: true, message: '身份证号码必填', trigger: ['change', 'blur'] }],
    }
    const FormDataRef = ref();
    const loadingSubmit = ref(false);
    const visibled = ref(false);
    let interval;
    const countDown = ref(0);
    // 弹窗关闭之前的回调
    const onBeforeClose = (deno) => {
        if (loadingSubmit.value) { return }
        FormDataRef.value.resetFields();
        formData.backFileId = '';
        formData.idCard2 = '';
        formData.idCard1 = '';
        formData.frontFileId = '';
        formData.phone = '';
        if (interval) {
            clearInterval(interval);
            interval = null;
            countDown.value = 0;
        }
        if (typeof deno == 'function') {
            deno()
        } else {
            visibled.value = false;
        }
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
        createUploadSignAuth(params).then(res => {
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
        }
        createUploadIdCard(params).then(res => {
            const ocrResult = res.data.ocrResult;
            if(ocrResult.side == 'F'){
                if(options.idCardType === 2){
                    formData.idCard2 = '';
                    
                }
                formData.idCard1 = res.data.fileSystem.cover;
                formData.frontFileId = ocrResult.fileId;
                formData.idcard = ocrResult.idno;
                formData.name = ocrResult.name;
            }else{
                if(options.idCardType === 1){
                    formData.idCard1 = '';
                }
                formData.backFileId = ocrResult.fileId;
                formData.idCard2 = res.data.fileSystem.cover;
            }
            callback(res.data)
        }).catch(err => {
            errorback(err)
        })
    }
    // 点击上传
    const handleClickUpload = (e) => {
        uploadName = e;
        UploadFileRef.value.click();
    }
    // 上传
    const handleUploadImage = (e) => {
        const files = e.target.files;
        const name = uploadName;
        for (const File of files) {
            if (File.type) {
                const suffix = File.type.split('/').splice(0, 1);
                if (suffix[0] === 'image') {
                    const read = new FileReader();
                    read.readAsDataURL(File);
                    const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
                    read.onload = (event)=>{
                        try{
                            formData[name] = event.target.result;
                        }catch(e){

                        }
                    }
                    uploadData.idCardType = name == 'idCard1' ? 1 : 2
                    uploadData.on('success',()=>{
                        loadingUpload[name] = loadingUpload[name]&&loadingUpload[name].state == 'success' ? null : loadingUpload[name];
                    });
                    uploadData.on('error',()=>{
                        if(loadingUpload[name]&&loadingUpload[name]?.state == 'error'){
                            formData[name] = '';
                            formData.frontFileId = '';
                            loadingUpload[name] = null;
                        }
                    });
                    uploadData.uploadFile();
                    loadingUpload[name] = uploadData;
                } else {
                    ElMessage.warning(`文件${File.name}类型不正确，无法上传`)
                }
            } else {
                ElMessage.warning(`无法识别文件${File.name}类型，无法上传`)
            }
        }
        UploadFileRef.value.value = ''
    }


    const validatorIdCard = (rules,value,callback)=>{
        if(formData.backFileId && formData.frontFileId){
            callback();
        }else if(formData.frontFileId){
            callback(new Error('请上传身份证背面'));
        }else if(formData.backFileId){
            callback(new Error('请上传身份证正面'));
        }
    }

    // 发送短信验证码
    const handleSendCode = () => {
        const p = formData.phone;
        countDown.value = -1;
        sendSmsVerificationCode({ phone: p }).then(res => {
            if (countDown.value == 0) { return }
            countDown.value = 60;
            interval = setInterval(() => {
                if (countDown.value <= 0) {
                    clearInterval(interval);
                    interval = null;
                } else {
                    countDown.value -= 1;
                }
            }, 1000)
        }).catch(err => {
            countDown.value = 0;
        })
    }

    // 提交认证
    const handleSubmit = () => {
        FormDataRef.value.validate().then(res => {
            console.log(res)
            loadingSubmit.value = true;
            // 修改手机号为可输入
            // formData.phone = store.state.user.name;
            store.dispatch('UserVerify', formData).then(res => {
                loadingSubmit.value = false;
                ElMessage.success('认证成功');
                prop.onSubmitSuccess && prop.onSubmitSuccess(res);
                onBeforeClose();
            }).catch(err => {
                loadingSubmit.value = false;
            })
        })
    }
    // 打开
    const open = () => {
        visibled.value = true;
    }
    return {
        open,
        phone,
        image,
        formData,
        formRule,
        visibled,
        countDown,
        FormDataRef,
        handleSubmit,
        loadingSubmit,
        loadingUpload,
        UploadFileRef,
        onBeforeClose,
        handleSendCode,
        validatorIdCard,
        handleUploadImage,
        handleClickUpload,
        AuthenticationIcon,
    }
}
export default defineComponent({
    setup,
    props,
})
</script>
<style lang="scss" scoped>
.authentication-box {
    background: #f5f6fa;
    border-radius: 12px;
    padding: 20px 20px 1px;
    .formData-phone {
        margin-bottom: 10px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: var(--el-disabled-text-color);
        user-select: none;
        cursor: no-drop;
        border-radius: 8px;
        background: var(--el-disabled-bg-color);
        box-shadow: 0 0 0 1px
            var(--el-input-border-color, var(--el-border-color)) inset;
    }
    .id_card-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // margin-bottom: 20px;
        width: 100%;
        .id_card-item {
            width: 200px;
            height: 110px;
            flex: none;
            background-size: cover;
            background-repeat: no-repeat;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            &.id_card1 {
                background-image: url("@/assets/images/id_card1.png");
            }
            &.id_card2 {
                background-image: url("@/assets/images/id_card2.png");
            }
            .action-btn{
                width: 100%;
                height: 100%;
                position: absolute;
                display: none;
                display: 1;
                background: rgba($color: #fff, $alpha: .8);
                transition: opacity .3s ease;
                z-index: 2;
            }
            &:hover{
                .action-btn{
                    display: block;
                }
            }
            .loading-mask{
                width: 100%;
                position: absolute;
                height: 100%;
                background: rgba($color: #ffffff, $alpha: .8);
                color: #3468FE;
                font-size: 12px;
                display: flex;
                top: 0;
                left: 0;
                bottom: 0;
                flex-direction: column;
                align-items: center;
                z-index: 2;
                justify-content: center;
            }
        }
        .desc {
                // position: absolute;
                width: 100%;
                // left: 0px;
                height: 30px;
                // bottom: -30px;
                line-height: 30px;
                text-align: center;
                font-size: 12px;
                color: #3d3f50;
                pointer-events: none;
            }
    }

    &:deep(.el-form-item) {
        .el-form-item__label {
            color: #3d3f50;
            font-weight: 400;
        }
        .el-input {
            --el-input-border-radius: 8px;
        }
    }
    .phone-code {
        width: 100%;
        display: flex;
        .el-button {
            margin-left: 20px;
        }
    }
}
.footer-box {
    display: flex;
    color: #17181e;
    font-size: 14px;
    justify-content: flex-end;
    align-items: center;
}
</style>
