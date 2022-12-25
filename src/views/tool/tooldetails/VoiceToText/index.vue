<template>
  <div class="voice2text">
    <div class="header">
      <TopDescriptionCard :data="toolsData">
        <template #format>
          支持格式： MP3 / OPUS / WAV
        </template>
      </TopDescriptionCard>
    </div>
    <div class="content">
      <div class="resources">
        <div class="left">
          <el-upload
            class="upload-box"
            drag
            action="#"
            :auto-upload="false"
            :accept="accept"
            @change="fileChange"
            :show-file-list="false"
          >
            <svg-icon  v-if="!fileData" style="width:50px;height:48px;margin: 20px 0;" iconClass="icon_upload" :size="50"></svg-icon>
            <div v-if="!fileData">
              <div class="instruction">将文件拖拽到此处，或者<span class="upload">点击上传</span></div>
              <div class="instruction">支持文件格式： MP3 / OPUS / WAV</div>
              <div class="instruction">小于 100M 且不超过 2小时，30分钟内效果最佳</div>
            </div>
            <div v-else class="file-box">
              <div>
                <svg-icon iconClass="icon_music" style="width:59px;height:68px;"></svg-icon>
              </div>
              <div class="file-info">
                <span class="name">{{fileData?.name}}</span>
                <span class="info">文件大小：{{formatSize(fileData?.size)}}</span>
                <span class="info">文件类型：{{fileData?.suffix}}</span>
                <span class="info">时长：{{secondToDate(fileData?.duration)}}</span>
              </div>
            </div>
          </el-upload>
        </div>
        <div class="right">
          <div>
            <el-form :model="form" >
            <el-form-item label="识别语言:">
              <el-select v-model="form.language" @change="handleLanguageChange" class="select-lg" placeholder="请选择识别语言">
                <el-option
                  v-for="item in languageList"
                  :key="item.key"
                  :label="item.title"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="导出格式:">
              <el-radio-group v-model="form.format" class="resources-radio">
                <el-radio label="txt">txt</el-radio>
                <el-radio label="doc">doc</el-radio>
                <el-radio label="srt">srt</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          </div>
          <div class="resources-btn">
            <el-button :disabled="processingStatus === 2" type="primary" color="#3468FE" round @click="handleExtract">
              <span v-if="thisFile.upload?.state == 'awaiting'">等待上传</span>
              <span v-else-if="thisFile.upload?.state == 'checking'">读取文件</span>
              <span
                  v-else-if="thisFile.upload?.state == 'uploading'">正在上传( {{
                  thisFile.upload.percent
                }} %)</span>
              <span v-else-if="thisFile.upload?.state == 'error'">上传失败</span>
              <span v-else>      <svg-icon iconClass="icon_tiqu" :size="14"></svg-icon>&nbsp开始提取</span>

            </el-button>
            <el-button type="primary" color="#30323B" round @click="handleReset">
              <svg-icon iconClass="icon_reset" :size="14"></svg-icon>&nbsp重置
            </el-button>
            <el-button v-if="textData" disabled type="primary" color="#30323B" round @click="handleToCloudDisk">
              <svg-icon iconClass="icon_upyun" :size="14"></svg-icon>&nbsp存储至云盘
            </el-button>
            <el-button v-if="textData" :loading="downloadStatus" type="primary" color="#30323B" round @click="handleDownload">
              <svg-icon iconClass="icon_down" :size="14"></svg-icon>&nbsp下载到本地
            </el-button>
          </div>
        </div>
      </div>

      <div class="result-box">
        <div class="result-copy" :class="{'active-copy': textData}" @click="handleCopy">
          <svg-icon iconClass="icon_copy" :size="14"></svg-icon>&nbsp复制
        </div>
        <div class="result">
          <div v-if="textData" class="result-text">
            <el-scrollbar height="188px">
              {{textData}}
            </el-scrollbar>
          </div>
          <div v-else-if="orderData.ifPay === 0 || processingStatus === 0" class="empty">
            <svg-icon iconClass="icon_empty" :size="60"></svg-icon>
            <span class="e-text">暂无数据</span>
          </div>
          <div v-else-if="orderData.ifPay && (processingStatus === 1)" class="processing">
            <el-image style="width:112px;height:32px;" :src="processing"/>
            <span class="e-text">AI正在解析您的音频</span>
            <span class="e-text2">请您稍加等候片刻（约1-2分钟 即可处理完成）</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>

    <confirmOrderDialog
      ref="confirmOrderRef"
      :toolInfo="toolsData"
      :orderInfo="orderData"
      @confirm="playOrder"
    >
    </confirmOrderDialog>
  </div>
