<template>
  <div>
    <div class="table-header">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="cart-table-th" style="width: 20%">
            <el-checkbox label="全选" size="large" v-model="checkAll"
                         :indeterminate="isIndeterminate"
                         @change="handleCheckAllChange">{{ '' }}
            </el-checkbox>
          </div>
          <div class="cart-table-th" style="width: 48%">素材名称</div>
          <div class="cart-table-th" style="width: 19%">关键词</div>
        </el-col>
        <el-col :span="12">
          <div class="cart-table-th" style="width: 38%;">创建时间</div>
          <div style="width: 57%; display: flex; justify-content: space-between;">
            <div class="cart-table-th sort" @click="handleSort(0)">价格
              <div class="content">
                <div class="box">
                  <div class="t-top" :class="[tabName0===''?'top':tabName0==='top'?'active-top':'top']"></div>
                  <div class="bottom"
                       :class="[tabName0===''?'bottom':tabName0==='bottom'?'active-bottom':'bottom']"></div>
                </div>
              </div>
            </div>
            <div class="cart-table-th sort" @click="handleSort(1)">会员价
              <div class="content">
                <div class="box">
                  <div class="t-top" :class="[tabName===''?'top':tabName==='top'?'active-top':'top']"></div>
                  <div class="bottom"
                       :class="[tabName===''?'bottom':tabName==='bottom'?'active-bottom':'bottom']"></div>
                </div>
              </div>
            </div>
            <div class="cart-table-th sort" @click="handleSort(2)">销量
              <div class="content">
                <div class="box">
                  <div class="t-top" :class="[tabName1===''?'top':tabName1==='top'?'active-top':'top']"></div>
                  <div class="bottom"
                       :class="[tabName1===''?'bottom':tabName1==='bottom'?'active-bottom':'bottom']"></div>
                </div>
              </div>
            </div>
            <div class="cart-table-th sort" @click="handleSort(3)">佣金
              <div class="content">
                <div class="box">
                  <div class="t-top" :class="[tabName2===''?'top':tabName2==='top'?'active-top':'top']"></div>
                  <div class="bottom"
                       :class="[tabName2===''?'bottom':tabName2==='bottom'?'active-bottom':'bottom']"></div>
                </div>
              </div>
            </div>
            <div class="cart-table-th">操作</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-loading="!loading" element-loading-background="rgba(0, 0, 0, 0)" style="min-height: calc(100vh - 295px);">
      <template v-if="loading">
        <div class="content-card" v-for="(item, index) in sellMaterial" :key="item.id" @click="itemClick(item.id)">
          <el-row :gutter="20">
            <el-col :span="12" class="flex main-col">
              <div class="check" style="width: 20%">
                <el-checkbox-group class="checkbox" v-model="checkedItems" @change="handleCheckedItemsChange">
                  <div @click.stop>
                    <el-checkbox size="large" :label="item.id">{{ "" }}</el-checkbox>
                  </div>
                </el-checkbox-group>
                <div class="img" :style="{ 'background-image': `url(${item.coverUrl})` }" v-if="item.typeId < 7">
                  <img :src="play2" style="width: 40px;height: 40px;position: absolute;margin: 22%"
                       v-if="item.typeId < 3">
                </div>
                <div class="img" :style="{ 'background-image': `url(${item.coverUrl})` }"
                     style=" background-repeat: round;"
                     v-else-if="item.typeId === 7">
                </div>
              </div>
              <div class="flex col-div1" style="width: 48%">
                <div class="date">
                  <div class="iTitle">
                    <div class="ellipsis-name">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex tag-list">
                <div class="tag" v-for="(keywords, index) in item.keywordsArray.slice(0,5)" :key="index">{{
                    keywords
                  }}
                </div>
                <div class="icon-box" v-if="item.keywordsArray.length > 5"
                     @mouseover="getOther(item.keywordsArray)"
                     v-contextmenu:LabelMenu="{ trigger: 'mouseover' }"
                >
                  <MoreFilled style="padding: 0px 3px"/>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="last">
              <div class="last-text1" style="width: 38%;margin-left: 10px;margin-right: 10px;">
                <span class="time-text">{{ item.createTime }}</span>
              </div>
              <div class="last-text2" style="width: 62%;">
                <div style="width: 13%;">
                  ¥<span>{{ item.price || "0" }}</span>
                </div>
                <div style="width: 14%;">
                  ¥<span>{{ item.memberPrice || "0" }}</span>
                </div>
                <div style="width: 12%;">
                  <span>{{ item.salesVolume || 0 }}</span>
                </div>
                <div style="width: 12%;">
                  ¥<span>{{ item.commission || "0" }}</span>
                </div>
                <div style="width: 10%;">
                  <img :src="more" class="more" @click.stop="false" v-contextmenu:Contextmenu="{trigger:'click'}"
                       @click="currentIndex(item)">
                </div>
              </div>

            </el-col>
          </el-row>
        </div>
      </template>
    </div>
  </div>


  <v-contextmenu ref="Contextmenu">
    <v-contextmenu-item @click="under">
      <template #label>
        下架
      </template>
    </v-contextmenu-item>
    <v-contextmenu-item @click="toDetails" v-if="rowTypeId !== 7">
      <template #label>
        查看页面
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
</template>

