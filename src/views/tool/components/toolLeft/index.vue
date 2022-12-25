<template>
  <div class="tool-left">
    <div>
      <div
          class="menu-item"
          style="display:flex;justify-content: space-between;padding-left: 8px;color: white"
          :class="{'active-menu': nowPath == -1}"
          @click="handleGo( -1)">
        <div style="display:flex;align-items: center">
          <img :src="alltool" style="width: 30px;"/>
          <span style="margin-left: 5px">全部工具</span>
        </div>
        <div>
          <i class="l-icon icon-arrow icon-add-h"
             @click.stop="handleShowTool"
             :style="{transform: `rotate(${openTool?'0':'-90'}deg)`}"
          ></i>
          <!--          :style="{transform: `rotate(${openCat?'0':'-90'}deg)`}" @click="handleShowCat"-->
        </div>
      </div>
      <el-collapse-transition>
        <div v-show="openTool">
        <template v-for="(tool,i) in toolList" :key="i">
          <!--            v-if="tool.name!=='line'"-->
          <div
              class="menu-item"
              :class="{'active-menu': nowPath == tool.id}"
              :style="tool.id === 'other' ? 'margin-top : 55px;height:49px': ''"
              @click="handleGo( tool.id)">
            <!--          <i class="menu-icon icon-file"></i>-->
            <template v-if="tool.id !== 'other'">
              <img :src="tool.icon" style="width: 30px;"/>
              <span style="margin-left: 5px">{{ tool.name }}</span>
            </template>

            <template v-else>
              <div class="order">
                <img :src="porder" style="width: 30px;"/>
                <span style="margin-left: 5px">{{ tool.name }}</span>
              </div>
            </template>
          </div>
        </template>
      </div>
      </el-collapse-transition>
      <div
          class="menu-item"
          :class="{'active-menu': nowPath =='other'}"
          style="margin-top : 55px;height:49px"
          @click="handleGo( 'other')">
        <div class="order">
          <img :src="porder" style="width: 30px;"/>
          <span style="margin-left: 5px">处理订单</span>
        </div>
      </div>
    </div>

    <!--    <div class="menu-item"-->
    <!--         :class="{'active-menu': nowPath === 'quickAccess'}">-->
    <!--      <Promotion class="menu-icon "></Promotion>-->
    <!--      <span>快速访问</span>-->
    <!--    </div>-->

    <el-scrollbar height="100%">
      <div style="flex: 1;">
        <div
            @drop="handleDrop"
            class="common-tools"
            @dragover.stop="handleDragOver">
          <div class="title">
            <img :src="tool" style="width: 17px;"/>
            常用工具
          </div>
          <div style="flex: 1">

            <div
                class="menu-item-common"
                v-for="(item,index) in mylist"
                :key="index"
                :class="{'active-menu': nowPath === item.id}">
              <div style="display:flex;" @click="handleGoTool(item)">
                <div class="image-icon" style="padding: 4px">
                  <div class="status start-color" v-if="item.devStatus!==9">
                    {{ item.devStatus === 1 ? '开发中' : item.devStatus === 0 ? '规划中' : '' }}
                  </div>
                  <el-image :src="item.icon"
                            :draggable="false"
                            :class="{gray:item.devStatus===1||item.devStatus===0}"
                            style="width: 42px;height: 42px;border-radius: 7px;"/>
                </div>
                <div class="common-name"> {{ item.name }}</div>
              </div>

              <div class="right">
          <span v-contextmenu:contextmenu="{trigger:'click'}" @click="currentData(index,item)">
              <el-icon><MoreFilled/></el-icon>
           </span>
              </div>
            </div>
            <div v-if="mylist.length < 1" class="emptyMylist">
              <img :src="tuoru" style="width: 80px;height: 60px;"/>
              <div style="margin-bottom: 34px;">拖入常用工具</div>
            </div>

          </div>
        </div>
      </div>
    </el-scrollbar>
    <v-contextmenu :width="130" ref="contextmenu">
      <v-contextmenu-item @click="deleteContrast">
        <svg-icon iconClass="icon_setting" size="20px"></svg-icon>
        <span style="margin-right: 4px;">删除工具</span>
      </v-contextmenu-item>
    </v-contextmenu>
    <tool-can-dialog
        :title="thisData.name"
        v-model:show="openDialog"
        :headData="thisData"
        :assist="assistId"
        @confirm="confirm"
    ></tool-can-dialog>
  </div>
