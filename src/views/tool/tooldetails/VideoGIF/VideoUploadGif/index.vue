<template>
  <div>
    <div v-if="!thisFile.size&&processResult!==3" style="width: 90%;margin: 60px auto">
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
          每个视频限不超过10分钟，支持文件格式：MP4 / WEBM
        </div>
      </el-upload>
    </div>
    <div
         v-else-if="processResult!==3"
         v-loading="processResult===1"
         element-loading-text="处理中..."
         element-loading-background="rgba(0, 0, 0, 0.6)"
         class="el-upload-dragger" style="border: none;background-color: #24262F;height: auto;">
      <div class="video-box">
        <div class="video-main" style="background-color: rgba(10,11,13,0.75);padding: 30px 50px;border-radius: 10px">
          <div class="resolution">
            <template v-if="uploadLoading">
              文件上传中<span class="loading">...</span>
            </template>
            <template v-else>
              <template v-if="thisFile.fileCat==='image'">
                {{getLabel(thisFile.scaleId)}}
              </template>
              <template v-else>
                {{ thisFile.width }}×{{thisFile.height }}
              </template>
            </template>
          </div>
          <div v-if="thisFile.fileCat==='image'" style="min-width: 200px">
           <el-image style="height: 500px;border-radius: 10px;"  :src="thisFile.downloadUrl"/>
          </div>
          <div v-else>
            <video muted autoplay :src="thisFile.fileUrl??thisFile.downloadUrl"
                   @timeupdate="videoTime"
                   @canplay="videoCanplay"
                   ref="videoRef"
                   style="height: 500px;border-radius: 10px;"></video>
          </div>

          <div style="display: flex;align-items: center;margin-top: 20px;margin-bottom: 20px"  v-if="thisFile.fileCat!=='image'">
            <div style="margin: 0 20px;color: white">
              {{ getStringTime(selectionRange[0]||thisFile.start||selectionRange[0])  }}
            </div>
            <el-slider
                style="min-width: 600px"
                v-model="selectionRange"
                @change="slideChange"
                range show-stops
                :max="videoLength"/>
            <div style="margin: 0 20px;color: white">
              {{ getStringTime(selectionRange[1]||thisFile.end) }}
            </div>
          </div>
          <div style="display: flex;justify-content: space-around" v-if="thisFile.fileCat!=='image'">
            <div style="color: white;font-weight: 500">
              开始时间 &emsp;
              <el-input-number
                  v-model="startTime[1]"
                  :min="0"
                  :max="maxValue[1]||0"
                  @change="setStartTime"
                  style="width: 34px"
                  :controls="false"
                  controls-position="right"
              />
              :
              <el-input-number
                  v-model="startTime[2]"
                  :min="0"
                  :max="startTime[1]<maxValue[1]? 59:maxValue[2]-1 ||0"
                  style="width: 34px"
                  :controls="false"
                  @change="setStartTime"
                  controls-position="right"
              />
            </div>
            <div style="color: white;font-weight: 500">
              结束时间&emsp;
              <el-input-number
                  v-model="endTime[1]"
                  :min="0"
                  :max="maxValue[1]||0"
                  style="width: 34px"
                  @change="setEndTime"
                  :controls="false"
                  controls-position="right"
              />
              :
              <el-input-number
                  v-model="endTime[2]"
                  :min="0"
                  :max="endTime[1]<maxValue[1]? 59:maxValue[2] ||0"
                  style="width: 34px"
                  @change="setEndTime"
                  :controls="false"
                  controls-position="right"
              />
            </div>
            <div style="color: white;font-weight: 500">
              尺寸选择&emsp;
              <el-select v-model="scale" placeholder="请选择尺寸">
                <el-option
                    v-for="item in cities"
                    :key="item.id"
                    :label="item.label+`【${item.value}】`"
                    :value="item.id"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span
                      style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                    {{ item.value }}
                  </span>
                </el-option>
              </el-select>
            </div>

          </div>
        </div>
      </div>
      <div class="upload-info">
        <div class="upload-operating">
          <el-button class="el-button-start" @click="downFile" v-if="processResult===2">
            下载
          </el-button>
          <el-button class="el-button-start"
                     @click="startProcess"
                     :loading="uploadLoading"
                     v-else>
            {{ uploadLoading ? "文件上传中..." : "开始处理" }}
          </el-button>
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
    <div v-else>
      <el-result
          icon="error"
          title="处理失败"
          sub-title="该音频文件处理失败，建议重新上传可播放的音频文件；上传mp3格式的文件可提高处理成功率，如有疑问请联系客服；金额已自动退到您的账户中。"
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
import upload from '@/assets/tool/upload.png'
import {formatSize} from "@/utils/tool";
import {watch} from "vue";
import {ElMessageBox} from "element-plus";
import {onMounted} from "@vue/runtime-core";
import {getStringTime} from "@/utils/tool";
import {download} from "@/utils/request"; //导入wavesurfer.js
const videoRef = ref(null)
const store = useStore();
const route = useRoute();
const scale = ref('6')
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
  processResult: {
    type: Number,
    default: 0,
  },
  inputFile: {
    type: Object,
    default: {}
  },
})
const changeType = ref('1')
onMounted(() => {
  changeType.value = route.query.id
});

