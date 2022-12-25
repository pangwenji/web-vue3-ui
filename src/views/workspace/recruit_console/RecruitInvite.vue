<template>
    <div class="table-header">
        <div style="width: 300px; padding-right: 20px;">报名者</div>
        <div style="width: 100px; padding-right: 20px;">邀请日期</div>
        <div style="width: 100px; padding-right: 20px;">查看状态</div>
        <div style="width: 100px">报名状态</div>
    </div>
    <el-scrollbar class="scrollbar-container" view-style="padding: 0px 20px 56px; position:relative; min-height: 100%;" v-loading="loadingStatus" element-loading-background="rgba(0,0,0,0)">
        <template v-if="tableData.length > 0">
            <div class="table_item-box" v-for="(item,index) in tableData" :key="index">
                <div class="info" style="width: 300px; flex:auto; overflow:hidden; padding-right: 20px;" @click="emit('onClick',item)">
                    <el-avatar :src="item.avatar" :size="56"></el-avatar>
                    <div class="content">
                        <div class="nickName">{{item.nickName}}</div>
                        <div class="desc">
                            <svg-icon class="icon-sex-box man" :size="16" title="男" iconClass="icon_man"></svg-icon>
                            <span>最近成交：</span>
                            <span style="color: #3468FE;">{{item.tradeNum}} &nbsp;</span>
                            <span>雇主评分：</span>
                            <span style="color: #FFC800;">{{item.score}}</span>
                        </div>
                        <div class="contact" @click.stop="handleCath(item)">
                            <el-icon>
                                <Comment />
                            </el-icon>联系
                        </div>
                    </div>
                </div>
                <div class="message" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">{{item.createTime}}</div>
                <div class="status" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">
                    <span class="blu" v-if="item.lookOver">已查看</span>
                    <span class="def" v-else>未查看</span>
                </div>
                <div class="status" style="width: 100px; flex:auto; overflow:hidden;">
                    <span class="blu" v-if="item.signUp">已报名</span>
                    <span class="def" v-else>未报名</span>
                </div>
            </div>
        </template>
        <template v-else-if="!loadingStatus">
            <Empty />
        </template>

        <Pagination :total="params.total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
    </el-scrollbar>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive } from 'vue'
import { getInviteList } from '@/api/personnel/personnelManage.js'
import { useRoute } from 'vue-router';
const props = {
    sk: {
        type: String,
        default: '',
    }
}
const emits = ['onClick']
const setup = (prop,{emit}) => {
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const params = reactive({
        pageNum: 1,
        pageSize: 10,
        total: 0,
    })
    const loadingStatus = ref(false);
    const tableData = ref([]);
    const showInput = ref(0);
    const getData = () => {
        const recruitId = route.params.id;
        loadingStatus.value = true;
        tableData.value = [];
        getInviteList({ recruitId, ...params }).then(res => {
            loadingStatus.value = false;
            params.total = res.total;
            tableData.value = res.rows;
        }).catch(err => {
            loadingStatus.value = false;
        })
    }
    getData();
    const handlePagination = ({ page, limit }) => {
        params.pageNum = page;
        params.pageSize = limit;
    }

    // 联系
    const handleCath = (item) => {
        const userId = item.userId;
        proxy.$sessionBox.openDialog({ userId });
    }

    return {
        emit,
        params,
        tableData,
        showInput,
        handleCath,
        loadingStatus,
        handlePagination,
    }
}
export default defineComponent({
    setup,
    props,
    emits,
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
        padding: 20px;
        margin-bottom: 10px;
        display: flex;
        position: relative;
        align-items: center;
        .info {
            display: flex;
            cursor: pointer;
            align-items: center;
            &:deep(.el-avatar) {
                flex: none;
                margin-right: 10px;
            }
            .content {
                // width: 100%;
                flex: auto;
                overflow: hidden;
                position: relative;
                padding: 4px 0;
                display: inline-block;
                .nickName {
                    width: 100%;
                    box-sizing: border-box;
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
}
.pagination-container-box {
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0;
}
</style>