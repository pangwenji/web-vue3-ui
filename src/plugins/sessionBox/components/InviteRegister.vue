<template>
    <el-dialog v-model="visibled" width="450px" :before-close="onBeforeClose" custom-class="dialog-center">
        <template #title>
            <div style="margin: 0 0 -20px; padding: 0 0 20px; border-bottom: 1px solid rgba(0,0,0,0.1)">
                <span style="margin-right: 10px">邀请报名</span>
                <el-button type="primary" plain color="#3468FE" size="small" @click="handleToReleate">发布新招募</el-button>
            </div>
        </template>
        <el-select v-model="valueData" size="large" class="InviteRegister-custom-select" style="width: 100%;" placeholder="请选择招募">
            <el-option v-for="(item,index) in recruitData" :key="index" :label="item.title" :value="item.id" :disabled="!(item.ifSignup && item.status == 1)">
                <!-- <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">{{ item.value }}</span> -->
            </el-option>
        </el-select>
        <template #footer>
            <el-button type="primary" :loadingState="loadingState" :disabled="!valueData" size="large" color="#3468FE" style="width: 120px; border-radius: 8px;" @click="handleSubmit">确定发送</el-button>
        </template>
    </el-dialog>
</template>
<script>
import { getRecruitReleaseData } from '@/api/personnel/personnelManage';
import { recruitInvite } from '@/api/personnel/recruitmentWall'
import { defineComponent } from 'vue';
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const setup = () => {
    const store = useStore();
    const router = useRouter();
    const visibled = ref(false);
    const recruitData = ref([]);
    const valueData = ref();
    const loadingState = ref(false);
    const handleSubmit = async () => {
        try{
            loadingState.value = true;
            const data = recruitData.value.find((item)=>{
                return item.id == valueData.value;
            });
            // await recruitInvite()
            await store.dispatch('IM/handleSendText',{
                content:'邀请报名',
                txtType: 1, 
                data:{ 
                    id: data.id,
                    title: data.title,
                    endDate: data.endDate,
                    createTime: data.createTime,
                }
            })
            loadingState.value = false;
            onBeforeClose();
        }catch(err){
            loadingState.value = false;
        }

    }
    const onBeforeClose = (deno)=>{
        if(loadingState.value){return}
        valueData.value = null
        if(typeof deno == 'function'){
            deno();
        }else{
            visibled.value = false;
        }
    }
    // 发布招募
    const handleToReleate = ()=>{
        router.push('/workspace/admin/release');
        onBeforeClose();
    }
    const open = () => {
        getRecruitReleaseData({}, true).then(res => {
            visibled.value = true;
            recruitData.value = res.data.filter(item => item.ifSignup && item.status == 1);
            // recruitData.value = res.data;
        })
    }
    return {
        open,
        visibled,
        valueData,
        recruitData,
        loadingState,
        handleSubmit,
        onBeforeClose,
        handleToReleate,
    }
}
export default defineComponent({
    setup,
})
</script>
<style lang="scss">
.el-select.InviteRegister-custom-select{
    --el-select-border-color-hover: transparent;
    .el-input{
        --el-input-border-color: transparent;
    }
    .el-input__inner{
        --el-input-bg-color: #F5F6F9;
        --el-input-placeholder-color: #C2C7CE;
    }
}
</style>