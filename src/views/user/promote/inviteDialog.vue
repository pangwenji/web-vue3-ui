<template>
    <el-dialog v-model="isShow" width="448px" :show-close="false" custom-class="dialog-center" v-bind="$attrs">
       <div class="link-name">邀请链接名称</div>
       <el-input v-model="inviteLink" maxlength="12" show-word-limit placeholder="请输入邀请链接名称" />
        <template #footer>
            <el-button type="default" size="large" class="btn" @click="closeDialog">取消</el-button>
            <el-button type="primary" size="large" color="#3468FE" class="btn" @click="confirm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import { insertLink } from '@/api/user/promote'

const emit = defineEmits(['addLinkSucc'])

const isShow = ref(false)
const inviteLink = ref('')

// 点击 - 添加邀请链接
const confirm = ()=> {
    if (!inviteLink.value) {
        ElMessage({
            message: '链接名称不能为空',
            type: 'warning',
        })
        return
    }

    insertLink({title: inviteLink.value}).then(res => {
        if (res && +res.code == 200) {
            ElMessage({
                message: '添加成功',
                type: 'success'
            })

            inviteLink.value = ''
            isShow.value = false
            emit('addLinkSucc', 'link')
        }
    })
}

// 点击 - 关闭弹窗
const closeDialog = ()=> {
    inviteLink.value = ''
    isShow.value = false
}

defineExpose({
    isShow
})
</script>

<style lang="scss" scoped>
.link-name {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #9094A6;
}
.btn {
    width: 120px;
}
</style>