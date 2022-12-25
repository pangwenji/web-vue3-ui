<template>
    <div class="custom_card-box" style="margin-bottom: 20px">
        <div class="admin_release-title">
            <div style="margin-right: 20px">
                <svg-icon className="title-icon" iconClass="icon_work-library" :size="24"></svg-icon>
                发布招募
            </div>
            <div class="admin_release-desc">
                需求发布后，平台工作人员将在1个工作日内进行审核
            </div>
        </div>
        <el-form :model="formData" ref="FormDataRef">
            <el-form-item prop="title" :rules="[{required: true, message: '请填写标题', trigger: 'blur'}]">
                <div class="admin_release-title2">
                    <div class="title-point" style="background: red"></div>
                    标题
                </div>
                <el-input class="custom-input" @input="handleSaveFormData" v-model="formData.title" :maxlength="30" show-word-limit placeholder="如：有声书录制招募"></el-input>
            </el-form-item>
            <el-form-item prop="content" :rules="[{required: true, message: '请填写需求描述', trigger: 'blur'}]">
                <div class="admin_release-title2" style="width: 100%;">
                    <div class="title-point" style="background: red"></div>
                    <div>需求描述</div>
                    <div class="reference-example">
                        <el-popover :width="600" popper-class="reference-example-popover" popper-style="padding: 20px;">
                            <template #reference> 参考示例 </template>
                            <template #default>
                                <div class="button-group">
                                    <div class="button-item-icon" :class="{ disabled: referenceIndex == 0 }" @click="handleReferencePre">
                                        <el-icon>
                                            <ArrowLeftBold />
                                        </el-icon>
                                    </div>
                                    <div class="button-item-icon" :class="{ disabled: referenceIndex == referenceData.length - 1 }" @click="handleReferenceNext">
                                        <el-icon>
                                            <ArrowRightBold />
                                        </el-icon>
                                    </div>
                                    <div class="button-item-text" @click="handleReferenceCopy">
                                        <el-icon class="el-icon--left">
                                            <CopyDocument />
                                        </el-icon>复制
                                    </div>
                                </div>
                                <pre class="reference-example-body">{{ referenceData[referenceIndex].desc}}</pre>
                            </template>
                        </el-popover>
                    </div>
                </div>
                <el-input type="textarea" class="custom-input" resize="none" :maxlength="500" show-word-limit @input="handleSaveFormData" v-model="formData.content" style="word-break: break-all"
                    :placeholder="`例：\n${referenceData[0].desc}`">
                </el-input>
            </el-form-item>
        </el-form>

        <div class="upload-attachment-title">
            <div class="upload-attachment-btn" @click.stop="handleUpload">
                <svg-icon className="title-icon" iconClass="icon_enclosure" :size="24"></svg-icon>
                <span>添加附件</span>
            </div>
            <input ref="UploadFileRef" type="file" @change="handleUploadFiles" multiple hidden />
            支持上传文档、图片、音频、视频等。
        </div>
        <template v-for="(item, index) in uploadFileList" :key="index">
            <div class="upload-attachment-item">
                <div class="upload-attachment-icon">
                    <FileType :size="34" :type="item.FileType"></FileType>
                </div>
                <div class="upload-attachment-name">
                    <el-input v-if="resetFileIndex == index" @input="handleSaveFormData" size="small" ref="resetFileNameRef" @blur="handleResetNameBlur(item, index)" v-model="resetFileName">
                    </el-input>
                    <span v-else>{{ item.FileName }}</span>
                </div>
                <div class="upload-attachment-uploading" v-if="item.state !== 'success'">
                    <span v-if="item.state == 'awaiting'">等待上传</span>
                    <span v-if="item.state == 'checking'">读取文件</span>
                    <span v-if="item.state == 'uploading'">正在上传( {{ item.percent }} %)</span>
                    <span v-if="item.state == 'error'">上传失败</span>
                </div>
                <div class="upload-attachment-btn" v-else-if="resetFileIndex != index" @click.stop="handleResetName(item, index)">
                    重命名
                </div>
                <div class="upload-attachment-btn delete" @click.stop="handleDeleteUpload(item, index)">
                    删除
                </div>
            </div>
        </template>
    </div>
    <div class="custom_card-box" style="margin-bottom: 20px">
        <div class="admin_release-title2 insert_work-desc" style="margin-bottom: 20px">
            <div class="title-point" style="background: red"></div>
            选择工种
            <div class="insert_work-btn" @click.stop="handleInsertWork">添加工种</div>
        </div>
        <el-form :model="categoryItems" ref="CategoryFormRef">
            <template v-for="(item, index) in categoryItems" :key="index">
                <div class="work_type-item" v-if="item.show">
                    <div class="work_type-title">
                        <div class="work_type-delete" title="删除" @click="handleDeleteWork(index)" v-if="categoryItems.length > 1">
                            <el-icon :size="12">
                                <Close />
                            </el-icon>
                        </div>
                        工种{{ index + 1 }}
                    </div>
                    <div class="work_type-form">
                        <el-form-item class="work_type-form-item" style="width: 20%" :prop="index + '.categoryId'" :rules="categoryItemsRules.categoryId">
                            <el-select class="work_type-custom-select" @change="handleSaveFormData" placeholder="请选择工种" v-model="item.categoryId">
                                <el-option :value="item.id" :label="item.title" v-for="(item, index) in categoryList" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="work_type-form-item" style="width: 20%" :prop="index + '.sex'" :rules="categoryItemsRules.sex">
                            <el-select class="work_type-custom-select" @change="handleSaveFormData" placeholder="请选择性别" v-model="item.sex">
                                <el-option :value="0" label="不限"></el-option>
                                <el-option :value="1" label="男"></el-option>
                                <el-option :value="2" label="女"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="work_type-form-item" style="width: 40%" :prop="index + '.title'">
                            <el-input class="work_type-custom-input" placeholder="请输入备注信息，如：广播剧主役" @input="handleSaveFormData" show-word-limit :maxlength="8" v-model="item.title"></el-input>
                        </el-form-item>
                        <el-form-item class="work_type-form-item" style="width: 20%" :prop="index + '.budgetPrice'" :rules="categoryItemsRules.budgetPrice">
                            <div class="input-number-box">
                                <el-input-number v-model="item.budgetPrice" class="work_type-custom-input" :min="null" :precision="0" placeholder="请输入预算" :controls="false" />
                                <div class="input_number-suffix">
                                    <span class="background_icon-money" title="1币=1元"></span>
                                </div>
                            </div>
                            <!-- <el-input class="work_type-custom-input" placeholder="请输入价格" @input="handleSaveFormData" v-model="item.budgetPrice">
                                <template #suffix>
                                    <div style="align-items:center; display:flex;">
                                        <span class="background_icon-money" title="1币=1元"></span>
                                    </div>
                                </template>
                            </el-input> -->
                        </el-form-item>
                    </div>
                </div>
            </template>
        </el-form>
    </div>
    <div class="custom_card-box">
        <div class="admin_release-title2 select-signup-date">
            <div class="title-point" style="background: red"></div>
            <span>
                报名截止日期
                <el-date-picker type="datetime" placeholder="选择日期" @change="handleSaveFormData" v-model="formData.endDate" :disabled-date="onDisabledDate" style="margin-left: 20px"
                    value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime" />
            </span>
            <el-button type="primary" round size="large" style="width: 170px" color="#3468FE" @click="handleNextStep">下一步</el-button>
        </div>
    </div>
