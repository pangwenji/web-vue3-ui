<template>
    <el-scrollbar style="height: 100%;" view-class="workdetail-scrollbar-view" v-loading="loadingStatus" element-loading-background="rgba(0,0,0,0)">
        <template v-if="!loadingStatus && viewData">
            <div class="left-container">
                <div class="custom_card-box" style="margin-bottom: 20px;">
                    <div class="work_detail-header breaches">
                        <div class="l-title">
                            <div class="l-t-row">
                                <div class="l-t-title">{{viewData.title}}</div>
                            </div>
                            <div class="l-t-row">
                                <div class="l-t-row l-t-btn" @click="unlike">
                                    <i class="icon-block"></i>
                                    <div>屏蔽</div>
                                </div>
                                <div class="l-t-row l-t-btn" @click="inform">
                                    <i class="icon-report"></i>
                                    <div>举报</div>
                                </div>
                            </div>
                        </div>
                        <div class="tags">
                            <div class="tags-item">最近成交 <span>{{viewData.tradeNum || 0}}</span></div>
                            <div class="tags-item">雇主评分 <span>{{viewData.score || 0}}</span></div>
                            <div class="tags-item">响应速度 <span>快</span></div>
                        </div>
                    </div>
                    <div class="work_detail-price">
                        <div class="p-left">
                            <div class="tags-num">
                                <div class="num">
                                    <span>{{viewData.quotedPrice}}</span>
                                    <span class="background_icon-money"></span>
                                </div>
                                <div class="desc">{{viewData.unitName || '-'}}</div>
                            </div>
                            <div class="tags-num">
                                <div class="num">
                                    <span>{{viewData.price}}</span>
                                    <span class="background_icon-money"></span>
                                </div>
                                <div class="desc">最低起做</div>
                            </div>
                            <div class="tags-num">
                                <div class="num" style="color:#0DA411; ">{{viewData.finishDay}}</div>
                                <div class="desc">天交付</div>
                            </div>
                        </div>
                        <div>
                            <el-input-number v-model="num" :min="1" :max="999" @change="" size="large"></el-input-number>
                            <el-button size="large" type="primary" color="#3468FE" style="width: 170px; margin-left: 20px;" round @click="handleCreateOrder">快速下单</el-button>
                        </div>
                    </div>
                </div>
                <WorksFile class="custom_card-box" v-if="workTypeMenuItems&&workTypeMenuItems.length > 0" :workTypeMenuItems="workTypeMenuItems" style="margin-bottom: 20px"></WorksFile>
                <div class="custom_card-box work_detail-introduction" style="margin-bottom: 20px;" v-if="viewData.technicalAbilityIntroduce">
                    <div style="padding:20px;">简介说明</div>
                    <div style="padding:20px; background-color: #181920;">
                        <pre style="margin: 0;">{{viewData.technicalAbilityIntroduce}}</pre>
                    </div>
                </div>
                <WorksAssess :userId="viewData.userId" :score="viewData.score" class="custom_card-box"></WorksAssess>
            </div>
            <div class="right-container">
                <div class="custom_card-box" style="padding: 40px 20px 20px; position: relative; margin-bottom: 20px;">
                    <div class="user-info">
                        <el-avatar :src="viewData.avatar" :size="56"></el-avatar>
                        <div class="detail">
                            <div class="userName">{{viewData.nickName}}</div>
                            <div class="desc">ID:{{viewData.number}}</div>
                        </div>
                    </div>
                    <div class="action-btn">
                        <div class="chat" @click="coorperation">
                            <!-- <el-icon>
                                <ChatDotSquare />
                            </el-icon> -->
                            <span>邀请合作</span>
                        </div>
                        <div class="follow" :class="{active: viewData.coll}" @click="handleCollectAFavorite">
                            <span v-if="viewData.coll">已关注</span>
                            <span v-else>关注</span>
                            <el-icon :size="20">
                                <StarFilled />
                            </el-icon>
                        </div>
                    </div>
                    <el-popover trigger="hover" :content="shareLink" :width="400">
                        <template #reference>
                            <div class="Share" @click="copyLink(shareLink)">
                                <span>分享</span>
                                <el-icon :size="20">
                                    <Share />
                                </el-icon>
                            </div>
                        </template>
                    </el-popover>
                </div>
                <div class="custom_card-box" style="padding: 20px 20px 4px; position: relative; margin-bottom: 20px;" v-if="viewData.tagItems?.length || customTags.length">
                    <div class="tag-title">
                        <svg-icon iconClass="icon_biaoqian" style="margin-right: 4px" :size="18" color="#666A7A"></svg-icon>
                        <span>标签</span>
                    </div>
                    <div class="tag-box">
                        <div class="tag-item" v-for="(item,index) in viewData.tagItems" :key="index">{{item.title}}</div>
                        <div class="tag-item" v-for="(item,index) in customTags" :key="index">{{item}}</div>
                    </div>
                </div>
                <div class="custom_card-box" style="padding: 20px; position: relative; overflow:visible ">
                    <div class="tag-title">
                        <svg-icon iconClass="icon_fensi1" style="margin-right: 4px" :size="18" color="#666A7A"></svg-icon>
                        <span>粉丝数据</span>
                        <div class="fan-btn">
                            <div :class="['btn', graphType == 'bar' ? 'active' : '']" class="btn" @click="swtichGraph('bar')">柱状图</div>
                            <div :class="['btn', graphType == 'radar' ? 'active' : '']" @click="swtichGraph('radar')">雷达图</div>
                        </div>
                    </div>
                    <div class="float-box" v-show="graphType == 'radar'">
                        <div id="fan-data" class="fan-data" ref="fansDataRef"></div>
                        <div v-for="(item, i) in fansList" :key="i" :class="['sub', `sub-${i + 1}`]">{{item.name}}</div>
                    </div>
                    <BarGrapg :fansData="fansList" style="height:260px" v-show="graphType == 'bar'"></BarGrapg>
                </div>
            </div>
        </template>
        <template v-else-if="!loadingStatus">
            <el-result icon="error" title="加载失败" sub-title="该工种不存在或已被禁用"></el-result>
        </template>
    </el-scrollbar>
    <CreateOrder ref="CreateOrderRef"></CreateOrder>
    <InviteCooperation ref="InviteCooperationRef"></InviteCooperation>
    <informDialog ref="informRef" :info="viewData" :type="1" :close-on-click-modal="false"></informDialog>
