<template>
  <div class="login">

    <img src="@/assets/login/top-logo.png" class="top-logo">


    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h1 class="title">{{ title }}</h1>
      <template v-if="cardType === 1">
        <div class="wx-code flexC" v-if="loginTypeState && whetherRegister ">

          <div class="wxCode-box flexC">
            <img src="@/assets/login/wxCode-bg.png" style="width: 166px;height: 166px;">
            <el-image style="width: 123px;position: absolute;height: 123px;border-radius: 10px;" :src="wxLoginQrCodeUrl"
                      fit="fill">
              <template #error>
                <div style="width:100%;height:100%;" v-if="!wxLoginQrCode" v-loading="true"
                     element-loading-text="正在加载二维码"></div>
                <div v-else class="login-qrcode-loadError" @click="handleRefreshQrcode">二维码失效，点击刷新</div>
              </template>
              <template #placeholder>
                <div class="login-qrcode-placeholder flexC" style="height: 100%">
                  <el-icon :size="24" class="is-loading">
                    <Loading/>
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div v-if="scanStatus === 'RUNNING'" class="scan-running">
              <svg-icon :size="32" iconClass="icon_success"></svg-icon>
              <text style="margin:8px 0 4px;font-size:16px;color:#fff;">扫码成功</text>
              <text style="font-size:12px;color:#fff;">请在手机上确认授权</text>
            </div>
          </div>
          <div class="des-text">微信扫码自动注册/登录</div>
          <div class="change-text">
            <span class="h-text" @click="loginTypeStateChange">密码登录</span>
            <span style="margin: 5px 16px">|</span>
            <span class="h-text" @click="loginTypeStateChange">注册</span>
          </div>
        </div>

        <div class="demo-tabs" v-else-if="!whetherRegister">

          <div style="color: #FFFFFF;font-size: 16px;margin-bottom: 30px">首次用扫码登录，需要绑定手机号码</div>
          <div>
            <el-form-item prop="phone">
              <el-input v-model="loginForm.phone" type="text" size="large" auto-complete="off" placeholder="请输入手机号"
                        class="input-with-select is-custom"></el-input>
            </el-form-item>
            <el-form-item prop="smsCode">
              <div class="input-smsCode">
                <el-input v-model="loginForm.smsCode" size="large" class="is-custom" auto-complete="off" :maxlength="6"
                          placeholder="请输入短信验证码"></el-input>
                <el-button type="primary" style="height: 46px; border-radius:10px;width: 110px;"
                           :disabled="Boolean(countDown)"
                           :style="[loginForm.phone==='' ? 'background: #ffffff2e;border: none' : '']"
                           color="#3468FE" @click="handleSendCode">
                  <span v-if="!countDown"
                        :style="[loginForm.phone===''? 'color: rgba(255,255,255,0.25)' : '']">获取验证码</span>
                  <span v-else-if="countDown == -1">正在发送...</span>
                  <span v-else>{{ countDown }}s后重新获取</span>
                </el-button>
              </div>
            </el-form-item>
            <el-form-item prop="inviteUser">
              <div class="input-inviteUser">
                <el-input v-model="loginForm.inviteUser" type="text" size="large" auto-complete="off"
                          placeholder="首次注册请填写邀请码"
                          class="input-with-select is-custom"></el-input>
                <el-button type="primary" style="height: 46px; border-radius:10px;width: 110px;border: none"
                           color="#3468FE" @click="handleInviteCode"
                           :style="{'display': inviteUserState ? 'block' : 'none'}">
                  <span>获取邀请码</span>
                </el-button>
              </div>

            </el-form-item>
            <el-form-item style="width:100%;  padding-top: 16px;">
              <el-button :loading="loading" round size="large" type="primary" class="custom-button" style="width:100%;"
                         :style="[(loginForm.phone===''||loginForm.smsCode===''||loginForm.inviteUser==='') ? 'background: #ffffff2e;border: none' : '']"
                         @click.prevent="wxToLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </div>

        </div>

        <div v-else-if="!loginTypeState  && whetherRegister">
          <!--      <div v-show="false">-->
          <el-tabs v-model="activeName" class="demo-tabs" :before-leave="onBeforeLeave">
            <!--          手机验证码 name=userPassword-->
            <el-tab-pane label="短信登录/注册" name="phoneCode">
              <el-form-item prop="phone">
                <el-input v-model="loginForm.phone" type="text" size="large" auto-complete="off" placeholder="请输入手机号"
                          class="input-with-select is-custom"></el-input>
              </el-form-item>
              <el-form-item prop="smsCode">
                <div class="input-smsCode">
                  <el-input v-model="loginForm.smsCode" size="large" class="is-custom" auto-complete="off"
                            :maxlength="6"
                            placeholder="请输入短信验证码" @keyup.enter="handleLogin"></el-input>
                  <el-button type="primary" style="height: 46px; border-radius:10px;width: 110px"
                             :disabled="Boolean(countDown)"
                             :style="[(loginForm.phone==='' || countDown > 0 || countDown == -1)? 'background: #ffffff2e;border: none;' : '']"
                             color="#3468FE" @click="handleSendCode">
                    <span v-if="!countDown"
                          :style="[loginForm.phone===''? 'color: rgba(255,255,255,0.25)' : '']">获取验证码</span>
                    <span v-else-if="countDown == -1" v-color="'rgba(255,255,255,0.1)'">正在发送...</span>
                    <span v-else v-color="'rgba(255,255,255,0.1)'">{{ countDown }}s后重新获取</span>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item prop="inviteUser">
                <div class="input-inviteUser">
                  <el-input v-model="loginForm.inviteUser" type="text" size="large" autocomplete="off"
                            placeholder="首次注册请填写邀请码"
                            class="input-with-select is-custom"></el-input>
                  <el-button type="primary" style="height: 46px; border-radius:10px;width: 110px;border: none"
                             color="#3468FE" @click="handleInviteCode"
                             :style="{'display': inviteUserState ? 'block' : 'none'}">
                    <span>获取邀请码</span>
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item style="width:100%;  padding-top: 16px;">
                <el-button :loading="loading" round size="large" type="primary" class="custom-button"
                           style="width:100%;"
                           :style="[(loginForm.phone===''||loginForm.smsCode==='') ? 'background: #ffffff2e;border: none' : '']"
                           @click.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </el-form-item>
            </el-tab-pane>
            <!--          微信扫码登录-->
            <!--         <el-tab-pane label="微信登录" name="weixinCode" style="height:250px;">-->
            <!--             <div class="login-qrcode">-->
            <!--                 <div style="display:inline-block;width: 175px; height: 175px;" v-loading="wxLoginScanSuccess" element-loading-text="扫描成功请确认登录">-->
            <!--                     <el-image style="width: 100%; height: 100%;" :src="wxLoginQrCode" fit="fill">-->
            <!--                         <template #error>-->
            <!--                             <div style="width:100%;height:100%;" v-if="!wxLoginQrCode" v-loading="true" element-loading-text="正在加载二维码"></div>-->
            <!--                             <div v-else class="login-qrcode-loadError" @click="handleRefreshQrcode">加载失败，点击刷新</div>-->
            <!--                         </template>-->
            <!--                         <template #placeholder>-->
            <!--                             <div class="login-qrcode-placeholder">-->
            <!--                                 <el-icon :size="24" class="is-loading">-->
            <!--                                     <Loading />-->
            <!--                                 </el-icon>-->
            <!--                             </div>-->
            <!--                         </template>-->
            <!--                     </el-image>-->
            <!--                 </div>-->
            <!--                 <div class="login-qrcode-desc">请使用微信扫码登录</div>-->
            <!--             </div>-->
            <!--         </el-tab-pane>-->
            <!--          账号密码登录 name=userPassword-->
            <el-tab-pane label="账号登录" name="userPassword">
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="请输入手机号"
                          class="input-with-select is-custom"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" class="is-custom" :show-password="true"
                          size="large"
                          auto-complete="off" placeholder="请输入密码" style="width: 100%"
                          @keyup.enter="handleLogin">
                </el-input>
              </el-form-item>
              <el-form-item prop="code" v-if="captchaOnOff">
                <el-input v-model="loginForm.code" size="large" class="is-custom" auto-complete="off"
                          placeholder="请输入验证码"
                          style="width: 66%" @keyup.enter="handleLogin">
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                </div>
              </el-form-item>
              <el-form-item style="width:100%; padding-top: 16px;">
                <el-button :loading="loading" size="large" class="custom-button" type="primary"
                           style="width:100%;border-radius: 21px;"
                           :style="[(loginForm.username===''||loginForm.password===''||loginForm.code==='') ? 'background: #ffffff2e;border: none' : '']"
                           @click.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
                <span style="color:#9094A6" class="h-text" @click="forgetPwd">忘记密码？</span>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <!-- 第三方登录 -->
          <div class="flex justify-center align-center fz-12" style="flex-direction: column; text-align:center"
               v-color="'rgba(255,255,255,0.5)'">
            <div class="login-party">
              <div class="login-party-item" @click="loginTypeStateChange">
                <svg-icon :size="32" iconClass="icon_weixin"></svg-icon>
              </div>
            </div>
            <div class="mb20 mt20">未注册用户在手机验证后自动创建账号</div>
          </div>
        </div>
      </template>
      <div class="demo-tabs" style="margin-top:10px" v-else>
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" type="text" size="large" auto-complete="off" placeholder="请输入手机号"
                    class="input-with-select is-custom"></el-input>
        </el-form-item>
        <el-form-item prop="smsCode">
          <div class="input-smsCode">
            <el-input v-model="loginForm.smsCode" size="large" class="is-custom" auto-complete="off" :maxlength="6"
                      placeholder="请输入短信验证码" @keyup.enter="handleLogin"></el-input>
            <el-button type="primary" style="height: 46px; border-radius:10px;width: 110px;"
                       :disabled="Boolean(countDown)"
                       :style="[(loginForm.phone===''||countDown > 0) ? 'background: #ffffff2e;border: none' : '']"
                       color="#3468FE" @click="handleSendCode">
              <span v-if="!countDown" :style="[loginForm.phone===''? 'color: rgba(255,255,255,0.25)' : '']">获取验证码</span>
              <span v-else-if="countDown == -1" v-color="'rgba(255,255,255,0.1)'">正在发送...</span>
              <span v-else v-color="'rgba(255,255,255,0.1)'">{{ countDown }}s后重新获取</span>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item prop="password1">
          <el-input v-model="loginForm.password1" type="password" class="is-custom" :show-password="true"
                    size="large"
                    auto-complete="off" placeholder="请输入6-30位新密码" style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input v-model="loginForm.password2" type="password2" class="is-custom" :show-password="true"
                    size="large"
                    auto-complete="off" placeholder="请再次输入密码" style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item style="width:100%;  padding-top: 16px;">
          <el-button :loading="loading" round size="large" type="primary" class="custom-button" @click="changeWord" style="width:100%;"
                     :style="[(loginForm.phone===''||loginForm.smsCode===''||loginForm.password1===''||loginForm.password2==='') ? 'background: #ffffff2e;border: none' : '']">
            <span>更改密码</span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <span v-color="'#9094A6'">想起密码？</span>
          <span v-color="'#3468FE'" class="h-text" @click="toLogin">去登录</span>
        </el-form-item>
      </div>

      <div style="font-size: 12px;color: #9094A6;text-align: center;">登录即表示您同意影音同画的<span
          style="color:#ffffff;cursor: pointer" @click="goProtocol(1)">《用户协议》</span>与 <span
          style="color:#ffffff;cursor: pointer" @click="goProtocol(2)">《隐私协议》</span></div>

    </el-form>

    <div class="introducer">
      <div>Hi，</div>
      <div>探索者。</div>
      <div class="welcome-text">欢迎进入影音同画世界 →</div>
    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span> © 2022 yingyintonghua.com  影音同画-影音创作者一站式服务平台 All Rights Reserved. <a
          href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">桂ICP备2022005950号</a></span>
    </div>
  </div>
  <!--  <el-dialog v-model="dialogVisible" :before-close="onBeforeClose" title="微信登录" append-to-body-->
  <!--             custom-class="dialog-center" width="300px">-->
  <!--    <div class="login-qrcode">-->
  <!--      <div style="display:inline-block;width: 175px; height: 175px;" v-loading="!wxLoginQrCode"-->
  <!--           element-loading-text="正在加载二维码">-->
  <!--        <el-image style="width: 100%; height: 100%;" :src="wxLoginQrCodeUrl" fit="fill"-->
  <!--                  v-if="wxLoginQrCode&&!wxLoginScanSuccess">-->
  <!--          <template #error>-->
  <!--            <div class="login-qrcode-loadError" @click="handleRefreshQrcode">加载失败，点击刷新</div>-->
  <!--          </template>-->
  <!--          <template #placeholder>-->
  <!--            <div class="login-qrcode-placeholder">-->
  <!--              <el-icon :size="24" class="is-loading">-->
  <!--                <Loading/>-->
  <!--              </el-icon>-->
  <!--            </div>-->
  <!--          </template>-->
  <!--        </el-image>-->
  <!--        <el-result style="padding:20px 10px; text-align:center;" icon="success" title="" sub-title="扫码成功请确认登录"-->
  <!--                   v-else-if="wxLoginScanSuccess"></el-result>-->
  <!--      </div>-->
  <!--      <div class="login-qrcode-desc">请使用微信扫码登录</div>-->
  <!--    </div>-->
  <!--  </el-dialog>-->


  <!--  <el-dialog v-model="dialogInvite" :before-close="onBeforeClose" title="Hi，探索者"-->
  <!--             custom-class="dialog-center" width="276px" ref="inviteDialog"-->
  <!--  >-->

  <!--   -->


  <!--  </el-dialog>-->
  <div v-show="dialogInvite">
    <el-dialog v-model="dialogInvite" custom-class="dialog-center" width="276px" ref="inviteDialog">
      <div class="invite-box">
        <div class="invite-title">Hi，探索者</div>
        <div class="invite-text">
          首次注册需联系客服获取邀请码<br>
          才能进行登录
        </div>
        <div class="code-box">
          <img src="@/assets/login/invite-code.png">
          <div style="margin-top: 37px">
            扫码联系客服获取
          </div>
        </div>
      </div>
    </el-dialog>
  </div>


