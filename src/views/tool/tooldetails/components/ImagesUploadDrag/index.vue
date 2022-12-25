<template>
  <div v-loading="loading"
       element-loading-text="处理中..."
       style="display:flex;justify-content: space-around"
       element-loading-background="rgba(0, 0, 0, 0.6)">
    <div style="flex: 5" class="box-item-per">
      <div class="info-text-title" v-if="processResult===2"
      >
        <slot name="per">
          上色前
        </slot>
      </div>
      <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :accept="accept"
          @change="fileChange"
          v-if="!thisFile.size"
          :show-file-list="false"
      >
        <el-icon class="el-icon--upload" >
          <el-image :src="upload"></el-image>
        </el-icon>
        <div class="el-upload__text">
          <div>将文件拖到此处，或者<span style="color: #20a0ff">点击选择</span></div>
          <div>支持文件格式：png / jpg / jpeg</div>
          <div>图片大小不能大于 2MB</div>
        </div>
      </el-upload>
      <div v-else  class="upload-demo" style="text-align: center;">
        <el-image
            style="height: 480px;border-radius: 10px;"
            :src='thisFile.fileUrl'>
        </el-image>
      </div>
    </div>

    <div class="transform-icon">
      <el-image :src="crueect"/>
    </div>
    <div v-if="processResult!==3" class="restest">
      <div class="upload-info">
<!--        v-if="processResult===2&&!loading" -->
          <div class="info-data" >
            <div class="img-box-show">
              <div class="info-text-title" v-if="processResult===2"
                   style="background: linear-gradient(135deg, #DF82C9 0%, #72E7FC 0%, #7B5EDF 100%);"
              >
                <slot name="process">
                  放大{{ parseInt(bigImageWidth/originalImageWidth ) }}x后
                </slot>
              </div>
              <div style="text-align: center;">
                <el-image
                    :src="bigFile?.downloadUrl"
                    :preview-src-list="[bigFile?.downloadUrl]"
                     style="height: 480px;border-radius: 10px;">
                  <template #error>
                    <div class="tool-image">
                      <el-image :src="tooldef"></el-image>
                    </div>
                  </template>
                </el-image>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div v-else  class="restest">
      <div class="upload-info">
        <div class="info-data" >
          <div class="img-box-show">
            <div>
              <el-image
                  :src="bigFile?.downloadUrl"
                  :preview-src-list="[bigFile?.downloadUrl]"
                  style="height: 480px;border-radius: 10px;">
                <template #error>
                  <div class="tool-image" style="flex-direction: column">
                    <div> <el-image :src="tooldef"></el-image></div>
                    <div style="color: wheat;margin-top: 10px"> 图片处理失败，如有疑问请联系客服，金额已自动退到您的账户中。</div>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="upload-operating">

    <el-button class="el-button-start"
               @click="downFile"
               :disabled="processResult!==2"
               v-if="processResult===2">
      <el-image :src="downloadBt" style="margin-top: 3px;"></el-image> 下载
    </el-button>
    <el-button class="el-button-start"
               @click="startProcess"
               :disabled="!thisFile.size||processResult!==0||uploadLoading||loading"
               :loading="uploadLoading"
               :style="{color:
                     !thisFile.size||processResult!==0||loading||uploadLoading? '#4E5262':'#FFFFFF',
                     backgroundColor:!thisFile.size||loading||processResult!==0||uploadLoading? '#30323B':'#3468FE'}"
               v-else>
      <el-image   :src="!thisFile.size||processResult!==0||loading||uploadLoading?uploadgray:uploadicon"  style="margin-top: 3px;"></el-image>
      <span v-if="uploadLoading">
                          <span v-if="thisFile.upload?.state == 'awaiting'">等待上传</span>
                          <span v-else-if="thisFile.upload?.state == 'checking'">读取文件</span>
                          <span
                              v-else-if="thisFile.upload?.state == 'uploading'">正在上传( {{
                              thisFile.upload.percent
                            }} %)</span>
                          <span v-else-if="thisFile.upload?.state == 'error'">上传失败</span>
                          <span v-else>文件上传中</span>
            </span>
      <span v-else>
              开始处理
            </span>
    </el-button>
    <el-upload
        action="#"
        :auto-upload="false"
        :accept="accept"
        @change="fileChange"
        :show-file-list="false"
    >
      <el-button class="el-button-reUpload" plain>
        <el-image :src="reloadIcon" style="margin-top: 5px;"></el-image>
        <div>{{processResult===0? '重新上传':'处理下一张' }}</div></el-button>
    </el-upload>
  </div>
</template>

<script setup>
import UploadFile from "@/utils/uploadFile"
import {createUploadSign, createUploadFile} from '@/api/personnel/file'
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import upload from '@/assets/tool/upload.png'
import {formatSize, getImgResolution} from "@/utils/tool";
import {Sort} from "@element-plus/icons-vue";
import {download} from "@/utils/request"; //导入wavesurfer.js
const store = useStore();
const route = useRoute();
import { ElMessage } from 'element-plus'
import tooldef from '@/assets/tool/tooldef.png'
import crueect from '@/assets/tool/crueect.jpg'
import uploadicon from '@/assets/tool/uploadicon.png'
import uploadgray from '@/assets/tool/uploadgray.png'
import reloadIcon from '@/assets/tool/reloadIcon.png'
import downloadBt from '@/assets/tool/downloadBt.png'
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: ".jpg,.png,.jpeg",
  },
  bigSize:{
    type:Number,
    default: 2,
  },
  processResult:{
    type:Number,
    default:0,
  }
})
const emit = defineEmits(['changeFile', 'startProcess'])
let temBigSize=ref(2);
let originalImageWidth = ref(0), originalImageHeight = ref(0);
const thisFile = ref({})
const bigFile=ref({})
const uploadLoading=ref(false);
const router = useRouter();

