<template>
    <div class="table-header">
        <div style="width: 240px; padding-right: 20px;">报名者</div>
        <div style="width: 100px; padding-right: 20px;">工种角色</div>
        <div style="width: 200px; padding-right: 20px;">报名留言</div>
        <div style="width: 100px; padding-right: 20px;">附件</div>
        <div style="width: 100px; padding-right: 20px;">报名时间</div>
        <div style="width: 100px">操作</div>
    </div>
    <el-scrollbar class="scrollbar-container" view-style="padding: 0px 20px 56px; position:relative; min-height: 100%;" v-loading="loadingStatus" element-loading-background="rgba(0,0,0,0)">
        <template v-if="tableData.length > 0">
            <template v-for="(item,index) in tableData" :key="index">
                <div class="table_item-box">
                    <div class="info"  @click="emit('onClick',item)">
                        <el-avatar :src="item.avatar" :size="56"></el-avatar>
                        <div class="content">
                            <div class="nickName">{{item.nickName}}</div>
                            <div class="desc">
                                <svg-icon class="icon-sex-box man" :size="16" title="男" iconClass="icon_man"></svg-icon>
                                <svg-icon class="icon-sex-box man" :size="16" title="男" iconClass="icon_man"></svg-icon>
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
                    <div class="work-type" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">
                        <div class="work">{{item.categoryTitle}}</div>
                        <div class="text">{{item.title}}</div>
                    </div>
                    <div class="message" style="width: 200px; flex:auto; overflow:hidden; padding-right: 20px;">{{item.leaveMessage}}</div>
                    <div class="enclosure" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">
                        <template v-if="item.sourIdItems&&item.sourIdItems.length">
                            <div class="enclosure-item" v-for="(file,code) in item.sourIdItems" :key="index">
                                <el-tooltip :content="file.filename" placement="top" effect="light">
                                    <span class="icon">
                                        <el-icon>
                                            <Paperclip />
                                        </el-icon>
                                    </span>
                                </el-tooltip>
                                <span @click.stop="handleViewFile(file)">查看</span>
                                <span @click.stop="handleDownload(file)">下载</span>
                            </div>
                        </template>
                        <template v-else>
                            暂无附件
                        </template>
                    </div>
                    <div class="message" style="width: 100px; flex:auto; overflow:hidden; padding-right: 20px;">{{item.createTime}}</div>
                    <div style="width: 100px; flex:auto; overflow:hidden;">
                        <el-button type="primary" @click="handleDesignatedUndertaker(item,index)" :disabled="Boolean(item.undertakerState)" style="width: 100px;" color="#3468FE" round>
                            <span v-if="item.undertakerState === 0">选定</span>
                            <span v-else-if="item.undertakerState === 1">已选定</span>
                            <span v-else>未选定</span>
                        </el-button>
                    </div>
                    <div class="hide-view" @click.stop="handleUpdateHide(item,index)" :title="item.hide !== 1?'隐藏':'显示'">
                        <el-icon>
                            <Hide v-if="item.hide !== 1" />
                            <View v-else />
                        </el-icon>
                    </div>
                    <div class="reamrk-box">
                        <div class="label" @click="handleShowInput(item)">备注：</div>
                        <input v-if="showInput == item.id" id="RemarkInputRef" v-model="inputValue" @blur="showInput = 0" @change="handleUpdatebz(item,index)" class="input_inner"
                            placeholder="点击输入备注" />
                        <div style="flex:auto;" v-else @click="handleShowInput(item)">{{ item.bz || '点击设置备注'}}</div>
                    </div>
                </div>
            </template>
        </template>
        <template v-else-if="!loadingStatus">
            <Empty></Empty>
        </template>
        <Pagination :total="params.total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
    </el-scrollbar>
    <OrderDialog ref="OrderDialogRef" @onSubmit="handleSubmitpay"></OrderDialog>
