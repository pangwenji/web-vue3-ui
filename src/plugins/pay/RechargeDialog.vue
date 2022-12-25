<template>
    <div class="recharge-container">
        <el-dialog v-model="visibled" :width="rechargeSuccess? '350px':'456px'" :close-on-click-modal="false" @closed="handleClosed" :before-close="onBeforeClose" custom-class="dialog-center">
            <template #title v-if="!rechargeSuccess">
                <span>购买</span>
            </template>
            <div v-if="!rechargeSuccess">
                <div class="line"></div>
                <div class="number-input">
                    <div>充值金额：{{ rechargeNumber || 0 }}</div>
                </div>
                <template v-if="!QrcodeValue">
                    <div class="tag-box">
                        <template v-for="(item,index) in prices" :key="index">
                            <div class="tag-item" @click="itemCheck(item,index)" :class="{'active': activeItem === index}">
                                {{ item }}
                            </div>
                        </template>

                        <div class="tag-item" :class="{'active': activeItem === -1}" @click="activeItem = -1; rechargeNumber = rechargeValue">
                            <span v-if="activeItem != -1">自定义</span>
                            <el-input-number v-else v-model.number="rechargeValue" placeholder="自定义" :min="1" :max="99999" @change="handleChangeInput" :controls="false" />
                        </div>
                    </div>
                    <div class="line line-btm"></div>
                </template>
                <template v-else>
                    <div style="text-align:center; margin: 40px 0 20px;">
                        <template v-if="!rechargeSuccess">
                            <div class="qrcode-box">
                                <template v-if="isCheckAgreement">
                                    <QrcodeVue :size="120" :value="QrcodeValue" level="H"></QrcodeVue>
                                </template>
                                <template v-else>
                                    <div>请先阅读《影音同画付费服务协议》相关条款，并勾选同意</div>
                                </template>
                            </div>
                            <div class="text-description">
                                <div style="display:flex;justify-content: center; margin-bottom: 12px;">
                                    <el-image style="width: 18px;height:18px" :src="wechat" />
                                    <el-image style="margin:0 5px;width: 18px;height:18px" :src="alipay" />
                                    <div style="margin-top: 2px; color: #C4C4C4;">使用微信/支付宝扫码支付</div>
                                </div>
                                <div style="display:flex;justify-content: center; align-items:center;">
                                    <el-checkbox v-model="isCheckAgreement" size="large"></el-checkbox>
                                    <div style=" margin-left: 8px;color: #C4C4C4;">我已同意<span style="color: #3468FE; cursor: pointer;" @click="ProtocolPopupRef.isShow = true;">《影音同画付费服务协议》</span>相关条款</div>
                                </div>
                            </div>
                            <!-- <div class="text-description">
                                <div style="display:flex;justify-content: center;">
                                    <el-image style="width: 18px;height:18px" :src="wechat" />
                                    <el-image style="margin:0 5px;width: 18px;height:18px" :src="alipay" />
                                    <div style="margin-top: 2px">使用微信/支付宝扫码支付</div>
                                </div>
                            </div> -->
                        </template>
                        <!--          <template v-else>-->
                        <!--            <div>-->
                        <!--              <ElResult icon="success" title="充值成功" style="padding:0;"></ElResult>-->
                        <!--            </div>-->
                        <!--          </template>-->
                    </div>
                </template>
            </div>
            <div v-else class="pay-success">
                <div class="success-text">
                    <div style="width: 20px;height: 20px"><img style="width:  20px;height:  20px" src="@/assets/images/success.png" /> </div>
                    <div>支付成功</div>
                </div>
                <div class="success-box">
                    <div style="color: #1C1D24;font-weight: 400;">
                        <div style="line-height: 28px;">支付金额：</div>
                        <div style="line-height: 14px;">账户余额：</div>
                    </div>
                    <div>
                        <div style="line-height: 28px;">{{ rechargeNumber || 0 }}</div>
                        <div style="line-height: 14px;color: #FF9F03;display: flex;align-items: center">
                            <div>{{ money || 0 }}</div>
                            <img style="width: 14px;height: 14px" src="@/assets/user/wallet/tongqian.png" />
                        </div>
                    </div>
                </div>
                <div style="text-align: center">
                    <el-button style="width: 120px;height: 42px;margin-bottom: 25px" type="primary" color="#3468FE" @click="handleCallBack">
                        继续购买
                    </el-button>
                </div>
            </div>
            <template #footer v-if="!rechargeSuccess">
                <div class="balance">
                    可用余额 &nbsp;<span style="color:#FF9F03;">{{ money || 0 }}</span> <img style="width: 9px;height: 9px" src="@/assets/user/wallet/tongqian.png" />
                </div>
                <div class="footer-right" v-if="!QrcodeValue">
                    <span>
                        实际支付:<span style="color: #FF9F03">¥</span><span class="price-num">{{ rechargeNumber || 0 }}</span>
                    </span>
                    <!--                    <el-button type="default" color="#3468FE" plain @click="onBeforeClose">取消</el-button>-->
                    <el-button type="primary" color="#3468FE" :loading="loadingStatus" @click="handleSubmit">立即支付
                    </el-button>
                </div>
                <div v-else style="text-align:center;   display: flex;    align-items: center;">
                    <span>
                        实际支付:<span style="color: #FF9F03">¥</span><span class="price-num">{{ rechargeNumber || 0 }}</span>
                    </span>
                    <el-button type="primary" color="#3468FE" @click="handleCallBack">返回
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
    <ProtocolPopup ref="ProtocolPopupRef" @readCallback="isCheckAgreement  = true" :seconds="0" articleId="1587740248070262785"></ProtocolPopup>
