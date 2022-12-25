<template>
  <div class="home-main">
    <el-scrollbar style="height: 100%" view-class="scrollbar-view">
      <el-row :gutter="20">
        <!--详情 -->
        <el-col :span="17">
          <div class="card-box user-info">
            <div class="avatar-box flexC" :style="{'background' : memberState === 1 ? 'linear-gradient(222deg, #9E5DF9 0%, #66C5FF 100%)'
            : 'linear-gradient(144deg, rgba(164, 164, 164, 0.15) 0%, rgba(128, 128, 128, 0.15) 100%)'}">
              <el-avatar :size="78" :src="getters.avatar" style="background-color: black"></el-avatar>
            </div>

            <div class="info">
              <div class="nickname">{{ getters.nickName }}</div>
              <div class="user-id">ID:{{ getters.number }}</div>
              <div class="tag">
                <img src="@/assets/home/wm.png" v-if="store.state.user?.sex === '1'"
                     style="margin-right: 4px;height: 20px;"/>
                <img src="@/assets/home/man.png" v-else style="margin-right: 4px;height: 20px;"/>

                <el-tooltip :content="store.state.user.idCard.name" placement="bottom" effect="light"
                            v-if="store.state.user?.idCard">
                  <div class="type type-real flexC"><p>实名认证</p></div>
                </el-tooltip>
                <el-tooltip content="您未实名认证" placement="bottom" effect="light" v-else>
                  <div class="type flexC typeHover" @click="router.push({path: '/user/center/setting'})"><p>未实名认证</p>
                  </div>
                </el-tooltip>

                <el-tooltip :content="'会员到期：'+memberEndTitem" placement="bottom" effect="light"
                            v-if="memberState === 1">
                  <div class="type type-vip flexC">
                    <img src="@/assets/home/vipIcon.png" style="margin-right: 4px"/>
                    <p>个人版</p>
                  </div>
                </el-tooltip>
                <el-tooltip content="您未开通个人版" placement="bottom" effect="light" v-else>
                  <div class="type flexC typeHover" @click="toMember"><p>体验版</p></div>
                </el-tooltip>

                <template v-for="(work,i) in workInfo">
                  <el-tooltip content="您已认证创作者" placement="bottom" effect="light">
                    <div class="type flexC" :class="'type'+((i+1)%6)">
                      <p>{{ work.categoryTitle }}</p>
                    </div>
                  </el-tooltip>
                </template>

                <span class="upgrade" v-if="memberState !== 1" @click="toMember">升级为个人版</span>
              </div>
            </div>

            <div class="card-right">
              <div class="toUser" @click="handleGo('/user')">个人中心
                <img class="arrow-icon" src="@/assets/home/arrow.png">
              </div>
              <div class="data-box">
                <div class="flex">
                  <div class="num">{{ fansInfo.count }}</div>
                  我的关注
                </div>
                <div class="line"></div>
                <div class="flex">
                  <div class="num">{{ fansInfo.fanCount }}</div>
                  粉丝数
                </div>
                <div class="line"></div>
                <div class="flex">
                  <div class="num" @click="handleGo('/user/center/wallet')" style="cursor: pointer">
                    {{ moneyBalance || 0 }}
                    <img src="@/assets/user/wallet/tongqian.png"/>
                  </div>
                  <div style="display: flex">可用
                    <div class="recharge">
                      <span @click.stop="recharge">购买</span></div>
                  </div>
                </div>
                <div class="line"></div>
                <div class="flex">
                  <div class="num" style="cursor: pointer" @click="handleGo('/user/center/space')">{{ (fileUsed.used || 0) + '/' + (fileUsed.totalSize || 0) }}</div>
                  空间用量
                </div>
                <div class="flex" style="margin: auto;">
                  <!--el-icon>
                    <Setting/>
                  </el-icon-->
                </div>
              </div>
            </div>
          </div>
          <el-collapse-transition name="normal-expand">
            <div class="card-box" v-if="hideIntroduction">
              <div class="card-title">
                <div>功能介绍</div>
                <div class="close" @click="hideCard">
                  <el-tooltip
                      class="box-item"
                      effect="light"
                      content="隐藏该卡片"
                      placement="left"
                  >
                    <el-icon>
                      <Close/>
                    </el-icon>
                  </el-tooltip>
                </div>
              </div>
              <el-row :gutter="20">
                <el-col :span="8" v-for="(item,index) in moduleList" :key="index">
                  <div class="function-item">
                    <div class="item-top">
                      <div class="icon">
                        <el-image :draggable="false" style="width: 100%; height: 100%;" fit="contain"
                                  :src="item.icon"></el-image>
                      </div>
                      <div class="check" @click="handleGo(item.path)">查看</div>
                    </div>
                    <div class="context">
                      <div class="title">{{ item.title }}</div>
                      <div class="bottom">
                        <div class="desc">
                          <pre>{{ item.desc }}</pre>
                        </div>
                        <div class="btm-right" v-if="index === 2 || index === 3 ||index === 5 ">内测中...</div>
                      </div>

                    </div>
                    <div class="type" :class="'type' + (index+1)"></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
          <div class="card-box" v-if="projectList.length>0">
            <div class="card-title" style="margin-bottom: 20px">
              <div>审阅项目</div>
            </div>
            <el-row :gutter="20">
              <el-col :span="8" v-for="(project,index) in projectList" :key="index">
                <div class="project-item" @click="handleClick(project.project)">
                  <img class="close-icon" src="@/assets/home/close.png" @click.stop="delHomeProject(project.projectId)">
                  <div class="project-title">{{ project.project.name }}</div>
                  <div class="project-state-top">
                    <div class="state-item">
                      <span v-color="'#F88212'">{{ project.wait }}</span>
                      <div>待审阅</div>
                    </div>
                    <div class="line"></div>
                    <div class="state-item">
                      <span v-color="'#ECECEC'">{{ project.running }}</span>
                      <div>审阅中</div>
                    </div>
                  </div>
                  <div class="project-state-bottom">
                    <div class="label">意见汇总完毕</div>
                    <div>{{ project.collectFinish }}</div>
                  </div>
                  <div class="project-state-bottom">
                    <div class="label">通过</div>
                    <div>{{ project.passed }}</div>
                  </div>
                  <div class="project-menber">
                    <AvatarList :avatar-list="project.members.map(res=>res.user)"></AvatarList>
                    <span>共{{ project.memberCount }}人</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>


          <!--div class="card-header">
            <div>用工管理快捷入口</div>
            <div class="other"></div>
          </div>
          <div class="manage-btn-list">
            <div class="manage-btn type-blue" @click="handleGo('/personnel/personnelManage')">
              <div class="title">用工管理后台</div>
              <div class="desc">招募管理、用工订单管理、关注人才库管理等</div>
              <div class="other">快速&nbsp;|&nbsp;便捷&nbsp;|&nbsp;高效</div>
            </div>
            <div class="manage-btn type-purple" @click="handleGo('/personnel/personnelConsole')">
              <div class="title">应聘管理后台</div>
              <div class="desc">报名管理、工单管理、工种认证等</div>
              <div class="other">简单&nbsp;|&nbsp;安全&nbsp;|&nbsp;经济</div>
            </div>
          </div>-->
        </el-col>

        <!-- 其他内容 -->
        <el-col :span="7">
          <!--          <div class="right-card-box">-->
          <!--            <div class="right-box-title">同画世界筑建计划</div>-->
          <!--            <div class="right-box-text">通过发送邀请码，<br>-->
          <!--              邀请新成员注册并付费加入后，<br>-->
          <!--              最高可享35%佣金返现。-->
          <!--            </div>-->
          <!--          </div>-->

          <div class="card-box" style="margin-top: 0;">
            <div class="card-header">
              <div>快捷入口</div>
            </div>
            <el-row :gutter="20">
              <el-col v-for="(item,index) in entranceList.slice(0,8)" :key="item" :span="6"
                      style="margin-bottom: 20px;cursor: pointer">
                <div class="goItem" @click="handleGo(item.path,index)">
                  <div :class="item.icon" class="icon"></div>
                  <div>{{ item.title }}</div>
                </div>
              </el-col>
              <el-col v-for="(item,index) in entranceList.slice(8,entranceList.length)" :key="item" :span="6"
                      style="margin-bottom: 20px;cursor: pointer">
                <div class="goItem" @click="handleGo(item.path,index)" style="opacity:0.5">
                  <el-tooltip content="功能正在排期规划中，敬请期待！" placement="bottom" effect="light">
                    <div :class="item.icon" class="icon"></div>
                  </el-tooltip>
                  <div>{{ item.title }}</div>
                </div>

              </el-col>
            </el-row>
          </div>

          <!--帮助中心-文章专题-->
          <topic></topic>

        </el-col>
      </el-row>
    </el-scrollbar>
  </div>

