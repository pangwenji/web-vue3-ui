<template>
    <el-dialog v-model="visibled" :close-on-click-modal="false" :before-close="onBeforClose" width="530px" :title="title" custom-class="dialog-center">
        <el-form ref="formDataRef" :model="formData" :rules="formRules">
            <el-form-item prop="groupName">
                <el-input v-model="formData.groupName" class="is-custom" show-word-limit :maxlength="30" placeholder="请填写分组名称" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button type="default" style="width:106px;" class="is-custom" @click="onBeforClose">取消</el-button>
                <el-button type="primary" style="width:106px;" class="is-custom" @click="handleSubmit" :loading="loadingSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { defineComponent, nextTick, reactive, ref } from "@vue/runtime-core";
import { createGroup } from '@/api/IM.js'
import { getSearchAccount } from "@/api/IM.js"
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const setup = () => {
    const store = useStore();
    const title = ref('创建分组');
    const visibled = ref(false);
    const formDataRef = ref();
    const formRules = {
        groupName:[{required:true,message:'请填写分组名称',trigger:'blur'}],
    }
    const formData = reactive({
        id:'',
        groupName: '',
    })  
    const loadingSubmit = ref(false);
    const handleSubmit = ()=>{
        formDataRef.value.validate(vali=>{
            if(vali){
                loadingSubmit.value = true;
                if(formData.id){
                    store.dispatch('IM/handleUpdateGroup',formData).then(res=>{
                        loadingSubmit.value = false;
                        ElMessage.success('更新成功');
                        onBeforClose();
                    }).catch(err=>{
                        loadingSubmit.value = false;
                    })
                }else{
                    store.dispatch('IM/handleCreateGroup',formData).then(res=>{
                        loadingSubmit.value = false;
                        ElMessage.success('添加成功');
                        onBeforClose();
                    }).catch(err=>{
                        loadingSubmit.value = false;
                    })
                }
            }
        })
    }
    // 弹窗关闭之前的回调
    const onBeforClose = (deno) => {
        if(loadingSubmit.value){return}
        formDataRef.value.resetFields();
        formData.id = '';
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    const open = (e)=>{
        visibled.value = true;
        nextTick(()=>{
            if(e){
                title.value = '重命名分组'
                formData.id = e.id;
                formData.groupName = e.groupName;
            }else{
                title.value = '创建分组'
            }
        })
    }
    return {
        open,
        title,
        visibled,
        formData,
        formRules,
        formDataRef,
        loadingSubmit,
        handleSubmit,
        onBeforClose,
    }
}
export default defineComponent({
    setup,
})
</script>
<style scoped lang="scss">

</style>