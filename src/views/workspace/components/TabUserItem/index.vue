<template>
<div>
    <div class="menu-item-user" :class="{active}" @click="emit('onView',user)">
        <el-avatar :src="user.avatar" :size="27" />
        <span class="text">{{ user.nickName }}</span>
        <span v-contextmenu:contextmenu="{trigger:'click'}" class="other-icon">
            <el-icon>
                <MoreFilled />
            </el-icon>
        </span>
    </div>
    <v-contextmenu :width="130" ref="contextmenu">
        <v-contextmenu-item @click="emit('onDelete',user)">
            <svg-icon iconClass="icon_setting" size="20px"></svg-icon>
            <span style="margin-right: 4px;">取消对比</span>
        </v-contextmenu-item>
    </v-contextmenu>
</div>

</template>
<script lang="ts">
import { defineComponent } from "vue";
const props = {
    active:{
        type: Boolean,
        default: false, 
    },
    user: {
        type: Object,
        default() {
            return {};
        },
    },
};
const emits = ["onDetele", "onView"];
const setup = (prop,{emit}) => {
    return {
        emit
    };
};
export default defineComponent({
    setup,
    props,
    emits,
});
</script>
<style scoped lang="scss">
.menu-item-user {
    color: #9094a6;
    font-size: 10px;
    width: 100%;
    height: 40px;
    margin-top: 8px;
    padding: 0 10px;

    display: flex;
    border-radius: 8px;
    align-items: center;
    position: relative;
    cursor: pointer;
    &:deep(.el-avatar){
        flex: none;
    }
    .text {
        margin-left: 10px;
        margin-right: 20px;
        width: 80%;
        overflow: hidden;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
    }
    .other-icon {
        width: 20px;
        height: 20px;
        flex: none;
        transform: rotate(90deg) translateX(-50%);
        display: none;
        position: absolute;
        right: 10px;
        font-size: 14px;
        top: 50%;
        // display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        &:hover {
            color: white;
        }
    }
    &.active{
        background-color: #4E5262;
        color: white;
    }
}

.menu-item-user:hover {
    background-color: #4E5262;
    color: white;
    .other-icon {
        display: flex;
    }
}

</style>