<template>
  <div class="setting-container">
    <div class="main">
      <div class="left">
        <div class="title">个人信息</div>
        <div class="msg">
          <div class="head-img">
            <user-avatar @getMember="getMember()"></user-avatar>
            <div class="flexB" style="margin-left: 20px;    width: 83%;">
              <div>
                <div>{{ userDate.nickName }}</div>
                <div style="margin-top: 15px;    display: flex;    align-items: center;">
                  <img src="@/assets/home/wm.png" v-if="store.state.user?.sex === '1'"
                       style="margin-right: 4px;height: 20px;"/>
                  <img src="@/assets/home/man.png" v-else style="margin-right: 4px;height: 20px;"/>
                  ID:{{ userDate.number }}
                </div>
              </div>
              <div>
                <div class="change" @click="changeAvatar">修改头像</div>
              </div>
            </div>
          </div>
          <div class="userinfo">
            <div class="flex" style="width: 100%;">
              <div class="ltext">
                <div class="mbt">性别：</div>
                <div class="mbt">昵称：</div>
                <div class="mbt">姓名：</div>
                <!-- <div class="mbt">ID：</div>-->
                <div class="mbt">手机:</div>
                <div class="mbt">提现银行卡：</div>
              </div>

              <div class="rtext">
                <!--                性别-->
                <div class="mbt flexB">
                  <el-radio-group v-model="userSex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                  </el-radio-group>
                  <div class="change" @click="changeSex">修改</div>
                </div>
                <!--                昵称-->
                <div class="mbt flexB">{{ userDate.nickName }}
                  <div class="change" @click="changeNickName">修改</div>
                </div>
                <!--                姓名-->
                <div class="mbt">
                  <div v-if="!userIdCard" class="flexB">
                    <div>{{ '-' }}</div>
                    <div class="change" @click="approve">实名认证</div>
                  </div>
                  <div v-else class="flex">
                    <div>{{ userIdCard.name }}<span
                        style="margin-left: 20px">{{ userIdCard ? userIdCard.idcard : '-' }}</span></div>
                    <div class="yapprove">已认证</div>
                  </div>
                </div>
                <!--                Id-->
                <!--                <div class="mbt">{{ userDate.userId }}</div>-->
                <!--                手机号-->
                <div class="mbt flexB">
                  <div class="flex">
                    {{ userDate.userName }}
                  </div>
                  <!--                  <div class="change">修改</div>-->
                </div>


                <div class="mbt flexB">
                  <div class="id-card">{{ user.bankCard }}<span style="margin-left: 20px">{{ user.bankName }}</span>
                  </div>
                  <div class="change" @click="changeCard(1)" v-show="add">添加</div>
                  <div class="change" @click="changeCard(2)" v-show="change">修改</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div>
          <div class="title">账户安全</div>
          <div class="safety">
            <div class="user-left">
              <div class="mbt">账户密码：</div>
              <div class="mbt">支付密码：</div>
            </div>
            <div class="user-right">
              <div class="mbt flexB">
                <div>************</div>
                <div class="change" @click="changePsw">修改</div>
              </div>
              <div class="mbt flexB">
                <div>************</div>
                <div class="change" @click="changePay">修改</div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 40px;">
          <div class="title">第三方账户绑定</div>
          <div v-if="bindingList.length > 0">
            <div v-for="(item, index) in bindingList" :key="index" class="account" style="margin-bottom:10px;">
              <div class="user-left">
                <div v-if="item.type === 'ma'">微信(小程序)：已绑定</div>
                <div v-else-if="item.type === 'mp'">微信(公众号)：已绑定</div>
              </div>
              <div class="user-right">
                <div class="mbt flexB" style="margin-bottom: 0px">
                  <div class="change" @click="unBinding(item.id)">解绑</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="account">
            <div class="user-left">
              <div>微信：暂未绑定</div>
            </div>
            <div class="user-right">
              <div class="mbt flexB" style="margin-bottom: 0px">
                <!-- <div>{{ weChat }}</div> -->
                <div class="change" @click="addWeChat">绑定</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div style="padding-top: 20px;">
      <BindPlatform></BindPlatform>
    </div> -->


    <!-- 添加银行卡confirm -->
    <!-- 修改银行卡confirm2 -->
    <word-dialog class="approve"
                 :title="dTitle"
                 :loadingSubmit="loadingSubmit"
                 :openType="openType"
                 v-model:show="addCardShow"
                 @confirm="addCardConfirm(addCardFormRef)"
                 @confirm2="changeCardConfirm(addCardFormRef)"
                 @onOpen="openDialog"
    >
      <div class="approve-card">
        <el-form
            ref="addCardFormRef"
            :model="addCardForm"
            :rules="Rules"
            label-width="120px"
            label-position="left"
            hide-required-asterisk
        >
          <el-form-item label="银行名称" prop="bankName">
            <el-input v-model="addCardForm.bankName" placeholder="请输入银行名称" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="银行卡号" prop="account">
            <el-input v-model="addCardForm.account" maxlength="20" placeholder="请输入银行账号" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="账户名" prop="realName">
            <el-input v-model="addCardForm.realName" maxlength="20" placeholder="请输入账户名" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="身份证号" class="phone-item" prop="certNo">
            <el-input v-model="addCardForm.certNo" placeholder="请输入您的身份证号"></el-input>
          </el-form-item>
          <el-form-item label="手机号" class="phone-item" prop="phone">
            <el-input v-model="phone" placeholder="请输入您的手机号"></el-input>
          </el-form-item>
          <el-form-item label="手机验证码" prop="code" style="margin-top: 8px;width: 100%;">
            <div class="flex" style="margin-top: 8px;width: 100%;">
              <el-input v-model.number="addCardForm.code" maxlength="6" placeholder="请输入验证码" autocomplete="off"/>
              <div class="btm" @click="getCode">
                <div v-if="countDown===0">发送验证码</div>
                <div v-else>{{ countDown }} 秒</div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </word-dialog>

    <!-- 修改密码 -->
    <word-dialog class="approve"
                 :title="dTitle"
                 :loadingSubmit="loadingSubmit"
                 v-model:show="pswShow"
                 @confirm="changeWord(passwordRef)"
                 @onOpen="openChangeDialog"
    >
      <div class="approve-card">
        <el-form
            ref="passwordRef"
            :model="passwordForm"
            :rules="Rules"
            label-width="120px"
            label-position="left"
            hide-required-asterisk
        >
          <el-form-item label="新的登录密码" prop="password">
            <el-input v-model="passwordForm.password" type="password" placeholder="请输入新的登录密码" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="再次输入" prop="password2">
            <el-input v-model="passwordForm.password2" type="password" placeholder="请再次输入密码" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="手机号" class="phone-item">
            <el-input v-model="phone" disabled placeholder="请输入您的手机号"></el-input>
          </el-form-item>
          <el-form-item label="手机验证码" prop="code" style="margin-top: 8px;width: 100%;">
            <div class="flex" style="margin-top: 8px;width: 100%;">
              <el-input v-model.number="passwordForm.code" maxlength="6" placeholder="请输入验证码" autocomplete="off"/>
              <div class="btm" @click="getCode">
                <div v-if="countDown===0">发送验证码</div>
                <div v-else>{{ countDown }} 秒</div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </word-dialog>

    <!-- 添加微信登录 -->
    <word-dialog class="approve"
                 :width="'500px'"
                 :title="dTitle"
                 :showButton="false"
                 :closeOnClickModal="false"
                 v-model:show="addWxShow"
                 @onOpen="openWxDialog"
                 @onClose="handleWxClose"
    >
      <div class="approve-card wvCard">
        <el-image style="width: 200px; height: 200px;" :src="qrCode" v-loading="qrcodeLoading"/>
        <div v-if="scanStatus === 'RUNNING'" class="mask">
          <el-icon :size="56" color="#08c260">
            <SuccessFilled/>
          </el-icon>
          <span style="margin:18px 0 10px;font-size:18px;">扫码成功</span>
          <span>请在手机上确认是否授权</span>
        </div>
        <div v-else-if="scanStatus === 'error'" class="mask">
          <el-icon :size="56" color="#F56C6C">
            <CircleCloseFilled/>
          </el-icon>
          <span style="margin:18px 0 10px;font-size:18px;">绑定错误</span>
        </div>
      </div>
      <p style="padding:16px 0 20px;text-align: center;">请扫码绑定微信</p>
    </word-dialog>

    <!-- 修改昵称 -->
    <word-dialog class="approve"
                 :title="dTitle"
                 v-model:show="userShow"
                 @confirm="userConfirm"
                 @onOpen="openDialog"
                 ref="NickNameDialog"
    >
      <div class="approve-card">
        <el-form
            ref="changeUserRef"
            :model="changeUser"
            :rules="Rules"
            label-width="120px"
            label-position="left"
            hide-required-asterisk
        >
          <el-form-item label="当前昵称" prop="oldNickName">
            <el-input v-model="changeUser.oldNickName" disabled autocomplete="off"/>
          </el-form-item>
          <el-form-item label="新昵称" prop="nickName">
            <el-input v-model="changeUser.nickName" placeholder="请输入新的昵称" autocomplete="off"/>
          </el-form-item>
        </el-form>
      </div>
    </word-dialog>

  </div>
