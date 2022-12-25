<template>
    <div class="left-sidebar-container">
        <div class="sidebar-main">
            <template v-for="(item,index) in sidebarList" :key="index">
                <router-link :to="item.path" class="sidebar-item hover-active" :class="activeSidebarItem ==  item.path ?'action':''">
                    <svg-icon className="sidebar-item-icon" :iconClass="item.icon" :size="24"></svg-icon>
                    <svg-icon className="sidebar-item-icon active" :iconClass="item.activeIcon" :size="24"></svg-icon>
                    <div>{{item.name}}</div>
                </router-link>
            </template>
        </div>
        <div class="line-divider"></div>
        <div class="work_type-quick">
            <div class="work_type-item">
                <svg-icon className="work_type-icon" iconClass="worker_leftside-31" :size="24"></svg-icon>
                <div class="work_type-name">工种快捷对比</div>
            </div>
            <!-- <div height="100%" style="margin: 0 -10px; flex: auto;" view-style="padding: 0 10px;"> -->
            <div class="work_type-scroll-container">
                <TabUserItem :user="item" @onDelete="handleDeleteUser" :active="item.userAuthenticateId == userAuthenticateId" @onView="handleViewUser" v-for="(item,index) in quickSelections"
                    :key="index"></TabUserItem>
            </div>
        </div>
        <div class="line-divider"></div>
        <div class="workspace-admin-sidebar">
            <div class="admin-sidebar-main">
                <div class="admin-sidebar-title" @click.stop="openAdminSidebar = !openAdminSidebar">
                    <el-icon :size="18" ref="adminSidebarIconRef" color="#9094A6" style="margin: 0 16px 0 8px; transition: all .1s ease;">
                        <CaretBottom />
                    </el-icon>
                    <div class="sidebar-title-name" v-show="adminType == 'employer'">雇主后台管理</div>
                    <div class="sidebar-title-name" v-show="adminType == 'produce'">创作者后台管理</div>
                </div>
                <div ref="adminSidebarRef" class="admin-sidebar-container">
                    <div>
                        <div class="admin-sidebar-content">
                            <template v-if="adminType !== 'produce' || workNum > 0">
                                <template v-for="(item,index) in adminSidebars" :key="index">
                                    <div @click="handleGoRouter(item.path)" class="admin-sidebar-item hover-active" :class="activeSidebarItem ==  item.path ?'action':''">
                                        <svg-icon className="sidebar-item-icon" :iconClass="item.icon" :size="24"></svg-icon>
                                        <svg-icon className="sidebar-item-icon active" :iconClass="item.activeIcon" :size="24"></svg-icon>
                                        <div class="sidebar-item-name">{{item.name}}</div>
                                        <div class="other-icon" v-if="item.otherIcon">
                                            <svg-icon className="sidebar-item-icon" :iconClass="item.otherIcon" :size="24"></svg-icon>
                                            <svg-icon className="sidebar-item-icon active" :iconClass="item.activeOtherIcon" :size="24"></svg-icon>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <template v-else>
                                <div @click="handleGoRouter('/workspace/admin/attestation')"
                                    style="height: 152px;  font-size: 20px; border-radius:10px; color:#3468FE; display:flex; align-items:center; justify-content:center; flex-direction: column; ">
                                    <img src="@/assets/images/work-auth-bg.png" style="width: 100%; height:100%; object-fit:cover" />
                                </div>
                            </template>
                        </div>
                        <div class="admin-sidebar-footer">
                            <div class="admin-sidebar-item" :class="{action: adminType == 'employer' }" @click.stop="adminType = 'employer'">
                                <svg-icon className="sidebar-item-icon" iconClass="worker_leftside-101" :size="24"></svg-icon>
                                <svg-icon className="sidebar-item-icon active" iconClass="worker_leftside-102" :size="24"></svg-icon>
                                <div>雇主</div>
                            </div>
                            <div class="admin-sidebar-item" :class="{action: adminType == 'produce' }" @click.stop="adminType = 'produce'">
                                <svg-icon className="sidebar-item-icon" iconClass="worker_leftside-111" :size="24"></svg-icon>
                                <svg-icon className="sidebar-item-icon active" iconClass="worker_leftside-112 " :size="24"></svg-icon>
                                <div>创作者</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { useStore } from "vuex";