<!--  会员折扣广告-->
  <discount-dialog :userId="userId" :memberState="memberState"></discount-dialog>

<!--首页推荐浏览器-->
  <recommend-dailog :userId="userId"></recommend-dailog>

</template>
<script setup>
import {useStore} from "vuex";
import {ref} from 'vue'
import {useRouter} from "vue-router"
import moduleIcon1 from "@/assets/home/1.png";
import moduleIcon2 from "@/assets/home/2.png";
import moduleIcon3 from "@/assets/home/3.png";
import moduleIcon4 from "@/assets/home/4.png";
import moduleIcon5 from "@/assets/home/5.png";
import moduleIcon6 from "@/assets/home/6.png";
import AvatarList from "@/components/AvatarList"
import {computed} from "@vue/runtime-core";
import {getHomeProject} from "@/api/project/project";
import {workbenchWorkerInfo} from "@/api/user";
import {getCategoryList} from "@/api/help";
import {getFansNum} from "@/api/user";
import {getFileUserInfo} from "@/api/user/space";
import {onMounted} from "vue";
import {delFormHome} from "@/api/project/project";
import {formatSize} from '@/utils/tool.js';
import moment from "moment";
import {ElMessageBox, ElNotification} from "element-plus";
import Topic from './Topic.vue'
import DiscountDialog from "./discountDialog";
import RecommendDailog from "./recommendDailog";

