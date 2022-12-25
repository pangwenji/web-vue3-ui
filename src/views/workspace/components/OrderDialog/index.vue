<template>
  <div class="order-el-dialog">
    <el-dialog v-model="visibled" width="500px" :before-close="onBeforeClose" :close-on-press-escape="false" :close-on-click-modal="false" custom-class="dialog-center">
        <!-- 自定义标题 -->
        <template #title="{ close, titleId, titleClass }">
            <div :id="titleId" class="my-header">{{title}}<span class="order">订单编号：{{dialogOrder}}</span></div>
        </template>
        <div class="box">
            <div class="b-txt">{{cashTitle}}</div>
            <div class="line">
                <div class="price">{{dialogPrice}}</div>
                <span class="icon-cash"></span>
            </div>
        </div>
        <template #footer>
            <div class="f-top" v-if="parseFloat(balance) < dialogPrice">可用同钱不足 <span class="t-text" @click="handleRecharge">立即购买</span></div>
            <div class="f-line">
                <div class="rest">可用余额：<span class="r-cash">{{balance}}</span><span class="icon-cash"></span></div>
                <div class="r-line">
                    <div class="o-line">订单金额：<span class="o-cash">{{dialogPrice}}</span><span class="icon-cash"></span></div>
                    <el-button @click="handlePay" class="is-custom" type="primary" color="#3468FE" style="width: 120px">确定支付</el-button>
                </div>
            </div>
        </template>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
const emits = ['onSubmit'];
const props = {
    title: {
        type:String,
        default: '同钱支付'
    }
};
const setup = (prop,{ emit })=>{
    const store = useStore();
    const dialogOrder = ref('');
    const dialogPrice = ref(0);
    const visibled = ref(false);
    const balance = computed(()=> store.state.user.money)
    const { proxy } = getCurrentInstance();
    // 弹窗关闭之前的回调
    const onBeforeClose = (deno)=>{
        if(typeof deno == 'function'){
            deno()
        }else{
            visibled.value = false;
        }
    }
    // 确认支付
    const handlePay = ()=>{
        proxy.$pay.openPay({
            orderNo: dialogOrder.value,
            confirm(){
                return new Promise((resolve,reject)=>{
                    onBeforeClose();
                    emit('onSubmit',dialogOrder.value);
                    resolve();
                })
            }
        });
    }
    const handleRecharge = ()=>{
      proxy.$pay.openRecharge();
    }
    // 打开
    const cashTitle = ref('')
    const open = ({order, price, payName = '支付金额'})=>{
        dialogOrder.value = order;
        dialogPrice.value = price;
        cashTitle.value = payName
        visibled.value = true;
    }
    return {
        open,
        balance,
        visibled,
        cashTitle,
        handlePay,
        handleRecharge,
        dialogPrice,
        dialogOrder,
        onBeforeClose
    }
}
export default defineComponent({
    setup,
    emits,
    props
})
</script>

<style lang="scss" scoped>
// 引入icon
@mixin importIcon($url, $width, $height, $margin: 0 5px 0 0) {
    background-image: url($url);
    background-repeat: no-repeat;
    width: $width;
    height: $height;
    margin: $margin;
    background-size: 100%;
}
@mixin myFront($size: 14px, $color: black, $w: 400) {
    font-size: $size;
    color: $color;
    font-weight: $w;
}
.my-header {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  color: black;
}
.icon-cash {
    @include importIcon("@/assets/icons/icon_money.png", 14px, 14px);
}
.order {
    font-size: 12px;
    color: #9094A6;
    margin-left: 6px;
}
.box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F5F6F9;
    padding: 20px;
    border-radius: 4px;
    .b-txt {
        @include myFront(14px, #9094A6)
    }
    .line {
        display: flex;
        align-items: center;
        .price {
            @include myFront(16px)
        }

    }
}
.order-el-dialog{
  :deep(.el-dialog__body){
      padding-bottom: 15px !important;
  }
}
.f-top{
  font-size: 14px;
  font-weight: 400;
  color: #9094A6;
  line-height: 20px;
  display: flex;
  margin-bottom: 7px;
  margin-left: 4px;
  .t-text{
    color: #3468FE;
    cursor: pointer;
    margin-left: 10px;
  }
}

.f-line {
    display: flex;
    justify-content: space-between;
    .rest {
        padding: 6px 8px;
        background-color: #F5F6F9;
        border-radius: 18px;
        display: flex;
        align-items: center;
        @include myFront();
        .r-cash {
            @include myFront(14px, #FF9F03);
        }
    }
    .r-line {
        display: flex;
        align-items: center;
        @include myFront();
        .o-line {
            display: flex;
            align-items: center;
            .o-cash {
                @include myFront(24px, #FF9F03);
            }
            .icon-cash {
                @include importIcon("@/assets/icons/icon_money.png", 20px, 20px);
            }
        }
    }
}
</style>
