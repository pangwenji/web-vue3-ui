<template>
	<el-container style="height:100%;">

		<div class="header-content">
			<div>
				<div class="popContainer" v-show="!load"></div>
				<top-tab @onChangTab="handleChangTab"></top-tab>
			</div>

			<template v-if="typeId === 5">
				<video-waterfall :typeName="typeName" :typeId="typeId" ref="videoWaterfallRef"
					@onVideoTagChange="videoTagChange" @onGetList="getVideoMaterial" @onSortChange="handleSortChange"
					@onKeywordChange="handleKeywordChange" @onSucceed="handleSucceed"></video-waterfall>
			</template>

			<template v-else-if="typeId === 6">
				<waterfall :typeName="typeName" :typeId="typeId" ref="imageWaterfallRef"
					@onImageTagChange="imageTagChange" @onGetList="getImageMaterial" @onSortChange="handleSortChange"
					@onKeywordChange="handleKeywordChange" @onSucceed="handleSucceed"></waterfall>
			</template>
			<template v-else>
				<el-scrollbar ref="scroll" style="width: 100%;height: 100%">

					<div class="header-content-mid">
						<content-top :treeList="typeTreeList" :total="materialTotal" :typeId="typeId"
							@onTagsChange="handleTagsChange"></content-top>
					</div>
					<div class="header-content-midTwo">
						<content-mid :typeName="typeName" :total="materialTotal" :typeId="typeId"
							@onSortChange="handleSortChange" @onKeywordChange="handleKeywordChange"></content-mid>
					</div>

					<template v-if="typeId === 7">
						<div style="height: 1px;width:100%;background: rgba(255,255,255,0.1);"></div>
						<div class="flexB">
							<div class="input-box">
								<el-input class="input" v-model="font" @change="fontChange" placeholder="输入文字预览效果"
									@keydown.enter="previewFont">
									<template #suffix>
										<div class="preview" @click="previewFont">预览</div>
									</template>
								</el-input>
							</div>
							<div style="color: rgba(196,201,211,0.54);">
								<div @click="copyrightShow = true" class="copyrightText">
									<img src="@/assets/material/materialMain/icon_banquan.png"
										style="width:14px;height: 14px;margin-right: 3px">
									<span style="line-height: 20px;">版权声明</span>
								</div>
							</div>
						</div>
					</template>

					<div class="material-list" v-if="materialList.length || imageList.length > 0 || videoList.length > 0"
						v-loading="!load" element-loading-background="rgba(0, 0, 0, 0)">

						<el-row v-if="typeId === 3" :gutter="10">
							<template v-for="(item, index) in materialList" :key="item">
								<materialItem v-if="load" :data="item" :dataIndex="index" :playId="playId"
									@onUninterested="handleUninterested" @onCollection="handleCollection"
									@onCart="handleCart" @onPlay="handlePlay" @onPaySuccess="handlePaySuccess">
								</materialItem>
							</template>
						</el-row>

						<template v-else-if='typeId == 7'>
							<font-list v-model:viewName="viewName" v-model:load="load" :typeId="typeId"
								ref="otherWaterfallRef" :pageSize="pageSize" :pageNum="pageNum" :load="load"
								:materialTotal="materialTotal" :typeTreeList="typeTreeList" :materialList="materialList"
								:viewName="viewName" @onTagsChange="handleTagsChange" @onSortChange="handleSortChange"
								@onKeywordChange="handleKeywordChange" @onDownload="downMaterial"
								@pagination="handlePagination" @onGetList="getList" @onOpenNoInter="openNoInter">
							</font-list>
						</template>
					</div>

					<div style="font-size: 20px;color: white">
						<Grid class="grid" @click.stop="drawer = !drawer" />
						<word-right-popup v-model:show="drawer" @close="drawer = false" :tabListShow="tabListShow"
							:tabListHide="tabListHide" :typeOfWork="1"></word-right-popup>
					</div>

	</el-container>

	<!-- 支付确认 -->
	<PayConfirmDialog v-if="payShow" v-model:show="payShow" :orderInfo="orderInfo" @onClose="handlePayClose"
		ref="payShowDialog" @onPayConfirm="handlePayConfirm"></PayConfirmDialog>

	<!-- 不感兴趣 -->
	<div class="tip-dialog-box">
		<el-dialog v-model="noInterShow" title="不感兴趣?" width="350px" :show-close="false">
			<div class="tip-box">
				<div class="tip-title">不感兴趣?</div>
				<div class="tip-text">该内容将从您的素材库内永久删除，是否确认移除?</div>
				<div class="btn-bxo">
					<el-button @click="(noInterShow = false)">取消</el-button>
					<el-button color="#3468FE" type="primary" @click="handleAddUninterested">确定</el-button>
				</div>
			</div>
		</el-dialog>
	</div>

	<!--  购买成功提示弹窗-->
	<pay-succed-dialog ref="paySuccedDialog"></pay-succed-dialog>


