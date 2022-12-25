<template>
    <div class="table-box">
        <div class="table">
            <div class="table-item" style="background: #0A0B0D; height: 50px; padding-top: 12px;">
                <div class="col2">订单编号</div>
                <div class="col2">提交时间</div>
                <div class="col1">来源</div>
                <div class="col3">详情</div>
                <div class="col1">状态</div>
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
                                    <el-tooltip effect="light" :content="item.context" placement="bottom" >
                                      <span style="cursor: pointer" @click="toDetails(item.orderNo)">{{ item.context || '-' }}</span>
                                    </el-tooltip>
                                </div>
                                <!-- 状态 -->
                                <div class="col1 col-overflow-ellipsis">{{ item.stateName || '-' }}</div>
                                <!-- 金额 -->
                                <div class="col1 col-overflow-ellipsis" style="display: flex; align-items:center;">
                                    <span style="padding: 0 4px;">{{ item.amount || '-' }}</span>
                                    <span class="background_icon-money" style="width: 12px; height: 12px; padding: 0px;"></span>
                                </div>
                                <!-- 备注 -->
                                <div class="col1 col-overflow-ellipsis">
                                    <el-tooltip effect="light" :content="item.remark" placement="bottom">
                                        {{ item.remark || '-' }}
                                    </el-tooltip>
                                </div>
                            </div>
                        </template>
                    </div>
                </transition>
            </div>
            <div v-else-if="!loadingStatus" class="empty">
                <Empty description="暂无记录">
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
import { ref, reactive, onUnmounted } from 'vue';
import { frozenRecordList } from "@/api/pay/pay";
import {useRouter} from "vue-router";
import {verifyJump} from "../../../api/user/wallet";
import {ElMessage} from "element-plus";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js';
const loadingStatus = ref(false);
const expenditureList = ref([]);
const total = ref(0);
const params = reactive({
    pageSize: 10,
    pageNum: 1,
    startTime:'',
    endTime:'',
})
const props = defineProps({
    time:{
        type:Array,
        default(){
            return []
        }
    }
})

// 监听拒绝订单、订单退款、确认验收的回调
const handleWorkerOrderStatus = ({ noticeType, sourceData }) => {
    if (noticeType == 10) { //充值成功
        const status = sourceData.order.status;
        if(status == 2 || status == 6 || status == 9){
            getData();
        }
    }
}

onUnmounted(()=>{
    IM_EVENT_LISTERNER.removeEventListenerIM('WORKER', handleWorkerOrderStatus);
})
IM_EVENT_LISTERNER.addEventListenerIM('WORKER', handleWorkerOrderStatus);

watch(()=>props.time,(n)=>{
    params.startTime = n[0] || ''
    params.endTime = n[1] || ''
    getData();
})


// 获取数据
const getData = () => {
    loadingStatus.value = true;
    frozenRecordList(params).then(res => {
        expenditureList.value = res.rows;
        loadingStatus.value = false;
        total.value = res.total;
    }).catch(err => {
        loadingStatus.value = false;
    });
}
onMounted(()=>{
    params.startTime = props.time[0] || ''
    params.endTime =  props.time[1] || ''
    getData();
})

const router = useRouter();
const toDetails = (orderNo) => {
  //判断订单是否能跳转
  verifyJump({orderNo}).then((res)=>{
    if (res.code === 200){
      router.push({
        path:'/workspace/admin/goods_detail/'+ orderNo,
      })
    }
  }).catch(err=>{
    //code === 1020
    ElMessage(err.data.msg)
  })
}

// 分页
const handlePagination = ({page,limit})=>{
    params.pageNum = page;
    getData();
}

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
