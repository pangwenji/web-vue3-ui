<template>
  <el-scrollbar class="recruit_wall-main" :height="scollHeight">
    <el-row :gutter="20" v-if="recruitList.length">
      <el-col :style="{width:(100/columns)+'%' , flex:'none '}" v-for="(item,index) in recruitList" :key="index">
        <div class="recruit-item-content">
          <div class="recruit-item-endDate disabled" v-if="item.cutoff == 1">
            <el-icon>
              <Clock/>
            </el-icon>
            报名已截止
          </div>
          <div class="recruit-item-endDate" v-else>
            <el-icon>
              <Clock/>
            </el-icon>
            报名截止：{{ item.endDate }}
          </div>

          <div class="icon_setTop" style="position:absolute; top:0; right: 0;" v-if="item.ifPay"></div>
          <div class="recruit-item-title">{{ item.title }}</div>
          <div class="recruit-general-budget">
            <span>总预算：</span>
            <span style="font-size:22px; color:  #FFC800;">{{ item.totalPrice }}</span>
            <span class="background_icon-money"></span>
            <span class="fund-custody" v-if="item.ifPay">全款资金已托管</span>
          </div>
          <div class="recruit-tag-box">
            <span v-for="(option,code) in item.categoryItems" v-show="code < 3">{{ option.categoryTitle }}</span>
            <span class="other" v-if="item.categoryItems.length > 3">...</span>
          </div>
          <div class="recruit-item-footer">
            <div style="font-size: 14px; color:#4E5262;">{{ formatDate(item.createTime) }}发布 {{ item.signUpCount }}人报名
            </div>
            <el-button type="primary" color="#3468FE" :disabled="item.cutoff === 1" v-if="item.status != 4">去报名
            </el-button>
            <el-button type="primary" color="#3468FE" disabled v-else>已完结</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <template v-else-if="!loadingState">
      <Empty></Empty>
    </template>
    <Pagination :total="pageData.total" :page="pageData.pageNum" :limit="pageData.pageSize"
                @pagination="handlePagination" class="pagination-container-box" position="center"></Pagination>
  </el-scrollbar>
</template>

<script setup>
import {reactive, watchEffect,ref} from "vue";
import {useWindowSize} from "@vueuse/core/index";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import {getRecruitReleaseList} from "@/api/personnel/personnelManage";

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
const pageData = reactive({
  sk: '',
  total: 0,
  status: 1,  // 1报名中 4 已完结
  pageNum: 1,
  pageSize: 12,
  categoryId: null,
  categoryCount: null,
  orderByType: 0
})
const {width, height} = useWindowSize();
const columns = ref(3);
const onresize = (w) => {
  const span = (w - 360) / 360;
  columns.value = Math.round(span);
}
const scollHeight = ref()
watchEffect(() => {
  onresize(width.value)
  scollHeight.value = height.value - 352
});

const recruitList = ref([]);
const loadingState = ref(false);
// 获取招募列表
const getRecruitData = async (e) => {
  try {
    loadingState.value = true;
    recruitList.value = [];
    if (e === 1) {
      pageData.pageNum = 1
    }
    const result = await getRecruitReleaseList(pageData);
    loadingState.value = false;
    recruitList.value = result.rows;
    pageData.total = result.total;
    return result;
  } catch (err) {
    loadingState.value = false;
    return Promise.reject();
  }

}
getRecruitData()
// 时间格式化
const formatDate = (e) => {
  const now = dayjs();
  return dayjs(e).from(now)
}
// 改变页数时
const handlePagination = ({page, limit}) => {
  if (loadingState.value) {
    return
  }
  pageData.pageNum = page;
  pageData.pageSize = limit;
  getRecruitData();
}
</script>

<style scoped lang="scss">
.recruit_wall-main {
  width: 100%;
  flex: auto;

  &:deep(.el-scrollbar__wrap) {
    width: 100%;
  }

  .pagination-container-box {
    position: absolute;
    width: 100%;
    bottom: 10px;
    left: 0;
  }

  .recruit-item-content {
    background: #1C1D24;
    border-radius: 10px;
    padding: 50px 16px 16px;
    user-select: none;
    position: relative;

    &:hover {
      background: linear-gradient(315deg, #1D1F2A 0%, #212735 100%);
    }

    margin-bottom: 20px;

    .recruit-item-endDate {
      position: absolute;
      color: #8D91A3;
      font-size: 12px;
      background: rgba($color: #181920, $alpha: .6);
      border-radius: 0 10px 10px 0;
      top: 10px;
      left: 0;
      padding: 0px 10px;
      height: 24px;
      line-height: 24px;
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 6px;
        font-size: 14px;
      }

      &.disabled {
        color: #B71D3E;
      }
    }

    .recruit-item-title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 20px;
    }

    .recruit-general-budget {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      color: #8D91A3;
      margin-bottom: 20px;

      .fund-custody {
        padding: 2px 6px;
        background: linear-gradient(47deg, rgba(255, 245, 215, 1), #DABC80);
        border-radius: 10px 10px 10px 0px;
        color: #1D1E25;
        font-size: 12px;
      }
    }

    .recruit-tag-box {
      margin-bottom: 20px;
      font-size: 14px;
      color: #8D91A3;
      margin: 0 -5px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;

      span {
        flex: none;
        width: 30%;
        padding: 0 5px;
        box-sizing: border-box;
        border-radius: 6px;
        display: inline-block;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        height: 26px;
        line-height: 26px;

        &::before {
          border-radius: 6px;
          background: rgba(61, 63, 80, 0.39);
          content: "";
          display: block;
          left: 5px;
          right: 5px;
          height: 100%;
          position: absolute;
        }
      }

      .other {
        width: 10%;
      }
    }

    .recruit-item-footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &:deep(.el-button) {
        width: 110px;
        flex: none;
        --el-border-radius-base: 8px;
        --el-button-disabled-bg-color: #4E5262 !important;
        --el-button-disabled-text-color: #C2C7CE;
        --el-button-disabled-border-color: #4E5262 !important;
      }
    }

  }
}
</style>
