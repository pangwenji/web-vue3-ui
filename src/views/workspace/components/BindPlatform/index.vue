<template>
    <div class="card-box fensi">
        <div class="left-container">
            <div class="platform-item" v-for="(item,index) in platformData" :key="index">
                <div class="platform-title">
                    <div class="icon douyin" :class="[ 'icon_platformType-' + item.platformType]"></div>
                    <el-dropdown trigger="click" @command="handleCommand($event,index)">
                        <div class="name">
                            <span>{{item.name}}</span>
                            <el-icon>
                                <CaretBottom />
                            </el-icon>
                        </div>
                        <!-- <span class="el-dropdown-link"> Dropdown List2 </span> -->
                        <template #dropdown>
                            <el-dropdown-menu>
                                <template v-for="(option,code) in platformOther" :key="code">
                                    <el-dropdown-item :command="code">{{option.name}}</el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <template v-if="item.platformType == 1">
                        <el-tooltip content="根据抖音平台规则：首次绑定授权抖音粉丝数据，24小时后才会更新" placement="top">
                            <div class="help">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                            </div>
                        </el-tooltip>
                    </template>
                </div>
                <div class="platform-fensi">
                    <svg-icon iconClass="icon_fensi1"></svg-icon>
                    <span>粉丝数</span>
                </div>
                <div class="platform-fensinum">
                    <span v-if="item.number >= 0">{{formatNum(item.number)}}</span>
                    <span v-else> -&nbsp;-&nbsp;-</span>
                </div>
                <el-button type="primary" @click.stop="handleBinding(item,index)" style="width:100px;border-radius: 10px; border-color:transparent; background: rgba(52, 104, 254, .3)" color="#3468FE"
                    plain>
                    <span v-if="item.number >= 0">更新数据</span>
                    <span v-else-if="item.buttonType == 'token'">扫码绑定</span>
                    <span v-else-if="item.buttonType == 'url'">链接绑定</span>
                </el-button>
            </div>
        </div>
        <div class="right-container">
            <div class="fan-btn">
                <div :class="['btn', graphType == 'bar' ? 'active' : '']" class="btn" @click="swtichGraph('bar')">柱状图</div>
                <div :class="['btn', graphType == 'radar' ? 'active' : '']" @click="swtichGraph('radar')">雷达图</div>
            </div>
            <div class="float-box" v-show="graphType == 'radar'">
                <div ref="FensiEchartsRef" class="fensi-echarts"></div>
                <div v-for="(item, i) in platformData" :key="i" :class="['sub', `sub-${i + 1}`]">{{item.name}}</div>
            </div>
            <BarGrapg :fansData="platformData" height="85" v-show="graphType == 'bar'"></BarGrapg>
        </div>
    </div>
    <BindLink ref="BindLinkRef" @submit="handleResetFan"></BindLink>
