<template>
  <div>
    <audio :src="thisFile.fileUrl" ref="audio" @canplay="waterFileCan" @ended="playEnd"></audio>
    <div style="display: flex;justify-content: space-between">
      <div class="watermark-title">
        <div>第一步：添加水印音频</div>
      </div>
      <div>
        <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :accept="accept"
            :disabled="!!thisFile?.duration"
            @change="fileChange"
            :show-file-list="false"
        >
          <el-button
              :style="{cursor:status!==0?'not-allowed':'pointer'}"
              :class="[status!==0||thisFile?.duration?'upload-gray':'upload-bt']" >

            <span v-if="uploadLoading">
                          <span v-if="thisFile.upload?.state == 'awaiting'">等待上传</span>
                          <span v-else-if="thisFile.upload?.state == 'checking'">读取文件</span>
                          <span v-else-if="thisFile.upload?.state == 'uploading'">正在上传( {{thisFile.upload.percent}} %)</span>
                          <span v-else-if="thisFile.upload?.state == 'error'">上传失败</span>
                          <span v-else>文件上传中</span>
            </span>
            <span v-else>
              添加水印音频
            </span>


<!--            {{'添加水印音频'}}-->
          </el-button>
        </el-upload>
      </div>
    </div>
    <div v-if="!thisFile?.duration">
      <div class="water-text">
        支持文件格式：MP3、WAV
      </div>
    </div>


    <div v-else class="watermark-title" style="border: none;background-color: #14151A;">
      <div class="upload-info">
        <div class="info-data">
          <div class="water-info-data" >
            <div>
              <div class="water-play" @click="play">
                <el-image style="height: 30px" :src="isPlay?playImg:pause"></el-image>
              </div>
            </div>
            <div class="water-text-name"> {{ thisFile.name }}</div>
          </div>
          <div style="flex: 1;color: white">{{ getStringTime(audioDuration) }}</div>
          <div class="info-text-name">
            循环间隔时间：
            <el-input-number :disabled="status!==0" v-model="intervals" style="width: 50px;height: 30px" :max="20" :min="2" :controls="false"/>
            秒
          </div>
          <div class="info-text-name" style="display: flex;align-items: center;">
            <div style="margin-right: 8px"><el-image style="height: 12px;" :src="soud"></el-image></div>
            <el-slider :disabled="status!==0" v-model="volume" @change="setVolume" :max="200" :min="10"/>
            <div style="margin-left: 10px;margin-right: 10px">{{ volume }}</div>
          </div>
          <div v-if="status===0" style="padding: 10px;color: white;flex: 2;text-align: right" @click="deleteFile">
            <el-button type="text">删除</el-button>
          </div>
          <div v-else style="padding: 10px;color: white;flex: 2;text-align: right">

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UploadFile from "@/utils/uploadFile"
import {createUploadSign, createUploadFile} from '@/api/personnel/file'
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {getStringTime} from "@/utils/tool";
import soud from '@/assets/tool/soud.png'
import pause from '@/assets/tool/wate-pause.png'
import playImg from '@/assets/tool/ware-play.png'
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {getAudioDuration} from "../../utils/audioVideoUtils";

const isPlay = ref(false)
const store = useStore();
const route = useRoute()
const uploadLoading = ref(false)
const volume = ref(50)
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: "",
  },
  playStatue: {
    type: Boolean,
    default: false,
  }, status: {
    type: Number,
    default: 0,
  }
})
const emit = defineEmits(['changeFile', 'startProcess', 'watermark'])


watch(()=>props.playStatue,(newValue)=>{
  if (newValue){
    audio.value.pause();
    isPlay.value = false;
  }
},{ deep: true, immediate: true })
const audioDuration = ref(0)
const intervals = ref(5)

const thisFile = ref({})
const handleStartUploadOneFile = () => {
  let item = thisFile.value.upload;
  item.uploadFile();
}


const fileChange = (file) => {
  uploadLoading.value = true;
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  thisFile.value = file;
  getAudioDuration(file.fileUrl).then((time) => {
    if (time <= 10) {
      thisFile.value.duration = time;
      // 上传文件
      const File = file.raw;
      const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
      thisFile.value.upload=uploadData;
      uploadData.on('success', handleStartUploadOneFile)
      handleStartUploadOneFile()
      // store.commit('upload/addFileList', uploadData)
    } else {
      uploadLoading.value=false;
      ElMessage.warning('请上传少于10秒的音频文件');
    }
  }).catch(err => {
    // console.log(err)
    uploadLoading.value=false;
    ElMessage.warning('获取文件时长失败！请上传规范的音频文件');
    // thisFile.value.duration=time;
    // // 上传文件
    // const File = file.raw;
    // const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
    // store.commit('upload/addFileList', uploadData)
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
    uploadLoading.value = false;
    emit('changeFile', {file: thisFile.value, sourceId: res.data.encryptedId})
    callback(res.data)
    handleStartUploadOneFile()
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
const audio = ref(null)
const waterFileCan = () => {
  audioDuration.value = audio.value.duration;
}

/**
 * 播放或暂停
 */
const play = () => {

  if (props.playStatue) {
    ElMessage.warning('音乐正在播放中,请勿重复播放水印音频');
    return;
  }
  isPlay.value = !isPlay.value;
  if (isPlay.value) {
    audio.value.currentTime = 0;
    audio.value.play()
  } else {
    audio.value.pause()
  }
}

const playEnd = () => {
  isPlay.value = false;
}


const setVolume = () => {
  audio.value.volume = Math.min(1, volume.value / 100)
}

onMounted(() => {
  emit('watermark')
})

/**
 * 删除文件
 */
const deleteFile = () => {
  if (props.status!==0){
    ElMessage.warning('已经生成订单，不支持删除水印音频');
    return;
  }
  if (props.playStatue) {
    ElMessage.warning('音乐正在播放中,不支持删除水印音频');
    return;
  }
  thisFile.value = [];
  emit('changeFile', {})
}

const setThisFile = (file) => {
  thisFile.value = file;
}


defineExpose({
  audio,
  intervals,
  volume,
  setThisFile
})

</script>

<style scoped lang="scss">
:deep(.el-upload) {
  display: block;
}

.water-text{
  width: 100%;
  background-color: #14151A;;
  font-size: 14px;
  color: #3D3F50;
  letter-spacing: 0.54px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-info {
  .info-data {
    display: flex;
    align-items: center;
    padding: 0 20px;
    .water-info-data{
      text-align: left;
      display: flex;
      color: white;
      align-items: center;
      .water-play{
        z-index: 99;
        width: 30px;
        height:30px;
        cursor: pointer;
        margin-right: 5px;
      }
      .water-text-name{
        width: 120px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow:ellipsis;
        color: white;
        padding: 0 10px;
      }
    }
  }


  .info-text-name {
    font-size: 16px;
    font-weight: 500;
    color: #9094A6;
    flex: 3;
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

.watermark-title {
  margin: 10px 0;
  padding: 4px;
  color: white;
  //border-bottom: #20a0ff 1px solid;
  font-size: 14px;
  border-radius: 8px;
}
.upload-bt{
  background: rgba(52, 104, 254,  0.1);
  border-radius: 16px;
  border: none;
  color: #3468FE;
  font-size: 14px;
}
.upload-gray{
  background: #14151A;
  border-radius: 16px;
  border: none;
  color: #4E5262;
  font-size: 14px;
}
:deep(.is-disabled){
  &:hover{
    background-color:#14151A;
  }
}
</style>
