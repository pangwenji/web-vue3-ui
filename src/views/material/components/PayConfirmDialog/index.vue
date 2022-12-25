<template>
  <div class="pay-confirm-dialog" >
    <el-dialog custom-class="pay-dialog"  v-model="payShowDialog" :close-on-click-modal="false" width="472px">
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
              <div v-if="orderInfo.materials">
                  <template v-for="(item, index) in orderInfo.materials.slice(0,3)" :key="index">
                    <div class="pay-item">
                      <div class="name-pay">{{ item.name }}</div>
                      <div style="color: #1C1D24">
                        {{ memberState == 1? (item.memberPrice .toFixed(2) || 0) : (item.price.toFixed(2) || 0) }}
                        <img style="width: 9px;height:9px" src="@/assets/user/wallet/tongqian.png"/>
                      </div>
                    </div>
                  </template>
                <div style="margin: 5px 0;color: #9094A6" v-if="orderInfo.materials.length>3">...</div>
<!--                <div style="margin: 10px 0;color: #9094A6;width: 100%;height: 1px;background: #000000;opacity: 0.05;"></div>-->
<!--                <div class="pay-item" >-->
<!--                  <div>数量</div>-->
<!--                  <div style="color: #1C1D24">× {{ orderInfo.materials.length}}</div>-->
<!--                </div>-->
              </div>
              <div v-else >
                <div class="pay-item">
                  <div class="name-pay">{{ orderInfo.name }}</div>
                  <div style="color: #1C1D24">
                    {{ totalPrice }}
                    <img style="width: 9px;height: 9px" src="@/assets/user/wallet/tongqian.png"/>
                  </div>
              </div></div>
            </div>
          </div>

          <div>
            <div class="sum-balance" v-if="orderInfo.price > money">
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
            <span class="price-num">{{ totalPrice }}</span>
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
import {payAccountGetInfo} from "../../../../api/pay/pay";
import {delOrder} from "../../../../api/material/order";
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

const totalPrice = computed(()=>{
  if(props.orderInfo.price){
    return props.orderInfo.price.toFixed(2)
  }else if(props.orderInfo.amount){
    return props.orderInfo.amount.toFixed(2)
  }else{
    return 0
  }
  
})

const payShowDialog = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const money = computed(() => {
  return store.state.user.money;
})
const memberState = computed(() => {
  return store.state.user.member.state
})

const emit = defineEmits(['onClose', 'onPayConfirm','update:show'])
const checked2 = ref(false);
const route = useRoute();
const handleClose = () => {
  //关闭弹窗时删除订单(购买订单页面不删)
  if (route.path !== '/material/main/orders'){
    delOrder(props.orderInfo.id).then(res => {})
  }
  payShowDialog.value = false
}

const handlePayConfirm = () => {
  payShowDialog.value = false
  emit('onPayConfirm', props.orderInfo)
}

const {proxy} = getCurrentInstance();
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