</template>
<script>
import platformList from '../../platformList.js'
import { computed, defineComponent, onMounted, onUnmounted, watch, watchPostEffect } from 'vue';
import { thirdpartyPath, thirdpartyUserInfo } from '@/api/personnel/personnelConsole'
import { handleUpdatePlatformShow, getUserFansData } from '@/api/personnel/recruitmentWall.js'
import * as echarts from 'echarts';
import BindLink from '../BindLink'
import BarGrapg from '../BarGraph'
import { FansEcharts } from '../../platformList.js'
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const props = {
    fanData: {
        type: String,
        default: '[]',
    }
}
const components = {
    BindLink,
    BarGrapg
}
const emits = ['change']
const setup = (prop, { emit }) => {
    let myChart;
    const store = useStore();
    const BindLinkRef = ref();
    const FensiEchartsRef = ref();
    const platformData = ref([]);
    const platformOther = ref([]);
    const platformThirdparty = ref([]);
    const FanData = computed(() => {
        try {
            const data = JSON.parse(prop.fanData);
            return data;
        } catch {
            return []
        }
    })

    // 监听IM订单通知回调 - 更新绑定数据
    const handleChangeOrderStatus = ({noticeType,sourceData})=>{
        if(noticeType == 99 && sourceData.platformType){
            platformData.value = platformData.value.map(item => {
                if (item.platformType == sourceData.platformType) {
                    item.number = sourceData.number;
                }
                return item;
            })
            setEchartsOption(1)
        }
    }
    IM_EVENT_LISTERNER.addEventListenerIM('WORKER', handleChangeOrderStatus);
    onUnmounted(()=>{
        IM_EVENT_LISTERNER.removeEventListenerIM('WORKER', handleChangeOrderStatus);
    })

    onMounted(() => {
        getUserFansData().then(res => {
            platformThirdparty.value = res.data;
            res.data.forEach((item) => {
                if (item.platformShow === 1) {
                    platformData.value.push(item)
                } else {
                    platformOther.value.push(item)
                }
            })
            init(FanData.value)
        })
    })
    // 初始化
    const init = (f) => {

        // const fanData = f;
        // const list = [].concat(platformList);
        // if (fanData.length > 0) {
        //     const platformTypes = fanData.map(item => item.platformType);
        //     const data = [];
        //     const other = [];
        //     list.forEach((item) => {
        //         const index = platformTypes.indexOf(item.platformType)
        //         if (index > -1) {
        //             item.number = fanData[index].number
        //             item.url = fanData[index].url
        //             data.push(item);
        //         } else {
        //             other.push(item)
        //         }
        //     })

        //     if (data.length < 6) {
        //         if (other.length <= 6 - data.length) {
        //             data.push(...other);
        //         } else {
        //             const sp = other.splice(0, 6 - data.length);
        //             data.push(...sp);
        //         }
        //     }
        //     platformData.value = data;
        //     platformOther.value = other;
        // } else {
        //     platformData.value = list.splice(0, 6);
        //     platformOther.value = list;
        // }
        myChart = echarts.init(FensiEchartsRef.value);
        setEchartsOption()
        graphType.value = 'bar'
    }
    // 切换平台时
    const handleCommand = (code, index) => {
        const data1 = platformData.value[index];
        const data2 = platformOther.value[code];
        const newPlatformType = data2.platformType
        const lodPlatformType = data1.platformType
        handleUpdatePlatformShow({newPlatformType, lodPlatformType}).then(res => {
            // for (const item of platformThirdparty.value) {
            //     if (item.platformType == data2.platformType) {
            //         data2.number = item.fanNum;
            //     }
            // }
            platformData.value[index] = data2;
            platformOther.value[code] = data1;
            setEchartsOption(1);
        })

    }

    // 粉丝数据格式化
    const formatNum = (value) => {
        if (value >= 10000) {
            const remainder = (value / 10000).toFixed(2);
            return `${remainder}W`
        } else {
            return value
        }
    }
    // 绑定数据
    const handleBinding = (item, index) => {
        switch (item.buttonType) {
            case 'url':
                // 赋值文章id
                let target = platformList.find(plat => plat.platformType == item.platformType)
                item.articleId = target.articleId

                BindLinkRef.value.open(item)
                break;
            case 'token':
                // ScanDialogRef.value.open(item);
                thirdpartyPath({ platformType: item.platformType, scope: 'user_info' }).then(res => {
                    const features = "height=600, width=800, top=100, left=600, toolbar=no, menubar=no,scrollbars=no,resizable=no, location=no, status=no";  //设置新窗口的特性
                    const win = window.open(res.msg, item.iconClass, features);
                    window.platformWin = window.platformWin ? window.platformWin : {};
                    window.platformWin[item.platformType] = win;
                })
                break;
        }
    }
    // watch(FanData, (f, n) => {
    //     init(f)
    // })
    // 更新echart视图
    const setEchartsOption = (e) => {
        const values = [];
        const indicator = [];
        platformData.value.forEach((item, index) => {
            values.push(item.number >= 0 ? item.number : 0);
            indicator.push({ name: item.name })
        })
        FansEcharts(myChart, indicator, values);
        // if (e) {
            // emit('change', platformData.value)
        // }
    }
    // 链接绑定提交后的回调
    const handleResetFan = (res) => {
        platformData.value = platformData.value.map(item => {
            if (item.platformType == res.platformType) {
                item.number = res.fanNum || 0;
                item.url = res.url
            }
            return item;
        })
        setEchartsOption(1)
    }

    const graphType = ref('radar')
    const swtichGraph = (e) => {
        graphType.value = e
    }

    return {
        graphType,
        swtichGraph,
        formatNum,
        BindLinkRef,
        platformData,
        handleBinding,
        platformOther,
        handleCommand,
        handleResetFan,
        FensiEchartsRef,
        setEchartsOption,
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
.card-box {
    background: #181920;
    border-radius: 10px;
    padding: 20px;
    &.fensi {
        display: flex;
        justify-content: space-between;
        .left-container {
            flex: auto;
            align-self: flex-start;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: -20px;
            text-align: center;
            .platform-item {
                flex: none;
                width: 200px;
                height: 200px;
                margin-right: 20px;
                margin-bottom: 20px;
                border-radius: 10px;
                background: #1c1d24;
                box-shadow: 0px 0px 4px 0px rgba(52, 48, 227, 0.05);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: 60px 20px 20px;
                box-sizing: border-box;
                position: relative;
                &:deep(.el-input) {
                    text-align: center;
                    .el-input__inner {
                        --el-input-bg-color: none;
                        --el-input-border-color: #3d3f50;
                        --el-input-placeholder-color: #3d3f50;
                        --el-input-hover-border-color: #3a36db;
                    }
                    &.text-align-center {
                        .el-input__inner {
                            text-align: center;
                        }
                    }
                }

                .platform-title {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .icon {
                        flex: none;
                        margin-right: 4px;
                        width: 28px;
                        height: 28px;
                        border-radius: 6px;
                        overflow: hidden;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: cover;
                        &.icon_platformType-1 {
                            background-image: url(@/assets/icons/platform/douyin.png);
                        }
                        &.icon_platformType-2 {
                            background-image: url(@/assets/icons/platform/kuaishou.png);
                        }
                        &.icon_platformType-7 {
                            background-image: url(@/assets/icons/platform/bilibili.png);
                        }
                        &.icon_platformType-4 {
                            background-image: url(@/assets/icons/platform/wangyiyun.png);
                        }
                        &.icon_platformType-3 {
                            background-image: url(@/assets/icons/platform/qqyinyue.png);
                        }
                        &.icon_platformType-12 {
                            background-image: url(@/assets/icons/platform/5sing.png);
                        }
                        &.icon_platformType-13 {
                            background-image: url(@/assets/icons/platform/gutianlu9hao.png);
                        }
                        &.icon_platformType-8 {
                            background-image: url(@/assets/icons/platform/kuwoyinyue.png);
                        }
                        &.icon_platformType-10 {
                            background-image: url(@/assets/icons/platform/maoer.png);
                        }
                        &.icon_platformType-6 {
                            background-image: url(@/assets/icons/platform/ximalaya.png);
                        }
                        &.icon_platformType-9 {
                            background-image: url(@/assets/icons/platform/zhanku.png);
                        }
                        &.icon_platformType-11 {
                            background-image: url(@/assets/icons/platform/zhihu.png);
                        }
                        &.icon_platformType-15 {
                            background-color: white;
                            background-image: url(@/assets/icons/platform/weibo.png);
                        }
                        &.other {
                            background-image: url(@/assets/icons/platform/other.png);
                        }
                    }
                    .help {
                        position: absolute;
                        right: 0px;
                        top: 50%;
                        transform: translateY(-50%);
                        cursor: pointer;
                        color: #676c7f;
                    }
                    .name {
                        color: #676c7f;
                        font-size: 16px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                    }
                }
                .platform-fensi {
                    font-size: 12px;
                    color: #4e5262;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                        margin-left: 4px;
                    }
                }
                .platform-fensinum {
                    font-size: 35px;
                    color: #4e5262;
                    text-align: center;
                }
            }
        }
        .right-container {
            position: relative;
            width: 400px;
            height: 420px;
            padding: 6px 20px;
            box-sizing: border-box;
            flex: none;
            background: #1c1d24;
            box-shadow: 0px 0px 4px 0px rgba(52, 48, 227, 0.05);
            border-radius: 10px;
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
                    top: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .sub-2 {
                    top: 110px;
                    right: 300px;
                }
                .sub-3 {
                    top: 270px;
                    right: 300px;
                }
                .sub-4 {
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .sub-5 {
                    top: 270px;
                    left: 300px;
                }
                .sub-6 {
                    top: 110px;
                    left: 300px;
                }
            }
            .fensi-echarts {
                width: 100%;
                height: 100%;
            }
            .fan-btn {
                width: 150px;
                display: flex;
                background-color: #131419;
                border-radius: 8px;
                z-index: 9;
                .btn {
                    color: #9d9da1;
                    font-size: 14px;
                    padding: 6px 12px;
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
    }

    .custom-tag-box {
        flex: 1 1 100%;
        margin-left: -20px;
        margin-bottom: 30px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .custom-tag-item {
            margin-left: 20px;
            background: #30323b;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 14px;
            color: #8d91a3;
            display: flex;
            align-items: center;
            &:deep(.el-icon) {
                margin-left: 10px;
                color: #a22626;
                font-size: 16px;
                cursor: pointer;
            }
        }
    }

    .server_price-title {
        font-size: 16px;
        color: white;
        margin-bottom: 20px;
    }
    .server_price-desc {
        font-size: 12px;
        color: #4e5262;
        span {
            color: #3468fe;
        }
    }
    .server_price-form {
        &:deep(.el-form) {
            .el-form-item__label {
                color: #676c7f;
                font-size: 14px;
            }
        }
        //    .form-label{
        //         color: #676C7F;
        //         font-size: 14px;
        //        margin-right: 4px;
        //     }
        .form-help {
            color: #676c7f;
            margin-right: 4px;
            font-size: 16px;
        }
    }
}
</style>