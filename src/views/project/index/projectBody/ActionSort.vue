<template>
<div class="actions-hover" ref="sortAction">
  <span class="sort-content" :class="isAsc == 1?'asc':'desc'" title="排序">
    {{sortItem.name}}
    <!-- <el-icon class="el-icon--right"><DCaret /></el-icon> -->
  </span>  
  <el-popover placement="bottom" popper-class="popover-project-sort" :virtual-ref="sortAction" virtual-triggering :hide-after="0" trigger="click">
    <div class="sort-menu-title">排序</div>
    <div class="sort-menu-item" @click="handleCheck(item)" v-for="(item,index) in sortItems" :key="index">
      {{item.name}}
      <span v-if="sortKey == item.type" class="check"><el-icon><Check /></el-icon></span>
    </div>
    <div class="sort-menu-title">规则</div>
    <!-- <div class="sort-menu-type">
      <el-radio-group fill="#3468FE" :model-value="isAsc" @change="handleChange">
        <el-radio-button :label="1">升序</el-radio-button>
        <el-radio-button :label="0">降序</el-radio-button>
      </el-radio-group>
    </div> -->
    <div class="sort-menu-item" @click="handleChange(index)" v-for="(item,index) in sortItem.desc" :key="index">
      {{item}}
      <span v-if="isAsc == (index + 1)" class="check"><el-icon><Check /></el-icon></span>
    </div>

  </el-popover>
</div>
</template>
<script setup>
import {useStore} from "vuex";
import { computed, ref } from "vue";
const sortItems = [ 
  {
    name:'添加日期',
    type:'createTime',
    desc:['由旧到新','由新到旧'],
  },
  {
    name:'文件名称',
    type:'name',
    desc:['文件名正序','文件名倒序'],
  },
  {
    name:'审核状态',
    type:'reviewStatus',
    desc:['状态正序','状态倒序'],
  },
  {
    name:'文件大小',
    type:'size',
    desc:['由小到大','由大到小'],
  }
];
const store = useStore();
const sortAction = ref();
const sortKey = computed(()=>{
  return store.state.project.sortKey;
})
const sortItem = computed(()=>{
  for(const item of sortItems){
      if(item.type == sortKey.value){
        return item;
      }
  }
  return {}
})
const isAsc = computed(()=>{
  return store.state.project.isAsc;
})
const emit = defineEmits(['onChangeItem','onChangeType'])
const handleCheck = (e)=>{
  store.commit('project/SET_SORT_KEY',e.type)
  store.dispatch('project/handleSortFolders')
  store.dispatch('project/handleSortFiles')
}
const handleChange = (e)=>{
  store.commit('project/SET_IS_ASC',e + 1)
  store.dispatch('project/handleSortFolders')
  store.dispatch('project/handleSortFiles')
}
</script>
<style lang="scss">
  .el-popover.popover-project-sort{
    padding: 10px 0;
  }
</style>
<style scoped lang="scss">
.sort-content{
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  padding-right: 16px;
  &::after{
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-width: 5px;
    position: absolute;
    border-style: solid;
    right: 0;
    top: -2px;
    border-color:transparent  transparent rgba(255, 255, 255, 0.7) transparent;
  }
  &::before{
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-width: 5px;
    position: absolute;
    border-style: solid;
    right: 0;
    bottom: -2px;
    border-color: rgba(255, 255, 255, 0.7) transparent transparent transparent;
  }
  &.desc{
    &::before{
      border-color: #3468FE transparent transparent transparent;
    }


  }
  &.asc{
    &::after{
      border-color:transparent  transparent #3468FE transparent;
    }
  }
}
.sort-menu-item{
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  &:hover{
    background:  rgba(236, 245, 255, 0.5);
    color: #3468FE;
  }
  .check{
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 50%;
    color: #3468FE;
    font-size: 18px;
    transform: translateY(-50%);
  }
}
.sort-menu-title{
  color: #9B9EAE;
  font-size: 12px;
  padding: 5px 10px;
  border-top: 1px solid  #F2F2F2;
  &:first-of-type{
    border-top: none;
  }
}
.sort-menu-type{
  padding: 5px 10px;
  text-align: center;
}
</style>