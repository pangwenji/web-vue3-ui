<template>
    <el-dialog v-model="visible" width="530px"  :close-on-press-escape="false" title="管理版本" :before-close="onBeforeClose" custom-class="dialog-center">
        <el-scrollbar height="300px" class="table-scrollbar-container" wrap-style="overflow-x:hidden;" v-loading="dialogLoading">
            <div style="position: relative; top:0;">
                <transition-group name="version-list" tag="div">
                    <div class="project-version-file" v-for="(item,index) in versionList" :key="item.id" :class="{dragAction:dragData&&dragData.id == item.id}" @mouseleave="handleMouseLeave(index)" @mouseover="handleMouseOver($event,index,item)" data-id="versionFile">
                        <div class="file-version">v{{item.version}}</div>
                        <div class="file-image">
                            <FileType v-if="item.fileCat == 'video' || item.fileCat == 'image'" type="url" :url="item.cover"></FileType>
                            <FileType :type="item.fileCat" v-else></FileType>
                            <!-- <div class="file-type-image" v-if="item.fileCat == 'image'">
                                <el-image :draggable="false" style="width:100%; height:100%" fit="fill" :src="item.cover"></el-image>
                            </div>
                            <div class="file-type-rar" v-else-if="item.fileCat == 'zip'"></div>
                            <div class="file-type-ppt" v-else-if="item.fileCat == 'ppt'"></div>
                            <div class="file-type-word" v-else-if="item.fileCat == 'word'"></div>
                            <div class="file-type-xlsx" v-else-if="item.fileCat == 'xlsx'"></div>
                            <div class="file-type-default" v-else></div> -->
                        </div>
                        <div class="file-content" v-if="fileNameInputIndex == index">
                            <el-input v-model="fileName" @blur="handleBlur(item)" :ref="getInputRef" placeholder="请输入文件名称"></el-input>
                        </div>
                        <div class="file-content" v-else @click="handleEditFileName(item,index)">
                            <div class="name">{{item.name}}</div>
                            <div class="time">{{getDateInterval(item.createTime)}}</div>
                        </div>
                        <div class="file-action">
                            <el-dropdown trigger="click">
                                <span class="close" v-if="!dragData"><el-icon><Close /></el-icon></span> 
                                <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleRelieveVersion(item)">解除单个版本</el-dropdown-item>
                                    <el-dropdown-item @click="handleDeleteVersion(item)">删除该文件</el-dropdown-item>
                                    <!-- <el-dropdown-item @click="handleEditFileName(item,index)">重命名</el-dropdown-item> -->
                                </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <span @mousedown="handleDragStart($event,index,item)" ><SvgIcon color="#3A3B3F" className="rank-icon" :iconClass="'rank'" /> </span> 
                        </div>
                    </div>
                </transition-group>
            </div>
        </el-scrollbar>
    </el-dialog>
    <div class="project-version-file shadown" :style="dragStyle" v-if="showDragEl">
        <div class="file-version">v{{dragData.version}}</div>
        <div class="file-image">
            <div class="file-type-image" v-if="dragData.fileCat == 'image'">
                <el-image :draggable="false" style="width:100%; height:100%" fit="fill" :src="dragData.cover"></el-image>
            </div>
            <div class="file-type-rar" v-else-if="dragData.fileCat == 'zip'"></div>
            <div class="file-type-ppt" v-else-if="dragData.fileCat == 'ppt'"></div>
            <div class="file-type-word" v-else-if="dragData.fileCat == 'word'"></div>
            <div class="file-type-xlsx" v-else-if="dragData.fileCat == 'xlsx'"></div>
            <div class="file-type-default" v-else></div>
        </div>
        <div class="file-content">
            <div class="name">{{dragData.name}}</div>
            <div class="time">{{getDateInterval(dragData.createTime)}}</div>
        </div>
        <div class="file-action">
            <span><SvgIcon color="#3A3B3F" className="rank-icon" :iconClass="'rank'" /> </span> 
        </div>
    </div>
</template>
<script>
import { getFileVersionList,updateVersionOrder ,renameFileObject, deleteFileVersion} from '@/api/project/files'
import { computed, defineComponent,nextTick,reactive,ref } from "vue";
import { ElMessage,ElMessageBox } from 'element-plus';
import { useStore } from 'vuex'
import SvgIcon from "@/components/SvgIcon"
import _ from "lodash"
import FileType from '@/components/FileType';

