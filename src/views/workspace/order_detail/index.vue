<template>
    <div class="wrapper" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <!-- 头部导航 -->
        <el-breadcrumb separator=">" class="header">
            <el-breadcrumb-item :to="{ path: '/workspace/admin/order' }">
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
                                <div class="i-right">
                                    <div class="validate-btn" @click="handleAcceptancePush" v-if="viewData.status == 3">
                                        <i class="icon-ring"></i>
                                        <span>提醒验收</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="info-header">
                            <div class="i-left">
                                <el-avatar class="i-avt" :src="viewData.avatar"></el-avatar>
                                <div>
                                    <div class="i-name">
                                        <div class="i-n-nickname">{{viewData.nickName}}</div>
                                        <div class="i-n-msg" @click.stop="handleCath">
                                            <i class="icon-msg"></i>
                                            <div>联系</div>
                                        </div>
                                    </div>
                                    <div class="i-user">
                                        <span>{{viewData.fullName || '-'}}</span>
                                        <span>|</span>
                                        <span>{{viewData.mobeil || '-'}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="order-status">
                                <div class="s-line">
                                    <span style="color:white;">订单状态：</span>
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
                                </div>
                                <el-button type="primary" round color="#F03860" v-if="viewData.status == 0" @click="handleUploadState(2)">拒绝接单</el-button>
                                <el-button type="primary" round color="#3468FE" v-if="viewData.status == 0" @click="handleUploadState(1)">接受订单</el-button>
                                <el-button type="primary" round color="#3468FE" v-if="viewData.status == 1" @click="handleUploadState(3)">确认交付</el-button>
                                <el-button type="primary" round color="#3468FE" v-if="viewData.status == 5 || viewData.status == 3" @click="showDialog">平台介入</el-button>
                                <el-button type="primary" round color="#3468FE" v-if="viewData.status == 5" @click="handleUploadState(6)">同意退款</el-button>
                                <el-button type="primary" round color="#F03860" v-if="viewData.status == 5" @click="handleUploadState(7)">拒绝退款</el-button>
                                <el-button type="primary" round color="#FF9F03" v-if="viewData.status == 5" @click="handleViewRefund">退款详情</el-button>
                                <el-button type="primary" round color="#FF9F03" v-if="viewData.status == 7" @click="handleViewRefund">退款详情</el-button>
                                <el-button type="primary" round color="#FF9F03" v-if="viewData.status == 6" @click="handleViewRefund">退款详情</el-button>
                                <el-button type="primary" round color="#FF9F03" v-if="viewData.status === 9 && viewData.ifComment" @click="handleViewAssess">查看评价</el-button>
                                <div class="countdown" v-if="viewData.status == 0 && countdown">倒计时：{{countdown}}</div>
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
                                        <div @click.stop="handleViewFile(item)">查看</div>
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
                                <el-switch v-model="isWaterMark" :loading="loadingSwitch" :before-change="onBeforeChange" :disabled="viewData.status === 0 || viewData.status === 2" active-color="#3468FE" inactive-color="#383B47" />
                            </div> -->
                            <el-button type="primary" color="#3468fe" @click="UploadFileRef.click()" :disabled="viewData.status === 0 || viewData.status === 2" round style="width: 100px">需求交付</el-button>
                            <input type="file" @change="handleUploadFile" multiple ref="UploadFileRef" hidden />
                        </div>
                        <div class="d-body" @dragover.prevent="move" style="min-height: 321px; overflow: hidden;">
                            <DragUpload ref="dragRef" @onDrop="handleDrop"></DragUpload>
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
                                        <div v-if="item.preview" @click.stop="handleViewFile(item)">预览</div>
                                        <div  class="disabled" v-else>预览</div>
                                        <div v-show="viewData.status == 1" @click.stop="handleDeleteFile(item)">删除</div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <Empty description="暂无上传附件，可拖拽文件至此上传"></Empty>
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
    <RefundDetail ref="RefundDetailRef" :type="1" @onSubmit="handleSubmitRefund"></RefundDetail>
    <OrderAssessRead ref="OrderAssessReadRef"></OrderAssessRead>
    <RejectRefundDialog ref="RejectRefundDialogRef"  @onSubmit="getData"></RejectRefundDialog>
    <PlatformApply ref="PlatformApplyRef" :proposer="1" @onSubmit="getData"></PlatformApply>
</template>

<script setup>
import RefundDetail from '../components/RefundDetail'
import OrderAssessRead from '../components/OrderAssessRead'
import RejectRefundDialog from '../components/RejectRefundDialog'
import PlatformApply from '../components/PlatformApply'
import { getCurrentInstance, ref, nextTick, onUnmounted } from 'vue'
import { createUploadSign } from '@/api/personnel/file'
import { getOrderInfo, uploadConsignFile, orderWaterMark ,updateOrderStatus, deleteConsignFile } from "@/api/personnel/personnelConsole"
import { getRecordLogList } from '@/api/personnel/personnelManage.js'
import { acceptancePush } from '@/api/personnel/recruitmentWall.js'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import UploadFile from '@/utils/uploadFile';
import { secondToDate, timeCodeFormat } from "@/utils/tool";
import FileType from '@/components/FileType'
import { ElMessage } from 'element-plus'
import DragUpload from '@/components/DragUpload_1.1';

import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
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

const route = useRoute();
const store = useStore();
const viewData = ref(null);
const recordList = ref([]);
const sourIdItems = ref([]);
const consignSourceIdItems = ref([]);
const isWaterMark = ref(false);
const loadingState = ref(false);
const RefundDetailRef = ref();
const PlatformApplyRef = ref();
const OrderAssessReadRef = ref();
const RejectRefundDialogRef = ref()
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

const dragRef = ref()
const move = ()=> {
    dragRef.value.visible = true
}

const handleDrop = (files)=>{
    for(const entry of files){
        const webkitGetAsEntry = entry.webkitGetAsEntry ? entry.webkitGetAsEntry() : entry;
        if(webkitGetAsEntry.isFile){
            webkitGetAsEntry.file(async File=>{
                if(File.size <= 1024 * 1024 * 1024){
                    const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: createUploadFileFun });
                    uploadData.on('success', uploadSuccess)
                    store.commit('upload/addFileList', uploadData)
                }else{
                    ElMessage.success('单个文件大小不能超过1G')
                }
            },err=>{console.log('文件错误',err)})
        }else{
            const reader = webkitGetAsEntry.createReader();
            reader.readEntries(entries=>{
                if(entries.length > 0){
                    handleDrop(entries);
                }
            },err=>{console.log('目录错误',err)})
        }
    }
}


