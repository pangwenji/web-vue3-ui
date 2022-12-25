<template>
  <el-container style="height:100%;">
    <div class="header-content">
      <el-scrollbar  ref="scroll"  style="width: 100%;height: 100%">
        <top-tab :hideItems="['video','image','font']" :showAll="true" @onChangTab="handleChangTab" @onload="handleChangTab"></top-tab>
        <div class="main-card">
          <div v-if="materialList.length > 0">
            <div v-if="activeId!==6&&activeId!==5&&activeId!==7">
              <div class="sound-table-header">
                <template v-for="list in nameList" :key="list.id">
                  <div class="sound-table-th"
                       v-if="list.show"
                       :style="list.style">
                    {{ list.name }}
                  </div>
                </template>
              </div>
              <template v-for="(item, index) in materialList" :key="index" v-loading="!load">
                <SoundList
                    v-if="load"
                    :data="item"
                    :playId="playId"
                    @onPlay="handlePlay"
                    :typeActivateId="activeId"
                    @onGetInfo="getPurchaseMaterialList"
                ></SoundList>
              </template>
            </div>
          </div>
          <div v-else class="empty" v-loading="!load" element-loading-background="rgba(0, 0, 0, 0)">
            <span v-if="load"><empty></empty></span>
          </div>
          <Pagination :total="materialTotal" :page="pageNum" :limit="pageSize" @pagination="handlePagination"
                        layout="sizes,prev, pager, next, total, jumper"  v-if="materialTotal > 10 && load" :hideSinglePage="false"
                        class="pagination-container-box" position="center"></Pagination>
        </div>
      </el-scrollbar>
    </div>
  </el-container>
</template>
<script setup name="material-purchased">
import MaterialLeft from "../components/MaterialLeft";
import {useStore} from 'vuex'
import {defineComponent, onMounted, ref, computed, watch} from "vue"
import SoundList from "./soundList";
import {getPurchaseMaterials} from '@/api/material/purchased.js'
import topTab from "../components/content/topTab";
import ContentBotom from "../components/content/contentBottom";
import {onActivated} from "@vue/runtime-core";


const activeId = ref(-1)
const store = useStore();
const pageNum = ref(1)
const pageSize = ref(50)
const playId = ref(0)
onMounted(() => {
  load.value = false
})
const scroll = ref(null)

const nameList = ref([
    {id: 1, name: '信息', style: {width: "20.8%", textAlign: 'start', textIndent: '66px'}, show: true},
    {id: 2, name: '订单编号', style: {width: '16.5%',textAlign: 'start',}, show: true},
    {id: 3, name: '授权类型', style: {width: '13%;', textAlign: 'start'}, show: true},
    {id: 4, name: '授权信息', style: {width: '21%', textAlign: 'start',}, show: true},
    {id: 5, name: '价格', style: {width: '10%', textAlign: 'start'}, show: true},
    {id: 6, name: '操作', style: {width: '15%'}, show: true}
])
// 获取已购素材
const load = ref(true)
const materialList = ref([])
const materialTotal = ref(0)

function getPurchaseMaterialList() {
  materialList.value=[]
  const query = {
    typeId: activeId.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }
  getPurchaseMaterials(query).then(res => {
    materialList.value = res.rows
    materialTotal.value = res.total
    load.value = true
  })
}


function handleChangTab(item) {
  load.value = false
  activeId.value = item.typeId;
  pageNum.value=1;
  if (![5,6].includes(activeId.value)){
    pageSize.value=10;
  }else {
    pageSize.value=50;
  }
  let name = nameList.value;
  if (item.typeName === "工程") {
    nameList.value = [
      {id: 1, name: '信息', style: {textAlign: 'start', textIndent: '66px', width: '60%'}, show: true,},
      {id: 2, name: '订单编号', style: {width: '21.5%',textAlign: 'start'}, show: true,},
      {id: 3, name: '授权类型', style: {}, show: false,},
      {id: 4, name: '授权信息', style: {}, show: false,},
      {id: 5, name: '价格', style: {width: '11%',textAlign: 'start'}, show: true,},
      {id: 6, name: '操作', style: {width: '9%',textAlign: 'start'}, show: true,}];
  } else if (item.typeName === "插件") {
    nameList.value = [
      {id: 1, name: '信息', style: {textAlign: 'start', textIndent: '66px', width: '77%'}, show: true,},
      {id: 2, name: '订单编号', style: {}, show: false,},
      {id: 3, name: '授权类型', style: {}, show: false,},
      {id: 4, name: '授权信息', style: {}, show: false,},
      {id: 5, name: '价格', style: {width: '13%'}, show: true,},
      {id: 6, name: '操作', style:{width: '9%'}, show: true,}];
  } else {
    // 数据克隆出现问题，占时这样写
    nameList.value = [
      {id: 1, name: '信息', style: {width: "20.8%", textAlign: 'start', textIndent: '66px'}, show: true,},
      {id: 2, name: '订单编号', style: {width: '16.5%', textAlign: 'start'}, show: true,},
      {id: 3, name: '授权类型', style: {width: '13%', textAlign: 'start'}, show: true},
      {id: 4, name: '授权信息', style: {width: '21%', textAlign: 'start',}, show: true},
      {id: 5, name: '价格', style: {width: '10%', textAlign: 'start'}, show: true},
      {id: 6, name: '操作', style: {width: '15%'}, show: true}]
  }
  getPurchaseMaterialList()
}

// 当前播放
function handlePlay(pid) {
  playId.value = pid
}

onActivated(() => {
  pageNum.value=1;
  if (activeId.value!==-1){
    getPurchaseMaterialList();
  }
})

// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
  load.value = false
  pageNum.value = page;
  pageSize.value = limit;
  getPurchaseMaterialList();
}


</script>
<style scoped lang="scss">
@import "./style.scss";

.main-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.Mywaterfall {
  display: flex;
  flex-wrap: wrap;
}

.image-content {
  margin: 5px;
  flex-grow: 1;
}

.Mywaterfall .img {
  display: block;
  min-width: 100%;
  height: 200px;
  object-fit: cover;
}

.Mywaterfall .img:hover {
  transform: scale(1.05);
  transition: all .3s linear;
  cursor: pointer;
}
.pagination-container-box {
  padding-bottom: 20px;
}

</style>