</template>
<script>
import { payServiceUrl } from '@/api/pay/pay.js'
import QrcodeVue from 'qrcode.vue'
import { computed, defineComponent, onBeforeUnmount, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon'
import { ElDialog, ElInputNumber, ElButton, ElResult, ElInput, ElImage, ElMessage, ElNotification } from "element-plus";
import store from '@/store'
import alipay from '@/assets/images/alipay.png'
import wechat from '@/assets/images/wechat.png'
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
import ProtocolPopup from "@/components/ProtocolPopup"

const components = {
    ElInput,
    SvgIcon,
    ElImage,
    ElResult,
    ElDialog,
    ElButton,
    QrcodeVue,
    ProtocolPopup,
    ElInputNumber,
}
const props = {
    removeNode: {
        type: Function,
        default: null
    }
}
const setup = (prop) => {



    const orderId = ref(0);
    const prices = ['10', '50', '100', '500', '1000'];
    const visibled = ref(false);
    const activeItem = ref(null);
    const itemType = ref(true);
    const rechargeValue = ref(1);
    const rechargeSuccess = ref(false);
    const rechargeNumber = ref('');
    const QrcodeValue = ref(null);
    const loadingStatus = ref(false);
    const isCheckAgreement = ref(false);
    const ProtocolPopupRef = ref();
    const onBeforeClose = (deno) => {
      if (loadingStatus.value) {
        return
      }
      QrcodeValue.value = null;
      rechargeValue.value = 1;
      if (typeof deno == 'function') {
        deno()
      } else {
            visibled.value = false;
        }
    }

    const money = computed(() => {
        return store.state.user.money;
    })

    // 输入框改变时
    const handleChangeInput = (e) => {
        if (rechargeValue.value.length > 5) {
            ElMessage.warning('单次最多可充值999999同钱');
            return;
        } else {
            rechargeNumber.value = rechargeValue.value || 0
        }
    }
    // 立即支付
    const handleSubmit = () => {
        if (loadingStatus.value) {
            return
        }
        if (rechargeValue.value.length > 5) {
            ElMessage.warning('单次最多可充值99999同钱');
            return
        }
        rechargeSuccess.value = false;
        const amount = rechargeNumber.value;
        if (!amount || amount <= 0) {
            ElMessage.warning('充值数量不能为空');
            return
        }
        loadingStatus.value = true;
        payServiceUrl({ amount }).then(res => {
            loadingStatus.value = false;
            orderId.value = res.data.orderId;
            QrcodeValue.value = res.data.url;
        }).catch(err => {
            loadingStatus.value = false;
        })
    }
    const itemCheck = (item, index) => {
        activeItem.value = index
        // rechargeValue.value = item;
        rechargeNumber.value = item
    }

    const handleCallBack = ()=>{
        QrcodeValue.value = null;
        rechargeSuccess.value = false;
        isCheckAgreement.value = false;
    }

    // 监听充值成功得回调
    const handlePayWatch = ({ noticeType, sourceData }) => {
        if (noticeType == 1) { //充值成功
            onBeforeClose();
        }
    }
    // 弹窗关闭动画结束时的回调函数
    const handleClosed = () => {
        prop.removeNode && prop.removeNode();
        IM_EVENT_LISTERNER.removeEventListenerIM('PAY', handlePayWatch)
    }
    IM_EVENT_LISTERNER.addEventListenerIM('PAY', handlePayWatch)
    const open = () => {
        visibled.value = true;
    }
    return {
        open,
        money,
        orderId,
        prices,
        activeItem,
        itemType,
        visibled,
        itemCheck,
        QrcodeValue,
        handleClosed,
        handleSubmit,
        rechargeValue,
        loadingStatus,
        onBeforeClose,
        handleCallBack,
        rechargeNumber,
        rechargeSuccess,
        ProtocolPopupRef,
        isCheckAgreement,
        handleChangeInput,

        alipay,
        wechat,
    }
}
export default defineComponent({
    setup,
    props,
    components
})
</script>
<style scoped lang="scss">
.recharge-container {
    &:deep(.el-checkbox){
        --el-checkbox-checked-text-color: #3468FE;
        --el-checkbox-checked-input-border-color: #3468FE;
        --el-checkbox-checked-bg-color: #3468FE;
        --el-checkbox-input-border-color-hover: #3468FE;
    }
    .line {
        width: 406px;
        height: 1px;
        background: #000000;
        opacity: 0.05;
        margin-bottom: 20px;
    }

    .line-btm {
        margin-top: 20px;
    }

    &:deep(.el-dialog__body) {
        padding-top: 10px;
        padding-bottom: 0px;
    }

    &:deep(.el-dialog__footer) {
        display: flex;
        justify-content: space-between;
    }

    .number-input {
        width: 100%;
        position: relative;
        margin-bottom: 20px;

        input {
            width: 100%;
            padding: 12px 20px 12px 40px;
            outline: none;
            border: 1px solid #dcdfe6;
            border-radius: 8px;
            font-size: 16px;

            &:focus {
                border-color: #3468fe;
            }
        }

        .prefix-box {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .tag-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 -6px;
        flex-wrap: wrap;

        .tag-item {
            flex: none;
            width: 128px;
            height: 53px;
            background: #f5f6f9;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            border: 1px solid #dadce1;
            border-radius: 10px;
            margin: 0 6px 12px;
            cursor: pointer;
            color: #1c1d24;

            &:hover {
                border: 1px solid #3468fe;
                background: rgba(52, 104, 254, 0.1);
            }

            &.active {
                border: 1px solid #3468fe;
                background: rgba(52, 104, 254, 0.1);
            }
        }
    }

    .describe-box {
        padding: 10px 0;
        font-size: 14px;

        span {
            font-size: 16px;
            font-weight: bold;
        }

        .black {
            color: #000000;
        }

        .red {
            color: #f03860;
        }
    }

    .qrcode-box {
        width: 130px;
        height: 130px;
        color: #C4C4C4;
        display: inline-block;
        margin: 0 auto 20px;
        border-radius: 4px;
        padding: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid #E6E6E6;
    }

    .balance {
        font-size: 14px;
        font-weight: 400;
        height: 32px;
        background: #f5f6f9;
        border-radius: 18px;
        padding: 8px;
        display: flex;
        align-items: center;
    }

    .footer-right {
        display: flex;
        align-items: center;
    }

    .price-num {
        color: #ff9f03;
        font-size: 24px;
        margin-right: 10px;
        margin-right: 10px;
        margin-left: 5px;
    }

    .el-button {
        border-radius: 8px;
    }

    :deep(.el-input__inner) {
        background: #f5f6f9;
        box-shadow: none;
    }
}

.pay-success {
    .success-text {
        
        font-weight: 500;
        color: #181920;
        line-height: 22px;
        font-size: 16px;
        padding-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .success-box {
        height: 90px;
        background: #f5f6f9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        margin: auto;
        justify-content: center;
        margin-bottom: 20px;
    }
}
</style>
