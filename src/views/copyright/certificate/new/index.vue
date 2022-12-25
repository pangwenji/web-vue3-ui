<template>
  <el-container class="new-cer-box">
    <el-scrollbar ref="scroll" style="width: 100%; height: 100%">
      <div class="header">
        <span style="color: #9094a6">版权存证</span>
        <el-icon :size="10" class="icon-righ"><ArrowRight /></el-icon>
        <span>新建存证</span>
      </div>

      <div class="content-box">
        <div class="left">
          <el-form ref="formRef" :model="formData" :rules="rules">
            <div class="box-sty works-info">
              <p class="p1">作品信息</p>
              <p class="p2">
                一个作品内可添加多个存证文件，方便管理作品。每个存证文件都会颁发专属的存证证书。
              </p>
              <el-divider />
              <div class="name-classify">
                <el-form-item label="作品名称" prop="worksName">
                  <el-input
                    maxlength="64"
                    class="search-input"
                    v-model="formData.worksName"
                    placeholder="作品名称将会展示在存证证书上"
                  />
                </el-form-item>

                <el-form-item style="width:50%" label="作品分类" prop="worksCategory">
                  <el-select
                    v-model="formData.worksCategory"
                    class="select-box"
                    placeholder="请选择作品分类"
                    @change="handleSelectChange($event, 'worksCategoryName')"
                  >
                    <el-option
                      v-for="item in worksCategoryList"
                      :key="item.code"
                      :label="item.description"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <p class="p3">作品简介</p>
              <el-input
                class="intro-textarea"
                v-model="formData.intro"
                :rows="6"
                maxlength="300"
                type="textarea"
                placeholder="作品简介展示在平台内，方便您管理文件"
              />
            </div>

            <div class="box-sty file-box">
              <p class="p1">存证文件</p>
              <p class="p4">
                严禁上传他人著作权作品、以及违法、反动危害社会公共安全等不良信息，否则可能会被国家机构直接追责。
              </p>
              <p class="p5">
                文件名称限制64字符内，大小5GB以内，支持各种图片、视频、文本、音频、压缩包等文件类型上传，暂不支持php、jsp、asp、aspx、exe、msi、bat等文件类型
                <router-link to="/help/guide?id=1598973234284761089" target="_blank">
                  <span class="to-help">更多问题<el-icon><DArrowRight /></el-icon></span>
                </router-link>

              </p>
              <el-divider />
              <div class="file">
                <div class="file-btn">
                  <el-button
                    color="#3468FE"
                    type="primary"
                    style="width: 76px; height: 24px; font-size: 12px"
                    round
                    @click.stop="handleFiles('File')"
                    >上传文件</el-button
                  >
                  <el-link v-show="(uploadList.length > 0)" style="margin-left:13px" :underline="false" @click="clearFiles" type="danger">删除所有</el-link>
                </div>
                <div v-if="uploadList.length > 0" class="upload-list">
                  <div class="upload-item" v-for="(item, index) in uploadList" :key="index">
                    <div class="item-left">
                      <span v-if="item.state === 'error'" class="name">上传失败</span>
                      <span v-else class="name">{{item.FileName}}</span>
                    </div>
                    <div class="item-rigth">
                      <el-icon v-if="item.state === 'error'" @click="uploadRefresh(index)"><RefreshRight /></el-icon>
                      <el-icon @click="uploadRemove(index)"><Delete /></el-icon>
                      <!-- <svg-icon
                        className="delete-icon"
                        iconClass="icon_delete2"
                        :color="iconColor"
                        :size="20"
                      ></svg-icon> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="box-sty certificate-info">
              <p class="p1">存证信息</p>
              <el-divider />
              <div class="info-box">
                <el-form-item style="width:50%" label="存证主体类型" prop="certType">
                  <el-select
                    v-model="formData.certType"
                    class="select-box"
                    placeholder="请选择存证主体类型"
                    @change="handleSelectChange($event, 'certTypeName')"
                  >
                    <el-option
                      v-for="item in certTypeList"
                      :key="item.code"
                      :label="item.description"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item style="width:50%" label="公证处"  prop="orgId">
                  <el-select
                    v-model="formData.orgId"
                    class="select-box"
                    placeholder="请选择公证处"
                    @change="handleSelectChange($event, 'orgName')"
                  >
                    <el-option
                      v-for="item in orgIdList"
                      :key="item.code"
                      :label="item.description"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item style="width:50%" label="著作权人" prop="copyrightOwner">
                  <div class="owner-box" :class="!formData.certType ? 'owner-empty' : ''">{{formData.certType ? (idCard[0].name+ ' ' +idCard[0].idcard) : '请先选择存证主体类型' }}</div>
