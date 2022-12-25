<template>
<div class="pay-main">
    <!-- 支付密码弹框 -->
    <el-dialog v-model="visibled" title="支付密码" :close-on-click-modal="false" width="400px" @closed="handleClosed" :before-close="onPayBeforeClose" custom-class="dialog-center pay-dialog-box">
        <!-- <template #title>
            支付密码
        </template> -->
        <div class="pay-password-input" :class="{'is-focus': isFocus}" @click="PayPasswordInputRef.focus()" :tabindex="-1">
            <div
                class="password-item"
                :class="{ active: password.length >= index }"
                v-for="index in 6" :key="index"
            ></div>
        </div>
        <div style="height:0px; overflow:hidden;">
            <input type="text"  @keydown.enter="handleConfirmPay" name="" ref="PayPasswordInputRef" @focus="isFocus = true" @blur="isFocus = false" @input="handleInputValue" />
        </div>
        <el-button type="primary" class="pay-btn" :loading="loadingStatus" :disabled="password.length !== 6" round @click="handleConfirmPay">确认支付</el-button>
    </el-dialog>
</div>
</template>
<script>
import { defineComponent, getCurrentInstance, nextTick, onMounted, ref } from "vue";
import { ElDialog, ElButton, ElMessage} from "element-plus";
import { payMentOrder } from '@/api/pay/pay.js'
import store from "@/store";
const components = {
    ElDialog,
    ElButton
}
const props = {
    orderNo:{
        type:String,
        default: null
    },
    error:{
        type:Function,
        default: null
    },
    confirm:{
        type:Function,
        default: null
    },
    removeNode:{
        type:Function,
        default:null
    }
}
const setup = (prop)=>{
    const { proxy } = getCurrentInstance();
    const password = ref('');
    const visibled = ref(false);
    const isFocus = ref(false);
    const PayPasswordInputRef = ref();
    const loadingStatus = ref(false)
    // 输入
    const handleInputValue = (e)=>{
        const value = e.data;
        const inputType = e.inputType;
        const reg = /^[0-9]{1}/
        if(reg.test(value) && password.value.length < 6){
            password.value += value;
        }else if(inputType == 'deleteContentBackward' && password.value){
            password.value = password.value.slice(0,(password.value.length - 1));
        }
        if(!e.target.value){
            password.value = '';
        }
    }
    // 确认支付
    const handleConfirmPay = ()=>{
        const reg = /^\d{6}$/
        if(!reg.test(password.value)){
            ElMessage.error('请填写正确的支付密码')
            return
        }
        if(typeof prop.confirm == 'function'){
            loadingStatus.value = true;
            const payPassword = password.value;
            const transactionNo = prop.orderNo;
            payMentOrder({transactionNo,payPassword}).then(result=>{
                const accountBalance = result.data.accountBalance * 1
                store.commit('SET_MONEY',accountBalance.toFixed(2));
                prop.confirm(result).then(res=>{
                    loadingStatus.value = false;
                    onPayBeforeClose();
                }).catch(err=>{
                    onPayBeforeClose();
                    loadingStatus.value = false;
                })
            }).catch(err=>{
                console.log(err)
                loadingStatus.value = false;
                onPayBeforeClose();
                prop.error&&prop.error(err)
            })
        }else{
            onPayBeforeClose();
        }
    }
    // 弹窗关闭之前
    const onPayBeforeClose = (deno)=>{
        password.value = '';
        if(typeof deno == 'function'){
            deno()
        }else{
            visibled.value = false;
        }
    }
    const handleClosed = ()=>{
        prop.removeNode&&prop.removeNode()
    }
    // 打开弹窗
    const open = ()=>{
        visibled.value = true;
        nextTick(()=>{
            PayPasswordInputRef.value.focus();
        })
    }
    return {
        open,
        prop,
        isFocus,
        visibled,
        password,
        handleClosed,
        loadingStatus,
        handleInputValue,
        onPayBeforeClose,
        handleConfirmPay,
        PayPasswordInputRef,
    }
}
export default defineComponent({
    setup,
    props,
    components
})
</script>
<style scoped lang="scss">
.pay-main{
    &:deep(.pay-dialog-box){
        .el-dialog__header {
            // margin-right: 0;
            // text-align: center;
        }
        .el-dialog__body{
            padding: 20px;
        }
    }
    .pay-password-input{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .password-item{
            flex: none;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            border: 1px solid #DADCE1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &.active{
                &::after{
                    content: '';
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #999;
                    border-radius: 10px;
                }
            }
        }
        &.is-focus{
            .password-item{
                border-color: #3468FE;
                &.active{
                    &::after{
                        background: black;
                    }
                }
            }
        }
    }
    .pay-btn{
        margin-top: 20px;
        width: 100%;
        background: #3468FE;
        border-radius: 10px;
        border: none;
        padding: 20px;
        &.is-disabled{
            opacity: .5;
        }
    }
}

</style>
