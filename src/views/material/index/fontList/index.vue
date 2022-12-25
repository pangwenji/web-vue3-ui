<template>
  <el-scrollbar ref="scroll" style="width: 100%;height: 100%;">
    <div style="    height: 100%;">
      <div>
        <div class="header-content-mid">
          <content-top
              ref="ContentTopRef"
              :typeId="typeId"
              :treeList="typeTreeList"
              @onTagsChange="handleTagsChange"
          ></content-top>
        </div>
        <div class="header-content-midTwo">
          <content-mid
              :typeName="typeName"
              :typeId="typeId"
              :total="materialTotal"
              @onSortChange="handleSortChange"
              @onKeywordChange="handleKeywordChange"
          ></content-mid>
        </div>
      </div>
      <div>
        <div style="height: 1px;width:100%;background: rgba(255,255,255,0.1);"></div>
        <div class="flexB">
          <div class="input-box">
            <el-input
                class="input"
                v-model="font"
                @change="fontChange"
                placeholder="输入文字预览效果"
            >
              <template #suffix>
                <div class="preview" @click="previewFont">预览</div>
              </template>
            </el-input>
          </div>
          <div style="color: rgba(196,201,211,0.54);">
            <div @click="copyrightShow = true" class="copyrightText">
              <img src="@/assets/material/materialMain/icon_banquan.png"
                   style="width:14px;height: 14px;margin-right: 3px">
              <span style="line-height: 20px;">版权声明</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="materialList.length > 0 && load" v-loading="!load" element-loading-background="rgba(0, 0, 0, 0)">
        <template v-for="(item, index) in materialList" :key="item">
          <div class="font-box">
<!--            <div class="purchased-box" v-if="item.purchase">已购</div>-->
            <div class="font-top">
