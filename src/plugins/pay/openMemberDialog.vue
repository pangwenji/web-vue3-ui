<template>
    <div class="open-member-container">
        <el-dialog :width="dialogWidth" v-model="payShow" :before-close="handleBeforeClose" :show-close="dialogWidth !== '600px'" @closed="closeVip">
            <template v-if="vipCardState === 1">
                <div class="dialog-package-box">
                    <div class="table-row-box title" style=" height: 60px;">
                        <div class="table-column-box">功能特权</div>
                        <div class="table-column-box " style="border-left: 1px solid #F7F7F7;">体验版</div>
                    </div>
                    <div class="table-row-box price">
                        <div class="table-column-box left"></div>
                        <div class="table-column-box right">
                            <span style="font-size:32px; font-weight:bold">0</span>
                            <span>元/年</span>
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5); height: 40px;">
                        <div class="table-column-box left">审批协同项目</div>
                        <div class="table-column-box right">
                            <el-icon :size="18" color="#54D057">
                                <SuccessFilled />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style=" height: 40px;">
                        <div class="table-column-box left">在线协作文档</div>
                        <div class="table-column-box right">
                            &lt;50m/单文件
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5); height: 40px;">
                        <div class="table-column-box left">永久存储空间</div>
                        <div class="table-column-box right">
                            1G
                        </div>
                    </div>
                    <div class="table-row-box" style="height: 60px;">
                        <div class="table-column-box left">空间扩容</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5); height: 40px;">
                        <div class="table-column-box left">多节点数据备份</div>
                        <div class="table-column-box right">
                            <el-icon :size="18" color="#54D057">
                                <SuccessFilled />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="height: 40px;">
                        <div class="table-column-box left">上传下载不限速</div>
                        <div class="table-column-box right">
                            <el-icon :size="18" color="#54D057">
                                <SuccessFilled />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5);  height: 40px;">
                        <div class="table-column-box left">免费商用视频、图片、字体</div>
                        <div class="table-column-box right">
                            <el-icon :size="18" color="#54D057">
                                <SuccessFilled />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="height: 40px;">
                        <div class="table-column-box left">正版素材折扣</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5); height: 40px;">
                        <div class="table-column-box left">效率工具折扣</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="height: 40px;">
                        <div class="table-column-box left">工种库人才招募</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5); height: 40px;">
                        <div class="table-column-box left">招募墙报名接单</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="height: 40px;">
                        <div class="table-column-box left">新功能优先体验</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5); height: 40px;">
                        <div class="table-column-box left">社群圈子内部福利</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="height: 40px;">
                        <div class="table-column-box left">专属客服一对一服务</div>
                        <div class="table-column-box right">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                    </div>
                    <div class="table-row-box" style="background: rgba(245, 247, 255, .5); height: 40px; color:#C4C9D3; padding: 0 20px; font-size:12px;">
                        *初始赠送IT空间，需要增加时需联系客服扩容。
                    </div>
                </div>
                <div class="dialog-package-right">
                    <div class="title" style="font-weight: 500;">个人版</div>
                    <div class="price">
                        <div style="margin-bottom: 10px;">
                            <span style="font-size: 32px;font-weight: bold;color: #FFFFFF;">{{ memberPlan.price }}</span>
                            <span>元/年</span>
                        </div>
                        <div class="desc" style="text-decoration:line-through;">
                            原价：699元/年
                        </div>
                        <div class="desc">
                            一次就省531元
                        </div>
                        <div class="youhui"></div>
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1)">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other">
                        &lt;50m/单文件
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1)">
                        10G
                    </div>
                    <div class="cloud">
                        <div>认证创作者免费扩容*</div>
                        <div>非创作者扩容每512G/49<span style="padding:0; width: 10px; height:10px;" class="background_icon-money"></span>/年</div>
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1)">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1)">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1)">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1)">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1)">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other">
                        <el-icon :size="18" color="#54D057">
                            <SuccessFilled />
                        </el-icon>
                    </div>
                    <div class="other" style="background: rgba(245, 247, 255, .1);line-height:60px; height: 60px;">
                        <el-button @click="goPlayCard" round type="primary" color="#ffffff" style="width:140px; color: #3468FE; font-weight: 500; " size="large">立即购买
                        </el-button>
                    </div>

                </div>
            </template>
            <template v-else-if="vipCardState===2">
                <img src="@/assets/user/member-bg.png" class="member-bg" />
                <div class="dialog-box">
                    <div class="dialog-title">
                        <div class="dialog-title-left">
                            <el-avatar :size="40" :src="getters.avatar" style="background-color: black;margin-right: 10px" />
                            <div>{{ getters.nickName }}</div>
                        </div>
                        <div class="dialog-title-right">影音图文创作者必备工具箱</div>
                    </div>
                    <div style="display: flex">
                        <div style="position: relative;width: 45%;">
                            <img src="@/assets/user/member-top.png" class="member-top" />
                            <div class="member-title">个人版</div>
                        </div>
                    </div>
                    <div style="margin-top: 25px">
                        <div class="dialog-main">
                            <div style="background: white;padding: 27px 20px 0px 0px;">
                                <div class="card-title">
                                    <div>
                                        <div class="vip-title">影音同画个人版·年卡</div>
                                        <div class="vip-info">到期时间：{{ newMenberEndTime }}</div>
                                    </div>
                                    <div>
                                        <div class="vip-num">¥{{ memberPlan.price }}</div>
                                        <div class="vip-info">*1</div>
                                    </div>
                                </div>
                            </div>
                            <div class="qr_code">
                                <template v-if="!orderID">
                                    <div class="qr-code-img">
                                        <div class="code-shade" v-if="!checked">请先阅读并同意《影音同画付费服务协议》相关条款</div>
                                        <qrcode-vue :size="160" :value="qrcodeValue" level="H"></qrcode-vue>
                                    </div>
                                    <div class="cope">应付金额:
                                        <span class="cope-num" style="color:#FF9F03 ">
                                            <span style="font-size: 22px;">¥</span>
                                            <span>{{ memberPlan.price }}</span>
                                        </span>
                                    </div>
                                </template>
                                <template v-else>
                                    <div style="padding: 50px;">
                                        <ElResult icon="success" title="购买成功" style="padding:0;"></ElResult>
                                    </div>
                                </template>
                            </div>

                            <div class="text-description" v-if="!orderID">
                                <div class="agreement">
                                    <el-checkbox v-model="checked" size="large" /> <span>我已同意<span style="color:#3468FE;cursor: pointer" @click.stop="handleToAgreement('1587740248070262785')">《影音同画付费服务协议》</span>相关条款</span>
                                </div>
                                <div style="display:flex;justify-content: center;">
                                    <el-image :src="wechat" />
                                    <el-image style="margin:0 5px" :src="alipay" />
                                    <div style="margin-top: 2px">使用微信/支付宝扫码支付</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
    <ProtocolPopup ref="ProtocolPopupRef" :seconds="0" :articleId="articleId"></ProtocolPopup>
