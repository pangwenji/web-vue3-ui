<template>
    <el-scrollbar style="height: 100%;" view-class="admin_apply-view" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <template v-if="formStatus === -1 || formStatus === 2">
            <div class="card-box">
                <el-form label-position="top" ref="FormDataRef" :model="formData">
                    <el-form-item label="选择工种类别" prop="categoryId" :rules="[{required: true, message:'请选择分类标签', trigger:'change'}]">
                        <el-select v-model="formData.categoryId" style="width:200px; flex:none; " @change="handleCategoryChange" placeholder="请选择分类标签">
                            <template v-for="(item,index) in categoryList" :key="index">
                                <el-option :value="item.id" :label="item.title"></el-option>
                            </template>
                        </el-select>
                        <el-input placeholder="请填写工种" @change="handleSaveUpdate" style="width:200px; flex:none" show-word-limit :maxlength="4" v-if="formData.categoryId == 23"
                            v-model="formData.customizeTitle"></el-input>
                        <span v-if="formData.categoryId == 23" style="font-size:16px; color:  #4E5262; margin-left: 30px;">填写工种后，平台将根据实际情况进行工种收录</span>
                    </el-form-item>
                    <el-form-item label="分类标签（多选" prop="tagItems" v-if="tagList.length > 0" :rules="[{required: true, type: 'array', message:'请选择分类标签', trigger:'change'}]">
                        <template v-for="(item,index) in tagList" :key="index">
                            <el-select style="width:200px; flex:none" @change="handleCategoryTagChange($event,index)" :placeholder="'请选择' + item.title" collapse-tags collapse-tags-tooltip multiple
                                v-model="item.value">
                                <template v-for="(option,code) in item.items" :key="code">
                                    <el-option :value="option.id" :label="option.title"></el-option>
                                </template>
                            </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item label="之前是否有过接单经验" prop="ifOtherPlatformTookOrder" :rules="[{required:true,type:'number',message:'请选择是否有在其他平台接单过',trigger:'change'}]">
                        <el-select v-model="formData.ifOtherPlatformTookOrder" style="width:200px; flex:none; " @change="handleSaveUpdate" placeholder="请选择是否在其他平台接过单">
                            <el-option :value="1" label="是"></el-option>
                            <el-option :value="0" label="否"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请说明" prop="introduce" @change="handleSaveUpdate" :rules="[{required: true, message:'请填写您的相关简历信息（如参与过的项目、个人基本介绍等），方便更快审核。', trigger:'blur'}]">
                        <el-input type="textarea" :rows="6" v-model="formData.introduce" show-word-limit :maxlength="400" resize="none" placeholder="请填写您的相关简历信息（如参与过的项目、个人基本介绍等），方便更快审核。"></el-input>
                    </el-form-item>
                    <div class="upload-attachment-title">
                        <div class="upload-attachment-btn" @click.stop="handleUploadClick">
                            <svg-icon className="title-icon" iconClass="icon_enclosure" :size="24"></svg-icon>
                            <span>添加附件</span>
                        </div>
                        <input ref="UploadFileRef" type="file" :accept="accept" @change="handleUploadFiles" hidden multiple />
                        添加附件简历：支持上传文档/图片格式，上传单个文件不能超过200MB。
                    </div>
                    <template v-for="(item,index) in uploadFileList" :key="index">
                        <div class="upload-attachment-item">
                            <div class="upload-attachment-icon">
                                <FileType :size="34" :type="item.FileType"></FileType>
                            </div>
                            <div class="upload-attachment-name">
                                {{item.FileName}}
                            </div>
                            <div class="upload-attachment-uploading" v-if="item.state !== 'success'">
                                <span v-if="item.state == 'awaiting'">等待上传</span>
                                <span v-if="item.state == 'checking'">读取文件</span>
                                <span v-if="item.state == 'uploading'">正在上传( {{item.percent}} %)</span>
                                <span v-if="item.state == 'error'">上传失败</span>
                            </div>
                            <div class="upload-attachment-btn delete" @click.stop="handleDeleteUpload(item,index)">删除</div>
                        </div>
                    </template>
                </el-form>
            </div>
            <template v-if="formData.id && formData.categoryId">
                <div class="fansi-title">上传作品集 <span>请至少上传4个以上作品（建议挑选最满意的几份上传），优质的作品有助于快速通过审核</span></div>
                <CompositionFile @onUploadFile="handleToUpload" @change="handleSaveUpdate" :authId="formData.id" v-model:sourIdItems="formData.sourIdItems"></CompositionFile>
            </template>
            <div class="fansi-title" style="margin-top: 10px;">上传粉丝数据 <span>请正确绑定个人常用站地址2个以上，并确保绑定的网站内有相关个人作品集</span></div>
            <BindPlatform ref="BindPlatformRef" @change="handleUpdateFand" :fanData="fandsData"></BindPlatform>
            <div style="text-align:center;">
                <el-button type="primary" style="width: 250px; margin: 20px 0;" :loading="loadingSubmit" @click="handleSubmit" size="large" color="#3468FE" round>提交</el-button>
                <div style="font-size: 14px; display:flex; align-items:center; justify-content:center;">
                    <el-checkbox v-model="checkAgreement" size="large" @change="switchFlag">
                        <span style="color: white;">我已阅读，理解并同意</span>
                    </el-checkbox>
                    <span @click.stop="showReader('1584821829750591490')" style="color: #3468FE; cursor: pointer; user-select: none;"> 《创作者灵活用工服务协议》 </span>
                    <span style="user-select: none;"> 及</span>
                    <span @click.stop="showReader('1592838854750081025')" style="color: #3468FE; cursor: pointer; user-select: none;"> 《创作者行为规范协议》 </span>
                </div>
            </div>
        </template>
        <template v-else-if="formStatus === 1">
            <div class="card-box">
                <el-result icon="success" title="审核通过" sub-title="您已经是一位创作者啦!">
                    <template #extra>
                        <el-button type="primary" @click="handleToDetail">完成</el-button>
                    </template>
                </el-result>
            </div>
        </template>
        <template v-else-if="formStatus === 0">
            <div class="card-box worker_auth-bg">
                <div class="title">认证申请已提交，预计三个工作日内完成审核</div>
                <div class="desc">
                    <span>审核结果将通过站内</span>
                    <span class="icon_xiangqing"></span>
                    <span>和客服</span>
                    <span style="margin: 0 4px">
                        <svg-icon :size="32" iconClass="icon_weixin"></svg-icon>
                    </span>
                    <span>发送</span>
                </div>
                <div> 请务必添加客服微信<span style="color:white;">（备注手机号）</span>，避免通知信息不及时 </div>
                <div style="margin-bottom: 20px"> 审核成功后，将为您提升存储空间</div>
                <div style="margin-bottom: 40px;">
                    <el-image style="width: 120px;height: 120px;" :src="ServiceQrcode"></el-image>
                </div>
                <div>
                    <el-button type="primary" @click="handleToDetail" style="width:250px" round size="large" color="#3468FE">知道了</el-button>
                </div>
            </div>
        </template>
    </el-scrollbar>
    <!-- 强制阅读 -->
    <ProtocolPopup ref="protocolRef" :articleId="articleId" @readCallback="readCallback" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="40vw">
    </ProtocolPopup>
