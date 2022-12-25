<template>
  <el-container class="user-container">
    <div class="user-side">
      <div>
        <template v-for="(item,index) in menus" :key="index">
          <router-link :to="item.path" class="menu-item" :class="{'action': item.path === nowPath}" v-if="item.visible">
            <!--                    <svg-icon :iconClass="item.icon" :size="24"></svg-icon>-->
            <i class="user-icon" :class="item.icon"></i>
            <div class="menu-item-name">{{ item.name }}</div>
          </router-link>
        </template>
      </div>
      <div style="display: flex;justify-content: center;">
        <div class="btn" @click="logout">退出登录</div>
      </div>
    </div>
    <el-main class="user-main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script setup>
import {ref, computed,watch, onMounted, getCurrentInstance} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessageBox} from "element-plus";
import {useStore} from "vuex";
const { proxy } = getCurrentInstance();
const route = useRoute();
const store = useStore();

const nowPath = ref('');
onMounted(() => {
  nowPath.value = route.path;
});
watch(route, () => {
  nowPath.value = route.path;
})
const menus = [
  // {
  //   name: '我的首页',
  //   icon: 'icon-home',
  //   path: '/user/center/account'
  // },
  {
    name: '我的钱包',
    icon: 'icon-home',
    path: '/user/center/wallet',
    visible: true
  },
  {
    name: '我的订单',
    icon: 'icon-order',
    path: '/user/center/order',
    visible: true
  },
  {
    name: '空间容量',
    icon: 'icon-space',
    path: '/user/center/space',
    visible: true
  },
  {
    name: '会员方案',
    icon: 'icon-member',
    path: '/user/center/member',
    visible: true
  },
  {
    name: '发票管理',
    icon: 'icon-kaipiao',
    path: '/user/center/fapiao',
    visible: true
  },
  {
    name: '账号设置',
    icon: 'icon-set',
    path: '/user/center/setting',
    visible: true
  },
  {
    name: '我的推广',
    icon: 'icon-tuiguang',
    path: '/user/center/invite',
    visible: false
  },
  {
    name: '我的推广',
    icon: 'icon-tuiguang',
    path: '/user/center/promote',
    visible: store.state.user.member?.state === 1
  },
]
const router = useRouter();

const logout = () => {
  // buttonRef.value.click();
  ElMessageBox.confirm('确定要退出系统吗？', '退出提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    customClass: 'messageBox-custom-warning',
    center:true,
  }).then(() => {
    proxy.$sessionBox.unMounted();
    store.dispatch('LogOut').then(() => {
      // location.href = '/index';
      router.push({path: '/login'})
    })
  }).catch(()=>{});
}
</script>
<style scoped lang="scss">
@import './style.scss';
.el-main{
  padding: 0;
}

.btn{
  width: 120px;
  height: 46px;
  background: #2D2F3C;
  box-shadow: inset 0px 0px 1px 0px #44485E;
  border-radius: 8px;
  color: #9094A6;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

</style>