</template>
<script setup>
import TopDescriptionCard from '../components/TopDescriptionCard'
import { nextTick, onMounted, watch } from "vue"
import { toolOrder, toolOrderInfo, toolDetail, getVoiceFileTransText, downloadVoiceToText } from "@/api/toolbox/toolbox"
import UploadFile from "@/utils/uploadFile"
import { createUploadSign, createUploadFile } from '@/api/personnel/file'
import { formatSize, secondToDate } from '@/utils/tool.js'
import ToolDialog from '../../components/toolDialog'
import processing from '@/assets/tool/processing.gif'
import { ElMessage,ElMessageBox } from "element-plus";
import { downloadFile } from "@/utils/tool";
import { getConfigKeyList } from "@/api/system/config"
import confirmOrderDialog from '../../components/confirmOrderDialog'
import {onUnmounted} from "vue";
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const {proxy} = getCurrentInstance()
const store = useStore()
const route = useRoute()
const form = ref({
  language: 'voiceFileTrans_mandarin',
  format: 'txt'
})
const fileData = ref(null)
const textData = ref('')
// 支持单轨和双轨的WAV、MP3、M4A、WMA、ACC、OGG、AMR、FLAC格式录音文件识别。文件大小不超过512 MB。
const accept = ref('.MP3 , .OPUS ,.WAV ,.mp3,.opus,.wav')
const showDialog = ref(false)
const processingStatus = ref(0)
const orderNo = ref('')
const confirmOrderRef = ref()

onMounted(() => {
  orderNo.value = route.query.orderNo || ''
  if (orderNo.value) {
    getOrderInfo(orderNo.value)
    // getTextByOrderNo(orderNo.value)
  }
  getToolDetail()
  getLanguageList()
})

const isMsg = ref(false)

