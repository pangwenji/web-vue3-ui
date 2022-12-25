<template>
  <div class="left-sider-container">
    <el-scrollbar  height="100%">
			<div>
				<div
					class="menu-item menu-title2" 
					:class="{'active-menu': nowPath === '/clouddisk/media/index'}"
				>
					<i class="menu-icon icon-file"></i>
					<div class="menu1-r">
						<span @click="handleGo('/clouddisk/media/index')">全部文件</span>
						<i class="l-icon icon-arrow icon-add-h" :style="{transform: `rotate(${openCat?'0':'-90'}deg)`}" @click="handleShowCat"></i>
					</div>
				</div>
				<div v-show="openCat">
					<div
						class="menu-item menu-item2"
						v-for="(item, index) in menusAssort"
						:class="{'active-menu': index+1 === assortId*1}"
						:key="index"
					@click="handleGo(item.path)"
					>
						<i class="menu-icon" :class="item.iconClass"></i>
						<span>{{item.title}}</span>
					</div>
				</div>
			</div>

			<div>
				<div
					v-for="(item, index) in menusTop"
					:key="index"
					class="menu-item"
					:class="{'active-menu': item.path === nowPath}"
					@click="handleGo(item.path)"
				>
					<i class="menu-icon" :class="item.iconClass"></i>
					<span>
						{{item.title}}
						<span v-if="item.count > 0">({{item.count}})</span>
					</span>
				</div>
			</div>
			<!-- <div class="line-bottom"></div> -->

			<div>
				<div style="margin-bottom:4px;" class="menu-item menu-title2" @click="handleShowFolder">
					<el-icon v-if="!openFolder" :size="20"><CaretRight /></el-icon>
					<el-icon v-else :size="20"><CaretBottom /></el-icon>
					<div class="menu1-r" style="margin-left:8px;">
						<span>文件夹</span>
					</div>
					<i class="l-icon icon-add" @click.stop="handleAddFolder"></i>
				</div>
				<div v-show="openFolder" style="margin-left: 10px;">
					<div class="add-box" v-show="showAddFolder">
						<i class="l-icon icon-folder"></i>
						<el-input
							ref="addRef"
							style="width: calc(100% - 24px);"
							maxlength="30"
							v-model="folderName"
							placeholder="输入文件夹名称"
							@blur="handleAddSubmit0"
						/>
					</div>
					<Tree
						v-if="treeData.length > 0"
						:data="treeData"
						label="name"
						children="childrens"
						:load="loadNode"
						:lazy="true"
						:nodeClick="handleNodeClick"
						:newFolder="handleAddSubmit"
						:onDetele="handleDelete"
						:onRename="handleRenameSubmit"
					></Tree>
				</div>
			</div>

		</el-scrollbar>
  </div>
</template>
<script setup>
import FolderTree from '../FolderTree/index.vue'
import { nextTick, onMounted, reactive, watch } from "vue-demi"
import {
	getFolderList,
	getFileList,
	deleteFile,
	createDirectory,
	rename
} from "@/api/clouddisk/file.js"
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import cache from '@/plugins/cache'
import Tree from '../Tree/index'

const store = useStore()
const route = useRoute();
const router = useRouter();
const showFileClass = ref(false)
// const showFolder = ref(false)

const menusTop = ref([
	{
		title:'回收站',
		path: '/clouddisk/media/depot',
		iconClass: 'icon-recycle',
		count: 0
	},
	{
		title:'分享',
		path: '/clouddisk/media/share',
		iconClass: 'icon-share',
		count: 0
	}
]);

const menusAssort = ref([
	{
		title:'视频',
		path: '/clouddisk/media/assort/1',
		iconClass: 'icon-video',
		count: 5
	},
	{
		title:'音频',
		path: '/clouddisk/media/assort/2',
		iconClass: 'icon-audio',
		count: 0
	},
	{
		title:'图片',
		path: '/clouddisk/media/assort/3',
		iconClass: 'icon-picture',
		count: 0
	},
	{
		title:'文档',
		path: '/clouddisk/media/assort/4',
		iconClass: 'icon-file',
		count: 0
	},
	{
		title:'其他',
		path: '/clouddisk/media/assort/5',
		iconClass: 'icon-others',
		count: 0
	}
])
const rightClickData = ref({}) //右键项信息
const treeRef = ref('')
// const treeData = ref([])
const folderName = ref('新建文件夹')
const assortId = ref(0)

