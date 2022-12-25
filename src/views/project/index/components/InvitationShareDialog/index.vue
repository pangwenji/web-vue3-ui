<template>
    <el-dialog title="邀请成员" v-model="visible" width="530px" :close-on-press-escape="false" :before-close="onBeforeClose" custom-class="dialog-center">
        <div class="invitation-identity">邀请身份:
            <el-dropdown trigger="click" :disabled="dialogLoading" @command="handleCommand">
                <span class="invitation-dropdown-link">
                    {{identitys[identityName]}}
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item :command="index" v-for="(item,index) in identitys" :key="index">{{item}}</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="invitation-tabs">
            <el-tabs v-model="tabActiveName"  @tab-click="handleClickTab">
                <el-tab-pane label="链接扫码" name="Linkscan" v-loading="dialogLoading">
                    <div :style="{visibility:dialogLoading?'hidden':'visible'}">
                        <div v-color="'#878787'">邀请链接和小程序码 永久有效</div>
                        <div class="invitation-link">
                            <div class="text">{{resultData.url}}</div>
                            <el-button type="primary" class="copy-btn" @click.stop="handleCopyText(resultData.url)">复制链接</el-button>
                        </div>
                        <!-- <div class="invitation-code">
                            <div class="code-image">
                            </div>
                            <div class="code-desc">微信扫码分享、邀请好友加入</div>
                            <div class="copy-image" @click="handleCopyImage(resultData.qrcode)">
                                复制二维码图片
                            </div>
                        </div> -->
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="搜索邀请" name="searchInvite" v-loading="dialogLoading">
                    <div>
                        <p>搜索用户发送邀请链接</p>
                        <el-input
                            v-model.trim="searchValue"
                            maxlength="15"
                            placeholder="搜索手机号或昵称"
                            class="input-with-search"
                        >
                            <template #append>
                                <el-button @click="handleSearchSubmit">搜索</el-button>
                            </template>
                        </el-input>
                        <div v-if="inviteUserList && inviteUserList.length > 0" class="user-list">
                            <div v-for="(item, index) in 5" :key="index" class="user-item">
                                <div class="left">
                                    <el-avatar :size="30" :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                                    <span style="margin-left:6px;">18888888888</span>
                                </div>
                                <div class="right" @click="handleInvite(item)">
                                    邀请加入项目
                                </div>
                            </div>
                        </div>
                        <div v-else-if="inviteUserList && inviteUserList.length === 0">
                            <el-empty description="用户未注册，请换其他方式邀请" />
                        </div>
                    </div>
                </el-tab-pane> -->
            </el-tabs>
        </div>
    </el-dialog>
