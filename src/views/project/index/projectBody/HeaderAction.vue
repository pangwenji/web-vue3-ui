<template>
  <div class="actions-content">
    <div class="actions-content-title">
        <el-breadcrumb separator-icon="ArrowRight" >
          <el-breadcrumb-item :class="{active:(index == (breadcrumbs.length - 1)) }"  v-for="(item,index) in breadcrumbs" :key="index" @click.stop="handleTo(item,index)">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="actions-content-right">
      <action-search></action-search>
      <!-- <action-date></action-date> -->
      <action-sort></action-sort>
      <action-menu></action-menu>
      <el-popover trigger="click" :disabled="projectData.status == 2" popper-class="popover-project-actions" :width="120" :teleported="true">
        <template #reference>
          <el-button type="primary"  round class="actions-button is-custom" style="height:32px;" :class="{disabled: projectData.status == 2 }">
            上传/新建
          </el-button>
        </template>
        <div>
          <div class="actions-menu-title">上传</div>
          <div class="actions-menu-item" @click.stop="handleFiles('File')">
            <svg-icon className="actions-menu-icon" iconClass="icon_file-c" :size="20"></svg-icon>
            文件
          </div>
          <div class="actions-menu-item" @click.stop="handleFiles('Files')">
            <svg-icon className="actions-menu-icon" iconClass="icon_document-c" :size="20"></svg-icon>
            文件夹
          </div>
          <div class="actions-menu-title">新建</div>
          <div class="actions-menu-item" @click.stop="handleOpenDialog('Folder')">
            <svg-icon className="actions-menu-icon" iconClass="icon_document2-c" :size="20"></svg-icon>
            文件夹
          </div>
          <div class="actions-menu-item" @click.stop="handleOpenDialog('Collection')">
            <svg-icon className="actions-menu-icon" iconClass="icon_document3-c" :size="20"></svg-icon>
            收集文件
          </div>
          <div class="actions-menu-item" @click.stop="handleOpenDialog('file','新建文档','.docx')">
            <svg-icon className="actions-menu-icon" iconClass="icon_doc-c" :size="20"></svg-icon>
            文档
          </div>
          <div class="actions-menu-item" @click.stop="handleOpenDialog('file','新建表格','.xlsx')">
            <svg-icon className="actions-menu-icon" iconClass="icon_excel-c" :size="20"></svg-icon>
            表格
          </div>
          <div class="actions-menu-item" @click.stop="handleOpenDialog('file','新建演示','.pptx')">
            <svg-icon className="actions-menu-icon" iconClass="icon_ppt-c" :size="20"></svg-icon>
            演示
          </div>
        </div>
      </el-popover >
    </div>
  </div>

  <input type="file" ref="uploadFile" multiple :webkitdirectory="false" hidden @change="handleUploadFile" />
  <input type="file" ref="uploadFiles" multiple :webkitdirectory="true" hidden @change="handleUploadFiles" />
  <!-- 新建文件或文件夹 -->
  <el-dialog v-model="increateDialog" top="0vh" @opened="onDialogOpened" custom-class="dialog-center"
    :append-to-body="true" :title="increateTitle" width="30%" :before-close="onBeforeCloseFolder">
    <el-form :model="increateFolder" :rules="increateRules" ref="increateRef">
      <el-form-item prop="name">
        <el-input v-model="increateFolder.name" class="is-custom" ref="increateInput" @keyup.enter.native="handleSubmit" placeholder="请输入文件夹名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onBeforeCloseFolder" class="is-custom">取消</el-button>
        <el-button type="primary" :loading="loadingState" class="is-custom" @click="handleSubmit" style="background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%); border: none;">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <CreateCollectionDialog @onSubmitSuccess="handleOpenShare" v-model:visible="collectionDialog"></CreateCollectionDialog>
<!-- 创建收集 -->
</template>
<script setup>
import ActionMenu from "./ActionMenu.vue";
import ActionSort from "./ActionSort.vue";
import ActionDate from "./ActionDate.vue";
import ActionSearch from "./ActionSearch.vue"
import CreateCollectionDialog from "../components/CreateCollectionDialog"
import { useStore } from "vuex";
import { computed, ref,reactive,defineExpose } from "vue";
import { ElMessage } from "element-plus";
const store = useStore();
const uploadFile = ref();
const uploadFiles = ref();
const increateInput = ref();
const increateTitle = ref('新建文件夹');
const increateDialog = ref(false);
const collectionDialog = ref(false);
const emit = defineEmits(['clickBreadcrumb','onOpenShare','onUploadFile','onUploadFiles'])
/* 创建文件夹的表单 */
const increateRef = ref();
const increateRules = reactive({
  name: [{ required: true, message: "请填写文件名称", trigger: "blur" }],
});
const increateFolder = reactive({
  name: "新建文件夹",
  suffix: ""
});

