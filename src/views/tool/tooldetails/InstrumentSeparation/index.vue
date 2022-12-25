<template>
  <div class="main-card">
    <el-scrollbar height="100%">
    <div>
      <top-description-card :data="headData">
        <template #format>
          支持文件格式：mp3 / wav
        </template>
      </top-description-card>
    </div>
    <div style="flex: 1">
      <tool-switch-panel  :showTry="false" :hide-header="true">
        <template #useImmediately>
          <div
              v-loading="orderSubmission"
              element-loading-text="创建订单中..."
              element-loading-background="rgba(0, 0, 0, 0.6)"
              style="display:flex;;align-items: center;width: 100%;margin-bottom: 30px">
            <div style="width: 100%">
              <tool-upload-drag
                  accept=".mp3,.flac,.wav"
                  @changeFile="fileChange"
                  style="margin: auto"
                  :processResult="processResult"
                  :resultFile="resultFile"
                  @startProcess="startProcessing"
              ></tool-upload-drag>
              <div style="height: 1px;
                            background: #FFFFFF;
                            opacity: 0.05;margin: 0 30px"></div>
              <div class="try-try"  v-if="!process&&processResult===0"
                   element-loading-background="rgba(0, 0, 0, 0)"
                   v-loading="!tapLoading"
                   :element-loading-text="!getOrderNo?'示例加载中...':'加载中...'">
                <div class="try-text" v-if="!getOrderNo">参考示例</div>
                <div v-if="tapLoading&&!getOrderNo">
                  <audio-broadcast
                      :showDown="false"
                      :file="tryOrderInfoList[tryIndex]"
                      :isMap="false"
                      twoLabel="伴奏"
                      oneLabel="人声"
                  >
                  </audio-broadcast>
                </div>
                <div class="try-bt"  v-if="!getOrderNo">
                  <el-button class="trt-muisz-bt"
                             :class="[tryIndex<=0?'try-bt-no':'try-bt-active']"
                             @click="nextTry(-1)">上一首</el-button>
                  <el-button
                      class="trt-muisz-bt"
                      :class="[tryIndex>=tryOrderInfoList.length-1?'try-bt-no':'try-bt-active']"
                      @click="nextTry(1)">下一首</el-button>
                </div>
              </div>
              <div v-else-if="process&&processResult===1" class="progress">
                <el-image :src="processing"/>
                <div style="margin-top: 20px">AI正在解析您的歌曲</div>
                <div style="color: #4E5262">Ai解析需要耗费大量GPU资源，感谢您的耐心等待（约3-5分钟 即可处理完成）</div>
              </div>
              <div v-if="process&&processResult===2" class="progress">
                <div style="width: 80%">
                  <div class="can-text" v-if="fullVersion===1">
                    已转换完成
                  </div>
                  <audio-broadcast
                      @nextOther="nextmusic"
                      :showDown="true"
                      :file="orderInfo"
                      v-if="fullVersion===1||orderInfo.sourceFileVO?.duration<=30"
                  ></audio-broadcast>
                  <audio-broadcast-try @fullVersion="fullOpenOther"
                                       :showDown="true"
                                       v-else
                                       :file="orderInfo"></audio-broadcast-try>
                </div>
              </div>

              <div v-else-if="processResult===3">
                <el-result
                    icon="error"
                    title="处理失败"
                    sub-title="该音频文件处理失败，建议重新上传可播放的音频文件（上传mp3格式的文件可提高处理成功率）。如有疑问请联系客服，金额已自动退到您的账户中。"
                >
                  <template #extra>
                    <el-button type="primary" @click="nextmusic">上传下一首</el-button>
                  </template>
                </el-result>
              </div>

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
      <div>音乐乐器分离</div>
      <div>一首</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>


    <!--    试用版弹窗 -->
    <tool-dialog
        v-model:show="showDialogTry"
        :head-data="headData"
        @confirm="fullVersionConversion"
        title="订单支付确认">
      <div>音乐乐器分离</div>
      <div>一首</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>
  </div>
</template>

<script setup>
import {ref, computed, watch, getCurrentInstance, onUnmounted} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import ToolUploadDrag from '../components/ToolUploadDrag'
import AudioBroadcast from '../components/AudioBroadcast/more'
import AudioBroadcastTry from '../components/AudioBroadcast/moreTry'
import {toolDetail, toolOrder, toolOrderInfo, auditionList, toolOrderWhole} from "@/api/toolbox/toolbox";
import {useRoute} from "vue-router";
import processing from '@/assets/tool/toolLoading.gif'
import ToolDialog from '../../components/toolDialog'
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import {toolConfig} from "../../../../api/toolbox/toolbox";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const {proxy} = getCurrentInstance()
const showDialog = ref(false);
const showDialogTry = ref(false);
const orderSubmission=ref(false);

const value = ref('')
const headData = ref({})
const route = useRoute()
const getToolDetail=()=>{
  toolDetail(route.query.id).then(res=>{
    headData.value=res.data;
  })
}
getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
const fullVersion = ref(0)
const process = ref(false)
const processResult = ref(0);
const store = useStore();
const humanVoice = ref(null);
const accompany = ref(null)
// 1 完整版，0 试听
let orderNo = -1;
let thisTemOrderNo = "-1"
let sourceId = "";
const fileChange = (row) => {
  file.value = row
  sourceId = row.sourceId;
  processResult.value=0;
  process.value=false;
  orderNo=-1;
  fullVersion.value=0;
}

/**
 * 开始处理
 */
