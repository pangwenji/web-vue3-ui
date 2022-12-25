<template>
    <div class="fapiao-container">
        <div class="top">
            <div class="top-title">发票管理</div>
            <span class="top-btn" @click="open = true" title="开票须知">
                <el-icon :size="18" color="#BEC0CD">
                    <InfoFilled />
                </el-icon>
            </span>
        </div>
        <!--        <div class="right-btn" @click="ticket(1)">集合开票</div>-->
        <!--        <div class="right-btn" @click="open = true">开票须知</div>-->

        <div class="header-content-top" style="margin: 20px 0px">
            <div class="header-left">
                <span class="tab" :class="{ active: activeId === item.id }" v-for="(item, index) in tabListShow" :key="index" @click="handleChangMain(item.id)">{{ item.title }}</span>
            </div>
            <div class="header-right">
                <el-date-picker v-model="time" type="daterange" value-format="YYYY-MM-DD" format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeChange()"
                    :clearable="false" />
            </div>
        </div>
        <div class="main">
            <div class="main-box">
                <div class="table-top-box" style="height: 93%;">
                    <div class="table-header">
                        <div class="check"></div>
                        <div class="table-top col1">订单名称</div>
                        <div class="table-top col2">金额</div>
                        <div class="table-top col3">开票类型</div>
                        <div class="table-top col4">开票内容</div>
                        <div class="table-top col5">税率</div>
                        <div class="table-top col6">开票抬头</div>
                        <div class="table-top col7">申请时间</div>
                        <div class="table-top col8">状态</div>
                        <div class="table-top col9">操作</div>
                    </div>
                    <div class="table-box table-main" v-if="OrderList.length >0 && !loading">
                        <el-scrollbar :height="scrollHeight" style="margin: 0 -20px;" view-style="padding: 0 20px;">
                            <transition name="table">
                                <div class="table" v-infinite-scroll="load" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.6)">
                                    <div class="table-item" v-for="item in OrderList" :key="item" :style="{background: (item.invoiceState === 0 || item.invoiceState === 2)  ? '#181920' : '#111216',
                       opacity: (checkedItems.length > 0 && (item.invoiceState === 0 || item.invoiceState === 2) ) ? '1' : (checkedItems.length === 0) ? '1' :'0.5'
                  }">

                                        <div class="check">
                                            <el-checkbox-group class="checkbox" v-model="checkedItems" @change="changeRowCheck">
                                                <div>
                                                    <el-checkbox size="large" :disabled="(item.invoiceState === 0 || item.invoiceState === 2) ? false : true" :label="item">{{ "" }}
                                                    </el-checkbox>
                                                </div>
                                            </el-checkbox-group>
                                        </div>
                                        <div class="col1">{{ item.orderName }}</div>
                                        <div class="col2">
                                            <template v-if="item.amount.toString().length > 5">
                                                <el-tooltip effect="light" raw-content :content="item.amount.toString()+'元'" placement="top-start">
                                                    <span>{{ item.amount }}元</span>
                                                </el-tooltip>
                                            </template>
                                            <template v-else>
                                                <span>{{ item.amount || 0 }}元</span>
                                            </template>
                                        </div>
                                        <div class="col3">增值税电子普通发票</div>
                                        <div class="col4">技术服务费</div>
                                        <div class="col5">3%</div>
                                        <div class="col6">
                                            <template v-if="item.invoiceTitle?.length > 10">
                                                <el-tooltip effect="light" raw-content :content="item.invoiceTitle" placement="bottom-start">
                                                    <span>{{ item.invoiceTitle }}</span>
                                                </el-tooltip>
                                            </template>
                                            <template v-else>
                                                <span>{{ item.invoiceTitle || "-" }}</span>
                                            </template>
                                        </div>
                                        <div class="col7">{{ parseTime(item.invoiceCreateTime, '{y}-{m}-{d}') || "-" }}</div>
                                        <div class="col8">
                                            <span v-if="item.invoiceState === 1">开票中</span>
                                            <span v-else-if="item.invoiceState === 2">已开票</span>
                                            <span v-else-if="item.invoiceState === 3">
                                                <el-tooltip effect="light" raw-content content="信息有误请重新填写" placement="bottom-start">
                                                    <img src="@/assets/user/fapiao/icon-err.png" style="width: 14px;height: 12px;cursor: pointer">
                                                </el-tooltip>
                                            </span>
                                        </div>
                                        <div class="col9">
                                            <span v-if="item.invoiceState === 0 && item.state != 3" @click="ticket(1,item)">申请开票</span>
                                            <span v-else-if="item.invoiceState === 3 && item.state != 3" @click="ticket(1,item)">重申开票</span>
                                            <span v-else-if="item.invoiceState === 2" @click="handleDownload(item)">下载发票</span>
                                            <span v-color="'#BEC0CD'" v-else>-</span>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </el-scrollbar>
                    </div>
                    <div class="table-box flex" v-else>
                        <div class="empty">{{ time[0] + ' 至 ' + time[1] }}期间无{{ activeId === null ? '消费' : activeId === 1 ? '未开票' : '已开票' }}订单 </div>
                    </div>
                </div>
                <div class="flexB fapiao-btm">
                    <div>
                        <span>共{{ total }}条订单</span>
                        <!--            <el-checkbox-group v-model="typeCheck" @change="changeCheck">-->
                        <!--              <el-checkbox label="0">本页全选（{{OrderList?.length}}条）</el-checkbox>-->
                        <!--              <el-checkbox label="1">全部全选（{{ total }}条）</el-checkbox>-->
                        <!--            </el-checkbox-group>-->
                    </div>
                    <div class="flex">
                        <div>
                            已选 <span v-color="'#F68112'">{{ checkedItems?.length }}</span> 条记录，金额为 <span v-color="'#F68112'">{{ checkedItems[0]?.amount || 0 }}</span> 元
                        </div>
                        <div class="right-btn" @click="ticket(1)" :style="{opacity: checkedItems?.length > 0 ? '1' : '0.5' }">
                            申请开票
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <word-dialog class="apply" :title="dTitle" :width="width" :openType="dialogType" v-model:show="ticketShow" @confirm="applyTicket" @onOpen="openDialog">
            <div class="apply-card">
                <el-form ref="approveFormRef" label-width="120px" label-position="left" hide-required-asterisk :rules="billRules" :model="billData">
                    <el-form-item label="开具类型：">
                        <el-radio-group v-model="billData.enterprise" class="ml-4" v-if="openType === 1" @change="changeRadio">
                            <el-radio label="0" size="large">个人</el-radio>
                            <el-radio label="1" size="large">企业</el-radio>
                        </el-radio-group>
                        <div v-else>{{ listData.enterprise === 0 ? '个人' : '企业' }}</div>
                    </el-form-item>
                    <el-form-item label="发票类型：">
                        <!--            <el-radio-group v-model="billData.ticketType" class="ml-4" v-if="openType === 1">-->
                        <!--              <el-radio label="1" size="large">增值税电子普通发票</el-radio>-->
                        <!--              &lt;!&ndash;el-radio label="2" size="large">增值税专用发票</el-radio&ndash;&gt;-->
                        <!--            </el-radio-group>-->
                        <div>增值税电子普通发票</div>
                    </el-form-item>
                    <el-form-item label="发票内容：">
                        <div v-if="openType === 1">信息技术服务费</div>
                        <div v-else> {{ listData.productName }}</div>
                    </el-form-item>

                    <el-form-item label="姓名：" prop="name" v-if=" openType === 1 ? billData.enterprise === '0' : listData.enterprise === 0">
                        <el-input v-model="billData.name" v-if="openType === 1 " />
                        <div v-else>{{ listData.name }}</div>
                    </el-form-item>
                    <el-form-item label="身份证号：" prop="idNumber" v-if=" openType === 1 ? billData.enterprise === '0' : listData.enterprise === 0">
                        <el-input v-model="billData.idNumber" v-if="openType === 1 " />
                        <div v-else>{{ listData.taxId }}</div>
                    </el-form-item>

                    <el-form-item label="单位名称：" prop="unitName" v-if="openType === 1 ? billData.enterprise !== '0' : listData.enterprise !== 0">
                        <el-input v-model="billData.unitName" v-if="openType === 1" />
                        <div v-else>{{ listData.name }}</div>
                    </el-form-item>
                    <el-form-item label="纳税识别号：" prop="taxId" v-if="openType === 1 ? billData.enterprise !== '0' : listData.enterprise !== 0">
                        <el-input v-model="billData.taxId" v-if="openType === 1" />
                        <div v-else>{{ listData.taxId }}</div>
                    </el-form-item>

                </el-form>
            </div>
        </word-dialog>

        <!--    开票须知-->
        <word-dialog class="apply" title="开票须知" width="500px" :openType="0" :showButton="false" @confirm="open = false" v-model:show="open">
            <div class="apply-card">
                <div>1、为了保证您的合法权益，为您开具由税务机关监制的指定电子发票</div>
                <div>2、电子发票申请后，信息提供无误的情况下，5-15个工作日内开出</div>
                <div>3、如需申请纸质发票，信息提供无误的情况下，5-15个工作日内寄出</div>
                <div>4、纸质发票的快递费需您自行承担（默认顺丰到付)</div>
                <div>5、发票一经开出，恕不退还，请您认真核对信息无误</div>
                <div>6、发票默认为增值税普通发票，若需开增值税专用发票，请联系在线客服</div>
            </div>
        </word-dialog>

    </div>
