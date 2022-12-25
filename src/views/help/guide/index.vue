<template>
  <div class="main-box">

    <div class="main-card">
      <h2>使用指南</h2>
      <div class="caption">影音同画音视频协作平台介绍</div>
      <div style="margin: 30px 0px;">
        <img :src="img" style="width: 100%;">
      </div>
      <div class="part">
        影音同画，以打通音视频行业上下游产业链为核心，以文化产业数字化孵化推广为宗旨,打造集影音市场协同审批工具、
        低价商用正版素材、灵活用工、文化创意内容孵化、线上教育培训等为一体的数字化营销平台,为音视频市场、
        灵活用工市场以及文化创意市场提供一站式的解决方案。
      </div>
      <div class="caption">审片协同</div>
        <div class="list" style="padding: 30px">
          <ul>
            <li>多端同步自由存取，文件流转快 </li>
            <li>创意资产在线管理，自动分类</li>
            <li>多种格式在线预览,无需下载</li>
            <li>多端在线批注,精准定位修改</li>
            <li>告别反复沟通,更快交付成品</li>
          </ul>

      </div>

      <div class="caption">灵活用工</div>
      <div class="part">
        海量人才,快速招募<br>
        实名认证,信息真实<br>
        数据看板,高效筛选<br>
        价格透明,按单结算<br>
        聊天聚合,快速沟通<br>
        资金托管,保证利益<br>
        代征代缴,省时省心<br>
      </div>

    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import img from "@/assets/help/img.png";
const value = ref('')

</script>

<style scoped lang="scss">
@import '../style.scss';

</style>