</template>

<script setup>
import {
  getCodeImg,
  sendSmsVerificationCode,
  getWxLoginQrCode,
  wxLogin,
  wxMpCheckRegister,
  getWxRoutineLoginQrCode,
  checkWxMaRegister
} from "@/api/login";
import Ws from '@/utils/websocket.js';
import {download} from "@/utils/request.js"
import Cookies from "js-cookie";
import {encrypt, decrypt} from "@/utils/jsencrypt";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {setToken, setExpiresIn} from '@/utils/auth'
import {useRoute} from "vue-router";
import {commit} from "lodash/seq";
import {ElMessage} from "element-plus";
import {changeloginPsw} from "../api/login";

const store = useStore();
const route = useRoute();
const router = useRouter();
const {proxy} = getCurrentInstance();

const loginForm = reactive({
  phone: "",          //邀请码
  username: "",       //邀请码
  phoneAddr: "+86",   //邀请码
  password: "",       //密码
  password1: "",       //密码
  password2: "",       //再次输入密码
  rememberMe: false,  //邀请码
  code: "",           //邀请码
  inviteUser: '',      //邀请码
  smsCode: "",        //邀请码
  uuid: ""            //邀请码
});
const title = ref('登录')
const loginTypeState = ref(true)
const scanStatus = ref('')