</template>
<script setup>
import {onMounted} from '@vue/runtime-core';
import * as echarts from 'echarts'
import BindPlatform from "@/views/workspace/components/BindPlatform";
import WordDialog from '../components/WordDialog'
import userAvatar from '../components/userAvatar'
import {useStore} from "vuex";
import {ref, computed, reactive} from "vue";
import {ElMessage, ElMessageBox, ElLoading} from "element-plus";
import {
  addBankCard,
  changeUserPsw,
  changePayPsw,
  getBankCard,
  getPhoneCode,
  realVerify,
  changeBankCard, getPayPhoneCode, getWeChatCode, changeUserInfo, monoFile, getMemberInfo, getUserInfo
} from "@/api/user";
import UserAvatar from "../../system/user/profile/userAvatar";
import {openSetPassword} from "../../../plugins/pay";
import {getWxRoutineLoginQrCode, checkWxMaRegister} from "@/api/login";
import {getWeChatBindingList, deleteWeChatBinding} from "@/api/user/auth";
import {useRouter} from "vue-router";

const store = useStore();
const userInfo = store.state.user
const approveShow = ref(false);
const addCardShow = ref(false);
const changeCardShow = ref(false);
const payShow = ref(false);
const pswShow = ref(false);
const addWxShow = ref(false);
const add = ref(true);
const change = ref(false);
const vx = ref(true);
const dTitle = ref('');
const openType = ref(1);
const width = ref('400px');
const weChat = ref('-');
const phone = ref('');
const account = ref('');
const password = ref('');
const password2 = ref('');
const code = ref('');
const qrCode = ref('');
const router = useRouter();
const user = ref({
  bankCard: '-',
  bankName: '',
  phone: '',
  name: '-',
})
const changeUser = ref({
  nickName: '',
  oldNickName: '',
  avatar: '',
  // email: '',
})
//实名认证表单
const approveFormRef = ref()
const approveForm = ref({
  name: '',
  idcard: '',
  phone: '',
  code: '',
})
const Rules = reactive({
  name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
  realName: [{required: true, message: '请输入账户名', trigger: 'blur'}],
  idcard: [{required: true, message: '请输入身份证号', trigger: 'blur'}, {
    min: 15,
    max: 18,
    message: '请输入正确的身份证号',
    trigger: 'blur'
  }],
  certNo: [{required: true, message: '请输入身份证号', trigger: 'blur'}, {
    min: 15,
    max: 18,
    message: '请输入正确的身份证号',
    trigger: 'blur'
  }],
  code: [{required: true, message: '请输入验证码', trigger: 'blur'}, {type: 'number', message: '请输入数字', trigger: 'blur'}],
  account: [{required: true, message: '请输入银行卡号', trigger: 'blur'}, {max: 20, message: '请输入正确的银行卡号', trigger: 'blur'}],
  bankName: [{required: true, message: '请输入银行名称', trigger: 'blur'}, {
    min: 3,
    max: 30,
    message: '请输入正确的银行名称',
    trigger: 'blur'
  }],
  password: [{required: true, message: '请输入新的密码', trigger: 'blur'}, {
    min: 6,
    max: 30,
    message: '密码长度应在6~30字符范围内',
    trigger: 'blur'
  }],
  password2: [{required: true, message: '请再次输入密码', trigger: 'blur'}, {
    min: 6,
    max: 30,
    message: '密码长度应在6~30字符范围内',
    trigger: 'blur'
  }],
  nickName: [{required: true, message: '请输入新的昵称', trigger: 'blur'}, {
    min: 1,
    max: 15,
    message: '昵称长度应在1~15字符范围内',
    trigger: 'blur'
  }],
  mobile: [{required: true, message: "请输入手机号", trigger: "blur"}, {
    pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
    message: "请输入正确的手机号码",
    trigger: "blur"
  }],
})

