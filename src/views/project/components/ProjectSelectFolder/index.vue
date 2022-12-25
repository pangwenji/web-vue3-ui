<template>
    <el-dialog v-model="visible" width="40%" :before-close="onBeforeClose" destroy-on-close :title="title" custom-class="dialog-center">
        <el-scrollbar height="360px" 
            wrap-style="background: #F5F5F7; border-radius: 8px;"  
            view-style="display:inline-block; min-width: 100%; padding: 10px 10px 6px"
            v-loading="loadingStatus"  element-loading-background="rgba(255, 255, 255, 1)"
            >
            <el-tree 
                :lazy="true" 
                :load="loadData" 
                :data="treeDatas" 
                :props="treeProps" 
                :default-expanded-keys="[-1,-2]"
                node-key="directoryId"
                :highlight-current="true" 
                :expand-on-click-node="false"
                @node-click="handleNodeClick" 
                class="dialog-tree-container">
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                        <span style="margin-right: 8px;" v-if="data.directoryId > 0">
                            <el-icon :size="26"  v-if="node.expanded"><FolderOpened /></el-icon>
                            <el-icon :size="26" class="el-icon--left" v-else><Folder /></el-icon>
                        </span>
                        <span >{{ node.label  }}</span>
                    </span>
                </template>
            </el-tree>
        </el-scrollbar>
        <template #footer>
            <span>
                <el-button type="default" class="is-custom" @click="onBeforeClose" >取消</el-button>
                <el-button type="primary" class="is-custom" :loading="loadingSubmit" @click="handleSubmit" color="#3468FE">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { getProjects } from "@/api/project/project.js"
import { getDirectoryList, handleSaveTo , handleMoveTo,handleShareSaveTo } from "@/api/project/files.js"
import { computed, defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const props = {}
const emits = ['onSubmit']
const setup = (prop,{emit})=>{
    const store = useStore();
    const type = ref("move");
    const title = ref("移动到");
    const visible = ref(false);
    const formData = ref({
        fileIds:[],
        fromProjectId:null,
        toProjectId:null,
        directoryId:null,
    });
    const loadingStatus = ref(false)
    const loadingSubmit = ref(false);
    // 树形控件数据
    const treeDatas = [];
    // 树形控件配置
    const treeProps = {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf',
    }
    let projectData = {}
    // 懒加载获取数据
    const loadData = (node, resolve)=>{
        if(node.level == 0){
            loadingStatus.value = true
            getProjects().then(res=>{
                const l1 = res.data.project
                const l2 = res.data.join
                projectData = res.data;
                const list = []
                if(l1.length > 0){
                    list.push({
                        label:`我的项目(${l1.length})`,
                        directoryId: -1,
                    })
                }
                if(l2.length > 0){
                    list.push({
                        label:`参与项目(${l2.length})`,
                        directoryId: -2,
                    })
                }
                loadingStatus.value = false;
                resolve(list)
            }).catch(err=>{
                loadingStatus.value = false;
                node.loading = false;
            })
        }else if(node.level == 1){
            const directoryId = node.data.directoryId;
            if(directoryId == -1){
                resolve(projectData.project.map(item=>{
                    return {
                        label:item.name,
                        projectId: item.id,
                        directoryId: item.directoryId,
                    }
                }))
            }else if(directoryId == -2){
                resolve(projectData.join.map(item=>{
                    return {
                        label:item.name,
                        projectId: item.id,
                        directoryId: item.directoryId,
                    }
                }))
            }else{
                node.loading = false;
            }
        }else{
            const parent_id = node.data.directoryId;
            const project_id = node.data.projectId;
            getDirectoryList({fill:2,parent_id,project_id}).then(res=>{
                const folders = res.data.map(item=>{
                    return {
                        label:item.name,
                        projectId: project_id,
                        directoryId:item.id,
                        // leaf: item.dirQuantity === 0
                    }
                });
                resolve(folders)
            }).catch(err=>{
                node.loading = false;
            })
        }
    }
    // 点击节点触发的事件
    const handleNodeClick = (data,node,element)=>{ 
        if(data.directoryId < 0){
            node.isCurrent = false;
            formData.value.toProjectId = null;
            formData.value.directoryId = null;
            return
        }
        formData.value.toProjectId = data.projectId;
        formData.value.directoryId = data.directoryId;
    }
    // 弹窗关闭前的回调函数
    const onBeforeClose = (deno)=>{
        if(loadingSubmit.value){return}
        if(loadingStatus.value){return}
        formData.value = {
            fileIds:[],
            fromProjectId:null,
            toProjectId:null,
            directoryId:null,
        }
        if(typeof deno == 'function'){
            deno();
        }else{
            visible.value = false;
        }
    }
    const getFile = ()=> store.dispatch('project/handleGetFiles');
    const getFold = ()=> store.dispatch('project/handleGetFolders');
    const getAll = ()=> Promise.all([getFile(),getFold()])
    // 提交
    const handleSubmit = async ()=>{
        try{
            if(!formData.value.directoryId ||　!formData.value.toProjectId){
                ElMessage.error('请选择项目文件夹')
                return
            }
            loadingSubmit.value = true;
            switch(type.value){
                case 'move':
                    await handleMoveTo(formData.value);
                    await getAll();
                    ElMessage.success('移动成功')
                    break;
                case 'copy':
                    await handleSaveTo(formData.value);
                    await getAll();
                    ElMessage.success('复制成功')
                    break;
                case 'redeposit':
                    const token = formData.value.fromProjectId;
                    const fileIds = formData.value.fileIds;
                    const projectId = formData.value.toProjectId;
                    const directoryId = formData.value.directoryId;
                    await handleShareSaveTo({token,fileIds,projectId,directoryId});
                    ElMessage.success('转存成功')
                    break;
            }
            emit('onSubmit')
            loadingSubmit.value = false;
            onBeforeClose();
        }catch(err){
            loadingSubmit.value = false;
        }

    }

    const open = (t,n,{fromProjectId,fileIds})=>{
        type.value = t;
        title.value = n;
        formData.value.fromProjectId = fromProjectId;
        formData.value.fileIds = fileIds;
        visible.value = true;
    }

    return {
        open,
        type,
        title,
        visible,
        formData,
        loadData,
        treeDatas,
        treeProps,
        handleSubmit,
        loadingSubmit,
        loadingStatus,
        onBeforeClose,
        handleNodeClick,
    }
}
export default defineComponent({
    setup,
    emits,
    props
})
</script>
<style lang="scss">
.dialog-tree-container{
    background: none;
    &.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
        background-color: #D8E4FF !important;
        color: #3468FE;
        .el-tree-node__expand-icon{
            color: #3468FE;
            &.is-leaf{
                visibility: hidden;
            }
        }
    }
}
</style>
<style scoped lang="scss">
.dialog-tree-container{
    &:deep(.el-tree-node){
        .el-tree-node__content{
            height: auto;
            border-radius: 8px;
            margin-bottom: 4px;
            position: relative;
            &:hover{
                background: #ededed;
            }
        }

    }
    .custom-node-disabled{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .custom-tree-node{
        width: 100%;
        padding: 12px 12px 12px 0;
        font-size: 16px;
        display: flex;
        align-items: center;
        user-select: none;
    }
}

</style>