<template>
  <el-row style="width: 100%;">
    <el-col :span="24">
      <div class="mid-left" ref="minLeft">
        <!--        音效-->
        <div v-if="typeId == 1">
          <div class="select-form">
            <el-row :gutter="40">
              <el-col :span="24" style="height: auto">
                <div class="select-form-item">
                  <span class="label">库分类</span>
                  <span class="tag" :class="{active: activeId === tag.id }"
                        v-for="tag in treeList" @click="handleStock(tag)">{{ tag.typeName }}
                    <el-icon style="margin-left: 4px;"
                             @click.stop="handleCloseStockTag(tag)"><Close/></el-icon>
                  </span>
                </div>
                <div class="select-form-item" v-if="activeId !== 0">
                  <span class="label" v-if="classifyArr.length > 0">合辑分类</span>
                  <span class="tag" :class="{active: soundList.indexOf(tags.id) !== -1 }"
                        v-for="tags in classifyArr" @click="handleCombineTag(tags)">{{ tags.typeName }}
                   <el-icon style="margin-left: 4px;"
                            @click.stop="handleCloseCombineTag(tags)"><Close/></el-icon>
                  </span>
                </div>
              </el-col>
              <div class="select-form-right" @click="handleClearCheck(treeList)">
                清除全部标签
              </div>
            </el-row>
          </div>
        </div>

        <!--        音乐-->
        <div v-else-if="typeId == 2">
          <div class="select-form">
            <el-row>
              <el-col :span="24">
                <el-row :gutter="40">
                  <el-col :span="11" v-for="(item,index) in treeList" :key="index" class="select-form-col"
                          :class="'select-item' + index">
                    <div class="select-form-item">
                      <span class="label">{{ item.typeName }}</span>
                      <span class="tag" :class="{active: onCheckTag(item,tag)}" v-for="tag in item.children"
                            @click="handleCheckTag(item,tag)" :key="tag.id">{{ tag.typeName }}  <el-icon
                          style="margin-left: 4px;" @click.stop="handleCloseTag(item,tag)"><Close/></el-icon> </span>
                    </div>
                    <div class="select-more" @click="openMore(item,index)" v-if="item.children?.length > 7">
                      <template v-if="!item.openState">
                        <span>更多</span>
                        <el-icon>
                          <ArrowDown/>
                        </el-icon>
                      </template>
                      <template v-else>
                        <span>收起</span>
                        <el-icon>
                          <ArrowUp/>
                        </el-icon>
                      </template>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <div class="select-form-right" style="right: 0px;" @click="handleClearCheck(treeList)">
                清除全部标签
              </div>
            </el-row>
          </div>
        </div>

        <!--        工程-->
        <div v-else-if="typeId == 3">
          <div class="select-form">
            <el-row>
              <el-col :span="24">
                <el-row :gutter="40">
                  <el-col :span="index > 1 ? 24 : 12" v-for="(item,index) in treeList" :key="index"
                          class="select-form-col" style="height: auto">
                    <div class="select-form-item">
                      <span class="label">{{ item.typeName }}</span>
                      <span class="tag" :class="{active: onCheckTag(item,tag)}" v-for="tag in item.children"
                            @click="handleCheckTag(item,tag)" :key="tag.id">{{ tag.typeName }}  <el-icon
                          style="margin-left: 4px;" @click.stop="handleCloseTag(item,tag)"><Close/></el-icon> </span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <div class="select-form-right" style="right: 0px;" @click="handleClearCheck(treeList)">
                清除全部标签
              </div>
            </el-row>
          </div>
        </div>

        <!--        插件-->
        <div v-else-if="typeId == 4">
          <div class="select-form">
            <el-row>
              <el-col :span="24">
                <el-row :gutter="40">
                  <el-col :span="index > 1 ? 24 : 12" v-for="(item,index) in treeList" :key="index"
                          class="select-form-col" style="height: auto">
                    <div class="select-form-item">
                      <span class="label">{{ item.typeName }}</span>
                      <span class="tag" :class="{active: onCheckTag(item,tag)}" v-for="tag in item.children"
                            @click="handleCheckTag(item,tag)" :key="tag.id">{{ tag.typeName }}  <el-icon
                          style="margin-left: 4px;" @click.stop="handleCloseTag(item,tag)"><Close/></el-icon> </span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <div class="select-form-right" style="right: 0px;" @click="handleClearCheck(treeList)">
                清除全部标签
              </div>
            </el-row>
          </div>
        </div>

        <!--字体-->
        <div v-else-if="typeId == 7">
          <div class="select-form">
            <el-row :gutter="40">
              <el-col :span="22" style="height: auto">
                <div class="select-form-item">
                  <span class="label">语言</span>
                  <span class="tag" :class="{active: activeId === tag.id }"
                        v-for="tag in treeList" @click="handleStock(tag)">{{ tag.typeName }}
                    <el-icon style="margin-left: 4px;"
                             @click.stop="handleCloseStockTag(tag)"><Close/></el-icon>
                  </span>
                </div>
                <div class="select-form-item" v-if="activeId !== 0">
                  <span class="label" v-if="classifyArr.length > 0">类型</span>
                  <span class="tag" :class="{active: soundList.indexOf(tags.id) !== -1 }"
                        v-for="tags in classifyArr" @click="handleCombineTag(tags)">{{ tags.typeName }}
                   <el-icon style="margin-left: 4px;" @click.stop="handleCloseCombineTag(tags)"><Close/></el-icon>
                  </span>
                </div>
              </el-col>
              <div class="select-form-right" @click="handleClearCheck">
                清除全部标签
              </div>
            </el-row>
          </div>
        </div>

        <!--        视频-->
        <div v-else-if="typeId == 5">
          <div class="select-form">
            <el-row :gutter="40">
              <template v-for="(item,index) in videoType" :key="index">
                <el-col :span="24" class="select-form-col" style="height: auto" v-if="index === 0 " >
                  <div class="select-form-item">
                    <span class="label">{{ item.typeName }}</span>
                    <span class="tag" v-for="tag in item.children" :class="{active: videoTypes.indexOf(tag.value) !== -1}"
                          :key="tag.value" @click="handleVideoCheck(index,tag.value)">{{ tag.name }}
                      <el-icon style="margin-left: 4px;" @click.stop="handleCloseVideo(index,tag.value)"><Close/></el-icon> </span>
                  </div>
                </el-col>
                <el-col :span="24" class="select-form-col" style="height: auto"  v-if="index === 1 ">
                  <div class="select-form-item">
                    <span class="label">{{ item.typeName }}</span>
                    <span class="tag" v-for="tag in item.children" :class="{active: videoCategory.indexOf(tag.value) !== -1}"
                          :key="tag.value" @click="handleVideoCheck(index,tag.value)">{{ tag.name }}
                      <el-icon style="margin-left: 4px;" @click.stop="handleCloseVideo(index,tag.value)"><Close/></el-icon> </span>
                  </div>
                </el-col>
              </template>
              <div class="select-form-right" @click="handleClearVideo">
                清除全部标签
              </div>
            </el-row>
          </div>
        </div>

        <!--        图片-->
        <div v-else-if="typeId == 6">
          <div class="select-form">
            <el-row :gutter="40">
              <template v-for="(item,index) in  imageType" :key="item">
                <el-col :span="22" class="select-form-col" v-if="index === 0 ">
                  <div class="select-form-item">
                    <span class="label">{{ item.typeName }}</span>
                    <span class="tag" v-for="tag in item.children" @click="handleImageCheck(index,tag.value)"
                          :class="{active: imageTypes.indexOf(tag.value) !== -1}">{{ tag.name }}
                      <el-icon style="margin-left: 4px;" @click.stop="handleCloseImage(index,tag.value)"><Close/></el-icon> </span>
                  </div>
                </el-col>
                <el-col :span="24" class="select-form-col" v-else-if="index === 1">
                  <div class="select-form-item">
                    <span class="label">{{ item.typeName }}</span>
                    <span class="tag" v-for="tag in item.children" @click="handleImageCheck(index,tag.value)"
                          :class="{active: category.indexOf(tag.value) !== -1}">{{ tag.name }}
                      <el-icon style="margin-left: 4px;" @click.stop="handleCloseImage(index,tag.value)"><Close/></el-icon> </span>
                  </div>
                </el-col>
                <el-col :span="12" class="select-form-col" v-else-if="index === 3">
                  <div class="select-form-item">
                    <span class="label">{{ item.typeName }}</span>
                    <span class="tag" v-for="tag in item.children" @click="handleImageCheck(index,tag.value)"
                          :class="{active: orientations.indexOf(tag.value) !== -1}">{{ tag.name }}
                      <el-icon style="margin-left: 4px;" @click.stop="handleCloseImage(index,tag.value)"><Close/></el-icon>
                    </span>
                  </div>
                </el-col>
                <el-col :span="12" class="select-form-col" style="height: auto"  v-else-if="index === 2">
                  <div class="select-form-item" style="display: flex;flex-wrap: wrap;">
                    <span class="label">{{ item.typeName }}</span>
                    <template v-for="(tag,idx) in item.children" :key="tag">
                      <div class="dot-color"
                           :class="{active: colors.indexOf(tag.value) !== -1}"
                           @click="handleImageCheck(index,tag.value,'dot')"
                           :style="{backgroundColor: tag.color || tag.value}"
                           v-if="idx > 2">
                      </div>
                      <span v-else class="tag" :class="{active: colors.indexOf(tag.value) !== -1}"
                            @click="handleImageCheck(index,tag.value)">{{ tag.name }}
                          <el-icon style="margin-left: 4px;" @click.stop="handleCloseImage(index,tag.value)"><Close/></el-icon>
                      </span>
                    </template>
                  </div>
                </el-col>
              </template>
              <div class="select-form-right" @click="handleClearImage">
                清除全部标签
              </div>
            </el-row>
          </div>
        </div>

      </div>
    </el-col>
  </el-row>