// 监听IM订单通知回调
const handleChangeOrderStatus = (attach)=>{
  let mataData=attach.sourceData;
  if (orderNo.value === mataData.orderNo) {
    isMsg.value = true
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



// 获取语言配置
const languageList = ref([])
function getLanguageList() {
  getConfigKeyList({key: 'voiceFileTrans'}).then(res => {
    languageList.value = res.data
  })
}

// 获取订单详情
const orderInfo = ref({})
const orderData = ref({})
function getOrderInfo(orderNo) {
  toolOrderInfo(orderNo).then(res => {
    orderInfo.value = res.data
    orderData.value.price = res.data.totalCost
    orderData.value.filename = res.data.sourceFileVO.filename
    orderData.value.ifPay = res.data.ifPay
    orderData.value.orderNo = res.data.orderNo

    fileData.value = res.data.sourceFileVO
    fileData.value.name = res.data.sourceFileVO.filename
    processingStatus.value = res.data.processingStatus
    encryptedId.value = res.data.sourceFileVO.encryptIdFileId
    form.value.language=JSON.parse(orderInfo.value.additionalInformation)?.language;
    // form.value.language = res.data?.additionalInformation || ''

    if (res.data.ifPay === 1 && res.data.processingStatus === 2) {
      getTextByOrderNo(orderNo)
    }
  })
}

function getTextByOrderNo(orderNo) {
  getVoiceFileTransText(orderNo).then(res => {
    if (res.data) {
      if (isMsg.value) {
        isMsg.value = false
        // ElMessage.success('处理完成')
      }
      textData.value = res.data?.content || ''
    }
  })
}

const toolsData = ref({})
function getToolDetail() {
  toolDetail(route.query.id).then(res => {
    toolsData.value = res.data
  })
}

function handleLanguageChange() {
  processingStatus.value = 0
  orderNo.value = ''
  orderData.value = {}
}

function handleReset() {
  if (processingStatus.value > 0) {
    let tip = '正在处理中'
    if (processingStatus.value === 2) {
      tip = '已处理完成'
    }
    ElMessageBox.confirm(`当前语音文件${tip}，是否重置处理新的文件？`, '重置提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'messageBox-custom-warning',
        center:true,
    }).then(() => {
      form.value = {
        language: 'voiceFileTrans_mandarin',
        format: 'txt'
      }
      orderNo.value = ''
      textData.value = ''
      processingStatus.value = 0
      showDialog.value = false
      fileData.value = null
      orderData.value = {}
    }).catch(()=>{})
  } else {
    form.value = {
      language: 'voiceFileTrans_mandarin',
      format: 'txt'
    }
    orderNo.value = ''
    fileData.value = null
    textData.value = ''
    processingStatus.value = 0
    orderData.value = {}
  }
}
const thisFile=ref({})
const handleStartUploadOneFile = () => {
  let item = thisFile.value.upload;
  item.uploadFile();
}

const uploadLoading = ref(false)
const fileChange = async (file) => {
  const arr = file.name.split('.')
  const type = arr[arr.length -1]
  const findex = accept.value.indexOf(type)
  if (findex === -1) {
    ElMessage.error(`不支持 ${type} 格式文件`)
    return
  }

  if (file.size > 104857600) {
    ElMessage.error('文件不能大于 100MB')
    return
  }
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  const duration = await getAudioDuration(file.fileUrl)
  if (duration > 60 * 60 * 2) {
    ElMessage.error('文件时长不能大于2小时')
    return
  }

  uploadLoading.value = true
  // 上传文件
  const File = file.raw
  const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  // store.commit('upload/addFileList', uploadData)
  thisFile.value.upload=uploadData;
  uploadData.on('success', handleStartUploadOneFile)
  handleStartUploadOneFile()
}

// 获取音频时长
function getAudioDuration(url) {
  let audio = document.createElement('audio')
  audio.src = url
  return new Promise((resolve, reject) => {
    audio.addEventListener("canplay", function () {
      resolve(audio.duration);
    });
  });
}



/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const getUploadSignFun = (obj, callback, errorback) => {
  const params = {
    filename: obj.FileName.replaceAll(" " ,""),
    size: obj.FileSize,
    md5: obj.FileMD5,
  }
  createUploadSign(params).then(res => {
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

/**
 * 上传文件
 * @param resultData
 * @param options
 * @param callback
 * @param errorback
 * @constructor
 */
const encryptedId = ref('')
const CreateUploadFileFun = ({resultData, options}, callback, errorback) => {
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
  }
  createUploadFile(params).then(res => {
    uploadLoading.value = false
    orderNo.value = ''
    // orderInfo.value = {}
    textData.value = ''
    processingStatus.value = 0
    fileData.value = Object.assign(res.data.fileSystem)
    encryptedId.value = res.data.encryptedId
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

function handleExtract() {
  if (orderData.value.ifPay === 1 && processingStatus.value === 1) {
    ElMessage.error('当前文件正在识别');
    return
  }
  if (!fileData.value) {
    ElMessage.error('请先上传语音文件');
    return
  }
  if (!fileData.value?.duration) {
    ElMessage.error('语音时长错误');
    return
  }

  if (orderNo.value && orderData.value?.ifPay === 0) {
    confirmOrderRef.value.open()
  }else {
    const params = {
      sourceId: encryptedId.value,
      tdId: route.query.id,
      additionalInformation:JSON.stringify({language:form.value.language}),
      toolVoiceFileTrans: {
        languageType: form.value.language
      },
      // additionalInformation: form.value.language
    }
    // 创建订单
    toolOrder(params).then(res => {
      orderNo.value = res.data.orderNo
      orderData.value = res.data
      orderData.value.filename = fileData.value.name
      orderData.value.ifPay = res.data.pay
      // 调用支付密码
      if (res.data.pay === 0) {
        confirmOrderRef.value.open()
      }
    })
  }
}

// 价格计算
function priceFormat(price) {
  if (!fileData) {
    return '';
  } else {
    const s = Math.ceil(fileData.value?.duration * 1 / 60)
    return (price * s).toFixed(2)
  }
}

// 确认订单/支付
// function confirmOrder() {
//   let data = {
//     sourceId: encryptedId.value,
//     tdId: route.query.id,
//     toolVoiceFileTrans: {
//       languageType: form.value.language
//     }
//   }
//   if (orderNo.value === '') {
//     // 创建订单
//     toolOrder(data).then(res => {
//       orderNo.value = res.data.orderNo
//       // 调用支付密码
//       if (res.data.pay === 0) {
//         playOrder()
//       }
//     })
//   }else {
//     playOrder()
//   }
// }

// 支付
function playOrder(callbackPay) {
  // 调用支付弹窗
  proxy.$pay.openPay({
    orderNo: orderNo.value,
    confirm: (e) => {
      return new Promise((resolve, reject) => {
        ElMessage.success('支付成功')
        showDialog.value = false
        processingStatus.value = 1
        orderData.value.ifPay = 1
        callbackPay()
      })
    },
    error: (err) => {
      if (typeof err == 'object') {
        if (err.code == 1010) {
          proxy.$pay.openRecharge()
        } else {
          showDialog.value = false
        }
      }
    }
  })
}

function handleToCloudDisk() {}

// 下载
const downloadStatus = ref(false)
function handleDownload() {
  downloadStatus.value = true
  downloadVoiceToText(orderNo.value, form.value.format).then(res => {
    let blob = '';
    let fileName = ''
    if (form.value.format === 'txt') {
      blob = new Blob([res], {type: "application/json;charset=UTF-8"})
      fileName = fileData.value.name + '.txt'
    }
    if (form.value.format === 'doc') {
      blob = new Blob([res], {type: "application/fmsword;charset=utf-8"})
      fileName = fileData.value.name + '.doc'
    }

    if (form.value.format === 'srt') {
      blob = new Blob([res], {type: "application/json, text/plain, */*"})
      fileName = fileData.value.name + '.srt'
    }
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    downloadStatus.value = false
  }).catch(err => {
    ElMessage.error('下载错误：' + err)
    downloadStatus.value = false
  })
}

function handleCopy() {
  if (!textData.value) return
  navigator.clipboard.writeText(textData.value).then(() => {
    ElMessage.success("复制成功");
  })
}

</script>
<style lang="scss" scoped>
@import './style.scss'
</style>