let projectId = null;
const components = {
    SvgIcon,
    FileType
}
const setup = (prop,{emit})=>{
    const store = useStore();
    const visible = ref(false);
    const fileName = ref('');
    const fileNameInputRef = ref();
    const fileNameInputIndex = ref(-1);
    const versionList = ref([]);
    const dialogLoading = ref(false);
    const onBeforeClose = (deno)=>{
        if(dialogLoading.value){
            return
        }
        if(typeof  deno == 'function'){
            deno();
        }else{
            visible.value = false;
        }
        versionList.value = [];
    }

    const getInputRef = (e)=>{
        fileNameInputRef.value = e;
    }

    const getFiles = ()=>{
        const length = store.state.project.breadcrumbs.length
        const tagData = store.state.project.breadcrumbs[length - 1];
        const project_id = tagData.projectId;
        const parent_id = tagData.parentId;
        store.dispatch("project/handleGetFiles",{project_id,parent_id})
    } 

    const handleEditFileName = (item,index)=>{
        const code = item.name.indexOf(item.suffix);
        fileName.value = item.name.substring(0, code);
        fileNameInputIndex.value = index;
        nextTick(() => {
            fileNameInputRef.value.focus();
        });
    }

        // 失去焦点时
    const handleBlur = (item)=>{
        const id = item.id;
        const name = fileName.value + item.suffix;
        fileNameInputIndex.value = -1;
        if (name == item.name) {
            return;
        }
        if (!fileName.value){
            ElMessage.error('文件名称不能为空');
            return
        }
        renameFileObject({ id, name }).then((res) => {
            item.name = fileName.value + item.suffix;
            ElMessage.success('修改成功！');
            if(item.version == versionList.length){
                getFiles()
            }
        });
    }

    // 拖拽开始
    const dragData = ref(null); //拖拽数据
    const showDragEl = ref(false);
    const dragStyle = ref({
        width: '100%',
        position:'fixed',
        top: 0,
        left: 0,
        width: '300px',
        'z-index': 100000,
        'pointer-events': 'none',
        'user-select': 'none',
        transform:'translate(0,0)'
    })

    let clientY = null;
    let clientX = null;
    let dragIndex = -1;
    let oldDragIndex = -1;
    let isMoveOver = false;
    const handleMouseMove = (e)=>{
        dragStyle.value.transform = `translate(${e.clientX-clientX}px,${e.clientY-clientY}px)`
        showDragEl.value = true;
    }
    const handleMouseUp = ()=>{
        showDragEl.value = false;
        document.removeEventListener('mousemove',handleMouseMove);
        document.removeEventListener('mouseup',handleMouseUp);
        var ids = versionList.value.map(item=>{
            return item.id;
        })
        if(oldDragIndex == ids.indexOf(dragData.value.id)){
            dragData.value = null;
            return
        }
        dragData.value = null;
        updateVersionOrder(ids).then(res=>{
            ElMessage.success("操作成功");
            versionList.value = versionList.value.map((item,index)=>{
                item.version = ids.length - index;
                return item;
            })
            getFiles()
        })
    }

    // 解除单个版本
    const handleRelieveVersion = (item)=>{
        const id = item.id;
        store.dispatch('project/removeFileVersion',{id}).then(res=>{
            const listData = versionList.value.filter(option=>{
                return option.id != id
            })
            versionList.value = listData.map((item,index)=>{
                item.version = listData.length - index 
                return item;
            })
            ElMessage.success('版本解除成功');
        });
    }
    // 删除文件
    const handleDeleteVersion = (item)=>{
        const id = item.id;
        const index = item.name.indexOf(item.suffix);
        const name = item.name.substring(0, index);
        const text = `确定要删除文件 “${name}”吗? 删除后,文件将被移至回收站!`;
        const title = `删除文件`
        ElMessageBox.confirm(text, title, {
            customClass: 'messageBox-custom-warning',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
            showClose:false,
            center: true,
            beforeClose: (action, instance, done)=>{
                if(action === 'confirm'){
                    instance.confirmButtonLoading = true
                    deleteFileVersion({id}).then(res=>{
                        const listData = versionList.value.filter(option=>{
                            return option.id != id
                        })
                        versionList.value = listData.map((item,index)=>{
                            item.version = listData.length - index 
                            return item;
                        })
                        ElMessage.success('删除成功');
                        getFiles();
                        done();
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

    const handleMouseLeave = (index)=>{
        if(index == dragIndex){
            return
        }
        isMoveOver = false;
    }

    // 拖拽移入
    const handleMouseOver = (e,index,item)=>{
        if(!showDragEl.value){
            return
        }
        if(index == dragIndex){
            return
        }
        if(isMoveOver){
            return
        }
        isMoveOver = true;
        const list = [].concat(versionList.value);
        const data = list.splice(dragIndex,1)[0];
        for(var key in list){
            if(list[key].id == item.id){
                if(key < dragIndex){
                    list.splice(parseInt(key),0,data)
                    dragIndex = parseInt(key); //2
                }else{
                    list.splice(parseInt(key) + 1,0,data)
                    dragIndex = parseInt(key) + 1;
                }
                break;
            }
        }
        versionList.value = list
    }
    //拖拽开始
    const handleDragStart = (e,index,item)=>{
        for(var option of e.path){
            if(option.dataset.id == 'versionFile'){
                const clientWidth = option.clientWidth;
                const clientHeight = option.clientHeight;
                dragStyle.value.width = String(clientWidth) + 'px';
                dragStyle.value.top = String(e.clientY - clientHeight + 37) + 'px';
                dragStyle.value.left = String(e.clientX - clientWidth + 27) + 'px';
                clientY = e.clientY;
                clientX = e.clientX;
                break;
            }
        }
        dragIndex = index;
        oldDragIndex = index;
        dragData.value = item;
        document.addEventListener('mousemove',handleMouseMove)
        document.addEventListener('mouseup',handleMouseUp)
    }


    const getDateInterval = (dateText)=>{
        const date = new Date(dateText);
        const toDate = new Date();
        const time = date.getTime();
        const toTime = toDate.getTime();
        const interval = (toTime - time)/1000;
        if(interval < 60){
            return interval + "秒前"
        }else if(interval < 60*60){
            return `${parseInt(interval/60)}分钟前`
        }else if(interval < 60*60*24){
            return `${parseInt(interval/(60*60))}小时前`
        }else{
            return `${parseInt(interval/(60*60*24))}天前`
        }
    }

    const open = (id)=>{
        if(dialogLoading.value){
            return
        }
        visible.value = true;
        projectId = id;
        dialogLoading.value = true;
        getFileVersionList({id}).then(res=>{
            dialogLoading.value = false;
            versionList.value = res.data;
        }).catch(err=>{
            dialogLoading.value = false;
            onBeforeClose();
        })
    }

    return {
        open,
        visible,
        dragData,
        fileName,
        dragStyle,
        handleBlur,
        showDragEl,
        getInputRef,
        versionList,
        dialogLoading,
        onBeforeClose,
        handleDragStart,
        getDateInterval,
        handleMouseOver,
        fileNameInputRef,
        handleMouseLeave,
        fileNameInputIndex,
        handleEditFileName,
        handleDeleteVersion,
        handleRelieveVersion,
    }
}

export default defineComponent({
    setup,
    components
})
</script>
<style>
.el-overlay-dialog{
    overflow: hidden;
}
</style>
<style scoped lang="scss">

@mixin file-bg-type ($type){
    .file-type-#{$type}{
        width: 100%;
        height: 100%;
        background: url('@/assets/images/#{$type}.png') no-repeat;
        background-size: contain;
        background-position: center center;
    }
}

.version-list-move{
    transition: transform  .2s ease;
}

.project-version-file{
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 8px;
    padding: 8px 0 ;
    font-size: 14px;
    background: white;
    color: #3A3B3F;
    &.shadown{
        box-shadow: var(--el-box-shadow-light);
    }
    // &.transition{
    //     transition: transform .1s ease;
    // }   
    &.dragAction{
        background: #F2F9FF;
        opacity: .6;
    }
    &:hover{
        background: #F2F9FF;
    }
    .file-version{
        flex-shrink: 0;
        padding: 0 16px;
        pointer-events: none;
        user-select: none;
    }
    .file-image{
        width: 86px;
        height: 54px;
        flex-shrink: 0;
        background: #1c1d24;
        margin-right: 8px;
        overflow: hidden;
        border-radius: 8px;
        pointer-events: none;
        user-select: none;
        // @include file-bg-type('rar');
        // @include file-bg-type('ppt');
        // @include file-bg-type('word');
        // @include file-bg-type('xlsx');
        // @include file-bg-type('default');
        .file-type-image{
            height:100%;
        }
    }
    .file-content{
        flex-grow: 1;
        overflow: hidden;
        color: #3A3B3F;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        user-select: none;
        .name{
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .time{
            opacity: .56;
        }
    }
    .file-action{
        padding: 0 16px;
        color: #3A3B3F;
        display: flex;
        align-items: center;
        .close{
            // padding: 4px;
            margin-top: 4px;
            margin-right: 8px;
            cursor: pointer;
            &:hover{
                opacity: .56; 
                // background: #eee;
            }
        }
        .rank-icon{
            color: #3A3B3F;
            width: 20px;
            height: 20px;
            cursor: move;
            &:hover{
                opacity: .56; 
            }
        }
    }
}
.table-scrollbar-container{
    margin-left:-10px;
    margin-right:-10px;
    &:deep(.el-scrollbar__bar.is-horizontal){
        display: none ;
    }
}
</style>