</template>
<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch, watchPostEffect } from "vue";
import { getAvailableCategoryList, getTagList, updateFanData } from '@/api/personnel/recruitmentWall'
import { userAuth, getFanData } from '@/api/personnel/personnelConsole'
import { createUploadSign, createUploadFile } from '@/api/personnel/file';
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import UploadFile from '@/utils/uploadFile.js'
import CompositionFile from '../components/CompositionFile'
import ServiceQrcode from '@/assets/images/service_qrcode.png'
import ProtocolPopup from '@/components/ProtocolPopup'
import BindPlatform from "../components/BindPlatform";
import FileType from "@/components/FileType";
import { useRoute, useRouter } from "vue-router";
import { trigger } from "@vue/reactivity";
const store = useStore();
const route = useRoute();
const router = useRouter();
const articleId = ref('1584821829750591490');
const formStatus = ref(null);
const BindPlatformRef = ref();
const UploadFileRef = ref();
const workNum = computed(() => store.state.user.workNum);
const FormDataRef = ref();
const accept = ref('.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.pdfs,.jpeg,.png,.jpg')
onMounted(() => {
    init();
})
const init = async () => {
    const id = route.query.id;
    loadingState.value = true;
    if (id) {
        store.dispatch('workspace/getUserAuthInfo', id).then(async res => {
            const resultData = res.data;
            if (res.data) {
                formStatus.value = resultData.status;
                formData.id = resultData.id || null;
                formData.introduce = resultData.introduce;
                fandsData.value = resultData.fanData;
                formData.categoryId = resultData.categoryId;
                formData.ifOtherPlatformTookOrder = resultData.ifOtherPlatformTookOrder;
                formData.sourIdItems = resultData.sourIdItems || [];
                const uploadData = resultData.sourceAppendFileItems.map((item) => {
                    return {
                        state: 'success',
                        FileType: item.fileCat,
                        FileName: item.filename,
                        encryptedId: item.encryptIdFileId,
                    }
                })
                formData.uploadFileList = [].concat(uploadData);
                uploadFileList.value = uploadData;
                formData.tagItems = resultData.tagItems.map(item => item.id);
            } else {
                formStatus.value = -1;
            }
            if (formStatus.value === -1 || formStatus.value === 2) {
                // 标识判断 - 无需阅读协议
                if (!route.query.noRead) {
                    protocolRef.value.isShow = true;
                }
                nextTick(() => {
                    Promise.all([getData(), getFand(), getTagListData(formData.categoryId, formData.tagItems)]).then(res => {
                        loadingState.value = false;
                    }).catch(err => {
                        loadingState.value = false;
                    })
                })
            } else {
                loadingState.value = false;
            }
        }).catch(err => {
            loadingState.value = false;
        })
    } else {
        store.dispatch('workspace/getUserAuthDraft').then(resultData => {
            formData.id = resultData.id;
            formData.tagItems = resultData.tagItems || [];
            formData.introduce = resultData.introduce || null;
            formData.categoryId = resultData.categoryId || null;
            formData.sourIdItems = resultData.sourIdItems || [];
            formData.uploadFileList = resultData.uploadFileList || [];
            formData.customizeTitle = resultData.customizeTitle || null;
            formData.ifOtherPlatformTookOrder = resultData.ifOtherPlatformTookOrder >= 0 ? resultData.ifOtherPlatformTookOrder : null;
            uploadFileList.value = resultData.uploadFileList || [];
            checkAgreement.value = resultData.checkAgreement
            loadingState.value = true;
            formStatus.value = -1;
            if (!resultData.checkAgreement) {
                protocolRef.value.isShow = true;
            }
            nextTick(() => {
                Promise.all([getData(), getFand(), getTagListData(formData.categoryId, formData.tagItems)]).then(res => {
                    loadingState.value = false;
                }).catch(err => {
                    loadingState.value = false;
                })
            })
        }).catch(err => {
            loadingState.value = false;
        })

    }
}

