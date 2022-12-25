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
                <div class="col1">操作</div>
            </div>
        </div>
    </div>
    <div style="flex: auto; overflow:hidden; margin: 0 -20px;" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)">
        <el-scrollbar style="height:100%;" view-style="padding: 0 20px 56px; min-height: 100%; position:relative;">
            <div class="table-box" style="flex: 1;" v-if="expenditureList.length > 0 && !loadingStatus">
                <transition name="table">
                    <div class="table">
                        <template v-for="item in expenditureList" :key="item">
                            <div class="table-item">
                                <!-- 订单编号 -->
                                <div class="col2 col-overflow-ellipsis">
                                    {{ item.orderNo || '-' }}</div>
                                <!-- 提交时间 -->
                                <div class="col2 col-overflow-ellipsis">{{ item.createTime || '-' }}</div>
                                <!-- 来源 -->
                                <div class="col1 col-overflow-ellipsis">{{ item.orderTypeName || '-' }}</div>
                                <!-- 详情 -->
                                <div class="col3 col-overflow-ellipsis">
                                    <el-tooltip effect="light" :content="item.remark" placement="bottom">
                                        {{ item.remark || '-' }}
                                    </el-tooltip>
                                </div>
                                <!-- 状态 -->
                                <div class="col1 col-overflow-ellipsis">{{ item.stateName || '-' }}</div>
                                <!-- 金额 -->
                                <div class="col1 col-overflow-ellipsis" style="display: flex; align-items:center;">
                                    <span style="padding: 0 4px;">{{ item.amount || '-' }}</span>
                                    <span class="background_icon-money" style="width: 12px; height: 12px; padding: 0px;"></span>
                                </div>
                                <!-- 操作 -->
                                <div class="col1 col-overflow-ellipsis">
                                    <span class="refund-button" :class="{disabled: item.state == 3 || item.state == 2}" @click="handleRefund(item)">
                                        <span>申请退款</span>
                                        <el-tooltip effect="light" content="所有招募订单完结才能解冻，退款实时到账，无手续费" placement="bottom">
                                            <el-icon :size="12" class="el-icon--right">
                                                <QuestionFilled />
                                            </el-icon>
                                        </el-tooltip>
                                    </span>
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

    <!-- 退款弹窗 -->
    <BondDialog ref="BondDialogRef" @onSubmit="handleSubmitBond"></BondDialog>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import BondDialog from '../components/BondDialog'
import { pledgeMoneyRecordList, pledgeRefund } from "@/api/pay/pay";
const loadingStatus = ref(false);
const expenditureList = ref([]);
const BondDialogRef = ref()
const total = ref(0);
const params = reactive({
    pageSize: 10,
    pageNum: 1,
    startTime: '',
    endTime: '',
})


const props = defineProps({
    time: {
        type: Array,
        default() {
            return []
        }
    }
})
const emits = defineEmits(['onSubmit'])

const handleSubmitBond = ()=>{
    getData();
    emits('onSubmit');
}

watch(() => props.time, (n) => {
    params.startTime = n[0] || ''
    params.endTime = n[1] || ''
    getData();
})
// 获取数据
const getData = () => {
    loadingStatus.value = true;
    pledgeMoneyRecordList(params).then(res => {
        expenditureList.value = res.rows;
        loadingStatus.value = false;
        total.value = res.total;
    }).catch(err => {
        loadingStatus.value = false;
    });
}


onMounted(() => {
    params.startTime = props.time[0] || ''
    params.endTime = props.time[1] || ''
    getData();
})

// 退款
const handleRefund = (e) => {
    if (e.state == 3 || e.state == 2) {
        return
    }
    BondDialogRef.value.open(e)
}

// 分页
const handlePagination = ({ page, limit }) => {
    params.pageNum = page;
    getData();
}

</script>
<style scoped lang="scss">
@import "./style.scss";
.refund-button {
    display: flex;
    cursor: pointer;
    align-items: center;
    span {
        color: #3468fe;
    }
    &.disabled {
        span {
            color: rgba($color: #ffffff, $alpha: 0.1);
        }
        cursor: no-drop;
    }
}


</style>