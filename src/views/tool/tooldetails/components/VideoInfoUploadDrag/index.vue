<template>
  <div>
    <div v-if="!thisFile?.size&&processResult!==3">
      <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :accept="accept"
          @change="fileChange"
          :show-file-list="false"
      >
        <el-icon class="el-icon--upload">
          <el-image :src="upload"></el-image>
        </el-icon>
        <div class="el-upload__text">
          支持文件格式：MP4、AVI、MPG
        </div>
      </el-upload>
    </div>
    <div
        v-else-if="processResult!==3"
        v-loading="processResult===1"
        element-loading-text="处理中..."
        element-loading-background="rgba(0, 0, 0, 0.6)"
         class="el-upload-dragger" style="border: none;background-color: #24262F;height: auto;">
      <div class="upload-info">
        <div style="display:flex;justify-content: center;align-items: center">
          <div class="info-data">
            <div v-if="processResult!==2">
              <video :src="thisFile.compression?.downloadUrl??thisFile.fileUrl"  style="height: 120px;border-radius: 10px;" ></video>
            </div>
            <div class="info-text">
              <div class="info-text-name">{{ thisFile.name||thisFile?.filename}}</div>
              <div class="info-text-other">文件大小：{{ formatSize(thisFile.size??thisFile.raw.size)  }}</div>
              <div class="info-text-other">文件类型：{{thisFile.suffix?.replace(".","")}}文件</div>
              <div class="info-text-other">视频分辨率：{{ thisFile.width|| 1000 }}×{{ thisFile.height||1000 }}</div>
            </div>
          </div>
          <div style="margin-left: 30px;text-align: center;color: wheat" v-if="processResult===2">
            <div>压缩后</div>
            <div>==================></div>
          </div>
          <div v-if="processResult===2">
            <video :src="thisFile.compression?.downloadUrl??thisFile.fileUrl" :controls="thisFile.compression?.downloadUrl" style="height: 120px;border-radius: 10px;" ></video>
          </div>
          <div class="info-data" style="margin-left: 30px" v-if="processResult===2">
            <div class="info-text">
              <div class="info-text-name">{{ thisFile.compression?.filename}}</div>
              <div class="info-text-other">文件大小：{{ formatSize(thisFile.compression?.size)  }}</div>
              <div class="info-text-other">文件类型：{{ thisFile.compression?.suffix.replace(".","") }}文件</div>
              <div class="info-text-other">视频分辨率：           {{ thisFile.compression?.width }}×{{ thisFile.compression?.height }}</div>
            </div>
          </div>
        </div>

        <div class="upload-operating">
          <el-button class="el-button-start" @click="downFile" v-if="processResult===2">
            下载
          </el-button>
          <el-button class="el-button-start"
                     :loading="uploadLoading"
                     v-else
                     @click="startProcess">
            {{uploadLoading?"文件上传中...": "开始压缩"}}
          </el-button>
          <el-upload
              :auto-upload="false"
              :accept="accept"
              @change="fileChange"
              :show-file-list="false"
          >
            <el-button class="el-button-reUpload" plain>{{processResult===2?'处理下一部':'重新上传'}}</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <div v-else>
      <el-result
          icon="error"
          title="处理失败"
          sub-title="该视频文件压缩处理失败，建议重新上传可播放的视频文件；上传mp4格式的文件可提高处理成功率，如有疑问请联系客服；金额已自动退到您的账户中。"
      >
        <template #extra>
          <el-button type="primary" @click="nextProcess">重新上传</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import UploadFile from "@/utils/uploadFile"
import {createUploadSign, createUploadFile} from '@/api/personnel/file'
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {toolUploadRecord} from "@/api/toolbox/toolbox";
import upload from '@/assets/tool/upload.png'
import music from '@/assets/tool/music.png'
import {formatSize} from "@/utils/tool";
import {downloadFile} from "../../../../../utils/tool";
const store = useStore();
const route = useRoute()
const uploadLoading=ref(false)
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: "",
  },
  processResult:{
    type:Number,
    default:0,
  },
  inputFile:{
    type:Object,
    default:{}
  },

})
const emit = defineEmits(['changeFile','startProcess','update:processResult','update:inputFile'])
watch(() =>props.inputFile,()=>{
  if (props.inputFile?.size){
    thisFile.value=props.inputFile
  }
})

const thisFile =ref( {})
const fileChange = (file) => {
  uploadLoading.value=true;
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  thisFile.value = file;
  emit('changeFile')
  // 上传文件
  const File = file.raw;
  const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  store.commit('upload/addFileList', uploadData)
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
const CreateUploadFileFun = ({resultData, options}, callback, errorback) => {
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
  }
  createUploadFile(params).then(res => {
    uploadLoading.value=false;
    if (res.data.fileSystem.metaData){
      let info=JSON.parse(res.data.fileSystem.metaData)
      thisFile.value.width=info.Width;
      thisFile.value.height=info.Height;
    }
    emit('changeFile', {file: thisFile.value, sourceId: res.data.encryptedId})
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

/**
 * 开始处理
 */
const startProcess = () => {
  emit('startProcess')
}

const downFile = () => {
  downloadFile(thisFile.value.compression.downloadUrl,thisFile.value.compression.filename);
}

const nextProcess = () => {
  emit('update:inputFile',{})
  emit('update:processResult',0)
  thisFile.value={}
}
defineExpose({
  thisFile
});
</script>

<style scoped lang="scss">
:deep(.el-upload) {
  display: block;
}

:deep(.el-upload-dragger) {
  width: 100%;
  background-color: #181920;
  font-size: 14px;
  color: #3D3F50;
  letter-spacing: 0.54px;
  font-weight: 400;
  border: 0.5px dashed rgba(78, 82, 98, 1);
}

.upload-info {
  margin: 30px auto;

  .info-data {
    display: flex;
    justify-content: center;
  }

  .info-text {
    margin-left: 22px;
    text-align: left;

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
    }
  }

  .upload-operating {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    .el-button-start {
      width: 266px;
      height: 52px;
      background-image: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
      border-radius: 10px;
      border: none;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 22px;
      font-size: 16px;
    }

    .el-button-reUpload {
      width: 168px;
      height: 52px;
      background: rgba(52, 104, 254, 0.1300);
      border-radius: 10px;
      border: 1px solid #4164C9;
      font-size: 16px;
      font-weight: 400;
      color: #6B8FF8;
      line-height: 22px;
      margin-left: 20px;
    }
  }
}
:deep(.el-result__subtitle p){
  color: #eebe77;
}

:deep(.el-result__title p){
  color: white;
}

</style>
