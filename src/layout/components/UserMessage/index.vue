<template>
    <div>
        <el-tooltip effect="light" :show-after="500" content="消息通知" placement="bottom">
            <div class="message-container hover-effect" @click="handleClick">
                <el-badge :value="unreadNum" :max="99" :hidden="!unreadNum" style="line-height: normal;" >
                    <!-- <el-icon :size="24" color="#ffffff" >
                        <chat-dot-round />
                    </el-icon> -->
                    <div class="icon-box">
                        <svg-icon iconClass="icon_message" :size="32"></svg-icon>
                    </div>
                </el-badge>
            </div>
        </el-tooltip>
    </div>
</template>
<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex';
const { proxy } = getCurrentInstance();
const store = useStore();
const unreadNum = computed(()=> store.getters['IM/unreadNum'])
const handleClick = ()=>{
    proxy.$sessionBox.open({});
}
</script>

<style scoped lang="scss">
.message-container {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    // padding: 0 10px;
    margin-right: 18px;
    cursor: pointer;
    &:deep(.el-badge){
        .el-badge__content{
            border: none;
        }
    }
    .icon-box{
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #21222B;
        border-radius: 10px;

    }
}



</style>
