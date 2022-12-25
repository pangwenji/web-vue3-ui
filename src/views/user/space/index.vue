<template>
  <div class="space-container">
    <div class="top-title">空间容量</div>
    <div class="main">
      <div class="top">
        <div class="flexB">
          <div style="font-weight: 500;color: #FFFFFF">容量使用情况</div>
          <div class="top-right-box" v-if="store.state.user.member?.state === 1">
            <div class="right-1" @click="handleOpenDialog"><span v-color="'#3468FE'">创作者免费扩容</span>
              <el-tooltip content="无限空间是仅针对入驻灵活用工模块的创作者提供的福利" placement="top" effect="light">
                <img src="@/assets/user/space/tip.png">
              </el-tooltip>
            </div>
<!--            <div class="btn" @click="openMember" v-if="store.state.user.member?.state !== 1">-->
<!--              扩容-->
<!--            </div>-->
            <div class="btn" @click="goPath('/user/center/packing')">
              购买容量包
            </div>
          </div>

        </div>

        <div style="display: flex">
          <div>
            <img src="@/assets/user/space.png"/>
          </div>
          <div style="width: 100%;margin-left: 25px">
            <div class="flexS" style="margin: 10px 0px;">
              <div style="margin-right: 80px">已使用：<span style="color: #FFFFFF">{{ fileUsed?.used || 0 }}</span></div>
              <div style="margin-right: 80px">剩余：<span style="color: #FFFFFF">{{ fileUsed?.surplus || 0 }}</span></div>
              <div>总共：<span style="color: #FFFFFF">{{ fileUsed?.totalSize || 0 }}</span></div>
            </div>
            <div class="flexS num">
              <div class="num1" ref="projectUsed"></div>
              <div class="num2" ref="cloudUsed"></div>
            </div>
            <div class="box">
              <div class="box1"></div>
              审阅项目
              <div class="box2"></div>
              云盘
            </div>
          </div>
        </div>
      </div>

      <div class="btm">
          <div class="header-content-top" style="margin: 20px 0px">
            <div class="header-left">
            <span class="tab" :class="{ active: activeId === item.id }" v-for="(item, index) in tabListShow"
                  :key="index" @click="handleChangMain(item.id)">
              {{ item.title }}
              <el-tooltip content="包含回收站及审批附件内容（参与的项目不占用空间）" placement="top" effect="light" v-if="item.id===1">
                <img src="@/assets/user/space/tip.png"  style="width: 12px;height: 12px">
              </el-tooltip>
            </span>
            </div>
          </div>
          <project-list v-if="activeId == 1"></project-list>
          <capacity-list  v-else-if="activeId == 2" @onGetFileData="getFileData"></capacity-list>
      </div>
    </div>
  </div>


<div v-if="freeDialog" class="free-dialog-box">
  <el-dialog v-model="freeDialog" title="免费扩容" width="372px" :show-close="false">
    <div class="free-space-box" >
      <img class="close-img" src="@/assets/user/space/free-space/free-space-close.png" @click="freeDialog = false">
      <div class="top-tip">条件：认证成为创作者，即可享受免费扩容福利</div>
      <el-button type="primary" color="#3468FE" class="free-btn"  @click="goPath('/workspace/admin/attestation')">去认证扩容</el-button>
      <div class="bottom-text">*认证成功后，首次赠送1T空间</div>
    </div>
  </el-dialog>
</div>


  <div class="dialog-img" v-show="spaceDialog" @click="spaceDialog = false">
    <img src="@/assets/user/img_kefu.png">
  </div>

</template>
<script setup>
import {useStore} from "vuex";
import {ref, computed, reactive} from "vue";
import { getFileUserInfo} from "@/api/user/space";
import {formatSize} from '@/utils/tool.js';
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {useRouter} from "vue-router";
import ProjectList from "./ProjectList.vue";
import CapacityList from "./CapacityList.vue";
import freeimg1 from '@/assets/user/space/free-space/free-img1.png';
import freeimg2 from '@/assets/user/space/free-space/free-img2.png';
import freeimg3 from '@/assets/user/space/free-space/free-img2.png';
import {workbenchWorkerInfo} from "@/api/user";
const store = useStore();
const router = useRouter();
const userInfo = store.state.user
const loadingStatus = ref(false)
const {proxy} = getCurrentInstance();

