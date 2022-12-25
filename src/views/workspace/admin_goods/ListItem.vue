<template>
    <div class="list-item vertical-center" :title="'订单号：'+itemData.orderNo" @click.stop="handleViewOrder">
        <div class="creator" style="flex:3; padding-left:20px;">
            <el-avatar :src="itemData.avatar" @click.stop="handleToDetail" class="c-avatar"></el-avatar>
            <div class="c-info" @click.stop="handleToDetail">
                <p class="c-desc">{{itemData.nickName}}</p>
                <div class="row c-sub-info">
                    <p>最近成交: {{itemData.tradeNum || '-'}}</p>
                    <p>雇主评分: {{itemData.score  || '-'}}</p>
                </div>
            </div>
            <div class="c-contact">
                <div class="row" @click.stop="handleCath">
                    <i class="icon-msg"></i>
                    <p>联系</p>
                </div>
            </div>
        </div>
        <div class="title-box" style="flex:2; padding-left:20px;">
            <!-- <div>订单号：{{itemData.orderNo}}</div> -->
            <div class="work-tag">{{itemData.categoryTitle}}</div>
            <div class="order-title">{{itemData.title}}</div>
        </div>
        <div class="cash vertical-center" style="flex:1; padding-left:20px;">
            <div class="row">
                <p>{{itemData.price}}</p>
                <i class="icon-coin"></i>
            </div>
        </div>
        <div class="date vertical-center" style="flex:1; padding-left:20px;">{{itemData.orderTime || '-'}}</div>
        <div class="date vertical-center" style="flex:1; padding-left:20px;">{{itemData.deliveryCompletionTime || '-'}}</div>
        <div class="status vertical-center" style="flex:1; padding-left:20px;">
            <!-- 0已发布（待乙方接收） 1乙方已接受（订单进行中） 2乙方拒绝 3已完成 4甲方取消订单 5订单进行中甲方取消订单 6已关闭（甲乙双方都确认取消订单）7 乙方拒绝中止订单 -->
            <template v-if="!itemData.ifPay">
                <span class="org">待支付</span>
            </template>
            <template v-else>
                <span class="org" v-if="itemData.status === 0 && itemData.ifPay === 1">待接单</span>
                <span class="gre" v-if="itemData.status === 1">进行中</span>
                <span class="org" v-if="itemData.status === 3">待验收</span>
                <span class="org" v-if="itemData.status === 9 && itemData.ifComment === 0">待评价</span>
                <span v-if="itemData.status === 9 && itemData.ifComment === 1">已完成</span>
                <span class="red" v-if="itemData.status === 2">已拒绝</span>
                <span class="red" v-if="itemData.status === 7">拒绝退款</span>
                <span v-if="itemData.status === 5">退款中</span>
                <span v-if="itemData.status === 4">已关闭</span>
                <span v-if="itemData.status === 6">已退款</span>
            </template>
        </div>
        <div class="btn vertical-center" style="flex:1;">
            <template v-if="!itemData.ifPay">
                <el-button type="primary" color="#3468FE" round style="width: 90px;" @click.stop="handlePay">立即支付</el-button>
            </template>
            <template v-else>
                <el-button type="primary" color="#3468FE" round style="width: 90px;" v-if="itemData.status === 0 && itemData.ifPay === 1" @click.stop="handleCancelOrder">关闭订单</el-button>
                <el-button type="primary" color="#3468FE" round style="width: 90px;" v-if="itemData.status === 1" @click.stop="handleViewOrder">查看详情</el-button>
                <el-button type="primary" color="#3468FE" round style="width: 90px;" v-if="itemData.status === 3" @click.stop="handleCompleteOrder">确认验收</el-button>
                <el-button type="primary" color="#3468FE" round style="width: 90px;" v-if="itemData.status === 5" @click.stop="handleViewRefund">退款详情</el-button>
                <el-button type="primary" color="#3468FE" round style="width: 90px;" v-if="itemData.status === 9 && itemData.ifComment === 0" @click.stop="handleAppraise">立即评价</el-button>
                <el-button type="primary" color="#FF9F03" round style="width: 90px;" v-if="itemData.status === 9 && itemData.ifComment === 1" @click.stop="emits('onReadAssess')">查看评价</el-button>
                <el-button type="primary" color="#3468FE" round style="width: 90px;" v-if="itemData.status === 7" @click.stop="handleViewRefund">退款详情</el-button>
                <el-button type="primary" color="#3468FE" round style="width: 90px;" v-if="itemData.status === 2 || itemData.status === 4 || itemData.status === 6" @click.stop="handleDeleteOrder">删除订单
                </el-button>
            </template>
            <!-- <p class="btn-info" v-if="itemData.status === 0 && downCount">倒计时: {{downCount}}</p> -->
        </div>
        <span class="actions-other" v-contextmenu:ContentmenuRef="{trigger:'click'}">
            <svg-icon iconClass="icon_edit_vertical" className="primary disabled" :size="20"></svg-icon>
        </span>
    </div>
    <v-contextmenu ref="ContentmenuRef">
        <v-contextmenu-item @click="handleViewOrder">查看详情</v-contextmenu-item>
        <v-contextmenu-item @click="handlRefund" v-if="itemData.status === 1">申请退款</v-contextmenu-item>
        <v-contextmenu-item @click="handleCancelRefund" v-if="itemData.status === 7">取消退款</v-contextmenu-item>
        <v-contextmenu-item @click="handleViewRefund" v-if="itemData.status === 6 ">退款详情</v-contextmenu-item>
        <v-contextmenu-item @click="handleDeleteOrder" v-if="itemData.ifPay === 0">删除订单</v-contextmenu-item>
        <v-contextmenu-item @click="emits('onPlatformApply')" v-if="itemData.status === 7">平台介入</v-contextmenu-item>
    </v-contextmenu>
