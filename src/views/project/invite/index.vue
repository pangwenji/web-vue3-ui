<template>
    <div>
        
        <el-container class="share-container">
            <el-header class="share-header">
                <div class="share-header-left">
                    <el-image :src="logo" style="height: 50px; width:50px;" :draggable="false" >
                        <template #error>
                            <el-icon :size="50"><User /></el-icon>
                        </template>
                    </el-image>
                </div>
                <div class="share-header-right">
                    <div class="avatar-container">
                        <div class="avatar-wrapper">
                            <img :src="getters.avatar" :draggable="false" class="user-avatar" />
                            <!-- <span>{{getters.name}}</span> -->
                            <!-- <el-icon><caret-bottom /></el-icon> -->
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main v-loading="initializeLoading" element-loading-background="rgba(0, 0, 0, 0)">
                <template v-if="!initializeLoading">
                    <div class="share-verification" >
                        <el-image :src="inviteUser.avatar || ''" :draggable="false">
                            <template #error>
                                <el-icon :size="70"><User /></el-icon>
                            </template>
                        </el-image>
                        <div class="title">{{inviteUser.nickName}}</div>
                        <div class="desc" v-if="isMember !== 1">邀请您加入</div>
                        <div class="title" v-if="isMember !== 1">{{projectData.name}}</div>
                        <div class="title" v-else>您已是项目成员</div>
                        <el-button type="primary" @click="handleClick" v-if="isMember !== 1" :loading="loadingState" class="confirm" round>加入团队</el-button>
                        <el-button type="primary" @click="handleTo" v-else :loading="loadingState" class="confirm" round>进入项目</el-button>
                        <div class="desc" v-if="projectData.timeLeft > 0">该分享将在{{projectData.timeLeft}}天后无效</div>
                        <div class="desc" v-else-if="projectData.timeLeft < 0">该链接已过期</div>
                        <div class="desc" v-else>该分享永久有效</div>
                    </div>
                </template>
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
import logo from '@/assets/logo/logo.png';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessageBox , ElMessage} from 'element-plus';
import { onMounted } from 'vue-demi';
import { getToken } from '@/utils/auth'
import { getProjectInfoByInviteToken, joinProjectByToken} from '@/api/project/menber.js';
let token = null;
const route = useRoute();
const store = useStore();
const router = useRouter();
const isMember = ref(0);
const inviteUser = ref({});
const projectData = ref({});
const loadingState = ref(false);
const initializeLoading = ref(false);
const getters = computed(() => store.getters);

const getData = ()=>{
    initializeLoading.value = true;
    token = route.query.token;
    getProjectInfoByInviteToken({token}).then(res=>{
        inviteUser.value = res.data.inviteUser;
        projectData.value = res.data.project;
        isMember.value = res.data.isMember;
        initializeLoading.value = false;
    }).catch(err=>{
        initializeLoading.value = false;
    })
}

onMounted(()=>{
    getData()
})

// 加入团队
const handleClick = ()=>{
    loadingState.value = true;
    joinProjectByToken({token}).then(res=>{
        loadingState.value = false;
        router.replace({
            path: `/project/index/${projectData.value.id}/file`,
        })
    }).catch(err=>{
        loadingState.value = false;
    })
}

// 直接进入项目
const handleTo = ()=>{
    router.replace({
        path:`/project/index/${projectData.value.id}/file`,
    })
}



</script>
<style scoped lang="scss">
.share-container{
    width: 100%;
    height: 100vh;
    background: #0A0B0D;
    .share-header{
        background: #1E1F26;
        .share-header-left{
            height: 100%;
            float: left;
            display: flex;
            align-items: center;
        }
        .share-header-right{
            height: 100%;
            float: right;
            display: flex;
            align-items: center;
            .avatar-wrapper{
                display: flex;
                align-items: center;
                cursor: pointer;
                .user-avatar{
                    width: 42px;
                    height: 42px;
                    border-radius: 50px;
                    overflow: hidden;
                    // margin-right: 10px;
                }
            }

        }
    }

    .share-verification{
        width: 30%;
        margin: 20px auto 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .el-image{
            width: 70px;
            height: 70px;
            border-radius: 70px;
            color: #ffffff68;
            background: #ffffff16;
            // opacity: .5;
        }
        .confirm{
            margin-bottom: 20px;
            background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%);
            border: none;
            padding: 20px 36px;
        }
        .title{
            width: 100%;
            color: white;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            margin: 20px 0;
        }
        .desc{
            font-size: 14px;
            color: white;
            opacity: .5;
            user-select: none;
        }
    }
}
</style>