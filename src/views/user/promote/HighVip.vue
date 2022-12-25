<template>
    <div class="wrapper">
        <!-- 头部 -->
        <div class="head">
            <div class="h-desc">当前代理等级：</div>
            <div class="h-level">{{proxyInfo.proxyLevel}}</div>
            <div class="h-time">代理到期时间：{{proxyInfo.proxyEndTime}}</div>
        </div>
        <!-- 邀请信息 -->
        <div class="invite">
            <div class="i-up">
                <div class="item-box">
                    <div class="i-label">{{proxyInfo.totalCount}}</div>
                    <div class="i-txt">总推广人数</div>
                </div>
                <div class="item-box">
                    <div class="i-label">{{proxyInfo.thisMonthCount}}</div>
                    <div class="i-txt">本月新增</div>
                </div>
                <div class="item-box">
                    <div class="i-label">{{proxyInfo.inviteUserCount}}<span class="total-num"> / {{proxyInfo.shareQuantity}}</span></div>
                    <div class="i-txt">赠送账户</div>
                </div>
                <div class="item-box">
                    <div class="i-label">{{proxyInfo.shareUrlCount}}</div>
                    <div class="i-txt">邀请链接</div>
                </div>
            </div>
            <div class="i-down">
                <div class="d-title">
                    <div class="title">会员推广说明</div>
                    <div class="check" @click="toggleTips">查看<el-icon :class="[isShowTips ? 'reverse' : 'move', 'iconArr']"><ArrowDown /></el-icon></div>
                </div>
                <div class="d-tips" v-if="isShowTips">
                    <div class="tips">1、您当前的代理级别为VIP{{proxyInfo.proxyLevelNum}} <span class="tips-click" @click="showTable('table')">查看收益梯度表</span></div>
                    <div class="tips">2、如需提升返佣等级、咨询代理政策，点击扫码<span class="tips-click" @click="showTable('qrcode')">咨询客服</span></div>
                    <div class="tips">3、凡是平台发现以任何不正当手段获取奖励的，平台有权收回奖励，情节严重将封禁账号，并保留追究用户责任权力。</div>
                    <div class="tips">4、本推广活动最终解释权归平台所有</div>
                </div>
            </div>
        </div>
        <!-- 表格展示 -->
        <div class="content">
            <div class="toolBar">
                <div class="left">
                    <span class="tab" :class="{ 'active-tab': activeTab === item.type }" v-for="(item, index) in tabListShow" :key="index" @click="handleChangMain(item.type)">
                        {{ item.title }}
                    </span>
                </div>
                <div class="right">
                    <el-form v-if="activeTab != 'inviteLink'" :inline="true" :model="formData" class="search-form">
                        <el-form-item>
                            <el-date-picker
                                v-model="timeRange"
                                @change="changeDate"
                                type="daterange"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD"
                                :shortcuts="shortcuts"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="formData.keyword" @keyup.enter="searchKeyword" :prefix-icon="Search" placeholder="回车搜昵称/手机号"/>
                        </el-form-item>
                    </el-form>
                    <!-- 邀请码 tool -->
                    <div v-if="isShowCode" class="active-btn">
                        <el-button @click="showActiveDlg" color="#3468FE" type="primary" size="small" class="btn" round>激活账户</el-button>
                    </div>
                    <!-- 邀请链接 tool -->
                    <div v-if="isShowLink">
                        <el-button @click="showInviteDlg" color="#3468FE" type="primary" size="small" class="btn" round>添加邀请链接</el-button>
                    </div>
                </div>
            </div>
            <div class="table-box">
                <!-- 拉新记录 -->
                <el-table v-if="isShowRecord" :data="promoteList" style="width: 100%">
                    <el-table-column prop="nickName" label="新用户昵称"/>
                    <el-table-column prop="userName" label="绑定手机"/>
                    <el-table-column prop="createTime" label="用户注册时间" sortable/>
                    <el-table-column prop="inviteTitle">
                        <template #header>
                            <!-- 筛选 -->
                            <el-popover placement="bottom" :width="160" trigger="click">
                                <template #reference>
                                    <span>链接名称<el-icon><Filter /></el-icon></span>
                                </template>
                                <el-scrollbar style="height:300px">
                                    <el-checkbox-group v-model="inviteTitle" @change="changeInviteTitle" :max="1" style="display:flex;flex-direction: column;">
                                        <el-checkbox v-for="(item, i) in linkTitles" :label="item" :key="i"/>
                                    </el-checkbox-group>
                                </el-scrollbar>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inviteCode">
                        <template #header>
                            <!-- 筛选 -->
                            <el-popover placement="bottom" :width="160" trigger="click">
                                <template #reference>
                                    <span>邀请码<el-icon><Filter /></el-icon></span>
                                </template>
                                <el-scrollbar style="height:300px">
                                    <el-checkbox-group v-model="searchCode" @change="changeInviteCode" :max="1">
                                        <el-checkbox v-for="(item, i) in codeList" :label="item" :key="i"/>
                                    </el-checkbox-group>
                                </el-scrollbar>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="memberType">
                        <template #header>
                            <!-- 筛选 -->
                            <el-popover placement="bottom" :width="100" trigger="click">
                                <template #reference>
                                    <span>会员类别<el-icon><Filter /></el-icon></span>
                                </template>
                                <el-checkbox-group v-model="vipType" @change="changeVipType" :max="1">
                                    <el-checkbox v-for="item in vipOptions" :label="item.label" :key="item.value">{{item.txt}}</el-checkbox>
                                </el-checkbox-group>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vipBigTime" label="会员开通日期">
                        <template #default="scope">
                            <span>{{ scope.row.vipBigTime || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vipEndTime" label="会员到期日">
                        <template #default="scope">
                            <span>{{ scope.row.vipEndTime || '-' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 购买记录 -->
                <el-table v-if="isShowRecharge" :data="rechargeList" style="width: 100%">
                    <el-table-column prop="nickName" label="昵称"/>
                    <el-table-column prop="userName" label="绑定手机"/>
                    <el-table-column prop="memberType" label="充值类型">
                        <template #default="scope">
                            <span>{{ scope.row.memberType == 'giving' ? '赠送' : '购买' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="用户注册时间" />
                    <el-table-column prop="startTime" label="会员开通日期" sortable/>
                    <el-table-column prop="endTime" label="会员到期日" />
                </el-table>
                <!-- 账户管理 -->
                <el-table v-if="isShowCode" :data="inviteCodeList" style="width: 100%">
                    <el-table-column prop="nickName" label="昵称"/>
                    <el-table-column prop="userName" label="绑定手机"/>
                    <el-table-column prop="createTime" label="用户注册时间" />
                    <el-table-column prop="proxyLevelStr" label="会员类别"/>
                    <el-table-column prop="startTime" label="会员开通日期" sortable/>
                    <el-table-column prop="endTime" label="会员到期日" />
                </el-table>
                <!-- 邀请链接 -->
                <el-table v-if="isShowLink" :data="shareLinkList" style="width: 100%">
                    <el-table-column prop="title" label="链接名称" width="200"/>
                    <el-table-column prop="inviteCode" label="邀请码" width="100"/>
                    <el-table-column prop="inviteUrl" label="邀请链接">
                        <template #default="scope">
                            <span style="margin-right:20px;">{{ scope.row.inviteUrl }}</span><span @click="copyLink(scope.row.inviteUrl)" class="operate">复制链接</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="添加日期" sortable/>
                    <el-table-column prop="name" label="操作" width="80">
                        <template #default="scope">
                            <span class="operate" @click="delLink(scope.row.id)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 分页 -->
        <pagination 
            :total="total"
            :page="pageConfig.pageNum"
            :limit="pageConfig.pageSize"
            @pagination="getList"
            position="right"/>
    </div>
    <!-- 弹窗 -->
    <inviteDialog ref="inviteRef" title="新增邀请链接" @addLinkSucc="reloadTable" :close-on-click-modal="false"></inviteDialog>
    <activeDialog ref="activeRef" title="激活账户" @activeSucc="reloadTable" :close-on-click-modal="false"></activeDialog>
</template>

<script setup>
import "dayjs/locale/zh-cn"
import dayjs from "dayjs"
import toObject from "dayjs/plugin/toObject"
import { ref, reactive, computed, watch } from 'vue'
import inviteDialog from "./inviteDialog.vue"
import activeDialog from "./activeDialog.vue"
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { 
    myPromoteList,
    getInviteCodeList,
    getInviteLinkList,
    getRechargeList,
    delShareLink, 
    getInviteCodes, 
    getInviteTitle } from '@/api/user/promote'

dayjs.locale('zh-cn')
dayjs.extend(toObject)
const { proxy } = getCurrentInstance()

const emit = defineEmits(['reloadProxyInfo', 'showTable'])
const props = defineProps({
    // 代理推广信息
    proxyInfo: Object,
    // 粘贴板
    toClipboard: Function
})
// 分页配置
const total = ref(0)
const pageConfig = reactive({
    pageSize: 12,
    pageNum: 1
})
const tabListShow = [
    { title: '拉新记录', type: 'inviteRecord' },
    { title: '购买记录', type: 'rechargeRecord'},
    { title: '账户管理', type: 'inviteCode' },
    { title: '邀请链接', type: 'inviteLink' }
]

// 选项处理 - 快捷时间
const dayObj = dayjs().toObject()
const endDate = dayjs().endOf('month').format('YYYY-MM-DD')
const shortcuts = [
  {
    text: '前一个月',
    value: () => {
      const end = new Date(endDate)
      const start = new Date(dayjs().startOf('month').format('YYYY-MM-DD'))
      return [start, end]
    }
  }, {
    text: '前两个月',
    value: () => {
      const end = new Date(endDate)
      const start = new Date(dayjs(`${dayObj.years}-${dayObj.months - 1}`).startOf('month').format('YYYY-MM-DD'))
      return [start, end]
    }
  }
]

// 初始化 - 获取拉新记录列表
const promoteList = ref([])
const getPromoteList = (params = {})=> {
    myPromoteList({
        ...pageConfig,
        ...params,
        orderByColumn: 'u.create_time',
        isAsc: 'desc'
    }).then(res => {
        promoteList.value = res.rows
        total.value = res.total
    })
}

// 初始化 - 获取购买记录列表
const rechargeList = ref([])
const getRechargeRecord = (params = {})=> {
    getRechargeList({
        ...pageConfig,
        ...params,
        orderByColumn: 'r.create_time',
        isAsc: 'desc'
    }).then(res => {
        rechargeList.value = res.rows
        total.value = res.total
    })
}

// 初始化 - 获取账户管理列表
const inviteCodeList = ref([])
const getCodeList = (params = {})=> {
    getInviteCodeList({
        ...pageConfig,
        ...params,
        orderByColumn: 'u.create_time',
        isAsc: 'desc'
    }).then(res => {
        inviteCodeList.value = res.rows
        total.value = res.total
    })
}

// 初始化 - 获取分享链接列表
const shareLinkList = ref([])
const getLinkList = ()=> {
    getInviteLinkList({
        ...pageConfig,
        orderByColumn: 'create_time',
        isAsc: 'desc'
    }).then(res => {
        shareLinkList.value = res.rows
        total.value = res.total
    })
}

// 初始化 - 获取邀请码枚举
const codeList = ref([])
const getCodeEnum = ()=> {
    getInviteCodes().then(res => {
        codeList.value = res.data
    })
}

// 初始化 - 获取邀请链接名称
const linkTitles = ref([])
const getLinkTitle = ()=> {
    getInviteTitle().then(res => {
        linkTitles.value = res.data
    })
}

// emit - 重载表格
const reloadTable = (type)=> {
    switch (type) {
        case 'link':
            getLinkList()
            emit('reloadProxyInfo')
        break
    
        case 'code':
            getCodeList()
            emit('reloadProxyInfo')
        break
    }
}

// 表单 - 数据
const formData = reactive({
    keyword: '',
    endTime: '',
    startTime: '',
    inviteCode: '',
    memberState: ''
})
// 筛选 - 会员类型
const vipType = ref([])
const vipOptions = ref([
    {txt: '体验会员', label: '0'},
    {txt: '个人会员', label: '1'}
])
const changeVipType = ()=> {
    formData.memberState = vipType.value[0]
    getPromoteList(formData)
}

// 筛选 - 邀请码
const searchCode = ref([])
const changeInviteCode = ()=> {
    formData.inviteCode = searchCode.value[0]
    getPromoteList(formData)
}

// 筛选 - 链接名称
const inviteTitle = ref([])
const changeInviteTitle = ()=> {
    formData.inviteTitle = inviteTitle.value[0]
    getPromoteList(formData)
}

// 筛选 - 昵称or手机号
const searchKeyword = ()=> {
    getDataByTab(activeTab.value, formData)
}

// 点击 - 切换标签
const isShowRecord = computed(()=> activeTab.value == 'inviteRecord')
const isShowRecharge = computed(()=> activeTab.value == 'rechargeRecord')
const isShowCode = computed(()=> activeTab.value == 'inviteCode')
const isShowLink = computed(()=> activeTab.value == 'inviteLink')
const activeTab = ref('inviteRecord')

const handleChangMain = (type)=> {
    activeTab.value = type
}

const getDataByTab = (tab, params = {})=> {
    switch (tab) {
        case 'inviteRecord':
            getPromoteList(params)
            getCodeEnum()
            getLinkTitle()
        break

        case 'rechargeRecord':
            getRechargeRecord(params)
        break
    
        case 'inviteCode':
            getCodeList(params)
        break

        case 'inviteLink':
            getLinkList()
        break
    }
}
// 点击 - 选择时间
const timeRange = ref([])
const changeDate = ()=> {
    if (timeRange.value) {
        formData.startTime = `${timeRange.value[0]} 00:00:00`
        formData.endTime = `${timeRange.value[1]} 23:59:59`
    } else {
        formData.startTime = ''
        formData.endTime = ''
    }
    getDataByTab(activeTab.value, formData)
}

// Tab - 切换数据
watch(activeTab, (tab)=>{
    // 数据重置
    pageConfig.pageNum = 1
    searchCode.value = []
    inviteTitle.value = []
    vipType.value = []
    formData.keyword = ''
    timeRange.value = []
    
    getDataByTab(tab)
}, {immediate: true})

// 分页 - 上/下一页
const getList = (e)=> {
    pageConfig.pageNum = e.page
    getDataByTab(activeTab.value, formData)
}

// 弹窗 - 新增邀请链接
const inviteRef = ref()
const showInviteDlg = ()=> {
    inviteRef.value.isShow = true
}

// 弹窗 - 新增邀请链接
const activeRef = ref()
const showActiveDlg = ()=> {
    activeRef.value.isShow = true
}

// 弹窗 - 展示收益表
const showTable = (type)=> {
    emit('showTable', type)
}

// 点击 - 切换展示tips
const isShowTips = ref(false)
const toggleTips = ()=> {
    isShowTips.value = !isShowTips.value
}

// 点击 - 删除邀请链接
const delLink = (id)=> {
    proxy.$modal.confirm('是否确认删除该分享链接?').then(()=>{
        delShareLink(id)
    }).then(() => {
        getLinkList()
        proxy.$modal.msgSuccess("删除成功")
        emit('reloadProxyInfo')
    }).catch(() => {})
}

// 点击 - 复制链接
const copyLink = async (link)=> {
    try{
        await props.toClipboard(link)
        ElMessage.success('复制成功')
    }catch(err){
        ElMessage.error('复制失败')
    }
}
</script>

<style lang="scss" scoped>
@mixin customfont ($size: 16px, $color: #fff, $weight: 400) {
    color: $color;
    font-size: $size;
    font-weight: $weight;
}
.operate {
    color: #3468FE;
    cursor: pointer;
}
.wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    .head {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .h-desc {
            @include customfont()
        }
        .h-level {
            @include customfont(16px, #F88212)
        }
        .h-time {
            margin-left: 20px;
            @include customfont(14px, #9094A6)
        }
    }
    .invite {
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 20px;
        background: #181920;
        .i-up {
            display: flex;
            border-bottom: 1px solid #424244;
            .item-box:nth-child(1) {
                padding-left: 0px;
            }
            .item-box {
                position: relative;
                padding: 0 50px;
                &::before {
                    content: '';
                    position: absolute;
                    height: 22px;
                    top: 16px;
                    right: 0px;
                    border-right: 2px solid #fff;
                    opacity: .1;
                }
                .i-label {
                    margin-bottom: 10px;
                    @include customfont(24px,#fff, 500);
                    .total-num {
                        @include customfont(16px,#C4C9D3);
                        opacity: .4;
                    }
                }
                .i-txt {
                    margin-bottom: 20px;
                    @include customfont(12px,#C4C9D3);
                    opacity: .4;
                }
            }
        }
        .i-down {
            margin-top: 20px;
            .d-title {
                display: flex;
                .title {
                    @include customfont(14px, #C4C9D3);
                }
                .check {
                    display: flex;
                    align-items: center;
                    margin-left: 16px;
                    cursor: pointer;
                    @include customfont(14px, #3468FE);
                    .iconArr {
                        transform:rotate(180deg);
                    }
                    .move {
                        transition: all .5s;
                    }
                    .reverse {
                        transform:rotate(0deg);
                        transition: all .5s;
                    }
                }
            }
            .d-tips {
            margin-top: 10px;
            .tips {
                line-height: 22px;
                .tips-click {
                    cursor: pointer;
                    color: #3468FE;
                }
            }
        }
        }
    }
    .content {
        flex: 1;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        .toolBar {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            background: #181920;
            border-radius: 10px;
            margin-bottom: 10px;
            .left {
                .tab {
                    display: inline-block;
                    margin-right: 52px;
                    font-size: 14px;
                    color: #8d91a3;
                    &:hover {
                        color: #ffffff;
                        cursor: pointer;
                    }
                }
                .active-tab {
                    height: 25px;
                    line-height: 25px;
                    color: #ffffff;
                    font-weight: 500;
                    position: relative;
                    flex: 0 0 auto;
                    &::after {
                        content: "";
                        width: 100%;
                        height: 4px;
                        border-radius: 2px;
                        background: linear-gradient(
                            42deg,
                            #0459ff 0%,
                            #5726dd 100%
                        );
                        position: absolute;
                        left: 0;
                        bottom: -8px;
                    }
                }
            }
            .right {
                display: flex;
                .search-form {
                    margin-bottom: -6px;
                    :deep(.el-form-item) {
                        margin: 0;
                    }
                    :deep(.el-input__inner) {
                        border-radius: 16px;
                        box-shadow: none;
                        color: #9094A6;
                        background-color: #0C0D10;
                    }
                }
                .btn {
                        color: #fff;
                }
                .active-btn {
                    margin-left: 10px;
                }
            }
        }
        .table-box {
            flex: 1;
            // 表头背景色
            .filter {
                cursor: pointer;
            }
            :deep(.el-table th) {
                background-color: #0A0B0D !important;
                border: none;
            }
            :deep(.el-table__row) {
                border-radius: 16px;
            }
            // 行背景色
            :deep(.el-table tr) {
                background-color: #111216;
            }
            // 去掉行底部分割线
            :deep(.el-table td, .building-top .el-table th.is-leaf) {
                border-bottom: none;
            }
            // hover 行
            :deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
                background-color: #1b1c22 !important;
            }
            // 去除table容器底部白线
            :deep(.el-table__inner-wrapper::before) {
                background-color: #0A0B0D;
            }
            // 空数据背景色
            :deep(.el-table__empty-block) {
                background: #111216;
            }
        }
    }
}
</style>