const checkAgreement = ref(false);
// 表单信息
const formData = reactive({
    id: null,
    categoryId: null,
    introduce: null,
    customizeTitle: null,
    ifOtherPlatformTookOrder: null,
    tagItems: [],
    uploadFileList: [],
    appendixFiles: [],
    sourIdItems: [],
});

const tagList = ref([]);
const fandsData = ref('');
const categoryList = ref([]);
const loadingState = ref(false);
const uploadFileList = ref([]);

// 去上传
const handleToUpload = (type) => {
    console.log(type)
    router.push({
        path: `/workspace/admin/composition/${formData.id}`, query: {
            type,
        }
    })
}

// 获取选择数据
const getData = async () => {
    loadingState.value = true;
    await getAvailableCategoryList().then(res => {
        // 过滤已认证和当前编辑的工种
        categoryList.value = res.data.filter(item => {
            if (item.ifView || (item.id == formData.categoryId)) {
                return item
            }
        })
        loadingState.value = false;
    }).catch(err => {
        loadingState.value = false;
    })
}
/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const GetUploadSignFun = (obj, callback, errorback) => {
    const params = {
        filename: obj.FileName,
        size: obj.FileSize,
        md5: obj.FileMD5,
    }
    createUploadSign(params).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

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
        verifyContent: resultData.video?.verify_content || '',
        sourceContext: options.sourceContext,
    }
    createUploadFile(params).then(res => {
        callback(res.data)
    }).catch(err => {
        errorback(err)
    })
}

// 点击上传文件
const handleUploadClick = () => {
    UploadFileRef.value.click();
}

// 获取上传文件
const handleUploadFiles = (e) => {
    const files = e.target.files;
    if (uploadFileList.value.length + files.length > 10) {
        UploadFileRef.value.value = '';
        ElMessage.warning('添加附件不能超过十个');
        return
    }
    for (const File of files) {
        if (File.size > 200 * 1024 * 1024) {
            ElMessage.warning('单个附件不能超过200MB');
            return
        }
        const names = File.name.split('.');
        const fileType = names.pop();
        if (!fileType || accept.value.indexOf(fileType) == -1) {
            ElMessage.warning('上传文件格式不正确');
            return
        }
        const uploadData = new UploadFile({ File, getUploadSign: GetUploadSignFun, createUploadFile: CreateUploadFileFun });
        uploadData.on('success', handleUploadSuccess)
        uploadFileList.value.push(uploadData);
    }
    handleStartUpload();
    UploadFileRef.value.value = '';
}

// 上传成功的回调
const handleUploadSuccess = () => {
    handleUploadChnage();
    handleStartUpload();
}

// 上传文件改变时
const handleUploadChnage = () => {
    const data = [];
    uploadFileList.value.forEach((item) => {
        if (item.state == 'success') {
            data.push({
                state: item.state,
                FileType: item.FileType,
                FileName: item.FileName,
                encryptedId: item.encryptedId,
            })
        }
    })
    formData.uploadFileList = data;
    handleSaveUpdate();
}

