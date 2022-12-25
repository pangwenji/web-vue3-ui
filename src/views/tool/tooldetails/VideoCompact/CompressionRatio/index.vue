<template>
  <div class="sound-com">
    <div class="bar-main" ref="barMain">
      <div
           class="sound-bar"
           ref="progressBt">

      </div>
      <div class="progress" ref="soundBarVolume" style="display: flex;justify-content: space-between;">
        <template v-for="i in 10" :key="i">
          <div v-if="i!==6" style="width: 2px;height: 100%;background-color: rgba(56,222,179,0.26);"></div>
          <div v-else style="height: 100%;width: 10%;background-color: rgba(88,250,24,0.6); font-size: 10px;line-height: 4;color: cornsilk;">推荐范围</div>
        </template>
      </div>
      <div class="mark">
        <div v-for="i in 10" :key="i">
          {{ i }}0%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import position from './position.png'
const props = defineProps({
  name: String,
})
const soundBarVolume = ref(null);
const progressBt = ref(null);
const barMain = ref(null);
const emit = defineEmits(['compressionRatio'])
let isMute = ref(false);
const muteX = () => {
  isMute.value = !isMute.value
  if (isMute.value) {
    emit("compressionRatio", 0, props.name)
    soundBarVolume.value.style.backgroundPosition = barMain.value.offsetWidth + 1 + "px";
    progressBt.value.style.left = 0
  } else {
    emit("compressionRatio", 1, props.name)
    soundBarVolume.value.style.backgroundPosition = 0;
    progressBt.value.style.left = barMain.value.offsetWidth - progressBt.value.offsetWidth + "px"
  }
}

onMounted(() => {
  scale("yl", progressBt.value, barMain.value, soundBarVolume.value, ondrag = (pos, x, step, mw, name) => {
    if (name === "yl") {
      isMute.value = pos === 0;
      step.style.backgroundPosition = Math.min(0, x - mw) + 'px';
      emit("compressionRatio", pos, props.name)
    }
  }, () => {
  })
})


function scale (name,btn, bar,step,ondrag,mouseup) {
  step.style.backgroundPosition=-barMain.value.offsetWidth*0.45+'px';
  let init = function () {
    let  g = document, b = window, m = Math;
    btn.onmousedown = function (e) {
      let x = (e || b.event).clientX;
      let l = btn.offsetLeft;
      let max = bar.offsetWidth - btn.offsetWidth;
      g.onmousemove = function (e) {
        let thisX = (e || b.event).clientX;
        let to = m.min(max, m.max(0, l + (thisX - x)));
        btn.style.left = to + 'px';
        ondrag(m.max(0, to / max), to,step,bar.offsetWidth,name);
        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
      };
      g.onmouseup = function () {
        g.onmousemove=null;
        mouseup(name);
        g.onmouseup=null;
      };
    };
  };
  init();
}
defineExpose({
  muteX
})
</script>

<style lang="scss" scoped>
.sound-com {
  display: flex;
}

.bar-main {
  position: relative;
  width: 100%;

  .sound-bar {
    width: 4px;
    height: 64%;
    background: #3468FE;
    border-radius: 1px;
    position: absolute;
    z-index: 999;
    left: 55%;
    cursor: move;
    top: -3px;
  }

  .progress {
    -webkit-clip-path: polygon(100% 0, 100% 100%, -15% 100%);
    background: rgba(52, 104, 254, 0.5);
    height: 2em;
    width: 100%;
    border-radius: 2px;
    background-image: -webkit-linear-gradient(left, rgba(52, 104, 254, 0.5), rgba(52, 104, 254, 0.5));
    background-position: -65% 0;
    background-repeat: no-repeat;
    -webkit-animation: up-and-down 1.5s infinite;
  }

  .mark {
    display: flex;
    justify-content: space-between;
    color: #606266;
    margin-top: 6px;
    font-size: 14px;
  }
}


</style>
