<template>
    <div class="recruit_main" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <div class="header-breadcrumb">
            <span @click.stop="handleToConsole">招募管理</span>
            <span style="padding:0 6px">&gt;</span>
            <span style="color:#3468FE;">{{viewData.title}}</span>
        </div>
        <div class="recruit_card-box" style="padding: 20px; margin-bottom: 20px;">
            <div class="recruit_title">
                <div class="title">{{viewData.title}}</div>
                <div class="desc">
                    <span>报名截止</span><span>{{viewData.endDate}}<el-icon class="el-icon--right" style="cursor: pointer;" @click.stop="handleOpenPicker"><EditPen /></el-icon></span>
                    <div class="date-picker-box">
                        <el-date-picker
                            v-model="viewData.endDate"
                            @change="handleChangeEndDate"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            ref="DatePickerRef"
                            placeholder="Pick a date"
                        />
                    </div>
                </div>

            </div>
            <div class="recruit_info">
               <div class="tag-item">招募工种 {{viewData.categoryNum}}</div> 
               <div class="tag-item">预算 {{viewData.totalPrice}}<span class="background_icon-money"></span></div> 
               <div class="tag-item">已报名人数 {{viewData.signUpNum}}</div> 
               <div class="tag-item">已选定人数 {{viewData.undertakerNum}}</div> 
               <div class="tag-item">已邀请人数 {{viewData.inviteNum}}</div> 
               <div class="recruit_edit" @click="handleToRecruit">查看招募详情</div>
            </div>
        </div>
        <div class="recruit_card-box recruit_list-filter">
            <div class="recruit_tabBar">
                <div class="tabBar-item" :class="{active: component == 'RecruitDetail'}" @click="handleChangeTab('RecruitDetail')">招募详情</div>
                <div class="tabBar-item" :class="{active: component == 'RecruitSelect'}" @click="handleChangeTab('RecruitSelect')">选定详情</div>
                <div class="tabBar-item" :class="{active: component == 'RecruitInvite'}" @click="handleChangeTab('RecruitInvite')">邀请详情</div>
            </div>
            <div class="recruit_search">
                <el-input size="large" v-model="sk" @change="handleChangeSK" style="width: 200px;" placeholder="快速搜索工种">
                    <template #suffix>
                        <div class="search_input-suffix">
                            <el-icon  class="el-icon--right" :size="16"><Search /></el-icon>
                        </div>
                    </template>
                </el-input>
                <template v-if="component == 'RecruitDetail'">
                    <div class="switch-box">
                        <span>隐藏报名者</span>
                        <el-switch v-model="isHide" :active-value="1" :inactive-value="0" @change="handleChangeSwitch" inactive-color="#383B47" active-color="#3468FE"></el-switch>
                    </div>
                    <div class="switch-box">
                        <span>过滤已选定</span>
                        <el-switch v-model="isSelect" :active-value="1" :inactive-value="0" @change="handleChangeSwitch" inactive-color="#383B47" active-color="#3468FE"></el-switch>
                    </div>
                </template>
            </div>
        </div>
        <div class="recruit_tabBar-content" v-if="!loadingState">
            <component :is="RecruitDetail" ref="TabBarContentRef" v-if="component == 'RecruitDetail'" @onClick="handleToDetail" :sk="sk" :isHide="isHide" :isSelect="isSelect" @onSelect="viewData.undertakerNum += 1 "></component>
            <component :is="RecruitSelect" ref="TabBarContentRef" v-if="component == 'RecruitSelect'" @onClick="handleToDetail" :sk="sk" @onCancelSelect="viewData.undertakerNum -= 1"></component>
            <component :is="RecruitInvite" ref="TabBarContentRef" v-if="component == 'RecruitInvite'" @onClick="handleToDetail"></component>
        </div>
    </div>
</template>
<script setup>
import RecruitDetail from './RecruitDetail.vue'
import RecruitSelect from './RecruitSelect.vue'
import RecruitInvite from './RecruitInvite.vue'
import { getRecruitDetail , updateRecruitEndDate} from '@/api/personnel/personnelManage.js';
import { useRoute, useRouter } from 'vue-router';
import { reactive, shallowReactive } from '@vue/reactivity';
import { ElMessage } from 'element-plus';
import { nextTick } from '@vue/runtime-core';
const route = useRoute();
const router = useRouter();
const sk = ref('');
const isHide = ref(0);
const isSelect = ref(0);
const DatePickerRef = ref();
const TabBarContentRef = ref();
const component = ref('RecruitDetail');
const loadingState = ref(false);
const viewData = ref({});
const getData = ()=>{
    loadingState.value = true;
    const id = route.params.id;
    getRecruitDetail({id}).then(res=>{
        viewData.value = res.data;
        loadingState.value = false;
    }).catch(err=>{
        loadingState.value = false;
    })
}
getData();
// 打开选择时间
const handleOpenPicker = ()=>{
    DatePickerRef.value.focus();
}
// 截止时间改变时的回调函数
const handleChangeEndDate = (e)=>{
    const id = viewData.value.id;
    updateRecruitEndDate({id, endDate:e}).then(res=>{
        viewData.value.endDate = e;
        ElMessage.success('操作成功')
    })
}
// 改变tab
const handleChangeTab = (name)=>{
    sk.value = '';
    component.value = name;
}
const handleChangeSK = ()=>{
    nextTick(()=>{
        TabBarContentRef.value.handleChangeSK && TabBarContentRef.value.handleChangeSK()
    })
}
// 进入招募
const handleToRecruit = ()=>{
    const id = route.params.id;
    router.push({path: `/workspace/recruit/${id}`})
}

// 前往工种详情
const handleToDetail = (e) => {
    const id = e.userAuthenticateId;
    router.push({ path:`/workspace/work/${id}`})
}

// 招募管理
const handleToConsole = ()=>{
    router.push({path: '/workspace/admin/recruit'})
}
const handleChangeSwitch = (e)=>{
    nextTick(()=>{
        TabBarContentRef.value.handleChangeSwitch && TabBarContentRef.value.handleChangeSwitch()
    })
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>