const loginTypeStateChange = () => {
  loginTypeState.value = !loginTypeState.value
  // if (loginTypeState.value) handleOthersLogin('weixin')
}
const inviteUserState = ref(true)
onMounted(() => {
  if (route.query.invite_user) {
    loginForm.inviteUser = route.query.invite_user || '';
    inviteUserState.value = false
  }
  getRoutineQrCode() //调用
})

const validatePhone = (rule, value, callback) => {
  let reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}

const loginRules = {
  phone: [{required: true, validator: validatePhone, trigger: "blur"}],
  username: [{required: true, trigger: "blur", message: "请输入您的账号"}],
  password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
  password1: [{required: true, trigger: "blur", message: "请输入新的密码"}, {
    min: 6,
    max: 30,
    message: '密码长度需要在6~30字符之间',
    trigger: 'blur'
  }],
  password2: [{required: true, trigger: "blur", message: "请再次输入密码"}],
  code: [{required: true, trigger: "change", message: "请输入验证码"}],
  smsCode: [{required: true, trigger: "blur", message: "请输入短信验证码"}],
  inviteUser: [{required: true, trigger: "blur", message: "请输入邀请码"}],
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaOnOff = ref(true);
// 验证码倒计时
const countDown = ref(0);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);
// 切换标签name
const activeName = ref("phoneCode");
// 弹框显示隐藏
const dialogVisible = ref(false);
const wxLoginQrCode = ref(false);
const wxLoginScanSuccess = ref(false);
const websocketUrl = ref(import.meta.env.VITE_APP_WEBSOCKET_URL);

