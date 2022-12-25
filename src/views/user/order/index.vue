<template>
    <div class="box">
        <div class="top-title">我的订单</div>
        <div class="header-content-top">
            <div class="header-left">
                <span class="tab" :class="{ active: activeId === item.id }" v-for="(item, index) in tabListShow" :key="index" @click="handleChangMain(item.id)">{{ item.title }}</span>
            </div>
            <div class="header-right">
                <el-date-picker v-model="time" type="daterange" value-format="YYYY-MM-DD" format="YYYY-MM-DD" range-separator="至" :shortcuts="shortcuts"
                    :disabled-date="forbiddenTime" :clearable="false" />
                <span class="reset-daterange" @click="handleResetDate">重置日期</span>
            </div>
        </div>
        <InvestList :time="time" v-if="activeId == 1"></InvestList>
        <MemberList :time="time" v-else-if="activeId == 2"></MemberList>
    </div>
</template>
<script setup>
import { nextTick, onMounted, ref} from 'vue'
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import WordDialog from '@/plugins/pay/WordDialog'
import { parseTime } from "@/utils/ruoyi";
import InvestList from './InvestList.vue'
import MemberList from './MemberList.vue'


const router = useRouter();
const store = useStore();

const activeId = ref(0)

const time = ref([])

const tabListShow = ref([
    { title: '充值记录', id: 1 },
    { title: '购买会员', id: 2 },
])


//类型改变
const handleChangMain = (type) => {
    if (type === activeId.value) return;
    activeId.value = type;
}
// 重置日期
const handleResetDate = () => {
    const date = new Date();
    date.setDate((new Date().getDate() - 7));
    const startTime = parseTime(date.toJSON(), '{y}-{m}-{d}');
    const endTime = parseTime(new Date(), '{y}-{m}-{d}');
    if(time.value[0] == startTime && time.value[1] == endTime){
        return
    }
    time.value = [
        startTime,
        endTime,
    ]
}
handleResetDate();

onMounted(()=>{
    activeId.value = 1
})

/**
 * 禁用今天之后的日期
 * @param time
 * @returns {boolean}
 */
const forbiddenTime = (time) => {
    return time.getTime() > Date.now();
}

const shortcuts = [
    {
        text: '最近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '最近一个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '最近三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]


</script>
<style scoped lang="scss">
@import "./style.scss";
</style>
