<template>
    <el-dialog v-model="visibled" width="510px" :before-close="onBeforeClose" :close-on-click-modal="false" title="群信息" custom-class="dialog-center">
        <div class="team_member-title" v-if="menbers.length > 0">
            <div class="title">群聊成员({{formData.memberNum}}/{{formData.level}})</div>
            <div class="desc" @click="handleViewMenbers" v-if="selfData.type == 'owner'">查看全部成员</div>
        </div>
        <el-row :gutter="20" class="team_member-list" v-if="menbers.length > 0">
            <template v-for="(item,index) in menbers" :key="index">
                <el-col :span="4" class="team_member-item" v-if="index < 4">
                    <el-avatar :src="item.options.avatar"></el-avatar>
                    <div class="nickName" :title="item.options.name">{{item.nickInTeam || item.options.name}}</div>
                    <!-- <div class="subscript" style="background: #E6A23C;" v-if="item.type == 'owner'">群主</div>
                    <div class="subscript" style="background: #67C23A;" v-else-if="item.type == 'manager'">管理员</div>
                    <div class="subscript" style="background: #409EFF;" v-else>群成员</div> -->
                </el-col>
            </template>

            <el-col :span="4" class="team_member-item" @click="handleInviteMenber">
                <el-avatar :src="userAddIcon" style="opacity: .3;"></el-avatar>
                <div class="nickName">邀请成员</div>
            </el-col>
            <el-col :span="4" class="team_member-item" @click="handleRemoveMenbers">
                <el-avatar :src="userAddIcon" style="opacity: .3;"></el-avatar>
                <div class="nickName">移除成员</div>
            </el-col>
        </el-row>
        <el-form label-width="90px" label-position="left">
            <el-form-item label="群ID">
                <div class="team-name">{{formData.teamId}}</div>
            </el-form-item>
            <el-form-item label="群名称">
                <el-input v-if="inputType == 'TeamNameRef'" ref="TeamNameRef" @change="handleBlur('name')" v-model="formData.name" show-word-limit :maxlength="10" placeholder="请输入群名称"></el-input>
                <div class="team-name" v-else>{{formData.name || '-'}}<span class="edit-btn" @click="handleEdit('TeamNameRef')"
                        v-if="formData.updateTeamMode == 'all' ||  selfData.type == 'manager' ||  selfData.type == 'owner'">
                        <SvgIcon iconClass="icon_edit"></SvgIcon>
                    </span> </div>
            </el-form-item>
            <el-form-item label="群说明">
                <el-input type="textarea" v-if="inputType == 'TeamIntroRef'" ref="TeamIntroRef" @change="handleBlur('intro')" v-model="formData.intro" show-word-limit :maxlength="60" :rows="3"
                    resize="none" placeholder="请输入群说明"></el-input>
                <div class="team-name" v-else>{{formData.intro || '-'}}<span class="edit-btn" @click="handleEdit('TeamIntroRef')"
                        v-if="formData.updateTeamMode == 'all' ||  selfData.type == 'manager' ||  selfData.type == 'owner'">
                        <SvgIcon iconClass="icon_edit"></SvgIcon>
                    </span> </div>
            </el-form-item>
            <el-form-item label="群公告">
                <el-input type="textarea" v-if="inputType == 'TeamAnnouncementRef'" ref="TeamAnnouncementRef" @change="handleBlur('announcement')" v-model="formData.announcement" show-word-limit
                    :maxlength="60" :rows="3" resize="none" placeholder="请输入群公告"></el-input>
                <div class="team-name" v-else>{{formData.announcement  || '-'}}<span class="edit-btn" @click="handleEdit('TeamAnnouncementRef')"
                        v-if="formData.updateTeamMode == 'all' ||  selfData.type == 'manager' ||  selfData.type == 'owner'">
                        <SvgIcon iconClass="icon_edit"></SvgIcon>
                    </span> </div>
            </el-form-item>
            <el-form-item label="我的群昵称">
                <el-input v-if="inputType == 'NickInTeamRef'" ref="NickInTeamRef" @change="handleBlur('nickInTeam')" v-model="formData.nickInTeam" show-word-limit :maxlength="10" placeholder="请输入我的在本群的昵称"></el-input>
                <div class="team-name" v-else>
                    {{formData.nickInTeam || '暂未设置在本群的昵称'}}
                    <span class="edit-btn" @click="handleEdit('NickInTeamRef')">
                        <SvgIcon iconClass="icon_edit"></SvgIcon>
                    </span>
                </div>
            </el-form-item>
            <el-form-item label="群邀请设置">
                <div style="display:flex; justify-content:flex-end; width:100%;">
                    <span>
                        <span v-if="formData.inviteMode == 'manager'">仅管理员和群主</span>
                        <span v-else>所有群成员</span>
                    </span>
                    <el-switch :before-change="handleChangeInviteMode" style="margin-left: 20px;" v-if="formData.updateTeamMode == 'all' ||  selfData.type == 'manager' ||  selfData.type == 'owner'" v-model="formData.inviteMode"
                        active-color="#3468FE" active-value="manager" inactive-value="all" />
                </div>
            </el-form-item>
            <el-form-item label="消息免打扰">
                <div style="display:flex; justify-content:flex-end; width:100%;">
                    <el-switch :before-change="handleBeforeChange" :loading="loadingState1" v-model="formData.bitConfigMask" active-color="#3468FE" :active-value="1" :inactive-value="0" />
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button class="is-custom" v-if="selfData.type == 'owner'" @click="SelectMenberRef.open(formData)">转让群聊</el-button>
                <el-button class="is-custom" type="danger" v-if="selfData.type !== 'owner'" @click="handleSecede(formData)">退出群聊</el-button>
                <el-button class="is-custom" type="danger" v-if="selfData.type == 'owner'" @click="handleDissolution(formData)">解散群聊</el-button>
            </span>
        </template>
    </el-dialog>
    <MenberList ref="MenberListRef" @onSubmit="getData"></MenberList>
    <SelectMenber ref="SelectMenberRef" @onSubmit="open"></SelectMenber>
    <InviteMenber ref="InviteMenberRef" @onSubmit="getData"></InviteMenber>
    <RemoveMembers ref="RemoveMembersRef" @onSubmit="getData"></RemoveMembers>