const thisFile = ref({})
watch(() => props.inputFile, () => {
  if (props.inputFile?.size) {
    thisFile.value = props.inputFile
    newFileFrom.value.frameRate = props.inputFile.frameRate
    newFileFrom.value.width = props.inputFile.width
    newFileFrom.value.height = props.inputFile.height
    emit('changeFile')
  }
})
const cities = [
  {
    id:'1',
    value: '社群表情',
    label: '240P',
    data:{
      scale:"240:-1",
      width:"240",
      height:"-1",
      frameRate:"-1"
    }
  },
  {
    id:'2',
    value: '公众号配图',
    label: '360P',
    data:{
      scale:"360:-1",
      width:"360",
      height:"-1",
      frameRate:"-1"
    }
  },
  {
    id:'3',
    value: '微博配图',
    label: '450P',
    data:{
      scale:"450:-1",
      width:"450",
      height:"-1",
      frameRate:"-1"
    }
  },
  {
    id:'4',
    value: '知乎配图',
    label: '480P',
    data:{
      scale:"480:-1",
      width:"480",
      height:"-1",
      frameRate:"-1"
    }
  },
  {
    id:'5',
    value: '电商平台',
    label: '750P',
    data:{
      scale:"750:-1",
      width:"750",
      height:"-1",
      frameRate:"-1"
    }
  },
  {
    id:'6',
    value: '原始尺寸',
    label: '原始尺寸',
    data:{
      scale:"-1:-1",
      width:"-1",
      height:"-1",
      frameRate:"-1"
    }
  },
]

const emit = defineEmits(['changeFile', 'startProcess', 'downFile','update:processResult'])


const newFileFrom = ref({})
const fileChange = (file) => {
  uploadLoading.value = true;
  file.width = 0;
  file.height = 0;
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
    let metaData = JSON.parse(res.data.fileSystem.metaData);
    thisFile.value.width = metaData.Width;
    thisFile.value.height = metaData.Height;
    thisFile.sourceId = res.data.encryptedId;
    emit('changeFile', {file: thisFile.value, sourceId: res.data.encryptedId})
    // })
    uploadLoading.value = false;
    // route.query
    callback(res.data)
  }).catch(err => {
    errorback(err)

  })
}

const temType = ref("MP3")

/**
 * 开始处理
 */
const startProcess = () => {
  const info=cities.find(res=>{
    return res.id===scale.value;
  }).data;
  info.startTime=startTime.value.join(":")
  info.toTime=selectionRange.value[1]-selectionRange.value[0];
  info.start=selectionRange.value[0];
  info.end=selectionRange.value[1];
  info.endTime=endTime.value.join(":")
  info.scaleId=scale.value;
  emit('startProcess',info)
}

const getLabel = (id) => {
  const info=cities.find(res=>{
    return res.id===scale.value;
  })
  return info.label+`【${info.value}】`
}

const loading = ref(false)
const uploadLoading = ref(false)
const downFile = () =>{
    download(thisFile.value.downloadUrl, {}, thisFile.value.filename)
}

function getTime(time) {
  // 转换为式分秒
  let h = parseInt(time / 60 / 60 % 24)
  h = h < 10 ? '0' + h : h
  let m = parseInt(time / 60 % 60)
  m = m < 10 ? '0' + m : m
  let s = parseInt(time % 60)
  s = s < 10 ? '0' + s : s
  // 作为返回值返回
  return [h, m, s]
}

const maxValue = ref([])
const videoLength = ref(0)
const selectionRange = ref([0,0])
const startTime = ref([0, 0, 0])
const endTime = ref([0, 0, 0])
let temDuration = 0;
const videoCanplay = () => {
  videoLength.value = videoRef.value.duration;
  if (temDuration !== Number.parseInt(videoLength.value)) {
    selectionRange.value = [0, videoLength.value]
    maxValue.value = getTime(videoRef.value.duration);
    endTime.value = getTime(selectionRange.value[1])
  }
  temDuration = Number.parseInt(videoLength.value);
}

const slideChange = () => {
  startTime.value = getTime(selectionRange.value[0])
  endTime.value = getTime(selectionRange.value[1])
  videoRef.value.currentTime = selectionRange.value[0]
}

const videoTime = () => {
  if (videoRef.value){
    if (videoRef.value.currentTime >= selectionRange.value[1]) {
      videoRef.value.currentTime = selectionRange.value[0]
      videoRef.value.play();
    }
  }
}

const setStartTime = () => {
  selectionRange.value[0]=Number.parseInt(startTime.value[1])*60+startTime.value[2]
}

const setEndTime = () => {
  let newVar = Number.parseInt(endTime.value[1])*60+endTime.value[2];
  if (newVar>selectionRange[0]){
    return;
  }
  selectionRange.value[1]=newVar
}

const nextProcess = () => {
  emit('update:processResult',0);
  thisFile.value=[];
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

.video-box {
  display: flex;
  justify-content: center;
  margin-top: 10px;

  .video-main {
    position: relative;

    .resolution {
      position: absolute;
      right: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.3);
      border-top-right-radius: 10px;
      color: white;
      padding: 10px;
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

:deep(.el-input__inner) {
  padding: 0 !important;
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
</style>
