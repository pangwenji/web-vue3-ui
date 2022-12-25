<template>
    <div class="box">
        <div class="top-title">我的钱包</div>
        <div class="head-box">
            <div class="left-box">
                <div class="item">
                    <div class="item-top">
                        <span class="sum">{{ moneyBalance || 0 }}</span>
                        <span class="background_icon-money"></span>
                    </div>
                    <div class="item-desc">
                        <span style="margin-right: 4px;">可用</span>
                        <el-tooltip class="box-item" effect="light" content="可用=购买的同钱+可提现的同钱" placement="bottom">
                            <QuestionFilled style="width: 12px; height: 12px; margin-right: 8px;background: #1C1D24;" />
                        </el-tooltip>
                    </div>
                </div>
                <div class="line"></div>
                <div class="item">
                    <div class="item-top">
                        <span class="sum2">{{ payInfo.frozenBalance || 0 }} </span>
                        <span class="background_icon-money"></span>
                    </div>
                    已托管
                </div>
                <div class="line"></div>
                <div class="item">
                    <div class="item-top">
                        <span class="sum2">{{ canWithdraw || 0 }} </span>
                        <span class="background_icon-money"></span>
                    </div>
                    <div class="item-desc">
                        <span style="margin-right: 4px;">可提现</span>
                        <el-tooltip class="box-item" effect="light" raw-content content="1、可提现金额已扣除10%的服务费；<br>2、满50同钱可提现；<br>3、到账时间1-5个工作日内。" placement="bottom">
                            <QuestionFilled style="width: 12px; height: 12px; margin-right: 8px;background: #1C1D24;" />
                        </el-tooltip>
                    </div>
                </div>
            </div>

            <div>
                <div class="right-box">
                    <div class="item">
                        <div class="withdraw" @click="withdrawMethod">提现</div>
                    </div>
                    <div class="item">
                        <div class="buy" @click="OpenRecharge">购买同钱</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="header-content-top">
            <div class="header-left">
                <template v-for="(item, index) in tabListShow" :key="index">
                    <el-tooltip class="box-item" effect="light" :content="item.desc" placement="top">
                        <span class="tab" :class="{ active: activeId === item.id }" @click="handleChangMain(item.id)">{{ item.title }}</span>
                    </el-tooltip>
                </template>
            </div>
            <div class="header-right" v-if="activeId == 1">
                <div class="dropdown-link-box">
                    <el-dropdown @command="handleCommand">
                        <span class="dropdown-link">
                            <span>{{billTypeData.title}}</span>
                            <el-icon class="el-icon--right">
                                <caret-bottom />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <template v-for="(item,index) in billTypeList" :key="index">
                                    <el-dropdown-item :class="{active: item.type === billTypeData.type}" :command="item">{{item.title}}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <el-date-picker v-model="time" type="daterange" value-format="YYYY-MM-DD" format="YYYY-MM-DD" range-separator="至" :shortcuts="shortcuts" :disabled-date="forbiddenTime"
                    :clearable="false" />
                <span class="reset-daterange" @click="handleResetDate">重置日期</span>
                <span class="export-records" @click="handleExportLog">
                    <el-icon class="el-icon--left">
                        <Download />
                    </el-icon>导出记录
                </span>
            </div>
        </div>
        <BondList ref="BondListRef" v-if="activeId == 2" @onSubmit="getPayAccountGetInfo"></BondList>
        <KeepList ref="KeepListRef" v-else-if="activeId == 3"></KeepList>
        <WalletList ref="WalletListRef" v-else-if="activeId == 1" :time="time" :billType="billTypeData.type"></WalletList>
        <!-- 提现弹窗 -->
        <word-dialog :title="withdrawTitle" desc="提现后将在1-5个工作日内到账，如遇节假备份" v-model:show="withdrawShow" @confirm="withdrawConfirm()" @onOpen="withdrawDialogOpen">
            <div class="approve-card">
                <el-form ref="approveFormRef" :model="withdrawForm" :rules="withdrawRules" label-width="120px" label-position="left">
                    <el-form-item label="可提现余额：" prop="name">
                        <span style="color: #F88212; font-size: 16px;">{{ (Math.floor((payInfo.balance - payInfo.rechargeBalance) * 100) / 100) || 0 }}</span>
                    </el-form-item>
                    <el-form-item label="申请提现金额：" prop="amount" class="other">
                        <el-input v-model="withdrawForm.amount" size="large" auto-complete="off" placeholder="请输入提现金额" autocomplete="off" style="margin-bottom: 5px">
                            <template #prefix>
                                <span style="color: #F88212; font-size: 16px; padding-top: 3px;">￥</span>
                            </template>
                        </el-input>
                        <!--            <el-input-number-->
                        <!--                :min="1"-->
                        <!--                :max="payInfo.balance-payInfo.rechargeBalance || 0"-->
                        <!--                :controls="false"-->
                        <!--                style="width: 100%;"-->
                        <!--                v-model.number="withdrawForm.amount" placeholder="请输入提现金额" size="large"/>-->
                    </el-form-item>
                    <el-form-item label="提现的账户：" prop="idcard">
                        <span style="color: #C5C7D4; font-size: 14px; ">{{ bankData.bankName }}&nbsp;&nbsp;{{ bankData.account }}</span>
                    </el-form-item>
                    <el-form-item label="手机验证码" prop="payPassword" class="other">
                        <div style="width:100%; display:flex; align-items:center;justify-content:center">
                            <el-input v-model="withdrawForm.code" style="flex:auto;" size="large" type="text" placeholder="请输入手机验证码">
                            </el-input>
                            <el-button type="primary" size="large" plain :loading="(countDown < 0)" style="width: 110px; flex:none; margin-left: 10px" :disabled="countDown > 0" color="#3468FE" @click="getCode" >
                                <span v-if="(countDown > 0)">已发送{{countDown}}</span>
                                <span v-else-if="(countDown < 0)">正在发送</span>
                                <span v-else>发送验证码</span>
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="支付密码：" prop="payPassword" class="other">
                        <el-input v-model="withdrawForm.payPassword" auto-complete="off" size="large" type="password" placeholder="请输入支付密码" autocomplete="new-password" style="margin-bottom: 5px">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </word-dialog>
    </div>
