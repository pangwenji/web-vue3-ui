<template>
    <el-dialog v-model="visible" width="780px"  :close-on-press-escape="false" :before-close="onBeforeClose" custom-class="dialog-center">
        <template #title="{ close, titleId, titleClass }">
            <div :id="titleId" :class="titleClass">
                <span>项目成员</span>
                <el-button type="primary" color="#3468FE" :disabled="!authRule('invite')" @click="handleInvitation"  style="border-radius: 10px; margin-left: 10px;" icon="UserFilled" plain>邀请</el-button>
            </div>
        </template>
        <el-row :gutter="20" class="table-header">
            <el-col :span="11">成员信息</el-col>
            <el-col :span="5">邀请人</el-col>
            <el-col :span="5">成员角色</el-col>
            <el-col :span="3" style="text-align:right;">操作</el-col>
        </el-row>
        <el-scrollbar height="500px" class="table-scrollbar-container" wrap-style="overflow-x:hidden;" v-loading="dialogLoading">
            <template v-if="menberList.length > 0">
                <el-row :gutter="20" class="table-container" v-for="(item,index) in menberList" :key="index">
                    <el-col :span="11"  class="person-item-box">
                        <el-avatar :size="38" @click="handleOpenSession(item)" :src="item.user?.avatar" />
                        <div class="person-name">
                            <span>{{item.user?.nickName}}</span>
                            <el-tooltip
                                v-if="item.user?.userId && userInfo.userId !== item.user?.userId"
                                effect="light"
                                content="聊一聊"
                                placement="top"
                            >
                                <span style="margin-left:6px;" @click="handleOpenSession(item)"><svg-icon iconClass="message2" :size="16" ></svg-icon></span>
                            </el-tooltip>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div>
                            {{item.inviteUser?.nickName || '--'}}
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div>
                            <span v-if="item.roleId == 1">项目拥有者</span>
                            <span v-if="item.roleId == 2">管理员</span>
                            <span v-if="item.roleId == 3">成员</span>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="actions" v-if="authRule('menber')">
                            <el-popover placement="right-start" ref="popoverRef" :disabled="item.roleId === 1" :show-arrow="false" :offset="30" :width="120" trigger="click">
                                <template #reference>
                                    <el-icon class="actions-icon" :class="{disabled: item.roleId === 1}"><MoreFilled /></el-icon>
                                </template>
                                <div class="actions-menu-item" @click="handleCheck(item.id,2,index)">
                                    <span>管理员</span>
                                    <span class="check-icon"><el-icon v-if="item.roleId == 2"><Check /></el-icon></span>
                                </div>
                                <div class="actions-menu-item" @click="handleCheck(item.id,3,index)">
                                    <span>成员</span>
                                    <span class="check-icon"><el-icon v-if="item.roleId == 3"><Check /></el-icon></span>
                                </div>
                                <div class="actions-menu-item delete" @click="handleDeleteMenber(item,index)">
                                    <span>移除成员</span>
                                    <span class="check-icon"></span>
                                </div>
                            </el-popover>
                        </div>
                        <div class="actions" v-else>
                            <el-popover placement="right-start" ref="popoverRef" :disabled="true" :show-arrow="false" :offset="30" :width="120" trigger="click">
                                <template #reference>
                                    <el-icon class="actions-icon" :class="{disabled: true}"><MoreFilled /></el-icon>
                                </template>
                            </el-popover>
                        </div>
                    </el-col>
                </el-row>
            </template>
            <template v-else-if="!dialogLoading">
                 <Empty description="项目内无其他成员" />
            </template>
        </el-scrollbar>
    </el-dialog>
</template>
<script>
import { getProjectMemberList ,updateProjectMemberRole,deleteMember} from '@/api/project/menber'
import { ElMessage } from 'element-plus'
import { defineComponent,getCurrentInstance,ref } from "vue";
import { useStore } from 'vuex'

const props = {
    projectId:{
        type:[Number,String],
        default:null
    }
}
const emits = ['invitation']

