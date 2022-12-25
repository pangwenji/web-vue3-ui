<template>
	<div class="down-deliver">
		<div class="down-header">
			<div @click="closeDown" class="close-btn">
				<el-icon color="#79bbff"><Close /></el-icon>
			</div>
			<span>下载交付</span>
		</div>
		<div class="down-content">
			<div class="dc-left">
				<p>物料基础</p>
				<ul>
					<li v-for="(item, index) in typeList" :key="index" :class="{'active-li':chooseIndex === index}" @click="chooseType(index)">
						<span>{{item.name}}</span>
						<span class="li-right">{{item.count_number}}</span>
					</li>
				</ul>
			</div>
			<div class="dc-right">
				<div v-for="(item, index) in rightList" :key="index" v-show="chooseIndex===index || chooseIndex===0" class="file-box">
					<p>{{item.name}}</p>
					<div class="file-container">
						<div class="file-info">
							<div class="file-cover-wrap">
								<img src="https://cdn-pub.yueliu.cloud//coverImg/b3c46cdeabc87e8158eb3e2d23b90013-f8137ad508e27f8d8b4803cef3a5dfc8.jpeg" alt="">
							</div>
							<div class="file-detail-wrap">
								<div class="file-name">23165903ewzy.mp4</div>
								<div class="file-detail-info">
									<span>2040 x 1350</span>
									<span>1.03MB</span>
								</div>
							</div>
						</div>
						<div class="down-icon-list">
							<div class="down-icon">
								<el-icon><Download /></el-icon>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from 'vue-demi';


const emit = defineEmits();
const typeList = ref([
	{
		name: '全部',
		count_number: 7
	},
	{
		name: '原始文件',
		count_number: 1
	},
	{
		name: '视频',
		count_number: 1
	},
	{
		name: '音频',
		count_number: 1
	},
	{
		name: '图片',
		count_number: 2
	},
	{
		name: '审评意见',
		count_number: 2
	}
])
const rightList = ref([]);
const chooseIndex = ref(0);

onMounted(() => {
	rightList.value = typeList.value.slice(1);
	
})

function closeDown() {
	emit('closeDown');
}

function chooseType(type) {
	chooseIndex.value = type;
}


</script>

<style scoped lang="scss">
  @import "./style.scss";
</style>
