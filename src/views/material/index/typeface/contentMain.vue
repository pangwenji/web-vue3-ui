<template>
  <div class="input-box">
    <el-input
        class="input"
        placeholder="输入文字预览效果"
       >
      <template #suffix>
        <div class="preview">预览</div>
      </template>
    </el-input>
  </div>
  <div style="height: calc(100vh - 381px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;">
    <div>
      <div class="content-card" v-for="(item, index) in fontList" :key="index">
        <div class="type-title">
          <div>
            {{ item.title }}
          </div>
          <div style="margin-right: 15px;color: rgba(255,255,255,0.6);">
            {{ item.type }}
          </div>

        </div>
        <div class="line-bottom"></div>
        <div class="type-text">
          <div class="left">
            {{ item.title }}
          </div>
          <div class="right">
            <div class="icon">
              <img src="@/assets/images/icon_shoucang.png">
            </div>
            <div class="buy">
              <img :src="Download" style="width: 30px;height: 30px">
              本地下载
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="content-bottom">
      <content-bottom></content-bottom>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";

import contentBottom from "../../components/content/contentBottom";
import Download from "@/assets/images/icon_download.png"

const components = {contentBottom}

const setup = () => {
  const fontList = ref([{
    title: '新地黑板报',
    type: '中文字体',
  },
    {
      title: '新地黑板报',
      type: '中文字体',
    },
    {
      title: '造字工房顶黑体',
      type: '中文字体',
    }])


  return {
    fontList,
    Download

  }
}

export default defineComponent({
  setup,
  components,
})
</script>

<style scoped lang="scss">
@import "./style.scss";
</style>