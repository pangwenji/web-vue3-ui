<template>
  <div class="customSide-container">
    <div class="top-logo" :title="'账户余额：' + (moneyBlance || 0)" @click="handleToUserInfo">
      <el-image style="width: 100%; height: 100%" :src="getters.avatar">
        <template #error>
          <div
              style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items:center;">
            <el-icon :size="36" color="#ffffff">
              <PictureFilled/>
            </el-icon>
          </div>
        </template>
      </el-image>
    </div>
    <el-scrollbar class="menu-scrollbar" :class="sideTheme" wrap-class="scrollbar-wrapper">
      <div v-for="(item,index) in showMenus" :key="index">
        <div class="menu-item-border" :class="{active: dragOverCurrent == index && dragType == 'show'}"></div>
        <el-tooltip content="功能正在排期规划中，敬请期待！" placement="bottom" effect="light" :disabled="item.state !== 3">
        <div
            :draggable="item.draggable&&showMenus.length > 1"
            @click="handleTo(item.path)"
            @dragstart="handleDragStart(index,'show')"
            @dragover="handleDragOver($event,index,'show')"
            @dragleave="handleDragLeave(item)"
            @dragend="handleDragEnd"
            @drop="handleDrop(item,index,'show')"
            @mouseup="handleMouseUp"
            class="menu-item"
            :class="[{'menu-item-action':actionMenu(item.path)},item.iconClass]">

          <template v-if="item.state !== 3">
            <div class="menu-icon"></div>
            <div class="menu-text">{{ item.title }}</div>
          </template>
          <template v-else>
            <div class="menu-icon-gray"></div>
            <div class="menu-text-gray">{{ item.title }}</div>
          </template>

        </div>
        </el-tooltip>
      </div>
      <div class="menu-item-border" :class="{active: dragOverCurrent == showMenus.length && dragType == 'show'}"></div>
      <div class="menu-item-7 menu-item" :class="{'menu-item-action':otherAction}" ref="buttonPopoverRef"
           @click="handleOpenPopover">
        <div class="menu-icon"></div>
        <div class="menu-text">更多</div>
      </div>


    </el-scrollbar>

    <el-popover ref="popoverRef" :virtual-ref="buttonPopoverRef" width="200px" :show-arrow="false" placement="right-end"
                trigger="click" virtual-triggering>
      <div class="popover-menu-box">
        <div class="popover-title-box">固定应用</div>
        <template v-if="hideMenus.length > 0">
          <div v-for="(item,index) in hideMenus" :key="index">
            <div class="menu-item-border" :class="{active: dragOverCurrent == index && dragType == 'hide'}"></div>
            <el-tooltip content="功能正在排期规划中，敬请期待！" placement="right-start" effect="dark" :disabled="item.state !== 3">
            <div class="menu-item"
                 :draggable="item.draggable"
                 @click="handleTo(item.path)"
                 @dragstart="handleDragStart(index,'hide')"
                 @dragover="handleDragOver($event,index,'hide')"
                 @dragleave="handleDragLeave(item)"
                 @dragend="handleDragEnd"
                 @drop="handleDrop(item,index,'hide')"
                 :class="[{'menu-item-action':actionMenu(item.path)},item.iconClass]"
            >
              <template v-if="item.state !== 3">
                <div class="menu-icon"></div>
                <div class="menu-text">{{ item.title }}</div>
              </template>
              <template v-else>
                <div class="menu-icon-gray"></div>
                <div class="menu-text">{{ item.title }}</div>
              </template>
            </div>
            </el-tooltip>
          </div>
          <div class="menu-item-border"
               :class="{active: dragOverCurrent == hideMenus.length && dragType == 'hide'}"></div>
        </template>
        <template v-else>
          <div class="drapbox" @drop="handleDrop(item, index, 'hide')"
               :class="{ 'drapbox-active':dragOverCurrent == -1 && dragType == 'hide' }" @dragleave="handleDragLeave"
               @dragover="handleDragOver($event,-1,'hide')">
            <span v-if="dragOverCurrent == -1 && dragType == 'hide'">释放应用以固定</span>
            <span v-else>拖拽到此处，以固定到“更多”</span>
          </div>
        </template>
      </div>
    </el-popover>
  </div>
