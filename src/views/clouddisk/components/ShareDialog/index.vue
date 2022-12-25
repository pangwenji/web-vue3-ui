<template>
  <div class="share-dialog">
    <el-dialog
      v-model="shareShow"
      width="460px"
      :destroy-on-close="true"
      :before-close="handleClose"
      :show-close="false"
    >
    <template #title>
      <div class="my-header">
        <div>
          <span>创建分享</span>
        </div>
        <div @click="handleClose" class="title-btn">
          <el-icon><Close /></el-icon>
        </div>
      </div>
    </template>
    <div class="share-content">
      <el-form :model="formData" :rules="formRules" ref="formDataRef">
        <div>
          <el-form-item prop="name">
            <el-input maxlength="30" input-style="height:46px;border-radius: 10px;" v-model="formData.name" placeholder="分享名称" />
          </el-form-item>
        </div>
        <div style="">
          <ul>
            <li>
              <div class="title">
                <span>访问密码</span>
                <!-- <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="仅限拥有访问密码者可查看，更加隐私安全"
                  placement="top"
                >
                  <el-icon color="#409EFC"><QuestionFilled /></el-icon>
                </el-tooltip> -->
              </div>
              <div>
                <el-switch
                  v-model="formData.passwordLock"
                  class="ml-2"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#3A36DB"
                />
              </div>
            </li>
            <!-- <li v-show="formData.passwordLock === 1">
              <div class="title">密码</div>
              <div class="pwd">{{shareInfo?.password}}</div>
            </li> -->
            <li>
              <div class="title">访问期限</div>
              <div>
                <template v-if="commandType">
                  <div>
                    <el-input-number :controls="false" :precision="0" v-model="formData.period" :min="0" :max="10000" controls-position="right" size="small"
                      ref="inputNumberPeriod" @blur="handleBlur" />
                    <span style="margin-left: 10px">天</span>
                  </div>
                </template>
                <template v-else>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{formData.period === 0 ? '永久有效': formData.period + '天'}}
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
            </li>
            <li>
              <div class="title">允许下载和转存</div>
              <div>
                <el-switch
                  v-model="formData.saveTo"
                  class="ml-2"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#3A36DB"
                />
              </div>
            </li>
            <li v-if="fileType === 'video'">
              <div class="title">
                <span>防录屏</span>
                <!-- <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="开启后项目及分享的所有视频将显示防录屏浮标"
                  placement="top"
                >
                  <el-icon color="#409EFC"><QuestionFilled /></el-icon>
                </el-tooltip> -->
              </div>
              <div>
                <el-switch
                  v-model="formData.antiScreenRecording"
                  class="ml-2"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#3A36DB"
                />
              </div>
            </li>
          </ul>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="share-bottom">
        <el-button class="is-custom" @click="handleClose">取消</el-button>
        <el-button class="is-custom" :loading="submitLoading" type="primary" @click="submitShare">确定</el-button>
      </div>
    </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { Share } from '@element-plus/icons-vue'
import { createShare } from "@/api/clouddisk/share.js"
import { watch } from '@vue/runtime-core';

const { proxy } = getCurrentInstance();
const props = defineProps({
  shareShow: {
    type: Boolean,
    default: false
  },
  fileType: {
    type: String,
    default: ''
  },
  shareData: {
    type: Array,
    default: []
  }
})
const emit = defineEmits(['shareClose', 'update:shareShow', 'shareSuccess'])
const shareText = ref('')
const shareInfo = ref({})
const shareId = ref(0)
const shareQrcode = ref(0)
const shareUrl = ref(0)
const formDataRef = ref();
const formData = reactive({
    fileIds: [],
    name: "",
    passwordLock: 0,
    period: 0,
    saveTo: 0,
    antiScreenRecording: 1,
});
const formRules = reactive({
    name: [{ required: true, message: "请填写分享标题", trigger: "blur" }],
});
const inputNumberPeriod= ref();
const submitLoading = ref(false)

onMounted(() => {
  if (props.shareData.length > 1) {
    formData.name = '这是我的分享，欢迎转发收藏'
  } else {
    formData.name = props.shareData[0]?.name || ''
  }
})

function handleClose() {
  emit('shareClose', false)
}

const commandType = ref(null);
function handleCommand(e) {
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

// 创建分享
function submitShare() {
  formData.fileIds = props.shareData.map(item=>item.id);
  formDataRef.value.validate(vali => {
    if(vali){
      submitLoading.value = true
      createShare(formData).then(res => {
        const data = res.data
        data.name = formData.name
        submitLoading.value = false
        emit('shareSuccess', data)
      })
    }
  })
}

</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
