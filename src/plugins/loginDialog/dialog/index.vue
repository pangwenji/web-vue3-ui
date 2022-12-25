<template>
    <div class="login-dialog">
        <el-dialog v-model="visible" width="400px" :destroy-on-close="true" @closed="removeNode && removeNode()" :before-close="handleClose">
            <template #title>
                <div class="my-header">
                    <span>欢迎登录影音同画协作平台</span>
                    <!-- <el-icon class="el-icon--left" @click="handleClose">
                        <CircleCloseFilled />
                    </el-icon> -->
                </div>
                <div class="title2" v-if="loginType === 'phoneCode'">
                    使用未注册手机登录时会自动创建新账号
                </div>
                <div class="title2" v-else-if="loginType === 'userPassword'">
                    没有账号？<span style="cursor: pointer; color: #638dfa" @click="handleTypeChange('phoneCode')">立即注册</span>
                </div>
                <div class="title2" v-else-if="loginType === 'weixin' && isFristLogin">
                    首次用扫码登录，需要绑定手机号码
                </div>
            </template>
            <div class="dialog-content">
                <template v-if="loginType === 'weixin'">
                    <template v-if="!isFristLogin">
                        <div class="wx-code flexC">
                            <div class="wxCode-box flexC">
                                <img src="@/assets/login/wxCode-bg.png" style="width: 166px; height: 166px" />
                                <el-image style="width: 123px; position: absolute; height: 123px; border-radius: 10px;" :src="wxLoginQrCodeUrl" fit="fill">
                                    <template #error>
                                        <div style="width: 100%; height: 100%" v-if="!wxLoginQrCode" v-loading="true" element-loading-text="正在加载二维码"></div>
                                        <div v-else class="login-qrcode-loadError" @click="handleRefreshQrcode">
                                            二维码失效，点击刷新
                                        </div>
                                    </template>
                                    <template #placeholder>
                                        <div class="login-qrcode-placeholder flexC" style="height: 100%">
                                            <el-icon :size="24" class="is-loading">
                                                <Loading />
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
                                <span class="h-text" @click="handleTypeChange('phoneCode')">验证码登录</span>
                                <span style="margin: 5px 16px">|</span>
                                <span class="h-text" @click="handleTypeChange('userPassword')">密码登录</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="login-tab">
                            <span class="active" style="margin-left: 0px;">绑定手机号</span>
                        </div>
                        <el-form ref="FormBindRef" :model="formBind" :rules="formBindRule">
                            <div>
                                <el-form-item prop="phone">
                                    <el-input size="large" maxlength="11" v-model="formBind.phone" placeholder="请输入手机号" />
                                </el-form-item>
                                <el-form-item prop="smsCode">
                                    <div style="width: 100%; display: flex; justify-content: space-between">
                                        <el-input style="width: 66%" size="large" placeholder="请输入短信验证码" v-model="formBind.smsCode" />
                                        <el-button type="primary" style="width: 30%; height: 40px" :disabled="Boolean(countDown)" color="#3468FE" @click="handleSendCode('FormBindRef')">
                                            <span v-if="!countDown">发送验证码</span>
                                            <span v-else-if="countDown == -1">正在发送...</span>
                                            <span v-else>{{ countDown }}s后获取</span>
                                        </el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item prop="inviteUser">
                                    <div style="width: 100%; display: flex; justify-content: space-between">
                                        <el-input :style="{ width: inviteUserState ? '66%' : '100%' }" size="large" placeholder="首次注册请填写邀请码" v-model="formBind.inviteUser" />
                                        <el-button type="primary" style="width: 30%; height: 40px" color="#3468FE" @click="handleInviteCode" :style="{ display: inviteUserState ? 'block' : 'none' }">
                                            <span>获取邀请码</span>
                                        </el-button>
                                    </div>
                                </el-form-item>
                            </div>
                            <el-form-item>
                                <el-button size="large" type="primary" :loading="loadingBind" @click.prevent="handleBindPhone" style="background: linear-gradient(39deg, #0459ff 0%, #5726dd 100%)">
                                    <span v-if="!loadingBind">登录</span>
                                    <span v-else>登 录 中...</span>
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                </template>
                <template v-else>
                    <div class="login-tab">
                        <span :class="{ active: loginType === 'phoneCode' }" @click="handleTypeChange('phoneCode')">验证码登录</span>
                        <span :class="{ active: loginType === 'userPassword' }" @click="handleTypeChange('userPassword')">密码登录</span>
                    </div>
                    <div>
                        <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
                            <div v-if="loginType === 'phoneCode'">
                                <el-form-item prop="phone">
                                    <el-input size="large" maxlength="11" v-model="loginForm.phone" placeholder="请输入手机号" />
                                </el-form-item>
                                <el-form-item prop="smsCode">
                                    <div style="width: 100%; display: flex; justify-content: space-between">
                                        <el-input style="width: 66%" size="large" placeholder="请输入短信验证码" v-model="loginForm.smsCode" />
                                        <el-button type="primary" style="width: 30%; height: 40px" :disabled="Boolean(countDown)" color="#3468FE" @click="handleSendCode('loginRef')">
                                            <span v-if="!countDown">发送验证码</span>
                                            <span v-else-if="countDown == -1">正在发送...</span>
                                            <span v-else>{{ countDown }}s后获取</span>
                                        </el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item prop="inviteUser">
                                    <div style="width: 100%; display: flex; justify-content: space-between">
                                        <el-input :style="{ width: inviteUserState ? '66%' : '100%' }" size="large" placeholder="首次注册请填写邀请码" v-model="loginForm.inviteUser" />
                                        <el-button type="primary" style="width: 30%; height: 40px" color="#3468FE" @click="handleInviteCode" :style="{ display: inviteUserState ? 'block' : 'none' }">
                                            <span>获取邀请码</span>
                                        </el-button>
                                    </div>
                                </el-form-item>
                            </div>

                            <div v-if="loginType === 'userPassword'">
                                <el-form-item prop="username">
                                    <el-input size="large" v-model="loginForm.username" placeholder="请输入账号" />
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input size="large" type="password" v-model="loginForm.password" :show-password="true" placeholder="请输入密码" />
                                </el-form-item>
                                <el-form-item prop="code" class="code-box" v-if="captchaOnOff">
                                    <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="请输入验证码" style="width: 66%" @keyup.enter="onSubmit">
                                    </el-input>
                                    <div class="login-code">
                                        <img :src="codeUrl" @click="getCode" class="login-code-img" />
                                    </div>
                                </el-form-item>
                            </div>

                            <el-form-item>
                                <el-button size="large" type="primary" :loading="loading" @click.prevent="onSubmit" style="background: linear-gradient(39deg, #0459ff 0%, #5726dd 100%)">
                                    <span v-if="!loading">登 录</span>
                                    <span v-else>登 录 中...</span>
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>

                <div class="third-login" v-if="loginType !== 'weixin'">
                    <div class="third1">
                        <i class="left_line"></i>
                        第三方登录
                        <i class="right_line"></i>
                    </div>
                    <div class="third2" @click="handleTypeChange('weixin')">
                        <svg-icon :size="32" iconClass="icon_weixin"></svg-icon>
                        <div>微信</div>
                    </div>
                </div>
                <div class="login-agreement">
                    注册即代表您同意影音同画的 <a href="https://www.yingyintonghua.com/workbench/#/help/guide?id=1567451301810876418" target="_blank">用户协议</a> 和
                    <a href="https://www.yingyintonghua.com/workbench/#/help/guide?id=1565440725131800578" target="_blank">隐私协议</a>
                </div>
            </div>
        </el-dialog>
    </div>

    <div v-show="dialogInvite" class="invite-dialog">
        <el-dialog v-model="dialogInvite" custom-class="dialog-center" width="276px" ref="inviteDialog">
            <div class="invite-box">
                <div class="invite-title">Hi，探索者</div>
                <div class="invite-text">
                    首次注册需联系客服获取邀请码<br />
                    才能进行登录
                </div>
                <div class="code-box">
                    <img src="@/assets/login/invite-code.png" />
                    <div style="margin-top: 37px">扫码联系客服获取</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import {
    wxLogin,
    getCodeImg,
    getWxLoginQrCode,
    wxMpCheckRegister,
    sendSmsVerificationCode,
    getWxRoutineLoginQrCode,
    checkWxMaRegister
} from "@/api/login";
import { setToken, setExpiresIn } from '@/utils/auth'
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import SvgIcon from "@/components/SvgIcon";
import { ElMessage } from "element-plus";
const props = defineProps({
    onSuccess: {
        type: Function,
        default: null,
    },
    removeNode: {
        type: Function,
        default: null,
    },
});
const visible = ref(false);
const codeUrl = ref("");
const loading = ref(false);
const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const loginType = ref("phoneCode");
const loginForm = reactive({
    phone: "",
    username: "",
    password: "",
    code: "",
    smsCode: "",
    inviteUser: "",
    uuid: "",
});