</template>
<script setup>
import {isExternal} from '@/utils/validate'
import {getNormalPath} from '@/utils/ruoyi'
import {computed, reactive, ref, unref} from "vue-demi";
import {useStore} from "vuex";
import {useRoute, useRouter} from 'vue-router';
import logo from '@/assets/logo/logo.png'
import {watch} from "vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const sideTheme = computed(() => {
  store.state.settings.sideTheme
});

const moneyBlance = computed(()=>store.state.user.money)

const popoverRef = ref();
const getters = computed(() => store.getters)
const buttonPopoverRef = ref();
const workbenchConfig = computed(() => {
  if (store.state.user.workbenchConfig) {
    try {
      let workbenchMenu = JSON.parse(store.state.user.workbenchConfig)
      let showIds = workbenchMenu.showIds;
      let hideIds = workbenchMenu.hideIds;
      const arr = showIds.concat(hideIds)
      if ((arr.length - 1) !== Object.keys(menuList).length) {
        return {
          showIds: [1, 2, 3, 5, 6, 4],
          hideIds: [8, 9, 10, 11, 12, 13, 14]
        }
      } else {
        return JSON.parse(store.state.user.workbenchConfig);
      }
    } catch (err) {
      return {
        showIds: [1, 2, 3, 5, 6, 4],
        hideIds: [8, 9, 10, 11, 12, 13, 14]
      }
    }
  } else {
    return {
      showIds: [1, 2, 3, 5, 6, 4],
      hideIds: [8, 9, 10, 11, 12, 13, 14]
    }
  }
})

const handleToUserInfo = () => {
  router.push('/user')
}

const menuList = {
  1: {
    title: '首页',
    path: '/index',
    draggable: true,
    iconClass: 'menu-item-1',
  },
  2: {
    title: '项目',
    path: '/project',
    draggable: true,
    iconClass: 'menu-item-2',
  },
  3: {
    title: '云盘',
    path: '/clouddisk',
    draggable: true,
    iconClass: 'menu-item-6',
  },
  4: {
    title: '用工',
    path: '/workspace',
    draggable: true,
    iconClass: 'menu-item-8',
  },
  5: {
    title: '素材',
    path: '/material',
    draggable: true,
    iconClass: 'menu-item-4',
  },
  6: {
    title: '工具',
    path: '/tool',
    draggable: true,
    iconClass: 'menu-item-5',
  },
  // 7: {
  //   title: '用工',
  //   path: '/personnel',
  //   draggable: true,
  //   iconClass: 'menu-item-8',
  // },
  // 7:{
  //     title:'消息',
  //     path: '/information',
  //     draggable:true,
  //     iconClass: 'menu-item-3',
  // },
  8: {
    title: '版权',
    path: '',
    draggable: true,
    iconClass: 'menu-item-9',
    state: 3,
  },
  9: {
    title: '灵感',
    // path: '/personnel',
    draggable: true,
    iconClass: 'menu-item-10',
    state: 3,
  },
  10: {
    title: '商城',
    // path: '/personnel',
    draggable: true,
    iconClass: 'menu-item-11',
    state: 3,
  },
  11: {
    title: '课程',
    // path: '/personnel',
    draggable: true,
    iconClass: 'menu-item-12',
    state: 3,
  },
  12: {
    title: '众筹',
    // path: '/personnel',
    draggable: true,
    iconClass: 'menu-item-13',
    state: 3,
  },
  13: {
    title: '社群',
    // path: '/personnel',
    draggable: true,
    iconClass: 'menu-item-14',
    state: 3,
  },
}

