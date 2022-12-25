<template>
    <!-- 卡片风格 -->
    <el-col  :style="{maxWidth: width,flex:width?('0 0 ' + width + '%') : false}" style="margin-bottom: 20px;" v-if="prop.layoutType == 'card'" v-contextmenu:contextmenuRef>
        <div class="file-item-card" :class="{ dragAction, dragOverAction, 'files-folder': type == 'folder' }" :draggable="!showCheck && !showInput"  
            @mouseover="data['checkBox'] = true" @mouseleave="data['checkBox'] = false" @dragover.stop="handleDragOver" @dragstart="handleDragStart" @dragend="handleDragEnd"
            @dragleave="handleDragLeave" @drop="handleDrop">
            <div class="folder-icon " :class="{check:data['check'] || dragAction || dragOverAction }" v-if="type == 'folder'"></div>
            <div class="file-item-content" :class="{ check: data['check']}" @click.stop="handleGo">
                <div class="check-mask" @click.stop="handleCheck" v-if="showCheck"></div>
                <div class="file-check" :class="{ check: data['check'] }" @click.stop="handleCheck" v-if="data['checkBox'] || showCheck">
                    <el-icon class="icon">
                        <Check />
                    </el-icon>
                </div>
                <div class="version" v-if="data.version > 1">v{{ data.version }}</div>
                <div class="top-left-tag">
                    <div class="topping" v-if="data.top == 1">置顶</div>
                    <template v-for="(item,index) in reviewState" :key="index" >
                        <div class="state" v-if="data.reviewStatus > 0 && data.reviewStatus == item.value">
                            <Point :type="item.type"></Point>
                            <span>{{item.name}}</span>  
                        </div>
                    </template>
                    <div class="collect" v-if="data.flag&&data.flag.indexOf('collect') > -1" >收集 </div>
                    <div class="collect" v-if="data.codingStatus == 1" >转码中</div>
                    <div class="collect" v-if="data.codingStatus == 3" >转码失败</div>
                </div>
                <div class="file-item-cover file-item-video" v-if="type == 'video'"  @mousemove="handleMouseMoveVideo">
                    <div class="sprite" :style="{width:`${viewWidth}px`,height:`${viewHeight}px`, 'background-image': 'url(' + data.spriteImage + ')','background-position-y': ('-' + String(offsetY) + 'px')}"></div>
                    <div class="cover" :style="{'background-image':`url(${data.cover})`}"></div>
                    <div class="time">{{secondToDate(data.duration)}}</div>
                    <div class="mark" v-if="data.antiScreenRecording || data.projectAntiScreenRecording">防</div>
                    <div class="play"> <el-icon> <VideoPlay /> </el-icon></div>
                    <div class="progress"> <div :style="{ width: String(percentage) + '%' }" class="progress-outer"></div></div>
                </div>
                <div class="file-item-cover file-item-image" v-else-if="type == 'image'">
                    <FileType type="url" fit="cover" :url="data.cover"></FileType>
                </div>
                <div class="file-item-cover file-item-bg file-item-audio" v-else-if="type == 'audio'">
                    <div class="type-image">
                        <FileType :type="type"></FileType>
                    </div>
                    <div class="time">{{secondToDate(data.duration)}}</div>
                    <!-- <div class="version" v-if="data.version > 1">v{{data.version}}</div> -->
                </div>
                <div class="file-item-cover file-item-folder" v-else-if="type == 'folder'">
                    <div class="left" style="padding: 4px;">
                        <template v-if="folderPreview(data.cover)[0]">
                            <FileType :type="folderPreview(data.cover)[0].t === 'suffix' ? folderPreview(data.cover)[0].v : folderPreview(data.cover)[0].t" :url="folderPreview(data.cover)[0].v" ></FileType>
                        </template>
                    </div>
                    <div class="right">
                        <div class="right-top">
                            <template v-if="folderPreview(data.cover)[1]">
                                <FileType :type="folderPreview(data.cover)[1].t === 'suffix' ? folderPreview(data.cover)[1].v : folderPreview(data.cover)[1].t" :url="folderPreview(data.cover)[1].v" ></FileType>
                            </template>
                        </div>
                        <div class="right-bottom">
                            <template v-if="folderPreview(data.cover)[2]">
                                <FileType :type="folderPreview(data.cover)[2].t === 'suffix' ? folderPreview(data.cover)[2].v : folderPreview(data.cover)[2].t" :url="folderPreview(data.cover)[2].v" ></FileType>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="file-item-cover file-item-bg file-item-documen" v-else>
                    <div class="type-image">
                        <FileType :type="type"></FileType>
                    </div>
                    <div class="edit" v-if="data.isEditable&&projectData.status != 2">可编辑</div>
                </div>
                <div class="file-item-info" @click.stop="false">
                    <div class="avatar">
                      <el-image :draggable="false" fit="cover" style="width:100%;height:100%;" :src="data.user?.avatar"></el-image>
                    </div>
                    <div class="detail" v-show="!showInput">
                        <div @click.stop="handleInput(data.name, data.suffix)" class="title" :title="data.name">
                            {{ data.name }}
                        </div>
                        <div class="desc" v-if="!dragOverAction">
                            <span v-if="type !== 'folder'">{{formatSize(data.size)}}</span>
                            <!-- <span class="spot" v-if="type == 'folder' || !data.isEditable"></span> -->
                            <!-- <span class="comment" title="文件" v-if="type == 'folder'"> {{data.fileQuantity}}个文件 </span> -->
                            <span class="comment" title="文件" v-if="type == 'folder'"> {{data.createTime.slice(0,10)}} </span>
                            <span class="comment" title="评论" v-else-if="!data.isEditable">
                                <el-icon>
                                    <ChatLineRound />
                                </el-icon>
                                <span style="margin-left: 2px">{{data.commentCount}}</span>
                            </span>
                        </div>
                        <div v-else style="color: #3468FE">
                            <span v-if="type == 'folder'">移入此文件夹</span>
                            <span v-else>添加为新版本</span>
                        </div>
                    </div>
                    <div class="menu-open" v-show="!showInput" @click.stop="false" v-contextmenu:contextmenuRef="{ trigger: 'click' }">
                        <el-icon>
                            <MoreFilled />
                        </el-icon>
                    </div>
                    <div class="input-box" v-show="showInput" @click.stop="false" @dbclick.stop="false">
                        <el-input v-model="InputValue" @blur="handleBlur" ref="inputText" placeholder="请填写文件名称"></el-input>
                    </div>
                </div>
            </div>
        </div>
    </el-col>

    <!-- 列表风格 -->
    <el-col v-else :span="24" class="file-table-tr" :class="{ dragAction, dragOverAction,check:data['check']}" @click.stop="handleGo"  @mouseover="data['checkBox'] = true"
        @mouseleave="data['checkBox'] = false" :draggable="!showCheck && !showInput" @dragover="handleDragOver" @dragstart="handleDragStart" @dragend="handleDragEnd" @dragleave="handleDragLeave" @drop="handleDrop"
        v-contextmenu:contextmenuRef>
        <div class="check-mask" v-if="showCheck" :class="{ check: data['check'] }"  @click.stop="handleCheck"></div>
        <div class="file-table-td file-name" style="position: relateve; z-index: 9" :style="{width:type=='folder'?'51%':'41%'}">
            <div class="file-check" :class="{ check: data['check'] }" @dblclick.stop="false" @click.stop="handleCheck" v-if="data['checkBox'] || showCheck">
                <el-icon class="icon">
                    <Check />
                </el-icon>
            </div>
            <div class="file-cover">
                <FileType type="url" fit="cover" :url="data.cover"  v-if="type !== 'folder' && data.cover" ></FileType>
                <FileType :type="type" v-else ></FileType>
            </div>
            <div class="info">
                <div class="title" v-show="!showInput" >
                    <span class="topping" v-if="data.top">置</span>
                    <span class="version" v-if="data.version > 1">v{{data.version}}</span>
                    <span class="name" @click.stop="handleInput(data.name, data.suffix)" :title="data.name">{{ data.name }}</span>
                </div>
                <div class="title" v-show="showInput" @click.stop="false" @dbclick.stop="false">
                    <el-input v-model="InputValue" @blur="handleBlur" ref="inputText"  placeholder="请输入文件名"></el-input>
                </div>
                <div class="comment">
                    <span v-if="!dragOverAction">
                      <!-- <span v-if="type == 'folder'">{{data.fileQuantity}}个文件</span>   -->
                      <span style="height:20px;" v-if="type !== 'folder' && !data.isEditable">{{data.commentCount}}条评论</span>  
                    </span>
                    <span v-else style="color: #3468FE">添加为新版本</span>
                </div>
            </div>
        </div>
        <template v-for="(item,index) in reviewState" :key="index" >
            <div class="file-table-td" style="width: 10%" v-if="type != 'folder'&&item.value == data.reviewStatus" >
                <span v-if="data.reviewStatus > 0">{{item.name}}</span>  
                <span v-else>--</span>
            </div>
        </template>
        <div class="file-table-td" style="width: 10%">
            <span v-if="type == 'folder'">{{data.flag&&data.flag.indexOf('collect') > -1?'收集文件夹':'文件'}}</span>
            <span v-else-if="data.fileCat == 'other'">{{data.suffix || '--'}}</span>
            <span v-else>{{data.suffix || '--'}}</span>
        </div>
        <div v-if="type == 'folder'" class="file-table-td" style="width: 10%"><span>-</span></div>
        <div v-else class="file-table-td" style="width: 10%"><span>{{formatSize(data.size)}}</span></div>
        <div class="file-table-td" style="width: 10%"><span>{{data.user?.nickName}}</span></div>
        <div class="file-table-td" style="width: 14%"><span>{{data.createTime}}</span></div>
        <div class="file-table-td file-action" style="width: 5%">
            <span v-contextmenu:contextmenuRef="{ trigger: 'click' }">
                <el-icon>
                    <MoreFilled />
                </el-icon>
            </span>
        </div>
    </el-col>
    <v-contextmenu :disabled="selectLength > 1" :width="140" ref="contextmenuRef">
        <v-contextmenu-item @click="handleGo">
            <svg-icon iconClass="icon_view" :size="20" ></svg-icon>
            查看详情
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleTopping">
            <svg-icon iconClass="icon_topping" :size="20" ></svg-icon>
            {{data.top?'取消置顶':'置顶'}}
        </v-contextmenu-item>
        <v-contextmenu-item v-if="type == 'folder' && data.flag && data.flag.indexOf('collect') > -1" @click="handleCollection">
           <svg-icon iconClass="icon_faqishouji" :size="20" ></svg-icon>
           发起收集
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleShare" :disabled="!authRule('share')">
            <svg-icon iconClass="icon_sharing" :size="20" ></svg-icon>
            分享
        </v-contextmenu-item>
        <v-contextmenu-item v-if="type != 'folder'">
            <svg-icon iconClass="icon_shezhi" :size="20" ></svg-icon>
            审阅状态
            <template #sub>
                <div class="project-file-state-box">
                    <div class="project-file-state-item" @click.stop="setFileReviewStatus(item.value)" v-for="(item,index) in reviewState" :key="index">
                         <Point :type="item.type"></Point>
                        {{item.name}}
                    </div>
                </div>
            </template>
        </v-contextmenu-item>
        <v-contextmenu-item v-if="type != 'folder'">
            <svg-icon iconClass="icon_banben" :size="20" ></svg-icon>
            版本管理
             <template #sub>
                <div class="project-file-state-box">
                    <div class="project-file-state-item" @click.stop="emit('onUploadVersion',{id:data.id})">
                        上传版本
                    </div>
                    <div class="project-file-state-item" v-if="data.version > 1" @click.stop="handleManageVision">
                        版本管理
                    </div>
                    <div class="project-file-state-item" v-if="data.version > 1" @click.stop="handleRemoveFileVersion">
                        解除版本
                    </div>
                </div>
            </template>
        </v-contextmenu-item>
        <v-contextmenu-item v-if="type == 'video' " :disabled="data.projectAntiScreenRecording" @click="handleUploadRecording(data)">
            <svg-icon iconClass="icon_collection" :size="20" ></svg-icon>
            <template v-if="data.antiScreenRecording">
                关闭防录屏
            </template>
            <template v-else>
                开启防录屏
            </template>
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleDownload(data)" :disabled="!authRule('download')" v-if="type != 'folder'">
            <svg-icon iconClass="icon_download" :size="20" ></svg-icon>
            下载原件
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleCopyFile(data)" :disabled="!authRule('copy')">
            <svg-icon iconClass="icon_copy" :size="20" ></svg-icon>
            复制到
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleMoveFile(data)" :disabled="!authRule('copy')">
            <svg-icon iconClass="icon_move-to" :size="20" ></svg-icon>
            移动到
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleInput(data.name, data.suffix)">
            <svg-icon iconClass="icon_renamed" :size="20" ></svg-icon>
            重命名
        </v-contextmenu-item>
        <v-contextmenu-item @click="handleDeleteFile" divided :disabled="!authRule('delete')">
            <svg-icon iconClass="icon_delete" :size="20" ></svg-icon>
            删除
        </v-contextmenu-item>
    </v-contextmenu>
