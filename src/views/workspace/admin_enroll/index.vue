<template>
    <el-scrollbar style="height: 100%;" view-class="admin_enroll-view" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)">
        <div class="header">
            <span v-for="(item, index) in tabList" :key="index" class="tab-item" :class="{activeTab: item.key === params.undertakerState}" @click="tabClick(item.key)">{{item.title}}</span>
        </div>

        <div class="container-box">
            <el-row :gutter="0" v-if="recruitList&&recruitList.length">
                <template v-for="item in recruitList" :key="item.id">
                    <EnrollItem :data="item" @checkSucc="checkSucc" :width="String(100/column) + '%'"></EnrollItem>
                </template>
            </el-row>
            <template v-else>
                <Empty></Empty>
            </template>
        </div>
        <Pagination :total="total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
    </el-scrollbar>
</template>
<script setup>
import { onMounted } from '@vue/runtime-core';
import EnrollItem from './EnrollItem';
import { useWindowSize } from "@vueuse/core"
import { recruitBmyList } from "@/api/personnel/personnelConsole";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'

// 监听IM订单通知回调
const handleChangeOrderStatus = ({noticeType,sourceData})=>{
    // 取消选中或被选中时，更新状态
    if((noticeType == 15 || noticeType == 16) && sourceData.order?.status == 0){
        getRecruitBmyList()
    }
}
IM_EVENT_LISTERNER.addEventListenerIM('WORKER', handleChangeOrderStatus);
onUnmounted(()=>{
    IM_EVENT_LISTERNER.removeEventListenerIM('WORKER', handleChangeOrderStatus);
})

const tabList = ref([
    {
        key: '',
        title: '全部'
    },
    {
        key: 1,
        title: '已选中'
    },
    {
        key: 0,
        title: '筛选中'
    },
    {
        key: 2,
        title: '未选中'
    }
])
const { width } = useWindowSize();
const column = ref(2)
const onresize = (clientWidth) => {

    if (clientWidth < 770) {
        column.value = 1;
    } else if (clientWidth < 1470) {
        column.value = 2;
    } else if (clientWidth < 2200) {
        column.value = 3;
    } else if (clientWidth < 2900) {
        column.value = 4;
    } else if (clientWidth < 3670) {
        column.value = 5;
    } else {
        column.value = 6;
    }
}
const loadingStatus = ref(false)
const recruitList = ref([]);
const total = ref(0);
const params = reactive({
    pageNum: 1,
    pageSize: 10,
    undertakerState: '',
})

onMounted(() => {
    getRecruitBmyList()
    watchEffect(() => {
        onresize(width.value)
    })
})


function tabClick(key) {
    params.undertakerState = key
    params.pageNum = 1;
    params.pageSize = 10;
    getRecruitBmyList();
}

// 初始化 - 获取报名招募列表
const getRecruitBmyList = () => {
    loadingStatus.value = true;
    recruitBmyList(params).then(res => {
        recruitList.value = res.rows;
        loadingStatus.value = false;
        total.value = res.total;
        params.undertakerState === '' ? tabList.value[0].title = `全部(${res.total})` : ''
    }).catch(err => {
        loadingStatus.value = false;
    })
}
// emit - 接单成功
const checkSucc = () => {
    getRecruitBmyList()
}

// 改变页数时
const handlePagination = ({ page, limit }) => {
    if (loadingStatus.value) {
        return
    }
    params.pageNum = page;
    params.pageSize = limit;
    getRecruitBmyList();
}

</script>

<style scoped lang="scss">
@import "./style.scss";
</style>