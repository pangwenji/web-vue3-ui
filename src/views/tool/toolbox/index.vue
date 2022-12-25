<template>
  <div style="height: 100%" class="main-big-box">
    <div class="tool-header">
      <div class="tool-top">
        <!--        <el-image style="width: 30px;margin-right: 10px" :src="thisMenu?.icon">-->
        <!--          <template #error>-->
        <!--            <div class="image-slot">-->
        <!--              <el-icon>-->
        <!--              </el-icon>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-image>-->
        {{ thisMenu?.name || "全部工具" }}
      </div>
      <!--      <div v-else class="top-icon">-->
      <!--        &emsp;&emsp;TOP-->
      <!--      </div>-->
      <div>
        <el-input
            :input-style="inputStyle"
            v-model="searchValue"
            placeholder="快速搜索"
            style="width: 203px;height: 38px;margin-right: 15px; background: #24262F;"
            :suffix-icon="Search"
            @keyup.enter="search"
            @blur="search"
        />
      </div>
    </div>
    <el-scrollbar height="100%" v-loading="loading"
                  element-loading-text="加载中..."
                  element-loading-background="rgba(0, 0, 0, 0.6)">
      <div class="main-box">
        <el-row :gutter="30"
        >
          <el-col
              v-for="(card, index) in cardData"
              :key="card.id"
              :xl="4"
              :lg="6"
              :span="6"
              :style="{maxWidth: column,flex:column?('0 0 ' + column) : false}"
              style="padding-left:10px;padding-right:10px;"
              class="margin-top20 size"
          >
            <tool-card @click="handleGo(card)" :data="card"></tool-card>
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>
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
import ToolCard from "../components/toolCard";
import {ref, computed, onMounted} from "vue"
import {useStore} from 'vuex'
import {Search} from '@element-plus/icons-vue'
import {useWindowSize} from '@vueuse/core'
import {toolDetailList, getAssistInfo, toolAssist} from "@/api/toolbox/toolbox";
import top from "@/assets/tool/top.png"
import ToolCanDialog from '../components/ToolCanDialog'

const searchValue = ref('')
const router = useRouter();
const loading = ref(false);
const thisData = ref({});
const openDialog = ref(false);
const assistId = ref(-1);
import { getToken, setToken } from '@/utils/auth'
function handleGo(card) {
  if (card.devStatus === 1 || card.devStatus === 0) {
    getAssistInfo(card.id).then(res => {
      assistId.value = res.data;
      openDialog.value = true;
    });
    thisData.value = card;
  } else {
    if (router.currentRoute.value.name?.indexOf("toolDesktop")===-1){
      router.push({
        path: card.webUrl,
        query: {id: card.id}
      })
    }else {
      router.push({
        path: card.webUrl.replace("tool/index","toolDesktop"),
        query: {id: card.id}
      })
    }
  }

}

function confirm() {
  if (assistId.value === -1) {
    toolAssist(thisData.value.id);
    assistId.value = 10;
  }
}

const inputStyle = ref({
  width: '203px',
  height: '38px',
  background: '#1E1F26',
  'border-radius': '19px',
  border: '1px solid #292A30',
})
const thisMenu = ref({})

const toolList = computed(() => {
  return store.state.tool.toolMenu;
})

const store = useStore();
const route = useRoute();
const thisPath = ref(0);
const handleChangMain = (name) => {
  store.commit('tool/SET_TAB_NAME', name);
}
const tabName = computed(() => {
  return store.state.tool.tabName;
});

onMounted(() => {
  const path = route.path
  const pathArr = path.split('/')
  thisPath.value = Number.parseInt(pathArr[pathArr.length - 1])
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
  getToolDetailList();
  getThisMenu();
}
const cardData = ref({})
const rawData = ref({})
const layoutSpan = ref(5)
const column = ref(4)
const onresize = (clientWidth) => {
  if (clientWidth < 772) {
    column.value = 1;
  } else if (clientWidth < 1080) {
    column.value = 2;
  } else if (clientWidth < 1328) {
    column.value = 3;
  } else if (clientWidth < 1400) {
    column.value = 3.8;
  } else if (clientWidth < 1440) {
    column.value = 4;
  } else if (clientWidth < 1500) {
    column.value = 4;
  } else if (clientWidth < 1680) {
    column.value = 4.5;
  } else if (clientWidth < 1880) {
    column.value = 5;
  } else if (clientWidth < 2080) {
    column.value = 5;
  } else if (clientWidth < 2280) {
    column.value = 6;
  } else if (clientWidth < 3840) {
    column.value = 7.5;
  } else if (clientWidth < 5760) {
    column.value = 11.5;
  } else {
    column.value = 18;
  }
  column.value = String(100 / column.value) + '%';
}


/** 页面自动兼容 设计 */
const {width, height} = useWindowSize();
watchEffect(() => {
  onresize(width.value);
  // console.log(layoutSpan.value)
})
onresize(width.value)

// import { useRouter,onBeforeRouteUpdate } from 'vue-router';
// 获取工具列表
const getToolDetailList = () => {
  loading.value = true;
  toolDetailList({
    pageNum: 1,
    pageSize: 300,
    menuId: route.params.tool == -1 ? null : route.params.tool
  }).then(res => {
    rawData.value = res.rows;
    cardData.value = res.rows;
    loading.value = false;
  }).catch(err => {
    loading.value = false;
  });

}

function search() {
  if (searchValue.value === '') {
    getToolDetailList()
  } else {
    cardData.value = rawData.value
    const arr = cardData.value.filter(item => item.name.indexOf(searchValue.value) >= 0);
    cardData.value = arr
  }
}


//打印传递过来的数据

// onBeforeRouteUpdate((to) => {
//   console.log(router)
//   getToolDetailList();
// });
const getThisMenu = () => {
  thisMenu.value = toolList.value.find(res => {
    return res.id == route.params.tool
  })

}


watch(toolList, () => {
  getThisMenu();
})
watch(() => router.currentRoute.value.path, (newValue, oldValue) => {
  if (newValue) {
    getToolDetailList();
    getThisMenu();
  }
}, {immediate: true})

</script>
<style scoped lang="scss">
@import "./style.scss";

.el-col-5 {
  max-width: 20.8333333333%;
  flex: 0 0 19.9%;
}

.top-icon {
  width: 83px;
  height: 43px;
  background-image: url("@/assets/tool/top.png");
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #9094A6;
  line-height: 43px;
  margin-top: 15px;

}
</style>