</template>
<script setup>
import { computed, getCurrentInstance } from "@vue/runtime-core";
import { actionOperateOrder, delOperateOrder } from "@/api/personnel/personnelManage";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const props = defineProps({
    itemData: {
        type: Object,
        default() {
            return {}
        }
    },
    loading: {
        type: Boolean,
        default: false
    },
})
const emits = defineEmits(['update:loading', 'onDelete', 'onRrefund', 'onAssess', 'onViewRefund', 'onReadAssess', 'onPay','onPlatformApply']);
const { proxy } = getCurrentInstance();
const router = useRouter();
const ContentmenuRef = ref();
const downCount = computed(() => {
    const countdownEndTime = props.itemData.countdownEndTime;
    const countdownStartTime = props.itemData.countdownStartTime;
    if (countdownEndTime && countdownStartTime) {
        const dif = countdownEndTime - countdownStartTime;
        if (dif > 0) {
            const house = Math.ceil(dif / (60 * 60 * 1000));
            if (house > 1) {
                return `${house}小时`;
            } else {
                const minute = Math.ceil(dif / (60 * 1000));
                return `${minute}分钟`;
            }
        } else {
            return 0;
        }
    } else {
        return 0;
    }
});

// 联系
const handleCath = () => {
    const userId = props.itemData.recipientUserId;
    proxy.$sessionBox.openDialog({ userId })
}

// 前往工种详情
const handleToDetail = ()=>{
    const userAuthenticateId =  props.itemData.userAuthenticateId
    router.push({path:`/workspace/work/${userAuthenticateId}`})
}