</template>
<script>
import { computed, defineComponent, ref } from 'vue'
import { getInviteInfo } from '@/api/project/project.js'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'
import {useStore} from 'vuex'
import { value } from 'dom7'
const props = {
    projectId:{
        type:[Number,String],
        default:null
    },
    projectName:{
        type:[Number,String],
        default:null
    }
}
const setup = (prop,{emit})=>{
    const visible = ref(false);
    const identitys = ref({
        '2':'管理员',
        '3':'成员',
    });
    const store = useStore();
    const getters = computed(()=>store.getters)
    const { toClipboard } = useClipboard();
    const dialogLoading = ref(false);
    const resultData = ref({});
    const identityName = ref('2');
    const handleCommand = (roleId)=>{
        if(roleId == identityName.value){
            return
        }
        const projectId = prop.projectId;
        dialogLoading.value = true;
        getInviteInfo({projectId,roleId}).then(res=>{
            dialogLoading.value = false;
            identityName.value = roleId
            resultData.value = res.data;
        }).catch(err=>{
            dialogLoading.value = false;
        })
    }

    // 标签页
    const tabActiveName = ref('Linkscan');
    const handleClickTab = ()=>{}

    const onBeforeClose = (deno)=>{
        if(dialogLoading.value){
            return
        }
        if(typeof  deno == 'function'){
            deno();
        }else{
            visible.value = false;
        }
        inviteUserList.value = null
    }
    // 复制文字
    const handleCopyText = async (text)=>{
        try{
            const context = `${getters.value.nickName}邀请你加入项目「${prop.projectName}」，点击链接加入${text}  （永久有效）`
            await toClipboard(context)
            ElMessage.success('复制成功')
        }catch(err){
            ElMessage.error('复制失败')
        }
    }

    const handleCopyImage = async (base64)=>{
        try{
            let arr = base64.split(',');
            let contentType = 'data:image/png;base64';
            arr[0] = contentType;
            let data = await fetch(arr.join(','));
            let blob = await data.blob()
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                })
            ])
            ElMessage.success('复制成功')
        }catch(err){
            console.log(err)
            ElMessage.error('复制失败')
        }
    }

    const open = (data)=>{
        if(dialogLoading.value){
            return
        }
        if(data.currRoleId == 1 || data.currRoleId == 2){
            identitys.value = {
                '2':'管理员',
                '3':'成员',
            };
            identityName.value = '2'
        }else{
            identitys.value = {
                '2':'管理员',
                '3':'成员',
            };
            identityName.value = '3'
        }
        const roleId = identityName.value;
        const projectId = prop.projectId;
        visible.value = true;
        dialogLoading.value = true;
        getInviteInfo({projectId,roleId}).then(res=>{
            dialogLoading.value = false;
            resultData.value = res.data;
        }).catch(err=>{
            dialogLoading.value = false;
            onBeforeClose();
        })
    }

    const searchValue = ref('')
    const inviteUserList = ref(null)
    function handleSearchSubmit() {
        console.log('handleSearchSubmit--', searchValue.value);
    }

    function handleInvite() {
        console.log('handleInvite--');
    }

    return {
        open,
        visible,
        identitys,
        resultData,
        searchValue,
        handleInvite,
        identityName,
        handleCommand,
        dialogLoading,
        tabActiveName,
        inviteUserList,
        onBeforeClose,
        handleClickTab,
        handleCopyText,
        handleCopyImage,
        handleSearchSubmit,
    }
}
export default defineComponent({
    props,
    setup
})
</script>
<style scoped lang="scss">
.invitation-identity{
    font-size: 14px;
    line-height: 24px;
    color: #878787;
    .invitation-dropdown-link{
        cursor: pointer;
        color: #878787 !important;
        line-height: 24px;
        &:hover{
            color: #a0a0a0 !important;
        }
    }
}
.invitation-tabs{
    &:deep(.el-tabs){
        .el-tabs__nav-wrap{
            &::after{
                height: 1px;
            }
        }
        .el-tabs__active-bar{
            background-color: #3468FE;
            border-radius: 10px;
        }
        .el-tabs__item.is-active{
            color: #333539;
        }
    }
    .invitation-link{
        border: 1px solid #DADCE1;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 8px;
        margin-bottom: 30px;
        .text{
            flex-grow: 1;
            font-size: 14px;
            padding: 0 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            user-select: none;
        }
        .copy-btn{
            border:none;
            background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
            border-radius: 10px;
            padding: 20px;
        }
    }
    .invitation-code{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .code-image{
            width: 200px;
            height: 200px;
            margin-bottom: 12px;
            background: #f4f4f4;
        }
        .code-desc{
            color: #878787;
            margin-bottom: 12px;
        }
        .copy-image{
            color: #3468FE;
            cursor: pointer;
            &:hover{
                color: #3467fea3;
            }
        }
    }
    
    :deep(.input-with-search) {
        height: 40px;
        .el-input__inner {
            height: 40px;
            border: 1px solid #dcdfe6;
            box-shadow: none;
            --el-input-focus-border: none;
            --el-input-focus-border-color: none;
            --el-input-hover-border-color: none;
        }
        .el-input-group__append {
            // box-shadow:none;
            width: 100px;
            color: #fff;
            box-shadow: 0 1px 0 0 #0459FF inset,0 -1px 0 0 #0459FF inset,-1px 0 0 0 #0459FF inset;
            background-color: #0459FF;
            .el-button {
            width: 100px;
                height: 100%;
            }
        }
    }

    .user-list {
        .user-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            .left {
                display: flex;
                align-items: center;
            }
            .right {
                user-select: none;
                color: #3468FE;
                cursor: pointer;
                &:hover {
                    color: #0b3bcb;
                }
            }
        }
    }
}
</style>