</template>
<script setup>
import WorksFile from './WorksFile';
import WorksAssess from './WorksAssess';
import CreateOrder from '../components/CreateOrder';
import InviteCooperation from '../components/InviteCooperation';
import BarGrapg from '../components/BarGraph'
import informDialog from '@/components/informDialog';
import useClipboard from 'vue-clipboard3';
import { talentsInfo, collectAFavorite, handleShielded } from '@/api/personnel/recruitmentWall';
import * as echarts from 'echarts';
import { FansEcharts } from '../platformList.js'
import { useRoute, useRouter } from 'vue-router';
import { onMounted, nextTick, computed, getCurrentInstance } from 'vue';
import { getThirdpartyInfo } from '@/api/personnel/recruitmentWall.js'
const fansDataRef = ref();
const CreateOrderRef = ref();
const { toClipboard } = useClipboard()
const { proxy } = getCurrentInstance()

const num = ref(1);
const route = useRoute();
const router = useRouter();
const store = useStore();
const viewData = ref({});
const myChart = ref('');
const customTags = ref([])
const loadingStatus = ref(false);
const workTypeMenuItems = ref([])
onMounted(() => {
    getData();
})
// 创建订单
const handleCreateOrder = () => {
    proxy.$Authentication.open(() => {
        viewData.value.num = num.value;
        CreateOrderRef.value.open(viewData.value)
    })

}
// 关注/取消关注
const handleCollectAFavorite = (e) => {
    const userAuthenticateId = route.params.id;
    collectAFavorite(userAuthenticateId).then(res => {
        viewData.value.coll = res.data;
    })
}
// 获取数据
const fansList = ref([])
const getData = () => {
    loadingStatus.value = true;
    const userAuthenticateId = route.params.id;
    talentsInfo({ userAuthenticateId }).then(res => {
        loadingStatus.value = false;
        viewData.value = res.data;
        workTypeMenuItems.value = res.data.workTypeMenuItems
        customTags.value = res.data.customizeTag && res.data.customizeTag.split(',')
        nextTick(() => {
            const userId = res.data.userId;
            getThirdpartyInfo({userId}).then(res=>{
                if(fansDataRef.value){
                    loadingStatus.value = false;
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
                loadingStatus.value = false;
            })
        })
    }).catch(err => {
        viewData.value = null
        loadingStatus.value = false;
    })
}

// 点击 - 分享
const host = import.meta.env.VITE_APP_API_PROXY || location.host
const inviteCode = store.getters.number || ''
const shareLink = computed(() => `复制分享链接: ${host}/workbench/#/workspace/work/share/${route.params.id}?invite_user=${inviteCode}`)
const copyLink = async (link) => {
    let url = link.split(' ')[1]
    try {
        await toClipboard(url)
        proxy.$modal.msgSuccess('复制成功')
    } catch (err) {
        proxy.$modal.msgError('复制失败')
    }
}

// 点击 - 邀请合作
const InviteCooperationRef = ref()
const coorperation = () => {
    proxy.$Authentication.open(() => {
        // 校验
        if (viewData.value.ifOwn) {
            return proxy.$modal.msgWarning('您不能对自己发出合作邀请哦~')
        }
        InviteCooperationRef.value.open(viewData.value)
    })
}

// 点击 - 屏蔽
const unlike = () => {
    proxy.$modal.confirm({
        title: '屏蔽',
        content: '屏蔽后不会再出现在工种库，确定屏蔽该用户的工种吗？',
        beforeClose(action, instance, done) {
            if (action === 'confirm') {
                let params = {
                    userId: viewData.value.userId,
                    type: 0 // 0: 工种屏蔽 1：招募屏蔽
                }

                instance.confirmButtonLoading = true
                handleShielded(params).then(res => {
                    proxy.$modal.msgSuccess('已屏蔽')
                    router.replace({ path: '/workspace/work/type' })
                    done()
                }).catch((err) => {
                    console.error(err)
                    done()
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    })
}

// 点击 - 举报
const informRef = ref()
const inform = () => {
    informRef.value.isShow = true
}

const graphType = ref('radar')
const swtichGraph = (e) => {
    graphType.value = e
}
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