<!--                  <el-select-->
<!--                    v-model="formData.copyrightOwner"-->
<!--                    class="select-box"-->
<!--                    placeholder="请选择著作权人"-->
<!--                  >-->
<!--                    <el-option-->
<!--                      v-for="item in idCard"-->
<!--                      :key="item?.name"-->
<!--                      :label="item?.name"-->
<!--                      :value="item?.name"-->
<!--                    />-->
<!--                  </el-select>-->
                </el-form-item>
              </div>
              <p class="p6">
                <el-tooltip
                  effect="light"
                  placement="top"
                >
                  <template #content>
                    <div>
                      存证主体：指当前操作存证的自然人或法人。
                    </div>
                    <div style="padding:6px 0">
                      著作权人：指享有作品著作权的主体。
                    </div>
                    <div style="width:250px">
                      一般情况下存证主体即为著作权人，不过著作权人也可以委托第三方机构代为办理存证，此时存证主体为第三方代理机构。
                    </div>
                  </template>
                  <svg-icon iconClass="question" size="12px" style="margin-right:3px"></svg-icon>
                </el-tooltip>
                存证主体与著作权人分别是什么意思
              </p>
            </div>

            <div class="f-box">
              <div class="box-sty settlement-info">
                <div class="sett-left">
                  <p>存证免费额度 {{ isFree ? 1 : 0 }} 次</p>
                  <div class="checkbox-box">
                    <el-checkbox v-model="isAgree">
                    </el-checkbox>
                    我已阅读并同意
                    <router-link to="/help/guide?id=1598973543774064641" target="_blank">
                      <span class="tk-link">《版权保护服务协议》</span>
                    </router-link>

                  </div>
                </div>
                <div class="sett-right">
                  <div class="price-box">
                    费用&nbsp
                    <span class="price"> {{ totalPrice }}</span>
                    <i class="tq-icon"></i>
                    <el-divider direction="vertical" />
                    <el-tooltip class="box-item" effect="light" placement="top">
                      <template #content>
                        <div style="display:flex;justify-content:space-between;">
                          <span style="margin-right:30px">存证文件</span>
                          <span>{{uploadList.length}}份</span>
                        </div>
                        <div style="margin-top:8px;display:flex;justify-content:space-between;font-size:14px">
                          <span style="margin-right:30px">存证收费</span>
                          <div style="display:flex;"><span style="font-size:16px">{{price}}</span><i class="tq-icon" style="margin-top:3px;"></i>/个</div>
                        </div>
                      </template>
                      <svg-icon
                      @click.stop=""
                        iconClass="worker_leftside-121"
                        :size="16"
                        style="cursor:pointer"
                      ></svg-icon>
                    </el-tooltip>
                  </div>
                  <el-button
                    style="width: 94px; border-radius: 23px"
                    color="#3468FE"
                    type="primary"
                    @click="submitForm(formRef)"
                    >提交</el-button
                  >
                </div>
              </div>
            </div>
          </el-form>
        </div>

        <div class="right">
          <div class="help-top">
            <span style="color: #c2c7ce" >帮助中心</span>
            <router-link to="/help/guide?id=1598973234284761089" target="_blank">
              <span class="more">
                查看更多
                <el-icon :size="12" style="margin-left: 4px"><ArrowRight /></el-icon>
              </span>
            </router-link>
          </div>
          <el-divider />
          <div class="q-box">
            <p class="question">Q1：什么是版权存证？</p>
            <p class="answer">
              快速确权登记工具。基于区块链特性，实现“发布即确权”，1分钟搞定传统7-30天的工作。后续若作品被侵权，公证处证书及证据包可以作为维权的权利基础和证据。
            </p>
          </div>
          <div class="q-box">
            <p class="question">Q2：存证证明的主体能否修改？</p>
            <p class="answer">
              您登录账号的实名认证主体为存证证明主体，一旦存证证明生成，主体无法修改，建议您存证之前核对好存证主体。
            </p>
          </div>
          <div class="q-box">
            <p class="question">Q3：可以存证什么作品内容？</p>
            <p class="answer">
              符合存证格式要求可正常上传的内容都可申请权益存证。
            </p>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref="uploadFile"
        multiple
        :webkitdirectory="false"
        hidden
        @change="handleUploadFile"
      />
    </el-scrollbar>
  </el-container>

  <!--  确认订单对话框-->
  <orderConfirmDialog
    :orderInfo="orderInfo"
    ref="orderDialog"
    @onPayConfirm="handlePayConfirm"
  ></orderConfirmDialog>
