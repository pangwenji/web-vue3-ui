<template>
  <div class="tool-dialog">
    <el-dialog  v-model="toolShow" :show-close="false" :width="width" @close="close">
      <div>
        <div class="dialog-title" >
          <div >{{ title }}</div>
          <div @click="close"><el-icon><CloseBold style="color: #ABABAB" /></el-icon></div>
        </div>

        <div style="margin: 20px 0;height: 1px;background: #000000;opacity: 0.05;"></div>

        <div class="order-form">
          <slot> </slot>
        </div>

        <slot name="other"> </slot>
        <div class="over-data">
          <div class="over-num">
            <img style="width:16px;height:16px;padding: 2px;transform: translateY(2px)"
                 src="@/assets/user/wallet/tongqian.png"/>可用余额 <span style="color:#FF9F03;">{{ money }}</span>
          </div>
          <div style="margin-top: 4px">
            <div v-if="headData.costType === '3'">
              点击确定将从您的可用余额扣除{{ ((headData.ifVip? headData.memberPrice : headData.cost) * Math.ceil(duration * 1 / 60))?.toFixed(2) }}同钱</div>
            <div v-else>
              点击确定将从您的可用余额扣除{{headData.ifVip? headData.memberPrice:headData.cost }}同钱
            </div>
          </div>
        </div>
        <div class="dialog-bt">
          <el-button @click="close">取消</el-button>
          <el-button class="confirm" @click="confirm" v-if="getIsToRecharge">确定</el-button>
          <el-button class="confirm" @click="recharge" v-else>充值</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";
import {ElMessage, ElMessageBox} from 'element-plus';
const {proxy} = getCurrentInstance();
const store = useStore();
const props = defineProps({
  show: {
    type:Boolean,
    default: false,
  },
  width:{
    default:'560px',
    type:String,
  },
  title:String,
  headData:Object,
  duration: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['confirm','update:show'])
const close = () => {
  // emit('update:show',false);
  toolShow.value=false;
}
const toolShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})
const confirm = () => {
  emit('confirm')
}


const money = computed(() => {
  return store.state.user.money;
})

const recharge = () => {
  proxy.$pay.openRecharge()
  // ElMessageBox.confirm('当前同钱余额不足，是否立即充值同钱？', '提示', {
  //   customClass: 'messageBox-custom-warning',
  //   confirmButtonText: '确认',
  //   cancelButtonText: '取消',
  //   type: 'info',
  // })
  //     .then(() => {
  //       proxy.$pay.openRecharge()
  //     }).catch(() => {
  //   ElMessage({
  //     type: 'info',
  //     message: '取消购买',
  //   });
  // });
}

const getIsToRecharge=computed(()=>{
  if (props.headData.ifVip){
    return Number.parseFloat(money.value)>=Number.parseFloat(props.headData.memberPrice)
  }else {
    return Number.parseFloat(money.value)>=Number.parseFloat(props.headData.cost);
  }
})
</script>

<style scoped lang="scss">
@import "./style.scss";
.tool-dialog {
  position: relative;

  .over-data {
    position: absolute;
    bottom: 25px
  }

  .over-num {
    background: #F5F6F9;
    border-radius: 18px;
    font-size: 14px;
    display: inline-block;
    align-items: center;
    padding: 10px;
    color: #1C1D24;

    .num {
      font-size: 28px;
      font-weight: 500;
      color: #FF9F03;
      line-height: 40px;
      margin-left: 10px;
    }
  }
  .order-form {
    display: flex;
    justify-content: space-between;
    background: #F5F6F9;
    border-radius: 7px;
    font-size: 16px;
    font-weight: 400;
    color: #1C1D24;
    line-height: 25px;
    padding: 20px;

  }
}
</style>
