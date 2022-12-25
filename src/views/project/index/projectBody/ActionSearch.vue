<template>
    <div class="action-search-box">
        <el-icon color="#38393D"><Search /></el-icon>
        <input placeholder="搜索名称" @input="handleInput" />
    </div>
</template>
<script setup>
import { useStore } from "vuex"
const store = useStore()
const handleInput = (e)=>{
    store.commit('project/SET_SEARCH_KEY',e.target.value);
}
</script>
<style scoped lang="scss">
.action-search-box{
    height: 32px;
    border-radius: 20px;
    padding: 0 10px;
    background: #0C0D11;
    display: flex;
    align-items: center;
    color: white;
    margin-right: 12px;
    input{
        color: white;
        width: 130px;
        margin-left: 10px;
        display: inline-block;
        outline: none;
        background: transparent;
        border: none;
    }
}
</style>