</template>

<script setup>
import {ref, computed, defineExpose, watch} from 'vue'

const props = defineProps({
  treeList: {
    type: Array,
    default: []
  },
  total: {
    type: Number,
    default: 0
  },
  typeId: {
    type: Number,
    default: 0
  }
})


const emit = defineEmits(['onTagsChange', 'onLabsChange', 'onImageTagChange','onVideoTagChange']);
const store = useStore();
const selectedLabels = ref([]) // 已选标签
const checkLabels = ref([]) // checkbox已选标签
const checkLabelsId = ref([]) // 已选标签id集合
let labelsRes = []
watch(() => props.treeList, () => {
  const all = {
    typeName: '全部',
    id: -1,
    parentId: -1,
    children: []
  }

  if (props.typeId === 1 || props.typeId === 7) {
    props.treeList?.unshift(all)
  } else {
    props.treeList.forEach(res => {
      res.children.unshift(all)
    })
  }
  reset()
})
watch(() => props.typeId, () => {
  reset()
})

const minLeft = ref()
const classifyArr = ref([])
//checkbox改变事件
const arr1 = ref([])


// 激活选中的标签
const onCheckTag = (item, tag) => {
  return item.value && item.value.indexOf(tag.id) > -1
}

// 点击选择标签(音乐、音效）
const tagArr = ref([])//二级标签id
const tagIdArr = ref([])//选择的标签id（三级）
const handleCheckTag = (item, tag) => {
  if (tag) {
    item.value = item.value ? item.value : [];

    if (tag.id === -1) {
      labelsRes.forEach(el => {
        if (el.parentId === item.id) {
          const idx = tagIdArr.value.findIndex(e => el.id === e)
          tagIdArr.value.splice(idx, 1)
        }
      })
      if (tagArr.value.indexOf(item.id) == -1) {
        tagArr.value.push(item.id)
      }

      item.value = []
      item.value.push(tag.id)
      emit('onTagsChange', tagIdArr.value, tagArr.value)
    } else {
      if (item.value[0] === -1) item.value = []
      if (item.value.indexOf(tag.id) == -1) {
        item.value.push(tag.id)
      }
      if (tagIdArr.value.indexOf(tag.id) == -1) {
        tagIdArr.value.push(tag.id)
        labelsRes.push({id: tag.id, parentId: tag.parentId})
      }
      if (tagArr.value.indexOf(tag.parentId) > -1) {
        const idx = tagArr.value.findIndex(el => el === tag.parentId)
        tagArr.value.splice(idx, 1)
      }
      emit('onTagsChange', tagIdArr.value, tagArr.value)
    }
  } else {
    item.value = [];
  }
}


