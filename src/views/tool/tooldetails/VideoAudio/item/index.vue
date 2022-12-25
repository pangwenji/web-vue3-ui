<template>
  <div>
    <div v-if="thisFile.processingStatus!==3">
      <div v-if="!thisFile?.size">
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
            每个视频限不超过10分钟，支持文件格式：MP4 / AVI / MPG / MOV / FLV / 3GP / WEBM / MKV / WMV
          </div>
        </el-upload>
      </div>
      <div v-if="thisFile?.size" class="el-upload-dragger" style="border: none;background-color: #24262F;height: auto;">
        <div class="video-box">
          <div class="video-main">
            <div class="resolution" v-if="!processResult">
              <template v-if="uploadLoading===1">
                文件上传中<span class="loading">...</span>
              </template>
              <template v-else>
                {{ thisFile.width }}×{{ thisFile.height }}
              </template>
            </div>
<!--      :src="thisFile.fileUrl??thisFile.downloadUrl"      <div id="mse" style="border-radius: 10px"></div>-->
            <div id="mse"></div>
          </div>
        </div>

        <div class="upload-info">
          <div class="info-data" v-if="!processResult">
            <div class="info-text">
              <div class="info-text-name">{{ thisFile.name }}</div>
              <div class="info-text-other">视频大小：{{ formatSize(thisFile?.size??thisFile.raw?.size) }}</div>
              <div class="info-text-other" >视频时长：{{ thisFile.duration }}s</div>
              <div class="info-text-after">
                输出音频格式：
                <span style="font-size: 20px;margin-left: 10px">{{ type }}</span>
              </div>
              <div  class="info-text-other">处理类型：视频声音提取1.0版</div>
            </div>
          </div>
          <div v-else class="info-data" style="color: white;display: flex">
            <div class="info-text">
              <div class="info-text-name">{{ thisFile.filename }}</div>
              <div class="info-text-other">音频大小：{{ formatSize(thisFile?.size) }}</div>
            </div>
          </div>
          <div class="upload-operating">
            <el-button class="el-button-start" @click="downFile" v-if="processResult">
              下载 {{temType}}
            </el-button>
            <el-button class="el-button-start"
                       @click="startProcess"
                       :loading="uploadLoading===1"
                       v-else-if="uploadLoading!==3">
              {{uploadLoading===1?"文件上传中...": "开始处理"}}
            </el-button>

            <el-upload
                v-else
                :auto-upload="false"
                :accept="accept"
                @change="fileChange"
                :show-file-list="false"
            >
              <el-button class="el-button-start" plain>上传失败，重新上传</el-button>
            </el-upload>


            <el-upload
                :auto-upload="false"
                :accept="accept"
                @change="fileChange"
                :show-file-list="false"
            >
              <el-button class="el-button-reUpload" plain>重新上传</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <el-result
          icon="error"
          title="处理失败"
          sub-title="该视频提取音频失败，请确保视频中含有音频，建议重新上传可播放的音频文件；上传mp4格式的文件可提高处理成功率，如有疑问请联系客服；扣费金额已自动退到您的账户中。"
      >
        <template #extra>
          <el-button @click="nextBack" type="primary">重新上传文件</el-button>
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
import {watch, nextTick} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {onMounted} from "@vue/runtime-core";
import Player from 'xgplayer';
import {getAudioDuration} from "../../utils/audioVideoUtils";
const store = useStore();
const route = useRoute()
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: "",
  },
  radioList: {
    type: Array,
    default: [],
  },
  radio: {
    type: Number,
    default: 1,
  },
  processResult:{
    type:Boolean,
    default:false,
  },
  inputFile:{
    type:Object,
    default:{}
  },
})
const changeType = ref('1')
onMounted(() => {
  changeType.value = route.query.id
});
const type = ref(props.radioList[0].type)
watch(() => props.radio, () => {
  const a = props.radioList.find(res => {
    return res.value === props.radio
  })
  type.value = a.type
  if (changeType.value==='11'){
    newFileFrom.value=a.data;
  }
})
const thisFile = ref({})
watch(() =>props.inputFile,()=>{
  if (props.inputFile?.size){
    thisFile.value=props.inputFile
    newFileFrom.value.frameRate=props.inputFile.frameRate
    newFileFrom.value.width=props.inputFile.width
    newFileFrom.value.height=props.inputFile.height
    emit('changeFile')
  }
})

