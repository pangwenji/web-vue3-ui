<template>
  <div class="share-info-dialog">
    <el-dialog
      v-model="shareInfoShow"
      width="300px"
      :destroy-on-close="true"
      :before-close="handleClose"
      :show-close="false"
    >
      <template #title>
        <div class="my-header">
          <div>
            <span style="font-size:18px;font-weight:bold;">{{showType === 'qrcode'?'通过扫描分享':'通过链接分享'}}</span>
          </div>
          <div @click="handleClose" class="title-btn">
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </template>
      <div class="share-info-content" v-if="!loadingStatus">
        <div v-if="showType === 'qrcode'" class="share-qrcode">
          <!-- <img width="140" height="140" :src="shareInfo.qrcode" alt=""> -->
          <div class="share-name">
            {{shareInfo.name||shareInfo.info?.name}}
          </div>
          <div v-if="shareInfo.info?.passwordLock" style="margin-top:14px;font-size:16px;">密码: <span style="color: rgb(69, 101, 220);font-weight: bold;">{{shareInfo.info?.password}}</span></div>
        </div>
        <div v-else class="share-url">
          <div style="height:170px; padding:10px; border: 1px solid #DADCE1;border-radius: 10px;">
            <div>用户{{userInfo.nickName}}分享了 {{shareInfo.name||shareInfo.info?.name}}</div>
            <div style="padding:4px 0">链接: {{shareInfo.url}}</div>
            <div v-if="shareInfo.info?.passwordLock" style="padding:4px 0">密码: {{shareInfo.info?.password}}</div>
            <div>有效期: {{shareInfo.info?.period > 0 ? shareInfo.info?.period + '天' : '永久有效'}}</div>
          </div>
          <el-button type="primary" class="copy-btn" @click="handleCopyText">复制</el-button>
        </div>
        <!-- <div class="bott-title" @click="typeCheck">
          {{showType === 'qrcode'?'通过链接分享':'通过扫码分享'}}
        </div> -->
      </div>
      <div v-else class="share-info-content" v-loading="loadingStatus"></div>
    </el-dialog>
  </div>
</template>
<script setup>
import { Share } from '@element-plus/icons-vue'
import { createShare } from "@/api/clouddisk/share.js"
import { watch } from '@vue/runtime-core';
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance();
const props = defineProps({
  shareInfoShow: {
    type: Boolean,
    default: false
  },
  shareInfo: {
    type: Object,
    default: {}
  }
})

const store = useStore();
const userInfo = store.state.user
const emit = defineEmits(['shareInfoClose'])
const showType = ref('link')
const shareText = ref('')
const loadingStatus = ref(false)

onMounted(() => {
})

function handleClose() {
  emit('shareInfoClose', false)
}

function typeCheck() {
  if (showType.value === 'qrcode') {
    showType.value = 'url'
  } else {
    showType.value = 'qrcode'
  }
}

// 复制文字
const handleCopyText = async ()=>{
  const context = `用户${userInfo.nickName}分享了 ${props.shareInfo?.name||props.shareInfo.info?.name}
链接: ${props.shareInfo.url}${props.shareInfo.info?.passwordLock?'\n密码: '+ props.shareInfo.info?.password:''}
有效期: ${props.shareInfo.info?.period > 0 ? props.shareInfo.info?.period + '天' : '永久有效'}
`
  navigator.clipboard.writeText(context).then(() => {
    proxy.$modal.msgSuccess("复制成功");
  })
}

defineExpose({
  showType,
  loadingStatus
})
</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
