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
            <div>
              将文件拖到此处，或者<span style="color: #20a0ff">点击选择</span>
            </div>
            支持文件格式：MP3 / WAV / AC3 / AAC / FLAC / PCM / M4A

            <div>每首限不超过12分钟</div>
          </div>
        </el-upload>
      </div>
      <div v-if="thisFile?.size" class="el-upload-dragger" style="border: none;background-color: #24262F;height: auto;">
        <div class="video-box">
          <div class="video-main">
            <audio ref="audioRef"
                   :src="thisFile.fileUrl??thisFile.downloadUrl"
                   @canplay="canplayHander"
                   @timeupdate="timeChange"
                   @ended="isPlay=false"
                   style="border-radius: 10px;" @error="playError"></audio>
          </div>
        </div>

        <div class="upload-info">
          <div style="color: white;display: flex; padding:2px 20px;">
            <div class="info-text">
              <div style="display:flex;width: 100%;align-items: center">
              </div>
              <div class="info-text-name">名称</div>
              <div class="info-text-other">大小</div>
            </div>
          </div>

          <div class="info-data" style="color: white;display: flex;  position: relative;">
            <div class="info-text">
              <div class="success-text" v-if="thisFile.processingStatus===2">√</div>
              <div style="display:flex;width: 100%;align-items: center">
                <el-button style="z-index: 99;width: 30px;height:30px"
                           type="text"
                           v-if="!errorPlay"
                           @click="play">
                  <el-image style="height: 30px" :src="isPlay?playImg:pause"></el-image>
                </el-button>
                <div v-else style="cursor: not-allowed;" class="glay-color">
                  <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="该格式不支持，在线播放"
                      placement="top"
                  >
                    <el-image style="height: 30px" :src="pause"></el-image>
                  </el-tooltip>
                </div>


                <div style="width: 30%;margin-left: 25px;margin-right: 20px">
                  <el-slider
                      :format-tooltip="formatTooltip"
                      @change="changeAudioProgress"
                      :disabled="errorPlay"
                      v-model="audioPres"/>
                </div>
                <div>{{ secondToDate(currentTime) }}/{{ secondToDate(durationTime) }}</div>
                <div>
                  <volume-progress-bar @volume="vocalVolume"
                                       name=""/>
                </div>
                <div>
                  <!--                  <el-dropdown>-->
                  <!--                      <span class="el-dropdown-link">-->
                  <!--                           <span style="font-size: 14px;margin-left: 10px"> 播放速度</span>-->
                  <!--                      </span>-->
                  <!--                    <template #dropdown>-->
                  <!--                      <el-dropdown-menu>-->
                  <!--                        <template v-for="rate in playbackRateList" :key="rate.id">-->
                  <!--                          <el-dropdown-item-->
                  <!--                              class="drop-down"-->
                  <!--                              :class="{activateStyle:activateRate===rate.id}"-->
                  <!--                              @click="dropClick(rate)">-->
                  <!--                            <span style="width: 80px">{{ rate.speed }}</span>-->
                  <!--                          </el-dropdown-item>-->
                  <!--                        </template>-->
                  <!--                      </el-dropdown-menu>-->
                  <!--                    </template>-->
                  <!--                  </el-dropdown>-->
                </div>
              </div>
              <div class="info-text-name">{{ thisFile.name || thisFile.filename }}</div>
              <div class="info-text-other">{{ formatSize(thisFile?.size) }}</div>
            </div>
          </div>

          <div class="upload-operating">
            <el-button class="el-button-start" @click="downFile" v-if="thisFile.processingStatus===2">
              <div style="display: flex;align-items: center">
                <div style="margin-top: 12px;margin-right: 3px">
                  <el-image :src="downloadBt"></el-image>
                </div>
                <div>
                  立即下载
                </div>
              </div>
            </el-button>
            <el-button class="el-button-start"
                       @click="startProcess"
                       :loading="uploadLoading===1"
                       v-else-if="uploadLoading!==3">
              <div style="display: flex;align-items: center">
                <div style="margin-top: 12px;margin-right: 3px">
                  <el-image :src="tr"></el-image>
                </div>
                <div>
                  <span v-if="uploadLoading===1">
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
                </div>
              </div>
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
              <el-button class="el-button-reUpload" plain>
                <div style="display: flex;align-items: center">
                  <div style="margin-top: 12px">
                    <el-image :src="reloadIcon"></el-image>
                  </div>
                  <div>{{ thisFile.processingStatus === 2 ? ' 处理下一首' : '重新上传' }}</div>
                </div>
              </el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <el-result
          icon="error"
          title="处理失败"
          :sub-title="'【'+(thisFile.name || thisFile.filename)+' 】音频格式转换失败，请重新选择音频。已支付的同钱将自动退回您的账户中，如有疑问请联系客服。'"
      >
        <template #extra>
          <el-button @click="nextBack" type="primary">处理下一批</el-button>
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
import reloadIcon from '@/assets/tool/reloadIcon.png'
import upload from '@/assets/tool/upload.png'
import {formatSize} from "@/utils/tool";
import {watch, nextTick} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

