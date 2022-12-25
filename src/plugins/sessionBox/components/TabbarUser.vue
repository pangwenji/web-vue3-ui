<template>
    <el-scrollbar height="100%" class="session_drawer-scrollbar" view-class="scrollbar-view" v-loading="loadingState" element-loading-background="rgba(0, 0, 0, 0)">
        <div class="tabbar_collapse-box">
            <div class="tabbar_collapse-title" @click="handleOpenApply()">
                <span class="icon" :class="{active: openApply}">
                    <svg-icon iconClass="video-play" :size="10"></svg-icon>
                </span>
                <span class="title">申请列表<span v-if="applyNumber > 0">（{{applyNumber}}）</span></span>
            </div>
            <div class="tabbar_collapse-container" ref="TabbarCollapseApplyRef">
                <div class="tabbar_collapse-view">
                    <template v-for="(item,index) in friendApplys" :key="index">
                        <div class="team_notice-item">
                            <el-avatar :src="item.applyUserIcon"></el-avatar>
                            <div class="content">
                                <div style="color: rgba(255, 255, 255, 0.6); margin-bottom: 4px;">{{item.applyUserName}}申请加你为好友</div>
                                <div style="color: rgba(255, 255, 255, 0.2); font-size: 12px;">{{item.message || '-'}}</div>
                            </div>
                            <div class="action" v-if="item.state === 0">
                                <div class="action-btn accept" @click="handleUploadState(item,1)">同意</div>
                                <div class="line"></div>
                                <div class="action-btn refuse" @click="handleUploadState(item,2)">拒绝</div>
                            </div>
                            <div class="action" v-if="item.state === 1">
                                已同意
                            </div>
                            <div class="action" v-if="item.state === 2">
                                已拒绝
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <template v-if="personlGroup.length > 0">
            <div class="tabbar_collapse-box" v-for="(item,index) in personlGroup" :key="index">
                <div class="tabbar_collapse-title" @click="handleClick(item,index)" v-contextmenu:contextmenuRef="{index,data:item}">
                    <span class="icon" :class="{active: openGroups.indexOf(item.id) > -1}">
                        <svg-icon iconClass="video-play" :size="10"></svg-icon>
                    </span>
                    <span class="title">{{item.groupName}}({{item.msgImContacts?.length || 0}})</span>
                </div>
                <v-contextmenu ref="contextmenuRef">
                    <v-contextmenu-item @click="emit('createGroup')">添加分组</v-contextmenu-item>
                    <v-contextmenu-item @click="handleResetName(item)">重命名</v-contextmenu-item>
                    <v-contextmenu-item @click="handleDelete(item)">删除分组</v-contextmenu-item>
                </v-contextmenu>
                <div class="tabbar_collapse-container" :ref="'TabbarCollapseViewRef'">
                    <div class="tabbar_collapse-view">
                        <template v-for="(option , code) in item.msgImContacts" :key="code">
                            <SessionItem @click="handleClickUser(option)" :sessionData="formatData(option)">
                                <template #contextmenuItem>
                                    <!-- <v-contextmenu-item>查看主页</v-contextmenu-item> -->
                                    <v-contextmenu-item>
                                        移动到分组
                                        <template #sub>
                                            <div style="padding: 6px">
                                                <div class="contextmenu-sub-item" @click.stop="handleMoveGroup(option,group)" v-for="group in personlGroup" :key="group.id">{{group.groupName}}
                                                </div>
                                            </div>
                                        </template>
                                    </v-contextmenu-item>
                                    <v-contextmenu-item @click="handleUploadContact(option,index,code)">修改备注</v-contextmenu-item>
                                    <v-contextmenu-item @click="handleDeleteContact(option,index,code)">删除好友</v-contextmenu-item>
                                    <!-- <v-contextmenu-item>移到黑名单</v-contextmenu-item> -->
                                </template>
                            </SessionItem>
                        </template>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <Empty description="暂无联系人分组数据">
                <ElButton type="primary" color="#2744F1" round @click="emit('createGroup')">创建分组</ElButton>
                <!-- <ElButton type="primary" color="#1E1F26" round>加入群组</ElButton> -->
            </Empty>
        </template>
        <UploadContact ref="UploadContactRef"></UploadContact>
        <AgreeApply ref="AgreeApplyRef"></AgreeApply>
    </el-scrollbar>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, watchEffect } from '@vue/runtime-core'
