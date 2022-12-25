<template>
    <div class="drag-box" v-if="visible">
        <div class="drag-bg" @drop.prevent="onFileDrop" @dragleave.prevent="onDragLeave">
            <div><el-icon color="#FFFFFF" :size="50"><upload-filled /></el-icon></div>
            <div style="margin-bottom: 60px">在此释放上传</div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";

// 设置属性
const visible = ref(false);

const onDragLeave = ()=>{
    visible.value = false;
}
// 设置回调方法
const emits = defineEmits(['onDrop'])


// 拖拽文件放入
const onFileDrop = (e)=>{

    visible.value = false;
    const items = e.dataTransfer.items;
    emits('onDrop',items);
}
defineExpose({
    visible
})
</script>
<style scoped lang="scss">
.drag-box{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    .drag-bg{
        width: 100%;
        height: 100%;
        color: #FFFFFF;
        background:  linear-gradient(180deg,transparent,#409EFF);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        font-size: 16px;
        user-select: none;
        *{
            pointer-events: none;
        }
    }    
}
</style>