const store = useStore();
const router = useRouter();
const getters = computed(() => {
  return store.getters
})
const moneyBalance = computed(() => store.state.user.money)

const moduleList = [
  {
    title: '审片协同',
    desc: '在线批注\n沟通交付快3倍',
    icon: moduleIcon1,
    path: '/project/index'
  },
  {
    title: '素材云盘',
    desc: '资料云端存储\n智能分类筛选',
    icon: moduleIcon2,
    path: '/clouddisk/media/index'
  },
  {
    title: '灵活用工',
    desc: '海量人才，按需招募\n快速撮合交易',
    icon: moduleIcon3,
    path: '/workspace'
  },
  {
    title: '素材库',
    desc: '优质低价正版素材\n无惧版权风险',
    icon: moduleIcon4,
    path: '/material/main/index'
  },
  {
    title: '工具库',
    desc: '效率工具\n高效创作输出',
    icon: moduleIcon5,
    path: '/tool/index'
  },
  {
    title: '版权确权',
    desc: '数字版权存证上链\n全面专业保护原创',
    icon: moduleIcon6,
    // path: '/tool/index'
  },
]

const {appContext} = getCurrentInstance();

function handleGo(path) {
  if (!path) {
    return
  }
  router.push(path)
}

const {proxy} = getCurrentInstance();
const recharge = () => {
  proxy.$pay.openRecharge()
}