const projectData = computed(() => {
  return store.state.project.projectData;
});
const breadcrumbs = computed(()=>{
  return store.state.project.breadcrumbs;
})
const lastBreadcrumbs = computed(()=>{
  const length = breadcrumbs.value.length;
  return length > 0?breadcrumbs.value[length - 1] : {};
})
/* 打开弹框 */
const handleOpenDialog = (e,title,suffix) => {
  switch (e) {
    case "Folder":
      increateTitle.value = '新建文件夹';
      increateFolder.name = '新建文件夹';
      increateFolder.suffix = '';
      increateDialog.value = true;
      break;
    case "Collection":
      collectionDialog.value = true;
      break;
    case "file":
      increateTitle.value = title;
      increateFolder.name = title;
      increateFolder.suffix = suffix;
      increateDialog.value = true;
      break;
  }
};
// 跳转
const handleTo = (item,index)=>{
  store.commit('project/SET_FOLDER_INFO', item);
  if(lastBreadcrumbs.value.parentId == item.parentId){
    return
  }
  emit('clickBreadcrumb',item)
}

const handleOpenShare = (res)=>{
  const qrcode = res.data.qrcode;
  const url = res.data.url;
  const info = res.data.info;
  emit("onOpenShare",{qrcode,url,info})
}


/* 弹框打开的回调 */
// 文件夹新建
const onDialogOpened = () => {
  increateInput.value.select();
};
/* 弹框关闭之前的回调 */
const onBeforeCloseFolder = (deno) => {
  increateRef.value.resetFields();
  if (typeof deno == "function") {
    deno();
  } else {
    increateDialog.value = false;
  }
};


const loadingState = ref(false);
// 提交表单
const handleSubmit = (e) => {
  increateRef.value.validate(vali => {
    if (vali) {
      loadingState.value = true;
      const name = increateFolder.name;
      const suffix = increateFolder.suffix;
      const projectId = projectData.value.id;
      const parentId = lastBreadcrumbs.value.parentId;
      if(!suffix){
        store.dispatch('project/handleCreateDirectory',{projectId,parentId,name}).then(res=>{
          loadingState.value = false;
          ElMessage.success('创建成功')
          onBeforeCloseFolder()
        }).catch(err=>{
          loadingState.value = false;
        })
      }else{
        store.dispatch('project/handleCreateFiles',{projectId,directoryId:parentId,fileName:name + suffix}).then(res=>{
          loadingState.value = false;
          ElMessage.success('创建成功')
          onBeforeCloseFolder()
        }).catch(err=>{
          loadingState.value = false;
        })
      }
    }
  })
}


/* 上传文件夹/文件夹 */
const handleFiles = (e) => {
  switch (e) {
    case "File":
      uploadFile.value.click();
      break;
    case "Files":
      uploadFiles.value.click();
      break;
  }
};



/* 上传文件 */
const handleUploadFile = (e) => {
  emit('onUploadFile',e);
  uploadFile.value.value = "";
};
/* 上传文件夹 */
const handleUploadFiles = (e) => {
  emit('onUploadFiles',e);
  uploadFiles.value.value = "";
};


defineExpose({
  handleFiles,
  handleOpenDialog
})

</script>
<style lang="scss">
  .el-popover.popover-project-actions{
    padding: 0;
    .actions-menu-title{
        font-size: 12px;
        color: #9B9EAE ;
        padding: 6px 10px;
        pointer-events: none;
        user-select: none;
    }
    .actions-menu-item{
      font-size: 12px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .actions-menu-icon{
        margin-right: 10px;
      }
      &:hover{
        background: #f4f4f5;
      }
    }
  }

</style>
<style scoped lang="scss">
.actions-content {
  background: #292A30 ;
  :deep(.el-button+.el-button) {
    margin-left: 12px;
  }
  &:deep(.el-breadcrumb__item){
    .el-breadcrumb__inner{
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &.active{
      .el-breadcrumb__inner{
        color: white;
        cursor: default;
      }
    }
    .el-breadcrumb__inner{
      cursor: pointer;
      color: #A0A0A0;
      line-height: 20px;
      font-size: 14px;
      &:hover{
        color: white;
      }
    }
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

  &-title {
    font-size: 14px;
  }

  &-right {
    display: flex;
  }


  .actions-content-right{
    flex: none;
    height: 100%;
    display: flex;
    align-items: center;
    .actions-hover{
      min-width:30px;
      height: 100%;
      color: rgba($color: #ffffff, $alpha: 0.7);
      font-size: 14px;
      margin-right: 12px;
      height: 30px;
      display: flex;
      border-radius: 20px;
      background-color: #0C0D11;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      cursor: pointer;
      &:hover{
          // background: rgba($color: #ffffff, $alpha: .1);
        color: #ffffff;
      }
    }
    .actions-button{
      background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
      border: none;
      &.disabled{
        background: #979797 !important;
        cursor: no-drop;
      }
    }
  }

}



</style>
