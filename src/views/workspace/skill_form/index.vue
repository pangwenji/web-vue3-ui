<template>
    <el-scrollbar style="height: 100%;" view-class="admin_apply-view" v-loading="loadingState" element-loading-background="rgba(0,0,0,0)">
        <div class="skill_form-header">
            <span @click="handleToBack" style="cursor: pointer;">工种管理</span>
            <el-icon class="el-icon--right el-icon--left">
                <ArrowRight />
            </el-icon>
            <span>工种编辑</span>
        </div>
        <template v-if="formData.id">
            <!-- 表单信息 -->
            <div class="card-box" style="margin-bottom: 20px">
                <el-form label-position="top" ref="FormDataRef" :rules="formRule" :model="formData" @keypress.enter>
                    <!-- <el-form-item label="选择工种类别">
                        <el-select v-model="formData.categoryId" disabled @change="handleCategoryChange" placeholder="请选择分类标签">
                            <template v-for="(item,index) in categoryList" :key="index">
                                <el-option :value="item.id" :label="item.title"></el-option>
                            </template>
                        </el-select>
                        <el-input placeholder="请填写工种" show-word-limit :maxlength="4" disabled v-if="formData.categoryId == 23" v-model="formData.customizeTitle"></el-input>
                        <span v-if="formData.categoryId == 23" style="font-size:16px; color:  #4E5262; margin-left: 30px;">填写工种后，平台将根据实际情况进行工种收录</span>
                    </el-form-item> -->
                    <!-- <el-form-item label="分类标签（多选）" v-if="tagList.length > 0">
                        <template v-for="(item,index) in tagList" :key="index">
                            <el-select :placeholder="'请选择' + item.title" disabled multiple collapse-tags collapse-tags-tooltip v-model="item.value">
                                <template v-for="(option,code) in item.items" :key="code">
                                    <el-option :value="option.id" :label="option.title"></el-option>
                                </template>
                            </el-select>
                        </template>
                    </el-form-item> -->
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="formData.title" :maxlength="30" @change="isSubmit = false;" style="max-width:100%;" placeholder="少女音配音（自身优势、能提供的服务）" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="服务简介" prop="technicalAbilityIntroduce">
                        <el-input type="textarea" :rows="6" @change="isSubmit = false;" v-model="formData.technicalAbilityIntroduce" show-word-limit :maxlength="400" resize="none"
                            placeholder="1、有2年配音经验
