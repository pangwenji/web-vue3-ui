<template>
    <div class="word_user" @click="emit('click', data)">
        <div class="word_user-header">
            <el-avatar :size="50" class="word_user-avatar" :src="data.avatar"></el-avatar>
            <div class="word_user-title">
                <div class="nickName">
                    <div class="name" :title="data.nickName">{{data.nickName}}</div>
                    <svg-icon class="icon-sex-box man" :size="16" title="男" iconClass="icon_man" v-if="data.sex === '0'"></svg-icon>
                    <svg-icon class="icon-sex-box girl" :size="16" title="女" iconClass="icon_girl" v-else-if="data.sex === '1'"></svg-icon>
                    <svg-icon class="icon-sex-box other" :size="16" title="未知" iconClass="icon_sex" v-else></svg-icon>
                    <div class="work-tag">{{data.categoryTitle}}</div>
                </div>
                <div class="desc">
                    {{data.title}}
                </div>
            </div>
            <div class="word_user-remark">
                <div class="price-item">
                    <div>
                        <span>{{data.quotedPrice}}</span>
                        <span class="background_icon-money"></span>
                    </div>
                    <div class="unit">{{data.unitName || '-'}}</div>
                </div>
                <div class="price-item">
                    <div>
                        <span>{{data.price  || '0'}}</span>
                        <span class="background_icon-money"></span>
                    </div>
                    <div class="unit">起做</div>
                </div>
                <div class="price-item">
                    <div>
                        <span>{{data.finishDay || '0'}}天</span>
                    </div>
                    <div class="unit">交付</div>
                </div>
            </div>
            <div class="word_user-data-box">
                <div v-if="active" class="container-data-box">
                    <div class="word_user-data">
                        <span>最近成交：</span>
                        <span style="color: white;  margin-left:4px;">{{data.tradeNum || '-'}}</span>
                    </div>
                    <div class="word_user-data">
                        <span>雇主评分：</span>
                        <span style="color: white; margin-left:4px;">{{data.score || '-'}}</span>
                    </div>
                    <div class="word_user-data">
                        <span>响应速度：</span>
                        <span style="color: white;  margin-left:4px;">快</span>
                    </div>
                </div>
                <div v-else class="container-data-box">
                    <template v-if="viewFileData && viewFileData.length > 0">
                        <template v-for="(file,index) in viewFileData" :key="index">
                            <div class="file_type-box" :style="{}" v-if="index < 4" @click.stop="handleOpenMedia(file, index)">
                                <el-avatar shape="square" :size="50" :src="file.cover || file.downloadUrl" v-if="file.fileClassification == 'image'"></el-avatar>
                                <el-avatar shape="square" :size="50" :src="file.customizeCover" v-else-if="file.customizeCover"></el-avatar>
                                <el-avatar shape="square" :size="50" :src="file.cover" v-else-if="file.cover"></el-avatar>
                                <div v-else style="widtn: 100%; height: 100%; padding: 6px;">
                                    <FileType :size="50" :type="file.fileCat"></FileType>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
            <div class="word_user-contrast" @click.stop="handleCompared">
                <span class="vs">vs</span>
                <span v-if="data.compared">取消对比</span>
                <span v-else>加入对比</span>
            </div>
            <div>
                <el-button type="primary" style="width: 100px;" color="#25408E" round @click.stop="handleInvite">邀请合作</el-button>
            </div>
            <div class="word_user-down" :class="{active}" @click.stop="handleOpenView">
                <el-icon>
                    <CaretTop v-if="active" />
                    <CaretBottom v-else />
                </el-icon>
            </div>
            <div class="word_user-view" @click.stop="emit('clickHide',data)" title="屏蔽该创作者">
                <el-icon>
                    <Hide />
                </el-icon>
            </div>

        </div>
        <div class="word_user-container" ref="WordUserContainerRef" @click.stop>
            <div>
                <div class="word_user-info">
                    <div class="container-box borderRight" style="width: 36%;">
                        <div class="container-title blue">
                            精选作品
                            <div class="container-title-other" @click.stop="emit('click', data)">查看更多 <el-icon :size="16">
                                    <ArrowRight />
                                </el-icon>
                            </div>
                        </div>
                        <template v-if="viewFileData && viewFileData.length > 0">
                            <template v-for="(file,index) in viewFileData" :key="index">
                                <div class="file-item" v-if="index < 4" @click.stop="handleOpenMedia(file)">
                                    <div class="file_type-box" :style="{cursor: 'pointer', marginRight: index < 3? '16px':''}">
                                        <el-avatar shape="square" :size="30" :src="file.cover || file.downloadUrl" v-if="file.fileClassification == 'image'"></el-avatar>
                                        <el-avatar shape="square" :size="30" :src="file.customizeCover" v-else-if="file.customizeCover"></el-avatar>
                                        <el-avatar shape="square" :size="30" :src="file.cover" v-else-if="file.cover"></el-avatar>
                                        <div v-else style="widtn: 100%; height: 100%; padding: 6px;">
                                            <FileType :size="30" :type="file.fileCat"></FileType>
                                        </div>
                                    </div>
                                    <div class="fileName">{{file.filename}}</div>
                                    <div class="browse">浏览量：{{formatPageViews(file.browseNum)}}</div>
                                    <!-- <div class="browse like">
                                        <svg-icon iconClass="icon_love" :size="16"></svg-icon>
                                        <span>10.2K</span>
                                    </div> -->
                                </div>
                            </template>

                        </template>
                        <template v-else>
                            <Empty description="暂无精选作品" style="padding:0"></Empty>
                        </template>
                    </div>
                    <div class="container-box borderRight" style="width: 32%;">
                        <div class="container-title greed"> 服务简介 </div>
                        <el-scrollbar height="230" style="height: 190px; margin: 0 -20px;" view-style="font-size: 14px; color: #666A7A; line-height: 20px; padding: 0 20px;">
                            <pre style="margin: 0;">{{data.technicalAbilityIntroduce}}</pre>
                        </el-scrollbar>
                    </div>
                    <div class="container-box" style="width: 32%;" v-loading="loadingStatus" element-loading-background="rgba(0,0,0,0)">
                        <div class="container-title red" >
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
                        <BarGrapg :fansData="fansList" v-show="graphType == 'bar'" style="height:220px"></BarGrapg>
                    </div>
                </div>
                <div class="word_user-footer">
                    <div class="price">
                        <span>报价说明：</span>
                        <span class="price-num">{{data.quotedPrice}}</span>
                        <span class="background_icon-money"></span>
                        <span>{{data.unitName}}</span>
                    </div>
                    <div class="price" style="margin-left: 60px">
                        <span class="price-num">{{data.price}}</span>
                        <span class="background_icon-money"></span>
                        <span>起做</span>
                    </div>
                    <div class="date" style="margin-left: 60px">
                        <span class="date-num">{{data.finishDay}}</span>
                        <span>天交付</span>
                    </div>
                    <div style="margin-left: 60px" @click.stop>
                        <el-input-number v-model="num" :min="1" :max="999" @change="handleChange" />
                    </div>
                    <div style="margin-left: 60px">
                        <el-button type="primary" style="width: 146px;" color="#3468FE" round @click.stop="emit('createOrder',{...data,num})">快速下单</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, watch, watchPostEffect } from 'vue';
