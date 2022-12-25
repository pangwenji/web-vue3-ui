<template>
    <el-scrollbar height="100%" view-class="scroll-container-view" v-loading="loadingStatus" element-loading-background="rgba(0,0,0,0)">
        <div class="left-container">
            <keep-alive :include="['step_1']">
                <Step1 @next="handleNextStep" key="step_1" v-model:loading="loadingStatus" v-if="stepIndex == 0"></Step1>
                <Step2 @next="handleNextStep" key="step_2" v-else-if="stepIndex == 1"></Step2>
                <Step3 @next="handleNextStep" key="step_3" v-else-if="stepIndex == 2"></Step3>
            </keep-alive>
        </div>
        <div class="right-container" v-if="stepIndex > -1">
            <div class="custom_card-box" style="margin-bottom: 20px;overflow:hidden;">
                <div class="admin_release-title3" style="background: #24262F;">发布流程</div>
                <div class="release_step-box">
                    <template v-for="(item,index) in steps" :key="index">
                        <div class="step-item after-line before-line" :class="stepClass(index)">
                            <div class="step-number">
                                <span v-if="stepIndex <= index">{{index+1}}</span>
                                <el-icon :size="16" v-else><Select /></el-icon>
                            </div>
                            <div class="step-content">{{item.name}}</div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="custom_card-box">
                <div class="admin_release-title3">帮助中心</div>
                <router-link to="/help/guide?id=1592097687789277186" target="_blank" class="admin_release-help">雇主指南</router-link>
                <router-link to="/help/guide?id=1592097464434200578" target="_blank" class="admin_release-help">雇主常见疑问</router-link>
            </div>
        </div>
    </el-scrollbar>
</template>
<script setup>
    import { computed, getCurrentInstance, ref } from 'vue'
    import { useRouter, onBeforeRouteUpdate } from 'vue-router'
    import Step1 from './Step_1.vue'
    import Step2 from './Step_2.vue'
    import Step3 from './Step_3.vue'
    const steps = [
        {
            key: 'step_1',
            name: '填写招募需求',
        },
        {
            key: 'step_2',
            name: '支付保证金/托管预算',
        },
        {
            key: 'step_3',
            name: '发布到招募墙或者自主邀请创作者',
        }
    ]
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const stepIndex = ref(-1);
    const recruitId = ref(0);

    proxy.$Authentication.open(() => {
        stepIndex.value = 0;
    })

    // 返回上一步
    onBeforeRouteUpdate((to, from) => {
        if (from.query.step == 2) {
            router.push({path:`/workspace/admin/recruit`})
        } else {
            stepIndex.value = to.query.step || 0
        }
    })

    const stepClass = (index)=>{
        return {  
            'success-before-line': index <= stepIndex.value,  
            'success': index <= stepIndex.value - 1,
            'active': index == stepIndex.value,
        }
    }
    // 进行下一步
    const handleNextStep = ({ step , id})=>{
        if(step <= 2){
            stepIndex.value = step;
            recruitId.value = id;
            router.push({path: route.path, query:{step: step}})
        }else{
            if(recruitId.value){
                router.replace({path:`/workspace/admin/recruit`})
            }
        }
    }
    const loadingStatus = ref(false);
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>