</template>
<script setup>
import { computed, nextTick, onUnmounted, reactive, ref } from "vue";
import { renameFileObject , setAntiScreenRecording, handleMoveTo, getFileDownloadUrl} from "@/api/project/files.js";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { download } from "@/utils/request.js"
import FileType from "@/components/FileType"
import { secondToDate,formatSize } from "@/utils/tool.js"
import { ElMessage } from "element-plus"

const router = useRouter();
const store = useStore();
const reviewState = [
    {
        name:'待审阅',
        type:'red',
        value:1
    },
    {
        name:'审阅中',
        type:'yellow',
        value:2
    },
    {
        name: '修改中',
        type: 'lightblue',
        value: 6
    },
    {
        name:'意见汇总完毕',
        type:'blue',
        value:4
    },
    {
        name:'通过',
        type:'green',
        value:3
    },
    {
        name:'未通过',
        type:'danger',
        value: 5
    },
    {
        name:'移除状态',
        type:'none',
        value:0
    },
];
const contextmenuRef = ref();
// const emit = defineEmits(['onManagerDialog']);
const projectData = computed(()=>{
    return store.state.project.projectData;
})
const authRule = (e)=>{
  if(projectData.value.currRoleId == 1){ // 所有者
    return true;
  }else if(projectData.value.currRoleId == 2){ // 管理员
    return projectData.value.permissions.adminPermissions.indexOf(e) > -1;
  }else{ // 成员
    return projectData.value.permissions.memberPermissions.indexOf(e) > -1;
  }
}

