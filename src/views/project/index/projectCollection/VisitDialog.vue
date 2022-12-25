<template>
    <el-dialog :model-value="visibled" :before-close="onBeforeColse" title="发送者" width="460px" custom-class="dialog-center">
        <el-scrollbar height="400px" style="margin: 0 -20px;" view-style="padding: 0 20px;">
            <div v-for="index in 100" class="list-data">
                <el-avatar></el-avatar>
                <div class="nickname">名称</div>
                <div class="createTime">2022-08-07 00:00:00</div>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>
<script>
import { ref } from '@vue/reactivity';
const setup = ()=>{
    const visibled = ref(false);
    const peopleList = ref(false);
    const loadingState = ref(false);
    const onBeforeColse = (deno)=>{
        if(typeof deno == 'function'){
            deno();
        }else{
            visibled.value = false
        }
    }
    const open = ()=>{

    }
    return {
        open,
        visibled,
        peopleList,
        loadingState,
        onBeforeColse
    }
}

export default {
    setup
}
</script>
<style scoped lang="scss">
.list-data{
    display: flex;
    align-items: center;
    padding: 5px;
    &:deep(.el-avatar){
        flex: none;
    }
    .nickname{
        flex: auto;
        overflow: hidden;
        font-size: 14px;
        padding:0 20px;
    }
    .createTime{
        flex: none;
        font-size: 12px;
        color: #8d9099;
    }
}
</style>