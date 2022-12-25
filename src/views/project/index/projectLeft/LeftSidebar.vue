<template>
    <div class="left-sidebar-container" v-show="show">
        <el-scrollbar style="width:100%;">
            <div class="top-menu">
                <div class="sidebar-item">
                    <div class="title" @click="handleChangeHeight('MHeight')">
                        <!-- <el-icon :size="18"><folder /></el-icon> -->
                        <span style="margin-left:5px;">我的项目({{MyProject.length}})</span>
                    </div>
                    <span class="other" title="新建项目" @click.stop="handleCreateProject">
                        <el-icon :size="14" ><plus /></el-icon>
                    </span>
                </div>
                <div :style="{height: MHeight}" class="project-container">
                    <template v-for="(item,index) in MyProject" :key="index">
                        <menu-item 
                            name="MyProject" 
                            :title="item.name"
                            :projectId="item.id" 
                            :isDraggable="true"
                            :projectItem="item"
                            @click="handleClick(item)" 
                            @onDrop="handleDrop($event,index,item)"
                            @onDragStart="handleDropStart($event,index,item)"
                            :deleteProject="handleDeleteProject"
                            :invitationShare="handleInvitationShare"
                            :projectSetting="handleProjectSetting"
                            :menberDialog="handleMenberDialog"
                            :archiveProject="handleArchiveProject"
                            :recordProject="handleRecordProject"
                            :sign-color="item.colorTag" 
                        ></menu-item>
                    </template>
                </div>
                <div class="sidebar-item">
                    <div class="title" @click="handleChangeHeight('CHeight')">
                        <!-- <el-icon :size="18"><folder /></el-icon> -->
                        <span style="margin-left:5px;">参与项目({{InProject.length}})</span>
                    </div>
                </div>
                <div :style="{height: CHeight}" class="project-container">
                    <template v-for="(item,index) in InProject" :key="index">
                        <menu-item 
                            name="InProject" 
                            :title="item.name"
                            :projectId="item.id" 
                            :projectItem="item"
                            :isDraggable="true"
                            @click="handleClick(item)" 
                            @onDrop="handleDrop($event,index,item)"
                            @onDragStart="handleDropStart($event,index,item)"
                            :invitationShare="handleInvitationShare"
                            :menberDialog="handleMenberDialog"
                            :exitProject="handleExitProject"
                            :recordProject="handleRecordProject"
                            :sign-color="item.colorTag" 
                        ></menu-item>
                    </template>
                </div>
                <div class="sidebar-item">
                    <div class="title" @click="handleChangeHeight('SHeight')">
                        <!-- <el-icon :size="18"><folder /></el-icon> -->
                        <span style="margin-left:5px;">已完结的({{SeProject.length}})</span>
                    </div>
                </div>
                <div :style="{height: SHeight}" class="project-container">
                    <template v-for="(item,index) in SeProject" :key="index">
                        <menu-item 
                            name="SeProject" 
                            :title="item.name"
                            :projectId="item.id"
                            :projectItem="item"
                            :isDraggable="false"
                            @click="handleClick(item)" 
                            @onDrop="handleDrop($event,index,item)"
                            @onDragStart="handleDropStart($event,index,item)"
                            :exitProject="item.currRoleId > 1 ? handleExitProject: null"
                            :deleteProject="item.currRoleId == 1 ?handleDeleteProject : null"
                            :cancelProject="item.currRoleId == 1 ?handleCancelProject : null"
                            :recordProject="handleRecordProject"
                            :sign-color="item.colorTag" 
                        ></menu-item>
                    </template>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <ProjectSettingDialog 
        ref="ProjectSettingDialogRef"
        :projectId="projectId"
        :projectType="projectType"
        @completeCreate="handleCompleteCreate"
        @deleteProject="handleDeleteProject" 
        @transferProject="handleTransferProject" 
        @invitationCreate="handleInvitationShare"
    ></ProjectSettingDialog>
    <InvitationShareDialog 
        ref="InvitationShareDialogRef"
        :projectId="projectId"
        :projectName="projectName"
    ></InvitationShareDialog>
    <ProjectTransferDialog
        :projectId="projectId"
        ref="ProjectTransferDialogRef"
    ></ProjectTransferDialog>
    <ProjectMenberDialog
        :projectId="projectId"
        @invitation="handleInvitationShare"
        ref="ProjectMenberDialogRef"
    ></ProjectMenberDialog>
    <ProjectRecordDialog
        :projectId="projectId"
        ref="ProjectRecordDialogRef"
    ></ProjectRecordDialog>
</template>
<script setup>
import MenuItem from './MenuItem.vue';
import ProjectRecordDialog from '../components/ProjectRecordDialog'
import ProjectMenberDialog from '../components/ProjectMenberDialog'
import ProjectSettingDialog from '../components/ProjectSettingDialog'
import ProjectTransferDialog from '../components/ProjectTransferDialog'
import InvitationShareDialog from '../components/InvitationShareDialog'

import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox , ElMessage} from 'element-plus'
import {ref, computed, nextTick, reactive, defineExpose, onMounted } from 'vue';
const route = useRoute();
const store = useStore();
const router = useRouter();
const props = defineProps(['show']);
const emit = defineEmits(['click','deleteProject']);
const ProjectRecordDialogRef = ref(null);
const ProjectMenberDialogRef = ref(null);
const ProjectSettingDialogRef = ref(null);
const InvitationShareDialogRef = ref(null);
const ProjectTransferDialogRef = ref(null);
const projectId = ref(null);
const projectName = ref(null);
const projectType = ref(null);
// 获取我的项目列表
const MyProject = computed(()=>{
    return store.state.project.MyProjects;
});
// 获取参与项目列表
const InProject = computed(()=>{
    return store.state.project.InProjects;
});
// 获取归档列表
const SeProject = computed(()=>{
    return store.state.project.SeProjects;
});

