<template>
    <div class="bind_link-box">
        <el-dialog v-model="visibled" :fullscreen="false" :title="title + '链接绑定'" width="400px" custom-class="dialog-center" :before-close="onBeforClose" :destroy-on-close="true">
            <el-form :model="formData" ref="FormDataRef" @submit.prevent.native>
                <el-form-item prop="url" :rules="[{required: true, message: '请填写链接地址', trigger: 'blur'}]">
                    <el-input v-model="formData.url" size="large" style="width: 100%;" placeholder="请输入链接地址"></el-input>
                </el-form-item>
            </el-form>
            <div style="color: #979797; font-size: 12px;">温馨提示：请勿绑定他人账号，一经绑定无法解除，且会对您的认证通过造成影响。</div>
            <template #footer>
                <div class="footer-box">
                    <span @click="showTips">如何获取链接地址?</span>
                    <div>
                        <el-button @click="onBeforClose">取消</el-button>
                        <el-button @click="handleSubmit" :loading="loadingSubmit" type="primary" color="#3468FE">确定</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
    <ProtocolPopup ref="protocolRef"
        :articleId="textId"
        title="获取链接地址指引"
        :show-close="true"
        :destroy-on-close="true"
        :seconds="0"
        width="40vw"></ProtocolPopup>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { getUserFansByUrl } from '@/api/personnel/personnelConsole.js'
import ProtocolPopup from '@/components/ProtocolPopup'
const emits = ['submit']
const components = {
    ProtocolPopup
}
const setup = (prop, { emit }) => {
    const visibled = ref(false);
    const title = ref('');
    const FormDataRef = ref();
    const formData = reactive({
        url: '',
        platformType: null,
    })
    const onBeforClose = (deno) => {
        if (loadingSubmit.value) {
            return
        }
        FormDataRef.value.resetFields();
        formData.platformType = null;
        if (typeof deno == 'function') {
            deno();
        } else {
            visibled.value = false;
        }
    }
    const loadingSubmit = ref(false);
    const handleSubmit = () => {
        FormDataRef.value.validate().then(res => {
            loadingSubmit.value = true;
            getUserFansByUrl(formData).then(res => {
                loadingSubmit.value = false;
                res.data.url = formData.url
                emit('submit', res.data);
                onBeforClose();
            }).catch(err => {
                loadingSubmit.value = false;
            })
        })
    }

    const textId = ref('')
    const open = ({ platformType, name, articleId }) => {
        title.value = name;
        formData.platformType = platformType;
        visibled.value = true;
        textId.value = articleId
    }

    const protocolRef = ref()
    const showTips = ()=> {
        protocolRef.value.isShow = true
    }
    return {
        open,
        title,
        showTips,
        formData,
        visibled,
        textId,
        FormDataRef,
        protocolRef,
        loadingSubmit,
        ProtocolPopup,
        handleSubmit,
        onBeforClose,
    }
}
export default defineComponent({
    setup,
    emits,
    components
})
</script>
<style scoped lang="scss">
.bind_link-box {
    &:deep(.el-dialog__body) {
        padding: 20px;
        // .el-form {
        //     .el-input {
        //         .el-input__inner {
        //             --el-input-bg-color: none;
        //             --el-input-border-color: var(--el-border-color);
        //             --el-input-placeholder-color: var(--el-text-color-placeholder);
        //             --el-input-hover-border-color: #3a36db;
        //         }
        //         &.text-align-center {
        //             .el-input__inner {
        //                 text-align: center;
        //             }
        //         }
        //     }
        // }
    }
}

.footer-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
        color: #3468fe;
        font-size: 12px;
        cursor: pointer;
        text-decoration: underline;
    }
}
</style>
