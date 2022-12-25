<template>
  <div>
    <div class="watermark-title">
      <div>第二步：添加原始音频</div>
      <div style="display:flex;">
        <div v-if="status===0">
          <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :accept="accept"
              @change="fileChange"
              :show-file-list="false"
              multiple
              :disabled="status!==0"
          >
            <el-button   :style="{cursor:status!==0?'not-allowed':'pointer'}" class="upload-bt" >{{
                fileList[0]?.size ? '继续添加':'添加初始音频'}}</el-button>
          </el-upload>
        </div>
        <div style="margin: 0 10px">
<!--          status 1 处理中，0未开始处理，2 处理下一批-->
          <el-button
              class="batch-processing"
              :class="[fileList[0]?.size&&isAddWater?'activate-progress':'progress-navate']"
              v-if="status===1||status===0"  :disabled="status===1"
              @click="processing">{{status===1 ? '处理中':'立即处理'}}</el-button>
          <el-button class="batch-processing activate-progress" v-else  @click="nextProcess">处理下一批</el-button>
        </div>
      </div>
    </div>
    <div v-if="!fileList[0]?.size">
      <div class="update-box">
        <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :accept="accept"
            @change="fileChange"
            :show-file-list="false"
            multiple
        >
          <el-icon class="el-icon--upload">
            <el-image :src="upload"></el-image>
          </el-icon>
          <div class="el-upload__text">
            <div>将文件批量拖到此处，或者<span style="color: rgba(52,104,254,0.73)">点击选择</span></div>
            <div>支持文件格式：mp3 / wav</div>
            <div>每首限不超过12分钟</div>
          </div>
        </el-upload>
      </div>
    </div>
    <div v-else class="file-list-show" v-if="dataf" style="border: none;background-color: #14151A;border-radius: 8px;height: auto;">
      <div class="upload-info" v-for="(file,index) in fileList" :key="file.id">
        <item-audio
            :file="file"
            :fileIndex="index"
            :uuid="file.uuid"
            :ref="(el) => setAudioRefs(el)"
            @play="play"
            @endPlay="endPlay"
            :status="file.status"
        >
          <div @click="deleteFile(file.uuid,file.status)"
               v-if="file.status===0"
               :style="{cursor:file.status!==0?'not-allowed':'pointer'}">
            <el-button type="text">删除</el-button>
          </div>
          <div v-else>&emsp;&emsp;</div>
        </item-audio>
      </div>
    </div>
  </div>
</template>

<script setup>
import UploadFile from "@/utils/uploadFile"
import {createUploadSign, createUploadFile} from '@/api/personnel/file'
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import upload from '@/assets/tool/updata-file.png'
import {formatSize} from "@/utils/tool";
import ItemAudio from './ItemAudio'
import {onBeforeMount, onDeactivated, toRaw} from "vue-demi";
import {onMounted, ref} from 'vue'

const store = useStore();
const route = useRoute()
const uploadLoading = ref(false)
const uploadDrag = ref(null)
import {ElMessage} from "element-plus";
import {getAudioDuration} from "../../utils/audioVideoUtils";
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: ".mp3,.wav",
  },
  watermark: Object,
  status: {
    type: Number,
    default: 0,
  },
  isAddWater:{
    type:String,
    default:''
  }
})
const emit = defineEmits(['changeFile',
  'startProcess',
  'processing',
  'clearWater',
  'playing',
  "mounted","update:status"])

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const thisFile = ref({})
const fileList = ref([])
const fileChange = (file) => {
  uploadLoading.value = true;
  file.downloadUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  thisFile.value = file;
  // 上传文件
  const File = file.raw;
  file.filename = file.name;
  file.uuid = file.name;
  file.id = guid();
  file.status = 0
  getAudioDuration(file.downloadUrl).then((time)=> {
    if (time <= 720) {
      if (fileList.value.findIndex(res => {
        return file.uuid === res.uuid
      }) === -1) {
        file.upload=null;
        fileList.value.push(file)
        const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
        file.upload=uploadData;
        uploadData.on('success', handleStartUpload)
        handleStartUpload();
        // store.commit('upload/addFileList', uploadData)
      } else {
        ElMessage.warning('已存在名称为：' + file.uuid + ' 的文件');
      }
    }else{
      ElMessage.warning('请上传少于12分钟的音频文件');
    }
  }).catch(err=>{
    ElMessage.warning('获取文件时长失败！请上传规范的音频文件');
  })

}


// 开始上传
const handleStartUpload = () => {
  let isUploading = -1; // 是否有正在上传的文件
  let isAwaiting = -1;  // 是否有等待上传的文件
  for (const key in fileList.value) {
    const item = fileList.value[key].upload
    if (item.state == 'uploading' || item.state == 'checking') {
      isUploading = key;
      break;
    } else if (item.state == 'awaiting') {
      isAwaiting = key;
      break
    }
  }
  if (isUploading >= 0) {
    return
  }
  if (isAwaiting >= 0) {
    fileList.value[isAwaiting].upload.uploadFile();
    return
  }
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
    // console.log("------------错误1------------")
    // console.log(err)
    errorback(err)
  })
}