const showMenus = computed(() => {
  const showIds = workbenchConfig.value.showIds;
  const hideIds = workbenchConfig.value.hideIds;
  const arr = [];
  for (const key in menuList) {
    if (hideIds.indexOf(parseInt(key)) > -1 || showIds.indexOf(parseInt(key)) > -1) {

    } else {
      arr.push(menuList[key])
    }
  }
  const showData = showIds.map(id => {
    return menuList[id]
  });
  showData.push(...arr);
  return showData.filter(item => item);
});
const hideMenus = computed(() => {
  const hideIds = workbenchConfig.value.hideIds;
  return hideIds.map(id => {
    return menuList[id]
  }).filter(item => item);
});

const activePath = computed(() => {
  const {meta, path, name} = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})

const actionMenu = (path) => {
  if (activePath.value == path) {
    return true
  }
  return false;
}

const otherAction = computed(() => {
  for (var item of hideMenus.value) {
    if (activePath.value == item.path) {
      return true
    }
  }
  return false
})

const handleTo = (path) => {
  // if (activePath.value == path) {
  //   return
  // }
  if (!path) return;
  router.push({path})
  popoverRef.value.tooltipRef.hide();
}


/* 拖拽相关 */
let DragIndex = null; //当前拖拽项
let DragType = null; //当前拖拽项类型
let dragName = "menuItem";
const dragOverCurrent = ref(-2); //当前移入项
const dragType = ref(null);
const draggable = computed(() => {
  return store.state.app.dragEvent == dragName;
})
// 开始拖拽
const handleDragStart = (index, type) => {
  store.commit("app/DRAG_EVENT", dragName);
  popoverRef.value.tooltipRef.onOpen()
  DragType = type;
  DragIndex = index;
}
//拖拽移入
const handleDragOver = (e, index, type) => {
  if (!draggable.value) {
    return
  }
  if (index == -1) {
    dragOverCurrent.value = index;
    dragType.value = type;
    e.preventDefault();
    return
  }
  if (index == DragIndex && DragType == type) {
    dragOverCurrent.value = -2;
    return;
  }
  const offsetHeight = e.target.offsetHeight;
  const offsetY = e.offsetY;
  if (offsetY > (offsetHeight / 2)) {
    if (DragIndex == (index + 1) && DragType == type) {
      dragOverCurrent.value = -2;
      dragType.value = null;
      return
    }
    dragOverCurrent.value = index + 1;
  } else {
    if (DragIndex == (index - 1) && DragType == type) {
      dragOverCurrent.value = -2;
      dragType.value = null;
      return
    }
    dragOverCurrent.value = index;
  }
  dragType.value = type;
  e.preventDefault();
}
// 拖拽离开
const handleDragLeave = (e) => {
  dragOverCurrent.value = -2;
  dragType.value = null;
}
// 拖拽放开
const handleDrop = (e) => {
  let showIds = workbenchConfig.value.showIds;
  let hideIds = workbenchConfig.value.hideIds;
  if (dragType.value == DragType) {
    if (dragType.value == 'show') {
      const id = showIds[DragIndex];
      showIds[DragIndex] = false;
      showIds.splice(dragOverCurrent.value, 0, id);
      showIds = showIds.filter(item => item);
    } else {
      const id = hideIds[DragIndex];
      hideIds[DragIndex] = false;
      hideIds.splice(dragOverCurrent.value, 0, id);
      hideIds = hideIds.filter(item => item);
    }
  } else {
    if (dragType.value == 'show') {
      const ids = hideIds.splice(DragIndex, 1);
      showIds.splice(dragOverCurrent.value, 0, ids[0]);
    } else {
      const ids = showIds.splice(DragIndex, 1);
      if (hideIds.length > 0) {
        hideIds.splice(dragOverCurrent.value, 0, ids[0])
      } else {
        hideIds.push(ids[0]);
      }
    }
  }
  store.commit('SET_WORKBENCH_CONFIG', JSON.stringify({
    showIds: showIds,
    hideIds: hideIds,
  }))
  dragOverCurrent.value = -2;
  dragType.value = null;
  DragIndex = -1;
  DragType = null;
}
// 拖拽结束事件
const handleDragEnd = () => {
  popoverRef.value.tooltipRef.hide();
  store.commit('app/DRAG_EVENT', null);
}