// 点击标签改变后的回调
function onBeforeLeave(newName, oldName) {
  if (loading.value) {
    return false;
  }
  if (newName == 'weixinCode') {
    handleRefreshQrcode();
  }
  if (newName == 'userPassword') {
    getCode();
  }
  return true;
}

// 点击刷新二维码
// function handleRefreshQrcode() {
//   handleOthersLogin('weixin')
// }

// handleOthersLogin('weixin')

// 第三方登录
const uuid = ref()
const wxLoginQrCodeUrl = ref('')

function handleOthersLogin(type) {
  if (!wxLoginQrCode.value) {
    return
  }
  wxLoginQrCode.value = false
  getWxLoginQrCode().then(res => {
    wxLoginQrCodeUrl.value = res.data.ticket;
    wxLoginQrCode.value = true
    uuid.value = res.data.uuid
    //取消自动刷新，9分钟后让二维码失效
    setTimeout(() => {
      wxLoginQrCodeUrl.value = ''
    }, 9 * 60 * 1000);
  })
}

const timer = ref(null);
// timer.value = setInterval(() => {
//   if (loginTypeState.value && whetherRegister.value) {
//     getWxMpCheckRegister()
//   }
// }, 3000)
const whetherRegister = ref(true)

function getWxMpCheckRegister() {
  wxMpCheckRegister(uuid.value).then(res => {
    if (res.data.init === 'complete') {
      whetherRegister.value = res.data.register
      if (whetherRegister.value === false) {
        title.value = !register.value ? '绑定手机' : '登录'
        loginTypeState.value = false
      } else {
        let data = res.data.accessToken
        setToken(data.access_token)
        store.commit('SET_TOKEN', data.access_token)
        setExpiresIn(data.expires_in)
        store.commit('SET_EXPIRES_IN', data.expires_in)
        loading.value = false;
        router.replace({path: redirect.value || "/"});
      }
    }
  })
}

