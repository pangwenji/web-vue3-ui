<template>
  <el-container style="height: 100%">
<!--    <MaterialLeft></MaterialLeft>-->
      <div class="content-box" v-loading="!loading" element-loading-background="rgba(0,0,0,0)" v-if="empty">
        <el-scrollbar style="width: 100%;">
        <template v-if="loading">
        <div class="content-left">
          <div style="height: 100%;">
            <left-card v-if="detail.typeId" :detail="detail"></left-card>
          </div>
        </div>
        <div class="content-right">
          <RightCard
              :detail="detail"
              @onCollection="handleCollection"
              @onCart="handleCart"
              @onDetails="getDetails()"
          ></RightCard>
        </div>
        </template>
        </el-scrollbar>
      </div>
      <div class="content-box" v-else>
        <div class="empty-box">
          <img src="@/assets/material/details/empty.png">
          <span style="font-size: 18px;">作品已下架</span>
          <span style="font-size: 14px;margin-top: 14px">当前作品已下架，去看下其他作品吧</span>
        </div>
      </div>

  </el-container>
</template>
<script setup>
import MaterialLeft from '../components/MaterialLeft';
import SoundCard from './leftCard/soundCard';
import RightCard from './rightCard';
import ProjectCard from './leftCard/projectCard';
import VideoCard from './leftCard/videoCard';
import PictureCard from './leftCard/pictureCard';
import leftCard from './leftCard';
import {useStore} from 'vuex';
import {getMaterialDetail} from '@/api/material/index.js';
import {onMounted} from 'vue-demi';
import {ref} from 'vue';
import LeftCard from './leftCard';
import {isRelogin} from "../../../utils/request";

const route = useRoute();

const materialId = ref(0);

onMounted(() => {
  materialId.value = route.params.id;
  getDetails();
});

const detail = ref({});
const loading = ref(true)
const empty = ref(true)
function getDetails() {
  loading.value = false
  getMaterialDetail({id: materialId.value}).then((res) => {
    detail.value = res.data;
    if ([1, 2].includes(detail.value.typeId)) {
      detail.value.fileAttachedInfoDto.audioWave = JSON.parse(
          detail.value.fileAttachedInfoDto.audioWave
      );
      detail.value.metaData = JSON.parse(
          detail.value.fileAttachedInfoDto.fileInfo.metaData
      );
    }
    loading.value = true
  }).catch((err) => {
    console.log('err',err)
    empty.value =false
  });
}

function handleCollection() {
  if (detail.value.collection){
    detail.value.collectionCount--
  }else {
    detail.value.collectionCount++
  }
  detail.value.collection = !detail.value.collection
}

function handleCart() {
  detail.value.shoppingCart = !detail.value.shoppingCart
}



</script>

<style scoped lang="scss">
.content-box {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
  background-color: #0a0b0d;
  //flex-shrink: 0;
  padding: 28px 25px;
  user-select:text;
  :deep(.el-scrollbar__view){
    display: flex;
    height: auto;
  }
  .content-left {
    width: 70%;
  }

  .content-right {
    width: 30%;
    margin-left: 20px;
  }

  .empty-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #3D3F50;
    justify-content: center;
    width: 100%;
    height: 100%;
    img{
      width: 180px;
      height: 160px;
      margin-bottom: 30px;
    }
  }
}
</style>
