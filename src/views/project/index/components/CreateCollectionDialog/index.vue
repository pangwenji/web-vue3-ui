<template>
  <!-- 创建收集 -->
  <el-dialog :model-value="visible" top="0vh" custom-class="dialog-box; dialog-center" :append-to-body="true" title="创建收集"
    width="530px" :before-close="onBeforeClose">
    <el-form :model="collectionForm" :rules="collectionRules" ref="collectionRef" class="collection-form-body">
      <el-form-item prop="name">
        <el-input class="is-custom" :maxlength="30" show-word-limit v-model="collectionForm.name" placeholder="请输入文件夹名称" />
      </el-form-item>
      <el-form-item prop="textarea">
        <el-input type="textarea" class="is-custom" v-model="collectionForm.textarea" show-word-limit resize="none" :rows="3"
          :maxlength="95" placeholder="添加描述（例如文件格式的要求，选填）" />
      </el-form-item>
      <el-form-item label="链接开关" prop="status" v-if="collectionForm.id">
        <div class="form-item-custom">
          <span></span>
          <el-switch :active-value="1" :inactive-value="3" active-color="#3A36DB" v-model="collectionForm.status" />
        </div>
      </el-form-item>
      <el-form-item label="访问密码" prop="accessPwd">
        <div class="form-item-custom">
          <span></span>
          <el-switch active-color="#3A36DB" v-model="collectionForm.accessPwd" />
        </div>
      </el-form-item>
      <el-form-item label="访问期限" prop="dateSize">
        <div class="form-item-custom">
          <span></span>
          <template v-if="commandType === 'dateSize'">
            <div>
              <el-input-number :controls="false" :precision="0"  v-model="collectionForm.dateSize" :min="0" :max="1000" controls-position="right" size="small"
                ref="inputNumberDateSize" @blur="handleBlur" />
              <span style="margin-left: 10px">天</span>
            </div>
          </template>
          <template v-else>
            <el-dropdown trigger="click" @command="handleCommand($event,'dateSize')">
              <span class="dropdown-link">
                {{ collectionForm.dateSize ? `${collectionForm.dateSize}天` : '永久有效' }}
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
      <el-form-item label="文件总大小上限" prop="fileSize">
        <div class="form-item-custom">
          <span></span>
          <template v-if="commandType === 'fileSize'">
            <div>
              <el-input-number :controls="false" :precision="0"  v-model="collectionForm.fileSize" :max="1024*1024" :min="0" controls-position="right" size="small"
                ref="inputNumberFileSize" @blur="handleBlur('fileSize')" />
              <span style="margin-left: 10px">MB</span>
            </div>
          </template>
          <template v-else>
            <el-dropdown trigger="click" @command="handleCommand($event,'fileSize')">
              <span class="dropdown-link">
                {{ collectionForm.fileSize ? formatSize(collectionForm.fileSize) :  '不限制' }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="0">不限制</el-dropdown-item>
                  <el-dropdown-item :command="1024*1024*1024">1GB</el-dropdown-item>
                  <el-dropdown-item :command="5*1024*1024*1024">5GB</el-dropdown-item>
                  <el-dropdown-item :command="-1">自定义</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </el-form-item>
      <el-form-item label="发送人数限制" prop="sendSize">
        <div class="form-item-custom">
          <span></span>
          <template v-if="commandType=== 'sendSize'">
            <div>
              <el-input-number :controls="false" :precision="0" v-model="collectionForm.sendSize" :min="0" :max="1000" controls-position="right" size="small"
                ref="inputNumberSendSize" @blur="handleBlur" />
              <span style="margin-left: 10px">人</span>
            </div>
          </template>
          <template v-else>
            <el-dropdown trigger="click" @command="handleCommand($event,'sendSize')">
              <span class="dropdown-link">
                {{ collectionForm.sendSize ?  `${collectionForm.sendSize}人` : '不限制' }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- <el-dropdown-item :command="0">不限制（无需登录）</el-dropdown-item>
                  <el-dropdown-item :command="1">1人（需要登录）</el-dropdown-item>
                  <el-dropdown-item :command="-1">自定义（需要登录）</el-dropdown-item> -->
                  <el-dropdown-item :command="0">不限制</el-dropdown-item>
                  <el-dropdown-item :command="1">1人</el-dropdown-item>
                  <el-dropdown-item :command="-1">自定义</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </el-form-item>
      <p><span v-color="'#F56C6C'">注：</span>创建成功后将自动生成<span v-color="'#409EFF'">「收集文件夹」</span>和<span
          v-color="'#409EFF'">「收集链接」</span></p>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onBeforeClose" class="is-custom">取消</el-button>
        <el-button type="primary" class="is-custom" :loading="loadingState" @click="handleSubmit" style="background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%); border: none;">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, nextTick } from 'vue'
import { editFileCollect } from "@/api/project/files.js"
import { useStore } from 'vuex';
import { ElMessage } from "element-plus"
import { formatSize } from "@/utils/tool.js"
const props = {
    visible:{
        type:Boolean,
        default: false
    }
}
const emits = ['update:visible','onSubmitSuccess']
const setup = (prop,{emit})=>{
    /* 创建收集的表单 */
    const store = useStore();
    const loadingState = ref(false);
    const collectionRef = ref();
    const inputNumberFileSize = ref();
    const inputNumberDateSize = ref();
    const inputNumberSendSize = ref();
    const commandType = ref(null);
    const validatorFileSize = (rule,value,callback)=>{
      if(value > 1024*1024*1024*1024){
        callback(new Error('不能超过1TB'))
      }else{
        callback();
      }
    }
    const collectionRules = reactive({
        name: [{ required: true, message: "请填写收集名称", trigger: "blur" }],
        // fileSize: [{ validator:validatorFileSize, trigger: "change" }],
    });
    const collectionForm = reactive({
        id: null,
        name: "",
        status:1,
        textarea: "",
        accessPwd: true,
        dateSize: 0,
        fileSize: 0,
        sendSize: 0,
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

    const handleCommand = (e,typeName)=>{
        if(e >= 0){
            collectionForm[typeName] = e;
        }else{
            collectionForm[typeName] = 0;
            commandType.value = typeName;
            nextTick(()=>{
                if(typeName == 'dateSize'){
                    inputNumberDateSize.value.focus();
                }else if(typeName == 'fileSize'){
                    inputNumberFileSize.value.focus();
                }else if(typeName == 'sendSize'){
                    inputNumberSendSize.value.focus();
                }
            })
        }
    }
    const handleBlur = (typeName)=>{
      if(typeName == 'fileSize'){
          collectionForm[typeName] = collectionForm[typeName] * 1024 * 1024
      }
      commandType.value = null;
    }

    const handleSubmit = ()=>{
        collectionRef.value.validate(vali => {
            if (vali) {
              const projectId = projectData.value.id;
                const directoryId = lastBreadcrumbs.value.parentId || null;
                    // console.log('创建收集提交的表单', collectionForm)
                const {id, name, status ,textarea, accessPwd, dateSize, fileSize , sendSize} = collectionForm;
                if(fileSize > 1024*1024*1024*1024){
                  ElMessage.error('文件总大小限制不能超过1TB')
                  return
                }
                loadingState.value = true;
                if(id){
                  const data = {
                      id,
                      name,
                      status,
                      period: dateSize,
                      remark: textarea,
                      uploadLimit: fileSize,
                      peopleLimit: sendSize,
                      passwordLock: accessPwd?1:0
                  }
                  editFileCollect(data).then(res=>{
                      loadingState.value = false;
                      ElMessage.success('修改成功')
                      onBeforeClose()
                      emit('onSubmitSuccess',res.data);
                  }).catch(err=>{
                    loadingState.value = false;
                  })
                }else{
                  const data = {
                      name,
                      projectId,
                      directoryId,
                      period: dateSize,
                      remark: textarea,
                      uploadLimit: fileSize,
                      peopleLimit: sendSize,
                      passwordLock: accessPwd?1:0
                  }
                  store.dispatch('project/handleCreateFileCollect',data).then(res=>{
                      loadingState.value = false;
                      ElMessage.success('创建成功')
                      onBeforeClose()
                      emit('onSubmitSuccess',res);
                  }).catch(err=>{
                      loadingState.value = false;
                  })
                }
            }
        })
    }

    // 创建收集弹窗关闭之前
    const onBeforeClose = () => {
        if(loadingState.value){
            return
        }
        collectionRef.value.resetFields();
        collectionForm.id = null;
        emit('update:visible',false);
    };


    const open = (data)=>{
      emit('update:visible',true);
      nextTick(()=>{
        collectionForm.id = data.id;
        collectionForm.name = data.name;
        collectionForm.status = data.status;
        collectionForm.textarea = data.remark;
        collectionForm.accessPwd = data.passwordLock == 1;
        collectionForm.dateSize = data.period;
        collectionForm.fileSize = data.uploadLimit;
        collectionForm.sendSize = data.peopleLimit;
      })
    } 


    return {
        open,
        formatSize,
        handleBlur,
        commandType,
        loadingState,
        handleSubmit,
        handleCommand,
        onBeforeClose,
        collectionRef,
        collectionForm,
        collectionRules,
        inputNumberFileSize,
        inputNumberDateSize,
        inputNumberSendSize,
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