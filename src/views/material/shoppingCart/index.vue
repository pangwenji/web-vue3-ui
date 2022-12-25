<template>
  <el-container style="height:100%;">
    <el-scrollbar style="width: 100%;height: 100%;background: #0A0B0D;">
      <div style="width: 100%;position: relative;background: #0A0B0D;height: 100%">
        <cart-list></cart-list>
      </div>
    </el-scrollbar>
  </el-container>
</template>
<script setup>
import MaterialLeft from "../components/MaterialLeft";
import CartList from "./cartList";
</script>

<style scoped lang="scss">
.project-collection-container {
  width: 100%;
  flex-grow: 1;
  overflow: hidden;

 .table-header {
      color: #BEC0CD;
      font-size: 14px;
      opacity: 0.4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 16px;
      margin-bottom: 8px;
      user-select: none;

      div {
        flex-grow: 1;
      }
    }

}
:deep(.el-scrollbar__view){
  height: 100%;
}
</style>
