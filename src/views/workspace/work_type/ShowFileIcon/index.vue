<template>
  <div>
    <div v-if="fileCat==='image'&&cover">
      <el-image style="width: 20px;height: 20px;border-radius: 5px" :src="cover"/>
    </div>
    <div v-else-if="fileCat==='video'&&cover">
      <el-image style="width: 20px;height: 20px;border-radius: 5px" :src="cover"/>
    </div>
    <div v-else-if="fileCat==='audio'">
      <el-icon><Headset /></el-icon>
    </div>
    <div v-else><el-icon><Files /></el-icon></div>
  </div>
</template>

<script setup>
const props=defineProps({
  fileCat:String,
  cover:String,
})
</script>

<style scoped>

</style>