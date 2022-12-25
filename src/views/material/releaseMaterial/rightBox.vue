<template>
  <div class="MainBox">
    <div class="main-box">
      <div>
        <div class="upload-btn" @click="publish" v-if="pageType === 'change'">保存修改</div>
        <div class="upload-btn" @click="publish" v-else>保存到仓库</div>
        <!--        <div class="add-mark">-->
        <!--          <div>添加水印</div>-->
        <!--          <div>-->
        <!--            <el-switch v-model="value" size="large"/>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="bottom-line"></div>
      </div>

      <div>
        <el-form
            ref="approveFormRef"
            label-position="left"
            :rules="Rules"
            :model="Datas"
            hide-required-asterisk
        >
          <div class="title">标题设置</div>
          <el-form-item label="" prop="name">
            <div class="input">
              <el-input v-model="Datas.name" @input="changeData(0)">
              </el-input>
            </div>
          </el-form-item>
          <div class="title">价格设置</div>
          <el-form-item>
            <div class="pricebox">
              <el-form-item label="" prop="price">
                <div class="input price" style="margin-left: 8px;">
                  <div class="text">价格</div>
                  <el-input v-model="Datas.price" @input="changeData(1)"/>
                  <img style="width: 10px;height: 10px" src="@/assets/user/wallet/tongqian.png"/>
                </div>
              </el-form-item>

              <el-form-item label="" prop="memberPrice">
                <div class="input price">
                  <div class="text">会员价</div>
                  <el-input v-model="Datas.memberPrice" @input="changeData(2)">
                  </el-input>
                  <img style="width: 10px;height: 10px" src="@/assets/user/wallet/tongqian.png"/>
                </div>
              </el-form-item>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="cover" :class="(data.length > 1 || data.length === 0) ? 'noCover' : ''"
           v-show="mType !== '5' || mType !== '7'  "
      >
        <div class="title">封面设置 <span style="float: right;font-size: 14px" v-show="data.length > 1 ? 'noCover' : ''">暂不支持批量修改封面</span>
        </div>
        <div class="picture">
          <el-upload v-model:file-list="fileList" ref="uploadFile" @change="handleUploadFile" action="#"
                     :disabled="data.length > 1 || data.length === 0"
                     list-type="picture-card" accept=".jpeg,.png,.jpg"
                     :multiple="false" :auto-upload="false"
                     class="upload-resource"
                     :limit=" mType === '3' || mType === '4' || mType === '6' ? 5 : 1"
                     :on-exceed="handleExceed"
                     :class="{show: (fileList?.length === 1 && (mType ==='1'|| mType ==='2')) || (fileList?.length === 5 && (mType ==='3'|| mType ==='4'|| mType ==='6')) }"
          >
            <el-icon>
              <Plus/>
            </el-icon>

            <template #file="{ file }">
              <div style="margin: auto">
                <img class="el-upload-list__item-thumbnail" :src="file.cover" alt=""/>
                <span class="el-upload-list__item-actions">
                    <span class="change" @click="reUpload(file)">
                      <el-icon><EditPen/></el-icon>
                    </span>
                    <span class="change" @click="delUpload(file)">
                      <el-icon><Delete/></el-icon>
                    </span>
                </span>
              </div>
            </template>


          </el-upload>
        </div>
        <div class="tip">支持格式jpg、jpeg、png，文件大小需小于5MB</div>
      </div>

      <div class="label-box">
        <div class="title">分类关键词设置</div>
        <div class="labelbox">
          <div class="left">
            <template v-for="item in typeTreeList.children" :key="item.id">
              <div class="type-item" :class="{activeType: item.typeName === activeType.typeName}" @click="seleceType(item)">{{item.typeName}}</div>
            </template>
          </div>
          <div class="right">
            <el-checkbox-group v-model="selectType">
              <template v-for="item in activeTypeChildren" :key="item.id">
                <el-checkbox
                  class="item-children"
                  :disabled="durationArr.includes(item.typeName)"
                  :label="item.id"
                  @click="typeClick($event, item)"
                >
                {{item.typeName}}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
        </div>
        <div class="sBox">
          <span style="min-width:16%;min-width: 60px;">自定义：</span>
          <div class="tag-input">
            <div>
              <el-input v-model="tagName" @keyup.enter="addTag" placeholder="请输入关键词"/>
            </div>
            <div class="check">
              <Check style="width: 1em; height: 1em; margin-right: 8px" @click.stop="addTag"/>
            </div>
          </div>
        </div>
        <div class="word">自定义{{ tagNum || 0 }}/6个关键词</div>
      </div>

      <div class="wordBox">
        <div class="wordTitle">
          <div class="title">预览</div>
        </div>
        <div class="wordList">
          <div class="tags">
            <el-tag
                v-for="tag in key"
                :key="tag"
                class="mx-1 tag"
                size="small"
                :closable="!durationArr.includes(tag)"
                type="info"
                @close="handleClose(tag,index)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
      <div style="padding: 10px 0px">
        <div class="detail" @click="openDetails">
          <div>详情页编辑</div>
          <el-icon class="el-icon--right">
            <ArrowRight/>
          </el-icon>
        </div>
      </div>
    </div>

  </div>


  <el-dialog title="详情页信息" v-model="openEditor" width="60%" >
    <div>
      <details-edit ref="editor" v-if="showEditor" :key="data[0]?.material?.id" :editHtml="detailsHtml"></details-edit>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" round @click="preserve">保 存</el-button>
        <el-button round @click="openEditor = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup>