</template>
<script>
import { ElMessage } from "element-plus";
import {
    defineComponent,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
} from "vue";
import { createUploadSign, createUploadFile } from "@/api/personnel/file";
import { recruitAInfo } from "@/api/personnel/recruitmentWall";
import UploadFile from "@/utils/uploadFile.js";
import FileType from "../components/FileType";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import useClipboard from "vue-clipboard3";
const emits = ["next", "update:loading"];
const components = {
    FileType,
};
const props = {
    loading: {
        type: Boolean,
        default: false,
    },
};
const setup = (prop, { emit }) => {
    const { toClipboard } = useClipboard();
    const referenceIndex = ref(0);
    const referenceData = [
        {
            title: "配音",
            desc:
                "1、类型：有声书录制。\n2、音色要求：沉稳青年男声（声龄22-26岁左右的感觉）。\n3、专业要求：普通话标准，吐字清晰，音频无底噪，有相关经验者从优。\n4、设备要求：设备录音，不接受手机试音。\n5、试音要求：试音文本从附件中自选段落，提交3-7分钟的音频文件。\n6、试音文件要求：采样频率为 44100Hz，码率320Kbps，深度16bit，音量大小在-3db~-6db之间，音质清晰，无明显房混、喷麦、削频、噪音等音频质量问题。",
        },
        {
            title: "视频后期",
            desc:
                "1、类型：企业宣传视频。\n2、时长：5分钟左右。\n3、专业要求：需要熟悉PR、AE。\n4、视频要求：根据参考视频的风格进行剪辑，视频衔接要流畅，使用的BGM要有版权，预算2千内。\n5、其他：可以上传往期作品作为参考，有剪辑经验的优先。",
        },
        {
            title: "设计",
            desc:
                "1、类型：壁纸。\n2、风格：日系动漫。\n3、要求：根据初音未来进行二次创作，以万圣节为题材，画面需要有较强节日氛围，万圣节元素要多，角色动作可以自由发挥。\n4、尺寸：1920*1080 px \n5、格式：JPG、PNG",
        },
        {
            title: "作词",
            desc:
                "1、性质：商用原创。\n2、独词/连词：独词。\n3、曲风：古风虐恋。\n4、主题：爱而不得，无原著，剧情想象可自由发挥。\n5、要求：已经有曲，需要根据曲风写词，词不需要太委婉，要传唱度高，不要出现生僻字。",
        },
    ];

    const route = useRoute();
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const defaultTime = new Date(2022, 1, 1, 23, 59, 59);
    const FormDataRef = ref();
    const formData = reactive({
        id: 0,
        title: "", // 名称
        content: "", // 描述
        endDate: "", // 报名截止日期
        releaseRecruitmentHall: 1, //是否发布到招募大厅
    });
    const categoryList = computed(() => store.state.workspace.categoryList);
    const resetFileName = ref("");
    const resetFileSuffix = ref("");
    const resetFileIndex = ref(-1);
    const validatorPrice = (rules, value, callback) => {
        // const reg = /^[1-9]\d*(.\d{1,2})?$|^0(.\d{1,2})?$/;
        const reg = /^[0-9]\d*$/;
        if (reg.test(value)) {
            if (value > 99999) {
                callback(new Error("金额不能超过99999"));
            } else if (value >= 50) {
                callback();
            } else {
                callback(new Error("金额不能低于50"));
            }
        } else if (value) {
            callback(new Error("必须是纯数字"));
        } else {
            callback(new Error("请填写价格"));
        }
    };
    const categoryItemsRules = {
        sex: [
            {
                required: true,
                type: "number",
                message: "请选择性别",
                trigger: ["blur", "change"],
            },
        ],
        categoryId: [
            {
                required: true,
                type: "number",
                message: "请选择工种",
                trigger: ["blur", "change"],
            },
        ],
        budgetPrice: [{ required: true, validator: validatorPrice, trigger: ["blur"] }],
    };
    const categoryItems = reactive([
        //工种列表
        {
            sex: null, // 性别
            unit: "", // 单位
            title: "", // 填写内容
            price: "", // 单价
            categoryId: "", // 工种ID
            budgetPrice: undefined, // 预算费用
            show: true,
        },
    ]);
    const uploadFileList = ref([]);
    const CategoryFormRef = ref();
    const UploadFileRef = ref();
    // 点击选择文件
    const handleUpload = () => {
        UploadFileRef.value.click();
    };

    /**
     * 获取签名
     * @param obj
     * @param callback
     * @param errorback
     */
    const getUploadSignFun = (obj, callback, errorback) => {
        const params = {
            filename: obj.FileName,
            size: obj.FileSize,
            md5: obj.FileMD5,
        };
        createUploadSign(params)
            .then((res) => {
                callback(res.data);
            })
            .catch((err) => {
                errorback(err);
            });
    };

    /**
     * 创建上传文件
     * @param resultData
     * @param options
     * @param callback
     * @param errorback
     * @constructor
     */
    const CreateUploadFileFun = ({ resultData, options }, callback, errorback) => {
        const params = {
            fileId: resultData.fileId,
            verifyContent: resultData.video?.verify_content || "",
            sourceContext: options.sourceContext,
        };
        createUploadFile(params)
            .then((res) => {
                callback(res.data);
                handleStartUpload();
            })
            .catch((err) => {
                errorback(err);
            });
    };

    // 上传文件
    const handleUploadFiles = (e) => {
        const files = e.target.files;
        if (uploadFileList.value.length + files.length > 10) {
            UploadFileRef.value.value = "";
            ElMessage.warning("添加附件不能超过十个");
            return;
        }
        for (const File of files) {
            // if (File.size > 200 * 1024 * 1024) {
            //     ElMessage.warning("单个附件不能超过200MB");
            //     return;
            // }
            const uploadData = new UploadFile({
                File,
                getUploadSign: getUploadSignFun,
                createUploadFile: CreateUploadFileFun,
            });
            // store.commit('upload/addFileList', uploadData);
            uploadData.on("success", handleStartUpload);
            uploadData.on("error", handleStartUpload);
            uploadFileList.value.push(uploadData);
        }
        handleStartUpload();
        UploadFileRef.value.value = "";
    };
    // 删除上传的文件
    const handleDeleteUpload = (item, index) => {
        uploadFileList.value[index].handleCancel &&
            uploadFileList.value[index].handleCancel();
        uploadFileList.value.splice(index, 1);
        handleStartUpload();
    };
    // 重命名文件
    const handleResetName = (item, index) => {
        // const arr = item.FileName.split('.')
        // resetFileName.value = arr.splice(0,arr.length-1).join('.');
        // resetFileSuffix.value = '.' + （arr[arr.length - 1] || '');
        resetFileName.value = item.FileName;
        resetFileIndex.value = index;
        nextTick(() => {
            proxy.$refs.resetFileNameRef[0].focus();
        });
    };
    // 失去焦点
    const handleResetNameBlur = (item, index) => {
        if (resetFileName.value.length > 50) {
            resetFileName.value = "";
            resetFileIndex.value = -1;
            return ElMessage.warning("重命名不建议超过50个字符");
        }
        uploadFileList.value[index].FileName = resetFileName.value + resetFileSuffix.value;
        resetFileName.value = "";
        resetFileIndex.value = -1;
    };
    // 开始上传
    const handleStartUpload = () => {
        let isUploading = -1; // 是否有正在上传的文件
        let isAwaiting = -1; // 是否有等待上传的文件
        for (const key in uploadFileList.value) {
            const item = uploadFileList.value[key];
            if (item.state == "uploading" || item.state == "checking") {
                isUploading = key;
                break;
            } else if (item.state == "awaiting") {
                isAwaiting = key;
                break;
            }
        }
        if (isUploading >= 0) {
            return;
        }
        if (isAwaiting >= 0) {
            uploadFileList.value[isAwaiting].uploadFile();
            return;
        }
        handleSaveFormData();
    };
    // 添加工种
    const handleInsertWork = () => {
        if (categoryItems.length == 18) {
            ElMessage.warning("最多只能添加18个工种");
            return;
        }
        categoryItems.push({
            sex: 0,
            unit: "", // 单位
            title: "", // 填写内容
            price: "", // 单价
            categoryId: "", // 工种ID
            budgetPrice: undefined, // 预算费用
            show: true,
        });
        handleSaveFormData();
    };
    // 删除工种项
    const handleDeleteWork = (i) => {
        // categoryItems[i].show = false;
        categoryItems.splice(i, 1);
        handleSaveFormData();
    };
    // 禁用日期选择范围
    const onDisabledDate = (time) => {
        // 可选当日后的至往后90天
        return (
            time.getTime() < new Date().getTime() - 1000 * 60 * 60 * 24 ||
            time.getTime() > new Date().getTime() + 1000 * 60 * 60 * 24 * 90
        );
    };

    // 保存表单
    const handleSaveFormData = () => {
        const data = {
            ...formData,
        };
        data.categoryItems = categoryItems.filter((item) => {
            return item.title || item.budgetPrice || item.categoryId;
        });
        data.sourceIdItems = [];
        uploadFileList.value.forEach((item, index) => {
            if (item.state == "success") {
                data.sourceIdItems.push({
                    title: item.FileName,
                    fileFormat: item.FileType,
                    sourceId: item.encryptedId,
                    encryptedId: item.encryptedId,
                    sort: 0,
                    state: item.state,
                });
            }
        });
        return store.dispatch("workspace/setFormData", data);
    };
    // 下一步
    const handleNextStep = () => {
        FormDataRef.value.validate().then(() => {
            try {
                if (categoryItems.length === 0) {
                    throw "至少选择一个工种";
                }
                for (const item of uploadFileList.value) {
                    if (item.state !== "success") {
                        throw "有文件未上传完成，请上传完成在进行下一步。";
                    }
                }
                if (
                    (new Date(formData.endDate).getTime() - new Date().getTime()) / 1000 / 60 / 60 <
                    23
                ) {
                    return ElMessage.warning("报名截止日期距离发布招募当日不能少于 24 小时");
                }
                CategoryFormRef.value.validate().then((vali) => {
                    if (vali) {
                        handleSaveFormData().then(() => {
                            emit("next", { step: 1 });
                        });
                    } else {
                        ElMessage.error("请完整填写招募的工种信息");
                    }
                })
                    .catch((err) => {
                        console.log(err);
                        ElMessage.error("请完整填写招募的工种信息");
                    });
            } catch (errMsg) {
                console.log(errMsg)
                ElMessage.error(errMsg);
            }
        })
    };

    // 离开页面前
    onBeforeUnmount(() => {
        handleSaveFormData;
    });

    // 获取表单数据
    const getFormData = () => {
        const id = route.query?.id;
        formData.id = id;
        emit("update:loading", true);
        store
            .dispatch("workspace/getCategoryList")
            .then(() => {
                if (id) {
                    recruitAInfo(id)
                        .then((res) => {
                            const data = res.data;
                            formData.title = data.title; // 名称
                            formData.content = data.content; // 描述
                            formData.endDate = data.endDate; // 报名截止日期
                            formData.releaseRecruitmentHall = data.releaseRecruitmentHall; //是否发布到招募大厅
                            const categoryData = data.categoryItems.map((item) => {
                                return {
                                    sex: item.sex || 0,
                                    unit: "", // 单位
                                    title: item.customizeTitle, // 填写内容
                                    price: "", // 单价
                                    categoryId: item.categoryId, // 工种ID
                                    budgetPrice: item.budgetPrice, // 预算费用
                                    show: true,
                                };
                            });
                            const shiftData = categoryData.shift();
                            categoryItems[0] = shiftData;
                            categoryItems.push(...categoryData);
                            emit("update:loading", false);
                        })
                        .catch((err) => {
                            emit("update:loading", false);
                        });
                } else {
                    store.dispatch("workspace/getFormData", id).then((result) => {
                        emit("update:loading", false);
                        if (result && !result.id) {
                            proxy.$modal
                                .confirm({
                                    title: "系统提示",
                                    content: "您有未提交的招募信息，是否继续完善信息?",
                                })
                                .then((res) => {
                                    if (onDisabledDate(new Date(result.deliveryDate))) {
                                        result.deliveryDate = "";
                                    }
                                    for (const key in formData) {
                                        formData[key] = result[key];
                                    }
                                    if (result.categoryItems.length > 0) {
                                        categoryItems.shift();
                                    }
                                    categoryItems.push(...result.categoryItems);
                                    uploadFileList.value = result.sourceIdItems.map((item) => {
                                        return {
                                            id: item.sourceId,
                                            FileName: item.title,
                                            FileType: item.fileFormat,
                                            encryptedId: item.encryptedId,
                                            state: item.state,
                                        };
                                    });
                                })
                                .catch((err) => {
                                    emit("update:loading", false);
                                    store.dispatch("workspace/delFormData");
                                });
                        }
                    });
                }
            })
            .catch((err) => {
                emit("update:loading", false);
            });
    };
    onMounted(() => {
        getFormData();
    });

    const handleReferencePre = () => {
        if (referenceIndex.value > 0) {
            referenceIndex.value--;
        }
    };
    const handleReferenceNext = () => {
        if (referenceIndex.value < referenceData.length - 1) {
            referenceIndex.value++;
        }
    };
    const handleReferenceCopy = () => {
        try {
            const item = referenceData[referenceIndex.value];
            if (item && item.desc) {
                toClipboard(item.desc);
                ElMessage.success("复制成功");
            }
        } catch (err) {
            ElMessage.warning("复制失败");
        }
    };
    // 1. 能够独立作词、作曲。
    // 2. 能够有创新性思维。
    // 3. 具有自己的创作特点。
    // 4. 对乐理有足够深的了解。
    return {
        emit,
        formData,
        FormDataRef,
        defaultTime,
        categoryList,
        referenceData,
        resetFileName,
        referenceIndex,
        resetFileIndex,
        resetFileSuffix,
        uploadFileList,
        UploadFileRef,
        categoryItems,
        CategoryFormRef,
        categoryItemsRules,
        handleReferenceCopy,
        handleUpload,
        handleNextStep,
        onDisabledDate,
        handleResetName,
        handleInsertWork,
        handleDeleteWork,
        handleUploadFiles,
        handleReferencePre,
        handleDeleteUpload,
        handleReferenceNext,
        handleResetNameBlur,
        handleSaveFormData,
    };
};
export default defineComponent({
    name: "step_1",
    setup,
    emits,
    props,
    components,
});
</script>
<style scoped lang="scss">
.admin_release-title {
    font-size: 18px;
    margin-bottom: 10px;
    padding-left: 24px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .title-icon {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    .title-point {
        width: 6px;
        height: 6px;
        border-radius: 10px;
        left: 9px;
        top: 9px;
        position: absolute;
    }
}
.admin_release-title2 {
    font-size: 16px;
    margin-bottom: 10px;
    padding-left: 24px;
    position: relative;

    .reference-example {
        position: absolute;
        right: 20px;
        top: 0;
        color: #3468fe;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        .button-group {
            display: flex;
        }
    }
    .title-point {
        width: 6px;
        height: 6px;
        border-radius: 10px;
        left: 9px;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
    }
    &.select-signup-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0px;
        &:deep(.el-input__inner) {
            height: 37px;
            line-height: 37px;
            padding: 0 12px 0 10px;
            --el-input-border-radius: 6px;
            --el-input-text-color: #ffffff;
            --el-input-border-color: #4e5262;
            --el-input-bg-color: #1e2028;
            --el-input-placeholder-color: #4e5262;
        }
        &:deep(.el-input__prefix) {
            left: auto;
            right: 12px;
        }
    }
    &.insert_work-desc {
        padding-right: 150px;
        .insert_work-btn {
            width: 150px;
            background: rgba(52, 104, 254, 0.13);
            border-radius: 30px;
            border: 1px solid #3468fe;
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
            text-align: center;
            font-size: 12px;
            color: #3468fe;
            padding: 6px 0;
            user-select: none;
            cursor: pointer;
        }
    }
}
.upload-attachment-title {
    padding: 10px 0 10px 110px;
    color: #505361;
    font-size: 12px;
    position: relative;
    margin-bottom: 10px;
    .upload-attachment-btn {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #3468fe;
        border: 1px solid #3468fe;
        background: rgba(52, 104, 254, 0.13);
        padding: 4px 10px;
        border-radius: 60px;
        user-select: none;
        cursor: pointer;
    }
}
.upload-attachment-item {
    background: #181920;
    border-radius: 8px;
    padding: 6px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    &:last-child {
        margin-bottom: 0;
    }
    .upload-attachment-icon {
        flex: none;
        border-radius: 4px;
        overflow: hidden;
        background: #202020;
    }
    .upload-attachment-name {
        flex: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #676c7f;
        font-size: 12px;
        padding: 0 10px;
    }
    .upload-attachment-uploading {
        flex: none;
        font-size: 12px;
        margin-right: 10px;
        color: #676c7f;
        user-select: none;
    }
    .upload-attachment-btn {
        font-size: 12px;
        margin-right: 10px;
        flex: none;
        user-select: none;
        cursor: pointer;
        color: #676c7f;
        &.delete {
            color: #b71d3e;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}

.admin_release-desc {
    color: #8d91a3;
    font-size: 12px;
}

.work_type-item {
    font-size: 14px;
    color: #cfd2d8;
    position: relative;
    padding-right: 20px;
    padding: 10px 0 0;
    .work_type-title {
        margin-bottom: 16px;
        position: relative;
        .work_type-delete {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            color: #b71d3e;
            padding: 2px;
            cursor: pointer;
        }
    }
    .work_type-form {
        display: flex;
        align-items: center;
        margin-left: -10px;
        margin-right: -10px;
        .work_type-form-item {
            padding: 0 10px;
            box-sizing: border-box;
        }
        .input-number-box {
            width: 100%;
            flex: none;
            position: relative;
            .input_number-suffix {
                width: 36px;
                justify-content: center;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                display: flex;
                align-items: center;
            }
        }
        .work_type-custom-input {
            width: 100%;
            flex: none;
            &:deep(.el-input__inner) {
                height: 37px;
                line-height: 37px;
                padding-right: 37px;
                text-align: left !important;
                --el-input-border-radius: 6px;
                --el-input-text-color: #ffffff;
                --el-input-border-color: #4e5262;
                --el-input-bg-color: #1e2028;
                --el-input-placeholder-color: #4e5262;
            }
            &:deep(.el-input__count-inner) {
                background-color: transparent;
                color: #4e5262;
            }
        }
        .work_type-custom-select {
            width: 100%;
            // margin: 0 10px;

            flex: none;
            &:deep(.el-input__inner) {
                height: 37px;
                line-height: 37px;
                --el-input-border-radius: 6px;
                --el-input-text-color: #ffffff;
                --el-input-bg-color: #1e2028;
                --el-input-border-color: #4e5262;
                --el-input-placeholder-color: #4e5262;
                --el-select-input-focus-border-color: #3a36db !important;
            }
            &:deep(.el-input__count-inner) {
                background-color: transparent;
                color: #4e5262;
            }
        }
    }
}
</style>
<style lang="scss">
.reference-example-popover {
    .button-group {
        display: flex;
        padding-bottom: 20px;
        justify-content: flex-end;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
        .button-item-icon {
            color: #3468fe;
            background: rgba($color: #3468fe, $alpha: 0.1);
            width: 24px;
            height: 24px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-radius: 4px;
            margin-right: 10px;
            cursor: pointer;
            user-select: none;
            &.disabled {
                cursor: no-drop;
                color: rgba($color: #3468fe, $alpha: 0.3);
            }
        }
        .button-item-text {
            cursor: pointer;
            height: 24px;
            user-select: none;
            color: #3468fe;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .reference-example-body {
        padding-top: 20px;
        margin: 0;
        color: #9094a6;
    }
}
</style>
