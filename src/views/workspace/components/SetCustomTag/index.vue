<template>
    <el-dialog v-model="visibled" width="480px" title="设置分类标签" :before-close="onBeforeClose" custom-class="dialog-center">
        <el-checkbox-group v-model="selectTags" class="custom-checkbox-group" fill="#3468FE" text-color="#3468FE" v-if="tagData.length > 0">
            <el-row :gutter="20" >
                <el-col v-for="(item,index) in tagData"  :span="8">
                    <el-checkbox :label="item.id" border style="margin-bottom: 20px; width:100%;" >{{item.title}}</el-checkbox>
                </el-col>
            </el-row>
        </el-checkbox-group>
        <div style="font-size: 30px; color: #979797; text-align:center;" v-else>暂无标签可以设置</div>
        <template #footer>
            <span>
                <el-button type="primary" color="#3468FE" :loading="loadingSubmit" :disabled="!tagData.length" @click="handleSubmit">保存设置</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
import { defineComponent } from 'vue'
import { setShowTags } from '@/api/personnel/file';
import { ElMessage } from 'element-plus';
const emits = ['submit']
const setup = (prop,{emit})=>{
    const visibled = ref(false);
    const selectTags = ref([]);
    const tagData = ref([]);
    const onBeforeClose = (deno)=>{
        selectTags.value = [];
        tagData.value = [];
        if(typeof deno == 'function'){
            deno();
        }else{
            visibled.value = false
        }
    }
    // 提交保存
    const loadingSubmit = ref(false);
    const handleSubmit = ()=>{
        if(selectTags.value.length > 5){
            ElMessage.warning('最多只能选择展示五个标签');
            return
        }
        loadingSubmit.value = true;
        const data = tagData.value.map(item=>{
            return {
                id: item.id,
                ifView: Number( selectTags.value.indexOf(item.id) > -1),
            }
        })
        setShowTags(data).then(res=>{
            loadingSubmit.value = false;
            ElMessage.success('设置成功')
            emit('submit',selectTags.value);
            onBeforeClose();
        }).catch(err=>{
            loadingSubmit.value = false;
        })
    }
    const open = (tags,select)=>{
        tagData.value = tags;
        selectTags.value = select;
        visibled.value = true;
    }
    return {
        open,
        tagData,
        visibled,
        selectTags,
        handleSubmit,
        onBeforeClose,
        loadingSubmit,
    }
}
export default defineComponent({
    setup,
    emits,
})
</script>
<style scoped lang="scss">
.custom-checkbox-group{
    &:deep(.el-checkbox){
        --el-checkbox-checked-bg-color: #3468FE;
        --el-checkbox-checked-text-color: #3468FE;
        --el-checkbox-input-border-color-hover: #3468FE;
        --el-checkbox-checked-input-border-color: #3468FE;
    }
}
</style>
