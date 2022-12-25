<template>
  <div class="card">
    <img src="../../../../assets/material/picture1.png">
  </div>
  <div class="bottom">
    <div  class="topbtm">资源包简介:</div>
    <div class="btm">简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字简介说明文字</div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 560px;
  background: #1C1D24;
  border-radius: 10px;
  backdrop-filter: blur(0px);

  display: flex;
  justify-content: center;

}
.bottom{
  margin-top: 20px;
  padding: 32px;
  height: 330px;
  background: #1C1D24;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 21px;

  .btm{
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.48);
    line-height: 20px;
  }
}
</style>