const activeId = ref(-1)
const activeId2 = ref(-1)
//音效库分类单选
const handleStock = (tag) => {
  if (tag) {
    activeId.value = tag.id
    classifyArr.value = []
    classifyArr.value = tag.children
    if (tag.id === -1) {
      classifyArr.value = []
      // emit('onLabsChange', [],[])
      emit('onTagsChange', [], [])
    } else {
      const all = {
        typeName: '全部',
        id: -1,
      }
      if (classifyArr.value[0]?.id !== -1) {
        classifyArr.value.unshift(all)
      }

      let lId = []
      lId.push(activeId.value)
      // emit('onLabsChange', lId)
      //清空三级状态
      soundList.value = []
      emit('onTagsChange', [], lId)
    }

  } else {
    activeId.value = null
    emit('onTagsChange', [], [])
  }

}
const handleCloseStockTag = (tag) => {
  activeId.value = null
  classifyArr.value = []
  emit('onTagsChange', null, null)
}

//点击合辑分类标签
const soundList = ref([-1])
const handleCombineTag = (tag) => {
  if (tag.id !== -1) {
    if (soundList.value.indexOf(-1) !== -1) {
      soundList.value.splice(soundList.value.indexOf(-1), 1)
    }
    if (soundList.value.indexOf(tag.id) == -1) {
      soundList.value.push(tag.id)
    } else {
      return
    }
    activeId2.value = tag.id
    // emit('onLabsChange', [])
    emit('onTagsChange', soundList.value, null)
  } else {
    soundList.value = [-1]
  }
}

