<template>
  <div class="cloud-info">
    <div v-if="lastCheckData?.check">
      <div class="title">{{lastCheckData.name}}</div>
      <div class="title">文件信息</div>
      <div v-show="lastCheckData.type === 1" class="info-item">
        <span>数量</span>
        <span>--</span>
      </div>
      <div class="info-item">
        <span>大小</span>
        <span>{{formatSize(lastCheckData.size)}}</span>
      </div>
      <div class="info-item">
        <span>类型</span>
        <span>{{lastCheckData.type === 1?'文件夹':lastCheckData.fileCat}}</span>
      </div>
      <div class="info-item">
        <span>创建时间</span>
        <span>{{formatDate(lastCheckData.createTime) || '--'}}</span>
      </div>
      <div class="info-item">
        <span>更新时间</span>
        <span>{{formatDate(lastCheckData.updateTime) || '--'}}</span>
      </div>
    </div>
    <div v-else>
      <div class="title">{{isAssort?'文件信息':'文件夹信息'}}</div>
      <div class="info-item">
        <span>数量</span>
        <span>{{ folderList.length + fileList.length }}</span>
      </div>
      <div class="info-item">
        <span>大小</span>
        <span>{{
            formatSize( getFileSize(fileList,folderList))
          }}</span>
      </div>
      <div class="info-item">
        <span>创建时间</span>
        <span>--</span>
      </div>
      <div class="info-item">
        <span>更新时间</span>
        <span>--</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {formatSize, formatDate} from '@/utils/tool'
import { onMounted, watch } from '@vue/runtime-core'
const props = defineProps({
  fileList: {
    type: Array,
    default: []
  },
  folderList:{
    type: Array,
    default:  []
  },
  lastCheckData: {
    type: Object,
    default:  {}
  }
})

const route = useRoute()
const isAssort = ref(false)

onMounted(() => {
  isAssort.value = route.path.includes('media/assort')
})

watch(()=>route.path, newPath => {
  isAssort.value = newPath.includes('media/assort')
})

watch(()=>props.lastCheckData, newVal => {
})

const getFileSize=(fileList,folderList)=>{
  let size=0;
  fileList.forEach(res=>{
    size+=res.size
  })
  folderList.forEach(res=>{
    size+=res.size
  })
 return size;
}

</script>

<style lang="scss" scoped>
.cloud-info{
  width: 239px;
  min-width: 239px;
  height: 100%;
  padding: 24px 8px;
  padding-top: 60px;
  font-size: 14px;
  color: #ffffff;
  border-left: 1px solid #353535;
  user-select: none;
  .title{
    padding: 8px;
  }
  .info-item{
    padding: 0 8px;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    &>span:first-child{
      opacity: .6;
    }
  }
}
</style>
