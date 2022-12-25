<template>
  <!--  <div v-if=" materialList[0]?.typeId < 5 && materialList[0]?.typeId !== 3">-->
  <div>
    <div class="sound-table-header">
      <div class="sound-table-th" style="width: 11%">
        <el-checkbox class="allCheck" size="large" v-model="checkAll"
                     :indeterminate="isIndeterminate"
                     @change="handleCheckAllChange">{{ '' }}
        </el-checkbox>
      </div>
      <div class="sound-table-th" style="width: 18%">素材名称</div>
      <div class="sound-table-th" style="width: 20%">文件名称</div>
      <div class="sound-table-th" style="width: 20%">关键词</div>
      <div class="sound-table-th sort" style="width: 7%" @click="handleSort(0)">价格
        <div class="content">
          <div class="box">
            <div class="t-top" :class="[tabName0===''?'top':tabName0==='top'?'active-top':'top']"></div>
            <div class="bottom" :class="[tabName0===''?'bottom':tabName0==='bottom'?'active-bottom':'bottom']"></div>
          </div>
        </div>
      </div>
      <div class="sound-table-th sort" style="width: 7%" @click="handleSort(1)">会员价
        <div class="content">
          <div class="box">
            <div class="t-top" :class="[tabName===''?'top':tabName==='top'?'active-top':'top']"></div>
            <div class="bottom" :class="[tabName===''?'bottom':tabName==='bottom'?'active-bottom':'bottom']"></div>
          </div>
        </div>
      </div>
      <div class="sound-table-th sort" style="width:7%" @click="handleSort(2)">销量
        <div class="content">
          <div class="box">
            <div class="t-top" :class="[tabName1===''?'top':tabName1==='top'?'active-top':'top']"></div>
            <div class="bottom" :class="[tabName1===''?'bottom':tabName1==='bottom'?'active-bottom':'bottom']"></div>
          </div>
        </div>
      </div>
      <div class="sound-table-th sort" style="width: 7%" @click="handleSort(3)">佣金
        <div class="content">
          <div class="box">
            <div class="t-top" :class="[tabName2===''?'top':tabName2==='top'?'active-top':'top']"></div>
            <div class="bottom" :class="[tabName2===''?'bottom':tabName2==='bottom'?'active-bottom':'bottom']"></div>
          </div>
        </div>
      </div>
      <div class="sound-table-th" style="width: 3%">操作</div>
    </div>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)" style="min-height: calc(100vh - 295px);">
      <template v-if="!loading">
      <div class="content-list" :class="{'activePlay': playId === item.id}" v-for="(item, index) in materialList" :key="item.id" @click="itemClick(item.id)">

        <div class="check" style="width: 11%" @click.stop>
          <el-checkbox-group class="checkbox"
                             v-model="checkedItems"
                             @change="handleCheckedItemsChange"
          >
            <div @click.stop>
              <el-checkbox size="large" :label="item.id">{{ "" }}</el-checkbox>
            </div>
          </el-checkbox-group>
          <div class="img" v-if="item.typeId < 7" :style="{ 'background-image': `url(${item.coverUrl})` }">
            <img v-if="item.typeId < 3 && playId !== item.id" :src="play2" style="width: 40px;height: 40px;position: absolute;margin: 22%;cursor: pointer;" @click="handlePlayAudio(item.id)">
            <img v-if="item.typeId < 3 && playId === item.id" :src="play3" style="width: 40px;height: 40px;position: absolute;margin: 22%;cursor: pointer;" @click="handlePlayAudio(item.id)">
          </div>
          <div class="img" :style="{ 'background-image': `url(${item.coverUrl})` }" style=" background-repeat: round;"
               v-if="item.typeId === 7">
          </div>
        </div>
        <div class="flex card-col" style="width: 18%">
          <div class="date">
            <div class="iTitle">
              <el-input v-if="editNameId === item.id" :ref="'editNameRef'+item.id" v-model="editName" maxlength="50" @change="handleNameChange(index)" @blur="editNameId = 0" placeholder="请输入素材名称" />
              <div v-else class="ellipsis-name" @dblclick="handleEditName(item)">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div style="width: 20%">
          <div class="file-name">{{ item.fileAttachedInfoDto?.filename }}</div>
        </div>
        <div style="width: 20%;" @click="handleEditKeyword(item)">
          <div style="display: flex;flex-wrap: wrap;    padding-right: 10px;">
            <div class="tag" v-for="(tag, index) in item.keywordsArray.slice(0,5)" :key="index" >{{ tag }}</div>
            <div class="icon-box" v-if="item.keywordsArray.length > 5"
                 @mouseover="getOther(item.keywordsArray)"
                 v-contextmenu:LabelMenu="{ trigger: 'mouseover' }"
            >
              <MoreFilled style="padding: 0px 3px;height: 14px"/>
            </div>
          </div>
        </div>

        <div style="width: 7%">
          <el-input v-if="editPriceId === item.id" @input="editPrice=editPrice.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" :input-style="{'width':'80%'}" :ref="'editPriceRef'+item.id" v-model="editPrice" @change="handlePriceChange(index)" @blur="editPriceId = 0" placeholder="请输入价格" />
          <span v-else style="cursor: pointer;" @dblclick="handleEditPrice(item)">¥{{ item.price || '0' }}</span>
        </div>
        <div style="width: 7%">
          <el-input v-if="editMemberPriceId === item.id" @input="editMemberPrice=editMemberPrice.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" :input-style="{'width':'80%'}" :ref="'editMemberPriceRef'+item.id" v-model="editMemberPrice" @change="handleMemberPriceChange(index)" @blur="editMemberPriceId = 0" placeholder="请输入会员价" />
          <span v-else style="cursor: pointer;" @dblclick="handleEditMemberPrice(item)">¥{{ item.memberPrice || '0' }}</span>
        </div>
        <div style="width: 7%">
          <span>{{ item.salesVolume || '0' }}</span>
        </div>
        <div style="width: 7%">
          ¥<span>{{ item.commission || '0' }}</span>
        </div>

        <div style="width: 3%">
          <img :src="more" class="more" @click.stop="false" v-contextmenu:Contextmenu="{trigger:'click',index}"
               @click="currentIndex(item)">
        </div>


      </div>
      </template>
    </div>
  </div>


  <v-contextmenu ref="Contextmenu">
    <v-contextmenu-item @click="putAway">
      <template #label>
        上架
      </template>
    </v-contextmenu-item>
    <v-contextmenu-item @click="changeItem">
      <template #label>
        快捷修改
      </template>
    </v-contextmenu-item>
    <v-contextmenu-item @click="deleteItem">
      <template #label>
        删除
      </template>
    </v-contextmenu-item>
  </v-contextmenu>

  <v-contextmenu ref="LabelMenu">
    <div style="max-height: 200px;overflow: hidden">
      <el-scrollbar max-height="200px">
        <v-contextmenu-item v-for="lab in otherLabel" :key="lab">
          <template #label>
            {{ lab }}
          </template>
        </v-contextmenu-item>
      </el-scrollbar>
    </div>
  </v-contextmenu>

  <el-dialog
    v-model="dialogEdit"
    title="关键词编辑"
    width="596px"
    :before-close="handleClose"
    custom-class="edit-keywork-dialog"
  >
    <template #>
      <div style="margin-bottom:10px;">文件名：{{editData?.fileAttachedInfoDto?.filename}}</div>
      <div class="key-d-box">
        <div class="left">
          <div v-for="(item, index) in typeTreeList" :key="index" class="type" :class="{activeType: item.typeName === activeType}" @click="handleTypeChange(item)">{{item.typeName}}</div>
        </div>
        <div class="right" >
          <el-scrollbar ref="scrollbarRef" class="key-scrollbar" height="400px" view-class="key-scrollbar-view">
            <el-checkbox-group v-model="selectType">
              <template v-for="item in activeTypeChildren" :key="item.id">
                <el-checkbox class="item-children" :disabled="durationArr.includes(item.typeName)" :label="item.id" @click="typeClick($event, item)">
                  {{item.typeName}}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </el-scrollbar>
        </div>
      </div>

      <div class="tag-add-box">
        <div>
          <el-input v-model="tagName" maxlength="8" @keyup.enter="handleAddTag" placeholder="请输入自定义关键词"/>
        </div>
        <div class="check">
          <Check style="width:20px; height:20px;cursor: pointer;" @click.stop="handleAddTag"/>
        </div>
        <div class="custom-num">自定义{{editData.keywordsArray.length - editData.materialTypeRelations.length}}/6个关键词</div>
      </div>

      <div class="tag-box">
        <el-tag
          v-for="(item, index) in editData.keywordsArray"
          :key="item"
          class="tag"
          size="small"
          :closable="!durationArr.includes(item)"
          @close="handleRemove(item, index)"
        >
          {{ item }}
        </el-tag>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogEdit = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitEdit"
          >提交</el-button
        >
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import play2 from '@/assets/icons/play/play2.png'
import play3 from '@/assets/icons/play/stopPlay.png'
import edit from '@/assets/material/edit.png'
import more from '@/assets/material/more.png'
import {onUnmounted, ref} from "vue";
import {delMaterialList, materialRelease, putShelves} from "@/api/material";
import {ElMessage, ElLoading} from "element-plus";
import {nextTick, watch} from "@vue/runtime-core";
import {onMounted} from "vue-demi";
import FileType from '@/components/FileType';
import {secondToDate} from '@/utils/tool.js';
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import UpDown from '@/components/UpDown'
import {Check} from '@element-plus/icons-vue'
import { number } from 'echarts';