const startProcessing = () => {
  let costType = 1;
  if (headData.value.ifVip && headData.value.memberPrice == 0) {
    costType = 0;
  } else if (headData.value.cost == 0) {
    costType = 0;
  } else {
    costType = headData.value.costType
  }
  if (costType != 0) {
    // showDialog.value = true;
    let tem = fullVersion.value;
    tem = tem ? tem : 0
    if (tem == 1) {
      // to full version process
      showDialog.value = true;
    } else {
      // to try version process
      createOther();
    }
  }else {
    fullVersion.value=1;
    createOther();
    process.value = true;
    showDialog.value = false;
    orderNo = -1;
    processResult.value = 1
  }
}


const createOther = () => {
  let tem = fullVersion.value;
  tem = tem ? tem : 0
  let data = {
    sourceId: sourceId,
    separation:{
      fullVersion: tem,
      fileFormat: "mp3",
      separationType:"m5"
    },
    tdId: route.query.id
  }
  if (orderNo === -1) {
    // 创建订单
    orderSubmission.value=true;
    toolOrder(data).then(res => {
      orderNo = res.data.orderNo;
      payResult = res.data.pay
      thisTemOrderNo = orderNo;
      orderSubmission.value=false;
      // 调用支付密码
      if (res.data.pay === 0) {
        // 需要完整版
        playOrder(() => {
        })
      } else {
        // 试听
        tryListen();
      }
    }).catch(err=>{
      orderSubmission.value=false;
    })
  }
  else {
    // 订单号存在
    if (payResult === 0) {
      // full version
      playOrder(() => {
      })
    } else {
      tryListen();
    }
  }
}

/**
 * 关闭音乐组件
 */
const closeAudio = () => {
  file.value = {};
  process.value = false;
  processResult.value = false;
}


const play = () => {
  accompany.value.outPay()
}

/**
 * 提交订单
 */
let payResult = -1
const confirmOrder = () => {
  createOther();
}


// 需要试听
const tryListen = () => {
  process.value = true;
  showDialog.value = false;
  fullVersion.value = 0;
  processResult.value = 1
}
// 支付
const playOrder = (callbackPay) => {
  // 调用支付弹窗
  proxy.$pay.openPay({
    orderNo: orderNo,
    confirm: (e) => {
      return new Promise((resolve, reject) => {
        ElMessage.success('下单成功');
        resolve(null);
        process.value = true;
        showDialog.value = false;
        orderNo = -1;
        callbackPay();
        processResult.value = 1
      })
    },
    error: (err) => {
      if (typeof er == 'object') {
        if (err.code == 1010) {
          proxy.$pay.openRecharge()
        }
      }
    }
  })
}


const orderInfo = ref({})
const resultFile=ref({})
const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    fullVersion.value = item.data.ifPay;
    processResult.value = item.data.processingStatus;
    process.value = true;
    orderInfo.value = item.data
    let fileInfo=item.data.sourceFileVO

    if (item.data.ifPay===0&&item.data.processingStatus===0){
      processResult.value=0
      process.value =false;
      sourceId=item.data?.sourceFileVO?.encryptIdFileId
    }

    resultFile.value={
      name: fileInfo.filename,
      raw: {size:fileInfo.size},
      size:fileInfo.size,
      suffix: fileInfo.suffix?.replace(".",""),
    }
  })
}

// 监听IM订单通知回调
const handleChangeOrderStatus = (attach)=>{
  let mataData=attach.sourceData;
  if (thisTemOrderNo === mataData.orderNo) {
    getOrderInfo(mataData.orderNo)
    fullVersion.value=0;
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


/**
 * 转换完整版
 */
const fullVersionConversion = () => {
  toolOrderWhole(thisTemOrderNo).then(res => {
    orderNo = res.data.orderNo;
    playOrder(() => {
      fullVersion.value = 1;
      process.value = true;
      showDialogTry.value = false;
      processResult.value = 1;
    })
  })
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
  thisTemOrderNo=getOrderNo.value
  getOrderInfo(getOrderNo.value);
}
// 监听路由变化
watch(()=>getOrderNo.value,()=>{
  if (getOrderNo.value){
    processResult.value=0;
    thisTemOrderNo = getOrderNo.value
    getOrderInfo(getOrderNo.value);
  }
})
const fullOpenOther = () => {
  showDialogTry.value = true;
}

// ========================  试一试 =========================
const originalTry = ref(null)
const humanTry = ref(null)
const accompanyTry = ref(null)
const bassx = ref(null)
const drumsx = ref(null)
const otherx = ref(null)
const playBack = (name) => {
  const audioList = [originalTry, humanTry, accompanyTry,bassx,drumsx,otherx]
  audioList.forEach(res => {
    if (name !== res.value.name) {
      res.value.audioPause();
    }
  })
}
/**
 * 处理下一首
 */
const nextmusic = () => {
  processResult.value = 0;
  process.value = false;
  orderNo=-1;
}

// ========================  试一试 =========================
const tryOrderInfoList=ref([])

let tapLoading=ref(false)
function getToolConfig() {
  toolConfig("tool.example.instrument").then(res=>{
    tryOrderInfoList.value=JSON.parse(res.msg)
    tapLoading.value=true;
  })
}
getToolConfig()


const  tryOrderInfo=ref({})
let tryIndex=ref(0);
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
  // tryAudio.value.initData(tryOrderInfo.value);
}

</script>
<style scoped lang="scss">
@import "./style.scss";
:deep(.el-tabs__content){
  border-radius: 16px !important;
}
</style>
