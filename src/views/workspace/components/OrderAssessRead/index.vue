<template>
    <div>
        <el-dialog v-model="visibled" :before-close="onBeforedClose" title="评价" width="600px" custom-class="dialog-center apply_refund-dialog">
            <div class="rate-box">
                <div class="label">服务态度</div>
                <el-rate v-model="viewData.serviceAttitudeScore" disabled  void-color="#C0C0C0" size="large" />
            </div>
            <div class="rate-box">
                <div class="label">工作速度</div>
                <el-rate v-model="viewData.speedworkScore" disabled void-color="#C0C0C0" size="large" />
            </div>
            <div class="rate-box">
                <div class="label">完成质量</div>
                <el-rate v-model="viewData.finishQualityScore" disabled void-color="#C0C0C0" size="large" />
            </div>
            <div class="title">用户评价</div>
            <div style="min-height: 60px;">
                <pre style="margin:0;">{{viewData.content}}</pre>
            </div>
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
    const viewData = reactive({
        serviceAttitudeScore: 5,
        speedworkScore: 5,
        finishQualityScore: 5,
        content:'',
        orderNo:'',
    });
    const onBeforedClose = (deno) => {
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    // 打开弹窗
    const open = (e)=>{
        viewData.orderNo = e.orderNo;
        viewData.content = e.commentContent;
        viewData.speedworkScore = e.speedworkScore;
        viewData.finishQualityScore = e.finishQualityScore;
        viewData.serviceAttitudeScore = e.serviceAttitudeScore;
        visibled.value = true;
    }
    return {
        open,
        visibled,
        viewData,
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
    padding: 10px 0px;
    display: flex;
    align-items: center;
}
</style>