const props = defineProps({
  materialList: {
    type: Array,
    default: []
  },
  typeId: {
    type: Number,
    default: 1
  },
  loading: {
    type: Boolean,
    default: false
  },
  typeTreeList: {
    type: Array,
    default: []
  },
  playId: {
    type: Number,
    default: null
  }
})
const store = useStore()
const router = useRouter()
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedItems = ref([])
const name = ref(0)
const price = ref(0)
const memberPrice = ref('')
const typeId = ref(1)
const rowIndex = ref()
const rowData = ref()
const currentIndex = (item) => {
  rowIndex.value = item.id
  rowData.value = item
}
const durationArr = ref(['0-10s','10-30s','30-60s','60s以上','0-30s','60-120s','120s以上'])

onMounted(() => {

})

watch(() => props.materialList, newValue => {
  checkAll.value = false
  isIndeterminate.value = false
  checkedItems.value = []
})

const viewName = ref('中国智造ABCabc123');
// 返回style
const formatStyle = (id) => {
  if (viewName.value) {
    return `<style>
            @font-face {
                font-family: 'font-${id}';
                src: url('https://yingyintonghua.com/material/material/buildFontFile?format=ttf&words=${encodeURIComponent(viewName.value)}&materialId=${id}') format('truetype');
                font-weight: normal;
                font-style: normal;
          } </style>
          <p style="font-family: 'font-${id}'">${'中国智造ABCabc123'}</p>`
  }
}