</script>
<style scoped lang="scss">
@mixin menu-item($icon) {
  .menu-item-#{$icon} {
    width: 100%;
    padding: 8px 4px;
    // margin: 8px 0;
    flex-shrink: 0;
    cursor: pointer;
    border-radius: 8px;
    color: #828190;

    .menu-icon {
      width: 36px;
      height: 36px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url(@/assets/side-icons/#{$icon}-1.png);
    }

    .menu-icon-gray {
      width: 36px;
      height: 36px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url(@/assets/side-icons/#{$icon}-3.png);
    }

    .menu-text-gray {
      color: #363845;
    }

    // pointer-events: none;
    &:hover {
      color: #FFFFFF;
      background-color: rgba(0, 0, 0, 0.43);

      .menu-icon {
        background-image: url(@/assets/side-icons/#{$icon}-2.png);
      }

      .menu-text-gray {
        color: #363845;
      }
    }

    * {
      pointer-events: none;
      user-select: none;
    }
  }
  .menu-item-#{$icon}.menu-item-action {
    color: #FFFFFF;

    .menu-icon {
      background-image: url(@/assets/side-icons/#{$icon}-2.png);
    }
  }
}

@mixin popover-menu-item($icon) {
  .menu-item-#{$icon} {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;

    * {
      pointer-events: none;
      user-select: none;
    }

    .menu-text {
      margin-left: 10px;
    }

    .menu-icon {
      width: 20px;
      height: 20px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url(@/assets/side-icons/#{$icon}-1.png);
    }

    .menu-icon-gray {
      width: 20px;
      height: 20px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url(@/assets/side-icons/#{$icon}-1.png);
    }


    &:hover {
      background: #f4f4f5;

      .menu-icon {
        background-image: url(@/assets/side-icons/#{$icon}-2.png);
      }

    }
  }
  .menu-item-#{$icon}.menu-item-action {
    // background:  #f4f4f5;
    .menu-icon {
      background-image: url(@/assets/side-icons/#{$icon}-2.png);
    }
  }
}

.menu-item-border {
  width: 100%;
  height: 2px;
  pointer-events: none;
  background: none;

  &.active {
    background: #6D75FF;
  }
}

.customSide-container {
  margin: 0 auto;
  height: 100%;
  // padding-bottom: 70px;
  padding-top: 90px;
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  color: #101010;

  .top-logo {
    position: absolute;
    cursor: pointer;
    width: 50px;
    overflow: hidden;
    height: 50px;
    background: black;
    border-radius: 50px;
    top: 12px;
    left: 50%;
    text-align: center;
    line-height: 50px;
    transform: translateX(-50%);
  }

  @include menu-item(1);
  @include menu-item(2);
  @include menu-item(3);
  @include menu-item(4);
  @include menu-item(5);
  @include menu-item(6);
  @include menu-item(7);
  @include menu-item(8);
  @include menu-item(9);
  @include menu-item(10);
  @include menu-item(11);
  @include menu-item(12);
  @include menu-item(13);
  @include menu-item(14);

}

.popover-menu-box {
  // height: 300px;
  box-sizing: border-box;
  padding: 10px 4px;

  .popover-title-box {
    color: #909399;
    padding: 0 10px;
    margin-bottom: 4px;
  }

  @include popover-menu-item(1);
  @include popover-menu-item(2);
  @include popover-menu-item(3);
  @include popover-menu-item(4);
  @include popover-menu-item(5);
  @include popover-menu-item(6);
  @include popover-menu-item(7);
  @include popover-menu-item(8);
  @include popover-menu-item(9);
  @include popover-menu-item(10);
  @include popover-menu-item(11);
  @include popover-menu-item(12);
  @include popover-menu-item(13);
  @include popover-menu-item(14);

  .drapbox {
    padding: 10px;
    text-align: center;
    height: 100px;
    color: #A0A0A0;
    // line-height: 80px;
    border: 1px dashed #A0A0A0;
    border-radius: 8px;
    user-select: none;

    &.drapbox-active {
      border-color: #409EFF;
      color: #409EFF;
    }
  }

}


</style>
