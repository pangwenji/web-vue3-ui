<template>
  <div class="confirm-order-dialog">
    <el-dialog v-model="dialogVisible" :width="width" :title="title" @close="close" custom-class="confirm-order">
      <template #>
        <div class="order-info">
          <div>
            {{toolInfo.name || ''}}
            "{{orderInfo?.filename || ''}}"
          </div>
          <div style="margin-top:10px;color:#9094A6;">
            订单号：
            <span>{{orderInfo?.orderNo || ''}}</span>
          </div>
          <slot></slot>
        </div>
      </template>

      <template #footer>
        <div class="fleft">
          <div class="umoney">
            <img style="width:20px;height:20px;margin-right:7px;" src="@/assets/user/wallet/tongqian.png"/>
            可用余额
            <span class="money">{{money}}</span>
          </div>
          <div class="price">
            订单金额：
            <img style="width:20px;height:20px;" src="@/assets/user/wallet/tongqian.png"/>
            <span class="money">{{(orderInfo?.price || 0)?.toFixed(2)}}</span>
          </div>
        </div>
        <div>
          <el-button class="confirm-btn" color="#3468FE" @click="confirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  const store = useStore()

  const props = defineProps({
    width: {
      type: String,
      default:'560px',
    },
    title: {
      type: String,
      default:'确认订单',
    },
    toolInfo: {
      type: Object,
      default: {},
    },
    orderInfo: {
      type: Object,
      default: {},
    },
  })

  const dialogVisible = ref(false)

  const money = computed(() => {
    return store.state.user.money
  })

  function open() {
    dialogVisible.value = true
  }

  function close() {
    dialogVisible.value = false
  }

  const emit = defineEmits(['confirm'])

  const confirm = () => {
    dialogVisible.value = false
    emit('confirm')
  }

  defineExpose({
    open,
    close
  })


</script>

<style lang="scss" scoped>
.confirm-order-dialog {

  :deep(.el-overlay-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;

    .confirm-order {
      border-radius: 10px;
    }
  }

  .order-info {
    padding: 20px;
    border-radius: 4px;
    background-color: #F5F6F9;
  }

  :deep(.el-dialog__footer) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .fleft {
      display: flex;
      align-items: center;
      .umoney {
        padding: 0 7px;
        height: 32px;
        line-height: 32px;
        background: #F5F6F9;
        border-radius: 18px;
        display: flex;
        align-items: center;
      }

      .price {
        margin-left: 20px;
        padding: 0 7px;
        height: 32px;
        line-height: 32px;
        display: flex;
        align-items: center;
      }

      .money {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        margin-left: 4px;
        color: #FF9F03;
      }
    }

    .confirm-btn {
      width: 80px;
      height: 42px;
      color: #fff;
    }
  }
}
</style>
