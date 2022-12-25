<template>
    <el-container style="height: 100%; background: #0A0B0D; color: white; position:relative;" v-loading="loadingState" element-loading-background="rgba(0, 0, 0, 0)" >
        <LeftSidebar ref="LeftSidebarRef" ></LeftSidebar>
        <el-main style="padding: 0; position:relative; overflow: hidden;">
            <router-view v-slot="{ Component, route }">
                <component :is="Component" :key="route.path"></component>
            </router-view>
        </el-main>
        <!-- <div class="mark" v-if="showMark">
            <el-image :src="development"></el-image>
            <div>正在开发中，敬请期待</div>
        </div> -->
    </el-container>
</template>
<script setup>
    import development from '@/assets/images/development.png'
    import LeftSidebar from './LeftSidebar.vue';
    const showMark = import.meta.env.PROD;
    const loadingState = ref(false);
</script>
<style scoped lang="scss">
    @import './index.scss';
    .mark{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba($color: #000000, $alpha: .6);
        z-index: 9999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:deep(.el-image){
            height: 250px;
            width: 190px;
            transform: rotate(-90deg);
        }
    }
</style>
