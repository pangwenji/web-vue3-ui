<template>
    <el-scrollbar style="height: 100%;">
        <div v-loading="loading" element-loading-background="rgba(12,12,14,0.8)">
            <el-container class="collect-container">
                <!-- 头部 bar -->
                <el-header class="collect-header">
                    <div class="collect-header-left" @click="linkToHome">
                        <el-image :src="logo" style="height: 50px; width:50px;" :draggable="false" ></el-image>
                    </div>
                    <div v-if="isLogin" class="collect-header-right">
                        <el-dropdown @command="handleCommand">
                            <div class="avatar-container">
                                <div class="avatar-wrapper">
                                    <img v-if="getters.avatar" :src="getters.avatar" :draggable="false" class="user-avatar" />
                                </div>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="mine">个人中心</el-dropdown-item>
                                    <el-dropdown-item command="help">帮助中心</el-dropdown-item>
                                    <el-dropdown-item command="out">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                                </template>
                        </el-dropdown>
                    </div>
                    <div v-else class="collect-header-right">
                        <el-button style="color:#fff;" color="#3468FE" round size="large" @click="toLogin">登录</el-button>
                    </div>
                </el-header>
                <!-- 主区 -->
                <div class="main">
                    <div class="left">
                        <!-- 个人信息 -->
                        <div class="user">
                            <div class="u-inform">
                                <el-button style="width:67px;color:#fff;" :icon="Warning" color="#30323B" round @click="inform">举报</el-button>
                            </div>
                            <div class="u-info">
                                <img class="avatar" :src="viewData.avatar" :draggable="false"/>
                                <div class="name">{{viewData.nickName}}</div>
                                <div class="id">ID号：{{viewData.number}}</div>
                            </div>
                            <div class="u-price">
                                <div>
                                    <div class="u-p-price">{{viewData.quotedPrice}}<i class="icon_coin"></i></div>
                                    <div class="u-p-txt">{{viewData.unitName || '-'}}</div>
                                </div>
                                <div>
                                    <div class="u-p-price">{{viewData.price}}<i class="icon_coin"></i></div>
                                    <div class="u-p-txt">起做</div>
                                </div>
                                <div>
                                    <div class="u-p-day">{{viewData.finishDay}}天</div>
                                    <div class="u-p-txt">交付</div>
                                </div>
                            </div>
                            <div class="u-btn">
                                <el-popover trigger="hover" :content="shareLink" :width="400">
                                    <template #reference>
                                        <el-button style="width:144px;color:#fff;" :icon="Share" color="#30323B" round size="large" @click="copyLink(shareLink)">分享</el-button>
                                    </template>
                                </el-popover>
                                <el-button style="width:144px;color:#fff;" :icon="ChatDotSquare" color="#3468FE" round size="large" @click="chat">邀请合作</el-button>
                            </div>
                            <div class="u-viewer">
                                <div>查看次数</div>
                                <div>{{viewData.browseNum}}</div>
                            </div>
                        </div>
                        <!-- 粉丝数据 -->
                        <div class="fan-box">
                            <div class="tag-title">
                                <svg-icon iconClass="icon_fensi1" style="margin-right:4px" :size="18" color="#666A7A"></svg-icon>
                                <span>粉丝数据</span>
                                <div class="fan-btn">
                                    <div :class="['btn', graphType == 'bar' ? 'active' : '']" @click="swtichGraph('bar')">柱状图</div>
                                    <div :class="['btn', graphType == 'radar' ? 'active' : '']" @click="swtichGraph('radar')">雷达图</div>
                                </div>
                            </div>
                            <div class="float-box" v-show="graphType == 'radar'">
                                <div id="fan-data" class="fan-data" ref="fansDataRef"></div>
                                <div v-for="(item, i) in fansList" :key="i" :class="['sub', `sub-${i + 1}`]">{{item.name}}</div>
                            </div>
                            <BarGrapg :fansData="fansList" style="height:230px" v-show="graphType == 'bar'"></BarGrapg>
                        </div>
                        <!-- 标签集合 -->
                        <div class="tags-box">
                            <div class="tag-title">
                                <svg-icon iconClass="icon_biaoqian" style="margin-right: 4px" :size="18" color="#666A7A"></svg-icon>
                                <span>标签</span>
                            </div>
                            <div class="box">
                                <template v-if="customTags.length > 0 || viewData.tagItems?.length > 0">
                                    <div class="tags" v-for="(item, i) in customTags" :key="i">{{item}}</div>
                                    <div class="tags" v-for="(item, i) in viewData.tagItems" :key="i" v-show="i < 5">{{item.title}}</div>
                                    <div class="tags" v-if="customTags.length + viewData.tagItems?.length > 10">......</div>
                                </template>
                                <div v-else class="tags">该用户尚未添加任何标签...</div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <WorksFile class="custom_card-box" v-if="workTypeMenuItems.length > 0" :workTypeMenuItems="workTypeMenuItems" style="margin-bottom: 20px"></WorksFile>
                        <div class="custom_card-box work_detail-introduction" style="margin-bottom: 20px; padding: 20px;">
                            <div class="title">简介说明</div>
                            <el-scrollbar height="256px">
                            <div style="padding-top: 20px;">
                                    <pre class="txt-area">{{viewData.technicalAbilityIntroduce}}</pre>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </div>
            </el-container>
        </div>
    </el-scrollbar>
    <informDialog ref="informRef" :info="viewData" :type="1" :close-on-click-modal="false"></informDialog>
    <InviteCooperation ref="InviteCooperationRef"></InviteCooperation>