//银行卡
const addCardFormRef = ref()
const addCardForm = ref({
  bankName: '',
  account: '',
  code: '',
  mobile: '',
  certNo: '',
  realName: '',
})
//修改密码
const passwordRef = ref()
const passwordForm = ref({
  password: '',
  password2: '',
  code: ''
})

const idCard = computed(() => {
  return store.state.user.idCard
})

onMounted(() => {
  BankCard()
  getBindingList()
});

onUnmounted(() => {
  clearInterval(timer.value)
})

const approve = () => {
  proxy.$Authentication.openAuth({onSubmitSuccess: onAuthSubmitSuccess})
}

function onAuthSubmitSuccess() {
  getMember()
}

const changeCard = (t) => {
  // 绑卡前需实名
  if (!userIdCard.value?.name) {
    return ElMessage.warning('绑定银行卡前请先完成实名认证')
  }

  if (t === 1) {
    openType.value = 1
    dTitle.value = '添加银行卡'
    addCardShow.value = !addCardShow.value
  } else {
    openType.value = 2
    dTitle.value = '修改银行卡'
    addCardShow.value = !addCardShow.value
  }
}
const changePsw = () => {
  dTitle.value = '修改账户密码'
  pswShow.value = !pswShow.value
}
const {proxy} = getCurrentInstance();
const changePay = () => {
  proxy.$pay.openSetPassword({onSubmitSuccess, disabledPhone: true})
}
const onSubmitSuccess = () => {

}
/**
 * 添加银行卡
 */
