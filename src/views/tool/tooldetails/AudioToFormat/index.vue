<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <template #format>
            <div>
              支持文件格式：MP3、WAV、AC3、AAC、FLAC、PCM、M4A
            </div>
          </template>
        </top-description-card>
      </div>
      <div style="flex: 1">
        <tool-switch-panel :hide-header="true" :show-try="false">
          <template #useImmediately>
            <div style="min-height: 309px;padding: 20px" v-loading="iStartProcess" element-loading-text="处理中..."
                 element-loading-background="rgba(0, 0, 0, 0.6)">
              <div class="flex top">
                <div class="title">音频输出格式：</div>
                <el-radio-group v-model="radio" @change="changeRadio" :disabled="getOrderNo">
                  <template v-for="item in radioList" :key="item">
                    <el-radio :label="item.value">{{ item.type }}</el-radio>
                  </template>
                </el-radio-group>
              </div>
              <video-upload-drag
                  @startProcess="startProcessing"
                  :radio="radio"
                  :radioList="radioList"
                  :inputFile="inputFile"
                  accept=".mp3,.wav,.ac3,.aac,.flac,.pcm,.m4a"
                  @changeFile="changeFile"
                  :processResult="processResult"
                  @downFile="downFile"
                  style="margin-top: 2%"
                  @backClear="backClear"
              />
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
      <div>音频格式转换</div>
      <div>一首</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, computed, watch, onUnmounted} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import {download} from "@/utils/request"; //导入wavesurfer.js
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import VideoUploadDrag from './item'
import ToolDialog from '../../components/toolDialog'
import {ElMessage} from "element-plus";
import {toolOrder, toolOrderInfo} from "@/api/toolbox/toolbox";
import {useStore} from "vuex";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const value = ref('')
const headData = ref({});
const iStartProcess = ref(false);
const route = useRoute()

const store = useStore();
const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}
getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)
const processResult = ref(false);
const radio = ref('mp3')
const inputFile = ref(null);
const radioList = ref([{
  type: 'MP3',
  value: 'mp3'
}, {
  type: 'WAV',
  value: 'wav'
}, {
  type: 'AC3',
  value: 'ac3'
}, {
  type: 'AAC',
  value: 'aac'
}, {
  type: 'FLAC',
  value: 'flac'
}, {
  type: 'PCM',
  value: 'pcm'
},
  {
    type: 'M4A',
    value: 'm4a'
  }])

let sourceId = "";
const processVideo = ref(false)
let filename = '';
const changeFile = (row) => {
  processVideo.value = true;
  if (row) {
    processResult.value = false;
    sourceId = row.sourceId;
    filename = row.file.name;
    orderNo=-1;
  }
}

/**
 * 开始处理
 */
const showDialog = ref(false);
const startProcessing = () => {
  let costType = 1;
  if (headData.value.ifVip && headData.value.memberPrice == 0) {
    costType = 0;
  } else if (!headData.value.ifVip&&headData.value.cost == 0) {
    costType = 0;
  }
  else {
    costType = headData.value.costType
  }
  // to full version process
  if (costType != 0) {
    showDialog.value = true;
  } else {
    createOther();
    iStartProcess.value = true;
    processResult.value = 1;
  }
}

let thisTemOrderNo = "-1";
let orderNo = -1;
const createOther = () => {
  const a = radioList.value.find(res => {
    return res.value === radio.value
  })
  let data = {
    sourceId: sourceId,
    tdId: route.query.id,
    fullVersion: 1,
    additionalInformation: JSON.stringify({'filename': filename, 'radio': radio.value}),
    audioToFormat: {
      sourceId: sourceId,
      toFormat: radio.value
    }
  }
  if (orderNo === -1) {
    // 创建订单
    toolOrder(data).then(res => {
      orderNo = res.data.orderNo;
      thisTemOrderNo = orderNo;
      // 调用支付密码
      if (res.data.pay === 0) {
        playOrder(() => {
        })
      }
    })
  } else {
    playOrder(() => {
    })
  }
}

const changeRadio = () => {
  orderNo=-1;
}
const {proxy} = getCurrentInstance()
// 支付
const playOrder = (callbackPay) => {
  // 调用支付弹窗
  proxy.$pay.openPay({
    orderNo: orderNo,
    confirm: (e) => {
      return new Promise((resolve, reject) => {
        ElMessage.success('下单成功');
        resolve(null);
        showDialog.value = false;
        iStartProcess.value = true;
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


const confirmOrder = () => {
  createOther();
}


// 监听IM订单通知回调
const handleChangeOrderStatus = (attach)=>{
  let mataData=attach.sourceData;
  if (thisTemOrderNo === mataData.orderNo) {
    getOrderInfo(mataData.orderNo)
    if (mataData.status==="fail"){
      ElMessage({
        message: '处理失败',
        type: 'info',
      })
    }else {
      ElMessage({
        message: '处理完成',
        type: 'success',
      })
    }
  }
}

IM_EVENT_LISTERNER.addEventListenerIM('TOOL', handleChangeOrderStatus);
onUnmounted(()=>{
  IM_EVENT_LISTERNER.removeEventListenerIM('TOOL', handleChangeOrderStatus);
})

let temOrderInfo = null;
const getOrderInfo = (orderNoA) => {
  toolOrderInfo(orderNoA).then(item => {
    iStartProcess.value = item.data.processingStatus===1&&item.data.ifPay!==0;
    processResult.value = item.data.processingStatus;
    temOrderInfo = item.data;
    const file = temOrderInfo.sourceFileVOList[0] || temOrderInfo.sourceFileVO;
    const additionalInformation = JSON.parse(temOrderInfo.additionalInformation);
    radio.value = additionalInformation?.radio;
    file.processingStatus = item.data.processingStatus;
    inputFile.value = file;
    if (item.data.ifPay===0){
      // processResult.value=0
      sourceId=item.data?.sourceFileVO?.encryptIdFileId
      orderNo=getOrderNo.value;
    }
  })
}

const downFile = () => {
  download(temOrderInfo.sourceFileVOList[0]?.downloadUrl, {}, temOrderInfo.sourceFileVOList[0]?.filename)
}


/**
 * get order number
 * @type {ComputedRef<string | LocationQueryValue[]>}
 */
const getOrderNo = computed(() => {
  return route.query.orderNo;
})

/**
 * if route hava order number, modify web page state
 */
if (getOrderNo.value) {
  thisTemOrderNo = getOrderNo.value
  getOrderInfo(getOrderNo.value);
}

watch(()=>getOrderNo.value,()=>{
  if (getOrderNo.value){
    processResult.value=false;
    thisTemOrderNo = getOrderNo.value
    getOrderInfo(getOrderNo.value);
  }
})

const backClear = () => {
  processResult.value = false;
}


</script>
<style scoped lang="scss">
@import "./style.scss";
:deep(.el-tabs__content){
  border-radius: 16px !important;
}
</style>
