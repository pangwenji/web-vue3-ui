<template>
    <div class="works_file-main">
        <div class="action-btns">
            <el-button type="primary" color="#3468FE" style="border-radius: 10px;" @click="handleInsertFile">
                <span>上传作品</span>
                <!-- <span>作品管理</span> -->
            </el-button>
        </div>

        <div class="tabs-box">
            <el-tabs v-model="tabValue">
                <template v-for="(item,index) in tabBarData" :key="index">
                    <el-tab-pane :label="item.title" :name="item.name" lazy>
                        <CompositionFileItem 
                            :authId="authId" 
                            :sourIdItems="sourIdItems" 
                            :title="item.title" 
                            :type="item.name"
                            @onDelete="handleCancelFile" 
                            @sourChange="handleSourChange" 
                            @selectFile="onSelectFile">
                        </CompositionFileItem>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </div>
        <div class="recommend-file-box">
            <div class="recommend-file-title">首页精选作品</div>
            <template v-if="sourIdItems.length > 0">
                <div class="cover" v-for="(file,code) in sourIdItems" :key="code">
                    <el-avatar shape="square" :size="100" :src="file.cover || file.downloadUrl" v-if="file.fileCat == 'image'"></el-avatar>
                    <el-avatar shape="square" :size="100" :src="file.customizeCover" v-else-if="file.customizeCover"></el-avatar>
                    <el-avatar shape="square" :size="100" :src="file.cover" v-else-if="file.cover"></el-avatar>
                    <div v-else style="width:100%; height:100%; padding: 10px;">
                        <FileType :size="100" :type="file.fileCat"></FileType>
                    </div>
                    <div class="file-delete" @click.stop="handleCancelFile(file)">
                        取消推荐
                    </div>
                </div>
            </template>
            <div class="desc" v-else>请在上传作品后，开启工种库首页精选作品置顶</div>
        </div>
    </div>
</template>
<script>
import FileType from "@/components/FileType";
import { computed, defineComponent, getCurrentInstance, reactive } from "vue";
import CompositionFileItem from "./CompositionFileItem.vue"
const props = {
    authId: {
        type: [String, Number],
        default: '',
    },
    // 推荐作品ID列表
    sourIdItems: {
        type: Array,
        default() {
            return []
        }
    }
}
const emits = ['update:sourIdItems', 'change', 'onUploadFile', 'clickFile']
const components = {
    FileType,
    CompositionFileItem,
}
const setup = (prop, { emit }) => {
    const tabValue = ref('audio');
    const tabBarData = ref([
        {
            title: '音频作品',
            name: 'audio',
        },
        {
            title: '视频作品',
            name: 'video',
        },
        {
            title: '图片作品',
            name: 'image',
        },
        {
            title: '文档作品',
            name: 'other',
        },
    ]);

    const handleSourChange = (e) => {
        emit('update:sourIdItems', e);
        emit('change', e);
    }
    // 取消选择
    const handleCancelFile = (file) => {
        const sourIdItems = [].concat(prop.sourIdItems);
        const index = sourIdItems.findIndex(item=>item.id == file.id);
        if (index > -1) {
            sourIdItems.splice(index, 1)
        }
        handleSourChange(sourIdItems);
    }

    // 点击作品
    const onSelectFile = (file) => {
        emit('clickFile', file)
    }

    // 进入上传作品
    const handleInsertFile = (id) => {
        // 参数：标签类别、文件id
        emit('onUploadFile', tabValue.value, id)
    }

    return {
        tabValue,
        tabBarData,
        onSelectFile,
        handleCancelFile,
        handleInsertFile,
        handleSourChange,
    }
}
export default defineComponent({
    setup,
    props,
    emits,
    components,
})
</script>
<style scoped lang="scss">
.works_file-main {
    border-radius: 10px;
    overflow: hidden;
    background: #23252e;
    position: relative;
    display: flex;
    align-items: stretch;
    .action-btns {
        position: absolute;
        right: 180px;
        top: 14px;
        z-index: 2;
    }
    .recommend-file-box {
        width: 170px;
        flex: none;
        position: relative;
        font-size: 14px;
        padding-bottom: 20px;
        text-align: center;
        z-index: 0;
        color: #9094a6;
        .recommend-file-title {
            text-align: center;
            line-height: 58px;
            font-size: 16px;
            color: #9094a6;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cover {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            background: #17181e;
            text-align: center;
            margin: 20px auto 0;
            position: relative;
            overflow: hidden;
            &:hover {
                .file-delete {
                    bottom: 0;
                }
            }
        }
        .file-delete {
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            position: absolute;
            bottom: -20px;
            font-size: 12px;
            background: rgba($color: #000000, $alpha: 0.6);
            color: white;
            cursor: pointer;
            transition: bottom 0.3s ease;
        }
        .desc {
            font-size: 12px;
            color: #9094a6;
            text-align: center;
            padding: 20px 18px 0;
        }
    }
    .tabs-box {
        flex: auto;
        overflow: hidden;
        position: relative;
        box-shadow: 10px 0px 30px 0px rgba(4, 4, 9, 0.6);
        // padding-right: 160px;
    }
    &:deep(.el-tabs) {
        min-height: 100%;
        background: #181920;
        .tab_pane-content{
            overflow: hidden;
        }
        .el-tabs__header {
            padding: 0px 20px 0;
            background: #22232D;
            margin-bottom: 0;
            .el-tabs__nav-wrap::after {
                background: transparent;
            }
            .el-tabs__item {
                color: #666a7a;
                font-size: 16px;
                // overflow: hidden;
                height: 60px;
                padding-top: 10px;
                &.is-active {
                    font-weight: bold;
                    color: #ffffff;
                }
            }
            .el-tabs__active-bar {
                background-color: #3468fe;
            }
        }
    }
}
</style>