<template>
    <el-dialog v-model="visible" width="530px"  :close-on-press-escape="false" title="转让并退出项目" :before-close="onBeforeClose" custom-class="dialog-center">
        <el-scrollbar height="300px" v-loading="dialogLoading">
            <template v-if="menberList.length > 0">
                <div class="person-item-box" v-for="(item,index) in menberList" :key="index" @click="handleCheck(item.id)">
                    <el-avatar :size="38" :src="item.user.avatar" />
                    <div class="person-name">{{item.user.nickName}}</div>
                    <div class="person-radio" :class="{active: menberId == item.id }"><el-icon><SuccessFilled /></el-icon></div>
                </div>
            </template>
            <template v-else-if="!dialogLoading">
                <Empty description="项目内无其他成员" />
            </template>
        </el-scrollbar>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="default" @click="onBeforeClose" class="is-custom" >取消</el-button>
                <el-button type="primary" @click="handleSubmit" class="is-custom" :loading="submitLoading" style="background: linear-gradient(42deg, #0459FF 0%, #5726DD 100%); border: none;">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { getProjectMemberList } from '@/api/project/menber'
import { computed, defineComponent,ref } from "vue";
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus';
const props = {
    projectId:{
        type:[Number,String],
        default:null
    }
}

const setup = (prop,{emit})=>{
    const store = useStore();
    const visible = ref(false);
    const submitLoading = ref(false)
    const dialogLoading = ref(false);
    const menberList = ref([]);
    const menberId = ref(null);
    const onBeforeClose = (deno)=>{
        if(submitLoading.value){
            return
        }
        if(dialogLoading.value){
            return
        }
        if(typeof  deno == 'function'){
            deno();
        }else{
            visible.value = false;
        }
        menberId.value = null;
    }

    const handleCheck = (id)=>{
        menberId.value = menberId.value == id?null:id;
    }

    const handleSubmit = ()=>{
        if(dialogLoading.value){
            return
        }
        if(!menberId.value){
            ElMessage.error('请选择转让的成员');
            return
        }
        if(menberId.value){
            submitLoading.value = true;
            const projectId = prop.projectId;
            const memberId = menberId.value;
            store.dispatch('project/handleTransferAndQuit',{projectId,memberId}).then(res=>{
                console.log(res)
                submitLoading.value = false;
                onBeforeClose();
                ElMessage.success('操作成功');
            }).catch(err=>{
                console.log(err)
                submitLoading.value = false;
            });
        }
    }

    const userId = computed(()=>{
       return store.state.user.userId;
    })

    const open = ()=>{
        if(dialogLoading.value){
            return
        }
        menberList.value = [];
        visible.value = true;
        dialogLoading.value = true;
        getProjectMemberList({id:prop.projectId}).then(res=>{
            menberList.value = res.data.filter(item=>{
                return item.userId !== userId.value;
            });
            dialogLoading.value = false;
        }).catch(err=>{
            dialogLoading.value = false;
        })
    }


    return {
        open,
        visible,
        menberId,
        menberList,
        handleCheck,
        handleSubmit,
        dialogLoading,
        submitLoading,
        onBeforeClose,
    }
}

export default defineComponent({
    props,
    setup,
})
</script>
<style scoped lang="scss">
.person-item-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    padding: 10px;
    margin: 2px 0;
    cursor: pointer;
    border-radius: 6px;
    *{
        pointer-events: none;
        user-select: none;
    }
    &:hover{
        background: #f4f4f5;
    }
    &:deep(.el-avatar){
        flex-shrink: 0;
        pointer-events: none;
        user-select: none;
    }
    .person-name{
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 20px;
        user-select: none;
    }
    .person-radio{
        width: 26px;
        height: 26px;
        // position: absolute;
        font-size: 22px;
        border: 2px solid #DFDFDF ;
        border-radius: 30px;
        flex-shrink: 0;
        cursor: pointer;
        &:hover{
            border-color: rgba($color: #6D75FF, $alpha: .4);
        }
        *{
            opacity: 0;
            transition: opacity .2 ease;
        }
        &.active{
            border-color: rgba($color: #6D75FF, $alpha: .4);
            color: rgba($color: #6D75FF, $alpha: .4);
            *{
                opacity: 1;
            }
        }

    }
}
</style>