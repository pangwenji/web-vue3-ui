<template>
  <div>
    <div class="result-info" v-if="inputFile?.size">
      <div>
        <video :src="inputFile.downloadUrl" controls style="height: 400px;"></video>
      </div>
      <div class="info-text">
        <div class="mt" style="display:flex;">
<!--          <div class="mr">文件名称：{{inputFile.filename}}</div>-->
<!--          <div class="mr">视频大小：{{ formatSize(inputFile?.size)}}</div>-->
        </div>
        <div class="mt">
          <el-button @click="downFile" class="down-bt">下载（{{formatSize(inputFile?.size)}}）</el-button>
          <el-button @click="nextProcess" class="down-next">处理下一首</el-button>
        </div>
      </div>
    </div>
    <div v-if="processResult!==2" class="watermark-title">
      <div>需要视频合并文件</div>
      <div style="display:flex;">
        <div style="margin: 0 10px">
          <!--          status 1 处理中，0未开始处理，2 处理下一批-->
          <el-button class="batch-processing" v-if="status===1||status===0" :disabled="status===1" @click="processing">
            {{
              status === 1 ? '处理中' : '立即处理'
            }}
          </el-button>
          <el-button class="batch-processing" v-else @click="nextProcess">处理下一批</el-button>
        </div>
        <div>
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
            <el-button class="upload-bt">上传</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <div v-if="!fileList[0]?.size&&processResult!==2">
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
          请上传两部（含）以上视频，每首限不超过10分钟，支持文件格式：MP4 / AVI / MPG
        </div>
      </el-upload>
    </div>
    <div class="el-upload-dragger"
         v-loading="processResult===1"
         element-loading-text="处理中..."
         element-loading-background="rgba(0, 0, 0, 0.6)"
         v-else-if="dataf&&processResult!==3&&processResult!==2" style="border: none;background-color: #24262F;height: auto;">
      <transition-group
          name="drag"
          tag="ul"
      >
        <div class="upload-info"
             v-for="(file,index) in fileList"
             :key="file.id"
             @dragenter="dragenter($event, index)"
             @dragover="dragover($event, index)"
             @dragstart="dragstart(index)"
             :draggable='true'
        >
          <div style="display:flex;justify-content: space-between;align-items: center;color: white;flex: 1">
            <div>
              <video :src="file.downloadUrl" style="height: 80px;width: 120px"></video>
            </div>
            <div style="flex: 1">{{ file.filename }}</div>
            <div style="flex: 1">{{ formatSize(file?.size) }}</div>

            <div style="display:flex;">
              <div style="margin-right: 30px">
                  <div v-if="file.upload.state == 'awaiting'">等待上传</div>
                  <div v-else-if="file.upload.state == 'checking'">读取文件</div>
                  <div v-else-if="file.upload.state == 'uploading'">正在上传( {{file.upload.percent}} %)</div>
                  <div v-else-if="file.upload.state == 'error'">上传失败</div>
                  <div v-else style="color: #0DA411">上传完成</div>
              </div>
              <div>
                <Delete :style="{cursor:status!==0?'not-allowed':'pointer'}" @click="deleteFile(index)"
                        style="width: 1em; height: 1em; margin-right: 8px"/>
              </div>
              <div style="margin-left: 30px">
                <el-icon :style="{cursor:status!==0?'not-allowed':'pointer'}"
                         style="width: 1em; height: 1em; margin-right: 8px"><Sort /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div v-else-if="processResult!==2">
      <el-result
          icon="error"
          title="处理失败"
          sub-title="视频合并处理失败，建议重新上传可正常播放的视频；上传mp4格式的文件可提高处理成功率，如有疑问请联系客服；金额已自动退到您的账户中。"
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
import {onBeforeMount, onDeactivated, toRaw} from "vue-demi";
import {onMounted, ref} from 'vue'