const validatePhone = (rule, value, callback) => {
    let reg = /^1[3-9]\d{9}/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error("请输入正确的手机号"));
    }
};
const loginRules = {
    phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
    username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
    password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
    code: [{ required: true, trigger: "change", message: "请输入验证码" }],
    smsCode: [{ required: true, trigger: "blur", message: "请输入短信验证码" }],
};
// 验证码开关
const captchaOnOff = ref(true);
const countDown = ref(0);


//打开获取邀请码对话框
const dialogInvite = ref(false);
const handleInviteCode = () => {
    dialogInvite.value = true;
};
const inviteUserState = ref(true);
const route = useRoute();
onMounted(() => {
    if (route.query.invite_user) {
        loginForm.inviteUser = route.query.invite_user || "";
        inviteUserState.value = false;
    }
});

const handleTypeChange = (type) => {
    if (loginType.value == type) {
        return;
    }
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
    loginType.value = type;
    if (type == "userPassword") {
        getCode();
    } else if (type == "weixin") {
        if (!isFristLogin.value) {
            if (!clearTime) {
                // handleOthersLogin();
                getRoutineLoginQrCode()
            } else {
                // handleLoginWX();
                routineLoginPolling()
            }
        }
    }
};

// 第三方登录
const timer = ref(null);
const loadingBind = ref(false);
const isFristLogin = ref(false); //是否是第一次登录
const wxLoginQrCode = ref(true); //二维码加载状态
const wxLoginQrCodeUrl = ref(null); //二维码图片
const formBind = reactive({ //绑定手机号
    uuid: '',
    phone: '',
    smsCode: '',
    inviteUser: '',
})
const formBindRule = {
    phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
    smsCode: [{ required: true, trigger: "blur", message: "请填写短信验证码" }],
    inviteUser: [{ required: true, trigger: "blur", message: "请填写邀请码" }],
}
const FormBindRef = ref();
const resultBindData = ref(null);
// 轮询获取微信扫码后的回调信息
const handleLoginWX = () => {
    timer.value = setInterval(() => {
        getWxMpCheckRegister();
    }, 3000);
};

