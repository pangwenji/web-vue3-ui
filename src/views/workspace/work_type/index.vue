<template>
    <div class="work-right" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)">
        <div class="tool-header">
            <div class="main-header">
                <!-- 头部切换卡片 -->
                <div class="scroll-left" @click.stop="handleSetSCroll(-100)">
                    <el-icon>
                        <CaretLeft />
                    </el-icon>
                </div>
                <div class="personnel-top" ref="ScrollBarRef">
                    <transition-group name="word" tag="div" class="personnel-scroll-view" style="white-space: nowrap;">
                        <span :class="{ active: param.categoryId == item.id }" v-for="item in tabListShow" :key="item.id" @click="handleChangMain(item.id,$event,item)">{{ item.title }}</span>
                    </transition-group>
                </div>
                <div class="scroll-right" @click.stop="handleSetSCroll(100)">
                    <el-icon>
                        <CaretRight />
                    </el-icon>
                </div>
                <div class="menu-right" @click.stop="drawer = !drawer " title="设置标签">
                    <el-icon :size="20" color="#fff">
                        <Grid />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 头部工具栏 -->
        <div class="header-card">
            <work-header-card :showCheckSex="param.categoryTitle == '歌手' || param.categoryTitle == '配音'" v-model:checkSex="param.sex" @update:checkSex="handleCheckSex" :tagList="tagList" :categoryId="param.categoryId" @changeTag="changeTag" @sequence="sequence" @search="search"></work-header-card>
        </div>
        <!--        主题卡片-->
        <el-scrollbar class="maid-card" view-style="padding: 0px 20px 56px; position:relative; min-height: 100%;">
            <template v-if="talents&&talents.length > 0&&!loadingStatus">
                <word-user-info @click="goDetail" :active="item.active" @invite="handleInviteCooperation(item)" @createOrder="handleCreateOrder" @clickHide="handleHide" @openView="handleOpenView"
                    @openMedia="handleOpenMedia" v-for="(item,index) in talents" :key="index" :data="item"></word-user-info>
                <!-- <word-user-info @openVideo="openVideo" @detail="goDetail(tal)" v-for="(tal,index) in talents" :key="index" :data="tal"></word-user-info> -->
            </template>
            <template v-else-if="!loadingStatus">
                <Empty description="暂无数据" style="padding: 0;height: 100%"></Empty>
            </template>
            <Pagination :total="total" :page="param.pageNum" :limit="param.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
        </el-scrollbar>
    </div>
    <word-right-popup v-model:show="drawer" @close="drawer=false" @onHide="handleHideTab" :tabListShow="tabListShow" :tabListHide="tabListHide" :typeOfWork="1"></word-right-popup>
    <CreateOrder ref="CreateOrderRef"></CreateOrder>
    <InviteCooperation ref="InviteCooperationRef"></InviteCooperation>
</template>
  
<script setup>
import { getCategoryList, getTagList, talentsList, handleShielded } from '@/api/personnel/recruitmentWall'
import WorkHeaderCard from './wordHeaderCard'
import WordUserInfo from './WordUserInfo'
import WordRightPopup from './WordRightPopup'
import CreateOrder from '../components/CreateOrder'
import InviteCooperation from '../components/InviteCooperation'
import { useStore } from "vuex";
import { computed, ref, reactive, getCurrentInstance } from "vue";
import { onBeforeRouteUpdate, useRoute,useRouter } from 'vue-router'
const { proxy } = getCurrentInstance();
const CreateOrderRef = ref();
const InviteCooperationRef = ref();
// 加载状态
const loadingStatus = ref(false)
const store = useStore();
const tabListShow = ref([{ id: 0, title: '全部' }])
const tabListHide = ref([]);
const tagList = ref([])
const drawer = ref(false)
const ScrollBarRef = ref()
const route = useRoute();
const router = useRouter();
const total = ref(0);
const param = reactive({
    categoryId: 0,
    categoryTitle: '',
    // 标签ID，用逗号隔开
    tagIds: '',
    sk: '',
    sex: -1,
    pageNum: 1,
    pageSize: 50
})
// 设置header滚动条位置
const handleSetSCroll = (e) => {
    const scrollLeft = ScrollBarRef.value.scrollLeft;
    // ScrollBarRef.value.ScrollBarRef();
    ScrollBarRef.value.scrollLeft += e
}
// 切换头部tab时
const handleChangMain = (name,e,item) => {
    param.tagIds = '';
    param.sk = '';
    param.sex = -1;
    param.pageNum = 1;
    param.pageSize = 50;
    param.categoryId = name;
    param.categoryTitle = item.title;
    handleChangeRouter()
}

// 隐藏标签
const handleHideTab = (id) => {
    if (id == param.categoryId) {
        handleChangMain(0)
    }
}
/**
 *  获取目录
 */
