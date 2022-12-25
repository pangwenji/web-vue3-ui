<template>
    <el-empty :description="description" :image-size="imageSize" :image="imageSrc">
        <template #default>
            <slot></slot>
        </template>
        <!-- <template #image>
            <slot name="image"></slot>
        </template> -->
        <template #description v-if="!description">
            <slot name="description"></slot>
        </template>
    </el-empty>
</template>
<script>
import { computed, defineComponent } from 'vue'
import { ElEmpty } from 'element-plus'
import EmptyImage from '@/assets/images/empty.png'
import EmptyImageWhite from '@/assets/images/empty-white.png'
const components = {
    ElEmpty
}
const props = {
    image:{
        type:String,
        default: '',
    },
    imageType:{
        type:String,
        default: 'black',
    },
    imageSize:{
        type:Number,
        default: null,
    },
    description:{
        type:String,
        default: '暂无数据',
    },
}
const setup = (prop)=>{
    const imageSrc = computed(()=>{
        if(prop.image){
            return prop.image;
        }else{
            if(prop.imageType == 'black'){
                return EmptyImage;
            }else{
                return EmptyImageWhite;
            }
        }
    })
    return {imageSrc}
}
export default defineComponent({
    setup,
    props,
    components,
})
</script>
