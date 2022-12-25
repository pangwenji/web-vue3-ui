<template>
  <div class="main-card">
    <el-scrollbar height="100%">
    <div>
      <top-description-card :data="headData">
        <template #format>
          <div class="mt10 detail-text-file-type"  >支持文件格式：MP4 / WEBM</div>
        </template>
      </top-description-card>
    </div>
    <div style="flex: 1">
      <tool-switch-panel :hide-header="true" :show-try="false">
        <template #useImmediately>
          <div style="min-height: 400px">
            <video-upload-gif
                accept=".mp4,.webm"
                @startProcess="startProcessing"
                @changeFile="changeFile"
                ref="videoGif"
                v-model:processResult="processResult"
            />
          </div>
        </template>

        <template #giveTry>
          <div style="min-height: 400px">

          </div>
        </template>
      </tool-switch-panel>
    </div>
    </el-scrollbar>
    <!--    完整版的弹窗    -->
    <tool-dialog
        v-model:show="showDialog"
        @confirm="confirmOrder"
        :head-data="headData"
        title="订单支付确认">
      <div>视频转Gif</div>
      <div>一部</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>
  </div>
</template>

<script setup>
import {ref,getCurrentInstance,computed,watch} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import VideoUploadGif from './VideoUploadGif'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import ToolDialog from '../../components/toolDialog'
import {ElMessage} from "element-plus";
import { toolOrder,toolOrderInfo} from "@/api/toolbox/toolbox";
import {useStore} from "vuex";
const value = ref('')
const headData = ref({})
const route = useRoute()
const store = useStore();
const getToolDetail=()=>{
  toolDetail(route.query.id).then(res=>{
    headData.value=res.data;
  })
}
getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)
const videoGif=ref(null);

const fileChange = (row) => {
  file.value = row
}

/**
 * 开始处理
 */
const showDialog = ref(false);
let formData={};
const startProcessing = (form) => {
  // to full version process
  formData=form;
  let costType=1;
  if (headData.value.ifVip&&headData.value.memberPrice==0){
    costType=0;
  }else if (headData.value.cost==0){
    costType=0;
  }else {
    costType=headData.value.costType
  }
  // to full version process
  if (costType!=0){
    showDialog.value = true;
  }else {
    createOther();
    processResult.value = 1;
  }
}
const confirmOrder = () => {
  createOther();
}

let thisTemOrderNo="-1";
let orderNo = -1;
const createOther=()=>{
  let data = {
    additionalInformation:JSON.stringify(formData),
    sourceId: sourceId,
    tdId: route.query.id,
    fullVersion: 1,
    videoToGif:formData
  }
  // if (orderNo === -1) {
    // 创建订单
  toolOrder(data).then(res => {
    orderNo = res.data.orderNo;
    thisTemOrderNo=orderNo;
    // 调用支付密码
    if (res.data.pay === 0) {
      playOrder(() => {
      })
    }
  })
  // }else {
  //   playOrder(()=>{})
  // }
}


const {proxy} = getCurrentInstance()
// 支付
const playOrder = (callbackPay) => {
  // 调用支付弹窗
  proxy.$pay.openPay({
    orderNo: orderNo,
    confirm: (e) => {
      return new Promise((resolve, reject) => {
        processResult.value=1;
        ElMessage.success('下单成功');
        resolve(null);
        showDialog.value = false;
        orderNo = -1;
        callbackPay();
      })
    },
    error: (err) => {
      if (typeof err == 'object') {
        if (err.code == 1010) {
          proxy.$pay.openRecharge()
        }
      }
    }
  })
}

let sourceId = "";
const processVideo = ref(false)
const changeFile = (row) => {
  processVideo.value = true;
  processResult.value=0;
  if(row){
    sourceId = row.sourceId;
  }
}

/**
 * get order number
 * @type {ComputedRef<string | LocationQueryValue[]>}
 */
const getOrderNo = computed(() => {
  return route.query.orderNo;
})
const processResult = ref(0);
let temOrderInfo = null;
const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    processResult.value =  item.data.processingStatus;
    temOrderInfo = item.data;
    videoGif.value.thisFile={
      ...temOrderInfo.sourceFileVOList[0],
      ...JSON.parse(temOrderInfo.additionalInformation||"{}")
    };
  })
}
/**
 * if route hava order number, modify web page state
 */
if (getOrderNo.value) {
  thisTemOrderNo=getOrderNo.value
  getOrderInfo(getOrderNo.value);
}

const sessions = computed(() => {
  const im = store.state.IM
  return im.sessions
})

watch(sessions, (value) => {
  const {lastMsg} = value[0]
  if (lastMsg.attach) {
    if (lastMsg.attach.title === '工具') { //工具
      const mataData = JSON.parse(lastMsg.attach.mataData);
      if (thisTemOrderNo === mataData.orderNo) {
        getOrderInfo(mataData.orderNo)
      }
    }
  }
})

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