</template>
<script setup>
import { ref, reactive, onUnmounted } from 'vue'
// import { sendSmsVerificationCode } from "@/api/login";
import { getPhoneCode } from "@/api/user";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from 'element-plus'
import { pledgeRefund, payAccountGetInfo, rechargeRefund } from "@/api/pay/pay";
import { getBankCard } from "@/api/user";
import WordDialog from '../components/WordDialog'
import { parseTime } from "@/utils/ruoyi";
import { computed } from "@vue/runtime-core";
import { withdrawRecord } from "@/api/user/wallet";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
import BondList from './BondList.vue'
import KeepList from './KeepList.vue'
import WalletList from './WalletList.vue'

// 监听充值成功得回调
const handlePayWatch = ({ noticeType, sourceData }) => {
    if (noticeType == 1) { //充值成功
        getPayAccountGetInfo();
        WalletListRef.value.getData()
    }else if(noticeType == 5){
        getPayAccountGetInfo()
    }
}
// 监听拒绝订单、订单退款、确认验收的回调
const handleWorkerOrderStatus = ({ noticeType, sourceData }) => {
    if (noticeType == 10) { //充值成功
        const status = sourceData.order.status;
        if (status == 2 || status == 6 || status == 9) {
            getPayAccountGetInfo();
        }
    }
}
onUnmounted(() => {
    IM_EVENT_LISTERNER.removeEventListenerIM('PAY', handlePayWatch);
    IM_EVENT_LISTERNER.removeEventListenerIM('WORKER', handleWorkerOrderStatus);
})
IM_EVENT_LISTERNER.addEventListenerIM('PAY', handlePayWatch);
IM_EVENT_LISTERNER.addEventListenerIM('WORKER', handleWorkerOrderStatus);


const router = useRouter();
const store = useStore();
const BondListRef = ref();
const KeepListRef = ref();
const WalletListRef = ref();
const activeId = ref(1)
const userInfo = store.state.user
const withdrawTitle = ref('提现')
const refundTitle = ref('订单申请退款')
const withdrawShow = ref(false)
const refundShow = ref(false)
const loadingStatus = ref(false)
const moneyBalance = computed(() => store.state.user.money)

const time = ref([])

const tabListShow = ref([
    { title: '钱包记录', id: 1, desc: '用同钱结算的订单' },
    { title: '保证金', id: 2, desc: '用工保证金' },
    { title: '托管', id: 3, desc: '招募预算托管' },
])

const billTypeData = ref({
    type: 0,
    title: '全部',
})

const billTypeList = [
    {
        type: 0,
        title: '全部',
    },
    {
        type: 1,
        title: '充值',
    },
    {
        type: 2,
        title: '支出',
    },
    {
        type: 3,
        title: '收入',
    },
    {
        type: 4,
        title: '退款',
    },
    {
        type: 5,
        title: '提现',
    },
]

const handleCommand = (e) => {
    if (e.type == billTypeData.value.type) {
        return
    }
    billTypeData.value = e;
}

//类型改变
const handleChangMain = (type) => {
    if (type === activeId.value) return;
    activeId.value = type;
}
// 重置日期
const handleResetDate = () => {
    const date = new Date();
    date.setDate((new Date().getDate() - 7));
    const startTime = parseTime(date.toJSON(), '{y}-{m}-{d}');
    const endTime = parseTime(new Date(), '{y}-{m}-{d}');
    if (time.value[0] == startTime && time.value[1] == endTime) {
        return
    }
    time.value = [
        startTime,
        endTime,
    ]
}
handleResetDate();