// 提交退款
const handleSubmitRefund = () => {
    nextTick(()=> {
        getData()
    })
}

// 查看退款详情
const handleViewRefund = () => {
    RefundDetailRef.value.open(viewData.value)
}
// 查看评价
const handleViewAssess = () => {
    OrderAssessReadRef.value.open(viewData.value)
}
// 提醒验收
const handleAcceptancePush = () => {
    const orderNo = viewData.value.orderNo;
    const userId = viewData.value.initiatorUserId;
    acceptancePush({ userId,orderNo ,msg: '' }).then(res => {
        ElMessage.success('已发送消息提醒雇主验收')
    })
}
// 申请平台介入
const showDialog = ()=> {
    PlatformApplyRef.value.open(viewData.value)
}

// 设置水印
const loadingSwitch = ref(false);
const onBeforeChange = ()=>{
    return new Promise((resolve,reject)=>{
        loadingSwitch.value = true;
        const orderNo = viewData.value.orderNo;
        const watermark = isWaterMark.value? 0:1;
        orderWaterMark({orderNo,watermark}).then(res=>{
            loadingSwitch.value = false;
            isWaterMark.value = watermark == 1;
            resolve();
        }).catch(err=>{
            loadingSwitch.value = false;
            reject()
        })
    })
}

const getModalTitle = (status) => {
    switch (status) {
        case 1:
            return '接受订单'
        case 2:
            return '拒绝订单'
        case 3:
            return '确认交付'
        case 6:
            return '同意退款'
        case 7:
            return '拒绝退款'
    }
}
const getModalContent = (status) => {
    switch (status) {
        case 1:
            return '确定接受这笔订单吗？'
        case 2:
            return '确定拒绝这笔订单吗？'
        case 3:
            return '请确认完成订单任务并上传交付信息，确定交付吗？'
        case 6:
            return '确认同意退款吗？'
        case 7:
            return '确认拒绝退款吗？'
    }
}


