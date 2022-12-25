<template>
    <div class="project-info" :class="{ open: openInfo && RightDataType > 0 }">
        <div class="header"  v-if="RightDataType == 1">
            <div class="text">{{RightDataContent.name || '项目'}}</div>
            <span class="icon" @click.stop="handleOpenSetting" v-if="projectData.currRoleId == 1">
                <el-icon>
                    <Setting />
                </el-icon>
            </span>
        </div>
        <div class="header"  v-else-if="RightDataType == 2">
            <div class="text">{{RightDataContent.name || '文件'}}</div>
        </div>
        <el-scrollbar class="project-info-scrollbar">
            <!-- <div class="info-title-h2">项目信息</div> -->
            <template v-if="RightDataType == 1">
                <div v-if="breadcrumbs.length > 1" class="info-title-h3">文件夹信息</div>
                <div v-else class="info-title-h3">项目信息</div>
                <div v-if="breadcrumbs.length > 1" class="descriptions-item">
                    <div class="label">大小</div>
                    <div class="content">{{formatSize(fSize)}}</div>
                </div>
                <div v-else class="descriptions-item">
                    <div class="label">占用空间</div>
                    <div class="content">{{formatSize(RightDataContent.directory?.size)}}</div>
                </div>
                <div v-if="breadcrumbs.length > 1" class="descriptions-item">
                    <div class="label">数量</div>
                    <div class="content">{{fNumber || '--'}}</div>
                </div>
                <div v-else class="descriptions-item">
                    <div class="label">文件数量</div>
                    <div class="content">{{fNumber || '--'}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="label">创建者</div>
                    <div v-if="breadcrumbs.length > 1" class="content">{{folderInfo.user?.nickName || '--'}}</div>
                    <div v-else class="content">{{RightDataContent.user?.nickName || '--'}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="label">创建时间</div>
                    <div v-if="breadcrumbs.length > 1" class="content">{{folderInfo?.createTime || '--'}}</div>
                    <div v-else class="content">{{RightDataContent?.createTime || '--'}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="label">更新时间</div>
                    <div v-if="breadcrumbs.length > 1" class="content">{{folderInfo?.updateTime || '--'}}</div>
                    <div v-else class="content">{{RightDataContent?.updateTime || '--'}}</div>
                </div>
            </template>
            <template v-if="RightDataType == 2">
                <div class="info-title-h3">文件信息</div>
                <div class="descriptions-item" v-if="RightDataContent.type == 1">
                    <div class="label">数量</div>
                    <div class="content">{{RightDataContent.fileQuantity || '--'}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="label">大小</div>
                    <div class="content">{{formatSize(RightDataContent.size)}}</div>
                </div>
                <div class="descriptions-item" >
                    <div class="label">类型</div>
                    <div class="content" v-if="RightDataContent.type == 2">{{RightDataContent.fileCat}}</div>
                    <div class="content" v-else>文件夹</div>
                </div>
                <div class="descriptions-item">
                    <div class="label">创建者</div>
                    <div class="content">{{RightDataContent.user.nickName || '--'}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="label">创建时间</div>
                    <div class="content">{{RightDataContent.createTime || '--'}}</div>
                </div>
                <div class="descriptions-item">
                    <div class="label">更新时间</div>
                    <div class="content">{{RightDataContent.updateTime || '--'}}</div>
                </div>
            </template>

            <!-- <div class="descriptions-item">
                <div class="label">截止时间</div>
                <div class="content">--</div>
            </div> -->
        </el-scrollbar>
    </div>
    <ProjectSettingDialog 
        ref="ProjectSettingDialogRef"
        :projectId="projectData.id"
        projectType="MyProject"
        @deleteProject="handleDeleteProject" 
        @transferProject="handleTransferProject" 
    ></ProjectSettingDialog>
    <ProjectTransferDialog
        :projectId="projectData.id"
        ref="ProjectTransferDialogRef"
    ></ProjectTransferDialog>
</template>
<script>
import ProjectSettingDialog from "./components/ProjectSettingDialog"
import ProjectTransferDialog from './components/ProjectTransferDialog'
import { computed, defineComponent , ref} from 'vue';
import { useStore } from 'vuex';
import { formatSize } from '@/utils/tool.js'
const components = {
    ProjectSettingDialog,
    ProjectTransferDialog
}
const setup = ()=>{
    const store = useStore();
    const ProjectSettingDialogRef = ref(null);
    const ProjectTransferDialogRef = ref(null);
    const openInfo = computed(()=>{
        return store.state.project.openInfo;
    })
    const projectData = computed(()=>{
        return store.state.project.projectData;
    })
    const RightDataType = computed(()=>{
        return store.state.project.RightData.type;
    })
    const RightDataContent = computed(()=>{
        return store.state.project.RightData.data;
    })
    const breadcrumbs = computed(() => {
        return store.state.project.breadcrumbs || [];
    })
    const folderInfo = computed(()=>{
        return store.state.project.folderInfo;
    })
    const fileList = computed(()=>{
        return store.state.project.fileList;
    })
    const folderList = computed(()=>{
        return store.state.project.folderList;
    })
    const fNumber = computed(()=>{
        return fileList.value.length + folderList.value.length;
    })
    const fSize = computed(()=>{
        let size = 0
        fileList.value.forEach(el => {
            size += el.size
        });
        folderList.value.forEach(el => {
            size += el.size
        });
        return size;
    })

    const handleOpenSetting = ()=>{
        if(projectData.value.id&&projectData.value.currRoleId == 1){
            ProjectSettingDialogRef.value.open();
        }
    }
        // 删除我的项目
    const handleDeleteProject = ({id})=>{
        store.dispatch('project/handleDeleteProject',{id}).then(()=>{
            if(ProjectSettingDialogRef.value.settingDialog){
                ProjectSettingDialogRef.value.onBeforeClose()
            }
        })
    }

    // 项目转移
    const handleTransferProject = ()=>{
        ProjectSettingDialogRef.value.onBeforeClose();
        ProjectTransferDialogRef.value.open();
    }

    const getData = ()=>{
        store.dispatch('project/getProjectDetails',{id:projectData.value.id})
    }


    return {
        getData,
        openInfo,
        RightDataType,
        RightDataContent,
        formatSize,
        projectData,
        handleOpenSetting,
        handleDeleteProject,
        handleTransferProject,
        ProjectSettingDialogRef,
        ProjectTransferDialogRef,
        breadcrumbs,
        folderInfo,
        fNumber,
        fSize,
    }
}
export default defineComponent({
    setup,
    components
})
</script>
<style scoped lang="scss">
.project-info {
    width: 0;
    height: 100%;
    background: #292A30;
    overflow: hidden;
    border-left: 1px solid  #353535;
    transition: all 0.3s;
    flex-shrink: 0;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    &.open {
        width: 240px;
    }

    .header {
        width: 240px;
        font-size: 14px;
        height: 60px;
        border-bottom: 1px solid #353535;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        flex-shrink: 0;
        .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex-grow: 1;
            color: white;
            font-weight: bold;
        }

        .icon {
            margin-left: 20px;
            flex-shrink: 0;
            color: #909399;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            font-size: 14px;
            &:hover {
                color: white;
            }
        }
    }

    .project-info-scrollbar {
        width: 240px;
        // height: 100%;
        flex-grow: 1;
        .info-title-h2{
            font-size: 14px;
            padding: 10px 10px 5px;
            color: white;
            font-weight: bold;
        }
        .info-title-h3{
            font-size: 14px;
            padding: 10px 10px 5px;
            color: white;
        }
        .descriptions-item {
            width: 100%;
            padding: 5px 10px;
            box-sizing: border-box;
            display: flex;
            color: white;
            justify-content: space-between;
            font-size: 14px;

            .label {
                flex-shrink: 0;
                width: 60px;
                margin-right: 12px;
                color: rgba($color: #ffffff, $alpha: .4);
            }

            .content {
                flex-grow: 1;
                text-align: right;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
