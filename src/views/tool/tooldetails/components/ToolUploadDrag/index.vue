<template>
  <div style="text-align: center;display: flex">
    <div style="margin: 30px 30px;">
      <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :accept="accept"
          :disabled="!!thisFile.size"
          @change="fileChange"
          :show-file-list="false"
      >
        <div v-if="!thisFile.size">
          <el-icon class="el-icon--upload">
            <el-image :src="upload"></el-image>
          </el-icon>
          <div class="el-upload__text " style="padding:0 30px">
            <div>将文件拖到此处，或者<span style="color: #6B8FF8">点击选择</span></div>
            <div>支持文件格式：mp3 / wav</div>
            <div>每首限不超过12分钟</div>
          </div>
        </div>

        <div v-else class="music-icon">
          <el-image :src="music"></el-image>
        </div>
      </el-upload>
    </div>

    <div class="info-dragg">
      <div class="upload-info">
        <div class="info-text">
          <div class="info-text-name">{{ thisFile.name || '-' }}</div>
          <div class="info-text-other">文件大小：{{ thisFile.raw?.size ? formatSize(thisFile.raw.size) : '-' }}</div>
          <div class="info-text-other">文件类型：{{ thisFile.suffix || '-' }}</div>
          <div class="info-text-other">处理类型：{{ processingType || '-' }}</div>
        </div>
        <div class="upload-operating">

          <el-button class="el-button-start"
                     :disabled="!thisFile.size||processResult!==0||uploadLoading"
                     :style="{color:
                     !thisFile.size||processResult!==0||uploadLoading? '#4E5262':'#FFFFFF',
                     backgroundColor:!thisFile.size||processResult!==0||uploadLoading? '#30323B':'#3468FE'}"
                     @click="startProcess">
            <div style="display: flex;align-items: center">
              <el-image class="tool-bt-icon"
                        :src="!thisFile.size||processResult!==0||uploadLoading?uploadgray:uploadicon"/>
              <div>
<!--                {{ uploadLoading ? "文件上传中..." : "开始转换" }}-->
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
                     开始转换
                    </span>

              </div>
            </div>
          </el-button>
          <el-upload
              :auto-upload="false"
              :accept="accept"
              action="#"
              @change="fileChange"
              :show-file-list="false"
          >
            <el-button class="el-button-start" style="margin-left: 8px" plain>
              <div style="display: flex;align-items: center">
                <el-image class="tool-bt-icon" :src="reloadIcon"/>
                <div>{{processResult===0? '重新上传':'处理下一首' }}</div>
              </div>
            </el-button>
          </el-upload>
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
import {toolUploadRecord} from "@/api/toolbox/toolbox";
import upload from '@/assets/tool/upload.png'
import music from '@/assets/tool/music.png'
import {formatSize} from "@/utils/tool";
import {getAudioDuration} from "../../utils/audioVideoUtils";
import {ElMessage} from "element-plus";
import uploadicon from '@/assets/tool/uploadicon.png'
import uploadgray from '@/assets/tool/uploadgray.png'
import reloadIcon from '@/assets/tool/reloadIcon.png'
import {watch} from "vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const uploadLoading = ref(false)
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: "",
  },
  processingType: {
    type: String,
    default: "伴奏人声提取7.0版"
  },
  processResult: {
    type: Number,
    default: 1,
  },
  resultFile: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['changeFile', 'startProcess'])


const thisFile = ref({})

const handleStartUploadOneFile = () => {
  let item = thisFile.value.upload;
  item.uploadFile();
}


const fileChange = (file) => {
  uploadLoading.value = true;
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  getAudioDuration(file.fileUrl).then((time) => {
    if (time <= 720) {
      thisFile.value = file;
      thisFile.value.suffix = file.name.split(".").pop();
      // 上传文件
      const File = file.raw;
      const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
      // store.commit('upload/addFileList', uploadData)
      thisFile.value.upload = uploadData;
      uploadData.on('success', handleStartUploadOneFile)
      handleStartUploadOneFile()
      const query = route.query;
      if (query.orderNo) {
        router.push({
          query: {id: query.id}
        })
      }
    } else {
      ElMessage.warning('请上传少于12分钟的音频文件');
    }
  }).catch(err => {
    ElMessage.warning('获取文件时长失败！请上传标准的音频文件');
  });
}

watch(() => props.resultFile, () => {
  if (props.resultFile) {
    thisFile.value = props.resultFile;
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
    uploadLoading.value = false;
    emit('changeFile', {file: thisFile.value, sourceId: res.data.encryptedId})
    // })
    ElMessage({
      message: '上传成功',
      type: 'success',
    })
    // route.query
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

</script>

<style scoped lang="scss">
:deep(.el-upload) {
  display: block;
}

.music-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 168px;
  background-color: #14151B;
  font-size: 14px;
  color: #3D3F50;
  letter-spacing: 0.54px;
  font-weight: 400;
  border: none;
  border-radius: 16px;

  &:hover {
    background-color: rgba(52, 104, 254, 0.04);
  }

  &.is-dragover {
    background-color: rgba(52, 104, 254, 0.04);
  }

}

.info-dragg {
  border: none;
  height: auto;
  min-width: 460px;
  width: 460px;
  margin: 30px 10px;
}

.upload-info {
  margin: 6px auto;

  .info-text {
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

    .el-button-start {
      min-width: 114px;
      height: 32px;
      background-color: #30323B;
      border-radius: 16px;
      border: none;
      font-weight: 400;
      color: #E1E1E1;
      line-height: 22px;
      font-size: 14px;
    }
  }
}


.upload-demo {
  width: 380px;
  height: 168px;
  background: #14151B;
  border-radius: 16px;

  .el-icon--upload {
    margin: 14px auto 12px auto;
  }
}

.tool-bt-icon {
  width: 14px;
  transform: translateY(4px);
  margin-right: 2px
}

.msg {
  background-color: red;
}
</style>