onUnmounted(() => {
  clearInterval(timer.value);
});

//首次绑定微信手机号进行登录
async function wxToLogin() {
  await proxy.$refs.loginRef.validateField('phone');
  await proxy.$refs.loginRef.validateField('smsCode');
  await proxy.$refs.loginRef.validateField('inviteUser');
  const query = {
    phone: loginForm.phone,
    code: loginForm.smsCode,
    inviteUser: loginForm.inviteUser,
    uuid: uuid.value
  }
  wxLogin(query).then(res => {
    let data = res.data
    setToken(data.access_token)
    store.commit('SET_TOKEN', data.access_token)
    setExpiresIn(data.expires_in)
    store.commit('SET_EXPIRES_IN', data.expires_in)
    loading.value = false;
    router.replace({path: redirect.value || "/"});
  })
}

//点击忘记密码
const cardType = ref(1)
const forgetPwd = () => {
  title.value = '更改密码'
  cardType.value = 2
}

const toLogin = () => {
  cardType.value =1
  loginTypeState.value=false
  title.value = '登录'
}

const changeWord = async () => {
  await proxy.$refs.loginRef.validateField('phone');
  await proxy.$refs.loginRef.validateField('smsCode');
  await proxy.$refs.loginRef.validateField('password1');
  await proxy.$refs.loginRef.validateField('password2');
  if (loginForm.password1 !== loginForm.password2) {
    ElMessage({
      message: '两次输入的密码不一致，请重新输入',
      type: 'error',
    })
    return
  }
  const query = {
    password: loginForm.password1,
    code: loginForm.smsCode,
    phone: loginForm.phone
  }

  changeloginPsw(query).then(res => {
    ElMessage({
      message: '修改成功，请进行登录',
      type: 'success',
    })

    loginForm.phone = ''
    loginForm.smsCode = ''
    loginForm.password1 = ''
    loginForm.password2 = ''

    loginForm.password = '';
    loginForm.username = query.phone;
    loginForm.phone = query.phone;
    cardType.value = 1
    loginTypeState.value = false
    title.value = '登录'
  })

}

