<template>
    <div class="table-box">
        <div class="table">
            <div class="table-item" style="background: #0A0B0D; height: 50px; padding-top: 12px;">
                <div class="col2">订单编号</div>
                <div class="col2">提交时间</div>
                <div class="col1">来源</div>
                <div class="col3">详情</div>
                <div class="col1">类型</div>
                <div class="col1">金额</div>
                <div class="col1">备注</div>
            </div>
        </div>
    </div>
    <div style="flex: auto; overflow:hidden; margin: 0 -20px;" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)">
        <el-scrollbar style="height:100%;" view-style="padding: 0 20px 56px; min-height: 100%; position:relative;">
            <div class="table-box" style="flex: 1;" v-if="expenditureList.length > 0 && !loadingStatus">
                <transition name="table">
                    <div class="table">
                        <template v-for="item in expenditureList" :key="item">
                            <div class="table-item" >
                                <!-- 订单编号 -->
                                <div class="col2 col-overflow-ellipsis">
                                    {{ item.orderNo || '-' }}</div>
                                <!-- 提交时间 -->
                                <div class="col2 col-overflow-ellipsis">{{ item.createTime || '-' }}</div>
                                <!-- 来源 -->
                                <div class="col1 col-overflow-ellipsis">{{ item.orderTypeName || '-' }}</div>
                                <!-- 详情 -->
                                <div class="col3 col-overflow-ellipsis">
                                    <el-tooltip effect="light" :content="item.context" placement="bottom">
                                        {{ item.context || '-' }}
                                    </el-tooltip>
                                </div>
                                <!-- 类型 -->
                                <div class="col1 col-overflow-ellipsis">{{ item.billTypeName || '-' }}</div>
                                <!-- 金额 -->
                                <div class="col1 col-overflow-ellipsis" style="display: flex; align-items:center;">
                                    <span>{{item.operateType == 1?'-':'+'}}</span>
                                    <span style="padding: 0 4px;">{{ item.amount || '-' }}</span>
                                    <span class="background_icon-money" style="width: 12px; height: 12px; padding: 0px;"></span>
                                </div>
                                <!-- 备注 -->
                                <div class="col1 col-overflow-ellipsis">{{ item.remark || '-' }}</div>
                            </div>
                        </template>
                    </div>
                </transition>
            </div>
            <div v-else-if="!loadingStatus" class="empty">
                <Empty description="">
                    <template #description>
                        <div>{{ params.startTime + ' - ' + params.endTime }}期间未产生记录</div>
                    </template>
                </Empty>
            </div>
            <Pagination :total="total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
        </el-scrollbar>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, defineProps, watch, onUnmounted } from 'vue'
import { payBillList , payBillExport} from "@/api/pay/pay";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const loadingStatus = ref(false);
const expenditureList = ref([]);
const total = ref(0);
const params = reactive({
    pageSize: 10,
    pageNum: 1,
    startTime:'',
    endTime:'',
    billType: '',
})
const props = defineProps({
    billType:{
        type: [String,Number],
        default:'',
    },
    time:{
        type:Array,
        default(){
            return []
        }
    }

})

// 监听充值成功得回调
const handlePayWatch = ({ noticeType, sourceData }) => {
    if (noticeType == 1) { //充值成功
        if(sourceData.state == 1){
            getData();
        }
    }
}
onUnmounted(()=>{
    IM_EVENT_LISTERNER.removeEventListenerIM('PAY', handlePayWatch)
})
IM_EVENT_LISTERNER.addEventListenerIM('PAY', handlePayWatch)

watch(()=>props.billType,(n)=>{
    params.billType = n
    getData()
})

watch(()=>props.time,(n)=>{
    params.startTime = n[0] || ''
    params.endTime = n[1] || ''
    getData();
})


// 获取数据
const getData = () => {
    loadingStatus.value = true;
    payBillList(params).then(res => {
        expenditureList.value = res.rows;
        loadingStatus.value = false;
        total.value = res.total;
    }).catch(err => {
        loadingStatus.value = false;
    });
}

const handleExportLog = ()=>{
    payBillExport(params).then(res=>{

    })
}

onMounted(()=>{
    params.startTime = props.time[0] || ''
    params.endTime =  props.time[1] || ''
    params.billType =  props.billType || ''
    getData();
})

// 分页
const handlePagination = ({page,limit})=>{
    params.pageNum = page;
    getData();
}

defineExpose({
    handleExportLog,
    getData
})

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