</template>
<script setup>
import WordDialog from '../components/WordDialog'
import { ref, reactive } from "vue";
import { applyInvoice, getMemberList, invoiceData } from "@/api/user";
import { onMounted, watch } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { downloadFile } from "@/utils/tool";
import { parseTime } from "@/utils/ruoyi";

const activeId = ref(null)
const dTitle = ref('')
const width = ref('480px')
const ticketType = ref('1')//发票类型
const taxId = ref('')//纳税人识别号
const name = ref('')//个人名称
const email = ref('')//邮箱
const unitName = ref('')//单位名称
const enterprise = ref('0')//是否企业 0否 1是
const ticketShow = ref(false)
const open = ref(false)
const OrderList = ref([])
const params = reactive({
    pageNum: 1,
    pageSize: 15,
    invoiceState: null,
})
const date = new Date();
date.setDate((new Date().getDate() - 7))
const time = ref([
    parseTime(date.toJSON(), '{y}-{m}-{d}'),
    parseTime(new Date(), '{y}-{m}-{d}'),
])
const billRules = {
    unitName: [{ required: true, trigger: 'blur', message: '请输入单位名称' }, { min: 1, max: 50, message: "单位名称过长", trigger: "blur" }],
    taxId: [{ required: true, trigger: 'blur', message: '请输入纳税人识别号' }, { min: 1, max: 40, message: "请输入正确的纳税人识别号", trigger: "blur" }],
    idNumber: [{ required: true, validator: validateIdNumber, trigger: 'blur' }],
    name: [{ required: true, trigger: 'blur', message: '请输入姓名' }, { min: 1, max: 20, message: "请输入正确的姓名", trigger: "blur" }],
};
function validateIdNumber(rule, value, callback) {
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error('请输入正确的身份证号'));
    }
};
const billData = ref({
    unitName: '',
    taxId: '',
    idNumber: '',
    name: '',
    ticketType: '',
    enterprise: '0',
    orderNo: '',
})

