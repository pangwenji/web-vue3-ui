<template>
    <el-scrollbar style="height: 100%" view-class="admin_attestation-content" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <div class="container">
            <div class="title">Hi，探索者</div>
            <div class="desc">
                <pre>
在影音同画世界，您可以通过报名招募或受邀合作，完成创作后"赚取同钱",
在使用报名招募功能时需要您先完成工种认证。
                </pre>
            </div>
            <div class="card-box">
                <div class="card-title">
                    <span v-if="verified === 1">您已完成实名认证</span>
                    <span v-else>实名认证</span>
                </div>
                <div class="card-content">
                    <div>
                        <span v-if="verified === 1">实名认证已完成，影音同画将为您保驾护航</span>
                        <span v-else>为了更好地维护社群秩序，及方便个人交易提现，我们需要您做一下实名认证，还差一步，加油！</span>
                    </div>
                    <div class="action-btn">
                        <el-button round type="primary" :disabled="true" v-if="verified === 1" style="width: 150px; border-color:transparent; background:rgba(37,39,51,0.66); color: #666A7A;" plain>
                            <svg-icon iconClass="icon_auth-check" style="margin-right: 4px;" :size="30"></svg-icon>
                            <span>已实名</span>
                        </el-button>
                        <el-button round type="primary" v-else color="#3468FE" @click="proxy.$Authentication.openAuth()"  style="width: 150px; border-color: transparent;">
                            <svg-icon iconClass="icon_auth-uncheck" style="margin-right: 4px;" :size="30"></svg-icon>
                            <span>实名认证</span>
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="card-box" v-if="!loadingState">
                <div class="card-title">
                    <span v-if="workNum > 0">您已完成工种认证</span>
                    <span v-else-if="applyData&&applyStatus == 0">您已申请工种认证</span>
                    <span v-else-if="applyData&&applyStatus == 2">审核未通过</span>
                    <span v-else>工种认证</span>
                </div>
                <div class="card-content">
                    <div v-if="workNum > 0">
                        <span>您已完成工种认证，请前往完善接单信息，开始您的创作之旅吧~</span>
                    </div>
                    <div v-else-if="applyData&&applyStatus == 0">
                        <span>认证申请已提交，预计3个工作日内完成审核，审核结果将通过站内信息和微信客服通知您</span>
                    </div>
                    <div v-else-if="applyData&&applyStatus == 2">
                        <!-- <span>抱歉，您填写的资料信息审核不通过，请重新修改</span> -->
                        <div style="color: red">{{applyData.msg}}</div>
                    </div>
                    <div v-else>
                        <span>工种认证需要您填写相关认证资料；认证成功后，</span>
                        <div>即可解锁在线接单、获得工种标识及免费扩容等诸多权限福利</div>
                    </div>
                    <div class="action-btn">
                        <el-button round type="primary" v-if="workNum > 0" @click="handleApply" color="#3468FE" style="width: 150px; border-color:transparent;">
                            <svg-icon iconClass="icon_apply-uncheck" style="margin-right: 4px;" :size="30"></svg-icon>
                            <span>工种管理</span>
                        </el-button>
                        <el-button round type="primary" v-else-if="applyData&&applyStatus == 0" style="width: 150px; border-color: transparent; background:rgba(248, 130, 18, .1); color: #F88212;" plain @click="handleApply">
                            <svg-icon iconClass="icon_apply-verify" style="margin-right: 4px;" :size="30"></svg-icon>
                            <span>审核中</span>
                        </el-button>
                        <el-button round type="primary" v-else-if="applyData&&applyStatus == 2" color="#3468FE" style="width: 150px; border-color: transparent;" @click="handleApply">
                            <svg-icon iconClass="icon_apply-edit" style="margin-right: 4px;" :size="30"></svg-icon>
                            <span>修改</span>
                        </el-button>
                        <el-button round type="primary" v-else color="#3468FE"  style="width: 150px; border-color: transparent; " @click="handleApply">
                            <svg-icon iconClass="icon_apply-uncheck" style="margin-right: 4px;" :size="30"></svg-icon>
                            <span>开始申请</span>
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>
<script setup>
import { ElMessage } from 'element-plus';
import { computed, getCurrentInstance, onUnmounted, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex'
import { IM_EVENT_LISTERNER } from '@/utils/IM2.js'
const handleWatchStatusChange = ({noticeType})=>{
    if(noticeType == 3){
        getData();
    }
}
IM_EVENT_LISTERNER.addEventListenerIM('WORKER',handleWatchStatusChange);
onUnmounted(()=>{
    IM_EVENT_LISTERNER.removeEventListenerIM('WORKER',handleWatchStatusChange);
})

const store = useStore();
const route = useRoute();
const router = useRouter();
const workNum = computed(()=> store.state.user.workNum);
const applyStatus = computed(()=>  store.state.workspace.applyStatus)
const verified = computed(()=> store.state.user.verified);
const applyData = ref(null);
const { proxy } = getCurrentInstance();
const handleApply = ()=>{
    if(verified.value == 1){
        if(!applyData.value){
            router.push({path:'/workspace/admin/apply'});
        }else if(applyStatus.value == 2){
            router.push({path:'/workspace/admin/apply', query:{id:applyData.value.id}});
        }else if(applyStatus.value == 1){
            router.push({path:'/workspace/admin/skill'});
        }else{
            ElMessage.warning('您的申请正在审核中,请耐心等待.')
        }
    }else{
        // router.push({path:'/workspace/admin/apply'});
        ElMessage.error('请先进行实名认证')
    }
}
const loadingState = ref(false);
const getData = ()=>{
    if(!verified.value){ return }
    loadingState.value = true;
    store.dispatch('workspace/getUserAuthInfo').then(res=>{
        applyData.value = res.data;
        loadingState.value = false;
    }).catch(err=>{
        loadingState.value = false;
    })
}
getData();
</script>

<style scoped lang="scss">
:deep(.admin_attestation-content){
     width: 100%;
     min-height: 100%;
     overflow: hidden;
     background: linear-gradient();
     background-image: url(@/assets/images/work-admin-attestation.png);
     background-repeat: no-repeat;
     background-size: 900px auto;
     background-position: center  -80px;
     .container{
         max-width: 620px;
         margin: 400px auto 0;
         .title{
             font-size: 24px;
             font-weight: 500;
             color: white;
         }
         .desc{
             font-size:14px;
             color: white;
             line-height: 20px;
         }
         .card-box{
            background: rgba(37,39,51,0.66);
            border-radius: 17px;
            padding: 20px;
            margin-bottom: 20px;
            .card-title{
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 20px;
            }
            .card-content{
                padding-right: 200px;
                font-weight: 400;
                height: 40px;
                color: #8D91A3;
                line-height: 20px;
                font-size: 14px;
                position: relative;
                .action-btn{
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translateY(-50%);
                }
            }
         }
     }
}
</style>