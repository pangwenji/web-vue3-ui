<template>
    <el-scrollbar height="100%" class="session_drawer-scrollbar" view-class="scrollbar-view">
        <template v-if="teams.length > 0 || teamInvites.length > 0">
            <div class="tabbar_collapse-box">
                <!-- <div class="tabbar_collapse-title" @click="handleClick('TeamNoticeRef')">
                    <span class="icon" :class="{active: openGroup.indexOf('TeamNoticeRef') > -1}">
                        <svg-icon iconClass="video-play" :size="10"></svg-icon>
                    </span>
                    <span class="title">群通知</span>
                </div>
                <div class="tabbar_collapse-container" ref="TeamNoticeRef">
                    <div class="tabbar_collapse-view">
                        <div class="team_notice-item" v-for="(item,index) in teamInvites" :key="index">
                            <el-avatar :src="item.inviterPortrait"></el-avatar>
                            <div class="content">
                                <div style="color: rgba(255, 255, 255, 0.6); margin-bottom: 4px;">群邀请</div>
                                <div style="color: rgba(255, 255, 255, 0.2); font-size: 12px;">{{item.inviterName}}邀请你加入群聊</div>
                            </div>
                            <div class="action" v-if="item.state === 0">
                                <div class="action-btn accept" @click="handleUploadState(item,1)">接受</div>
                            </div>
                            <div class="action" v-if="item.state === 1">
                                已加入
                            </div>
                            <div class="action" v-if="item.state === 3">
                                已在群中
                            </div>
                        </div>
                    </div>
                </div> -->
                <div class="tabbar_collapse-title" @click="handleClick('CreateTeamRef')">
                    <span class="icon" :class="{active: openGroup.indexOf('CreateTeamRef') > -1}">
                        <svg-icon iconClass="video-play" :size="10"></svg-icon>
                    </span>
                    <span class="title">我创建的群({{MyCreateTeams?.length || 0}})</span>
                </div>
                <div class="tabbar_collapse-container" ref="CreateTeamRef">
                    <div class="tabbar_collapse-view">
                        <template v-if="MyCreateTeams.length > 0">
                            <template v-for="(item,index) in MyCreateTeams" :key="index">
                                <SessionItem @click="handleOpenDialog(item)" :sessionData="formatData(item)">
                                    <template #contextmenuItem>
                                        <v-contextmenu-item @click="handleOpenSetting(item)">群信息</v-contextmenu-item>
                                        <v-contextmenu-item @click="handleAssignment(item)">群转让</v-contextmenu-item>
                                        <v-contextmenu-item @click="handleDissolution(item)">解散群</v-contextmenu-item>
                                    </template>
                                </SessionItem>
                            </template>
                        </template>
                    </div>
                </div>
                <div class="tabbar_collapse-title" @click="handleClick('JoinTeamRef')">
                    <span class="icon" :class="{active: openGroup.indexOf('JoinTeamRef') > -1}">
                        <svg-icon iconClass="video-play" :size="10"></svg-icon>
                    </span>
                    <span class="title">我加入的群({{MyJoinTeams?.length || 0}})</span>
                </div>
                <div class="tabbar_collapse-container" ref="JoinTeamRef">
                    <div class="tabbar_collapse-view">
                        <template v-if="MyJoinTeams.length > 0">
                            <template v-for="(item,index) in MyJoinTeams" :key="index">
                                <SessionItem @click="handleOpenDialog(item)" :sessionData="formatData(item)">
                                    <template #contextmenuItem>
                                        <v-contextmenu-item @click="handleOpenSetting(item)">群信息</v-contextmenu-item>
                                        <v-contextmenu-item @click="handleSecede(item)">退出群</v-contextmenu-item>
                                    </template>
                                </SessionItem>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <Empty description="暂无群组数据">
                <ElButton type="primary" color="#2744F1" round @click="emit('createTeam');">创建群组</ElButton>
                <!-- <ElButton type="primary" color="#1E1F26" round>加入群组</ElButton> -->
            </Empty>
        </template>
        <SelectMenber ref="SelectMenberRef"></SelectMenber>
    </el-scrollbar>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, nextTick, onActivated, onMounted, watchEffect } from '@vue/runtime-core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import SelectMenber from './SelectMenber.vue'
