<template>
    <el-dialog v-model="visibled" width="500px" :before-close="onBeforeClose" title="充值余额退款" custom-class="dialog-center">
        <div class="apply-card">
            <div class="item">
                <div class="left">订单号</div>
                <div class="right">
                    <div>{{ refundData.orderNo }}</div>
                </div>
            </div>

            <div class="item">
                <div class="left">备注</div>
                <div class="right">
                    <div>{{ refundData.context || '-' }}</div>
                </div>
            </div>

            <div class="item">
                <div class="left">订单金额</div>
                <div class="right">
                    <div>{{ refundData.amount }}</div>
                </div>
            </div>

            <div class="item">
                <div class="left">支付时间</div>
                <div class="right">
                    <div>{{ refundData.createTime }}</div>
                </div>
            </div>

            <div class="item">
                <div class="left">退款金额</div>
                <div class="right">
                    <div>{{ getNumber(refundData.amount - (refundData.refundAmount ? refundData.refundAmount : 0)) }}</div>
                </div>
            </div>
            <div style="width: 100%;text-align: right;margin-top: 20px;color: red">退款为不可逆操作，退款金额将原路返回</div>
        </div>
        <template #footer>
            <span>
                <el-button size="large" style="border-radius: 8px;" @click="onBeforeClose">取消</el-button>
                <el-button size="large" style="border-radius: 8px;" color="#3468FE" type="primary" :loading="loadingSubmit" @click="handleSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { rechargeRefund } from "@/api/pay/pay";
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
const emits = ['onSubmit']
const setup = (prop,{emit}) => {
    const visibled = ref(false);
    const refundData = ref({});
    const loadingSubmit = ref(false);
    const onBeforeClose = (deno) => {
        if(loadingSubmit.value){return}
        if (typeof deno == 'function') {
            deno()
        } else {
            visibled.value = false
        }
    }
    const getNumber = (num) => {
        if (num < 0) {
            return 0
        } else {
            return num
        }
    }

    const handleSubmit = () => {
        loadingSubmit.value = true;
        const orderNo = refundData.value.orderNo;
        rechargeRefund({ orderNo }).then(res => {
            loadingSubmit.value = false;
            onBeforeClose();
            emit('onSubmit',refundData.value)
            ElMessage.success('申请退款成功');
        }).catch(err => {
            loadingSubmit.value = false;
        })
    }
    const open = (e) => {
        refundData.value = e
        visibled.value = true;
    }
    return {
        open,
        visibled,
        getNumber,
        refundData,
        handleSubmit,
        loadingSubmit,
        onBeforeClose,
    }
}
export default defineComponent({
    setup,
    emits
})
</script>
<style scoped lang="scss">
.apply-card {
    font-size: 14px;
    font-weight: 400;
    color: #4e5262;
    line-height: 21px;
    margin-top: 20px;

    .item {
        height: 50px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }

    .left {
        width: 100px;
        text-align: justify;
        text-align-last: justify;
        position: relative;
        padding-right: 16px;
        box-sizing: border-box;
        &::after {
            content: "：";
            position: absolute;
            display: inline-block;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        div {
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }

    .right {
        width: 60%;

        div {
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
        }
    }
}
</style>