const setup = (prop,{emit})=>{
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const popoverRef = ref([]);
    const visible = ref(false);
    const menberList = ref([]);
    const dialogLoading = ref(false);
    const projectData = ref({});
    const userInfo = store.state.user
    const onBeforeClose = (deno)=>{
        if(dialogLoading.value){
            return
        }
        if(typeof  deno == 'function'){
            deno();
        }else{
            visible.value = false;
        }
        menberList.length = [];
    }
    // 打开会话框
    const handleOpenSession = (item)=>{
        const {avatar, nickName ,userId} = item.user;
        proxy.$sessionBox.openDialog({
            avatar, 
            name:nickName, 
            userId,
            success(){
                onBeforeClose();
            }
        });
    }
    // 判断权限
    const authRule = (e) => {
        if(!projectData.value.permissions){
            return false
        }
        if (projectData.value.currRoleId == 1) { // 所有者
            return true;
        } else if (projectData.value.currRoleId == 2) { // 管理员
            return projectData.value.permissions.adminPermissions.indexOf(e) > -1;
        } else { // 成员
            return projectData.value.permissions.memberPermissions.indexOf(e) > -1;
        }
    }
    // 邀请
    const handleInvitation = ()=>{
        onBeforeClose();
        emit('invitation',{id:prop.projectId})
    }
    const open = (data)=>{
        if(dialogLoading.value){
            return
        }
        menberList.value = [];
        visible.value = true;
        dialogLoading.value = true;
        getProjectMemberList({id:prop.projectId}).then(res=>{
            menberList.value = msort(res.data);
            projectData.value = data;
            dialogLoading.value = false;
        }).catch(err=>{
            dialogLoading.value = false;
            onBeforeClose();
        })
    }

    function msort(list) {
        const list1 = list.filter(el => el.roleId === 1)
        const list2 = list.filter(el => el.roleId > 1)
        return [...list1, ...list2]
    }

    return {
        open,
        emits,
        visible,
        authRule,
        popoverRef,
        menberList,
        projectData,
        dialogLoading,
        onBeforeClose,
        handleInvitation,
        handleOpenSession,
        userInfo,
    }
}

const methods = {
    // 切换成员角色
    handleCheck(id, roleId,index){
        this.$refs.popoverRef[index].hide();
        updateProjectMemberRole({id,roleId}).then(res=>{
            ElMessage.success('操作成功!')
            this.menberList[index].roleId = roleId;
        }).catch(err=>{

        })
    },
    //移除成员
    handleDeleteMenber(item,index){
        this.$refs.popoverRef[index].hide();
        deleteMember({id:item.id}).then(res=>{
            this.menberList.splice(index,1);
            ElMessage.success('操作成功!')
        }).catch(err=>{

        })
    }
}

export default defineComponent({
    emits,
    props,
    setup,
    methods,
})
</script>
<style scoped lang="scss">
.table-header{
    border-bottom: 1px solid #EAEAEA;
    padding-bottom: 12px;
    color: #9195A7;
}
.table-scrollbar-container{
    margin-left:-10px;
    margin-right:-10px;
    &:deep(.el-scrollbar__bar.is-horizontal){
        display: none ;
    }
}
.table-container{
    // cursor: pointer;
    // &:hover{
    //     background: #f4f4f4;
    // }
    &:deep(.el-col){
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        div{
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .actions{
            text-align: center;
            &-icon{
                &.disabled{
                    cursor: not-allowed;
                    color: #9195A7;
                }
                cursor: pointer;
                transform: rotate(90deg);
                &:hover{
                    color: #9195A7;
                }
            }

        }
    }
    .person-item-box{
        display: flex;
        flex-direction: row;
        overflow: hidden;
        align-items: center;
        padding: 12px 0;
        &:deep(.el-avatar){
            flex-shrink: 0;
            cursor: pointer;
            margin-left: 10px;
        }
        .person-name{
            flex-grow: 1;
            overflow: hidden;
            margin-left: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
.actions-menu-item{
    padding: 6px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    &:hover{
        background: #f4f4f4;
    }
    .check-icon{
        color: #3A6DFF;
        font-size: 16px;
    }
    &.delete{
        color: #F56C6C;
        border-top: 1px solid #F2F2F2;;
    }
}
</style>