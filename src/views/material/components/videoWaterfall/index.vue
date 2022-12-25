<template>
  <el-scrollbar ref="scroll" @scroll="ScrollFun" wrap-class="video-component__scroll" style="width: 100%;height: 100%;">
    <div style="    height: 100%;">
      <div>
        <div class="header-content-mid">
          <content-top
              :total="total"
              :typeId="typeId"
              @onVideoTagChange="videoTagChange"
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
      <div style="min-height: calc(100% - 242px);" v-if="videoDataList.length > 0">
      <div id="videoWaterfall" ref="videoWaterfall" class="videoWaterfall"
           v-loading="!loading" element-loading-background="rgba(0, 0, 0, 0)">
        <div class="video-item" v-for="(item,index) in videoDataList" :key="index" :style="item.style">
          <div class="video-cell" :title="item.name" @click.stop="toDetails(item.materialId)"
               element-loading-background="rgba(0,0,0,0)" :style="item.parentStyle" v-loading="!item.load">
            <div class="time">{{ item.dpi }} &nbsp;{{ secondToDate(item.duration) }}</div>
            <div class="video-content">
              <img @load="item.load = true" :class="{'cover-img': item.spriteImageUrl}" :src="item.webformatUrl"/>
              <div class="file-item-cover file-item-video" @mousemove="handleMouseMoveVideo($event,item)"
                   v-if="item.spriteImageUrl">
                <div class="sprite" :style="{ width: `${item.viewWidth}px`, height: `${item.viewHeight}px`,
                              'background-image': 'url(' + item.spriteImageUrl + ')',
                              'background-position-y': '-' + String(item.offsetY) + 'px',
                              }"></div>
              </div>
              <div class="progress">
                <div :style="{ width: String(item.percentage) + '%' }" class="progress-outer"></div>
              </div>
            </div>
            <div class="card-btm-tag"><span v-for="tag in item.tags.split(',')" v-html="tag"></span></div>
            <div class="collect-cart-down">
              <div class="icon" @click.stop="handleAddUninterested(item.materialId)">
                <el-tooltip class="box-item" effect="light" content="不感兴趣" placement="top" :show-after="500">
                  <img :src="noInterest" style="width:100%;height:100%"/>
                </el-tooltip>
              </div>
              <div class="icon" @click.stop="handleAddOrDelCollection(item)">
                <el-tooltip class="box-item" effect="light" :content="item.isCollection ?'移出收藏':'加入收藏'" placement="top"
                            :show-after="500">
                  <img :src="item.isCollection ? noShoucang : shoucang" style="width:100%;height:100%"/>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
<!--        <el-backtop target=".video-component__scroll" v-if="loading" :right="50" :bottom="35" :visibility-height="50"></el-backtop>-->
      </div>
      </div>
      <div v-else class="empty" v-loading="!loading" element-loading-background="rgba(0, 0, 0, 0)">
        <span v-if="loading"><empty></empty></span>
      </div>
      <Pagination :total="total" :page="pageNum" :limit="pageSize" @pagination="handlePagination" :hideSinglePage="false"
                  layout="sizes,prev, pager, next, total, jumper"  v-if="total > 10 && loading"
                  class="pagination-container-box" position="center"></Pagination>
    </div>
  </el-scrollbar>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router"