import SessionItem from './SessionItem.vue'
const components = {
    SessionItem,
    SelectMenber,
}
const emits = ['openDialog', 'createTeam', 'closeDialog', 'settingTeam'];
const setup = (prop, { emit }) => {
    const store = useStore();
    const SelectMenberRef = ref();
    const { proxy } = getCurrentInstance();
    const teams = computed(() => store.state.IM.teams);
    const account = computed(() => store.state.IM.account)
    const MyJoinTeams = computed(() => teams.value.filter(item => item.owner !== account.value));
    const MyCreateTeams = computed(() => teams.value.filter(item => item.owner == account.value));
    const teamInvites = computed(() => store.state.IM.teamInvites);
    const sessionItem = computed(() => store.state.IM.sessionItem);
    const openGroup = ref([]);
    const formatData = (option) => {
        return {
            unread: 0,
            nickname: option.name,
            context: option.intro,
            avatar: option.avatar,
        }
    }

    // 点击弹窗
    const handleClick = (name) => {
        const arr = [].concat(openGroup.value)
        const index = arr.indexOf(name);
        if (index > -1) {
            arr.splice(index, 1)
        } else {
            arr.push(name)
        }
        openGroup.value = arr;
    }
    // 群设置
    const handleOpenSetting = (team) => {
        emit('settingTeam', team)
    }
    // 解散群
    const handleDissolution = (team) => {
        const title = '解散群聊'
        const content = `确定要解散群聊“${team.name}”吗？`
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
                    store.dispatch('IM/handleDissolution', team).then(res => {
                        done()
                        if (sessionItem.value.to == team.teamId) {
                            emit('closeDialog')
                        }
                        ElMessage.success('操作成功')
                    }).catch(err => {
                        done()
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            },
        })
    }
    // 转让群
    const handleAssignment = (team) => {
        SelectMenberRef.value.open(team);
    }
    // 退出群
    const handleSecede = (team) => {
        const title = '退出群聊'
        const content = `确定要退出群聊“${team.name}”吗？`
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
                    store.dispatch('IM/handleSecedeTeam', team).then(res => {
                        done()
                        if (sessionItem.value.to == team.teamId) {
                            emit('closeDialog')
                        }
                        ElMessage.success('操作成功')
                    }).catch(err => {
                        done()
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            },
        })
    }
    // 修改状态
    const handleUploadState = (item, state) => {
        store.dispatch('IM/handleUploadInvite', { id: item.id, status: state, teamId: item.teamId, from: item.inviterImAccountId }).then(res => {
            ElMessage.success('操作成功')
        })
    }   
    onMounted(() => {
        watchEffect(() => {
            const refData = ['CreateTeamRef', 'TeamNoticeRef', 'JoinTeamRef']
            const joinTeams = MyJoinTeams.value;
            const createTeams = MyCreateTeams.value;
            const invites = teamInvites.value;
            const open_groups = openGroup.value;
            if (joinTeams.length > 0 || createTeams.length > 0 || invites.length > 0) {
                for (const name of refData) {
                    nextTick(() => {
                        const index = open_groups.indexOf(name);
                        const el = proxy.$refs[name];
                        if (el) {
                            if (index > -1) {
                                el.style.height = el.children[0].clientHeight + 'px';
                            } else {
                                el.style.height = '0px';
                            }
                        }
                    })
                }
            }
        })
    })
    // 打开会话 弹窗
    const handleOpenDialog = (item) => {
        const data = {
            account: item.teamId,
            scene: 'team',
            options: item
        }
        emit('openDialog', data);
    }
    return {
        emit,
        teams,
        account,
        openGroup,
        sessionItem,
        teamInvites,
        MyJoinTeams,
        MyCreateTeams,
        SelectMenberRef,
        handleUploadState,
        handleDissolution,
        handleAssignment,
        handleSecede,
        formatData,
        handleClick,
        handleOpenDialog,
        handleOpenSetting
    }
}
export default defineComponent({
    name: 'TabbarTeam',
    setup,
    emits,
    components
})
</script>
<style lang="scss" scoped>
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
        .tabbar_collapse-view {
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
}
</style>