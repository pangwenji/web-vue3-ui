<template>
    <el-dialog v-model="visibled" :close-on-click-modal="false" :before-close="onBeforClose" width="530px" :title="title" custom-class="dialog-center">
        <el-form ref="formDataRef" :model="formData" :rules="formRules">
            <el-form-item prop="remark">
                <el-input v-model="formData.remark" class="is-custom" show-word-limit :maxlength="30" placeholder="请填写联系人备注" />
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
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const setup = () => {
    const store = useStore();
    const title = ref('修改备注');
    const visibled = ref(false);
    const formDataRef = ref();
    const formRules = {}
    const formData = reactive({
        id:'',
        remark: '',
        groupIndex: -1,
        optionIndex: -1,
    })  
    const loadingSubmit = ref(false);
    const handleSubmit = ()=>{
        formDataRef.value.validate(vali=>{
            if(vali){
                loadingSubmit.value = true;
                store.dispatch('IM/handleUploadImContact',formData).then(res=>{
                    loadingSubmit.value = false;
                    ElMessage.success('更新成功');
                    onBeforClose();
                }).catch(err=>{
                    loadingSubmit.value = false;
                })
            }
        })
    }
    // 弹窗关闭之前的回调
    const onBeforClose = (deno) => {
        if(loadingSubmit.value){return}
        formDataRef.value.resetFields();
        formData.id = '';
        formData.groupIndex = -1;
        formData.optionIndex = -1;
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
                formData.id = e.id;
                formData.remark = e.remark;
                formData.groupIndex = e.groupIndex;
                formData.optionIndex = e.optionIndex;
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