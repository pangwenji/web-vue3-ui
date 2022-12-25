<template>
    <el-scrollbar view-style="height:100%">
        <!-- 收益梯度表弹窗 -->
        <div class="mask" v-if="isShowMask" @click="hideMask">
            <template v-if="isTable">
                <img v-if="proxyLevel == 1" src="@/assets/user/img_vip1.png" style="width: 456px;height: 290px;">
                <img v-if="proxyLevel == 2" src="@/assets/user/img_vip2.png" style="width: 456px;height: 330px;">
                <img v-if="proxyLevel == 3" src="@/assets/user/img_vip3.png" style="width: 456px;height: 330px;">
            </template>

            <img v-if="isQrcode" src="@/assets/user/img_kefu.png" style="width: 312px;height: 350px;">
        </div>
        <!-- 低级别vip -->
        <LowVip v-if="proxyLevel == 1"
            @showTable="showTable"
            :proxyInfo="proxyInfo"
            :toClipboard="toClipboard">
        </LowVip>
        <!-- 高级别vip -->
        <HighVip v-if="proxyLevel > 1"
            @reloadProxyInfo="reloadProxyInfo"
            @showTable="showTable"
            :proxyInfo="proxyInfo"
            :toClipboard="toClipboard">
        </HighVip>
    </el-scrollbar>
</template>

<script setup>
import { ref, computed } from 'vue'
import LowVip from './LowVip.vue'
import HighVip from './HighVip.vue'
import useClipboard from 'vue-clipboard3'
import { myPromoteInfo } from '@/api/user/promote'

const { toClipboard } = useClipboard()

// vip级别
const proxyLevel = ref()
const proxyInfo = ref({})

// 查询当前用户推广信息
const getInfo = ()=> {
    myPromoteInfo().then(res => {
        proxyInfo.value = res.data
        proxyLevel.value = res.data.proxyLevelNum
    })
}
getInfo()

// 更新推广信息
const reloadProxyInfo = ()=> {
    getInfo()
}

const isShowMask = ref(false)
const showType = ref('')
// 遮罩层 - 展示
const showTable = (e)=> {
    showType.value = e
    isShowMask.value = true
}
const isTable = computed(()=> showType.value == 'table')
const isQrcode = computed(()=> showType.value == 'qrcode')

// 遮罩层 - 隐藏
const hideMask = ()=> {
    isShowMask.value = false
}
</script>

<style lang="scss" scoped>
.mask {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: rgba($color: #000000, $alpha: .5);
}
</style>