let player=null;
watch(()=>thisFile.value,()=>{
  nextTick(() => {
    if (player){
      player.pause()
      player.src=thisFile.value.fileUrl||thisFile.value.downloadUrl
      player.pause()
    }else{
      player= new Player({
        id: 'mse',
        url: thisFile.value.fileUrl||thisFile.value.downloadUrl
      });
    }
  })
})


const emit = defineEmits(['changeFile', 'startProcess','downFile','backClear'])



const newFileFrom=ref({})
const videoRef=ref(null);
const fileChange = (file) => {
  uploadLoading.value=1;
  file.width=0;
  file.height=0;
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  // videoRef.value=`       <video ref="videoRef" controls src="${file.fileUrl}" style="height: 300px;border-radius: 10px;" >
  //             </video>`

  getAudioDuration(file.fileUrl).then(time=>{
    if (time <= 600) {
      // 上传文件
      thisFile.value = file;
      emit('changeFile')
      const File = file.raw;
      const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
      store.commit('upload/addFileList', uploadData)
    }else{
      ElMessage.warning('视频不能大于10分钟');
    }
  }).catch(res=>{
    thisFile.value = file;
    emit('changeFile')
    const File = file.raw;
    const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
    store.commit('upload/addFileList', uploadData)
  })

}


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
    thisFile.value.suffix = res.data.fileSystem.suffix;
    thisFile.value.duration = res.data.fileSystem.duration;
    let metaData=JSON.parse(res.data.fileSystem.metaData);
    thisFile.value.width=metaData.Width;
    thisFile.value.height=metaData.Height;
    thisFile.sourceId=res.data.encryptedId;
    newFileFrom.value.height=thisFile.value.height
    newFileFrom.value.width=thisFile.value.width
    newFileFrom.value.frameRate=25
    emit('changeFile', {file: thisFile.value, sourceId: res.data.encryptedId})
    // })
    uploadLoading.value=2;
    // route.query
    callback(res.data)
  }).catch(err => {
    errorback(err)
    uploadLoading.value=3;
  })
}

const temType=ref("MP3")

/**
 * 开始处理
 */
const startProcess = () => {
  if (changeType.value==='11'){
    newFileFrom.value.sourceId=thisFile.sourceId
    newFileFrom.value.scale=newFileFrom.value.width+':'+newFileFrom.value.height
    emit('startProcess',newFileFrom.value)
    temType.value=props.type;
  }else {
    emit('startProcess')
    temType.value=props.type;
  }
}
const nextBack = () => {
  thisFile.value={};
  emit('backClear')
}

const loading = ref(false)
const uploadLoading=ref(0)
const downFile = () => {
  emit('downFile')
}
defineExpose({
  loading,
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
    //justify-content: center;
    padding: 0px 30px;

    border-radius: 20px;
    margin: 0px 11px;
    background: linear-gradient(120deg, #1E202C 0%, #1F1E27 100%);
    padding: 20px;
  }

  .info-text {
    margin-left: 22px;
    text-align: left;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

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

    .info-text-after {
      color: #4164C9;
      font-size: 14px;
      font-weight: 500;
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
.video-box{
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .video-main{
    position: relative;
    .resolution{
      position: absolute;
      right: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.3);
      border-top-right-radius: 10px;
      color: white;
      padding: 10px;
      z-index: 2;
    }
  }

  .loading {
    display: inline-block;
    line-height: 1;
    height: 15px;
    text-align: left;
    font-size: 18px;
    vertical-align: 0.1em;
    overflow: hidden;
  }

  .loading::before {
    display: block;
    content: '...\A..\A.';
    white-space: pre-wrap;
    animation: loading 2s infinite step-start both;
  }

  @keyframes loading {
    33.3% {
      transform: translateY(-2em);
    }
    66.6% {
      transform: translateY(-1em);
    }
  }


}
:deep(.el-input) {
  background: #202020;
  input{
    box-shadow: none;//去除白边
    background-color: #1E202A;
    border: #4E5262 solid 1px;
    color: white;
    &:focus {
      box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;//输入内容原本样式
      outline: 0;
    }
  }
}
</style>
