<template>
  <div class="login-dialog">
    <el-dialog
      v-model="visible"
      width="400px"
      :destroy-on-close="true"
      :before-close="handleClose"
      :show-close="false"
    >
      <template #title>
        <div class="my-header">
          <span>欢迎登录影音同画协作平台</span>
          <el-icon class="el-icon--left" @click="handleClose"><CircleCloseFilled /></el-icon>
        </div>
        <div class="title2" v-if="loginType === 'phoneCode'">
          使用未注册手机登录时会自动创建新账号
        </div>
        <div class="title2" v-else>
          没有账号？<span
            style="cursor: pointer; color: #638dfa"
            @click="loginType = 'phoneCode'"
            >立即注册</span
          >
        </div>
      </template>
      <div class="dialog-content">
        <div class="login-tab">
          <span
            :class="{ active: loginType === 'phoneCode' }"
            @click="handleTypeChange('phoneCode')"
            >验证码登录</span
          >
          <span
            :class="{ active: loginType === 'userPassword' }"
            @click="handleTypeChange('userPassword')"
            >密码登录</span
          >
        </div>
        <div>
          <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
            <div v-if="loginType === 'phoneCode'">
              <el-form-item prop="phone">
                <el-input
                  size="large"
                  maxlength="11"
                  v-model="loginForm.phone"
                  placeholder="请输入手机号"
                />
              </el-form-item>
              <el-form-item prop="smsCode">
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                  "
                >
                  <el-input style="width: 66%" size="large" placeholder="请输入短信验证码" v-model="loginForm.smsCode" />
                  <el-button
                    type="primary"
                    style="width: 30%; height: 40px"
                    :disabled="Boolean(countDown)"
                    color="#3468FE"
                    @click="handleSendCode"
                  >
                    <span v-if="!countDown">发送验证码</span>
                    <span v-else-if="countDown == -1">正在发送...</span>
                    <span v-else>{{ countDown }}s后获取</span>
                  </el-button>
                </div>
              </el-form-item>
            </div>

            <div v-if="loginType === 'userPassword'">
              <el-form-item prop="username">
                <el-input
                  size="large"
                  v-model="loginForm.username"
                  placeholder="请输入账号"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  size="large"
                  type="password"
                  v-model="loginForm.password"
                  :show-password="true"
                  placeholder="请输入密码"
                />
              </el-form-item>
              <el-form-item prop="code" class="code-box" v-if="captchaOnOff">
                <el-input
                  v-model="loginForm.code"
                  size="large"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  style="width: 66%"
                  @keyup.enter="onSubmit"
                >
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button
                size="large"
                type="primary"
                :loading="loading"
                @click.prevent="onSubmit"
                style="background: linear-gradient(39deg, #0459ff 0%, #5726dd 100%);"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="third-login">
          <div class="third1">
            <i class="left_line"></i>
            第三方登录
            <i class="right_line"></i>
          </div>
          <div class="third2">微信</div>
        </div>
        <div class="login-agreement">
          注册即代表您同意影音同画的 <a href="#">用户协议</a> 和
          <a href="#">隐私协议</a>
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
} from '@/api/login';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  inviteNumber: {
    type: Number,
    default: null
  }
});

const codeUrl = ref("");
const loading = ref(false);
const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance()
const loginType = ref('phoneCode')
const loginForm = reactive({
    phone: '',
    username: "",
    password: "",
    code: "",
    smsCode: "",
    uuid: ""
})

const validatePhone = (rule, value, callback) => {
  let reg = /^1[3-9]\d{9}/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的手机号'));
  }
};
const loginRules = {
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
  smsCode: [{ required: true, trigger: 'blur', message: '请输入短信验证码' }],
};
// 验证码开关
const captchaOnOff = ref(true);
const countDown = ref(0);

const emit = defineEmits(['loginClose', 'loginSuccess']);
const handleClose = () => {
  emit('loginClose', false);
};

const handleTypeChange = (type) => {
  loginType.value = type
  if(type == 'userPassword'){
    getCode()
  }
};

const loginRef = ref('')
// 发送短信验证码
async function handleSendCode() {
  if (countDown.value == -1) {
    return;
  }
  await proxy.$refs.loginRef.validateField('phone');
  countDown.value = -1;
  sendSmsVerificationCode({
    phone: loginForm.phone,
  })
    .then((res) => {
      countDown.value = 60;
      const inter = setInterval(() => {
        countDown.value -= 1;
        if (countDown.value <= 0) {
          clearInterval(inter);
        }
      }, 1000);
    })
    .catch((err) => {
      countDown.value = 0;
    });
}

// 获取图形验证码
function getCode() {
  getCodeImg().then((res) => {
    captchaOnOff.value = res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (captchaOnOff.value) {
      codeUrl.value = 'data:image/gif;base64,' + res.img;
      loginForm.uuid = res.uuid;
    }
  });
}

// 登录按钮
async function onSubmit() {
  try {
    // 校验登录账号
    switch (loginType.value) {
      case 'phoneCode': //手机验证码登录
        await proxy.$refs.loginRef.validateField('phone');
        await proxy.$refs.loginRef.validateField('smsCode');
        loginForm.inviteUser = props.inviteNumber;
        break;
      case 'userPassword': //账号密码登录
        await proxy.$refs.loginRef.validateField('username');
        await proxy.$refs.loginRef.validateField('password');
        await proxy.$refs.loginRef.validateField('code');
        break;
    }
  } catch (err) {
    return;
  }
  loading.value = true;
  loginForm.loginType = loginType.value;
  // 调用action的登录方法
  store
    .dispatch('Login', loginForm)
    .then((res) => {
      store
        .dispatch('GetInfo', loginForm)
        .then((res) => {
          loading.value = false;
          emit('loginSuccess')
        })
    })
    .catch(() => {
      loading.value = false;
      // 重新获取验证码
      if (captchaOnOff.value) {
        getCode();
      }
    });
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