const dataf = ref(true)
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
    uploadLoading.value = false;
    let findFile = fileList.value.find(item => {
      return options.FileName === item.filename;
    });
    if (findFile){
      findFile.sourceId = res.data.encryptedId;
      emit('changeFile', fileList.value)
    }
    callback(res.data)
    handleStartUpload();
  }).catch(err => {
    // console.log("------------错误------------")
    // console.log(err)
    errorback(err)
  })
}


/**
 * 开始处理
 */
const startProcess = () => {
  emit('startProcess')
}

const audioList = []
const deleteFile = (uuid,st) => {
  if (st!==0){
    ElMessage.warning('已经生成订单，不支持删除该音频');
    return;
  }
  dataf.value = false;
  let fIndex = fileList.value.findIndex(res => {
    return res.uuid === uuid;
  })
  // fileList.value[fIndex]?.upload.handleCancel()
  fileList.value[fIndex].handleCancel && fileList.value[fIndex].handleCancel();
  fileList.value.splice(fIndex, 1);
  handleStartUpload();
  let aIndex = audioList.findIndex(res => {
    return res.getUuid() === uuid;
  })
  audioList.splice(aIndex, 1)
  dataf.value = true;
}


const setAudioRefs = (el) => {
  if (toRaw(el)) {
    const isHave = audioList.some(res => {
      return res.getUuid() === toRaw(el).getUuid()
    })
    if (!isHave) {
      audioList.push(el);

    }
  }
}
let timer = null;
let timerOut = null;
const playLogo = () => {
  let audio = props.watermark.audio;
  let intervals = props.watermark.intervals * 1000;
  if (audio.duration) {
    timerOut=setTimeout(() => {
      audio.currentTime = 0;
      audio.play();
      timer = setInterval(() => {
        audio.play();
      }, (intervals + (audio.duration * 1000) + 200))
    }, intervals)
  }
}

const clearTime = () => {
  clearInterval(timer);
  clearTimeout(timerOut);
}

let temName = '';
const play = (uuid) => {
  audioList.forEach((res) => {
    if (uuid !== res.getUuid()) {
      res.pauseAudio();
    } else {
      if (res.getFilex().status !== 2) {
        if (temName !== res.getUuid()) {
          clearTime();
        }
        temName = res.getUuid();
        props.watermark.audio.pause();
        if (res.isPlay) {
          playLogo();
          emit('playing',true)
        } else {
          clearTime();
          emit('playing',false)
        }
      } else {

        if (res.isPlay) {
          emit('playing',true)
        }else {
          emit('playing',false)
        }

        // console.log("正式听")
      }
    }
  })
}

const endPlay = () => {
  clearTime();
  props.watermark.audio.pause();
}


const endPlayStart = () => {
  clearTime();
  props.watermark.audio.pause();
  audioList.forEach((res) => {
    res.pauseAudio();
  })
}

const processing = () => {
  if (fileList.value.length > 0) {
    emit('processing')
  } else {
    // 请上传处理文件
    ElMessage.warning('请上传处理文件');
  }
}

const setFileList = (list) => {
  fileList.value = list;
}

onMounted(() => {
  emit('mounted')
})

onBeforeUnmount(() => {
  clearTime();
})
const router = useRouter();
const nextProcess = () => {
  fileList.value=[];
  emit("update:status",0);
  emit('clearWater')
  const query=route.query;
  router.push({
    query:{id:query.id}
  })
}

defineExpose({
  endPlayStart,
  setFileList
})
</script>

<style scoped lang="scss">
:deep(.el-upload) {
  display: block;
}

.update-box{
  height: 406px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #14151A;
  border-radius: 8px;
  .upload-demo{
    width: 380px;
    height: 168px;
    :deep(.el-upload-dragger){
      height: 168px;
      background: #1C1D24;
      border-radius: 8px;
      border: none;
      .el-icon--upload{
        font-size: 50px;
        margin: 19px;
      }
      &:hover{
        background-color: rgba(52,104,254,0.04);
      }
      &.is-dragover{
        background-color: rgba(52,104,254,0.04);
      }
    }
  }
}

.file-list-show{
  width: 100%;
  background-color: #1C1D24;
  font-size: 14px;
  color: #3D3F50;
  letter-spacing: 0.54px;
  font-weight: 400;
  cursor: auto;
}


.upload-info {
  padding: 5px 20px;
  margin-top: 2px;
  .info-data {
    display: flex;
    justify-content: center;
  }

  &:hover {
    background-color: rgba(128, 128, 128, 0.2);
    border-radius: 6px;
  }

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

.watermark-title {
  color: white;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .batch-processing {
    border-radius: 10px;
    border: none;
    font-weight: 400;
    line-height: 22px;
    font-size: 14px;
  }
  .progress-navate{
    background: #14151A;
    color: #3D3F50;
  }
  .activate-progress{
    background-image: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
    color: #FFFFFF;
  }
  .upload-bt{
    border: none;
    background: rgba(52, 104, 254, 0.1);
    border-radius: 16px;
    color: #3468FE;
    font-size: 14px;
  }
}

:deep(.el-button.is-disabled){
  background: rgba(52, 104, 254,0.2);
}

</style>
