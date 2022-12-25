<template>
    <div class="cloud_file-body">
        <el-dialog v-model="visibled" :title="'云盘选择文件' + fileCatName" width="800px" @closed="removeNode && removeNode()" :before-close="onBeforeClose" custom-class="dialog-center">
            <div class="cloud_file-box">
                <el-scrollbar class="left-side" view-style="padding:10px; display: inline-block; min-width:100%;min-height: 100%;" v-loading="loadingSide">
                    <el-tree
                        lazy 
                        ref="TreeRef" 
                        node-key="id"  
                        empty-text="暂无文件夹" 
                        :current-node-key="currentNodeKey" 
                        @node-click="handleClickNode" 
                        :expand-on-click-node="false" 
                        :load="loadTreeData" 
                        :data="treeData"
                        :props="{ class: customNodeClass , isLeaf:'leaf'}"
                        >
                        <template #default="{ node, data }">
                            <el-icon class="el-icon--left">
                                <FolderOpened v-if="node.expanded" />
                                <Folder v-else />
                            </el-icon>
                            <span>{{data.label}}</span>
                        </template>
                    </el-tree>
                </el-scrollbar>
                <div class="right-container" v-loading="loadingState">
                    <div class="header-box">
                        <div class="check-action"><span class="check-btn" @click="handleCheckAll(1)">全选</span><span class="line">|</span><span class="check-btn" @click="handleCheckAll(0)">全不选</span></div>
                        <el-input size="small" v-model="searchValue" @change="handleChangeSearchValue" clearable :prefix-icon="Search" placeholder="搜索当前文件下的文件"></el-input>
                    </div>
                    <el-scrollbar class="scrollbar-container" :view-class="[ 'viewCustomClass', currentNodeKey === 0?'pagInation':'' ] "  >
                        <!-- <div v-for="index in 100">file</div> -->
                        <template v-if="searchFiles.length && !loadingState">
                            <el-row :gutter="10">
                                <el-col :span="6" class="file-item" v-for="(item,index) in searchFiles" :key="index">
                                    <div class="file-content" :class="{active: item.check}" :title="item.name" @click="handleClickFile(item,index)" >
                                        <FileType type="url" fit="cover" :url="item.cover" style="padding: 0;" class="file-cover" v-if="(item.fileCat == 'image' || item.fileCat == 'video') && item.cover"></FileType>
                                        <FileType :type="item.fileCat" :url="item.cover" class="file-cover" v-else></FileType>
                                        <div class="file-name">{{item.name}}</div>
                                    </div>
                                    <!-- <div class="check-box"></div> -->
                                </el-col>
                            </el-row>
                        </template>
                        <template v-else-if="!loadingState">
                            <div style="text-align:center;" v-if="!currentNodeKey">请选择文件夹</div>
                            <Empty imageType="white" description="这个文件夹没有文件" v-else-if="!searchValue"></Empty>
                            <Empty imageType="white" description="暂无搜索内容" v-else></Empty>
                        </template>
                        <Pagination :total="params.total" theme="white" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
                    </el-scrollbar>
                </div>
            </div>
            <template #footer>
                <div>
                    已选择{{selectFiles.length}}个文件,文件大小{{selectFileSize}}
                </div>
                <div>
                    <el-button round type="primary" style="width: 120px;" color="#3468FE" size="large" :loading="loadingConfirm" @click="handleConfirm">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { computed, defineComponent, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getFolderList, getFileList , getTypeList} from '@/api/clouddisk/file.js'
