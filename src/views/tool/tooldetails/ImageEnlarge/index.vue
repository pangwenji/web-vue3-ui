<template>
  <div class="main-card">
    <el-scrollbar height="100%">
    <div>
      <top-description-card :data="headData">
        <div class="mt10 detail-text-file-type" >支持文件格式：PNG / JPG / JPEG </div>
      </top-description-card>
    </div>
    <div style="flex: 1">
      <tool-switch-panel>
        <template #useImmediately>
          <div style="min-height: 500px;width: 90%;  margin: auto;">
            <div class="tool-main">
              <div class="options-main"  v-if="processImg">
                <div class="slider-item">
                  <div style="margin-right: 20px">放大倍数</div>
                  <div style="flex: 1">
                    <el-slider
                        v-model="largeMultiple"
                        :step="2"
                        :max="16"
                        :min="2"
                        show-stops
                        :marks="marks"
                    />
                  </div>
                </div>
                <div class="face-item">
                  <div style="margin-right: 8px">
                    人脸增强
                  </div>
                  <div>
                    <el-switch
                        v-model="humanFaceEn"
                        inline-prompt
                        size="large"
                    />
                  </div>
                </div>
              </div>
              <div v-if="processImg" class="line-text"></div>

              <images-upload-drag
                  :style="[!processImg?'margin-top: 13%':'']"
                  @changeFile="changeFile"
                  @startProcess="startProcess"
                  :big-size="largeMultiple"
                  ref="imagesDrag"
              ></images-upload-drag>
            </div>
          </div>
        </template>

        <template #giveTry>
          <div class="try-img-color" style="min-height: 500px">
            <div style="position: relative">
              <div class="info-title">
                <el-icon style="vertical-align: middle">
                  <Picture />
                </el-icon> 图片无损放大
              </div>
              <div class="info-text">
                AI智能修复技术一键无损放大图片，批量操作快速优化，提高工作效率
              </div>
              <div class="old-img-before">
                <div class="old-text">处理前</div>
                <div>
                  <el-image
                      :src="img"
                      class="small-img"
                      :preview-src-list="[img]"
                  ></el-image>
                </div>
              </div>

              <div class="old-img">
                <div class="old-text">放大4倍后</div>
                <div>
                  <el-image
                      :src="imgOut"
                      class="big-img"
                      :preview-src-list="[imgOut]"
                  ></el-image>
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
      <div>图片无损放大</div>
      <div>一张</div>
      <div>{{ headData.cost }}同钱</div>
    </tool-dialog>
  </div>
</template>

<script setup>
import {ref,computed,getCurrentInstance,watch} from 'vue'
import TopDescriptionCard from '../components/TopDescriptionCard'
import ToolSwitchPanel from '../components/ToolSwitchPanel'
import ImagesUploadDrag from '../components/ImagesUploadDrag'
import {useRoute} from "vue-router";
import {toolDetail} from "@/api/toolbox/toolbox";
import ToolDialog from '../../components/toolDialog'
import { toolOrder,toolOrderInfo} from "@/api/toolbox/toolbox";
const value = ref('')
const headData = ref({})
const route = useRoute()
import img from './images/img1.jpg'
import imgOut from './images/img1_out.jpg'
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
const store = useStore();
const getToolDetail=()=>{
  toolDetail(route.query.id).then(res=>{
    headData.value=res.data;
  })
}
getToolDetail();
// ========================  立即使用 =========================
const file = ref({});
let sourceId = "";
const largeMultiple=ref(2)
const humanFaceEn=ref(false)
let thisTemOrderNo="-1";
const marks= {
  2:"2x",
  4:"4x",
  6:"6x",
  8:"8x",
  10:"10x",
  12:"12x",
  14:"14x",
  16:"16x",
}
const processImg=ref(false)
const changeFile=(row)=>{
  processImg.value=true;
  if(row){
    sourceId = row.sourceId;
  }
}

const showDialog = ref(false);
const imagesDrag=ref(null);
const startProcess = () => {
  // to full version process
  showDialog.value = true;
}
const getOrderInfo = (orderNo) => {
  toolOrderInfo(orderNo).then(item => {
    console.log(imagesDrag.value)
    imagesDrag.value.loading=item.data.processingStatus === 1;
    imagesDrag.value.processResult=true;
    imagesDrag.value.bigFile=item.data.sourceFileVOList[0];
    if (!imagesDrag.value.fileUrl){
        imagesDrag.value.thisFile.fileUrl=item.data.sourceFileVO.downloadUrl;
        imagesDrag.value.thisFile.size=item.data.sourceFileVO.size;
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
      if (mataData.status === "success" && thisTemOrderNo === mataData.orderNo) {
        getOrderInfo(mataData.orderNo)
      }
    }
  }
})


const money = computed(() => {
  return store.state.user.money;
})

const confirmOrder = () => {
  createOther();
}


let orderNo = -1;
const createOther=()=>{
  let data = {
    sourceId: sourceId,
    tdId: route.query.id,
    fullVersion: 1,
    imageEnlarge:{
      outScale:largeMultiple.value,
      faceEnhance:humanFaceEn.value?1:2,
    }
  }
  if (orderNo === -1) {
    // 创建订单
    toolOrder(data).then(res => {
      orderNo = res.data.orderNo;
      thisTemOrderNo=orderNo;
      playOrder(()=>{})
    })
  }else {
    playOrder(()=>{})
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
        imagesDrag.value.loading=true;
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
.try-img-color {
  display: flex;
  justify-content: center;
  .old-img {
    padding-left: 50px;
    padding-top: 50px;
  }
  .old-text {
    color: white;
    text-align: center;
  }
  .old-img-before{
    position: absolute;
    z-index: 99;
    background-color: #202020;
    padding-right: 3px;
  }
  .info-text{
    padding:20px 0;
    font-size: 16px;
    font-weight: 300;
    color: #9094A6;
    line-height: 17px;
  }
  .info-title{
    font-size: 18px;
    font-weight: 400;
    color: #C2C7CE;
    line-height: 20px;
    margin-top: 20px;
  }
  .big-img{
    border-radius: 20px!important;
  }
  .small-img{
    border-radius: 6px!important;
  }
}
</style>
