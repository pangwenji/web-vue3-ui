<template>
    <div class="works_file-main">
        <el-tabs v-model="tabValue" @tab-change="handleTabChange">
            <template v-for="(item,index) in tabbarList" :key="index">
                <el-tab-pane :label="item.title" :name="item.type" lazy>
                    <WorksFileItem :type="item.type" ref="WorksFileItemRef" :title="item.title"></WorksFileItem>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from "vue";
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
    const tabValue = ref('');
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
            title: '文档作品'
        },
    ]
    const tabbarList = ref([]);
    tabbarList.value = tabbarListData.filter((item)=>{
        return prop.workTypeMenuItems.indexOf(item.type) > -1
    })
    tabValue.value = tabbarList.value[0].type;
    const handleTabChange = ()=>{
        for(const index in proxy.$refs.WorksFileItemRef){
            if(proxy.$refs.WorksFileItemRef[index].type == 'audio'){
                proxy.$refs.WorksFileItemRef[index].handlePause&&  proxy.$refs.WorksFileItemRef[index].handlePause();
            }
        }
    }
    return {
        tabValue,
        tabbarList,
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
.works_file-main{
    &:deep(.el-tabs){
        .el-tabs__header{
            padding: 0 20px;
            background: #24262F;
            margin-bottom: 0;
            .el-tabs__nav-wrap::after{
                background: transparent;
            }
            .el-tabs__item{
                color: #666A7A;
                font-size: 16px;
                &.is-active{
                    font-weight: bold;
                    color: #FFFFFF;
                }
            }
            .el-tabs__active-bar{
                background-color: #3468FE;
            }
        }
        .el-tab-pane{
            padding: 20px;
            background: #181920;
        }
    }
}
</style>