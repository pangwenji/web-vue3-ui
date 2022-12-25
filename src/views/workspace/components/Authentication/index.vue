<template>
    <el-dialog v-model="visibled" title="身份认证" :show-close="true" width="600px" :before-close="onBeforeClose" :close-on-press-escape="false" :close-on-click-modal="false"
        custom-class="dialog-center">
        <div class="authentication-box">
            <el-form :model="formData" :rules="formRule" ref="FormDataRef" :label-width="100" label-position="left">
                <el-form-item label="真实姓名" prop="name">
                    <el-input placeholder="请输入真实姓名" v-model="formData.name" size="large"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码"  prop="idcard">
                    <el-input placeholder="请输入身份证号" v-model="formData.idcard" size="large"></el-input>
                </el-form-item>
                <el-form-item label="手机验证码"  prop="code">
                    <div class="phone-code">
                        <el-input placeholder="请输入手机验证码" v-model="formData.code" size="large"></el-input>
                        <el-button type="primary" :disabled="countDown !== 0" @click="handleSendCode" size="large">
                            <span v-if="countDown == 0">获取验证码</span>
                            <span v-else-if="countDown > 0">重新获取（{{countDown}}）</span>
                            <span v-else>正在发送</span>
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="footer-box">
                <div>*手机验证码将发送至{{phone}}手机上，请注意查收。</div>
                <el-button type="primary" color="#3468FE" :loading="loadingSubmit" style="width: 150px" size="large" @click="handleSubmit" >确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import { ElMessage } from 'element-plus';
import {sendSmsVerificationCode} from "@/api/login";
import {  computed, defineComponent, reactive, ref } from 'vue'
const setup = () => {
    const store = useStore();
    const phone = computed(()=>{
        const p = String(store.state.user.name);
        return p.substring(0,3) + '****' + p.substring(11,7)
    })
    const formData = reactive({
        name: '',
        code: '',
        phone: '',
        idcard: '',
    });
    const formRule = {
        name:[{required: true, message:'真实姓名必填', trigger: ['change','blur'] }],
        code:[{required: true, message:'短信验证码必填', trigger: ['change','blur'] }],
        idcard:[{required: true, message:'身份证号码必填', trigger: ['change','blur'] }],
    }
    const FormDataRef = ref();
    const loadingSubmit = ref(false);
    const visibled = ref(false);
    let interval;
    const countDown = ref(0);
    // 弹窗关闭之前的回调
    const onBeforeClose = (deno) => {
        if(loadingSubmit.value){ return }
        FormDataRef.value.resetFields();
        formData.phone = '';
        if(interval){
            clearInterval(interval);
            interval = null;
            countDown.value = 0;
        }
        if (typeof deno == 'function') {
            deno()
        } else {
            visibled.value = false;
        }
    }
    
    // 发送短信验证码
    const handleSendCode = ()=>{
        const p = store.state.user.name;
        countDown.value = -1;
        sendSmsVerificationCode({phone: p}).then(res=>{
            if(countDown.value == 0){return}
            countDown.value = 60;
            interval = setInterval(()=>{
                if(countDown.value <= 0){
                    clearInterval(interval);
                    interval = null;
                }else{
                    countDown.value -= 1;
                }
            },1000)
        }).catch(err=>{
            countDown.value = 0;
        })
    }

    // 提交认证
    const handleSubmit = ()=>{
        FormDataRef.value.validate().then(res=>{
            loadingSubmit.value = true;
            formData.phone = store.state.user.name;
            store.dispatch('UserVerify',formData).then(res=>{
                loadingSubmit.value = false;
                ElMessage.success('认证成功');
                onBeforeClose();
            }).catch(err=>{
                loadingSubmit.value = false;
            })
        })
    }
    // 打开
    const open = () => {
        visibled.value = true;
    }
    return {
        open,
        phone,
        formData,
        formRule,
        visibled,
        countDown,
        FormDataRef,
        handleSubmit,
        loadingSubmit,
        onBeforeClose,
        handleSendCode,
    }
}
export default defineComponent({
    setup,
})
</script>
<style lang="scss" scoped>
   .authentication-box{
        background: rgba(52,104,254,0.08);
        border-radius: 12px;
        padding:20px 20px 1px;
        &:deep(.el-form-item){
            .el-form-item__label{
                color: #181920;
            }
        }
        .phone-code{
            width: 100%;
            display: flex;
            .el-button{
                margin-left: 20px;
            }
        }
   }
   .footer-box{
       display: flex;
       color: #17181E;
       font-size: 14px;
       justify-content: space-between;
       align-items: center;
   }
</style>