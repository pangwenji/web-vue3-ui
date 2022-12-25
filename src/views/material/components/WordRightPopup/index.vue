<template>
  <transition name="menu">
    <div class="main-card" v-if="prop.show" id="card">
      <div class="title">
        素材库分类编辑
      </div>
      <div class="tab-list-show">
      <transition-group
          name="drag"
          tag="ul"
      >
      <div class="menu-item" v-for="(item,index) in tabListShow" :key="item.typeName"
           @dragenter="dragenter($event, index)"
           @dragover="dragover($event, index)"
           @dragstart="dragstart(index)"
           @dragend="updateCategoryEdit"
           :draggable='true'
      >
        <div>
          <el-icon>
            <Expand/>
          </el-icon>
          <span style="margin-left: 8px">{{item.typeName}}</span>
        </div>
        <div class="view" @click="updateCategoryEditMenu(item.typeId,'show')">
          <el-icon>
            <View/>
          </el-icon>
        </div>
      </div>
      </transition-group>
      </div>


      <!-- 隐藏的-->
      <div class="tab-list-hide">
        <div class="menu-item" style="color: #9D9DA1 " v-for="(show,index) in  tabListHide">
          <div>
            <el-icon>
              <Expand/>
            </el-icon>
            {{ show.typeName }}
          </div>
          <div class="view" @click="updateCategoryEditMenu(show.typeId,'hide')">
            <el-icon>
              <Hide/>
            </el-icon>
          </div>
        </div>
      </div>

    </div>
  </transition>
</template>

<script setup>
import {ref} from 'vue'
import {onMounted, defineEmits,onUnmounted} from "vue-demi";
import {getTypeOption, updateTypeOption} from "../../../../api/material";
import {ElMessage} from "element-plus";

const value = ref('')
const prop = defineProps({
  show: {
    type: Boolean,
  },
  tabListHide: Array,
  tabListShow: Array,
  typeOfWork: Number
})
const menuItem = ['音效','音乐','工程','插件','视频','图片','字体']
const emits = defineEmits(["close"]);

onMounted(() => {
  window.addEventListener('click', listener)
})
onUnmounted(() => {
  window.removeEventListener('click', listener)
})


const listener = (e) => {
  let elementById = document.getElementById("card");
  if (elementById) {
    if (!elementById.contains(e.target)) {
      emits("close");
    }
  }
}

const updateMenu = ref([])
const updateCategoryEditMenu = (id, type) => {
  let show = prop.tabListShow;
  let hide = prop.tabListHide;
  // 将当前
  if (type === "show") {
    if( prop.tabListShow.length ===1 ){
      ElMessage('无法隐藏，请至少保留一个分类')
      return
    }
    //  将show的内容移动到，hide列表中；
    let index = show.findIndex(res => {
      return res.typeId === id;
    });
    let s = show.splice(index, 1)[0]
    s.disable = 0
    hide.push(s)

  } else {
    // 将show的内容移动到
    let index = hide.findIndex(res => {
      return res.typeId === id;
    });
    let h = hide.splice(index, 1)[0]
    h.disable = 1
    show.push(h)
  }
  updateMenu.value = []
  updateMenu.value = show.concat(hide)
  updateMenu.value.forEach((it,index)=>{
    it.sort = index
  })

  updateCategoryEdit();
}

//拖拽结束
const updateCategoryEdit = () => {
  if (updateMenu.value.length > 0){
    updateTypeOption(updateMenu.value).then(res =>{})
  }
}
/**
 * 开始拖拽事件
 * @type {number}
 */
let dragIndex = -1;
const dragstart = (index) => {
  dragIndex = index
}
const dragenter = (e, index) => {
  e.preventDefault()
  // 避免源对象触发自身的dragenter事件
  if (dragIndex !== index) {
    const moving = prop.tabListShow[dragIndex]
    prop.tabListShow.splice(dragIndex, 1)
    prop.tabListShow.splice(index, 0, moving)
    // 排序变化后目标对象的索引变成源对象的索引
    dragIndex = index
    updateMenu.value = []
    updateMenu.value = prop.tabListShow.concat(prop.tabListHide)
    updateMenu.value.forEach((it,index)=>{
      it.sort = index
    })
  }
}
const dragover = (e, index) => {
  e.preventDefault()
}
</script>

<style scoped lang="scss">
@import "./style.scss";

.drag-move {
  transition: transform .5s;
}
.main-card{
  height: 100%;
  width: 210px;
  background-color: rgba(41, 42, 48, 0.90);
  position: absolute;
  right: 0;
  overflow-y: auto;
  .title{
    color: #9094A6;
    padding: 10px;
    font-size: 12px;
  }

  .menu-item{
    font-size: 14px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    line-height: 1;
    cursor: pointer;
    &:hover{
      background-color: #3956FF ;
      border-radius: 10px;
    }
  }

  .tab-list-show{
    padding-bottom: 20px;
    color: #FFFFFF;

  }
  .tab-list-hide{
    color: #9D9DA1 !important;
  }
}
.menu-enter-active, .menu-leave-active{
  transition: opacity .5s ease,transform .5s ease;
}
.menu-enter-from, .menu-leave-to{
  opacity: 0;
  transform: translateX(100%);
}
.menu-enter-to, .menu-leave-from{
  opacity: 1;
  transform: translateX(0);
}

.main-card::-webkit-scrollbar {
  display: none;
}

</style>