</template>
<script setup>
import { copyrightOrder, copyrightOrderPay, copyrightDraft } from '@/api/copyright/index.js'
import { createUploadSign, createUploadFile } from '@/api/upload.js'
import { reactive } from '@vue/reactivity'
import UploadFile from '@/utils/uploadFile'
import { ElMessage, ElLoading } from 'element-plus'
import { onMounted, watch } from '@vue/runtime-core'
import orderConfirmDialog from '@/plugins/orderConfirmDialog/index.vue'

const router = useRouter();
const { proxy } = getCurrentInstance();
const iconColor = ref('#676C7F')
const store = useStore()
const isAgree = ref(false)
const worksCategory = ref('')
const worksCategoryList = [
  {
    code: 'MODEL',
    description: '模型作品'
  },
  {
    code: 'ARCHITECTURE',
    description: '建筑作品'
  },
  {
    code: 'SOFTWARE',
    description: '计算机软件'
  },
  {
    code: 'OTHER',
    description: '其他作品'
  },
  {
    code: 'QUYI',
    description: '曲艺作品'
  },
  {
    code: 'DRAMA',
    description: '戏剧作品'
  },
  {
    code: 'DANCE',
    description: '舞蹈作品'
  },
  {
    code: 'GRAPH',
    description: '图形作品'
  },
  {
    code: 'PAINT',
    description: '美术作品'
  },
  {
    code: 'MUSIC',
    description: '音乐作品'
  },
  {
    code: 'DICTATION',
    description: '口述作品'
  },
  {
    code: 'PHOTO',
    description: '摄影作品'
  },
  {
    code: 'TEXT',
    description: '文字作品'
  },
  {
    code: 'MOVIE',
    description: '影视作品'
  }
]
const certTypeList = [
  {
    code: 'IDENTITY_CARD',
    description: '个人',
  },
  // {
  //   code: 'BUSINESS_LICENSE',
  //   description: '企业',
  // },
  // {
  //   code: 'THIRD_PART_PLATFORM_ACCOUNT',
  //   description: '三方平台账号',
  // }
]
const orgIdList = [
  {
    code: 'LUJIANG',
    description: '鹭江公证处',
  },
  {
    code: 'YUNSHANG',
    description: '云尚公证处',
  },
  {
    code: 'NANYUE',
    description: '南粤公证处',
  },
  {
    code: 'DAYU',
    description: '大豫公证处',
  },
  {
    code: 'ZHONGDA',
    description: '中大公证处',
  },
  {
    code: 'CHANGAN',
    description: '长安公证处',
  },
  {
    code: 'LONGHUA',
    description: '龙华公证处',
  }
]
const formRef = ref()
const formData = reactive({
  certType: '',
  certTypeName: '',
  intro: '',
  orgId: '',
  orgName: '',
  sourceIds: [],
  worksCategory: '',
  worksCategoryName: '',
  worksName: '',
  copyrightOwner: ''
})
const rules = reactive({
  worksName: [
    { required: true, message: '请输入作品名称', trigger: 'blur' },
    { min: 1, max: 30, message: '作品名称长度不能超出30字符', trigger: 'blur' },
  ],
  worksCategory: [
  { required: true, message: '请选择作品分类', trigger: 'change' },
  ],
  certType: [
    { required: true, message: '请选择存证主体类型', trigger: 'change' },
  ],
  orgId: [
    { required: true, message: '请选择公证处', trigger: 'change' },
  ],
  copyrightOwner: [
    // { required: true, message: '请设置著作权人', trigger: 'change' },
  ],
})

