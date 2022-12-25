<template>
    <div class="menu-item" @click.stop="handleClick"  @mouseover.stop="handleMouseOver" @mouseout.stop="handleMouseOut" aria-describedby="tooltip">
        <div :class="{divided}"></div>
        <div ref="labelRef" :style="{userSelect}"  class="menu-label" :class="{disabled}">
            <el-icon class="el-icon--left" v-if="icon && icon!='none'"><component :is="icon"></component></el-icon>
            <div class="container">
                <slot></slot>
                <slot name="label"></slot>
            </div>
            <el-icon class="el-icon--right" v-if="slots.sub"><ArrowRight /></el-icon>
        </div>
        <div ref="subContentRef" class="menu-sub-item" v-show="visible" v-if="slots.sub">
            <div class="content">
                <slot name="sub"></slot>
            </div>
        </div>
        
    </div>
</template>
<script>
import { ref , defineComponent, nextTick, useSlots} from "vue"
import { createPopper } from '@popperjs/core';
import { ElIcon } from "element-plus";
import { ArrowRight } from '@element-plus/icons-vue'
const name = 'VContextmenuItem'
const props = {
    divided:{
        type: Boolean,
        default:false
    },
    disabled:{
        type: [Boolean,Number,String],
        default:false
    },
    userSelect:{
        type:String,
        default:"none"
    },
    icon:{
        type:String,
        default:"none"
    },
    offset:{
        type: Array,
        default(){
            return [0, 0];
        }
    }
};

const emits = ['click']
const components = {
    ElIcon,
    ArrowRight,
}
const setup = (prop,{emit})=>{
    const visible = ref(false);
    const labelRef = ref();
    const subContentRef = ref();
    const slots = useSlots();
    const options = {
        placement: 'right-start',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: prop.offset,
                },
            },
        ],
    }
    let popperInstance = null
    const handleMouseOver = ()=>{
        if(prop.disabled){ return }
        if(!slots.sub){ return }
        visible.value = true;
        nextTick(()=>{
            if(popperInstance){ return }
            popperInstance = createPopper(labelRef.value, subContentRef.value,options);
        })
    };
    const handleMouseOut = ()=>{
        if(!slots.sub){ return }
        visible.value = false;
        if(popperInstance){
            popperInstance.destroy();
            popperInstance = null;
        }
    };
    // 点击菜单
    const handleClick = (e)=>{
        if(prop.disabled){ return }
        emit('click');
        if(!slots.sub){
            if(e.path){
                for(var item of e.path){
                    if(item.dataset&&item.dataset.type == 'contextmenu'){
                        item.blur();
                        break;
                    }
                }
            }else{
                let target = e.target;
                let number = 1;
                while(target.parentNode !== null&&number <= 10){
                    number += 1 ;
                    if(target.parentNode.dataset&&target.parentNode.dataset.type == 'contextmenu'){
                        target.parentNode.blur();
                        break;
                    }else{
                        target = target.parentNode;
                    }
                }
            }
        }
    }
    return {
        slots,
        visible,
        labelRef,
        handleClick,
        subContentRef,
        handleMouseOut,
        handleMouseOver
    };
}



export default defineComponent({
    name,
    emits,
    props,
    setup,
    components,
})

</script>
<style scoped lang="scss">
.menu-item{
    font-size: 14px;
    .divided{
        border-top: 1px solid #f2f2f2;
        margin:5px 0;
    }
    .menu-label{
        padding: 5px;
        border-radius: 4px;
        background: white;
        display: flex;
        align-items: center;
        cursor: pointer;
        .container{
            display: flex;
            align-items: center;
            flex-grow: 1;
        }
        &:hover{
            background: #f4f4f5;
        }
        &:deep(.el-icon){
            flex-shrink: 0;
        }
        &.disabled{
            color: #A0A0A0;
            cursor:no-drop;
            &:hover{
                background: none;
            }
        }
    }
    .menu-sub-item{
        padding: 0px 10px;
        .content{
            background: white;
            border-radius: 4px;
            box-shadow:var(--el-box-shadow-light);
        }
    }
}
</style>