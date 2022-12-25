<template>
    <transition name="dialog_right">
        <div class="session_dialog-right" v-if="visibled">
            <div class="session_dialog-right-title">
                <div class="title-tabbar-item" :class="{ active: current == 1 }" @click="handleClickTabbar(1)">订单列表</div>
                <div class="title-tabbar-item" :class="{ active: current == 2 }" @click="handleClickTabbar(2)">Ta的服务</div>
                <div class="close-icon" @click="close">
                    <SvgIcon iconClass="icon_left" :size="24"></SvgIcon>
                </div>
            </div>
            <template v-if="current == 1">
                <el-scrollbar class="scrollbar-container-box" view-style="padding: 8px; min-height: 100%;" v-loading="loadingState1" element-loading-background="rgba(0,0,0,0.1)">
                    <div style="display:flex; align-items:center; justify-content:space-between; font-size:12px; padding: 0px 0 10px; color: #3468FE">
                        <div style="color: #9D9DA1">仅展示与Ta最近一个月合作的订单</div>
                        <div  @click="handleToOrderList()" >
                            <span>更多</span>
                            <span><SvgIcon iconClass="icon_right" :size="12"></SvgIcon></span>
                        </div>
                    </div>
                    <template v-if="relationData.length && !loadingState1">
                        <template v-for="(item,index) in relationData" :key="index">
                            <div class="order-item">
                                <div class="order-item-title">{{item.orderNo}}</div>
                                <div class="order-item-content">
                                    <div class="content-item">
                                        <div class="label">订单标题</div>
                                        <div class="context">{{item.title}}</div>
                                    </div>
                                    <div class="content-item">
                                        <div class="label">订单金额</div>
                                        <div class="context price"><span>{{item.price}}</span> <span class="background_icon-money"></span> </div>
                                    </div>
                                    <div class="content-item">
                                        <div class="label">开始日期</div>
                                        <div class="context">{{item.createTime}}</div>
                                    </div>
                                    <div class="content-item">
                                        <div class="label">交付日期</div>
                                        <div class="context">{{item.createTime || '-'}}</div>
                                    </div>
                                </div>
                                <div class="order-item-footer" @click="handleToDetail(item)">
                                    <div>
                                        <span class="org" v-if="item.status == 0 && !item.ifPay">待支付</span>
                                        <span class="org" v-if="item.status == 0 && item.ifPay">待接单</span>
                                        <span class="gre" v-if="item.status == 1">待交付</span>
                                        <span class="org" v-if="item.status == 3">待验收</span>
                                        <span v-if="item.status == 5">退款中</span>
                                        <span v-if="item.status == 6">已退款</span>
                                        <span class="org" v-if="item.status == 9 && !item.ifComment">待评价</span>
                                        <span v-if="item.status == 9 && item.ifComment">已完成</span>
                                        <span class="red" v-if="item.status == 7">拒绝退款</span>
                                        <span class="red" v-if="item.status == 2">拒绝接单</span>
                                        <span v-if="item.status == 4">已关闭</span>
                                    </div>
                                    <div>
                                        <span>查看详情</span>
                                        <span>
                                            <SvgIcon iconClass="icon_right" :size="16"></SvgIcon>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                    <template v-else-if="!loadingState1">
                        <Empty></Empty>
                    </template>
                </el-scrollbar>
            </template>
            <template v-if="current == 2">
                <el-scrollbar class="scrollbar-container-box" v-loading="loadingState2" element-loading-background="rgba(0,0,0,0.1)" view-style="padding: 8px; min-height: 100%;">
                    <template v-if="workerData.length && !loadingState2">
                        <template v-for="(item,index) in workerData" :key="index">
                            <div class="server-item" @click="handleToAuthDetail(item)">
                                <div class="server-item-title">
                                    <div>{{item.categoryTitle}}</div>
                                    <el-button type="primary" round color="#F88212" size="small" @click.stop="handleOpenCreateOrder(item)">快速下单</el-button>
                                </div>
                                <div class="server-item-content">
                                    <div class="col-box col-1">
                                        <div class="content">
                                            <div class="context">
                                                <span>{{item.quotedPrice}}</span>
                                                <span class="background_icon-money"></span>
                                            </div>
                                            <div class="desc">{{item.unitName || '-'}}</div>
                                        </div>
                                    </div>
                                    <div class="col-box col-1">
                                        <div class="content">
                                            <div class="context">
                                                <span>{{item.price}}</span>
                                                <span class="background_icon-money"></span>
                                            </div>
                                            <div class="desc">起做</div>
                                        </div>
                                    </div>
                                    <div class="col-box col-1">
                                        <div class="content">
                                            <div class="context">
                                                <span>{{item.finishDay}}</span>
                                                <span>天</span>
                                            </div>
                                            <div class="desc">交付</div>
                                        </div>
                                    </div>
                                    <div class="col-box col-3">
                                        <div class="content" style="flex-direction: row; align-items:center; text-align:center;">
                                            <div style="flex: 1">
                                                <div class="context" style="font-size: 12px">{{item.tradeNum}}</div>
                                                <div class="desc">最近成交</div>
                                            </div>
                                            <div style="flex: 1">
                                                <div class="context" style="font-size: 12px">{{item.score}}</div>
                                                <div class="desc">雇主评分</div>
                                            </div>
                                            <div style="flex: 1">
                                                <div class="context" style="font-size: 12px">快</div>
                                                <div class="desc">响应速度</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                    <template v-else-if="!loadingState2">
                        <Empty></Empty>
                    </template>
                </el-scrollbar>
            </template>
        </div>
    </transition>
    <CreateOrder ref="CreateOrderRef"></CreateOrder>