</template>
<script setup name="material-IndexPage">
import MaterialLeft from "../components/MaterialLeft";
import topTab from "../components/content/topTab";
import { useStore } from 'vuex'
import { defineComponent, ref, computed, onMounted, watch, nextTick } from "vue"
import WordRightPopup from "../components/WordRightPopup"
import { getMaterialList, getMaterialTypeTreeList } from '@/api/material/index.js'
import ContentTop from "../components/content/contentTop";
import ContentMid from "../components/content/contentMid";
import waterfall from "../components/waterfall/index.vue";
import videoWaterfall from "../components/videoWaterfall/index.vue";
import ContentBottom from "../components/content/contentBottom";
import MaterialItem from './materialItem/index.vue'
import { getShoppingCartList } from "@/api/material/shoppingCart";
import { toRaw } from "vue-demi";
import { ElBacktop, ElMessage, ElMessageBox } from 'element-plus';
import { downloadMaterial, getImageList, getTypeOption, getVideoList, saveUninterested } from "../../../api/material";
import { onActivated } from "@vue/runtime-core";
import { downloadFileCurrent } from "../../../utils/tool";
import { createMaterialOrder } from "../../../api/material/order";
import PayConfirmDialog from '../components/PayConfirmDialog'
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import WordDialog from '@/plugins/pay/WordDialog'
import PaySuccedDialog from '../components/paySuccedDialog/index.vue'

const scroll = ref(null)
const isOnresize = ref(false)
const copyrightShow = ref(false)

onMounted(() => {
	// store.dispatch("material/getTypeList")
	window.onresize = () => {
		isOnresize.value = !isOnresize.value
	}
	load.value = false
})
const drawer = ref(false)
const store = useStore();
const typeName = ref('')
const font = ref('')//输入文字预览效果
const selectedLabelIds = ref([]) // 已选labelids
const labelTypeIds = ref([]) // 已选标签的二级标题id
const keyword = ref('')
const pageNum = ref(1)
const pageSize = ref(10)
const playId = ref(0)
const viewName = ref('中国智造ABCabc123');
const typeId = ref(0)
const sort = ref(0) // 排序 1热门 2最新

const copyrightList = [
	'您可以免费使用，包括商用，无论个人或企业，无需标明或知会原作者',
	'您可以任意安装，自由分享，允许嵌入于app或转换成woff',
	'您可以改作，允许衍生，允但衍生的字体须按SIL Open Font license1.1条款发行',
	'您不可用于违法行为，如因此产生的纠纷或法律诉讼，平台与作者不承担任何责任',
	'您不可直接将字体作为商品出售',
	'您不可进行改造后作为商品出售'
]
const tabName = computed(() => {
	const tabId = store.state.material.tabName
	if (tabId === 5) {
		typeId.value = store.state.material.tabName
		sort.value = null
	}

	return store.state.material.tabName
})


const load = ref(true)
//切换素材类型
let tabListShow = ref([])
let tabListHide = ref([])

function handleChangTab(item, item2, item3) {
	typeId.value = item.typeId
	typeName.value = item.typeName
	tabListShow.value = item2
	tabListHide.value = item3
	pageNum.value = 1
	selectedLabelIds.value = []
	labelTypeIds.value = []
	materialList.value = []
	typeTreeList.value = []
	keyword.value = ''
	load.value = false
	if (typeId.value === 6 || typeId.value === 5) {
		pageSize.value = 50
	} else if (typeId.value === 3 || typeId.value === 4) {
		pageSize.value = 12
	} else {
		pageSize.value = 10
	}
	TopTabRef.value.activeId = typeId.value
	getList();
	if (tid !== typeId.value) {
		getTypeTreeList();
	}
}


onBeforeRouteUpdate((to, from) => {
	tid = Number(from.query.typeId || '0');
	getAllData(to);
})

getTabList()

// 获取素材列表
function getList() {
	if (typeId.value == 6) {
		sort.value = null
		pageSize.value = 50
		// getImageMaterial()
	} else if (typeId.value == 5) {
		sort.value = null
		pageSize.value = 50
		// getVideoMaterial()
	} else {
		getMaterial()
	}
}


const materialList = ref([])
const materialTotal = ref(0)
const pageCount = ref(0)
const a = ref([])

let timer = null