</template>
<script setup>
import logo from '@/assets/logo/logo.png'
import * as echarts from 'echarts'
import WorksFile from './WorksFile'
import informDialog from '@/components/informDialog'
import InviteCooperation from '../components/InviteCooperation'
import BarGrapg from '../components/BarGraph'
import { FansEcharts } from '../platformList.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import useClipboard from 'vue-clipboard3'
import { ElMessage, ElMessageBox } from 'element-plus'
import { talentsInfo } from '@/api/personnel/recruitmentWall'
import { Share, ChatDotSquare, Warning } from '@element-plus/icons-vue'
import { nextTick, computed, onMounted} from 'vue'
import { getToken } from '@/utils/auth'
import { getThirdpartyInfo } from '@/api/personnel/recruitmentWall.js'

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const store = useStore();
const { toClipboard } = useClipboard()
const getters = computed(() => store.getters);
const isLogin = ref(false)

onMounted(()=>{
    getData();
    isLogin.value = !!getToken()
})

// 初始化 - 获取数据
const myChart = ref('')
const loading = ref(false)
const viewData = ref({})
const fansList = ref([])
const fansDataRef = ref()
const customTags = ref([])
const workTypeMenuItems = ref([])
const getData = ()=>{
    const userAuthenticateId = route.params.id;
    loading.value = true
    talentsInfo({userAuthenticateId}).then(res=>{
        loading.value = false
        viewData.value = res.data;
        workTypeMenuItems.value = res.data.workTypeMenuItems
        customTags.value = res.data.customizeTag ? res.data.customizeTag.split(',') : []
        nextTick(()=>{
            const userId = res.data.userId;
            getThirdpartyInfo({userId}).then(res=>{
                if(fansDataRef.value){
                    fansList.value = res.data;
                    const indicator = res.data.map(item => {
                        return {
                            name: item.name
                        }
                    })
                    const numberVal = res.data.map(item => item.number == -1 ? 0 : item.number)
                    myChart.value = echarts.init(fansDataRef.value);
                    graphType.value = 'bar'
                    FansEcharts(myChart.value, indicator, numberVal)
                }
            }).catch(err=>{
                
            })
        })
    }).catch(err=>{
        console.log(err)
        loading.value = false
    })
}

// 点击 - 登录
const toLogin = ()=> {
    proxy.$loginDialog.open({ onSuccess: handleLoginSuccess})
}

// 点击 - 邀请合作
const chat = ()=> {
    // 校验登录
    if (!isLogin.value) {
        return proxy.$loginDialog.open({ onSuccess: handleLoginSuccess})
    }
    coorperation()
}

// 邀请合作
const InviteCooperationRef = ref()
const coorperation = () => {
    // 校验自我性
    if (viewData.value.ifOwn) {
        return proxy.$modal.msgWarning('您不能对自己发出合作邀请哦~')
    }
    InviteCooperationRef.value.open(viewData.value)
}

// 回调 - 登录成功
const handleLoginSuccess = ()=> {
  isLogin.value = true
  getData()
}

// 点击 - 举报
const informRef = ref()
const inform = () => {
    informRef.value.isShow = true
}

// 点击 - 分享
const host = import.meta.env.VITE_APP_API_PROXY || location.host
const shareLink = computed(() => `复制分享链接: ${host}/workbench/#${route.fullPath}`)
const copyLink = async (link)=> {
    let url = link.split(' ')[1]
    try{
        await toClipboard(url)
        ElMessage.success('复制成功')
    }catch(err){
        ElMessage.error('复制失败')
    }
}

// 点击 - logo返回首页
const linkToHome = () => {
    router.push(`/index`)
}

// 点击 - 右上角交互
const handleCommand = (flag) => {
    switch (flag) {
        case 'mine':
            router.push(`/user/center/wallet`)
        break;
    
        case 'help':
            router.push(`/help/guide`)
        break;

        case 'out':
            ElMessageBox.confirm('确定要退出系统吗？', '退出提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'messageBox-custom-warning',
                center:true,
            }).then(() => {
                store.dispatch('LogOut').then(() => {
                    getData()
                    isLogin.value = false
                })
            }).catch(()=>{})
        break;
    }
}

