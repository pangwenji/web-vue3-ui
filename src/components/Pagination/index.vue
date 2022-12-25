<template>
    <div class="pagination-container-box" :class="[position, theme == 'white'?'theme-white' :'theme-black']">
        <el-pagination :background="background" v-model:current-page="currentPage" v-model:page-size="pageSize" :hide-on-single-page="hideSinglePage" :layout="layout" :page-sizes="pageSizes"
            :pager-count="pagerCount" :total="total" prev-text="上一页" next-text="下一页" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import { scrollTo } from '@/utils/scroll-to'
const props = defineProps({
    total: {
        required: true,
        type: Number
    },
    page: {
        type: Number,
        default: 1
    },
    limit: {
        type: Number,
        default: 20
    },
    pageSizes: {
        type: Array,
        default() {
            return [10, 20, 30, 50]
        }
    },
    theme: {
        type: String,
        default: 'black'
    },
    // 移动端页码按钮的数量端默认值5
    pagerCount: {
        type: Number,
        // default: document.body.clientWidth < 992 ? 5 : 7
        default: 5
    },

    layout: {
        type: String,
        default: 'prev, pager, next, total, jumper'
    },
    position: {
        type: String,
        default: "left"
    },
    background: {
        type: Boolean,
        default: true
    },
    autoScroll: {
        type: Boolean,
        default: true
    },
    hideSinglePage: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits();
const currentPage = computed({
    get() {
        return props.page
    },
    set(val) {
        emit('update:page', val)
    }
})
const pageSize = computed({
    get() {
        return props.limit
    },
    set(val) {
        emit('update:limit', val)
    }
})
function handleSizeChange(val) {
    if (currentPage.value * val > props.total) {
        currentPage.value = 1
    }
    emit('pagination', { page: currentPage.value, limit: val })
    if (props.autoScroll) {
        scrollTo(0, 800)
    }
}
function handleCurrentChange(val) {
    emit('pagination', { page: val, limit: pageSize.value })
    if (props.autoScroll) {
        scrollTo(0, 800)
    }
}

</script>

<style scoped lang="scss">
@mixin pagination-theme($disabled-color, $disabled-bg,  $button-color, $button-bg, $primary-color,  $total-color) {
    &:deep(.el-pagination) {
        color: #fff;
        .btn-prev:disabled {
            background: $disabled-bg;
            border-radius: 18px;
            color: $disabled-color;
            &:hover {
                color: $disabled-color;
            }
        }
        .btn-next:disabled {
            background: $disabled-bg;
            border-radius: 18px;
            color: $disabled-color;
            &:hover {
                color: $disabled-color;
            }
        }
        .btn-prev {
            padding: 0 16px;
            background: $button-bg;
            border-radius: 18px;
            color: $button-color;
            &:hover {
                color: $primary-color;
            }
        }
        .btn-next {
            padding: 0 16px;
            background: $button-bg;
            border-radius: 18px;
            color: $button-color;
            &:hover {
                color: $primary-color;
            }
        }
        .btn-quickprev {
            background-color: $button-bg;
            border-radius: 100px;
            color: $button-color;
            &:hover {
                color: $primary-color;
            }
        }
        .number {
            background-color: $button-bg;
            border-radius: 100px;
            color: $button-color;
            &.is-active {
                background-color: $primary-color !important;
            }
            &:hover {
                color: $primary-color;
            }
        }
        .el-pagination__jump {
            color: inherit;
        }
        .el-pagination__total {
            color: $total-color !important;
            margin-left: 20px;
            margin-right: 0px;
        }
        .btn-quicknext {
            border-radius: 100px;
            color: $button-color;
            background-color: $button-bg;
            &:hover {
                color: $primary-color;
            }
        }
        .el-input {
            .el-input__inner {
                background: none;
                border-radius: 100px;
                // border: 1px solid #C2C7CE;
            }
        }
        .el-select--default {
            .el-input__inner {
                background: none;
                border-radius: 100px;
                // border: 1px solid #C2C7CE;
            }
        }
    }
}
.pagination-container-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;


    &.theme-white{
        @include pagination-theme(        
            $disabled-color: #fff,
            $disabled-bg: rgba(#3468fe, 0.1),
            $button-color: #fff,
            $button-bg: #3468fe,
            $primary-color: rgba(#3468fe, 0.5),
            $total-color: #3468fe
        )
    }
    &.theme-black{
        @include pagination-theme(
            $disabled-color: #4e5262,
            $disabled-bg: #30323b,
            $button-color: #c2c7ce,
            $button-bg: #30323b,
            $primary-color: #3468fe,
            $total-color: #c2c7ce
        )
    }
    &.left {
        justify-content: flex-start;
    }
    &.center {
        justify-content: center;
    }
    &.right {
        justify-content: flex-end;
    }
}


</style>
