<template>
  <el-scrollbar ref="scroll" style="width: 100%;">
    <div style="width: 100%;">
      <div class="header-content-mid">
        <content-top
            :treeList="typeTreeList"
            :typeId="typeId"
            @onTagsChange="handleTagsChange"
        ></content-top>
      </div>
      <div class="header-content-midTwo">
        <content-mid
            :typeName="typeName"
            :typeId="typeId"
            @onSortChange="handleSortChange"
            @onKeywordChange="handleKeywordChange"
        ></content-mid>
      </div>
    </div>
    <div class="material-list" v-if="materialList.length > 0 && load" v-loading="!load"
         element-loading-background="rgba(0, 0, 0, 0)">
      <template v-for="(item, index) in materialList" :key="item">
        <materialItem
            v-if="load"
            :data="item"
            :dataIndex="index"
            :playId="playId"
            :isOnresize="isOnresize"
            @onUninterested="handleUninterested"
            @onCollection="handleCollection"
            @onDownload="handleDownload($event,index)"
            @onCart="handleCart"
            @onPlay="handlePlay"
        ></materialItem>
      </template>
    </div>
    <div v-else class="empty" v-loading="!load"
         element-loading-background="rgba(0, 0, 0, 0)">
      <span v-if="load"><empty></empty></span>
    </div>
    <Pagination :total="materialTotal" :page="pageNum" :limit="pageSize" @pagination="handlePagination" :hideSinglePage="false"
                layout="sizes,prev, pager, next, total, jumper"  v-if="load && materialTotal > 10"
                class="pagination-container-box" position="center"></Pagination>
  </el-scrollbar>
</template>

<script  setup>
import ContentTop from "../../components/content/contentTop";
import ContentMid from "../../components/content/contentMid";
import ContentBottom from "../../components/content/contentBottom";
import MaterialItem from '../materialItem/index.vue'
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import Empty from "../../components/empty";
const store = useStore();
const playId = ref(0)
const isOnresize = ref(false)
const player = ref(null);
const playerDuration = ref(0); // 长度
const isPlay = ref(false);
const props = defineProps({
  typeTreeList: {
    type: Array,
    default: [],
  },
  materialList: {
    type: Array,
    default: [],
  },
  typeName: {
    type: String,
    default: ''
  },
  materialTotal: {
    type: Number,
    default: 0
  },
  load: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 0
  },
  pageNum: {
    type: Number,
    default: 0
  },
  typeId: {
    type: Number,
    default: 6
  },
})
onMounted(() => {
  window.onresize = () => {
    isOnresize.value = !isOnresize.value
  }
  emit('onGetList', true)
})

// 不感兴趣
function handleUninterested(materialId) {
  emit('onOpenNoInter',materialId);
}

function handleCollection(index) {
  props.materialList[index].collection = !props.materialList[index].collection
}

function handleCart(index) {
  props.materialList[index].shoppingCart = !props.materialList[index].shoppingCart
}

// 当前播放
function handlePlay(pid) {
  playId.value = pid
}

// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
  backTop()
  emit('pagination',{ page, limit });
}
const scroll = ref()
//回到顶部
function backTop() {
  scroll.value.scrollTo(0, 0)
}
const emit = defineEmits(['onTagsChange', 'onSortChange', 'onKeywordChange','pagination',
  'onGetList', 'onSucceed','onDownload','onOpenNoInter']);

function handleTagsChange(tagsIds,labIds) {
  emit('onTagsChange',tagsIds,labIds);
}

function handleSortChange(sortType) {
  emit('onSortChange', sortType);
}

function handleKeywordChange(word) {
  emit('onKeywordChange', word);
}

function handleDownload(item,index) {
  emit('onDownload', item,index);
}

const router = useRouter();
function toDetails(id) {
  if (id) {
    router.push({
      path: `details/${id}`,
    });
  }
}
</script>

<style lang="scss" scoped>
@import "../style.scss";

.material-list {
  width: 100%;
  min-height: calc(100% - 250px) !important;
  //user-select:text;
}

.flex{
  display: flex;
  align-items: center;
}

.el-row{
  align-items: center;
}
</style>
