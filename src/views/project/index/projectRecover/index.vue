<template>
    <HeaderAction @onDeleteAll="handleClearList" ref="HeaderActionRef" @onSort="handleSortData" :disabled="(folderList.length == 0 && fileList.length == 0) || !authRule('delete')" :length="fileLength" :size="sizeTotal"></HeaderAction>
    <div class="project-recover-container">
        <el-scrollbar height="100%" wrap-class="project-recover-scrollbar-container" v-loading="loadingStatus"  element-loading-background="rgba(0, 0, 0, 0)">
            <template v-if="!loadingStatus && (fileList.length > 0 || folderList.length > 0)">
                <div class="file-table-title" v-if="folderList.length > 0">
                    <span @click="folderOpen = !folderOpen">
                        文件夹 
                        <el-icon v-if="folderOpen"><CaretBottom /></el-icon>
                        <el-icon v-else><CaretRight /></el-icon>
                    </span>
                </div>
                <div :span="24" class="file-table-header" v-if="folderOpen && folderList.length > 0">
                    <div class="file-table-th" style="width: 53%">文件夹名</div>
                    <div class="file-table-th" style="width: 12%">文件大小</div>
                    <div class="file-table-th" style="width: 12%">删除者</div>
                    <div class="file-table-th" style="width: 18%">删除日期</div>
                    <div class="file-table-th" style="width: 5%">操作</div>
                </div>
                <div v-show="folderOpen">
                    <template v-for="(item,index) in folderList" :key="index">
                        <FileItem @onRefresh="handleDelete" @onDelete="handleDelete" :fileData="item" type="folder"></FileItem>
                    </template>
                </div>
                <div class="file-table-title" v-if="fileList.length > 0">
                    <span @click="fileOpen = !fileOpen">
                        文件
                        <el-icon v-if="fileOpen"><CaretBottom /></el-icon>
                        <el-icon v-else><CaretRight /></el-icon>
                    </span>
                </div>
                <div class="file-table-header"  v-if="fileOpen && fileList.length > 0">
                    <div class="file-table-th" style="width: 53%">文件名</div>
                    <div class="file-table-th" style="width: 12%">文件大小</div>
                    <div class="file-table-th" style="width: 12%">删除者</div>
                    <div class="file-table-th" style="width: 18%">删除日期</div>
                    <div class="file-table-th" style="width: 5%">操作</div>
                </div>
                <div v-show="fileOpen">
                    <template v-for="(item,index) in fileList" :key="index">
                        <FileItem @onRefresh="handleDelete" @onDelete="handleDelete" :fileData="item" :type="item.fileCat"></FileItem>
                    </template>
                </div>
            </template>
            <template v-else-if="!loadingStatus&&fileList.length == 0&&folderList.length == 0">
                <Empty style="height: 100%;">
                    <template #description>
                        <div  style="font-size: 14px;">回收站空空如也</div>
                    </template>
                </Empty>
            </template>
        </el-scrollbar>
    </div>
</template>
<script setup>
import HeaderAction from './HeaderAction';
import FileItem from './FileItem';
import { formatSize } from "@/utils/tool.js"
import {getRecycleFileList,getRecycleDirectoryList } from "@/api/project/files.js"
import { computed,onMounted,ref } from 'vue';
import { useStore } from 'vuex'; 
import { useRoute } from 'vue-router';
const route = useRoute();
const store = useStore();
const fileList = ref([]);
const folderList = ref([]);
const fileOpen = ref(true);
const folderOpen = ref(true);
const loadingStatus = ref(false);
const projectData = computed(()=>{
    return store.state.project.projectData;
})
const HeaderActionRef = ref();
const getData = ()=>{
    const project_id = route.params.id;
    loadingStatus.value = true;
    Promise.all([getRecycleFileList({project_id}),getRecycleDirectoryList({project_id})]).then(res=>{
        loadingStatus.value = false;
        fileList.value = res[0].data;
        folderList.value = res[1].data;
        HeaderActionRef.value.handleSortData()
    }).catch(err=>{
        loadingStatus.value = false;
    });
}
onMounted(()=>{
    getData();  
})

const authRule = (e) => {
    if(!projectData.value.permissions){
        return false;
    }
    if (projectData.value.currRoleId == 1) { // 所有者
        return true;
    } else if (projectData.value.currRoleId == 2) { // 管理员
        return projectData.value.permissions.adminPermissions.indexOf(e) > -1;
    } else { // 成员
        return projectData.value.permissions.memberPermissions.indexOf(e) > -1;
    }
}
// 排序
const handleSortData = ({ isAsc = 1 , sortKey = 'name' })=>{
    
    const _sort = (a,b)=>{
        if(sortKey == 'name'){
            if(isAsc == 1){
                return a[sortKey].localeCompare(b[sortKey])
            }else{
                return b[sortKey].localeCompare(a[sortKey])
            }
        }else{
            if(a[sortKey] > b[sortKey]){
                return  isAsc == 1? 1:-1;
            }else if(a[sortKey] < b[sortKey]){
                return  isAsc == 1? -1:1;
            }else{
                return 0;
            }
        }
    }
    fileList.value.sort(_sort);
    folderList.value.sort(_sort);
}

const sizeTotal = computed(()=>{
    const fileSize = fileList.value.reduce((total,item)=>{
        return total + item.size
    },0)
    const folderSize = folderList.value.reduce((total,item)=>{
        return total + item.size
    },0)

    return formatSize(folderSize + fileSize);
})
const fileLength = computed(()=>{
    return fileList.value.length + folderList.value.length
})

const handleClearList = ()=>{
    folderList.value = [];
    fileList.value = [];
}
const handleDelete = ({id,type})=>{
    if(type == 'folder'){
        folderList.value = folderList.value.filter((item)=>{
            return item.id != id
        })
    }else{
        fileList.value = fileList.value.filter((item)=>{
            return item.id != id
        })
    }
}


</script>
<style scope lang="scss">
.project-recover-container{
//    background: #0A0B0D;
   overflow: hidden;
   
   color: #909399;
   flex-grow: 1;
   .project-recover-scrollbar-container{
       padding: 20px;
   }
   
}
.file-table-title{
    margin-bottom: 20px;
    font-size: 14px;
    &>span{
        cursor: pointer;
        display: flex;
        align-items: center;
    }
}
.file-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #909399;
    margin-bottom: 5px;

    .file-table-th {
        flex-shrink: 0;
    }
}


</style>