const playbackRateList = [
  {
    id: 1,
    speed: 0.25,
  },
  {
    id: 2,
    speed: 0.5,
  },
  {
    id: 3,
    speed: 0.75,
  },
  {
    id: 4,
    speed: "正常",
  },
  {
    id: 5,
    speed: 1.25,
  },
  {
    id: 6,
    speed: 1.5,
  },
  {
    id: 7,
    speed: 1.75,
  },
  {
    id: 8,
    speed: 2,
  }
]
//function setPlaySpeed(){
// a.playbackRate = 0.5;//设置速度1/1.5/2
// }
const store = useStore();
const route = useRoute()
import {onMounted} from "@vue/runtime-core";
import pause from '@/assets/tool/wate-pause.png'
import playImg from '@/assets/tool/ware-play.png'
import tr from '@/assets/tool/tr.png'
import downloadBt from '@/assets/tool/downloadBt.png'
import {ref} from "vue";
import {secondToDate} from "@/utils/tool";

const isPlay = ref(false)
const audioRef = ref(null)
const audioPres = ref(0)
import VolumeProgressBar from '../../components/VolumeProgressBar'
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
    type: String,
    default: 'mp3',
  },
  processResult: {
    type: Boolean,
    default: false,
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

const handleStartUploadOneFile = () => {
  let item = thisFile.value.upload;
  item.uploadFile();
}


const router = useRouter();
let player = null;
let errorPlay = ref(false);
const emit = defineEmits(['changeFile', 'startProcess', 'downFile', 'backClear'])
const filePlayLoading = ref(false);
const fileChange = (file) => {
  isPlay.value = false;
  if (audioRef.value) {
    audioRef.value.pause();
  }
  const query = route.query;
  if (query.orderNo) {
    router.push({
      query: {id: query.id}
    })
  }
  filePlayLoading.value = false;
  uploadLoading.value = 1;
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  thisFile.value = file;
  emit('changeFile')
  const File = file.raw;
  const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  // store.commit('upload/addFileList', uploadData)
  thisFile.value.upload = uploadData;
  uploadData.on('success', handleStartUploadOneFile)
  handleStartUploadOneFile()
}


/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const getUploadSignFun = (obj, callback, errorback) => {
  const params = {
    filename: obj.FileName.replace(/\s*/g, ""),
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
    thisFile.value.duration = res.data.fileSystem?.duration;
    console.log(thisFile.value)
    emit('changeFile', {file: thisFile.value, sourceId: res.data.encryptedId})
    // })
    uploadLoading.value = 2;
    // route.query
    callback(res.data)
    handleStartUploadOneFile()
    ElMessage.success("上传成功")
  }).catch(err => {
    errorback(err)
    uploadLoading.value = 3;

  })
}

const temType = ref("MP3")

/**
 * 开始处理
 */
const startProcess = () => {
  emit('startProcess')
  audioPres.value = 0;
  temType.value = props.radio;
  if (audioRef.value) {
    audioRef.value.pause();
  }
}
const nextBack = () => {
  thisFile.value = {};
  emit('backClear')
}

const playError = () => {
  errorPlay.value = true;
}

