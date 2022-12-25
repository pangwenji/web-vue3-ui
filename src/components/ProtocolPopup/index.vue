<template>
    <el-dialog v-model="isShow" :title="title" custom-class="dialog-center" v-bind="$attrs">
        <el-scrollbar height="72vh" v-loading="loading" style="margin:0 -20px" view-style="padding:0 20px">
            <div v-html="markdownToHtml" class="html"></div>
        </el-scrollbar>
        <el-affix :offset="0" position="bottom">
            <div class="btn-area">
                <el-button v-if="countDown > 0" type="primary" disabled round size="large" color="#3468FE">协议阅读({{countDown}}s)</el-button>
                <el-button v-else type="primary" @click="readCallback" round size="large" color="#3468FE">已阅读并同意该协议</el-button>
            </div>
        </el-affix>
    </el-dialog>
</template>

<script setup>
/**
 * @description 强制阅读组件
 * @version 1.0
 * @param {Function} readCallback 阅读完毕回调函数
 * @param {String} articleId 文章ID - 必传
 * 使用示例
 * 引入：import ProtocolPopup from '@/components/ProtocolPopup'
 * html: <ProtocolPopup ref="protocolRef" @readCallback="readCallback" :articleId="articleId"></ProtocolPopup>
 * js: protocolRef.isShow = true
 */
import { ref, watch } from 'vue'
import { getArticle } from "@/api/help";
const emits = defineEmits(['readCallback'])
const props = defineProps({
    //标题
    title: {
        type: String,
        default: '协议阅读'
    },
    // 倒计时(秒)
    seconds: {
        type: Number,
        default: 5
    },
    // 文章id
    articleId: {
        type: String,
        required: true,
        default: ''
    }
})

const isShow = ref(false)
const countDown = ref(0)
const timmer = ref()
// 倒计时处理
const countDownFn = ()=> {
    countDown.value = props.seconds
    timmer.value = setInterval(() => {
        countDown.value -= 1
    }, 1000);
}

// 监听 - 倒计时完毕
watch(countDown, (val) => {
    // 读秒0，清除计时器、抛出事件、更新阅读标记
    if (val == 0) {
        clearInterval(timmer.value)
    }
})

// 回调 - 阅读完毕
const readCallback = ()=> {
    isShow.value = false
    emits('readCallback')
}

// 协议、文本查询
const markdownToHtml = ref("")
const loading = ref(false)
const getArticleDetails = (id) => {
    const query = { id: id }
    loading.value = true
    getArticle(query).then(res => {
        markdownToHtml.value = res.data.content
        loading.value = false
    })
}

// 监听展示标志
watch(isShow, (val) => {
    // 展示：查询文章、开始倒计时、重置阅读标记
    if (val) {
        getArticleDetails(props.articleId)
        countDownFn()
    } else {
        // 隐藏：清除计时器
        clearInterval(timmer.value)
    }
})

defineExpose({
    isShow
})
</script>

<style lang="scss" scoped>
.html {
    //color: #f0f2f5;
    :deep(h2) {
        margin-top: 52px;
        font-size: 16px;
        font-weight: 400;
        // color: #CFD2D8;
        line-height: 18px;
        border-left: 2px solid #35c0e3;
        padding-left: 10px;
    }

    //:deep(p) {
    //  margin-top: 30px;
    //  font-size: 14px;
    //  font-weight: 400;
    //  color: rgba(255, 255, 255, 0.8);
    //  line-height: 40px;
    //  background-color: rgba(0, 0, 0, 0.3);
    //  padding: 20px 30px;
    //  border-radius: 4px;
    //}

    :deep(img) {
        width: 100%;
        margin: 30px 0px;
    }

    :deep(ul) {
        padding-left: 50px;

        li {
            list-style-type: disc;
            font-size: 16px;
            font-weight: 400;
            //color: #C4C9D3;
            line-height: 27px;
            margin-bottom: 20px;
        }
    }

    :deep(ol) {
        padding-left: 50px;

        li {
            font-size: 16px;
            font-weight: 400;
            //color: #C4C9D3;
            line-height: 27px;
            margin-bottom: 20px;
        }
    }
}
.btn-area {
    padding-top: 20px;
    margin-bottom: -10px;
    text-align: center;
    & > .el-button {
        width: 240px;
    }
}
</style>