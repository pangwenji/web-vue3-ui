<template>
  <div class="top-box">
    <el-button class="top-btn" v-for="item in typeTabData" :key="item.typeId"
               :class="{ active: query.typeId === item.typeId }"
               @click="handleChangMain(item)" round>{{ item.typeName }}
    </el-button>
  </div>
  <div class="main-box" v-if="sellMaterial.length > 0" v-loading="!load" element-loading-background="rgba(0, 0, 0, 0)">
    <el-scrollbar class="sell-main" :height="scollHeight">
      <SoundCartBox
          :status="false"
          @onGetList="getSellMaterial"
          :sellMaterial="sellMaterial"></SoundCartBox>
      <Pagination
          v-if="total > 9"
          :total="total"
          :page="query.pageNum"
          :limit="query.pageSize"
          @pagination="handlePagination"
          class="pagination-container-box"
          position="center"></Pagination>
    </el-scrollbar>

  </div>
  <template v-else>
    <Empty></Empty>
  </template>
</template>

<script setup>
import {ref, watchEffect} from "vue";
import {getShelves, getTypeOption} from "@/api/material";
import SoundCartBox from "../../../material/sellMaterial/sound/soundCartBox"
import {useWindowSize} from "@vueuse/core/index";

const load = ref(true)
const typeId = ref(1)
const query = ref({
  typeId: typeId.value,
  pageNum: 1,
  pageSize: 10,
})

const {height} = useWindowSize();
const scollHeight = ref()
watchEffect(() => {
  scollHeight.value = height.value - 362
});

const activeId = ref()
const typeTabData = ref()

function getTabList() {
  getTypeOption().then((res) => {
    typeTabData.value = res.data
    activeId.value = typeTabData.value[0]?.typeId
  })
}

getTabList()

const handleChangMain = (item) => {
  load.value = false
  if (item.id === activeId.value) return;
  query.value.typeId = item.typeId

  getSellMaterial()
}


const sellMaterial = ref([]) // 销售列表
const total = ref(0)

// 获取销售中列表
function getSellMaterial() {
  getShelves(query.value).then(res => {
    sellMaterial.value = res.rows
    total.value = res.total
    total.value > 9 ? scollHeight.value = height.value - 392 : scollHeight.value = height.value - 362
    load.value = true
  })
}

getSellMaterial()

const handlePagination = ({page, limit}) => {
  query.value.pageNum = page;
  query.value.pageSize = limit;
  getSellMaterial()
}

</script>

<style scoped lang="scss">
.top-box {
  display: flex;

  .top-btn {
    background: transparent;
    &.active {
      background: #d9ecff;
    }
  }
}


.main-box {
  padding-top: 20px;

}

.sell-main {
  width: 100%;
  flex: auto;

  &:deep(.el-scrollbar__wrap) {
    width: 100%;
  }

  .sell-card {

  }
}
</style>