//获取隐藏标签
const otherLabel = ref([])
const getOther = (list) => {
  otherLabel.value = list.slice(5, list.length)
}
const changeItem = () => {
  const row = []
  row.push(rowData.value)
  store.commit("material/SET_CHECK_LIST", row)
  emit('onChange')
}

//删除
function deleteItem() {
  delMaterialList(rowIndex.value).then((res) => {
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success',
      duration: 800
    })
    emit('onGetList')
  })
}

const emit = defineEmits(['onGetList', 'onSortChange', 'sequence', 'onChange', 'update:loading', 'onPlayAudio'])
//单个上架
const putAway = () => {
  const query = {
    ids: rowIndex.value
  }
  putShelves(query).then(res => {
    ElMessage({
      showClose: true,
      message: '请求成功',
      type: 'success',
      duration: 500
    })
    emit('onGetList')
  })
}

//全选
const ids = ref([])
const handleCheckAllChange = (val) => {

  ids.value = []
  ids.value = props.materialList.map(res => {
    return res.id
  })
  checkedItems.value = val ? ids.value : []
  isIndeterminate.value = false
  // checkList.value = []
  store.commit("material/SET_CHECK_LIST", props.materialList)
  store.commit("material/SET_CHECK_IDS",checkedItems.value)
}

// 选择行
const checkList = ref([])
const handleCheckedItemsChange = (value) => {
  changeItems()

  checkList.value = []
  value.forEach((i) => {
    const l = props.materialList.find((res) => {
      return res.id === i
    })
    checkList.value.push(l)
  })

  store.commit("material/SET_CHECK_LIST", checkList.value)
  store.commit("material/SET_CHECK_IDS", value)
}

watch(checkedItems.value, () => {
  changeItems()
})

//全选设置
function changeItems() {
  const checkedCount = checkedItems.value.length
  checkAll.value = checkedCount === props.materialList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.materialList.length
}

