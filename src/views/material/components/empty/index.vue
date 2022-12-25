<template>
  <div class="empty-box">
    <img src="@/assets/material/materialMain/empty-img.png">
    <span style="font-size: 14px;margin-top: 30px">素材正在更新上架中，尽请期待。</span>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.empty-box{
  display: flex;
  flex-direction: column;
  img{
    width: 204px;
    height: 162px;
    object-fit: contain;
  }
  span{
    color: #3D3F50;
  }
}
</style>
