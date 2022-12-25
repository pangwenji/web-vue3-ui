<template>
  <div class="container-left1">
    <el-scrollbar height="100%">
      <div class="file-list1">
        <div>
          <span>文件列表</span>
        </div>
        <div class="file-list1-icon">
          <span @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
          </span>
          <!-- <span @click="isFileList = false">
            <el-icon><Close /></el-icon>
          </span> -->
        </div>
      </div>
      <div class="file-list2">
        <span>{{projectData.name}}</span>
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
              <!-- <img :src="item.cover" alt="" /> -->
              <FileType v-if="item.fileCat === 'video' || item.fileCat === 'image'" type="url" :url="item.cover"></FileType>
              <FileType v-else :type="item.fileCat"></FileType>
            </div>
            <div class="info-box">
              <div class="file-name">
                <span>{{ item.name }}</span>
              </div>
              <div class="file-bott">
                <span>{{ formatSize(item.size) }}</span>
                <span> · </span>
                <span>{{ item.commentCount }}条评论</span>
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

const projectData = computed(()=>{
  return store.state.project.projectData
})

const emit = defineEmits(['onRefresh', 'onFileChange']);
const fileDetail = computed(()=>{
    return store.state.file.fileDetail
})
function clickFile(item, index) {
  if (item.id === fileDetail.value.id) return;
  fileType.value = item.fileCat;
  fileId.value = item.id;
  emit('onFileChange', item)
  // getFileDetail(item.id)
  // getCommentList(item.id)
  // router.replace({ path: "/file", query:{id: item.id, projectId: fileDetail.value.projectId} });
}

// 获取文件详情
function getFileDetail(id) {
  store.dispatch("file/setFileType", '');
  store.dispatch("file/getProjectFileDetail",{id});
}

// 获取评论列表
function getCommentList(file_id) {
  store.dispatch("file/getFileCommentList",{file_id});
}

// 更新文件列表
function handleRefresh() {
  emit('onRefresh', {projectId: fileDetail.value.projectId, parentId: fileDetail.value.parentId})
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