<template>
  <el-scrollbar ref="scroll" style="width: 100%;">
    <div style="width: 100%;">
      <div class="header-content-mid">
        <content-top
            ref="ContentTopRef"
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
      <el-row :gutter="10">
        <template v-for="(item, index) in materialList" :key="item">
          <el-col :style="{maxWidth: cardWidth,flex:cardWidth?('0 0 ' + cardWidth + '%') : false}"  style="width: 100%;padding-bottom: 10px;">
            <div class="file-item-card" @click.stop="toDetails(item.id)">
              <div class="purchased-box" v-if="item.purchase">已购</div>
              <div class="file-item-content">
                <div class="file-item-cover file-item-image">
                  <!--          工程封面-->
                  <div v-if="item.typeId === 3 && item.coverFileId || item.typeId === 4 && item.coverFileId "
                       class="projImg"
                       :style="{ 'background-image': `url(${item.coverUrl})` }">
                  </div>
                  <!--          工程无封面时显示coverUrl-->
                  <div v-else-if="(item.typeId === 3 && !item.coverFileId) || (item.typeId === 4 && !item.fileAttachedInfoDto?.cover)" style="height: 100%;width:100%;padding: 10px;background-repeat: no-repeat;">
                    <FileType type="url" :url="item.coverUrl"></FileType>
                  </div>
                </div>

                <div class="collect-cart-down">
                  <div class="icon">
                    <el-tooltip class="box-item" effect="light" content="不感兴趣" placement="top" :show-after="500">
                      <img :src="noInterest" @click.stop="handleAddUninterested(item.id)"/>
                    </el-tooltip>
                  </div>
                  <div class="icon">
                    <el-tooltip class="box-item" effect="light" :content="item.collection ?'移出收藏':'加入收藏'"  placement="top" :show-after="500">
                      <img :src="item.collection ? noShoucang : shoucang" @click.stop="handleAddOrDelCollection(item)"/>
                    </el-tooltip>
                  </div>

                  <div v-if="!item.purchase" class="icon">
                    <el-tooltip class="box-item"  effect="light" :content="item.shoppingCart ?'移出购物车':'加入购物车'"  placement="top"  :show-after="500"                    >
                      <img  :src="item.shoppingCart ? aShoppingCart : ShoppingCart" @click.stop="handleAddOrDelCart(item)" />
                    </el-tooltip>
                  </div>
                  <div v-else class="icon" @click.stop="" style="opacity:.4;cursor:not-allowed">
                    <el-tooltip
                        class="box-item"
                        effect="light"
                        content="已购买"
                        placement="top"
                        :show-after="500"
                    >
                      <img :src="ShoppingCart"/>
                    </el-tooltip>
                  </div>
                </div>

                <div class="file-item-info">
                  <div class="detail">
                    <div class="top">
                      <div class="title">
<!--                        {{ item.name }}-->
                        <span v-html="item.name"></span>
                      </div>
                      <div class="ztag">
                        <img src="@/assets/material/title-tag1.png">
                        <img src="@/assets/material/title-tag2.png">
                      </div>
                    </div>
                    <div class="detail-bottom">
                      <div class="left" style="width: 100%">
                        <div class="price">
                          <div class="vcost">
                            <template v-if="store.state.user.member.state !== 1">
                              <span class="title">原价</span>
                              <span> {{ (item.price === 0 || item.price === null) ? '免费' : item.price || '免费' }}</span>
                              <div class="section32 tongqian"></div>
                            </template>
                            <template v-else>
                              <span class="title" v-color="'#45464D'">原价</span>
                              <span style="text-decoration: line-through;color: #45464D;"> {{
                                  (item.price === 0 || item.price === null) ? '免费' : item.price || '免费'
                                }}</span>
                              <div class="section33 tongqian"></div>
                            </template>
                          </div>
                          <div class="vcost">
                            <span class="title">会员价</span>
                            <span>{{ (item.memberPrice === 0 || item.memberPrice === null) ? '免费' : item.memberPrice || '免费' }}</span>
                            <div class="section32 tongqian"></div>
                          </div>
                        </div>
                      </div>
                      <div class="right">
                        <!-- 已售{{item.soldCount}} -->
                        <div class="buy" @click.stop="handleDownload(item)">立即购买</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
    <div v-else class="empty" v-loading="!load"
         element-loading-background="rgba(0, 0, 0, 0)">
      <span v-if="load"><empty></empty></span>
    </div>
    <Pagination :total="materialTotal" :page="pageNum" :limit="pageSize" @pagination="handlePagination"
                :hideSinglePage="false" :pageSizes=" [12, 20, 30, 50]"
                layout="sizes,prev, pager, next, total, jumper" v-if="load && materialTotal >10"
                class="pagination-container-box" position="center"></Pagination>
  </el-scrollbar>
</template>

<script setup>
import {getMaterialList, saveUninterested} from "@/api/material";
import noInterest from '@/assets/material/icon_interest.png';
import ShoppingCart from '@/assets/images/icon_Shopping Cart.png';
import aShoppingCart from '@/assets/images/aShoppingCart.png';
import shoucang from '@/assets/material/materialMain/icon_shoucang_to.png';
import noShoucang from '@/assets/material/materialMain/icon_shoucang_no.png';
import ContentTop from "../../components/content/contentTop";
import ContentMid from "../../components/content/contentMid";
import ContentBottom from "../../components/content/contentBottom";
import {ref, onMounted, defineExpose} from "vue";
import {useRouter} from "vue-router";
import {addShoppingCart} from "@/api/material/shoppingCart";
import {ElMessage, ElMessageBox} from "element-plus";
import {addCollection} from "../../../../api/material/collection";
import Empty from "../../components/empty";
import {useWindowSize} from "@vueuse/core/index";
import FileType from '@/components/FileType';
const store = useStore();
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
  emit('onGetList', true)
  watchEffect(() => {
    onresize(width.value)
  })
})

