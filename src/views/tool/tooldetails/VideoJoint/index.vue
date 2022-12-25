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
            <div style="min-height: 400px">
              <div class="top">
                <div class="more-video-config">
                  <div style="display: flex;flex: 1">
                    <div class="label-text">输出格式：</div>
                    <el-select v-model="formatValue" class="m-2" placeholder="请选择">
                      <el-option
                          v-for="item in listOfFormats"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                      />
                    </el-select>
                  </div>
                </div>
              </div>
              <div style="padding: 30px;">
                <tool-upload-drag
                    @processing="startProcessing"
                    @changeFile="changeFile"
                    ref="joint"
                    v-model:inputFile="inputFile"
                    v-model:status="isOther"
                    v-model:processResult="processResult"
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
      <div>视频拼接</div>
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
import ToolUploadDrag from './VideoList'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import ToolDialog from '../../components/toolDialog'

const value = ref('')
const headData = ref({})
const route = useRoute()

import {toolOrder, toolOrderInfo} from "@/api/toolbox/toolbox";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

const store = useStore();
const getToolDetail = () => {
  toolDetail(route.query.id).then(res => {
    headData.value = res.data;
  })
}
const formatValue=ref('mp4')
const listOfFormats=[
    {label:"mp4",value:"mp4"},
]
const joint = ref(null);
const inputFile = ref({});
const isOther = ref(0);
getToolDetail();
// ========================  立即使用 =========================
let fileList = [];
const process = ref(false)

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
        isOther.value = 1;
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
  }else {
    createOther();
    orderNo = -1;
    isOther.value = 1;
    processResult.value = 1;
  }
}
let thisTemOrderNo = "-1";
let orderNo = -1;

const changeFile = (list) => {
  fileList = list;

}
const createOther = () => {
  let ids = fileList.map(res => {
    return res.sourceId
  }).join(',');
  let data = {
    sourceId: ids,
    tdId: route.query.id,
    fullVersion: 1,
    videoConcat: {
      sourceId: ids,
      toFormat: formatValue.value
    }
  }
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

const processResult = ref(0);
let temOrderInfo = null;
const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    processResult.value = item.data.processingStatus;
    joint.value.setFileList(item.data.sourceFileVOList)
    inputFile.value = item.data.sourceFileVO;
    isOther.value = 2;
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
  thisTemOrderNo = getOrderNo.value
  getOrderInfo(getOrderNo.value);
}
</script>
<style scoped lang="scss">
@import "./style.scss";

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
  padding: 20px;
  align-items: center;

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
:deep(.el-result__subtitle p){
  color: #eebe77;
}

:deep(.el-result__title p){
  color: white;
}

</style>
