<template>
    <el-scrollbar height="100%" view-class="scroll-container-view" view-style="padding-bottom: 56px; min-height:100%;position: relative;"  v-loading="loadingStatus" element-loading-background="rgba(0,0,0,0)">
        <div class="recruit-top">
            <div class="left">
                <span class="tab" :class="{ 'active-tab': activeTabId === item.id }" v-for="(item, index) in tabListShow" :key="index" @click="handleChangMain(item.id)">{{ item.title }} </span>
            </div>

            <div class="right" @click.stop="drawer = !drawer ">
                <el-button color="rgba(52, 104, 254, 0.22)" class="puls-recruit" type="primary" @click="goPlus" round>发布招募 <svg-icon style="margin-left:4px;" iconClass="plus" :size="20"></svg-icon>
                </el-button>
                <el-input :input-style="inputStyle" v-model="searchValue" class="w-50 m-2" placeholder="快速搜索工种" @change="searchChange">
                    <template #suffix>
                        <svg-icon iconClass="recruit_search" :size="24"></svg-icon>
                    </template>
                </el-input>
            </div>
        </div>

        <div v-if="tableData.length > 0" class="recruit-content">
            <div v-for="(item, index) in tableData" :key="index" class="list-item">
                <div class="left">
                    <div class="status-box" :class="'status'+item.status">{{statusFormat(item.status)}}</div>
                    <div class="title">{{item.title}}</div>
                    <div class="info-box">
                        <div class="info-item">招募工种 <span class="number">{{item.categoryNum}}</span></div>
                        <div class="info-item">预算 <span class="number">{{item.totalPrice}}</span><i class="background_icon-money" style="width:18px;height:17px;margin: -2px 0 0 2px;"></i></div>
                        <div class="info-item">已报名人数 <span class="number">{{item.signUpNum}}</span></div>
                        <div class="info-item">已选定人数 <span class="number">{{item.undertakerNum}}</span></div>
                        <div class="info-item">已邀请人数 <span class="number">{{item.inviteNum}}</span></div>
                    </div>
                    <div class="time">
                        <span>发布时间: {{item.createTime}}</span>
                        <span class="end-time">报名截止: {{item.endDate}}</span>
                    </div>
                </div>
                <div class="right">
                    <span class="handle edit" @click="handleUpdate(item)" v-if="item.status == 2">修改招募</span>
                    <!-- <span class="handle disabled" v-else>修改</span> -->
                    <span class="handle down" @click="handleUpdateStatus(item)" v-if="item.status === 1">完成招募</span>
                    <span class="handle delete" @click="handleDelete(item)" v-if="item.status !== 0">删除</span>
                    <!-- <span class="handle disabled" v-else>删除</span> -->
                    <!-- <span class="handle down" @click="handleUpdateStatus(item)" v-if="item.status !== 0 && item.status !== 2 && item.status !== 4">{{item.status == 1?'下架':'上架' }}</span>
                    <span class="handle disabled" v-else>{{item.status == 1?'下架':'上架' }}</span> -->
                    <el-button class="inbtn" type="primary" :disabled="item.status == 0 || item.status == 2" @click="toWorkboard(item)" round>进入工作板</el-button>
                </div>
            </div>
        </div>
        <template v-else-if="!loadingStatus">
            <div style="position:absolute; top:0;bottom:0; width: 100%; display:flex; z-index:0; align-items:center; justify-content:center;">
                <Empty />
            </div>
        </template>

        <Pagination :total="total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-recruit" position="center"></Pagination>
    </el-scrollbar>
</template>

<script setup>
import { getRecruitReleaseList, recruitDelete, updateReleaseRecruitmentHall } from "@/api/personnel/personnelManage.js"
import { getCurrentInstance, onMounted, onUnmounted } from "@vue/runtime-core"
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'

