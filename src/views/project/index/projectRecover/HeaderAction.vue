<template>
  <div class="actions-content">
    <div class="actions-content-title">
        <el-button type="danger" :disabled="disabled" @click="handleDeleteAll" round>全部清除</el-button>
    </div>
    <div class="actions-content-right">
        <span>{{length}}个对象</span>
        <span class="link"></span>
        <span>共 {{size}}</span>
    </div>
    <ActionSort :isAsc="sortData.isAsc" :sortKey="sortData.sortKey" @on-sort="handleSortData"></ActionSort>
  </div>
</template>
<script setup>
import { emptyRecycle } from "@/api/project/files.js"
import { computed, reactive } from "vue"
import { useStore } from "vuex"
import ActionSort from "./ActionSort.vue"
import { ElMessageBox, ElMessage } from "element-plus"
const store = useStore();
const projectData = computed(()=>{
    return store.state.project.projectData;
})
const prop = defineProps({
    size:{
        type:[Number,String],
        default:'0B'
    },
    disabled:{
      type: Boolean,
      default:false
    },
    length:{
        type:[Number,String],
        default:'0'
    }
})
const emit = defineEmits(["onDeleteAll","onSort"])
const sortData = reactive({
  isAsc: 1,
  sortKey: 'name',
})
// 排序文件
const handleSortData = (data)=>{
    if(data){
      sortData.isAsc = data.isAsc;
      sortData.sortKey = data.type;
    }
    emit('onSort',sortData);
}
// 清空回收站
const handleDeleteAll = ()=>{
    const text = "是否清空回收站？";
    const title = "清空回收站";
    ElMessageBox.confirm(text, title, {
        customClass: 'messageBox-custom-warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose:true,
        center: true,
        beforeClose: (action, instance, done)=>{
            if(action === 'confirm'){
                instance.confirmButtonLoading = true
                const id = projectData.value.id;
                emptyRecycle({id}).then(res=>{
                    emit('onDeleteAll');
                    ElMessage.success('操作成功');
                    done()
                }).catch(err=>{
                    done()
                })
            }else{
                if(instance.confirmButtonLoading){ return }
                done()
            }
        }
    }).then(()=>{}).catch(err=>{})
}

defineExpose({
  handleSortData
})
</script>
<style scoped lang="scss">
.actions-content {
  :deep(.el-button+.el-button) {
    margin-left: 6px;
  }
}

.actions-content {
  height: 60px;
  width: 100%;
  background: #292A30;
  flex-shrink: 0;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &-title {
    font-size: 14px;
    color: #909399;
  }

  &-right {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    flex: auto;
    margin-left: 20px;
    .link{
        margin: 0 10px;
        align-self: stretch;
        border-left: 1px solid #737685;
    }
  }
}

.actions-hover{
  min-width:30px;
  height: 100%;
  color: rgba($color: #ffffff, $alpha: 0.7);
  font-size: 14px;
  margin-right: 12px;
  height: 30px;
  display: flex;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  cursor: pointer;
  &:hover{
      background: rgba($color: #ffffff, $alpha: .1);
  }
}

.action-file-item {
  padding: 5px 10px;
  position: relative;
  cursor: pointer;
  position: relative;

  span {
    margin-left: 10px;
  }

  &:hover {
    background: #ecf5ff;
    color: #409eff;
  }
}
</style>