</template>
<script>

import { computed, defineComponent, nextTick, ref } from 'vue'
import { useStore } from "vuex";
import { openMember } from "../../api/pay/pay";
import ProtocolPopup from "@/components/ProtocolPopup"
import QrcodeVue from 'qrcode.vue'
import {
    ElInput,
    ElRow,
    ElCol,
    ElMessage,
    ElIcon,
    ElDialog,
    ElButton,
    ElAvatar,
    ElImage,
    ElResult,
    ElCheckbox
} from "element-plus";
import { Close, SuccessFilled } from '@element-plus/icons-vue'
import { getMemberInfo } from "../../api/user";
import { parseTime } from "../../utils/ruoyi";
import alipay from '@/assets/images/alipay.png'
import wechat from '@/assets/images/wechat.png'
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'

const components = {
    ProtocolPopup,
    ElInput, ElRow, ElCol, ElMessage, ElDialog,
    ElButton, ElAvatar, ElImage, ElResult, ElCheckbox, ElIcon,
    QrcodeVue, Close,
    SuccessFilled
}

const props = {
    payShow: {
        type: Boolean,
        default: true
    },
    removeNode: {
        type: Function,
        default: null
    },
    onSubmitSuccess: {
        type: Function,
        default: null
    },
}

const setup = (prop) => {
    const store = useStore()
    const vipCardState = ref(1)
    const orderID = ref()
    const codeOrderID = ref()
    const payShow = ref(false)
    const showClose = ref(false)
    const checked = ref()
    const articleId = ref('');
    const ProtocolPopupRef = ref();
    const qrcodeValue = ref()
    const newMenberEndTime = ref()
    const dialogWidth = ref('600px')
    const getters = computed(() => {
        return store.getters
    })

    // 跳转协议
    const handleToAgreement = (e) => {
        articleId.value = e;
        nextTick(()=>{
            ProtocolPopupRef.value.isShow = true;
        })
        // console.log(111)
    }

    const goPlayCard = () => {
        vipCardState.value = 2
        dialogWidth.value = '780px'
        // if (!checked.value) {
        //     ElMessage.warning('请先同意《会员服务协议》相关条款')
        // } else {
        //     vipCardState.value = 2
        // }
    }

    const handlePayWatch = ({ noticeType }) => {
        if (noticeType == 2) {
            prop.onSubmitSuccess && prop.onSubmitSuccess()
            handleBeforeClose();
        }
    }

    const closeVip = () => {
        prop.removeNode && prop.removeNode();
        IM_EVENT_LISTERNER.removeEventListenerIM('SYSTEM', handlePayWatch)
    }
    IM_EVENT_LISTERNER.addEventListenerIM('SYSTEM', handlePayWatch);


    const handleBeforeClose = (deno) => {
        if (deno && typeof deno == 'function') {
            deno();
        } else {
            payShow.value = false;
        }
    }

    const buyNow = () => {
        openMember().then(res => {
            qrcodeValue.value = res.data.url;
            codeOrderID.value = queryURLParams(qrcodeValue.value).merchantOrderNo;
        });
    }
    buyNow()

    /**
     * 解析URL参数
     * @param url
     * @returns {{}}
     */
    function queryURLParams(url) {
        let pattern = /(\w+)=(\w+)/ig; //定义正则表达式
        let parames = {}; // 定义参数对象
        url.replace(pattern, ($, $1, $2) => {
            parames[$1] = $2;
        });
        return parames;
    }

    const memberEndTime = ref()
    const memberState = ref()
    const memberPlan = ref([])
    const getMember = () => {
        getMemberInfo().then(res => {
            memberPlan.value = res.data.memberSchemeInfos[1]
            memberEndTime.value = parseTime(res.data?.endTime, '{y}-{m}-{d}')
            const nT = res.data?.endTime ? new Date(res.data?.endTime) : new Date()
            nT.setFullYear(nT.getFullYear() + 1)
            newMenberEndTime.value = parseTime(nT, '{y}-{m}-{d}')
            memberState.value = res.data?.state
            store.commit("SET_MEMBER", res.data)
        });
    }
    getMember()

    const open = (state) => {
        payShow.value = true;
        if(state == 2){
            goPlayCard()
        }else{
            vipCardState.value = state || 1
        }
    }

    return {
        open,
        buyNow,
        alipay,
        wechat,
        orderID,
        payShow,
        checked,
        getters,
        closeVip,
        articleId,
        getMember,
        goPlayCard,
        memberPlan,
        codeOrderID,
        dialogWidth,
        qrcodeValue,
        vipCardState,
        ProtocolPopupRef,
        newMenberEndTime,
        handleToAgreement,
        handleBeforeClose,
    }


}