const handleWatchStatus = ({noticeType, sourceData})=>{
    if(noticeType == 4){
        const id = sourceData.info?.id;
        for(const item of tableData.value){
            if(item.id == id){
                item.status = sourceData.status;
            }
        }

    }
}
IM_EVENT_LISTERNER.addEventListenerIM('WORKER',handleWatchStatus);
onUnmounted(()=>{
    IM_EVENT_LISTERNER.removeEventListenerIM('WORKER',handleWatchStatus);
})

const router = useRouter()
let tabListShow = ref([
    { title: "全部", id: '' },
    { title: '招募中', id: 1 },
    // { title: '已下架', id: 3 },
    { title: '已完成', id: 4 },
    { title: '审核中', id: 0 },
    { title: '审核未通过', id: 2 }
])
const activeTabId = ref('');
const { proxy } = getCurrentInstance();
const params = reactive({
    pageNum: 1,
    pageSize: 10,
    status: '',
    sk:'',
})
const total = ref(0)
const tableData = ref([]);
const loadingStatus = ref(false)
const inputStyle = ref({
    width: '200px',
    height: '36px',
    color: '#ffffff',
    background: '#24262F',
    'border-radius': '20px',
})
const searchValue = ref('')


onMounted(() => {
    getRecruitList()
})
// 改变检索状态
function handleChangMain(id) {
    activeTabId.value = id
    params.status = id
    params.pageNum = 1
    getRecruitList()
}

// 获取招募列表
function getRecruitList() {
    loadingStatus.value = true;
    tableData.value = [];
    getRecruitReleaseList(params).then(res => {
        total.value = res.total
        tableData.value = res.rows
        loadingStatus.value = false
    }).catch(err => {
        loadingStatus.value = false
    })
}

// 改变页数时
function handlePagination({ page, limit }) {
    if (loadingStatus.value) return;
    params.pageNum = page
    params.pageSize = limit
    getRecruitList()
}

// 修改招募为完成状态
function handleUpdateStatus(item) {
    if(item.status === 0 || item.status === 2){
        ElMessage.warning('请审核通过后在进行操作')
        return
    }
    const status = item.status == 1 ? 4 : 1
    const id = item.id;
    if (item.status == 1) {
        proxy.$modal.confirm({
            title: '完结招募',
            content: `确定要完结招募“${item.title}” 吗？`,
            beforeClose(action, instance, done) {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    updateReleaseRecruitmentHall({ id, status }).then(res => {
                        ElMessage.success('操作成功')
                        getRecruitList();
                        done()
                    }).catch(err => {
                        done()
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            }
        }).then(res => { }).catch(err => { })

    } else {
        // loadingStatus.value = true;
    //     updateReleaseRecruitmentHall({ id: item.id , status}).then(res => {
    //         loadingStatus.value = false;
    //         ElMessage.success('操作成功');
    //         getRecruitList();
    //     }).catch(err => {
    //         loadingStatus.value = false;
    //     })
    }
}

function statusFormat(status) {
    const statusArr = ['审核中', '审核通过', ' 审核失败', '已下架', '已完成', '已关闭']
    return statusArr[status]
}

function goPlus() {
    router.push('/workspace/admin/release')
}

function searchChange() {
    params.pageNum = 1;
    params.sk = searchValue.value;
    getRecruitList()
}

function handleUpdate(item) { 
    router.push({path:'/workspace/admin/release',query:{id: item.id}})
}

function handleDelete(item) {
    if(item.status === 0){
        ElMessage.warning('正在审核中无法删除')
        return
    }
    proxy.$modal.confirm({
        title: '删除招募',
        content: `确定要删除招募“${item.title}” 吗？`,
        beforeClose(action, instance, done) {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                recruitDelete({ id:item.id }).then(res => {
                    ElMessage.success('删除成功');
                    getRecruitList()
					done()
                }).catch(err => {
					done()
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    }).then(res => { }).catch(err => { })
}

function toWorkboard(e) {
    router.push({ path: `/workspace/admin/recruit_console/${e.id}` })
}

</script>

<style scoped lang="scss">
@import "./style.scss";
</style>