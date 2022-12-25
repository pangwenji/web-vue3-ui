<template>
  <div class="container">
    <el-icon class="ps-icon" :size="36" @click="previousOne"><ArrowLeftBold /></el-icon>
    <el-icon class="ps-icon" :size="36" @click="nextOne"><ArrowRightBold /></el-icon>
  </div>
</template>

<script setup>

const emits = defineEmits(['onPrevious', 'onNext'])

// 上一个
function previousOne() {
  emits('onPrevious')
}

// 下一个
function nextOne() {
  emits('onNext')
}

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 0 14px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;

  .ps-icon {
    padding: 8px;
    background-color: rgba($color: #666, $alpha: .1);
    border-radius: 4px;
    pointer-events: auto;
    cursor: pointer;
    z-index: 10;
  }

  .ps-icon:hover {
    background-color: rgba($color: #333, $alpha: .6);
  }
}
</style>