const prop = defineProps({
    data: {
        type: Object,
        default() {
            return {};
        },
    },
    width:{
        type: String,
        default: null
    },
    layoutType: {
        type: String,
        default: "card",
    },
    type: String,
    showCheck: {
        type: Boolean,
        default: false,
    },
    selectLength: {
        type: Number,
        default: 0
    }
});
const emit = defineEmits([
    "onShare",
    "onChange",
    "onCopyFiles",
    "onMoveFiles",
    "onOpenFolder",
    "onCollection",
    "onChangeRadio",
    "onManagerDialog",
    "onUploadVersion",
]);

const dragEvent = computed(() => {
    return store.state.app.dragEvent;
});
const dragData = computed(()=>{ //当前拖拽的文件
    return store.state.project.dragData;
})


const inputText = ref();
const InputValue = ref("");
const showInput = ref(false);


//跳转到详情
const handleGo = () => {
    if(prop.type == 'folder'){
        emit('onOpenFolder',prop.data)
    }else{
        // handleRadio()
        // prop.data['checkBox'] = false
        router.push({ path: "/file", query:{id: prop.data.id, projectId: prop.data.projectId, fileCat: prop.data.fileCat} });      
    }
};

/* 文件夹内容展示 */
const folderPreview = (cover)=>{
    if(cover){
        return JSON.parse(cover)
    }else{
        return [];
    }
}