const timer = ref(null) //双击与单击冲突处理
const itemClick = (id) => {
  clearTimeout(timer.value) //清除未执行的定时器
  timer.value = setTimeout(function () {
    if (checkedItems.value.some(res => {
      return res === id;
    })) {
      checkedItems.value.splice(checkedItems.value.findIndex(res => {
        return res === id
      }), 1)
    } else {
      checkedItems.value.push(id)
    }

    checkList.value = []
    checkedItems.value.forEach((i) => {
      const l = props.materialList.find((res) => {
        return res.id === i
      })
      checkList.value.push(l)
    })

    store.commit("material/SET_CHECK_LIST", checkList.value)
    store.commit("material/SET_CHECK_IDS", checkedItems.value)
  }, 200);

}

//排序显示组件控制
const tabName = ref('')
const tabName0 = ref('')
const tabName1 = ref('')
const tabName2 = ref('')

function handleSort(type) {
  if (type === 0) {
    if (tabName0.value === '') {
      tabName0.value = 'top'
    } else {
      tabName0.value === 'top' ? tabName0.value = 'bottom' : tabName0.value = 'top'
    }
    tabName.value = ''
    tabName1.value = ''
    tabName2.value = ''
  } else if (type === 1) {
    if (tabName.value === '') {
      tabName.value = 'top'
    } else {
      tabName.value === 'top' ? tabName.value = 'bottom' : tabName.value = 'top'
    }
    tabName1.value = ''
    tabName2.value = ''
    tabName0.value = ''
  } else if (type === 2) {
    if (tabName1.value === '') {
      tabName1.value = 'top'
    } else {
      tabName1.value === 'top' ? tabName1.value = 'bottom' : tabName1.value = 'top'
    }
    tabName2.value = ''
    tabName.value = ''
    tabName0.value = ''
  } else if (type === 3) {
    if (tabName2.value === '') {
      tabName2.value = 'top'
    } else {
      tabName2.value === 'top' ? tabName2.value = 'bottom' : tabName2.value = 'top'
    }
    tabName.value = ''
    tabName1.value = ''
    tabName0.value = ''
  }
  emit('update:loading', false)
  emit('onSortChange', type)
}

// 修改素材名称
const {proxy} = getCurrentInstance()
const editName = ref('')
const editNameId = ref(0)
function handleEditName(item) {
  clearTimeout(timer.value)
  editNameId.value = item.id
  editName.value = item.name
  nextTick(() => {
    proxy.$refs['editNameRef'+item.id][0].focus()
  })
}

function handleNameChange(index) {
  editNameId.value = 0
  const data = props.materialList[index]
  data.name = editName.value
  materialReleaseSubmit(data)
}

// 修改价格
const editPrice = ref(0)
const editPriceId = ref(0)
function handleEditPrice(item) {
  clearTimeout(timer.value)
  editPriceId.value = item.id
  editPrice.value = item.price
  nextTick(() => {
    proxy.$refs['editPriceRef'+item.id][0].focus()
  })
}

function handlePriceChange(index) {
  editPriceId.value = 0
  const data = props.materialList[index]
  data.price = editPrice.value
  materialReleaseSubmit(data)
}

// 修改会员价
const editMemberPrice = ref(0)
const editMemberPriceId = ref(0)
function handleEditMemberPrice(item) {
  clearTimeout(timer.value)
  editMemberPriceId.value = item.id
  editMemberPrice.value = item.memberPrice
  nextTick(() => {
    proxy.$refs['editMemberPriceRef'+item.id][0].focus()
  })
}

function handleMemberPriceChange(index) {
  editPriceId.value = 0
  const data = props.materialList[index]
  data.memberPrice = editMemberPrice.value
  materialReleaseSubmit(data)
}

// 提交修改
function materialReleaseSubmit(data, data2 = null) {
  const params = {
    materialId: data.id,
    name: data.name,
    price: data.price,
    memberPrice: data.memberPrice,
  }
  if (data2) {
    params.keywords = data2.keywords
    params.labels = data2.labels
  }
  const loading = ElLoading.service({
    lock: true,
    text: '数据提交中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  materialRelease([params]).then(res => {
    ElMessage.success('修改成功')
    nextTick(() => {
      if (data2) {
        data.keywords = res.data[0].keywords
        data.keywordsArray = res.data[0].keywordsArray
        data.materialTypeRelations = res.data[0].materialTypeRelations
      }
      dialogEdit.value = false
      loading.close()
    })
  }).catch(err => {
    loading.close()
    ElMessage.error('修改错误：', err)
  })
}

const activeType = ref({})
const activeTypeChildren = computed(() => {
  const list = props.typeTreeList || []
  const findex = list.findIndex(el => el.typeName === activeType.value?.typeName)
  if (findex === -1) {
    activeType.value = list[0] || {}
  }

  const data = list.find(el => el.typeName === activeType.value.typeName)
  return data?.children || []
})

