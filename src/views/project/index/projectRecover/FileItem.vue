<template>
    <div class="file-table-body" v-contextmenu:contextmenuRef>
        <div class="file-table-td file-name" style="width: 53%">
            <div class="file-cover">
                <FileType :type="type == 'image' || type == 'video'? 'url' : type" :url="fileData.cover"></FileType>
            </div>
            <div class="info">
                <div class="title">
                    <span class="version" v-if="fileData.version > 1">v{{fileData.version}}</span>
                    <span class="name">{{fileData.name}}</span>
                </div>
                <div class="comment">
                    <span>{{projectData.name}}</span>
                </div>
            </div>
        </div>
        <div class="file-table-td" style="width: 12%"><span> {{formatSize(fileData.size)}}</span></div>
        <div class="file-table-td" style="width: 12%">
            <span>{{fileData.updateBy}}</span>
        </div>
        <div class="file-table-td" style="width: 18%"><span>{{fileData.updateTime}}</span></div>
        <div class="file-table-td file-action" style="width: 5%" v-contextmenu:contextmenuRef="{trigger:'click'}">
            <span>
                <svg-icon iconClass="icon_edit_vertical" className="primary" :size="20"></svg-icon>
            </span>
        </div>
        <v-contextmenu ref="contextmenuRef">
            <v-contextmenu-item @click="handleRefresh" :disabled="!authRule('delete')" icon="RefreshRight">放回原处</v-contextmenu-item>
            <v-contextmenu-item @click="handleDelete" :disabled="!authRule('delete')" icon="Delete">彻底删除</v-contextmenu-item>
        </v-contextmenu>
    </div>
</template>
<script>
import { recoverFile, thoroughDeleteFile } from "@/api/project/files.js";
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import FileType from '@/components/FileType'
import { ElMessage, ElMessageBox } from "element-plus";
import { formatSize } from "@/utils/tool.js"
const components = {
    FileType
}


const props = {
    fileData: {
        type: Object,
        default() {
            return {}
        }
    },
    type: {
        type: [String, Number],
        default: 'default'
    }
}
const emits = ['onRefresh', 'onDelete']
const setup = (prop, { emit }) => {
    const store = useStore();
    const contextmenuRef = ref();
    const projectData = computed(() => {
        return store.state.project.projectData;
    })
    const authRule = (e) => {
        if(!projectData.value.permissions){
            return
        }
        if (projectData.value.currRoleId == 1) { // 所有者
            return true;
        } else if (projectData.value.currRoleId == 2) { // 管理员
            return projectData.value.permissions.adminPermissions.indexOf(e) > -1;
        } else { // 成员
            return projectData.value.permissions.memberPermissions.indexOf(e) > -1;
        }
    }
    // 还原
    const handleRefresh = () => {
        const id = prop.fileData.id;
        const type = prop.type;
        recoverFile({ id }).then(res => {
            emit('onRefresh', { id, type });
            ElMessage.success('操作成功');
        })
    }
    // 彻底删除
    const handleDelete = () => {
        const name = prop.fileData.name;
        const typeName = prop.type == 'folder' ? '文件夹' : '文件';
        const text = `是否彻底删除${typeName}“${name}”?`;
        const title = `彻底删除${typeName}`;
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
                    const id = prop.fileData.id;
                    const type = prop.type;
                    thoroughDeleteFile({ id }).then(res => {
                        emit('onDelete', { id, type });
                        ElMessage.success('操作成功');
                        done();
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
    return {
        authRule,
        formatSize,
        projectData,
        handleDelete,
        handleRefresh,
        contextmenuRef,
    }
}

export default defineComponent({
    props,
    emits,
    setup,
    components
})
</script>
<style scoped lang="scss">
.file-table-body {
    width: 100%;
    overflow: hidden;
    display: flex;
    font-size: 14px;
    border-radius: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 5px 0;
    // border: 1px solid white;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    * {
        pointer-events: none;
        user-select: none;
    }

    &:hover {
        // color: #409EFF;
        background: #ecf5ff2a;
    }

    .file-table-td {
        // flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        justify-content: left;
        align-items: center;

        &.file-action {
            pointer-events: auto;
            user-select: auto;
            &:hover {
                color: #409eff;
                cursor: pointer;
            }
        }

        span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &.file-name {
            position: relative;
            z-index: 9;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            .file-cover {
                width: 40px;
                height: 40px;
                border-radius: 4px;
                margin-right: 10px;
                overflow: hidden;
                flex-shrink: 0;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                margin-left: 10px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .info {
                width: 100%;
                flex-grow: 1;
                overflow: hidden;
                flex-basis: 100%;

                .title {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    span:last-child {
                        display: inline;
                    }

                    .version {
                        // background: #90939932;
                        color: white;
                        border-radius: 2px;
                        padding: 3px;
                        margin-right: 5px;
                    }
                }

                .comment {
                    font-size: 12px;
                }
            }
        }
    }
}
</style>