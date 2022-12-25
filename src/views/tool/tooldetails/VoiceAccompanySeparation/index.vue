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
      <div class="tool-box">
        <tool-switch-panel :showTry="false" :hide-header="true">
          <template #useImmediately>
            <div
                v-loading="orderSubmission"
                element-loading-text="创建订单中..."
                element-loading-background="rgba(0, 0, 0, 0.6)"
                style="display:flex;align-items: center;height: 100%;width: 100%;min-height: 260px;border-radius: 16px">
              <div style="width: 100%">
                <tool-upload-drag
                    accept=".mp3,.flac,.wav"
                    @changeFile="fileChange"
                    style="margin: auto;"
                    :processResult="processResult"
                    :resultFile="resultFile"
                    @startProcess="startProcessing"
                ></tool-upload-drag>

                <div style="height: 1px;
                            background: #FFFFFF;
                            opacity: 0.05;margin: 0 30px"></div>
                <div class="try-try"
                     element-loading-background="rgba(0, 0, 0, 0)"
                     :element-loading-text="!getOrderNo?'示例加载中...':'加载中...'"
                     v-if="!process&&processResult===0" v-loading="!tapLoading">
                  <div class="try-text" v-if="!getOrderNo">
                    参考示例
                  </div>
                  <div v-if="tapLoading&&!getOrderNo">
                    <audio-broadcast
                        :showDown="false"
                        :file="tryOrderInfoList[0]"
                        :isMap="false"
                        twoLabel="伴奏"
                        oneLabel="人声"
                        ref="tryAudio"
                        v-if="tapLoading"
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

                <div v-if="process&&processResult===1" class="progress">
                  <el-image :src="processing"/>
                  <div style="margin-top: 20px">AI正在解析您的歌曲</div>
                  <div style="color: #4E5262">Ai解析需要耗费大量GPU资源，感谢您的耐心等待（约1-2分钟 即可处理完成）</div>
                </div>
                <div v-if="process&&processResult===2" class="progress">
                  <div style="width: 80%;">
                    <div class="end-text" v-if="fullVersion===1">
                      已转换完成
                    </div>
                    <audio-broadcast
                        @nextOther="nextmusic"
                        :showDown="true"
                        :file="orderInfo"
                        v-if="fullVersion===1||orderInfo.sourceFileVO?.duration<=30"
                        @close="closeAudio"
                    />
                    <audio-broadcast-try
                        @fullVersion="fullOpenOther"
                        :showDown="true"
                        v-else
                        :file="orderInfo">
                    </audio-broadcast-try>
                  </div>
                </div>

                <div v-else-if="processResult===3">
                  <el-result
                      icon="error"
                      title="处理失败"
                      sub-title="处理失败，请上传带人声/可播放的音频文件（上传mp3格式，有助于提高识别成功率）。已支付的同钱将自动退回您的账户中，如有疑问请联系客服。"
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
      <div>伴奏人声提取</div>
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
      <div>伴奏人声提取</div>
      <div>一首</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>
    <!--    <tool-dialog-->
    <!--        class="tool-dialog"-->
    <!--        v-model:show="auditionDialog"-->
    <!--        title="试听">-->
    <!--      是否需要试听-->
    <!--    </tool-dialog>-->
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, watch, computed, onMounted, onUnmounted} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import MusicPlayer from '../components/AudioBroadcast/MusicPlayer.vue'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import AudioBroadcast from '../components/AudioBroadcast/tow.vue'
import AudioBroadcastTry from '../components/AudioBroadcast/try.vue'
import ToolDialog from '../../components/toolDialog'
import ToolUploadDrag from '../components/ToolUploadDrag'
import {useRoute} from 'vue-router'
import {toolDetail, toolOrder, toolOrderInfo, auditionList, toolOrderWhole} from "@/api/toolbox/toolbox";
import processing from '@/assets/tool/toolLoading.gif'
import muise from '@/assets/tool/muise.png'
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import {toolConfig} from "../../../../api/toolbox/toolbox";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const router = useRouter();
const showDialogTry = ref(false);
const value = ref('')
const {proxy} = getCurrentInstance()
const headData = ref({})
const route = useRoute()
const tryAudio=ref(null)
const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}
getToolDetail();
const showDialog = ref(false);
const auditionDialog = ref(false);
const fullVersion = ref(0)
const store = useStore();
// 1 完整版，0 试听
let orderNo = -1;
let thisTemOrderNo = "-1"
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)
const processResult = ref(0);
const orderSubmission = ref(false);
const resultFile=ref({})
let sourceId = "";
const fileChange = (row) => {
  file.value = row.file;
  sourceId = row.sourceId;
  processResult.value = 0;
  process.value = false;
  orderNo=-1;
  fullVersion.value = 0;
}


