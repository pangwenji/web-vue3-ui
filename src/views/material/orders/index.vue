<template>
  <el-container style="height: 100%">
    <div class="header-content">
      <div class="header-content-top" style="border-bottom: none">
        <div>
          <span  :class="{ active: orderStatus === item.id }" v-for="(item, index) in tabListShow" :key="index" @click="handleChangStatus(item.id)">{{ item.title }}</span>
        </div>
      </div>
      <el-scrollbar ref="scroll" style="width: 100%;">
        <div v-if="orderList.length > 0 " class="box" v-loading="!load" element-loading-background="rgba(0, 0, 0, 0)">
          <div v-if="load" style="height: 100%;">
            <div class="orders-box" >
              <orders-content
                  :orderList="orderList"
                  @onPay="handlePlay"
                  @onCancel="handleCancel"
                  @onGetList="getList"
              ></orders-content>
            </div>
            <Pagination :total="orderTotal" :page="pageNum" :limit="pageSize" @pagination="handlePagination" :hideSinglePage="false"
                        layout="sizes,prev, pager, next, total, jumper" v-if="orderTotal > 10 && load"
                        class="pagination-container-box" position="center"></Pagination>
          </div>
        </div>
        <div v-else class="empty" v-loading="!load" element-loading-background="rgba(0, 0, 0, 0)">
          <span v-if="load"><empty></empty></span>
        </div>

      </el-scrollbar>
    </div>

    <!-- 支付确认 -->
    <PayConfirmDialog
        v-model:show="payShow"
        :payShow="payShow"
        :orderInfo="orderInfo"
        @onClose="handlePayClose"
        @onPayConfirm="handlePayConfirm"
    ></PayConfirmDialog>
  </el-container>
</template>
<script setup name="material-orders">
import MaterialLeft from '../components/MaterialLeft';
import ordersContent from './ordersContent';
import { useStore } from 'vuex';
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import OrdersContent from './ordersContent';
import { getOrderList } from '@/api/material/order.js';
import { payOrder } from '@/api/pay/pay.js';
import PayConfirmDialog from '../components/PayConfirmDialog'
import { ElMessage } from 'element-plus';
import ContentBottom from "../components/content/contentBottom";
import {onActivated} from "@vue/runtime-core";

const { proxy } = getCurrentInstance();
const orderList = ref([]);
const orderInfo = ref({});
const payShow = ref(false);
const orderTotal = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const orderStatus = ref(null)
let isActivate=-1;
let tabListShow = ref([
  {title: "全部订单", id: null},
  {title: '已支付', id: 1},
  {title: '待支付', id: 0},
  {title: '已取消', id: 2},
])
const load = ref(true)
onMounted(() => {
  getList();
});

function getList() {
  load.value = false
  const query = {
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  if (orderStatus.value !== null) {
    query.state = orderStatus.value
  }
  getOrderList(query).then((res) => {
    orderList.value = res.rows;
    orderTotal.value = res.total
    load.value = true;
    // 请求成功一次后 isActivate 永远就是1了
    isActivate=1;
  });
}

// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
  pageNum.value = page
  pageSize.value = limit
  getList()
}

function handleChangStatus(status) {
  orderStatus.value = status
  pageNum.value = 1
  getList()
}

function handlePlay(item) {
  orderInfo.value = item
  payShow.value = true
}

function handlePayClose() {
  payShow.value = false
}

// 确认支付
function handlePayConfirm(order) {
  proxy.$pay.openPay({
    orderNo: order.transactionNo,
    confirm:(e)=>{
      return new Promise((resolve,reject)=>{
        ElMessage.success('支付成功');

        const orderArr = []
        orderList.value.map(el => {
          const obj = el
          if (el.id === order.id) {
            obj.state = 1
          }
          orderArr.push(obj)
        })
        orderList.value = orderArr
        resolve(res);
      })
    },
    error:(err)=>{
      if(typeof err == 'object'){
        if(err.code == 1010){
          proxy.$pay.openRecharge()
        }
      }
    }
  })
}

function handleCancel(index) {
  orderList.value[index].state = 2
}

onActivated(() => {
  pageNum.value=1;
  if (isActivate===1){
    getList()
  }
})
</script>

<style scoped lang="scss">
.header-content {
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
  width: 100% -200px;
  width: 100%;
  background-color: #0A0B0D;
  overflow-y: auto;
  overflow-x: hidden;
  // position: absolute;
  // top: 0;
  // left: 0;
  background-color: #0a0b0d;
  flex-shrink: 0;
  padding: 0 15px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 1px solid #353535;

  &-top {
    padding: 15px;
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    color: rgba($color: #ffffff, $alpha: 0.3);
    justify-content: space-between;
    font-size: 16px;
    border-bottom: 1px solid rgba(173, 177, 194, 0.22);
    .active {
      // cursor: none;
      color: white;
      &::after {
        content: '';
        width: 100%;
        height: 3px;
        background: linear-gradient(42deg, #0459ff 0%, #5726dd 100%);
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 10px;
        display: inline-block;
      }
    }

    // color: ;
    .line {
      width: 1px;
      height: 16px;
      flex-shrink: 0;
      background: #eeeeee;
      margin: 0 15px;
      cursor: none;
    }

    span {
      display: inline-block;
      height: 100%;
      line-height: 38px;
      cursor: pointer;
      position: relative;
      margin-right: 44px;
      &:hover {
        color: white;
      }
    }
  }
  .empty{
    width: 100%;
    height:calc(100% - 170px);
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box{
    height: 100%;
  }
  .orders-box {
    width: 100%;
    //height: calc(100vh - 196px);
    min-height: calc(100vh - 196px);
    background: #0a0b0d;
    border-radius: 30px 0px 0px 30px;
    position: relative;
  }
}

:deep(.el-scrollbar__view){
  height: calc(100% - 0px);
}

.content-bottom {
  width: 100%;
  height: 70px;
  bottom: 32px;
  display: flex;
  justify-content: center;
}

:deep(.el-scrollbar__bar) {
  width: 0;
  height: 0;
}
.pagination-container-box {
  padding-bottom: 20px;
}
</style>