//删除库分类标签
const handleCloseCombineTag = (tag) => {
  const index = soundList.value.indexOf(tag.id)
  if (index > -1) {
    soundList.value.splice(index, 1)
  }
  if (soundList.value?.length === 0) {
    soundList.value = []
    const arr = []
    arr.push(activeId.value)
    emit('onTagsChange', soundList.value, arr)
  } else {
    emit('onTagsChange', soundList.value, null)
  }
}


// 关闭已选标签
const handleCloseTag = (item, tag) => {
  const index = item.value.indexOf(tag.id)
  const labIdx = tagIdArr.value.indexOf(tag.id)
  const tagIdx = tagArr.value.indexOf(tag.parentId)

  if (index > -1) {
    item.value.splice(index, 1)
  }
  if (labIdx > -1) {
    const id = tagIdArr.value.splice(labIdx, 1)
    const resIndex = labelsRes.findIndex(res => {
      return res.id === id[0]
    })
    labelsRes.splice(resIndex, 1)
  }
  if (tagIdx > -1) {
    tagArr.value.splice(tagIdx, 1)
  }
  emit('onTagsChange', tagIdArr.value, tagArr.value)
}

// 去重方法
function unique(arr) {
  return arr.filter(function (item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index;
  });
}

//打开更多
const openMore = (item, index) => {
  item.openState ? item.openState : false
  item.openState = !item.openState
  const className = 'select-item' + index
  const col = document.getElementsByClassName(className)[0]
  col.style.height = col.style.height === 'auto' ? '30px' : 'auto'
}

// 清除筛选
const handleClearCheck = (tagList) => {
  if (tagList.length>0){
    for (const item of tagList) {
      item.value = [];
    }
  }
  tagIdArr.value = []
  tagArr.value = []
  soundList.value = []
  classifyArr.value = []
  activeId.value = null
  emit('onTagsChange', [], [])
}

function handleChange(e, item) {
  //存储点击前的标签
  arr1.value = selectedLabels.value || []
  //点击后的标签
  selectedLabels.value = e

  let newArr = [];
  arr1.value = Array.from(new Set(arr1.value)); // 去重
  selectedLabels.value = Array.from(new Set(selectedLabels.value)); // 去重
  newArr = arr1.value.concat(selectedLabels.value);
  //原标签集合和新标签集合的差值
  let diff = newArr.filter(x => !(arr1.value.includes(x) && selectedLabels.value.includes(x)))

  let arr = []
  arr = item.find(res => {
    return res.typeName === diff[0]
  })

  if (checkLabelsId.value?.some(res => {
    return res === arr.id;
  })) {
    checkLabelsId.value.splice(checkLabelsId.value.findIndex(res => res === arr.id), 1)
  } else {
    checkLabelsId.value.push(arr.id)
  }

  emitChange()
}

