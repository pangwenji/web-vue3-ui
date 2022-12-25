<template>
    <div class="custom_card-box" style="padding: 60px 0">
        <div class="realase_success-image"></div>
        <div class="realase_success-desc">你的招募需求已经提交，</div>
        <div class="realase_success-desc">平台工作人员将在1个工作日内进行审核。</div>
        <div style="text-align:center; margin-top: 30px;">
            <el-button type="primary" color="#53CEDC22" size="large" style="color: #0095A8;" @click="handleToWork">去工种库看看</el-button>
            <el-button type="primary" color="#3468FE" size="large" @click="handleViewDetail">查看详情</el-button>
        </div>
    </div>
    <!-- <el-dialog v-model="visibled" :show-close="false" :before-close="onBeforeClose" width="500px" custom-class="dialog-center" :close-on-press-escape="false" :close-on-click-modal="false">
        <div class="realase_success-image"></div>
        <div class="realase_success-desc" style="color:black;">你的招募需求已经提交，</div>
        <div class="realase_success-desc" style="color:black;">平台工作人员将在1个工作日内进行审核。</div>
        <div style="text-align:center; margin-top: 30px;">
            <el-button type="primary" class="realase_success-button" color="#53CEDC22" size="large" style="color: #0095A8;" @click="handleToWork">去工种库看看</el-button>
            <el-button type="primary" class="realase_success-button" color="#3468FE" size="large" @click="handleViewDetail">查看详情</el-button>
        </div>
    </el-dialog> -->
</template>
<script>
import { defineComponent } from 'vue'
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
const emits = ['next']
const setup = (prop,{emit})=>{
    const router = useRouter();
    const visibled = ref(true);
    const onBeforeClose = (deno)=>{

    }
    const handleViewDetail = ()=>{
        emit('next',{step:3})
    }
    const handleToWork = ()=>{
        router.replace({path:'/workspace/work/type'});
    }
    return {
        visibled,
        handleToWork,
        onBeforeClose,
        handleViewDetail
    }
}
export default defineComponent({
    setup,
    emits,
})
</script>

<style lang="scss" scoped>
    .realase_success-image{
        height: 235px;
        background-image: url('@/assets/images/realase_success.png');
        background-repeat: no-repeat;
        background-size: auto 100%;
        background-position: center ;
        margin-bottom: 20px;
    }
    .realase_success-desc{
        text-align: center;
        color: white;
        font-size: 18px;

    }
    .realase_success-button{
        width: 150px;
        border-radius: 10px;
        font-size: 18px;
        &+.realase_success-button{
            margin-left: 40px;
        }
    }
</style>