<template>
  <el-container style="height: 100%">
    <!-- <LeftSider></LeftSider> -->
    <div class="share-box">
			<div class="table-header">
				<div class="title sname">
					<span class="sort-icon " :class="sortData.name?'asc':'desc'" @click="handleSortData('name')">分享名称</span>
				</div>
				<div class="title stime">
					<span class="sort-icon " :class="sortData.createTime?'asc':'desc'" @click="handleSortData('createTime')">分享时间</span>
				</div>
				<div class="title snumber">
					<span class="sort-icon " :class="sortData.accessCount?'asc':'desc'" @click="handleSortData('accessCount')">访问人数</span>
				</div>
				<!-- <div class="title sswitch">链接开关</div> -->
				<div class="title sstatus">链接状态</div>
				<div class="title slink">链接</div>
				<div class="title shandle">操作</div>
			</div>
      <el-scrollbar>
				<div v-for="(item, index) in shareList" :key="index" class="table-tr">
					<div class="tr-item tr-name sname">
						<div style="flex: none; width: 56px; height: 56px;">
                <FileType type="folder"  v-if="item.fileCat === 'dir'" ></FileType>
                <FileType type="url" fit="cover" :url="item.cover"  v-else-if="item.cover" ></FileType>
                <FileType :type="item.fileCat" v-else ></FileType>
            </div>
						<span style="margin-left:8px;">{{item.name}}</span>
					</div>
					<div class="tr-item stime">
						{{item.createTime}}
					</div>
					<div class="tr-item snumber">
						{{item.accessCount}}
					</div>
					<!-- <div class="tr-item sswitch">
						<el-switch v-model="item.status" />
					</div> -->
					<div class="tr-item sstatus">
						{{item.period===0?'永久有效':(item.timeLeft>0?'剩余'+item.timeLeft+'天':'已过期')}}
					</div>
					<div class="tr-item tr-link slink">
						<!-- <span @click="handleQrcode(item)">
							<i class="tr-icon icon-qrcode"></i>
						</span> -->
						<span @click="handleUrl(item)">
							<i class="tr-icon icon-link"></i>
						</span>
					</div>
					<div class="tr-item shandle">
						<i class="tr-icon icon-handle" @click="handleClick(item)" v-contextmenu:contextmenuRef="{ trigger: 'click' }"></i>
					</div>
				</div>
			</el-scrollbar>
    </div>
  </el-container>
	<v-contextmenu :width="140" ref="contextmenuRef">
    <!-- <v-contextmenu-item @click="handleSetting">
      <i class="handle-icon icon-share"></i>
			<span>分享设置</span>
    </v-contextmenu-item> -->
    <v-contextmenu-item @click="handleDelete">
      <i class="handle-icon icon-delete"></i>
      <span>删除记录</span>
    </v-contextmenu-item>
  </v-contextmenu>

	<ShareInfoDialog
		ref="shareInfoRef"
		:shareInfoShow="shareInfoShow"
		:shareInfo="shareDetail"
		@shareInfoClose="shareInfoClose"
	></ShareInfoDialog>

</template>
<script setup>
import LeftSider from "../components/LeftSider";
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { myShareList, deleteProjectShare, getShareDetails } from "@/api/clouddisk/share.js"
import { onMounted } from "@vue/runtime-core";
import ShareInfoDialog from '../components/ShareInfoDialog/index'
import FileType from "@/components/FileType"

const { proxy } = getCurrentInstance();
const contextmenuRef = ref('')
const value1 = ref('')
const shareList = ref([])
const handleData = ref({})
const shareInfoShow = ref(false)
const sortData = reactive({
	name: 1,
	createTime: 1,
	accessCount: 1
})

onMounted(() => {
	getMyShareList()
})

function getMyShareList() {
	myShareList().then(res => {
		shareList.value = res.data
	})
}

function handleSortData(key) {
	
	// if(data){
	// 	sortData.isAsc = data.isAsc;
	// 	sortData.sortKey = data.type;
	// }
  // const orderBy = data.isAsc === 1 ? -1 : 1
  // recycleList.value.sort((a, b) => {
  //   let x = a[data.type]
  //   let y = b[data.type]
  //   if (data.type === 'name') {
  //     x = x.toLowerCase()
  //     y = y.toLowerCase()
  //   }
  //   if (x < y) {return 1 * orderBy}
  //   if (x > y) {return -1 * orderBy}
  //   return 0;
  // })

	sortData[key] = sortData[key] ? 0 : 1;
  const orderBy = sortData[key] === 1 ? -1 : 1
  shareList.value.sort((a, b) => {
    let x = a[key]
    let y = b[key]
    if (key === 'name') {
      x = x.toLowerCase()
      y = y.toLowerCase()
    }
    if (x < y) {return 1 * orderBy}
    if (x > y) {return -1 * orderBy}
    return 0;
  })
}

const shareDetail = ref({})
const shareInfoRef = ref('')
function handleQrcode(item) {
	shareInfoShow.value = true
	shareInfoRef.value.loadingStatus = true
	getShareDetails({id: item.id}).then(res => {
		shareDetail.value = res.data
		shareInfoRef.value.loadingStatus = false
	})
}

function handleUrl(item) {
	shareInfoShow.value = true
	shareInfoRef.value.showType = 'url'
	shareInfoRef.value.loadingStatus = true
	getShareDetails({id: item.id}).then(res => {
		shareDetail.value = res.data
		shareInfoRef.value.loadingStatus = false
	})
}

// 分享信息关闭
const shareInfoClose = () => {
  shareInfoShow.value = false
	shareDetail.value = {}
}

// 操作数据
function handleClick(item) {
	handleData.value = item
}

// 设置分享
function handleSetting() {}

// 删除分享
function handleDelete() {
	ElMessageBox.confirm(
    '确定删除该分享？',
    '',
    {
    	customClass: 'messageBox-custom-warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
	.then(() => {
		const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0.7)',
    })
		deleteProjectShare({id: handleData.value.id}).then(res => {
			ElMessage({
				type: 'success',
				message: '删除成功',
			})
			shareList.value = shareList.value.filter(el => el.id !== handleData.value.id)
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
