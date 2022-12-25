<template>
  <div class="view-cert-dialog">
  <el-dialog width="800px" v-model="dialogVisible" custom-class="view-dialog" :append-to-body="false" :title="'存证证书：'+certificateInfo.fileName">
    <div>
      <el-radio-group v-model="radio2">
        <el-radio-button label="digital">数字内容存证证明</el-radio-button>
        <el-radio-button label="trusted">可信时间凭证认证</el-radio-button>
      </el-radio-group>

      <div v-show="radio2 === 'digital'">
        <div class="tip">由公证处出具的存证证书，具备法律效力。</div>
        <div class="content-box">
          <!-- <iframe :src="certificateInfo.certificateUrl" frameborder="0"></iframe> -->
          <PDFView :src="certificateUrl"></PDFView>
          <div class="storage-no">
            证书编号：{{certificateInfo.certificateStorageNo}}
            <span class="copy-no" @click="handleCopyText(certificateInfo.certificateStorageNo)">
              <svg-icon iconClass="icon_copy" :size="16" ></svg-icon>复制
            </span>
          </div>
        </div>
      </div>

      <div v-show="radio2 === 'trusted'">
        <div class="tip">由国家授时中心直接签发，数据中的时间信息直接由国家标准时间UTC（NTSC）证明，与数据的对应关系被国家授时中心可信时间服务证明可信。其签发的可信时间凭证作为一种方便、快捷的知识产权保护方式已经被广泛使用。</div>
        <div class="content-box content-box2">
          <div class="line1">
            <div class="left">可信时间凭证标识号</div>  
            <div class="right">{{certificateInfo?.tsr?.sn}}</div>  
          </div>
          <div class="line2">
            <div class="left">文件哈希值</div>  
            <div class="right">{{certificateInfo?.tsr?.hashedMessage}}</div>  
          </div>
          <div class="line3">
            <div class="left">tsr凭证字符串</div>  
            <div class="right">{{certificateInfo?.tsr?.ctsr}}</div>  
          </div>
        </div>
      </div>

      <div class="btn-box">
        <el-button
          color="#3468FE"
          style="width:120px;height:42px;"
          type="primary"
          @click="(dialogVisible = false)"
        >确认</el-button>
      </div>

    </div>
  </el-dialog>
  </div>
</template>

<script setup>
import PDFView from '@/plugins/ViewFile/PDFView.vue'

const props = defineProps({
  certificateInfo: {
    type: Object,
    default: {}
  },
  certificateUrl: {
    type: String,
    default: ''
  },
})
const { proxy } = getCurrentInstance();
const dialogVisible = ref(false)
const radio2 = ref('digital')

function open() {
  dialogVisible.value = true
}

function handleCopyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    proxy.$modal.msgSuccess("复制成功");
  })
}

defineExpose({
  open
})

</script>
<style lang="scss" scoped>
.view-cert-dialog {
  :deep(.el-overlay-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;
    .view-dialog {
      margin: 0!important;
      border-radius: 10px;
    }
    .el-dialog__body {
      margin: 0 20px;
      padding: 20px 0;
      border-top: 1px solid #EAEAEA;
    }
  }
  :deep(.el-radio-button__original-radio:checked+.el-radio-button__inner) {
    background-color: #3468FE;
    border-color: #3468FE;
  }

  .tip {
    margin-top: 25px;
    color: #8D91A3;
  }

  .content-box {
    margin-top: 10px;
    padding: 24px 0;
    background-color: #F5F6FA;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    :deep(canvas) {
      width: 400px!important;
    }
    .storage-no {
      margin-top: 24px;
      color: #8D91A3;
      .copy-no {
        margin-left: 10px;
        color: #3468FE;
        cursor: pointer;
      }
    }
  }
  .content-box2 {
    padding: 0;
    .line1, .line2, .line3 {
      width:100%;
      display: flex;
      .left {
        width: 25%;
        border-right: 1px solid #fff;
      }
      .right {
        width: 75%;
      }

    }
    .line1 {
      background-color: #EEF0F7;
      border-radius: 8px 8px 0px 0px;
      .left, .right {
        padding: 20px;
      }
    }
    .line2 {
      border-bottom: 1px solid #fff;
      .left, .right {
        padding: 10px 20px;
      }
    }
    .line3 {
      .left, .right {
        padding: 20px;
      }
      .left {
        display: flex;
        align-items: center;
      }
    }
  }

  .btn-box {
    margin-top: 26px;
    text-align: right;
  }
  
}
</style>