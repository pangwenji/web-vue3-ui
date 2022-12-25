<template>
    <div class="reject-refund-box">
        <el-dialog v-model="visibled" width="450px" :before-close="onBeforeClose" custom-class="dialog-center">
            <template #title>
                <div class="dialog-title-box">
                    <el-icon class="el-icon--left" :size="26" color="#F03860">
                        <WarningFilled />
                    </el-icon><span>拒绝订单</span>
                </div>
            </template>

            <el-form :model="formData" label-position="top" ref="FormDataRef">
                <el-form-item label="拒绝理由" prop="rejectRefundId" :rules="[{required: true, message:'请选择拒绝理由', trigger:'blur'}]">
                    <el-select v-model="formData.rejectRefundId" @change="handleChangeText" placeholder="请选择拒绝理由" size="large" style="width: 100%;">
                        <template v-for="(item,index) in listData" :key="index">
                            <el-option :value="item.id" :label="item.text"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="其他理由说明" prop="rejectRefundText" v-if="formData.rejectRefundId == 6" :rules="[{required: true, message:'请填写其他拒绝理由', trigger:'blur'}]">
                    <el-input  v-model="formData.rejectRefundText" show-word-limit :maxlength="200" size="large" placeholder="请填写其他拒绝理由"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span>
                    <el-button style="border-radius: 8px; width:80px;" size="large" type="default" @click="onBeforeClose">取消</el-button>
                    <el-button style="border-radius: 8px; width:80px;" size="large" type="primary" color="#F03860" :loading="loadingSubmit" @click="hadleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { updateOrderStatus } from "@/api/personnel/personnelConsole"
import { defineComponent, reactive, ref } from 'vue'
const setup = (prop, { emit }) => {
    const visibled = ref(false);
    const FormDataRef = ref();
    const loadingSubmit = ref(false);
    const formData = reactive({
        orderNo: '',
        rejectRefundId:null,
        rejectRefundText: '',
        status: 2,
    })
    const listData = [
        {
            id: 1,
            text: '雇主需求不明确',
        },
        {
            id: 2,
            text: '无法满足雇主需求',
        },
        {
            id: 3,
            text: '工作量与酬劳不匹配',
        },
        {
            id: 4,
            text: '需求描述与实际需求不符',
        },
        {
            id: 5,
            text: '因私事、伤病等原因无法创作',
        },
        {
            id: 6,
            text: '其他',
        },
    ]
    const onBeforeClose = (deno)=>{
        if(loadingSubmit.value){ return }
        FormDataRef.value.resetFields();
        formData.orderNo = '';
        formData.rejectRefundText = ''
        if(typeof deno == 'function'){
            deno();
        }else{
            visibled.value = false;
        }
    }
    const handleChangeText = (e)=>{
        if(e == 6){
            formData.rejectRefundText = ''
            return
        }
        formData.rejectRefundText = listData[e-1].text;
    }
    const hadleSubmit = ()=>{
        FormDataRef.value.validate((vali)=>{
            if(vali){
                loadingSubmit.value = true;
                updateOrderStatus(formData).then(res=>{
                    loadingSubmit.value = false;
                    emit('onSubmit',res.data)
                    onBeforeClose();
                }).catch(err=>{
                    loadingSubmit.value = false;
                })
            }
        })
    }
    const open = (e) => {
        formData.orderNo = e.orderNo;
        visibled.value = true;
    }
    return {
        open,
        listData,
        formData,
        visibled,
        hadleSubmit,
        FormDataRef,
        onBeforeClose,
        loadingSubmit,
        handleChangeText,
    }
}
export default defineComponent({
    setup
})
</script>
<style scoped lang="scss">
.reject-refund-box {
    &:deep(.el-dialog__body){
        padding: 0px 20px;
        .el-form-item__label{
            color: #3D3F50;
            font-size: 14px;
            font-weight: normal;
        }
        .el-input {
                // background: transparent;
                --el-input-border: none;
                --el-input-border-color: transparent;
                --el-input-bg-color: #ECECEC;
                --el-input-icon-color: #C4C9D3; 
                --el-input-placeholder-color: #C4C9D3; 
            }
        
    }
    .dialog-title-box {
        display: flex;
        color: #181920;
        font-size: 16px;
        align-items: center;
        font-weight: 500;
    }
}
</style>