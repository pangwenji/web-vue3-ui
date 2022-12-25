<template>
    <div class="recruit_wall-main" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <div class="recruit_wall-header">
            <div class="recruit_wall-tab">
                <div class="recruit_wall-tab-item" :class="{ active: pageData.status == 1}" @click="handleChangeStatus(1)">报名中</div>
                <div class="recruit_wall-tab-item" :class="{ active: pageData.status == 4}" @click="handleChangeStatus(4)">已完结</div>
            </div>
            <div class="recruit_wall-filter">
                <div class="left-select">
                    <el-select placeholder="工种类型" v-model="pageData.categoryId" clearable style="width: 100px;" @change="getRecruitData(1)">
                        <el-option v-for="(item,index) in categoryList" :key="index" :value="item.id" :label="item.title"></el-option>
                    </el-select>
                    <el-select placeholder="默认排序" v-model="pageData.orderByType" style="width: 100px;" @change="getRecruitData(1)">
                        <el-option :value="0" label="综合排序"></el-option>
                        <el-option :value="1" label="最新发布"></el-option>
                        <el-option :value="2" label="报名最少"></el-option>
                        <el-option :value="3" label="预算最高"></el-option>
                    </el-select>
                    <el-select placeholder="角色数量筛选" v-model="pageData.categoryNum" clearable style="width: 140px;" @change="getRecruitData(1)">
                        <el-option :value="1" label="单工种"></el-option>
                        <el-option :value="2" label="多工种"></el-option>
                    </el-select>
                </div>
                <div class="right-search">
                    <el-input placeholder="快速搜索招募..." ref="searchInputRef" v-model="searchValue" @keyup.enter="handleSearchSK"  style="width: 200px;">
                        <template #suffix>
                            <div class="suffix-search-icon" title="搜索" @click.stop="handleSearchSK">
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </div>
                        </template>
                    </el-input>
                </div>
            </div>
        </div>
        <el-scrollbar class="recruit_wall-main" view-style="width:100%; min-height: 100%;  position: relative;  padding:0px 20px 46px; box-sizing: border-box;">
            <el-row :gutter="20" v-if="recruitList.length">
                <el-col :style="{width:(100/columns)+'%' , flex:'none '}" v-for="(item,index) in recruitList" :key="index">
                    <div class="recruit-item-content" @click="linkToDetail(item)">
                        <div class="recruit-item-endDate disabled" v-if="item.cutoff == 1">
                            <el-icon>
                                <Clock />
                            </el-icon>
                            报名已截止
                        </div>
                        <div :class="['recruit-item-endDate', isLimit(item) ? 'disabled' : '']" v-else>
                            <el-icon>
                                <Clock />
                            </el-icon>
                            报名截止：{{item.endDate}}
                        </div>
   
                        <div class="icon_setTop" style="position:absolute; top:0; right: 0;"  v-if="item.ifPay && pageData.status !=4"></div>
                        <div class="recruit-item-title">{{item.title}}</div>
                        <div class="recruit-general-budget">
                            <span>总预算：</span>
                            <span style="font-size:22px; color:  #FFC800;">{{item.totalPrice}}</span>
                            <span class="background_icon-money"></span>
                            <span class="fund-custody" v-if="item.ifPay">全款预算托管</span>
                        </div>
                        <div class="recruit-tag-box">
                            <span v-for="(option,code) in item.categoryItems" v-show="code < 3">{{option.categoryTitle}}</span>
                            <span class="other" v-if="item.categoryItems.length > 3">...</span>
                        </div>
                        <div class="recruit-item-footer">
                            <div style="font-size: 14px; color:#4E5262;">{{formatDate(item.createTime)}}发布 {{item.signUpNum}}人报名</div>
                            <el-button type="primary" color="#3468FE" v-if="item.status != 4" @click="linkToDetail(item)">查看详情</el-button>
                            <el-button type="primary" color="#4E5262" @click="linkToDetail(item)" v-else>已完结</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <template v-else-if="!loadingState">
                <Empty></Empty>
            </template>
            <Pagination :total="pageData.total" :page="pageData.pageNum" :limit="pageData.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
        </el-scrollbar>
    </div>
</template>
<script setup>
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { reactive, watchEffect } from 'vue'
import { getCategoryList, getRecruitList } from '@/api/personnel/recruitmentWall'
import { useWindowSize } from "@vueuse/core";
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
const router = useRouter()
const pageData = reactive({
    sk: '',
    total: 0,
    status:1,  // 1报名中 4 已完结
    pageNum: 1,
    pageSize: 16,
    categoryId: null,
    categoryNum:null,
    orderByType: null
})
const searchValue = ref('');
const searchInputRef = ref();
const recruitList = ref([]);
const categoryList = ref([]);
const loadingState = ref(false);

const { width } = useWindowSize();
const columns = ref(3);
const onresize = (w)=>{
    const span = (w-360)/360;
    columns.value =  Math.round(span);
}
watchEffect(()=>{
    onresize(width.value)
});

// 对比截止日期与当日的时差
const isLimit = (e)=> {
    const endDay = new Date(e.endDate).getTime()
    const toDay = new Date(e.systemTime).getTime()
    const dif = (endDay - toDay) / 1000 / 60 / 60 // 毫秒转小时
    return dif < 24 ? true : false
}

// 时间格式化
const formatDate = (e) => {
    const now = dayjs();
    return dayjs(e).from(now)
}
// 改变页数时
const handlePagination = ({ page, limit }) => {
    if (loadingState.value) { return }
    pageData.pageNum = page;
    pageData.pageSize = limit;
    getRecruitData();
}
// 搜索关键字
const handleSearchSK = ()=>{
    pageData.total = 0;
    pageData.sk = searchValue.value;
    searchInputRef.value.blur()
    getRecruitData(1);
}
// 修改状态
const handleChangeStatus =  (e)=>{
    pageData.status = e;
    pageData.total = 0;
    getRecruitData(1);
}
// 跳转招募详情
const linkToDetail = (e) => {
    router.push({ path: `/workspace/recruit/${e.id}`})
}

// 获取招募列表
const getRecruitData = async (e) => {
    try {
        loadingState.value = true;
        recruitList.value = [];
        if(e === 1){pageData.pageNum = 1}
        const result = await getRecruitList(pageData);
        loadingState.value = false;
        recruitList.value = result.rows;
        pageData.total = result.total;
        return result;
    } catch (err) {
        loadingState.value = false;
        return Promise.reject();
    }

}
// 获取工种列表
const getCategoryData = async () => {
    try {
        const result = await getCategoryList();
        categoryList.value = result.data;
        return result;
    } catch (err) {
        return Promise.reject();
    }
}

const getData = () => {
    Promise.all([getCategoryData(), getRecruitData()]).then(res => { })
}
getData();
</script>

<style scoped lang="scss">
@import "./index.scss";
.suffix-search-icon{
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover{
        color: #3468FE;
    }
}
</style>