<template>
  <div v-loading="loading"
       element-loading-text="处理中..."
       element-loading-background="rgba(0, 0, 0, 0.6)">
    <div v-if="fileList.length===0">
      <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :accept="accept"
          multiple
          @click.stop="fileUplodClick"
          @change="fileChange"
          :show-file-list="false"
      >
        <el-icon class="el-icon--upload">
          <el-image :src="upload"></el-image>
        </el-icon>
        <div class="el-upload__text">
          支持文件格式：svg / webp / jpg
        </div>
      </el-upload>
    </div>
    <div v-else class="el-upload-dragger" style="border: none;background-color: #24262F;height: auto;">
      <div class="upload-info">
        <div class="upload-main">
          <div style="display: flex;justify-content: center" v-for="(file,index) in fileList" :key="file.raw.uid">
            <div class="info-data">
              <div class="img-box-show">
                <div class="top-info">
                  <div class="top-delete">
                    {{file.width}}×{{file.height}}
                  </div>
                  <div class="top-delete" @click="deleteImage(index)"><el-icon><DeleteFilled /></el-icon></div>
                </div>

                <div>
                  <el-image
                      :src="file.fileUrl"
                      :preview-src-list="[file.fileUrl]"
                      fit="contain" style="height: 200px;width:200px"></el-image>
                </div>
                <div class="info-text">
                  <el-button
                      :loading="file.processing"
                      class="download-file-item"
                      @click="startProcess(file)">下载PNG </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="upload-operating">
          <el-upload
              :auto-upload="false"
              :accept="accept"
              multiple
              @change="fileChange"
              :show-file-list="false"
          >
            <el-button class="el-button-reUpload" plain>继续上传</el-button>
          </el-upload>

          <el-button class="el-button-start"
                     @click="allFileDown"
                     >
            全部下载
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {createUploadFile, createUploadSign} from '@/api/personnel/file'
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import upload from '@/assets/tool/upload.png'
// import {getImgResolutionString} from "@/utils/tool";
import {ref} from "vue";
import {downloadZip} from "../../../../../utils/ZipDownload";
import { ElMessage } from 'element-plus'
const store = useStore();
const route = useRoute()
//打印传递过来的数据
const props = defineProps({
  accept: {
    type: String,
    default: ".jpg,.png,.bmp,.jpeg",
  },
  bigSize:{
    type:Number,
    default: 2,
  }
})
const emit = defineEmits(['changeFile'])
let temBigSize=ref(2);
const fileList = ref([])
const bigFile=ref({})



window.fileChange=function (file) {
  // ElMessage.success("文件处理中5")
  if (fileList.value.some(res=>{return res.name===file.name})){
    ElMessage({
      message: '该文件已经上传',
      type: 'warning',
    })
    return;
  }
  // window.webkit.messageHandlers.log.postMessage({'msg':'文件进入处理方法'})
  // ElMessage.success("文件进入处理方法")
  file.processing=ref(true);
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw?.type}))
  // window.webkit.messageHandlers.log.postMessage({'msg':'流文件处理'})
  emit('changeFile', fileList.value)
  getImgResolutionString(file.fileUrl,(w,h)=>{
    file.width=w;
    file.height=h;
    fileList.value.push(file);
    imgToPng(file,file.fileUrl);
  })
  // ElMessage.success("文件处理成功")
  // 上传文件
  const File = file.raw;
  // const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  // store.commit('upload/addFileList', uploadData)
}
window.getImgResolutionString=function (url,back){
  // window.webkit.messageHandlers.log.postMessage({'msg':'进入对象1'})
  let imgWidth="0"
  let imgHeight="0"
  let image = new Image();
  image.src = url
  // 如果有缓存，读缓存
  if(image.complete){
    imgWidth = image.width;  // 图片宽度
    imgHeight = image.height; // 图片高度
  }else { //否则加载图片
    image.onload = function() {
      imgWidth = image.width;   // 图片宽度
      imgHeight = image.height;  // 图片高度
      image.onload = null;   // 避免重复加载
      back(imgWidth,imgHeight)
      // window.webkit.messageHandlers.log.postMessage({'msg':'图片加载成功'})
    };
    image.onerror=function (){
      // window.webkit.messageHandlers.log.postMessage({'msg':'图片加载异常'})
    }
  }
}

onMounted(() => {
  window.responseFile=responseFile;
})