const getCategoryData = () => {
    loadingStatus.value = true;
    getCategoryList(1).then(res => {
        let query = route.query
        let cid = query?.categoryId;
        res.data.forEach(item => {
            if(item.id == cid && item.ifView != 1){
                cid = ''
            }
            if (item.ifView === 1) {
                tabListShow.value.push(item)
            } else {
                tabListHide.value.push(item)
            }
        })
        cid = Number(cid) || tabListShow.value[0].id;
        // 初始化默认标签
        param.categoryId = parseInt(cid);
        param.tagIds = query?.tagIds;
        param.pageNum = parseInt(query?.pageNum || 1) ;
        param.pageSize = 50;
        getData(cid);
    }).catch(err => {
        console.log(err)
        loadingStatus.value = false;
    });
}
getCategoryData();

const getData = (id) => {
    loadingStatus.value = true;
    Promise.all([getTagListData(id), getTalentsList()]).then(res => {
        loadingStatus.value = false;
    }).catch(err => {
        loadingStatus.value = false;
    })
}

// 修改性别选择时触发
const handleCheckSex = (e)=>{
    param.pageNum = 1;
    getTalentsList(true);
}

/**
 * 跟你目录或者tag下拉框数据
 * @param categoryId 目录ID
 */
const getTagListData = async (cid) => {
    await getTagList(cid).then(res => {
        tagList.value = res.data;
    });
}
/**
 * 获取工种列表
 * @type {Ref<UnwrapRef<*[]>>}
 */

const talents = ref([]);
const getTalentsList = async (e) => {
    if (e) { loadingStatus.value = true; }
    await talentsList(param).then(res => {
        if (e) { loadingStatus.value = false; }
        talents.value = res.rows;
        total.value = res.total;
        if(res.pageCount < param.pageNum){
            param.pageNum = res.pageCount
        }
    }).catch(err => {
        if (e) { loadingStatus.value = false; }
    })
}

onBeforeRouteUpdate((r)=>{
    const e = r.query?.e
    if(r.query?.e == 1){
        getTalentsList(e);
    }else{
        const cid = r.query?.categoryId || 0;
        param.categoryId = cid;
        getData(cid);
    }
})
const handleChangeRouter = (e = 0)=>{
    const path = route.path;
    router.push({path,query:{...param,e}});
}

// 打开视图
const handleOpenView = (e) => {

}
// 快速下单
const handleCreateOrder = (e) => {
    if (e.ifOwn) {
        return proxy.$modal.msgWarning('您不能对自己下单哦~')
    }
    proxy.$Authentication.open(()=>{
        CreateOrderRef.value.open(e)
    })
}
// 邀请合作
const handleInviteCooperation = (e) => {
    proxy.$Authentication.open(()=>{
        if (e.ifOwn) {
            return proxy.$modal.msgWarning('您不能对自己发起邀请哦~')
        }
        InviteCooperationRef.value.open(e)
    })
}
// 点击隐藏
const handleHide = (data) => {
    proxy.$modal.confirm({
        content: '确定不再显示该创作者，确定后无法找回哦？',
        beforeClose(action, instance, done) {
            if (action == 'confirm') {
                instance.confirmButtonLoading = true;
                handleShielded({ userAuthenticateId: data.id }).then(res => {
                    instance.confirmButtonLoading = false;
                    done();
                    getTalentsList();
                }).catch(err => {
                    instance.confirmButtonLoading = false;
                    done();
                })
            } else {
                if (instance.confirmButtonLoading) {
                    return
                } else {
                    done();
                }
            }
        }
    }).catch(err => { })

}

/**
 * 打开媒体弹窗
 */
const handleOpenMedia = () => {

}

/**
 * 跳转到详情
 */
const goDetail = (tap) => {
    // proxy.$Authentication.openAuth();
    window.sessionStorage.setItem('/workspace/work', tap.userId);
    router.push({ path: `/workspace/work/${tap.id}` })
}





// 改变页数时
const handlePagination = ({ page, limit }) => {
    if (loadingStatus.value) {
        return;
    }
    param.pageNum = page;
    param.pageSize = limit;
    handleChangeRouter(1);
}



/**
 * 多选框选择值后，触发的改变事件
 * @param list
 */
const changeTag = (list) => {
    const data = list.reduce((sum, item) => {
        if (item.value && item.value.length > 0) {
            sum.push(...item.value);
        }
        return sum
    }, [])
    param.tagIds = data.join(',');
    handleChangeRouter(1);
}


/**
 * 获取配置费率
 */
const getConfigInfo = () => {
    // configInfo().then(res=>{
    //   store.commit('personnel/SET_CONFIG', res.data);
    // });
    store.commit('personnel/SET_CONFIG', { rate: "0%" });
}
getConfigInfo();

/**
 * 排序效果
 */
const sequence = (data) => {
    param.orderByType = data.orderByType;
    param.sortBy = data.sortBy;
    handleChangeRouter(1);
}

/**
 * 查找
 */
const search = (sk) => {
    param.sk = sk;
    handleChangeRouter(1);
}
  </script>
  
  <style scoped lang="scss">
@import "./style.scss";

.word-move {
    transition: transform 0.6s;
}

.header-card {
    width: calc(100% - 40px);
    margin: 10px auto;
    flex: none;
}
.maid-card {
    flex: auto;
    overflow: hidden;
    // width: 97%;
    // margin: 10px auto;
}
.maid-card {
    flex: 1;
}
</style>
  