<template>
    <el-dialog v-model="isShow" width="556px" :show-close="false" center custom-class="dialog-center" v-bind="$attrs">
        <div class="content">
            <el-image class="img" :src="succImg"/>
            <div class="msg">你的报名信息成功投递</div>
        </div>
        <template #footer>
            <el-button type="default" size="large" class="chat" @click="handleCath"><i class="icon-msg"></i>聊一聊</el-button>
            <el-button type="primary" size="large" class="detail" @click="linkToDetail">查看详情</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import succImg from '@/assets/images/succ_img.png'

const isShow = ref(false)
const router = useRouter()
const emits = defineEmits(['onCath'])
const linkToDetail = ()=> {
    isShow.value = false
    router.push(`/workspace/admin/enroll`)
}
// 聊一聊
const handleCath = ()=>{
    emits('onCath');
    isShow.value = false
}

defineExpose({
    isShow
})
</script>

<style lang="scss" scoped>
.btn {
    width: 120px;
    border: none;
    border-radius:10px;
}
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img {
        width: 196px;
        height: 160px;
    }
    .msg {
        font-size: 18px;
        font-weight: 400;
        color: #17181E;
    }
}
.chat {
    background: #DDF5F8;
    color: #53CEDC;
    @extend .btn;
    .icon-msg {
    background-image: url('@/assets/icons/work/msg_green.png');
    background-repeat: no-repeat;
    width: 20px;
    height: 16px;
    margin: 0 8px 0 0;
    background-size: 100%;
    }
}
.detail {
    margin-left: 44px;
    background: #3468FE;
    @extend .btn;
}
</style>