</template>
<script setup>
import {ElMessage} from "element-plus";
import {useStore} from 'vuex'
import {ref, computed, reactive} from "vue"
import {toolMenuList, collectList, toolCollect} from "@/api/toolbox/toolbox";
import hot from "@/assets/tool/hot.png"
import porder from "@/assets/tool/porder.png"
import tuoru from "@/assets/tool/tuoru.png"
import tool from "@/assets/tool/tool.png"
import {getAssistInfo, toolAssist} from "@/api/toolbox/toolbox";
import alltool from '@/assets/tool/alltool.png'
import { getToken, setToken } from '@/utils/auth'
import ToolCanDialog from '../../components/ToolCanDialog'

const store = useStore();
const route = useRoute();
const router = useRouter();
const nowPath = computed(()=>{
  return route.params.tool
})
const openTool = ref(true)

let mylist = ref([]);

const handleShowTool = () => {
  openTool.value = !openTool.value
}
onMounted(() => {
  let token=route.query.token || ''
  if (token) {
    setToken(token)
    store.commit('SET_TOKEN', token)
    initData();
  } else {
    initData();
  }
})

const initData = () => {
  getToolMenuList();
  getCollectList();
}

function handleGo(path) {
  // nowPath.value = path;
  if (router.currentRoute.value.name?.indexOf("toolDesktop")===-1){
    if (path === 'other') {
      router.push('/tool/index/record')
      return;
    }
    router.push('/tool/index/toolbox/' + path)
  }else {
    if (path === 'other') {
      router.push('/toolDesktop/record')
      return;
    }
    router.push('/toolDesktop/toolbox/' + path)
  }
}

const thisData = ref({});
const openDialog = ref(false);
const assistId = ref(-1);

function handleGoTool(item) {
  let myUrl='';
  if (router.currentRoute.value.name?.indexOf("toolDesktop")===-1){
    myUrl=item.webUrl;
  }else {
    myUrl= item.webUrl.replace("tool/index","toolDesktop")
  }


  //.webUrl,item.id
  if (item.devStatus === 1 || item.devStatus === 0) {
    getAssistInfo(item.id).then(res => {
      assistId.value = res.data;
      openDialog.value = true;
    });
    thisData.value = item;
  } else {
    //nowPath.value = myUrl;
    router.push({
      path: myUrl,
      query: {id: item.id}
    })
  }
}

function confirm() {
  if (assistId.value === -1) {
    toolAssist(thisData.value.id);
    assistId.value = 10;
  }
}

var timeOut = null;

//拖拽放入
const handleDrop = (e) => {
  const getCardData = computed(() => {
    return store.state.tool.dragData;
  });
  if (mylist.value.some(res => {
    return res.id === getCardData.value.id;
  })) {
    ElMessage.warning("请勿重复添加！");
    return;
  }
  mylist.value.push(getCardData.value);
  toolCollect(getCardData.value.id).then(res => {
    ElMessage.success("添加成功");
  })
};


const dragEvent = computed(() => {
  return store.state.app.dragEvent;
});

// 拖拽进入
const handleDragOver = (e) => {
  console.log("拖拽进入")
  e.preventDefault();
  if (timeOut) {
    clearTimeout(timeOut);
    timeOut = null;
  }
};
let thatIndex = -1;
/**
 * 点击菜单时触发
 */
const currentData = (index) => {
  thatIndex = index;
}
/**
 * 删除菜单事件触发
 */
const deleteContrast = () => {
  let data = mylist.value.splice(thatIndex, 1);
  toolCollect(data[0]?.id).then(res => {
    ElMessage.success("删除成功");
  })
}

const toolList = ref([])

/**
 * 获取工具箱列表
 */
const getToolMenuList = () => {
  toolList.value = []
  toolMenuList().then(res => {
    res.data.forEach(item => {
      toolList.value.splice(0, 0, item)
    })
    store.commit("tool/SET_TOOL_MENU", toolList)
  });
}


/**
 * 获取 收藏列表
 */
const getCollectList = () => {
  collectList().then(res => {
    mylist.value = res.data;
  });
}

</script>
<style scoped lang="scss">
@import "./style.scss";

.order {
  display: flex;
  align-items: center;
  //justify-content: center;
  border-top: 1px solid #3F4148;
  border-bottom: 1px solid #3F4148;
  width: 95%;
  height: 51px;
}

.emptyMylist {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #595F76;
  font-size: 12px;
  flex-direction: column;
}

.image-icon {
  position: relative;

  .status {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 10px;
    transform: scale(0.8);
    z-index: 1;
    padding: 5px;
    border-radius: 3px;
    text-align: center;
  }

  .start-color {
    color: #20a0ff;
    background-color: rgba(41, 42, 48, 0.5);
  }

  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }
}

.icon-arrow {
  padding: 12px;
  background-repeat: no-repeat;
  background-image: url("@/assets/icons/clouddisk/icon_xiala.png@2x.png");
}

.l-icon {
  display: inline-block;
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 100%;
  transition: 0.2s;
}
</style>
