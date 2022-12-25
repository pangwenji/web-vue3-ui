<template>
    <div>
        <el-dialog v-model="visibled" :before-close="onBeforedClose" title="评价" width="600px" custom-class="dialog-center apply_refund-dialog">
            <div class="rate-box">
                <div class="label">服务态度</div>
                <el-rate v-model="formData.serviceAttitudeScore" void-color="#C0C0C0" size="large" />
            </div>
            <div class="rate-box">
                <div class="label">工作速度</div>
                <el-rate v-model="formData.speedworkScore" void-color="#C0C0C0" size="large" />
            </div>
            <div class="rate-box">
                <div class="label">完成质量</div>
                <el-rate v-model="formData.finishQualityScore" void-color="#C0C0C0" size="large" />
            </div>
            <div class="title"><el-icon :size="16" class="el-icon--left"><Edit /></el-icon>填写评价 </div>
            <el-input type="textarea" placeholder="请填写评价" v-model="formData.content" :rows="6" resize="none" show-word-limit :maxlength="100"></el-input>
            <template #footer>
                <div style="text-align:center;">
                    <el-button type="primary" size="large" @click="handleSubmit" style="width: 160px; border-radius:8px;" :loading="loadingSubmit" color="#3468FE">提交评价</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { defineComponent, reactive } from 'vue'
import { handleComment } from "@/api/personnel/personnelManage"
import { ElMessage } from 'element-plus';
const emits = ['onSubmit'];
const setup = (prop,{emit}) => {
    const visibled = ref(false);
    const formData = reactive({
        serviceAttitudeScore: 5,
        finishQualityScore: 5,
        speedworkScore: 5,
        content:'',
        orderNo:'',
    })
    const loadingSubmit = ref(false);
    const onBeforedClose = (deno) => {
        if(loadingSubmit.value){ return  }
        formData.serviceAttitudeScore = 5;
        formData.finishQualityScore = 5;
        formData.speedworkScore = 5;
        formData.content = '';
        formData.orderNo = '';
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    // 提交
    const handleSubmit = ()=>{
        loadingSubmit.value = true;
        handleComment(formData).then(res=>{
            loadingSubmit.value = false;
            emit('onSubmit',formData);
            ElMessage.success('评价成功')
            onBeforedClose();
        }).catch(err=>{
            loadingSubmit.value = false;
        })
    }
    // 打开弹窗
    const open = (e)=>{
        formData.orderNo = e.orderNo;
        visibled.value = true;
    }
    return {
        open,
        visibled,
        formData,
        handleSubmit,
        loadingSubmit,
        onBeforedClose,
    }
}
export default defineComponent({
    setup,
    emits
})
</script>
<style scoped lang="scss">
:deep(.el-dialog.apply_refund-dialog.dialog-center){
    .el-dialog__body {
        padding: 10px 20px;
        .el-textarea__inner{
            --el-input-placeholder-color: #75767c;
        }
        .el-form-item__label{
            color: #17181E;
            font-size: 14px;
            font-weight: 600;
        }
    }
}
.rate-box{
    padding: 6px 30px;
    background: rgba(52,104,254,0.04);
    border-radius: 8px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .label{
        color: #181920;
        font-size: 16px;
        font-weight: 600;
        margin-right: 60px;
    }
    &:deep(.el-rate){
        --el-rate-icon-size: 30px;
    }
}
.title{
    color: #181920;
    font-size: 14px;
    font-weight: 600;
    margin-right: 60px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
}
</style>