const withdrawForm = reactive({})
const withdrawRules = reactive({
    amount: [{ required: true, message: '请输入申请提现金额', trigger: 'blur' }, { pattern: /^(\d{0,5})(\.(\d{0,2}))?$/g, message: '单次申请提现金额不得超过99999元', trigger: 'blur' }],
    payPassword: [{ required: true, message: '请输入支付密码', trigger: 'blur' }]
})
const countDown = ref(0);
let countDownInter;
const getCode = () => {
    countDown.value = -1;
    getPhoneCode({
        phone: rphone.value
    }).then(res => {
        countDown.value = 60;
        countDownInter = setInterval(() => {
            countDown.value -= 1;
            if (countDown.value <= 0) {
                countDown.value = 0;
                clearInterval(inter)
            }
        }, 1000)
    }).catch(err=>{
        countDown.value = 0;
    })
}

onUnmounted(()=>{
    if(countDownInter){
        clearInterval(countDownInter)
    }
})

/**
 * 提交提现申请
 */
const withdrawConfirm = async () => {
    await proxy.$refs.approveFormRef.validateField('amount');
    await proxy.$refs.approveFormRef.validateField('payPassword');
    withdrawForm.bankCardId = bankData.value.id
    withdrawRecord(withdrawForm).then(res => {
        getPayAccountGetInfo();
        WalletListRef.value.getData()
        withdrawShow.value = false;
        ElMessage({ message: '提现申请提交成功', type: 'success', })
    })
}

const withdrawDialogOpen = () => {
    withdrawForm.amount = ''
    withdrawForm.payPassword = ''
}

const payInfo = ref({})
/**
 * 获取信息
 */
const getPayAccountGetInfo = () => {
    store.dispatch('getPayAccountGetInfo').then(res => {
        payInfo.value = res.data;
        canWithdraw.value = Math.floor((payInfo.value.balance - payInfo.value.rechargeBalance) * 100) / 100
    })
}
getPayAccountGetInfo();


/**
 * 禁用今天之后的日期
 * @param time
 * @returns {boolean}
 */
const forbiddenTime = (time) => {
    return time.getTime() > Date.now();
}

const handleExportLog = () => {
    if (activeId.value == 1) {
        WalletListRef.value.handleExportLog && WalletListRef.value.handleExportLog()
    }
}


const shortcuts = [
    {
        text: '最近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '最近一个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '最近三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]


/**
 * 退款
 */
const thisItem = ref({})
const reimburse = (item) => {
    thisItem.value = item;
    refundShow.value = true
}


/**
 * 获取银行卡信息
 */
const bankData = ref('')
/**
 * 打开提现窗口
 * @type {Ref < UnwrapRef < string >>}
 */
const phone = ref('')
const rphone = ref('')
const canWithdraw = ref(0)
const withdrawMethod = () => {
    if (canWithdraw.value <= 0) {
        ElMessage({
            message: '当前可提现余额为0！',
            type: 'warning',
        })
        return;
    }
    if (canWithdraw.value < 50) {
        ElMessage({
            message: '当前可提现余额不足50，暂时不可提现！',
            type: 'warning',
        })
        return;
    }
    getBankCard().then(res => {
        if (res.data) {
            bankData.value = res.data;
            rphone.value = userInfo.name;
            phone.value = rphone.value.slice(0, 3) + "****" + rphone.value.slice(7)
            withdrawShow.value = true;
        } else {
            ElMessage.warning('请先添加银行卡')
        }
    })
}
/**
 * 购买同钱
 */
let { proxy } = getCurrentInstance();
const OpenRecharge = () => {
    proxy.$pay.openRecharge({})
}

//用户余额变化刷新页面数据
const money = computed(() => {
    return store.state.user.money
})

</script>

<style scoped lang="scss">
@import "./style.scss";

.apply-card {
    font-size: 14px;
    font-weight: 400;
    color: #4e5262;
    line-height: 21px;
    margin-top: 20px;

    .item {
        height: 50px;
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }

    .left {
        width: 35%;

        div {
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }

    .right {
        width: 60%;

        div {
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
        }
    }
}

.table-enter-from {
    opacity: 0;
}

.table-enter-active {
    transition: all 0.2s;
}

.table-enter-to {
    opcaity: 1;
}

.textHover {
    &:hover {
        color: #53a8ffc2;
        text-decoration: underline;
        cursor: pointer;
    }
}
.flexC {
    display: flex;
    align-items: center;
}
</style>
<style lang="scss">
.approve-card {
    .other {
        .el-input {
            --el-input-bg-color: #f5f6f9 !important;
            --el-input-border-color: #f5f6f9 !important;
            --el-input-placeholder-color: #c5c7d4 !important;
            .el-input__inner {
                --el-input-bg-color: #f5f6f9 !important;
                --el-input-border-color: #f5f6f9 !important;
                --el-input-placeholder-color: #c5c7d4 !important;
                // height: 4px;
                // background: #FFFFFF;
                // border-radius: 10px;
            }
        }
    }
}
</style>