//获取除图片和视频以外的素材列表
function getMaterial() {
	const query = {
		typeId: typeId.value,
		labels: selectedLabelIds.value || [],
		keyword: keyword.value || '',
		sort: sort.value,
		pageSize: pageSize.value,
		pageNum: pageNum.value,
		labelTypeIds: labelTypeIds.value || []
	}
	query.labels = query.labels.join()
	query.labelTypeIds = query.labelTypeIds.join()

	if (timer) {
		clearTimeout(timer);
		timer = null
	}
	timer = setTimeout(
		() => {
			timer = null
			getMaterialList(query).then(res => {
				if (!timer) {
					materialList.value = []
					res.rows.forEach(el => {
						const obj = el
						if (el.fileAttachedInfoDto) {
							obj.fileData = JSON.parse(el.fileAttachedInfoDto.fileInfo.metaData)
							if (typeId.value === 1 || typeId.value === 2) {
								obj.fileAttachedInfoDto.audioWave = JSON.parse(el.fileAttachedInfoDto.audioWave)
							}
						}
						materialList.value.push(obj)
					});
					load.value = true
					materialTotal.value = res.total
					pageCount.value = res.pageCount
				}
			}).catch(err => {
				if (!timer) {
					load.value = false
				}
			})
		}
		, 800);
}

//获取图片素材列表
const imageList = ref([])
const imageTypes = ref('')
const category = ref('')
const colors = ref('')
const orientations = ref('')
const imageWaterfallRef = ref()

function getImageMaterial() {
	const query = {
		imageTypes: imageTypes.value || '',
		category: category.value || '',
		colors: colors.value || '',
		orientations: orientations.value || '',
		query: keyword.value || '',
		sort: sort.value,
		pageSize: pageSize.value,
		pageNum: pageNum.value,
	}
	imageWaterfallRef.value?.getData(query)
}

//获取视频素材列表
const videoList = ref([])
const videoTypes = ref([])
const videoCategory = ref([])
const resolution = ref([])
const videoWaterfallRef = ref()

function getVideoMaterial() {
	const query = {
		videoTypes: videoTypes.value || '',
		category: videoCategory.value || '',
		resolution: resolution.value || '',
		query: keyword.value || '',
		sort: sort.value,
		pageSize: pageSize.value,
		pageNum: pageNum.value,
	}
	videoWaterfallRef.value?.getData(query)
}


//图片标签切换
const imageTagChange = (obj) => {
	imageTypes.value = obj.imageTypes.join() || ''
	category.value = obj.category.join() || ''
	colors.value = obj.colors.join() || ''
	orientations.value = obj.orientations.join() || ''
	pageNum.value = 1
	load.value = false
	getImageMaterial()
}
//视频标签切换
const videoTagChange = (obj) => {
	videoTypes.value = obj.videoTypes.join() || ''
	videoCategory.value = obj.videoCategory.join() || ''
	keyword.value = obj.resolution || null
	pageNum.value = 1
	load.value = false
	getVideoMaterial()
}
// 获取主类型的树状
const typeTreeList = ref([])

function getTypeTreeList() {
	const query = {
		typeId: typeId.value
	}
	if (typeId.value !== 5 && typeId.value !== 6) {
		getMaterialTypeTreeList(query).then(res => {
			typeTreeList.value = res.data.children || []
		})
	}
}

function previewFont() {
	if (!font.value) {
		ElMessage({
			type: 'warning',
			message: '请输入文字进行预览',
		});
	} else if (font.value.length > 15) {
		ElMessage({
			type: 'warning',
			message: '最多可输入15字进行预览',
		});
	} else {
		viewName.value = font.value
	}
}

function fontChange() {
	if (!font.value) {
		viewName.value = '中国智造ABCabc123'
		load.value = false
		getList()
	}
}

// 已选标签变化
function handleTagsChange(tagsIds, labIds) {
	if (tagsIds) {
		selectedLabelIds.value = tagsIds
	}
	labelTypeIds.value = labIds
	load.value = false
	pageNum.value = 1
	getList()
}

// 排序改变
function handleSortChange(sortType) {
	sort.value = sortType
	pageNum.value = 1
	load.value = false
	if (typeId.value === 6) {
		getImageMaterial()
	} else if (typeId.value === 5) {
		getVideoMaterial()
	} else {
		getList()
	}
}

// 关键词搜索
function handleKeywordChange(word) {
	keyword.value = word
	load.value = false
	pageNum.value = 1
	if (typeId.value === 6) {
		getImageMaterial()
	} else if (typeId.value === 5) {
		getVideoMaterial()
	} else {
		getList()
	}
}

// 页码改变
function handleCurrentChange(num) {
	pageNum.value = num
	load.value = false
	getList()
	backTop()
}

//每页尺寸改变
function handleSizeChange(size) {
	pageSize.value = size
	load.value = false
	getList()
	backTop()
}

