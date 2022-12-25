<template>
  <div class="material-left">
    <div>
      <template
          v-for="(item, index) in menuList"
          :key="index"
      >

        <div  v-if="item.title ==='素材库'"
            class="menu-item"
            :class="{ 'active-menu': item.path === nowPath }"
            @click="handleGo(item.path)">
          <i class="material-icon" :class="item.iconClass"></i>
          <span>{{ item.title }}</span>
          <span class="commercial">正版商用</span>
        </div>
        <div  v-else-if="item.title !=='购物车'"
            class="menu-item"
            :class="{ 'active-menu': item.path === nowPath }"
            @click="handleGo(item.path)">
          <i class="material-icon" :class="item.iconClass"></i>
          <span>{{ item.title }}</span>
        </div>

        <div v-else
          class="menu-item shoppingCart"
          @click="handleGo(item.path)">
          <div  class="flex">
            <i class="shoppingCart-icon" :class="item.iconClass"></i>
            <!--          <span>{{ item.title }}</span>-->
            <div>
              <div class="flex">
                <span style="margin-left: 3px;color: #FFFFFF">{{ totalPrice.toFixed(2) }}</span>
                <img src="@/assets/user/wallet/tongqian.png"   style="margin-left: 3px;"/>
              </div>
              <div style="font-size: 12px;color: #9094A6;text-align: center;">待结算</div>
            </div>
          </div>
          <div class="number" >{{ shoppingCartList.length > 99 ? '99+' : shoppingCartList.length }}</div>
        </div>


        <div class="menuT" v-if="index === 0">
          <div class="line-bottom"></div>
        </div>
      </template>
    </div>

    <div v-if="ADMINAUTH">
<!--    <div >-->
      <div class="line-bottom" style="margin: 0"></div>

      <div class="workspace-admin-sidebar">
        <div class="admin-sidebar-main">
          <div class="admin-sidebar-title" @click.stop="openAdminSidebar = !openAdminSidebar">
            <div class="sidebar-title-name">素材销售管理</div>
              <svg-icon className="sidebar-title-icon" iconClass="title-icon" :size="20"></svg-icon>
          </div>
          <div ref="adminSidebarRef" class="admin-sidebar-container">
            <div>
              <div class="admin-sidebar-content">
                <template v-for="(item,index) in menuListTwo" :key="index">
                  <router-link :to="item.path" class="admin-sidebar-item hover-active" :class="activeSidebarItem ==  item.path ?'active':''">
<!--                    <svg-icon className="sidebar-item-icon" iconClass="icon_work-library" :size="24"></svg-icon>-->
                    <i class="material-icon" :class="item.iconClass"></i>
                    <div class="sidebar-item-name">{{item.title}}</div>
                  </router-link>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import {useStore} from 'vuex';
import {computed,watchEffect,watch} from 'vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

//购物车列表数量
const shoppingCartList = computed(() => {
  return store.state.material.shoppingCartList;
});

const ADMINAUTH = computed(()=>store.state.material.ADMINAUTH);

const totalPrice = computed(() => {
  let total = 0;
  shoppingCartList.value.forEach((el) => {
    if(store.state.user.member?.state === 1){
      total += el.material?.memberPrice || 0;
    }else {
      total += el.material?.price || 0;
    }

  });
  return total;
});

const userId = computed(() => {
  return store.state.user.userId;
});

const activeSidebarItem = computed(() => {
  const { path } = route;
  return path;
});
const adminSidebarRef = ref();
const openAdminSidebar = ref(true);
watchEffect(() => {
  const el = adminSidebarRef.value;
  if (!el) { return }
  if (openAdminSidebar.value) {
    el.style.height = el.children[0].clientHeight + 'px'
  } else {
    el.style.height = '0px'
  }
}, { flush: 'post' })

const menuList = ref([
  {
    title: '素材库',
    path: '/material/main/index',
    iconClass: 'icon-quanbu ',
    count: 5,
    level: 1,
  },
  {
    title: '购物车',
    path: '/material/main/shoppingCart',
    iconClass: 'icon-buy',
    count: 0,
  },
  {
    title: '购买订单',
    path: '/material/main/orders',
    iconClass: 'icon-file',
    count: 0,
  },
  {
    title: '已购素材',
    path: '/material/main/purchased',
    iconClass: 'icon-Purchased',
    count: 0,
  },
  {
    title: '我的收藏',
    path: '/material/main/myCollection',
    iconClass: 'icon-shoucang',
    count: 0,
  },
]);

const menuListTwo = ref([
  {
    title: '素材仓库',
    path: '/material/main/depotMaterial',
    iconClass: 'icon-home',
    count: 0,
  },
  {
    title: '素材销售',
    path: '/material/main/sellMaterial',
    iconClass: 'icon-frequency',
    count: 0,
  },
]);

const nowPath = ref()
watch(() => route.path, newVal => {
  nowPath.value = route.path
})
// const nowPath = computed(() => route.path);
onMounted(() => {
  nowPath.value = route.path;
});

function handleGo(path) {
  //清除menuName，titleName
  // store.commit('material/SET_menuName', '');
  // store.commit('material/SET_TITLE_NAME', '音效');
  if(path == route.path){
    return
  }
  router.push(path);
  store.commit("material/SET_CHECK_IDS",[])
}

function toShoppingCart() {
  router.push('shoppingCart');
}
</script>
<style scoped lang="scss">
@import './style.scss';

.menuT {
  width: 100%;
  display: flex;
}

.line-bottom {
  width: 100%;
  margin: 16px 0;
  height: 1px;
  background-color: #3f4148;
}

.number {
  width: 18px;
  height: 18px;
  background: #ff3434;
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #ffffff;
  right: 5px;
}
.flex{
  display: flex;
  align-items: center;
}
</style>
