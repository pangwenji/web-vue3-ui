<template>
  <el-col
    :xl="6"
    :lg="12"
    :span="6"
    :style="{maxWidth: width,flex:width?('0 0 ' + width) : false}"
    style="padding:10px;"
  >
    <div class="enroll-item" @click="linkToDetail">
      <div class="item-top">
        <div class="left">
          <el-avatar :size="50" :src="data.avatar" />
          <div class="uname">{{data.nickName}}</div>
          <div class="contact" @click.stop="handleOpenSession">
            <svg-icon iconClass="message2" :size="16" ></svg-icon>
            <span style="margin-left:4px" @click="handleCathUser">联系</span>
          </div>
        </div>
        <div class="right" :style="[statusMap[data.undertakerState].statusClass]">
          <svg-icon :iconClass="statusMap[data.undertakerState].icon" :size="20" ></svg-icon>
          <span>{{statusMap[data.undertakerState].name}}</span>
        </div>
      </div>

      <div class="item-content">
        <span class="content-text"><span class="flag"></span>{{data.recruitTitle}}</span>
      </div>

      <div class="item-info">
        <div class="left">
          <div v-for="(other, i) in data.categoryItems" :key="i" v-show="i < 2">
            <span class="enroll-tag">{{other.categoryTitle}}</span>
          </div>
          <span class="enroll-tag" v-if="data.categoryItems.length > 2">...</span>
        </div>
        <div class="right">
          <span class="cash-label">预算</span>
          <span class="cash-num">{{data.budgetPrice}}</span>
          <span class="background_icon-money"></span>
        </div>
      </div>

      <div class="item-bottom">
        <div class="left">
          <span class="end-date" v-if="data.endSignUp">已经截止</span>
          <span class="date-label" v-else>招募时间：{{dateHandle(data.createTime)}} 至 {{data.endDate}}</span>
        </div>
        <div class="btn-row" v-if="isCanCheck">
          <el-button v-if="!props.data.confirmOrder" type="primary" color="#0DA411" style="width: 100px;" round @click.stop="confirm">确认接单</el-button>
          <span v-else>已接单</span>
          <el-button type="primary" color="#3468FE" style="width: 100px;" round @click.stop="checkOrder">查看订单</el-button>
        </div>
        <el-button v-else type="info" color="#3468FE" style="width: 100px;" round>查看招募</el-button>
      </div>
  </div>
  </el-col>
</template>
<script setup>
import { computed } from 'vue'
import {confirmOrder} from "@/api/personnel/personnelConsole"

const { proxy } = getCurrentInstance()
const router = useRouter()
const statusMap = {
  0: {name: '筛选中', icon: 'screening', statusClass:{'color': '#F88212', background: '#452E1D'}},
  1: {name: '已选中', icon: 'sign_selected', statusClass:{'color': '#3468FE', background: '#263358'}},
  2: {name: '未选中', icon: 'sign_unselected', statusClass:{'color': '#E91E19', background: '#421A1E'}}
}


const emit = defineEmits(['checkSucc'])
const props = defineProps({
  width: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: {}
  }
})
// 状态 - 已被甲方选中且甲方已支付
const isCanCheck = computed(()=> props.data.undertakerState == 1 && props.data.ifPay)

// 跳转 - 招募详情
function linkToDetail() {
  router.push({ path: `/workspace/recruit/${props.data.recruitId}`})
}

// 日期展示
const dateHandle = computed(()=>{
  return (e) => {
    return e.split(' ')[0]
  }
})

// 点击 - 接单
const confirm = ()=> {
  // 已接单无交互
  if (props.data.confirmOrder) {
    return
  }
  let params = {
    recruitApplyId: props.data.id
  }
  confirmOrder(params).then(() => {
    proxy.$modal.msgSuccess('接单成功')
    emit('checkSucc')
  })
}


// 联系
const handleCathUser = () => {
    const userId = props.data.initiatorUserId;
    proxy.$sessionBox.openDialog({ userId })
}

// 点击 - 查看订单
const checkOrder = ()=> {
  router.push({ path: `/workspace/admin/order_detail/${props.data.orderNo}` })
}

function handleOpenSession() {
  const {avatar, nickName ,userId} = props.data?.user || {};
  if (!userId) return;
  proxy.$sessionBox.openDialog({
    avatar, 
    name:nickName, 
    userId,
    success(){
      onBeforeClose();
    }
  });
}

</script>

<style scoped lang="scss">
.enroll-item{
  width: 100%;
  padding: 16px 18px;
  background-color: #181920;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background: #24262F;
    .cash-num {
      color: #F88212 !important;
    }
    .flag {
      background: #3468FE !important;
    }
  }

  .item-top{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .left{
      display: flex;
      align-items: center;
      .uname{
        margin: 0 10px;
        font-size: 16px;
        font-weight: 500;
        color: #9094A6;
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .contact{
        display: flex;
        align-items: center;
        padding: 4px 10px;
        background-color: rgba($color: #3468FE, $alpha: .2);
        border-radius: 7px;
        font-size: 12px;
        color: #3468FE;
        cursor: pointer;
      }
    }

    .right{
      padding: 4px 13px;
      display: flex;
      align-items: center;
      border-radius: 14px;
      font-size: 14px;
      span{
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin-left: 4px;
      }
    }
  }
  
  .item-content{
    margin-top: 12px;
    padding: 14px 12px;
    font-size: 16px;
    color: #666A7A;
    background-color: rgba($color: #16161B, $alpha: .8);
    border-radius: 6px;
    .content-text{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .flag {
      display: inline-block;
      width: 4px;
      height: 12px;
      margin-right: 6px;
      background: #3D3F50;
    }
  }
  
  .item-info{
    margin-top: 20px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
      display: flex;
      .enroll-tag{
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 0 18px;
        margin-right: 16px;
        font-size: 16px;
        color: #676C7F;
        border-radius: 6px;
        background-color: rgba($color: #3D3F50, $alpha: .2);
      }
    }
    .right{
      line-height: 29px;
      display: flex;
      align-items: center;
      .cash-label {
        font-size: 14px;
        font-weight: 400;
        color: #666A7A;
      }
      .cash-num {
        margin-left: 8px;
        font-size: 26px;
        font-weight: 500;
        color: #C2C7CE;
      }
    }
  }

  .item-bottom{
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        color: #676C7F;
      }
      .end-date {
        color: red;
        margin-left: 20px;
      }
    }
    .btn-row {
      display: flex;
      align-items: center;
      span {
        margin-right: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #666A7A;
      }
    }
  }
}
</style>