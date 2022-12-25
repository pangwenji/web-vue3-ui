<template>
  <div class="main-box">
    <div class="main-card">
      <h2>关于我们</h2>
      <div class="caption">影音同画音视频协作平台介绍</div>
      <div class="part">
        影音同画，以打通音视频行业上下游产业链为核心，以文化产业数字化孵化推广为宗旨,打造集影音市场协同审批工具、
        低价商用正版素材、灵活用工、文化创意内容孵化、线上教育培训等为一体的数字化营销平台,为音视频市场、
        灵活用工市场以及文化创意市场提供一站式的解决方案。
      </div>
      <div style="margin: 30px 0px;">
        <img :src="img" style="width: 100%;">
      </div>
      <div class="part">
        平台功能集成了社交社群、文化推广、审片协同、个人网盘存储、
        灵活用工、独家正版素材、效率工具库、能力提升课程、交易商城、交流沟通等功能,
        从内容存储到审核协作、分发、企创业内容素材管理，形成文化创意音视频产业完善生态产业链，赋能营销数字化转型。
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