const store = useStore();
const route = useRoute()
const uploadLoading = ref(false)
const uploadDrag = ref(null)
import {ElMessage} from "element-plus";
import {getAudioDuration} from "../../utils/audioVideoUtils";
import {download} from "@/utils/request";
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: ".mp4,.avi,.mpg",
  },
  watermark: Object,
  status: {
    type: Number,
    default: 0,
  },
  inputFile: {
    type: Object,
    default: {}
  },
  processResult: {
    type: Number,
    default: 0,
  }
})
const emit = defineEmits([
    'changeFile',
  'startProcess',
  'processing',
  "mounted",
  'update:status',
  'update:processResult',
  'update:inputFile'])

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
  getAudioDuration(file.downloadUrl).then(time => {
    if (time <= 600) {
      upFile(file);
    } else {
      ElMessage.warning('视频不能大于10分钟');
    }
  }).catch(res => {
    upFile(file);
  });
}


const upFile = (file) => {
  thisFile.value = file;
  // 上传文件
  const File = file.raw;
  file.filename = file.name;
  file.uuid = file.name;
  file.id = guid();
  file.status = 0
  if (fileList.value.findIndex(res => {
    return file.uuid === res.uuid
  }) === -1) {
    file.upload=null;
    fileList.value.push(file)
  } else {
    ElMessage.warning('已存在名称为：' + file.uuid + ' 的文件');
  }

  const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  file.upload=uploadData;
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
    findFile.sourceId = res.data.encryptedId;

    emit('changeFile', fileList.value)
    callback(res.data)
  }).catch(err => {
    errorback(err)

  })
}

const processing = () => {
  if (fileList.value.length >= 2) {
    emit('processing')
  } else {
    // 请上传处理文件
    ElMessage.warning('请上传两个或两个以上的视频文件');
  }
}

const setFileList = (list) => {
  fileList.value = list;
}

const deleteFile = (index) => {
  if (props.status !== 0) {
    return;
  }
  fileList.value.splice(index, 1);
}

onMounted(() => {
  emit('mounted')
})


/**
 * 拖拽事件
 * @type {number}
 */
let dragIndex = -1;
const dragstart = (index) => {
  dragIndex = index
}
const dragenter = (e, index) => {
  e.preventDefault()
  // 避免源对象触发自身的dragenter事件
  if (dragIndex !== index) {
    const moving = fileList.value[dragIndex]
    fileList.value.splice(dragIndex, 1)
    fileList.value.splice(index, 0, moving)
    // 排序变化后目标对象的索引变成源对象的索引
    dragIndex = index
  }
}
const dragover = (e, index) => {
  e.preventDefault()
}
const downFile = () => {
  download(
      props.inputFile?.downloadUrl,
      {},
      props.inputFile?.filename)
}

const nextProcess = () => {
  fileList.value = [];
  emit("update:status", 0);
  emit("update:processResult", 0);
  emit("update:inputFile", {});
  emit('clearWater')
  // const query = route.query;
  // router.push({
  //   query: {id: query.id}
  // });
}
defineExpose({
  setFileList
})
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
  cursor: auto;
  border: 0.5px dashed rgba(78, 82, 98, 1);
}

.upload-info {
  padding: 5px 20px;
  border: #FFFFFF;
  border-bottom: #242d4d solid 1px;
  cursor: pointer;

  .info-data {
    display: flex;
    justify-content: center;
  }

  &:hover {
    background-color: rgba(32, 32, 32, 0.6);
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
  padding: 10px 0;
  color: white;
  border-bottom: #20a0ff 1px solid;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.batch-processing {
  background-image: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
  border-radius: 10px;
  border: none;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 22px;
  font-size: 14px;
}

.upload-bt {
  background: rgba(52, 104, 254, 0.9);
  border: none;
  color: wheat;
  border-radius: 6px;
}

.drag-move {
  transition: transform .5s;
}


.result-info{
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
  color: white;
  align-items: center;
  .info-text{
    margin-left: 20px;
  }
  .mt{
    margin-top: 20px;
  }
  .mr{
    margin-left: 20px;
  }

  .down-bt{
    width: 168px;
    height: 52px;
    background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
    border-radius: 10px;
    border: none;
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
  }
  .down-next{
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
</style>
