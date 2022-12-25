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
        <tool-switch-panel :showTry="false" :hide-header="true">
          <template #useImmediately>
            <div>
              <tool-upload-drag
                  accept=".mp3,.flac,.wav"
                  @changeFile="fileChange"
                  style="width: 80%"
                  :processResult="processResult"
                  :resultFile="resultFile"
                  @startProcess="startProcessing"
                  processingType="MP3转录成MIDI 1.0版"
              ></tool-upload-drag>
              <div style="height: 1px;
                            background: #FFFFFF;
                            opacity: 0.05;margin: 0 30px"></div>
              <div v-if="!process&&!processResult"
                   class="try-try"
                   style="min-height: 400px"
                   v-loading="!tapLoading"
                   element-loading-background="rgba(0, 0, 0, 0)"
                   element-loading-text="示例加载中..."
              >
                <div style="margin: auto" v-if="tapLoading">
                  <div class="try-name">
                    <div>
                      <el-image :src="muise"/>
                    </div>
                    <div>
                      参考示例:
                      {{ tryOrderInfoList[tryIndex]?.fileName }}
                    </div>
                  </div>
                  <div class="try-info">
                    <!--                    基于ai声音识别技术与提取技术，通过先进的人工神经网络，通过大量歌曲的训练，它像是人脑一样理解任何风格的歌曲并从中获得人声和伴奏本工具可以从任何音频中分离出伴奏，人声，和声，以及任意乐器。-->
                  </div>
                  <div style="margin-top: 30px">
                    <one-play
                        :file="tryOrderInfoList[tryIndex].sourceFile"
                        nameTitle="原声"
                    ></one-play>
                    <div style="height: 60px"></div>
                    <one-play
                        :file="tryOrderInfoList[tryIndex].sourceFileMidi"
                        nameTitle="MIDI"
                    ></one-play>
                  </div>

                  <div class="try-bt">
                    <el-button class="trt-muisz-bt"
                               :class="[tryIndex<=0?'try-bt-no':'try-bt-active']"
                               @click="nextTry(-1)">上一首
                    </el-button>
                    <el-button
                        class="trt-muisz-bt"
                        :class="[tryIndex>=tryOrderInfoList.length-1?'try-bt-no':'try-bt-active']"
                        @click="nextTry(1)">下一首
                    </el-button>
                  </div>
                </div>
              </div>

              <div v-if="process&&processResult===1" class="progress">
                <el-image :src="processing"/>
                <div>AI正在解析您的歌曲</div>
                <div>请您稍加等待片刻（约5-6分钟 即可处理完成）</div>
              </div>


              <div v-if="process&&processResult===2" class="down-file-list" style="margin-top: 10px">
                <div class="downFile">
                  <div class="info-data">
                    <div>
                      <el-image :src="music"></el-image>
                    </div>
                    <div class="info-text">
                      <div class="info-text-name">{{ orderInfo?.filename }}</div>
                      <div class="info-text-other">文件大小：{{ formatSize(orderInfo?.size) }}</div>
                      <div class="info-text-other">文件类型：MID文件</div>
                    </div>
                  </div>
                </div>
                <div>
                  <el-tooltip content="开发中..." placement="bottom" effect="light">
                    <el-button class="down-next">
                      <el-icon>
                        <FolderOpened/>
                      </el-icon>
                      存储至云盘
                    </el-button>
                  </el-tooltip>
                  <el-button @click="downFile" class="down-bt">
                    <el-image :src="downloadBt"></el-image>
                    下载
                  </el-button>
                </div>
              </div>
              <div v-if="process&&processResult===3" class="downFile">
                <el-result
                    icon="error"
                    title="处理失败"
                    sub-title="该音频文件处理失败，建议重新上传可播放的音频文件。上传mp3格式的文件可提高处理成功率，如有疑问请联系客服；金额已自动退到您的账户中。"
                >
                  <template #extra>
                    <el-button type="primary" @click="nextmusic">上传下一首</el-button>
                  </template>
                </el-result>
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
      <div>MP3转录成MIDI</div>
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
import ToolUploadDrag from '../components/ToolUploadDrag'
import OnePlay from '../components/AudioBroadcast/OnePlay.vue'
import muise from '@/assets/tool/muise.png'
import {useRoute} from "vue-router";
import processing from '@/assets/tool/toolLoading.gif'
import {toolOrder, toolOrderInfo, toolDetail} from "@/api/toolbox/toolbox";
import ToolDialog from '../../components/toolDialog'
import {download} from "@/utils/request"; //导入wavesurfer.js
import {ElMessage} from "element-plus";
import {formatSize} from "@/utils/tool";
import {useStore} from "vuex";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const value = ref('')
const headData = ref({})
const route = useRoute()
const store = useStore();
const processResult = ref(0);
import music from '@/assets/tool/music.png'
import downloadBt from '@/assets/tool/downloadBt.png'
import {toolConfig} from "../../../../api/toolbox/toolbox";

