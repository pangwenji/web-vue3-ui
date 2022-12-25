<template>
  <div class="box">
    <div class="head-box">
      <div class="right-box">
        <div class="attention">我的关注</div>
      </div>
    </div>

    <div class="content-box">
      <div class="content-left">
        <div style="position: absolute;top: -100px;">
          <div class="user-card card">
            <div class="userinfo">
              <el-avatar :size="100" style="background-color: black" :src="userInfo.avatar"/>
              <div class="nickname-box">{{ userInfo.nickName }}</div>
              <div class="id">ID号：{{ userInfo.number }}</div>
              <div>
                <div class="tags-box">
                  <div class="tag">
                    <div class="type1" v-if="memberState === 1">个人会员</div>
                    <div class="type3" v-else>注册用户</div>
                    <div class="type0" v-if="store.state.user.idCard"> 实名认证</div>
                    <template v-for="(work,i) in workInfo">
                      <div :class="'type'+(i+1)">{{ work.categoryTitle }}</div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn1">关注Ta</div>
            <div class="btn2">私信Ta</div>
            <div class="flexB carbtm">
              <div>作品好评数</div>
              <div>6666</div>
            </div>
            <div class="flexB carbtm" style="margin-top: 10px">
              <div>关注者</div>
              <div>88</div>
            </div>
            <div style="margin-top: 30px">您已入驻平台{{timer}}天</div>
          </div>

          <div class="fans-data card">
            <div class="fan-title">粉丝数据</div>
            <div class="radar-chart" id="fanMain" ref="fanMain">
            </div>
          </div>
        </div>
      </div>

      <div class="content-right">
        <div class="header-content-top" style="padding: 2px 28px 18px 25px; height: 50px;">
          <div class="header-left">
            <span :class="{ active: activeId === 1 }" @click="handleChangMain(1)">作品集</span>
            <span :class="{ active: activeId === 2 }" @click="handleChangMain(2)">我的技能</span>
            <span :class="{ active: activeId === 3 }" @click="handleChangMain(3)">我的招募</span>
            <span :class="{ active: activeId === 4 }" @click="handleChangMain(4)">销售的素材</span>
            <span :class="{ active: activeId === 5 }" @click="handleChangMain(5)">个人介绍</span>
          </div>
        </div>
        <div class="right-box">
          <showreel v-if="activeId === 1"></showreel>
          <skill v-else-if="activeId === 2"></skill>
          <recruit v-else-if="activeId === 3"></recruit>
          <sell v-else-if="activeId === 4"></sell>
          <div v-else>
            <el-input
                v-model="introduce"
                :autosize="{ minRows: 4, maxRows: 10 }"
                type="textarea"
                class="intro"
                placeholder="向大家介绍一下自己吧~"
            />
            <el-button class="intro-btn" round @click="saveIntro">保存</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import {ref, reactive} from 'vue'
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {ElMessage} from 'element-plus'
import {workbenchWorkerInfo, getMemberInfo} from "@/api/user";
import WordDialog from '../components/WordDialog'
import Showreel from '../components/accountPage/Showreel'
import Sell from '../components/accountPage/Sell'
import Recruit from '../components/accountPage/Recruit'
import Skill from '../components/accountPage/Skill'


import {onMounted} from "vue";
import * as echarts from "echarts";
import {parseTime} from "../../../utils/ruoyi";

const router = useRouter();
const activeName = ref('first')
const activeId = ref(1)
const store = useStore();
const userInfo = store.state.user
const loadingStatus = ref(false)
const total = ref(0)
const introduce = ref('')//个人介绍


const params = reactive({
  pageNum: 1,
  pageSize: 10,
})

const handleChangMain = (type) => {
  if (type === activeId.value) return;
  params.pageNum = 1;
  activeId.value = type

}

//用户入驻平台时间
const timer = ref(0)
function getDifferTime(startDate, endDate) {
  console.log("startDate",startDate)
  console.log("endDate",endDate)
  let startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
  let endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  let dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
  timer.value = dates
}

function saveIntro() {
  console.log('introduce',introduce.value)
}

/**
 * 分页触发事件
 * @param page
 * @param limit
 */