const loading = ref(false)
const uploadLoading = ref(0)
const downFile = () => {
  emit('downFile')
}


const play = () => {
  if (filePlayLoading.value) {
    ElMessage.info("音乐加载中...")
    return;
  }
  isPlay.value = !isPlay.value;
  if (isPlay.value) {
    audioRef.value.play();
  } else {
    audioRef.value.pause();
  }
}
const durationTime = ref(0)
const currentTime = ref(0)
const canplayHander = () => {
  filePlayLoading.value = false;
  durationTime.value = audioRef.value?.duration;
}

const timeChange = (time) => {
  currentTime.value = audioRef.value?.currentTime;
}

const vocalVolume = (val) => {
  audioRef.value.volume = val;
}

const changeAudioProgress = () => {
  audioRef.value.currentTime = durationTime.value / 100 * audioPres.value;
  isPlay.value = true;
  audioRef.value.play();
}
const formatTooltip = (value) => {
  // 宽 100 ，当前长度 100 ，实际场地 200 200/100 *
  return secondToDate(durationTime.value / 100 * value)
}
const activateRate = ref(4);
const dropClick = (rate) => {
  activateRate.value = rate.id;
  audioRef.value.playbackRate = rate.speed;
}

watch(() => props.inputFile, () => {
  if (props.inputFile?.processingStatus) {
    thisFile.value = props.inputFile
    isPlay.value=false;
    audioPres.value=0;
    emit('changeFile')
  }
})

defineExpose({
  loading,
  thisFile
});

</script>

<style scoped lang="scss">
:deep(.el-upload) {
  width: 39%;
  display: block;
  margin: auto;

  .el-icon--upload {
    margin: 19px auto 18px auto;
  }

  .el-upload__text {
    font-size: 12px;
  }
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 168px;
  background-color: #181920;
  font-size: 14px;
  color: #3D3F50;
  letter-spacing: 0.54px;
  font-weight: 400;
  //border: 0.5px dashed rgba(78, 82, 98, 1);
  border: none;

  &:hover {
    background-color: rgba(52, 104, 254, 0.04);
  }

  &.is-dragover {
    background-color: rgba(52, 104, 254, 0.04);
  }
}

.upload-info {
  margin: 30px auto;

  .info-data {
    display: flex;
    //justify-content: center;
    border-radius: 20px;
    margin: 0px 11px;
    background: linear-gradient(120deg, #1E202C 0%, #1F1E27 100%);
    padding: 20px;
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
      border: none;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 22px;
      font-size: 14px;
    }

    .el-button-reUpload {
      width: 114px;
      height: 32px;
      background: #F88212;
      border-radius: 16px;
      font-size: 14px;
      color: #E1E1E1;
      font-weight: 400;
      line-height: 22px;
      margin-left: 20px;
      border: none;
    }
  }
}

.info-text {

  margin-left: 22px;
  text-align: left;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .success-text, .error {
    position: absolute;
    left: 2px;
    background: #0DA411;
    top: 1px;
    width: 21px;
    height: 23px;
    line-height: 22px;
    text-indent: 5px;
    border-bottom-right-radius: 9px;
    border-top-left-radius: 7px;
  }

  .error {
    background: red;
  }


  .info-text-name {
    font-size: 14px;
    font-weight: 500;
    color: #9094A6;
    line-height: 22px;
    width: 30%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }

  .info-text-other {
    font-size: 14px;
    font-weight: 400;
    color: #9094A6;
    line-height: 22px;
    margin-left: 20px;
    width: 10%;
  }

  .info-text-after {
    color: #4164C9;
    font-size: 14px;
    font-weight: 500;
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

:deep(.tooltip-my-class) {
  margin: 0;
}

:deep(.el-tooltip__trigger) {
  transform: scale(0.7);
}

.glay-color {
  filter: gray;
  -webkit-filter: grayscale(100%);
}

//.success-text{
//  position: relative;
//
//}
:deep(.activateStyle) {
  color: #20a0ff;

  &:after {
    content: '√';
    font-size: 12px;
    margin-left: 20px;
  }
}

:deep(.drop-down) {
  width: 80px;
}
</style>
