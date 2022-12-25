<template>
    <div :style="{color}">
        <svg-icon :iconClass="showType" :size="iconSize"></svg-icon>
    </div>
</template>
<script>
import { computed, defineComponent } from 'vue'
const props = {
    size:{
        type: [Number,String],
        default: 20,
    },
    color:{
        type: String,
        default: '#4E5262'
    },
    type:{
        type: String,
        default: 'default'
    }
}
const setup = (prop)=>{
    const iconSize = computed(()=>{
        if(typeof prop.size == 'string'){
            return prop.size
        }else{
            return `${prop.size}px`
        }
    })
    const showType = computed(()=>{
        if(prop.type.indexOf('audio') > -1){
            return 'icon_type-audio'
        }else if(prop.type.indexOf('image') > -1){
            return 'icon_type-image'
        }else if(prop.type.indexOf('video') > -1){
            return 'icon_type-video'
        }else{
            return 'icon_type-default'
        }
    })
    return {
        iconSize,
        showType
    }
}
export default defineComponent({
    setup,
    props,
})
</script>
