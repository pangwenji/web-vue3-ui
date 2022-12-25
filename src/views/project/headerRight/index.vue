<template>
    <div class="upgrade-box" style="color:#ccc;" >
        <div class="xing-bnt mr-20"  @click="handleOpenRecharge">购买同钱</div>
        <!--div class="upgrade-bnt" @click="membershipDialogVisible = true">会员升级通道</div-->
    </div>
    <!-- <el-dialog
        v-model="membershipDialogVisible"
        title="会员升级通道"
        width="30%"
    >
        <div>99元</div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="membershipDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="membershipDialogVisible = false"
            >确定</el-button
            >
        </span>
        </template>
    </el-dialog> -->
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'
const { proxy } = getCurrentInstance();
// const membershipDialogVisible= ref(false)
const handleOpenRecharge = ()=>{
    proxy.$pay.openRecharge()
}
</script>
<style scoped lang="scss">
.upgrade-box{
    display: flex;
    align-items: center;
    margin-right: 40px;
    .upgrade-bnt{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 30px;
        color: #a8890c;
        background: #514848;
        border-radius: 20px;
        font-size: 13px;
    }
    .xing-bnt{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 30px;
        color: #a8890c;
        background: #46008d;
        border-radius: 20px;
        font-size: 13px;
    }
}
.mr-20{
    margin-right: 20px;
}
</style>
