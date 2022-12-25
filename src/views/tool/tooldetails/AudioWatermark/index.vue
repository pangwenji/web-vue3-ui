<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <template #format>
            支持文件格式：MP3、WAV
          </template>
        </top-description-card>
      </div>
      <div style="flex: 1">
        <tool-switch-panel @tab="tabSwitch" >
          <template #useImmediately>
            <div style="min-height: 500px">
              <div class="water-main">
                <watermark-file-upload
                    ref="watermark"
                    accept=".mp3,.wav"
                    v-model:status="isOther"
                    @watermark="watermarkOnMounted"
                    :playStatue="isPlay"
                    @changeFile="changeFileWaterMark"></watermark-file-upload>
              </div>
              <div class="water-main" v-if="processResult">
                <add-watermark-audio-upload-drag
                    ref="addWater"
                    @mounted="addMounted"
                    accept=".mp3,.wav"
                    @processing="processing"
                    :isAddWater="waterMarkFile.sourceId"
                    @changeFile="changeFileList"
                    v-model:status="isOther"
                    @clearWater="clearWater"
                    @playing="playing"
                    :watermark="watermark"></add-watermark-audio-upload-drag>
              </div>
            </div>
          </template>

          <template #giveTry>
            <div style="min-height: 500px">
              <div style="width: 80%;margin: 30px auto auto;">
                <audio-broadcast
                    :showDown="false"
                    :file="tryOrderInfoList[0]"
                    :isMap="false"
                    twoLabel="原声"
                    oneLabel="水印"
                    ref="tryAudio"
                    v-if="tapLoading"
                >
                </audio-broadcast>
              </div>
              <div class="try-bt">
                <el-button class="trt-muisz-bt"
                           :class="[tryIndex<=0?'try-bt-no':'try-bt-active']"
                           @click="nextTry(-1)">上一首</el-button>
                <el-button
                    class="trt-muisz-bt"
                    :class="[tryIndex>=tryOrderInfoList.length-1?'try-bt-no':'try-bt-active']"
                    @click="nextTry(1)">下一首</el-button>
              </div>
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
      <div>音频水印</div>
      <div>一首</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
      <template #other>
        <div style="text-align: right">一共
          <span>{{ fileList.length }}</span>首；共收
          <span style="color: #F03860;font-size: 16px;">{{
              headData.ifVip ? headData.memberPrice * fileList.length : headData.cost * fileList.length
            }}</span>
          同钱
        </div>
      </template>
    </tool-dialog>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, computed, watch, nextTick, onUnmounted} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import AudioBroadcast from '../components/AudioBroadcast/tow.vue'
import WatermarkFileUpload from '../components/WatermarkFileUpload'
import AddWatermarkAudioUploadDrag from '../components/AddWatermarkAudioUploadDrag'
import {toolOrder, toolOrderInfo} from "@/api/toolbox/toolbox";
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import {ElMessage, ElNotification} from "element-plus";
import ToolDialog from '../../components/toolDialog'
import {useStore} from "vuex";
import {toolConfig} from "../../../../api/toolbox/toolbox";
import {guid} from "@/utils/tool";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const value = ref('')
const headData = ref({})
const showDialog = ref(false);
const route = useRoute()
const store = useStore();
const addWater = ref(null)
const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}

getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)
const fileList = ref([])
const isOther = ref(0);
const fileChange = (row) => {
  file.value = row
}

const processing = () => {
  let costType = 1;
  if (headData.value.ifVip && headData.value.memberPrice == 0) {
    costType = 0;
  } else if (headData.value.cost == 0) {
    costType = 0;
  } else {
    costType = headData.value.costType
  }
  // to full version process

  if (waterMarkFile.value.sourceId) {
    if (costType != 0) {
      showDialog.value = true;
    } else {
      confirmOrder();
      showDialog.value = false;
      orderNo = -1;
      fileList.value.forEach(res => {
        res.status = 1
      })
      addWater.value.endPlayStart();
      isOther.value = 1;
    }
  } else {
    // 请上传处理文件
    ElMessage.warning('请上传水印文件');
  }
}
let waterMarkFile = ref({})
const changeFileWaterMark = (row) => {
  waterMarkFile.value = row;
  orderNo=-1;
}


const confirmOrder = () => {
  createOther();
}


const changeFileList = (list) => {
  fileList.value = list;
  orderNo=-1;
}

