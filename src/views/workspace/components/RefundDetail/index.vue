<template>
    <div>
        <el-dialog v-model="visibled" :before-close="onBeforedClose" width="460px" custom-class="dialog-center apply_refund-dialog">
            <template #title>
                <div class="step-box">
                    <div class="step-item text-right active"> <span class="icon"><el-icon><List /></el-icon></span> 申请退款</div>
                    <div class="line"></div>
                    <div class="step-item" v-if="viewData.status == 5"><span class="icon"><el-icon><Checked /></el-icon></span>退款成功</div>
                    <div class="step-item active" v-if="viewData.status == 6"><span class="icon"><el-icon><Checked /></el-icon></span>退款成功</div>
                    <div class="step-item error" v-if="viewData.status == 7"><span class="icon"><el-icon><Failed /></el-icon></span>退款失败</div>
                </div>
            </template>
            <div class="card-box">
                <div style="color: #FF9F03; font-size:14px; display:flex; align-items:center;" v-if="viewData.status == 5"><el-icon class="el-icon--left" :size="20"><InfoFilled /></el-icon>申请退款</div>
                <div style="color: #3FCF43; font-size:14px; display:flex; align-items:center;" v-if="viewData.status == 6"><el-icon class="el-icon--left" :size="20"><SuccessFilled /></el-icon>退款成功</div>
                <div style="color: #F03860; font-size:14px; display:flex; align-items:center;" v-if="viewData.status == 7"><el-icon class="el-icon--left" :size="20"><CircleCloseFilled /></el-icon>拒绝退款</div>
                <div style="color: #9094A6; font-size: 14px; padding-top: 10px;" v-if="viewData.status == 5">{{viewData.refundDateTime || '-'}}</div>
                <div style="color: #9094A6; font-size: 14px; padding-top: 10px;" v-else>{{viewData.agreeRejectDateTime || '-'}}</div>
            </div>
            <div class="info-title">退款信息</div>
            <div class="card-box">
                <div class="descriptions-item">
                    <div class="descriptions-label">订单名称：</div>
                    <div class="descriptions-content">{{viewData.title}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="descriptions-label">订单编号：</div>
                    <div class="descriptions-content">{{viewData.orderNo}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="descriptions-label">退款金额：</div>
                    <div class="descriptions-content">{{viewData.partyAterminatesPrice}}<span style="width: 12px; height:12px;" class="background_icon-money"></span></div>
                </div>
                <div class="descriptions-item">
                    <div class="descriptions-label">退款原因：</div>
                    <div class="descriptions-content">{{viewData.terminationReason}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="descriptions-label">退款说明：</div>
                    <div class="descriptions-content">{{viewData.terminationContent}}</div>
                </div>
            </div>
            <template #footer>
                <template v-if="type == 1 && viewData.status == 5">
                    <el-button @click="handleUpdateStatus(7)" type="danger" style="border-radius: 8px;" :loading="loadingState == 7"  color="#F03860" plain v-if="viewData.status == 5">拒绝退款</el-button>
                    <el-button @click="handleUpdateStatus(6)" type="primary" style="border-radius: 8px;" :loading="loadingState == 6" color="#3468FE" v-if="viewData.status == 5">同意退款</el-button>
                </template>
                <el-button v-else type="primary" style="border-radius: 8px;" color="#3468FE" @click="onBeforedClose">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { updateOrderStatus } from "@/api/personnel/personnelConsole"
import { ElMessage } from 'element-plus';
const emits = ['onSubmit'];
const props = {
    type: { //0 是雇主 1是创作者
        type: Number,
        default: 0,
    }
}
const setup = (prop, { emit }) => {
    const visibled = ref(false);
    const viewData = ref({});
    const loadingState = ref(0);
    const onBeforedClose = (deno) => {
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    const handleUpdateStatus = (e)=>{
        const orderNo = viewData.value.orderNo;
        loadingState.value = e;
        updateOrderStatus({orderNo,status: e}).then(res=>{
            loadingState.value = 0;
            onBeforedClose();
            ElMessage.success('操作成功')
            emit('onSubmit',{orderNo,...res.data})
        }).catch(err=>{
            loadingState.value = 0;
        })
    }
    // 打开弹窗
    const open = (e) => {
        viewData.value = e;
        visibled.value = true;
    }
    return {
        open,
        viewData,
        visibled,
        loadingState,
        onBeforedClose,
        handleUpdateStatus,
    }
}
export default defineComponent({
    setup,
    props,
    emits
})
</script>
<style scoped lang="scss">
:deep(.el-dialog.apply_refund-dialog.dialog-center) {
    .el-dialog__body {
        padding: 10px 20px;
        .el-textarea__inner {
            --el-input-placeholder-color: #75767c;
        }
        .el-form-item__label {
            color: #17181e;
            font-size: 14px;
            font-weight: 600;
        }
    }
    .card-box{
        background: #F5F6F9;
        border-radius: 4px;
        border: 1px solid #EFEFEF;
        padding: 20px;
        .descriptions-item{
            font-size: 14px;
            color: #9094A6;
            margin-bottom: 10px;
            display: flex;
            align-items: stretch;
            &:last-child{
                margin-bottom: 0px;
            }
            .descriptions-label{
                flex: none;
            }
            .descriptions-content{
                flex: auto;
            }
        }
    }
    .info-title{
        font-weight: 500;
        color: #1C1D24;
        font-size: 14px;
        padding: 10px 0;
    }
}
.step-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .line{
        width: 30px;
        height: 1px;
        background: #C4C9D3;
        margin: 0 10px;
    }
    .step-item {
        width: 120px;
        color: #c4c9d3;
        font-size: 14px;
        font-weight: initial;
        display: flex;
        align-items: center;
        &.active{
            color: #1C1D24;
            .icon{
                color: #3468FE;
                background: rgba($color: #3468FE, $alpha: .1);
            }
        }
        &.error{
            color: #1C1D24;
            .icon{
                color: #F03860;
                background: rgba($color: #F03860, $alpha: .1);
            }
        }
        &.text-right{
            text-align: right;
            justify-content: flex-end;
        }
        .icon{
            width: 24px;
            height: 24px;
            border-radius: 20px;
            margin-right: 4px;
            background: rgba($color: #C4C9D3, $alpha: .1);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>