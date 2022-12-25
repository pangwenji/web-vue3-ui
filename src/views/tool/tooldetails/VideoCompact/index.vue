<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <div class="mt10 detail-text-limit">每首限不超过10分钟</div>
          <div class="mt10 detail-text-file-type" >支持文件格式：MP4 / AVI / MPG</div>
        </top-description-card>
      </div>
      <div style="flex: 1">
        <tool-switch-panel :show-try="false" :hide-header="true">
          <template #useImmediately>
            <div style="min-height: 400px;padding: 20px">
              <div class="top">
                <div class="flex" style="margin-bottom: 5px;">
                  <div class="title" style="flex: 0 0 auto;">压缩率：</div>
                  <div style="display: flex;width: 100%;align-items: center">
                    <div class="compression-tip">
                      <div class="compression-text">体积比较小</div>
                      <div class="compression-sx">(画质受损)</div>
                    </div>
                    <compression-ratio @compressionRatio="compressionRatioChange" style="width: 50%;"/>
                    <div class="compression-tip">
                      <div class="compression-text">体积比较大</div>
                      <div class="compression-sx">(画质清晰)</div>
                    </div>

                  </div>

                  <div class="advanced" @click="showMore">
                    <div>高级设置</div>
                    <div style="line-height: 2;margin-left: 5px">
                      <el-icon>
                        <ArrowDownBold/>
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <el-collapse-transition>
                  <div v-show="moreConfig">
                    <div style="display:flex;align-items: center;padding: 10px;margin-top: 10px">
                      <!--                      在压缩率的前提下 -->
                      <div class="label-text">压缩质量：</div>
                      <el-radio-group v-model="videoCompression.pictureQuality">
                        <el-radio-button label="-1">自动</el-radio-button>
                        <el-radio-button label="1">低质量</el-radio-button>
                        <el-radio-button label="2">标准</el-radio-button>
                        <el-radio-button label="3">高质量</el-radio-button>
                      </el-radio-group>
                    </div>


                    <div class="more-video-config">
                      <div style="display: flex;flex: 1">
                        <div class="label-text">输出格式：</div>
                        <el-select v-model="videoCompression.toFormat" class="m-2" placeholder="请选择">
                          <el-option
                              v-for="item in toFormatList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </div>


                      <!--                      <div style="display: flex;margin-left: 30px;flex: 1">-->
                      <!--                        <div class="label-text">视频编码：</div>-->
                      <!--                        <el-select v-model="videoCompression.coding" class="m-2" placeholder="请选择">-->
                      <!--                          <el-option-->
                      <!--                              v-for="item in options"-->
                      <!--                              :key="item.value"-->
                      <!--                              :label="item.label"-->
                      <!--                              :value="item.value"-->
                      <!--                          />-->
                      <!--                        </el-select>-->
                      <!--                      </div>-->

                      <div style="display: flex;margin-left: 30px;flex: 1">
                        <div class="label-text">分辨率：</div>
                        <el-select v-model="videoCompression.scale" class="m-2" placeholder="请选择">
                          <el-option
                              v-for="item in resolutionList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </div>

                      <div style="display: flex;margin-left:30px;flex: 1">
                        <div class="label-text">频率：</div>
                        <el-select v-model="videoCompression.frameRate" class="m-2" placeholder="请选择">
                          <el-option
                              v-for="item in frameRateList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </div>
                      <div style="display: flex;margin-left: 30px;flex: 1"></div>
                      <div style="margin-left:30px">
                        <el-checkbox v-model="whetherToCompressAudio" label="压缩音频"/>
                      </div>
                    </div>


                    <div class="more-audio-config">
                      <div style="display: flex;flex: 1">
                        <div class="label-text">&emsp;比特率：</div>
                        <el-select v-model="videoCompression.audioBitrate" class="m-2" placeholder="请选择">
                          <el-option
                              v-for="item in audioBitRateList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </div>

                      <div style="display: flex;margin-left:30px;flex: 1">
                        <div class="label-text">&emsp;声道数：</div>
                        <el-select v-model="videoCompression.audioChannel" class="m-2" placeholder="请选择">
                          <el-option
                              v-for="item in channelList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </div>
                      <div style="display: flex;margin-left:30px;flex: 1">
                        <div class="label-text">采样率：</div>
                        <el-select v-model="videoCompression.audioSampleRate" class="m-2" placeholder="请选择">
                          <el-option
                              v-for="item in samplingRateList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                          />
                        </el-select>
                      </div>
                      <div style="margin-left:30px;flex: 1"></div>

                      <div style="margin-left:30px">
                        <el-checkbox v-model="removeSound" label="去除音频"/>
                      </div>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
              <div style="padding: 50px;">
                <video-info-upload-drag
                    accept=".mp4,.avi,.mpg,.mov,.flv,.3gp,.webm,.mkv,.wmv"
                    @startProcess="startProcessing"
                    @changeFile="changeFile"
                    v-model:inputFile="inputFile"
                    v-model:processResult="processResult"
                />
              </div>
            </div>
          </template>

          <template #giveTry>
            <div style="min-height: 500px">

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
      <div>视频压缩</div>
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
import VideoInfoUploadDrag from '../components/VideoInfoUploadDrag'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import VideoUploadDrag from '../components/VideoUploadDrag'
import {Briefcase} from "@element-plus/icons-vue";
import ToolDialog from '../../components/toolDialog'
import CompressionRatio from './CompressionRatio'
import {useStore} from "vuex";
import {toolOrder, toolOrderInfo} from "@/api/toolbox/toolbox";
import {ElMessage} from "element-plus";

