<template>
  <el-container style="height:100%;">
    <div class="right-content">
      <el-scrollbar style="width: 100%;height: 100%" ref="scroll">
        <top-tab :hideItems="['video','image']" :showAll="true" @onChangTab="handleChangTab" @onload="handleChangTab"></top-tab>
        <div class="top-box">
          <el-input
              v-model="keyword"
              :placeholder='"请输入关键词，在" + store.state.material.titleName +"分类下检索"'
              :suffix-icon="Search"
              style="display: flex;"
              @change="handleKeywordChange"
          />
          <div style="display: flex">
            <!-- <div class="topBtn" style="margin-right: 12px" @click="toChange" v-if="ids.length > 0 ? true : false">批量修改
            </div>
            <div class="topBtn changeBtn" style="margin-right: 12px" v-else>批量修改</div> -->
            <el-button
              round
              type="primary"
              class="editBtn"
              :style="{'background': ids.length>0 ? 'linear-gradient(45deg, #0459FF 0%, #5726DD 100%)' : ''}"
              :disabled="ids.length === 0"
              @click="handleBatchDetele"
            >批量删除</el-button>
            <el-button
              round
              type="primary"
              class="editBtn"
              :style="{'background': ids.length>0 ? 'linear-gradient(45deg, #0459FF 0%, #5726DD 100%)' : ''}"
              :disabled="ids.length === 0"
              @click="toChange"
            >批量修改</el-button>
            <div class="topBtn" style="margin-right: 12px" @click="toDetails">上传素材</div>
            <div class="topBtn" @click="checkPut">批量上架</div>
          </div>
        </div>
        <div class="main-box" v-if="materialList.length > 0">
          <div class="content">
            <depotBox
                v-model:loading="loading"
                @onSortChange="handleSortChange"
                @onGetList="getMaterialList"
                @onChange="toChange"
                @onPlayAudio="handlePlayAudio"
                :materialList="materialList"
                :typeId="query.typeId"
                :typeTreeList="typeTreeList"
                :playId="playId"
            ></depotBox>
          </div>
          <Pagination :total="total" :page="query.pageNum" :limit="query.pageSize" @pagination="handlePagination" :hideSinglePage="false"
                      layout="sizes,prev, pager, next, total, jumper"  v-if="total > 10 && !loading"
                      class="pagination-container-box" position="center"></Pagination>
        </div>
        <div v-else class="empty" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
          <span v-if="!loading">暂无数据</span>
        </div>
      </el-scrollbar>
    </div>
    <div style="font-size: 20px;color: white">
      <Grid class="grid" @click.stop="drawer = !drawer"/>
      <word-right-popup v-model:show="drawer" @close="drawer=false"
                        :tabListShow="tabListShow"
                        :tabListHide="tabListHide"
                        :typeOfWork="1"
      ></word-right-popup>
    </div>
  </el-container>

  <AudioPlayDrawer
    ref="playDrawerRef"
    :playList="playList"
    @onPlayPause="handlePlayPause"
  ></AudioPlayDrawer>
</template>
<script setup name="material-depotMaterial">
import contentBottom from "../components/content/contentBottom";
import MaterialLeft from "../components/MaterialLeft";
import TopTab from "../components/content/topTab";
import {Search} from '@element-plus/icons-vue'
import depotBox from "./sound/soundCartBox";
import WordRightPopup from "../components/WordRightPopup"
import {useStore} from "vuex";
import {onMounted} from "vue-demi";
import {computed, onUpdated, ref, watch} from "vue";
import {getNotShelves} from '@/api/material/index.js'
import {getTypeOption, putShelves, getMaterialTypeTreeList, delMaterialList} from "@/api/material";
import AudioPlayDrawer from '@/components/AduioPlayDrawer'
import {ElMessage, ElMessageBox} from "element-plus";

const { proxy } = getCurrentInstance();
const store = useStore()
const router = useRouter()
const drawer = ref(false)
const loading = ref(false)
const keyword = ref('')
const memberPriceSort = ref()//会员价
const priceSort = ref()//原价
const soldSort = ref()
const commissionSort = ref()
const typeId = ref(1)
const materialList = ref([]) // 素材列表
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const route = useRoute()
const scroll = ref(null)
const query = ref({
  keyword: keyword.value,
  memberPriceSort: memberPriceSort.value,
  priceSort: priceSort.value,
  soldSort: soldSort.value,
  commissionSort: commissionSort.value,
  typeId: typeId.value,
  pageNum: pageNum.value,
  pageSize: pageSize.value
})
onMounted(() => {
  store.commit("material/SET_CHECK_LIST", [])
  store.commit("material/SET_CHECK_IDS", [])
  if (route.query.typeId) {
    query.value.typeId = parseInt(route.query.typeId)
    getMaterialList()
    getTreeList(query.value.typeId)
  }
})

