<template>
  <div >
    <div class="old-img-main" >
      <div class="old-img"  ref="mainImg" :style="{width:width+'px'}" >
        <el-image
            style="height: 420px"
            :src="compareImage"
            :preview-src-list="[compareImage]"
        ></el-image>
        <div class="old-img-ig" ref="oldImg" :style="{backgroundImage:`url('${originalImage}')`}">
        </div>
        <div class="line-show" style="font-size: 16px" ref="progressBar">
          <div style="color: #FFFFFF">
            <el-icon class="caret"><DCaret /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import {scale} from "../../dragUtils";

const props=defineProps({
  originalImage:String,
  compareImage:String,
  width:Number,
})
const value = ref('')
const mainImg=ref(null);
const progressBar=ref(null);
const oldImg=ref(null);
const imgFile=ref(null);
onMounted(()=>{
  scale("old", progressBar.value, mainImg.value, oldImg.value, ondrag = (pos, x, step, mw, name) => {
    if (name === "old") {
      oldImg.value.style.width=pos*100+'%'
      progressBar.value.style.left=pos;

    }
  }, () => {
  })
})

watch(()=>props.originalImage,()=>{
  if (progressBar.value){
    oldImg.value.style.width='50%'
    progressBar.value.style.left="50%";
  }
})


</script>
<style scoped lang="scss">
.old-img-ig{
  left: 0;
  top: 0;
  width: 50%;
  height: 420px;
  position: absolute;
  background-size: cover;

}
.old-img-main{
  margin-top: 20px;
  font-size:0
}
.old-img {
  width: 630px;
  margin: auto;
  position: relative;
}

.line-show{
  left: 50%;
  top: 0;
  position: absolute;
  width: 2px;
  height: 100%;
  background: #3468FE;
  border-radius: 100px;
  cursor: pointer;
}
.caret{
  transform: rotate(90deg) translateY(7px) translateX(1000%) scale(1.5);
  background: #084AF4;
  border-radius: 50%;
}
</style>
