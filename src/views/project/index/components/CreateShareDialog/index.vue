<template>
  <!-- 创建分享 -->
  <el-dialog v-model="visible" top="0vh" custom-class=" dialog-center" :append-to-body="true" :title="type == 'create'?'创建分享':'更新分享'"
    width="460px" :before-close="onBeforeClose">
    <el-form :model="formData" :rules="formRules" ref="formDataRef" class="collection-form-body">
      <el-form-item prop="name">
        <el-input maxlength="35" class="is-custom" v-model="formData.name" placeholder="请输入分享标题" />
      </el-form-item>
      <!-- <el-form-item label="链接开关" prop="status" v-if="formData.id">
        <div class="form-item-custom">
          <span></span>
          <el-switch :active-value="1" :inactive-value="3" v-model="formData.status" />
        </div>
      </el-form-item> -->
      <el-form-item label="访问密码" prop="passwordLock">
        <div class="form-item-custom">
          <span></span>
          <el-switch v-model="formData.passwordLock" active-color="#3A36DB" :inactive-value="0" :active-value="1" />
        </div>
      </el-form-item>
      <el-form-item label="访问期限" prop="period">
        <div class="form-item-custom">
          <span></span>
          <template v-if="commandType">
            <div>
              <el-input-number :controls="false" :precision="0" v-model="formData.period" :min="0" :max="10000" controls-position="right" size="small"
                ref="inputNumberPeriod" @blur="handleBlur" />
              <span style="margin-left: 10px">天</span>
            </div>
          </template>
          <template v-else>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="dropdown-link">
                {{ formData.period ? `${formData.period}天` : '永久有效' }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="0">永久有效</el-dropdown-item>
                  <el-dropdown-item :command="15">15天</el-dropdown-item>
                  <el-dropdown-item :command="7">7天</el-dropdown-item>
                  <el-dropdown-item :command="1">1天</el-dropdown-item>
                  <el-dropdown-item :command="-1">自定义</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </el-form-item>
      <el-form-item label="允许评论" prop="allowComments">
        <div class="form-item-custom">
          <span></span>
          <el-switch v-model="formData.allowComments" active-color="#3A36DB" :inactive-value="0" :active-value="1" />
        </div>
      </el-form-item>
      <el-form-item label="允许下载和转存"  v-if="!authRule('download')">
        <div class="form-item-custom">
          <span></span>
          <el-switch v-model="formData.saveTo" active-color="#3A36DB" :inactive-value="0" :active-value="1" />
        </div>
      </el-form-item>
      <el-form-item label="防录屏" prop="antiScreenRecording" v-if="formData.fileType == 'video'">
        <div class="form-item-custom">
          <span></span>
          <el-switch v-model="formData.antiScreenRecording" active-color="#3A36DB" :inactive-value="0" :active-value="1" />
        </div>
      </el-form-item>
      <!-- <el-form-item label="允许编辑在线文档" prop="edit">
        <div class="form-item-custom">
          <span></span>
          <el-switch v-model="formData.antiScreenRecording" active-color="#3A36DB" :inactive-value="0" :active-value="1" />
        </div>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onBeforeClose" class="is-custom">取消</el-button>
        <el-button type="primary" class="is-custom" :loading="loadingState" @click="handleSubmit" style="background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%); border: none;">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { computed, defineComponent, nextTick } from 'vue'
import { createShare , updateProjectShare} from "@/api/project/files.js"
import { useStore } from 'vuex';
import { ElMessage } from "element-plus"
import { formatSize } from "@/utils/tool.js"
const emits = ['onSubmitSuccess']
const props = {
  type:{
    type:String,
    default:'create'
  }
}
const setup = (prop,{emit})=>{
    const store = useStore();
    const visible = ref(false);
    const loadingState = ref(false);
    const formDataRef = ref();
    const inputNumberPeriod= ref();
    const commandType = ref(null);
    const formRules = reactive({
        name: [{ required: true, message: "请填写分享标题", trigger: "blur" }],
    });
    const formData = reactive({
        id:null,
        projectId:null,
        fileIds: [],
        name: "",
        passwordLock: 0,
        period: 0,
        saveTo: 1,
        allowComments: 1,
        antiScreenRecording: 1,
        fileType: '',
    });

    const projectData = computed(()=>{
      return store.state.project.projectData;
    })

    const authRule = (e)=>{
      if(projectData.value.permissions){
        return
      }
      if(projectData.value.currRoleId == 1){ // 所有者
        return true;
      }else if(projectData.value.currRoleId == 2){ // 管理员
        return projectData.value.permissions.adminPermissions.indexOf(e) > -1;
      }else{ // 成员
        return projectData.value.permissions.memberPermissions.indexOf(e) > -1;
      }
    }
    const handleCommand = (e)=>{
      if(e >= 0){
        formData.period = e;
      }else{
        formData.period = 0;
        commandType.value = 1;
        nextTick(()=>{
          inputNumberPeriod.value.focus();
        })
      }
    }
    // 数字输入框失去焦点
    const handleBlur = ()=>{
        commandType.value = 0;
    }

    // 提交数据
    const handleSubmit = ()=>{
        formDataRef.value.validate(vali => {
            if(vali){
              loadingState.value = true;
              if(prop.type == 'create'){
                createShare(formData).then(res=>{
                  loadingState.value = false;
                  emit('onSubmitSuccess',res.data);
                  onBeforeClose();
                }).catch(err=>{
                  loadingState.value = false;
                })
              }else{
                updateProjectShare(formData).then(res=>{
                  loadingState.value = false;
                  emit('onSubmitSuccess',res.data);
                  onBeforeClose();
                }).catch(err=>{
                  loadingState.value = false;
                })
              }

            }
        })
    }

    // 创建收集弹窗关闭之前
    const onBeforeClose = (deno) => {
        if(loadingState.value){
            return
        }
        formDataRef.value.resetFields();
        formData.fileIds = [];
        formData.projectId = null;
        formData.id = null;
        formData.fileType = null;
        if(typeof deno == 'function'){
          deno();
        }else{
          visible.value = false;
        }
    };


    const open = (data)=>{
      visible.value = true;
      nextTick(()=>{
        if(authRule('download')){
          formData.saveTo = 1;
        }else{
          formData.saveTo = 0;
        }
        if(!Array.isArray(data)){
          if(prop.type !== 'update'){
            formData.fileIds = [data.id];
            formData.name = data.name;
            formData.fileType = data.type == 1?'folder' : data.fileCat ;
            formData.projectId = data.projectId;
          }else{
            for(var key in formData){
              formData[key] = data[key]
            }
          }
        }else{
          formData.fileIds = data.map(item=>item.id);
          formData.name = `分享${data.length}个文件`;
          formData.projectId = data[0].projectId;

          let fileCat = ''
          data.forEach(el => {
              if (el.fileCat === 'video') {
                  fileCat = 'video'
              }
          })
          formData.fileType = fileCat;
        }
      })
    } 


    return {
        open,
        visible,
        formatSize,
        handleBlur,
        commandType,
        loadingState,
        handleSubmit,
        handleCommand,
        onBeforeClose,
        formDataRef,
        projectData,
        authRule,
        formData,
        formRules,
        inputNumberPeriod
    }
}
export default defineComponent({
    setup,
    props,
    emits
})
</script>
<style scoped lang="scss">
.collection-form-body {
  .form-item-custom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .dropdown-link {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf5ff;
      color: #409eff;
      padding: 5px 10px;
      border-radius: 100px;
      cursor: pointer;
    }
  }
}
</style>