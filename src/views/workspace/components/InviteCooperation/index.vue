<template>
    <el-dialog v-model="visibled" :show-close="false" width="560px" :before-close="onBeforeClose" :close-on-press-escape="false" :close-on-click-modal="false"
        custom-class="dialog-center">
        <template #title>
            <div class="InviteCooperation-dialog-header"> 
                <span>发起邀请</span>
                <!-- <span class="desc">为更好加快双方合作，请填写需求。</span> -->
            </div>
        </template>
        <div class="InviteCooperation-demand-box" >
            <div class="label">
                <el-radio :label="0" v-model="radioValue" size="large">需求备注<span class="desc">（填写需求后，等待创作者确认，即可双方发起聊天）</span></el-radio>
            </div>
            <!-- <el-dropdown @command="handleCommand">
                <el-button type="text" link color="#3468FE">
                    常用语<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                    <el-dropdown-item v-for="(item,index) in commonWords" :key="index" :command="item">{{item}}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown> -->
        </div>
        <div class="InviteCooperation-demand-input">
            <el-input type="textarea" show-word-limit v-model="formData.leaveMessage" :maxlength="200" placeholder="请填写您的需求" resize="none" :rows="6"></el-input>
        </div>
        <div class="InviteCooperation-recruit-box">
            <div class="label">
                <el-radio :label="1" v-model="radioValue" size="large">现有招募</el-radio>
            </div>
            <el-select placeholder="请选择希望邀请ta参与的招募" v-model="formData.recruitId">
                <template v-for="(item,index) in recruitData" :key="index">
                    <el-option :value="item.id" :label="item.title">{{item.title}}</el-option>
                </template>
            </el-select>
            <el-button type="primary" color="#D6E1FF" style="color: #3468FE;" @click="handleRelease">发布新招募</el-button>
        </div>
        <template #footer>
            <span>
                <el-button type="default" @click="onBeforeClose" size="large" style="width: 150px;border-radius: 10px; ">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="loadingSubmit" size="large" style="width: 150px;border-radius: 10px;" color="#3468FE">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import {  defineComponent, reactive, ref } from 'vue'
import { getRecruitReleaseData } from '@/api/personnel/personnelManage'
import { recruitInvite } from '@/api/personnel/recruitmentWall'
import { ElMessage } from 'element-plus';
const setup = () => {
    const store = useStore();
    const router = useRouter();
    const radioValue = ref(0);
    const recruitData = ref([])
    const formData = reactive({
        recruitId: null,
        leaveMessage: '',
        userAuthenticateId: null,
    })
    const commonWords = [
        "你好,",
        "你好,",
        "你好,",
        "你好,",
        "你好,",
        "你好,"
    ]
    const loadingSubmit = ref(false);    
    const visibled = ref(false);
    // 弹窗关闭之前的回调
    const onBeforeClose = (deno) => {
        if(loadingSubmit.value){ return }
        formData.recruitId = null;
        formData.leaveMessage = null;
        formData.userAuthenticateId = null;
        if (typeof deno == 'function') {
            deno()
        } else {
            visibled.value = false;
        }
    }
    // 设置常用语
    const handleCommand = (e)=>{
        formData.leaveMessage = e;
    }
    // 去发布
    const  handleRelease = ()=>{
        onBeforeClose();
        router.push({path:'/workspace/admin/release'});
    }
    // 提交
    const handleSubmit = ()=>{
        if(radioValue.value === 0){
            if(!formData.leaveMessage){
                ElMessage.error('请填写需求备注')
                return
            }
        }else{
            if(!formData.recruitId){
                ElMessage.error('请选择招募或发布新的招募')
                return
            }
        }
        loadingSubmit.value = true;
        recruitInvite(formData).then(res=>{
            loadingSubmit.value = false;
            ElMessage.success('已发送邀请,请耐心等待回复');
            onBeforeClose();
        }).catch(err=>{
            loadingSubmit.value = false;
        })
    }
    // 打开
    const open = (e) => {
        getRecruitReleaseData({},true).then(res=>{
            visibled.value = true;
            formData.userAuthenticateId = e.id;
            // 滤掉不能报名的
            recruitData.value = res.data.filter(item => item.ifSignup && item.status == 1);
        })
    }
    return {
        open,
        formData,
        visibled,
        radioValue,
        commonWords,
        recruitData,
        handleSubmit,
        handleCommand,
        handleRelease,
        onBeforeClose,
        loadingSubmit,
    }
}
export default defineComponent({
    setup,
})
</script>
<style lang="scss" scoped>
    .InviteCooperation-dialog-header{
        color: #1C1D24;
        .desc{
            font-size: 12px;
            color: #6D6D6D;
            margin-left: 10px;
            font-weight: initial;
        }
    }
    .InviteCooperation-demand-box{
        display: flex;
        justify-content: space-between;
        // margin-bottom: 10px;
        .label{
            font-size: 14px;
            display: flex;
            align-items: center;
            .desc{
                font-size: 12px;
                color: #6D6D6D;
                margin-left: 10px;
                font-weight: initial;
            }
        }
    }
    .InviteCooperation-demand-input{
        margin-bottom: 20px;
        &:deep(.el-textarea){
            .el-textarea__inner{
                --el-input-bg-color: #EEEEEE;
                --el-input-border-color: #EEEEEE;
                --el-input-hover-border-color: #3A36DB;
            }
            .el-input__count{
                background: none;
            }
        }
    }
    .InviteCooperation-recruit-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:deep(.el-select){
            --el-select-border-color-hover: #3A36DB;
            flex: auto;
            margin: 0 20px;
        }
    }
</style>