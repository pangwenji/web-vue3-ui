<template>
    <div class="table-header">
        <div style="width: 300px; padding-right: 20px;">报名者</div>
        <div style="width: 100px; padding-right: 20px;">工种角色</div>
        <div style="width: 100px; padding-right: 20px;">报名时间</div>
        <div style="width: 100px; padding-right: 20px;">状态</div>
        <div style="width: 100px">操作</div>
    </div>
    <el-scrollbar class="scrollbar-container" view-style="padding: 0px 20px 56px; position:relative; min-height: 100%;" v-loading="loadingStatus" element-loading-background="rgba(0,0,0,0)">
        <template v-if="tableData.length">
            <div class="table_item-box" v-for="(item,index) in tableData" :key="index">
                <div class="info" style="width: 300px; flex:auto; overflow:hidden; padding-right: 20px;" @click="emit('onClick',item)">
                    <el-avatar :size="56" :src="item.avatar"></el-avatar>
                    <div class="content">
                        <div class="nickName">{{item.nickName}}</div>
                        <div class="desc">
                            <svg-icon class="icon-sex-box man" :size="16" title="男" iconClass="icon_man"></svg-icon>
                            <span>最近成交：</span>
                            <span style="color: #3468FE;">{{item.tradeNum}} &nbsp;</span>
                            <span>雇主评分：</span>
                            <span style="color: #FFC800;">{{item.score}}</span>
                        </div>
                        <div class="contact" @click="handleCath(item)">
                            <el-icon>
                                <Comment />
                            </el-icon>联系
                        </div>
                    </div>
                </div>
                <div class="work-type" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">
                    <div class="work">{{item.categoryTitle}}</div>
                    <div class="text">{{item.title}}</div>
                </div>
                <div class="message" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">{{item.createTime}}</div>
                <div class="status" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">
                    <span class="gre" v-if="item.orderStatus == 0 && item.ifPay === 0">待支付</span>
                    <span class="org" v-if="item.orderStatus == 0 && item.ifPay === 1">待接单</span>
                    <span class="blu" v-if="item.orderStatus == 1">进行中</span>
                    <span class="blu" v-if="item.orderStatus == 2">已拒绝</span>
                    <span class="blu" v-if="item.orderStatus == 3">已交付</span>
                    <span class="def" v-if="item.orderStatus == 4">已取消</span>
                    <span class="def" v-if="item.orderStatus == 5">退款中</span>
                    <span class="def" v-if="item.orderStatus == 6">已退款</span>
                    <span class="red" v-if="item.orderStatus == 7">未退款</span>
                    <span class="blu" v-if="item.orderStatus == 9">已完成</span>
                </div>
                <div class="action" style="width: 100px; flex:auto; overflow:hidden;">
                    <el-button type="primary" style="width: 100px;" color="#3468FE" :disabled="item.orderStatus !== 0" round @click="handleCancelSelect(item)">取消选定</el-button>
                    <el-button type="primary" size="small" color="#20222A" round @click.stop="handleViewDetail(item)">详情<el-icon>
                            <CaretRight />
                        </el-icon>
                    </el-button>
                </div>
                <div class="reamrk-box">
                    <div class="label">备注：</div>
                    <div class="content">{{item.bz || '暂无备注'}}</div>
                </div>
            </div>
        </template>
        <template v-else-if="!loadingStatus">
            <Empty></Empty>
        </template>

        <Pagination :total="params.total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
    </el-scrollbar>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive } from 'vue'
