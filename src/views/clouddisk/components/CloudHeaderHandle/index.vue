<template>
  <div class="actions-content">
    <div class="actions-content-title">
      <span class="check-box" :class="{check:isCheckAll}" @click="handleCheckAll">
        <el-icon class="icon">
            <Check />
        </el-icon>
      </span>
      <span>全选</span>
    </div>
    <div class="actions-content-right">
      <div style="margin-right: 32px;">
        <span style="margin: 0 12px">已选中 {{ selectFiles.length }} 项</span>
        <span>共计 {{ formatSize(size) }}</span>
      </div>
      <!-- <el-button type="default">用所选文件新建文件夹</el-button> -->
      <el-button
        class="is-custom"
        type="warning"
        color="#40424d"
        title="下载"
        round
        :disabled="hasFolder"
        @click="handleDownloadFiles"
      >
        下载
      </el-button>
      <el-button
        class="is-custom"
        type="warning"
        color="#40424d"
        title="复制到"
        round
        @click="emit('onCopy', selectFiles)"
      >
        复制到
      </el-button>
      <el-button
        class="is-custom"
        type="warning"
        color="#40424d"
        title="移动到"
        round
        @click="emit('onMove', selectFiles)"
      >
        移动到
      </el-button>
      <!-- <el-button type="primary" color="#40424d" title="批量下载" @click="handleDownloadFiles">
        <el-icon>
          <Download />
        </el-icon>
      </el-button> -->
      <el-button class="is-custom" type="warning" color="#40424d" round @click="handleShare">分享</el-button>
      <el-button
        class="is-custom"
        type="warning"
        color="#CB3B46"
        title="删除"
        round
        @click="handleDelete"
      >
        删除
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { formatSize } from '@/utils/tool.js';
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus';
import { deleteFile } from '@/api/clouddisk/file.js';
import { computed } from '@vue/runtime-core';
const emit = defineEmits([
  'checkAll',
  'cancelCheck',
  'share',
  'onCopy',
  'onMove',
  'onDownloadFiles',
  'onBatchDelete',
  'onShare'
]);
const prop = defineProps({
  selectFiles: {
    type: Array,
    default() {
      return [];
    },
  },
  isCheckAll: {
    type: Boolean,
    default: false
  }
});

const store = useStore()
const fileData = computed(() => {
  return store.state.project.fileList;
});
const foldData = computed(() => {
  return store.state.project.folderList;
});

const size = computed(() => {
  return prop.selectFiles.reduce((total, item) => {
    return total + item.size;
  }, 0);
});

const hasFolder = computed(() => {
  let flag = false
  for (let item of prop.selectFiles) {
    if (item.type == 1) {
      flag = true
      break
    }
  }
  return flag
})

const handleCheckAll = () => {
  if (prop.isCheckAll) {
    emit('cancelCheck');
  } else {
    emit('checkAll');
  }
};

const handleShare = () => {
  emit('onShare', prop.selectFiles);
};

const handleDownloadFiles = () => {
  if (prop.selectFiles.length == 0) {
    ElMessage.error('请先选择需要下载的文件');
    return;
  }
  for (var item of prop.selectFiles) {
    if (item.type == 1) {
      ElMessage.error('文件夹无法下载');
      return;
    }
  }
  console.log(" prop.selectFiles", prop.selectFiles)
  emit('onDownloadFiles', prop.selectFiles);
};

// 删除
const handleDelete = () => {
  const ids = prop.selectFiles.map((item) => item.id);
  const text = `确定要批量删除选中的文件吗? 删除后,文件将被移至回收站!`;
  const title = `批量删除`;
  ElMessageBox.confirm(text, title, {
    customClass: 'messageBox-custom-warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: true,
    center: true,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        })
        deleteFile({ id: ids.join(',') })
          .then((res) => {
            emit('onBatchDelete', prop.selectFiles.slice())
		        loading.close()
            done();
          })
          .catch((err) => {
		        loading.close()
            done();
          });
      } else {
        if (instance.confirmButtonLoading) {
          return;
        }
        done();
      }
    },
  })
    .then(() => {})
    .catch((err) => {});
};

defineExpose({
  handleDelete
})

</script>
<style scoped lang="scss">
@import './style.scss';
</style>
