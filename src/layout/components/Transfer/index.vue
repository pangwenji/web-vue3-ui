<template>
    <div>
        <div v-if="popoverShow" class="mask"></div>
        <el-popover :width="500" popper-class="custom-popoper" ref="popoperRef" :hide-after="0" @show="onShow" @hide="onHide" placement="bottom" trigger="click">
            <template #reference>
                <div>
                    <el-tooltip effect="light" :show-after="500" content="文件上传" :disabled="popoverShow" placement="bottom">
                        <div class="transfer-container hover-effect">
                            <!-- <el-icon :size="24" color="#ffffff"><upload-filled /></el-icon> -->
                            <!-- <div style="margin-left: 5px;">传输</div> -->
                            <div class="icon-box">
                                <el-progress type="circle" :stroke-width="2" :width="32" color="#3468FE" v-if="(uploadStatus == 'uploading' && uploadList.length > 1)" :percentage="progressTotal" />
                                <svg-icon iconClass="icon_shangchuan" :size="32" v-else></svg-icon>
                            </div>
                        </div>
                    </el-tooltip>
                </div>
            </template>
            <template #default>
                <div class="popover-header">
                    <div class="title">上传记录</div>
                    <div tabindex="-1" @blur="handleDropdownBlur">
                        <div class="desc">
                            <el-icon @click.stop="handleClickOther">
                                <more-filled />
                            </el-icon>
                        </div>
                        <div class="dropdown-menu" :class="popoverMenuShow?'open':'close'">
                            <div class="menu-item" @click.stop="handleClearComplete">
                                清除已完成记录
                            </div>
                        </div>
                    </div>
                </div>
                <el-scrollbar class="popover-scrollbar" style="width:100%; height:300px;">
                    <template v-if="uploadList.length > 0">
                        <div class="upload-list-item" v-for="(item,index) in uploadList" :key="index">
                            <div class="item-type">
                                <el-icon color="#409EFF" :size="18">
                                    <VideoCamera v-if="item.FileType == 'video'" />
                                    <Headset v-else-if="item.FileType == 'audio'" />
                                    <Picture v-else-if="item.FileType == 'image'" />
                                    <Document v-else="item.FileType == 'video'" />
                                </el-icon>
                            </div>
                            <div class="item-data">
                                <div>{{item.FileName}}</div>
                                <el-progress :color="onProgressColor(item.state)" :duration="1" :percentage="item.percent">
                                    <template #default="{ percentage  }">
                                        <div class="item-status">
                                            <!-- 成功 success -->
                                            <span style="color: #67c23a" v-if="item.state == 'success'">
                                                <el-icon color="#67c23a">
                                                    <circle-check-filled />
                                                </el-icon>{{percentage}}%
                                            </span>
                                            <!-- 上传 uploading -->
                                            <span style="color: #409eff" v-else-if="item.state == 'uploading'">{{percentage}}%</span>
                                            <!-- 校验 checking -->
                                            <span style="color: #409eff" v-else-if="item.state == 'checking'">
                                                <!-- <el-progress :width="18" style="margin-right:5px;" type="circle" :stroke-width="2" :show-text="false" :percentage="item.hashPercent * 100" /> -->
                                                正在校验
                                            </span>
                                            <!-- 等待 waiting -->
                                            <span style="color: #409eff" v-else-if="item.state == 'awaiting'">等待上传</span>
                                            <!-- 暂停 paused -->
                                            <span style="color: #a0cfff" v-else-if="item.state == 'paused'">已暂停</span>
                                            <!-- 取消 canceled -->
                                            <span style="color: #909399" v-else-if="item.state == 'canceled'">已取消</span>
                                            <!-- 上传失败 -->
                                            <span style="color: #F56C6C" v-else-if="item.state == 'error'">上传失败</span>
                                        </div>
                                    </template>
                                </el-progress>
                                <div>
                                    {{formatSize(item.FileSize)}} 
                                    <span v-if="item.state == 'uploading'" style="margin-right: 4px;">上传速度：{{formatSize(item.speed)}}/s</span> 
                                    <span  v-if="item.state == 'uploading' && item.completeTime && item.completeTime > 0">预计完成时间：{{formatSurplusTime(item.completeTime || 0)}}</span>
                                </div>
                            </div>
                            <div class="item-action">
                                <span title="删除记录" v-if="item.state == 'success'" @click="handleDeleteLog(item,index)">
                                    <el-icon color="#409EFF" :size="18">
                                        <Delete />
                                    </el-icon>
                                </span>
                                <span title="暂停上传" v-else-if="item.state == 'uploading'" @click="handlePause(item,index)">
                                    <svg-icon color="#409EFF" :size="12" iconClass="video-pause"></svg-icon>
                                </span>
                                <span title="继续上传" v-else-if="item.state == 'paused'" @click="handlePlay(item,index)">
                                    <svg-icon color="#409EFF" :size="12" iconClass="video-play"></svg-icon>
                                </span>
                                <span title="继续上传" v-else-if="item.state == 'error'" @click="handleErrorPlay(item,index)">
                                    <svg-icon color="#409EFF" :size="12" iconClass="video-play"></svg-icon>
                                </span>
                                <span title="取消上传" v-if="item.state !== 'success'" @click="handleClose(item,index)">
                                    <el-icon color="#409EFF" :size="18">
                                        <Close />
                                    </el-icon>
                                </span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <Empty style="height:300px;" :image-size="60" image="https://xinyue-public-new.oss-cn-hangzhou.aliyuncs.com/web_static_resources/yueliu/icon/light-chuanshu-xs.png"
                            description="暂无记录" />
                    </template>
                </el-scrollbar>
                <div class="popover-footer" v-if="uploadList.length > 0">
                    <div>
                        <span v-if="uploadStatus == 'uploading'">正在上传{{success_length}}/{{uploadList.length}}</span>
                        <span v-else>上传成功{{success_length}}项</span>
                    </div>
                    <el-button type="text" @click="handleAllCancel" v-if="uploadStatus == 'uploading'">全部取消</el-button>
                </div>
            </template>
        </el-popover>
    </div>
