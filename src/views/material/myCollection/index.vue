<template>
  <el-container style="height:100%;">
    <div class="header-content">
      <el-scrollbar ref="scroll" style="width: 100%;height: 100%">
        <top-tab :showAll="true" @onChangTab="handleChangTab" @onload="handleChangTab"></top-tab>
        <div class="collection-main" v-if="CollectionList.length > 0" v-loading="!loading"
             element-loading-background="rgba(0, 0, 0, 0)">
          <el-row v-if="typeId===3" :gutter="10">
            <template v-for="(item, index) in CollectionList" :key="index">
              <collcetion-item
                  v-if="loading"
                  :data="item"
                  :dataIndex="index"
                  :playId="playId"
                  :viewName="viewName"
                  @onUninterested="handleUninterested"
                  @onCart="handleCart"
                  @onPlay="handlePlay"
                  @onGetList="getCollection"
                  @onPaySuccess="handlePaySuccess"
              ></collcetion-item>
            </template>
          </el-row>
          <div v-else-if="typeId === 5 ">
            <video-item :material-list="materialList" :addMaterial="addMaterial"
                        @onCandelCollect="getCollection()"></video-item>
          </div>
          <div v-else-if="typeId===6">
            <image-item :material-list="materialList" :addMaterial="addMaterial"
                        @onCandelCollect="getCollection()"></image-item>
          </div>
          <div v-else-if="typeId===7">
            <font-item :material-list="materialList" @onCandelCollect="getCollection"></font-item>
          </div>
          <div v-else>
            <template v-for="(item,index) in CollectionList" :key="index">
              <collcetion-item
                  v-if="loading"
                  :data="item"
                  :dataIndex="index"
                  :playId="playId"
                  @onCollection="handleCollection"
                  @onCart="handleCart"
                  @onPlay="handlePlay"
                  @onGetList="getCollection"
              ></collcetion-item>
            </template>
          </div>

          <Pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination"
                      v-if="loading && (CollectionList.length||materialList.length)>10" :hideSinglePage="false"
                      class="pagination-container-box" position="center" layout="sizes,prev, pager, next, total, jumper"></Pagination>

        </div>
        <div v-else class="empty" v-loading="!loading" element-loading-background="rgba(0, 0, 0, 0)">
          <div class="empty-box" v-if="loading">
            <img src="@/assets/material/myCollection-empty.png">
            <div class="empty-text">你还没有收藏该类型的素材</div>
            <div class="empty-btn" @click.stop="handleToIndex">先去逛逛吧</div>
          </div>
        </div>

      </el-scrollbar>

    </div>
  </el-container>
</template>
<script setup name="material-myCollection">
import MaterialLeft from "../components/MaterialLeft";
import TopTab from "../components/content/topTab";
import CollcetionItem from "./collectionItem";
import {ref, onMounted} from "vue";
import {getCollectionList, getTypeOption} from "../../../api/material";
import ContentBottom from "../components/content/contentBottom";
import {useStore} from "vuex";
import FontItem from './collectionItem/fontItem'
import ImageItem from './collectionItem/imageItem.vue'
import VideoItem from './collectionItem/videoItem.vue'
import {onActivated} from "@vue/runtime-core";

const typeId = ref(-1)
const typeName = ref(1)
const CollectionList = ref([])
const materialList = ref([])
const testList = ref()
const loading = ref(true)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(50)
const playId = ref(0)
const store = useStore();
const viewName = ref('中国智造ABCabc123');
const scroll = ref(null)
onMounted(() => {
  // getCollection()
  loading.value = false
})
const router = useRouter();
// 先去逛逛吧
const handleToIndex = ()=>{
  router.push({path:'/material/main/index'})
}

// 类型改变
function handleChangTab(item) {
  loading.value = false
  typeId.value = item.typeId
  typeName.value = item.typeName
  pageNum.value = 1;
  if (![5, 6].includes(typeId.value)) {
    pageSize.value = 10;
  } else {
    pageSize.value = 50;
  }
  getCollection()
}

// 页码改变
function handleCurrentChange(num) {
  loading.value = false
  pageNum.value = num
  getCollection()
}

function onSizeChange(num) {
  loading.value = false;
  pageSize.value = num;
  getCollection();
}