const addCardConfirm = (addCardFormRef) => {
  if (!addCardFormRef) return
  addCardFormRef.validate((valid) => {
    if (valid) {
      addCardForm.value.mobile = phone.value
      addBankCard(addCardForm.value).then(res => {
        ElMessage({
          message: '添加成功',
          type: 'success',
        })
        BankCard()
        add.value = false
        change.value = true
        addCardShow.value = false
      })
    } else {
      return false
    }
  })
}

const loadingSubmit = ref(false)
/**
 * 修改银行账户
 */
const changeCardConfirm = (addCardFormRef) => {
  if (!addCardFormRef) return
  addCardFormRef.validate((valid) => {
    if (valid) {
      loadingSubmit.value = true;
      addCardForm.value.mobile = phone.value
      changeBankCard(addCardForm.value).then(res => {
        loadingSubmit.value = false;
        ElMessage({
          message: '修改成功',
          type: 'success',
        })
        BankCard()
        changeCardShow.value = false
        addCardShow.value = false
      }).catch(err => {
        loadingSubmit.value = false;
      })
    } else {
      return false
    }
  })
}

/**
 * 获取银行卡信息
 * @constructor
 */
const BankCard = () => {
  getBankCard().then(res => {
    if (res.data) {
      user.value.bankName = res.data.bankName
      user.value.bankCard = res.data.account
      add.value = false
      change.value = true
    } else {
      add.value = true
      change.value = false
    }
  })
}
let inter = null;
/**
 * 获取验证码
 */