const total = ref(0)
const loading = ref(false)
//划到底部加载
const load = () => {
    if (params.pageNum < pageCount.value) {
        params.pageNum = 1
        params.pageSize = params.pageSize + 10
        getMemberOrderList()
    }
}
//时间改变
const timeChange = () => {
    getMemberOrderList()
}
// 禁用今天之后的日期
const forbiddenTime = (time) => {
    return time.getTime() > Date.now();
}
let tabListShow = ref([
    { title: '全部', id: null },
    { title: '未开票', id: 1 },
    { title: '已开票', id: 2 },
])
//头部标签选择改变
const handleChangMain = (type) => {
    if (type === activeId.value) return;
    params.pageNum = 1;
    activeId.value = type
    params.invoiceState = activeId.value;
    checkedItems.value = []
    getMemberOrderList()
}

onMounted(() => {
    getMemberOrderList()
});

const changeRadio = () => {
    billData.value.name = ''
    billData.value.taxId = ''
    billData.value.idNumber = ''
    billData.value.unitName = ''
}
const listData = ref([])
const orderNo = ref()
const openType = ref(1)
const dialogType = ref()

//申请开票打开弹窗
const ticket = (t, item) => {
    if (item) {
        billData.value.orderNo = item.orderNo
        ticketShow.value = true
    } else if (!item && checkedItems.value.length > 0) {
        billData.value.orderNo = checkedItems.value[0].orderNo
        ticketShow.value = true
    } else {
        ElMessage({ message: '请先选择需要开票的订单！', type: 'warning', })
    }
    if (t === 1) {
        openType.value = 1
        dTitle.value = '申请开票'
    } else {
        dTitle.value = '开票信息'
        openType.value = 2
        dialogType.value = 0
        invoiceData({ orderNo: item.orderNo }).then(res => {
            listData.value = res.data
        })
    }

}

