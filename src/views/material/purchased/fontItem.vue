<template>
  <div v-for="item in dataList"
       :key="item.id"
       class="font-box">
    <div class="font-top">
      <span>{{ item.material.name }}</span>
      <div>
        <span v-if="item.authorName">作者：{{ item.material.authorName }}</span>
        <span>格式：{{ item.material.fileAttachedInfoDto.fileInfo.fileCat.toUpperCase() }}</span>
      </div>

    </div>
    <div class="font-bottom css-font-539-16454335700472"
    >
      <div style="font-size: 24px">
        <div style="font-size: 24px;" v-if="item.fontHtml" v-html="item.fontHtml"></div>
        <p
            :style="{fontFamily: `font-${item.material.id}`}">
        <span v-if="item.loading" style="font-size: 20px">
          <el-icon class="is-loading">
          <Loading/>
          </el-icon>
          字体渲染中...
        </span>
          <span v-else>{{ viewName }}</span>
        </p>
      </div>
      <div class="bright" style="height: 100%;align-items: center;">
        <div class="icon" style="margin-top: 0" @click="collectMaterial(item)">
          <el-tooltip
              class="box-item"
              effect="light"
              :content="item.material.collection ?'移出收藏':'加入收藏'"
              placement="top"
              :show-after="500"
          >
            <img  :src="item.material.collection ? noShoucang : shoucang"/>
          </el-tooltip>
        </div>
        <div class="buy" @click.stop="downMaterial(item.material.id)">立即下载</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import shoucang from '@/assets/material/materialMain/icon_shoucang_to.png';
import noShoucang from '@/assets/material/materialMain/icon_shoucang_no.png';
import {addCollection, deleteCollection} from "../../../api/material/collection";
import {downloadFileCurrent} from "../../../utils/tool";
import {downloadMaterial} from '@/api/material/index'
const props = defineProps({
  materialList: {
    type: Array,
    default: [],
  },
})
let dataList = ref([]);
onMounted(() => {
  watch(() => props.materialList, newVal => {
    if (props.materialList) {
      dataList.value = [];
      document.fonts.clear();
      toFontStyle();
    }
  })
  document.fonts.clear();
  dataList.value = [];
  toFontStyle();
})

const viewName = ref("中国制造ABCabc123")
// 返回style
const toFontStyle = () => {
  const host = import.meta.env.VITE_APP_API_PROXY || '';
  props.materialList.forEach(res => {
    if (res.material.typeId === 7) {
      // FontFace=undefined;
      // 检测兼容性
      if (typeof FontFace === 'undefined') {
        res.fontHtml = `<style>
            @font-face {
                font-family: 'font-${res.material.id}';
                src: url('${host}/material/material/buildFontFile?format=ttf&words=${encodeURIComponent(viewName.value)}&materialId=${res.material.id}') format('truetype');
                font-weight: normal;
                font-style: normal;
          } </style>`
        res.loading = false;
        dataList.value.push(res)
      } else {
        const font = new FontFace(
            `font-${res.material.id}`,
            `url('${host}/material/material/buildFontFile?format=ttf&words=${encodeURIComponent(viewName.value)}&materialId=${res.material.id}') format('truetype')`
        );
        document.fonts.add(font);
        res.loading = true;
        font.load().then(() => {
          res.loading = false;
        }).catch(() => {
          res.loading = false;
        })
        dataList.value.push(res)
      }


    }
  })
}

// 下载素材
function downMaterial(id) {
  const query = {
    id
  }
  downloadMaterial(query).then(res => {
    const url = res.data.downloadUrl
    const filename = res.data.filename
    downloadFileCurrent(url, filename)
  })
}

function collectMaterial(row){
  row.material.collection=!row.material.collection;
  if (row.material.collection){
    addCollection({materialId:row.material.id})
  }else {
    deleteCollection({id:row.material.id})
  }
}
</script>

<style scoped lang="scss">
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

.buy {
  margin: auto;
  margin-left: 0px;
  font-size: 12px;
  width: 90px;
  height: 32px;
  background: linear-gradient(45deg, #0459FF 0%, #5726DD 100%);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0;
}

.buy:hover {
  font-weight: bold;
  cursor: pointer;
}

.icon {
  margin-top: auto;
  margin-right: 8px;
  width: 30px;
  height: 30px;
  font-size: 30px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 33px;
    height: 33px;
  }
}
</style>
