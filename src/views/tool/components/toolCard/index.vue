<template>
  <div>
    <el-card :body-style="{ padding: '15px 10px 15px 20px !important' }" class="bg"
             @dragstart="handleDragStart"
             :draggable='true'
             @dragover="e=>e.preventDefault"
             @dragend="handleDragEnd"
             @dragleave="handleDragLeave"
             @dragover.stop="handleDragOver"
    >
      <div class="hot" v-if="data.popular==1">HOT</div>
      <el-row :gutter="10">
        <el-col :span="15" >
          <div class="title">{{data.name}}</div>
          <div class="content">{{data.shortDes}}</div>
        </el-col>
        <el-col :span="9">
          <div class="image-icon">
            <div class="status start-color" v-if="data.devStatus!==9">
              {{data.devStatus===1?'开发中':data.devStatus===0?'规划中':''}}
            </div>
            <el-image style="width: 56px;height: 55px;" :class="{gray:data.devStatus===1||data.devStatus===0}" :src="data.icon" ></el-image>
          </div>
        </el-col>
      </el-row>
    </el-card>



  </div>
</template>
<script setup>
import { ref ,computed}  from "vue"
import { useStore } from 'vuex'
const store = useStore();
var timeOut = null;
const dragAction = ref(false); //拖拽对象改变样式
const dragOverAction = ref(false); //拖拽进入当前对象改变样式

// 接收卡片参数
const props = defineProps({
  data: Object
})


//拖拽开始
const handleDragStart = (e) => {
  dragAction.value = true;
  store.commit('tool/SET_DRAG_DATA',props.data);
};



// 拖拽结束
const handleDragEnd = (e) => {
  console.log("拖拽结束")
  console.log(e)
  dragAction.value = false;
  dragOverAction.value = false;
};

// 拖拽离开
const handleDragLeave = (e) => {
  console.log("拖拽离开")
  if (dragAction.value) {
    return;
  }
  e.preventDefault();
  if (timeOut) {
    return;
  }
  timeOut = setTimeout(() => {
    dragOverAction.value = false;
  }, 50);
};

const dragEvent = computed(() => {
  return store.state.app.dragEvent;
});

// 拖拽进入
const handleDragOver = (e) => {
  if (dragAction.value) {
    return;
  }
  e.preventDefault();
  if (timeOut) {
    clearTimeout(timeOut);
    timeOut = null;
  }
  dragOverAction.value = true;
};



</script>
<style scoped lang="scss">
.title{
  font-size: 14px;
  color: #FFFFFF;
  font-weight: 500;
  margin-bottom: 10px;
}
.content{
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.51);
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.bg{
  position: relative;
  background: #1C1D24;
  height: 136px;
  width: 263px;
  border-radius: 8px;
  border: 1px solid #2B2D36;
  &:hover{
    background: #3D3F50;
  }
  .hot{
    position: absolute;
    background: linear-gradient(135deg, #FDA76F 0%, #FF4152 100%);
    top: 4px;
    right: -17px;
    font-size: 12px;
    padding: 2px 10px;
    color: white;
    width: 62px;
    transform: rotate(45deg);
    text-align: center;
  }
}

.el-row {
  cursor: pointer;

}
.image-icon{
  position: relative;
  margin-top: 30px;
  text-align: center;
  .status{
    position: absolute;
    bottom:-2px;
    font-size: 10px;
    z-index: 1;
    padding: 5px;
    left: 12px;
    border-radius: 3px;
    width: 56px;
    text-align: center;
  }
  .start-color{
    width: 56px;
    height: 20px;
    background: #8E919B;
    border-radius: 0px 0px 8px 8px;
    font-size: 12px;
    font-weight: 400;
    color: #3D3F50;
    line-height: 12px;
  }
  .el-image{
    transform: translateY(9%);
    width: 84px;
    height: 84px;
    border-radius: 12px;
  }
  .gray{
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
}
</style>
