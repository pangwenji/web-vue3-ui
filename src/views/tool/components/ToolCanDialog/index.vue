<template>
  <div class="tool-dialog">
    <el-dialog  v-model="toolShow" :show-close="false" :width="width" @close="close">
      <div>
        <div class="dialog-title" >
          <div >{{ title }}</div>
          <div @click="close"><el-icon><CloseBold style="color: #ABABAB" /></el-icon></div>
        </div>
        <div>
          {{headData.description}}
        </div>
        <div class="dialog-bt">
          <div class="confirm el-button" :class="{success:assist!==-1}" ref="button" @click="confirm(headData)">
            <div><el-image :src="assist!==-1?jiashu:jiashu2"></el-image></div>
<!--            {{assist!==-1?'助力成功':'助力开通'}}-->
            {{headData.needSold}}
          </div>
          <div class="zuinfo">助力人数越多，开发团队将会优先开发，加速开放使用。</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";

import jiashu from "@/assets/tool/jiashu1.png"
import jiashu2 from "@/assets/tool/jiashu2.png"
const store = useStore();
const button=ref(null);
const props = defineProps({
  show: {
    type:Boolean,
    default: false,
  },
  width:{
    default:'455px',
    type:String,
  },
  title:String,
  headData:Object,
  assist:Number,
})


const toolShow = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const emit = defineEmits(['confirm','update:show'])
const close = () => {
  button.value.classList.remove('animation')
  toolShow.value=false;
}

const test=ref(0)
const confirm = (data) => {
  button.value.classList.remove('animation')
  // setTimeout(res=>{
    // button.value.classList.add('animation')
    button.value.classList.add('success')
    test.value=1;
  // },100)
 if (props.assist===-1){
   data.needSold+=1
 }
  emit('confirm')
}


const money = computed(() => {
  return store.state.user.money;
})
</script>

<style scoped lang="scss">
@import "./style.scss";
.animation {
  -webkit-animation: pulsate-bck 0.5s ease-in-out infinite both;
  animation: pulsate-bck 0.5s ease-in-out infinite both;
}

@-webkit-keyframes pulsate-bck {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes pulsate-bck {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.9);
    transform: scale(0.9);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

</style>
