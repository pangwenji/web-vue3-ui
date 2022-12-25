<template>
  <div class="pay-confirm-dialog" >
    <el-dialog custom-class="pay-dialog"  v-model="orderShowDialog" :close-on-click-modal="false" width="472px">
      <template #title>
        <div class="pay-item-order" >
          <div>确认订单&emsp;</div>
          <div class="order">订单号：{{ orderInfo.transactionNo }} </div>
        </div>
      </template>
      <div>
        <div class="pay-content">
          <div class="pay-sum">
            <div>
                <div class="pay-item">
                  <div class="name-pay">{{ orderInfo.orderName }}</div>
                  <div style="color: #1C1D24">
                    {{ orderInfo.amount  }}
                    <img style="width: 9px;height: 9px" src="@/assets/user/wallet/tongqian.png"/>
                  </div>
              </div>
            </div>
          </div>

          <div>
            <div class="sum-balance" v-if="orderInfo.amount > money">
              <span>当前余额不足，是否<span @click="recharge" class="nowRecharge">立即充值</span>？</span>
            </div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="dialog-bt">
          <div class="balance">
          可用余额 &nbsp;<span
              style="color:#FF9F03;">{{ money || 0 }}  </span> &nbsp;
            <img style="width: 15px;height: 15px" src="@/assets/user/wallet/tongqian.png"/>
          </div>
          <div class="footer-right">
            <span>
              订单金额:
            </span>
            <span class="price-num">{{ orderInfo.amount  }}</span>
            <img style="width: 20px;height: 20px;margin-right: 10px" src="@/assets/user/wallet/tongqian.png"/>
            <el-button type="primary" color="#3468FE" style="height: 42px;width: 80px;"
                       @click="handlePayConfirm">确认
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>

import {computed, nextTick, ref, watch} from "vue";
import {payAccountGetInfo} from "@/api/pay/pay";

import store from '@/store'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  orderInfo: {
    type: Object,
    default: {}
  },
})


const orderShowDialog = ref(false)
//打开对话框
function open() {
  orderShowDialog.value = true
}

defineExpose({open})

//账户余额
const money = computed(() => {
  return store.state.user.money;
})

const emit = defineEmits(['onPayConfirm'])

const route = useRoute();
const handleClose = () => {
  orderShowDialog.value = false
}

const handlePayConfirm = () => {
  orderShowDialog.value = false
  emit('onPayConfirm', props.orderInfo)
}

const {proxy} = getCurrentInstance();
//充值
const recharge = () => {
  proxy.$pay.openRecharge()
}

</script>

<style scoped lang="scss">
@import './style.scss';

:deep(.pay-dialog) {
  position: sticky;
}
</style>
