<template>
  <div style="display: flex;    flex-direction: column;">
    <div class="top-box">
      <el-button class="top-btn" round>音频</el-button>
      <el-button class="top-btn" round>视频</el-button>
      <el-button class="top-btn" round>图片</el-button>
    </div>
    <el-scrollbar class="Showreel-main" :height="scollHeight">
      <div class="main-box">
        <el-row>
          <el-col :xl="4"
                  :lg="6"
                  :span="6" v-for="(item,index) in 10">
            <div class="card-item">
              <div class="cover">
                <div class="praise" v-if="index === 0 || index === 7 ">❤</div>
              </div>
              <div class="card-btm">
                <div class="card-t">耽美广播剧配音耽美广播剧配音</div>
                <div class="btm-r">
                  99
                  <el-icon style="margin-left: 3px">
                    <View/>
                  </el-icon>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>

  </div>
</template>

<script setup>

import {useWindowSize} from "@vueuse/core/index";
import {watchEffect} from "vue";

const {height} = useWindowSize();
const scollHeight = ref()
watchEffect(() => {
  scollHeight.value = height.value -362
});

</script>

<style scoped lang="scss">
.top-box {
  display: flex;

  .top-btn {
    background: transparent;
  }
}

.Showreel-main {
  width: 100%;
  flex: auto;
  padding: 20px 0px;

  &:deep(.el-scrollbar__wrap) {
    width: 100%;
  }
}

.main-box {

  .card-item {
    width: 90%;
    margin-bottom: 20px;

    .cover {
      background-image: url("@/assets/material/picture1.png");
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 20px;
      width: 100%;
      height: 100%;
      min-height: 180px;
      cursor: pointer;
      position: relative;

      .praise {
        position: absolute;
        right: 12px;
        top: 10px;
        font-size: 22px;
        color: #ff5555;
      }
    }

    .card-btm {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 5px;

      .card-t {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .btm-r {
        display: flex;
        align-items: center;
        margin-left: 3px;
      }
    }
  }
}

</style>