const temOrderInfo = ref(null)
const getOrderInfo = (orderNo, back) => {
  if (!temOrderInfo.value) {
    toolOrderInfo(orderNo).then(item => {
      temOrderInfo.value = item.data;
      back()
    })
  } else {
    back()
  }
}


const getOrderInfoWchat = (orderNo, back) => {
    toolOrderInfo(orderNo).then(item => {
      temOrderInfo.value = item.data;
      back()
    })
}

const getOrderInfoProcessing = (orderNo, fileId) => {
  if (fileId == '-1') {
    // 全部处理失败
    fileList.value.forEach(res => {
      res.status = 3;
    })
    isOther.value = 2;
  } else {
    toolOrderInfo(orderNo).then(item => {
      const thisFile = fileList.value.find(res => {
        return res.fileId === fileId;
      })

      const index = fileList.value.findIndex(res => {
        return res.fileId === fileId;
      })
      if (index === -1) {
        return;
      }

      const netFile = item.data.sourceFileVOList[index]

      if (netFile.processingStatus === 3) {
        ElMessage({
          message: netFile.filename + ' 处理失败',
          type: 'info',
        })
      } else {
        ElMessage({
          message: netFile.filename + ' 处理成功',
          type: 'success',
        })
      }

      thisFile.status = netFile.processingStatus
      thisFile.downloadUrl = netFile.downloadUrl;
      thisFile.id = netFile.fileId;
      isOther.value = 2;
    })
  }
}

const clearWater = () => {
  watermark.value.setThisFile({})
  waterMarkFile.value = {};
}

// watch(sessions, (value) => {
//   const {lastMsg} = value[0]
//   if (lastMsg.attach) {
//     if (lastMsg.attach.title === '工具') { //工具
//       const mataData = JSON.parse(lastMsg.attach.mataData);
//       if (thisTemOrderNo === mataData.orderNo) {
//         getOrderInfoProcessing(mataData.orderNo, mataData.fileId)
//       }
//     }
//   }
// })


// 监听IM订单通知回调
const handleChangeOrderStatus = (attach)=>{
  let mataData=attach.sourceData;
  if (thisTemOrderNo === mataData.orderNo) {
    getOrderInfoProcessing(mataData.orderNo, mataData.fileId)
    // if (mataData.status==="fail"){
    //   ElMessage({
    //     message: '处理失败',
    //     type: 'info',
    //   })
    // }else {
    //   ElMessage({
    //     message: '处理完成',
    //     type: 'success',
    //   })
    // }
  }
}

IM_EVENT_LISTERNER.addEventListenerIM('TOOL', handleChangeOrderStatus);
onUnmounted(()=>{
  IM_EVENT_LISTERNER.removeEventListenerIM('TOOL', handleChangeOrderStatus);
})

