<template>
    <div class="MemberDialog-box">
        <el-dialog v-model="visibled" width="380px" @closed="handleClosed" :before-close="handleBeforeClase" :close-on-click-modal="false" :show-close="false" custom-class="dialog-center">
            <template #title>
                <el-icon class="close-button" @click="handleBeforeClase()"><CloseBold /></el-icon>
            </template>
            <div class="member-title">
                <div>您当前为体验用户</div>
                <div>该功能仅对个人版用户开放</div>
            </div>
            <div class="member-scend-title">
                升级个人版可享：
            </div>
            <div class="member-context-item">
                <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
                <div>发布招募与认证为创作者接单</div>
            </div>
            <div class="member-context-item">
                <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
                <div>申请获得无限存储空间</div>
            </div>
            <div class="member-context-item">
                <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
                <div>素材工具低价折扣</div>
            </div>
            <div class="member-context-item" style="margin-bottom: 30px;">
                <!-- <el-icon class="success-icon"><CircleCheckFilled /></el-icon> -->
                <div>更有超多福利及功能等您体验...</div>
            </div>
            <div style="display:flex; align-items:center;">
                <el-button class="upgrade-button" type="primary" color="#3468FE" @click="handleUpgrade">升级为个人版</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { openOpenMember } from "../pay"
import { CloseBold , CircleCheckFilled } from '@element-plus/icons-vue'
const components = {
    CloseBold,
    CircleCheckFilled
}
const props = {
    removeNode: {
        type: Function,
        default: null
    },
    onSubmitSuccess: {
        type: Function,
        default: null
    }
}
const setup = (prop)=>{
    const visibled = ref(false);
    // 关闭之前的回调
    const handleBeforeClase = (deno)=>{
        if(deno &&　typeof deno == 'function'){
            deno();
        }else{
            visibled.value = false;
        }
    }
    // 关闭之后的回调
    const handleClosed = ()=>{
        prop.removeNode && prop.removeNode();
    }
    // 去升级
    const handleUpgrade = ()=>{
        openOpenMember({ onSubmitSuccess(){
            handleBeforeClase()
        }},1);
    }
    // 打开
    const open = ()=>{
        visibled.value = true;
    }
    return {
        open,
        visibled,
        handleClosed,
        handleUpgrade,
        handleBeforeClase
    }
}

export default defineComponent({
    setup,
    props,
    components
})
</script>
<style scoped lang="scss">
.MemberDialog-box{
    &:deep(.el-dialog){
        background: none;
        &.dialog-center{
            overflow:visible;
        }
        .el-dialog__header{
            margin: 0;
            padding: 0;
            height: 96px;
            background-image: url(@/assets/images/member-header.png);
            background-repeat: no-repeat;
            background-position: center;
            background-size: auto 100%;
            position: relative;
            .close-button{
                color: white;
                font-size: 40px;
                position: absolute;
                right: -40px;
                cursor: pointer;
            }
        }
        .el-dialog__body{
            padding: 40px;
            border-radius: 16px;
            background: white;
            .member-title{
                color: #3D3F50;
                font-size: 16px;
                text-align: center;
                font-weight: 500;
                margin-bottom: 26px;
            }
            .member-scend-title{
                font-size: 12px;
                color: #3D3F50;
                margin-bottom: 10px;
            }
            .member-context-item{
                font-size: 12px;
                color: #3D3F50;
                position: relative;
                padding-left: 16px;
                margin-bottom: 4px;
                .success-icon{
                    color: #54D057;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .upgrade-button{
                width: 260px;
                height: 46px;
                line-height: 46px;
                margin: 0 auto;
                border-radius: 8px;
            }
        }
    }

}
</style>