<template>
    <el-dialog v-model="visibledAdd" :close-on-click-modal="false" :before-close="onBeforCloseAdd" width="400px" :title="title" custom-class="dialog-center">
        <el-form ref="formDataRef" :model="formData" :rules="formRules" label-position="top" class="insert_user-box" label-width="80px">
            <el-form-item label="分组" prop="groupId">
                <el-select v-model="formData.groupId" class="is-custom" style="width:100%;" placeholder="请选择分组">
                    <el-option v-for="(item,index) in groupData" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" class="is-custom" placeholder="请填写联系人备注" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button type="default" class="is-custom" @click="onBeforCloseAdd">取消</el-button>
                <el-button type="primary" class="is-custom" @click="handleSubmit" :loading="loadingSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { defineComponent , nextTick, reactive, ref } from 'vue'
import { ElMessage } from "element-plus"
import { useStore } from 'vuex'
const emits = ['onSubmit'];
const setup = (prop,{emit})=>{
    const store = useStore();
    const title = ref("同意加为好友");
    const groupData = computed(()=>store.getters['IM/groupList']);
    const visibledAdd = ref(false);
    const formDataRef = ref();
    const formRules = {
        groupId: [{ type: 'number', required: true, message: '请选择添加分组', trigger: 'change' }],
    }
    const formData = reactive({
        contactUserId: '',
        groupId: '',
        remark: '',
        id:'',
    })
        // 添加好友
    const loadingSubmit = ref(false);
    const handleSubmit = () => {
        formDataRef.value.validate(vali => {
            if (vali) {
                loadingSubmit.value = true;
                const receiveUserId = formData.contactUserId;
                const groupId = formData.groupId;
                const alias = formData.remark;
                const id = formData.id;
                store.dispatch('IM/handleUpdateFriendApply',{receiveUserId,id,groupId,alias,s:1}).then(res=>{
                    loadingSubmit.value = false;
                    ElMessage.success('添加成功')
                    emit('onSubmit', formData.id);
                    nextTick(onBeforCloseAdd)
                }).catch(err=>{
                    console.log(err)
                    loadingSubmit.value = false;
                })
            }
        })
    }
        // 添加弹窗关闭之前的回调函数
    const onBeforCloseAdd = (deno) => {
        if (loadingSubmit.value) { return }
        formDataRef.value.resetFields();
        formData.contactUserId = ''
        formData.groupId = ''
        formData.remark = ''
        formData.id = ''
        if (typeof deno == 'function') {
            deno();
        } else {
            visibledAdd.value = false;
        }
    }
    const open = (data)=>{
        store.dispatch('IM/handleGetGroup').then(res=>{
            formData.id = data.id
            formData.remark = data.applyUserName
            formData.contactUserId = data.applyUserId
            visibledAdd.value = true;
        })
    }
    return {
        open,
        title,
        formData,
        formRules,
        groupData,
        formDataRef,
        visibledAdd,
        handleSubmit,
        loadingSubmit,
        onBeforCloseAdd,
    }
}
export default defineComponent({
    setup,
    emits
})
</script>
<style scoped lang="scss">
.insert_user-box {
    &:deep(.el-form-item__label) {
        line-height: 46px;
    }
}
</style>