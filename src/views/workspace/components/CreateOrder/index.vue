<template>
    <el-dialog v-model="visibled" :show-close="false" width="600px" :before-close="onBeforeClose" :close-on-press-escape="false" :close-on-click-modal="false"
        custom-class="custom_dialog  dialog-center">
        <template #title>
            <div class="dialog_header-box">
                <el-avatar :size="50" :src="viewData.avatar"></el-avatar>
                <div>
                    <div class="nickName">{{viewData.nickName || 'asdasda'}}</div>
                    <div class="desc">
                        <svg-icon class="icon-sex-box man" :size="16" title="男" iconClass="icon_man" v-if="viewData.sex == 0"></svg-icon>
                        <svg-icon class="icon-sex-box girl" :size="16" title="女" iconClass="icon_girl" v-else-if="viewData.sex == 1"></svg-icon>
                        <svg-icon class="icon-sex-box other" :size="16" title="未知" iconClass="icon_sex" v-else></svg-icon>
                    </div>
                </div>
            </div>
        </template>
        <div style="color: #30323B; font-size: 16px; margin-bottom: 20px;">{{viewData.title}}</div>
        <div class="demand_input-label">
            <el-icon :size="20">
                <Edit />
            </el-icon>
            <span style="margin-left: 6px;">需求备注</span>
        </div>
        <div class="demand_input-box">
            <el-input type="textarea" placeholder="需求详情说明" v-model="formData.content" resize="none"></el-input>
        </div>
        <div class="demand_upload-label">
            <div class="demand_upload-button" @click.stop="handleClickFile">
                <el-icon>
                    <Paperclip />
                </el-icon>
                <span>上传附件</span>
            </div>
            <input type="file" ref="UploadFileRef" hidden multiple @change="handleUploadFile" />
        </div>
        <div>
            <template v-for="(item,index) in uploadFileList" :key="index">
                <div class="upload-attachment-item">
                    <div class="upload-attachment-icon">
                        <FileType color="#fff" :size="34" :type="item.FileType"></FileType>
                    </div>
                    <div class="upload-attachment-name">
                        {{item.FileName}}
                    </div>
                    <div class="upload-attachment-uploading" v-if="item.state !== 'success'">
                        <span v-if="item.state == 'awaiting'">等待上传</span>
                        <span v-if="item.state == 'checking'">读取文件</span>
                        <span v-if="item.state == 'uploading'">正在上传( {{item.percent}} %)</span>
                        <span v-if="item.state == 'error'" style="color: red">上传失败</span>
                    </div>
                    <!-- <div class="upload-attachment-btn" v-else @click.stop="handleViewFile(item,index)">查看</div> -->
                    <div class="upload-attachment-btn delete" @click.stop="handleDeleteUpload(item,index)">删除</div>
                </div>
            </template>
        </div>
        <div class="demand_upload-box"></div>
        <div class="demand_price-box">
            <div style="flex: none; margin-right: 20px; display:flex; align-items:flex-end;">
                <div>{{viewData.quotedPrice}}</div>
                <span class="background_icon-money"></span>
                <div class="desc" v-if="viewData.unitName">/{{viewData.unitName}}</div>
            </div>
            <div style="flex: none; margin-right: 20px; display:flex; align-items:flex-end;">
                <span>{{viewData.price}}</span>
                <span class="background_icon-money"></span>
                <span class="desc">起做</span>
            </div>
            <div style="flex: none; display:flex; align-items:flex-end;">
                <span>{{viewData.finishDay}}天</span>
                <span class="desc">交付</span>
            </div>
            <div style="flex: auto; text-align:right;">
                <span style="font-size: 28px; color: #F88212;">{{orderPrice}}</span>
                <span class="background_icon-money" style="margin-right: 20px;"></span>
                <el-input-number v-model="formData.num" style="width: 114px;" :min="1" :max="999" @change="handleChange" />
            </div>
        </div>
        <div class="demand_upload-box"></div>
        <template #footer>
            <div style="display:flex;align-items: center;">
                <div class="dialog_footer-left">
                    <span>可用余额：</span>
                    <span style="font-size: 14px; color: #FF9F03; font-weight: 600;">{{balance}}</span>
                    <span class="background_icon-money"></span>
                </div>
                <div class="toast" v-if="orderPrice > balance">余额不足，<span @click="handleRecharge">立即充值</span></div>
            </div>
            <div class="dialog_footer-right">
                <el-button @click="onBeforeClose" size="large" style="width: 120px; border-radius: 10px;">取消</el-button>
                <el-button :loading="loadingSubmit" @click.stop="handleSubmit" size="large" type="primary" color="#3468FE"  style="width: 120px; border-radius: 10px;">确定</el-button>
            </div>
        </template>
    </el-dialog>
    <CreateOrderSuccess ref="CreateOrderSuccessRef"></CreateOrderSuccess>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, nextTick, reactive } from 'vue'
