<template>
    <div class="wrapper" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <!-- 头部导航 -->
        <el-breadcrumb separator=">" class="header">
            <el-breadcrumb-item :to="{ path: '/workspace/admin/goods' }">
                <span>订单管理</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span class="now-page">{{viewData?.title}}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 主区域 -->
        <el-scrollbar class="scroll-area" v-if="viewData">
            <div class="main">
                <!-- 左区域 -->
                <div class="m-left">
                    <div class="order-info">
                        <div class="info-body">
                            <div class="info-bottom">
                                <div class="order-name">{{viewData?.title}}</div>
                                <div class="time-line">
                                    <div>订单编号：{{viewData.orderNo}}</div>
                                    <div>订单发起日期：<span>{{viewData.createTime || '-'}}</span></div>
                                    <div>接单日期：<span>{{viewData.orderTime || '-'}}</span></div>
                                </div>
                            </div>
                            <div class="info-middle">
                                <div class="cash-line">
                                    <div class="cash-info">
                                        <span>订单金额：</span><span>{{viewData.price}}</span>
                                        <i class="icon-coin"></i>
                                    </div>
                                    <!-- 待验收展示倒计时 -->
                                    <template v-if="viewData.status == 3">
                                        <div style="font-size:14px;color: #c2c7ce;margin-left:23px;">自动验收倒计时：</div>
                                        <div class="done-time">
                                            <span>{{limitDay}}</span> 天 <span>{{limitHour}}</span> 时 <span>{{limitMin}}</span> 分
                                        </div>
                                    </template>
                                </div>
                                <div class="i-right" v-if="viewData.status == 1">
                                    <div class="validate-btn" @click="handleAcceptancePush">
                                        <i class="icon-ring"></i>
                                        <span>催一催</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="info-header">
                            <div class="i-left">
                                <el-avatar class="i-avt" :src="viewData.partyBavatar"></el-avatar>
                                <div>
                                    <div class="i-name">
                                        <div class="i-n-nickname">{{viewData.partyBnickName}}</div>
                                        <div class="i-n-msg" @click.stop="handleCath">
                                            <i class="icon-msg"></i>
                                            <div>联系</div>
                                        </div>
                                    </div>
                                    <div class="i-user">
                                        <span>{{viewData.partyBFullName || '-'}}</span>
                                        <span>|</span>
                                        <span>{{viewData.partyBmobile || '-'}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="order-status">
                                <div class="s-line">
                                    <span style="color:white;">订单状态：</span>
                                    <template v-if="!viewData.ifPay">
                                        <span class="org">待支付</span>
                                    </template>
                                    <template v-else>
                                        <span class="org" v-if="viewData.status === 0">待接单</span>
                                        <span class="gre" v-if="viewData.status === 1">进行中</span>
                                        <span class="org" v-if="viewData.status === 3">待验收</span>
                                        <span class="org" v-if="viewData.status === 9 && !viewData.ifComment">待评价</span>
                                        <span class="gre" v-if="viewData.status === 9 && viewData.ifComment">已完成</span>
                                        <span class="red" v-if="viewData.status === 2">已拒绝</span>
                                        <span class="red" v-if="viewData.status === 7">拒绝退款</span>
                                        <span v-if="viewData.status === 5">退款中</span>
                                        <span v-if="viewData.status === 4">已关闭</span>
                                        <span v-if="viewData.status === 6">已退款</span>
                                    </template>
                                </div>
                                <template v-if="!viewData.ifPay">
                                    <el-button type="primary" round color="#3468FE" @click="handleUploadState(0)">立即支付</el-button>
                                </template>
                                <!-- ifSupportApplyrefund: 是否可以申请退款 applyRefundCount: 申请退款次数 -->
                                <template v-else>
                                    <el-button type="primary" round color="#F03860" v-if="viewData.status == 0" @click="handleUploadState(4)">关闭订单</el-button>
                                    <el-button type="primary" round color="#3468FE" v-if="viewData.status == 1 && viewData.ifSupportApplyrefund" @click="handleUploadState(5)">申请退款</el-button>
                                    <el-button type="primary" round color="#3468FE" v-if="!viewData.ifSupportApplyrefund || (viewData.applyRefundCount > 0 && (viewData.status == 5 || viewData.status == 7))" @click="showDialog">平台介入</el-button>
                                    <el-button type="primary" round color="#3468FE" v-if="viewData.status == 3" @click="handleUploadState(5)">申请退款</el-button>
                                    <el-button type="primary" round color="#3468FE" v-if="viewData.status == 3" @click="handleUploadState(9)">确认验收</el-button>
                                    <el-button type="primary" round color="#3468FE" v-if="viewData.status == 7" @click="handleUploadState(8)">取消申请</el-button>
                                    <el-button type="primary" round color="#FF9F03" v-if="viewData.status == 5" @click="handleViewRefund">退款详情</el-button>
                                    <el-button type="primary" round color="#FF9F03" v-if="viewData.status == 6" @click="handleViewRefund">退款详情</el-button>
                                    <el-button type="primary" round color="#FF9F03" v-if="viewData.status == 7" @click="handleViewRefund">退款详情</el-button>
                                    <el-button type="primary" round color="#FF9F03" v-if="viewData.status === 9 && !viewData.ifComment" @click="handleOpenAssess">立即评价</el-button>
                                    <el-button type="primary" round color="#FF9F03" v-if="viewData.status === 9 && viewData.ifComment" @click="handleViewAssess">查看评价</el-button>
                                    <div class="countdown" v-if="viewData.status == 0">倒计时：{{downCount}}</div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div class="delivery-info" style="margin-bottom: 20px;">
                        <div class="d-header">
                            <div class="d-title">需求描述</div>
                        </div>
                        <div class="d-body">
                            <pre style="margin: 0 0 0px;">{{viewData.content}}</pre>
                        </div>
                    </div>

                    <div class="delivery-info" style="margin-bottom: 20px;" v-if="sourIdItems.length">
                        <div class="d-header">
                            <div class="d-title">需求附件</div>
                        </div>
                        <div class="d-body">
                            <template v-if="sourIdItems.length">
                                <div class="file" v-for="(item, index) in sourIdItems" :key="index">
                                    <div class="f-info">
                                        <div class="f-icon">
                                            <FileType :size="34" :type="item.fileCat"></FileType>
                                        </div>
                                        <div class="f-name">{{item.filename}}</div>
                                    </div>
                                    <div class="f-handle">
                                        <!-- <div @click.stop="handleViewFile(item)">查看</div> -->
                                        <div><a :href="item.downloadUrl">下载</a></div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="delivery-info">
                        <div class="d-header">
                            <div class="d-title">交付信息</div>
                            <!-- <div class="switch-row">
                                <div>开启水印</div>
                                <el-switch v-model="isWaterMark" active-color="#3468FE" inactive-color="#383B47" />
                            </div>
                            <el-button type="primary" color="#3468fe" @click="UploadFileRef.click()" :disabled="viewData.status === 0" round style="width: 100px">添加附件</el-button>
                            <input type="file" @change="handleUploadFile" ref="UploadFileRef" hidden /> -->
                        </div>
                        <div class="d-body">
                            <!-- 附件列表 -->
                            <template v-if="consignSourceIdItems.length">
                                <div class="file" v-for="(item, index) in consignSourceIdItems" :key="index">
                                    <div class="f-info">
                                        <div class="f-icon">
                                            <FileType :size="34" :type="item.fileCat"></FileType>
                                        </div>
                                        <div class="f-name">{{item.filename}}</div>
                                    </div>
                                    <div class="f-handle">
                                        <div @click.stop="handleViewFile(item)">查看</div>
                                        <div><a :href="item.downloadUrl">下载</a></div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <Empty description="暂无上传附件"></Empty>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- 右区域 -->
                <div class="m-right">
                    <div class="r-head">订单操作记录</div>
                    <div class="r-body">
                        <el-scrollbar style="margin: 0 -20px;" view-style="padding: 20px 20px 0; ">
                            <el-steps direction="vertical" :space="100" v-if="recordList.length">
                                <el-step v-for="(item, index) in recordList" :key="index">
                                    <template #icon>
                                        <el-avatar :src="viewData.partyBavatar" v-if="item.type == 1" :size="36"></el-avatar>
                                        <el-avatar :src="viewData.avatar" v-else :size="36"></el-avatar>
                                    </template>
                                    <template #description>
                                        <div class="r-desc">
                                            <div class="desc-txt">
                                                <span v-for="(val,i) in parseContent(item.content)" :key="i"> {{val}}</span>
                                            </div>
                                            <div class="desc-date">{{item.createTime}}</div>
                                        </div>
                                    </template>
                                </el-step>
                            </el-steps>
                            <template v-else>
                                <Empty description="暂无操作日志"></Empty>
                            </template>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <OrderDialog ref="OrderDialogRef" @onSubmit="handleSubmitPay"></OrderDialog>
    <ApplyRefund ref="ApplyRefundRef" @onSubmit="handleSubmitRefund"></ApplyRefund>
    <OrderAssess ref="OrderAssessRef" @onSubmit="handleSubmitAssess"></OrderAssess>
    <RefundDetail ref="RefundDetailRef"></RefundDetail>
    <OrderAssessRead ref="OrderAssessReadRef"></OrderAssessRead>
    <PlatformApply ref="PlatformApplyRef" :proposer="0" @onSubmit="getData"></PlatformApply>
</template>

<script setup>
import ApplyRefund from '../components/ApplyRefund'
import OrderAssess from '../components/OrderAssess'
import OrderDialog from '../components/OrderDialog'
import RefundDetail from '../components/RefundDetail'
import OrderAssessRead from '../components/OrderAssessRead'
import PlatformApply from '../components/PlatformApply'
import { getCurrentInstance, ref, nextTick } from 'vue'
import { ElMessage } from "element-plus";
import { handleUrgerush } from "@/api/personnel/recruitmentWall"
import { getRecordLogList, getOrderInfo, actionOperateOrder } from '@/api/personnel/personnelManage.js'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { timeCodeFormat } from "@/utils/tool";
import UploadFile from '@/utils/uploadFile';
import FileType from '@/components/FileType'

import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'


const route = useRoute();
const store = useStore();
const viewData = ref(null);
const recordList = ref([]);
const sourIdItems = ref([]);
const consignSourceIdItems = ref([]);
const isWaterMark = ref(false);
const loadingState = ref(false);

const OrderDialogRef = ref();
const ApplyRefundRef = ref();
const OrderAssessRef = ref();
const RefundDetailRef = ref();
const PlatformApplyRef = ref();
const OrderAssessReadRef = ref();

const UploadFileRef = ref();
const { proxy } = getCurrentInstance();
const parseContent = (value) => {
    try {
        const data = JSON.parse(value);
        return data;
    } catch (err) {
        return []
    }
}

// 监听IM订单通知回调
const handleChangeOrderStatus = ({noticeType,sourceData})=>{
    if(noticeType == 10&& sourceData.order?.orderNo == route.params.orderNo){
        getData();
    }
}
IM_EVENT_LISTERNER.addEventListenerIM('WORKER', handleChangeOrderStatus);
onUnmounted(()=>{
    IM_EVENT_LISTERNER.removeEventListenerIM('WORKER', handleChangeOrderStatus);
})



const downCount = computed(() => {
    const countdownEndTime = viewData.value.countdownEndTime;
    const countdownStartTime = viewData.value.countdownStartTime;
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

// 提交退款
const handleSubmitRefund = (e) => {
    nextTick(() => {
        getData()
    })
}
// 提交评价
const handleSubmitAssess = (e) => {
    nextTick(() => {
        getData()
    })
}
// 支付成功的回调
const handleSubmitPay = (e) => {
    loadingState.value = true
    setTimeout(() => {
        getData()
    }, 500)
}

// 查看退款详情
const handleViewRefund = () => {
    RefundDetailRef.value.open(viewData.value)
}
// 打开评价
const handleOpenAssess = () => {
    OrderAssessRef.value.open(viewData.value)
}
// 查看评价
const handleViewAssess = () => {
    OrderAssessReadRef.value.open(viewData.value)
}

// 联系
const handleCath = () => {
    const userId = viewData.value.recipientUserId;
    proxy.$sessionBox.openDialog({ userId })
}

// 催一催
const handleAcceptancePush = () => {
    const userId = viewData.value.recipientUserId;
    const orderNo = viewData.value.orderNo;
    handleUrgerush({ userId, orderNo, msg: '' }).then(res => {
        ElMessage.success('已发送消息提醒创作者加快进度')
    })
}

// 申请平台介入
const showDialog = ()=> {
    PlatformApplyRef.value.open(viewData.value) 
}

// 更新状态
const handleUploadState = (status) => {
    const orderNo = viewData.value.orderNo; //订单号
    const price = viewData.value.price;   //金额
    const order = viewData.value.payOrderNo;   //支付订单号
    switch (status) {
        case 0:
            OrderDialogRef.value.open({ order, price })
            break;
        case 4:
            proxy.$modal.confirm({
                title: '关闭订单',
                content: '确定关闭这笔订单吗？',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        actionOperateOrder({ orderNo, status }).then(res => {
                            done();
                            viewData.value = Object.assign(viewData.value, res.data);
                            getRecordData();
                        }).catch(err => {
                            done();
                        })
                    } else {
                        if (instance.confirmButtonLoading) { return }
                        done()
                    }
                }
            })
            break;
        case 5:
            if (!viewData.value.ifSupportApplyrefund) {
                return ElMessage.warning('已超过申请退款的次数，请尝试平台介入解决')
            }
            ApplyRefundRef.value.open(viewData.value);
            break;
        case 8:
            loadingState.value = true;
            actionOperateOrder({ orderNo, status }).then(res => {
                loadingState.value = false;
                viewData.value = Object.assign(viewData.value, res.data);
                getRecordData();
            }).catch(err => {
                loadingState.value = false;
            })
            break;
        case 9: //确认收货
            proxy.$modal.confirm({
                title: '确认验收',
                content: '订单确认验收后账款将会进入对方账户，确定验收完成吗?',
                beforeClose(action, instance, done) {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        actionOperateOrder({ orderNo, status }).then(res => {
                            viewData.value = Object.assign(viewData.value, res.data);
                            getRecordData();
                            ElMessage.success('操作成功')
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
            break;
    }
}

const getData = () => {
    loadingState.value = true;
    const orderNo = route.params.orderNo;
    Promise.all([getRecordLogList({ orderNo }), getOrderInfo({ orderNo })]).then(res => {
        recordList.value = res[0].rows;
        viewData.value = res[1].data;
        sourIdItems.value = res[1].data.sourIdItems;
        consignSourceIdItems.value = res[1].data.consignSourceIdItems;
        loadingState.value = false;
    }).catch(err => {
        loadingState.value = false;
    })
}
getData();

const checkCountDown = ref('')
const limitDay = ref('0') // day
const limitHour = ref('0') // hour
const limitMin = ref('0') // min
const countTimmer = ref()
// 订单倒计时处理
const checkCounting = (startDate, endDate) => {
    let dif = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000 // 秒
    if (dif < 0) {
        return
    }

    let timeArr = []
    countTimmer.value = setInterval(() => {
        checkCountDown.value = timeCodeFormat(dif)
        timeArr = checkCountDown.value.split(':')

        limitDay.value = Math.floor(timeArr[0]/24) // 小时换算天数
        limitHour.value = limitDay.value > 0 ? hourHandler(timeArr[0]).toFixed(0) : timeArr[0] 
        limitMin.value = timeArr[1]
        dif -= 1
        if (dif < 0 ) {
            clearInterval(countTimmer.value)
            getData()
        }
    }, 1000)
}


/**
 * @description 小时处理，例30h = 1.25day = 1天6小时，取6小时
 * @param {Number} t 总时
 */
const hourHandler = (t)=> {
    // 取小数点后3位, 例1.2356 取 0.236
    let timeString = (Number(`0.${(t / 24).toString().split('.')[1]}`).toFixed(3)*24) || 0
    return timeString
}

// 监听订单状态
watch(()=>viewData.value?.status, (val)=> {
    // 待验收状态
    if (val == 3) {
        let systemTime = viewData.value.systemTime
        let checkEndDate = viewData.value?.threeDaysAfter || ''
        // 72h自动验收倒计时
        clearInterval(countTimmer.value)
        checkCounting(systemTime, checkEndDate)
    }
})

const getRecordData = () => {
    const orderNo = route.params.orderNo;
    getRecordLogList({ orderNo }).then(res => {
        recordList.value = res.rows;
    })
}

// 查看文件
const handleViewFile = (e) => {
    proxy.$viewFile.open({
        current: 0,
        fileList: [e]
    })
}

onUnmounted(()=>{
    clearInterval(countTimmer.value)
}) 
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>