// 弹框关闭之前的回调
function onBeforeClose(deno) {
  deno()
}

// 发送短信验证码
async function handleSendCode() {
  if (countDown.value == -1) {
    return
  }
  await proxy.$refs.loginRef.validateField('phone');
  countDown.value = -1;
  sendSmsVerificationCode({
    phone: loginForm.phone
  }).then(res => {
    countDown.value = 60;
    const inter = setInterval(() => {
      countDown.value -= 1;
      if (countDown.value <= 0) {
        clearInterval(inter)
      }
    }, 1000)
  }).catch(err => {
    countDown.value = 0;
  })
}

//打开获取邀请码对话框
const dialogInvite = ref(false)
const handleInviteCode = () => {
  dialogInvite.value = true
}


// 登录按钮
async function handleLogin() {
  try {
    // 校验登录账号
    switch (activeName.value) {
      case 'phoneCode': //手机验证码登录
        await proxy.$refs.loginRef.validateField('phone');
        await proxy.$refs.loginRef.validateField('smsCode');
        // await proxy.$refs.loginRef.validateField('inviteUser');
        break;
      case 'userPassword': //账号密码登录
        await proxy.$refs.loginRef.validateField('username');
        await proxy.$refs.loginRef.validateField('password');
        await proxy.$refs.loginRef.validateField('code');
        break;
    }
  } catch (err) {
    return
  }
  loading.value = true;
  // 勾选了需要记住密码设置在cookie中设置记住用户明和名命
  // if (loginForm.rememberMe) {
  //   Cookies.set("username", loginForm.username, { expires: 30 });
  //   Cookies.set("password", encrypt(loginForm.password), { expires: 30 });
  //   Cookies.set("rememberMe", loginForm.rememberMe, { expires: 30 });
  // } else {
  //   // 否则移除
  //   Cookies.remove("username");
  //   Cookies.remove("password");
  //   Cookies.remove("rememberMe");
  // }
  loginForm.loginType = activeName.value;
  // 调用action的登录方法
  store.dispatch("Login", loginForm).then(() => {
    loading.value = false;
    router.replace({path: redirect.value || "/"});
  }).catch(() => {
    loading.value = false;
    // 重新获取验证码
    if (captchaOnOff.value) {
      getCode();
    }
  });

}

