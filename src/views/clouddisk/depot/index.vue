<template>
  <el-container style="height: 100%">
    <!-- <LeftSider></LeftSider> -->
    <div v-if="recycleList.length > 0" class="depot-box">
			<div class="depot-header">
				<div class="header-l">
					<el-button type="danger" @click="handleEmpty" round>全部清空</el-button>
					<div style="margin-left:20px;">
						<span>{{recycleList.length}}个对象</span>
						<span>{{formatSize(size)}}</span>
					</div>
				</div>
				<div class="header-r">
					<ActionSort :isAsc="sortData.isAsc" :sortKey="sortData.sortKey" @on-sort="handleSortData"></ActionSort>
				</div>
			</div>
			<div class="depot-content">
				<div class="table-header">
					<div class="title dname titname">文件名称</div>
					<div class="title dsize">大小</div>
					<div class="title ddelete">删除时间</div>
					<div class="title dhandle">操作</div>
				</div>
				<el-scrollbar>
					<div v-for="(item, index) in recycleList" :key="index" class="table-tr">
						<div class="tr-item tr-name dname" @click="handleClick">
							<div class="name-img">
								<FileType v-if="item.type === 1" type="folder"></FileType>
								<FileType v-else-if="item.fileCat === 'video' || item.fileCat === 'image'" type="url" :url="item.cover"></FileType>
								<FileType v-else :type="item.fileCat"></FileType>
							</div>
							<div class="tr-item name-info">
								<span>{{item.name}}</span>
							</div>
						</div>
						<div class="tr-item dsize">
							{{formatSize(item.size)}}
						</div>
						<div class="tr-item ddelete">
							{{item.updateTime}}
						</div>
						<div class="tr-item dhandle">
							<i class="icon-handle" @click="handleContextmenu(item)" v-contextmenu:contextmenuRef="{ trigger: 'click' }"></i>
						</div>
					</div>
				</el-scrollbar>
			</div>
		</div>
		<div v-else class="depot-empty">
			<el-icon size="40px"><Delete /></el-icon>
			<div style="margin-top:10px;">回收站为空</div>
			<div style="margin-top:10px;">你可以在这里对已删除的文件进行操作</div>
		</div>
  </el-container>
	<v-contextmenu :width="140" ref="contextmenuRef">
    <v-contextmenu-item @click="handleRestore">
      <i class="handle-icon icon-restore"></i>
			<span>放回原处</span>
    </v-contextmenu-item>
    <v-contextmenu-item @click="handleDelete">
      <i class="handle-icon icon-delete"></i>
      <span>彻底删除</span>
    </v-contextmenu-item>
  </v-contextmenu>
</template>
<script setup>
import LeftSider from "../components/LeftSider"
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { getRecycleList , recoverFile, thoroughDeleteFile, emptyRecycle, getFolderList } from '@/api/clouddisk/file.js'
import { onMounted, watch } from "@vue/runtime-core"
import { formatSize } from '@/utils/tool.js';
import FileType from '@/components/FileType';
import ActionSort from "@/views/project/index/projectRecover/ActionSort.vue"

const store = useStore()
const contextmenuRef = ref('')
const recycleList = ref([])
const handleData = ref({})
const sortData = reactive({
  isAsc: 1,
  sortKey: 'name',
})

onMounted(() => {
	getList()
})

function getList() {
	getRecycleList().then(res => {
		recycleList.value = res.data
	})
}
watch(recycleList, (newval) => {
	store.commit('clouddisk/SET_DELETE_COUNT', newval.length)
})

const size = computed(() => {
  return recycleList.value.reduce((total, item) => {
    return total + item.size;
  }, 0);
});

// 排序文件
const handleSortData = (data)=>{
	if(data){
		sortData.isAsc = data.isAsc;
		sortData.sortKey = data.type;
	}
  const orderBy = data.isAsc === 1 ? -1 : 1
  recycleList.value.sort((a, b) => {
    let x = a[data.type]
    let y = b[data.type]
    if (data.type === 'name') {
      x = x.toLowerCase()
      y = y.toLowerCase()
    }
    if (x < y) {return 1 * orderBy}
    if (x > y) {return -1 * orderBy}
    return 0;
  })
}

// 操作数据
function handleContextmenu(item) {
	handleData.value = item
}

// 清空
function handleEmpty() {
	ElMessageBox.confirm(
    '确定彻底删除回收站内的所有文件？删除后将不可找回。',
    '',
    {
    	customClass: 'messageBox-custom-warning',
			title: '清空回收站',
      confirmButtonText: '清空',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
	.then(() => {
		const loading = ElLoading.service({
			lock: true,
			background: 'rgba(0, 0, 0, 0.7)',
		})
		emptyRecycle().then(res => {
			recycleList.value = []
			ElMessage({
				type: 'success',
				message: '清空成功',
			})
      loading.close()
		}).catch(err => {
      loading.close()
		})
	})
	.catch(() => {
		ElMessage({
			type: 'info',
			message: '取消清空',
		})
	})
}

function handleClick() {
	ElMessage({
    message: '回收站内无法预览，请先恢复文件',
    type: 'warning',
  })
}

// 恢复
function handleRestore() {
	const loading = ElLoading.service({
		lock: true,
		background: 'rgba(0, 0, 0, 0.7)',
	})
	recoverFile({id: handleData.value.id}).then(res => {
		recycleList.value = recycleList.value.filter(el => el.id !== handleData.value.id)
		ElMessage({
			message: '操作成功',
			type: 'success',
		})
		loading.close()
		if (handleData.value.type === 1) {
			getFolderList({parent_id: 0}).then(res => {
				store.commit('clouddisk/SET_TREE_DATA', [])
				setTimeout(() => {
					store.commit('clouddisk/SET_TREE_DATA', res.data)
				}, 0);
			})
		}
	}).catch(err => {
		loading.close()
	})
}

// 彻底删除
function handleDelete() {
	ElMessageBox.confirm(
    `彻底删除文件/文件夹 <span style="color:red;">"${handleData.value.name}"</span>？删除后将不可找回。`,
    '',
    {
    	customClass: 'messageBox-custom-warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true,
    }
  )
	.then(() => {
		const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)',
    })
		thoroughDeleteFile({id: handleData.value.id}).then(res => {
			recycleList.value = recycleList.value.filter(el => el.id !== handleData.value.id)
			ElMessage({
				type: 'success',
				message: '删除成功',
			})
      loading.close()
		}).catch(err => {
      loading.close()
		})
	})
	.catch(() => {
		ElMessage({
			type: 'info',
			message: '取消删除',
		})
	})
}
</script>
<style scoped lang="scss">
  @import "./style.scss";
</style>
