<template>
    <div>
        <word-dialog class="approve" title="设置支付密码" v-model:show="payShow" @updata:show="handleChange" @confirm="changePayWord" width="370px" @onOpen="openDialog">
            <div class="approve-card">
                <div class="text">新的支付密码</div>

                <div class="pay-password-input" :class="{'active-forcus': focusType == 1}" @click="handleClickInput(1)">
                    <div class="password-item" :class="{ active: password.length >= index }" v-for="index in 6" :key="index"></div>
                    <div style="height:0px; width:0px; overflow:hidden;position: absolute;">
                        <input type="text" style="height: 0; width: 0;padding:0; border:none;" ref="passwordInputRef1" @focus="focusType = 1" @blur="focusType = 0"
                            @input="handleInputValue($event,1)" />
                    </div>
                </div>

                <div class="text">再次输入</div>
                <div class="pay-password-input" :class="{'active-forcus': focusType == 2}" @click="handleClickInput(2)">
                    <div class="password-item" :class="{ active: password2.length >= index }" v-for="index in 6" :key="index"></div>
                    <div style="height:0px; width:0px; overflow:hidden;position: absolute;">
                        <input type="text" style="height: 0; width: 0; padding:0; border:none;" ref="passwordInputRef2" @focus="focusType = 2" @blur="focusType = 0"
                            @input="handleInputValue($event,2)" />
                    </div>
                </div>
                <div>
                </div>
                <div class="text">手机号</div>
                <div>
                    <el-input v-model="phone" :disabled="disabledPhone" placeholder="请输入您的手机号" />
                </div>
                <div class="text">手机验证码</div>
                <div class="flex" style="margin-top: 8px">
                    <el-input v-model="code" placeholder="请输入验证码" />
                    <div class="btm" @click="getPayCode">
                        <div v-if=" countDown === 0">发送验证码</div>
                        <div v-else>{{ countDown }} 秒</div>
                    </div>
                </div>
            </div>
        </word-dialog>
    </div>
</template>
<script>
import { useStore } from 'vuex';
import WordDialog from './WordDialog'
import { computed, defineComponent, ref } from 'vue'
import { changePayPsw, getPayPhoneCode } from "@/api/user";
import { ElInput, ElMessage } from "element-plus";

const components = {
    WordDialog,
    ElInput
}
const props = {
    onSubmitSuccess: {
        type: Function,
        default: null
    },
    disabledPhone: {
        type: Boolean,
        default: false,
    },
    removeNode: {
        type: Function,
        default: null
    }
}
const setup = (prop) => {
    const store = useStore();
    const payShow = ref(false);
    const passwordInputRef1 = ref();
    const passwordInputRef2 = ref();
    const userInfo = computed(() => store.state.user);
    const code = ref('');
    const phone = ref('');
    const password = ref('');
    const focusType = ref(0);
    const password2 = ref('');
    const openDialog = () => {
        phone.value = store.state.user.idCard ? store.state.user.idCard?.phone : store.state.user.name
        code.value = ''
        password.value = ''
        password2.value = ''
    }
    /**
     * 获取支付密码验证码
     */
    const countDown = ref(0)
    const getPayCode = () => {
        if (countDown.value === 0) {
            getPayPhoneCode({ phone: phone.value }).then(res => {
                countDown.value = 60;
                const inter = setInterval(() => {
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

    // 点击支付密码
    const handleClickInput = (type) => {
        focusType.value = type;
        if (type == 1) {
            passwordInputRef1.value.focus();
        } else {
            passwordInputRef2.value.focus();
        }
    }

    // input输入密码
    const handleInputValue = (e, type) => {
        const value = e.data;
        const inputType = e.inputType;
        const reg = /^[0-9]{1}/
        let pas;
        if (type == 1) {
            pas = password.value;
        } else {
            pas = password2.value;
        }
        if (reg.test(value) && pas.length < 6) {
            pas += value;
        } else if (inputType == 'deleteContentBackward' && pas) {
            pas = pas.slice(0, (pas.length - 1));
        }
        if (!e.target.value) {
            pas = '';
        }
        if (type == 1) {
            password.value = pas;
        } else {
            password2.value = pas;
        }

    }

    //修改支付密码
    const changePayWord = () => {
        if (password.value !== password2.value) {
            ElMessage.error('两次输入的密码不一致,请重新输入')
            return
        }
        if (!password.value) {
            ElMessage.error('请输入新的支付密码')
            return
        }
        if (!code.value) {
            ElMessage.error('请输入验证码')
            return
        }
        const query = {
            payPassword: password.value,
            phone: phone.value,
            code: code.value
        }
        changePayPsw(query).then(res => {
            ElMessage({
                message: '设置成功',
                type: 'success',
            })
            store.commit('SET_PASSWORD_STATUS', 1)
            prop.onSubmitSuccess && prop.onSubmitSuccess();
            payShow.value = false;
        })
    }
    const handleChange = (e) => {
        if (!e) {
            prop.removeNode && prop.removeNode();
        }
    }
    const open = () => {
        payShow.value = true;
    }
    return {
        open,
        code,
        phone,
        payShow,
        password,
        password2,
        countDown,
        focusType,
        openDialog,
        getPayCode,
        handleChange,
        changePayWord,
        handleClickInput,
        handleInputValue,
        passwordInputRef1,
        passwordInputRef2,
    }
}
export default defineComponent({
    setup,
    props,
    components,
})
</script>
<style scoped lang="scss">
.approve-card {
    font-size: 14px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
    //padding: 0px 24px 0px 24px;

    .text {
        margin-top: 20px;
        margin-bottom: 8px;
    }

    .btm {
        width: 140px;
        height: 46px;
        border-radius: 10px;
        border: 1px solid #dadce1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 15px;
        cursor: pointer;
    }

    .el-input {
        :deep(.el-input__inner) {
            height: 46px;
            background: #ffffff;
            border-radius: 10px;
        }
    }
}

.pay-password-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .password-item {
        flex: none;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid #dadce1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &.active {
            &::after {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                background: #999;
                border-radius: 10px;
            }
        }
    }

    &.active-forcus {
        .password-item {
            border-color: #3468fe;

            &.active {
                &::after {
                    background: black;
                }
            }
        }
    }
}

.flex {
    display: flex;
    align-items: center;
}
</style>
