<template>
  <div class="container-left1">
    <el-scrollbar height="100%">
      <div class="file-list1">
        <div>
          <span>文件列表</span>
        </div>
        <!-- <div class="file-list1-icon">
          <span @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
          </span>
        </div> -->
      </div>
      <div class="file-list3">
        <ul>
          <li
            v-for="(item, index) in fileList"
            :key="index"
            :class="{ 'list-active': fileDetail.id === item.id }"
            @click="clickFile(item, index)"
          >
            <div class="img-box">
								<FileType v-if="item.fileCat === 'video' || item.fileCat === 'image'" type="url" :url="item.cover"></FileType>
								<FileType v-else-if="item.type === 1" type="folder"></FileType>
								<FileType v-else :type="item.fileCat"></FileType>
            </div>
            <div class="info-box">
              <div class="file-name">
                <span>{{ item.name }}</span>
              </div>
              <div class="file-bott">
                <span>{{ formatSize(item.size) }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import FileType from '@/components/FileType'
import { onMounted } from '@vue/runtime-core';

const route = useRoute()
const store = useStore();
const router = useRouter();
const props = defineProps({
  fileList: {
    type: Array,
    default: []
  }
})

const fileType = ref('')
const fileId = ref(0)
const shareToken = ref('')

const emit = defineEmits(['handleRefresh', 'openFolder', 'onFileClick']);
const fileDetail = computed(()=>{
  return store.state.clouddisk.fileDetail
})

onMounted(() => {
  shareToken.value = route.query.shareToken || ''
})

function clickFile(item, index) {
  if (item.id === fileDetail.value.id) return;
  if (item.type === 1) {
    return
  } else {
    emit('onFileClick', item)
  }
}

function openFolder(pid) {
  emit('openFolder', pid)
}

// 更新文件列表
function handleRefresh() {
  emit('handleRefresh', fileDetail.value.projectId)
}

function formatSize(size) {
  var i, unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  for (i = 0; i < unit.length && size >= 1024; i++) {
      size /= 1024;
  }
  return (Math.round(size * 100) / 100 || 0) + unit[i];
}

</script>

<style lang="scss" scoped>
  @import "./style.scss";
</style>