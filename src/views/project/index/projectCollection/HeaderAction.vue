<template>
  <div class="header-content">
    <div class="header-content-title">
        我的第一个项目
    </div>
    <div class="header-content-actions">
        <div class="action-search-box">
            <el-icon color="#38393D"><Search /></el-icon>
            <input placeholder="搜索" />
        </div>
        <el-button class="btn"  type="primary" round>新建收集</el-button>
    </div>
  </div>
</template>
<script setup>

</script>
<style scoped lang="scss">

.header-content {
  height: 60px;
  width: 100%;
  flex-shrink: 0;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &-title{
    font-size: 16px;
    color: white;
  }
  &-actions{
    font-size: 16px;
    color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btn{
        background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
        border: none;
    }
    .action-search-box{
        height: 40px;
        border-radius: 40px;
        padding: 0 10px;
        background: #1E1F26;
        display: flex;
        align-items: center;
        color: white;
        margin-right: 12px;
        input{
            color: white;
            width: 130px;
            margin-left: 10px;
            display: inline-block;
            outline: none;
            background: transparent;
            border: none;
        }
    }
    
  }
}
</style>