</template>
<script>
import { useStore } from 'vuex';
import userAddIcon from '@/assets/images/project-user-add.png'
import InviteMenber from './InviteMenber.vue';
import RemoveMembers from './RemoveMembers.vue';
import MenberList from './MenberList.vue';
import SelectMenber from './SelectMenber.vue';
import { computed, defineComponent, getCurrentInstance, nextTick, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const components = {
    MenberList,
    SelectMenber,
    InviteMenber,
    RemoveMembers,
}
const emits = ['closeDialog']
const setup = (prop, { emit }) => {
    const store = useStore()
    const visibled = ref(false);
    const MenberListRef = ref();
    const InviteMenberRef = ref();
    const SelectMenberRef = ref();
    const RemoveMembersRef = ref();
    const sessionItem = computed(() => store.state.IM.sessionItem)
    const { proxy } = getCurrentInstance();
    const menbers = ref([]);
    const inputType = ref('');
    let teamData;
    const selfAccount = computed(() => store.state.IM.account)
    const selfData = computed(() => {
        for (const item of menbers.value) {
            if (item.account == selfAccount.value) {
                return item;
            }
        }
        return {}
    })
    const formData = reactive({
        teamId: '',         // 群账号
        name: '',           // 群名称
        level: 200,         // 群成员最大数量
        intro: '',          // 群简介
        joinMode: '',       // 加群验证
        memberNum: '',      // 群成员数量
        inviteMode: '',      // 群邀请权限
        nickInTeam:'',       // 我的群昵称
        announcement: '',   // 群公告
        updateTeamMode: '',   // 群公告
        bitConfigMask: 0, //群消息免打扰
    })
    const getData = () => {

        store.dispatch('IM/handleGeTeamMenber', teamData).then(res => {
            menbers.value = res;
        })
    }
    // 编辑
    const handleEdit = (type) => {
        inputType.value = type;
        nextTick(() => {
            proxy.$refs[type].focus()
        })
    }
    // 失去焦点的事件
    const handleBlur = (key) => {
        const data = {
            teamId: formData.teamId
        };
        data[key] = formData[key];
        if (key == 'name' && !formData[key]) {
            formData[key] = teamData[key];
            ElMessage.error('群名称不能为空');
            return;
        }
        if(key == 'nickInTeam'){
            store.dispatch('IM/handleUpdateTeamMyMemberInfo', data).then(res => {
                menbers.value = menbers.value.map(item=>{
                    if (item.account == selfAccount.value) {
                        item.nickInTeam = data.nickInTeam;
                        return item;
                    }
                })
                ElMessage.success('更新成功')
            })
        }else{
            store.dispatch('IM/handleUpdateTeamInfo', data).then(res => {
                ElMessage.success('更新成功')
            })
        }

        inputType.value = '';
    }
    // 消息免打扰
    const loadingState1 = ref(false);
    const handleBeforeChange = (e) => {
        loadingState1.value = true;
        const teamId = formData.teamId;
        const bitConfigMask = formData.bitConfigMask === 0 ? 1: 0;
        return new Promise((resolve, reject) => {
            store.dispatch('IM/handleUpdateTeamMyMemberInfo', { teamId, bitConfigMask }).then(res => {
                loadingState1.value = false;
                ElMessage.success('更新成功')
                resolve(true);
            }).catch(err => {
                loadingState1.value = false;
                reject()
            })
        })
    }
    // 群邀请设置
    const loadingState2 = ref(false);
    const handleChangeInviteMode = (e) => {
        loadingState2.value = true;
        const data = {
            teamId: formData.teamId,
            inviteMode: formData.inviteMode == 'all' ? 'manager':'all'
        }
        return new Promise((resolve, reject) => {
            store.dispatch('IM/handleUpdateTeamInfo', data).then(res => {
                loadingState2.value = false;
                ElMessage.success('更新成功')
                resolve(true);
            }).catch(err => {
                loadingState2.value = false;
                reject()
            })
        })
    }
    // 查看全部群成员
    const handleViewMenbers = () => {
        MenberListRef.value.open(teamData)
    }
    // 移除群成员
    const handleRemoveMenbers = () => {
        RemoveMembersRef.value.open(teamData)
    }
    // 邀请成员
    const handleInviteMenber = () => {
        if (formData.memberNum >= formData.level) {
            ElMessage.error('群聊人数已达到上限');
            return;
        }
        if (formData.inviteMode == 'manager') {
            if (selfData.value.type != 'manager' && selfData.value.type != 'owner') {
                ElMessage.error('只允许管理员和群主能够邀请');
                return;
            }
        }
        InviteMenberRef.value.open(teamData)
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
                        onBeforeClose();
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
                        if (sessionItem.value.to == team.teamId) {
                            emit('closeDialog')
                        }
                        onBeforeClose();
                        ElMessage.success('操作成功')
                        done()
                    }).catch(err => {
                        console.log(err)
                        done()
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            },
        })
    }
    // 关闭之前的回调函数
    const onBeforeClose = (deno) => {
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    // 打开
    const open = (team) => {
        visibled.value = true;
        store.dispatch('IM/handleGeTeamMenber', team).then(res => {
            teamData = team;
            menbers.value = res
            formData.teamId = team.teamId;
            formData.name = team.name;
            formData.level = team.level;
            formData.intro = team.intro;
            formData.memberNum = team.memberNum;
            formData.inviteMode = team.inviteMode;
            formData.announcement = team.announcement;
            formData.updateTeamMode = team.updateTeamMode;
            formData.nickInTeam = selfData.value.nickInTeam;
            formData.bitConfigMask = selfData.value.bitConfigMask;
        }).catch(err => {
            visibled.value = false;
        })
    }
    return {
        open,
        getData,
        menbers,
        selfData,
        formData,
        visibled,
        inputType,
        handleBlur,
        handleEdit,
        userAddIcon,
        selfAccount,
        handleSecede,
        onBeforeClose,
        MenberListRef,
        loadingState1,
        loadingState2,
        SelectMenberRef,
        InviteMenberRef,
        RemoveMembersRef,
        handleViewMenbers,
        handleDissolution,
        handleBeforeChange,
        handleInviteMenber,
        handleRemoveMenbers,
        handleChangeInviteMode,
    }
}
export default defineComponent({
    setup,
    emits,
    components,
})
</script>
<style scoped lang="scss">
.team_member-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333539;
    padding-bottom: 20px;
    .title {
        font-size: 14px;
    }
    .desc {
        cursor: pointer;
        font-size: 12px;
    }
}
.team_member-list {
    margin-bottom: 16px;
    .team_member-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-bottom: 10px;
        position: relative;
        cursor: pointer;
        &.disabled {
            cursor: no-drop;
            opacity: 0.5;
        }
        .subscript {
            top: -9px;
            right: 0;
            height: 18px;
            line-height: 18px;
            padding: 0px 6px;
            border-radius: 20px;
            font-size: 8px;
            color: white;
            position: absolute;
            pointer-events: none;
        }
        .nickName {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            padding-top: 10px;
        }
    }
}
:deep(.el-form-item) {
    .el-form-item__label {
        color: #333539;
        font-size: 14px;
        font-weight: normal;
        // line-height: 30px;
    }
    .el-form-item__content {
        .team-name {
            padding-right: 20px;
            position: relative;
            .edit-btn {
                position: absolute;
                right: 0;
                top: 0;
                cursor: pointer;
            }
        }
    }
}
</style>