const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}
getToolDetail();
const showDialog = ref(false);
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)
let sourceId = "";
const fileChange = (row) => {
  file.value = row
  sourceId = row.sourceId;
  processResult.value = 0;
  process.value = false;
  orderNo = -1;
}


const confirmOrder = () => {
  createOther();
}

let thisTemOrderNo = "-1";
let orderNo = -1;
const createOther = () => {
  let data = {
    sourceId: sourceId,
    tdId: route.query.id,
    fullVersion: 1,
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
        process.value = true;
        processResult.value = 1;
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

const orderInfo = ref({})
const resultFile = ref({})
const getOrderInfo = (orderNoA) => {
  toolOrderInfo(orderNoA).then(item => {
    processResult.value = item.data.processingStatus;
    process.value = true;
    orderInfo.value = item.data.sourceFileVOList[0];
    let fileInfo = item.data.sourceFileVO
    if (item.data.ifPay===0){
      processResult.value=0
      process.value =false;
      sourceId=item.data?.sourceFileVO?.encryptIdFileId
      orderNo=getOrderNo.value;
    }
    resultFile.value = {
      name: fileInfo.filename,
      raw: {size: fileInfo.size},
      size: fileInfo.size,
      suffix: fileInfo.suffix?.replace(".", ""),
    }
  })
}


// 监听IM订单通知回调
const handleChangeOrderStatus = (attach)=>{
  let mataData=attach.sourceData;
  if (thisTemOrderNo === mataData.orderNo) {
    if (mataData.status==="fail"){
      processResult.value = 3;
      ElMessage({
        message: '处理失败',
        type: 'info',
      })
    }else {
      getOrderInfo(mataData.orderNo)
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

const downFile = () => {
  console.log(orderInfo)
  download(
      orderInfo.value?.downloadUrl,
      {},
      orderInfo.value?.filename)
}

// ========================  试一试 =========================
const originalTry = ref(null)
const accompanyTry = ref(null)

const playBack = (name) => {
  const audioList = [originalTry, accompanyTry]
  audioList.forEach(res => {
    if (name !== res.value.name) {
      res.value.audioPause();
    }
  })
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
  // to full version process
  if (costType != 0) {
    showDialog.value = true;
  } else {
    confirmOrder();
    process.value = true;
    processResult.value = 1;
    showDialog.value = false;
    if (!getOrderNo.value){
      orderNo = -1;
    }
  }
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
  watch(()=>getOrderNo.value,()=>{
    if (getOrderNo.value){
      processResult.value=0;
      thisTemOrderNo = getOrderNo.value
      getOrderInfo(getOrderNo.value);
    }
  })
}

const nextmusic = () => {
  processResult.value = 0;
  process.value = false;
}

const fileNext = () => {
  processResult.value = 0;
  process.value = false;
}

const tryOrderInfoList = ref([])
let tapLoading = ref(false)

function getToolConfig() {
  toolConfig("tool.example.midi").then(res => {
    tryOrderInfoList.value = JSON.parse(res.msg)
    tapLoading.value = true;
  })
}

getToolConfig()

const tryOrderInfo = ref({})
let tryIndex = ref(0);
const nextTry = (per) => {
  tryIndex.value += per;
  if (tryIndex.value < 0) {
    tryIndex.value = 0;
    return;
  }
  let length = tryOrderInfoList.value.length;
  if (tryIndex.value >= length) {
    tryIndex.value = length - 1;
    return;
  }
  tryOrderInfo.value = tryOrderInfoList.value[tryIndex.value];
}

</script>
<style scoped lang="scss">
@import "./style.scss";
:deep(.el-tabs__content){
  border-radius: 16px !important;
}
</style>