//批量修改
const toChange = () => {
  const page = query.value.typeId
  router.push({
    path: 'releaseMaterial',
    query: {
      page: page,
      type: "change",
    }
  })
}

//发布素材
const toDetails = () => {
  const page = query.value.typeId
  router.push({
    path: 'releaseMaterial',
    query: {page: page}
  })
}

//批量上架
//选中id
const ids = computed(() => {
  return store.state.material.ids
})
const checkPut = () => {
  if (ids.value.length < 1) {
    ElMessage({
      showClose: true,
      message: '请选择需要上架的素材',
      type: 'warning',
      duration: 800
    })
    return
  }

  const id = Object.values(ids.value).join(",")
  putShelves({ids: id}).then(res => {
    ElMessage({
      showClose: true,
      message: '上架成功',
      type: 'success',
      duration: 800
    })
    store.commit("material/SET_CHECK_IDS", [])
    getMaterialList()
  })
}

// 素材类型
const typeList = computed(() => {
  return store.state.material.typeTabData
})

// 获取素材列表
const playList = ref([])
function getMaterialList() {
  loading.value = true
  getNotShelves(query.value).then(res => {
    materialList.value = []
    playList.value = []
    res.rows.forEach(el => {
      const obj = el
      obj.fileData = JSON.parse(el.fileAttachedInfoDto.fileInfo.metaData)
      obj.fileAttachedInfoDto.audioWave = JSON.parse(el.fileAttachedInfoDto.audioWave)
      if (obj.keywords === '' || !obj.keywords) {
        obj.keywords = []
      }else {
        obj.keywords = obj.keywords.split(',')
      }
      materialList.value.push(obj)

      if (query.value.typeId === 1 || query.value.typeId === 2) {
        playList.value.push({
          id: obj.id,
          name: obj.name,
          coverUrl: obj.coverUrl,
          duration: obj.duration,
          audioWave: obj.fileAttachedInfoDto.audioWave || [],
          url: obj.fileAttachedInfoDto?.sign?.list?.[0].key || '',
        })
      }
    });

    total.value = res.total
    loading.value = false
  })
}

let tabListShow = ref([])
let tabListHide = ref([])
// 类型改变
function handleChangTab(item,item2,item3) {
  query.value.typeId = item.typeId
  query.value.pageSize = 10
  query.value.pageNum = 1
  keyword.value = ''
  tabListShow.value = item2
  tabListHide.value = item3
  materialList.value = []
  getMaterialList()
  getTreeList(item.typeId)
}

// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
  query.value.pageNum = page
  query.value.pageSize = limit
  scroll.value.scrollTo(0, 0)
  getMaterialList()
}
//关键词
function handleKeywordChange() {
  query.value.keyword = keyword.value
  getMaterialList()
}

// 排序改变
function handleSortChange(type) {
  if (type == 0) {
    query.value.memberPriceSort = memberPriceSort.value
    query.value.soldSort = soldSort.value
    query.value.commissionSort = commissionSort.value
    query.value.priceSort = query.value.priceSort === 1 ? 2 : 1
  } else if (type == 1) {
    query.value.priceSort = priceSort.value
    query.value.soldSort = soldSort.value
    query.value.commissionSort = commissionSort.value
    query.value.memberPriceSort = query.value.memberPriceSort === 1 ? 2 : 1
  } else if (type == 2) {
    query.value.priceSort = priceSort.value
    query.value.memberPriceSort = memberPriceSort.value
    query.value.commissionSort = commissionSort.value
    query.value.priceSort = priceSort.value
    query.value.soldSort = query.value.soldSort === 1 ? 2 : 1
  } else {
    query.value.soldSort = soldSort.value
    query.value.memberPriceSort = memberPriceSort.value
    query.value.priceSort = priceSort.value
    query.value.commissionSort = query.value.commissionSort === 1 ? 2 : 1
  }
  getMaterialList()
}

const typeTreeList = ref([])
function getTreeList(typeId) {
  getMaterialTypeTreeList({typeId}).then(res => {
    typeTreeList.value = res.data.children || []
  })
}