/* 拖拽相关 */
const dragName = "project-list-item";
const dragAction = ref(false); //拖拽对象改变样式
const dragOverAction = ref(false); //拖拽进入当前对象改变样式
var timeOut = null;
// 拖拽进入
const handleDragOver = (e) => {
    if (dragEvent.value !== dragName) { //拖拽移入不是当前拖拽
        return;
    }
    if (dragAction.value) { //拖拽移入当前文件
        return;
    }
    if(dragData.value.type == 1 && prop.type != 'folder'){ 
        return;
    }
    // if(!authRule('copy') && prop.type == 'folder'){ //没有复制/移动的权限
    //     return
    // }
    e.preventDefault();
    if (timeOut) {
        clearTimeout(timeOut);
        timeOut = null;
    }
    dragOverAction.value = true;
};
// 拖拽离开
const handleDragLeave = (e) => {
    if (dragAction.value) {
        return;
    }
    e.preventDefault();
    if (timeOut) {
        return;
    }
    timeOut = setTimeout(() => {
        dragOverAction.value = false;
    }, 50);
};
//拖拽开始
const handleDragStart = (e) => {
    dragAction.value = true;
    store.commit("app/DRAG_EVENT", dragName);
    store.commit("project/SET_DRAG_DATA", prop.data);
};
//拖拽放入
const handleDrop = (e) => {
    if (dragOverAction.value) {
        const id = dragData.value.id;
        dragAction.value = false;
        dragOverAction.value = false;
        if(prop.type != 'folder'){
            const versionFileId = prop.data.id
            store.dispatch('project/handleSetFileAsVersion',{id,versionFileId}).then(res=>{
                store.commit("project/SET_DRAG_DATA", null);
                ElMessage.success("合并版本成功")
            })
        }else{
            const fileIds = [ id ]
            const directoryId = prop.data.id;
            const toProjectId = prop.data.projectId;
            const fromProjectId = dragData.value.projectId;
            handleMoveTo({fileIds,directoryId,toProjectId,fromProjectId}).then(res=>{
                if(dragData.value.type == 1){
                    store.dispatch("project/handleGetFolders");
                }else{
                    store.dispatch("project/handleGetFolders");
                    store.dispatch("project/handleGetFiles");
                }
                store.commit("project/SET_DRAG_DATA", null);
            }).catch(err => {
                ElMessage.error("合并失败！")
            })
        }
    }
};
// 拖拽结束
const handleDragEnd = (e) => {
    dragAction.value = false;
    dragOverAction.value = false;
};