// 不感兴趣
function handleUninterested() {
	getList()
}

function handleCollection(index) {
	materialList.value[index].collection = !materialList.value[index].collection
}

function handleCart(index) {
	materialList.value[index].shoppingCart = !materialList.value[index].shoppingCart
}

function handleSucceed(state) {
	load.value = state
	pageNum.value++;
}

// 当前播放
function handlePlay(pid) {
	playId.value = pid
}

//进行下载/购买的素材index，用于刷新购买状态
const buyIndex = ref(null)
function handleDownload(item, index) {
	buyIndex.value = index
	// if (!item.purchase) {
	handleBuy(item)
	// } else {
	//   downMaterial(item)
	// }
}

const money = computed(() => {
	return store.state.user.money;
})
const orderInfo = ref({});
const payShow = ref(false);
const { proxy } = getCurrentInstance();

const payShowDialog = ref()
function handleBuy(item) {
	const state = store.state.user.member.state
	if (money.value < (state === 1 ? item.memberPrice : item.price)) {
		ElMessageBox.confirm('当前同钱余额不足，是否立即充值同钱？', '提示', {
			customClass: 'messageBox-custom-warning',
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'info',
		})
			.then(() => {
				proxy.$pay.openRecharge()
			}).catch(() => {
				ElMessage({
					type: 'info',
					message: '取消购买',
				});
			});
	} else if (money.value >= (state === 1 ? item.memberPrice : item.price)) {
		createMaterialOrder({ materialIds: [item.id] }).then((res) => {
			// ElMessage({
			//   type: 'success',
			//   message: '创建订单成功',
			// });
			orderInfo.value = res.data
			orderInfo.value.name = item.name
			payShow.value = true
		});
	}
}

function downMaterial(item) {
	const id = item.id
	downloadFreeMaterial(id).then(res => {
		const url = res.data.downloadUrl
		const filename = res.data.filename
		downloadFileCurrent(url, filename)
	})
}

function handlePayClose() {
	payShow.value = false
}

//购买成功提示弹窗
const paySuccedDialog = ref(null)
// 确认支付
function handlePayConfirm(order) {
	proxy.$pay.openPay({
		orderNo: order.transactionNo,
		confirm: (e) => {
			return new Promise((resolve, reject) => {
				// ElMessage.success('支付成功');
				paySuccedDialog.value.open()
				// getAllData();
				//修改已购状态，不重新请求列表
				materialList.value.forEach((item, index) => {
					if (index === buyIndex.value) { item.purchase = true }
				})
				resolve(res);
			})
		},
		error: (err) => {
			if (typeof err == 'object') {
				if (err.data.code == 1010) {
					proxy.$pay.openRecharge()
				}
			}
		}
	})
}

//打开不感兴趣弹窗
const noInterShow = ref(false)
const noInterId = ref(null)
const openNoInter = (materialId) => {
	noInterShow.value = true
	noInterId.value = materialId
}

//提交不感兴趣
function handleAddUninterested() {
	const params = {
		materialId: noInterId.value,
	};
	saveUninterested(params).then((res) => {
		getList()
		ElMessage({
			type: 'success',
			message: '已为您删除该素材，感谢您的反馈，我们会努力为您推荐更多优质精准的内容。',
		});
		noInterShow.value = false
		noInterId.value = null
	});
}

let loadingFrist = true;

onActivated(() => {
	if (!loadingFrist) {
		getList();
	} else {
		loadingFrist = false
	}
})

</script>
<style scoped lang="scss">
@import "./style.scss";

:deep(.el-input) {
	input {
		box-shadow: none; //去除白边
		font-size: 12px;

		&:focus {
			outline: 0;
		}
	}
}

.flexB {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

:deep(.el-dialog) {
	border-radius: 8px;
	top: 50%;
	transform: translateY(-60%);

	.el-dialog__body {
		padding: 0px 20px 30px 20px;
	}
}

.copyright-card {
	color: #3D3F50;
	font-size: 14px;

	.copyright-title {
		font-weight: 550;
		color: #181920;
		font-size: 16px;
		margin-bottom: 30px;
		text-align: center;
	}

	div {
		margin-bottom: 8px;
	}

	img {
		width: 10px;
		height: 10px;
		margin-right: 10px;
	}
}


:deep(.pay-confirm-dialog) {
	.el-overlay-dialog {
		display: block;
	}
}

.popContainer {
	z-index: 999;
	background: rgba(0, 0, 0, 0.3);
	height: 70px;
	width: 100%;
	position: fixed;
	z-index: 999;
}

.pagination-container-box {
	padding-bottom: 20px !important;
}
</style>