/**
 * ***************************************************************************
 * 订单操作
 * ***************************************************************************
*/
const handleLoading = (e) => {
    emits('update:loading', e)
}
// 更新状态
const handleUpdateStatus = (e) => {
    props.itemData.status = e;
}
// 支付
const handlePay = () => {
    emits('onPay')
}
// 关闭订单
const handleCancelOrder = () => {
    const orderNo = props.itemData.orderNo;
    const status = 4;
    proxy.$modal.confirm({
        title: '关闭订单',
        content: '订单关闭后金额会退回您的账户,确定关闭吗?',
        beforeClose(action, instance, done) {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                actionOperateOrder({ orderNo, status }).then(res => {
                    handleUpdateStatus(res.data.status)
                    done();
                }).catch(err => {
                    done();
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    }).then(res => { }).catch(err => { })
}
// 完成订单
const handleCompleteOrder = () => {
    const orderNo = props.itemData.orderNo;
    const status = 9;
    proxy.$modal.confirm({
        title: '完成订单',
        content: '订单完成后账款将会进入对方账户，确定完成吗?',
        beforeClose(action, instance, done) {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                actionOperateOrder({ orderNo, status }).then(res => {
                    handleUpdateStatus(res.data.status)
                    ElMessage.success('验收成功')
                    done();
                }).catch(err => {
                    done();
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    }).then(res => { }).catch(err => { })
}
// 订单详情
const handleViewOrder = () => {
    const orderNo = props.itemData.orderNo;
    router.push({ path: `/workspace/admin/goods_detail/${orderNo}` })
}
// 退款详情
const handleViewRefund = () => {
    emits('onViewRefund')
}
// 立即评价
const handleAppraise = () => {
    emits('onAssess', props.itemData);
}
// 删除订单
const handleDeleteOrder = () => {
    const orderNo = props.itemData.orderNo;
    proxy.$modal.confirm({
        title: '删除订单',
        content: '删除后订单将无法找回,确定删除吗?',
        beforeClose(action, instance, done) {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                delOperateOrder({ orderNo }).then(res => {
                    emits('onDelete', orderNo);
                    ElMessage.success('删除成功')
                    done();
                }).catch(err => {
                    done();
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    }).then(res => { }).catch(err => { })
}
// 申请退款
const handlRefund = () => {
    emits('onRrefund', props.itemData);
}
// 取消申请
const handleCancelRefund = () => {
    const orderNo = props.itemData.orderNo;
    const status = 8;
    handleLoading(true);
    actionOperateOrder({ orderNo, status }).then(res => {
        handleLoading(false);
        handleUpdateStatus(res.data.status)
    }).catch(err => {
        handleLoading(false);
    })
}

</script>
<style scoped lang="scss">
.list-item {
    height: 85px;
    // background: #24262F;
    background: #181920;
    border-radius: 10px;
    margin-bottom: 5px;
    &:hover {
        background: #24262f;
    }
    .status {
        color: #9094a6;
        .org {
            color: #f88212;
        }
        .gre {
            color: #0da411;
        }
        .red {
            color: #e91e19;
        }
    }
    .actions-other {
        margin-right: 10px;
        cursor: pointer;
        color: #979797;
        &:hover {
            color: white;
        }
    }
    .creator {
        display: flex;
        align-items: center;

        .c-avatar {
            margin-right: 9px;
            border-radius: 50%;
            width: 57px;
            height: 57px;
            // background: pink;
        }
        .c-info {
            .c-desc {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 10px;
                color: #ffffff;
                max-width: 160px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .c-sub-info {
                font-size: 12px;
                font-weight: 400;
                color: #9094a6;
                p:last-child {
                    margin-left: 14px;
                }
            }
        }
        .c-contact {
            padding: 5px 10px;
            border-radius: 7px;
            margin: 0 0 25px 11px;
            background: #1d294c;
            cursor: pointer;
            .icon-msg {
                background-image: url("@/assets/icons/icon_msg.png");
                background-size: 100%;
                width: 16px;
                height: 16px;
            }
            p {
                margin-left: 5px;
                font-size: 12px;
                font-weight: 400;
                color: #3468fe;
            }
        }
    }
    .title-box {
        font-size: 14px;
        font-weight: 400;
        color: #8d91a3;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .work-tag{
            display: inline-block;
            padding: 0 12px;
            min-width: 56px;
            height: 24px;
            text-align: center;
            flex: none;
            line-height: 24px;
            background: #30323b;
            border-radius: 4px;
            color: #E1E1E1;
        }
        .order-title{
            width: 100%;
            overflow: hidden;
            margin-top: 4px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .cash {
        p {
            font-size: 16px;
            font-weight: 500;
            color: #c0c0c0;
        }
        .icon-coin {
            background-image: url("@/assets/icons/icon_money.png");
            background-size: 100%;
            width: 12px;
            height: 12px;
            margin: 3px 0 0 2px;
        }
    }
    .date {
        font-size: 16px;
        font-weight: 400;
        color: #8d91a3;
    }
    .btn {
        position: relative;
        flex-direction: column;
        justify-content: center;
        .btn-click {
            width: 91px;
            height: 34px;
            line-height: 34px;
            border-radius: 17px;
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            text-align: center;
            background: #3468fe;
            &:hover {
                background: #4e77f0;
            }
        }
        .btn-info {
            position: absolute;
            top: 40px;
            font-size: 12px;
            font-weight: 400;
            color: #3468fe;
        }
    }
}
.row {
    display: flex;
    flex-direction: row;
}
.vertical-center {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}
</style>
