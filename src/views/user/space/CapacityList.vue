<template>
  <div class="table-box">
    <div class="table">
      <div class="table-item" style="background: #0A0B0D;height: auto;padding-bottom: 16px;">
        <div class="col3">容量包名称</div>
        <div class="col3">到期时间</div>
        <div class="col3">状态</div>
        <div class="col2">操作</div>
      </div>
    </div>
  </div>
  <div style="flex: 1;position: relative">
    <div style="overflow:hidden;width: 100%;height: 100%; position: absolute;" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)">
      <el-scrollbar style="height:100%;" view-style="min-height: 100%; position:relative;display: flex;flex-direction: column;">
        <div class="table-box" style="flex:1" v-if="capacityList.length > 0 && !loadingStatus">
          <transition name="table">
            <div class="table">
              <div class="table-item" v-for="item in capacityList" :key="item">
                <!--容量包名称-->
                <div class="col3">{{ item.name || '-' }}</div>
                <!--到期时间-->
                <div class="col3">{{ item.endTime || '永久' }}</div>
                <!-- 状态 1正常 2过期 -->
                <div class="col3">{{ item.status === 1 ? '正常' : '已过期' || '-' }}</div>
                <!-- 操作-->
                <div class="col2">
                  <span class="renew-text" @click="handleRenew(item)" v-if="item.allowRenewal === 1">续费</span>
                  <span v-else>-</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="!loadingStatus" class="empty">
          <Empty description="">
            <template #description>
              <div>当前无记录</div>
            </template>
          </Empty>
        </div>
        <Pagination :total="total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination"
                    class="pagination-container-box" position="center"></Pagination>
      </el-scrollbar>
    </div>
  </div>

  <!--  确认订单对话框-->
  <orderConfirmDialog :orderInfo="orderInfo" ref="orderDialog" @onPayConfirm="handlePayConfirm"></orderConfirmDialog>


  <succeed-dialog ref="SucceedDialog" :info="dialogInfo"></succeed-dialog>

</template>
<script setup>
import {ref, reactive, onMounted, defineProps, watch} from 'vue'
import {getUsingResource,renewalResource} from "@/api/user/space";
import {ElMessage} from "element-plus";
import orderConfirmDialog from '@/plugins/orderConfirmDialog/index.vue'
import succeedDialog from './succeedDialog.vue'
const { proxy } = getCurrentInstance();
const loadingStatus = ref(false)
const capacityList = ref([])
const total = ref(0);
const params = reactive({
  pageSize: 10,
  pageNum: 1,
})
onMounted(() => {
  getCapacityInfo()
})

const getCapacityInfo = () => {
  loadingStatus.value = true;
  getUsingResource(params).then(res => {
    capacityList.value = res.rows
    total.value = res.total
    loadingStatus.value = false;
  }).catch(err => {
    loadingStatus.value = false;
  });
}

const orderInfo = ref({})
//确认订单
const orderDialog = ref(null)
const itemInfo = ref({})
const handleRenew = (item) => {
  itemInfo.value = item
  renewalResource({id:item.id}).then( res =>{
    orderInfo.value = res.data
    orderDialog.value.open()
  })
}

const emit = defineEmits(['onGetFileData'])

const SucceedDialog = ref(null)
const dialogInfo = ref({})
// 确认支付
function handlePayConfirm(order) {
  proxy.$pay.openPay({
    orderNo: order.transactionNo,
    confirm:(e)=>{
      return new Promise((resolve,reject)=>{
        ElMessage.success('支付成功');
        dialogInfo.value = {
          tip:itemInfo.value.name,
          endTime: orderInfo.value.endTime,
          type:2,
        }
        SucceedDialog.value.open()
        getCapacityInfo()
        emit('onGetFileData')
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
// 分页
const handlePagination = ({page, limit}) => {
  params.pageNum = page;
  params.pageSize = limit;
  getCapacityInfo();
}

</script>
<style scoped lang="scss">
@import "./style.scss";

</style>
