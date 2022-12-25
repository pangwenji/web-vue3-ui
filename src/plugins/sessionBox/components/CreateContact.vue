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
            <el-form-item label="验证信息" prop="verify">
                <el-input v-model="formData.verify" class="is-custom" :maxlength="10" show-word-limit placeholder="请填写验证信息" />
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
import { computed, defineComponent , nextTick, reactive, ref } from 'vue'
import { ElMessage } from "element-plus"
import { useStore } from 'vuex'
const emits = ['onSubmit'];
const setup = (prop,{emit})=>{
    const store = useStore();
    const title = ref("申请加为好友");
    const groupData = computed(()=>store.getters['IM/groupList']);
    const visibledAdd = ref(false);
    const formDataRef = ref();
    const formRules = {
        groupId: [{ type: 'number', required: true, message: '请选择添加分组', trigger: 'change' }],
    }
    const formData = reactive({
        contactUserId: '',
        receiveImId: '',
        groupId: '',
        remark: '',
        verify: '你好，我是',
    })
        // 添加好友
    const loadingSubmit = ref(false);
    const handleSubmit = () => {
        formDataRef.value.validate(vali => {
            if (vali) {
                loadingSubmit.value = true;
                const receiveUserId = formData.contactUserId;
                const receiveImId = formData.receiveImId;
                const groupId = formData.groupId;
                const message = formData.verify;
                const alias = formData.remark;
                store.dispatch('IM/handleFriendApply',{receiveUserId,receiveImId,groupId,message,alias}).then(res=>{
                    loadingSubmit.value = false;
                    ElMessage.success('已发送申请')
                    emit('onSubmit', formData.contactUserId);
                    nextTick(onBeforCloseAdd)
                }).catch(err=>{
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
        formData.receiveImId = ''
        formData.groupId = ''
        formData.remark = ''
        formData.verify = '你好，我是'
        if (typeof deno == 'function') {
            deno();
        } else {
            visibledAdd.value = false;
        }
    }
    const open = (data)=>{
        store.dispatch('IM/handleGetGroup').then(res=>{
            formData.remark = data.nickName
            formData.contactUserId = data.userId
            formData.receiveImId = data.imAccountId
            formData.verify = '你好，我是'
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