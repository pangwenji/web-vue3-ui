<template>
    <div class="table-body" v-contextmenu:contextmenuRef @click="emit('onViewFile',{id:collcetionItem.directoryId})">
        <div style="width: 32%;" class="folder-content">
            <svg-icon iconClass="h_document"  :size="56" ></svg-icon>
            <div class="folder-content-text">
                <div class="name">{{collcetionItem.name}}</div>
                <div class="project-name">{{collcetionItem.createTime}}</div>
            </div>
        </div>
        <div style="width: 10%;">
            <avatar-list :avatarList="avatarList" v-if="avatarList.length > 0"></avatar-list>
            <span v-else>暂无访问记录</span>
        </div>
        <div style="width: 10%;">{{formatSize(collcetionItem.currUpload)}}</div>
        <div style="width: 10%;">{{collcetionItem.fileQuantity}}</div>
        <div style="width: 10%;" @click.stop="">
            <el-switch :loading="loadingSwitch" :model-value="collcetionItem.status" @change="handleChangeSwitch" :inactive-value="3" :active-value="1" active-color="#3A36DB" ></el-switch>
        </div>
        <div style="width: 10%;">
            <template v-if="collcetionItem.timeLeft === null">
                永久有效
            </template>
            <template v-else-if="collcetionItem.timeLeft >= 0">
                {{collcetionItem.timeLeft}}天后过期
            </template>
            <template v-else>
                已过期
            </template>
        </div>
        <div style="width: 10%;" class="folder-link">
            <!-- <span @click.stop="emit('onSendCollcetion','qrcode')">
                <svg-icon iconClass="icon_erweima" :size="20"></svg-icon>
            </span> -->
            <span @click.stop="emit('onSendCollcetion','link')">
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
        <v-contextmenu-item @click="emit('onViewFile',{id:collcetionItem.directoryId})">查看文件</v-contextmenu-item>
        <v-contextmenu-item @click="emit('onSetting',collcetionItem)">收集设置</v-contextmenu-item>
        <v-contextmenu-item @click="emit('onDelete',{id:collcetionItem.id,name:collcetionItem.name})">删除记录</v-contextmenu-item>
    </v-contextmenu>
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import { editFileCollect } from "@/api/project/files.js"
import { formatSize } from "@/utils/tool.js"
import { useStore } from "vuex";
const props = {
    collcetionItem:{
        type: Object,
        default(){
            return {}
        }
    }
}
const emits = ['onViewFile','onSetting','onDelete','onSendCollcetion'];
const setup = (prop,{emit})=>{
    const store = useStore();
    const loadingSwitch = ref(false);
    const contextmenuRef = ref();
    const projectData = computed(()=>{
        return store.state.project.projectData;
    })
    const avatarList = computed(()=>{
        const peopleList = prop.collcetionItem.peopleList;
        return peopleList?.map(item=>{
            return item.user
        }) || []
    })
    const handleChangeSwitch = (e)=>{
        loadingSwitch.value = true
        let {id,status} = prop.collcetionItem;
        status = status == 1?3:1
        editFileCollect({id,status}).then(res=>{
            loadingSwitch.value = false
            prop.collcetionItem.status = status;
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
    setup
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
        overflow: hidden;
        .name{
            color: #BEC0CD;
            margin-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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