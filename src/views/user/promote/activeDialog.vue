<template>
    <el-dialog v-model="isShow" width="448px" :show-close="false" custom-class="dialog-center" v-bind="$attrs">
       <div class="desc">账户绑定手机号（激活账户必须是通过邀请链接注册，才可返佣）</div>
       <el-input v-model="phone" maxlength="11" placeholder="请输入手机号">
            <template #suffix>
                <el-icon v-show="isCheck" class="check-icon"><Check /></el-icon>
            </template>
        </el-input>
        <template v-if="phoneInfo.vipLevel >= 0">
            <div class="bind-desc" v-if="phoneInfo.vipLevel">个人会员到期日 {{phoneInfo.vipEndTime}}</div>
            <div class="bind-desc" v-else>体验版</div>
            <div class="bind-desc">绑定该账号后，自动增加1年个人版会员资格</div>
        </template>
        <template #footer>
            <el-button type="default" size="large" class="btn" @click="closeDialog">取消</el-button>
            <el-button type="primary" size="large" color="#3468FE" class="btn" @click="confirm">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { checkVipPhone, activeVip } from '@/api/user/promote'

const emit = defineEmits(['activeSucc'])
const isShow = ref(false)

// 手机号 - 输入
const phone = ref('')
const phoneInfo = ref({})
const isCheck = computed(()=> {
    let reg = /^1[3-9]\d{9}/
    return reg.test(phone.value)
})
// 检查手机号输入
watch(isCheck, ()=>{
    phone.value && checkVipPhone(phone.value).then(res => {
        phoneInfo.value = res.data
    })
})
// 点击 - 确认激活
const confirm = ()=> {
    // 校验手机号
    if (isCheck.value) {
        activeVip({phone: phone.value}).then(res => {
            if (res && +res.code == 200) {
                ElMessage({
                    message: '激活成功',
                    type: 'success',
                })
                phone.value = ''
                isShow.value = false
                phoneInfo.value = {}
                emit('activeSucc', 'code')
            }
        })
    } else {
        phone.value = ''
        ElMessage({
            message: '请输入正确的手机号',
            type: 'warning',
        })
    }
}

const closeDialog = ()=> {
    phone.value = ''
    isShow.value = false
}

defineExpose({
    isShow
})
</script>

<style lang="scss" scoped>
.check-icon {
    color: green;
    top: 8px;
}
.desc {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #9094A6;
}
.bind-desc {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 400;
    color: #9094A6;
}
.btn {
    width: 120px;
}
</style>