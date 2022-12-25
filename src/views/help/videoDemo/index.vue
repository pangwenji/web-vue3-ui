<template>
  <div class="main-box">
    <div class="main-card">
      <h2>视频演示</h2>
      <div style="margin: 30px 0px;">
        <img :src="img1" style="width: 100%;">
      </div>
      影音同画，以打通音视频行业上下游产业链为核心，以文化产业数字化孵化推广为宗旨,打造集影音市场协同审批工具、
      低价商用正版素材、灵活用工、文化创意内容孵化、线上教育培训等为一体的数字化营销平台,为音视频市场、
      灵活用工市场以及文化创意市场提供一站式的解决方案。
    </div>
  </div>

</template>

<script setup>
import {ref} from 'vue'
import img1 from "@/assets/help/img_1.png";

const value = ref('')

</script>

<style scoped lang="scss">
@import '../style.scss';
</style>