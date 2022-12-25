<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <div class="mt10 detail-text-limit">每首限不超过10分钟</div>
          <div class="mt10 detail-text-file-type" >支持文件格式：MP4 / AVI / MPG / MOV / FLV / 3GP</div>
        </top-description-card>
      </div>
      <div style="flex: 1">
        <tool-switch-panel :show-try="false" :hide-header="true">
          <template #useImmediately>
            <div style="min-height: 400px;padding: 20px" v-loading="iStartProcess"    element-loading-text="处理中..."
                 element-loading-background="rgba(0, 0, 0, 0.6)">
              <div class="top">
                <div class="flex" style="margin-bottom: 5px;">
                  <div class="title">分辨率：</div>
                  <el-radio-group v-model="radio">
                    <template v-for="item in radioList" :key="item">
                      <el-radio :label="item?.value">{{ item?.type }}</el-radio>
                    </template>
                  </el-radio-group>
                </div>
              </div>
              <div>
                <video-upload-drag
                    @startProcess="startProcessing"
                    :radio="radio"
                    :radioList="radioList"
                    v-model:processResult="processResult"
                    v-model:inputFile="inputFile"
                    accept=".mp4,.avi,.mpg,.mov,.flv,.3gp,.webm,.mkv,.wmv,.gif"
                    @changeFile="changeFile"
                    style="margin-top: 2%"
                    @downFile="downFile"
                />
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
      <div>视频分辨率转换</div>
      <div>一部</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>
  </div>
</template>

<script setup>
import {ref, watch, getCurrentInstance, computed} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import ToolUploadDrag from '../components/ToolUploadDrag'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import VideoUploadDrag from './item/index'
import {Briefcase} from "@element-plus/icons-vue";
import ToolDialog from '../../components/toolDialog'
import {ElMessage} from "element-plus";
import {toolOrder, toolOrderInfo} from "@/api/toolbox/toolbox";
import {download} from "@/utils/request"; //导入wavesurfer.js

import {useStore} from "vuex";

const value = ref('')
const headData = ref({})
const route = useRoute();
const store = useStore();
const inputFile=ref(null);
const iStartProcess=ref(false);
const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}

getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)

const fileChange = (row) => {
  file.value = row
}
const radio = ref(1)
const radioList = ref([{
  type: '自定义',
  value: 1,
  data: {
    width: 10,
    height: 10,
    frameRate: 25,
  }
}, {
  type: 'HD 1080p(1920x1080) 25p',
  value: 2,
  data: {
    width: 1920,
    height: 1080,
    frameRate: 25,
  }
}, {
  type: 'HD 720p(1280x720) 25p',
  value: 3,
  data: {
    width: 1280,
    height: 720,
    frameRate: 25,
  }
}, {
  type: '480p(854x480) 25p',
  value: 4,
  data: {
    width: 854,
    height: 480,
    frameRate: 25,
  }
}, {
  type: '360p(640x360) 25p',
  value: 5,
  data: {
    width: 640,
    height: 360,
    frameRate: 25,
  }
}, {
  type: '260p(426×240)25p',
  value: 6,
  data: {
    width: 426,
    height: 240,
    frameRate: 25,
  }
}, {
  type: 'DVD(720x576)25p',
  value: 7,
  data: {
    width: 720,
    height: 576,
    frameRate: 25,
  }
}])


watch(radio, (nv, ov) => {
  const a = radioList.value.find(res => {
    return res.value === nv
  })

})


let sourceId = "";
const processVideo = ref(false)
const changeFile = (row) => {
  processVideo.value = true;
  if (row) {
    sourceId = row.sourceId;
  }
}

/**
 * 开始处理
 */
const showDialog = ref(false);
let videoScale = null;
const startProcessing = (data) => {
  // to full version process
  // showDialog.value = true;、
  videoScale = data;
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
    iStartProcess.value=true;
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
    additionalInformation:JSON.stringify(videoScale),
    videoResolution: videoScale,
  }
    // 创建订单
    toolOrder(data).then(res => {
      orderNo = res.data.orderNo;
      thisTemOrderNo = orderNo;
      // 调用支付密码
      if (res.data.pay === 0) {
        playOrder(() => {
        })
      }else {
        showDialog.value = false;
      }
    })
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
        iStartProcess.value=true;
        processResult.value=1;
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
const processResult = ref(0);
let temOrderInfo = null;
const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    processResult.value = item.data.processingStatus;
    temOrderInfo = item.data;
    const file=temOrderInfo.sourceFileVOList[0];
    const additionalInformation=JSON.parse(temOrderInfo.additionalInformation);
    file.width=additionalInformation?.width || 0;
    file.height=additionalInformation?.height || 0;
    file.frameRate=additionalInformation?.frameRate || 25;
    file.duration=additionalInformation?.duration || 0;
    inputFile.value=file;
    iStartProcess.value=false;
  })
}


const confirmOrder = () => {
  createOther();
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
  thisTemOrderNo=getOrderNo.value
  getOrderInfo(getOrderNo.value);
}

</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