// 获取素材
function getCollection() {
  const query = {
    typeId: typeId.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }
  getCollectionList(query).then(res => {
    total.value = res.total
    CollectionList.value = []
    materialList.value = res.rows;
    res.rows.forEach(el => {
      const obj = el.material
      if (el.material.fileAttachedInfoDto) {
        obj.fileData = JSON.parse(el.material.fileAttachedInfoDto?.fileInfo.metaData)
        obj.fileAttachedInfoDto.audioWave = JSON.parse(el.material.fileAttachedInfoDto.audioWave)
      }
      CollectionList.value.push(obj)
    });
    loading.value = true
  })
}

onActivated(() => {
  // 缓存重新激活时初始化数据
  pageNum.value = 1;
  if (typeId.value !== -1) {
    getCollection()
  }
})

//购物车
function handleCart(index) {
  CollectionList.value[index].shoppingCart = !CollectionList.value[index].shoppingCart
  getCollection()
}

function handleCollection(index) {
  // CollectionList.value[index].collection = !CollectionList.value[index].collection
  getCollection()
}

// 当前播放
function handlePlay(pid) {
  playId.value = pid
}

// 不感兴趣
function handleUninterested() {
  getList()
}

// 支付成功
function handlePaySuccess(item) {
  const orderArr = []
  CollectionList.value.forEach(el => {
    const obj = el
    if (el.id === item.id) {
      obj.state = 1
    }
    orderArr.push(obj)
  })
  CollectionList.value = orderArr
}

// //头部标签tab
// let tabListShow = ref([{typeName: "默认", typeId: -1}])
// getTypeOption().then((res) => {
//   tabListShow.value = [];
//   res.data.forEach((item)=>{
//     if (item.disable === 1) {
//       tabListShow.value.push(item)
//     }
//   })
//   store.commit('material/SET_TYPE_TAB_DATA', res.data)
// })

const addMaterial = ref([])
// function addMaterialList(){
//   // 计算总页数
//   const pageCount = (total.value + pageSize.value - 1) / pageSize.value;
//   // console.log("pageCount",total.value,pageSize.value,pageSize.value)
//   pageNum.value++;
//   if (pageNum.value>pageCount){
//     // console.log("最后一页了")
//     return;
//   }
//   const query = {
//     typeId: typeId.value,
//     pageNum: pageNum.value,
//     pageSize:pageSize.value,
//   }
//   getCollectionList(query).then(res => {
//     addMaterial.value=res.rows;
//   })
// }
// function staScrollFun() {
//   let sta = scroll.value.wrap$
//   let offsetHeight = sta.offsetHeight
//   let scrollTop = sta.scrollTop
//   let scrollHeight = sta.scrollHeight
//   if (offsetHeight + scrollTop >= scrollHeight&&(typeId.value===5||typeId.value===6)) {
//     addMaterialList();
//   }
// }

const handlePagination = ({page, limit}) => {
  loading.value = false
  pageNum.value = page;
  pageSize.value = limit;
  getCollection();
}
</script>
<style scoped lang="scss">
.header-content {
  flex-grow: 1;
  //flex-shrink: 0;
  overflow: hidden;
  height: 100%;
  background-color: #0A0B0D;
  padding: 0 24px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 1px solid #353535;

  .collection-main {
    height: calc(100vh - 132px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content-bottom {
      width: 100%;
      bottom: 32px;
      display: flex;
      justify-content: center;
    }
  }

  :deep(.el-scrollbar__view) {
    height: calc(100vh - 61px);
  }

  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .empty-box{
      display: flex;
      flex-direction: column;
      align-items: center;
      img{
        width: 201px;
        height: 105px;
      }
      .empty-text{
        margin-top: 42px;
        font-size: 14px;
        font-weight: 400;
        color: #3D3F50;
        line-height: 14px;
        margin-bottom: 18px;
      }
      .empty-btn{
        padding: 9px 15px;
        height: 32px;
        background: rgba(216,216,216,0);
        border-radius: 8px;
        color: #3468FE;
        border: 1px solid #3468FE;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  .pagination-container-box {
    padding-bottom: 20px;
  }

}
</style>