export default defineComponent({
    setup,
    props,
    components,
})
</script>
<style scoped lang="scss">
.card-title {
    height: 69px;
    background: #eef0fb;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    padding: 12px;
    //margin-top: 20px;

    .vip-title {
        font-size: 16px;
        font-weight: 400;
        color: #2d2d2d;
        line-height: 24px;
    }

    .vip-num {
        font-size: 16px;
        font-weight: bold;
        color: #2d2d2d;
        line-height: 24px;
    }

    .vip-info {
        font-size: 16px;
        font-weight: 400;
        color: #9094a6;
        line-height: 30px;
        text-align: end;
    }
}

.qr_code {
    text-align: center;
    padding: 40px;
    .qr-code-img {
        position: relative;
        display: flex;
        justify-content: center;
        .code-shade {
            width: 164px;
            height: 164px;
            top: -1px;
            background: #ffffffeb;
            position: absolute;
            display: flex;
            align-items: center;
            padding: 7px;
        }
    }

    .cope {
        font-size: 18px;
        font-weight: 400;
        color: #30323b;
        line-height: 27px;
        margin-top: 15px;

        .cope-num {
            font-size: 32px;
            font-weight: bold;
            color: #3468fe;
        }
    }
}

.text-description {
    display: flex;
    align-items: center;
    justify-content: center;

    .agreement {
        color: #c4c4c4;
        font-size: 14px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        &:deep(.el-checkbox) {
            --el-checkbox-text-color: #c4c4c4;
            --el-checkbox-checked-bg-color: #3468fe;
            --el-checkbox-checked-text-color: #c4c4c4;
            --el-checkbox-checked-input-border-color: #3468fe;
            margin-right: 7px;
            .el-checkbox__input {
            }
        }
    }

    .protocol {
        // color: rgba(48, 50, 59, 0.59);
        color: rgba(48, 50, 59, 0.6);
        font-size: 14px;
        font-weight: bold;
        line-height: 19px;
    }
}

.this-status {
    transform: rotate(45deg);
    position: absolute;
    top: 18px;
    right: 0px;
}

:deep(.el-dialog) {
    border-radius: 16px;
    top: 50%;
    transform: translateY(-60%);
    min-height: 442px;
    position: relative;
}

:deep(.el-dialog__header) {
    display: none;
}

