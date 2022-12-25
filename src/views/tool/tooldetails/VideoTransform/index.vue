<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <div class="mt10 detail-text-limit">每首限不超过10分钟</div>
          <div class="mt10 detail-text-file-type" >支持文件格式：MP4 / AVI / MPG / MOV / FLV / 3GP / WEBM / MKV / WMV</div>
        </top-description-card>
      </div>
      <div style="flex: 1">
        <tool-switch-panel :show-try="false" :hide-header="true">
          <template #useImmediately>
            <div style="min-height: 400px;padding: 20px"
                 v-loading="iStartProcess"    element-loading-text="处理中..."
                 element-loading-background="rgba(0, 0, 0, 0.6)"
            >
              <div class="flex top">
                <div class="title">输出格式：</div>
                <el-radio-group v-model="radio">
                  <template v-for="item in radioList" :key="item">
                    <el-radio :label="item.value">{{item.type}}</el-radio>
                  </template>
                </el-radio-group>
              </div>
              <div>
                <video-upload-drag
                    @startProcess="startProcessing"
                    ref="videoTransForm"
                    :radio="radio"
                    :radioList="radioList"
                    accept=".mp4,.avi,.mpg,.mov,.flv,.3gp,.webm,.mkv,.wmv"
                    @changeFile="changeFile"
                    v-model:processResult="processResult"
                    style="margin-top: 5%"
                    @downFile="downFile"
                />
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
      <div>视频转格式</div>
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
import ToolUploadDrag from '../components/ToolUploadDrag'
import ToolDialog from '../../components/toolDialog'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import VideoUploadDrag from '../components/VideoUploadDrag'
import {ElMessage} from "element-plus";
import { toolOrder,toolOrderInfo} from "@/api/toolbox/toolbox";
import {downloadFileCurrent} from "../../../../utils/tool";
import {useStore} from "vuex";
const value = ref('')
const headData = ref({})
const route = useRoute()
const videoTransForm=ref(null);
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

const radio = ref('mp4')
const radioList = ref(
    [{type:'MP4', value:'mp4'},{type:'AVI', value:'avi'},{type:'MPG', value:'mpg'},{
  type:'MOV', value:'mov'},{type:'3GP', value:'3gp'},{
  type:'WEBM', value:'webm'},{type:'MKV', value:'mkv'},{type:'WMV', value:'wmv'
}])
const processVideo= ref(false)
let sourceId = "";
const changeFile = (row) => {
  processVideo.value = true;
  processResult.value = 1;
  if(row){
    file.value = row.file
    sourceId = row.sourceId;
  }
}
const iStartProcess=ref(false);
const showDialog = ref(false);
/**
 * 开始处理
 */
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
    iStartProcess.value=true;
    processResult.value = 1;
  }

}
let thisTemOrderNo="-1";
let orderNo = -1;
const createOther=()=>{
  let data = {
    sourceId: sourceId,
    tdId: route.query.id,
    fullVersion: 1,
    additionalInformation:JSON.stringify({
      // filename:file.value.name,
      duration:file.value.duration
    }),
    videoToFormat: {
      toFormat:radio.value,
    }
  }
  // 创建订单
  toolOrder(data).then(res => {
    orderNo = res.data.orderNo;
    thisTemOrderNo=orderNo;
    // 调用支付密码
    if (res.data.pay === 0) {
      playOrder(() => {
      })
    }else {
      showDialog.value=false;
      iStartProcess.value=true;
    }
    processResult.value = 1;
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
        orderNo = -1;
        callbackPay();
        iStartProcess.value=true;
        processResult.value = 1;
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
const processResult = ref(0);
let temOrderInfo = null;
const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    processResult.value = item.data.processingStatus;
    temOrderInfo = item.data;
    videoTransForm.value.thisFile={
      ...temOrderInfo.sourceFileVOList[0],
      ...JSON.parse(temOrderInfo.additionalInformation||"{}")
    };
    iStartProcess.value=false;
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


const downFile = () => {
  downloadFileCurrent(temOrderInfo.sourceFileVOList[0].downloadUrl,
      temOrderInfo.sourceFileVOList[0].filename)
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