// 批量删除
function handleBatchDetele() {
  ElMessageBox.confirm(
    '确认批量删除素材?',
    '确认删除',
    {
      customClass: 'messageBox-custom-warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    }
  ).then(() => {
    delMaterialList(ids.value).then((res) => {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      store.commit("material/SET_CHECK_LIST", [])
      store.commit("material/SET_CHECK_IDS", [])
      ids.value = []
      getMaterialList()
    })
  }).catch((err) => {
    ElMessage({
      type: 'error',
      message: '删除错误'+err,
    })
  })
}

const playDrawerRef = ref()
const playId = ref(null)
function handlePlayAudio(id) {
  playDrawerRef.value.play(id)
  if (playId.value !== id || playId.value === null) {
    playId.value = id
  } else {
    playId.value = null
  }
}

function handlePlayPause(id) {
  playId.value = id
}



</script>


<style scoped lang="scss">
.right-content {
  flex-grow: 1;
  overflow: hidden;

  height: 100%;
  //width: 100% -200px;
  // position: absolute;
  // top: 0;
  // left: 0;
  background-color: #0A0B0D;
  //flex-shrink: 0;
  padding: 0 24px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 1px solid #353535;

  .main-box {
    height: calc(100vh - 200px);
    display: flex;
    //flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;

  }

  :deep(.el-scrollbar__view) {
    height: calc(100vh - 200px);
  }

  .empty {
    width: 100%;
    height: 100%;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content-bottom {
    //margin-bottom: 32px;
    display: flex;
    justify-content: center;
  }
}

.grid {
  width: 1em;
  height: 1em;
  margin-right: 8px;
  cursor: pointer;
  position: absolute;
  right: 36px;
  top: 26px;
}

:deep(.el-input__inner) {
  background: #1E1F26;
  border-radius: 15px;
  border: 1px solid #292A30;
  color: #ffffff;
  font-size: 14px;
}

.topBtn {
  width: 110px;
  height: 40px;
  background: linear-gradient(45deg, #0459FF 0%, #5726DD 100%);
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 21px;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.editBtn {
  width: 110px;
  height: 40px;
  margin-right: 12px;
  border: none;
  font-weight: bold;
  // background: linear-gradient(45deg, #0459FF 0%, #5726DD 100%);
  border-radius: 20px;
  // color: #FFFFFF;
}

.changeBtn {
  opacity: 0.5;
  cursor: no-drop;
}

.top-box {
  display: flex;
  justify-content: space-between;
  //height: 88px;
  margin: 10px 0px 16px 0px;
  align-items: center;

  :deep(.el-input) {
    width: 240px;
    height: 30px;

    input {
      box-shadow: none; //去除白边
      font-size: 12px;

      &:focus {
        outline: 0;
      }
    }
  }
}

:deep(.el-overlay-dialog){
  display: flex;
  justify-content: center;
  align-items: center;
  .edit-keywork-dialog{
    .el-dialog__body{
      padding: 4px 20px;
    }
  }
  .key-d-box{
    width: 100%;
    padding: 10px;
    display: flex;
    background-color: rgba($color: #bbb, $alpha: .6);
    border-radius: 8px;
    .left{
      width: 80px;
      height: 28px;
      display: flex;
      flex-direction: column;
      .type{
        padding: 2px 6px;
        margin-bottom: 6px;
        color: #eee;
        background-color: #aaa;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .activeType{
        color: #fff;
        background-color: #888;
      }
    }

    .right{
      width: calc(100% - 90px);
      margin-left: 10px;
      padding-left: 20px;
      border-left: 1px solid rgba($color: #bbb, $alpha: .6);
      .el-checkbox{
        min-width: 108px;
      }
    }
  }

  .tag-add-box{
    margin-top: 10px;
    display: flex;
    align-items: center;
    position: relative;
    .el-input__inner{
      width: 200px;
      background: #fff;
      border: #0459FF;
      color: #000;
    }
    .check{
      position: absolute;
      left: 170px;
    }
    .custom-num{
      margin-left: 10px;
      opacity: .8;
    }
  }

  .tag-box{
    min-height: 30px;
    padding: 10px 0;
    .tag{
      margin-top: 10px;
      margin-right: 10px;
    }
  }

  .key-scrollbar {
    .key-scrollbar-view{
      height: 100%;
    }
    .el-scrollbar__bar{
      width: 4px;
    }
  }
}
.pagination-container-box {
  padding-bottom: 20px;
}
</style>
