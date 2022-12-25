<template>
  <div class="share-dialog">
    <el-dialog
      v-model="shareShow"
      width="360px"
      :destroy-on-close="true"
      :before-close="handleClose"
      :show-close="false"
    >
    <template #title>
      <div class="my-header">
        <div v-if="shareType > 0" @click="handleShareType(0)" class="title-btn">
          <el-icon><ArrowLeft /></el-icon>
        </div>
        <div>
          <span v-if="shareType === 0">创建分享</span>
          <span v-if="shareType === 1">分享到微信</span>
          <span v-if="shareType === 2">分享链接</span>
        </div>
        <div @click="handleClose" class="title-btn">
          <el-icon><Close /></el-icon>
        </div>
      </div>
    </template>
    <div v-if="shareType === 0" class="share-content">
      <div>
        <el-input v-model="shareParams.name" @change="handleUpdateShare" placeholder="分享名称" />
      </div>
      <div style="min-height:240px;">
        <ul>
          <li>
            <div>
              <span>访问密码</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="仅限拥有访问密码者可查看，更加隐私安全"
                placement="top"
              >
                <el-icon color="#409EFC"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div>
              <el-switch
                v-model="shareParams.passwordLock"
                class="ml-2"
                :active-value="1"
                :inactive-value="0"
                @change="handleUpdateShare"
                active-color="#13ce66"
              />
            </div>
          </li>
          <li v-show="shareParams.passwordLock === 1">
            <div>密码</div>
            <div class="pwd">{{shareInfo?.password}}</div>
          </li>
          <li>
            <div>访问期限</div>
            <div>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{shareParams.period === 0 ? '永久有效': shareParams.period + '天'}}
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
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </li>
          <li>
            <div>
              <span>允许评论</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="开启后访问者对分享的文件将有评论的权限"
                placement="top"
              >
                <el-icon color="#409EFC"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div>
              <el-switch
                v-model="shareParams.allowComments"
                class="ml-2"
                :active-value="1"
                :inactive-value="0"
                @change="handleUpdateShare"
                active-color="#13ce66"
              />
            </div>
          </li>
          <li>
            <div>允许下载和转存</div>
            <div>
              <el-switch
                v-model="shareParams.saveTo"
                class="ml-2"
                :active-value="1"
                :inactive-value="0"
                @change="handleUpdateShare"
                active-color="#13ce66"
              />
            </div>
          </li>
          <li v-if="fileType === 'video'">
            <div>
              <span>防录屏</span>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="开启后项目及分享的所有视频将显示防录屏浮标"
                placement="top"
              >
                <el-icon color="#409EFC"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div>
              <el-switch
                v-model="shareParams.antiScreenRecording"
                class="ml-2"
                :active-value="1"
                :inactive-value="0"
                @change="handleUpdateShare"
                active-color="#13ce66"
              />
            </div>
          </li>
        </ul>
      </div>
      <div class="share-bottom">
        <div>
          <el-button type="success" plain @click="handleShareType(1)">分享到微信</el-button>
        </div>
        <div>
          <el-button type="primary" @click="handleShareType(2)">分享链接</el-button>
        </div>
      </div>
    </div>
    <div v-if="shareType === 1" class="share-wechat">
      <div class="qrcode">
        <!-- <img :src="shareQrcode" alt=""> -->
        <span>扫码分享文件</span>
      </div>
      <div class="sharebtn">
        <el-button type="primary" plain :icon="Share" @click="handleShareType(2)">分享链接</el-button>
      </div>
    </div>
    <div v-if="shareType === 2" class="share-link">
      <div>
        <el-input
          v-model="shareText"
          :rows="10"
          type="textarea"
          placeholder="Please input"
          :readonly="true"
        />
      </div>
      <div class="sharebtn">
        <el-button type="primary" @click="shareCopy">复制</el-button>
        <el-button type="success" plain @click="handleShareType(1)">分享到微信</el-button>
      </div>
    </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { Share } from '@element-plus/icons-vue'
import { createShare, updateShare } from "@/api/project/share.js"
import { watch } from 'vue-demi';

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
  shareParams: {
    type: Object,
    default: {}
  }

})
const emit = defineEmits(['shareClose', 'update:shareShow'])
const shareType = ref(0)
const shareText = ref('')
const shareInfo = ref({})
const shareId = ref(0)
const shareQrcode = ref(0)
const shareUrl = ref(0)

onMounted(() => {
})

watch(() => props.shareParams, (newValue) => {
  handleShare(newValue)
})

function handleClose() {
  shareType.value = 0;
  emit('shareClose', false)
}

function handleShareType(type) {
  shareType.value = type;
  if (type === 2) {
    shareText.value = `用户 ${shareInfo.value.userId} 分享了 ${shareInfo.value.name}`
    shareText.value += `\n链接: ${shareUrl.value}`
    shareText.value += `${shareInfo.value.password === null ? '' : '\n密码:' + shareInfo.value.password}`
    shareText.value += `\n有效期: ${shareInfo.value.period > 0 ? shareInfo.value.period + '天' : '永久有效'}`
  }
}

function shareCopy() {
  navigator.clipboard.writeText(shareText.value).then(() => {
    proxy.$modal.msgSuccess("复制成功");
  });
}

function handleCommand($event) {
  if (props.shareParams.period !== $event) {
    props.shareParams.period = $event
    handleUpdateShare()
  }
}

// 创建分享
function handleShare(data) {
  createShare(data).then(res => {
    shareInfo.value = res.data.info
    shareId.value = res.data.info.id
    shareQrcode.value = res.data.qrcode
    shareUrl.value = res.data.url
  })
}

// 更新分享
function handleUpdateShare() {
  if (!shareId.value) return;
  const params = {...props.shareParams}
  params.id = shareId.value
  updateShare(params).then(res => {
    shareInfo.value = res.data
  })
}

</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>