2、会萝莉音、正太音，擅长少女音
3、参与过《xxx》、《xxx》作品配音
4、配音属于副业，需要沟通工作时间
5、有专业设备
（描述清楚您的技能包含哪些内容，客户为什么选择您，服务描述越具体，雇主选择您的机率就越大）"></el-input>
                    </el-form-item>
                    <el-form-item label="自定义工种标签" prop="customTagName" :rules="[{ validator: validatorCustomTag,trigger: 'blur'}]">
                        <el-input placeholder="标签名称" @keypress.enter.prevent="handleInsertTag" v-model="formData.customTagName"  :maxlength="6">
                            <template #suffix>
                                <div class="custom-tag-suffix" @click.stop="handleInsertTag">
                                    <el-icon :size="16">
                                        <Plus />
                                    </el-icon>
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <div class="custom-tag-box" v-if="customTags.length">
                        <span class="custom-tag-item" v-for="(item,index) in customTags" :key="index">
                            {{item}}
                            <el-icon @click="handleDeleteCustom(index)">
                                <Close />
                            </el-icon>
                        </span>
                    </div>

                </el-form>
            </div>

            <!-- 服务报价 -->
            <div class="card-box ">
                <div class="server_price-title">服务报价</div>
                <div class="server_price-form">
                    <el-form ref="FormPriceDataRef" :rules="formPriceRule" :model="formPriceData">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="单价" prop="quotedPrice">
                                    <!-- <span>
                                        <svg-icon iconClass="icon_help"></svg-icon>
                                    </span> -->
                                    <el-input placeholder="请输入" :maxlength="5" @change="formPriceData.quotedPrice = parseInt($event) || '1'; isSubmit = false;" v-model="formPriceData.quotedPrice">
                                        <template #suffix>
                                            <el-dropdown trigger="click" @command="handleCommandUnit">
                                                <span style="color:white; cursor: pointer;">{{formPriceData.unitName}}</span>
                                                <el-icon style="cursor: pointer;" color="white" class="el-icon--right">
                                                    <CaretBottom />
                                                </el-icon>
                                                <template #dropdown>
                                                    <el-dropdown-menu>
                                                        <template v-for="(item,index) in unitData" :key="index">
                                                            <el-dropdown-item :command="item">{{item.label}}</el-dropdown-item>
                                                        </template>
                                                    </el-dropdown-menu>
                                                </template>
                                            </el-dropdown>
                                            <span class="line"></span>
                                            <span class="background_icon-money"></span>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="起步价" prop="price">
                                    <!-- <span class="form-help">
                                        <svg-icon iconClass="icon_help"></svg-icon>
                                    </span> -->
                                    <el-input placeholder="请输入" :maxlength="5" @change="formPriceData.price = parseInt($event) || '50'; isSubmit = false;" v-model="formPriceData.price">
                                        <template #suffix>
                                            <span>起做</span>
                                            <span class="background_icon-money"></span>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="预计交付时间" prop="finishDay">
                                    <!-- <span>
                                        <svg-icon iconClass="icon_help"></svg-icon>
                                    </span> -->
                                    <el-input placeholder="请输入" :maxlength="5" @change="isSubmit = false;" v-model="formPriceData.finishDay">
                                        <template #suffix>
                                            <span>天</span>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="server_price-desc">（温馨提示：每次交易，平台将会抽取10%的服务费，用于帮助创作者代征代缴，并为甲方开具发票.）</div>
            </div>

            <!-- 作品文件 -->
            <div class="fansi-title">上传作品集 <span>请认真上传并装修作品，一份精美的作品集有助于快速成单哦</span></div>

            <CompositionFile ref="CompositionFileRef" :authId="formData.id" @onUploadFile="handleUploadFile" @clickFile="onClickFile" v-model:sourIdItems="sourIdItems" @change="isSubmit = false;"></CompositionFile>
            <!-- 粉丝数据 -->

            <div class="fansi-title">上传常用站信息 <span>粉丝数据是雇主筛选的第二维度，登记的网站类型越全，粉丝数越多，有助于快速成单哦</span></div>
            <BindPlatform :fanData="formData.fanData" @change="handleUpdateFand" ref="BindPlatformRef"></BindPlatform>

            <div style="height: 60px;"></div>
        </template>
        <template v-else-if="!loadingState">
            <div class="card-box">
                <el-result icon="error" title="未认证" sub-title="您还未进行工种认证，请先进行工种认证。">
                    <template #extra>
                        <el-button type="primary" @click="handleToApply" color="#3468FE">前往认证</el-button>
                    </template>
                </el-result>
            </div>
        </template>
    </el-scrollbar>
    <div class="bottom-affix">
        <div class="float-box">
            <el-button type="info" plain style="width: 140px; margin: 20px 10px;"  @click="handleToBack" size="large" round>退出</el-button>
            <el-button type="primary" style="width: 140px; margin: 20px 10px;" :loading="loadingSubmit == 2" @click="handleSubmit(2)" size="large" color="#3468FE" round>保存</el-button>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { getCategoryList, getTagList, workerAuthUnit, updateFanData } from '@/api/personnel/recruitmentWall'
