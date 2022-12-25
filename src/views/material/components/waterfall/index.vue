<template>
  <el-scrollbar ref="scroll" wrap-class="image-component__scroll" @scroll="ScrollFun"
                style="width: 100%;height: 100%;">
    <div>
      <div class="header-content-mid">
        <content-top
            :total="total"
            :typeId="typeId"
            @onImageTagChange="imageTagChange"
        ></content-top>
      </div>
      <div class="header-content-midTwo">
        <content-mid
            :typeName="typeName"
            :total="total"
            :typeId="typeId"
            @onSortChange="handleSortChange"
            @onKeywordChange="handleKeywordChange"
        ></content-mid>
      </div>
    </div>
    <div style="min-height: calc(100% - 242px);" v-if="imageDataList.length > 0">
    <div id="waterfall" ref="waterfall" class="waterfall" v-loading="!loading"
         element-loading-background="rgba(0, 0, 0, 0)">
      <div class="image-item" v-for="item in imageDataList" :key="item.id" :style="item.style">
        <div class="image-cell" :style="item.parentStyle" v-loading="!item.load" element-loading-background="rgba(0,0,0,0)">
          <div class="image-content" @click="toDetails(item.materialId)">
            <img class="image" :style="{'background-color': item.load ? 'white' : 'black'}"  @load="item.load = true" :src="item.webformatUrl">
          </div>
          <div class="card-btm-tag"><span v-for="tag in item.tags.split(',')" v-html="tag"></span></div>
          <div class="collect-cart-down">
            <div class="icon" @click.stop="handleAddUninterested(item.materialId)">
              <el-tooltip class="box-item" effect="light" content="不感兴趣" placement="top" :show-after="500">
                <img :src="noInterest" width="100%" height="100%"/>
              </el-tooltip>
            </div>
            <div class="icon" @click.stop="handleAddOrDelCollection(item,index)">
              <el-tooltip class="box-item" effect="light" :content="item.isCollection ?'移出收藏':'加入收藏'" placement="top"
                          :show-after="500">
                <img :src="item.isCollection ? noShoucang : shoucang" width="100%" height="100%"/>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
<!--      <el-backtop target=".image-component__scroll" :right="50" :bottom="35" :visibility-height="50"></el-backtop>-->
    </div>
    </div>
    <div class="empty" v-else v-loading="!loading" element-loading-background="rgba(0, 0, 0, 0)">
      <span v-if="loading"><empty></empty></span>
    </div>
    <Pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination" :hideSinglePage="false"
                layout="sizes,prev, pager, next, total, jumper"  v-if="total > 10 && loading"
                class="pagination-container-box" position="center"></Pagination>
  </el-scrollbar>
</template>

<script setup>
import {watch} from "vue";
import {onMounted, nextTick} from "vue";
import {ref} from "vue";
import {useRouter} from "vue-router"
import shoucang from '@/assets/material/materialMain/icon_shoucang_to.png';
import noShoucang from '@/assets/material/materialMain/icon_shoucang_no.png';
import noInterest from '@/assets/material/icon_interest.png';
import {addCollection} from "../../../../api/material/collection";
import {ElMessage, ElMessageBox} from "element-plus";
import {getImageList, getVideoList, saveUninterested} from "../../../../api/material";
import ContentTop from "../content/contentTop";
import ContentMid from "../content/contentMid";
import ContentBottom from "../content/contentBottom";
import Empty from "../empty";

const props = defineProps({
  imageList: {
    type: Array,
    default: [],
  },
  typeName: {
    type: String,
    default: ''
  },
  typeId: {
    type: Number,
    default: 6
  },
  pageSize: {
    type: Number,
    default: 50
  },
  pageNum: {
    type: Number,
    default: 1
  },
})

const imageDataList = ref([])
const loading = ref(true);
onMounted(() => {
  emit('onGetList', true)
})
// const pageNum = ref(1)
const total = ref(1)
let timer = null
const getData = (e) => {
  imageDataList.value = []
  loading.value = false
  if (timer) {
    clearTimeout(timer);
    timer = null
  }
  timer = setTimeout(() => {
    timer = null
    getImageList(e).then(res => {
      if (!timer) {
        res.rows.forEach((item) => {
          appendImage(item)
        })
        emit('onSucceed', true)
        total.value = res.total
        loading.value = true
      }
    }).catch(err => {
      if (!timer) {
        loading.value = false
      }
    })
  }, 800)
}

const emit = defineEmits(['onGetList', 'onImageTagChange', 'onSortChange', 'onKeywordChange', 'onGetList', 'onSucceed', 'pagination']);

function imageTagChange(obj) {
  emit('onImageTagChange', obj);
}

function handleSortChange(sortType) {
  emit('onSortChange', sortType);
}

function handleKeywordChange(word) {
  emit('onKeywordChange', word);
}

//需要返回给父组件的方法,用defineExpose传递出去
defineExpose({
  getData
})

const scroll = ref(null)

function ScrollFun() {
  let sta = scroll.value.wrap$
  let offsetHeight = sta.offsetHeight
  let scrollTop = sta.scrollTop
  let scrollHeight = sta.scrollHeight
  if (offsetHeight + scrollTop >= scrollHeight - 1) {
    if (imageDataList.value.length < total.value && loading.value) {
      // emit('onGetList', true)
    }
  }
}

const waterfall = ref();
const imageHeight = 200;
const imgMaxWidth = 500
const imgMaxHeight = 400
function appendImage(item) {
  item.parentStyle = {}
  item.style = {}
  const coverHeight = item.webformatHeight;
  let width = item.webformatWidth;
  let height = item.webformatHeight;
  if (height <= 300) { //设置阈值小于这个值将宽高放大 300px
    height = height + 300;
    width = (width / coverHeight) * height;
  }else if(width > imgMaxWidth){
    height = ( imgMaxWidth / width) * height;
    width = imgMaxWidth
  }else if(height > imgMaxHeight){
    width = (imgMaxHeight / height) * width;
    height = imgMaxHeight
  }
  const scaleWidth = (width / height) * imageHeight; //获取外边框高度为200的宽度
  item.style.flexBasis = scaleWidth + 'px';
  item.style.maxWidth = width + 'px';
  item.parentStyle.paddingTop = ((height / width) * 100) + '%';
  item.style.flexGrow = width / height;
  item.style.flexShrink = width / height;
  imageDataList.value.push(item);
}

const router = useRouter();
//跳转详情页
const toDetails = (id) => {
  if (id) {
    router.push({
      path: `details/${id}`,
    });
  }
};


// 不感兴趣
function handleAddUninterested(materialId) {
  emit('onOpenNoInter',materialId);
}

//避免重复提交：当timeState=false时才能提交，
// 定义state初始值为false
const timeState = ref(false);

// 加入/删除收藏
function handleAddOrDelCollection(item) {
  const params = {
    materialId: item.materialId,
  };
  if (timeState.value === false) {
    timeState.value = true;
    addCollection(params).then((res) => {
      item.isCollection = !item.isCollection
    });
    setTimeout(() => {
      timeState.value = false
    }, 1000)
  }
}

// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
  backTop()
  emit('pagination',{ page, limit });
}
//回到顶部
function backTop() {
  scroll.value.scrollTo(0, 0)
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
.pagination-container-box {
  padding-bottom: 20px;
}
</style>