/* 名称修改 */

// 点击名称进行修改
const handleInput = (name, suffix) => {
    const index = name.indexOf(suffix);
    InputValue.value = prop.type == 'folder'? name : name.substring(0, index);
    showInput.value = true;
    nextTick(() => {
        inputText.value.focus();
    });
};
// 失去焦点时
const handleBlur = () => {
    const id = prop.data.id;
    const name = InputValue.value + prop.data.suffix;
    if (name == prop.data.name) {
        showInput.value = false;
        return;
    }
    if (!InputValue.value){
        showInput.value = false;
        ElMessage.error('文件名不能为空');
        return
    }
    renameFileObject({ id, name }).then((res) => {
        prop.data.name = InputValue.value + prop.data.suffix;
        showInput.value = false;
        ElMessage.success('修改成功！');
    });
};

/* 选择相关 */

// 点击选择check
const handleCheck = () => {
    emit("onChange", prop.data);
};
// 单选
const handleRadio = () => {
    prop.data["check"] = true;
    emit("onChangeRadio", prop.data);
};

// 鼠标移动时计算雪碧图
const offsetY = ref(0);
const viewWidth = ref(0);
const viewHeight = ref(0);
const percentage = ref(0);
const handleMouseMoveVideo = (e) => {
    const spriteImageInfo = JSON.parse(prop.data.spriteImageInfo||'{}');
    const imageWidth = spriteImageInfo.width || 240;    //雪碧图每一帧的宽度
    const imageHeight = spriteImageInfo.height || 6750; //雪碧图每一帧的高度
    const offsetX = e.offsetX;
    const offsetWidth = e.target.getBoundingClientRect().width.toFixed(2); //展示窗口宽度
    const offsetHeight = e.target.getBoundingClientRect().height.toFixed(2); //展示窗口高度
    const imageScale = imageWidth/imageHeight;
    const offsetScale = offsetWidth/offsetHeight;
    if(imageScale > offsetScale){
        viewWidth.value = offsetWidth;
        viewHeight.value = viewWidth.value/imageScale;
    }else{
        viewHeight.value = offsetHeight;
        viewWidth.value = imageScale*viewHeight.value;
    }

    const N = 100; //数量
    const NS = offsetWidth / N;
    const steep = offsetWidth / 100;
    offsetY.value = viewHeight.value * Math.round(offsetX / NS);
    percentage.value = offsetX / steep; //得到当前进度
};


// 菜单相关
//发起收集
const handleCollection = ()=>{
    const id = prop.data.collectId;
    emit('onCollection',{id})
}
//置顶
const handleTopping = ()=>{
    const id = prop.data.id;
    const top = prop.data.top ? 0:1;
    const type = prop.type;
    store.dispatch('project/updateTopFileObject',{id,top,type}).then(res=>{
        if(top == 1){
            ElMessage.success('置顶成功！');
        }else{
            ElMessage.success('取消置顶成功');
        }
    });
}
//设置审阅状态
const setFileReviewStatus = (reviewStatus)=>{
    const id = prop.data.id;
    contextmenuRef.value.onBlur()
    store.dispatch('project/setFileReviewStatus',{id,reviewStatus}).then(res=>{
        prop.data['reviewStatus'] = reviewStatus;
        ElMessage.success('设置成功！');
    });
}

// 设置访录屏状态
const handleUploadRecording = (e)=>{
    const id = e.id;
    const antiScreenRecording = e.antiScreenRecording == 1? 0:1
    setAntiScreenRecording({id,antiScreenRecording}).then(res=>{
        e.antiScreenRecording = antiScreenRecording;
    })
}

