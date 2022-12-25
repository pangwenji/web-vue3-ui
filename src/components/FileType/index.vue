<template>
    <el-image :draggable="false" style="width: 100%; height: 100%" :fit="fit" :src="src" >
        <template #error>
            <div class="error-container" style="font-size:12px;">
                封面加载中
            </div>
        </template>
    </el-image>
</template>
<script>
import getAssetsFile from './fileType'
import { computed, defineComponent } from 'vue'
const props = {
    type:{
        type: String,
        default:'default'
    },
    url:{
        type:String,
        default: ''
    },
    fit:{
        type:String,
        default: 'contain'
    },

}
const files = import.meta.globEager("../../assets/images/FileType/*.png");
const setup = (prop)=>{

    const src = computed(()=>{
        if(prop.type == 'url'){
            return prop.url;
        }else{
            const type = prop.type || 'default'
            for(var key in files){
                const keys = key.split('/').pop();
                if(keys.indexOf(type) > -1){
                    return files[key].default
                }
            }
            return files['../../assets/images/FileType/default.png'].default
        }
    })
    return {
        src
    }
}

export default defineComponent({
    props,
    setup
})

</script>
<style scoped lang="scss">
.error-container{
    user-select: none;
    pointer-events: none;
    color: #A0A0A0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>