import { editTechnicalAbility } from '@/api/personnel/personnelConsole'
import CompositionFile from '../components/CompositionFile'
import BindPlatform from '../components/BindPlatform'
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const store = useStore();
const route = useRoute();
const router = useRouter();
const FormDataRef = ref();
const applyData = computed(() => store.state.workspace.applyData);
const ScanDialogRef = ref();
const CompositionFileRef = ref();
const BindPlatformRef = ref();
const unitData = ref([]);
const sourIdItems = ref([]);
const isSubmit = ref(true);//是否提交过数据
onMounted(() => {
    init();
})
// 上传作品
const handleUploadFile = (type) => {
    if (!isSubmit.value) {
        ElMessageBox({
            title: '系统提示',
            message: h('p', '请先保存当前修改的内容再编辑作品集'),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {}).catch(err => { })
    } else {
        router.push({
            path: `/workspace/admin/composition/${formData.id}`, query: {
                type,
            }
        })
    }
}

// 点击文件,快速选中
const onClickFile = (file)=> {
    router.push({
        path: `/workspace/admin/composition/${formData.id}`, query: {
            type: file.fileCat,
            fileId: file.fileId
        }
    })
}

// 路由监听 - 提示保存
onBeforeRouteLeave((to, from, next) => {
    if (!isSubmit.value) {
        ElMessageBox({
            title: '系统提示',
            message: h('p', '当前编辑的内容尚未保存，确认离开当前页面吗？'),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {
            next()
        }).catch(err => { })
    } else {
        next()
    }
})

const init = () => {
    loadingState.value = true;
    const id = route.params.id;
    store.dispatch('workspace/getUserAuthInfo', id).then(async res => {
        if (res.data) {
            formData.id = res.data?.id || null;
            formData.introduce = res.data.introduce;
            formData.categoryId = res.data.categoryId;
            formData.fanData = res.data.fanData || '[]';
            formData.title = res.data.title;
            formData.tagItems = res.data.tagItems.map(item => item.id);
            formData.technicalAbilityIntroduce = res.data.technicalAbilityIntroduce;
            customTags.value = res.data.customizeTag? res.data.customizeTag.split(',') : [];
            formPriceData.unit = res.data.unit;
            formPriceData.price = res.data.price;
            formPriceData.unitName = res.data.unitName;
            formPriceData.finishDay = res.data.finishDay;
            formPriceData.quotedPrice = res.data.quotedPrice;
            sourIdItems.value = res.data.sourIdItems;
            Promise.all([getData(1), getTagListData(formData.categoryId, formData.tagItems, 1), getWorkerAuthUnit(1)]).then(data => {
                // store.dispatch('workspace/getSkillFormData').then(result=>{
                //     if(result && result.id == formData.id){
                //         ElMessageBox({
                //             title:'',
                //             message: h('p','您之前有未保存的表单数据，是否加载？'),
                //             showCancelButton: true,
                //             confirmButtonText: '确定',
                //             cancelButtonText: '取消',
                //         }).then(()=>{
                //             formData.title = result.title;
                //             // formData.customTagName = result.customTagName;
                //             formData.fanData = result.fanData || '[]';
                //             formData.technicalAbilityIntroduce = result.technicalAbilityIntroduce;
                //             for(const key in result.formPriceData){
                //                 formPriceData[key] = result.formPriceData[key]
                //             }
                //             customTags.value = result.customTags;
                //             sourIdItems.value = result.sourIdItems;
                //         }).catch(err=>{
                //             store.dispatch('workspace/delSkillFormData');
                //             isSubmit.value = true;
                //         })
                //     }
                // })
                loadingState.value = false;
            }).catch(err => {
                loadingState.value = false;
            })
        } else {
            loadingState.value = false;
        }
    }).catch(err => {
        loadingState.value = false;
    })
}
// 获取单位
const getWorkerAuthUnit = async () => {
    await workerAuthUnit().then(res => {
        unitData.value = res.data;
        if(formPriceData.unit || formPriceData.unitName){
            return
        }
        formPriceData.unit = res.data[0]?.value || 0
        formPriceData.unitName = res.data[0]?.label || '单位'
    })
}
// 跳转到申请认证页面
const handleToApply = () => {
    router.replace({ path: '/workspace/admin/attestation' })
}

// 添加标签
const customTags = ref([]);
const handleInsertTag = () => {
    FormDataRef.value.validateField('customTagName', (isValid) => {
        const value = formData.customTagName.trim();
        if (isValid && value) {
            customTags.value.push(value);
            formData.customTagName = '';
            isSubmit.value = false;
        } else if (!value) {
            formData.customTagName = '';
        }
    });
}
// 删除标签
const handleDeleteCustom = (index) => {
    customTags.value.splice(index, 1);
    isSubmit.value = false;
}
const validatorCustomTag = (rules, value, callback) => {
    const reg = /\s|,/
    if (reg.test(value)) {
        callback(new Error('名称不能存在空格或逗号'))
    } else if (value) {
        if (customTags.value.indexOf(value) > -1) {
            callback(new Error('标签名称不能重复'))
        } else if (customTags.value.length >= 6) {
            callback(new Error('添加标签不能超过六个'))
        } else {
            callback()
        }
    } else {
        callback()
    }
}
const validatorPrice = (rules, value, callback) => {
    // const reg = /^[1-9]\d*(.\d{1,2})?$|^0(.\d{1,2})?$/;
    const reg = /^[1-9]\d*$/;
    if (reg.test(value)) {
        const quotedPrice = formPriceData.quotedPrice * 1;
        const price = value * 1
        if(quotedPrice > price){
            callback(new Error('起步价不能低于单价'));
        }else if(price < 50){
            callback(new Error('起步价不能低于50'))
        }else{
            callback()
        }
    } else {
        callback(new Error('请填写正确的整数值，例：10'));
    }
}
const validatorQuotedPrice = (rules, value, callback) => {
    // const reg = /^[1-9]\d*(.\d{1,2})?$|^0(.\d{1,2})?$/;
    const reg = /^[1-9]\d*$/;
    if (reg.test(value)) {
        if(value < 1){
            callback(new Error('单价不能低于1'));
        }else{
            callback()
        }
    } else {
        callback(new Error('请填写正确的整数值，例：10'));
    }
}
const validatorDate = (rules, value, callback) => {
    const reg = /^[1-9]\d*$/;
    if (reg.test(value)) {
        callback()
    } else {
        callback(new Error('请填写正确的整数值，例：10'));
    }
}

const FormPriceDataRef = ref();
const formPriceRule = {
    price: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { required: true, validator: validatorPrice, trigger: 'blur' }
    ],
    finishDay: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { required: true, validator: validatorDate, trigger: 'blur' }
    ],
    quotedPrice: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { required: true, validator: validatorQuotedPrice, trigger: 'blur' }
    ],
};
const formPriceData = reactive({
    unit: '',
    price: '',
    unitName: '',
    finishDay: '',
    quotedPrice: '',
})