// 复制到
const handleCopyFile = (e)=>{
    emit('onCopyFiles',e);
}

// 移动到
const handleMoveFile = (e)=>{
    emit('onMoveFiles',e);
}

// 分享
const handleShare = ()=>{
    emit('onShare', prop.data);
}
// 下载源文件
const handleDownload = async (e)=>{
    const params = {
        projectId: projectData.value.id,
        list: [{
            id: e.id,
            filename: e.name
        }]
    }
    const result = await getFileDownloadUrl(params)
    download(result.data[0]?.downloadUrl)
}

// 删除文件
const handleDeleteFile = ()=>{
    const id = prop.data.id;
    const typeName = prop.type == 'folder'?'文件夹':'文件';
    const index = prop.data.name.indexOf(prop.data.suffix);
    const name = prop.type == 'folder'? prop.data.name : prop.data.name.substring(0, index);
    store.dispatch('project/handleDeleteFile',{id,name,typeName,type:prop.data.type,version:prop.data.version }).then(res=>{
        ElMessage.success('删除成功')
    })
}

// 版本管理
const handleManageVision = ()=>{
    contextmenuRef.value.onBlur()
    emit('onManagerDialog',{id:prop.data.id})
}

// 解除版本
const handleRemoveFileVersion = ()=>{
    const id = prop.data.id;
    contextmenuRef.value.onBlur()
    store.dispatch('project/removeAllFileVersion',{id}).then(res=>{
        ElMessage.success('所有版本解除成功');
    });
}