import FileType from "@/components/FileType";
import BarGrapg from '../../components/BarGraph'
import { getThirdpartyInfo } from '@/api/personnel/recruitmentWall.js'
import * as echarts from 'echarts'
import { FansEcharts } from '../../platformList.js'
import { ElMessage } from 'element-plus';

const props = {
    data: {
        type: Object,
        default() {
            return {}
        }
    },
    active: {
        type: Boolean,
        default: false,
    }
}
const components = {
    BarGrapg,
    FileType
}
const emits = ['click', 'openView', 'openMedia', 'clickHide', 'createOrder', 'invite']
const setup = (prop, { emit }) => {
    const store = useStore();
    const WordUserContainerRef = ref();
    const { proxy } = getCurrentInstance();
    const quickSelections = computed(() => store.state.workspace.quickSelections)
    watch(() => quickSelections.value, (N, O) => {
        const index = N.findIndex(item => item.userAuthenticateId == prop.data.id);
        if (index > -1) {
            prop.data.compared = 1;
        } else {
            prop.data.compared = 0;
        }
    })

    watchPostEffect(() => {
        const clientHeight = WordUserContainerRef.value?.children[0].clientHeight;
        if (prop.active) {
            nextTick(() => {
                WordUserContainerRef.value.style.height = `${clientHeight}px`;
            })
        } else {
            nextTick(() => {
                WordUserContainerRef.value.style.height = '0px'
            })
        }
    })
    /**
   *  页面挂载后，操作DOM
   */
    const fansDataRef = ref();
    const myChart = ref(null);
    const viewFileData = computed(() => {
        const sourIdItems = prop.data?.sourIdItems || [];
        return sourIdItems.filter(item => {
            return item.featured;
        })
    });
    onMounted(() => {

        // if(fansDataRef.value){
        //     myChart.value = echarts.init(fansDataRef.value);
        //     FansEcharts(myChart.value, indicator, numberVal)
        // }
    })
    // 浏览量格式化
    const formatPageViews = (e) => {
        if (e < 10000) {
            return e
        } else {
            const num = (e / 10000).toFixed(1)
            return `${num}w`
        }
    }
    const loadingStatus = ref(false);
    // 打开
    const fansList = ref([])
    const handleOpenView = (e) => {
        prop.data.active = !prop.data.active;
        // if (fansDataRef.value && !myChart.value) {
        //     const fanData = prop.data.fanData || '[]';
        //     const data = JSON.parse(fanData);
        //     fansList.value = data
        //     const indicator = data.map(item => {
        //         return {
        //             name: item.name
        //         }
        //     })
        //     const numberVal = data.map(item => item.number == -1 ? 0 : item.number)
        //     myChart.value = echarts.init(fansDataRef.value);
        //     FansEcharts(myChart.value, indicator, numberVal)
        // }
        emit('openView', prop.data);
        if(loadingStatus.value || myChart.value || !prop.data.active){
            return
        }
        loadingStatus.value = true;
        const userId = prop.data.userId;
        getThirdpartyInfo({userId}).then(res=>{
            loadingStatus.value = false;
            const indicator = res.data.map(item => {
                return {
                    name: item.name
                }
            })
            const numberVal = res.data.map(item => item.number == -1 ? 0 : item.number)
            myChart.value = echarts.init(fansDataRef.value);
            FansEcharts(myChart.value, indicator, numberVal );
            fansList.value = res.data;
            graphType.value = 'bar'
        }).catch(err=>{
            loadingStatus.value = false;
        })
    }

    // 打开媒体预览
    const handleOpenMedia = (e) => {
        proxy.$viewFile.open({
            current: 0, fileList: [e]
        })
    }
    // 加入对比/取消对比
    const handleCompared = () => {
        if (prop.data.compared == 0 && quickSelections.value.length >= 20) {
            ElMessage.warning('仅能加入二十个工种对比')
            return
        }
        store.dispatch('workspace/handlecoCmparedDele', prop.data).then(res => {
            prop.data.compared = res;
        }).catch(err => {

        });
    }
    // 邀请合作
    const handleInvite = () => {
        emit('invite', prop.data)
    }
    // 监听数字改变
    const handleChange = (e) => { }
    const num = ref(1);

    const graphType = ref('radar')
    const swtichGraph = (e) => {
        graphType.value = e
    }

    return {
        num,
        emit,
        fansList,
        graphType,
        swtichGraph,
        viewFileData,
        quickSelections,
        fansDataRef,
        handleInvite,
        handleChange,
        loadingStatus,
        handleCompared,
        handleOpenView,
        handleOpenMedia,
        formatPageViews,
        WordUserContainerRef,
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
@import "./style.scss";
</style>