const createOther = () => {
  let tem = fullVersion.value
  let data = {
    sourceId: sourceId,
    soundMusic: {
      fullVersion: tem,
      fileFormat: "mp3",
    },
    tdId: route.query.id
  }
  if (orderNo === -1) {
    // 创建订单
    orderSubmission.value = true;
    toolOrder(data).then(res => {
      orderNo = res.data.orderNo;
      payResult = res.data.pay
      thisTemOrderNo = orderNo;
      orderSubmission.value = false;
      // 调用支付密码
      if (res.data.pay === 0) {
        // 需要完整版
         playOrder(() => {
        })
      } else {
        // 试听
          tryListen();
      }
    }).catch(err => {
      orderSubmission.value = false;
    })
  }else {
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
 * 开始处理
 */
const startProcessing = () => {
  let costType = 1;
  if (headData.value.ifVip && headData.value.memberPrice == 0) {
    costType = 0;
  } else if (!headData.value.ifVip &&headData.value.cost == 0) {
    costType = 0;
  } else {
    costType = headData.value.costType
  }

  // to full version process
  if (costType != 0) {
    let tem = fullVersion.value;
    tem = tem ? tem : 0
    if (tem == 1) {
      console.log("tem等于1")
      showDialog.value = true;
    } else {
      console.log("创建订单1")
      // to try version process
      createOther();
    }
  } else {
    console.log("创建订单2")
    fullVersion.value=1;
    createOther();
    process.value = true;
    showDialog.value = false;
    orderNo = -1;
    processResult.value = 1
  }
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
/**
 * 关闭音乐组件
 */
const closeAudio = () => {
  file.value = {};
  process.value = false;
  processResult.value = false;
}

const orderInfo = ref({})

const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    fullVersion.value = item.data.ifPay;
    processResult.value = item.data.processingStatus;
    process.value = true;
    orderInfo.value = item.data;
    let fileInfo=item.data.sourceFileVO;
    if (item.data.ifPay===0&&item.data.processingStatus===0){
      processResult.value=0
      process.value =false;
    }
    sourceId=item.data?.sourceFileVO?.encryptIdFileId

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

// ========================  试一试 =========================
const tryOrderInfoList = ref([])
let tapLoading=ref(false)
function getToolConfig() {
  toolConfig("tool.example.vocal").then(res=>{
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
  tryAudio.value.initData(tryOrderInfo.value);
}


// ========================  试一试 =========================
const originalTry = ref(null)
const humanTry = ref(null)
const accompanyTry = ref(null)
const playBack = (name) => {
  const audioList = [originalTry, humanTry, accompanyTry]
  audioList.forEach(res => {
    if (name !== res.value.name) {
      res.value.audioPause();
    }
  })
}

const tryAudition = ref({})
let tryAuditionList = []
const getAuditionList = () => {
  auditionList({pageNum: 1, pageSize: 1000}).then(res => {
    tryAuditionList = res.rows;
    if (tryAuditionList.length > 0) {
      tryAudition.value = tryAuditionList[0]
    }
  });
}

const fullOpenOther = () => {
  showDialogTry.value = true;
}

/**
 * 转换完整版
 */
const fullVersionConversion = () => {
  toolOrderWhole(thisTemOrderNo).then(res => {
    if (res.data.pay===0){
      orderNo = res.data.orderNo;
      playOrder(() => {
        fullVersion.value = 1;
        process.value = true;
        processResult.value = 1;
        showDialogTry.value = false;
      })
    }else {
      showDialogTry.value = false;
    }

  })
}
getAuditionList();

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
// 监听路由变化
watch(()=>getOrderNo.value,()=>{
  if (getOrderNo.value){
    processResult.value=0;
    thisTemOrderNo = getOrderNo.value
    getOrderInfo(getOrderNo.value);
  }
})

/**
 * 处理下一首
 */
const nextmusic = () => {
  processResult.value = 0;
  process.value = false;
  orderNo = -1;
}

</script>
<style scoped lang="scss">
@import "./style.scss";
:deep(.el-tabs__content){
  border-radius: 16px !important;
}
</style>
