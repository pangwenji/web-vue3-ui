<template>
    <div class="works_assess-main">
        <div class="header">
            <div class="title">雇主评分</div>
            <el-rate disabled allow-half show-score :model-value="score" :colors="['#FFC800','#FFC800','#FFC800']" text-color="#FFC800" void-color="#9094A6" score-template="{value}分" />
            <div class="assess-num">评价({{params.total}})</div>
        </div>
        <template v-if="params.total > 0">
            <div class="container">
                <div class="user_assess-item" v-for="(item,index) in tableData" :key="index">
                    <div class="user-info">
                        <el-avatar :src="item.avatar"></el-avatar>
                        <div class="detail">
                            <div style="margin-bottom: 4px;">{{item.nickName}}</div>
                            <div style="color: #676C7F;">{{item.createTime}}</div>
                        </div>
                        <div class="rate-box">
                            <el-rate disabled allow-half  :model-value="item.score"  :colors="['#FFC800','#FFC800','#FFC800']" text-color="#FFC800" void-color="#9094A6" />
                        </div>
                    </div>
                    <div class="assess-text">{{item.content}}</div>
                </div>
            </div>
            <div class="loading-more"  v-if="!loadingComplete">
                <span>查看更多</span>
                <el-icon><ArrowDown /></el-icon>
            </div>
            <div class="loading-more disabled"  v-else>
                已全部加载
            </div>
        </template>
        <template v-else>
            <Empty description="暂无评分"></Empty>
        </template>

    </div>
</template>
<script setup>
import { commentList } from '@/api/personnel/recruitmentWall.js'
import { reactive } from '@vue/reactivity';
import { useRoute } from 'vue-router';
const props = defineProps({
    score:{
        type: Number,
        default: 0,
    }
})
const params = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
})
const route = useRoute();
const loadingComplete = ref(false);
const tableData = ref([]);
const getData = ()=>{
    const userAuthenticateId = route.params.id;
    commentList({...params,userAuthenticateId}).then(res=>{
        if(params.pageNum == 1){
            tableData.value = res.rows;
            params.total = res.total;
        }else{
            const data = [].content(tableData.value);
            tableData.value = tableData.value.reduce((sum,item)=>{
                sum.push(item)
            },data)
        }
        loadingComplete.value = params.total <= (params.pageNum * params.pageSize)
    })  
}
getData();
</script>
<style scoped lang="scss">
.custom_card-box.works_assess-main{
    background: #181920 !important;
    // padding-bottom: 20px;
    .header{
        background: #1C1D24;
        padding: 20px;
        display: flex;
        align-items: center;
        position: relative;
        .title{
            font-size: 16px;
            color: white;
            margin-right: 20px;
        }
        &:deep(.el-rate){
            height: 20px;
            --el-rate-icon-size: 20px;
            .el-rate__text{
                color: #9094A6;
            }
        }
        .assess-num{
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #9094A6;
        }
    }
    .container{
        padding: 20px;
        background: #181920;
        .user_assess-item{
            padding-bottom: 20px;
            border-bottom: 1px solid rgba($color: #9094A6, $alpha: .1);
            margin-bottom: 20px;
            &:last-child{
                // padding-bottom: 0px;
                margin-bottom: 0px;
                padding-bottom: 0px;
                border-bottom: none !important;
            }
            .user-info{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-bottom: 10px;
                padding-right: 200px;
                position: relative;
                &:deep(.el-avatar){
                    flex: none;
                    margin-right: 20px;
                }
                .detail{
                    font-size: 14px;
                    color: white;
                    flex: auto;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .rate-box{
                    position: absolute;
                    right: 0;
                    &:deep(.el-rate){
                        height: 20px;
                        --el-rate-icon-size: 20px;
                    }
                }
            }
            .assess-text{
                font-size: 14px;
                word-break: break-all;
                color: #9094A6;
            }
        }
    }
    .loading-more{
        width: 120px;
        height: 30px;
        margin: 20px auto;
        border: 1px solid #3468FE;
        color: #3468FE;
        display: flex;
        align-items: center;
        justify-content: center;
        // margin: 0 auto;
        font-size: 12px;
        border-radius: 20px;
        &.disabled{
            cursor: no-drop;
        }
    }
}
</style>