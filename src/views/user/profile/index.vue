<template>
  <div class="profile-container">
    <div class="main">
      <div class="left">
        <div class="header-left">
          <span :class="{ active: activeId === 1 }" @click="handleChangMain(1)">作品集</span>
          <span :class="{ active: activeId === 2 }" @click="handleChangMain(2)">工种服务</span>
          <span :class="{ active: activeId === 3 }" @click="handleChangMain(3)">招募信息</span>
        </div>

      </div>
      <div class="right">
        <div class="r-top">

        </div>
        <div class="r-mid"></div>
        <div class="r-btm"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue";

const activeId = ref(1)
const handleChangMain = (type) => {
  if (type === activeId.value) return;
  activeId.value = type

}



</script>
<style scoped lang="scss">
.profile-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 30px;

  .main {
    display: flex;
    .left {
      width: 70%;
      padding: 17px 28px 22px 0px;
      height: 70px;
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.3);
      justify-content: space-between;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;

      .active {
        // cursor: none;
        color: white;

        &::after {
          content: "";
          width: 27px;
          height: 3px;
          background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 10px;
          display: inline-block;
        }
      }

      // color: ;
      .line {
        width: 1px;
        height: 16px;
        flex-shrink: 0;
        background: #eeeeee;
        margin: 0 15px;
        cursor: none;
      }

      span {
        display: inline-block;
        height: 100%;
        line-height: 38px;
        cursor: pointer;
        position: relative;
        margin-right: 44px;

        &:hover {
          color: white;
        }
      }
    }

    .right {
      width: 30%;
      .r-top{
        height: 330px;
        background: #1C1D24;
        box-shadow: 0px 0px 4px 0px rgba(52,48,227,0.0500);
        border-radius: 10px;
        border: 1px solid #2B2D36;
      }
      .r-mid{
        margin-top: 20px;
        height: 165px;
        background: #1C1D24;
        box-shadow: 0px 0px 4px 0px rgba(52,48,227,0.0500);
        border-radius: 10px;
        border: 1px solid #2B2D36;

      }
      .r-btm{
        margin-top: 20px;
        height: 330px;
        background: #1C1D24;
        box-shadow: 0px 0px 4px 0px rgba(52,48,227,0.0500);
        border-radius: 10px;
        border: 1px solid #2B2D36;
      }
    }
  }
}
</style>