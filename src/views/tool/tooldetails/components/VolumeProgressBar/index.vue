<template>
  <div class="sound-com">
    <div style="margin: 0 14px;
    transform: translateY(3px);cursor: pointer;"
         :style="[isMute?'opacity:0.2':'opacity:1']"
         @click="muteX">
      <el-image style="width: 14px" :src="sound"></el-image>
    </div>
    <div style="width: 65px;" class="tooltip-my-class">
      <el-slider v-model="value1" @input="sliderChange"/>
    </div>
  </div>
</template>

<script setup>
import sound from '@/assets/tool/sound.png'
import {scale} from '../../dragUtils'
import {onMounted, ref} from "vue";


const props=defineProps({
  name:String,
})
const value1=ref(100)
const emit = defineEmits(['volume'])
let isMute = ref(false);
const muteX = () => {
  isMute.value = !isMute.value
  if (isMute.value) {
    emit("volume", 0,props.name)
    value1.value=0;
  } else {
    emit("volume", 1,props.name)
    value1.value=100;
  }
}

const sliderChange = () => {
  isMute.value=value1.value===0;
  emit("volume", value1.value/100,props.name)
}

defineExpose({
  muteX
})
</script>

<style lang="scss" scoped>
.sound-com {
  display: flex;
  align-items: center;
}

.bar-main {
  position: relative;

  .sound-bar {
    width: 4px;
    height: 18px;
    background: #3468FE;
    border-radius: 1px;
    position: absolute;
    z-index: 999;
    left: 43px;
    cursor: move;
    top: -3px
  }

  .progress {
    -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%);
    background: #3D3F50;
    height: 14px;
    width: 43px;
    background-image: -webkit-linear-gradient(left, #3468FE, #3468FE);
    background-position: -30em 0;
    background-repeat: no-repeat;
  }
}
.tooltip-my-class{
  margin-left: 10px;
  :deep(.el-tooltip__trigger){
    transform: scale(0.7);
  }
}

</style>
