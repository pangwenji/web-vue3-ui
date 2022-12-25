<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <div class="mt10 detail-text-file-type">支持文件格式：MP4 / AVI / MPG / MOV / FLV / 3GP / WEBM / MKV / WMV</div>
        </top-description-card>
      </div>
      <div style="flex: 1">
        <tool-switch-panel :show-try="false" :hide-header="true">
          <template #useImmediately>
            <div style="min-height: 400px;padding: 20px" v-loading="iStartProcess" element-loading-text="处理中..."
                 element-loading-background="rgba(0, 0, 0, 0.6)">
              <div class="flex top">
                <div class="title">音频输出格式：</div>
                <el-radio-group v-model="radio">
                  <template v-for="item in radioList" :key="item">
                    <el-radio :label="item.value">{{ item.type }}</el-radio>
                  </template>
                </el-radio-group>
              </div>
              <div>
                <video-upload-drag
                    @startProcess="startProcessing"
                    :radio="radio"
                    :radioList="radioList"
                    :inputFile="inputFile"
                    accept=".mp4,.avi,.mpg,.mov,.flv,.3gp,.webm,.mkv,.wmv"
                    @changeFile="changeFile"
                    :processResult="processResult"
                    @downFile="downFile"
                    style="margin-top: 2%"
                    @backClear="backClear"
                />
                <!--                    :style="[!processVideo?'margin-top: 5%':'']"-->
              </div>
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
      <div>视频声音提取</div>
      <div>一部</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, computed, watch} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import {download} from "@/utils/request"; //导入wavesurfer.js
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import VideoUploadDrag from './item'
import ToolDialog from '../../components/toolDialog'
import {ElMessage} from "element-plus";

const value = ref('')
const headData = ref({});
const iStartProcess = ref(false);
const route = useRoute()
import {toolOrder, toolOrderInfo} from "@/api/toolbox/toolbox";
import {useStore} from "vuex";

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
const radio = ref(1)
const inputFile = ref(null);
const radioList = ref([{
  type: 'MP3',
  value: 1
}, {
  type: 'OGG',
  value: 3
}, {
  type: 'AC3',
  value: 4
}, {
  type: 'AAC',
  value: 5
}, {
  type: 'FLAC',
  value: 6
}, {
  type: 'OPUS',
  value: 7
}, {
  type: 'PCM',
  value: 8
},
  {
    type: 'M4A',
    value: 9
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
  }
}

/**
 * 开始处理
 */
const showDialog = ref(false);
const startProcessing = () => {
  // to full version process
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
    additionalInformation: JSON.stringify({'filename': filename}),
    videoExtractAudio: {
      sourceId: sourceId,
      suffix: a.type
    }
  }
  // if (orderNo === -1) {
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
  // } else {
  //   playOrder(() => {
  //   })
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

let temOrderInfo = null;
const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    processResult.value = true;
    temOrderInfo = item.data;
    const file = temOrderInfo.sourceFileVOList[0];
    const additionalInformation = JSON.parse(temOrderInfo.additionalInformation);
    file.width = additionalInformation?.width || 0;
    file.height = additionalInformation?.height || 0;
    file.frameRate = additionalInformation?.frameRate || 25;
    file.processingStatus = temOrderInfo.processingStatus;
    inputFile.value = file;
    iStartProcess.value = false;
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

const backClear = () => {
  processResult.value = false;
}

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
