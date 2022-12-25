<template>
    <teleport to="body">
        <transition name="contextmenu">
            <div v-if="visible" ref="contextmenuBoxRef" data-type="contextmenu" class="contextmenu-box" @blur="onBlur" @contextmenu.prevent="false" :tabindex="-1"  :aria-hidden="!visible" :style="style">
                <slot></slot>
            </div>
        </transition>
    </teleport>
</template>
<script>
import { ref, computed , nextTick, defineComponent, watch } from "vue"
const name = 'VContextmenu';
const emit =  ['show'];
const props = {
    disabled:{
        type: Boolean,
        defeault: false,
    },
    
    beforeClose:{
        type:Function,
        default: null
    },

    width:{
        type: Number,
        default: 100
    }
}
const setup = (prop,{emit})=>{
    const contextmenuBoxRef = ref();
    const visible = ref(false);
    const trigger = ref({ X:0, Y:0});
    const style = computed(()=>{
        return {
            top:`${trigger.value.Y}px`,
            left:`${trigger.value.X}px`,
            width:`${prop.width}px`
        }
    })
    // 监听右键操作
    const handle = (e)=>{
        if(prop.disabled){return}
        e.preventDefault(); //阻止默认事件
        e.stopPropagation();//阻止事件冒泡
        visible.value = true;
        nextTick(()=>{
            const BHeight = document.body.offsetHeight;
            const BWidth = document.body.offsetWidth;
            const CHeight = contextmenuBoxRef.value.offsetHeight;
            const CWidth = contextmenuBoxRef.value.offsetWidth;
            // 判断X轴的边缘
            if((BWidth - e.pageX) <= CWidth){
                trigger.value.X = e.pageX - CWidth;
            }else{
                trigger.value.X = e.pageX;
            }
            // 判断Y轴的边缘
            if((BHeight - e.pageY) <= CHeight){
                trigger.value.Y = e.pageY - CHeight;
            }else{
                trigger.value.Y = e.pageY;
            }
            contextmenuBoxRef.value.focus();
        })
    }
    // 监听事件
    const addReference = (el,options)=>{
        const trigger = options?.trigger || 'contextmenu'
        el.addEventListener(trigger,handle);
    }
    // 删除右键事件监听
    const removeReference = (el,options)=>{
        const trigger = options?.trigger || 'contextmenu'
        el.removeEventListener(trigger,handle);
    }

    // 失去焦点
    const onBlur = ()=>{
        if(prop.beforeClose&&typeof prop.beforeClose == 'function'){
            prop.beforeClose(()=>{
                visible.value = false;
            })
        }else{
            visible.value = false;
        }
    }

    const handleMouseWheel = ()=>{
        visible.value = false;
    }

    watch(visible,(value)=>{
        if(value){
            document.body.addEventListener('mousewheel',handleMouseWheel);
        }else{
            document.body.removeEventListener('mousewheel',handleMouseWheel);
        }
    })

    return {
        contextmenuBoxRef,
        style,
        trigger,
        visible,
        onBlur,
        addReference,
        removeReference
    }
}

export default defineComponent({
    name,
    emit,
    props,
    setup
})
</script>
<style lang="scss" scoped>
    .contextmenu-box{
        width: 100px;
        // height: 100px;
        cursor: default;
        background:white;
        position: fixed;
        z-index:9999;
        padding: 5px;
        box-sizing: border-box;
        outline: none;
        border-radius: 4px;
        box-shadow:var(--el-box-shadow-light);
    }
    .contextmenu-enter-active, .contextmenu-leave-active {
        transition: opacity .1s ease, transform .1s ease;
        transform-origin: 0% 0%;
    }
    .contextmenu-enter-from, .contextmenu-leave-to {
        opacity: 0;
        transform: scale(.4);
    }
    .contextmenu-enter-to, .contextmenu-leave-from {
        opacity: 1;
        transform: scale(1);
    }
</style>