</script>
<style scoped lang="scss">
.project-file-state-box{
    width: 140px;
    padding: 5px;
    .project-file-state-item{
        padding: 5px;
        display: flex;
        border-radius: 6px;
        cursor: pointer;
        align-items: center;
        &:hover{
            background: #f4f4f5;
        }
    }
}
.file-table-tr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    border-radius: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 5px 0;
    border: 1px solid transparent;
    position: relative;
    cursor: pointer;
    // background: #272830;

    &.dragAction {
        border-width: 1px;
        border-style: solid;
        border-color: #3468FE;
        opacity: 0.6;
    }

    &.dragOverAction {
        // .file-item-content{
        //   border-color: #6D75FF;
        // }
        border-width: 1px;
        border-style: solid;
        border-color: #3468FE;
    }

    // .check-mask {
    //     width: 100%;
    //     position: absolute;
    //     height: 100%;
    //     left: 0px;
    //     top: 0px;
    //     border-radius: 10px;
    //     border: 1px solid #A0A0A0;
    //     cursor: pointer;
    //     z-index: 2;


    // }
    &.check {
        border-color: #2C40EE;
    }

    &:hover {
        // color: #6D75FF;
        border-color: #2C40EE;
    }

    .file-table-td {
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #BEC0CD;
        & > span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &.file-action {
            text-align: center;
            &:hover {
                color: #3468FE;
                cursor: pointer;
            }
        }

        &.file-name {
            display: flex;
            align-items: center;
            overflow: hidden;

            .file-check {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                border-radius: 24px;
                margin-right: 10px;
                font-size: 20px;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                position: absolute;
                top: 4px;
                left: 4px;
                z-index: 3;
                border: 2px solid rgba($color: #ffffff, $alpha: 0.5);
                background: rgba(0, 0, 0, 0.3);
                transition: all 0.3s;

                &:hover {
                    border-color: rgba($color: #ffffff, $alpha: 0.9);
                    background: rgba(0, 0, 0, 0.5);
                }

                .icon {
                    display: none;
                }

                &.check {
                    border-color: #3468FE;
                    background: #3468FE;
                    .icon {
                        display: inline-block;
                    }
                }
            }

            .file-cover {
                width: 40px;
                height: 40px;
                border-radius: 4px;
                margin-right: 10px;
                overflow: hidden;
                flex-shrink: 0;
                background-size: 100% 100%;
                background-repeat: no-repeat;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .info {
                // max-width: 250px;
                height: 40px;
                overflow: hidden;
                align-self: stretch;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;

                .title {
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #BEC0CD;
                    span:last-child {
                        display: inline;
                    }
                    .topping{
                        color: white;
                        // opacity: .5;
                        border-radius: 5px;
                        background: #FF7A12;
                        padding: 2px 5px;
                        margin-right: 4px;
                        font-size: 8px;
                    }
                    .version {
                        background: rgba($color: #000000, $alpha: .5);
                        color: white;
                        border-radius: 2px;
                        padding: 0 3px;
                        margin-right: 5px;
                    }
                }

                .comment {
                    color: #9094A6;
                    font-size: 12px;
                }
            }
        }
    }
}

.file-item-card {
    width: 100%;
    // height: 100%;
    &.files-folder {
        position: relative;
        height: calc(100% - 15px);
        .file-item-content {
            border-radius: 0 8px 8px;
            margin-top: 14px;
        }
        .folder-icon {
            width: 34%;
            height: 14px;
            border-radius: 8px 0 0 0;
            position: absolute;
            top: 1px;
            background: #272830;
            border: 1px solid #272830;
            z-index: 2;
            &::after {
                content: "";
                width: 28px;
                height: 14px;
                border-color: transparent transparent #272830 #272830;
                border-style: solid;
                border-width: 7px 14px;
                box-sizing: border-box;
                position: absolute;
                right: -28px;
                
            }
            &::before{
                content: "";
                width: 28px;
                height: 1px;
                background: #272830;
                position: absolute;
                right: -27px;
                top: 6px;
                transform: rotate(28deg);
                z-index: 2;
            }
            &.check{
                border-left-color: #3468FE;
                border-top-color: #3468FE;
                &::before{
                    background: #3468FE;
                }
            }
        }
    }
    position: relative;
    // overflow: hidden;
    // margin-bottom: 20px;
    // margin-top: 20px;
    &.dragAction {
        // border-color: #6D75FF;
        opacity: 0.6;

        .file-item-content {
            border-color: #3468FE;
        }
    }

    &.dragOverAction {
        .file-item-content {
            border-color: #3468FE;
        }
    }

    &::after {
        content: "";
        display: inline-block;
        width: 100%;
        margin-top: 84%;
    }

    .file-item-content {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #272830;
        cursor: pointer;
        background: #272830;

        &.check {
            border-color: #3468FE;
        }

        .check-mask {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            top: 0;
            left: 0;
        }

        .file-check {
            position: absolute;
            top: 4px;
            left: 4px;
            width: 24px;
            height: 24px;
            border-radius: 24px;
            z-index: 3;
            font-size: 20px;
            color: white;

            // background: #6D75FF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            // box-sizing: border-box;
            cursor: pointer;
            border: 2px solid rgba($color: #ffffff, $alpha: 0.5);
            background: rgba(0, 0, 0, 0.3);
            transition: all 0.3s;

            &:hover {
                border-color: rgba($color: #ffffff, $alpha: 0.9);
                background: rgba(0, 0, 0, 0.5);
            }

            .icon {
                display: none;
            }

            &.check {
                border-color: #3468FE;
                background: #3468FE;

                .icon {
                    display: inline-block;
                }
            }
        }

        &:hover{
            .version{
                display: none;
            }
            .time{
                display: none;
            }
            .mark{
                display: none;
            }
            .top-left-tag{
                display: none;
            }
        }
        .version {
            font-size: 12px;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            position: absolute;
            top: 10px;
            right: 6px;
            padding: 3px 5px;
            z-index: 3;
            pointer-events: none;
            user-select: none;
        }
        .top-left-tag {
            font-size: 12px;
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: 2;
            display: flex;
            align-items: center;
            pointer-events: none;
            user-select: none;
            .topping{
                color: white;
                // opacity: .5;
                border-radius: 5px;
                background: #FF7A12;
                padding: 2px 5px;
                margin-right: 4px;
            }
            .state{
                display: flex;
                color: white;
                // opacity: .5;
                background: rgba($color: #000000, $alpha: .5);
                border-radius: 5px;
                margin-right: 4px;
                padding: 4px 8px 4px 2px;
            }
            .collect{
                color: white;
                border-radius: 5px;
                // opacity: .5;
                background: rgba($color: #000000, $alpha: .5);
                padding: 2px 5px;
                margin-right: 4px;
            }
        }

        .file-item-cover {
            width: 100%;
            height: 69%;
            position: relative;
            background: #1c1d24;
            pointer-events: none;
            user-select: none;
            &.file-item-audio {
                // overflow: hidden;
                font-size: 12px;
                color: white;

                .time {
                    padding: 2px 4px;
                    border-radius: 5px;
                    background: rgba(0, 0, 0, 0.49);
                    position: absolute;
                    bottom: 6px;
                    // z-index: 2;
                    left: 6px;
                }
            }

            &.file-item-image {
                overflow: hidden;
                pointer-events: none;
                user-select: none;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            &.file-item-documen {
                color: white;
                font-size: 12px;
                .edit {
                    padding: 2px 4px;
                    border-radius: 5px;
                    background: rgba(0, 0, 0, 0.49);
                    position: absolute;
                    bottom: 6px;
                    // z-index: 2;
                    left: 6px;
                }
            }
            &.file-item-bg {
                // background-image: url("@/assets/images/type-bg.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                pointer-events: none;
                user-select: none;
                .type-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    padding: 13% 10%;
                }
            }

            // background: #000;
            &.file-item-folder {
                padding: 4px 2px;
                display: flex;
                background: none;
                *{
                    pointer-events: none;
                    user-select: none;
                }
                .left {
                    width: 50%;
                    height: 100%;
                    margin: 0 2px;
                    flex-grow: 1;
                    border-radius: 2px;
                    background: #1c1d24;
                    overflow: hidden;
                }

                .right {
                    width: 50%;
                    overflow: hidden;
                    height: 100%;
                    flex-grow: 1;
                    margin: 0 2px;
                    // border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    div {
                        width: 100%;
                        border-radius: 2px;
                    }

                    &-top {
                        flex-grow: 1;
                        overflow: hidden;
                        background: #1c1d24;
                        margin-bottom: 2px;
                        height: 50%;
                    }

                    &-bottom {
                        height: 50%;
                        flex-grow: 1;
                        overflow: hidden;
                        background: #1c1d24;
                        margin-top: 2px;
                    }
                }
            }

            &.file-item-video {
                position: relative;
                font-size: 12px;
                color: white;
                background: black;
                cursor: pointer;
                pointer-events: auto;
                user-select: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                // background-position: 0px 4% ;
                *{
                    pointer-events: none;
                    user-select: none;
                }
                .sprite{
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-size: 100% auto;
                    
                }
                &:hover {
                    & .cover {
                        display: none;
                    }

                    & .time {
                        display: none;
                    }

                    & .play {
                        display: none;
                    }

                    & .version {
                        display: none;
                    }

                    & .mark {
                        display: none;
                    }

                    & .progress {
                        display: block;
                    }
                }

                .cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    bottom: 0px;
                    left: 0px;
                    top: 0;
                    background-repeat: no-repeat;
                    background-size: 100% auto;
                }

                .time {
                    padding: 2px 4px;
                    border-radius: 5px;
                    background: rgba($color: #000000, $alpha: 0.2);
                    position: absolute;
                    bottom: 3px;
                    left: 3px;
                }

                .progress {
                    position: absolute;
                    bottom: 6px;
                    height: 2px;
                    width: 95%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba($color: #ffffff, $alpha: 0.2);
                    pointer-events: none;
                    display: none;

                    .progress-outer {
                        width: 100%;
                        height: 100%;
                        background: rgba($color: #ffffff, $alpha: 0.6);
                    }

                    // opacity: 0.5;
                }

                .play {
                    // width: 30px;
                    // height: 30px;
                    font-size: 30px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    user-select: none;
                    pointer-events: none;
                }

                .mark {
                    width: 22px;
                    height: 22px;
                    background: rgba($color: #ffffff, $alpha: 0.2);
                    text-align: center;
                    line-height: 24px;
                    border-radius: 5px;
                    font-weight: bold;
                    position: absolute;
                    color: #ff823f;
                    bottom: 3px;
                    right: 3px;
                }
            }
        }

        .file-item-info {
            height: 31%;
            padding: 0 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;

            .avatar {
                width: 30px;
                height: 30px;
                border-radius: 30px;
                background: #3468FE;
                flex-shrink: 0;
                margin-right: 10px;
                overflow: hidden;
            }

            .detail {
                flex-grow: 1;
                overflow: hidden;

                .title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                }

                .desc {
                    margin-top: 6px;
                    color: #909399;
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    pointer-events: none;
                    user-select: none;
                    .spot {
                        width: 4px;
                        height: 4px;
                        border-radius: 10px;
                        background: #909399;
                        margin: 0 5px;
                    }

                    .comment {
                        cursor: pointer;
                        line-height: 10px;
                    }
                }
            }

            .menu-open {
                flex-shrink: 0;
                transform: rotate(90deg);
                padding: 0 5px;
                border-radius: 4px;
                cursor: pointer;

                &:hover {
                    background: #ecf5ff2e;
                    color: #ffffff1f;
                }
            }
        }
    }
}
</style>