onMounted(() => {
	menusTop.value[0].count = deleteCount
	assortId.value = route.params.assortId * 1
	getDirectoryList(0)
})

const openCat = computed(()=>{
  return store.state.clouddisk.openCat
})

const openFolder = computed(()=>{
  return store.state.clouddisk.openFolder
})

const deleteCount = computed(()=>{
  return store.state.clouddisk.deleteCount
})

const treeData = computed(()=>{
  return store.state.clouddisk.treeData || []
})

const breadcrumbs = computed(()=>{
  return store.state.clouddisk.breadcrumbs;
})

const lastBreadcrumbs = computed(()=>{
  const length = breadcrumbs.value?.length || 0
  return length > 0 ? breadcrumbs.value[length - 1] : {}
})

const nowPath = computed(()=>{
  return route.path;
})

const folderList = computed(() => {
  return store.state.clouddisk.folderList || []
})

watch(route, newVal => {
	if (newVal.path.includes('media/assort')) {
		assortId.value = newVal.params.assortId * 1
	} else {
		assortId.value = 0
	}
})

function handleShowCat() {
	store.commit('clouddisk/SET_OPEN_CAT',!openCat.value)
}

function handleShowFolder() {
	store.commit('clouddisk/SET_OPEN_FOLDER', !openFolder.value)
}

function handleGo(path) {
	router.push(path)
}

function getDirectoryList(parent_id) {
	getFolderList({parent_id}).then((res) => {
		// treeData.value = res.data
		store.commit('clouddisk/SET_TREE_DATA', res.data)
	}).catch(err => {
		console.log('初始化文件夹菜单错误', err);
	})
}

// 获取文件列表
function getFiles(parent_id) {
	getFileList({parent_id}).then(res => {
		store.commit('clouddisk/SET_FILE_LIST', res.data)
	})
}

// 文件夹tree加载
const loadNode = async (node, resolve) => {
	const { layerArr, childrens } = node
	if (childrens && childrens.length > 0) {
		handleNodeClick(node,'')
		resolve(childrens);
	} else {
		router.push('/clouddisk/media/folder/' + node.id)
    	store.commit('clouddisk/SET_OPEN_FOLDER_LOADING', true)
		await getFolderList({parent_id: node.id}).then((res) => {
			store.commit('clouddisk/SET_FOLDER_LIST', res.data)
			resolve(res.data)
		}).catch((err) => {
			resolve([])
		})
    	store.commit('clouddisk/SET_OPEN_FOLDER_LOADING', false)
	}
}

// 点击已加载下级的菜单
const handleNodeClick = (data) => {
	const { layer } = data
	if (!data.node || route.params.id * 1 === data.node.id) return;
	setCRUMBS(layer instanceof Array ? layer : data.layerArr)
	router.push('/clouddisk/media/folder/'+ data.node.id)
}

// 设置面包屑
function setCRUMBS(layer) {
	const bcArrs = []
	let list = treeData.value.slice()
	layer.forEach(el => {
		bcArrs.push({
			parentId: list[el].id,
			name: list[el].name
		})
		list = list[el].childrens
	})
	cache.session.setJSON('sessionCloudCRUMBS', bcArrs)
	store.commit('clouddisk/SET_BREAD_CRUMBS', bcArrs)
}

// 右键文件夹
function rightClick(data) {
	rightClickData.value = data
}

function handleShare() {

}

function handleNewFolder() {

}

function handleRename() {

}