// 更新状态
const handleUploadState = (status) => {
    const orderNo = viewData.value.orderNo;
    if (status == 1) {
        loadingState.value = true;
        updateOrderStatus({ orderNo, status }).then(res => {
            loadingState.value = false;
            viewData.value = Object.assign(viewData.value, res.data);
            getRecordData();
        }).catch(err => {
            loadingState.value = false;
        })
    } else if(status == 2){
        RejectRefundDialogRef.value.open(viewData.value);
    }else{
        // 前置校验 - 交付必须有交付附件
        if (status == 3 && consignSourceIdItems.value.length < 1) {
            return ElMessage.warning('请至少上传一份交付信息附件')
        }
        proxy.$modal.confirm({
            title: getModalTitle(status),
            content: getModalContent(status),
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    updateOrderStatus({ orderNo, status }).then(res => {
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
    }

}

const getData = () => {
    loadingState.value = true;
    const orderNo = route.params.orderNo;
    Promise.all([getRecordLogList({ orderNo }), getOrderInfo({ orderNo })]).then(res => {
        recordList.value = res[0].rows;
        viewData.value = res[1].data;
        isWaterMark.value = res[1].watermark == 1;
        sourIdItems.value = res[1].data.sourIdItems;
        consignSourceIdItems.value = res[1].data.consignSourceIdItems;
        loadingState.value = false;
        
        // 开始接单倒计时
        acceptCounting()
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

const countdown = ref('')
const acceptCounting = () => {
    let countdownEndTime = viewData.value.countdownEndTime;
    let countdownStartTime = viewData.value.countdownStartTime;
    let dif = (countdownEndTime - countdownStartTime) / 1000 // 秒

    let timmer = setInterval(() => {
        countdown.value = secondToDate(dif)
        dif -= 1
        if (dif < 0 ) {
            clearInterval(timmer)
        }
    }, 1000)
}

const getRecordData = () => {
    const orderNo = route.params.orderNo;
    getRecordLogList({ orderNo }).then(res => {
        recordList.value = res.rows;
    })
}

// 联系
const handleCath = () => {
    const userId = viewData.value.initiatorUserId;
    proxy.$sessionBox.openDialog({ userId })
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
const createUploadFileFun = ({ resultData, options }, callback, errorback) => {
    const params = {
        fileId: resultData.fileId,
        verifyContent: resultData.video?.verify_content || '',
        sourceContext: options.sourceContext,
        orderNo: viewData.value.orderNo,
    }
    uploadConsignFile(params).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

const handleUploadFile = (e) => {
    const files = e.target.files;
    for (const File of files) {
        if(File.size <= 1024 * 1024 * 1024){
            const uploadData = new UploadFile({ File, getUploadSign: getUploadSignFun, createUploadFile: createUploadFileFun });
            uploadData.on('success', uploadSuccess)
            store.commit('upload/addFileList', uploadData)
        }else{
            ElMessage.success('单个文件大小不能超过1G')
        }

    }
    UploadFileRef.value.value = ''
}

// 文件上传成功的回调
const uploadSuccess = (e) => {
    const data = e.fileSystem
    consignSourceIdItems.value.push({
        fileId: data.id,
        fileCat: data.fileCat,
        filename: data.name,
        sign: data.sign,
    });
    debounce(getData, 1500)
}

// 查看文件
const handleViewFile = (e) => {
    proxy.$viewFile.open({
        current: 0,
        fileList: [e]
    })
}
// 删除文件
const handleDeleteFile = (item) => {
    const params = {
        orderNo: viewData.value.orderNo,
        consignUploadFileId: item.fileId
    }

    proxy.$modal.confirm({ title: '删除附件' }).then(function () {
        return deleteConsignFile(params)
    }).then((res) => {
        if (res && +res.code == 200) {
            proxy.$modal.msgSuccess("删除成功")
            getData()
        }
    }).catch(() => { })
}

// 防抖 - 后续优化封装
const timmer = ref()
const debounce = (func, wait)=> {
    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timmer.value)
        timmer.value = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }()
}

onUnmounted(()=>{
    clearInterval(countTimmer.value)
}) 
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>