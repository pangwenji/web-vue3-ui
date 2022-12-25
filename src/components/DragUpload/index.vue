<template>
    <teleport to="body">
        <div class="drag-box" v-if="visible">
            <div class="drag-bg"  @drop.prevent="onFileDrop" @dragleave.prevent="onDragLeave">
                <div><el-icon color="#FFFFFF" :size="50"><upload-filled /></el-icon></div>
                <div style="margin-bottom: 60px">在此释放上传</div>
            </div>
        </div>
    </teleport>
</template>
<script setup>
import { onUnmounted, ref } from "vue";

const props = defineProps({
    onShowBefor:{
        type:Function,
        default: null,
    }
})

// 设置属性
const visible = ref(false);

// 文件移入
const onDragOver = (e)=>{
    if(props.onShowBefor){
        props.onShowBefor(e,()=>{
            visible.value = true;
        })
    }else{
        visible.value = true;
    }
}
const onDragLeave = ()=>{
    visible.value = false;
}

document.body.addEventListener('dragover',onDragOver)

// 设置回调方法
const emits = defineEmits(['onDrop'])


// 拖拽文件放入
const onFileDrop = (e)=>{

    visible.value = false;
    const items = e.dataTransfer.items;
    emits('onDrop',items);
}

onUnmounted(()=>{
    document.body.removeEventListener('dragover',onDragOver)
})
</script>
<style scoped lang="scss">
.drag-box{
    position: fixed;
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