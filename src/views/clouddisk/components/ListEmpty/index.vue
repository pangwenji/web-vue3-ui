<template>
  <div class="list-empty" ref="fileArea">
    <img width="76" height="76" src="@/assets/icons/icon_empty@2x.png" alt="">
    <!-- <div class="line line1">将文件拖拽到这里</div> -->
    <div v-if="keyWord" class="line line2">暂无搜索结果</div>
    <div v-if="!keyWord" class="line line2">支持图片、视频、音频、文档等多类型文件</div>
    <div v-if="!keyWord" class="line3">
      <el-button color="#2A2C36" round @click="handleUploadFiles">上传文件</el-button>
      <el-button v-if="showUpFloder" color="#2A2C36" round @click="handleUploadFolder">上传文件夹</el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from '@vue/runtime-core';
import UploadFile from "@/utils/uploadFile.js";

const props = defineProps({
  keyWord: {
    type: String,
    default: ''
  },
  showUpFloder: {
    type: Boolean,
    default: true
  }
})

const fileArea = ref()
const filesList = ref([])

onMounted(() => {
  // fileArea.value.addEventListener('drop', uploadFunc, false)
  // fileArea.value.addEventListener('dragover', uploadFunc, false)
})

function uploadFunc(event) {
  event.preventDefault()

  let files = [];
  if (event.type === 'drop') {
    let fileList = event.dataTransfer.files;
    let len = fileList.length;
   
    for (let i = 0; i < len; i++) {
      files[i] = fileList[i];
    }
   
    if (files.length) {
      let items = event.dataTransfer.items;
      handleDrop(items)
      // if (items && items.length && items[0].webkitGetAsEntry != null) {
      //   addFilesItems(items);
      // }
    }
  }
}

function addFilesItems(items) {
  return function() {
    var ret = []
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      var entry
      console.log(item.webkitGetAsEntry)
      if (item.webkitGetAsEntry && (entry = item.webkitGetAsEntry())) {
        if (entry.isFile) {
          // 把文件对象放到结果数组中  这里的addFile方法要单独写 我没有写上 这个不是重点
          ret.push(addFile(item.getAsFiles()))
        } else if (entry.isDirectory) {
          ret.push(addFilesFormDirectory(entry, entry.name))
        }
      }
    }
  }()
}

// 读取文件夹下的文件
function addFilesFormDirectory(directory, path) {
  const dirReader = directory.createReader();

  const readEntries = function readEntries() {
    return dirReader.readEntries(function(entries) {
      entries.forEach(function(entry){
        console.log('directory---', directory);
        if (entry.isFile) {
          // 如果是文件
          entry.file(function(file){

            file.fullPath = path + '/' + file.name
            // 那么暴露出去的就是 '文件夹/q.jpg' 这种形式 
            return addFile(file)
          })
          return addFile(file)
        } else if (entry.isDirectory) {
          // 递归处理
          addFilesFormDirectory(entry, path + '/' + entry.name)
        }
      })
    })
  }
  return readEntries()
}

function addFile(file) {
  console.log('file--'. file);
}


const emit = defineEmits(['onUploadFiles', 'onUploadFolder'])
function handleUploadFiles() {
  emit('onUploadFiles')
}

function handleUploadFolder() {
  emit('onUploadFolder')
}


// 文件移入
// const handleDragOver = (e,show)=>{
//   if(CollectDialogRef.value.uploadState == 'uploading'){
//     return
//   }
//   for(var item of e.dataTransfer.types){
//     if(item == 'Files'){
//       e.preventDefault()
//       show()
//       return
//     }
//   }
// }

// 文件放入
const uploadList = ref([])
const handleDrop = (files)=>{
  // if(CollectDialogRef.value.uploadState == 'complete'){
  //   uploadList.value = [];
  // }
  // CollectDialogRef.value.uploadState = 'awaiting'
  console.log('files--', files);
  for(const entry of files){
    const webkitGetAsEntry = entry.webkitGetAsEntry ? entry.webkitGetAsEntry() : entry;
    if(webkitGetAsEntry.isFile){
      webkitGetAsEntry.file(async File=>{
        const path = webkitGetAsEntry.fullPath.substring(1);
        File.path = path;
        const uploadData = new UploadFile({File});
        uploadList.value.push(uploadData);
      },err=>{console.log('文件错误',err)})
    }else{
      const reader = webkitGetAsEntry.createReader();
      reader.readEntries(entries=>{
        if(entries.length > 0){
          handleDrop(entries);
        }
      },err=>{console.log('目录错误',err)})
    }
  }
}


</script>
<style lang="scss" scoped>
.list-empty{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  background-color: #0A0B0D;
  .line{
    height: 24px;
    line-height: 24px;
    color: #6F7280;
  }
  .line1{
    font-size: 12px;
    margin-top: 12px;
  }
  .line2{
    margin-top: 16px;
  }
  .line3{
    margin-top: 20px;
    .el-button{
      width: 112px;
      height: 42px;
      border-radius: 21px;
      font-weight: 600;
      color: #FFFFFF;
    }
    .el-button{
      margin: 0 14px;
    }
  }
}
</style>