const idCard = computed(() => {
  return store.state.user.idCard ? [store.state.user.idCard] : []
})

const totalPrice = computed(() => {
  if (isFree.value) {
    return 0;
  }
  return price.value * uploadList.value.length || 0
})

// 上传列表
const storeUploadList = computed(() => {
  const list = store.state.upload.listData
  return list;
})

watch(storeUploadList, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    let newList = []
    uploadList.value.forEach(el => {
      if (el.state === 'success') {
        newList.push(el)
      } else {
        const has = newVal.findIndex(it => it.sourceContext === el.sourceContext)
        if (has !== -1) {
          newList.push(el)
        }
      }
    })
    uploadList.value = newList
  }
})

const uploadFile = ref()
const uploadList = ref([])
/* 上传文件 */
const handleFiles = (e) => {
  switch (e) {
    case 'File':
      uploadFile.value.click();
      break;
  }
};
// 上传文件
const handleUploadFile = (e) => {
  const files = e.target.files;
  const nArr = files[0].name.split('.')
  const suffix = nArr[nArr.length - 1] //后缀
  if (['php', 'jsp', 'asp', 'aspx', 'exe', 'msi', 'bat'].includes(suffix.toLowerCase())) {
    ElMessage.error(`不支持 ${suffix} 类型文件`)
    return;
  }
  if (files[0].size > 5368709120) {
    ElMessage.error('文件不能大于5GB')
    return;
  }

  for (var File of files) {
    const uploadData = new UploadFile({
      File,
      getUploadSign: getUploadSignFun,
      createUploadFile: CreateUploadFileFun,
    });
    uploadData.flag = 'copyright'
    uploadList.value.push(uploadData);
    store.commit('upload/addFileList', uploadData);
  }
  uploadFile.value.value = '';
}

/**
 * 获取签名
 * @param obj
 * @param callback
 * @param errorback
 */
const getUploadSignFun = (obj, callback, errorback) => {
  const params = {
    filename: obj.FileName.replaceAll(' ', ''),
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
}

/**
 * 上传文件
 * @param resultData
 * @param options
 * @param callback
 * @param errorback
 * @constructor
 */
const encryptedId = ref('');
const CreateUploadFileFun = ({ resultData, options }, callback, errorback) => {
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
  };
  createUploadFile(params)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      errorback(err);
    });
}

// 文件移除
function uploadRemove(index) {
  const sctext = uploadList.value[index].sourceContext
  const findex = storeUploadList.value.findIndex(el => el.sourceContext === sctext)
  if (storeUploadList.value[findex].state !== 'success') {
    storeUploadList.value[findex].handleCancel()
    store.commit('upload/delFileList', findex);
  }
  uploadList.value.splice(index, 1)
}