const fileUsed = ref({
  projectUsed: '',
  totalSize: '',
  used: '',
  cloudUsed: '',
  surplus: '',
})
const activeId = ref(1)
let tabListShow = ref([
  {title: '审阅项目明细', id: 1},
  {title: '容量明细', id: 2},
])
//头部标签选择改变
const handleChangMain = (type) => {
  if (type === activeId.value) return;
  activeId.value = type
}
const projectUsed = ref()
const cloudUsed = ref()
const getFileData = () => {
  getFileUserInfo().then(res => {
    fileUsed.value.totalSize = formatSize(res.data.totalSize)
    fileUsed.value.used = formatSize(res.data.used)
    fileUsed.value.surplus = formatSize(res.data.totalSize - res.data.used)
    fileUsed.value.projectUsed = formatSize(res.data.projectUsed)
    fileUsed.value.cloudUsed = formatSize(res.data.used - res.data.projectUsed)
    const totalWidth = document.getElementsByClassName("num")[0]?.offsetWidth
    cloudUsed.value.style.width = (res.data.used - res.data.projectUsed) / res.data.totalSize * totalWidth + 'px'
    projectUsed.value.style.width = res.data.projectUsed / res.data.totalSize * totalWidth + 'px'
  })
}
getFileData()

const goPath = (path) => {
  router.push(path)
}

const openMember = () =>{
  proxy.$pay.openOpenMember({onSubmitSuccess, payShow: true},1)
}
const onSubmitSuccess = () => {
  getFileData()
  store.dispatch('MemberInfo').then(() => {})
}

const upgradeSpace = () => {
  ElMessageBox.confirm('成为本站会员可以升级无限空间，是否前往开通会员？', '提示', {
    customClass: 'messageBox-custom-warning',
    confirmButtonText: '前往',
    cancelButtonText: '取消',
    type: 'info',
  })
      .then(() => {
        router.push({path: '/user/center/member'})
      }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消',
    });
  });
}

//前往工种认证
const freeDialog = ref(false)
//联系客服
const spaceDialog = ref(false)

//获取认证工种类型
const workInfo = ref([])
const getWorkbenchWorkerInfo = () => {
  workbenchWorkerInfo().then(res => {
    workInfo.value = res.data.workerCategory?.slice(0, 3);
  });
}
getWorkbenchWorkerInfo()

const handleOpenDialog = () => {
  if (workInfo.value.length > 0){
    spaceDialog.value = true
  }else {
    freeDialog.value = true
  }
}

</script>
<style scoped lang="scss">
@import './style.scss';

.free-dialog-box{
  :deep(.el-dialog__header){
    display: none;
  }
  :deep(.el-dialog){
    border-radius: 37px;
  }
  :deep(.el-dialog__body){
    border-radius: 37px;
    height:281px;
    padding: 0px;
    background-image: url("@/assets/material/pay-succeed-dialig-bg.png");
  }
  :deep(.el-overlay-dialog){
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .free-space-box{
    background-image: url("@/assets/user/space/free-space/free-space-bg.png");
    height:281px;
    background-size: 100% 100%;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
    .close-img{
      position: absolute;
      top:-21px;
      right: -44px;
      width: 40px;
      cursor: pointer;
    }
    .top-tip{
      position: absolute;
      top: 94px;
      left: 39px;
    }

    .free-btn{
      position: absolute;
      bottom: 81px;
      left: 54px;
      width: 265px;
      height: 46px;
      background: linear-gradient(135deg, #FFF89F 0%, #FFEC4F 100%);
      box-shadow: 0px 2px 6px 0px #5D64D1;
      border-radius: 8px;
      font-weight: 500;
      color: #3D3F50;
    }
    .bottom-text{
      font-size: 12px;
      color: #FFFFFF;
      line-height: 17px;
      position: absolute;
      bottom:41px;
      left: 91px;
    }
  }
}
</style>
