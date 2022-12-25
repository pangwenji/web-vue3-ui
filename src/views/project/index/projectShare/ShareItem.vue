<template>
    <div class="table-body" v-contextmenu:contextmenuRef>
        <div style="width: 36%;" class="folder-content">
            <div style="flex: none; width: 56px; height: 56px;">
                <FileType type="folder"  v-if="shareItem.fileQuantity > 1 || shareItem.fileCat == 'dir'" ></FileType>
                <FileType type="url" fit="cover" :url="shareItem.cover"  v-else-if="shareItem.cover" ></FileType>
                <FileType :type="shareItem.fileCat" v-else ></FileType>
            </div>
            <div class="folder-content-text">
                <div class="name">{{shareItem.name}}</div>
                <div class="project-name">{{shareItem.createTime}}</div>
            </div>
        </div>
        <div style="width: 10%;">
            {{shareItem.user.nickName}}
        </div>
        <div style="width: 12%;">
            <avatar-list :avatarList="avatarList" v-if="avatarList.length > 0"></avatar-list>
            <span v-else>暂无访问记录</span>
        </div>
        <div style="width: 8%;">{{shareItem.commentCount}}</div>
        <div style="width: 8%;">
            <el-switch :loading="loadingSwitch" :model-value="shareItem.status" @change="handleChangeSwitch" :inactive-value="2" :active-value="0" active-color="#3A36DB" ></el-switch>
        </div>
        <div style="width: 8%;">
            <template v-if="shareItem.timeLeft === null">
                永久有效
            </template>
            <template v-else-if="shareItem.timeLeft >= 0">
                {{shareItem.timeLeft}}天后过期
            </template>
            <template v-else>
                已过期
            </template>
        </div>
        <div style="width: 10%;" class="folder-link">
            <!-- <span @click.stop="emit('onSendShare','qrcode')">
                <svg-icon iconClass="icon_erweima" :size="20"></svg-icon>
            </span> -->
            <span @click.stop="emit('onSendShare','link')">
                <svg-icon iconClass="icon_lianjie" :size="20"></svg-icon>
            </span>
        </div>
        <div style="width: 4%;" class="folder-action">
            <span v-contextmenu:contextmenuRef="{trigger:'click'}">
                <svg-icon iconClass="icon_edit_vertical"  :size="20" ></svg-icon>
            </span>
        </div>
    </div>
    <v-contextmenu ref="contextmenuRef">
        <!-- <v-contextmenu-item @click="emit('onViewFile',shareItem)">查看文件</v-contextmenu-item> -->
        <v-contextmenu-item @click="emit('onSetting',shareItem)">分享设置</v-contextmenu-item>
        <v-contextmenu-item @click="emit('onDelete',{id:shareItem.id,name:shareItem.name})">删除记录</v-contextmenu-item>
    </v-contextmenu>
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import { updateProjectShare } from "@/api/project/files.js"
import { formatSize } from "@/utils/tool.js"
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import FileType from "@/components/FileType"
const props = {
    shareItem:{
        type: Object,
        default(){
            return {}
        }
    }
}

const emits = ['onSetting','onDelete','onSendShare'];
const setup = (prop,{emit})=>{
    const store = useStore();
    const loadingSwitch = ref(false);
    const contextmenuRef = ref();
    const projectData = computed(()=>{
        return store.state.project.projectData;
    })
    const avatarList = computed(()=>{
        const peopleList = prop.shareItem.peopleList;
        return peopleList?.map(item=>{
            return item.user
        }) || []
    })
    const handleChangeSwitch = (e)=>{
        loadingSwitch.value = true
        let {id,status} = prop.shareItem;
        status = status == 2?0:2
        updateProjectShare({id,status}).then(res=>{
            loadingSwitch.value = false
            prop.shareItem.status = status;
            ElMessage.success("设置成功")
        }).catch(err=>{
            loadingSwitch.value = false
        })
    }
    return {
        emit,
        formatSize,
        avatarList,
        projectData,
        loadingSwitch,
        contextmenuRef,
        handleChangeSwitch
    }
}

export default defineComponent({
    props,
    emits,
    setup,
    components:{
        FileType,
    }
})

</script>
<style scoped lang="scss">
.table-body{
    color: #BEC0CD;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 6px 16px;
    margin-bottom: 8px;
//    margin-left: -16px;
//    margin-right: -16px;
    user-select: none;
    border-radius: 8px;
    &:hover{
    background: rgba(255, 255, 255, .1);
    }    
    div{
        flex-grow: 1;
    }
}
.folder-content{
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    pointer-events: none;
    .folder-content-text{
        margin-left: 10px;
        flex: auto;
        overflow: hidden;
        .name{
            box-sizing: border-box;
            color: #BEC0CD;
            overflow:hidden;
            padding-right:20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 10px;
        }
        .project-name{
            font-size: 12px;
            color: #9094A6;
        }
    }

}
.folder-link{
    span{
        padding: 4px;
        display: inline-block;
        line-height: 16px;
        border-radius: 4px;
        cursor: pointer;
        &:hover{
            background: rgba(255, 255, 255, .2);
        }
    }
}
.folder-action{
    span{
        padding: 4px;
        display: inline-block;
        line-height: 16px;
        border-radius: 4px;
        cursor: pointer;
        &:hover{
            background: rgba(255, 255, 255, .2);
        }
    }
}
</style>