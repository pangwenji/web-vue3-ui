<template>
    <div class="el-tab-pane">
        <div class="tab_pane-content" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
            <div class="tags-box">
                <div class="tags-item" :class="{active: tageActive === 0 }" @click.stop="handleChangeTag(0)">全部</div>
                <template v-for="(tage,index) in tageList" :key="index">
                    <template v-if="tage.ifView">
                        <div class="tags-item" :class="{active: tageActive == tage.id}" @click.stop="handleChangeTag(tage.id)">{{tage.title}}</div>
                    </template>
                </template>
                <div class="setting_custom-tag" @click.stop="handleSetShowTag(tage)">设置分类标签</div>
            </div>

            <TransitionGroup name="file_list" tag="div" class="file-container" v-if="fileList&&fileList.length > 0">
                <div class="file-item" v-for="(file,index) in fileList" :key="String(file.id)" @click="clickItem(file)">
                    <div class="file-cover">
                        <el-avatar shape="square" :size="40" :src="file.customizeCover || file.cover || file.downloadUrl" v-if="file.fileClassification == 'image'"></el-avatar>
                        <el-avatar shape="square" :size="40" :src="file.customizeCover || file.cover" v-else-if="file.customizeCover || file.cover"></el-avatar>
                        <div v-else style="width:100%; height:100%; padding: 4px;">
                            <FileType :size="40" :type="file.fileCat" ></FileType>
                        </div>
                    </div>
                    <div class="file-name">{{file.filename}}</div>
                    <!-- <div class="file-edit" @click.stop="handleUploadFile(item,file)">编辑详情</div> -->
                    <div @click.stop="false">
                        <el-switch :model-value="checkSwitch(file)" @change="handleSwitchChange($event,file)" inactive-color="#383B47" active-color="#3468FE"></el-switch>
                    </div>
                    <div class="file-delete" title="删除" @click.stop="handleDeleteFile(file)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </div>
                </div>
            </TransitionGroup>
            <Empty v-else-if="!loadingState" style="padding: 0;" description="未找到相关作品"></Empty>
            <Pagination :total="params.total" :page="params.pageNum" :limit="params.pageSize" @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
        </div>
        <!-- <div class="home_exhibition-box">
            <div class="title">首页精选作品</div>
            <template v-if="sourIdItems.length > 0">
                <div class="cover" v-for="(file,code) in sourIdItems" :key="code">
                    <el-avatar shape="square" :size="80" :src="file.cover || file.downloadUrl" v-if="file.fileClassification == 'image'"></el-avatar>
                    <el-avatar shape="square" :size="80" :src="file.cover" v-else-if="file.cover"></el-avatar>
                    <el-avatar shape="square" :size="80" :src="file.customizeCover" v-else-if="file.customizeCover"></el-avatar>
                    <div v-else style="width:100%; height:100%; padding: 10px;">
                        <FileType :size="80" :type="file.fileClassification" ></FileType>
                    </div>
                    <div class="file-delete"  @click.stop="handleCancelFile(file)">
                        取消推荐
                    </div>
                </div>
            </template>
            <div class="desc" v-else>暂无精选作品展示</div>
        </div> -->
    </div>
    <SetCustomTag ref="SetCustomTagRef" @submit="handleSetTagView"></SetCustomTag>
</template>
<script>
import FileType from "@/components/FileType";
import SetCustomTag from "../SetCustomTag";
import { defineComponent, getCurrentInstance, reactive, ref } from "vue";
import { getWorkList, getFileTagList, deleteWorkFile, getWorkFileSorting } from '@/api/personnel/file.js'
import { ElMessage } from 'element-plus'
const props = {
    type: {
        type: String,
        default: '',
    },

    title: {
        type: String,
        default: '',
    },
    authId:{
        type: [Number,String],
        default: '',
    },
    sourIdItems:{
        type: Array,
        default(){
            return []
        }
    },
}
const components = {
    FileType,
    SetCustomTag
}

const emits = ['sourChange','onDelete', 'selectFile']