</template>
<script setup>
import dayjs from 'dayjs';
import Empty from '@/components/Empty'
import SvgIcon from '@/components/SvgIcon';
import CreateOrder from '@/views/workspace/components/CreateOrder'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue';
import { getOrderRelation, getUserWorker } from '@/api/personnel/personnelManage'
const store = useStore();
const router = useRouter();
const current = ref(1);
const sessionItem = computed(() => store.state.IM.sessionItem)
const visibled = ref(false);
const CreateOrderRef = ref();
const handleClickTabbar = (e) => {
    current.value = e;
    getData();
}
const emits = defineEmits(['closed', 'opened'])
// 打开
const open = (e) => {
    if(visibled.value && e == current.value){
        return
    }else{
        visibled.value = true;
        current.value = e || current.value;
        emits('opened');
        getData();
    }

}

// 关闭
const close = () => {
    visibled.value = false;
    emits('closed')
}

const getData = () => {
    if (current.value == 1) {
        getRelationData();
    } else {
        getWorkerData();
    }
}

// 获取两人合作过的订单
const loadingState1 = ref(false);
const relationData = ref([])
const getRelationData = () => {
    if (loadingState1.value) {
        return
    }
    loadingState1.value = true;
    relationData.value = [];
    const userId = sessionItem.value.options.userId;
    const endTime = dayjs().format('YYYY-MM-DD');
    const startTime = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    const params = {
        endTime,
        startTime,
        partnerUserId: userId,
    }
    getOrderRelation(params).then(res => {
        console.log(sessionItem.value.options)
        relationData.value = res.data || [];
        loadingState1.value = false;
    }).catch(err => {
        loadingState1.value = false;
    })
}
// 获取工种认证列表
const loadingState2 = ref(false);
const workerData = ref([])
const getWorkerData = () => {
    if (loadingState2.value) {
        return
    }
    loadingState2.value = true;
    workerData.value = [];
    const userId = sessionItem.value.options.userId;
    const params = {
        userId: userId,
    }
    getUserWorker(params).then(res => {
        workerData.value = res.data || [];
        loadingState2.value = false;
    }).catch(err => {
        loadingState2.value = false;
    })
}

// 订单查看详情
const handleToDetail = (item)=>{
    const userId = sessionItem.value.options.userId;
    if(item.initiatorUserId == userId){
        router.push({ path: `/workspace/admin/order_detail/${item.orderNo}` })
    }else{
        router.push({ path: `/workspace/admin/goods_detail/${item.orderNo}` })
    }
}
// 查看工种详情
const handleToAuthDetail = (item)=>{
    // router.push({ path: `/workspace/work/${item.id}` });
}
const handleToOrderList = ()=>{
    router.push({ path: '/workspace/admin/goods' });
}