:deep(.el-dialog__body) {
    padding: 20px;
    height: 100%;

    .dialog-main {
        min-height: 250px;
        margin-top: -26px;
        margin-right: -20px;
        z-index: 109;
        background: white;
        font-size: 14px;
        color: #4e5262;

        ul {
            li {
                list-style-type: disc;
                margin-bottom: 10px;
                list-style-position: inside;
                color: #d8d8d8;
                font-size: 20px;

                span {
                    color: #4e5262;
                    font-size: 14px;
                }
            }
        }

        .line {
            width: 98%;
            height: 1px;
            border: 1px solid #ededed;
        }

        .price-box {
            display: flex;
            justify-content: flex-end;
            margin: 30px 26px;
            font-size: 16px;
        }

        .member-top {
            width: 416px;
            height: 52px;
            margin-left: -20px;
            margin-top: -9px;
        }

        .member-title {
            position: absolute;
            top: 15px;
            left: 10px;
            font-size: 16px;
            font-weight: 600;
        }
    }

    .dialog-bt {
        display: flex;
        justify-content: space-between;

        .el-button {
            width: 106px;
            height: 40px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 400;
        }

        .confirm {
            background: linear-gradient(42deg, #0459ff 0%, #5726dd 100%);
            border-radius: 10px;
            color: #ffffff;
        }
    }

    .dialog-title {
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: bold;
        color: #333539;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .dialog-title-left {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            font-size: 14px;
            margin-left: 10px;
        }

        .dialog-title-right {
            font-size: 22px;
            font-weight: 400;
            color: #ffffff;
            margin-right: 43px;
        }
    }
}

.member-bg {
    width: 100%;
    height: 122px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.dialog-box {
    width: 100%;
}

.member-top {
    width: 416px;
    height: 52px;
    margin-left: -20px;
    margin-top: -9px;
}

.member-title {
    position: absolute;
    top: 15px;
    left: 10px;
    font-size: 16px;
    font-weight: 600;
}

.title-right {
    width: 423px;
    height: 68px;
    background: linear-gradient(136deg, #3c414f 0%, #0b0c13 100%);
    border-radius: 24px 28px 16px 16px;
    position: absolute;
    right: -20px;
    top: -2px;
    z-index: -1;
}

.dialogCard-right {
    width: 100%;
    height: 68px;
    background: linear-gradient(136deg, #3c414f 0%, #0b0c13 100%);
    border-radius: 24px 28px 16px 16px;
    margin-right: -20px;
    z-index: -1;
    padding: 15px 0px 6px 65px;
    font-size: 12px;
    color: #ffffff;

    .dialogCard-right-text {
        display: flex;
        align-items: center;

        .member-title-2 {
            font-size: 16px;
            font-weight: 600;
            color: #efe8db;
            line-height: 22px;
            background: linear-gradient(
                130deg,
                #f3debe 0%,
                #efefef 60%,
                #f3dfc2 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-right: 8px;
        }
    }
}

/****************/
.dialog-package-box {
    width: 400px;
    margin-left: -20px;
    margin-top: -20px;
    margin-bottom: -20px;
    border-radius: 16px;
    overflow: hidden;

    .table-row-box {
        display: flex;
        font-size: 14px;
        align-items: center;
        color: #9094a6;

        &.title {
            font-size: 16px;
            font-weight: 500;
            border-bottom: 1px solid #f7f7f7;
            //   padding-top: 20px;
            //   padding-bottom: 20px;
            color: #3d3f50;
        }

        &.price {
            height: 124px;
        }

        .table-column-box {
            text-align: center;
            box-sizing: border-box;
            flex: 1 1 50%;

            &.left {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding-left: 20px;
            }

            &.right {
                border-left: 1px solid #f7f7f7;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}

.dialog-package-right {
    position: absolute;
    width: 200px;
    height: 846px;
    border-radius: 16px;
    overflow: hidden;
    font-size: 14px;
    left: 400px;
    top: -20px;
    color: white;
    background-image: url(@/assets/images/package-bg.png);
    background-repeat: no-repeat;
    background-size: cover;

    .title {
        font-size: 16px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        border-bottom: 1px solid rgba($color: #f7f7f7, $alpha: 0.1);
    }

    .price {
        text-align: center;
        height: 124px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;

        .youhui {
            width: 64px;
            height: 26px;
            position: absolute;
            top: 10px;
            right: 24px;
            background-image: url(@/assets/user/youhui.png);
            background-size: cover;
            background-repeat: no-repeat;
        }
    }

    .desc {
        color: rgba($color: #ffffff, $alpha: 0.4);
    }

    .cloud {
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .other {
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
}
</style>