const heightObj = reactive({
    MHeight:'auto',
    CHeight:'auto',
    SHeight:'0',
})


const heightItem = 42;

const MHeight = computed(()=>{
    const list = MyProject.value;
    if(heightObj.MHeight == 'auto'){
        return String((list.length * heightItem)+2) + 'px';
    }else{
        return '0'
    }
})
const CHeight = computed(()=>{
    const list = InProject.value;
    if(heightObj.CHeight == 'auto'){
        return String((list.length * heightItem)+2) + 'px';
    }else{
        return '0'
    }
})
const SHeight = computed(()=>{
    const list = SeProject.value;
    if(heightObj.SHeight == 'auto'){
        return String((list.length * heightItem)+2) + 'px';
    }else{
        return '0'
    }
})

let loadingRequest = false

const handleChangeHeight = async (type)=>{
    heightObj[type] = heightObj[type] == '0'? 'auto' : '0';
}

const handleCompleteCreate = (data)=>{
    handleClick(data)
    // const list = [].concat(MyProject.value,InProject.value,SeProject.value)
    // if(list.length > 1){
    //     return
    // }else if(list.length == 1){
    //     handleClick(list[0])
    // }
}

// 点击
const handleClick = (e)=>{
  emit('click',e);
}

let current = -1; //当前拖拽的下标
// 开始拖拽
const handleDropStart = (e,index,item)=>{
    current = index;
    // e.dataTransfer.setData('text/plain', JSON.stringify(item));
}
// 拖拽放下
const handleDrop = (e,index)=>{
    const {module,position} = e;
    store.dispatch('project/handleSortProject',{module,current,index,position})
}

// 删除我的项目
const handleDeleteProject = ({id,type='MyProject'})=>{
  store.dispatch('project/handleDeleteProject',{id}).then(()=>{
      if(ProjectSettingDialogRef.value.settingDialog){
          ProjectSettingDialogRef.value.onBeforeClose()
      }
      emit('deleteProject', {id});
  })
}

// 创建我的项目
const handleCreateProject = ()=>{
    projectId.value = null;
    projectType.value = null;
    nextTick(()=>{
        ProjectSettingDialogRef.value.open();
    })
}

// 打开成员管理
const handleMenberDialog = (data)=>{
    projectId.value = data.id;
    nextTick(()=>{
        ProjectMenberDialogRef.value.open(data);
    })
}

// 打开成员邀请
const handleInvitationShare = (item)=>{
    handleClick(item)
    projectId.value = item.id;
    projectName.value = item.name;
    nextTick(()=>{
        InvitationShareDialogRef.value.open(item);
    })
}

// 打开项目设置
const handleProjectSetting = ({id,type})=>{
    projectId.value = id;
    projectType.value = type;
    nextTick(()=>{
        ProjectSettingDialogRef.value.open();
    })
}

// 退出参与项目
const handleExitProject = ({id,name})=>{
    const text = `确定退出"${name}"?`;
    const title = ''
    ElMessageBox.confirm(text, title,
        {
            customClass: 'messageBox-custom-warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose:false,
            center: true,
            beforeClose: (action, instance, done)=>{
                if(action === 'confirm'){
                instance.confirmButtonLoading = true
                store.dispatch('project/handleQuitProject',{id}).then(res=>{
                    done();
                    ElMessage.success('项目删除成功');
                }).catch(err=>{
                    done();
                });
                }else{
                    if(instance.confirmButtonLoading){
                        return
                    }
                    done()
                }
            }
        }
    ).then(()=>{}).catch(err=>{})
}

// 项目归档
const handleArchiveProject = ({id,type})=>{
    store.dispatch('project/handleArchiveMyProject',{id}).then(res=>{
        ElMessage.success('操作成功')
    });
}

// 取消完成项目
const handleCancelProject = ({id})=>{
    store.dispatch('project/handleCancelArchive',{id}).then(res=>{
        ElMessage.success('操作成功')
    });
}

// 打开项目操作日志
const handleRecordProject = (data)=>{
    projectId.value = data.id;
    nextTick(()=>{
        ProjectRecordDialogRef.value.open(data);
    })
}

// 项目转移
const handleTransferProject = ({id,type})=>{
    projectId.value = id;
    projectType.value = type;
    nextTick(()=>{
        ProjectSettingDialogRef.value.onBeforeClose();
        ProjectTransferDialogRef.value.open();
    })
}

defineExpose({
    heightObj,
    handleCreateProject
})



</script>

<style scoped lang="scss">
.left-sidebar-container{
    width: 200px;
    height: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    // border-right: 1px solid #EEEEEE;
    background: #292A30 ;
    font-size: 14px;
    user-select: none;
    justify-content: space-between;
    box-shadow: 3px 0px 6px 0px rgba(35, 35, 35, 0.38);
    position: relative;
    z-index: 2;
    .top-menu{
        // width: 100%;
        padding: 10px;
        .project-container{
            overflow: hidden;
            transition: all .4s;
        }
        .sidebar-item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            color: white;
            font-size: 16px;
            // font-weight: bold;
            .title{
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                user-select: none;
            }
            .other{
                display: inline-block;
                width: 22px;
                height: 22px;
                background:  white;
                color: black;
                border-radius: 30px;
                text-align:  center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &:hover{
                    background: white;
                }
            }
        }
    }
}
.point-box{
    flex-grow: 1;
    // margin-left: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .point-custom{
        margin-left: 10px;
    }
}
</style>