<!--              <span>{{ item.name }}</span>-->
              <span v-html="item.name"></span>
              <div>
                <span v-if="item.authorName">作者：{{ item.authorName }}</span>
                <span>格式：{{ item.fileAttachedInfoDto.fileInfo.fileCat.toUpperCase() }}</span>
              </div>
            </div>
            <div class="font-bottom css-font-539-16454335700472">
              <div style="font-size: 24px;" v-html="formatStyle(item)"></div>
              <div class="bright" style="height: 100%;align-items: center;">
                <div class="icon" style="margin-top: 0">
                  <el-tooltip
                      class="box-item"
                      effect="light"
                      content="不感兴趣"
                      placement="top"
                      :show-after="500"
                  >
                    <img :src="noInterest" @click.stop="handleAddUninterested(item.id)"
                    />
                  </el-tooltip>
                </div>
                <div class="icon" style="margin-top: 0">
                  <el-tooltip
                      class="box-item"
                      effect="light"
                      :content="item.collection ?'移出收藏':'加入收藏'"
                      placement="top"
                      :show-after="500"
                  >
                    <img
                        :src="item.collection ? noShoucang : shoucang"
                        @click.stop="handleAddOrDelCollection(item)"
                    />
                  </el-tooltip>
                </div>
                <div class="buy" @click.stop="handleDownload(item)">立即下载</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div v-else class="empty" v-loading="!load" element-loading-background="rgba(0, 0, 0, 0)">
        <span v-if="load"><empty></empty></span>
      </div>
      <Pagination :total="materialTotal" :page="pageNum" :limit="pageSize" @pagination="handlePagination"
                  layout="sizes,prev, pager, next, total, jumper" v-if="materialTotal > 10 && load" :hideSinglePage="false"
                  class="pagination-container-box" position="center"></Pagination>
    </div>
  </el-scrollbar>

  <!--    版权声明-->
  <el-dialog
      v-model="copyrightShow"
      width="575px"
      custom-class="dialog-center"
      center
  >
    <div class="copyright-card">
      <div class="copyright-title">放心使用，无所顾虑</div>
      <div v-for="(item,index) in copyrightList" :key="item">
        <div :style="{'margin-top' : index === 3 ? '20px' : '0'}">
          <img src="@/assets/material/materialMain/icon_draw.png" v-if="index < 3">
          <img src="@/assets/material/materialMain/icon_no.png" v-else>
          {{ item }}
        </div>
      </div>
      <div style="font-size:12px; color:#C5C7D4; margin-top:30px;">
      温馨提示：平台分享的所有免费商用字体，在发布之前已经经过多方查证，但不排除版权方或字体作者某天更改授权许可方式，如对字体授权有疑问，请联系客服或版权方及字体作者再次核实。
      </div>
    </div>
  </el-dialog>

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
import ContentTop from "../../components/content/contentTop";
import ContentMid from "../../components/content/contentMid";
import ContentBottom from "../../components/content/contentBottom";
import {onMounted} from "vue-demi";
import Empty from "../../components/empty";
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
  viewName: {
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


const loading = ref(true);
const total = ref(1)

onMounted(() => {
  emit('onGetList', true)
})

const timeState = ref(false);


// 设置标签
const ContentTopRef = ref();


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

function handleAddUninterested(id) {
  emit('onOpenNoInter',id);
}

// 返回style
const formatStyle = (item) => {
  if (props.viewName) {
    const host = import.meta.env.VITE_APP_API_PROXY || '';
    return `<style>
            @font-face {
                font-family: 'font-${item.id}';
                src: url('${host}/material/material/buildFontFile?format=ttf&words=${encodeURIComponent(props.viewName)}&materialId=${item.id}') format('truetype');
                font-weight: normal;
                font-style: normal;
          } </style>
          <p style="font-family: 'font-${item.id}'">${props.viewName}</p>`
  }
}
const font = ref('')//输入文字预览效果
const copyrightShow = ref(false)
const copyrightList = [
  '您可以免费使用，包括商用，无论个人或企业，无需标明或知会原作者',
  '您可以任意安装，自由分享，允许嵌入于app或转换成woff',
  '您可以改作，允许衍生，允但衍生的字体须按SIL Open Font license1.1条款发行',
  '您不可用于违法行为，如因此产生的纠纷或法律诉讼，平台与作者不承担任何责任',
  '您不可直接将字体作为商品出售',
  '您不可进行改造后作为商品出售'
]
function fontChange() {
  if (!font.value) {
    emit('update:viewName','中国智造ABCabc123');
    emit('update:load',false);
    emit('onGetList');
  }
}
function previewFont() {
  if (!font.value) {
    ElMessage({
      type: 'warning',
      message: '请输入文字进行预览',
    });
  } else if (font.value.length > 15) {
    ElMessage({
      type: 'warning',
      message: '最多可输入15字进行预览',
    });
  } else {
    emit('update:viewName',font.value);
  }
}

const router = useRouter();

const emit = defineEmits(['onGetList', 'onTagsChange','update:viewName','update:load',
  'pagination',, 'onKeywordChange', 'onDownload','onSortChange','onOpenNoInter']);

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

const scroll = ref(null)
//回到顶部
function backTop() {
  scroll.value.scrollTo(0, 0)
}
// 切换页数或每页数量
const handlePagination = ({ page, limit }) => {
  backTop()
  emit('pagination',{ page, limit });
}
</script>

<style lang="scss" scoped>
@import "../style.scss";
.font-box {
  width: 100%;
  color: #ffffff;
  margin-bottom: 20px;
  background-color: rgba(28, 29, 36, 0.3);
  border-radius: 8px;
  height: 120px;
  position: relative;

  .font-top {
    font-size: 14px;
    color: #9094A6;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    background: #17181E;
    height: 40px;
    padding: 13px 20px;
    display: flex;
    justify-content: space-between;
  }

  .font-bottom {
    padding: 0px 20px;
    height: 80px;
    background: #111216;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bright {
      display: flex;
    }
  }
}

.font-box:hover {
  background-color: #111216;
}

.input-box {
  height: 40px;
  width: 340px;
  background: #0A0B0D;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  :deep(.el-input) {
    input {
      box-shadow: none; //去除白边
      font-size: 12px;

      &:focus {
        outline: 0;
      }
    }
  }

  .input {
    :deep(.el-input__inner) {
      width: 220px;
      height: 32px;
      background: #1C1D24;
      border-radius: 18px;
      border: 1px solid #30323B;
    }
  }

  .preview {
    position: absolute;
    right: 110px;
    top: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: #FFFFFF;
    width: 60px;
    height: 28px;
    background: #3D3F50;
    border-radius: 16px;
  }
}

.flexB {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-dialog) {
  border-radius: 8px;
  top: 50%;
  transform: translateY(-60%);

  .el-dialog__body {
    padding-top: 0px;
  }
}

.copyright-card {
  color: #3D3F50;
  font-size: 14px;

  .copyright-title {
    font-weight: 500;
    color: #181920;
    font-size: 16px;
    margin-bottom: 30px;
    text-align: center;
  }

  div {
    margin-bottom: 8px;
  }

  img {
    width: 10px;
    height: 10px;
  }
}

</style>
