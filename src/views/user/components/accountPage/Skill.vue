<template>
  <el-scrollbar class="skill-main" :height="scollHeight">
    <el-row :gutter="20">
      <el-col :style="{width:(100/columns)+'%' , flex:'none '}" v-for="(item,index) in 10" :key="index">
        <div class="skill-card">
          <div class="skill-card-top">
            <div class="skill-type"> 配音</div>
            <div v-color="'rgb(106 144 255 / 78%)'">预览主页</div>
          </div>
          <div style="margin: 20px 4px;">我能提供公子音配音</div>
          <div class="flexS">
            <div class="skill-mid">
              <div class="num">10</div>
              <div>元/分钟</div>
            </div>
            <div class="skill-mid">
              <div class="num">200</div>
              <div>元起做</div>
            </div>
            <div class="skill-mid">
              <div class="num">1</div>
              <div>天交付</div>
            </div>
          </div>
          <div class="flexS">
            <div class="skill-btm">
              <div>成交量</div>
              <div v-color="'rgb(106 144 255 / 78%)'">81</div>
            </div>
            <div class="skill-btm">
              <div>雇主评分</div>
              <div v-color="'rgb(106 144 255 / 78%)'">8.9</div>
            </div>
            <div class="skill-btm">
              <div class="num">相应速度</div>
              <div v-color="'rgb(106 144 255 / 78%)'">快</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup>
import {useWindowSize} from "@vueuse/core/index";
import {watchEffect} from "vue";

const {width,height} = useWindowSize();
const columns = ref(3);
const onresize = (w) => {
  const span = (w - 360) / 360;
  columns.value = Math.round(span);
}
const scollHeight = ref()
watchEffect(() => {
  onresize(width.value)
  scollHeight.value = height.value - 330
});

</script>

<style scoped lang="scss">
.skill-main {
  width: 100%;
  flex: auto;

  &:deep(.el-scrollbar__wrap) {
    width: 100%;
  }

  .skill-card {
    width: 100%;
    min-height: 200px;
    margin-bottom: 20px;
    background: #1C1D24;
    border-radius: 10px;
    padding: 16px;
    user-select: none;
    position: relative;

    &:hover {
      background: linear-gradient(315deg, #1D1F2A 0%, #212735 100%);
    }

    .skill-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .skill-type {
        flex: none;
        width: 30%;
        padding: 0 5px;
        box-sizing: border-box;
        border-radius: 20px;
        display: inline-block;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        height: 36px;
        line-height: 38px;
        background: rgba(61, 63, 80, 0.39);
      }

    }
    .skill-mid{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
      margin-top: 10px;
      .num{
        font-size: 30px;
        line-height: 30px;
        color: #c45656;
        display: contents;
      }
    }
    .skill-btm{
      font-size: 10px;
      display: flex;
      align-items: center;
      margin-right: 10px;
      margin-top: 13px;
      div{
        flex: 0 0 auto;
        margin-right: 5px;
      }
    }

  }
}



.flexS {
  display: flex;
  justify-content: flex-start;
}
.flexB{
  display: flex;
  justify-content: space-between;
}
</style>
