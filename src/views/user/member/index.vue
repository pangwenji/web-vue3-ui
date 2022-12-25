<template>
  <div class="member-container">
    <div>
      <div class="top-title">会员方案</div>

      <div class="flexC top-card">

        <div class="right left-card">
          <div class="box rig" :style="[current===2?' height: 560px':'']">
            <div>
              <div class="title">体验版</div>
              <div class="price" v-color="'#CFD2D8'" style="line-height: 39px;">
                <span class="big-num" v-color="'#CFD2D8'"
                      style="font-size: 40px;font-weight: 500;">{{ memberPlan[0]?.price || 0 }}</span>元 /年
              </div>
              <div class="flexC">
                <div class="btn-mem flexC">
                  体验服务，注册即可享受
                </div>
              </div>
              <div class="list">
                <div style="margin-bottom: 26px">你将获得</div>
                <ul>
                  <!--                  <li v-for="item in memberPlan[0]?.privileges">-->
                  <li v-for="item in list[2]">
                    <img style="width: 10px;height: 10px" src="@/assets/user/gou-1.png">
                    <span v-html="item"></span>
                  </li>
                </ul>
              </div>
            </div>
            <!--              <div class="buy" v-if="current===2">-->
            <!--                立即购买-->
            <!--              </div>-->
          </div>
        </div>

        <div class="middle">
          <div class="check">
            <div class="box mid">
              <div style="position: relative;">
                <div>
                  <div class="title">个人版</div>
                  <div class="price" style="margin-bottom: 0">
                    <div style="position: relative;display: flex;">
                      <span class="big-num">{{ memberPlan[1]?.price || 0 }}</span>元 /年
                      <div class="tag">
                        <img style="width: 62px;height: 25px" src="@/assets/user/youhui.png">
                      </div>
                    </div>
                  </div>
                  <div style="text-align: center;">
                    <span style="text-decoration: line-through;">原价：699元/年</span>
                    <span class="num-span">一次就省531元</span>
                  </div>
                  <div style="text-align: center;margin-top: 7px;margin-bottom: 32px"><span>低至 0.47元/天</span></div>

                  <div class="buy flexC" @click="buyNow">
                    <span v-if="store.state.user.member?.state === 1">再来一年</span>
                    <span v-else>立即购买</span>
                  </div>
                  <div style="text-align: center;margin-top: 10px;    height: 16px;">
                    <span v-if="store.state.user.member?.state === 1">有效期至：{{ parseTime(endTime, '{y}-{m}-{d}')  }}</span>
                  </div>
                  <div class="list">
                    <div style="font-size:16px;margin-bottom: 21px">你将获得</div>
                    <ul>
                      <!--                      <li v-for="item in memberPlan[1]?.privileges">-->
                      <li v-for="item in list[1]">
                        <img style="width: 10px;height: 10px" src="@/assets/user/gou-2.png">
                        <span v-html="item"></span>
                      </li>
                    </ul>
                    <div class="list-btm-text">*创作者在存储、版权素材购买等支出高达￥2480</div>
                  </div>
                  <div class="btm-text">陪伴平台一起成长，你将收获更多…
                  </div>
                </div>
                <!--                  <div style="text-align: center;margin-top: 30px;" v-if="member?.state === 1">到期时间：{{-->
                <!--                      memberEndTime-->
                <!--                    }}-->
                <!--                  </div>-->
              </div>

            </div>
          </div>
        </div>
        <div class="left left-card">
          <div class="box lef" :style="[current===1?' min-height: 560px':'']">
            <div>
              <div class="title">团队版</div>
              <div class="price team-num">
                <span>{{ memberPlan[2]?.price || 0 }}</span>
              </div>
              <div class="flexC">
                <div class="btn-mem flexC">
                  对此感兴趣？欢迎联系我们
                </div>
              </div>
              <div class="list">
                <div style="margin-bottom: 26px">你将获得</div>
                <ul>
                  <!--                  <li v-for="(item,index) in memberPlan[2]?.privileges">-->
                  <li v-for="(item,index) in list[3]">
                    <img style="width: 10px;height: 10px" src="@/assets/user/gou-1.png"
                         v-if="index !== memberPlan[2]?.privileges.length-1">
                    <span :style="{'margin-left' : index === memberPlan[2]?.privileges.length-1 ? '20px': ''}">{{
                        item
                      }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!--              <div class="buy" v-if="current===1">-->
            <!--                立即购买-->
            <!--              </div>-->
          </div>
        </div>

      </div>
    </div>

    <div>
      <div class="top-title">常见问题解答</div>
      <div class="issue-box">
        <div>
          <div class="issue">Q1: 为什么你们只收168？</div>
          <div>168是进入社群的门票费。我们希望以一个合适的门槛，筛选真正和我们志同道合的人，一起共同进步，共同成长。<br>
            在每年，我们也将已获得的利润，以活动的形式，回馈给社群。
          </div>
        </div>
        <div class="i-line"></div>
        <div>
          <div class="issue">Q2: 购买成功后可以开发票吗？</div>
          <div>可以。购买成功后，点击头像进入个人中心-发票管理，选择对应订单进行开票。</div>
        </div>
        <div class="i-line"></div>
        <div>
          <div class="issue">Q3: 购买后是否支持退款？</div>
          <div>不支持，建议先使用体验版。会员服务属于虚拟产品，购买成功后立即生效，不支持退款。</div>
        </div>
        <div class="i-line"></div>
        <div>
          <div class="issue">Q4: 个人版服务过期后，我存储的素材怎么办？</div>
          <div>素材仍在你的空间里，您可以像往常一样预览、删除，但无法继续使用收集，分享、转存等功能，其他功能模块将无法正常使用。此时，您可以重新续费，确保能正常运行。</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import {useWindowSize} from '@vueuse/core'

import {ref, watch, onMounted,onUnmounted} from "vue";
import {openMember} from "@/api/pay/pay";
import {useStore} from "vuex";
import {computed} from "@vue/runtime-core";
import {ElMessage, ElNotification} from 'element-plus'
import {getMemberInfo} from "@/api/user";
import {parseTime} from "@/utils/ruoyi";
import {useRoute} from "vue-router";
const {width, height} = useWindowSize();
const store = useStore()
const route = useRoute()
const payShow = ref(false);
const layoutSpan = ref('66%')
const checked = ref()


const getters = computed(() => {
  return store.getters
})
const list = {
  1: [
    "团队协作+在线作品审批工具",
    "永久免费空间<span style='font-weight: 600;color: #C4C9DF'>（10G空间）</span>",
    "无限存储的网盘<span style='font-weight: 600;color: #C4C9DF'>（需成为创作者）</span>",
    '近百个AI辅助工具',
    '海量低价商用素材库',
    '优选创作者，快速完成需求',
    '精选招募帖，在线报名接单',
    '专属客服一对一服务',
    '新功能抢先体验',
    '每年节省约￥2480',
  ],
  2: [
    "团队协作+在线作品审批工具",
    "永久免费空间<span style='font-weight: 600;color: #C4C9DF'>（1GB）</span>",
    "原价AI辅助工具",
    "原价商用素材库",
    '其他功能预览体验'
  ],
  3: [
    "个人版中的一切功能",
    "团队版灵活用工接单工具",
    "团队版在线审批协同工具",
    "...",
  ]
}

const onresize = (clientWidth) => {
  if (clientWidth < 1572) {
    layoutSpan.value = '100%'
  } else if (clientWidth < 1630) {
    layoutSpan.value = '93%'
  } else if (clientWidth < 1780) {
    layoutSpan.value = '88%'
  } else {
    layoutSpan.value = '66%'
  }
};
onresize(width.value)
watchEffect(() => {
  onresize(width.value)
})

const current = ref(0)

/**
 * 立即购买(获取支付二维码
 */
const {proxy} = getCurrentInstance();
const buyNow = () => {
  proxy.$pay.openOpenMember({onSubmitSuccess, payShow: true},2)
}
const onSubmitSuccess = () => {
  getMember()
}

onMounted(() => {
  getMember()
  //自动打开开会员弹窗（从官网过来）
  if (route.query.autoOpen){
    proxy.$pay.openOpenMember({onSubmitSuccess, payShow: true},2)
  }
});

const member = computed(() => {
  return store.state.user.member;
})

const memberPlan = ref([])
const endTime = ref()
const getMember = () => {
  getMemberInfo().then(res => {
    endTime.value = res.data.endTime
    memberPlan.value = res.data.memberSchemeInfos
    store.commit("SET_MEMBER", res.data)
  });
}


</script>
<style scoped lang="scss">
@import "./style";
@import '../style.scss';

.left-card {
  height: 540px;
  width: 336px;
}


.flexC {
  display: flex;
  justify-content: center;
  align-items: center;
}
.num-span{
  background: linear-gradient(270deg, rgba(255,113,124,0.2) 0%, rgba(255,201,134,0) 100%);
  color: #F88212;
  border-radius: 0px 11px 11px 0px;
  margin-left: 11px;padding:1px 9px 1px 8px
}
</style>