const handleStartUploadOneFile = () => {
  let item = thisFile.value.upload;
  item.uploadFile();

}

const fileChange = (file) => {
  let maxSize=route.query.id==5? 1048576:2097152;
  if (file.size>maxSize){
    ElMessage({
      message: `上传文件不能大于${route.query.id==5?'1':'2'}MB`,
      type: 'warning',
    })
    return;
  }

  uploadLoading.value=true;
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  thisFile.value = file;
  emit('changeFile')
  const query=route.query;
  if (query.orderNo){
    router.push({
      query:{id:query.id}
    })
  }

  // 上传文件
  const File = file.raw;
  getImgResolution(file.fileUrl, originalImageWidth, originalImageHeight)
  const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  // store.commit('upload/addFileList', uploadData)
  thisFile.value.upload = uploadData;
  uploadData.on('success', handleStartUploadOneFile)
  handleStartUploadOneFile()
}

let bigImageWidth = ref(0), bigImageHeight = ref(0);
watch(bigFile, (value) => {
  if(bigFile){
    getImgResolution(bigFile.value?.downloadUrl, bigImageWidth, bigImageHeight)
  }
})


watch(thisFile.value, (value) => {
  if(thisFile){
    emit('changeFile')
    getImgResolution(thisFile.value.fileUrl, originalImageWidth, originalImageHeight)
  }
})
/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const getUploadSignFun = (obj, callback, errorback) => {
  const params = {
    filename: obj.FileName.replace(/\s*/g,""),
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
const CreateUploadFileFun = ({resultData, options}, callback, errorback) => {
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
  }
  createUploadFile(params).then(res => {
    emit('changeFile', {file: thisFile.value, sourceId: res.data.encryptedId})
    uploadLoading.value=false;
    ElMessage({
      message: '上传成功',
      type: 'success',
    })
    callback(res.data)
    handleStartUploadOneFile()
  }).catch(err => {
    errorback(err)

  })
}

const loading = ref(false)
/**
 * 开始处理
 */
const startProcess = () => {
  temBigSize.value=props.bigSize
  emit('startProcess',loading,bigFile)
}

const downFile = () => {
  download(bigFile.value.downloadUrl, {}, bigFile.value.filename)
}
defineExpose({
  loading,
  bigFile,
  thisFile
});
</script>

<style scoped lang="scss">
:deep(.el-upload) {
  display: block;
}


.upload-info {
  .info-data {
    text-align: center;
  }

  .info-text {
    margin-left: 22px;
    text-align: left;
    display: flex;
    justify-content: center;

    .info-text-name {
      font-size: 16px;
      font-weight: 500;
      color: #9094A6;
      line-height: 22px;

    }

    .info-text-other {
      font-size: 12px;
      font-weight: 400;
      color: #9094A6;
      line-height: 17px;
      margin-top: 10px;
      margin-right: 20px;
    }
  }

  .img-box-show{
    max-height: 600px;
    position: relative;
    height: 480px;
    background: #14151B;
    border-radius: 16px;
    .info-text-title {
      font-size: 15px;
      color: white;
      background-color: #9094A6;
      position: absolute;
      padding: 10px;
      left: 0;
      bottom: 0;
      //border-top-left-radius: 9px;
      //border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      z-index: 9;
    }
  }
  .tool-image{
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
}


.upload-demo{
  height: 480px;
  background: #14151B;
  border-radius: 16px;
  :deep(.el-upload-dragger) {
    width: 100%;
    background-color: #181920;
    font-size: 14px;
    color: #3D3F50;
    letter-spacing: 0.54px;
    font-weight: 400;
    height: 480px;
    border: none;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    :deep(.el-icon--upload){
      margin: 0;
    }
    &:hover{
      background-color: rgba(52,104,254,0.04);
    }
    &.is-dragover{
      background-color: rgba(52,104,254,0.04);
    }
  }
}

.transform-icon{
  color: transparent;
  background-clip: text;
  font-size: 80px;
  letter-spacing: -13px;
  padding: 30px;
  display: flex;
  align-items: center;
  -webkit-background-clip: text;
  background-image: linear-gradient(90deg, #72E7FC 0%, #7B5EDF 100%);
}
.restest{
  border: none;
  background-color: #24262F;
  flex: 5;
  height: auto;
  border-radius: 16px;
}

.upload-operating {
  margin-top: 30px;
  display: flex;
  justify-content: center;

  .el-button-start {
    min-width: 114px;
    height: 32px;
    background: #3468FE;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 400;
    color: #E1E1E1;
    line-height: 20px;
    border: none;
  }

  .el-button-reUpload {
    width: 114px;
    height: 32px;
    background: #30323B;
    border-radius: 16px;
    background: rgba(52, 104, 254, 0.1300);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin-left: 20px;
    border: none;
    color: #E1E1E1;

  }
}

.box-item-per{
  position: relative;
  .info-text-title {
    font-size: 15px;
    color: white;
    background-color: #9094A6;
    position: absolute;
    padding: 10px;
    left: 0;
    bottom: 0;
    //border-top-left-radius: 9px;
    //border-bottom-right-radius: 10px;
    z-index: 9;
    border-bottom-left-radius: 10px;
  }
}
</style>