const countDown = ref(0)
const getCode = () => {
  if (countDown.value === 0) {
    if (!phone.value){return}
    getPhoneCode({phone: phone.value}).then(res => {
      countDown.value = 60;
      inter = setInterval(() => {
        countDown.value -= 1;
        if (countDown.value <= 0) {
          clearInterval(inter)
        }
      }, 1000)
      ElMessage({
        message: '发送成功',
        type: 'success',
      })
    })
  }
}

//修改账号密码
const changeWord = (passwordRef) => {
  if (passwordForm.value.password !== passwordForm.value.password2) {
    ElMessage({
      message: '两次输入的密码不一致,请重新输入',
      type: 'warning',
    })
    return
  }
  if (!passwordRef) return
  passwordRef.validate((valid) => {
    if (valid) {
      loadingSubmit.value = true;
      changeUserPsw(passwordForm.value).then(res => {
        ElMessage({
          message: '修改成功',
          type: 'success',
        })
        loadingSubmit.value = false
        pswShow.value = false
        ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
          customClass: 'messageBox-custom-warning',
          confirmButtonText: '重新登录',
          cancelButtonText: '退出登录',
          type: 'warning',
          showClose: true,
          center: true,
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            //手动断连IM
            store.commit('IM/clearAllData', 'handleDisconnect')
            router.push({path: '/login'})
          })
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            store.commit('IM/clearAllData', 'handleDisconnect')
            router.push({path: '/login'})
          })
        });
      }).catch(() => {
        loadingSubmit.value = false
      });
    } else {
      return false
    }
  })
}
// 修改用户信息按钮
const userShow = ref(false)
const userAvatarShow = ref(false)
const NickNameDialog = ref()
const changeNickName = () => {
  dTitle.value = '修改昵称'
  userShow.value = !userShow.value
  changeUser.value.oldNickName = userDate.value.nickName
}

//性别修改
const userSex = ref()
userSex.value = store.state.user?.sex
const changeSex = () => {
  changeUserInfo({sex: userSex.value}).then(res => {
    ElMessage({
      message: '修改成功',
      type: 'success',
    })
    getMember()
  })
}

let changeUserAvatar = ref(null)
const changeAvatar = () => {
  //模拟点击<el-upload/>
  document.querySelector(".user-info-head").click()
}

//修改用户信息
const changeUserRef = ref()
const userConfirm = async () => {
  await proxy.$refs.changeUserRef.validateField('nickName');
  const query = {}
  if (!changeUser.value.nickName) {
    ElMessage({
      message: '请输入新昵称',
      type: 'warning',
    })
  } else {
    // query.avatar = userDate.value.avatar
    query.nickName = changeUser.value.nickName
  }
  changeUserInfo(query).then(res => {
    ElMessage({
      message: '修改成功',
      type: 'success',
    })
    getMember()
    userShow.value = false
    userAvatarShow.value = false
  })
}

const userDate = ref({})
const userIdCard = ref({})

//获取用户信息
function getMember() {
  getUserInfo().then(res => {
    userDate.value = res.data.user
    userIdCard.value = res.data.idcard
    store.commit('SET_AVATAR', res.data.user.avatar)
    store.commit('SET_NICKNAME', res.data.user.nickName)
    store.commit('SET_SEX', res.data.user.sex)
  })
}

getMember()