function reset() {
  selectedLabels.value = []
  checkLabelsId.value = []
  checkLabels.value = []
  tagIdArr.value = []
  tagArr.value = []
  classifyArr.value = []
  activeId.value = null
  activeId2.value = null
  labelsRes = []
}

// 清空标签
const empty = () => {
  reset()
  emitChange()
}

// 移除标签
const handleClose = (index) => {
  selectedLabels.value.splice(index, 1)
  checkLabelsId.value.splice(index, 1)
  checkLabels.value.splice(index, 1)
  emitChange()
}

function emitChange() {
  emit('onTagsChange', checkLabelsId.value)
}

/**
 * 图片(typeId=6)相关----------------
 */
const imageType = [
  {
    typeName: '分类',
    children: [
      {name: '全部', value: 'all'},
      {name: '照片', value: 'photo'},
      {name: '插画', value: 'illustration'},
      // {name: '矢量图', value: 'vector'},
    ]
  },
  {
    typeName: '类别',
    children: [
      {name: '全部', value: 'all'},
      {name: '背景', value: 'backgrounds'},
      {name: '时尚', value: 'fashion'},
      {name: '大自然', value: 'nature'},
      {name: '科学', value: 'science'},
      {name: '教育', value: 'education'},
      {name: '感情', value: 'feelings'},
      {name: '医疗', value: 'health'},
      {name: '人物', value: 'people'},
      {name: '宗教', value: 'religion'},
      {name: '地点', value: 'places'},
      {name: '动物', value: 'animals'},
      {name: '工业', value: 'industry'},
      {name: '计算机', value: 'computer'},
      {name: '食品', value: 'food'},
      {name: '体育', value: 'sports'},
      {name: '交通', value: 'transportation'},
      {name: '建筑', value: 'buildings'},
      {name: '商业', value: 'business'},
      {name: '音乐', value: 'music'},
    ]
  },
  {
    typeName: '颜色',
    children: [
      {name: '全部', value: 'all'},
      {name: '灰度', value: 'grayscale'},
      {name: '透明', value: 'transparent'},
      {name: '红', value: 'red'},
      {name: '橙', value: 'orange'},
      {name: '黄', value: 'yellow'},
      {name: '绿', value: 'green'},
      {name: '蓝绿色', value: 'turquoise'},
      {name: '蓝', value: 'blue'},
      {name: '紫', value: 'lilac',color: '#C93EF7'},
      {name: '粉', value: 'pink'},
      {name: '白', value: 'white'},
      {name: '灰', value: 'gray'},
      {name: '黑', value: 'black'},
      {name: '棕', value: 'brown', color: '#893600'},
    ]
  },
  {
    typeName: '方向',
    children: [
      {name: '全部', value: 'all'},
      {name: '水平', value: 'horizontal '},
      {name: '垂直', value: 'vertical '},
    ]
  }
]
const imageTypes = ref([])
const category = ref([])
const colors = ref([])
const orientations = ref([])
//图片标签选择
const handleImageCheck = (type, value) => {
  if (colors.value.indexOf(value) > -1){
    colors.value.splice(colors.value.findIndex(res => res === value), 1)
  }else {
  if (type === 0) {
    if (value === 'all') {
      if (imageTypes.value.indexOf(value) !== -1) {return;}
      imageTypes.value = []
      imageTypes.value.push(value)
    } else if (imageTypes.value.indexOf(value) === -1) {
      let indeAll=imageTypes.value.findIndex(res=> res==='all');
      if (indeAll!==-1){
        imageTypes.value.splice(indeAll,1)
      }
      imageTypes.value.push(value)
    } else return
  } else if (type === 1) {
    if (value === 'all') {
      if (category.value.indexOf(value) !== -1) {return;}
      category.value = []
      category.value.push(value)
    } else if (category.value.indexOf(value) === -1) {
      let indeAll=category.value.findIndex(res=> res==='all');
      if (indeAll!==-1){
        category.value.splice(indeAll,1)
      }
      category.value.push(value)
    } else return
  } else if (type === 2) {
    if (value === 'all') {
      if (colors.value.indexOf(value) !== -1) {return;}
      colors.value = []
      colors.value.push(value)
    } else if (colors.value.indexOf(value) === -1) {
      let indeAll=colors.value.findIndex(res=> res==='all');
      if (indeAll!==-1){
        colors.value.splice(indeAll,1)
      }
      colors.value.push(value)
    } else return
  } else if (type === 3) {
    if (value === 'all') {
      if (orientations.value.indexOf(value) !== -1) {return;}
      orientations.value = []
      orientations.value.push(value)
    } else {
      orientations.value.splice(0, 1)
      orientations.value.push(value)
    }
  }
  }
  const obj = {
    imageTypes: imageTypes.value[0] ==='all' ? [] :imageTypes.value ,
    category: category.value[0] ==='all' ? [] :category.value,
    colors: colors.value[0] ==='all' ? [] :colors.value,
    orientations: orientations.value[0] ==='all' ? [] :orientations.value,
  }
  emit('onImageTagChange', obj)
}
//图片标签取消
const handleCloseImage = (type, value) => {
  if (type === 0) {
    if (imageTypes.value.indexOf(value) > -1) {
      imageTypes.value.splice(imageTypes.value.findIndex(res => res === value), 1)
    } else return
  } else if (type === 1) {
    if (category.value.indexOf(value) > -1) {
      category.value.splice(category.value.findIndex(res => res === value), 1)
    } else return
  } else if (type === 2) {
    if (colors.value.indexOf(value) > -1) {
      colors.value.splice(colors.value.findIndex(res => res === value), 1)
    } else return
  } else if (type === 3) {
    orientations.value = []
  }
  const obj = {
    imageTypes: imageTypes.value[0] ==='all' ? [] :imageTypes.value ,
    category: category.value[0] ==='all' ? [] :category.value,
    colors: colors.value[0] ==='all' ? [] :colors.value,
    orientations: orientations.value[0] ==='all' ? [] :orientations.value,
  }
  emit('onImageTagChange', obj)
}
//清除全部图片标签
const handleClearImage = () => {
  imageTypes.value = []
  category.value = []
  colors.value = []
  orientations.value = []
  const obj = {
    imageTypes: [],
    category: [],
    colors: [],
    orientations: [],
  }
  emit('onImageTagChange', obj)
}

