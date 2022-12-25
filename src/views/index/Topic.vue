<template>
  <div class="card-box" >
    <div class="card-header">
      <div>帮助文档</div>
      <div class="other" style="cursor: pointer" @click="router.push({path: '/help/guide'})">查看更多</div>
    </div>
    <el-row :gutter="10">
      <el-col v-for="item in topicList" :key="item" :span="8" style="margin-bottom: 20px;"
              @click="handleGoHelp(item)">
        <span class="help-item">{{  item.title || item.articleTitle }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {getSpecialRelation} from "@/api/help";
import {useRouter} from "vue-router";

const router = useRouter();

// 获取文章专题
const topicList = ref([])
function getTopicList() {
  getSpecialRelation({specialId:'1'}).then(res => {
    topicList.value = res.data
  })
}
getTopicList()

function handleGoHelp(item) {
  router.push({path: '/help/guide', query: {id: item.articleId}})
}

</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