// 键盘按下事件
const handleKeydown = (e) => {
  const reg = /[0-9]{1}/
  if (reg.test(e.key) && password.value.length < 6) {
    password.value += e.key;
  } else if (e.keyCode == 8 && password.value) {
    password.value = password.value.slice(0, (password.value.length - 1));
  }
}
const handleKeydown2 = (e) => {
  const reg = /[0-9]{1}/
  if (reg.test(e.key) && password2.value.length < 6) {
    password2.value += e.key;
  } else if (e.keyCode == 8 && password.value) {
    password2.value = password2.value.slice(0, (password2.value.length - 1));
  }
}

/**
 * 添加微信
 */
const addWeChat = () => {
  dTitle.value = '绑定微信'
  addWxShow.value = true
}

const openDialog = () => {
  clearInterval(inter)
  phone.value = ''
  code.value = ''
  countDown.value = 0

  addCardForm.value = {
    bankName: '',
    account: '',
    code: '',
    mobile: '',
    certNo: '',
    realName: '',
  }
  approveForm.value = {
    name: '',
    idcard: '',
    phone: '',
    code: '',
  }
  changeUser.value = {
    nickName: '',
    oldNickName: userDate.value.nickName,
    avatar: '',
    // email: '',
  }
}
const openChangeDialog = () => {
  clearInterval(inter)
  phone.value = userDate.value.userName
  code.value = ''
  countDown.value = 0
  password.value = ''
  password2.value = ''
  passwordForm.value = {
    password: '',
    password2: '',
    code: ''
  }
}
/**
 * 获取微信登录
 */
const qrcodeLoading = ref(false)
const uuid = ref('')
const getWeChat = () => {
  qrcodeLoading.value = true
  getWxRoutineLoginQrCode({}, true).then(res => {
    qrcodeLoading.value = false
    qrCode.value = res.data.data
    uuid.value = res.data.uuid
    routineLoginPolling()
  }).catch(err => {
    qrcodeLoading.value = false
  })
}

const openWxDialog = () => {
  getWeChat()
}

// 小程序扫码轮询
const timer = ref(null)

function routineLoginPolling() {
  timer.value = setInterval(() => {
    if (qrCode.value) {
      handleCheckWxMaRegister()
    }
  }, 2000)
}

const scanStatus = ref('')

function handleCheckWxMaRegister() {
  checkWxMaRegister(uuid.value, true).then(res => {
    scanStatus.value = res.data?.init || ''
    if ((res.data.init).toLowerCase() === 'complete') {
      addWxShow.value = false
      handleWxClose()
      getBindingList()
      ElMessage.succewss('绑定成功')
    } else if (scanStatus.value === 'error') {
      clearInterval(timer.value)
      timer.value = null
    }
  }).catch(err => {
    handleWxClose()
  })
}

function handleWxClose() {
  qrCode.value = ''
  uuid.value = ''
  scanStatus.value = ''
  clearInterval(timer.value)
  timer.value = null
}

// 获取已绑定列表
const bindingList = ref([])

function getBindingList() {
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  getWeChatBindingList().then(res => {
    bindingList.value = res.rows
    loading.close()
  }).catch(res => {
    loading.close()
  })
}

// 解绑
function unBinding(id) {
  const text = '解绑微信后，账号仍可正常使用，但会影响使用微信扫码登录，是否解绑?';
  ElMessageBox.confirm(text, '解绑', {
    customClass: 'messageBox-custom-warning',
    type: 'warning',
    showClose: true,
    center: true,
  }).then(() => {
    deleteBinding(id)
  }).catch(err => {
  });
};

function deleteBinding(id) {
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  deleteWeChatBinding(id).then(res => {
    ElMessage.success('解绑成功')
    loading.close()
    getBindingList()
  }).catch(err => {
    loading.close()
  })
}