const processResult = ref(0);
const value = ref('')
const headData = ref({})
const route = useRoute()
const moreConfig = ref(false)
const inputFile = ref(null)
const store = useStore();
const removeSound = ref(false);
const whetherToCompressAudio = ref(false)
const videoCompression = ref({
  toFormat: -1,
  scale: -1,
  width: -1,
  height: -1,
  frameRate: -1,
  coding: -1,
  compressionRatio: 23,
  pictureQuality: -1,
  whetherToCompressAudio: -1,
  audioBitrate: -1,
  audioChannel: -1,
  removeSound: -1,
  audioSampleRate: -1
})
/**
 * ==================================== this is data area ==================
 */

const channelList = [
  {label: "自动", value: -1},
  {label: "1", value: 1},
  {label: "2", value: 2},
  {label: "6", value: 6},
]

const samplingRateList = [
  {label: "自动", value: -1},
  {label: '22050Hz', value: 22050},
  {label: '32000Hz', value: 32000},
  {label: '44100Hz', value: 44100},
  {label: '48000Hz', value: 48000},
]

const audioBitRateList = [
  {label: "自动", value: -1},
  {label: '128kbps', value: 128000},
  {label: '12kbps', value: 12000},
]

const toFormatList = [
  {label: '自动', value: -1},
  {
    label: 'mp4', value: 'mp4',
    codingList: [
      {label: 'H264', value: 'h264'},
      {label: 'AV1', value: 'AV1'},
      {label: 'HEVG', value: 'HEVG'},
    ]
  },
  {
    label: 'avi', value: 'avi',
    codingList: [
      {label: 'Xvid', value: 'xvid'},
      {label: 'DIVX', value: 'DVUX'},
      {label: 'H264', value: 'H264'},
    ]
  },
  {
    label: 'flv', value: 'flv',
    codingList: [
      {label: 'H264', value: 'h264'},
      {label: 'FLV', value: 'flv'},
    ]
  },
]

const resolutionList = [
  {label: '自动', value: -1},
  {label: '240*160', value: '240:160'},
  {label: '320*240', value: '320:240'},
  {label: '480*320', value: '480:320'},
  {label: '640*360', value: '640:360'},
  {label: '768*576', value: '768:576'},
  {label: '1280*720', value: '1280:720'},
]

const frameRateList = [
  {label: '自动', value: -1},
  {label: '12fps', value: 12},
  {label: '15fps', value: 15},
  {label: '20fps', value: 20},
  {label: '24fps', value: 24},
  {label: '25fps', value: 25},
  {label: '60fps', value: 60},
  {label: '80fps', value: 80},
  {label: '100fps', value: 100},
]

