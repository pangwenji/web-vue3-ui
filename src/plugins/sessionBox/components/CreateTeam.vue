<template>
<div class="create-team-box">
    <el-dialog v-model="visibled" :close-on-click-modal="false" width="530px" title="创建群聊" :before-close="onBeforClose" custom-class="dialog-center create-team-dialog">
        <div style="margin-bottom: 20px">
            <el-input placeholder="请填写群名称" v-model="teamName" class="is-custom" show-word-limit :maxlength="10"></el-input>
        </div>
        <!-- <el-divider></el-divider> -->
        <div v-loading="loadingState" class="craete_team-container">
            <div class="left-container"  >
                <el-input v-model="contextKey" @input="handleInputSearch" style="--el-input-border-radius: 8px; margin-bottom: 20px" placeholder="搜索手机号或昵称">
                    <template #prefix> 
                        <div>
                            <SvgIcon iconClass="icon_search" :size="16"></SvgIcon>
                        </div>
                    </template>
                </el-input>
                <el-scrollbar style="height: 360px; margin-right: -20px;" view-style="padding-right: 20px;">
                    <div class="group-user-item" v-for="(item,index) in searchData" :key="index">
                        <div class="group-title" @click="handleOpen(item)">
                            <span :class="{active: isOpen(item)}" class="icon"> <SvgIcon iconClass="icon_right" :size="14"></SvgIcon></span>
                            <span style="margin-left: 4px">{{item.groupName}}</span>
                        </div>
                        <template v-if="item.msgImContacts&&item.msgImContacts.length&&isOpen(item)">
                            <div v-for="(option,code) in item.msgImContacts" :key="code"  class="group-user-info">
                                <el-avatar :size="38" :src="option.msgImAccount.avatar"></el-avatar>
                                <div class="nickName">{{option.msgImAccount.name}}({{option.remark}})</div>
                                <div class="check-box" :class="{check:checkUser(option)}" @click="handleCheckUser(option)">
                                    <SvgIcon iconClass="icon_check" :size="16"></SvgIcon>
                                </div>
                            </div>
                        </template>

                    </div>
                </el-scrollbar>
            </div>
            <div class="right-container">
                <div class="right-container-title">
                    <span>已选联系人</span>
                    <span>({{selectUser.length}}/{{teamLevel}})</span>
                </div>
                <el-scrollbar style="height: 360px; margin-right: -20px;" view-style="padding-right: 20px;">
                    <div class="group-user-item">
                        <template v-if="selectUser">
                            <div  v-for="(option,code) in selectUser" :key="code"   class="group-user-info">
                                <el-avatar :size="38"  :src="option.msgImAccount.avatar"></el-avatar>
                                <div class="nickName">{{option.msgImAccount.name}}({{option.remark}})</div>
                                <div class="delete" @click="handleCheckUser(option)">
                                    <SvgIcon iconClass="icon_close" :size="16"></SvgIcon>
                                </div>
                            </div>
                        </template>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <!-- <el-divider></el-divider> -->
        <div style="text-align:center; margin-top: 20px">
            <el-button type="default" style="width: 106px" class="is-custom" @click="onBeforClose">取消</el-button>
            <el-button type="primary" style="width: 106px" class="is-custom" :disabled="!selectUser.length" :loading="loadingSubmit" @click="handleSubmit" >创建</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