import { computed, defineComponent, getCurrentInstance, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import TabUserItem from "./components/TabUserItem";
const components = {
    TabUserItem
}
const setup = () => {
    const store = useStore();
    const router = useRouter();
    const workNum = computed(() => store.state.user.workNum)
    const quickSelections = computed(() => store.state.workspace.quickSelections)
    const sidebarList = [
        {
            path: '/workspace/work/type',
            name: '工种库',
            icon: 'worker_leftside-11',
            activeIcon: 'worker_leftside-12',
        },
        {
            path: '/workspace/recruit/wall',
            name: '招募墙',
            icon: 'worker_leftside-21',
            activeIcon: 'worker_leftside-22',
        },
    ]
    const sidebaAdminList = {
        employer: [
            {
                path: '/workspace/admin/release',
                name: '发布招募',
                icon: 'worker_leftside-41',
                activeIcon: 'worker_leftside-42',
                otherIcon: 'worker_leftside-91',
                activeOtherIcon: 'worker_leftside-92'
            },
            {
                path: '/workspace/admin/recruit',
                name: '招募管理',
                icon: 'worker_leftside-51',
                activeIcon: 'worker_leftside-52',
            },
            {
                path: '/workspace/admin/goods',
                name: '订单管理',
                icon: 'worker_leftside-61',
                activeIcon: 'worker_leftside-62',
            },
        ],
        produce: [
            {
                path: '/workspace/admin/skill',
                name: '工种管理',
                icon: 'worker_leftside-71',
                activeIcon: 'worker_leftside-72',
            },
            {
                path: '/workspace/admin/order',
                name: '订单管理',
                icon: 'worker_leftside-81',
                activeIcon: 'worker_leftside-82',
            },
            {
                path: '/workspace/admin/enroll',
                name: '报名管理',
                icon: 'worker_leftside-131',
                activeIcon: 'worker_leftside-132',
            },
        ]
    }
    const { proxy } = getCurrentInstance();
    const route = useRoute();
    const activeSidebarItem = computed(() => {
        const { path, meta } = route;
        if (meta && meta.activeSubMenu) {
            return meta.activeSubMenu;
        }
        return path;
    });
    const userAuthenticateId = computed(() => {
        const { name, params } = route;
        if (name == 'workspace-work_detail') {
            return params.id;
        } else {
            return 0
        }
    })
    const adminSidebarRef = ref();
    const adminSidebarIconRef = ref();
    const openAdminSidebar = ref(true);
    const adminType = ref('employer');
    const adminSidebars = computed(() => sidebaAdminList[adminType.value] || [])
    watchEffect(() => {
        const el = adminSidebarRef.value;
        if (!el) { return }
        if (openAdminSidebar.value) {
            el.style.height = el.children[0].clientHeight + 'px';
            // transform: rotate(180deg);
            if(adminSidebarIconRef.value){
                adminSidebarIconRef.value.$el.style.transform = 'rotate(0deg)'
            }
        } else {
            adminSidebarIconRef.value.$el.style.transform = 'rotate(180deg)'
            el.style.height = '0px'
        }
    }, { flush: 'post' });

    const getAdminType = () => {
        const path = activeSidebarItem.value;
        for (var item of sidebaAdminList.employer) {
            if (item.path == path) {
                adminType.value = 'employer'
                return
            }
        }
        for (var item of sidebaAdminList.produce) {
            if (item.path == path) {
                adminType.value = 'produce'
                return
            }
        }
    }
    getAdminType();

    const handleGoRouter = (path) => {
        proxy.$Authentication.open(() => {
            router.push({ path })
        })
    }

    store.dispatch('workspace/getComparedList');

    const handleDeleteUser = (e) => {
        store.dispatch('workspace/handlecoCmparedDele', e);
    }
    const handleViewUser = (e) => {
        router.push({
            path: `/workspace/work/${e.userAuthenticateId}`,
            query: { userId: e.userId }
        })
    }

    return {
        workNum,
        adminType,
        sidebarList,
        adminSidebars,
        handleGoRouter,
        handleViewUser,
        quickSelections,
        adminSidebarRef,
        handleDeleteUser,
        openAdminSidebar,
        activeSidebarItem,
        userAuthenticateId,
        adminSidebarIconRef,
    }
}
export default defineComponent({
    setup,
    components
})
</script>
<style scoped lang="scss">
.left-sidebar-container {
    width: 200px;
    height: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    // border-right: 1px solid #EEEEEE;
    background: #292a30;
    font-size: 14px;
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 3px 0px 6px 0px rgba(35, 35, 35, 0.38);
    position: relative;
    z-index: 2;
    .sidebar-main {
        padding: 34px 10px;
        flex: none;
        .sidebar-item {
            padding: 10px;
            border-radius: 10px;
            font-size: 16px;
            color: #9094a6;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0px;
            }
            &.hover-active:hover {
                color: #ffffff;
                background: #4e5262;
                .sidebar-item-icon {
                    margin-right: 16px;
                    display: none;
                    &.active {
                        display: inline-block;
                    }
                }
            }
            &.action {
                color: #ffffff;
                background: #4e5262;
                .sidebar-item-icon {
                    margin-right: 16px;
                    display: none;
                    &.active {
                        display: inline-block;
                    }
                }
            }
            .sidebar-item-icon {
                margin-right: 16px;
                &.active {
                    display: none;
                }
            }
        }
    }
    .line-divider {
        height: 1px;
        width: 170px;
        margin: 0 auto;
        background: rgba(151, 151, 151, 0.1);
        flex: none;
    }
    .work_type-quick {
        padding: 34px 10px 34px;
        flex: auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .work_type-scroll-container {
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-color: rgba($color: #ffffff, $alpha: 0.2) transparent;
            scrollbar-width: thin;
            flex: auto;
            // -ms-overflow-style: none;
            margin: 0 -8px;
            padding: 0 8px;
            &::-webkit-scrollbar {
                // display: none;
                width: 2px;
                height: 2px;
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: rgba($color: #ffffff, $alpha: 0.2);
            }
            &::-webkit-scrollbar-track {
                border-radius: 4px;
                background: transparent;
            }
        }
        .work_type-item {
            padding: 10px;
            display: flex;
            flex: none;
            align-items: center;
            color: #9094a6;
            font-size: 14px;
            .work_type-icon {
                margin-right: 16px;
                flex: none;
            }
            .work_type-name {
                flex: auto;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .workspace-admin-sidebar {
        padding: 34px 10px;
        flex: none;
        .admin-sidebar-main {
            background: #2d2f3c;
            border-radius: 10px;
            color: #9094a6;
            font-size: 14px;
            .admin-sidebar-title {
                display: flex;
                align-items: center;
                padding: 16px 10px;

                cursor: pointer;
                .sidebar-title-icon {
                    margin-right: 16px;
                }
            }
            .admin-sidebar-container {
                overflow: hidden;
                transition: height 0.3s ease;
            }
            .admin-sidebar-content {
                padding: 10px;
                border-top: 1px solid rgba(151, 151, 151, 0.1);
                border-bottom: 1px solid rgba(151, 151, 151, 0.1);
                .admin-sidebar-item {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    cursor: pointer;
                    position: relative;
                    border-radius: 10px;
                    margin-bottom: 10px;
                    &:last-child {
                        margin-bottom: 0px;
                    }
                    &.hover-active:hover {
                        color: #ffffff;
                        background: #4e5262;
                        .sidebar-item-icon {
                            margin-right: 12px;
                            display: none;
                            &.active {
                                display: inline-block;
                            }
                        }
                    }
                    &.action {
                        color: #ffffff;
                        background: #4e5262;
                        .sidebar-item-icon {
                            display: none;
                            &.active {
                                display: inline-block;
                            }
                        }
                    }

                    .other-icon{
                        width: 24px;
                        height: 24px;
                        top: 50%;
                        right: 10px;
                        transform: translateY(-12px);
                        position: absolute;
                    }
                    .sidebar-item-icon {
                        margin-right: 12px;
                        &.active {
                            display: none;
                        }
                    }
                }
            }
            .admin-sidebar-footer {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 4px 3px;
                color: #9094a6;
                .admin-sidebar-item {
                    flex: 1 1 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    
                    &.action {
                        color: white;
                        background: rgba(52, 104, 254, 0.5);
                        .sidebar-item-icon {
                            // margin-right: 12px;
                            display: none;
                            &.active {
                                display: inline-block;
                            }
                        }
                    }
                    .sidebar-item-icon {
                        // margin-right: 12px;
                        &.active {
                            display: none;
                        }
                    }
                }
            }
        }
    }
}
</style>