</template>
<script>
import OrderDialog from '../components/OrderDialog'
import { defineComponent, getCurrentInstance, nextTick, reactive } from 'vue'
import { getSignUpList, updateRecruitApply, designatedUndertaker } from '@/api/personnel/personnelManage.js'
import { useRoute, useRouter } from 'vue-router';
import { download } from '@/utils/request'
import { ElMessage } from 'element-plus';
const components = {
    OrderDialog
}
const props = {
    sk: {
        type: String,
        default: '',
    },
    isHide: {
        type: Number,
        default: '',
    },
    isSelect: {
        type: Number,
        default: '',
    },
}
const emits = ['onSelect','onClick']
const setup = (prop, { emit }) => {
    const route = useRoute();
    const router = useRouter();
    const params = reactive({
        pageNum: 1,
        pageSize: 10,
        total: 0,
        type: 0,
        hide: 0,
        sk: '',
        undertakerState: 0,
    })
    const { proxy } = getCurrentInstance();
    const loadingStatus = ref(false);
    const tableData = ref([]);
    const showInput = ref(0);
    const inputValue = ref('');
    const OrderDialogRef = ref();
    const selectIndex = ref(-1);
    // 选择框改变时
    const handleChangeSwitch = () => {
        params.pageNum = 1;
        getData();
    }
    // 输入框改变时
    const handleChangeSK = () => {
        params.pageNum = 1;
        getData();
    }
    const getData = () => {
        params.sk = prop.sk;
        params.hide = prop.isHide;
        params.undertakerState = prop.isSelect;
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

    // 查看文件
    const handleViewFile = (e) => {
        proxy.$viewFile.open({ current: 0, fileList: [e] })
    }
    // 下载文件
    const handleDownload = (e) => {
        download(e.downloadUrl, {}, e.filename)
    }

    // 修改备注
    const handleUpdatebz = (item, index) => {
        const hide = item.hide;
        const bz = inputValue.value;
        const recruitApplyId = item.id;
        showInput.value = 0;
        inputValue.value = '';
        updateRecruitApply({ hide, bz, recruitApplyId }).then(res => {
            tableData.value[index].bz = bz;
        })

    }
    // 选中承接人
    const handleDesignatedUndertaker = (e, index) => {
        const recruitApplyId = e.id;
        selectIndex.value = index;
        designatedUndertaker({ recruitApplyId }).then(res => {
            selectIndex.value = null;
            e.undertakerState = 1;
            ElMessage.success('操作成功')
            emit('onSelect');
        }).catch(err => {
            if (err.data && err.data.code == 1015) {
                e.undertakerState = 1;
                const data = err.data.data;
                emit('onSelect');
                OrderDialogRef.value.open({ order: data.payOrderNo, price: data.price });
            }
        })
    }

    // 支付成功的回调
    const handleSubmitpay = () => {
        // if(selectIndex.value > -1){
        // const data = tableData.value[selectIndex.value];
        // setTimeout(()=>{
        //     handleDesignatedUndertaker(data, selectIndex.value)
        // },1000)
        // }
    }

    // 隐藏或显示列表项
    const handleUpdateHide = (item, index) => {
        const hide = item.hide == 1 ? 0 : 1;
        const bz = item.bz;
        const recruitApplyId = item.id;
        updateRecruitApply({ hide, bz, recruitApplyId }).then(res => {
            tableData.value[index].hide = hide;
            getData();
        })
    }

    // 点击展示输入框
    const handleShowInput = (item) => {
        showInput.value = item.id;
        inputValue.value = item.bz;
        nextTick(() => {
            const RemarkInputRef = document.getElementById('RemarkInputRef');
            RemarkInputRef.focus();
        })
    }
    // 联系
    const handleCath = (item) => {
        const userId = item.recipientUserId;
        proxy.$sessionBox.openDialog({ userId });
    }

    // 点击分页
    const handlePagination = ({ page, limit }) => {
        params.pageNum = page;
        params.pageSize = limit;
    }


    return {
        emit,
        params,
        inputValue,
        tableData,
        showInput,
        handleCath,
        loadingStatus,
        OrderDialogRef,
        handleViewFile,
        handleDownload,
        handleChangeSK,
        handleUpdatebz,
        handleSubmitpay,
        handleShowInput,
        handleUpdateHide,
        handlePagination,
        handleChangeSwitch,
        handleDesignatedUndertaker,
    }
}
export default defineComponent({
    setup,
    props,
    emits,
    components
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
        padding: 20px 20px 50px;
        display: flex;
        position: relative;
        align-items: center;
        margin-bottom: 10px;
        .info {
            display: flex;
            align-items: center;
            width: 240px; 
            flex:auto; 
            overflow:hidden; 
            padding-right: 20px;
            cursor: pointer;
            &:deep(.el-avatar) {
                flex: none;
                margin-right: 10px;
            }
            .content {
                flex: auto;
                overflow: hidden;
                .nickName {
                    color: #c2c7ce;
                    font-size: 16px;
                    margin-bottom: 6px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
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
                    width: 80px;
                    color: #3468fe;
                    background: rgba($color: #3468fe, $alpha: 0.2);
                    padding: 4px 10px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                font-size: 14px;
                color: #c2c7ce;
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
        .enclosure {
            font-size: 14px;
            color: #c2c7ce;
            .enclosure-item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-bottom: 10px;
                color: #3d3f50;
                &:last-child {
                    margin-bottom: 00px;
                }
                .icon {
                    width: 22px;
                    height: 22px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    background: rgba($color: #8d91a3, $alpha: 0.2);
                    &:hover {
                        color: #3468fe;
                        background: rgba($color: #3468fe, $alpha: 0.2);
                    }
                }
                span {
                    margin-right: 16px;
                    cursor: pointer;
                    &:last-child {
                        margin-right: 0px;
                    }
                    &:hover {
                        color: #3468fe;
                    }
                }
            }
        }
        .action {
            cursor: pointer;
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
        .hide-view {
            position: absolute;
            right: 10px;
            top: 10px;
            color: #9094a6;
            cursor: pointer;
            &:hover {
                color: #3468fe;
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
            .input_inner {
                flex: auto;
                background: none;
                outline: none;
                border: none;
                color: white;
            }
            &::before {
                content: "";
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 20px;
                position: absolute;
                background: #0a0b0d;
                left: -8px;
                top: -6px;
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
                top: -6px;
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