// 清空上传文件
function clearFiles() {
  uploadList.value.forEach(el => {
    if (el.state !== 'success') {
      const findex = storeUploadList.value.findIndex(it => it.sourceContext === el.sourceContext)
      storeUploadList.value[findex].handleCancel()
      store.commit('upload/delFileList', findex);
    }
  })
  uploadList.value = []
}

function uploadRefresh(index) {
  console.log('index--', uploadList.value[index]);
  uploadList.value[index].state = 'uploading'
  uploadList.value[index].handlePause()
  uploadList.value[index].handlePlay()
}

const orderDialog = ref()
const orderInfo = ref({})
function submitForm(formEl) {
  if (!formEl) return
  if (uploadList.value.length === 0) {
    ElMessage.error('请上传存证文件')
    return
  }
  if (!isAgree.value) {
    ElMessage.error('请先阅读并同意《版权保护服务协议》')
    return
  }
  formEl.validate((valid, fields) => {
    if (valid) {
      const sids = []
      uploadList.value.forEach(el => {
        if ((el.state === 'success')) {
          sids.push(el.encryptedId)
        }else if ((el.state === 'uploading')){
          ElMessage.error('目前还有正在上传的文件，请等待上传完成后再操作')
        }
      });
      formData.sourceIds = sids
      formData.orderId = draftData.value?.orderId || ''
      formData.copyrightId = draftData.value?.copyrightId || ''
      const loading = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)',
        })
      copyrightOrder(formData).then(res => {
        const data = res.data
        data.transactionNo = res.data.orderNo
        data.amount = res.data.price
        data.orderName = '版权存证费用'
        orderInfo.value = data
        orderDialog.value.open()
        loading.close()
      }).catch(err => {
        loading.close()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const isFree = ref(false)
const price = ref(0) //单价
function getFree() {
  copyrightOrderPay().then(res => {
    isFree.value = res.data.pay || false
    price.value = res.data.price || 0
  })
}

// 选项更改
function handleSelectChange(e, type) {
  let fdata = null
  if (type === 'worksCategoryName') {
    fdata = worksCategoryList.find(el => el.code === e)
  } else if (type === 'certTypeName') {
    fdata = certTypeList.find(el => el.code === e)
  } else if (type === 'orgName') {
    fdata = orgIdList.find(el => el.code === e)
    formData.copyrightOwner = idCard.value[0].name
  }
  if (!fdata) {
    formData[type] = ''
  } else {
    formData[type] = fdata.description
  }
}

// 确认支付
function handlePayConfirm(order) {
  proxy.$pay.openPay({
    orderNo: order.transactionNo,
    confirm:(e)=>{
      return new Promise((resolve,reject)=>{
        ElMessage.success('支付成功');
        router.push('/copyright/certificate/index')
        resolve(res);
      })
    },
    error:(err)=>{
      if(typeof err == 'object'){
        if(err.code == 1010){
          proxy.$pay.openRecharge()
        }
      }
    }
  })
}

const draftData = ref(null)
function getDraft() {
  copyrightDraft().then(res => {
    draftData.value = res.data || null
    if (draftData.value) {
      formData.certType = res.data?.certType
      formData.certTypeName = res.data?.certTypeName
      formData.intro = res.data?.intro
      formData.orgId = res.data?.orgId
      formData.orgName = res.data?.orgName
      formData.worksCategory = res.data?.worksCategory
      formData.worksCategoryName = res.data?.worksCategoryName
      formData.worksName = res.data?.worksName
      formData.copyrightOwner = res.data?.copyrightOwner
    }
  })
}

onMounted(() => {
  getFree()
  getDraft()
  if (!idCard.value || idCard.value.length === 0) {
    proxy.$Authentication.openAuth()
  }
})
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
<style>
.tq-icon {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    background-image: url("@/assets/icons/icon_money.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
</style>
