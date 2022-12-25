<template>
    <div class="header-content">
        <div class="header-content-left">
            <span :class="{ active: tabName == 'file' }" @click="handleChangMain('file')">项目</span>
            <span :class="{ active: tabName == 'share' }" @click="handleChangMain('share')">分享</span>
            <span :class="{ active: tabName == 'collection' }" @click="handleChangMain('collection')">收集</span>
            <span :class="{ active: tabName == 'recover' }" @click="handleChangMain('recover')">回收站</span>
        </div>
        <div class="header-content-right">
            <avatar-list :avatar-list="menberData" @click="handleMenberDialog"></avatar-list>
            <span title="邀请成员" class="share-btn" :class="{ disabled: !authRule('invite') }" @click.stop="handleShare">
                <!-- <el-image :src="userAdd" /> -->
                <svg-icon iconClass="icon_invite" :size="32"></svg-icon>
            </span>
            <span class="line"></span>
            <span class="open-info" :class="{disabled: tabName !== 'file' }" @click="toggleSideBar">
                <svg-icon iconClass="icon_info2" :size="32"></svg-icon>
            </span>
        </div>
    </div>
    <InvitationShareDialog ref="InvitationShareDialogRef" :projectId="projectId" :projectName="projectData.name"></InvitationShareDialog>
    <ProjectMenberDialog :projectId="projectId" @invitation="handleShare" ref="ProjectMenberDialogRef"></ProjectMenberDialog>
</template>
<script setup>
import AvatarList from "@/components/AvatarList";
import ProjectMenberDialog from './components/ProjectMenberDialog'
import InvitationShareDialog from "./components/InvitationShareDialog"
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, nextTick, watch, watchEffect } from "vue"
import { getProjectMemberList } from '@/api/project/menber'
import userAdd from '@/assets/images/project-user-add.png'
import packUp from '@/assets/images/project-pack-up.png'
import expand from '@/assets/images/project-expand.png'

const route = useRoute();
const router = useRouter();
const ProjectMenberDialogRef = ref(null);
const store = useStore();
const tabName = computed(() => {
    const paths =  route.path?.split('/');
    return paths.at(-1) || '';
});
const projectData = computed(() => {
    return store.state.project.projectData ;
})
const openInfo = computed(() => {
    return store.state.project.openInfo;
})
const InvitationShareDialogRef = ref(null);
const projectId = ref(null);
const menberData = ref([]);
watchEffect(()=>{
    const data = {
        type: 0,
        data: null,
    }
    if(tabName.value == 'file'){
        data.type = 1;
        data.data = projectData.value;
    }
    store.commit('project/SET_RIGHT_DATA',data);
})
// 点击邀请
const handleShare = () => {
    if(!authRule('invite')){
        return
    }
    if (projectId.value) {
        InvitationShareDialogRef.value.open(projectData.value);
    }
}
// 点击头部tab栏
const handleChangMain = (name) => {
    const projectId = route.params.id;
    router.push(`/project/index/${projectId}/${name}`);
}


// 设置右边栏打开状态
const toggleSideBar = () => {
    if(tabName.value !== 'file'){ return }
    store.commit('project/SET_OPEN_INFO', !openInfo.value);
}
// 获取头像列表
const getData = async () => {
    const id = route.params.id;
    const result = await getProjectMemberList({ id });
    menberData.value = result.data.map(item => item.user)
    projectId.value = id;
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
// 打开成员管理
const handleMenberDialog = () => {
    nextTick(() => {
        if (projectId.value) {
            ProjectMenberDialogRef.value.open(projectData.value);
        }
    })
}

getData();

</script>
<style scoped lang="scss">
.header-content {
    width: 100%;
    height: 60px;
    // position: absolute;
    // top: 0;
    // left: 0;
    background: #292A30 ;
    flex-shrink: 0;
    padding: 0 15px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #353535;

    &-left {
        height: 100%;
        display: flex;
        align-items: center;
        color: rgba($color: #ffffff, $alpha: 0.3);
        justify-content: center;
        font-size: 16px;
        .active {
            // cursor: none;
            color: white;
            &::after {
                content: "";
                width: 27px;
                height: 3px;
                background: linear-gradient(42deg, #0459ff 0%, #5726dd 100%);
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 10px;
                display: inline-block;
            }
        }

        // color: ;
        .line {
            width: 1px;
            height: 16px;
            flex-shrink: 0;
            background: #eeeeee;
            margin: 0 15px;
            cursor: none;
        }

        span {
            display: inline-block;
            height: 100%;
            line-height: 60px;
            cursor: pointer;
            position: relative;
            margin-right: 20px;
            &:hover {
                color: white;
            }
        }
    }

    &-right {
        display: flex;
        align-items: center;

        .share-btn {
            width: 32px;
            height: 32px;
            margin: 0 9px 0 5px;
            flex-shrink: 0;
            cursor: pointer;
        }

        .line{
            display: inline-block;
            width: 1px;
            height: 16px;
            background-color: #54565D;
        }

        .open-info {
            margin-left: 12px;
            font-size: 25px;
            height: 30px;
            display: flex;
            cursor: pointer;
            color: white;
            flex-direction: column;
            justify-content: center;
            &.disabled{
                opacity: .5;
                cursor: no-drop;
            }
        }
    }
}
.expand-enter-from {
    opacity: 0;
}
.expand-enter-active {
    transition: all 0.6s;
}
.expand-enter-to {
    opcaity: 1;
}
</style>
