<template>
    <div class="midTwo-left">
        <div class="tap-list">
            <template v-if="typeId === 6">
                <!-- <el-button type="text" size="small" @click="handleSort(null)"  :class="{'activating':sort===null}">综合</el-button> -->
                <el-button type="text" size="small" @click="handleSort(1)" :class="{'activating':sort===1}">精选</el-button>
                <el-button type="text" size="small" style="margin-left: 40px" @click="handleSort(2)" :class="{'activating':sort===2}">最新上传</el-button>
                <el-button type="text" size="small" style="margin-left: 40px" @click="handleSort(3)" :class="{'activating':sort===3}">热门下载</el-button>
            </template>
            <template v-else-if="typeId === 5">
                <!-- <el-button type="text" size="small" @click="handleSort(null)"  :class="{'activating':sort===null}">综合</el-button> -->
                <el-button type="text" size="small" @click="handleSort(1)" :class="{'activating':sort===1}">最新上传</el-button>
                <el-button type="text" size="small" style="margin-left: 40px" @click="handleSort(2)" :class="{'activating':sort===2}">热门下载</el-button>
            </template>
            <template v-else>
                <!-- <el-button type="text" size="small" @click="handleSort(0)"  :class="{'activating':sort===0}">综合</el-button> -->
                <el-button type="text" size="small" @click="handleSort(2)" :class="{'activating':sort===2}">最新上传</el-button>
                <el-button type="text" size="small" style="margin-left: 40px" @click="handleSort(1)" :class="{'activating':sort===1}">热门下载</el-button>
            </template>
        </div>
    </div>
    <div class="midTwo-right">
        <div style="font-size: 14px;color: rgba(196,201,211,0.54);margin-right: 20px" v-if="typeId === 7">
            共 <span style="color: #F88212;margin: 0px 8px">{{total}}</span> 个结果
        </div>
        <div>
            <el-input v-model="keyword" class="w-60 m-2" placeholder="输入关键词..." :suffix-icon="Search" style="display: flex; justify-content: end; border: none" @keyup.enter="handleKeywordChange"
                @change="handleKeywordChange" />
        </div>
    </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { watch } from "vue";

const props = defineProps({
    typeName: {
        type: String,
        default: ''
    },
    total: {
        type: Number,
        default: 0
    },
    typeId: {
        type: Number,
        default: ''
    },
})
const sort = ref(0)
const keyword = ref('')
watch(() => props.typeId, (n) => {
  if(n == 5){
    sort.value = 1
  }else if(n == 6){
    sort.value = 1
  }else{
    sort.value = 2
  }
  keyword.value = null
},{flush:'post',immediate: true})

const emit = defineEmits(['onSortChange', 'onKeywordChange'])

function handleSort(sortType) {
    sort.value = sortType
    emit('onSortChange', sortType)
}

function handleKeywordChange() {
    emit('onKeywordChange', keyword.value)
}


</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