// 绑定手机号
function handleBindPhone() {
    FormBindRef.value.validate().then(res => {
        loadingBind.value = true;
        if(resultBindData.value){
            wxLogin(formBind).then(res => {
                resultBindData.value = res.data;
                WXloginSuccess(res.data)
                loadingBind.value = false;
            })
        }else{
            WXloginSuccess(resultBindData.value)
        }
    })
}

// 微信登录成功
function WXloginSuccess(data) {
    setToken(data.access_token)
    store.commit('SET_TOKEN', data.access_token)
    setExpiresIn(data.expires_in)
    store.commit('SET_EXPIRES_IN', data.expires_in)
    store.dispatch('GetInfo').then(res => {
        loadingBind.value = false;
        props.onSuccess && props.onSuccess();
        ElMessage.success('登录成功')
        handleClose();
    }).catch(err=>{
        loadingBind.value = false;
    })
}

// 获取微信二维码
let clearTime;
function handleOthersLogin() {
    if (!wxLoginQrCode.value) {
        return;
    }
    if (clearTime) {
        wxLoginQrCodeUrl.value = "";
        clearTimeout(clearTime);
        clearTime = null;
    }
    wxLoginQrCode.value = false;
    getWxLoginQrCode().then((res) => {
        formBind.uuid = res.data.uuid
        wxLoginQrCode.value = true;
        wxLoginQrCodeUrl.value = res.data.ticket;
        //取消自动刷新，9分钟后让二维码失效
        clearTime = setTimeout(() => {
            wxLoginQrCodeUrl.value = "";
            clearTime = null;
        }, 9 * 60 * 1000);
        if (timer.value) {
            clearInterval(timer.value);
            timer.value = null;
        }
        handleLoginWX();
    });
}

