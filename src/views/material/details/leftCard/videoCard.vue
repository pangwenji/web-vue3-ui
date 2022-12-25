<template>
  <div class="card">
    <div class="card-main">
      <div id="video">

      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted} from "vue-demi";

onMounted(() =>{

})
</script>

<style scoped lang="scss">
.card {
  width: 100%;
  height: 556px;
  overflow: hidden;
  background: #1C1D24;
  border-radius: 10px;
  backdrop-filter: blur(0px);

  .card-main {
    width: 100%;
    height: 100%;
    background: rgba(34,35,39,0.5600);
    #video{
      width: 100% !important;
      height: 100% !important;
    }
  }
}

</style>