const entranceList = ref([
  {
    title: '我的钱包',
    icon: 'icon-wallet',
    path: '/user/center/wallet'
  },
  {
    title: '空间容量',
    icon: 'icon-space',
    path: '/user/center/space'
  },
  {
    title: '发票管理',
    icon: 'icon-invoice',
    path: '/user/center/fapiao'
  },
  {
    title: '账号设置',
    icon: 'icon-setting',
    path: '/user/center/setting'
  },
  {
    title: '音频工具',
    icon: 'icon-audio',
    path: '/tool/index/toolbox/1'
  },
  {
    title: '视频工具',
    icon: 'icon-video',
    path: '/tool/index/toolbox/3'
  },
  {
    title: '图片工具',
    icon: 'icon-image',
    path: '/tool/index/toolbox/2'
  },
  // {
  //   title: '工种库',
  //   icon: 'icon-1',
  //   path: '/personnel/main/index'
  // },
  // {
  //   title: '招募墙',
  //   icon: 'icon-2',
  //   path: '/personnel/main/recruitWall'
  // }, {
  //   title: '招募管理',
  //   icon: 'icon-3',
  //   path: '/personnel/personnelManage/recruit'
  // }, {
  //   title: '派单管理',
  //   icon: 'icon-4',
  //   path: '/personnel/personnelConsole/homepage'
  // },
  // {
  //   title: '购物车',
  //   icon: 'icon-5',
  //   path: '/material/main/shoppingCart'
  // },
  // {
  //   title: '已购素材',
  //   icon: 'icon-6',
  //   path: '/material/main/purchased'
  // },
  // {
  //   title: '热门工具',
  //   icon: 'icon-7',
  //   path: '/tool/index/toolbox/-1'
  // },
  {
    title: '处理订单',
    icon: 'icon-8',
    path: '/tool/index/record'
  },
  {
    title: '版权确权',
    icon: 'icon-9',
    // path: '/personnel/personnelManage/recruit'
  }, {
    title: '灵感采集',
    icon: 'icon-10',
    // path: '/personnel/personnelConsole/homepage'
  },
  {
    title: '交易商城',
    icon: 'icon-11',
    // path: '/material/main/shoppingCart'
  },
  {
    title: '能力提升',
    icon: 'icon-12',
    // path: '/material/main/purchased'
  },
  {
    title: '众筹拼团',
    icon: 'icon-13',
    // path: '/tool/index/toolbox/-1'
  },
  {
    title: '社群圈子',
    icon: 'icon-14',
    // path: '/tool/index/record'
  },
])

const userId = computed(() => {
  return store.state.user.userId;
})
//会员到期时间
const memberEndTitem = computed(() => {
  return moment(store.state.user.member.endTime).format('YYYY-MM-DD');
})
//会员状态
const memberState = computed(() => {
  return store.state.user.member.state
})

//前往开通会员
const toMember = () => {
  router.push({path: '/user/center/member'})
}

const hideIntroduction = ref(false)
// 获取本地缓存，判断是否存在隐藏卡片
// let storageItem = window.localStorage.getItem("hideIntroduction" + userId.value);
// hideIntroduction.value = !storageItem;
/**
 * 隐藏卡片
 */
const hideCard = () => {
  ElMessageBox.confirm(
      '该内容将从您的首页中永久隐藏，是否确认隐藏?',
      '隐藏该卡片?',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        hideIntroduction.value = false;
        window.localStorage.setItem("hideIntroduction" + userId.value, "hide")
      })
      .catch(() => {
      })
}
/**
 * 获取首页审阅项目
 */
const projectList = ref([])
const getHomeProjectThat = () => {
  getHomeProject('6').then(res => {
    projectList.value = res.data;
  });
}
getHomeProjectThat();

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


/**
 * 跳转到项目首页
 */
const handleClick = (e) => {
  if (e) {
    // handleGo("/project/index?projectId=" + e.id)
    handleGo("/project/index/" + e.id + "/file")
  } else {
    handleGo("/project/index")
  }

}
/**
 * 删除首页项目
 */
const delHomeProject = (id) => {
  delFormHome({id}).then(res => {
    getHomeProjectThat()
  })
}

const fileUsed = ref({
  used: '',
  totalSize: '',
})
const getFileData = () => {
  getFileUserInfo().then(res => {
    fileUsed.value.totalSize = formatSize(res.data.totalSize)
    fileUsed.value.used = formatSize(res.data.used)
  })
}
getFileData()

// 初始化 - 获取粉丝和关注者
const fansInfo = ref({})
const getFans = () => {
  getFansNum().then(res => {
    fansInfo.value = res.data
  })
}
getFans()

</script>
<style scoped lang="scss">
@import "./style.scss";

.normal-expand-enter-active {
  opacity: 1;
  transition: all 0.5s ease;
}

.normal-expand-leave-active {
  opacity: 0.1;
  transition: all 0.5s ease;
}

</style>