const setup = (prop, { emit }) => {
    const SetCustomTagRef = ref();
    const { proxy } = getCurrentInstance();
    const loadingState = ref(false);
    const tageActive = ref(0);
    const fileList = ref([]);
    const tageList = ref([]);
    const params = reactive({
        pageNum: 1,
        pageSize: 10,
        total: 0,

    })
    // 首次加载获取数据
    const getData = () => {
        Promise.all([getFileList(), getTageList()]).then(res=>{

        }).catch(err=>{
            console.log('all',err)
        })
    }
    // 切换分页
    const handlePagination = ({page,limit})=>{
        params.pageNum = page;
        params.pageSize = limit;
        getFileList();
    }
    // 获取文件列表
    const getFileList = async () => {
        try {
            loadingState.value = true;
            fileList.value = [];
            const userAuthenticateId = prop.authId;
            const fileClassification = prop.type;
            const tagId = tageActive.value;
            const result = await getWorkList({ ...params, tagId, userAuthenticateId, fileClassification });
            fileList.value = result.rows || [];
            params.total = result.total;
            loadingState.value = false;
            return Promise.resolve(result);
        } catch (err) {
            loadingState.value = false;
            return Promise.reject();
        }
    }
    // 获取标签列表
    const getTageList = async () => {
        try {
            const userAuthenticateId = prop.authId;
            const fileClassification = prop.type;
            const result = await getFileTagList({ userAuthenticateId, fileClassification });
            tageList.value = result.data;
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject();
        }
    }

    getData();

    // 删除已上传文件
    const handleDeleteFile = (file) => {
        proxy.$modal.confirm({
            title: '删除文件',
            content: `确定要删除文件“${file.filename}”吗？`,
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    deleteWorkFile({ id: file.id }).then(res => {
                        getFileList();
                        emit('onDelete',file);
                        done()
                    }).catch(err => {
                        done();
                    })
                } else {
                    if (instance.confirmButtonLoading) { return }
                    done()
                }
            }
        })
    }

    const clickItem = (file) => {
        emit('selectFile', file)
    }
    
    // 开关状态
    const checkSwitch = (file) => {
        const index = prop.sourIdItems.findIndex((item)=>{
            return item.id == file.id;
        })
        return index > -1
    }

    // 文件展示开关状态改变时
    const handleSwitchChange = (e, file) => {
        const sourIdItems = [].concat(prop.sourIdItems);
        if (e && sourIdItems.length >= 4) {
            ElMessage.warning('只允许推荐四个作品');
            return
        } else if (e) {
            sourIdItems.push(file)
        } else {
            const index = sourIdItems.findIndex(item=>item.id == file.id);
            if (index > -1) {
                sourIdItems.splice(index, 1)
            }
        }
        emit('sourChange', sourIdItems)
    }
    // 取消推荐
    const handleCancelFile = (file)=>{
        const sourIdItems = [].concat(prop.sourIdItems);
        const index = sourIdItems.findIndex(item=>item.id == file.id);
        if (index > -1) {
            sourIdItems.splice(index, 1)
        }
        emit('sourChange', sourIdItems)
    }


    // 设置自定义标签展示
    const handleSetTagView = (e) => {
        tageList.value.map(item=>{
            item.ifView = Number(e.indexOf(item.id) > -1);
            return item;
        })
    }

    // 设置展示标签
    const handleSetShowTag = ()=>{
        const tages = tageList.value;
        const selectTages = tageList.value.filter(item=>item.ifView).map(item=>item.id);
        SetCustomTagRef.value.open(tages,selectTages);
    }

    // 切换标签时
    const handleChangeTag = (e)=>{
        if(e == tageActive.value){
            return
        }
        tageActive.value = e;
        params.pageNum = 1;
        getFileList();
    }

    return {
        params,
        getData,
        fileList,
        tageList,
        clickItem,
        tageActive,
        getTageList,
        getFileList,
        checkSwitch,
        loadingState,
        SetCustomTagRef,
        handleChangeTag,
        handleCancelFile,
        handlePagination,
        handleSetShowTag,
        handleSetTagView,
        handleDeleteFile,
        handleSwitchChange,
    }
}

export default defineComponent({
    setup,
    props,
    emits,
    components
})
</script>
<style scoped lang="scss">
.el-tab-pane{
    padding: 20px;
    // padding-right: 200px;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background: #181920;
    .tab_pane-content{
        min-height: 360px;
        padding-bottom: 46px;
        position: relative;
        .pagination-container-box{
            position:absolute;
            bottom: 0px;
            left: 0px;
            width: 100%;
        }
    }
}

