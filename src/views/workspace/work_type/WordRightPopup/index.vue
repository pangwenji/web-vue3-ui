<template>
    <transition name="menu">
        <div class="main-card" v-if="prop.show" id="card">
            <div class="title">
                工种库分类编辑
            </div>

            <div class="tab-list-show">
                <!-- 展示的 -->
                <transition-group name="drag" tag="ul">
                    <template v-for="(item,index) in  tabListShow" :key="item.id">
                            <div class="menu-item" :class="{active: dragId == item.id}" @dragend="handleDragend" @dragenter="dragenter($event, item, index)" @dragover.prevent @dragstart="dragstart(item,index)"
                            :draggable='true' v-if="item.id">
                            <div>
                                <el-icon>
                                    <Camera />
                                </el-icon>
                                {{ item.title }}
                            </div>
                            <div class="view" @click="updateCategoryEditMenu(item.id,'show')">
                                <el-icon>
                                    <View />
                                </el-icon>
                            </div>
                        </div>
                    </template>
                </transition-group>
            </div>

            <!-- 隐藏的-->
            <div class="tab-list-hide">
                <div class="menu-item" v-for="(item,index) in  tabListHide">
                    <div>
                        <el-icon>
                            <Camera />
                        </el-icon>
                        {{ item.title }}
                    </div>
                    <div class="view" @click.stop="updateCategoryEditMenu(item.id,'hide')">
                        <el-icon>
                            <Hide />
                        </el-icon>
                    </div>
                </div>
            </div>

        </div>
    </transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onMounted, defineEmits, onUnmounted } from "vue-demi";
import { categoryEditMenu } from '@/api/personnel/recruitmentWall'

const value = ref('')
const prop = defineProps({
    show: {
        type: Boolean,
    },
    tabListHide: Array,
    tabListShow: Array,
    typeOfWork: Number
})
const emits = defineEmits(["close","onHide"]);
const listener = (e) => {
    let elementById = document.getElementById("card");
    if (elementById) {
        if (!elementById.contains(e.target)) {
            emits("close");
        }
    }
}

onMounted(() => {
    window.addEventListener('click', listener)
})

onUnmounted(() => {
    window.removeEventListener('click', listener)
})



const updateCategoryEditMenu = (id, type) => {
    let show = prop.tabListShow;
    let hide = prop.tabListHide;
    // 将当前
    if (type === "show") {
        //  将show的内容移动到，hide列表中；
        let index = show.findIndex(res => {
            return res.id === id;
        });
        hide.push(show.splice(index, 1)[0]);
        emits('onHide', id);
    } else {
        // 将show的内容移动到
        let index = hide.findIndex(res => {
            return res.id === id;
        });
        show.push(hide.splice(index, 1)[0])
    }

    updateCategoryEdit(show);
}

const updateCategoryEdit = (show) => {
    const list = [].concat(show)
    list.splice(0,1);
    let data = {
        st: prop.typeOfWork,
        ids: list.map(res => {
            return res.id;
        }).join()
    }
    categoryEditMenu(data).then(res => {

    })
}
/**
 * 拖拽事件
 * @type {number}
 */
let dragIndex = -1;
const dragId = ref(0)
const dragstart = (item,index) => {
    dragIndex = index;
    dragId.value = item.id;
}
const dragenter = (e,item, index) => {
    e.preventDefault()
    // 避免源对象触发自身的dragenter事件
    if (dragIndex !== index) {
        const moving = prop.tabListShow[dragIndex]
        prop.tabListShow.splice(dragIndex, 1)
        prop.tabListShow.splice(index, 0, moving)
        // 排序变化后目标对象的索引变成源对象的索引
        dragIndex = index;
        // updateCategoryEdit(prop.tabListShow);
    }
}
// 拖拽结束
const handleDragend = (e)=>{
    dragId.value = 0;
    dragIndex = -1;
    updateCategoryEdit(prop.tabListShow);
}
</script>

<style scoped lang="scss">
@import "./style.scss";

.drag-move {
    transition: transform 0.5s;
}
</style>