</template>
<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import { formatSize , formatSurplusTime } from '@/utils/tool.js'
import { useStore } from "vuex";
import { ElMessageBox } from "element-plus"
import { useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const popoperRef = ref();
const popoverMenuShow = ref(false);
const popoverShow = ref(false);


const onShow = () => {
    popoverShow.value = true;
}
const onHide = () => {
    popoverShow.value = false;
}

const handleClickOther = () => {
    popoverMenuShow.value = !popoverMenuShow.value;
}
const handleDropdownBlur = () => {
    popoverMenuShow.value = false;
}



// 上传列表
const uploadList = computed(() => {
    var list = store.state.upload.listData;
    // handleStartUpload();
    return list;
})
// 上传成功的文件
const success_length = computed(() => {
    const arr = uploadList.value.filter(item => item.state == 'success')
    return arr.length
});

const progressTotal = computed(()=>{
    const length = uploadList.value.length;
    const total = uploadList.value.reduce((sum,item)=>{
        return item.percent + sum;
    },0)
    return parseInt((total / (100 * length)) * 100)
})


// 监听上传列表变化
watch(() => store.state.upload.listData, (NV, OV) => {
    if (NV.length > OV.length) {
        handleStartUpload();
        if (!popoverShow.value) {
            popoperRef.value.tooltipRef.onOpen();
        }
    }
})

// watch(success_length,(NV,OV)=>{
//     if(NV > OV){
//         onCompleteUpload()
//     }
// })

let uploadItem = null;
let loadingUpload = false;
let clearTime = null;
// 列表上传状态
const uploadStatus = ref('complete');
const onCompleteUpload = async () => {
    // uploadStatus.value = 'complete';
    for (const item of uploadList.value) {
        const path = `/project/index/${item.projectId}/file`;
        if (route.path == path && item.state == 'success') {
            try {
                if (loadingUpload) { return }
                loadingUpload = true
                await store.dispatch("project/handleGetFiles");
                await store.dispatch("project/handleGetFolders");
                loadingUpload = false
            } catch (err) {
                loadingUpload = false
            }
            return
        }
    }
}

// 上传开始
const handleStartUpload = (item) => {
    if (uploadStatus.value == 'paused') return
    let isComplete = true;
    if (!item) {
        for (var key in uploadList.value) {
            if (uploadList.value[key].state == 'uploading' || uploadList.value[key].state == 'checking') {
                isComplete = false
                item = null;
                uploadItem = uploadList.value[key];
                break;
            } else if (uploadList.value[key].state == 'awaiting') {
                isComplete = false
                item = uploadList.value[key];
                uploadItem = uploadList.value[key];
                break;
            }
        }
    } else { isComplete = false; }

    if (isComplete) {
        // console.log('上传完成')
        uploadStatus.value = 'complete';
        window.onbeforeunload = null;
        // onCompleteUpload();
        return
    }
    uploadStatus.value = 'uploading'
    window.onbeforeunload = handleBeforeunload
    if (!item) { return }
    item.on('complete', () => {
        handleStartUpload();
        if (clearTime) {
            clearTimeout(clearTime);
            clearTime = null;
        }
        clearTime = setTimeout(() => {
            onCompleteUpload();
        }, 1500)
    });
    item.uploadFile();
}

const handleBeforeunload = (e) => {
    e.preventDefault();
    return true
}

// 删除上传记录
const handleDeleteLog = (item, index) => {
    store.commit('upload/delFileList', index);
}
// 暂停
const handlePause = (item) => {
    item.handlePause();
    handleStartUpload();
}
// 开始
const handlePlay = (item) => {
    for (var file of uploadList.value) {
        if (file.state == 'uploading' || file.state == 'checking') {
            item.handlePause();
            break;
        }
    }
    if (item.state == 'awaiting') {
        handleStartUpload(item);
    } else {
        item.handlePlay();
    }
}
// 开始
const handleErrorPlay = (item) => {
    item.handlePlay();
}
// 关闭
const handleClose = (item, index) => {
    item.handleCancel();
    store.commit('upload/delFileList', index);
    handleStartUpload();
}

// 清除已完成记录
const handleClearComplete = () => {
    const list = uploadList.value.filter(el => el.state !== 'success')
    store.commit('upload/SET_LIST_DATA', list);
    popoverMenuShow.value = false;
}

// 全部取消
const handleAllCancel = () => {
    if (uploadItem && uploadStatus.value == 'uploading') {
        uploadStatus.value = 'paused';
        uploadItem.handlePause();
    }
    const title = '提示';
    const text = '列表中有未上传的文件，你要放弃上传吗？'
    ElMessageBox.confirm(text, title, {
        customClass: 'messageBox-custom-warning',
        confirmButtonText: '放弃上传',
        cancelButtonText: '继续上传',
        type: 'warning',
        showClose: true,
        center: true,
    }).then(() => {
        const list = uploadList.value.filter((item, index) => {
            if (uploadList.value[index].state === 'success') {
                return true;
            } else {
                item.handleCancel();
                return false;
            }
        })
        store.commit('upload/cancelAllUpload', list);
        handleStartUpload();
    }).catch(err => {
        uploadStatus.value = 'uploading'
        if (uploadItem.state == 'paused') {
            uploadItem.handlePlay();
        } else {
            handleStartUpload();
        }
    })
}



// 进度条颜色
const onProgressColor = (state) => {
    switch (state) {
        case 'success':
            return '#67c23a'
        case 'uploading':
            return '#409eff'
        case 'checking':
            return '#409eff'
        case 'awaiting':
            return '#409eff'
        case 'paused':
            return '#a0cfff'
        case 'canceled':
            return '#909399'
        case 'error':
            return '#F56C6C'
    }
}

</script>
<style>
.custom-popoper {
    padding: 0 !important;
}
</style>
<style scoped lang="scss">
.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 5;
}
.transfer-container {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    // padding: 0 10px;
    cursor: pointer;
    .icon-box {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #21222b;
        border-radius: 10px;
        &:deep(.el-progress){
            .el-progress__text{
                min-width: 26px;
                font-size: 8px;
                color: white;
                transform: scale(.9) translate(0,-50%);
            }
            path:first-child{
                stroke: #0A0B0D !important;
            }
        }
    }
}
.popover-header {
    font-size: var(--el-popover-title-font-size);
    padding: var(--el-popover-padding);
    border-bottom: 1px solid #eeeeee;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .desc {
        transform: rotate(90deg);
        cursor: pointer;
        position: relative;
    }
    .dropdown-menu {
        position: absolute;
        bottom: -20px;
        right: 20px;
        background: white;
        box-shadow: var(--el-box-shadow-light);
        font-size: 14px;
        border-radius: var(--el-popover-border-radius);
        transition: all 0.1s ease;
        transform-origin: 100% 0;
        z-index: 1;
        &.open {
            transform: scale(1);
        }
        &.close {
            transform: scale(0);
        }
        .menu-item {
            cursor: pointer;
            padding: 0 14px;
            height: 40px;
            line-height: 40px;
            user-select: none;
            &:hover {
                background: #f4f4f5;
            }
        }
    }
}
.popover-footer {
    font-weight: 400;
    color: var(--el-text-color-regular);
    font-size: 14px;
    padding: var(--el-popover-padding);
    border-top: 1px solid #eeeeee;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.upload-list-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: var(--el-popover-padding);
    transition: background 0.3s;
    &:hover {
        background: rgba(0, 0, 0, 0.025);
    }
    .item-type {
        flex-shrink: 0;
        text-align: center;
        line-height: 30px;
        width: 30px;
        height: 30px;
        overflow: hidden;
        border-radius: 30px;
        background: var(--el-color-primary-light-9);
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .item-data {
        flex-grow: 1;
        font-size: 10px;
        margin-right: 20px;
    }
    .item-status {
        color: #409eff;
        width: 80px;
        margin-left: 10px;
        font-size: 12px;
        span {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
        }
    }
    .item-action {
        flex-shrink: 0;
        width: 70px;
        display: flex;
        span {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 30px;
            height: 30px;
            overflow: hidden;
            border-radius: 30px;
            background: var(--el-color-primary-light-9);
            cursor: pointer;
            margin-left: 5px;
        }
    }
}
</style>
