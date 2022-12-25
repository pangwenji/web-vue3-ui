<template>
    <div class="header-content-top">
        <div>
            <span :key="item.typeId" v-for="item in tabListShow" @click="handleChangMain(item)" :class="{ active: activeId === item.typeId }" :style="{'margin-right': item.useType&&showSub? '60px' : '44px'}">
                {{ item.typeName }}
              <img  v-if="item.useType && showSub" src="@/assets/material/Free.png" class="free">
            </span>
        </div>
    </div>

</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, watch } from "vue";
import { getTypeOption, getMaterialType } from '@/api/material/index.js'
import { useRouter } from "vue-router";



const store = useStore();
const route = useRoute();
const router = useRouter();
const activeId = ref()
const activeName = ref()
const tabListShow = ref([])
const tabListHide = ref([])
const typeTabData = ref([])
const emits = defineEmits(['onChangTab', 'onload'])
const props = defineProps({
    tabListShow: Array,
    hideItems: {
        type: Array,
        default() {
            return []
        },
    },
    routerPath: {
        type: String,
        default: '',
    },
    showSub: {
        type: Boolean,
        default: false,
    },
    showAll: {
        type: Boolean,
        default: false,
    }
})

onMounted(() => {
    if (!props.showAll) {
        getTabList()
    } else {
        getTabListAll()
    }
})

defineExpose({
    activeId
})

function getTabListAll() {// 获取tab列表（没有排序）
    getMaterialType({}).then(res => {
        let tabData;
        tabListShow.value = [];
        tabListHide.value = [];
        const data = res.data.map(item => {
            item['typeId'] = item.id;
            return item
        })
        for (const item of data) {
            if (props.hideItems.indexOf(item.remark) == -1) {
              if(route.query.typeId && route.query.typeId == item.typeId){
                tabData = item;
              }
              tabListShow.value.push(item)
            }
        }
        tabData = tabData ? tabData : tabListShow.value[0]
        activeId.value = tabData.typeId;
        emits('onload', tabData, tabListShow.value, tabListHide.value)
    })
}

// 获取tab列表（有排序）
function getTabList() {
    getTypeOption().then((res) => {
        let tabData;
        tabListShow.value = [];
        tabListHide.value = [];
        typeTabData.value = res.data;
        res.data.forEach((item) => {
            if (item.disable === 1) {
                tabListShow.value.push(item)
            } else {
                tabListHide.value.push(item)
            }
            if(route.query.typeId && route.query.typeId == item.typeId){
              tabData = item;
            }
        })
        tabData = tabData ? tabData : tabListShow.value[0]
        activeId.value = tabData.typeId;
        emits('onload', tabData, tabListShow.value, tabListHide.value)
    })
}

// 点击切换tab
function handleChangMain(item) {
  if (activeId.value === item.typeId) {return}
    if (props.routerPath) {
        router.push({ path: props.routerPath, query: { typeId: item.typeId } })
    } else {
        activeId.value = item.typeId;
        emits('onChangTab', item);
    }
}


</script>

<style scoped lang="scss">
.header-content-top {
    padding: 15px;
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    color: rgba($color: #ffffff, $alpha: 0.3);
    justify-content: space-between;
    font-size: 16px;

    .active {
        // cursor: none;
        color: white;

        &::after {
            content: "";
            width: 27px;
            height: 3px;
            background: linear-gradient(42deg, #0459ff 0%, #5726dd 100%);
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 10px;
            display: inline-block;
        }
    }

    // color: ;
    .line {
        width: 1px;
        height: 16px;
        flex-shrink: 0;
        background: #eeeeee;
        margin: 0 15px;
        cursor: none;
    }

    span {
        display: inline-block;
        height: 100%;
        line-height: 38px;
        cursor: pointer;
        position: relative;
        margin-right: 44px;

        &:hover {
            color: white;
        }
    }

    .free {
        position: absolute;
        top: 5px;
        left: 37px;
        display: inline-block;
        width: 24px;
        height: 8px;
    }
}
</style>