/**
 * 视频(typeId=5)相关----------------
 */
const videoType = [
  {
    typeName: '分类',
    children: [
      {name: '全部', value: 'all'},
      {name: '动画', value: 'animation'},
      {name: '短视频', value: 'film'},
    ]
  },
  {
    typeName: '类别',
    children: [
      {name: '全部', value: 'all'},
      {name: '背景', value: 'backgrounds'},
      {name: '时尚', value: 'fashion'},
      {name: '大自然', value: 'nature'},
      {name: '科学', value: 'science'},
      {name: '教育', value: 'education'},
      {name: '感情', value: 'feelings'},
      {name: '医疗', value: 'health'},
      {name: '人物', value: 'people'},
      {name: '宗教', value: 'religion'},
      {name: '地点', value: 'places'},
      {name: '动物', value: 'animals'},
      {name: '工业', value: 'industry'},
      {name: '计算机', value: 'computer'},
      {name: '食品', value: 'food'},
      {name: '体育', value: 'sports'},
      {name: '交通', value: 'transportation'},
      {name: '建筑', value: 'buildings'},
      {name: '商业', value: 'business'},
      {name: '音乐', value: 'music'},
    ]
  },
]
const videoTypes = ref([])
const videoCategory = ref([])
//视频标签选择
const handleVideoCheck = (type, value) =>{
  if (type === 0) {
    if (value === 'all') {
      if (videoTypes.value.indexOf(value) !== -1) {return;}
      videoTypes.value = []
      videoTypes.value.push(value)
    } else if (videoTypes.value.indexOf(value) === -1) {
      let indeAll=videoTypes.value.findIndex(res=> res==='all');
      if (indeAll!==-1){
        videoTypes.value.splice(indeAll,1)
      }
      videoTypes.value.push(value)
    } else return
  } else if (type === 1) {
    if (value === 'all') {
      if (videoCategory.value.indexOf(value) !== -1) {return;}
      videoCategory.value = []
      videoCategory.value.push(value)
    } else if (videoCategory.value.indexOf(value) === -1) {
      let indeAll=videoCategory.value.findIndex(res=> res==='all');
      if (indeAll!==-1){
        videoCategory.value.splice(indeAll,1)
      }
      videoCategory.value.push(value)
    } else return
  }
  changeVideoTag()
}
//视频标签取消
const handleCloseVideo = (type, value) =>{
  if (type === 0) {
    if (videoTypes.value.indexOf(value) > -1) {
      videoTypes.value.splice(videoTypes.value.findIndex(res => res === value), 1)
    } else return
  } else if (type === 1) {
    if (videoCategory.value.indexOf(value) > -1) {
      videoCategory.value.splice(videoCategory.value.findIndex(res => res === value), 1)
    } else return
  }
  changeVideoTag()
}
//清除全部视频标签
const handleClearVideo = () =>{
  videoTypes.value = []
  videoCategory.value = []
  changeVideoTag()
}

