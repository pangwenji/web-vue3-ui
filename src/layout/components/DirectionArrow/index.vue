<template>
    <div class="direction-container" >
        <div class="direction-box" style="float: left;" @click="handleBackoff">
            <el-icon :size="15" title="后退" class="icon-arrow"><arrow-left-bold /></el-icon>
        </div>
        <div class="direction-box" style="float: right;" @click="handleForward">
            <el-icon :size="15" title="前进" class="icon-arrow"><arrow-right-bold /></el-icon>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
const setup = ()=>{
    const router = useRouter();
    // 前进
    const handleForward = ()=>{
        router.go(1)
    }
    // 后退
    const handleBackoff = ()=>{
        router.go(-1)
    }
    return {
        handleForward,
        handleBackoff,
    }
}
export default defineComponent({
    setup
})
</script>

<style scoped lang="scss">
.direction-container{
    float: left;
    height: 100%;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    align-items: center;
    .direction-box{
        display: inline-block;
        border: 1px solid #2C2E38;
        border-radius: 4px;
        margin: 0 5px;
        position: relative;
        height: 25px;
        width: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #8B8B8B;
        cursor: pointer;
        // padding: 0px 15px;
        &:hover{
            background-color: white;
            color: #232231;
            font-weight: bold;
        }
    }

}
</style>