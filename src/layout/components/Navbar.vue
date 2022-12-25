<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container"  :is-active="getters.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!$store.state.settings.topNav&&$store.state.settings.showBreadcrumb" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="$store.state.settings.topNav && !$store.state.settings.customNav" />
    <direction-arrow />
    <router-view name="headerLeft" style="display:inline-block; line-height: 60px;"></router-view>
    <!-- <header- -->
    <div class="right-menu">
      <!-- <template v-if="getters.device !== 'mobile'"> -->
        <!-- <header-search id="header-search" class="right-menu-item" /> -->

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <router-view name="headerRight"></router-view>
        <div class="right-advertising-box" v-if="store.state.user.member?.state !== 1"><img src="@/assets/home/discount-top.png" @click="router.push({path: '/user/center/member'})"></div>
        <transfer class="right-menu-item right-menu-transfer" />
        <user-message class="right-menu-item" />
      <!-- </template> -->
      <!-- <UserMenu></UserMenu> -->
      <!-- <header-search id="header-search" class="right-menu-item" /> -->
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import TopNav from '@/components/TopNav'
import UserMenu from './UserMenu'
import Transfer from './Transfer'
import RuoYiDoc from '@/components/RuoYi/Doc'
import RuoYiGit from '@/components/RuoYi/Git'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import UserMessage from './UserMessage'
import HeaderSearch from '@/components/HeaderSearch'
import DirectionArrow from './DirectionArrow'
import { useRoute, useRouter } from 'vue-router'
const store = useStore();
// const router = useRoute();
const router = useRouter();

const getters = computed(() => store.getters);

function toggleSideBar() {
  store.dispatch('app/toggleSideBar')
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #EEEEEE;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    display: flex;

    &:focus {
      outline: none;
    }
    .right-advertising-box{
      width: 100px;
      height: 100%;
      display: flex;
      align-items: center;
      margin-right: 20px;
      img{
        width: 100%;
        height: 26px;
        cursor: pointer;
      }
    }
    .right-menu-transfer{
      padding: 0px !important;
    }
    .right-menu-item {
      // display: inline-block;
      padding:0px 12px;
      height: 100%;
      font-size: 14px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
  }
}
</style>
