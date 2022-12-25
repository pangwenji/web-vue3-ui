<template>
    <div class="wrapper" :style="{height: `${height}%`}">
        <div class="bar-wrap" v-for="(item, index) in dataList" :key="index">
            <div class="info">
                <span @click="LinkToUrl(item.url)" :style="{cursor: item.url ? 'pointer' : 'default'}">{{item.name}}</span>
                <span>{{item.number}}</span>
            </div>
            <el-progress :percentage="totalFans > 0 ? (item.number/totalFans)*100 : 0" :show-text="false" color="pink" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    fansData: {
        type: Array,
        default: ()=>[]
    },

    height: {
        type: String,
        default: '100'
    }
})

const LinkToUrl = (url)=> {
    url && window.open(url, '_blank')
}

// 计算粉丝总数
const totalFans = ref(0)
const fansCount = ()=> {
    totalFans.value = 0
    dataList.value.forEach(app => {  
        totalFans.value += app.number
    })
}

const dataList = ref([])
watch(()=>props.fansData, (val)=> {
    dataList.value = val.map(item => {
        return {
            ...item,
            name: item.name,
            number: item.number >= 0 ? item.number : 0
        }
    })
    fansCount()
}, {deep: true, immediate: true})

</script>

<style lang="scss" scoped>
.wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .bar-wrap {
        .info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            span {
                color: #676C7F;
                font-size: 12px;
            }
        }
        :deep(.el-progress-bar__outer) {
            background-color: #23252D;
        }
        :deep(.el-progress-bar__inner) {
            background: linear-gradient(270deg, #72E7FC 0%, #7B5EDF 100%);
        }
    }
}
</style>