const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}
getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
const process = ref(false)

const radio = ref(1)


const formatTooltip = (val) => {
  return (val + '%')
}

let sourceId = "";
const processVideo = ref(false)
const changeFile = (row) => {
  processVideo.value = true;
  processResult.value = 0;
  if (row) {
    sourceId = row.sourceId;
    file.value = row.file
  }
}

const showMore = () => {
  moreConfig.value = !moreConfig.value;
}

/**
 * 开始处理
 */
const showDialog = ref(false);
const startProcessing = () => {
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
        processResult.value=1;
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

let thisTemOrderNo = "-1";
let orderNo = -1;
const createOther = () => {
  videoCompression.value.whetherToCompressAudio = whetherToCompressAudio.value ? 1 : -1
  videoCompression.value.removeSound = removeSound.value ? 1 : -1
  let data = {
    sourceId: sourceId,
    tdId: route.query.id,
    fullVersion: 1,
    additionalInformation: JSON.stringify(
        {
          scale: videoCompression.value.scale === -1 ? file.value.width + ':' + file.value.height : scale,
          oScale: {width: file.value.width, height: file.value.height},
          filename:file.value.name
        }
    ),
    videoCompression: videoCompression.value
  }
    toolOrder(data).then(res => {
      orderNo = res.data.orderNo;
      thisTemOrderNo = orderNo;
      // 调用支付密码
      if (res.data.pay === 0) {
        playOrder(() => {
        })
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
    processResult.value = item.data.processingStatus;
    if (processResult.value==3){
      return;
    }
    temOrderInfo = item.data;
    const file = temOrderInfo.sourceFileVOList[0];
    const additionalInformation = JSON.parse(temOrderInfo.additionalInformation);
    if (additionalInformation.scale) {
      let scale = additionalInformation.scale.split(":");
      file.width = scale[0];
      file.height = scale[1];
    }
    file.frameRate = additionalInformation?.frameRate || 25;
    inputFile.value = temOrderInfo.sourceFileVO;
    if (additionalInformation.oScale){
      inputFile.value.width = additionalInformation.oScale.width;
      inputFile.value.height = additionalInformation.oScale.height;
    }
    inputFile.value.compression = file;
  })
}

// const downFile = () => {
//   download(temOrderInfo.sourceFileVOList[0]?.downloadUrl, {}, temOrderInfo.sourceFileVOList[0]?.filename)
// }


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

function scaleConversion(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const compressionRatioChange = (val) => {
  videoCompression.value.compressionRatio = 46-Math.floor(scaleConversion(val, 0, 1, 18, 28))
}

</script>
<style scoped lang="scss">
@import "./style.scss";

.compression-tip {
  margin: 0 30px;
  text-align: center;

  .compression-text {
    color: #eebe77;
    font-size: 13px;
  }

  .compression-sx {
    color: rgba(255, 255, 255, 0.78);
    font-size: 11px;
  }

}

.advanced {
  flex: 0 0 auto;
  color: white;
  display: flex;
  cursor: pointer;
  font-size: 14px;
}


:deep(.el-input) {
  background: #202020;

  input {
    box-shadow: none; //去除白边
    background-color: #1E202A;
    border: #4E5262 solid 1px;
    color: white;

    &:focus {
      box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset; //输入内容原本样式
      outline: 0;
    }
  }
}

.more-video-config {
  color: white;
  display: flex;
  justify-content: space-around;
  padding: 10px;

}

.label-text {
  line-height: 40px;
  flex: 0 0 auto;
  color: white;
}

.more-audio-config {
  color: white;
  display: flex;
  justify-content: space-around;
  padding: 10px;
}
.detail-text-limit{
  font-size: 14px;
  color: #CFD2D8;
  letter-spacing: 0.54px;
  font-weight: 400;
}
.detail-text-file-type{
  font-size: 14px;
  color: #9094A6;
  letter-spacing: 0.54px;
  font-weight: 400;
}

</style>
