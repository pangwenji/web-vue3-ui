<template>
    <el-dialog v-model="visibled" :show-close="true" width="500px" :close-on-press-escape="false" :close-on-click-modal="true"
        custom-class="dialog-center">
        <div class="create-order-success-image"></div>
        <div class="create-order-success-state">下单成功</div>
        <div class="create-order-success-desc">你的需求已通知创作者</div>
        <div class="create-order-success-desc">创作者确定后,将与你联系.</div>
        <template #footer>
            <div class="create-order-success-footer">
                <el-button type="primary" @click="handleContact" size="large" :loading="loadingState" style="width: 150px;border-radius: 10px; color: #0095A8; " color="#DDF5F8">联系Ta</el-button>
                <el-button type="primary" @click="linkToOrder" size="large" style="width: 150px;border-radius: 10px;" color="#3468FE">查看订单</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script>
import {  defineComponent, getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserImAccount } from '@/api/IM.js'
const setup = () => {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const router = useRouter()
    const no = ref(null);
    const userId = ref(null);
    const visibled = ref(false);
    const loadingState = ref(false);
    // 查看订单
    const linkToOrder = () => {
        if(loadingState.value){
            return
        }
        router.push({ path: `/workspace/admin/goods_detail/${no.value}` })
        visibled.value = false;
    }
    // 联系ta
    const handleContact = ()=>{
        loadingState.value = true;
        getUserImAccount({userId:userId.value}).then(res=>{
            const {avatar, imAccountId, name, phone} = res.data;
            loadingState.value = false;
            visibled.value = false;
            proxy.$sessionBox.openDialog({account: imAccountId, avatar , name});
        }).catch(err=>{
            loadingState.value = false;
        })
    }
    // 打开
    const open = (orderNo,uId) => {
        no.value = orderNo;
        userId.value = uId;
        visibled.value = true;
    }
    return {
        no,
        open,
        userId,
        visibled,
        linkToOrder,
        loadingState,
        handleContact,
    }
}
export default defineComponent({
    setup,
})
</script>
<style lang="scss" scoped>
    .create-order-success-image{
        background-image: url(@/assets/images/create-order-success.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        width: 260px;
        height: 190px;
        margin: 0 auto;
    }
    .create-order-success-state{
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        color: #1C1D24;
        margin: 30px 0;
    }
    .create-order-success-desc{
        text-align: center;
        font-size: 18px;
        color: #1C1D24;
        text-align: center;
    }
    .create-order-success-footer{
        display: flex;
        justify-content: space-around;
        &:deep(.el-button){
            margin: 0;
        }
    }
</style>