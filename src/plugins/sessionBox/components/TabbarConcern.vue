<template>
<el-scrollbar height="100%" class="session_drawer-scrollbar" view-class="scrollbar-view" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
    <template v-if="notices.length > 0 && !loadingState">
        <template v-for="(item,index) in notices" :key="index">
            <SessionItem @click="handleOpenDialog(item)" :sessionData="formatData(item)"></SessionItem>
        </template>
        <div style="color:#979797; text-align:center;font-size:12px; margin-top:20px;">已经到底啦~</div>
    </template>
    <template v-else-if="!loadingState">
        <Empty description="暂无我的消息"></Empty>
    </template>
</el-scrollbar>
</template>
<script>
import { computed, defineComponent, onMounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getJsonData  } from '../util.js'
import SessionItem from "./SessionItem.vue"
const components = {
    SessionItem
}
const setup = (prop,{emit})=>{
    const store = useStore();
    const router = useRouter();
    const sessions = computed(() => store.state.IM.sessions || []);
    const setSystemAccounts = computed(()=> store.state.IM.setSystemAccounts || {} );
    const notices = computed(()=> store.state.IM.aboutNotice);
    const loadingState = ref(false);
    const getData = ()=>{
        loadingState.value = true;
        store.dispatch('IM/getNoticeData',{noticeType:1,page:1,size:50}).then(res=>{
            loadingState.value = false;
        }).catch(err=>{
            console.log(err)
            loadingState.value = false;
        })
    }
    onMounted(()=>{
        getData();
    })
    const formatData = (item)=>{
        const mataData =  getJsonData(item.mataData)
        const data = {
            updateTime:item.createTime,
            dangerouslyUseHTMLString:true,
            nickname: `<div>
					<span style="color: #3468FE; ">${mataData.user.nickName}</span>在<span style="color: #3468FE; ">${mataData.file.filename}</span>中@你
				</div>`,
            avatar: mataData.user.avatar,
            context:`项目·${mataData.project.name}`,
        }
        return data;
    }
    const handleOpenDialog = (item)=>{
        const mataData =  getJsonData(item.mataData)
        router.push({
            path: '/file', query: {
                id: mataData.file.fileId,
                projectId: mataData.project.id,
                fileCat: mataData.file.fileCat,
            }
        })
    } 
    return {
        notices,
        sessions,
        formatData,
        loadingState,
        handleOpenDialog,
        setSystemAccounts,
    }
}
export default defineComponent({
    name:'TabbarConcern',
    setup,
    components,
})
</script>