<template>
    <el-container style="height:100%;">
        <LeftSider></LeftSider>
		<div class="right-content">
        	<router-view v-slot="{route,Component}">
				<component :is="Component" :key="route.path"></component>
			</router-view>
		</div>
    </el-container>
</template>
<script setup>
import { onMounted } from '@vue/runtime-core';
import LeftSider from '../components/LeftSider';

onMounted(() => {
})

</script>
<style scoped lang="scss">
.left-sider{
	width: 200px;
	height: 100%;
	background: #f4f4f4;
}
.right-content{
	width: calc(100% - 200px);
}
</style>