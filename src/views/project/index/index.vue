<template>
    <el-container style="height: 100%; background: #0A0B0D;" v-loading="loadingState" element-loading-background="rgba(0, 0, 0, 0)">
        <LeftSidebar ref="LeftSidebarRef" :show="!loadingState&&disEmpty" @deleteProject="onDeleteProject" @click="handleClick"></LeftSidebar>
        <template v-if="!loadingState&&disEmpty">
            <div class="scrollbar-conten">
                <router-view v-slot="{Component,route}" name="header">
                    <component :is="Component" :key="'header-' + route.params.id"></component>
                </router-view>
                <router-view v-slot="{Component,route}">
                    <component :is="Component" :key="'project-' + route.params.id"></component>
                </router-view>
            </div>
            <RightBody></RightBody>
        </template>
        <Empty style="flex-grow:1;" v-show="!loadingState&&!disEmpty" description="还没有自己的项目吗?创建项目试试看">
            <el-button type="primary" color="#0459FF" round @click.stop="handleCreate">创建项目</el-button>
        </Empty>
    </el-container>
</template>
<script setup name="project-index">
import LeftSidebar from './projectLeft/LeftSidebar.vue'
import RightBody from './RightBody.vue';
import HeaderBody from './HeaderBody.vue';
import { useStore } from 'vuex';
import { ref, computed, watch, nextTick, onUnmounted, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'

const route = useRoute();
const router = useRouter();
const store = useStore();
const LeftSidebarRef = ref(null);
const projectData = computed(() => store.state.project.projectData);

const MyProjects = computed(() => store.state.project.MyProjects)
const InProjects = computed(() => store.state.project.InProjects)
const SeProjects = computed(() => store.state.project.SeProjects)
const isEnterDetails = computed(() => store.state.project.isEnterDetails)


// 是否为空项目
const disEmpty = computed(() => {
    const arr = [].concat(MyProjects.value, InProjects.value, SeProjects.value);
    if (arr.length > 0) {
        return arr[0]
    }
    return false;
})

let loadingStatus = false;
// 点击切换项目
const handleClick = (e, replace) => {
    if (loadingStatus) {
        return
    }
    loadingStatus = true;
    store.dispatch('project/changeProject', e).then(res => {
        loadingStatus = false;
        const to = replace ? router.replace : router.push;
        to({ path: `/project/index/${e.id}/file` });
    }).catch(err => {
        loadingStatus = false;
    })
}

// 创建项目
const handleCreate = () => {
    LeftSidebarRef.value.handleCreateProject()
}

// 删除项目
const onDeleteProject = ({ id }) => {
    if (id == projectData.value.id) {
        if (disEmpty.value) {
            store.commit('project/SET_BREADCRUMBS', [])
            store.commit('project/SET_PROJECT_DATA', {})
            handleClick(disEmpty.value);
        } else {
            store.commit('project/SET_BREADCRUMBS', [])
            store.commit('project/SET_PROJECT_DATA', {})
            router.replace({ path: '/project/index' })
        }
    }
}

const loadingState = ref(false);
let clearTime;
const handleChangeProjectStatus = ({ noticeType }) => {
    if (noticeType == 12) { //项目完结
        if (clearTime) {
            clearTimeout(clearTime)
            clearTime = null;
        }
        clearTime = setTimeout(() => {
            store.dispatch('project/getProjectsList').then(res=>{
                const list = [].concat(MyProjects.value, InProjects.value, SeProjects.value);
                for (const item of list) {
                    if (item.id == route.params.id) {
                        store.dispatch('project/changeProject', item);
                        return
                    }
                }
            })
        }, 1000);
    }
}


onUnmounted(() => {
    IM_EVENT_LISTERNER.removeEventListenerIM('PROJECT', handleChangeProjectStatus)
})

let clearTimeData;
onBeforeRouteUpdate((to)=>{
    if(to.path === '/project/index'){
        loadingState.value = true;
        if(clearTimeData){
            clearTimeout(clearTimeData);
            clearTimeData = null;
        }
        clearTimeData = setTimeout(()=>{
            getProjects();
        },1000)
    }
})


const getProjects = () => {
    loadingState.value = true;
    store.dispatch("project/getProjectsList").then(res => {
        IM_EVENT_LISTERNER.addEventListenerIM('PROJECT', handleChangeProjectStatus)
        loadingState.value = false;
        if (route.params && route.params.id) {
            const list = [].concat(MyProjects.value, InProjects.value, SeProjects.value);
            for (const item of SeProjects.value) {
                if (item.id == route.params.id) {
                    LeftSidebarRef.value.heightObj.SHeight = 'auto'
                }
            }
            for (const item of list) {
                if (item.id == route.params.id) {
                    store.dispatch('project/changeProject', item);
                    return
                }
            }
            if (disEmpty.value) {
                handleClick(disEmpty.value, true)
            } else {
                router.replace({ path: '/project/index' })
            }
        } else if (disEmpty.value) {
            for (const item of SeProjects.value) {
                if (item.id == disEmpty.value.id) {
                    LeftSidebarRef.value.heightObj.SHeight = 'auto'
                }
            }
            handleClick(disEmpty.value, true)
        }
    }).catch((err) => {
        loadingState.value = false;
    });
}

getProjects();


</script>
<style scoped>
.scrollbar-conten {
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>