.tags-box {
    display: flex;
    margin-left: -20px;
    position: relative;
    padding-right: 164px;
    flex-wrap: wrap;
    .tags-item {
        margin-bottom: 20px;
        --border-color: #3d3f50;
        --border-hover-color: #3468fe;
        width: 90px;
        height: 32px;
        line-height: 30px;
        text-align: center;
        border: 1px solid var(--border-color);
        flex: none;
        border-radius: 6px;
        color: #666a7a;
        background: rgba($color: #3d3f50, $alpha: 0.3);
        font-size: 14px;
        margin-left: 20px;
        cursor: pointer;
        &.active {
            color: #3468fe;
            background: rgba($color: #3468fe, $alpha: 0.3);
            border: 1px solid var(--border-hover-color);
        }
        &:hover {
            color: #3468fe;
            background: rgba($color: #3468fe, $alpha: 0.3);
            border: 1px solid var(--border-hover-color);
        }
    }
    .setting_custom-tag {
        position: absolute;
        right: 0px;
        top: 0px;
        font-size: 16px;
        color: #3468fe;
        cursor: pointer;
    }
}
.file-container {
    position: relative;
    overflow: hidden;
    padding: 0;
}
.file-item {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    padding: 10px 40px 10px 10px;
    border-radius: 10px;
    background: #1c1d24;
    overflow: hidden;
    position: relative;
    margin-bottom: 16px;
    user-select: none;
    &:last-child {
        margin-bottom: 0px;
    }
    &:hover {
        background: #24262f;
        .file-name {
           
            color: white;
        }
        .file-drap {
            background: rgba($color: #3468fe, $alpha: 0.2);
            color: #3468fe;
        }
    }
    &.active {
        background: #24262f;
        .file-name {
            color: white;
        }
        .file-drap {
            background: rgba($color: #3468fe, $alpha: 0.2);
            color: #3468fe;
            z-index: 2;
        }
    }
    &.disabled {
        &:hover {
            background: #1c1d24;
            .file-name {
                color: #9094a6;
            }
            .file-drap {
                background: #212229;
                color: #979797;
            }
        }
    }
    &:deep(.el-avatar) {
        border-radius: 8px;
        flex: none;
        margin-right: 20px;
    }
    .file-cover {
        width: 40px;
        height: 40px;
        margin-right: 20px;
        background: #17181e;
        border-radius: 6px;
    }
    .file-name {
        flex: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20px;
        font-size: 16px;
        color: #9094a6;
    }
    .file-edit {
        margin-right: 20px;
        font-size: 14px;
        color: #3468fe;
        cursor: pointer;
    }
    .file-delete {
        top: 50%;
        transform: translateY(-50%);
        right: 10px;
        // color: #d81e1a;
        cursor: pointer;
        position: absolute;
        &:hover{
            color: #d81e1a;
        }
    }
    .file-drap {
        cursor: move;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #212229;
        color: #979797;
        * {
            pointer-events: none;
        }
    }
    .drap-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
.tab_pane-content {
    flex: auto;
    // margin-right: 20px;
}
.home_exhibition-box {
    right: 20px;
    top: 20px;
    width: 160px;
    flex: none;
    background: #1c1d24;
    padding-bottom: 20px;
    border-radius: 10px;
    min-height: 100px;
    .file-delete{
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        position: absolute;
        bottom: -20px;
        font-size: 12px;
        background: rgba($color: #000000, $alpha: .6);
        color: white;
        cursor: pointer;
        transition: bottom .3s ease;
    }
    .title {
        font-size: 16px;
        color: #9094a6;
        padding: 16px 0;
        text-align: center;
        position: relative;
        &::after {
            content: "";
            display: block;
            position: absolute;
            width: 30%;
            background: #24262f;
            height: 2px;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .cover {
        width: 80px;
        height: 80px;
        border-radius: 10px;
        background: #17181e;
        text-align: center;
        margin: 20px auto 0;
        position: relative;
        overflow: hidden;
        &:hover{
            .file-delete{
                bottom: 0;
            }
        }
    }
    .desc {
        font-size: 12px;
        color: #9094a6;
        text-align: center;
        padding: 20px 20px 0;
    }
}

.file_list-move, /* 对移动中的元素应用的过渡 */
.file_list-enter-active,
.file_list-leave-active {
    transition: all 0.5s ease;
}

.file_list-enter-from,
.file_list-leave-to {
    opacity: 0;
    transform: scale(0.01);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.file_list-leave-active.file-item {
    position: absolute;
}
</style>