const watermark = ref(null);
let thisTemOrderNo = "-1";
let orderNo = -1;
const createOther = () => {
  let data = {
    tdId: route.query.id,
    fullVersion: 1,
    sourceId: waterMarkFile.value.sourceId,
    mixing: {
      sourceId: fileList.value.map(res => {
        return res.sourceId
      }).join(),
      blankTime: watermark.value.intervals,
      volume: Math.max(1, watermark.value.volume / 100),
    }
  }
  if (orderNo === -1) {
    // 创建订单
    toolOrder(data).then(res => {
      orderNo = res.data.orderNo;
      thisTemOrderNo = orderNo;

      res.data.items.forEach(res => {
        fileList.value.forEach(item => {
          if (res.sourceId === item.sourceId) {
            item.fileId = res.fileId;
          }
        })
      })

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
        orderNo = -1;
        callbackPay();
        fileList.value.forEach(res => {
          res.status = 1
        })
        addWater.value.endPlayStart();
        isOther.value = 1;
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
/**
 * get order number
 * @type {ComputedRef<string | LocationQueryValue[]>}
 */
const getOrderNo = computed(() => {
  return route.query.orderNo;
})


const watermarkOnMounted = () => {
  /**
   * if route hava order number, modify web page state
   */
  if (getOrderNo.value) {
    thisTemOrderNo = getOrderNo.value
    getOrderInfo(getOrderNo.value, () => {
      const file = temOrderInfo.value.sourceFileVO;
      file.fileUrl = file.downloadUrl;
      file.name = file.filename;
      file.sourceId=file?.encryptIdFileId
      waterMarkFile.value.sourceId=file?.encryptIdFileId
      watermark.value.setThisFile(file)
    });
  }
}
const processResult=ref(true);
const addMounted = () => {
  /**
   * if route hava order number, modify web page state
   */
  if (getOrderNo.value) {
    thisTemOrderNo = getOrderNo.value
    getOrderInfo(getOrderNo.value, () => {
      const fileList1 = temOrderInfo.value.sourceFileVOList;
      fileList1.forEach(res => {
        res.uuid=guid();
        if (temOrderInfo.value.ifPay===0){
          // 未支付
          res.status =0
          // process.value =false;
          // sourceId=item.data?.sourceFileVO?.encryptIdFileId
          res.sourceId=res?.encryptIdFileId
          res.upload={state:"suscuss"}
          res.uuid=res.filename;
          isOther.value = 0;
          orderNo=getOrderNo.value;
        }else {
          // 支付
          res.status = res.processingStatus
          isOther.value = 2;
        }
      })
      addWater.value.setFileList(fileList1)
      fileList.value=fileList1;
    });
  }
}

// 订单监听
watch(()=>getOrderNo.value,()=>{
  if (getOrderNo.value){
    processResult.value=false;
    thisTemOrderNo = getOrderNo.value
    getOrderInfoWchat(getOrderNo.value, () => {
      processResult.value=true;
      const fileList1 = temOrderInfo.value.sourceFileVOList;
      fileList1.forEach(res => {
        res.uuid=guid();
        if (temOrderInfo.value.ifPay===0){
          // 未支付
          res.status =0
          // process.value =false;
          // sourceId=item.data?.sourceFileVO?.encryptIdFileId
          res.sourceId=res?.encryptIdFileId
          res.upload={state:"suscuss"}
          res.uuid=res.filename;
          isOther.value = 0;
          orderNo=getOrderNo.value;
        }else {
          // 支付
          res.status = res.processingStatus
          isOther.value = 2;
        }
      })
      nextTick(()=>{
        addWater.value.setFileList(fileList1)
      })
      fileList.value=fileList1;
    });
  }
})

watch(()=>getOrderNo.value,()=>{
  if (getOrderNo.value){
    // processResult.value=0;
    thisTemOrderNo = getOrderNo.value
    getOrderInfoWchat(getOrderNo.value, () => {
      const file = temOrderInfo.value.sourceFileVO;
      file.fileUrl = file.downloadUrl;
      file.name = file.filename;
      file.sourceId=file?.encryptIdFileId
      waterMarkFile.value.sourceId=file?.encryptIdFileId
      watermark.value.setThisFile(file)
    });
  }
})

// ========================  试用 =========================
const orderInfo = {}
const tabs = ref(false);

const tabSwitch = (name) => {
  tabs.value = name === "参考示例"
}

const isPlay = ref(false);
const playing = (ds) => {
  isPlay.value = ds;
}



const tryOrderInfoList = ref([])
let tapLoading=ref(false)
function getToolConfig() {
  toolConfig("tool.example.audioWatermark").then(res=>{
    tryOrderInfoList.value=JSON.parse(res.msg)
    tapLoading.value=true;
  })
}
getToolConfig()
const  tryOrderInfo=ref({})
let tryIndex=ref(0);
const tryAudio=ref(null)
const nextTry = (per) => {
  tryIndex.value+=per;
  if (tryIndex.value<0){
    tryIndex.value=0;
    return;
  }
  let length = tryOrderInfoList.value.length;
  if (tryIndex.value>=length){
    tryIndex.value=length-1;
    return;
  }
  tryOrderInfo.value=tryOrderInfoList.value[tryIndex.value];
  tryAudio.value.initData(tryOrderInfo.value);
}

</script>
<style scoped lang="scss">
@import "./style.scss";

:deep(.btn-close) {
  display: none;
}

.water-main {
  padding: 20px;
}

.try-bt{
  margin-top: 60px;
  justify-content: center;
  display: flex;
  .trt-muisz-bt{
    width: 112px;
    height: 32px;
    background: rgba(52, 104, 254, 0.1);
    border-radius: 19px;
    border: none;
    color: #3468FE;
  }
  .try-bt-active{
    background-color: rgba(52,104,254,0.1);
    color: #3468FE;
  }
  .try-bt-no{
    background-color: rgba(16, 17, 21, 0.8);
    color: #3D3F50;
  }
}
</style>