const dialogEdit = ref(false)
const editData = ref({})
const keywords = ref([])
const selectType = ref([])
function handleEditKeyword(item) {
  editData.value = item
  keywords.value = item.keywords
  selectTypeList.value = item.materialTypeRelations.slice() || []
  selectType.value = []
  selectTypeList.value.forEach(el => {
    selectType.value.push(el.typeId)
  })

  dialogEdit.value = true
}

function handleClose(done) {
  done()
}

const scrollbarRef = ref()
function handleTypeChange(item) {
  activeType.value = item
  scrollbarRef.value.setScrollTop(0)
  nextTick(() => {
    scrollbarRef.value.update()
  })
}

// 标签点击
const selectTypeList = ref([])
function typeClick($e, type) {
  if ($e.target.tagName !== 'INPUT') return;
  type.typeId = type.id
  const fIndex = selectTypeList.value.findIndex(el => el.typeId === type.id)
  if (fIndex === -1) {
    selectTypeList.value.push(type)
  } else {
    selectTypeList.value.splice(fIndex, 1)
  }

  const rIndex = editData.value.materialTypeRelations.findIndex( el => el.typeId === type.id)
  if (rIndex === -1) {
    editData.value.materialTypeRelations.push(type)
  } else {
    editData.value.materialTypeRelations.splice(rIndex, 1)
  }

  const kIndex = editData.value?.keywordsArray.findIndex( el => el === type.typeName)
  if (activeType.value.parentId === 7) {
    if (kIndex === -1 && kIndex === fIndex) {
      editData.value.keywordsArray.push(type.typeName)
    }

    if (fIndex !== -1 && kIndex !== -1) {
      const pIndex2 = selectTypeList.value.findIndex(el => el.typeName === type.typeName)
      if (pIndex2 === -1) {
        editData.value.keywordsArray.splice(kIndex, 1)
      }
    }

    const pIndex =  editData.value?.keywordsArray.findIndex( el => el === activeType.value.typeName)
    if (fIndex === -1 && fIndex === pIndex) {
      editData.value.keywordsArray.unshift(activeType.value.typeName)
    }
  } else {
    if (kIndex === -1 && kIndex === fIndex) {
      editData.value.keywordsArray.push(type.typeName)
    } else {
      editData.value.keywordsArray.splice(kIndex, 1)
    }
  }
}

function handleRemove(type, index) {
  editData.value.keywordsArray.splice(index, 1)
  const list = []
  const ids = []
  selectTypeList.value.forEach(el => {
    if (el.typeName !== type) {
      list.push(el)
      ids.push(el.typeId)
    }
  })
  selectTypeList.value = list
  selectType.value = ids
}

const tagName = ref('')
const customKeys = ref([])
function handleAddTag() {
  if (editData.value.keywordsArray.length - editData.value.materialTypeRelations.length >= 6) {
    ElMessage.error('自定义关键词不能超过6个')
    tagName.value = ''
    return
  }

  const fIndex = editData.value.keywordsArray.findIndex(el => el === tagName.value)
  if (fIndex !== -1) {
    ElMessage.error('关键词不能重复')
    tagName.value = ''
    return
  }

  editData.value.keywordsArray.push(tagName.value)
  tagName.value = ''
}

// 修改关键词提交
function handleSubmitEdit() {
  const ids = []
  selectTypeList.value.forEach(r => {
    ids.push(r.typeId)
  })
  const data2 = {
    keywords: editData.value.keywordsArray,
    labels: ids
  }
  materialReleaseSubmit(editData.value, data2)
}

function handlePlayAudio(id) {
  emit('onPlayAudio', id)
}

</script>

<style scoped lang="scss">
@import "./style.scss";

.content {
  padding: 4px 0px 0px 0px;
  margin-left: 5px;

  .box {
    display: inline-block;

    .bottom {
      border: 4px solid transparent;
      border-top: 4px solid white;
      margin-top: 2px;
      cursor: pointer;
    }

    .t-top {
      cursor: pointer;
    }

    .active-top {
      border: 4px solid transparent;
      border-bottom: 4px solid rgb(28, 132, 198);
    }

    .active-bottom {
      border: 4px solid transparent;
      border-top: 4px solid rgb(28, 132, 198);
      margin-top: 2px;
    }

    .top {
      border: 4px solid transparent;
      border-bottom: 4px solid white;
    }
  }

}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: white;
  border-color: white;
}

</style>
