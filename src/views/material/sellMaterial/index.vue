<template>
  <el-container style="height:100%;">
    <div class="header-content">
      <el-scrollbar style="width: 100%;height: 100%" ref="scroll">
        <top-tab @onChangTab="handleChangTab" @onload="handleChangTab"></top-tab>
        <div class="top-box">
          <el-input
              v-model="keyword"
              :placeholder='"请输入关键词，在" + store.state.material.titleName  +"分类下检索"'
              :suffix-icon="Search"
              style="display: flex;"
              @change="handleKeywordChange"
          />
          <div style="display: flex">
            <el-button
                round
                type="primary"
                class="editBtn"
                :style="{'background': ids.length>0 ? 'linear-gradient(45deg, #0459FF 0%, #5726DD 100%)' : ''}"
                :disabled="ids.length === 0"
                @click="checkUnder"
            >批量下架</el-button>
<!--            <div class="topBtn" @click="checkUnder"  v-if="ids.length > 0 ? true : false">批量下架</div>-->
<!--            <div class="topBtn changeBtn" @click="checkUnder" v-else>批量下架</div>-->
          </div>
        </div>
        <div class="main-box" v-if="sellMaterial.length > 0">
          <div class="content">
            <SoundCartBox
                v-model:loading="loading"
                @onSortChange="handleSortChange"
                @onGetList="getSellMaterial"
                :sellMaterial="sellMaterial"></SoundCartBox>
          </div>
          <Pagination :total="total" :page="query.pageNum" :limit="query.pageSize" @pagination="handlePagination" :hideSinglePage="false"
                      layout="sizes,prev, pager, next, total, jumper"  v-if="total > 10 && loading"
                      class="pagination-container-box" position="center"></Pagination>
        </div>
        <div v-else class="empty" v-loading="!loading" element-loading-background="rgba(0, 0, 0, 0)">
          <span v-if="loading">暂无数据</span>
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
</template>
<script setup  name="material-sellMaterial">
import contentBottom from "../components/content/contentBottom";
import MaterialLeft from "../components/MaterialLeft";
import TopTab from "../components/content/topTab";
import {Search} from '@element-plus/icons-vue'
import SoundCartBox from "./sound/soundCartBox";
import WordRightPopup from "../components/WordRightPopup"
import {useStore} from "vuex";
import {computed,ref} from "vue";
import {getShelves, getTypeOption, offShelves, putShelves} from "../../../api/material";
import {onMounted} from "vue";
import {ElMessage} from "element-plus";
const drawer = ref(false)
const loading =ref(true)
const keyword = ref()
const store = useStore();
const typeId = ref(1)
const sellMaterial = ref([]) // 销售列表
const memberPriceSort = ref()//会员价
const priceSort = ref()//价格
const soldSort = ref()//销售
const commissionSort = ref()//佣金排序
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const query = ref({
  keyword: keyword.value,
  memberPriceSort: memberPriceSort.value,
  priceSort: priceSort.value,
  soldSort: soldSort.value,
  commissionSort: commissionSort.value,
  typeId: typeId.value,
  pageNum:pageNum.value,
  pageSize:pageSize.value,
})

const title = ref('')
title.value = computed(()=>{
  return store.state.material.titleName;
})
// 素材类型
const typeList = computed(()=>{
  return store.state.material.typeTabData
})
onMounted(() => {
})

// 获取销售中列表
function getSellMaterial() {
  loading.value = false
  getShelves(query.value).then(res => {
    sellMaterial.value = res.rows
    loading.value = true
    total.value = res.total
  })
}

//批量下架
//选中id
const ids = computed(() => {
  return store.state.material.ids
})
const checkUnder = () => {
  if (ids.value.length < 1) {
    ElMessage({
      showClose: true,
      message: '请选择需要下架的素材',
      type: 'warning',
      duration: 800
    })
    return
  }

  const id =  Object.values(ids.value).join(",")
  offShelves({ ids : id }).then(res => {
    ElMessage({
      showClose: true,
      message: '下架成功',
      type: 'success',
      duration: 500
    })
    store.commit("material/SET_CHECK_IDS",[])
    getSellMaterial()
  })
}

// 排序改变
function handleSortChange(type) {
  load.value = false
  if (type == 0) {
    query.value.memberPriceSort = memberPriceSort.value
    query.value.soldSort = soldSort.value
    query.value.commissionSort = commissionSort.value
    query.value.priceSort = query.value.priceSort=== 1 ? 2 : 1
  } else if (type == 1) {
    query.value.priceSort = priceSort.value
    query.value.soldSort = soldSort.value
    query.value.commissionSort = commissionSort.value
    query.value.memberPriceSort = query.value.memberPriceSort === 1 ? 2 : 1
  } else if (type == 2){ query.value.priceSort = priceSort.value
    query.value.memberPriceSort = memberPriceSort.value
    query.value.commissionSort = commissionSort.value
    query.value.priceSort = priceSort.value
    query.value.soldSort = query.value.soldSort === 1 ? 2 : 1
  }else {
    query.value.soldSort = soldSort.value
    query.value.memberPriceSort = memberPriceSort.value
    query.value.priceSort = priceSort.value
    query.value.commissionSort = query.value.commissionSort === 1 ? 2 : 1
  }
  getSellMaterial()
}
let tabListShow = ref([])
let tabListHide = ref([])
// 类型改变
function handleChangTab(item,item2,item3) {
  query.value.typeId = item.typeId
  query.value.pageSize = 10
  query.value.pageNum = 1
  keyword.value = ''
  query.value.keyword = ''
  tabListShow.value = item2
  tabListHide.value = item3
  sellMaterial.value = []
  getSellMaterial()
}
function handleKeywordChange() {
  query.value.keyword = keyword.value
  getSellMaterial()
}
const scroll = ref(null)
// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
  query.value.pageNum = page
  query.value.pageSize = limit
  scroll.value.scrollTo(0, 0)
  getSellMaterial()
}

</script>


<style scoped lang="scss">
.header-content {
  flex-grow: 1;
  overflow: hidden;

  height: 100%;
  //width: 100% -200px;
  // position: absolute;
  // top: 0;
  // left: 0;
  background-color: #0A0B0D;
  flex-shrink: 0;
  padding: 0 24px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 1px solid #353535;

  .main-box {
    height: calc(100vh - 197px);
    display: flex;
    //flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;
  }
  :deep(.el-scrollbar__view){
    height:  calc(100vh - 197px);
  }
  .empty{
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
.changeBtn{
  opacity: 0.5;
  cursor: no-drop;
}
.top-box {
  display: flex;
  justify-content: space-between;
  //height: 88px;
  align-items: center;
  margin: 10px 0px 16px 0px;
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
.pagination-container-box {
  padding-bottom: 20px;
}
</style>