import {ElMessage, ElMessageBox} from "element-plus";
import {saveUninterested} from "@/api/material";
import {secondToDate, formatSize} from '@/utils/tool.js';
import shoucang from '@/assets/material/materialMain/icon_shoucang_to.png';
import noShoucang from '@/assets/material/materialMain/icon_shoucang_no.png';
import noInterest from '@/assets/material/icon_interest.png';
import {addCollection} from "../../../../api/material/collection";
import {getVideoList} from "../../../../api/material";
import ContentTop from "../content/contentTop";
import ContentMid from "../content/contentMid";
import ContentBottom from "../content/contentBottom"
import {onMounted} from "vue-demi";
import Empty from "../empty";
const props = defineProps({
  typeName: {
    type: String,
    default: ''
  },
  total: {
    type: Number,
    default: 0
  },
  typeId: {
    type: Number,
    default: 5
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

const imageHeight = 200;
const videoWaterfall = ref();
const videoDataList = ref([]);
const loading = ref(true);

const total = ref(1)
const reqState = ref(true)
let timer = null
function getData (e) {
  // if (e.pageNum && e.pageNum == 1) {
    videoDataList.value = []
    loading.value = false
  // } else {
  //   e.pageNum = pageNum.value
  // }
  if (timer) {clearTimeout(timer);timer = null}
  timer = setTimeout(()=>{
    timer = null
    getVideoList(e).then(res => {
      if (!timer) {
        res.rows.forEach((item) => {
          appendVideo(item)
        })
        emit('onSucceed', true)
        total.value = res.total
        loading.value = true
        reqState.value = true
      }
    }).catch(err=>{
      if (!timer){
        loading.value = false
      }
    })
  },800)
}
//需要返回给父组件的方法,用defineExpose传递出去
defineExpose({getData})

const videoMaxWidth = 500
const videoMaxHeight = 400
function appendVideo(item) {
  item.parentStyle = {}
  item.style = {}
  const coverHeight = item.webformatHeight;
  let width = item.webformatWidth;
  let height = item.webformatHeight;
  if (height <= 300) { //设置阈值小于这个值将宽高放大 300px
    height = height + 300;
    width = (width / coverHeight) * height;
  }else if(width > videoMaxWidth){
    height = ( videoMaxWidth / width) * height;
    width = videoMaxWidth
  }else if(height > videoMaxHeight){
    width = (videoMaxHeight / height) * width;
    height = videoMaxHeight
  }
  const scaleWidth = (width / height) * imageHeight; //获取外边框高度为200的宽度
  item.style.flexBasis = scaleWidth + 'px';
  item.style.maxWidth = width + 'px';
  item.parentStyle.paddingTop = ((height / width) * 100) + '%';
  item.style.flexGrow = width / height;
  item.style.flexShrink = width / height;
  //分辨率HK/4D计算
  const videosInfo = JSON.parse(item.videos || '{}')
  let wd = parseInt(videosInfo.large.height) * parseInt(videosInfo.large.width)
  if (wd === 2160 * 3840 || wd > 2160 * 3840) {
    item.dpi = '4K'
  } else {
    item.dpi = 'HD'
  }
  videoDataList.value.push(item);
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
const emit = defineEmits(['onGetList', 'onTagsChange', 'onVideoTagChange', 'onSortChange', 'onKeywordChange', 'onGetList', 'onSucceed', 'onCurrentChange', 'onSizeChange','pagination']);

function videoTagChange(obj) {
  emit('onVideoTagChange', obj);
}

function handleSortChange(sortType) {
  emit('onSortChange', sortType);
}

function handleKeywordChange(word) {
  emit('onKeywordChange', word);
}

onMounted(()=>{
  emit('onGetList', true)
})
const scroll = ref(null)

function ScrollFun() {
  let sta = scroll.value.wrap$
  let offsetHeight = sta.offsetHeight
  let scrollTop = sta.scrollTop
  let scrollHeight = sta.scrollHeight
  if (offsetHeight + scrollTop >= scrollHeight - 1) {
    if (videoDataList.value.length < total.value  && reqState.value) {
      // emit('onGetList', true)
    }
  }
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
      item.isCollection = !item.isCollection;
    });
    setTimeout(() => {
      timeState.value = false
    }, 1000)
  }
}

// 不感兴趣
function handleAddUninterested(materialId) {
  emit('onOpenNoInter',materialId);
}

// 鼠标移动时计算雪碧图
// const offsetY = ref(0);
// const viewWidth = ref(0);
// const viewHeight = ref(0);
// const percentage = ref(0);
const handleMouseMoveVideo = (e, item) => {
  // const spriteImageInfo = JSON.parse(item.spriteImageInfo || '{}');
  const imageWidth = item.spriteImageWidth || 240; //雪碧图每一帧的宽度
  const imageHeight = item.spriteImageHeight || 6750; //雪碧图每一帧的高度
  const offsetX = e.offsetX;
  const offsetWidth = e.target.clientWidth.toFixed(2); //展示窗口宽度
  const offsetHeight = e.target.clientHeight.toFixed(2); //展示窗口高度
  const imageScale = imageWidth / imageHeight;
  const offsetScale = offsetWidth / offsetHeight;

  if (imageScale > offsetScale) {
    item.viewWidth = offsetWidth;
    item.viewHeight = item.viewWidth / imageScale;
  } else {
    item.viewHeight = offsetHeight;
    item.viewWidth = imageScale * item.viewHeight;
  }
  const N = item.spriteImageTotal || 100; //数量
  const NS = offsetWidth / N;
  const steep = offsetWidth / 100;
  item.offsetY = item.viewHeight * Math.round(offsetX / NS);
  item.percentage = offsetX / steep; //得到当前进度
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

.empty {
  width: 100%;
  min-height: calc(100% - 322px);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pagination-container-box {
  padding-bottom: 20px;
}
</style>
