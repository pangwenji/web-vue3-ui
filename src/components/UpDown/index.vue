<template>
  <div class="content">
    <div class="box">
      <div class="t-top" :class="[tabName===''?'top':tabName==='top'?'active-top':'top']" @click="topBt('top')"></div>
      <div class="bottom"
           :class="[tabName===''?'bottom':tabName==='bottom'?'active-bottom':'bottom']"
           @click="bottomBt('bottom')" ></div>
    </div>
  </div>
</template>

<script setup>
import { ref ,defineEmits} from 'vue'
const emits = defineEmits(["top","bottom","update:tabName"]);
const props = defineProps({
  tabName: {
    type:String,
    default:''
  }
})

const topBt = (name) => {
  emits("top");
  emits("update:tabName",'top');
}

const bottomBt = (name) => {
  emits("bottom")
  emits("update:tabName",'bottom');
}
</script>

<style scoped lang="scss">
.content{
  padding: 0;
  display: inline-flex;
  float: right;
  margin-left: 5px;
  .box{
    display: inline-block;
    .bottom {
      border: 4px solid transparent;
      border-top: 4px solid white;
      margin-top: 2px;
      cursor: pointer;
    }
    .t-top{
      cursor: pointer;
    }

    .active-top{
      border: 4px solid transparent;
      border-bottom: 4px solid rgb(28, 132, 198);
    }
    .active-bottom{
      border: 4px solid transparent;
      border-top: 4px solid rgb(28, 132, 198);
      margin-top: 2px;
    }

    .top {
      border: 4px solid transparent;
      border-bottom: 4px solid white;
    }
  }

}


</style>