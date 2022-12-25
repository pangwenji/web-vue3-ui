<template>
    <div class="wrapper" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <!-- 头部导航 -->
        <div class="recruit-top">
            <div class="left">
                <span class="tab" :class="{ 'active-tab': params.status === item.id  }" v-for="(item, index) in tabListShow" :key="index" @click="handleChangMain(item.id)">
                    {{ item.title }}
                </span>
            </div>

            <div class="right">
                <el-select v-model="optValue" @change="dropDownHandler" placeholder="更多状态" size="large" class="select-ipt">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>

                <el-input :input-style="inputStyle" v-model="params.title" placeholder="搜索订单标题" @change="searchChange">
                    <template #suffix>
                        <svg-icon iconClass="recruit_search" :size="24"></svg-icon>
                    </template>
                </el-input>
            </div>
        </div>

        <div class="table-area">
            <!-- 标题栏 -->
            <div class="title-bar">
                <div style="flex:3; padding-left:20px;">创作者</div>
                <div style="flex:2; padding-left:20px;">订单标题</div>
                <div style="flex:1; padding-left:20px;">订单金额</div>
                <div style="flex:1; padding-left:20px;">开始日期</div>
                <div style="flex:1; padding-left:20px;">交付截止</div>
                <div style="flex:1; padding-left:20px;">订单状态</div>
                <div style="flex:1; margin-right: 30px;">操作</div>
            </div>
            <el-scrollbar style="margin: 0 -20px; height: 100%;" view-style="min-height:100%; position:relative; padding: 0 20px 46px;">
                <!-- 列表展示 -->
                <template v-if="tableData.length">
                    <template v-for="(item,index) in tableData" :key="index">
                        <ListItem :itemData="item" @onRrefund="ApplyRefundRef.open(item)" @onPay="handlePayOrder(item)" @onDelete="handleDelete" @onReadAssess="OrderAssessReadRef.open(item)"
                            @onViewRefund="RefundDetailRef.open(item)" @onPlatformApply="PlatformApplyRef.open(item)" @onAssess="OrderAssessRef.open(item)" v-model:loading="loadingState"></ListItem>
                    </template>
                </template>
                <template v-else-if="!loadingState">
                    <Empty description="暂无更多数据"></Empty>
                </template>
                <Pagination :total="params.total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
            </el-scrollbar>
        </div>
    </div>
    <OrderDialog ref="OrderDialogRef" @onSubmit="handleSubmitPay"></OrderDialog>
    <RefundDetail ref="RefundDetailRef"></RefundDetail>
    <ApplyRefund ref="ApplyRefundRef" @onSubmit="handleSubmitRefund"></ApplyRefund>
    <OrderAssess ref="OrderAssessRef" @onSubmit="handleSubmitAssess"></OrderAssess>
    <PlatformApply ref="PlatformApplyRef"></PlatformApply>
    <OrderAssessRead ref="OrderAssessReadRef"></OrderAssessRead>
</template>

<script setup>
import OrderDialog from '../components/OrderDialog'
import ApplyRefund from '../components/ApplyRefund'
import OrderAssess from '../components/OrderAssess'
import RefundDetail from '../components/RefundDetail'
import PlatformApply from '../components/PlatformApply'
import OrderAssessRead from '../components/OrderAssessRead'
import { reactive, ref } from 'vue'
import { getOrderList } from '@/api/personnel/personnelManage.js'
import ListItem from './ListItem.vue'
const OrderDialogRef = ref();
const ApplyRefundRef = ref();
const OrderAssessRef = ref();
const RefundDetailRef = ref();
const PlatformApplyRef = ref();
const OrderAssessReadRef = ref();
const inputStyle = {
    width: '200px',
    height: '36px',
    lineHeight: '36px',
    color: '#ffffff',
    background: '#24262F',
    borderRadius: '20px'
}
const optValue = ref();
const options = [
    { label: '已完成', value: 13 },
    { label: '已拒绝', value: 2 },
    { label: '退款中', value: 5 },
    { label: '已退款', value: 6 },
    { label: '拒绝退款', value: 7 },
    { label: '已关闭', value: 4 },
]

