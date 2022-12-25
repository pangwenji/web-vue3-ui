<template>
    <!-- <HeaderAction></HeaderAction> -->
    <div class="project-collection-container">
        <el-scrollbar height="100%" wrap-class="collection-scrollbar-container" v-loading="loadingStatus"  element-loading-background="rgba(0, 0, 0, 0)">
            <template v-if="collectionList.length > 0 && !loadingStatus">
                <div class="table-header">
                    <div style="width: 32%;">
                        <span class="sort-icon " :class="sortData.name?'asc':'desc'" @click="handleSortData('name')">文件夹名称</span>
                    </div>
                    <div style="width: 10%;">发送者</div>
                    <div style="width: 10%;">文件夹大小</div>
                    <div style="width: 10%;">已收集数</div>
                    <div style="width: 10%;">链接开关</div>
                    <div style="width: 10%;">链接状态</div>
                    <div style="width: 10%;">链接</div>
                    <div style="width: 4%;">操作</div>
                </div>
                <template v-for="(item,index) in collectionList" :key="index">
                    <CollcetionItem 
                        :collcetion-item="item" 
                        @onDelete="handleDelete"
                        @onSetting="handleSetting"
                        @onViewFile="handleViewFile"
                        @onSendCollcetion="handleSendCollcetion($event,item)"
                    ></CollcetionItem>
                </template>
            </template>
            <template v-else-if="!loadingStatus">
                <Empty description="暂无收集文件夹" />
            </template>
        </el-scrollbar>
    </div>
    <VisitDialog></VisitDialog>
    <ProjectCollectionSend ref="ProjectCollectionSendRef"></ProjectCollectionSend>
    <CreateCollectionDialog @onSubmitSuccess="handleUploadCollection" v-model:visible="createCollectionVisible" ref="CreateCollectionDialogRef"></CreateCollectionDialog>
</template>
<script setup>
import VisitDialog from "./VisitDialog.vue"
import HeaderAction from "./HeaderAction.vue"
import CollcetionItem from "./CollcetionItem.vue"
import ProjectCollectionSend from "../components/ProjectCollectionSend"
import CreateCollectionDialog from "../components/CreateCollectionDialog"
import { getCollectList, deleteCollect, getDetails } from "@/api/project/files.js"
import { useStore } from "vuex"
import { computed, reactive } from "vue"
import { ElMessageBox , ElMessage} from "element-plus"
import { useRoute, useRouter } from "vue-router"
const route = useRoute();
const router = useRouter();
const store = useStore();
const sortData = reactive({
    name:1
})
const loadingStatus = ref(false);
const collectionList = ref([]);
const ProjectCollectionSendRef = ref();
const CreateCollectionDialogRef = ref();
const createCollectionVisible = ref(false);
const projectData = computed(()=>{
    return store.state.project.projectData;
})
const getData = ()=>{
    loadingStatus.value = true;
    const project_id = route.params.id;
    getCollectList({project_id}).then(res=>{
        loadingStatus.value = false;
        collectionList.value = res.data;
        handleSortData();
    }).catch(err=>{
        loadingStatus.value = false;
    })
}
onMounted(()=>{
    getData();
})
const handleSortData = (key)=>{
    sortData[key] = sortData[key] ? 0:1;
    collectionList.value.sort((a,b)=>{
        if(key == 'name'){
            if(sortData[key]){
                return a[key].localeCompare(b[key])
            }else{
                return b[key].localeCompare(a[key])
            }
        }else{
            if(a[key] > b[key]){
                return  sortData[key] ? 1:-1;
            }else if(a[key] < b[key]){
                return  sortData[key] ? -1:1;
            }else{
                return 0;
            }
        }
    })
}
// 删除
const handleDelete = ({id,name})=>{
    const text = `确定要删除收集文件夹“${name}”吗？记录删除后，收集文件夹将转变为常规文件夹，无法再次发起收集`;
    const title = `删除收集文件夹`
    ElMessageBox.confirm(text, title, {
        customClass: 'messageBox-custom-warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        showClose:true,
        center: true,
        beforeClose: (action, instance, done)=>{
            if(action === 'confirm'){
                instance.confirmButtonLoading = true
                deleteCollect({id}).then(res=>{
                    done();
                    collectionList.value = collectionList.value.filter(item=>item.id!=id);
                    ElMessage.success('删除成功');
                }).catch(err=>{
                    done();
                })
            }else{
                if(instance.confirmButtonLoading){ return }
                done()
            }
        }
    }).then(()=>{}).catch(err=>{})
}
// 打开设置
const handleSetting = (data)=>{
    CreateCollectionDialogRef.value.open(data)
}
// 查看文件
const handleViewFile = ({id})=>{
    store.dispatch("project/handleGetDetails",{id}).then(res=>{
        router.push(`/project/index/${res.data.projectId}/file?parent=${id}`)
    })
}
// 发起收集
const handleSendCollcetion = (type,{id,token})=>{
    ProjectCollectionSendRef.value.open({type,id,token})
}
// 更新收集
const handleUploadCollection = (data)=>{
    collectionList.value = collectionList.value.map(item=>{
        if(item.id == data.id){
            for(var key in data){
                if(data[key] || data[key] === 0){
                    item[key] = data[key];
                }
            }
        }
        return item;
    })
}
</script>
<style scoped lang="scss">
.project-collection-container{
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    background: #0A0B0D;
    :deep(.collection-scrollbar-container){
       padding: 20px;
        .table-header{
            color: #BEC0CD;
            font-size: 14px;
            // opacity: 0.4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 16px;
            margin-bottom: 8px;
            user-select: none;
            div{
                flex-grow: 1;
                .sort-icon{
                    position: relative;
                    padding-right: 20px;
                    cursor: pointer;
                    &::after{
                        content: '';
                        display: inline-block;
                        position: absolute;
                        width: 10px;
                        right: 0;
                        bottom: -4px;
                        border-width: 5px;
                        border-style: solid;
                        border-color:  #BEC0CD transparent transparent transparent;

                    }
                    &::before{
                        content: '';
                        display: inline-block;
                        position: absolute;
                        right: 0;
                        top: -4px;
                        width: 10px;
                        border-width: 5px;
                        border-style: solid;
                        border-color:  transparent transparent #BEC0CD transparent;
                    }
                    &.asc{
                        &::before{
                            border-color:  transparent transparent #3A36DB transparent;
                        }
                    }
                    &.desc{
                        &::after{
                            border-color: #3A36DB  transparent transparent transparent;
                        }
                    }
                }
            }
        }
   }
}
</style>