// 打开快速下单
const handleOpenCreateOrder = (e) => {
    CreateOrderRef.value.open(e)
}



defineExpose({
    open,
    close,
    visibled
})

</script>
<style scoped lang="scss">
.session_dialog-right {
    width: 300px;
    position: relative;
    overflow: hidden;
    height: 100%;
    background: #28292f;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.5),
        0px 0px 8px 0px rgba(0, 0, 0, 0.23);
    border-radius: 12px;
    transition: transform 0.3s ease;
    transform: translateX(-20px);
    z-index: 1;
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    .session_dialog-right-title {
        width: 100%;
        flex: none;
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid rgba($color: #ffffff, $alpha: 0.1);
        color: #9d9da1;
        display: flex;
        align-items: center;
        font-size: 14px;
        justify-content: center;
        padding-right: 60px;
        position: relative;
        .close-icon {
            width: 24px;
            height: 24px;
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-24px);
        }
        .title-tabbar-item {
            flex: auto;
            cursor: pointer;
            text-align: center;
            &.active {
                position: relative;
                &::after {
                    content: "";
                    display: inline-block;
                    position: absolute;
                    bottom: 0px;
                    width: 20px;
                    height: 4px;
                    left: 50%;
                    transform: translateX(-10px);
                    background-color: #3468fe;
                    border-radius: 2px;
                }
            }
        }
    }
    .scrollbar-container-box {
        flex: auto;
        width: 100%;
        overflow: hidden;
        .order-item {
            width: 100%;
            background: #141518;
            border-radius: 10px;
            overflow: hidden;
            font-size: 14px;
            margin-bottom: 10px;
            cursor: pointer;
            &-title {
                height: 40px;
                line-height: 40px;
                background: #1d1f23;
                color: #9094a6;
                padding: 0 16px;
            }
            &-content {
                padding: 16px 16px 0;
                .content-item {
                    padding-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .label {
                        flex: none;
                        color: #4e5262;
                        margin-right: 14px;
                    }
                    .context {
                        flex: auto;
                        color: #8d91a3;
                        margin-right: 14px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        &.price {
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            color: #f88212;
                        }
                    }
                }
                &::after {
                    content: "";
                    display: block;
                    width: 100%;
                    height: 1px;
                    margin-top: 6px;
                    background: rgba($color: #ffffff, $alpha: 0.1);
                }
            }
            &-footer {
                padding: 12px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #666a7a;
                .org {
                    color: #f88212;
                }
                .gre {
                    color: #0da411;
                }
                .red {
                    color: #e91e19;
                }
            }
        }
        .server-item {
            padding: 14px 16px;
            background: #141518;
            border-radius: 4px;
            margin-bottom: 14px;
            &-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 500;
                color: #ffffff;
                margin-bottom: 14px;
            }
            &-content {
                margin: -3px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: wrap;
                .col-box {
                    padding: 3px;
                    .content {
                        height: 65px;
                        padding: 8px;
                        background: #1d1f23;
                        border-radius: 4px;
                        display: flex;
                        align-items: flex-start;
                        justify-content: center;
                        flex-direction: column;
                        .context {
                            font-weight: 500;
                            font-size: 14px;
                            color: #e0e0e0;
                            margin-bottom: 4px;
                            .background_icon-money {
                                width: 10px;
                                height: 10px;
                                padding: 0;
                            }
                        }
                        .desc {
                            font-size: 12px;
                            color: #666a7a;
                        }
                    }
                    &.col-1 {
                        width: calc(100% / 3);
                        flex: none;
                    }
                    &.col-3 {
                        width: 100%;
                        flex: none;
                    }
                }
            }
        }
    }
}

.dialog_right-enter-active,
.dialog_right-leave-active {
    transition: transform 0.3s ease;
}
.dialog_right-enter-to,
.dialog_right-leave-from {
    transform: translateX(-20px);
}
.dialog_right-enter-from,
.dialog_right-leave-to {
    transform: translateX(-100%);
}
</style>