function responseFile (data){
  let filex=null;
  // ElMessage.success("回调成功!!!!")
  try {
    let dataJson=data;
    filex = new File([dataJson.data], dataJson.fileName, {
      type: dataJson.fileType
    });
    fileChange(filex)
    // ElMessage.success("文件处理完成!!!!")
  } catch (e) {
    return {msg: e.message,data:data}
  }
  return {msg: 'success'}
}

window.test12=function(){
  ElMessage.success("测试成功!!!!2")
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
    emit('changeFile', fileList.value)
    callback(res.data)
  }).catch(err => {
    errorback(err)

  })
}
function triggerDownload(imgURI,fileName) {
  var evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  });

  var a = document.createElement('a');
  a.setAttribute('download', fileName);
  a.setAttribute('href', imgURI);
  a.setAttribute('target', 'blank');
  a.dispatchEvent(evt);
}

const loading = ref(false)
const processResult = ref(false)
/**
 * 开始处理
 */
const startProcess = (file) => {
  temBigSize.value=props.bigSize
    if (!file.processing.value)
      triggerDownload(file.pngUrl,Date.now()+file.name.split(".")[0]+'.png');
}


const deleteImage = (index) => {
  fileList.value.splice(index,1)
}


const allFileDown = () => {
  // emit('allFileDown',fileList.value)
  const newFileList=[]
  for (let i = 0; i < fileList.value.length; i++) {
      const file=fileList.value[i]
      if (file.processing.value){
        // 还没处理成功
        ElMessage({
          message: '请耐心等待全部处理完成！',
          type: 'warning',
        })
        return;
      }else {
        newFileList.push({"name":Date.now()+file.name.split(".")[0]+'.png',"url":file.pngUrl})
      }
  }
  downloadZip(Date.now()+"图片转png.zip",newFileList)
}


window.getImgResolution=(url,back)=>{
  let image = new Image();
  image.src = url
  // 如果有缓存，读缓存
  if(image.complete){
    back(image.width, image.height)
  }else { //否则加载图片
    image.onload = function() {
      image.onload = null;   // 避免重复加载
      back(image.width, image.height)
    };
  }
}

window.imgToPng = (file,url) => {
  let canvas = document.createElement("canvas");
  getImgResolution(url,(w,h)=>{
    canvas.height=h;
    canvas.width=w;
    let ctx = canvas.getContext('2d');
    // let DOMURL = window.URL || window.webkitURL || window;
    let img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      // DOMURL.revokeObjectURL(url);
      file.pngUrl=canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
      file.processing.value=false;
    };
    img.src = url;
  });
}

const fileUplodClick = () => {
  // if (route.query.platform) {
  // ElMessage.success("点击触发")
    window.webkit.messageHandlers.getFileListener.postMessage({'msg':'hello'})
  //   return;
  // }
}


window.createFile=function (url) {
  let fileName="test.jpg";
  return new Promise((resolve, reject) => {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'image/png');
    xhr.responseType = "blob";
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      blob = xhr.response;
      let file= new File([blob], fileName, { type: 'image/png' });
      // 返回结果
      resolve(file);
    };
    xhr.onerror = (e) => {
      reject(e)
    };
    // 发送
    xhr.send();
  });
}


defineExpose({
  loading,
  processResult,
  bigFile,
  fileList
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
  .upload-main{
    display: flex;
    margin: 30px auto;
    justify-content: start;
    flex-wrap: wrap;
  }
  .info-data {
    text-align: center;

  }

  .info-text {
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
    .download-file-item{
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #0459FF 0%, #5726DD 100%);
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      color: white;
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
      margin-right: 30px;
    }
  }
  .img-box-show{
    max-height: 300px;
    background-color: #1c1d24;
    position: relative;
    padding: 10px;
    margin: 10px;
    border-radius: 9px;
    &:hover{
      background-color: #3d3f50;
    }
    .info-text-title {
      font-size: 15px;
      color: white;
      background-color: #9094A6;
      position: absolute;
      padding: 10px;
      left: 0;
      top: 0;
      border-top-left-radius: 9px;
      border-bottom-right-radius: 10px;
      z-index: 9;
    }
    .top-info{
      position: absolute;
      z-index: 99;
      right: 0;
      top: 0;
      color: #adb5d2;
      display: flex;
      margin-top: 5px;

    }
    .top-delete{
    //  position: absolute;
    //  z-index: 99;
    //  right: 0;
    //  top: 0;
      border-radius: 5px;
      margin-left: 6px;
      padding: 6px;
      background: rgba(0, 0, 0, 0.6);
    }
  }
}

</style>
