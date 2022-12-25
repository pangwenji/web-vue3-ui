<template>
  <div class="card">
    <div class="card-main" >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  detailsList: {
    type: Object,
    default: {}
  }
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
    background-image: url("@/assets/material/picture.png");
  }
}

</style>