function getCode() {
  getCodeImg().then(res => {
    captchaOnOff.value = res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (captchaOnOff.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.uuid = res.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.username : username,
    password: password === undefined ? loginForm.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

// getCode();
getCookie();

const goProtocol = (i) => {
  if (i === 1) {
    window.open('/workbench/#/help/guide?id=1567451301810876418')
  } else {
    window.open('/workbench/#/help/guide?id=1565440725131800578')
  }
}

// 获取小程序太阳码
function getRoutineQrCode() {
  getWxRoutineLoginQrCode({inviteUser: loginForm.inviteUser || ''}).then(res => {
    uuid.value = res.data.uuid
    wxLoginQrCodeUrl.value = res.data.data
    wxLoginQrCode.value = true
    routineLoginPolling()
  })
}

// 小程序扫码登录轮询
function routineLoginPolling() {
  timer.value = setInterval(() => {
    if (loginTypeState.value && whetherRegister.value) {
      handleCheckWxMaRegister()
    }
  }, 2000)
}

function handleCheckWxMaRegister() {
  checkWxMaRegister(uuid.value).then(res => {
    scanStatus.value = res.data?.init || ''
    if ((res.data.init).toLowerCase() === 'complete') {
      whetherRegister.value = res.data.register
      if (whetherRegister.value === false) {
        title.value = !register.value ? '绑定手机' : '登录'
        loginTypeState.value = false
      } else {
        let data = res.data.accessToken
        setToken(data.access_token)
        store.commit('SET_TOKEN', data.access_token)
        setExpiresIn(data.expires_in)
        store.commit('SET_EXPIRES_IN', data.expires_in)
        loading.value = false;
        router.replace({path: redirect.value || "/"});
      }
    }
  })
}


</script>
<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.is-fullscreen.default-dialog {
  height: auto !important;
}
</style>
<style lang='scss' scoped>
.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-content: center;
}

.mb20 {
  margin-bottom: 20px;
}

.fz-12 {
  font-size: 12px;
}

.login {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("https://public-1312415546.cos.ap-shanghai.myqcloud.com/workbench-login-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: left top;
  position: relative;

  .left-container {
    // width: 33.3333%;
    height: 100%;
    flex-shrink: 0;
    // background-image: url(https://i.mtres.cn/e947c10e037eab4bae742fe9ac99da08.jpg);
    background-size: auto 100%;
    background-position: left top;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .bottom-text {
      width: 182px;
      position: absolute;
      bottom: 20px;
      left: 50%;
      text-align: center;
      transform: translateX(-50%);
    }
  }

  .right-container {
    // width: 66.6666%;
    height: 100%;
    flex-grow: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.title {
  width: 100%;
  //text-align: center;
  font-size: 32px;
  // font-weight: 600;
  padding: 0;
  margin: 0 0 0 80px;
  margin-bottom: 20px;
  color: white;
}

.desc {
  text-align: center;
  font-size: 14px;
  color: #a3a7bd;
  margin-bottom: 24px;
}

.login-qrcode {
  text-align: center;

  &-desc {
    color: var(--el-color-info);
    font-size: 14px;
    padding-top: 20px;
  }

  &-loadError {
    color: #646882;
    line-height: 175px;
    padding-top: 0 !important;
    color: #999999;
    cursor: pointer;
    text-decoration: underline;
    background: #f4f4f4;
    font-size: 12px;
    padding-top: 20px;
  }

  &-placeholder {
    color: #646882;
    line-height: 175px;
    padding-top: 0 !important;
    color: #999999;
    cursor: pointer;
    text-decoration: underline;
    background: #f4f4f4;
    font-size: 12px;
    padding-top: 20px;
  }
}

.others-login {
  text-align: center;
}

.top-logo {
  position: absolute;
  left: 3vw;
  top: 30px;
  width: 139px;
}

.login-form {
  width: 480px;
  position: absolute;
  right: 8vw;

  .wx-code {
    flex-direction: column;

    .wxCode-box {
      margin-top: 44px;
      margin-bottom: 38px;
      position: relative;

      .scan-running {
        width: 130px;
        height: 130px;
        position: absolute;
        top: 18px;
        left: 18px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba($color: #000, $alpha: .7);
        border-radius: 14px;
      }
    }

    .des-text {
      font-size: 16px;
      color: #FFFFFF;
    }

    .change-text {
      margin-top: 40px;
      color: #3468FE;
      margin-bottom: 30px;

    }
  }

  .h-text {
    &:hover {
      cursor: pointer;
      color: #3468FE !important;
    }
  ;
  }

  .demo-tabs {
    width: 320px;
    margin: 0 auto;
  }

  .input-smsCode {
    display: flex;
    width: 100%;
    align-content: center;

    .el-input {
      flex: auto;
    }

    .el-button {
      flex: none;
      margin-left: 20px;
    }
  }

  .input-inviteUser {
    display: flex;
    width: 100%;
    align-content: center;

    .el-input {
      flex: auto;
    }

    .el-button {
      flex: none;
      margin-left: 20px;
    }
  }

  &:deep(.el-tabs__header) {
    display: flex;
    justify-content: flex-start;
    margin: 0 0 30px;

    .el-tabs__nav-wrap {
      &::after {
        background: none;
      }

      .el-tabs__active-bar {
        background-color: #3468fe;
      }

      .el-tabs__item {
        color: rgba($color: #ffffff, $alpha: 0.5);
      }

      .el-tabs__item.is-active {
        color: rgba($color: #ffffff, $alpha: 1);
      }
    }
  }

  &:deep(.el-input) {
    // height: 60px !important;
    --el-input-border-color: #3C3C3E;

    .el-input__inner {
      // height: 60px;
      background-color: rgba(255, 255, 255, 0.1);
      // border-radius: 12px;
    }
  }

  .custom-button {
    background: linear-gradient(39deg, #0459ff 0%, #5726dd 100%);
    // border-radius: 100px;
    border: none;
    height: 46px;
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}


.introducer {
  color: #FFFFFF;
  font-size: 48px;
  position: absolute;
  left: 15vw;
  line-height: 67px;
  height: 270px;

  .welcome-text {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 42px;
    margin-top: 24px;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  color: #87888a;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  margin-left: 12px;
  border-radius: 8px;
  width: 90%;
}

.login-party {
  display: flex;
  align-items: center;
  justify-content: center;

  .login-party-item {
    flex: none;
    //width: 60px;
    //height: 60px;
    background: rgba(54, 54, 54, 0.17);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    //暂时
    //opacity: 0.4;
    //cursor: not-allowed;

  }
}

.flexC {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-input {
  --el-input-focus-border: #3468FE !important;
  --el-input-focus-border-color: #3468FE !important;
}

.el-form-item--default {
  margin-bottom: 20px !important;
}

:deep(.el-dialog) {
  border-radius: 16px;
  top: 50%;
  transform: translateY(-60%);
}

:deep(.el-dialog__header) {
  display: none;
}

:deep(.el-dialog__body) {
  background-image: url("@/assets/login/invite-bg.png");
  background-size: cover;
  height: 394px;
}


.invite-box {
  position: relative;
  height: 100%;

  .invite-title {
    font-size: 18px;
    font-weight: 500;
    color: #1C1D24;
    line-height: 25px;
  }

  .invite-text {
    font-size: 12px;
    font-weight: 400;
    color: #4E5262;
    line-height: 17px;
    margin-top: 10px;

  }

  .code-box {
    position: absolute;
    bottom: 12px;
    left: 69px;

    img {
      width: 98px;
      height: 98px;
    }
  }


  .lcokllb {

  }

}


</style>

