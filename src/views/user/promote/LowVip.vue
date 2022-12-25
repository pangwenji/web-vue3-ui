<template>
    <div class="wrapper">
        <!-- 头部 -->
        <div class="head">
            <div class="h-desc">当前代理等级：</div>
            <div class="h-level">VIP{{proxyInfo.proxyLevelNum}}</div>
            <div class="h-time">代理到期时间：{{proxyInfo.proxyEndTime}}</div>
        </div>
        <!-- 邀请信息 -->
        <div class="invite">
            <el-row class="i-up">
                <el-col :span="3">
                    <div class="i-label">邀请码</div>
                    <div class="i-txt">{{proxyInfo.number}}</div>
                </el-col>
                <el-col :span="21">
                    <div class="i-label">邀请链接</div>
                    <div class="i-txt">{{proxyInfo.inviteUrl}}<span class="i-copy" @click="copyLink(proxyInfo.inviteUrl)">复制链接</span></div>
                </el-col>
            </el-row>
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
        <!-- 表格 -->
        <div class="content">
            <div class="toolBar">
                <div class="left">
                    <span class="tab" :class="{ 'active-tab': activeTab === item.type }" v-for="(item, index) in tabListShow" :key="index" @click="handleChangMain(item.id)">
                        {{ item.title }}
                    </span>
                </div>
                <div class="right">
                    <el-form :inline="true" :model="formData" class="search-form">
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
                </div>
            </div>
            <div class="table-box">
                <!-- 拉新记录 -->
                <el-table v-if="isShowRecord" :data="promoteList" style="width: 100%" row-class-name="row-style">
                    <el-table-column prop="nickName" label="新用户昵称"/>
                    <el-table-column prop="userName" label="绑定手机"/>
                    <el-table-column prop="createTime" label="用户注册时间" />
                    <el-table-column prop="memberType" label="会员类别"/>
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
</template>

<script setup>
import "dayjs/locale/zh-cn"
import dayjs from "dayjs"
import toObject from "dayjs/plugin/toObject"
import { ref, reactive, computed } from 'vue'
import { myPromoteList } from '@/api/user/promote'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

dayjs.locale('zh-cn')
dayjs.extend(toObject)

const emit = defineEmits(['showTable'])
const props = defineProps({
    // 代理推广信息
    proxyInfo: Object,
    // 粘贴板
    toClipboard: Function
})

const isShowTips = ref(false)

const tabListShow = [
    { title: '拉新记录', type: 'inviteRecord' }
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

// 分页配置
const total = ref(0)
const pageConfig = reactive({
    pageSize: 12,
    pageNum: 1
})

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

// 搜索表单
const formData = reactive({
    keyword: '',
    startTime: '',
    endTime: ''
})

// 分页 - 上/下一页
const getList = (e)=> {
    pageConfig.pageNum = e.page
    getDataByTab(activeTab.value, formData)
}

// 筛选 - 昵称or手机号
const searchKeyword = ()=> {
    getDataByTab(activeTab.value, formData)
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

const getDataByTab = (tab, params = {})=> {
    switch (tab) {
        case 'inviteRecord':
            getPromoteList(params)
        break
    }
}

// 点击 - 切换标签
const isShowRecord = computed(()=> activeTab.value == 'inviteRecord')
const activeTab = ref('inviteRecord')

function handleChangMain(type) {
    activeTab.value = type
}

// 切换tab数据
watch(activeTab, (tab)=>{
    switch (tab) {
        case 'inviteRecord':
            getPromoteList()
        break
    }
}, {immediate: true})

// 弹窗 - 展示收益表
const showTable = (type)=> {
    emit('showTable', type)
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

// 点击 - 切换展示tips
const toggleTips = ()=> {
    isShowTips.value = !isShowTips.value
}
</script>

<style lang="scss" scoped>
@mixin customfont ($size: 16px, $color: #fff, $weight: 400) {
    color: $color;
    font-size: $size;
    font-weight: $weight;
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
            border-bottom: 1px solid #424244;
            .i-label {
                margin-bottom: 10px;
                @include customfont(14px,#C4C9D3, 400)
            }
            .i-txt {
                margin-bottom: 20px;
                @include customfont(14px,#E0E0E0, 600)
            }
            .i-copy {
                display: inline-block;
                margin-left: 10px;
                color: #3468FE;
                cursor: pointer;
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
                .search-form {
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
            }
        }
        .table-box {
            flex: 1;
            // 表头背景色
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