import { getSignUpList, cancelUndertaker } from '@/api/personnel/personnelManage.js'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const props = {
    sk: {
        type: String,
        default: '',
    }
}
const emits = ['onCancelSelect', 'onClick']
const setup = (prop, { emit }) => {
    const route = useRoute();
    const router = useRouter();
    const params = reactive({
        pageNum: 1,
        pageSize: 10,
        total: 0,
        type: 1,
        sk: '',
    })
    const { proxy } = getCurrentInstance();
    const loadingStatus = ref(false);
    const tableData = ref([]);
    const showInput = ref(0);
    // 输入框改变时
    const handleChangeSK = () => {
        params.pageNum = 1;
        getData();
    }
    const getData = () => {
        params.sk = prop.sk;
        const recruitId = route.params.id;
        loadingStatus.value = true;
        tableData.value = [];
        getSignUpList({ recruitId, ...params }).then(res => {
            loadingStatus.value = false;
            params.total = res.total;
            tableData.value = res.rows;
        }).catch(err => {
            loadingStatus.value = false;
        })
    }
    getData();
    // 取消选择
    const handleCancelSelect = (e) => {
        proxy.$modal.confirm({
            title: '取消选定',
            content: '确定取消选定吗？',
            beforeClose(action, instance, done) {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    const recruitApplyId = e.id;
                    cancelUndertaker({ recruitApplyId }).then(res => {
                        ElMessage.success('操作成功');
                        getData();
                        emit('onCancelSelect');
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
    // 查看详情
    const handleViewDetail = (e) => {
        const orderNo = e.orderNo;
        router.push({ path: `/workspace/admin/goods_detail/${orderNo}` })
    }
    // 分页改变时
    const handlePagination = ({ page, limit }) => {
        params.pageNum = page;
        params.pageSize = limit;
    }


    // 联系
    const handleCath = (item) => {
        const userId = item.recipientUserId;
        proxy.$sessionBox.openDialog({ userId });
    }

    return {
        emit,
        params,
        tableData,
        showInput,
        handleCath,
        loadingStatus,
        handleChangeSK,
        handleViewDetail,
        handlePagination,
        handleCancelSelect,
    }
}
export default defineComponent({
    setup,
    props,
    emits
})
</script>

<style scoped lang="scss">
.table-header {
    height: 40px;
    padding: 20px;
    line-height: 40px;
    color: #4e5262;
    font-size: 14px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
        flex: auto;
    }
}
.scrollbar-container {
    position: relative;
    height: 100%;
    padding-top: 40px;
    margin: 0 -20px;
    box-sizing: border-box;

    .table_item-box {
        width: 100%;
        background: #181920;
        border-radius: 10px;
        overflow: hidden;
        padding: 20px 20px 40px;
        display: flex;
        margin-bottom: 10px;
        position: relative;
        align-items: center;
        &::before {
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 20px;
            position: absolute;
            background: #0a0b0d;
            left: -8px;
            bottom: 24px;
        }
        &::after {
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 20px;
            position: absolute;
            background: #0a0b0d;
            right: -8px;
            bottom: 24px;
        }
        .info {
            display: flex;
            cursor: pointer;
            align-items: center;
            &:deep(.el-avatar) {
                flex: none;
                margin-right: 10px;
            }
            .content {
                flex: auto;
                overflow: hidden;
                position: relative;
                padding: 4px 0;
                .nickName {
                    color: #c2c7ce;
                    font-size: 16px;
                    margin-bottom: 6px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding-right: 80px;
                }
                .desc {
                    margin-bottom: 6px;
                    font-size: 12px;
                    color: #8d91a3;
                    padding-left: 20px;
                    position: relative;
                    .icon-sex-box {
                        color: #7cb5ec;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba($color: #7cb5ec, $alpha: 0.3);
                        padding: 2px;
                        border-radius: 6px;
                        &.man {
                            color: #7cb5ec;
                            background: rgba($color: #7cb5ec, $alpha: 0.3);
                        }
                        &.girl {
                            color: #ef007f;
                            background: rgba($color: #ef007f, $alpha: 0.3);
                        }
                        &.other {
                            color: #18785f;
                            background: rgba($color: #18785f, $alpha: 0.3);
                        }
                    }
                }
                .contact {
                    user-select: none;
                    cursor: pointer;
                    width: 70px;
                    color: #3468fe;
                    background: rgba($color: #3468fe, $alpha: 0.2);
                    padding: 2px 6px;
                    border-radius: 6px;
                    display: flex;
                    font-size: 14px;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0px;
                    right: 0;
                }
            }
        }
        .work-type {
            .work {
                display: inline-block;
                background: rgba($color: #8d91a3, $alpha: 0.1);
                color: #c2c7ce;
                padding: 6px 20px;
                font-size: 14px;
                border-radius: 6px;
                margin-bottom: 10px;
            }
            .text {
                width: 100%;
                font-size: 14px;
                color: #c2c7ce;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .message {
            font-size: 14px;
            color: #c2c7ce;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
        .action {
            &:deep(.el-button) {
                --el-button-disabled-bg-color: rgba(
                    52,
                    104,
                    254,
                    0.2
                ) !important;
                --el-button-disabled-border-color: rgba(
                    52,
                    104,
                    254,
                    0.2
                ) !important;
                &.is-disabled {
                    color: rgba(52, 104, 254) !important;
                }
            }
        }
        .status {
            font-size: 14px;
            .red {
                color: #e91e19;
            }
            .gre {
                color: #0da411;
            }
            .blu {
                color: #3468fe;
            }
            .def {
                color: #9094a6;
            }
            .org {
                color: #f88212;
            }
        }
    }
    .reamrk-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        padding: 0 20px;
        line-height: 30px;
        color: #666a7a;
        font-size: 14px;
        background: rgba($color: #000000, $alpha: 0.2);
        display: flex;
        align-items: center;
        .label {
            flex: none;
        }
        .content {
            flex: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
.pagination-container-box {
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0;
}
</style>