<script setup>
import play2 from '@/assets/icons/play/play2.png'
import edit from '@/assets/material/edit.png'
import more from '@/assets/material/more.png'
import {ref} from "vue";
import {materialRelease, offShelves} from "../../../../api/material";
import {ElMessage} from "element-plus";
import {secondToDate} from '@/utils/tool.js';
import FileType from '@/components/FileType';
import {watch} from "@vue/runtime-core";
import {computed} from "vue";
import {useStore} from "vuex";

const props = defineProps({
  sellMaterial: {
    type: Array,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const store = useStore();
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedItems = ref([])

const name = ref('')
const inputName = ref(null)

const rowIndex = ref()
const rowTypeId = ref()
const currentIndex = (item) => {
  rowIndex.value = item.id
  rowTypeId.value = item.typeId
}
//获取隐藏标签
const otherLabel = ref([])
const getOther = (list) => {
  otherLabel.value = list.slice(5, list.length)
}

const emit = defineEmits(['onGetList', 'onSortChange'])
//单个素材下架
const under = () => {
  const query = {
    ids: rowIndex.value
  }
  offShelves(query).then(res => {
    ElMessage({
      showClose: true,
      message: '下架成功',
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
  ids.value = props.sellMaterial.map(res => {
    return res.id
  })
  checkedItems.value = val ? ids.value : []
  isIndeterminate.value = false

  store.commit("material/SET_CHECK_IDS", checkedItems.value)
}

// 选择行
const handleCheckedItemsChange = (value) => {
  changeItem()
  store.commit("material/SET_CHECK_IDS", value)
}


watch(() => props.sellMaterial, newValue => {
  checkAll.value = false
  isIndeterminate.value = false
  checkedItems.value = []
})

function changeItem() {
  const checkedCount = checkedItems.value.length
  checkAll.value = checkedCount === props.sellMaterial.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.sellMaterial.length
}

const itemClick = (id) => {
  if (checkedItems.value.some(res => {
    return res === id;
  })) {
    checkedItems.value.splice(checkedItems.value.findIndex(res => {
      return res === id
    }), 1)
  } else {
    checkedItems.value.push(id)
  }

  store.commit("material/SET_CHECK_IDS", checkedItems.value)
}
watch(() => checkedItems.value, () => {
  changeItem()
}, {immediate: true, deep: true})

const sort = ref({
  priceSort: 1,
  memberPriceSort: 1,
  soldSort: 1,
  commissionSort: 1,
})

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
    tabName1.value = ''
    tabName2.value = ''
    tabName.value = ''
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
  } else {
    if (tabName2.value === '') {
      tabName2.value = 'top'
    } else {
      tabName2.value === 'top' ? tabName2.value = 'bottom' : tabName2.value = 'top'
    }
    tabName.value = ''
    tabName1.value = ''
    tabName0.value = ''
  }
  emit('onSortChange', type)
}

const changeStatus = (item) => {
  name.value = item.name
}

function change(datas) {
  const query = [{
    name: name.value,
    materialIds: [datas]
  }]
  materialRelease(query).then((res) => {
    ElMessage({
      showClose: true,
      message: '修改成功',
      type: 'success',
      duration: 800
    })
    emit('onGetList')
  })
}

const router = useRouter();
//跳转详情页
const id = ref()
const menu = 'sellMaterial'
const toDetails = () => {
  router.push({
    path: `/material/main/details/${rowIndex.value}`,
  })
}


// 鼠标移动时计算雪碧图
const offsetY = ref(0);
const viewWidth = ref(0);
const viewHeight = ref(0);
const percentage = ref(0);
const handleMouseMoveVideo = (e, index) => {
  const spriteImageInfo = JSON.parse(props.sellMaterial[index].fileAttachedInfoDto.spriteImageInfo || '{}');
  const imageWidth = spriteImageInfo.width || 240; //雪碧图每一帧的宽度
  const imageHeight = spriteImageInfo.height || 6750; //雪碧图每一帧的高度
  const offsetX = e.offsetX;
  const offsetWidth = e.target.getBoundingClientRect().width.toFixed(2); //展示窗口宽度
  const offsetHeight = e.target.getBoundingClientRect().height.toFixed(2); //展示窗口高度
  const imageScale = imageWidth / imageHeight;
  const offsetScale = offsetWidth / offsetHeight;
  if (imageScale > offsetScale) {
    viewWidth.value = offsetWidth;
    viewHeight.value = viewWidth.value / imageScale;
  } else {
    viewHeight.value = offsetHeight;
    viewWidth.value = imageScale * viewHeight.value;
  }

  const N = 100; //数量
  const NS = offsetWidth / N;
  const steep = offsetWidth / 100;
  offsetY.value = viewHeight.value * Math.round(offsetX / NS);
  percentage.value = offsetX / steep; //得到当前进度
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

.el-col {
  display: flex;
  color: #fff;
  align-items: center;
}
</style>
