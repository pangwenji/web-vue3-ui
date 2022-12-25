<template>
    <!-- <HeaderAction></HeaderAction> -->
    <div class="project-collection-container">
        <el-scrollbar height="100%" wrap-class="collection-scrollbar-container" v-loading="loadingStatus" element-loading-background="rgba(0, 0, 0, 0)">
            <template v-if="shareList.length > 0 && !loadingStatus">
                <div class="table-header">
                    <div style="width: 36%;">
                        <span class="sort-icon " :class="sortData.name?'asc':'desc'" @click="handleSortData('name')">文件夹名称</span>
                    </div>
                    <div style="width: 10%;">分享人</div>
                    <div style="width: 12%;">访问记录</div>
                    <div style="width: 8%;">评论数</div>
                    <div style="width: 8%;">链接开关</div>
                    <div style="width: 8%;">链接状态</div>
                    <div style="width: 10%;">链接</div>
                    <div style="width: 4%;">操作</div>
                </div>
                <template v-for="(item,index) in shareList" :key="index">
                    <ShareItem :share-item="item" @onDelete="handleDelete" @onSetting="handleSetting" @onSendShare="handleonSendShare($event,item)"></ShareItem>
                </template>
            </template>
            <template v-else-if="!loadingStatus">
                <Empty description="暂无分享文件夹" />
            </template>
        </el-scrollbar>
    </div>
    <ProjectShareDialog ref="ProjectShareDialogRef"></ProjectShareDialog>
    <CreateShareDialog type="update" @onSubmitSuccess="handleUploadShare" ref="CreateShareDialogRef"></CreateShareDialog>
</template>
<script setup>
import HeaderAction from "./HeaderAction.vue"
import ShareItem from "./ShareItem.vue"
import ProjectShareDialog from "../components/ProjectShareDialog"
import CreateShareDialog from "../components/CreateShareDialog"
import { myShareList, deleteProjectShare } from "@/api/project/files.js"
import { useStore } from "vuex"
import { computed, onMounted, reactive } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import { useRoute } from "vue-router"

const route = useRoute();
const store = useStore();
const sortData = reactive({
    name: 1,
});
const loadingStatus = ref(false);
const shareList = ref([]);
const ProjectShareDialogRef = ref();
const CreateShareDialogRef = ref();
const projectData = computed(() => {
    return store.state.project.projectData;
})
const getData = () => {
    loadingStatus.value = true;
    const project_id = route.params.id;
    myShareList({ project_id }).then(res => {
        loadingStatus.value = false;
        shareList.value = res.data;
        handleSortData();
    }).catch(err => {
        loadingStatus.value = false;
    })
}

onMounted(()=>{
    getData();  
})

const handleSortData = (key) => {
    sortData[key] = sortData[key] ? 0 : 1;
    shareList.value.sort((a, b) => {
        if (key == 'name') {
            if (sortData[key]) {
                return a[key].localeCompare(b[key])
            } else {
                return b[key].localeCompare(a[key])
            }
        } else {
            if (a[key] > b[key]) {
                return sortData[key] ? 1 : -1;
            } else if (a[key] < b[key]) {
                return sortData[key] ? -1 : 1;
            } else {
                return 0;
            }
        }
    })
}

// 删除
const handleDelete = ({ id, name }) => {
    const text = `确定要删除分享记录“${name}”吗?`;
    const title = `删除分享`
    ElMessageBox.confirm(text, title, {
        customClass: 'messageBox-custom-warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true,
        center: true,
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                instance.confirmButtonLoading = true
                deleteProjectShare({ id }).then(res => {
                    done();
                    shareList.value = shareList.value.filter(item => item.id != id);
                    ElMessage.success('删除成功');
                }).catch(err => {
                    done();
                })
            } else {
                if (instance.confirmButtonLoading) { return }
                done()
            }
        }
    }).then(() => { }).catch(err => { })
}
// 查看文件
const handleViewFile = (data) => {

}
// 打开设置
const handleSetting = (data) => {
    CreateShareDialogRef.value.open(data)
}
// 发起分享
const handleonSendShare = (type, { id, token }) => {
    ProjectShareDialogRef.value.open({ type, id, token })
}
// 更新分享
const handleUploadShare = (data) => {
    shareList.value = shareList.value.map(item => {
        if (item.id == data.id) {
            for (var key in data) {
                if (data[key] || data[key] === 0) {
                    item[key] = data[key];
                }
            }
        }
        return item;
    })
}

</script>
<style scoped lang="scss">
.project-collection-container {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    background: #0a0b0d;
    :deep(.collection-scrollbar-container) {
        padding: 20px;
        .table-header {
            color: #bec0cd;
            font-size: 14px;
            // opacity: 0.4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 16px;
            margin-bottom: 8px;
            user-select: none;
            div {
                flex-grow: 1;
                .sort-icon {
                    position: relative;
                    padding-right: 20px;
                    cursor: pointer;
                    &::after {
                        content: "";
                        display: inline-block;
                        position: absolute;
                        width: 10px;
                        right: 0;
                        bottom: -4px;
                        border-width: 5px;
                        border-style: solid;
                        border-color: #bec0cd transparent transparent
                            transparent;
                    }
                    &::before {
                        content: "";
                        display: inline-block;
                        position: absolute;
                        right: 0;
                        top: -4px;
                        width: 10px;
                        border-width: 5px;
                        border-style: solid;
                        border-color: transparent transparent #bec0cd
                            transparent;
                    }
                    &.asc {
                        &::before {
                            border-color: transparent transparent #3a36db
                                transparent;
                        }
                    }
                    &.desc {
                        &::after {
                            border-color: #3a36db transparent transparent
                                transparent;
                        }
                    }
                }
            }
        }
    }
}
</style>