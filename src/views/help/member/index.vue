<template>
  <div class="main-box">
    <div class="main-card">
      <h2>会员介绍</h2>
      <div class="caption">注册用户</div>
      <div class="part flexB">
        <div class="list">
          <ul>
            <li>注册用户全部权益</li>
          </ul>
        </div>
        <div class="price">
          <span style="font-size: 30px">免费</span>
        </div>
      </div>


      <div class="caption">个人会员</div>
      <div class="part flexB" >
        <div class="list">
          <ul>
            <li>注册用户全部权益</li>
            <li>200G存储空间</li>
            <li>审阅项目数量不限</li>
            <li>审阅项目数量不限</li>
          </ul>
        </div>
        <div class="price">
          <span>¥ <span style="font-size: 40px">99</span> /年</span>
        </div>
      </div>

      <div class="caption">企业会员</div>
      <div class="part flexB" >
        <div class="list">
          <ul>
            <li>注册用户全部权益</li>
            <li>200G存储空间</li>
            <li>审阅项目数量不限</li>
            <li>审阅项目数量不限</li>
          </ul>
        </div>
        <div class="price">
          <span>¥ <span style="font-size: 40px">5800</span> /年</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const value = ref('')

</script>

<style scoped lang="scss">
@import '../style.scss';
</style>