import SessionItem from './SessionItem.vue'
import UploadContact from './UploadContact.vue'
import AgreeApply from './AgreeApply.vue'
import SvgIcon from '@/components/SvgIcon'
import { ElMessageBox, ElMessage } from 'element-plus'
import { uploadImContact } from '@/api/IM.js'
import { useStore } from 'vuex'
const components = {
    SvgIcon,
    SessionItem,
    AgreeApply,
    UploadContact,
}
const emits = ['openDialog', 'createGroup'];
const setup = (prop, { emit }) => {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const openGroups = ref([]);
    const openApply = ref(false);
    const UploadContactRef = ref();
    const AgreeApplyRef = ref();
    const personlGroup = computed(() => store.state.IM.contactGroups);
    const friendApplys = computed(() => store.state.IM.friendApplys);
    const applyNumber = computed(()=>{
        const arrData = friendApplys.value.filter(item=>{
            return item.state === 0;
        })
        return arrData.length
    })
    const formatData = (option) => {
        return {
            unread: 0,
            nickname: option.msgImAccount.name,
            context: option.remark,
            avatar: option.msgImAccount.avatar,
        }
    }

    onMounted(() => {
        watchEffect(() => {
            const opens = openGroups.value;
            const groups = personlGroup.value;
            for (const key in groups) {
                const index = opens.indexOf(groups[key].id);
                nextTick(() => {
                    if (!proxy.$refs.TabbarCollapseViewRef) {
                        return
                    }
                    const el = proxy.$refs.TabbarCollapseViewRef[key];
                    if (index > -1) {
                        el.style.height = el.children[0].clientHeight + 'px';
                    } else {
                        el.style.height = '0px'
                    }
                })
            }
        })
        watchEffect(() => {
            const applys = friendApplys.value;
            const isOpen = openApply.value;
            const el = proxy.$refs.TabbarCollapseApplyRef;
            nextTick(() => {
                if (isOpen) {
                    if (applys.length) {
                        el.style.height = el.children[0].clientHeight + 'px';
                    } else {
                        el.style.height = '0px';
                    }
                } else {
                    el.style.height = '0px';
                }
            })
        })
    })



    // 修改状态
    const handleUploadState = (e, s) => {
        const { id, receiveUserId } = e
        if (s == 1) {
            AgreeApplyRef.value.open(e)
        } else {
            ElMessageBox.confirm('确定拒绝这个好友申请吗？', '系统提示', {
                customClass: 'messageBox-custom-warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: true,
                center: true,
                beforeClose: (action, instance, done)=>{
                    if(action === 'confirm'){
                        instance.confirmButtonLoading = true
                        store.dispatch('IM/handleUpdateFriendApply', { id, receiveUserId, s }).then(res=>{
                            done();
                        }).catch(err=>{
                            done();
                        })
                    }else{
                        if(instance.confirmButtonLoading){ return }
                        done()
                    }
                }
            })
        }
    }

    // 开关申请列表
    const handleOpenApply = () => {
        openApply.value = !openApply.value
    }

    // 点击打开/收起
    const handleClick = (item, i) => {
        const index = openGroups.value.indexOf(item.id);
        if (index > -1) {
            openGroups.value.splice(index, 1)
        } else {
            openGroups.value.push(item.id)
        }
    }
    // 点击用户
    const handleClickUser = (option) => {
        const data = {
            account: option.msgImAccount.imAccountId,
            options: {
                name: option.msgImAccount.name,
                remark: option.remark,
                avatar: option.msgImAccount.avatar,
            }
        }
        emit('openDialog', data)
    }
    // 移动分组
    const handleMoveGroup = (option, group) => {
        if (loadingState.value) { return }
        loadingState.value = true;
        uploadImContact({ id: option.id, groupId: group.id }).then(res => {
            loadingState.value = false;
            ElMessage.success('操作成功');
        }).catch(err => {
            loadingState.value = false;
        })
    }
    // 删除联系人
    const handleDeleteContact = (option, groupIndex, optionIndex) => {
        const title = '删除好友'
        const content = `确定要删除好友“${option.msgImAccount.name}”吗？`
        ElMessageBox.confirm(content, title, {
            customClass: 'messageBox-custom-warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: true,
            center: true,
            beforeClose(action, instance, done) {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    store.dispatch('IM/handleDeleteImContact', { userId: option.contactUserId, groupIndex, optionIndex }).then(res => {
                        done();
                        if (res.closeDialog) {
                            emit('closeDialog')
                        }
                        ElMessage.success('删除成功');
                    }).catch(err => {
                        done();
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            },
        })
    }
    // 加入黑名单
    const handleInsertBlack = (option, groupIndex, optionIndex) => {

    }
    const handleUploadContact = (option, groupIndex, optionIndex) => {
        UploadContactRef.value.open({ id: option.id, remark: option.remark, groupIndex, optionIndex })
    }
    // 获取数据
    const loadingState = ref(false);
    const getData = () => {
        loadingState.value = true;
        store.dispatch('IM/getFriendApplyList').then(res => {
            loadingState.value = false;
        }).catch(err => {
            loadingState.value = false;
        })
    }
    // getData();
    // 重命名分组
    const handleResetName = (item) => {
        emit('resetGroupName', item)
    }
    // 删除分组
    const handleDelete = (item) => {
        if (item.msgImContacts && item.msgImContacts.length > 0) {
            ElMessage.error('该分组下有联系人，无法删除');
            return
        }
        ElMessageBox.confirm(`确定要删除“${item.groupName}”分组吗`, '删除分组', {
            customClass: 'messageBox-custom-warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: true,
            center: true,
            beforeClose(action, instance, done) {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    store.dispatch('IM/handleDeleteGroup', { id: item.id }).then(res => {
                        done();
                        ElMessage.success('删除成功');
                    }).catch(err => {
                        done();
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            },
        }).then(res => { }).catch(err => { })
    }
    return {
        emit,
        getData,
        openApply,
        openGroups,
        applyNumber,
        friendApplys,
        loadingState,
        handleResetName,
        handleClickUser,
        handleMoveGroup,
        handleOpenApply,
        AgreeApplyRef,
        UploadContactRef,
        handleUploadState,
        handleInsertBlack,
        handleUploadContact,
        handleDeleteContact,
        formatData,
        handleClick,
        handleDelete,
        personlGroup,
    }
}
export default defineComponent({
    name: "TabbarUser",
    setup,
    emits,
    components
})
</script>
<style scoped lang="scss">
.tabbar_collapse-box {
    .tabbar_collapse-title {
        font-size: 14px;
        color: white;
        padding: 8px 16px;
        cursor: pointer;
        user-select: none;
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
        &:hover {
            background: #36373e;
        }
        .title {
            display: inline-block;
            flex: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 4px;
        }
        .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            transition: transform 0.3s ease;
            transform: rotate(0deg);
            flex: none;
            &.active {
                transform: rotate(90deg);
            }
        }
    }
    .tabbar_collapse-container {
        overflow: hidden;
        transition: height 0.3s ease;
        .team_notice-item {
            user-select: none;
            display: flex;
            align-items: center;
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            &:hover {
                background: #36373e;
            }
            &:deep(.el-avatar) {
                flex: none;
                margin-right: 16px;
                pointer-events: none;
            }
            .content {
                flex: auto;
                overflow: hidden;
                div {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .action {
                width: 60px;
                text-align: center;
                flex: none;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #979797;
                margin-left: 16px;
                .action-btn {
                    flex: none;
                    padding: 4px 10px;
                    // margin-left: -10px;
                    cursor: pointer;
                    &.accept {
                        color: #3a36db;
                        // opacity: .5;
                    }
                    &.refuse {
                        color: #979797;
                        // opacity: .5;
                    }
                }
                .line {
                    width: 1px;
                    height: 14px;
                    background: #979797;
                    opacity: 0.5;
                }
            }
        }
    }
}

.contextmenu-sub-item {
    width: 120px;
    padding: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: #f4f4f5;
    }
}
</style>