import { useStore } from 'vuex'
import { orderASave } from '@/api/personnel/recruitmentWall.js'
import { createUploadSign, createUploadFile } from '@/api/personnel/file'
import UploadFile from '@/utils/uploadFile';
import FileType from '../FileType'
import CreateOrderSuccess from '../CreateOrderSuccess'
import { ElMessage } from 'element-plus';
const emits = ['onSubmit'];
const props = {};
const components = {
    FileType,
    CreateOrderSuccess
}
const setup = (prop, { emit }) => {
    const store = useStore();
    const viewData = ref({})
    const formData = reactive({
        num: 1,         // 数量
        type: 1,
        price:'',       // 最终价格
        content: '',    // 需求内容
        sourceId: '',   // 文件Id
        talentsId: '',// 人才ID
    });
    const dialogOrder = ref('');
    const dialogPrice = ref(0);
    const visibled = ref(false);
    const loadingSubmit = ref(false);
    const balance = computed(() => store.state.user.money);
    const orderPrice = computed(() => {
        return formData.num * (viewData.value.quotedPrice ? viewData.value.quotedPrice : 0)
    })
    const { proxy } = getCurrentInstance();
    const CreateOrderSuccessRef = ref();
    // 弹窗关闭之前的回调
    const onBeforeClose = (deno) => {
        if(loadingSubmit.value){ return }
        formData.num = 1;
        formData.price = '';
        formData.content = '';
        formData.sourceId = '';
        formData.talentsId = '';
        uploadFileList.value = []
        if (typeof deno == 'function') {
            deno()
        } else {
            visibled.value = false;
        }
    }
    // 数量改变的回调
    const handleChange = () => {}
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
            console.log(err)
            errorback(err)
        })
    }
    const UploadFileRef = ref();
    const uploadFileList = ref([]);
    const handleClickFile = () => {
        UploadFileRef.value.click();
    }
    // 上传文件
    const handleUploadFile = (e) => {
        const files = e.target.files;
        for (const File of files) {
            const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun });
            // store.commit('upload/addFileList', uploadData);
            uploadData.on('success', handleStartUpload)
            uploadFileList.value.push(uploadData);
        }
        handleStartUpload()
        UploadFileRef.value.value = ''
    }
    // 删除上传的文件
    const handleDeleteUpload = (item, index) => {
        uploadFileList.value[index]?.handleCancel()
        uploadFileList.value.splice(index, 1)
        handleStartUpload()
    }
    // 开始上传
    const handleStartUpload = () => {
        let isUploading = -1; // 是否有正在上传的文件
        let isAwaiting = -1;  // 是否有等待上传的文件
        for (const key in uploadFileList.value) {
            const item = uploadFileList.value[key]
            if (item.state == 'uploading' || item.state == 'checking') {
                isUploading = key;
                break;
            } else if (item.state == 'awaiting') {
                isAwaiting = key;
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
    // 提交表单
    const handleSubmit = ()=>{
        if(orderPrice.value < viewData.value.price){
            ElMessage.warning('下单金额没有达到起做金额');
            return
        }
        if(orderPrice.value > balance.value){
            ElMessage.warning('余额不足，请充值！');
            return
        }
        if(!formData.content){
            ElMessage.warning('请填写需求');
            return
        }
        formData.price = orderPrice.value;
        const sourceIds = [];
        for(const item of uploadFileList.value){
            if(item.state == 'success'){
                sourceIds.push(item.successData.encryptedId);
            }else{
                ElMessage.error('有附件未上传成功');
                return
            }
        }
        formData.sourceId = sourceIds.join(',');
        loadingSubmit.value = true;
        orderASave(formData).then(res=>{
            loadingSubmit.value = false;
            proxy.$pay.openPay({
                orderNo:res.data.payOrderNo,
                confirm(){
                    onBeforeClose();
                    CreateOrderSuccessRef.value.open(res.data.orderNo,viewData.value.userId);
                    return Promise.resolve();
                },
            })
        }).catch(err=>{
            loadingSubmit.value = false;
        })
    }
    // 去充值
    const handleRecharge = ()=>{
        proxy.$pay.openRecharge()
    }
    // 打开
    const open = (data) => {
        viewData.value = data;
        visibled.value = true;
        nextTick(() => {
            formData.num = data.num || 1;
            formData.talentsId = data.id;
        })
    }
    return {
        open,
        balance,
        formData,
        visibled,
        viewData,
        orderPrice,
        dialogPrice,
        dialogOrder,
        handleSubmit,
        handleChange,
        loadingSubmit,
        UploadFileRef,
        onBeforeClose,
        handleRecharge,
        uploadFileList,
        handleClickFile,
        handleUploadFile,
        handleDeleteUpload,
        CreateOrderSuccessRef,
    }
}
export default defineComponent({
    setup,
    emits,
    props,
    components
})
</script>
<style lang="scss">
.custom_dialog.el-dialog {
    .el-dialog__body {
        padding: 0 20px;
    }
    .el-dialog__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
<style scoped lang="scss">
// .custom_dialog{

// }
.dialog_header-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #30323b;
    &:deep(.el-avatar) {
        flex: none;
        pointer-events: none;
        margin-right: 12px;
    }
    .nickName {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 10px;
    }
    .desc {
        font-size: 14px;
        font-weight: 400;
        color: #30323b;
        position: relative;
        padding-left: 20px;
        .icon-sex-box {
            color: #7cb5ec;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background: rgba($color: #7cb5ec, $alpha: 0.3);
            padding: 2px;
            border-radius: 6px;
            &.man {
                color: #7cb5ec;
                background: rgba($color: #7cb5ec, $alpha: 0.3);
            }
            &.girl {
                color: #ef007f;
                background: rgba($color: #ef007f, $alpha: 0.3);
            }
            &.other {
                color: #18785f;
                background: rgba($color: #18785f, $alpha: 0.3);
            }
        }
    }
}
.demand_input-label {
    color: #24262f;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.demand_input-box {
    margin-bottom: 20px;
    &:deep(.el-textarea) {
        --el-input-bg-color: #eeeeee;
        --el-input-border-color: #eeeeee;
        --el-input-hover-border-color: #3a36db;
        .el-textarea__inner {
            height: 140px;
        }
    }
}
.demand_upload-label {
    margin-bottom: 20px;
    .demand_upload-button {
        height: 30px;
        width: 100px;
        text-align: center;
        line-height: 30px;
        border-radius: 100px;
        border: 1px solid #3a36db;
        color: #3a36db;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}

.upload-attachment-item {
    background: rgba($color: #7CB5EC, $alpha: .1);
    border-radius: 8px;
    padding: 6px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    &:last-child {
        margin-bottom: 0;
    }
    .upload-attachment-icon {
        flex: none;
        border-radius: 4px;
        overflow: hidden;
        background: #7CB5EC;
    }
    .upload-attachment-name {
        flex: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #30323B;
        font-size: 12px;
        padding: 0 10px;
    }
    .upload-attachment-uploading {
        flex: none;
        font-size: 12px;
        margin-right: 10px;
        color: #30323B;
        user-select: none;
    }
    .upload-attachment-btn {
        font-size: 12px;
        margin-right: 10px;
        flex: none;
        user-select: none;
        cursor: pointer;
        color: #3468FE;
        &.delete {
            color: #E91E19;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
.demand_upload-box {
    margin-bottom: 20px;
}
.demand_price-box {
    font-size: 18px;
    color: #3d3f50;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .desc {
        font-weight: 400;
        color: #3d3f50;
        font-size: 14px;
    }
    &:deep(.el-input-number) {
        flex: none;
        .el-input{
            --el-input-hover-border-color: #3a36db;
        }
        .el-input-number__decrease {
            background: none;
            &:hover {
                color: #3a36db;
                border-color: #3a36db;
            }
        }
        .el-input-number__increase {
            background: none;
            &:hover {
                color: #3a36db;
                border-color: #3a36db;
            }
        }
    }
}
.dialog_footer-left {
    font-size: 14px;
    color: #24262f;
    display: flex;
    align-items: center;
    position: relative;
    padding: 6px 4px 6px 8px;
    background-color: #F5F6F9;
    border-radius: 18px;
}
.toast {
    margin-left: 6px;
    border-radius: 14px;
    color: #EF6A6A;
    font-size: 14px;
    width: 126px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    span{
        cursor: pointer;
        color: #3a36db;
    }
}
</style>