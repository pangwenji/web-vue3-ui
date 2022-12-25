<template>
    <div class="avatar-list-content">
        <!-- <el-avatar class="avatar-item" :size="30"  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar> -->
        <template v-for="(item,index) in avatarList" :key="index">
            <el-avatar :title="item?.nickName" class="avatar-item" :size="30" :src="item?.avatar"  v-if="index < showMax" ></el-avatar>
        </template>
        <span :title="`共${avatarList.length}位成员`" class="number">{{avatarList.length > 99?'99+':avatarList.length}}</span>
    </div>
</template>
<script setup>
import { defineProps } from "vue";

const props = defineProps({
    avatarList:{
        type:Array,
        default(){
            return [];
        }
    },
    showMax:{
        type:Number,
        default: 5,
    }
})
</script>
<style scoped lang="scss">
.avatar-list-content{
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    user-select: none;
    .avatar-item{
        flex-shrink: 0;
        margin-right: -6px;
        cursor: pointer;
        overflow: hidden;
        // border: 1px solid #DFDFFF;
        &:deep(img){
            pointer-events: none;
        }
    }
    .number{
        display: inline-block;
        text-align: center;
        line-height: 30px;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        background: #1E202A;
        color: white;
        cursor: default;
    }
}

</style>