import { defineComponent, ref } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
const setup = ()=>{
    const store = useStore();
    const visibled = ref(false);
    const contextKey = ref('');
    const teamLevel = ref(200);
    const teamName = ref('');
    const openGroups = ref([]);
    const selectUser = ref([]);
    const searchData = ref([]);
    const personlGroup = computed(()=>store.state.IM.contactGroups);
    // 打开分组
    const handleOpen = (item)=>{
        const index = openGroups.value.indexOf(item.id);
        if(index > -1){
            openGroups.value.splice(index,1)
        }else{
            openGroups.value.push(item.id)
        }
    }
    // 判断是否展开
    const isOpen = (item)=>{
        return openGroups.value.indexOf(item.id) > -1
    }
    // 是否选中
    const checkUser = (option)=>{
        for(const key in selectUser.value){
            if(selectUser.value[key].id == option.id){
                return parseInt(key) + 1;
            }
        }
        return false;
    }
    // 选联系人
    const handleCheckUser = (option)=>{
        const index = checkUser(option)
        if(index){
            selectUser.value.splice(index-1,1);
        }else{
            selectUser.value.push(option);
        }
    }
    // 输入搜索
    const handleInputSearch = (e)=>{
        searchData.value = [];
        if(e){
            personlGroup.value.forEach(item => {
                if(item.msgImContacts&&item.msgImContacts.length > 0){
                    const arr = item.msgImContacts.filter(option=>{
                        if(option.msgImAccount.name&&option.msgImAccount.name.indexOf(e) > -1){
                            return true;
                        }else if(option.remark&&option.remark.indexOf(e) > -1){
                            return true
                        }else if(option.msgImAccount.phone&&option.msgImAccount.phone.indexOf(e) > -1){
                            return true
                        }
                        return false
                    })
                    if(arr.length > 0){
                        const obj = Object.assign({},item);
                        obj.msgImContacts = arr;
                        searchData.value.push(obj)
                    }else{
                        return false
                    }
                }else{
                    return false;
                }
            });
        }else{
            searchData.value = personlGroup.value
        }
    }
    // 创建群聊
    const loadingSubmit = ref(false);
    const handleSubmit = ()=>{
        if(!teamName.value){
            ElMessage.error('请填写群聊名称')
            return
        }
        loadingSubmit.value = true;
        const accounts = selectUser.value.map(item=>item.contactImAccountId);
        const receiveUsers = selectUser.value.map(item=>item.contactUserId);
        const avatars = selectUser.value.map(item=>item.msgImAccount.avatar);
        store.dispatch('IM/handleCreateTeam',{name: teamName.value ,accounts,receiveUsers, avatars}).then(res=>{
            loadingSubmit.value = false;
            onBeforClose();
            ElMessage.success('创建成功');
        }).catch(err=>{
            loadingSubmit.value = false;
        })
    }
    // 关闭之前的回调
    const onBeforClose = (deno)=>{
        if(loadingSubmit.value){  return }
        contextKey.value = '';
        teamName.value = '';
        openGroups.value = [];
        selectUser.value = [];
        if(typeof deno == 'function'){
            deno();
        }else{
            visibled.value = false;
        }
    }
    const loadingState = ref(false);
    const open = ()=>{
        visibled.value = true;
        loadingState.value = true;
        store.dispatch('IM/handleGetGroup').then(res=>{
            loadingState.value = false;
            handleInputSearch();
        }).catch(err=>{
            onBeforClose();
            loadingState.value = false;
        });
    }
    return {
        open,
        isOpen,
        checkUser,
        teamLevel,
        teamName,
        visibled,
        contextKey,
        selectUser,
        searchData,
        personlGroup,
        loadingSubmit,
        loadingState,
        handleOpen,
        handleSubmit,
        onBeforClose,
        handleCheckUser,
        handleInputSearch,
    }
}
export default defineComponent({
    setup,
})
</script>
<style scoped lang="scss">
.create-team-box{
    &:deep(.el-dialog.create-team-dialog){
        .el-dialog__header{
            display: none;
        }
        .el-dialog__headerbtn{
            display: none;
        }
        .el-dialog__body{
            .craete_team-container{
                display: flex;
            }
            padding: 20px;
            .left-container{
                width: 50%;
                flex: none;
                padding-right: 20px;
                border-right: 1px solid #F1F1F1;
            }
            .right-container{
                width:  50%;
                flex: none;
                padding-left: 20px;
                .right-container-title{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 16px;
                    padding: 6px 0;
                    margin-bottom: 20px;
                    font-weight: bold;
                    color: #333539;
                    .desc{
                        font-weight: initial;
                        font-size: 12px;
                    }
                }
            }
        }
    }
}
.group-user-item{
    .group-title{
        width: 100%;
        color: black;
        padding: 6px 0;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        .icon{
            width: 16px;
            height: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            &.active{
                transform: rotate(90deg);
            }
        }
    }
    .group-user-info{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        user-select: none;
        &:deep(.el-avatar){
            flex: none;
        }
        .nickName{
            flex: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 8px;
            font-size: 14px;
            color: black;
        }
        .check-box{
            flex: none;
            width: 20px;
            height: 20px;
            border: 2px solid #CFD2D8;
            border-radius: 20px;
            cursor: pointer;
            color: white;
            &.check{
                background: #2744F1;
                border-color: #2744F1;
            }
        }
        .delete{
            cursor: pointer;
        }
    }
}
</style>