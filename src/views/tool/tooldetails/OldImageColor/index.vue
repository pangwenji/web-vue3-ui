<template>
  <div class="main-card">
    <el-scrollbar height="100%">
      <div>
        <top-description-card :data="headData">
          <template #format>
            <div class="mt10 detail-text-file-type">支持文件格式：PNG / JPG / JPEG</div>
          </template>
        </top-description-card>
      </div>
      <div style="flex: 1">
        <tool-switch-panel>
          <template #useImmediately>
            <div>
              <div style="padding: 50px;">
                <images-upload-drag
                    @changeFile="changeFile"
                    ref="imagesDrag"
                    @startProcess="startProcess"
                    :processResult="processResult"
                >
                  <template #process>
                    上色后
                  </template>
                </images-upload-drag>
              </div>
            </div>
          </template>

          <template #giveTry>
            <div class="try-img-color" style="min-height: 400px">
              <div v-if="tapLoading">
                <image-comparison
                    :compare-image="thisImages.colorImage"
                    :original-image="thisImages.imageUlr"
                    :width="thisImages.width"
                />
                <div class="image-list">
                  <div :class="[thisImagesName===img.name?'is-image-activate':'']" v-for="(img,i) in tryImgList"
                       :key="i"
                       @click="changeImage(img)">
                    <el-image :src="img.imageUlr" style="height: 100px;width: 130px"></el-image>
                  </div>
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
      <div>老照片上色</div>
      <div>一张</div>
      <div v-if="headData.ifVip">{{ headData.memberPrice }}同钱</div>
      <div v-else>{{ headData.cost }}同钱</div>
    </tool-dialog>

  </div>
</template>

<script setup>
import {
  ref,
  getCurrentInstance,
  computed,
  watch, onUnmounted
} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import ImagesUploadDrag from '../components/ImagesUploadDrag'
import {toolOrder, toolOrderInfo} from "@/api/toolbox/toolbox";
import color from './images/color.jpeg'
import imgOld from './images/imgOld.jpeg'
import oldColor from './images/oldColor.jpeg'
import old1 from './images/old1.jpeg'
import ImageComparison from '../components/ImageComparison'
import {ElMessage} from "element-plus";
import ToolDialog from '../../components/toolDialog'
import {useStore} from "vuex";
import {toolConfig} from "../../../../api/toolbox/toolbox";

import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const value = ref('')
const headData = ref({})
const route = useRoute()
const processResult = ref(0)
const showDialog = ref(false);
const startProcess = () => {
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
    createOther();
    imagesDrag.value.loading = true;
    processResult.value = 1;
  }

}
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

let sourceId = "";
const processImg = ref(false)
const changeFile = (row) => {
  processImg.value = true;
  if (row) {
    sourceId = row.sourceId;
    processResult.value = 0
    imagesDrag.value.bigFile = {}
    orderNo = -1;
  }
}

let thisTemOrderNo = "-1";
let orderNo = -1;
const imagesDrag = ref(null);
const createOther = () => {
  let data = {
    sourceId: sourceId,
    tdId: route.query.id,
    fullVersion: 1,
    oldImageColor: {
      watermark: 1,
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
      } else {
        imagesDrag.value.loading = true;
        showDialog.value = false;
        orderNo = -1;
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
        imagesDrag.value.loading = true;
        resolve(null);
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


const getOrderInfo = (orderNoA) => {
  toolOrderInfo(orderNoA).then(item => {
    imagesDrag.value.loading = item.data.processingStatus === 1;
    processResult.value = item.data.processingStatus;
    imagesDrag.value.processResult = item.data.processingStatus;

    if (item.data.ifPay===0){
      processResult.value=0
      imagesDrag.value.loading =false;
      sourceId=item.data?.sourceFileVO?.encryptIdFileId
      orderNo=getOrderNo.value;
    }

    imagesDrag.value.bigFile = item.data.sourceFileVOList[0];
    if (!imagesDrag.value.fileUrl) {
      imagesDrag.value.thisFile.fileUrl = item.data.sourceFileVO.downloadUrl;
      imagesDrag.value.thisFile.size = item.data.sourceFileVO.size;
    }
  })
}

// const sessions = computed(() => {
//   const im = store.state.IM
//   return im.sessions
// })

// watch(sessions, (value) => {
//   const {lastMsg} = value[0]
//   if (lastMsg.attach) {
//     if (lastMsg.attach.title === '工具') { //工具
//       const mataData = JSON.parse(lastMsg.attach.mataData);
//       if (thisTemOrderNo === mataData.orderNo) {
//         getOrderInfo(mataData.orderNo)
//         ElMessage({
//           message: '处理完成',
//           type: 'success',
//         })
//       }
//     }
//   }
// })

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

const confirmOrder = () => {
  createOther();
}
// ========================  适用 =========================
const tryImgList = ref([])

const thisImagesName = ref("old1");
const thisImages = ref();

let tapLoading = ref(false)

function getToolConfig() {
  toolConfig("tool.example.oldImage").then(res => {
    tryImgList.value = JSON.parse(res.msg)
    tapLoading.value = true;
    thisImages.value = tryImgList.value[0]

    tryImgList.value.forEach(res => {
      let image = new Image();
      image.src = res.imageUlr;
      image.onload = function () {
        let width = image.width;
        let height = image.height;
        let scale = width / height;//原图宽高比例
        //如果原图宽大于最大宽度
        res.width = 420 * scale;
      }
    })
  })
}

getToolConfig();
const changeImage = (item) => {
  thisImagesName.value = item.name;
  thisImages.value = item;
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
// 监听路由变化
watch(()=>getOrderNo.value,()=>{
  if (getOrderNo.value){
    processResult.value=0;
    thisTemOrderNo = getOrderNo.value
    getOrderInfo(getOrderNo.value);
  }
})


</script>
<style scoped lang="scss">
@import "./style.scss";

.try-img-color {
  .image-list {
    width: 630px;
    margin: 10px auto 20px;
    padding: 6px;
    background-color: #24262f;
    border-radius: 5px;
    display: flex;
    justify-content: space-around;
  }

  .is-image-activate {
    border: #20a0ff 1px solid;
  }

  .detail-text-file-type {
    font-size: 14px;
  }
}
</style>