const openDialog = () => {
    if (openType.value === 1) {
        billData.value.enterprise = '0'
        billData.value.name = ''
        billData.value.unitName = ''
        billData.value.taxId = ''
        billData.value.idNumber = ''
    }

}

//获取会员订单
const MemberOrderList = ref([])
const pageCount = ref(0)
//滚动高度
const scrollHeight = ref('645px')

function getMemberOrderList() {
    loading.value = true
    params.startTime = parseTime(time.value[0]);
    params.endTime = parseTime(time.value[1], '{y}-{m}-{d}') + ' 23:59:59';
    getMemberList(params).then(res => {
        OrderList.value = res.rows
        total.value = res.total;
        pageCount.value = res.pageCount
        //列表高度-5
        let height = OrderList.value.length * 65 - 5
        //表格容器高度
        let tableHeight = document.getElementsByClassName('table-top-box')[0]?.offsetHeight || 0
        //滚动区域高度
        let actualHeight = document.getElementsByClassName('table')[0]?.offsetHeight || height
        if (actualHeight > tableHeight) {
            scrollHeight.value = tableHeight - 32 + 'px'
        } else if (actualHeight < tableHeight) {
            scrollHeight.value = height + 'px'
        }
        loading.value = false
    })
}

/**
 * 申请开票
 */
const { proxy } = getCurrentInstance();
const applyTicket = async () => {
    const query = {}
    if (billData.value.enterprise === '0') {
        await proxy.$refs.approveFormRef.validateField('name');
        await proxy.$refs.approveFormRef.validateField('idNumber');
        billData.value.taxId = billData.value.idNumber
    } else {
        await proxy.$refs.approveFormRef.validateField('unitName');
        await proxy.$refs.approveFormRef.validateField('taxId');
        billData.value.name = billData.value.unitName
    }

    applyInvoice(billData.value).then(res => {
        ElMessage({
            message: res.msg,
            type: 'success',
        })
        ticketShow.value = false
        getMemberOrderList()
    })
}

/**
 * 下载
 */
const handleDownload = (data) => {
    data.sourceUrls.forEach((url, index) => {
        const fileName = "发票" + (index === 0 ? '' : (index + 1))
        // downloadFile(url, fileName)
        handleDown(url, fileName)
    })
}

function handleDown(url, name) {
    let link = url
    let fileName = name
    let x = new XMLHttpRequest()
    x.open('GET', link, true)
    x.responseType = 'blob'
    x.onload = (e) => {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
    }
    x.send()
}

const typeCheck = ref()
const changeCheck = () => {
    if (typeCheck.value.length > 1) {
        typeCheck.value.splice(0, 1)
    }
}
const checkedItems = ref([])
const changeRowCheck = () => {
    if (checkedItems.value.length > 1) {
        checkedItems.value.splice(0, 1)
    }
}

</script>
<style scoped lang="scss">
@import "./style.scss";
@import "../style.scss";

:deep(.el-checkbox__inner) {
    border: none;
    background: url("@/assets/user/fapiao/check-1.png");

    &::after {
        content: none;
    }
}

:deep(.el-checkbox__input is-checked) {
    border: none;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: url("@/assets/user/fapiao/check-3.png");
}

:deep(.el-checkbox__input is-disabled) {
    border: none;
}

:deep(.el-checkbox__input.is-disabled .el-checkbox__inner) {
    background: url("@/assets/user/fapiao/check-2.png");
}
</style>
