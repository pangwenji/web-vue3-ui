<template>
    <div class="message-system-container">
        <div class="title" v-if="title">{{title}}</div>
        <div class="content">
            <slot name="default"></slot>
        </div>
        <div class="footer" @click="handleClickFooter" v-if="showButton">
            <span style="color:#3468FE">查看详情</span>
            <span>
                <SvgIcon iconClass="icon_right" :size="16"  ></SvgIcon>
            </span>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import SvgIcon from '@/components/SvgIcon';
const compenents = {
    SvgIcon
}
const emits = ['clickFooter']
const props = {
    title:{
        type:String,
        default: ''
    },
    showButton:{
        type:Boolean,
        default: true
    }
}
const setup = (prop,{emit})=>{
    const handleClickFooter = ()=>{
        emit('clickFooter')
    }
    return {
        emit,
        handleClickFooter
    }
}
export default defineComponent({
    setup,
    props,
    emits,
    compenents
})
</script>

<style scoped lang="scss">
.message-system-container {
    background: #222225;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
    padding: 10px 20px;
    color: white;
    font-size: 14px;
    .title {
        color: #ffffff;
        font-weight: 500;
        padding-bottom: 10px;
    }
    .content {
        padding-bottom: 10px;
        color: #9094A6;
        pre {
            margin: 0;
        }
    }
    .footer {
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: -10px;
        cursor: pointer;
        color: #c2c7ce;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid rgba($color: #979797, $alpha: 0.1);
    }
}
</style>