import { formatSize } from '@/utils/tool.js'
import FileType from '@/components/FileType'
import Empty from '@/components/Empty'
const props = {
    fileCat:{
        tyle: String,
        default: '',
    },
    removeNode: {
        type: Function,
        default: null
    },
    onSubmitSuccess:{
        type: Function,
        default: null,
    },
    onAfterConfirm:{
        type: Function,
        default: null,
    }
}
const components = {
    Empty,
    FileType
}
const setup = (prop) => {
    const visibled = ref(false);
    const treeData = [];
    const params = reactive({
        type: prop.fileCat == 'other'? 'dom': prop.fileCat,
        keyword:'',
        isAsc:'asc',
        pageNum: 1,
        pageSize: 20,
        total: 0,
        orderByColumn: 'create_time',
    })
    const loadingConfirm = ref(false);
    const loadingSide = ref(false);
    const searchValue = ref('');
    const fileCatName = computed(()=>{
        if(prop.fileCat){
            if(prop.fileCat == 'other'){
                return '（其他）'
            }
            if(prop.fileCat == 'image'){
                return '（图片）'
            }
            if(prop.fileCat == 'video'){
                return '（视频）'
            }
            if(prop.fileCat == 'audio'){
                return '（音乐）'
            }
        }else{
            return ''
        }
    })
    const customNodeClass = (data, node) => {
        if(currentNodeKey.value == data.id){
            return 'is-active'
        }
        return null;
    }
    


    const selectFiles = computed(()=>{
        return fileData.value.filter(item=> item.check);
    })
    const selectFileSize = computed(()=>{
        const total = selectFiles.value.reduce((sum,item)=>{
            return sum + item.size;
        },0)
        return formatSize(total)
    })
    const searchFiles = ref([])
    const loadTreeData = (node, resolve) => {
        const parent_id = node.data?.id || 0;
        if(parent_id == 0){
            loadingSide.value = true;
        }
        getFolderList({ parent_id }).then(res=>{
            loadingSide.value = false;
            const list = res.data.map(item=>{
                return {
                    id: item.id,
                    label: item.name,
                    disabled: false,
                    leaf: false,
                }
            })
            if(parent_id === 0){
                list.unshift({
                    id: 0,
                    label: '全部文件',
                    disabled: false,
                    leaf: true,
                })
            }
            resolve(list)
        }).catch(err=>{
            loadingSide.value = false;
            node.loading = false;
        })
    }
    // 获取文件列表
    const loadingState = ref(false);
    const currentNodeKey = ref(0);
    const fileData = ref([]);
    let clearTime;
    const getData = ()=>{
        loadingState.value = true;
        if(clearTime){
            clearTimeout(clearTime);
            clearTime = null;
        }
        clearTime = setTimeout(()=>{
            const parent_id = currentNodeKey.value;
            clearTime = null;
            getFileList({parent_id}).then(res=>{
                if(!clearTime){
                    const data  = res.data.filter(item=>{
                        if(prop.fileCat){
                            if(prop.fileCat == 'other'){
                                const format = 'doc、docx、xls、xlsx、ppt、pptx、pdf';
                                return format.indexOf(item.fileCat) > -1;
                            }else{
                                return item.fileCat === prop.fileCat;
                            }
                        }else{
                            return true;
                        }
                    });
                    fileData.value = data;
                    searchFiles.value = data;
                    loadingState.value = false;
                }
            }).catch(err=>{
                if(!clearTime){
                    loadingState.value = false;
                }
            })
        },600)
    }
    // 获取分类
    const getTypeFileList = ()=>{
        loadingState.value = true;
        getTypeList(params).then(res=>{
            loadingState.value = false;
            fileData.value = res.rows;
            searchFiles.value = res.rows;
            params.total = res.total;
        }).catch(err=>{
            loadingState.value = false;
        })
    }
    // 分页
    const handlePagination = ({page,limit})=>{
        params.pageNum = page;
        params.pageSize = limit;
        fileData.value = [];
        getTypeFileList();
    }
    // 搜索文件时
    const handleChangeSearchValue = ()=>{
        if(currentNodeKey.value > 0){
            const val = searchValue.value;
            searchFiles.value = fileData.value.filter(item=>{
                return item.name.indexOf(val) > -1
            })
        }else{
            params.keyword = searchValue.value;
            params.pageNum = 1;
            getTypeFileList();
        }
    }

    const getFileData = ()=>{
        searchValue.value = '';
        fileData.value = [];
        if(currentNodeKey.value > 0){
            getData();
        }else{
            params.pageNum = 1;
            getTypeFileList();
            currentNodeKey.value = 0;
        }
    }


    // 点击节点发生改变时的回调
    const handleClickNode = (data,node)=>{
        if(currentNodeKey.value != data.id){
            currentNodeKey.value = data.id;
            getFileData();
        }
    }
    // 全选/全不选
    const handleCheckAll = (e)=>{
        fileData.value = fileData.value.map(item=>{
            item.check = Boolean(e);
            return item
        })
    }
    // 点击选择文件
    const handleClickFile = (item,index)=>{
        item.check = !item.check;
    }
    // 点击确定
    const handleConfirm = ()=>{
        if(!selectFiles.value.length){
            onBeforeClose();
            return
        }
        if(prop.onAfterConfirm && typeof prop.onAfterConfirm == 'function'){
            prop.onAfterConfirm && prop.onAfterConfirm(loadingConfirm,selectFiles.value,()=>{
                loadingConfirm.value = false;
                prop.onSubmitSuccess && prop.onSubmitSuccess(selectFiles.value);
                onBeforeClose();
            })
        }else{
            prop.onSubmitSuccess && prop.onSubmitSuccess(selectFiles.value);
            onBeforeClose();
        }
    }
    const onBeforeClose = (deno) => {
        if(loadingConfirm.value){
            return
        }
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    };
    const open = () => {
        visibled.value = true;
        getFileData();
    }
    return {
        open,
        Search,
        params,
        fileData,
        treeData,
        visibled,
        fileCatName,
        searchValue,
        selectFiles,
        loadingSide,
        searchFiles,
        loadingState,
        loadTreeData,
        handleConfirm,
        onBeforeClose,
        loadingConfirm,
        handleCheckAll,
        selectFileSize,
        currentNodeKey,
        handleClickFile,
        customNodeClass,
        handleClickNode,
        handlePagination,
        handleChangeSearchValue,
    }
}
export default defineComponent({
    setup,
    props,
    components
})
</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
