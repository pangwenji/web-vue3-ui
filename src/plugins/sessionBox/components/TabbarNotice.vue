<template>
<el-scrollbar height="100%" class="session_drawer-scrollbar" view-class="scrollbar-view">
    <template v-if="notices.length > 0">
        <template v-for="(item,index) in notices" :key="index">
            <SessionItem @click="handleOpenDialog(item)" :sessionData="formatData(item)"></SessionItem>
        </template>
    </template>
    <template v-else>
        <Empty description="暂无通知消息"></Empty>
    </template>
</el-scrollbar>
</template>
<script>
import { computed, defineComponent } from "@vue/runtime-core";
import { useStore } from "vuex";
import { getJsonData  } from '../util.js'
import SessionItem from "./SessionItem.vue"
const components = {
    SessionItem
}
const setup = (prop,{emit})=>{
    const store = useStore();
    const sessions = computed(() => store.state.IM.sessions || []);
    const systemAccounts = computed(()=> store.state.IM.systemAccounts || {} )
    const notices = computed(()=>{
        const values = Object.values(systemAccounts.value);
        const noticeData = [];
        for(const item of sessions.value){
            if(values.indexOf(item.to) > -1){
                noticeData.push(item);
            }
        }
        return noticeData;
    })
    const formatData = (item)=>{
        const data = {
            unread: item.unread,
            updateTime:item.updateTime,
            nickname: item.options.name,
            avatar: item.options.avatar,
        }
        switch(item.lastMsg.type){
            case 'custom':
                data.context = item.lastMsg.attach.content
                break;
            case 'text':
                const body = getJsonData(item.lastMsg.body)
                data.context = body.context;
                break;

        }
        return data;
    }
    const handleOpenDialog = (item)=>{
        const data = {
            scene: item.scene,
            account: item.to,
            options: item.options,
        }
        emit('openDialog',data);
    } 
    return {
        notices,
        sessions,
        systemAccounts,
        formatData,
        handleOpenDialog,
    }
}
export default defineComponent({
    setup,
    components,
})
</script>