import {computed, ref, watch, reactive,nextTick} from 'vue'
import {Check} from '@element-plus/icons-vue'
import {useStore} from "vuex";
import {onMounted} from "@vue/runtime-core";
import {delMaterialCover, materialRelease} from "../../../api/material";
import {ElMessage, ElMessageBox, genFileId} from "element-plus";
import UploadFile from "../../../utils/uploadFile";
import {getUploadSign, createUploadMaterial} from '@/api/material/index.js'
import detailsEdit from '../components/RequirementsEdit';
const route = useRoute()
const store = useStore();
const value = ref(true)
const showCover = ref(false)
const title = ref()
const price = ref()
const tagName = ref('')
const tagNum = ref(0)
const fileList = ref([])
const releaseList = ref([])
const coverFileId = ref([])
const Datas = ref({
  id: '',
  name: "",
  materialTypeRelations: "",
  keywords: [],
  price: 0,
  memberPrice: 0
})

const check = (rule, value, callback) => {
  if (data.value.length < 1) {
    callback(new Error('请勾选需要设置的素材'))
  } else if (data.value > 99999){
    callback(new Error('范围在0-99999以内'))
  } {
    callback()
  }
}
const Rules = reactive({
  //暂时改成50，原30
  name: [{required: true, message: '请输入标题', trigger: 'blur'},
    {min: 1, max: 50, message: '标题长度应在1~50字符范围内', trigger: 'blur'},
    {validator: check, trigger: 'blur'}
  ],
  memberPrice: [{required: true, message: '请输入会员价', trigger: 'blur'},
    {pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入整数或两位小数', trigger: 'blur'},
    {pattern: /^(\d{0,5})(\.(\d{0,2}))?$/g, message: '会员价范围在0-99999以内', trigger: 'blur'},
    {validator: check, trigger: 'blur'}
  ],
  price: [{required: true, message: '请输入价格', trigger: 'blur'},
    {pattern:  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入整数或两位小数', trigger: 'blur'},
    {pattern: /^(\d{0,5})(\.(\d{0,2}))?$/g, message: '价格范围在0-99999以内', trigger: 'blur'},
    {validator: check, trigger: 'blur'}
  ],

})

const props = defineProps({
  typeTreeList: {
    type: Object,
    default: {}
  },
  // detailsHtml: {
  //   type: String,
  //   default: ''
  // }
})
const pageType = ref('')
const mType = ref()
const activeType = ref({})
const selectType = ref([])
const selectTypeList = ref([])
const durationArr = ref(['0-10s','10-30s','30-60s','60s以上','0-30s','60-120s','120s以上'])

onMounted(() => {
  //页面类型，修改素材或者添加发布素材
  pageType.value = route.query.type
  //页面素材类型
  mType.value = route.query.page
})

onUnmounted(() => {
  store.commit("material/SET_CARD_DATA", [])
  Datas.value.name = ''
  Datas.value.memberPrice = null
  Datas.value.price = null
  tagName.value = ''
})

//音乐音效长度标签禁选
function getDisabled(id1, id2) {
  if (id1 === 1 && id2 === 9 || id1 === 2 && id2 === 14) {
    return true
  }
  return false
}

const checkList = computed(() => {
  return store.state.material.checkList
})

const key = ref([])

const activeTypeChildren = computed(() => {
  const typeChildren = props.typeTreeList.children || []
  if (activeType.value === {}) {
    activeType.value = typeChildren[0] || {}
  }
  const data = typeChildren.find(el => el.typeName === activeType.value.typeName)
  return data?.children || []
})

const data = computed(() => {
  const data = store.state.material.data || []
  if (data.length > 0) {
    const lastData = data[data.length - 1]
    key.value = Array.from(new Set(lastData.material?.keywords)) || [] //去重
    tagNum.value = lastData.material?.keywords?.length - lastData.material.materialTypeRelations?.length
  }
  if (data.length === 1) {
    fileList.value = data[0].material.coverFileAttachedInfoDtos || []
  }
  return data
})

watch(data, (newValue, oldValue) => {
  Datas.value = {
    id: '',
    name: "",
    materialTypeRelations: "",
    keywords: [],
    price: null,
    memberPrice: null
  }
  key.value = []
  fileList.value = []
  selectType.value = []
  selectTypeList.value = []

  if (newValue.length > 0 && newValue.length !== oldValue?.length) {
    const lastData = newValue[newValue.length-1] || []
    selectTypeList.value = lastData?.material.materialTypeRelations || []
    selectTypeList.value.forEach(el => {
      selectType.value.push(el.typeId)
    })

    newValue.forEach((item) => {
      item.material.keywords = lastData.material?.keywords ? [...lastData.material.keywords] : []
      item.material.materialTypeRelations = lastData.material?.materialTypeRelations ? [...lastData.material.materialTypeRelations] : []
      Datas.value = item.material
    })
  }

}, {immediate: true})

//改变发布表单
const changeReleaseList = () => {
  if (data.value.length === 0) return
  // const materialData = data.value[data.value.length - 1].material
  // fileList.value = materialData?.coverFileAttachedInfoDtos || []

  const ids = []
  selectTypeList.value.forEach(r => {
    ids.push(r.typeId)
  })

  //发布素材表单
  releaseList.value = []
  data.value.forEach(el => {
    releaseList.value.push({
      price: el.material.price,
      name: el.material.name,
      memberPrice: el.material.memberPrice,
      materialId: el.material.id,
      keywords: key.value,
      labels: ids,
      coverFileId: fileList.value[0]?.fileId || null,
      details: el.material.details || ''
    })
  })
}

//移除关键词
const handleClose = (tag, index) => {
  data.value.forEach((item) => {
    const rlist = []
    item.material.materialTypeRelations.forEach(el => {
      if (el.typeName !== tag) {
        rlist.push(el)
      }
    })
    item.material.materialTypeRelations = rlist
    item.material.keywords.splice(item.material.keywords.findIndex(res => {
      return res === tag
    }), 1)
  })

  const list = []
  const idList = []
  selectTypeList.value = selectTypeList.value.forEach(el => {
    if (el.typeName !== tag) {
      list.push(el)
      idList.push(el.typeId)
    }
  })
  selectTypeList.value = list
  selectType.value = idList
}

//添加自定义关键词
const addTag = () => {
  if (tagName.value) {
    if (tagName.value.length > 8) {
      ElMessage({message: '关键词长度需小于8字符', type: 'warning',})
      return;
    }

    if (key.value.indexOf(tagName.value) === -1) {
      data.value.find((item) => {
        //自定义关键词的数量
        if (tagNum.value >= 6) {
          ElMessage({message: '最多只能添加6个自定义关键词', type: 'warning'})
          return
        } else {
          item.material.keywords.push(tagName.value)
        }
      })
    } else {
      ElMessage({message: '请勿重复添加', type: 'warning',})
      return
    }
    tagName.value = ''
  } else {
    ElMessage({message: '请输入关键词', type: 'warning'})
    return;
  }
}

const uploadFile = ref()
//更换封面
const reUpload = (file) => {
  delUpload(file)
  //模拟点击<el-upload/>
  document.querySelector(".upload-resource .el-upload").click()
}

//删除素材封面
function delUpload(file) {
  const query = {
    materialId: data.value[0].material.id,
    fileId: file.fileId
  }
  delMaterialCover(query).then(res => {
    fileList.value.splice(fileList.value.findIndex(res => res.fileId === file.fileId), 1);
  })
}


const typeTree = computed(() => {
  return props.typeTreeList
})

watch(typeTree, (newValue, oldValue) => {
  store.commit("material/SET_CARD_DATA", [])
  Datas.value.name = ''
  Datas.value.memberPrice = null
  Datas.value.price = null
  tagName.value = ''
}, {immediate: true})


const changeData = (e) => {
  data.value.forEach((item) => {
    if (e == 0) {//标题
      item.material.name = Datas.value.name;
    } else if (e == 1) {//价格
      item.material.price = Datas.value.price;
    } else if (e == 2) {//会员价
      item.material.memberPrice = Datas.value.memberPrice;
    }
  })
}

//发布素材
const approveFormRef = ref()
const publish = () => {
  // if (!approveFormRef.value) return
  changeReleaseList()
  approveFormRef.value.validate((valid) => {
    if (valid) {
      if (releaseList.value.length < 1) {
        ElMessageBox.confirm(
            '当前没有选择需要提交的素材，请选择需要提交的素材进行提交，或者点击确定返回上一页',
            '提交',
            {
              customClass: 'messageBox-custom-warning',
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
            }
        ).then(() => {
          router.back()
        })
        return
      }
      ElMessageBox.confirm(
          '确认要提交当前勾选的素材吗？',
          '提交',
          {
            customClass: 'messageBox-custom-warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {

            materialRelease(releaseList.value).then((res) => {

              if (pageType.value !== 'change') {
                ElMessage({
                  showClose: true,
                  message: '保存成功',
                  type: 'success',
                  duration: 800
                })
                key.value = []
                tagNum.value = 0
              } else {
                ElMessage({
                  showClose: true,
                  message: '保存成功',
                  type: 'success',
                  duration: 800
                })
              }

              if (checkList.value.length === data.value.length) {
                store.commit('material/SET_CHECK_LIST', [])
                //保存后跳转回原页面
                goBack(res.data[0].typeId)
              } else {
                const upIds = data.value.map(el => {
                  return el.material.id
                })
                const cdata = []
                checkList.value.forEach(el => {
                  if (!upIds.includes(el.id)) {
                    cdata.push(el)
                  }
                })
                store.commit('material/SET_CHECK_LIST', cdata)
              }

              store.commit('material/SET_WAIT_SETTING_LIST', [])
              store.commit('material/SET_CARD_DATA', [])
              store.commit('material/SET_CHECK_IDS', [])
            })
          })
    } else {
      return false
    }
  })
}

const router = useRouter();
//返回素材仓库
const goBack = (typeId) => {
  router.push({
    path: 'depotMaterial',
    query: {
      typeId: typeId
    }
  })
}

function handleExceed(files) {
  if (mType.value === '1' || mType.value === '2') {
    delUpload(fileList.value[0])
    fileList.value.splice(0, 1);
    const file = files[0]
    file.uid = genFileId()
    uploadFile.value.handleStart(file)
  }
}


// 上传封面
const handleUploadFile = (e) => {
  if (e.raw.size / 1024 / 1024 > 5) {
    ElMessage.error('文件大小超过5MB，请重新上传！')
    fileList.value.splice(fileList.value.length - 1, 1);
    return false
  } else {
    let arr = []
    arr.push(e)
    for (var Files of arr) {
      // console.log('File', File);
      const File = Files.raw;
      const uploadData = new UploadFile({File, getUploadSign: getUploadSignFun, createUploadFile: CreateUploadFileFun});
      uploadData.parentId = 0;
      store.commit('upload/addFileList', uploadData)
    }
  }
}

const coverIds = ref([])
// 获取签名
const getUploadSignFun = (obj, callback, errorback) => {
  const directoryId = 0;
  const filename = obj.FileName;
  const size = obj.FileSize;
  //封面只上传图片typeid=6
  const typeId = 6;
  console.log('obj--', obj);
  getUploadSign({directoryId, filename, size, typeId}).then(res => {
    coverIds.value.push(res.data.id)
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

// 创建文件
const CreateUploadFileFun = ({resultData, options}, callback, errorback) => {
  const params = {
    fileId: resultData.fileId,
    verifyContent: resultData.video?.verify_content || '',
    sourceContext: options.sourceContext,
    typeId: data.value[0].material.typeId,
    coverFileId: coverIds.value[0] || null,
    materialId: data.value[0].material.id
  }

  createUploadMaterial(params).then(res => {
    coverFileId.value.push(res.data.fileSystem.id)

    const arr = {}
    Object.assign(arr, res.data.fileSystem)
    arr.fileId = res.data.fileSystem.id

    if (!data.value[0].material.coverFileAttachedInfoDtos) {
      data.value[0].material.coverFileAttachedInfoDtos = []
    } else {
      data.value[0].material.coverFileAttachedInfoDtos.forEach((res, index) => {
        if (res.status === "ready") {
          data.value[0].material.coverFileAttachedInfoDtos.splice(index, 1)
        }
      })
    }
    data.value[0].material.coverFileAttachedInfoDtos.push(arr)
    fileList.value = data.value[0].material.coverFileAttachedInfoDtos || []
    callback(res.data)
  }).catch(err => {
    errorback(err)
  })
}

function seleceType(type) {
  activeType.value = type
}

// 标签点击
function typeClick($e, type) {
  if (data.value.length === 0) {
    return
  }
  if ($e.target.tagName !== 'INPUT') return;
  type.typeId = type.id
  const fIndex = selectTypeList.value.findIndex(el => el.typeId === type.id)
  if (fIndex === -1) {
    selectTypeList.value.push(type)
  } else {
    selectTypeList.value.splice(fIndex, 1)
  }

  data.value.forEach(item => {
    const rIndex = item.material.materialTypeRelations.findIndex( el => el.typeId === type.id)
    if (rIndex === -1) {
      item.material.materialTypeRelations.push(type)
    } else {
      item.material.materialTypeRelations.splice(rIndex, 1)
    }

    const kIndex = item.material?.keywords.findIndex( el => el === type.typeName)
    if (activeType.value.parentId === 7) {
      if (kIndex === -1 && kIndex === fIndex) {
        item.material.keywords.push(type.typeName)
      }

      if (fIndex !== -1 && kIndex !== -1) {
        const pIndex2 = selectTypeList.value.findIndex(el => el.typeName === type.typeName)
        if (pIndex2 === -1) {
          item.material.keywords.splice(kIndex, 1)
        }
      }

      const pIndex =  item.material?.keywords.findIndex( el => el === activeType.value.typeName)
      if (fIndex === -1 && fIndex === pIndex) {
        item.material.keywords.unshift(activeType.value.typeName)
      }
    } else {
      if (kIndex === -1 && kIndex === fIndex) {
        item.material.keywords.push(type.typeName)
      } else {
        item.material.keywords.splice(kIndex, 1)
      }
    }
  })
}

const emit = defineEmits(['onOpen'])
const openEditor = ref(false)
const showEditor = ref(true)
const content = ref('')
const editor = ref(null)
const detailsHtml = ref('')
function openDetails() {
  detailsHtml.value = data.value[0]?.material?.details || ''
  openEditor.value = true
  // emit("onOpen", true)
}

//保存
function preserve() {
  detailsHtml.value = editor.value.getEditor().getHtml()
  console.log('detailsHtml.value',detailsHtml.value)
  data.value.forEach(res=>{
    res.material.details = detailsHtml.value
  })
  console.log('data.value',data.value)
  openEditor.value = false
  detailsHtml.value = ''
}
watch(() => data[0]?.material?.id, val => {
  showEditor.value = false;
  nextTick(() => {
    showEditor.value = true;
  })
})

</script>

<style lang="scss" scoped>
.MainBox {
  width: 100%;
  height: 100%;
  background: #292A30;
  padding: 24px 20px;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 21px;

  .main-box {
    .upload-btn {
      height: 40px;
      cursor: pointer;
      background: linear-gradient(45deg, #0459FF 0%, #5726DD 100%);
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }

    .add-mark {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      font-weight: 400;
      line-height: 12px;

      .el-switch {
        height: 6px;
      }
    }

    .bottom-line {
      margin-top: 19px;
      margin-bottom: 20px;
      height: 1px;
      opacity: 0.06;
      border: 1px solid #979797;
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      line-height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 16px;
    }

    .cover {
      .picture {
        margin-top: 15px;

        .change {
          font-size: 14px;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 21px;
        }

        :deep(.el-upload--picture-card) {
          width: 104px;
          height: 59px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
        }

        :deep(.el-upload-list__item) {
          width: 104px;
          height: 59px;
        }
      }

      .show {
        :deep(.el-upload--picture-card) {
          display: none;
        }
      }

      .tip {
        margin-top: 10px;
        margin-bottom: 25px;
        font-size: 12px;
        font-weight: 400;
        color: #C4C9D3;
        line-height: 18px;
      }

    }

    .noCover {
      cursor: not-allowed;
      opacity: 0.2;
    }

    .label-box {
      .wordList {
        margin-top: 12px;
        //height: 110px;
        background: #1C1D24;
        border-radius: 8px;
        padding: 14px 11px 11px 14px;

        .tags {
          min-height: 65px;
        }

        .tag {
          margin-bottom: 8px;
          margin-right: 8px;
          border-radius: 4px;
          border: 1px solid #4E5262;
          background: #1C1D24;
        }
      }
    }

    .input {
      //margin-top: 12px;
      //margin-bottom: 25px;
      width: 100%;
      margin-top: 10px;

      :deep(.el-input__inner) {
        background: #1C1D24;
        border-radius: 8px;
        color: #FFFFFF;
      }

      :deep(.el-input) {
        input {
          box-shadow: none; //去除白边
          font-size: 12px;

          &:focus {
            outline: 0;
          }
        }
      }
    }

    .pricebox {
      display: flex;
      justify-content: space-between;

      .price {
        width: 70%;
        display: flex;
        font-weight: 400;
        color: #9094A6;
        line-height: 14px;
        align-items: center;

        .text {
          width: 80px;
          margin: auto;
        }

        :deep(.el-input__inner) {
          color: #FF9F03;
        }
      }
    }

    .classify {
      margin-bottom: 9px;
      margin-top: 23px;
      color: #9094A6;
    }

    .labelbox {
      display: flex;
      margin-top: 20px;
      color: #9094A6;

      .sBox {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }

      .label-dropdown {
        width: 84%;
        padding: 10px 16px;
        background-color: #1E1F25;
        border-radius: 10px;
        border: 1px solid #565863;
        cursor: pointer;
      }

      :deep(.el-tooltip__trigger) {
        width: 100%;
      }

      .el-dropdown .el-dropdown-link {
        max-height: 300px;
        font-size: 12px;
        color: #CFD2D8 !important;
        display: flex;
        justify-content: space-between;
      }

      .el-select {
        width: 96px;
        height: 34px;
        border-radius: 10px;
        border: 1px solid #565863;

        :deep(.el-input) {
          input {
            box-shadow: none; //去除白边
            font-size: 12px;

            &:focus {
              outline: 0;
            }
          }
        }

        :deep(.el-input__inner) {
          border-radius: 10px !important;
          background: #1E1F25;
          font-weight: 400;
          color: #CFD2D8;
          line-height: 18px;
        }

      }

      .label {
        width: 80%;
      }

      .left{
        min-width: 66px;
        display:flex;
        flex-direction: column;
        .type-item{
          padding: 2px 6px;
          margin-bottom: 6px;
          border-radius: 4px;
          color: rgba($color: #ffffff, $alpha: 0.6);
          background-color: rgba($color: #4E5262, $alpha: 0.4);
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .activeType{
          color: #ffffff;
          background-color: #4E5262;
        }
      }

      .right{
        position: relative;
        width: calc(100% - 70px);
        margin-left: 10px;
        padding: 8px 0 4px 10px;
        min-height: 300px;
        // overflow: hidden;
        // background-color: rgba($color: #ffffff, $alpha: .6);
        border: 1px solid rgba($color: #0459FF, $alpha: 0.4);
        border-radius: 5px;
        .item-children{
          width: 100%;
          // min-width: 110px;
          height: 24px;
          margin-right: 20px;
          overflow: hidden;
        }
      }
    }

    .wordBox {
      margin-top: 26px;

      .wordTitle {
        display: flex;
        justify-content: space-between;
      }

      .wordList {
        margin-top: 12px;
        //height: 110px;
        background: #1C1D24;
        border-radius: 8px;
        padding: 14px 11px 11px 14px;

        .tags {
          min-height: 65px;
        }

        .tag {
          margin-bottom: 8px;
          margin-right: 8px;
          border-radius: 4px;
          border: 1px solid #4E5262;
          background: #1C1D24;
        }

        .line {
          //margin-top: 14px;
          height: 1px;
          opacity: 0.13;
          border: 1px solid #979797;


        }


      }

    }

  }

}

:deep(.el-form-item__content) {
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: flex-start;
  flex-wrap: inherit;
}

.tag-input {
  position: relative;
  margin-top: 0px;
  margin-bottom: 0px;
  border: 1px solid #565863;
  border-radius: 10px;

  .check {
    position: absolute;
    bottom: 5px;
    right: 0;
    cursor: pointer;
  }

  :deep(.el-input__inner) {
    background: #1C1D24;
    border-radius: 8px;
    color: #FFFFFF;
  }

  :deep(.el-input) {
    input {
      box-shadow: none; //去除白边
      font-size: 12px;

      &:focus {
        outline: 0;
      }
    }
  }
}


.word {
  font-size: 14px;
  font-weight: 400;
  color: #9094A6;
  line-height: 14px;
  text-align: end;
  margin-right: 13px;
}

.detail {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  margin-right: 8px;
  background-color: #1E1F25;
  border-radius: 10px;
  border: 1px solid #565863;
}
</style>