// 获取微信扫码后的回调信息
function getWxMpCheckRegister() {
    wxMpCheckRegister(formBind.uuid).then((res) => {
        if (res.data.init === "complete") {
            if (clearTime) {
                clearTimeout(clearTime);
                clearTime = null;
            }
            isFristLogin.value = res.data.register === false;
            if (!isFristLogin.value) {
                wxLoginQrCode.value = true;
                let data = res.data.accessToken;
                WXloginSuccess(data)
            }
        }
    });
}

// 获取小程序太阳码
function getRoutineLoginQrCode() {
    if (!wxLoginQrCode.value) {
        return;
    }
    if (clearTime) {
        wxLoginQrCodeUrl.value = ''
        clearTimeout(clearTime);
        clearTime = null;
    }
    wxLoginQrCode.value = false;
    getWxRoutineLoginQrCode({inviteUser: loginForm.inviteUser}).then((res) => {
        formBind.uuid = res.data.uuid
        wxLoginQrCode.value = true
        wxLoginQrCodeUrl.value = res.data.data
        //取消自动刷新，9分钟后让二维码失效
        clearTime = setTimeout(() => {
            wxLoginQrCodeUrl.value = ''
            clearTime = null;
        }, 9 * 60 * 1000);
        if (timer.value) {
            clearInterval(timer.value)
            timer.value = null
        }
        routineLoginPolling()
    });
}

// 小程序扫码登录轮询
function routineLoginPolling() {
    timer.value = setInterval(() => {
        handleCheckWxMaRegister()
    }, 2000)
}

const scanStatus = ref('')
function handleCheckWxMaRegister() {
    checkWxMaRegister(formBind.uuid).then(res => {
        scanStatus.value = res.data?.init || ''
        if ((res.data.init).toLowerCase() === 'complete') {
            const data = res.data.accessToken
            WXloginSuccess(data)
        }
    })
}


/******************************************************************/

const loginRef = ref("");
// 发送短信验证码
async function handleSendCode(name) {
    if (countDown.value == -1) {
        return;
    }
    await proxy.$refs[name].validateField("phone");
    countDown.value = -1;
    sendSmsVerificationCode({
        phone: loginForm.phone,
    }).then((res) => {
        countDown.value = 60;
        const inter = setInterval(() => {
            countDown.value -= 1;
            if (countDown.value <= 0) {
                clearInterval(inter);
            }
        }, 1000);
    }).catch((err) => {
        countDown.value = 0;
    });
}

// 获取图形验证码
function getCode() {
    getCodeImg().then((res) => {
        captchaOnOff.value = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (captchaOnOff.value) {
            codeUrl.value = "data:image/gif;base64," + res.img;
            loginForm.uuid = res.uuid;
        }
    });
}

// 登录按钮
async function onSubmit() {
    try {
        // 校验登录账号
        switch (loginType.value) {
            case "phoneCode": //手机验证码登录
                await proxy.$refs.loginRef.validateField("phone");
                await proxy.$refs.loginRef.validateField("smsCode");
                break;
            case "userPassword": //账号密码登录
                await proxy.$refs.loginRef.validateField("username");
                await proxy.$refs.loginRef.validateField("password");
                await proxy.$refs.loginRef.validateField("code");
                break;
        }
    } catch (err) {
        return;
    }
    loading.value = true;
    loginForm.loginType = loginType.value;
    // 调用action的登录方法
    store.dispatch("Login", loginForm).then((res) => {
        store.dispatch('GetInfo').then(res => {
            loading.value = false;
            ElMessage.success('登录成功')
            props.onSuccess && props.onSuccess();
            handleClose();
        }).catch(err=>{
            loading.value = false;
        })
    }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaOnOff.value) {
            getCode();
        }
    });
}

const handleClose = (deno) => {
    if (timer.value) {
        clearInterval(timer.value);
    }
    if (clearTime) {
        clearTimeout(clearTime);
    }

    if (typeof deno == 'function') {
        deno();
    } else {
        visible.value = false;
    }
};

const open = () => {
    visible.value = true;
};

defineExpose({
    open,
});
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
