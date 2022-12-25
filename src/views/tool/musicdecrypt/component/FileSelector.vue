<template>
  <el-upload :auto-upload="false"
             :on-change="addFile"
             :show-file-list="false"
             :accept="accept"
             @dragenter="dragenterFile"
             action="#" drag multiple>
    <div style="height: 168px;"  @click="setClickAccept">
      <i class="el-icon-upload" />
      <el-icon class="el-icon--upload">
        <el-image :src="upload"></el-image>
      </el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或者
        <span style="color: #3468FE;">点击选择</span>
        <div>支持文件格式：mgg / .qmcflac / .ncm / .kgm</div>
        <div>每首限不超过12分钟</div>
      </div>
    </div>
  </el-upload>
</template>

<script setup>
// import { spawn, Worker, Pool } from 'threads';
import { Decrypt } from '../decrypt';
import { DecryptQueue } from '../utils/utils';
import { storage } from '../utils/storage';
import upload from '@/assets/tool/updata-file.png'
import {onMounted} from "vue";
import {ElMessage} from "element-plus";
// import * as worker from '../utils/worker'
let accept=ref("")
const task_all= ref(0),
    task_finished= ref(0),
    queue= ref(new DecryptQueue()), // for http or file protocol
    parallel=ref(false)

onMounted(()=>{
  // if (window.Worker && window.location.protocol !== 'file:' && process.env.NODE_ENV === 'production') {
  //   console.log('Using Worker Pool');
  //   queue.value = Pool( () => spawn(import('@/views/tool/musicdecrypt/utils/worker')), navigator.hardwareConcurrency || 1);
  //   parallel.value = true;
  // } else {
  //   console.log('Using Queue in Main Thread');
  // }
})
function progress_string() {
  return `${task_finished.value} / ${task_all.value}`;
}

const emit=defineEmits(['success','error'])
async function addFile(file) {
  var suffix = '.'+file.name.split('.').pop();//.txt
  if (!['.mflac','.mgg','.qmcflac','.ncm','.kgm','.mggl','.kgm','.kwm'].includes(suffix)){
    setTimeout(()=>{
      ElMessage.info(`暂不支持处理【${suffix}】文件类型`)
    },0)
    return;
  }
  task_all.value++;
  queue.value.queue(async (dec = Decrypt) => {
    console.log('start handling', file.name);
    try {
      emit('success', await dec(file, await storage.getAll()));
    } catch (e) {
      console.error(e);
      emit('error', e, file.name);
    } finally {
      task_finished.value++;
    }
  });
}

// computed: {
//   progress_value() {
//     return this.task_all ? (this.task_finished / this.task_all) * 100 : 0;
//   },
//   progress_show() {
//     return this.task_all !== this.task_finished;
//   }


const setClickAccept = () => {
  accept.value='.mflac,.mgg,.qmcflac,.ncm,.kgm,.mggl,.kgm,.kwm'
}

const dragenterFile = () => {
  accept.value='';
}

</script>

<style lang="scss" scoped>
:deep(.el-upload) {
  display: block;
}

:deep(.el-upload-dragger) {
  width: 380px;
  height: 168px;
  //background-color: rgba(52,104,254,0.04);
  background-color: #14151B;
  font-size: 14px;
  color: #3D3F50;
  letter-spacing: 0.54px;
  font-weight: 400;
  border: none;
  //border: 0.5px dashed rgba(78, 82, 98, 1);
  &:hover{
    background-color: rgba(52,104,254,0.04);
  }
  &.is-dragover{
    background-color: rgba(52,104,254,0.04);
  }
}
:deep(.el-icon--upload){
  margin: 19px;
  font-size: 50px;
}
</style>
