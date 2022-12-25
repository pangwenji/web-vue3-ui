<template>
    <div class="main-card">
        <el-card body-style="background-color: #1E1F25;  border: none !important;" shadow="never" v-if="tagList&&tagList.length > 0 || showCheckSex">
            <div class="select-form">
                <!-- <div>
                    <el-select v-for="(tag,index) in tagList" v-model="tag.value" v-if="tagList.length" class="m-2" :placeholder="tag.title" :key="index" @change="changeSelectOne(tag.value,tag)">
                        <el-option v-for="item in tag.items" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>
                </div> -->
                <template v-if="tagList&&tagList.length > 0">
                    <div class="select-form-item" v-for="(item,index) in tagList" :key="index">
                        <span class="label">{{item.title}}</span>
                        <div class="select-form-right" v-if="index == 0" @click.stop="handleClearCheck">
                            清除筛选
                        </div>
                        <span class="tag" :class="{active: !(item.value && item.value.length) }" @click="handleCheckTag(item)">全部</span>
                        <span class="tag" :class="{active: onCheckTag(item,tag)}" v-for="tag in item.items" @click="handleCheckTag(item,tag)" :key="tag.id">{{tag.title}}  <el-icon style="margin-left: 4px;" @click.stop="handleCloseTag(item,tag)"><Close /></el-icon> </span>
                    </div>
                </template>

                <div class="select-form-item" v-if="showCheckSex">
                    <span class="label">性别</span>
                    <span class="tag" :class="{active: checkSex == -1 }" @click="handleCheckSex(-1)">不限</span>
                    <span class="tag" :class="{active: checkSex == 0 }" @click="handleCheckSex(0)">男</span>
                    <span class="tag" :class="{active: checkSex == 1 }" @click="handleCheckSex(1)">女</span>
                </div>
            </div>
        </el-card>
        <div class="filter-other">
            <div class="tap-list">
                <div class="tap" @click="sortOptions(0)" :class="{ 'activating': sort === 0 }">
                    综合
                </div>
                <div class="tap" @click="sortOptions(1)" :class="{ 'activating': sort === 1 }">
                    最新加入
                </div>
                <div class="tap" @click="sortOptions(2)" :class="{ 'activating': sort === 2 }">
                    成交量
                    <up-down v-model:tabName="volumeName"></up-down>
                </div>
                <div class="tap" @click="sortOptions(3)" :class="{ 'activating': sort === 3 }">
                    价格
                    <up-down v-model:tabName="priceName"></up-down>
                </div>
                <!-- <div class="tap" style="display:flex; align-items:center;">
                    <span style="margin-right:10px; line-height:1;">在线</span>
                    <el-switch v-model="value"  active-color="#3468FE" size="small" />
                </div> -->
            </div>
            <div>
                <el-input v-model="findWord" ref="searchInputRef" class="search" @change="searchFind" @keyup.enter="searchFind(1)" placeholder="快速搜索工种">
                    <template #suffix>
                        <div class="suffix-search-icon" title="搜索" @click.stop="searchFind">
                            <el-icon>
                                <Search />
                            </el-icon>
                        </div>
                    </template>
                </el-input>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import UpDown from '@/components/UpDown'
import { useRoute } from 'vue-router';
const value = ref('');


const route = useRoute();
const findWord = ref('')
const searchInputRef = ref();
const props = defineProps({
    tagList: Array,
    categoryId: Number,
    showCheckSex: Boolean,
    checkSex:{
        type:[Number,String],
        default: -1,
    }
})
const options = [
    {
        value: 'Option1',
        label: 'Option1',
    }
]
const tags = ref([{
    name: "广播剧",
}])
const volumeName = ref();
const priceName = ref();
const tagsLabel = ref([]);
const emit = defineEmits(['changeTag', 'sequence', 'search', 'update:checkSex'])


// 选择性别
const handleCheckSex = (e)=>{
    emit('update:checkSex',e);
}

/**
 * 第一个改变，方法
 */
const changeSelectOne = (e, tag) => {
    // 校验tags里边是否存在已经添加过的标签
    if (tagsLabel.value.some(res => {
        return e === res.id;
    })) {
        return;
    }
    const selected = tag.items.find(res => {
        return res.id === e;
    })
    tagsLabel.value.push(selected)
    emit('changeTag', tagsLabel)
}

/**
 * 动态清空tag
 * @param index 删除对应数组的索引
 */
const closeTag = (index) => {
    tagsLabel.value.splice(index, 1)
    emit('changeTag', tagsLabel)
}

/**
 * 清空标签
 */
const emptyTag = () => {
    tagsLabel.value = [];
    emit('changeTag', tagsLabel)
}

// 选中的标签
const onCheckTag = (item,tag)=>{
    return item.value && item.value.indexOf(tag.id) > -1
}

// 点击选择标签
const handleCheckTag = (item,tag)=>{
    if(tag){
        item.value = item.value?item.value:[];
        if(item.value.indexOf(tag.id) == -1){
            item.value.push(tag.id)
        }else{
            return
        }
    }else{
        item.value = [];
    }
    emit('changeTag', props.tagList)
}
// 关闭已选标签
const handleCloseTag = (item,tag)=>{
    const index = item.value.indexOf(tag.id)
    if(index > -1){
        item.value.splice(index,1)
    }
    emit('changeTag', props.tagList)
}
// 清除筛选
const handleClearCheck = ()=>{
    for(const item of props.tagList){
        item.value = [];
    }
    emit('changeTag', props.tagList)
}


const sort = ref(0)

const init = ()=>{
    const query = route.query;
    if(query){
        sort.value = Number(query.orderByType) || 0;
        const sortBy = query.sortBy === 'false' ? false : true;
        if(sort.value == 2 || sort.value === 3){
            volumeName.value = sortBy ? 'bottom' : 'top'
        }else {
            volumeName.value = ''
        }
    }
}
init();

/**
 * 排序类型选项
 */
const sortOptions = (i) => {
    sort.value = i;
    let sortBy = true
    if (sort.value === 2) {
        if (volumeName.value && volumeName.value === 'top') {
            volumeName.value = 'bottom'
            sortBy = true;
        } else {
            volumeName.value = 'top'
            sortBy = false;
        }
        priceName.value = ''
    } else if (sort.value === 3) {
        if (priceName.value && priceName.value === 'top') {
            priceName.value = 'bottom'
            sortBy = true;
        } else {
            priceName.value = 'top'
            sortBy = false;
        }
        volumeName.value = ''
    } else {
        priceName.value = ''
        volumeName.value = ''
        sortBy = false;
    }



    emit('sequence', {
        orderByType: i,
        sortBy: sortBy
    })

}

/**
 *触发输入框
 */
const searchFind = (e) => {
    if (e === 1) {
        searchInputRef.value.blur();
        return
    }
    emit('search', findWord.value)
}
</script>

<style scoped lang="scss">
@import "./style.scss";
.suffix-search-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
        color: #3468fe;
    }
}
</style>