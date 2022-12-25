<template>
  <div class="left-sider-container">
    <div class="menu-item" :class="{'active-menu': activeMenu === item.activeMenu, 'disabled-menu': item.state === 3}" v-for="(item, index) in menuList" :key="index" @click="toPath(item)">
      <svg-icon v-if="(activeMenu === item.activeMenu)" :iconClass="`icon_${item.iconClass}_active`" size="26px"></svg-icon>
      <svg-icon v-else :iconClass="`icon_${item.iconClass}`" size="26px"></svg-icon>
      <span style="margin-left:10px" :title="item.hoverText">{{item.title}}</span>
    </div>
  </div>
</template>

<script setup>

const route = useRoute()
const router = useRouter()
const menuList = ref([
	{
		title:'版权存证',
		path: '/copyright/certificate/index',
		iconClass: 'certificate1',
    activeMenu: '/certificate',
    state: 1
	},
  {
		title:'版权登记',
		// path: '/copyright/certificate/index',
		iconClass: 'registration',
    activeMenu: '/certificate1',
    state: 3,
    hoverText: '即将上线'
	},
  {
		title:'版权监测',
		path: '/copyright/certificate/index',
		iconClass: 'monitoring',
    activeMenu: '/certificate2',
    state: 3,
    hoverText: '即将上线'
	},
  {
		title:'司法取证',
		path: '/copyright/certificate/index',
		iconClass: 'forensics',
    activeMenu: '/certificate3',
    state: 3,
    hoverText: '即将上线'
	},
  {
		title:'维权服务',
		path: '/copyright/certificate/index',
		iconClass: 'protect',
    activeMenu: '/certificate4',
    state: 3,
    hoverText: '即将上线'
	},
  {
		title:'电子合同',
		path: '/copyright/certificate/index',
		iconClass: 'contract',
    activeMenu: '/certificate5',
    state: 3,
    hoverText: '即将上线'
	}
]);

const activeMenu = computed(()=>{
  return route.meta.activeMenu;
})

function toPath(item) {
  if (item.state === 3) return;
  router.push(item.path)
}

</script>

<style  scoped lang="scss">
.left-sider-container {
  width: 199px;
  height: 100%;
  padding-top: 33px;
  flex-shrink: 0;
  box-sizing: border-box;
  font-size: 16px;
  background-color: #23242D;
	color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  border-right: 1px solid rgba($color: #979797, $alpha: .2);

  .menu-item {
    width: 180px;
    height: 45px;
    margin-bottom: 8px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
      background-color: #2F303C;
    }
  }
  .active-menu {
    background-color: #2F303C;
  }
  .disabled-menu {
    color: #9094A6;
    &:hover {
      cursor: auto;
      background-color: #23242D;
    }
  }
}
</style>