// 删除文件夹
function handleDelete(item, layer) {
	ElMessageBox.confirm(
    `确定删除文件/文件夹 <span style="color:red;">"${item.name}"</span>？包含文件夹内所有文件？删除后文件将被移至回收站。`,
    '',
    {
    	customClass: 'messageBox-custom-warning',
      confirmButtonText: '确定',
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
		deleteFile({id: item.id}).then(res => {
			ElMessage({
				type: 'success',
				message: '删除成功',
			})

			const layerArr = layer.slice()
			const lastIndex = layerArr.pop()
			let list = treeData.value
			layerArr.forEach(el => {
				list = list[el].childrens
			})
			const parentId = list[0].parentId
			list.splice(lastIndex, 1)
      loading.close()

			if (treeData.value.length === 0) {
				router.replace('/clouddisk/media/index')
				return
			}

			const bdIndex = breadcrumbs.value.findIndex(el => (el.parentId === item.id || el.parentId === item.parentId))
			if (bdIndex !== -1) {
				if (item.parentId === 0) {
					setCRUMBS([0])
					const pid = treeData.value[0].id
					router.replace('/clouddisk/media/folder/'+ pid)
					store.dispatch("clouddisk/handleOpenFolder", {id: pid}).then(res=>{
					}).catch(err=>{
						console.log(err);
					})
				} else {
					setCRUMBS(layerArr)
					if (layerArr.length > 0) {
						router.replace('/clouddisk/media/folder/'+ parentId)
						store.dispatch("clouddisk/handleOpenFolder", {id: parentId}).then(res=>{
						}).catch(err=>{
							console.log(err);
						})
					} else {
						store.commit('clouddisk/SET_FOLDER_LIST', [])
						store.commit('clouddisk/SET_FILE_LIST', [])
					}
				}
			}
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

// 点击新增文件夹
const showAddFolder = ref(false)
const addRef = ref('')
function handleAddFolder() {
	if (!openFolder.value) {
		store.commit('clouddisk/SET_OPEN_FOLDER', true)
	}
	showAddFolder.value = true
	nextTick(() => {
    addRef.value.select()
  })
}

function handleAddSubmit0() {
	if (folderName.value === '') {
		ElMessage.error('文件夹名称不能为空')
		addRef.value.focus()
		return
	}
	const data = {
		parentId: 0,
		name: folderName.value,
		layer: []
	}
	handleAddSubmit(data).then(res => {
		showAddFolder.value = false
		folderName.value = '新建文件夹'
	})
}

// 提交新增文件夹
async function handleAddSubmit(data) {
	const params = {
		name: data.name,
		parentId: data.parentId
	}
	const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
	await createDirectory(params).then(res => {
		ElMessage.success('创建成功')
		const newTree = treeData.value.slice()
		if (data.layer?.length > 0) {
			let list = newTree
			data.layer.forEach(el => {
				list = list[el].childrens
			})
			list.unshift({...res.data, childrens: []})
		} else {
			newTree.unshift({...res.data, childrens: []})
		}
		store.commit('clouddisk/SET_TREE_DATA', newTree)

		const obj = res.data
		const layerArr = data.layer.length > 0 ?[...data.layer, 0] : [0]
		setCRUMBS(layerArr)
		router.push('/clouddisk/media/folder/' + obj.id)
		const bcArrs = breadcrumbs.value.slice()
		cache.session.setJSON('sessionCloudCRUMBS', bcArrs)
		store.commit('clouddisk/SET_BREAD_CRUMBS', bcArrs)
		store.commit('clouddisk/SET_FILE_LIST', [])
		store.commit('clouddisk/SET_FOLDER_LIST', [])

		loading.close()

	}).catch(ree => {
		showAddFolder.value = false
		folderName.value = ''
		ElMessage.error('创建错误')
		loading.close()
	})
}

async function handleRenameSubmit(data) {
	const loading = ElLoading.service({
		lock: true,
		background: 'rgba(0, 0, 0, 0.7)',
	})
  await rename({id: data.id, name: data.name}).then(res => {
    ElMessage.success('重命名成功')
		loading.close()
		// Tree
		if (data.layer?.length > 1) {
			const layerArr = data.layer.slice()
			const lastIndex = layerArr.pop()
			let list = treeData.value
			layerArr.forEach(el => {
				list = list[el].childrens
			})
			list[lastIndex].name = data.name
		} else {
			treeData.value[data.layer[0]].name = data.name
		}
		// 面包屑
		const bcArrs = breadcrumbs.value.slice()
		bcArrs.forEach(el => {
			if (el.parentId === data.id) {
				el.name = data.name
			}
		})
		// 文件夹列表
		folderList.value.forEach(el => {
			if (el.id === data.id) {
				el.name = data.name
			}
		})
  }).catch(err => {
		loading.close()
	})
}


</script>
<style scoped lang="scss">
  @import "./style.scss";
</style>
