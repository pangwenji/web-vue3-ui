<template>
  <div class="main-info">
    <div class="file-list-title">
      <div class="title f1">&emsp;&emsp;&emsp;&emsp;封面</div>
      <div class="title f2">歌曲</div>
      <div class="title f3">歌手</div>
      <div class="title f4">专辑</div>
      <div class="title f5">操作</div>
    </div>
    <template v-if="tableData.length">
      <div class="file-item" v-for="(item,index) in tableData " :key="item.id">
        <div class="f1">
          <audio-wave @play="playList"  :ref="(el) => setAudioRefs(item.id,el)"  :file="item"></audio-wave>
        </div>
        <div class="item-text f2">{{ item.title || '-' }}</div>
        <div class="item-text f3">{{ item.artist || '-' }}</div>
        <div class="item-text f4">{{ item.album || '-' }}</div>
        <div class="item-text f5">
          <el-button type="text" @click="handleDownload(item)">下载</el-button>
          <el-button type="text" @click="deleteFile(index)">删除</el-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="file-item" style="justify-content: center;align-items: center;flex-direction: column;padding: 60px;color: #868890">
        <svg-icon iconClass="icon_empty" :size="60"></svg-icon>
        <div>暂无数据</div>
      </div>
    </template>
  </div>

</template>

<script setup>
import {RemoveBlobMusic} from '../utils/utils';
import AudioWave from './AudioWave'


const props = defineProps({
  tableData: {type: Array, required: true},
  policy: {type: Number, required: true},
})

const waveRef = ref(null);
const emit = defineEmits(['play', 'download'])


function handlePlay(index, row) {
  emit('play', row.file);
}

function handleDelete(index, row) {
  RemoveBlobMusic(row);
  props.tableData.splice(index, 1);
}

function handleDownload(row) {
  emit('download', row);
}

const elList={};
const setAudioRefs = (id,el) => {
  if (el){
    elList[id]=el;
  }
}
const playList = (isPlay) => {
  console.log(elList)
  if (isPlay){
    Object.values(elList).forEach(res=>{
      res.pauseAudio();
    })
  }
}
const deleteFile = (index) => {
  let tableDatum = props.tableData[index]?.id;
  console.log(tableDatum)
  if (elList[tableDatum]){
    delete elList[tableDatum]
    emit('deleteFile', index);
  }
}

</script>

<style scoped lang="scss">
.main-info {
  padding: 5px 30px 30px 30px;

  .file-list-title {
    display: flex;
    border-top: rgba(255, 255, 255, 0.05) solid 1px;
  }

  .title {
    margin-top: 20px;
    color: #9D9DA1;
    font-weight: 400;
    line-height: 20px;
  }

  .file-item {
    display: flex;
    height: 70px;
    align-items: center;
    background-color: #14151A;
    border-radius: 8px;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #868890;
  }

  .f1 {
    flex: 4
  }

  .f2 {
    flex: 1;
  }

  .f3 {
    flex: 2;
  }

  .f4 {
    flex: 1;
  }

  .f5 {
    flex: 1;
  }

  .item-text{
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }
}

</style>
