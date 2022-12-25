<template>
  <div v-loading="loading"
       element-loading-text="处理中..."
       element-loading-background="rgba(0, 0, 0, 0.6)">
    <div class="upload-box">
      <div>
        <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :accept="accept"
            multiple
            @change="fileChange"
            :show-file-list="false"
        >
          <el-icon class="el-icon--upload">
            <el-image :src="upload"></el-image>
          </el-icon>
          <div class="el-upload__text">
            <div>将文件拖到此处，或者<span style="color: #20a0ff">点击选择</span></div>
            支持文件格式：svg / webp / jpg
          </div>
        </el-upload>
      </div>
      <div class="upload-box-op">
        <div class="upload-operating">
          <el-upload
              action="#"
              :auto-upload="false"
              :accept="accept"
              multiple
              @change="fileChange"
              :show-file-list="false"
          >
            <el-button  class="el-button-reUpload" plain>
              <el-image :src="updata"></el-image>
              上传图片
            </el-button>
          </el-upload>
          <el-button class="el-button-start clear"
                     @click="fileList=[]"
          >
            <el-image :src="deleteBt"></el-image>
            清空全部
          </el-button>
          <el-button class="el-button-start download"
                     @click="allFileDown"
          >
            <el-image :src="downloadBt"></el-image>
            全部下载
          </el-button>
        </div>
        <div class="text-info">该功能为免费工具，不做订单数据留存，请注意保存。</div>
      </div>
    </div>

    <div class="file-image-list">
      <div class="file-item">
        <div class="fl1" style="text-indent: 100px;">文件名称</div>
        <div class="fl2">尺寸大小</div>
        <div class="fl3">操作</div>
      </div>
      <div v-if="fileList.length>0">
        <div class="file-image png-list" v-for="(file,index) in fileList" :key="file.raw.uid">
          <div class="fl1 fl1-name">
            <div>
              <el-image
                  :src="file.fileUrl"
                  :preview-src-list="[file.fileUrl]"
                  fit="contain" style="height: 48px;width:48px"></el-image>
            </div>
            <div class="file-name-text">
              {{file.name.split(".")[0]+'.png'}}
            </div>
          </div>
          <div class="fl2" style="display: flex;align-items: center;">
            {{file.width}}×{{file.height}}
          </div>
          <div class="fl3" style="display: flex;align-items: center;">
            <div>
              <el-button @click="startProcess(file)" type="text">下载 </el-button>
            </div>
            <div style="margin-left:20px">
              <el-button type="text"  @click="deleteImage(index)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="png-list-no" v-else>
        <svg-icon iconClass="icon_empty" :size="60"></svg-icon>
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {createUploadFile, createUploadSign} from '@/api/personnel/file'
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import upload from  '@/assets/tool/updata-file.png'
import {getImgResolutionString} from "@/utils/tool";
import {ref} from "vue";
import {downloadZip} from "../../../../../utils/ZipDownload";
import {ElMessage, ElNotification} from 'element-plus'
import updata from '@/assets/tool/upload-wt.png'
import deleteBt from '@/assets/tool/deleteBt.png'
import downloadBt from '@/assets/tool/downloadBt.png'
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
const fileChange = (file) => {
  if (fileList.value.some(res=>{return res.name===file.name})){
    ElMessage({
      message: '该文件已经上传',
      type: 'warning',
    })
    return;
  }
  file.processing=ref(true);
  file.fileUrl = URL.createObjectURL(new Blob([file.raw], {type: file.raw.type}))
  emit('changeFile', fileList.value)
  getImgResolutionString(file.fileUrl,(w,h)=>{
    file.width=w;
    file.height=h;
    fileList.value.push(file);
    imgToPng(file,file.fileUrl);
  })
  // 上传文件
  const File = file.raw;
  // const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
  // store.commit('upload/addFileList', uploadData)
}



/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const getUploadSignFun = (obj, callback, errorback) => {
  const params = {
    filename: obj.FileName,
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
  if (fileList.value.length===0){
    ElMessage.info("暂无可下载文件")
    return;
  }
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


function getImgResolution(url,back){
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


const imgToPng = (file,url) => {
  let canvas = document.createElement("canvas");
  getImgResolution(url,(w,h)=>{
    canvas.height=h;
    canvas.width=w;
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      file.pngUrl=canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
      file.processing.value=false;
      ElNotification({
        title: '处理成功',
        message: file.name.substring(0, file.name.lastIndexOf("."))+' 处理成功',
        type: 'success',
      })
    };
    img.onerror=function () {
      ElNotification({
        title: '处理失败',
        message: file.name.substring(0, file.name.lastIndexOf("."))+' 处理失败',
        type: 'error',
      })
    }
    img.src = url;
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
  height: 168px;
  background-color: #181920;
  font-size: 14px;
  color: #3D3F50;
  letter-spacing: 0.54px;
  border-radius: 16px;
  font-weight: 400;
  //border: 0.5px dashed rgba(78, 82, 98, 1);
  border: none;
  &:hover{
    background-color: rgba(52,104,254,0.04);
  }
  &.is-dragover{
    background-color: rgba(52,104,254,0.04);
  }
}


.upload-box{
  display: flex;
  .upload-demo{
    width: 380px;
    height: 168px;
    background: #14151B;
    border-radius: 16px;
    .el-icon--upload{
      margin: 19px auto 18px auto;
    }
  }
  .tool-bt-icon{
    width: 14px;
    transform: translateY(4px);
    margin-right: 2px
  }

  .upload-box-op{
    display: flex;
    margin-left: 50px;
    justify-content: center;
    flex-direction: column;
    .upload-operating {
      display: flex;
      align-items: center;
    }
    .text-info{
      margin-top: 25px;
      margin-left: 4px;
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
  }

  .el-button-reUpload{
    width: 114px;
    height: 32px;
    background: #3468FE;
    border-radius: 16px;
    color: #FFFFFF;
    border: none;
    margin-right: 10px;
  }
  .el-button-start{
    width: 114px;
    height: 32px;
    background: #30323B;
    border-radius: 16px;
    border: none;
    color: #FFFFFF;
  }
  .clear:hover{
    background-color: #F26868;
  }
  .download:hover{
    background: #303250;
  }
}

.file-image-list{
  margin-top: 60px;
  color: #9D9DA1;
  font-size: 14px;

  .file-item{
    display: flex;
    border-top: rgba(255, 255, 255, 0.05) solid 1px;
    padding-top: 30px;
    margin-bottom: 10px;
  }
  .png-list{
    background-color: #14151A;
    padding: 10px;
    border-radius: 6px;
    &:hover{
      background-color: rgba(44, 62, 80, 0.4);
      border-radius: 6px;
    }
  }
  .fl1{
    flex: 6;
  }
  .fl2{
    flex: 2;
    align-items: center;
  }
  .fl3{
    flex:2;
  }
  .file-image{
    display: flex;
    margin-top: 8px;
  }
  .fl1-name{
    display: flex;
    align-items: center;
   .file-name-text{
     margin-left: 20px;
   }
  }
}

.png-list-no{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #868890;
  border-radius: 6px;
  background-color: #14151A;
  padding: 10px;
}
</style>