function changeVideoTag() {
  const obj = {
    videoTypes: videoTypes.value[0] ==='all' ? [] :videoTypes.value ,
    videoCategory: videoCategory.value[0] ==='all' ? [] :videoCategory.value,
  }
  emit('onVideoTagChange', obj)
}

</script>
<style scoped lang="scss">
@import "./style.scss";

.label-dropdown {
  padding: 10px 16px;
  margin-right: 8px;
  background-color: #1E1F25;
  border-radius: 10px;
  border: 1px solid #565863;
  cursor: pointer;
}

.el-dropdown .el-dropdown-link {
  font-size: 12px;
  color: #CFD2D8 !important;
}

.group {
  padding-left: 15px;
  display: grid;
  grid: 25px/3fr 3fr 3fr;
  row-gap: 10px;
  column-gap: 0px;
  max-height: 300px;

  .check {
    height: 25px;
    width: 85%;
    padding: 5px;
  }
}

.tag-item {
  margin-bottom: 8px;

}


.select-form {
  // display: flex;
  // justify-content: space-between;
  // position: relative;
  margin-bottom: -10px;
  // padding-right: 90px;
  user-select: none;
  position: relative;

  .select-form-col {
    display: flex;
    height: 30px;
    overflow: hidden;
  }

  .select-form-item {
    font-size: 14px;
    word-wrap: break-word;
    padding-left: 80px;
    margin-right: -10px;
    position: relative;

    .label {
      flex: none;
      position: absolute;
      left: 0;
      width: 70px;
      height: 23px;
      line-height: 23px;
      top: 0;
      display: block;
      // transform: translateY(-50%);
      padding-right: 10px;
      padding: 2px 0;
      padding-right: 8px;
      color: #C2C7CE;
      // margin-bottom: 10px;
      text-align: justify;
      text-align-last: justify;

      &::after {
        content: ":";
        display: inline-block;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .tag {
      padding: 2px 8px;
      border-radius: 4px;
      color: #666A7A;
      cursor: pointer;
      flex: none;
      display: inline-flex;
      align-items: center;
      margin-right: 10px;
      margin-bottom: 10px;

      &:deep(.el-icon) {
        display: none;
      }

      &:hover {
        color: #3468FE;
        background: rgba($color: #3468FE, $alpha: .2);
      }

      &.active {
        color: #3468FE;
        background: rgba($color: #3468FE, $alpha: .2);

        &:deep(.el-icon) {
          display: inline-block;
        }
      }
    }
  }

  .select-more {
    min-width: 50px;
    color: #666A7A;
    font-size: 14px;
    line-height: 25px;
    cursor: pointer;
  }

  .select-form-right {
    height: 20px;
    position: absolute;
    float: right;
    width: 90px;
    right: 20px;
    top: 0;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    color: #3468FE;
  }

  &:deep(.el-select) {
    width: 120px;
    margin-bottom: 20px;
    margin-right: 20px;

    .el-input__inner {
      border: none !important;
      height: 34px;
      line-height: 34px;
      box-shadow: inset 0px 0px 1px 0px #353741 !important;
      --el-input-bg-color: #24262F;
      --el-input-text-color: #C2C7CE;
      --el-input-border-radius: 8px;

    }
  }
}

.dot-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 2px 5px;
  cursor: pointer;
  position: relative;

  &.active {
    border: white solid 1px;

    &:after {
      position: absolute;
      content: '✔';
      left: 4px;
      font-size: 12px;
      color: white;
    }
  }
}

</style>
