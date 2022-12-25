<template>
  <div class="main-card">
    <div class="split-track">
      <div class="split-tag">
        <div>
          <el-image src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    style="width: 25px">
          </el-image>
        </div>
        <div>人声</div>
        <div>
          <el-icon><Select /></el-icon>
        </div>
      </div>
      <div class="split-tag active-tag">
        <div>
          <el-image src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    style="width: 25px">
          </el-image>
        </div>
        <div>鼓声</div>
        <div>
          <el-icon><Select /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')

</script>
<style scoped lang="scss">
.split-track{
  display: flex;
  margin-top: 10px;
  .split-tag{
    height: 45px;
    background-color: #1c84c6;
    padding: 13px 10px;
    text-align: center;
    margin: 6px;
    display: flex;
  }
  .active-tag{
    background-color: #00bb6c;
    &:after{

    }
  }
}
</style>
