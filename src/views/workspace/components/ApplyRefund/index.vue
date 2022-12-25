<template>
    <div>
        <el-dialog v-model="visibled" :before-close="onBeforedClose" title="申请退款" width="600px" custom-class="dialog-center apply_refund-dialog">
            <el-alert title="当前订单已生效,申请退款需要获得双方的同意" style="margin-bottom: 20px;" :closable="false" type="error" />
            <el-form :model="formData" :rules="formRule" ref="FormDataRef" :label-width="80">
                <el-form-item label="退款原因" prop="terminationReason">
                    <el-select style="width: 200px" v-model="formData.terminationReason" placeholder="请选择申请原因">
                        <el-option value="创作者要求追加酬劳"></el-option>
                        <el-option value="交付稿件存在知识产权风险"></el-option>
                        <el-option value="未经许可擅自提前公开创作内容"></el-option>
                        <el-option value="创作者因私事、伤病等原因无法创作"></el-option>
                        <el-option value="创作者拒绝或不按合理的需求修改稿件"></el-option>
                        <el-option value="创作者未按截止日期、约定需求完成创作"></el-option>
                        <el-option value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退款说明" prop="terminationContent">
                    <el-input type="textarea" v-model="formData.terminationContent" :maxlength="100" resize="none" placeholder="请输入原因" :rows="6" ></el-input>
                </el-form-item>
                <el-form-item label="退款金额" prop="price">
                    <el-input style="width: 200px" v-model="formData.price" placeholder="请输入金额">
                        <template #suffix>
                            <div style="display: flex; align-items:center;">
                                <span class="background_icon-money"></span>
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="onBeforedClose" style="border-radius: 8px;">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" style="border-radius: 8px;" :loading="loadingSubmit" color="#3468FE">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { defineComponent, reactive } from 'vue'
import { actionOperateOrder } from "@/api/personnel/personnelManage"
import { ElMessage } from 'element-plus';
const emits = ['onSubmit'];
const setup = (prop,{emit}) => {
    const visibled = ref(false);
    const FormDataRef = ref();
    let MaxPrice = 0
    const validatorPrice = (rules, value, callback) => {
        const reg = /^[1-9]\d*(.\d{1,2})?$|^0(.\d{1,2})?$/;
        if (reg.test(value)) {
            if(MaxPrice < value){
                callback(new Error('不能超过订单金额'));
            }else{
                callback()
            }
        } else {
            callback(new Error('请填写正确的数值，例：10.00'));
        }
    }
    const validatorContext = (rules, value, callback)=>{
        if(value.trim()){
            callback();
        }else{
            callback(new Error('申请说明不能为空'));
        }
    }
    const formData = reactive({
        price:'',
        orderNo:'',
        terminationReason:'',
        terminationContent:'',
        status: 5,
    })
    const formRule = {
        price:[{ required: true, validator: validatorPrice, trigger: ['blur', 'change'] }],
        terminationContent:[{required: true, validator: validatorContext, trigger: ['blur', 'change'] }],
        terminationReason:[{required: true, message:'申请原因不能为空', trigger: ['blur', 'change'] }]
    }
    const loadingSubmit = ref(false);
    const onBeforedClose = (deno) => {
        if(loadingSubmit.value){ return  }
        FormDataRef.value.resetFields();
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    // 提交
    const handleSubmit = ()=>{
        FormDataRef.value.validate((vali)=>{
            if(vali){
                loadingSubmit.value = true;
                actionOperateOrder(formData).then(res=>{
                    loadingSubmit.value = false;
                    const data = Object.assign({},{...formData,updateTime:res.data.updateTime});
                    data.status = res.data.status;
                    ElMessage.success('已提交申请')
                    emit('onSubmit',data);
                    onBeforedClose();
                }).catch(err=>{
                    loadingSubmit.value = false;
                })
            }
        })
    }
    // 打开弹窗
    const open = (e)=>{
        formData.orderNo = e.orderNo;
        formData.price = e.price;
        MaxPrice = e.price;
        visibled.value = true;
    }
    return {
        open,
        visibled,
        formRule,
        formData,
        FormDataRef,
        handleSubmit,
        loadingSubmit,
        onBeforedClose,
    }
}
export default defineComponent({
    setup,
    emits
})
</script>
<style scoped lang="scss">
:deep(.el-dialog.apply_refund-dialog.dialog-center){
    .el-dialog__body {
        padding: 10px 20px;
        .el-textarea__inner{
            --el-input-placeholder-color: #75767c;
        }
        .el-form-item__label{
            color: #17181E;
            font-size: 14px;
            font-weight: 600;
        }
    }
}
</style>