<template>
    <div>
        <div class="my-tabs">
            <div class="tabs"
                @click="switchTab(item)"
                v-for="(item,index) in tabbarList"
                :class="{'active-tab': item.type == activeInfo.type}"
                :key="index">{{item.title}}
            </div>
        </div>
        <div class="content">
            <WorksFileItem :type="activeInfo.type" :title="activeInfo.title" ref="WorksFileItemRef" ></WorksFileItem>
        </div>
    </div>
</template>
<script>
import { defineComponent, getCurrentInstance, ref, reactive } from "vue";
import WorksFileItem from './WorksFileItem.vue';
const components = {
    WorksFileItem,
}
const props = {
    workTypeMenuItems:{
        type:Array,
        default(){
            return [];
        }
    }
}
const setup = (prop)=>{
    const {proxy} = getCurrentInstance();
    const tabbarListData = [
        {
            type: 'audio',
            title: '音频作品',
        },
        {
            type: 'video',
            title: '视频作品'
        },
        {
            type: 'image',
            title: '图片作品'
        },
        {
            type: 'other',
            title: '其他作品'
        },
    ]

    const tabbarList = ref([])
    const activeTab = ref('')
    const activeInfo = reactive({
            type: '',
            title: '',
        })

    tabbarList.value = tabbarListData.filter((item)=>{
        return prop.workTypeMenuItems.indexOf(item.type) > -1
    })

    let tabValue = tabbarList.value[0]
    activeTab.value = tabValue.type
    activeInfo.type = tabValue.type
    activeInfo.title = tabValue.title

    const handleTabChange = ()=>{
        for(const index in proxy.$refs.WorksFileItemRef){
            if(proxy.$refs.WorksFileItemRef[index].type == 'audio'){
                proxy.$refs.WorksFileItemRef[index].handlePause&&  proxy.$refs.WorksFileItemRef[index].handlePause();
            }
        }
    }
    
    const switchTab = (e)=> {
        activeInfo.type = e.type
        activeInfo.title = e.title
        activeTab.value = e.type

        for(const index in proxy.$refs.WorksFileItemRef){
            if(proxy.$refs.WorksFileItemRef[index]?.type == 'audio'){
                proxy.$refs.WorksFileItemRef[index].handlePause && proxy.$refs.WorksFileItemRef[index].handlePause();
            }
        }
    }

    return {
        activeTab,
        activeInfo,
        tabbarList,
        switchTab,
        handleTabChange,
    }
}
export default defineComponent({
    setup,
    props,
    components,
})
</script>
<style scoped lang="scss">
.my-tabs {
    display: flex;
    background: #0A0B0D;
    .tabs {
        padding: 10px 20px;
        background-color: #14151A;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        font-size: 16px;
        color: #666A7A;
        cursor: pointer;
    }
    .active-tab {
        background-color: #1C1D24;
        color: #fff;
    }
}
.content {
    background-color: #1C1D24;
    margin-bottom: 20px;
    padding: 20px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
</style>