<template>
    <div class="table-box">
        <div class="table">
            <div class="table-item" style="background: #0A0B0D; height: 50px; padding-top: 12px;">
                <div class="col3">订单编号</div>
                <div class="col3">提交时间</div>
                <div class="col2">来源</div>
                <div class="col2">渠道</div>
                <div class="col1" style="text-align:right;">金额</div>
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
                                <div class="col3 col-overflow-ellipsis">
                                    {{ item.orderNo || '-' }}</div>
                                <!-- 提交时间 -->
                                <div class="col3 col-overflow-ellipsis">{{ item.createTime || '-' }}</div>
                                <!-- 来源 -->
                                <div class="col2 col-overflow-ellipsis">{{ item.orderTypeName || '-' }}</div>
                                <!-- 渠道 -->
                                <div class="col2 col-overflow-ellipsis">{{ item.payTypeName || '-'}}</div>
                                <!-- 金额 -->
                                <div class="col1 col-overflow-ellipsis" style="text-align:right;">
                                    <span>{{ item.amount || '-' }}元</span>
                                </div>
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
import { ref, reactive, onMounted, defineProps, watch } from 'vue'
import { getMemberOrderList } from "@/api/pay/pay";
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

watch(()=>props.time,(n)=>{
    params.startTime = n[0] || ''
    params.endTime = n[1] || ''
    getData();
})


// 获取数据
const getData = () => {
    loadingStatus.value = true;
    getMemberOrderList(params).then(res => {
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

// 分页
const handlePagination = ({page,limit})=>{
    params.pageNum = page;
    getData();
}

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