// 切换图
const graphType = ref('radar')
const swtichGraph = (e) => {
    graphType.value = e
}

</script>
<style scoped lang="scss">
@mixin fontStyle ($size: 14px, $color: #9D9DA1, $w: 400) {
    font-size: $size;
    color: $color;
    font-weight: $w;
}
// 引入icon
@mixin importIcon($url, $width, $height, $margin: 0 5px 0 0) {
    background-image: url($url);
    background-repeat: no-repeat;
    width: $width;
    height: $height;
    margin: $margin;
    background-size: 100%;
}
.tag-title{
    margin-bottom: 10px;
    color: white;
    font-size: 14px;
    display: flex;
    align-items: center;
}
.collect-container{
    width: 100%;
    min-height: 100vh;
    background: #0A0B0D;
    background-image: url('@/assets/images/share_background.png');
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    .collect-header{
        background: #1E1F26;
        .collect-header-left{
            height: 100%;
            float: left;
            display: flex;
            align-items: center;
        }
        .collect-header-right{
            height: 100%;
            float: right;
            display: flex;
            align-items: center;
            .avatar-wrapper{
                display: flex;
                align-items: center;
                cursor: pointer;
                .user-avatar{
                    width: 42px;
                    height: 42px;
                    border-radius: 50px;
                    overflow: hidden;
                }
            }
        }
    }
    .main {
        display: flex;
        margin: 30px auto;
        .left {
            width: 364px;
            margin-right: 20px;
            .user {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #1C1D24;
                padding: 0 26px;
                margin-bottom: 20px;
                border-radius: 10px;
                .u-inform {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                }
                .u-info {
                    margin: 50px 0 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .avatar {
                        width: 56px;
                        height: 56px;
                        margin-bottom: 10px;
                        border-radius: 50%;
                    }
                    .name {
                        @include fontStyle(18px, #fff)
                    }
                    .id {
                        @include fontStyle()
                    }
                }
                .u-price {
                    width: 310px;
                    border-radius: 16px;
                    padding: 15px 0;
                    margin-bottom: 30px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    background: #14151A;
                    & > div{
                        flex: 1;
                        flex-direction: row;
                        padding-left: 34px;
                    }
                    & > div:nth-last-of-type(2){
                        border-left: 1px solid rgb(110, 109, 109);
                        border-right: 1px solid rgb(110, 109, 109);
                    }
                    .u-p-price {
                        @include fontStyle(16px, #f88212);
                        display: flex;
                        .icon_coin {
                            position: relative;
                            top: 4px;
                            left: 2px;
                            @include importIcon("@/assets/icons/icon_money.png", 12px, 12px);

                        }
                    }
                    .u-p-txt {
                        @include fontStyle(12px, #666A7A);
                    }
                    .u-p-day {
                        @include fontStyle(16px, #E1E1E1);
                    }
                }
                .u-viewer {
                    width: 100%;
                    margin-top: 30px;
                    padding: 30px 0;
                    border-top: 1px solid #363636;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    & > div {
                        @include fontStyle(14px, #9D9DA1)
                    }
                }
            }
            .fan-box {
                padding: 16px;
                border-radius: 10px;
                background-color: #1c1d24;
                margin-bottom: 20px;
                .float-box {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    .sub {
                        position: absolute;
                        color: #676c7f;
                        font-size: 12px;
                    }
                    .sub-1 {
                        top: 0px;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    .sub-2 {
                        top: 70px;
                        right: 250px;
                    }
                    .sub-3 {
                        top: 160px;
                        right: 250px;
                    }
                    .sub-4 {
                        bottom: 0px;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    .sub-5 {
                        top: 160px;
                        left: 250px;
                    }
                    .sub-6 {
                        top: 70px;
                        left: 250px;
                    }
                    .fan-data{
                        height: 230px;
                    }
                }
                .fan-btn {
                    position: relative;
                    left: 130px;
                    width: 120px;
                    display: flex;
                    background-color: #131419;
                    border-radius: 8px;
                    z-index: 9;
                    .btn {
                        color: #9d9da1;
                        font-size: 12px;
                        padding: 4px 8px;
                        margin: 4px;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    .active {
                        color: #fff;
                        background-color: #30323b;
                    }
                }
            }
            .tags-box {
                padding: 16px;
                // height: 100px;
                border-radius: 10px;
                background-color: #1c1d24;
                .box {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    .tags {
                        margin: 2px 6px;
                        background-color: #24262F;
                        padding: 8px 14px;
                        border-radius: 8px;
                        @include fontStyle(14px, #868890)
                    }
                }
            }
        }
        .right {
            width: 738px;
            .custom_card-box {
                background: #1C1D24;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            }
            .work_detail-introduction{
                .title{
                    padding-bottom: 20px;
                    color: white;
                    font-size: 16px;
                    border-bottom: 1px solid #24262F;
                }
                .txt-area {
                    margin:0;
                    height: 236px;
                    color:#868890;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>