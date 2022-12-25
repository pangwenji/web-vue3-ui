<template>
  <div class="table-box">
    <div class="table">
      <div class="table-item" style="background: #0A0B0D;height: auto;padding-bottom: 6px;">
        <div class="col1"  style="padding-right: 10px;">项目名称</div>
        <div class="col1">空间用量</div>
        <div class="col1">文件数量(个)</div>
        <div class="col1">成员个数(个)</div>
        <div class="col1">创建时间</div>
      </div>
    </div>
  </div>
  <div style="flex: 1;position: relative">
    <div style="overflow:hidden;width: 100%;height: 100%; position: absolute;" v-loading="loadingStatus"
         element-loading-background="rgba(0, 0, 0, 0)">
      <el-scrollbar style="height:100%;" view-style="min-height: 100%; position:relative;display: flex;flex-direction: column;">
        <div class="table-box" style="flex: 1;" v-if="projectList.length > 0 && !loadingStatus">
          <transition name="table">
            <div class="table">
              <div class="table-item" v-for="item in projectList" :key="item">
                <!--              项目名称-->
                <div class="col1 overflow-ellipsis" style="padding-right: 10px;">{{ item.name }}</div>
                <!--              空间用量-->
                <div class="col1">{{ formatSize(item.size) || 0 }}</div>
                <!--              文件数量(个)-->
                <div class="col1">{{ item.fileCount || 0 }}个</div>
                <!--              成员个数(个)-->
                <div class="col1">{{ item.memberCount || 0 }}个</div>
                <!--              创建时间-->
                <div class="col1">{{ item.createTime }}</div>
              </div>
            </div>
          </transition>
        </div>
        <div v-else-if="!loadingStatus" class="empty">
          <Empty description="">
            <template #description>
              <div>当前无记录</div>
            </template>
          </Empty>
        </div>
        <Pagination :total="total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination"
                    class="pagination-container-box" position="center"></Pagination>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import {ref, reactive, onMounted, defineProps, watch} from 'vue'
import {getProjectInfoListPage} from "@/api/user/space";
import {formatSize} from '@/utils/tool.js'

const loadingStatus = ref(false)
const projectList = ref([])
const total = ref(0);
const params = reactive({
  pageSize: 10,
  pageNum: 1,
})
onMounted(() => {
  getApproveInfo()
})

const getApproveInfo = () => {
  loadingStatus.value = true;
  getProjectInfoListPage(params).then(res => {
    projectList.value = res.rows
    total.value = res.total
    loadingStatus.value = false;
  }).catch(err => {
    loadingStatus.value = false;
  });
}

// 分页
const handlePagination = ({page, limit}) => {
  params.pageNum = page;
  params.pageSize = limit;
  getApproveInfo();
}

</script>
<style scoped lang="scss">
@import "./style.scss";

</style>
