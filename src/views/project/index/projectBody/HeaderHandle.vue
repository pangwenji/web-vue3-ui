<template>
  <div class="actions-content">
    <div class="actions-content-title">
      <span class="check-box" :class="{check:checkAll}" @click="handleCheckAll">
        <el-icon class="icon">
            <Check />
        </el-icon>
      </span>
      <span>全选</span>
    </div>
    <div class="actions-content-right">
      <div style="margin-right: 32px;">
        <span style="margin: 0 12px">已选中 {{selectFiles.length}} 项</span>
        <span>共计 {{formatSize(size)}}</span>
      </div>
      <!-- <el-button type="default">用所选文件新建文件夹</el-button> -->
      <el-button type="warning" color="#40424d" :disabled="!authRule('download') || isCheckFolder" class="is-custom" title="批量下载" round @click="handleDownloadFiles">
        下载
        <!-- <el-icon>
          <Download />
        </el-icon> -->
      </el-button>
      <el-button type="warning" color="#40424d" :disabled="!authRule('copy')" class="is-custom" title="复制到" round @click="emit('onCopy',selectFiles)">
        复制到
        <!-- <el-icon>
          <DocumentCopy />
        </el-icon> -->
      </el-button>
      <el-button type="warning" color="#40424d" :disabled="!authRule('copy')" class="is-custom" title="移动到" round @click="emit('onMove',selectFiles)">
        移动到
        <!-- <el-icon>
          <Promotion />
        </el-icon> -->
      </el-button>
      <el-button type="warning" color="#40424d" :disabled="!authRule('share')" class="is-custom" title="分享" round @click="handleShare">
        分享
        <!-- <el-icon>
          <Promotion />
        </el-icon> -->
      </el-button>

      <el-button type="warning" color="#40424d" :disabled="!authRule('delete')" :style="{ color: !authRule('delete')?'#FFFFFF':'#CB3B46' }" class="is-custom" title="删除" round  @click="handleDelete">
        删除
        <!-- <el-icon>
          <Delete />
        </el-icon> -->
      </el-button>
      <!-- <el-button type="primary" class="is-custom" round @click="handleShare">分享</el-button> -->
    </div>
  </div>
</template>
<script setup>
import { formatSize } from '@/utils/tool.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { deleteFile } from '@/api/project/files.js'
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
const emit = defineEmits(["checkAll", "cancel","share",'onCopy','onMove','onDownload']);
const store = useStore();
const prop = defineProps({
  selectFiles:{
    type:Array,
    default(){
      return [];
    }
  }
})

const searchKey = computed(() => {
  return store.state.project.searchKey;
});

const fileData = computed(()=>{
    if (!searchKey.value) { return store.state.project.fileList || [] }
    const listData = store.state.project.fileList.filter(item => {
        return item.name.indexOf(searchKey.value) > -1;
    });
    return listData || [];
})
const foldData = computed(()=>{
    if (!searchKey.value) { return store.state.project.folderList || [] }
    const listData = store.state.project.folderList.filter(item => {
        return item.name.indexOf(searchKey.value) > -1;
    });
    return listData || [];
})
const projectData = computed(()=>{
  return store.state.project.projectData
})

const checkAll = computed(()=>{
  const len = fileData.value.length + foldData.value.length
  if(prop.selectFiles.length >= len){
    return true;
  }else{
    return false;
  }
})

const isCheckFolder = computed(()=>{
  let flag = false
  for (let index = 0; index < foldData.value.length; index++) {
    if (foldData.value[index].check) {
      flag = true
      break
    }
  }
  return flag
})

const size = computed(()=>{
  return prop.selectFiles.reduce((total,item)=>{
    return total + item.size;
  },0)
})

  const authRule = (e) => {
      if(!projectData.value.permissions){
          return
      }
      if (projectData.value.currRoleId == 1) { // 所有者
          return true;
      } else if (projectData.value.currRoleId == 2) { // 管理员
          return projectData.value.permissions.adminPermissions.indexOf(e) > -1;
      } else { // 成员
          return projectData.value.permissions.memberPermissions.indexOf(e) > -1;
      }
  }

const handleCheckAll = () => {
  if(checkAll.value){
    emit("cancel");
  }else{
    emit("checkAll");
  }
};
// 分享
const handleShare = ()=>{
  emit("share");
}
// 下载
const handleDownloadFiles = ()=>{
      if(prop.selectFiles.length == 0){
        ElMessage.error('请先选择需要下载的文件')
        return
    }
    for(var item of prop.selectFiles){
        if(item.type == 1){
            ElMessage.error('文件夹无法下载')
            return
        }
    }
    emit("onDownload",prop.selectFiles);
}

// 删除
const handleDelete = ()=>{
  const ids = prop.selectFiles.map(item=>item.id);
  const text = `确定要批量删除选中的文件吗? 删除后,文件将被移至回收站!`;
  const title = `批量删除`
  ElMessageBox.confirm(text, title, {
      customClass: 'messageBox-custom-warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
      showClose:true,
      center: true,
      beforeClose: (action, instance, done)=>{
          if(action === 'confirm'){
              instance.confirmButtonLoading = true
              deleteFile({id: ids.join(',')}).then( res=>{
                  const recycleCount = store.state.project.projectData.recycleCount +  ids.length;
                  store.state.project.projectData.recycleCount = recycleCount;
                  store.commit('project/SET_PROJECT_DATA', Object.assign({},store.state.project.projectData));
                  const fileList = fileData.value.filter(item=> ids.indexOf(item.id) == -1 );
                  const folderList = foldData.value.filter(item=> ids.indexOf(item.id) == -1 );
                  store.commit('project/SET_FILE_LIST',fileList);
                  store.commit('project/SET_FOLDER_LIST',folderList);
                  done();
              }).catch(err=>{
                  done();
              })
          }else{
              if(instance.confirmButtonLoading){ return }
              done()
          }
      }
  }).then(()=>{}).catch(err=>{})
}
// 复制
const handleCopy = ()=>{

}

defineExpose({
  handleDelete
})


</script>
<style scoped lang="scss">
.actions-content {
  :deep(.el-button+.el-button) {
    margin-left: 6px;
  }
}

.actions-content {
  height: 60px;
  width: 100%;
  flex-shrink: 0;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #292A30 ;
  &-title {
      flex: none;
      color: #909399;
      font-size: 14px;
      display: flex;
      align-items: center;
    .check-box{
      display: inline-block;
      margin-right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 30px;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.5);
      cursor: pointer;
      color: white;
      .icon{
          display: none;
      }
      &:hover{
        border-color: white;
      }
      &.check{
        border-color: #3468FE;
        background: #3468FE;
        .icon{
          display: inline-block;
          font-size: 20px;
        }
        &:hover{
          border-color: #3468FE;
        }
      }
    }
  }

  &-right {
    display: flex;
    align-items: center;
    span{
      color: #909399;
      font-size: 14px;
    }
  }
}

.action-file-item {
  padding: 5px 10px;
  position: relative;
  cursor: pointer;
  position: relative;

  span {
    margin-left: 10px;
  }

  &:hover {
    background: #ecf5ff;
    color: #409eff;
  }
}
</style>