const handlePagination = ({page, limit}) => {
  if (loadingStatus.value) {
    return;
  }
  params.pageNum = page;
  params.pageSize = limit;
}


/**
 * 获取标签
 */
const workInfo = ref({})
const getWorkbenchWorkerInfo = () => {
  workbenchWorkerInfo().then(res => {
    workInfo.value = res.data.workerCategory?.slice(0, 3);
  });
}
getWorkbenchWorkerInfo();
onMounted(() => {
  getMember()
});

const memberState = ref()
const getMember = () => {
  getMemberInfo().then(res => {
    memberState.value = res.data?.state
    getDifferTime( parseTime(res.data?.createTime,'{y}-{m}-{d}'),  parseTime(new Date(),'{y}-{m}-{d}'))
  });
}

const fanMain = ref('');
let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: '#fff',
        borderColor: 'none',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);', // 附加阴影样式
        textStyle: {
          color: '#53565C'
        },
        confine: true     //限制tootip在容器内
      },
      radar: {
        // 圆的半径，数组的第一项是内半径，第二项是外半径。
        // 如果由于高度不够，内容被隐藏的话，添加这个配置
        startAngle: 0,
        indicator: [
          {name: 'B站', max: 5000},
          {name: '小红书', max: 6000},
          {name: '网易云音乐', max: 3000},
          {name: '抖音', max: 1600},
          {name: '快手', max: 5200},
          {name: 'QQ音乐', max: 2500}
        ],
        // 字体颜色
        axisName: {
          color: '#818aa1',
          padding: [-10, -12]
        },
        // 背景颜色
        splitArea: {
          areaStyle: {
            color: ['#13151A'],
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
        // 直线颜色+字体颜色
        axisLine: {
          lineStyle: {
            color: `#242d4d`
          },
        },
        splitLine: {
          lineStyle: {
            color: `#242d4d`
          }
        }
      },
      series: [
        {
          type: 'radar',
          // tooltip: {
          //   trigger: 'item'
          // },
          data: [
            {
              name: '粉丝数据',
              value: [4200, 3000, 2000, 1000, 5000, 1800],
              label: {
                show: true,
                color: '#428BD4',
                formatter: function (params) {
                  // 在一万后面加上w
                  let num = params.value;
                  if (num >= 10000) {
                    num = Math.round(num / 1000) / 10 + 'w';
                  } else if (num >= 1000) {
                    // num = Math.round(num/100)/10 + 'k';
                  }
                  return num;
                }
              }
            }
          ],
          areaStyle: { // 单项区域填充样式
            normal: {
              color: 'rgba(51,0,255,0.5)'
            }
          }
        }
      ]
    }
;
/**
 *
 *  页面挂载后，操作DOM
 */
onMounted(() => {
  var chartDom = fanMain.value;
  var myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
})


</script>
<style scoped lang="scss">
@import './style.scss';
@import '../style.scss';

.apply-card {
  font-size: 14px;
  font-weight: 400;
  color: #4E5262;
  line-height: 21px;
  margin-top: 20px;

  .item {
    height: 50px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .left {
    width: 35%;

    div {
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;

    }
  }

  .right {
    width: 60%;

    div {
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
  }
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

.table-enter-from {
  opacity: 0
}

.table-enter-active {
  transition: all 0.2s;
}

.table-enter-to {
  opcaity: 1
}

.pagination-container-box {
  margin-bottom: 20px;

  :deep(.el-pagination) {
    margin: 20px auto;
  }
}

.tag {
  margin-top: 10px;
  user-select: none;
  display: flex;
  flex-wrap: wrap;

  div {
    padding: 4px 6px;
    border-radius: 4px;
    color: white;
    margin-right: 5px;
    flex: 0 0 auto;
    font-size: 10px;
    margin-top: 5px;
  }

  .type0 {
    background: linear-gradient(213deg, #1BD496 0%, #05B57A 100%);
  }

  .type1 {
    background: linear-gradient(180deg, #85C1F7 0%, #48A2F4 100%);
  }

  .type2 {
    background: linear-gradient(63deg, #F6717E 0%, #FEAB93 100%);
  }

  .type3 {
    background: linear-gradient(52deg, #484DDB 0%, #6D88E6 100%);
  }
}
</style>