// const checkAgreement = ref(false);
// 表单信息
const formRule = {
    title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
    technicalAbilityIntroduce: [{ required: true, message: '服务简介不能为空', trigger: 'blur' }],
}
const formData = reactive({
    id: null,
    title: null,
    categoryId: null,
    introduce: null,
    customTagName: '',
    customizeTitle: null,
    fanData: '[]',
    technicalAbilityIntroduce: null,
    tagItems: []
});
const tagList = ref([]);
const categoryList = ref([]);
const loadingState = ref(false);
// 选择单位
const handleCommandUnit = (e) => {
    formPriceData.unit = e.value;
    formPriceData.unitName = e.label;
    isSubmit.value = false;
}
// 获取选择数据
const getData = async (e) => {
    if (!e) {
        loadingState.value = true;
    }
    await getCategoryList(1).then(res => {
        categoryList.value = res.data;
        if (!e) {
            loadingState.value = false;
        }
    }).catch(err => {
        loadingState.value = false;
    })
}


// 跟你目录或者tag下拉框数据
const getTagListData = async (cid, tagItems, e) => {
    tagList.value = [];
    loadingState.value = true;
    await getTagList(cid).then(res => {
        if (!e) {
            loadingState.value = false;
        }
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
    getTagListData(e)
}

// 返回到工种管理
const handleToBack = () => {
    if(loadingSubmit.value){
        return
    }
    router.push('/workspace/admin/skill')
}

// 更新粉丝数据
const handleUpdateFand = (e)=>{
    const  fanData = JSON.stringify(e)
    updateFanData({fanData}).then(res=>{
        // ElMessage.success('更新粉丝数据成功')
    })
}


// 提交数据
const loadingSubmit = ref(0);
const handleSubmit = (e) => {
    if (loadingSubmit.value) {
        return;
    }
    // if (!checkAgreement.value) {
    //     ElMessage.error('请阅读并同意《用工服务协议》');
    //     return
    // }
    FormDataRef.value.validateField(['title', 'technicalAbilityIntroduce']).then(() => {
        FormPriceDataRef.value.validate().then(res => {
            const data = {
                id: formData.id,
                categoryId: formData.categoryId,
                introduce: formData.introduce,
                fanData: JSON.stringify(BindPlatformRef.value.platformData),
                title: formData.title,
                technicalAbilityIntroduce: formData.technicalAbilityIntroduce,
                customizeTag: null,
                sourceIdItems: [],
                ...formPriceData
            }
            data.customizeTag = customTags.value.join(',')
            data.sourceIdItems = sourIdItems.value.map(item => {
                return {
                    fileAnnexId: item.id,
                    featured: 1
                }
            });
            loadingSubmit.value = e;
            editTechnicalAbility(data).then(res => {
                loadingSubmit.value = 0;
                store.dispatch('workspace/delSkillFormData');
                isSubmit.value = true;
                ElMessage.success('保存成功');
            }).catch(err => {
                loadingSubmit.value = 0;
            })
        })
    }).catch(err => {
        FormPriceDataRef.value.validate()
    })
}
</script>

<style scoped lang="scss">
@import "./index.scss";
.float-box {
    display:flex;
    justify-content:center;
    background: rgba(12, 12, 14, .7);
}
</style>