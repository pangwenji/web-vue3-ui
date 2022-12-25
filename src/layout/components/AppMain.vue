<template>
  <section class="app-main">
    <!-- <router-view></router-view> -->
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="fade-transform" mode="out-in"> -->
        <keep-alive :include="cachedViews">
          <component :is="Component"/>
        </keep-alive>
      <!-- </transition> -->
    </router-view>
  </section>
</template>

<script setup>
let store = useStore()
const route = useRoute()
store.dispatch('tagsView/addCachedView', route)
const cachedViews = computed(() => {
    return store.state.tagsView.cachedViews
})
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 30px 0 0 0px;
  background: #292A30;
  //background: #000;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>