// 开始上传
const handleStartUpload = () => {
    let isUploading = -1; // 是否有正在上传的文件
    let isAwaiting = -1;  // 是否有等待上传的文件
    for (const key in uploadFileList.value) {
        const item = uploadFileList.value[key]
        if (item.state == 'uploading' || item.state == 'checking') {
            isUploading = key;
            break;
        } else if (item.state == 'awaiting') {
            isAwaiting = key;
            break
        }
    }
    if (isUploading >= 0) {
        return
    }
    if (isAwaiting >= 0) {
        uploadFileList.value[isAwaiting].uploadFile();
        return
    }
}

const handleDeleteUpload = (item, index) => {
    uploadFileList.value[index].handleCancel && uploadFileList.value[index].handleCancel();
    uploadFileList.value.splice(index, 1);
    handleUploadChnage();
    handleStartUpload();
}


// 保存修改
const handleSaveUpdate = () => {
    store.dispatch('workspace/setUserAuthDraft', { ...formData, checkAgreement: checkAgreement.value });
}

// 更新粉丝数据
const handleUpdateFand = (e) => {
    const fanData = JSON.stringify(e)
    updateFanData({ fanData }).then(res => {
        // ElMessage.success('更新粉丝数据成功')
    })
}

const handleToDetail = () => {
    if (workNum.value == 0) {
        router.push({ path: '/workspace/admin/attestation' })
    } else if (workNum.value > 0) {
        router.push({ path: '/workspace/admin/skill' })
    }
}

const getFand = async () => {
    await getFanData().then(res => {
        fandsData.value = res.data.fanData || '[]';
    })
}


// 跟你目录或者tag下拉框数据
const getTagListData = async (cid, tagItems) => {
    tagList.value = [];
    loadingState.value = true;
    await getTagList(cid).then(res => {
        loadingState.value = false;
        if (tagItems) {
            tagList.value = res.data.map((item) => {
                item.value = []
                for (const data of item.items) {
                    if (formData.tagItems.indexOf(data.id) > -1) {
                        item.value.push(data.id);
                    }
                }
                return item;
            });
        } else {
            tagList.value = res.data;
        }
    }).catch(err => {
        loadingState.value = false;
    });
}
// 工种改变时
const handleCategoryChange = (e) => {
    getTagListData(e);
    formData.tagItems = [];
    tagList.value = [];
    handleSaveUpdate();
}
// 工种标签改变时
const handleCategoryTagChange = (e, index) => {
    formData.tagItems = tagList.value.reduce(((sum, item) => {
        return sum.concat(item.value)
    }), [])
    handleSaveUpdate();
}

// 提交数据
const loadingSubmit = ref(false)
const handleSubmit = () => {
    if (!formData.categoryId) {
        ElMessage.warning('请选择你要认证的工种类别')
        return
    }
    if (!checkAgreement.value) {
        ElMessage.warning('请阅读并同意《用工服务协议》');
        return
    }

    FormDataRef.value.validate().then(res => {
        const platformData = BindPlatformRef.value.platformData;
        let count = 0;
        for (const item of platformData) {
            if (item.number >= 0) {
                count += 1;
            }
        }

        if (count < 2) {
            ElMessage.warning('请正确授权绑定个人常用站地址2个以上');
            return
        }

        const data = {
            id: formData.id,
            categoryId: formData.categoryId,
            tagIdItems: null,
            sourceIdItems: [],
            introduce: formData.introduce,
            fanData: JSON.stringify(BindPlatformRef.value.platformData),
            customizeTitle: formData.customizeTitle,
            ifOtherPlatformTookOrder: formData.ifOtherPlatformTookOrder
        }
        data.tagIdItems = tagList.value.reduce((total, item) => {
            if (item.value && item.value.length > 0) {
                total.push(...item.value)
            }
            return total;
        }, [])
        data.sourceIdItems = formData.sourIdItems.map((item) => {
            return {
                fileAnnexId: item.id,
                featured: 1
            }
        })
        data.appendixFileIds = formData.uploadFileList.map((item) => {
            return item.encryptedId;
        }).join(',');
        loadingSubmit.value = true;
        userAuth(data).then(res => {
            loadingSubmit.value = false;
            formStatus.value = res.data.status
            ElMessage.success(res.msg);
        }).catch(err => {
            loadingSubmit.value = false;
        })
    }).catch(err => {
        if(typeof err == 'object'){
            for(const key in err){
                ElMessage.warning(err[key][0].message);
                break;
            }
        }
    })
}

// 展示强制阅读
const protocolRef = ref()
const showReader = (id) => {
    articleId.value = id;
    nextTick(() => {
        protocolRef.value.isShow = true
    })
}

// 强制阅读完毕
const readCallback = () => {
    checkAgreement.value = true
}
const switchFlag = (e) => {
    e && showReader('1584821829750591490')
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>