</script>
<style scoped lang="scss">
.setting-container {
  padding: 31px 24px;
  display: flex;
  flex: 1;
  flex-direction: column;

  .title {
    font-size: 22px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 33px;
    margin-bottom: 20px;
  }

  .main {
    display: flex;

    .left {
      width: 50%;

      .msg {
        //width: 546px;
        //height: 410px;
        position: relative;
        background: #1C1D24;
        box-shadow: 0px 0px 4px 0px rgba(52, 48, 227, 0.0500);
        border-radius: 10px;
        border: 1px solid #2B2D36;
        display: flex;
        flex-direction: column;
        padding: 28px 36px;

        .head-img {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
          color: #FFFFFF;
        }

        .userinfo {
          width: 100%;
          margin-top: 16px;
          display: flex;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          border-top: 1px dashed #97979742;
          padding-top: 20px;

          .ltext {
            width: 23%;
            line-height: 30px;
          }

          .rtext {
            width: 77%;
            font-size: 16px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 24px;


          }

        }
      }
    }

    .mbt {
      margin-bottom: 20px;
      height: 30px;
    }

    .autonym {
      font-size: 14px;
      font-weight: 500;
      color: #3468FE;
      line-height: 21px;
      cursor: pointer;
    }

    .right {
      width: 50%;
      margin-left: 20px;

      .safety {
        background: #1C1D24;
        box-shadow: 0px 0px 4px 0px rgba(52, 48, 227, 0.0500);
        border-radius: 10px;
        border: 1px solid #2B2D36;
        display: flex;
        align-items: center;
        padding: 21px 36px;

        .user-left {
          width: 23%;
        }

        .user-right {
          width: 77%;
        }

      }

      .account {
        background: #1C1D24;
        box-shadow: 0px 0px 4px 0px rgba(52, 48, 227, 0.0500);
        border-radius: 10px;
        border: 1px solid #2B2D36;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 21px 36px;

        .user-left {
          // width: 23%;
        }

        .user-right {
          // width: 77%;
        }

      }
    }
  }


  .change {
    //width: 60px;
    padding: 0px 10px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #979797;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    flex: 0 0 auto;
  }


  .approve-card {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;

    .text {
      margin-top: 20px;
      margin-bottom: 8px;
    }

    .btm {
      width: 110px;
      height: 46px;
      border-radius: 10px;
      border: 1px solid #DADCE1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
      cursor: pointer;
    }

    .el-input {

      :deep(.el-input__inner) {
        height: 46px;
        background: #FFFFFF;
        //border-radius: 10px;
      }
    }

  }
}

.id-card {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 20px;
}

.yapprove {
  transform: scale(0.9);
  width: 38px;
  height: 18px;
  background: #AED5FF;
  border-radius: 2px;
  color: #0F1114;
  line-height: 15px;
  font-size: 10px;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex {
  display: flex;
  align-items: center;
}

.flexB {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flexC {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pay-password-input {
  display: flex;
  align-items: center;
  //justify-content: space-between;
  .password-item {
    margin-right: 10px;
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #DADCE1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.active {
      &::after {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #999;
        border-radius: 10px;
      }
    }
  }

  &:focus {
    .password-item {
      border-color: #3468FE;

      &.active {
        &::after {
          background: black;
        }
      }
    }
  }
}

.wvCard {
  padding-top: 10px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  position: relative;

  .mask {
    width: 200px;
    height: 200px;
    position: absolute;
    background-color: rgba($color: #fff, $alpha: .8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.accName {
  :deep(.el-input__inner) {
    color: #000000;
    background-color: rgba(33, 33, 33, 0.06) !important;
  }
}

.el-form-item {
  display: flex;
  flex-direction: column;
}

.code {
  .el-input {
    :deep(.el-input__inner) {
      height: 46px;
      background: #FFFFFF;
      border: 1px solid #c0c4cc;
      border-right: none;
      box-shadow: none !important;
    }
  }

  :deep(.el-input-group__append) {
    background-color: white;
    border: 1px solid #c0c4cc;
    border-left: none;
    box-shadow: none !important;
    color: #1c84c6;
    cursor: pointer;
  }
}

:deep(.phone-item) {
  :deep(.el-form-item__content) {
    margin-left: 0px;
  }

}
</style>