const tabListShow = [
    { title: '全部', id: -1 },
    { title: '待支付', id: 11 },
    { title: '待接单', id: 99 },
    { title: '进行中', id: 1 },
    { title: '待验收', id: 3 },
    { title: '待评价', id: 12 },
]
const selection = ref('') // 筛选条件
const tableData = ref([]);
const loadingState = ref(false);
const params = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    status: -1,
    title: '',
})
function getList() {
    loadingState.value = true;
    tableData.value = [];
    getOrderList(params).then(res => {
        loadingState.value = false;
        tableData.value = res.rows;
        params.total = res.total;
    }).catch(err => {
        loadingState.value = false;
    })
}
getList()


const handlePayOrder = (item) => {
    OrderDialogRef.value.open({ 
        order: item.payOrderNo, 
        price: item.price,
        confirm(){
            getList()
            return Promise.resolve();
        }
    })
}

// 申请退款提交
const handleSubmitRefund = (e) => {
    tableData.value = tableData.value.map(item => {
        if (e.orderNo == item.orderNo) {
            item.status = e.status;
            item.updateTime = e.updateTime;
            item.partyAterminatesPrice = e.price
            item.terminationReason = e.terminationReason
            item.terminationContent = e.terminationContent
        }
        return item;
    })
}
// 支付成功的回调
const handleSubmitPay = (e) => {
    getList()
}
// 评价提交
const handleSubmitAssess = (e) => {
    tableData.value = tableData.value.map(item => {
        if (e.orderNo == item.orderNo) {
            item.ifComment = 1;
            item.commentContent = e.content;
            item.speedworkScore = e.speedworkScore;
            item.finishQualityScore = e.finishQualityScore;
            item.serviceAttitudeScore = e.serviceAttitudeScore;
        }
        return item;
    })
}
const handleDelete = () => {
    getList()
}
// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
    params.pageNum = page;
    params.pageSize = limit;
    getList();
}

// 切换标签
function handleChangMain(id) {
    params.status = id;
    params.pageNum = 1;
    optValue.value = ''
    getList();
}
// 下拉筛选
function dropDownHandler(e) {
    params.status = e;
    params.pageNum = 1;
    getList();
}


function searchChange() {
    params.pageNum = 1;
    getList();
}

</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    // [-- 顶栏 START
    .recruit-top {
        width: 100%;
        height: 68px;
        padding: 0 20px;
        display: flex;
        flex: none;
        justify-content: space-between;
        align-items: center;

        .left {
            .tab {
                display: inline-block;
                margin-right: 52px;
                font-size: 16px;
                color: #8d91a3;
                &:hover {
                    color: #ffffff;
                    cursor: pointer;
                }
            }
            .active-tab {
                height: 25px;
                line-height: 25px;
                color: #ffffff;
                font-size: 18px;
                font-weight: 500;
                position: relative;
                flex: 0 0 auto;
                &::after {
                    content: "";
                    width: 100%;
                    height: 4px;
                    border-radius: 2px;
                    background: linear-gradient(
                        42deg,
                        #0459ff 0%,
                        #5726dd 100%
                    );
                    position: absolute;
                    left: 0;
                    bottom: -8px;
                }
            }
        }

        .right {
            .select-ipt {
                margin-right: 25px;
                :deep(.el-input__inner) {
                    width: 207px;
                    height: 34px;
                    border-radius: 100px;
                    border: 1px solid #3d3f50;
                    background-color: #0a0b0d;
                }
            }
            :deep(.el-input__inner) {
                box-shadow: none;
                border: none;
            }
        }
    }
    // --  顶栏 END ]

    .table-area {
        width: 100%;
        padding: 0 20px;
        flex: auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        .pagination-container-box {
            position: absolute;
            width: 100%;
            bottom: 10px;
            left: 0;
        }
        // [-- 标题栏 START
        .title-bar {
            width: 100%;
            flex: none;
            display: flex;
            align-items: center;
            margin-bottom: 9px;
            height: 60px;
            border-radius: 10px;
            opacity: 0.51;
            font-size: 14px;
            font-weight: 400;
            background: #1c1d24;
            color: #8d91a3;
            div:last-child {
                text-align: center;
            }
        }
        // --  标题栏 END ]
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

:deep(.el-input__suffix) {
    display: flex;
    align-items: center;
}
:deep(.el-input__inner::placeholder) {
    color: #676c7f;
}
:deep(.el-input__inner::-webkit-input-placeholder) {
    color: #676c7f;
}
:deep(.el-input__inner:-moz-placeholder) {
    color: #676c7f;
}
:deep(.el-input__inner:-ms-input-placeholder) {
    color: #676c7f;
}
</style>