<template>
    <div class="user-info-head" @click="editCropper('File')">
        <!--    <img :src="getters.avatar" title="点击上传头像" class="img-circle img-lg"/>-->
        <el-avatar :size="120" style="background-color: black" :src="getters.avatar" class="img-circle img-lg" />
        <input type="file" ref="uploadFile" multiple :webkitdirectory="false" hidden @change="handleUploadFile" accept=".jpeg,.png,.jpg,.gif" />
    </div>

    <word-dialog class="approve" :title="title" v-model:show="open" width="600px" @confirm="uploadImg" @onOpen="modalOpened">
        <div class="approve-card">
            <el-row>
                <el-col :xs="24" :md="14" :style="{height: '300px'}">
                    <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop" :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight"
                        :fixedBox="options.fixedBox" @realTime="realTime" v-if="visible" />
                </el-col>
                <el-col :xs="24" :md="10" :style="{height: '310px'}">
                    <div class="flex">
                        <div style="text-align: center;">头像预览</div>
                        <div class="avatar-upload-preview">
                            <img :src="options.previews.url" :style="options.previews.img" />
                        </div>
                    </div>

                </el-col>
            </el-row>
            <div>支持jpg、png、gif格式的图片，大小不超过3M</div>
            <el-upload v-model:file-list="fileList" class="avatar-uploader" :show-file-list="false" action="#" accept=".jpeg,.png,.jpg" :http-request="requestUpload" :on-change="uploadAvatar">
                <div class="reUp">重新上传</div>

            </el-upload>

        </div>
    </word-dialog>

    <word-dialog class="approve" title="修改头像" v-model:show="userAvatarShow" @confirm="uploadImgGif">
        <div class="approve-card">
            <div class="flexC">
                <div class="Atitle">头像预览</div>
                <el-upload v-model:file-list="fileList" class="avatar-uploader" :show-file-list="false" action="#" accept=".jpeg,.png,.jpg,.gif" :auto-upload="false" :on-change="uploadAvatar">
                    <el-avatar :size="100" :src="options.img" />
                </el-upload>
            </div>
        </div>
    </word-dialog>

</template>

<script setup>
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import WordDialog from '../WordDialog'
// import { uploadAvatar } from "@/api/system/user";
import { ref } from "vue";
import { changeUserInfo, monoFile } from "../../../../api/user";
import { computed } from "vue";
import { ElMessage } from "element-plus";

const store = useStore();
const { proxy } = getCurrentInstance();

const open = ref(false);
const visible = ref(false);
const title = ref("修改头像");

//图片裁剪数据
const options = reactive({
    img: store.state.user.avatar, // 裁剪图片的地址
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 200, // 默认生成截图框宽度
    autoCropHeight: 200, // 默认生成截图框高度
    fixedBox: true, // 固定截图框大小 不允许改变
    previews: {} //预览数据
});
const uploadFile = ref()
const userAvatarShow = ref(false)

/** 编辑头像 */
function editCropper() {
    uploadFile.value.click()
};

const fileAvatar = ref()
const handleUploadFile = async (e) => {
    fileAvatar.value = e.target.files[0];
    let blob = await fileToBase64(fileAvatar.value);
    const accept = ['image/jpg', 'image/jpeg', 'image/png'];
    const fileType = fileAvatar.value.type.toLowerCase();
    const fileSize = fileAvatar.value.size;
    options.img = blob;
    if (fileType && fileType === "image/gif") {
        if (fileSize <= 3 * 1024 * 1024) {
            userAvatarShow.value = true
        } else {
            ElMessage.warning('文件大小超过3M，请重新上传')
        }
    } else if (fileType && accept.indexOf(fileType) > -1) {
        if (fileSize <= 3 * 1024 * 1024) {
            open.value = true;
        } else {
            ElMessage.warning('文件大小超过3M，请重新上传')
        }
    } else {
        ElMessage.warning('文件格式不正确，请重新上传')
    }

}


/** 打开弹出层结束时的回调 */
function modalOpened() {
    visible.value = true;
};

/** 覆盖默认上传行为 */
function requestUpload() {
};

//上传头像
const fileList = ref([])
const avatar = ref(store.state.user.avatar)
const uploadAvatar = async (e) => {
    fileAvatar.value = e.raw;
    let blob = await fileToBase64(fileAvatar.value)
    options.img = blob;
}

//
function fileToBase64(file) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = function (evt) {
            let base64 = evt.target.result;
            resolve(base64)
        };
        reader.readAsDataURL(file);
    })
}

const getters = computed(() => store.getters);

/** 上传GIF */
function uploadImgGif() {
    let formData = new FormData();
    formData.append("file", fileAvatar.value);
    monoFile(formData).then(res => {
        submit(res.data.url)
    })
};

/** 上传图片 */
function uploadImg() {
    proxy.$refs.cropper.getCropBlob(data => {
        let formData = new FormData();
        formData.append("file", data);
        monoFile(formData).then(res => {
            submit(res.data.url)
        })
    });
};


const emit = defineEmits(["getMember"]);

//提交修改头像
function submit(url) {
    const query = {
        avatar: url
    }
    changeUserInfo(query).then(res => {
        ElMessage({
            message: '修改成功',
            type: 'success',
        })
        emit("getMember");
        open.value = false;
        userAvatarShow.value = false
    })
}

/** 实时预览 */
function realTime(data) {
    options.previews = data;
};

/** 关闭窗口 */
function closeDialog() {
    options.img = getters.value.avatar;
    options.visible = false;
};

</script>

<style lang='scss' scoped>
.user-info-head {
    position: relative;
    display: inline-block;
    height: 120px;
}

.avatar-upload-preview {
    transform: scale(0.5);
    top: -15px;
    width: 200px;
    height: 200px;
}

.user-info-head:hover:after {
    display: flex;
    justify-content: center;
    align-items: center;
    content: "修改头像";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 110px;
    border-radius: 50%;
}

:deep(.vue-cropper) {
    border-radius: 20px;
}

:deep(.cropper-modal) {
    border-radius: 20px;
}

:deep(.cropper-view-box) {
    border-radius: 150px;
}

:deep(.cropper-face) {
    border-radius: 100px;
}

.flex {
    display: flex;
    justify-content: center;
}

.flexC {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
}

.approve-card {
    font-size: 16px;
    font-weight: 400;
    color: #656565;
    line-height: 24px;
    .reUp {
        color: rgb(52, 104, 254);
        position: absolute;
        left: 24px;
        bottom: 28px;
    }
}

.Atitle {
    margin-top: 0px;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 14px;
}
</style>