// 设置标签
const ContentTopRef = ref();


const emit = defineEmits(['pagination', 'onTagsChange', 'onSortChange', 'onKeywordChange',
  'onGetList', 'onSucceed', 'onDownload']);

function handleTagsChange(tagsIds, labIds) {
  emit('onTagsChange', tagsIds, labIds);
}

function handleSortChange(sortType) {
  emit('onSortChange', sortType);
}

function handleKeywordChange(word) {
  emit('onKeywordChange', word);
}

function handleDownload(item) {
  emit('onDownload', item);
}

const router = useRouter();

function toDetails(id) {
  if (id) {
    router.push({
      path: `details/${id}`,
    });
  }
}

// 定义state初始值为false
const cardState = ref(false);

function handleAddOrDelCart(item) {
  const params = {
    materialId: item.id,
  };
  if (cardState.value === false) {
    cardState.value = true;
    addShoppingCart(params).then((res) => {
      store.dispatch('material/getCartList', {pageNum: 0, pageSize: 1000});
      item.shoppingCart = !item.shoppingCart
    });
    setTimeout(() => {
      cardState.value = false
    }, 1000)
  }
}

function handleAddUninterested(id) {
  emit('onOpenNoInter', id);
}

const timeState = ref(false);

function handleAddOrDelCollection(item) {
  const params = {
    materialId: item.id,
  };
  if (timeState.value === false) {
    timeState.value = true;
    addCollection(params).then((res) => {
      item.collection = !item.collection
    });
    setTimeout(() => {
      timeState.value = false
    }, 1000)
  }
}

// 切换页数或每页数量
const handlePagination = ({page, limit}) => {
  backTop()
  emit('pagination', {page, limit});
}
const scroll = ref(null)

//回到顶部
function backTop() {
  scroll.value.scrollTo(0, 0)
}


const column = ref(4)
const cardWidth = ref()
const onresize = (clientWidth) => {
  if (clientWidth < 768) {
    column.value = 1;
  } else if (clientWidth < 1080) {
    column.value = 2;
  } else if (clientWidth < 1280) {
    column.value = 3;
  } else if (clientWidth < 1480) {
    column.value = 4;
  } else if (clientWidth < 1680) {
    column.value = 5;
  } else if (clientWidth < 1880) {
    column.value = 6;
  } else if (clientWidth < 2080) {
    column.value = 7;
  } else if (clientWidth < 2280) {
    column.value = 8;
  } else {
    column.value = 9;
  }
  cardWidth.value = String(100/column.value) + '%'
}
const { width } = useWindowSize();

</script>

<style lang="scss" scoped>
@import "../style.scss";

.material-list {
  width: 100%;
  min-height: calc(100% - 200px) !important;
  .file-item-card {
    width: 100%;
    height: 100%;
    margin-bottom: 15px;
    position: relative;
    &::after {
      content: '';
      display: inline-block;
      width: 100%;
      margin-top: 80%;
    }

    .file-item-content {
      position: absolute;
      width: 100%;
      height: 100%;
      //margin-top: 20px;
      padding: 4px;
      left: 0;
      top: 0;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #111216;;
      cursor: pointer;
      color: #ffffff;
      background-color: #111216;;


      &:hover {
        background: #1C1D24;
      }
      &:hover {
        .collect-cart-down {
          top: 6px;
        }
      }

      .file-item-cover {
        width: 100%;
        height: 67%;
        position: relative;
        background: #1c1d24;
        pointer-events: none;
        user-select: none;
        border-radius: 10px 10px 0px 0px;
        overflow: hidden;


        &.file-item-image {
          overflow: hidden;
          pointer-events: none;
          user-select: none;
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100% - 78px);

          .projImg {
            height: 100%;
            width: 100%;
            background-repeat: no-repeat;
            background-size: cover;
          }
        }


      }


      .collect-cart-down {
        position: absolute;
        top: -30px;
        right: 0;
        display: flex;
        transition: top .3s ease;
        .icon {
          width: 30px;
          height: 30px;
          background: rgba(0, 0, 0, 0.6000);
          border-radius: 15px;
          backdrop-filter: blur(3px);

          img {
            width: 30px;
            height: 30px;
          }
        }

        .icon:hover {
          background: rgba(0, 0, 0, .8);
        }
      }

      .file-item-info {
        height: 32%;
        padding: 5%;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;

        .detail {
          flex-grow: 1;
          overflow: hidden;
          user-select:text !important;
          .top {
            display: flex;
            align-items: center;

            .title {
              margin-right: 6px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
            }
          }

          .detail-bottom {
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .vcost {
              margin-top: 6px;
              font-size: 14px;
              display: flex;
              align-items: flex-end;
              line-height: 15px;

              .title {
                margin-right: 10px;
                color: #ffffff;
              }
            }

            .right .buy {
              width: 72px;
              height: 25px;
              background: #3468FE;
              border-radius: 15px;
              margin-right: 0;
              font-size: 12px;
            }
          }
        }
      }
    }
  }

}

.pagination-container-box {
  padding-bottom: 20px;
  padding-top: 10px;
}
</style>
